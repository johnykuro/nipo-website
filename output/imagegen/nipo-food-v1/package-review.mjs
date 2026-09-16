import sharp from 'sharp';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';

const base=path.dirname(fileURLToPath(import.meta.url));
const spec=JSON.parse(await readFile(path.join(base,'prompts.json'),'utf8'));
const names=['Salmon sushi rolls','Sliced steak & flower salad','Botanical cocktail','Sesame-crusted tuna bites','Fish & avocado tartare','Glazed chicken skewers','Blue rice vegetable rolls','Passion fruit meringue'];
const placements=['Hero 1, food menu preview, Concept, social card','Hero 2, full-width menu feature, Concept','Hero 3, drinks preview, gallery rail','Gallery, starters feature, gallery rail','Gallery, food detail, gallery rail','Gallery, robata feature, gallery rail','Gallery, vegetable sushi feature','Gallery, dessert feature'];
const positions=[60,64,72,50,50,50,50,50];
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const svg=(w,h,body)=>Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${body}</svg>`);
const txt=(x,y,text,size=20,fill='#f7f1de')=>`<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" fill="${fill}">${esc(text)}</text>`;
for(const d of ['exports','previews']) await mkdir(path.join(base,d),{recursive:true});
const catalogue=[];
for(const [i,j] of spec.assets.entries()){
  const master=path.join(base,'masters',j.id+'.png');
  const data=await readFile(master), m=await sharp(data).metadata();
  const [w,h]=j.target;
  const basename=`${j.id}-${w}x${h}`;
  // Formatting only: resample to requested canvas; generated masters remain byte-for-byte intact.
  await sharp(data).resize(w,h,{fit:'cover',position:'centre'}).jpeg({quality:94,chromaSubsampling:'4:4:4'}).toFile(path.join(base,'exports',basename+'.jpg'));
  await sharp(data).resize(w,h,{fit:'cover',position:'centre'}).webp({quality:88}).toFile(path.join(base,'exports',basename+'.webp'));
  const exportMeta=await sharp(path.join(base,'exports',basename+'.webp')).metadata();
  assert.equal(exportMeta.width,w); assert.equal(exportMeta.height,h);
  assert.equal(createHash('sha256').update(data).digest('hex'),createHash('sha256').update(await readFile(j.generatedPath)).digest('hex'));
  assert.equal(createHash('sha256').update(await readFile(path.join(base,'sources',j.id+'.jpg'))).digest('hex'),createHash('sha256').update(await readFile(j.refs[0])).digest('hex'));
  catalogue.push({id:j.id,title:names[i],source:j.source,sourcePath:j.refs[0],sourceCopy:`sources/${j.id}.jpg`,master:`masters/${j.id}.png`,nativeWidth:m.width,nativeHeight:m.height,sha256:createHash('sha256').update(data).digest('hex'),exports:[`exports/${basename}.jpg`,`exports/${basename}.webp`],exportWidth:w,exportHeight:h,resampled:true,upscaled:w>m.width||h>m.height,placement:placements[i],desktopPosition:'50% 50%',mobilePosition:`${positions[i]}% 50%`,provenance:'AI-generated image based on NIPO food photography',prompt:'prompts.json'});
}

// Uncropped collection sheet: all eight masters shown in their entirety.
const sheetW=2400,sheetH=1740,composites=[];
let labels=txt(48,65,'NIPO / FOOD PHOTOGRAPHY',34,'#f0e098')+txt(48,103,'Review collection 01  /  AI-generated from the team’s food photographs',19,'#b9c0b5');
for(const [i,c] of catalogue.entries()){
  const x=48+(i%4)*588,y=150+Math.floor(i/4)*760;
  const thumb=await sharp(path.join(base,c.master)).resize(552,635,{fit:'contain',background:'#0b1612'}).png().toBuffer();
  composites.push({input:thumb,left:x,top:y});
  labels+=txt(x,y+670,`${String(i+1).padStart(2,'0')}  ${c.title}`,21)+txt(x,y+699,`${c.exportWidth} × ${c.exportHeight} export / ${c.nativeWidth} × ${c.nativeHeight} master`,15,'#b9c0b5');
}
labels+=txt(48,1700,'Warm evening light • Original food, garnish and crockery references • Review before website integration',18,'#b9c0b5');
await sharp({create:{width:sheetW,height:sheetH,channels:3,background:'#15231f'}}).composite([...composites,{input:svg(sheetW,sheetH,labels),left:0,top:0}]).png().toFile(path.join(base,'review-sheet.png'));

// Scaled crop proofs use the site's current object-fit and overlay geometry.
const logo=await readFile(path.resolve(base,'../../../public/brand/nipo-logo-compact.svg'));
async function cover(file,w,h,pos){
  const m=await sharp(file).metadata(); const scale=Math.max(w/m.width,h/m.height);
  const rw=Math.ceil(m.width*scale),rh=Math.ceil(m.height*scale);
  return sharp(file).resize(rw,rh).extract({left:Math.round((rw-w)*pos),top:Math.round((rh-h)/2),width:w,height:h}).png().toBuffer();
}
async function hero(c,mobile){
  const w=mobile?390:1440,h=mobile?844:900;
  const bg=await cover(path.join(base,c.master),w,h,mobile?parseInt(c.mobilePosition)/100:.5);
  const lw=mobile?168:225,lh=Math.round(lw*401.42/455.25),cx=mobile?195:320,top=mobile?204:287;
  const logoPng=await sharp(logo).resize(lw,lh).png().toBuffer();
  const textY=top+lh+45;
  const gradient=mobile?'<linearGradient id="v" x2="0" y2="1"><stop stop-color="#050d09" stop-opacity=".25"/><stop offset=".28" stop-color="#050d09" stop-opacity=".7"/><stop offset=".58" stop-color="#050d09" stop-opacity=".56"/><stop offset=".8" stop-color="#050d09" stop-opacity=".2"/><stop offset="1" stop-color="#050d09" stop-opacity=".8"/></linearGradient>':'<linearGradient id="v"><stop stop-color="#050d09" stop-opacity=".73"/><stop offset=".48" stop-color="#050d09" stop-opacity=".28"/><stop offset=".78" stop-color="#050d09" stop-opacity="0"/></linearGradient>';
  let overlay=`<defs>${gradient}</defs><rect width="100%" height="100%" fill="url(#v)"/>`;
  overlay+=`<g text-anchor="middle" font-family="Arial" fill="#f7f1de"><text x="${cx}" y="${textY}" font-size="${mobile?20:26}" letter-spacing="2">JAPANESE PRECISION.</text><text x="${cx}" y="${textY+38}" font-size="${mobile?20:26}" letter-spacing="2">BRAZILIAN FIRE.</text><text x="${cx}" y="${textY+79}" font-size="10">Opening 23 September 2026 · Newcastle Quayside</text><rect x="${cx-130}" y="${textY+105}" width="260" height="50" fill="#f7f1de"/><text x="${cx}" y="${textY+135}" fill="#15231f" font-size="11" letter-spacing="1">DISCOVER THE MENUS ↗</text></g>`;
  const proof=await sharp(bg).composite([{input:svg(w,h,overlay),left:0,top:0},{input:logoPng,left:Math.round(cx-lw/2),top}]).png().toBuffer();
  const name=`${c.id}-${mobile?'mobile-390x844':'desktop-1440x900'}.png`;
  await writeFile(path.join(base,'previews',name),proof);return proof;
}
const proofLayers=[];let proofLabels=txt(36,48,'NIPO / HERO CROP PROOFS',28,'#f0e098')+txt(36,80,'Approximate current website copy and overlays. Desktop 1440 × 900 / mobile 390 × 844.',17,'#b9c0b5');
for(const [i,c] of catalogue.slice(0,3).entries()){
  const y=122+i*525;
  const desk=await hero(c,false),mob=await hero(c,true);
  proofLayers.push({input:await sharp(desk).resize(720,450).toBuffer(),left:36,top:y},{input:await sharp(mob).resize(208,450).toBuffer(),left:785,top:y});
  proofLabels+=txt(36,y+480,c.title,22)+txt(785,y+480,c.mobilePosition,18,'#b9c0b5');
}
await sharp({create:{width:1040,height:1720,channels:3,background:'#15231f'}}).composite([...proofLayers,{input:svg(1040,1720,proofLabels),left:0,top:0}]).png().toFile(path.join(base,'crop-proofs.png'));
await writeFile(path.join(base,'catalogue.json'),JSON.stringify({generator:spec.generator,note:'Exports are resampled from smaller native masters, not native high-resolution generations. No website integration performed.',assets:catalogue},null,2)+'\n');
const cards=catalogue.map((c,i)=>`<article><div class="pair"><figure><img loading="lazy" src="${c.sourceCopy}" alt="Original team photo: ${esc(c.title)}"><figcaption>Team photograph</figcaption></figure><figure><a href="${c.master}"><img loading="lazy" src="${c.master}" alt="Generated review image: ${esc(c.title)}"></a><figcaption>Generated master · ${c.nativeWidth} × ${c.nativeHeight}</figcaption></figure></div><h2>${String(i+1).padStart(2,'0')} / ${esc(c.title)}</h2><p>${esc(c.placement)}</p><p class="links"><a href="${c.exports[0]}" download>JPEG ${c.exportWidth} × ${c.exportHeight}</a><a href="${c.exports[1]}" download>WebP</a><a href="${c.master}" download>Native PNG</a></p><details><summary>Source and crop guidance</summary><p>${esc(c.source)}<br>Desktop: ${c.desktopPosition}. Mobile: ${c.mobilePosition}. ${i<3?'Tall hero crops show a detail of the dish or glass; see the crop proofs before integration.':'Intended for portrait gallery and editorial frames; keep the principal food fully visible.'}</p></details></article>`).join('');
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NIPO — Food imagery review</title><style>*{box-sizing:border-box}body{margin:0;background:#15231f;color:#f7f1de;font:16px/1.6 Arial,sans-serif}main{max-width:1500px;margin:auto;padding:48px 32px}header{max-width:1000px;margin-bottom:40px}h1{font:48px/1.1 Georgia,serif}h2{font:25px Georgia,serif}a{color:#f0e098;text-underline-offset:4px}.muted,figcaption,details{color:#b9c0b5}.grid{display:grid;grid-template-columns:1fr 1fr;gap:48px 28px}article{border-top:1px solid #6b776e;padding-top:24px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:12px}figure{margin:0}figure img{width:100%;height:390px;object-fit:contain;background:#0b1612}figcaption{font-size:12px;padding-top:8px}.links{display:flex;flex-wrap:wrap;gap:18px;font-size:14px}summary{cursor:pointer}nav{display:flex;gap:24px;flex-wrap:wrap}.proof{width:100%;max-width:1040px}section{margin-top:64px}@media(max-width:850px){.grid{grid-template-columns:1fr}figure img{height:300px}main{padding:28px 16px}h1{font-size:36px}}</style><main><header><p class="muted">NIPO / REVIEW COLLECTION 01</p><h1>Your food. A warmer evening setting.</h1><p>Eight AI-generated images based on the team’s NIPO food photographs, with a consistent lighting treatment informed by the website placeholders. Review the original and generated image together.</p><p class="muted">JPEG and WebP exports are sized to 2560 × 1440 or 1600 × 2000. They are upscaled from the native masters shown below; native PNGs are preserved. This collection has not been integrated into the website.</p><nav><a href="review-sheet.png">Collection sheet</a><a href="#crops">Hero crop proofs</a><a href="README.md">Handover notes</a><a href="prompts.json">Exact prompts</a></nav></header><div class="grid">${cards}</div><section id="crops"><h2>Desktop and mobile hero crops</h2><p>Approximate existing website copy and overlays, using the proposed focal positions. Mobile crops intentionally show a detail, with some food behind the centred copy. These are review proofs, not screenshots of an integrated website.</p><a href="crop-proofs.png"><img class="proof" loading="lazy" src="crop-proofs.png" alt="Desktop and mobile hero crop proofs for sushi, steak and cocktail"></a></section></main></html>`;
await writeFile(path.join(base,'index.html'),html);
console.log(JSON.stringify({assets:catalogue.map(c=>({id:c.id,native:[c.nativeWidth,c.nativeHeight],export:[c.exportWidth,c.exportHeight]})),checks:'8 master hashes and source copies verified; 8 WebP dimensions verified; preview sheet and 6 crop proofs generated'},null,2));
