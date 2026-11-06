figma.skipInvisibleInstanceChildren=false;const page=await figma.getNodeByIdAsync(PAGE);await figma.setCurrentPageAsync(page);
const cols=await figma.variables.getLocalVariableCollectionsAsync();const byId={};for(const c of cols)for(const id of c.variableIds)byId[id]=await figma.variables.getVariableByIdAsync(id);
const C=Object.fromEntries(cols.map(c=>[c.id,c]));const theme=cols.find(c=>/theme/.test(c.name));const icx=cols.find(c=>c.name.includes('icon-context'));const IMN=Object.fromEntries(icx.modes.map(m=>[m.modeId,m.name]));const IM=Object.fromEntries(icx.modes.map(m=>[m.name,m.modeId]));
function res(v,modes){const col=C[v.variableCollectionId];const m=modes[col.id]||col.defaultModeId;let val=v.valuesByMode[m];if(val===undefined)val=Object.values(v.valuesByMode)[0];if(val&&val.type==='VARIABLE_ALIAS')return res(byId[val.id],modes);return val}
function fgName(v){let x=v;for(let i=0;i<8&&x;i++){if(/^color\/foreground\//.test(x.name))return x.name.slice(17);const val=Object.values(x.valuesByMode)[0];if(!val||val.type!=='VARIABLE_ALIAS')return null;x=byId[val.id]}return null}
const lum=c=>{const f=x=>x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4);return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b)};const cr=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)};
const paintColor=(p,modes)=>{if(p.boundVariables&&p.boundVariables.color)return res(byId[p.boundVariables.color.id],modes);return {...p.color,a:p.opacity??1}};
const bgOf=(n,modes)=>{let p=n.parent;while(p&&p.type!=='PAGE'){if('fills' in p&&Array.isArray(p.fills)&&p.visible!==false){const f=p.fills.find(x=>x.visible!==false&&x.type==='SOLID');if(f){const c=paintColor(f,modes);if((c.a??1)*(f.opacity??1)>0.5)return c}}p=p.parent}return null};
const visible=n=>{let a=n;while(a&&a.type!=='PAGE'){if(a.visible===false)return false;a=a.parent}return true};
function audit(){const out=[];for(const v of page.findAllWithCriteria({types:['VECTOR','BOOLEAN_OPERATION']})){if(!visible(v))continue;const f=Array.isArray(v.fills)&&v.fills.find(x=>x.visible!==false&&x.type==='SOLID');if(!f||!f.boundVariables||!f.boundVariables.color)continue;const fv=byId[f.boundVariables.color.id];if(!fv||fv.name!=='icon-context/foreground')continue;
 const rm=v.resolvedVariableModes||{};const mode=IMN[rm[icx.id]];if(mode==='disabled')continue;const r={};for(const tm of theme.modes){const modes={...rm,[theme.id]:tm.modeId};const bg=bgOf(v,modes)||(tm.name==='Light'?{r:1,g:1,b:1}:{r:.04,g:.06,b:.09});r[tm.name]=cr(res(fv,modes),bg)}
 if(r.Light<3||r.Dark<3)out.push({v,mode,r})}return out}
// Text colour near the icon -> icon-context mode
function textMode(scope){for(const t of scope.findAll(n=>n.type==='TEXT'&&visible(n))){const f=Array.isArray(t.fills)&&t.fills.find(x=>x.type==='SOLID'&&x.boundVariables&&x.boundVariables.color);if(!f)continue;const nm=fgName(byId[f.boundVariables.color.id]);if(nm&&IM[nm]!==undefined)return nm}return null}
let BTN=null;async function buttonMode(variantName){if(!BTN){BTN={};const s=await figma.getNodeByIdAsync('16946:473');const sd=await figma.getNodeByIdAsync('16947:1323');for(const set of [s,sd])for(const c of set.children){if(!c.name.includes('Size=md'))continue;BTN[(set===sd?'D|':'')+c.name.replace(', Size=md','')]=textMode(c)}}
 const m=variantName.match(/Hierarchy=(\w+).*State=(\w+)/);return m?BTN[`Hierarchy=${m[1]}, State=${m[2]}`]:null}
const before=audit();const log=[];const unresolved=[];
for(const {v} of before){let icon=v.parent;while(icon&&icon.type!=='INSTANCE')icon=icon.parent;if(!icon)continue;
 let host=icon.parent;while(host&&host.type!=='INSTANCE'&&host.type!=='COMPONENT'&&host.type!=='PAGE')host=host.parent;
 let variant=icon;while(variant&&!(variant.type==='COMPONENT'))variant=variant.parent;
 const scope=host&&host.type!=='PAGE'?host:variant;let want=scope?textMode(scope):null;
 if(!want&&variant&&variant.parent&&variant.parent.type==='COMPONENT_SET'&&/Button icon/.test(variant.parent.name))want=await buttonMode(variant.name);
 if(!want){const modes={...(v.resolvedVariableModes||{})};const bg=bgOf(v,{...modes,[theme.id]:theme.modes[0].modeId});want=bg&&lum(bg)<0.2?'on-solid':'quaternary'}
 try{if(icon.explicitVariableModes&&icon.explicitVariableModes[icx.id]&&host&&host.type==='INSTANCE')icon.clearExplicitVariableModeForCollection(icx)}catch(e){}
 const target=host&&host.type==='INSTANCE'?host:icon;target.setExplicitVariableModeForCollection(icx,IM[want]);
 log.push(`${variant?variant.name:'?'} / ${target.name} -> ${want}`)}
const after=audit();
const left=after.map(({v,mode,r})=>{let c=v;while(c&&c.type!=='COMPONENT'&&c.type!=='PAGE')c=c.parent;return `${c&&c.name} [${mode}] L${r.Light.toFixed(1)} D${r.Dark.toFixed(1)}`});
return {page:page.name,before:before.length,fixed:[...new Set(log)].slice(0,40),fixedCount:log.length,after:after.length,left:left.slice(0,30)};
