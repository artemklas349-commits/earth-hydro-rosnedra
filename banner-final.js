(()=>{'use strict';
function init(){
const hero=document.querySelector('.hero'),copy=hero?.querySelector('.hero-copy'),proof=hero?.querySelector('.hero-proof'),actions=hero?.querySelector('.hero-actions');
if(!hero||!copy||!proof||!actions||hero.dataset.ehClean)return false;
hero.dataset.ehClean='1';
const eyebrow=hero.querySelector('.eyebrow'),heading=hero.querySelector('h1'),lead=hero.querySelector('.hero-lead');
if(eyebrow)eyebrow.textContent='Научно-исследовательская фирма · с 1998 года';
if(heading)heading.textContent='Гидрогеология и недропользование по всей России';
if(lead)lead.textContent='Подсчёт запасов подземных вод, проекты ГИН и водозаборов, обоснование размещения попутных вод, полевые исследования и мониторинг.';
proof.innerHTML=[['25+','лет в гидрогеологии'],['686','выполненных работ'],['102','работы по подсчёту запасов']].map(d=>'<div class="proof-item"><span class="proof-num">'+d[0]+'</span><span class="proof-caption">'+d[1]+'</span></div>').join('');
if(lead)lead.after(proof);proof.after(actions);
const first=actions.querySelector('a:first-child'),second=actions.querySelector('a:nth-child(2)');
if(first){first.textContent='Услуги и решения';first.href='https://rosnedra72.ru/services/';first.target='_top'}
if(second){second.textContent='Направить запрос';second.href='https://rosnedra72.ru/contacts/';second.target='_top'}
const nav=document.querySelector('.header .nav');
if(nav)nav.innerHTML='<a href="https://rosnedra72.ru/services/">Услуги и решения</a><a href="https://rosnedra72.ru/media/">Медиа-центр</a><a href="https://rosnedra72.ru/about/">О нас</a><a href="https://rosnedra72.ru/contacts/">Контакты</a>';
const wave=document.createElement('div');wave.className='eh-water-grid';wave.setAttribute('aria-hidden','true');wave.innerHTML='<canvas></canvas>';hero.appendChild(wave);
const disclaimer=document.createElement('div');disclaimer.className='eh-map-note';disclaimer.textContent='Схематическая география работ · не точные координаты объектов';hero.appendChild(disclaimer);
water(wave);
return true}
function water(wrap){
const c=wrap.querySelector('canvas'),ctx=c.getContext('2d',{alpha:true});if(!ctx)return;
let w=1,h=1,d=1,t=0,last=0;const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
function resize(){const r=wrap.getBoundingClientRect();w=r.width;h=r.height;d=Math.min(devicePixelRatio||1,1.5);c.width=Math.ceil(w*d);c.height=Math.ceil(h*d);ctx.setTransform(d,0,0,d,0,0)}
function draw(){if(!w||!h)return;ctx.clearRect(0,0,w,h);const mobile=w<750,nx=mobile?42:105,nz=mobile?18:32;
for(let j=0;j<nz;j++){const z=j/(nz-1),width=w*(.33+.9*z);for(let i=0;i<nx;i++){
const x=(i/(nx-1)-.5)*Math.PI*4,px=(w-width)/2+width*i/(nx-1),crest=Math.sin(x*1.25-t*.6)*.22+Math.sin(x*.65+t*.37)*.3+Math.cos(x*.9+z*8+t*.4)*.13,py=h*.12+h*.75*z-crest*h*(.09+.12*z),alpha=.2+.57*z+.23*Math.max(crest,0);
ctx.fillStyle='rgba(96,202,255,'+Math.min(.94,alpha).toFixed(3)+')';ctx.beginPath();ctx.arc(px,py,(mobile?.6:.75)+z*.7,0,Math.PI*2);ctx.fill()}}}
function animate(now){requestAnimationFrame(animate);if(document.hidden||now-last<33)return;last=now;if(!still)t+=.032;draw()}
new ResizeObserver(()=>{resize();draw()}).observe(wrap);resize();draw();if(!still)requestAnimationFrame(animate)}
if(!init()){const o=new MutationObserver(()=>{if(init())o.disconnect()});o.observe(document.documentElement,{childList:true,subtree:true})}
})();