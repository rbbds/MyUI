figma.skipInvisibleInstanceChildren=false;const page=await figma.getNodeByIdAsync(PAGE);await figma.setCurrentPageAsync(page);
const cols=await figma.variables.getLocalVariableCollectionsAsync();const byId={};for(const c of cols)for(const id of c.variableIds)byId[id]=await figma.variables.getVariableByIdAsync(id);
const C=Object.fromEntries(cols.map(c=>[c.id,c]));const theme=cols.find(c=>/theme/.test(c.name));const icx=cols.find(c=>c.name.includes('icon-context'));const IMN=Object.fromEntries(icx.modes.map(m=>[m.modeId,m.name]));
function res(v,modes){const col=C[v.variableCollectionId];const m=modes[col.id]||col.defaultModeId;let val=v.valuesByMode[m];if(val===undefined)val=Object.values(v.valuesByMode)[0];if(val&&val.type==='VARIABLE_ALIAS')return res(byId[val.id],modes);return val}
const lum=c=>{const f=x=>x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4);return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b)};const cr=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)};
const paintColor=(p,modes)=>{if(p.boundVariables&&p.boundVariables.color)return res(byId[p.boundVariables.color.id],modes);return {...p.color,a:p.opacity??1}};
const bgOf=(n,modes)=>{let p=n.parent;while(p&&p.type!=='PAGE'){if('fills' in p&&Array.isArray(p.fills)&&p.visible!==false){const f=p.fills.find(x=>x.visible!==false&&x.type==='SOLID');if(f){const c=paintColor(f,modes);if((c.a??1)*(f.opacity??1)>0.5)return c}}p=p.parent}return null};
const top=n=>{let p=n,last=n;while(p&&p.type!=='PAGE'){if(p.type==='COMPONENT_SET'||(p.type==='COMPONENT'&&p.parent.type!=='COMPONENT_SET'))last=p;else if(p.type==='COMPONENT'&&p.parent.type==='COMPONENT_SET')last=p;if(p.parent&&p.parent.type==='PAGE')return {root:p,comp:last};p=p.parent}return {root:p,comp:last}};
const issues=[];let checked=0;
const vecs=page.findAllWithCriteria({types:['VECTOR','BOOLEAN_OPERATION']});
for(const v of vecs){if(!v.visible)continue;let hidden=false;let a=v.parent;while(a&&a.type!=='PAGE'){if(a.visible===false){hidden=true;break}a=a.parent}if(hidden)continue;
 const f=Array.isArray(v.fills)&&v.fills.find(x=>x.visible!==false&&x.type==='SOLID');if(!f||!f.boundVariables||!f.boundVariables.color)continue;
 const fv=byId[f.boundVariables.color.id];if(!fv||fv.name!=='icon-context/foreground')continue;checked++;
 const rm=v.resolvedVariableModes||{};const out={};
 for(const tm of theme.modes){const modes={...rm,[theme.id]:tm.modeId};const ic=res(fv,modes);const bg=bgOf(v,modes)||(tm.name==='Light'?{r:1,g:1,b:1}:{r:.04,g:.06,b:.09});out[tm.name]=cr(ic,bg)}
 if(out.Light<3||out.Dark<3){const t=top(v);const iconInst=(()=>{let p=v.parent;while(p&&p.type!=='INSTANCE')p=p.parent;return p})();issues.push({root:t.root.name,comp:t.comp.name,icon:iconInst&&iconInst.name,iconId:iconInst&&iconInst.id,mode:IMN[rm[icx.id]]||'default',L:+out.Light.toFixed(2),D:+out.Dark.toFixed(2)})}}
const grouped={};for(const i of issues){const k=i.root+' » '+i.comp;(grouped[k]??=[]).push(`${i.icon}[${i.mode}] L${i.L} D${i.D}`)}
return {page:page.name,checked,issues:issues.length,grouped};
