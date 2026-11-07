/* Exact deterministic review master, 12fps web samples. Video + STILL pan/zoom.
   Cross-dissolves are baked into the review master; NO fade-to-black or JS morph. */
(function(){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||!window.gsap||!window.ScrollTrigger)return;
 const phone=matchMedia('(max-width:800px)').matches,canvas=document.querySelector('#view'),ctx=canvas.getContext('2d',{alpha:false});if(!ctx)return;
 gsap.registerPlugin(ScrollTrigger);document.documentElement.classList.add('scrub');
 const N=170,base=phone?'frames/m/':'frames/',cache=new Map(),pending=new Set(),queue=[];
 let active=0,target=0,shown=0,raf=0,last=-1;
 function ask(i,priority=false){if(i<0||i>=N||cache.has(i)||pending.has(i))return;pending.add(i);priority?queue.unshift(i):queue.push(i);pump()}
 function pump(){while(active<(phone?3:4)&&queue.length){const i=queue.shift();active++;const im=new Image();im.decoding='async';im.onload=()=>{cache.set(i,im);pending.delete(i);active--;for(const k of cache.keys())if(cache.size>(phone?20:26)&&Math.abs(k-Math.round(target*(N-1)))>8)cache.delete(k);last=-1;wake();pump()};im.onerror=()=>{pending.delete(i);active--;pump()};im.src=base+String(i+1).padStart(3,'0')+'.webp'}}
 function near(i){ask(i,true);for(let d=1;d<=4;d++){ask(i+d);ask(i-d)}}
 function nearest(i){if(cache.has(i))return cache.get(i);for(let d=1;d<12;d++){const im=cache.get(i-d)||cache.get(i+d);if(im)return im}return null}
 function blend(a,b,t){return a+(b-a)*Math.min(1,Math.max(0,t))}
 function focal(p){if(p<110/340)return .63;if(p<120/340)return blend(.63,.72,(p*340-110)/10);if(p<220/340)return .72;if(p<230/340)return blend(.72,.94,(p*340-220)/10);return .94}
 function draw(im){const r=canvas.getBoundingClientRect(),dpr=Math.min(phone?1.5:2,devicePixelRatio||1),cw=Math.round(r.width*dpr),ch=Math.round(r.height*dpr);if(canvas.width!==cw||canvas.height!==ch){canvas.width=cw;canvas.height=ch}let dh=ch,dw=dh*im.naturalWidth/im.naturalHeight;if(dw<cw){dw=cw;dh=dw*im.naturalHeight/im.naturalWidth}ctx.drawImage(im,(cw-dw)*(phone?focal(shown):.5),(ch-dh)*.5,dw,dh);document.querySelector('#poster').classList.add('is-off')}
 const beats=[...document.querySelectorAll('.beat')],ranges=[[-.1,0,.09,.14],[.13,.18,.28,.325],[.35,.39,.46,.50],[.50,.54,.61,.65],[.68,.73,.80,.85],[.84,.89,1.2,1.3]];
 function env(p,w){return p<=w[0]||p>=w[3]?0:p<w[1]?(p-w[0])/(w[1]-w[0]):p<=w[2]?1:1-(p-w[2])/(w[3]-w[2])}
 function render(){const i=Math.round(shown*(N-1));near(i);if(i!==last){const im=nearest(i);if(im){draw(im);last=i}}document.querySelector('#bar').style.transform='scaleX('+shown+')';beats.forEach((b,j)=>{const o=env(shown,ranges[j]);b.style.opacity=o;b.style.visibility=o>.01?'visible':'hidden';b.style.transform='translateY('+((1-o)*16)+'px)';b.inert=o<.5})}
 function tick(){raf=0;shown+=(target-shown)*(phone?.32:.22);if(Math.abs(target-shown)<.0003)shown=target;render();if(shown!==target)wake()}
 function wake(){if(!raf&&!document.hidden)raf=requestAnimationFrame(tick)}
 ScrollTrigger.create({trigger:'#story',start:'top top',end:phone?'+=450%':'+=520%',pin:'.stage',anticipatePin:1,onUpdate:s=>{target=s.progress;wake()}});
 addEventListener('resize',()=>{last=-1;wake()});document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else wake()});near(0);wake();window.__bridgeStory={progress:()=>shown,loaded:()=>cache.size};
})();
