figma.skipInvisibleInstanceChildren=false;
const COLS=await figma.variables.getLocalVariableCollectionsAsync();const VC={};for(const c of COLS)for(const id of c.variableIds){const v=await figma.variables.getVariableByIdAsync(id);VC[v.name]=v}
const ICX=COLS.find(c=>c.name.includes('icon-context'));const IM=Object.fromEntries(ICX.modes.map(m=>[m.name,m.modeId]));
const V=n=>{const k=n.startsWith('ct/')?'component-tokens/'+n.slice(3):n.startsWith('tt/')?'typography-tokens/'+n.slice(3):n;const v=VC[k];if(!v)throw new Error('var '+k);return v};
const P=n=>figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:.5,g:.5,b:.5}},'color',V(n));
const fill=(x,n)=>{x.fills=n?[P(n)]:[]};
const stroke=(x,n,w='border/width/default',sides)=>{x.strokes=[P(n)];x.strokeAlign='INSIDE';for(const k of ['Top','Right','Bottom','Left']){const key='stroke'+k+'Weight';if(!sides||sides.includes(k))x.setBoundVariable(key,V(w));else x[key]=0}};
const pad=(x,h,v)=>{if(h){x.setBoundVariable('paddingLeft',V(h));x.setBoundVariable('paddingRight',V(h))}if(v){x.setBoundVariable('paddingTop',V(v));x.setBoundVariable('paddingBottom',V(v))}};
const gap=(x,n)=>x.setBoundVariable('itemSpacing',V(n));
const rad=(x,n)=>{for(const k of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'])x.setBoundVariable(k,V(n))};
for(const s of ['Regular','Medium','Semi Bold','Bold'])await figma.loadFontAsync({family:'Inter',style:s});
const AL=(dir,name,parent,o={})=>{const f=figma.createAutoLayout(dir,{name,...o});f.fills=[];if(parent)parent.appendChild(f);return f};
const T=(parent,chars,typo,color,name)=>{const t=figma.createText();t.fontName={family:'Inter',style:'Regular'};t.characters=chars;t.name=name||chars;for(const [k,s] of [['fontSize','font-size'],['fontFamily','font-family'],['lineHeight','line-height'],['fontWeight','font-weight']])t.setBoundVariable(k,V('tt/'+typo+'/'+s));if(color)fill(t,color);if(parent)parent.appendChild(t);return t};
const ICONS={check:'16945:5',x:'16945:10','chevron-down':'16945:16','chevron-left':'16945:24','chevron-right':'16945:28','chevrons-up-down':'16945:33',plus:'16945:40',search:'16945:51',info:'16945:59',mail:'16945:105',user:'16945:112',calendar:'16945:121',file:'16945:136','trash-2':'16945:146',settings:'16945:213',house:'16945:220',bell:'16945:227',star:'16945:233','log-out':'16945:266',menu:'16945:274',funnel:'16945:280',lock:'16945:293',layers:'16945:316','grid-2x2':'16945:324',users:'16945:333','chart-column':'16945:342',inbox:'16945:349','circle-help':'16945:98','corner-down-left':'16991:126','arrow-up':'16991:134','arrow-down':'16991:142','panel-left':'16991:150'};
const icon=async(n,size=20,name)=>{const c=await figma.getNodeByIdAsync(ICONS[n]);const i=c.createInstance();i.resize(size,size);i.name=name||n;return i};
const mode=(x,m)=>x.setExplicitVariableModeForCollection(ICX,IM[m]);
const inst=async id=>(await figma.getNodeByIdAsync(id)).createInstance();
const propKey=(node,name)=>Object.keys(node.componentProperties||{}).find(k=>k===name||k.split('#')[0]===name);
const setP=(node,name,val)=>{let k=propKey(node,name);if(k){node.setProperties({[k]:val});return true}for(const n of node.findAll(n=>n.type==='INSTANCE'&&n.isExposedInstance)){k=propKey(n,name);if(k){n.setProperties({[k]:val});return true}}throw new Error('prop '+name+' not found on '+node.name)};
const addP=(comp,name,type,def,node,field)=>{const k=comp.addComponentProperty(name,type,def);if(node)node.componentPropertyReferences={...(node.componentPropertyReferences||{}),[field]:k};return k};
const effectsOf=async(id,path)=>{let n=await figma.getNodeByIdAsync(id);if(path)n=n.findOne(x=>x.name===path);return n.effects};
const FOCUS=await effectsOf('16949:129','Field');const SHADOW_SM=await effectsOf('16969:42','Field');const SHADOW_LG=(await figma.getNodeByIdAsync('16970:604')).effects;
const mkSet=async(base,specs,setName,parent,cols)=>{const comps=[];for(const s of specs){const c=figma.createComponent();c.name=s.name;c.layoutMode='VERTICAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.fills=[];c.clipsContent=false;parent.appendChild(c);const i=base.createInstance();c.appendChild(i);try{i.isExposedInstance=true}catch(e){}if(s.fn)await s.fn(i,c);comps.push(c)}
 const set=figma.combineAsVariants(comps,parent);set.name=setName;let x=32,y=32,rowH=0;comps.forEach((c,k)=>{if(k&&k%cols===0){x=32;y+=rowH+32;rowH=0}c.x=x;c.y=y;x+=c.width+32;rowH=Math.max(rowH,c.height)});
 set.resizeWithoutConstraints(Math.max(...comps.map(c=>c.x+c.width))+32,Math.max(...comps.map(c=>c.y+c.height))+32);return set};
const isDoc=n=>n.name.startsWith('Docs / ')||n.name.startsWith('Archief')||(n.type==='SECTION'&&n.name==='Base components');
const placeBelow=(page,node)=>{const content=page.children.filter(n=>!isDoc(n)&&n!==node);node.x=0;node.y=Math.max(...content.map(n=>n.y+n.height))+120};
const putBase=(page,base)=>{let sec=page.children.find(n=>n.type==='SECTION'&&n.name==='Base components');if(!sec){sec=figma.createSection();sec.name='Base components';page.appendChild(sec);sec.resizeWithoutConstraints(432,100);sec.y=0}const kids=sec.children.filter(c=>c!==base);const y=kids.length?Math.max(...kids.map(c=>c.y+c.height))+48:48;sec.appendChild(base);base.x=32;base.y=y;const w=Math.max(sec.width,base.width+64);sec.resizeWithoutConstraints(w,y+base.height+48);sec.x=-(w+200)};
const reflowDocs=page=>{const content=page.children.filter(n=>!isDoc(n));let x=Math.max(...content.map(n=>n.x+n.width))+200;for(const d of page.children.filter(n=>n.name.startsWith('Docs / ')).sort((a,b)=>a.x-b.x)){d.x=x;d.y=0;x+=d.width+80}};
