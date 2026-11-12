// Builds the guides from docs/content/guides.mjs:
// - Storybook: src/docs/guides/<id>.mdx (sidebar: Getting started / <title>)
// - Figma: docs/figma-payload/guides.js (run with use_figma: builds the page "📖 How to use")
import { mkdirSync, writeFileSync } from 'node:fs';
import { guides, figmaChangelog } from '../../docs/content/guides.mjs';

const CODEISH = /(--[a-z0-9*-]+|data-[a-z]+="[^"]*"|<html>|locale="[^"]*"|@?[\w./-]+\.(?:css|tsx|json|fig|md|mdx)\b|node_modules\/[\w@/.-]+|↳ [a-z-]+)/g;
const esc = (t) => t.split(CODEISH).map((part, i) => (i % 2 ? '`' + part + '`' : part.replace(/([<>{}])/g, '\\$1'))).join('');

function mdx(g, order) {
  const out = [`import { Meta } from '@storybook/addon-docs/blocks';`, '', `<Meta title="Getting started/${g.title}" />`, '', `{/* Generated from docs/content/guides.mjs by scripts/docs/build-guides.mjs. Do not edit. */}`, '', `# ${g.title}`, '', esc(g.intro), ''];
  for (const s of g.sections) {
    out.push(`## ${s.heading}`, '');
    const code = () => out.push('```' + (/import|export|npm/.test(s.code) ? (s.code.startsWith('npm') ? 'bash' : 'tsx') : 'css'), s.code, '```', '');
    if (s.code && s.codeFirst) code();
    for (const p of s.paragraphs ?? []) out.push(esc(p), '');
    if (s.steps) { s.steps.forEach((t, i) => out.push(`${i + 1}. ${esc(t)}`)); out.push(''); }
    if (s.bullets) { s.bullets.forEach((t) => out.push(`- ${esc(t)}`)); out.push(''); }
    if (s.code && !s.codeFirst) code();
    if (s.table) {
      // HTML table: Storybook MDX has no GFM tables.
      const cell = (t) => t.replace(/[<>{}&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '{': '&#123;', '}': '&#125;', '&': '&amp;' })[c]);
      out.push('<table>', '  <thead><tr>' + s.table.head.map((h) => `<th scope="col">${cell(h)}</th>`).join('') + '</tr></thead>', '  <tbody>');
      s.table.rows.forEach((r) => out.push('    <tr>' + r.map((c, i) => (i ? `<td>${cell(c)}</td>` : `<th scope="row">${cell(c)}</th>`)).join('') + '</tr>'));
      out.push('  </tbody>', '</table>', '');
    }
    if (s.note) out.push(`> ${esc(s.note)}`, '');
  }
  return out.join('\n');
}

mkdirSync('src/docs/guides', { recursive: true });
guides.forEach((g, i) => writeFileSync(`src/docs/guides/${g.id}.mdx`, mdx(g, i)));

// Figma: one page with a frame per guide.
mkdirSync('docs/figma-payload', { recursive: true });
const data = JSON.stringify(guides);
const version = JSON.parse((await import('node:fs')).readFileSync('package.json', 'utf8')).version;
writeFileSync('docs/figma-payload/guides.js', `const G=${data},CL=${JSON.stringify(figmaChangelog)},VERSION=${JSON.stringify(version)};
const F={reg:{family:'Inter',style:'Regular'},semi:{family:'Inter',style:'Semi Bold'},bold:{family:'Inter',style:'Bold'},mono:{family:'Roboto Mono',style:'Regular'}};
const fonts=await figma.listAvailableFontsAsync(); if(!fonts.some(f=>f.fontName.family==='Roboto Mono'))F.mono=F.reg;
for(const f of Object.values(F)) await figma.loadFontAsync(f);
const vars=await figma.variables.getLocalVariablesAsync(); const V=n=>vars.find(v=>v.name==='base-tokens/'+n);
const paint=(n,c)=>{const v=V(n);const p={type:'SOLID',color:c};return v?figma.variables.setBoundVariableForPaint(p,'color',v):p;};
const C={t1:()=>paint('color/foreground/primary',{r:.06,g:.09,b:.16}),t2:()=>paint('color/foreground/secondary',{r:.3,g:.33,b:.4}),t3:()=>paint('color/foreground/tertiary',{r:.4,g:.43,b:.5}),brand:()=>paint('color/foreground/brand',{r:.3,g:.3,b:.9}),s1:()=>paint('color/surface/primary',{r:1,g:1,b:1}),s2:()=>paint('color/surface/secondary',{r:.97,g:.97,b:.98}),b:()=>paint('color/border/secondary',{r:.9,g:.9,b:.92})};
const W=640;
const txt=(parent,s,{font=F.reg,size=15,color=C.t2(),lh=150,fill=true}={})=>{const t=figma.createText();t.fontName=font;t.characters=s;t.fontSize=size;t.lineHeight={unit:'PERCENT',value:lh};t.fills=[color];parent.appendChild(t);t.textAutoResize='HEIGHT';if(fill)t.layoutSizingHorizontal='FILL';return t;};
const col=(parent,gap,name)=>{const f=figma.createAutoLayout('VERTICAL',{name,itemSpacing:gap});f.fills=[];parent.appendChild(f);f.layoutSizingHorizontal='FILL';return f;};
const list=(parent,items,num)=>{const l=col(parent,6,num?'Steps':'List');items.forEach((it,i)=>{const r=figma.createAutoLayout('HORIZONTAL',{name:'Item',itemSpacing:8});r.fills=[];l.appendChild(r);r.layoutSizingHorizontal='FILL';txt(r,num?(i+1)+'.':'•',{color:C.t3(),fill:false});txt(r,it);});};
let page=figma.root.children.find(p=>p.name==='📖 How to use');
if(!page){page=figma.createPage();page.name='📖 How to use';const ci=figma.root.children.findIndex(p=>p.name==='_Cover');figma.root.insertChild(ci>=0?ci+1:1,page);}
await page.loadAsync();
for(const n of [...page.children]) if(n.name.startsWith('Guide / ')||n.name==='How to use / Header') n.remove();
const head=figma.createAutoLayout('VERTICAL',{name:'How to use / Header',itemSpacing:8});head.fills=[];page.appendChild(head);head.resize(W*3+160,10);head.primaryAxisSizingMode='AUTO';head.counterAxisSizingMode='FIXED';
txt(head,'MyUI · version '+VERSION,{font:F.semi,size:14,color:C.brand()});
txt(head,'How to use',{font:F.bold,size:56,color:C.t1(),lh:110});
txt(head,'Start here. Pick a style and a theme, use the components from the Assets panel, and try them in the Example frames. The same guides are in Storybook under Getting started.',{size:18});
head.x=0;head.y=0;const made=[head.id];let x=0;
for(const g of G){const f=figma.createAutoLayout('VERTICAL',{name:'Guide / '+g.title,itemSpacing:28});page.appendChild(f);
 f.paddingLeft=f.paddingRight=f.paddingTop=f.paddingBottom=48;f.cornerRadius=16;f.fills=[C.s1()];f.strokes=[C.b()];f.strokeWeight=1;f.resize(W,100);f.primaryAxisSizingMode='AUTO';f.counterAxisSizingMode='FIXED';
 txt(f,g.title,{font:F.bold,size:32,color:C.t1(),lh:120});txt(f,g.intro,{size:17});
 for(const s of g.sections){const sec=col(f,10,s.heading);txt(sec,s.heading,{font:F.semi,size:20,color:C.t1(),lh:130});
  const code=()=>{const b=figma.createAutoLayout('VERTICAL',{name:'Code'});b.paddingLeft=b.paddingRight=b.paddingTop=b.paddingBottom=16;b.cornerRadius=8;b.fills=[C.s2()];sec.appendChild(b);b.layoutSizingHorizontal='FILL';txt(b,s.code,{font:F.mono,size:13,color:C.t1()});};
  if(s.code&&s.codeFirst) code();
  for(const p of s.paragraphs??[]) txt(sec,p);
  if(s.steps) list(sec,s.steps,true); if(s.bullets) list(sec,s.bullets,false);
  if(s.code&&!s.codeFirst) code();
  if(s.table){const t=col(sec,0,'Table');t.strokes=[C.b()];t.strokeWeight=1;t.cornerRadius=8;t.clipsContent=true;
   [s.table.head,...s.table.rows].forEach((r,i)=>{const row=figma.createAutoLayout('HORIZONTAL',{name:i?'Row':'Header',itemSpacing:12});row.paddingLeft=row.paddingRight=12;row.paddingTop=row.paddingBottom=8;row.fills=i?[]:[C.s2()];t.appendChild(row);row.layoutSizingHorizontal='FILL';
    r.forEach(c=>{const tt=txt(row,c,{font:i?F.reg:F.semi,size:13,color:i?C.t2():C.t1(),fill:false});tt.layoutGrow=1;tt.layoutSizingHorizontal='FILL';});});}
  if(s.note) txt(sec,s.note,{size:14,color:C.t3()});}
 f.x=x;f.y=head.height+48;x+=W+80;made.push(f.id);}
// Changelog page
const clp=figma.root.children.find(p=>p.name==='📝 Changelog');
if(clp){await clp.loadAsync();for(const n of [...clp.children]) if(n.name.startsWith('Changelog / ')) n.remove();
 let y=0;for(const r of CL){const f=figma.createAutoLayout('VERTICAL',{name:'Changelog / '+r.version,itemSpacing:16});clp.appendChild(f);
  f.paddingLeft=f.paddingRight=f.paddingTop=f.paddingBottom=48;f.cornerRadius=16;f.fills=[C.s1()];f.strokes=[C.b()];f.strokeWeight=1;f.resize(W,100);f.primaryAxisSizingMode='AUTO';f.counterAxisSizingMode='FIXED';
  txt(f,'Version '+r.version,{font:F.bold,size:32,color:C.t1(),lh:120});list(f,r.items,false);f.x=0;f.y=y;y+=f.height+48;made.push(f.id);}}
return {page:page.id,made};
`);
console.log(`guides: ${guides.map((g) => g.id).join(', ')}`);
