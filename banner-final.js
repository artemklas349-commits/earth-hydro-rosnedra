/* Earth Hydro / Rosnedra: one responsive hero controller + one wave layer.
   No KMZ coordinates or external telemetry are used here. */
(() => {
  'use strict';
  if (new URLSearchParams(location.search).has('embed')) {
    document.documentElement.classList.add('eh-embedded');
  }
  function setupHero() {
    const hero=document.querySelector('.hero');
    if (!hero || hero.dataset.ehReady === '1') return false;
    const copy=hero.querySelector('.hero-copy');
    const lead=hero.querySelector('.hero-lead');
    const proof=hero.querySelector('.hero-proof');
    const actions=hero.querySelector('.hero-actions');
    const heading=hero.querySelector('h1');
    const eyebrow=hero.querySelector('.eyebrow');
    if (!copy||!lead||!proof||!actions||!heading||!eyebrow) return false;
    hero.dataset.ehReady='1';
    const brand=document.querySelector('.header .brand');
    if(brand && !brand.querySelector('.eh-official-logo')){
      const img=document.createElement('img');
      img.className='eh-official-logo';img.alt='Р.ОС.НЕДРА';img.onerror=()=>img.remove();img.src='./rosnedra-logo.svg';
      brand.prepend(img);
    }
    eyebrow.textContent='Научно-исследовательская фирма · с 1998 года';
    heading.textContent='Гидрогеология и недропользование по всей России';
    lead.textContent='Подсчёт запасов подземных вод, проекты ГИН и водозаборов, обоснование размещения попутных вод, полевые исследования и мониторинг.';
    proof.innerHTML=[
      ['25+','лет в гидрогеологии'],
      ['686','выполненных работ'],
      ['102','работы по подсчёту запасов']
    ].map(([number,label])=>'<div class="proof-item"><span class="proof-num">'+number+'</span><span class="proof-caption">'+label+'</span></div>').join('');
    lead.after(proof);proof.after(actions);
    const first=actions.querySelector('a:first-child'),second=actions.querySelector('a:nth-child(2)');
    if(first){first.textContent='Услуги и решения';first.href='https://rosnedra72.ru/services/';first.target='_top';first.rel='noopener'}
    if(second){second.textContent='Направить запрос';second.href='https://rosnedra72.ru/contacts/';second.target='_top';second.rel='noopener'}
    const nav=document.querySelector('.header .nav');
    if(nav){
      nav.innerHTML='<a href="https://rosnedra72.ru/services/">Услуги и решения</a><a href="https://rosnedra72.ru/media/">Медиа-центр</a><a href="https://rosnedra72.ru/about/">О нас</a><a href="https://rosnedra72.ru/contacts/">Контакты</a>';
    }
    const wave=document.createElement('div');wave.className='eh-water-grid';wave.setAttribute('aria-hidden','true');
    wave.innerHTML='<canvas></canvas>';hero.appendChild(wave);
    startWave(wave);
    return true;
  }
  function startWave(layer) {
    const canvas=layer.querySelector('canvas');
    const ctx=canvas.getContext('2d',{alpha:true,desynchronized:true});
    if(!ctx)return;
    const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w=1,h=1,dpr=1,seconds=0,frameId=0,last=0,visible=true;
    function resize(){
      const bounds=layer.getBoundingClientRect();
      w=Math.max(1,bounds.width);
      h=Math.max(1,bounds.height);
      dpr=Math.min(window.devicePixelRatio||1,1.5);
      const cw=Math.round(w*dpr),ch=Math.round(h*dpr);
      if(canvas.width!==cw||canvas.height!==ch){canvas.width=cw;canvas.height=ch}
      ctx.setTransform(dpr,0,0,dpr,0,0);
      paint();
    }
    function paint(){
      ctx.clearRect(0,0,w,h);
      const mobile=w<760;
      const cols=mobile?52:122,rows=mobile?22:36;
      for(let row=0;row<rows;row++){
        const perspective=row/(rows-1);
        const depth=Math.pow(perspective,1.15);
        const yBase=h*(.18+.85*depth);
        const span=w*(.42+1.03*depth);
        for(let col=0;col<cols;col++){
          const u=col/(cols-1),distance=Math.abs(u-.5)*2;
          const x=w*.5+(u-.5)*span;
          if(x<0||x>w)continue;
          const crest=Math.sin(u*10.8-seconds*.36+depth*1.1)*.64
             +Math.sin(u*19+seconds*.48-depth*2.8)*.27
             +Math.cos(u*6.6+seconds*.23)*.09;
          const y=yBase-h*(.075+.095*depth)*crest;
          if(y<0||y>h)continue;
          const edge=Math.max(0,Math.min(1,(1-distance)/.16));
          const depthAlpha=(.16+.43*Math.pow(depth,.65));
          const alpha=Math.max(0,Math.min(.67,edge*depthAlpha));
          const size=(mobile?.43:.52)+depth*(mobile?.32:.47);
          ctx.beginPath();
          ctx.arc(x,y,size,0,Math.PI*2);
          ctx.fillStyle='rgba(104,193,251,'+alpha.toFixed(3)+')';
          ctx.fill();
        }
      }
    }
    function tick(now){
      frameId=requestAnimationFrame(tick);
      if(!visible||document.hidden||now-last<48)return;
      const dt=last?Math.min(.07,(now-last)/1000):.048;
      last=now;
      seconds+=dt;
      paint();
    }
    if('ResizeObserver' in window)new ResizeObserver(resize).observe(layer);
    else window.addEventListener('resize',resize);
    if('IntersectionObserver' in window){
      new IntersectionObserver(entries=>{visible=entries[0].isIntersecting},{threshold:0}).observe(layer);
    }
    resize();
    if(!reduceMotion)frameId=requestAnimationFrame(tick);
    window.addEventListener('pagehide',()=>cancelAnimationFrame(frameId),{once:true});
  }
  if (!setupHero()){
    const observer=new MutationObserver(()=>{if(setupHero())observer.disconnect()});
    observer.observe(document.documentElement,{subtree:true,childList:true});
  }
})();
