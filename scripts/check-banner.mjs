import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
let failed=0; const check=(value,label)=>{console.log((value?'PASS: ':'FAIL: ')+label);if(!value)failed++};
const globe=fs.readFileSync('assets/earth-globe-D0FIT9MX.js','utf8');
const bundle=fs.readFileSync('assets/index-Bl0ZrwiU.js','utf8');
const script=fs.readFileSync('banner-final.js','utf8');
const css=fs.readFileSync('banner-final.css','utf8');
const html=fs.readFileSync('index.html','utf8');
for(const p of ['assets/earth-globe-D0FIT9MX.js','assets/index-Bl0ZrwiU.js','banner-final.js']) {
 const r=spawnSync(process.execPath,['--check',p],{encoding:'utf8'});
 check(r.status===0,'JavaScript syntax '+p);
 if(r.status!==0)console.error(r.stderr);
}
for(const p of ['earth_atmos_2048.jpg','earth_normal_2048.jpg','earth_specular_2048.jpg','earth_clouds_1024.png'])check(fs.existsSync('textures/'+p),'Texture '+p);
check(html.includes('banner-final.css')&&html.includes('banner-final.js'),'Page loads styles and scripts');
check(bundle.includes('earth-globe-D0FIT9MX.js'),'App loads globe');
check(globe.includes('Math.min(1.56,b.rotation.x+d)'),'Full vertical rotation');
check(globe.includes('const activePointers=new Map()'),'Two-finger navigation');
check(globe.includes("className='eh-globe-tools'"),'Control toolbar');
check(globe.includes('if(p.z<(1.48*1.48)/U.position.z+.018)return;'),'Front-side marker hit testing');
check(globe.includes('const geoArcGroups=geoLinks.map'),'Dotted connections');
check(!globe.includes('Условная зона присутствия · без координат объектов'),'No prototype marker labels');
check(!script.includes("note.className='eh-map-note'"),'No prototype disclaimer');
check(css.includes('.eh-globe-tools')&&css.includes('max-height:none'),'Full-height layout');
const match=globe.match(/const kmzDots=(\[[^\n]+\]);geoDots\.push\(\.\.\.kmzDots\)/);
check(Boolean(match),'KMZ input embedded');
if(match){
 let points=[];try{points=JSON.parse(match[1])}catch(e){console.error(e);failed++}
 check(points.length===32,'32 user-approved points present');
 check(points.every(v=>Array.isArray(v)&&v.length===2&&v[0]>=-90&&v[0]<=90&&v[1]>=-180&&v[1]<=180),'Coordinate ranges valid');
 check(points.some(v=>v[1]<-175),'Date line longitude handled');
}
console.log(failed?'Quality checks failed: '+failed:'All static quality checks passed');
process.exitCode=failed?1:0;
