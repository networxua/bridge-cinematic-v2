/* Native details, actual copy remains available without JS. */
(function(){
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const stats=document.querySelector('.stats');
 if(stats&&!reduce){
  const io=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)return;io.disconnect();
   const start=performance.now(); const nums=[...stats.querySelectorAll('[data-count]')];
   function frame(t){const p=Math.min(1,(t-start)/1100),ease=1-Math.pow(1-p,3);nums.forEach(n=>n.textContent=Math.round(Number(n.dataset.count)*ease));if(p<1)requestAnimationFrame(frame)}requestAnimationFrame(frame)
  },{threshold:.35});io.observe(stats);
 }
 if(matchMedia('(min-width:801px)').matches){
  const steps=[...document.querySelectorAll('.work-step')],photos=[...document.querySelectorAll('.work-img')];
  const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting)return;const n=Number(e.target.dataset.step);steps.forEach((s,i)=>s.classList.toggle('active',i===n));photos.forEach((s,i)=>s.classList.toggle('active',i===n));document.querySelector('#photo-num').textContent='0'+(n+1)})},{rootMargin:'-35% 0px -40% 0px',threshold:0});steps.forEach(s=>io.observe(s));
 }
})();
