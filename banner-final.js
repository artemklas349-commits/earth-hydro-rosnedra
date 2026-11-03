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
    const note=document.createElement('div');note.className='eh-map-note';
    note.textContent='География работ · названия объектов не раскрываются';hero.appendChild(note);
    startWave(wave);
    return true;
  }
  function startWave(layer) {
    const canvas=layer.querySelector('canvas'),ctx=canvas.getContext('2d',{alpha:true});
    if(!ctx)return;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width=1,height=1,time=0,raf=0,last=0,visible=true;
    function resize() {
      const box=layer.getBoundingClientRect();
      width=Math.max(1,box.width);height=Math.max(1,box.height);
      const dpr=Math.min(1.5,window.devicePixelRatio||1);
      canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);draw();
    }
    function draw() {
      ctx.clearRect(0,0,width,height);
      const mobile=width<760;
      const cols=mobile?45:122,rows=mobile?24:42;
      const center=width*.50;
      for(let row=0;row<rows;row++){
        const depth=row/(rows-1);
        const spread=width*(.30+depth*1.20);
        const baseline=height*(.14+Math.pow(depth,1.55)*.88);
        const fade=Math.pow(depth,.53);
        for(let col=0;col<cols;col++){
          const u=col/(cols-1),x=center+(u-.5)*spread;
          const cycle=u*Math.PI*5.6;
          const waveA=Math.sin(cycle*.9-time*.50+depth*.65);
          const waveB=Math.cos(cycle*1.45+time*.32-depth*2.0);
          const swell=(waveA*.6+waveB*.4);
          const y=baseline-swell*height*(.10+.085*depth);
          const softEdge=Math.max(0,Math.min(1,(.5-Math.abs(u-.5))/.09));
          const alpha=Math.max(0,Math.min(.77,(0.17+fade*.54)*softEdge));
          const radius=(mobile?.48:.55)+(mobile?.44:.53)*depth;
          if(y<0||y>height)continue;
          ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);
          ctx.fillStyle='rgba(105,204,255,'+alpha.toFixed(3)+')';ctx.fill();
        }
      }
    }
    function animate(now){
      raf=requestAnimationFrame(animate);
      if(!visible||document.hidden||now-last<40)return;
      last=now;time+=.033;draw();
    }
    if('ResizeObserver' in window)new ResizeObserver(resize).observe(layer);
    else window.addEventListener('resize',resize);
    if('IntersectionObserver' in window)new IntersectionObserver(e=>{visible=e[0].isIntersecting}).observe(layer);
    resize();if(!reduced)raf=requestAnimationFrame(animate);
    window.addEventListener('pagehide',()=>cancelAnimationFrame(raf),{once:true});
  }
  if (!setupHero()){
    const observer=new MutationObserver(()=>{if(setupHero())observer.disconnect()});
    observer.observe(document.documentElement,{subtree:true,childList:true});
  }
})();
