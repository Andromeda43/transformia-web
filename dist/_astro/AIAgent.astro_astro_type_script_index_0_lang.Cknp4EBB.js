document.addEventListener("DOMContentLoaded",()=>{const B=document.getElementById("intelligentAgent"),T=document.getElementById("agentDirection"),g=document.getElementById("neuralConnections"),w=document.getElementById("plannedPathContainer"),N=document.querySelectorAll(".interaction-node"),P=document.querySelectorAll(".particle"),k=document.getElementById("processingMetric"),D=document.getElementById("confidenceMetric"),I=document.getElementById("tasksMetric"),Y=document.getElementById("consoleText1"),z=document.getElementById("consoleText2"),E=document.getElementById("consoleText3");let c=50,r=50,d=0,h=0,L=.02,m=.5,M=Math.random()*80+10,y=Math.random()*80+10;const X=[];function q(){if(!g)return;const n="http://www.w3.org/2000/svg",t=document.createElementNS(n,"svg");t.setAttribute("width","100%"),t.setAttribute("height","100%"),g&&g.appendChild(t),N.forEach(e=>{const s=e.getBoundingClientRect(),i=g&&g.getBoundingClientRect()||{left:0,top:0,width:window.innerWidth,height:window.innerHeight},a=(s.left+s.width/2-i.left)/i.width*100,l=(s.top+s.height/2-i.top)/i.height*100;X.push({x:a,y:l})});function o(){for(;t.firstChild;)t.removeChild(t.firstChild);const e=g.offsetWidth,s=g.offsetHeight,i=c*e/100,a=r*s/100;X.forEach((l,C)=>{const f=l.x*e/100,A=l.y*s/100,b=f-i,u=A-a,$=Math.sqrt(b*b+u*u);if($<300){const x=1-$/300,p=document.createElementNS(n,"line");if(p.setAttribute("x1",i.toString()),p.setAttribute("y1",a.toString()),p.setAttribute("x2",f.toString()),p.setAttribute("y2",A.toString()),p.setAttribute("stroke",`rgba(176, 66, 255, ${x*.7})`),p.setAttribute("stroke-width","1"),t.appendChild(p),Math.random()>.7){const v=document.createElementNS(n,"circle");v.setAttribute("r","3"),v.setAttribute("fill","#ffffff");const S=document.createElementNS(n,"animateMotion");S.setAttribute("path",`M${i},${a} L${f},${A}`),S.setAttribute("dur",`${Math.random()*1.5+.5}s`),S.setAttribute("repeatCount","1"),v.appendChild(S),t.appendChild(v)}}})}setInterval(o,300)}function H(){if(!w)return;const n="http://www.w3.org/2000/svg",t=document.createElementNS(n,"svg");t.setAttribute("width","100%"),t.setAttribute("height","100%"),w.appendChild(t);const o=document.createElementNS(n,"path");o.setAttribute("fill","none"),o.setAttribute("stroke","rgba(176, 66, 255, 0.4)"),o.setAttribute("stroke-width","2"),o.setAttribute("stroke-dasharray","5,3");const e=[],s=20;function i(){if(!w)return;const a=w.offsetWidth,l=w.offsetHeight,C=c*a/100,f=r*l/100,A=M*a/100,b=y*l/100;if(e.push({x:C,y:f}),e.length>s&&e.shift(),e.length>1){const u=document.createElementNS(n,"path");let $=`M ${e[0].x} ${e[0].y}`;for(let x=1;x<e.length;x++)$+=` L ${e[x].x} ${e[x].y}`;for(u.setAttribute("d",$),u.setAttribute("fill","none"),u.setAttribute("stroke","rgba(100, 200, 255, 0.4)"),u.setAttribute("stroke-width","2");t.firstChild;)t.removeChild(t.firstChild);t.appendChild(u),(A!==C||b!==f)&&(o.setAttribute("d",`M ${C} ${f} L ${A} ${b}`),t.appendChild(o))}}setInterval(i,100)}function R(){if(!B||!T)return;function n(){const t=M-c,o=y-r;Math.random()<.01?(d+=(Math.random()-.5)*m,h+=(Math.random()-.5)*m):(d+=t*L,h+=o*L);const e=Math.sqrt(d*d+h*h);e>m&&(d=d/e*m,h=h/e*m),d*=.98,h*=.98,c+=d,r+=h,c=Math.max(10,Math.min(90,c)),r=Math.max(10,Math.min(90,r)),Math.sqrt((M-c)*(M-c)+(y-r)*(y-r))<2&&(M=Math.random()*80+10,y=Math.random()*80+10);const i=B;i.style.left=`${c}%`,i.style.top=`${r}%`;const a=T,l=Math.atan2(o,t)*180/Math.PI;a.style.transform=`translateY(-50%) rotate(${l}deg)`;const C=Math.min(1,e/m);a.style.opacity=C.toString(),W(),requestAnimationFrame(n)}n()}function W(){P.length&&P.forEach((n,t)=>{const o=n,e=t/P.length*Math.PI*2,s=30+Math.sin(Date.now()*.003+t)*10,i=Math.cos(e+Date.now()*.001)*s,a=Math.sin(e+Date.now()*.001)*s;o.style.left=`calc(50% + ${i}px)`,o.style.top=`calc(50% + ${a}px)`,o.style.opacity=`${.2+Math.sin(Date.now()*.002+t)*.3+.5}`})}function j(){if(!k||!D||!I)return;let n=85,t=92,o=3;setInterval(()=>{n+=(Math.random()-.5)*10,n=Math.max(60,Math.min(98,n)),t+=(Math.random()-.5)*8,t=Math.max(70,Math.min(99,t)),Math.random()<.1&&(o=Math.floor(Math.random()*5)+1);const e=k,s=D;e.style.width=`${n}%`,s.style.width=`${t}%`,I&&(I.textContent=o.toString())},3e3)}function O(){const n=["Analizando datos","Procesando respuesta","Optimizando resultado","Evaluando opciones","Aplicando aprendizaje","Generando predicciones","Conectando sistemas","Mejorando precisión","Priorizando acciones","Actualizando modelos"];setInterval(()=>{if(Y&&z&&E){Y.textContent=z.textContent,z.textContent=E.textContent;const t=Math.floor(Math.random()*n.length);E.textContent=n[t]}},4e3)}function Z(){const n=document.querySelector(".decision-zones");if(n)for(let t=0;t<10;t++){const o=document.createElement("div");o.className="decision-zone";const e=Math.random()*80+10,s=Math.random()*80+10,i=Math.random()*100+50,a=Math.random()*.7+.1;o.style.left=`${e}%`,o.style.top=`${s}%`,o.style.width=`${i}px`,o.style.height=`${i}px`,o.style.opacity=a.toString(),n.appendChild(o)}}function F(){q(),H(),Z(),R(),j(),O(),N.forEach(n=>{n.addEventListener("click",()=>{const t=n.getBoundingClientRect(),o=document.querySelector(".agent-container");if(o){const e=o.getBoundingClientRect();M=(t.left+t.width/2-e.left)/e.width*100,y=(t.top+t.height/2-e.top)/e.height*100,n.classList.add("target-selected"),setTimeout(()=>{n.classList.remove("target-selected")},2e3),m=1,setTimeout(()=>{m=.5},1e3),E&&(E.textContent="Dirigiéndose al objetivo seleccionado")}})})}setTimeout(F,500)});
