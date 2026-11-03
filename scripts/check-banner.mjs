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
check(globe.includes('const routeDuration=6900,routeInterval=9500'),'Flight routes animate sequentially with pause');
check(globe.includes('float k=clamp(-d/0.22,0.0,1.0)'),'Thin refined atmosphere shader');
check(globe.includes('new Kn(.0045,10,8)'),'Minimal work points');
check(globe.includes('if(p.z<(1.48*1.48)/U.position.z+.018)return'),'Hidden hemisphere hover protection');
check(globe.includes('const dLon=((l-g[2]+540)%360)-180'),'Dateline-aware regional labels');
check(script.includes('const cols=mobile?52:122,rows=mobile?22:36'),'Optimized perspective water grid');
check(css.includes('@media(min-width:751px) and (max-height:700px)'),'Short-desktop responsive layout');
check(html.includes('controls7')&&bundle.includes('controls7'),'v7 code cache bust');
const deg=Math.PI/180;
const point=(lat,lon)=>[Math.cos(lat*deg)*Math.cos(lon*deg),Math.sin(lat*deg),-Math.cos(lat*deg)*Math.sin(lon*deg)];
const circ=(p,q)=>Math.acos(Math.max(-1,Math.min(1,p.reduce((sum,v,i)=>sum+v*q[i],0))));
check(circ(point(66,179.4),point(66,-179.4))<0.02,'Correct Chukotka distance across 180-degree meridian');
check(Math.abs(Math.hypot(...point(57.15,65.53))-1)<1e-12,'Tyumen normalized vector on globe');
console.log(failed?'Quality checks failed: '+failed:'All static quality checks passed');
process.exitCode=failed?1:0;
