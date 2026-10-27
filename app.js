(function(){'use strict';
const $=id=>document.getElementById(id);
const titles=[
 ['El gran pergamino','Ilan vertical · vista monumental'],
 ['El mapa cosmológico','Ilan ilustrado · fragmento circular'],
 ['Círculos de emanación','Diagrama concéntrico · facsímil'],
 ['La arquitectura radial','Diagrama circular · facsímil'],
 ['El centro y sus anillos','Diagrama de círculos · facsímil'],
 ['El árbol de los nombres','Organización ramificada · facsímil'],
 ['Ruedas del infinito','Diagrama orbital · facsímil']
];
let compare=false,compareA=0,compareB=1,compareZoom=1,compareOffsets={a:{x:0,y:0},b:{x:0,y:0}},compareDrag=null;let sequence=false,sequenceRunning=false,sequencePosition=0,sequencePrevTime=0,sequenceWasRunning=false;const SEQUENCE_CHAPTER_SECONDS=8;
let fallbackSheets=[];let overview=false;let vortex=false;let threshold=false;let thresholdAuto=false;let vortexAngle=0;let index=0,engine=null,activeTour=true,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,quality='high',lastInput=performance.now(),visible=false,zoom=1,offset={x:0,y:0},drag=null,viewerOpen=false,cinema=false,archiveOpen=false;
const dots=$('pagination'),vertical=$('orbitIndex');
for(let i=0;i<7;i++){
 let b=document.createElement('button');b.type='button';b.textContent=String(i+1).padStart(2,'0');b.setAttribute('aria-label',`Ir a lámina ${i+1}`);b.addEventListener('click',()=>go(i));dots.append(b);
 let c=document.createElement('button');c.type='button';c.textContent=String(i+1).padStart(2,'0');c.setAttribute('aria-label',`Lámina ${i+1}`);c.addEventListener('click',()=>go(i));vertical.append(c);
}
function go(i,manual=true){index=(i+7)%7;if(engine)engine.setIndex(index);$('pieceIndex').textContent=`${String(index+1).padStart(2,'0')} / 07`;$('pieceTitle').textContent=titles[index][0];$('pieceSubtitle').textContent=titles[index][1];$('positionText').textContent=`${String(index+1).padStart(2,'0')} — 07`;
 if(sequence){renderSequenceUI();}
 $('frameLarge').textContent=String(index+1).padStart(2,'0');$('thresholdMetric').innerHTML=String(index+1).padStart(2,'0')+' <small>/ 07</small>';$('thresholdName').textContent=titles[index][0].toUpperCase();$('thresholdTrack').style.width=((index+1)/7*100)+'%';document.querySelectorAll('.threshold-station').forEach((b,k)=>{b.classList.toggle('selected',k===index);b.setAttribute('aria-pressed',String(k===index))});$('cinemaIndex').textContent=String(index+1).padStart(2,'0');$('cinemaTitle').textContent=titles[index][0];
 const trace=$('jumpTrace');if(trace&&manual){trace.classList.remove('flash');void trace.offsetWidth;trace.classList.add('flash')}
 document.querySelectorAll('.archive-card').forEach((card,k)=>card.classList.toggle('chosen',k===index));
 for(let el of [dots,vertical]){[...el.children].forEach((b,k)=>{b.classList.toggle('active',k===index);if(k===index)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current')})}
 if(manual)lastInput=performance.now();if($('cssFallback').classList.contains('show'))updateFallback();
}
function initFallback(){
 const gallery=$('fallbackGallery');gallery.innerHTML='';fallbackSheets=[];
 for(let i=0;i<7;i++){
  const sheet=document.createElement('div');sheet.className='fallback-sheet';sheet.setAttribute('data-i',i);
  const image=document.createElement('img');image.src=window.ILANOT_INLINE?.[i] || `assets/ilan-${pad(i)}.webp`;image.alt='';image.draggable=false;
  sheet.append(image);gallery.append(sheet);fallbackSheets.push(sheet);
  sheet.addEventListener('click',()=>{if(overview||vortex||threshold){setOverview(false);setVortex(false);setThreshold(false);go(i);setCinema(true)}else if(i===index)openViewer();else go(i)});
 }
 updateFallback();
}
function updateFallback(){
 for(let i=0;i<fallbackSheets.length;i++){
  const node=fallbackSheets[i];let d=i-index;
  const visible=Math.abs(d)<3||threshold||sequence;
  node.style.setProperty('--dx',sequence?`${d*400+Math.sin(i*1.9)*35}px`:threshold?`${Math.sin(i*.91+.28)*225+(i-index)*36}px`:vortex?`${Math.sin(i*2*Math.PI/7+vortexAngle+.44)*330}px`:overview?`${i===0?0:Math.sin((i-1)*Math.PI/3+Math.PI/6)*330}px`:`${d*390}px`);
  node.style.setProperty('--dy',sequence?`${d*65+Math.sin(i*1.7)*30}px`:threshold?`${Math.cos(i*.94+.2)*100}px`:vortex?`${Math.cos(i*2*Math.PI/7+vortexAngle+.44)*205}px`:overview?`${i===0?0:Math.cos((i-1)*Math.PI/3+Math.PI/6)*190}px`:`${(Math.abs(d)*48)+(d*20)}px`);
  node.style.setProperty('--dz',sequence?`${-Math.abs(d)*490}px`:threshold?`${-80-(i-index)*380}px`:vortex?`${-200+Math.cos(i*2*Math.PI/7+vortexAngle+.44)*100}px`:overview?`${i===0?110:-140}px`:`${-Math.abs(d)*340}px`);
  node.style.setProperty('--ry',sequence?`${d===0?-4:Math.sign(d)*-28}deg`:threshold?`${Math.sin(i*.9)*18}deg`:vortex?`${-8+Math.sin(i*2*Math.PI/7+vortexAngle)*12}deg`:overview?`${i%2===0?-8:8}deg`:`${d===0?-9:(d>0?-34:34)}deg`);
  node.style.setProperty('--rz',sequence?`${d===0?0:d*7}deg`:threshold?`${Math.sin(i*1.1)*7}deg`:vortex?`${Math.sin(i*2*Math.PI/7+vortexAngle)*6}deg`:overview?`${(i-3)*2}deg`:`${d===0?1.2:d*4}deg`);
  node.style.setProperty('--op',sequence?(Math.abs(d)>2?0:d===0?1:.18):threshold?(Math.abs(d)<3?Math.max(.08,1-Math.abs(d)*.44):0):vortex?1:overview?1:(visible?(d===0?1:Math.max(.13,.38-Math.abs(d)*.09)):0));
  node.style.setProperty('--bl',sequence?(d===0?0:Math.abs(d)*6):threshold?Math.min(8,Math.abs(d)*2):vortex?0:overview?0:(visible?(d===0?0:Math.min(7,Math.abs(d)*2.5)):12));
  node.style.zIndex=sequence?(40-Math.abs(d)):threshold?(30-Math.abs(d)):vortex?(50+Math.round(Math.cos(i*2*Math.PI/7+vortexAngle)*10)):overview?(i===0?'15':'5'):String(9-Math.abs(d));
  node.classList.toggle('focused',d===0);
  node.setAttribute('aria-hidden',i===index?'false':'true');
 }
}
function setTour(v){activeTour=v;$('tourIcon').textContent=v?'Ⅱ':'▶';$('tourLabel').textContent=v?'PAUSAR RECORRIDO':'REANUDAR RECORRIDO';$('tourToggle').setAttribute('aria-label',v?'Pausar el desfile automático':'Reanudar el desfile automático');$('statusText').textContent=v?'RECORRIDO EN VIVO':'RECORRIDO PAUSADO';lastInput=performance.now()}

// V0.8 / SECUENCIA VII — cinematic timeline, deliberately separated from reading view.
const sequenceChapters=$('sequenceChapters');
for(let i=0;i<7;i++){
 const b=document.createElement('button');b.type='button';b.className='sequence-chapter';b.setAttribute('aria-label',`Reproducir capítulo ${i+1}: ${titles[i][0]}`);
 const img=document.createElement('img');img.loading='lazy';img.alt='';img.src=window.ILANOT_INLINE?.[i]||`assets/ilan-${pad(i)}.webp`;
 const num=document.createElement('span');num.textContent=String(i+1).padStart(2,'0');
 b.append(img,num);b.addEventListener('click',()=>{sequencePosition=i;sequenceRunning=false;go(i);refreshSequence();});sequenceChapters.append(b);
}
function fmtTime(s){return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`}
function renderSequenceUI(){
 const i=Math.min(6,Math.floor(Math.min(6.999,sequencePosition))),fraction=Math.max(0,Math.min(1,sequencePosition-i));
 $('sequenceNumber').textContent=pad(i);$('sequenceTitle').textContent=titles[i][0];
 $('sequenceDetail').textContent=titles[i][1]+' · Capítulo '+pad(i)+' de la secuencia espacial.';
 $('sequenceClock').innerHTML=`${fmtTime(sequencePosition*SEQUENCE_CHAPTER_SECONDS)} <small>/ ${fmtTime(7*SEQUENCE_CHAPTER_SECONDS)}</small>`;
 $('sequencePosition').textContent=`${pad(i)} — 07`;
 $('sequenceScrub').value=Math.round(sequencePosition*100);
 $('sequenceScrub').style.setProperty('--sequence-progress',`${sequencePosition/7*100}%`);
 [...sequenceChapters.children].forEach((b,k)=>{b.classList.toggle('current',k===i);b.classList.toggle('visited',k<i);b.setAttribute('aria-pressed',String(k===i))});
}
function refreshSequence(){
 renderSequenceUI();$('sequencePlay').textContent=sequenceRunning?'Ⅱ PAUSAR PROYECCIÓN':'▶ CONTINUAR PROYECCIÓN';
 $('sequencePlay').setAttribute('aria-label',sequenceRunning?'Pausar proyección':'Reanudar proyección');
}
function setSequence(v){
 v=!!v;if(v&&compare)setCompare(false);if(v&&!sequence){setThreshold(false);setVortex(false);setOverview(false);setCinema(false);setArchive(false);setTour(false)}
 sequence=v;sequenceRunning=v&&!reduced;sequencePrevTime=0;
 if(v)sequencePosition=0;
 $('app').classList.toggle('sequence-mode',v);
 $('sequenceOverlay').inert=!v;$('sequenceOverlay').setAttribute('aria-hidden',String(!v));
 $('sequenceToggle').setAttribute('aria-pressed',String(v));$('sequenceToggle').textContent=v?'✕ SECUENCIA':'◉ SECUENCIA';
 if(engine){engine.setSequence(v);if(v)engine.setSequenceProgress(0);else engine.setIndex(index)}
 if(v)go(0); else {lastInput=performance.now();if($('cssFallback').classList.contains('show'))updateFallback()}
 refreshSequence();
}
$('sequenceMain').addEventListener('click',()=>setSequence(true));
$('sequenceToggle').addEventListener('click',()=>setSequence(!sequence));
$('sequenceExit').addEventListener('click',()=>setSequence(false));
$('sequencePlay').addEventListener('click',()=>{if(!sequenceRunning&&sequencePosition>=7)sequencePosition=0;sequenceRunning=!sequenceRunning;sequencePrevTime=0;refreshSequence()});
$('sequenceBack').addEventListener('click',()=>{sequencePosition=Math.max(0,Math.floor(Math.min(6.999,sequencePosition))-.001);sequencePosition=Math.floor(sequencePosition);sequenceRunning=false;go(Math.floor(sequencePosition));refreshSequence()});
$('sequenceNext').addEventListener('click',()=>{sequencePosition=Math.min(6,Math.floor(sequencePosition)+1);sequenceRunning=false;go(Math.floor(sequencePosition));refreshSequence()});
$('sequenceRead').addEventListener('click',()=>{sequenceWasRunning=sequenceRunning;sequenceRunning=false;refreshSequence();openViewer()});
$('sequenceScrub').addEventListener('input',e=>{sequencePosition=Math.min(7,Number(e.target.value)/100);sequenceRunning=false;go(Math.min(6,Math.floor(sequencePosition)));refreshSequence()});
function tickSequence(now){
 if(!sequence||!visible)return;
 if(!sequencePrevTime)sequencePrevTime=now;
 const dt=Math.min(.07,(now-sequencePrevTime)/1000);sequencePrevTime=now;
 if(sequenceRunning&&!viewerOpen&&!archiveOpen&&!reduced){sequencePosition=Math.min(7,sequencePosition+dt/SEQUENCE_CHAPTER_SECONDS);if(sequencePosition>=7)sequenceRunning=false;}
 const i=Math.min(6,Math.floor(Math.min(6.999,sequencePosition)));
 if(i!==index)go(i,false);
 const stage=sequencePosition-Math.floor(sequencePosition);
 const fly=Math.max(0,Math.min(1,(stage-.68)/.32));const ease=fly*fly*(3-2*fly);
 const flight=Math.min(6,Math.floor(sequencePosition)+ease);
 if(engine)engine.setSequenceProgress(flight);
 if(sequenceRunning||Math.abs(flight-index)>.01)renderSequenceUI();
 if(!sequenceRunning)$('sequencePlay').textContent='▶ CONTINUAR PROYECCIÓN';
}

// V0.9 / DÍPTICO — paired facsimile chamber. No invented metadata or regenerated pictures.
const compareOverlay=$('compareOverlay');
const compareRailA=$('compareRailA'),compareRailB=$('compareRailB');
for(let i=0;i<7;i++){
 for(const side of ['a','b']){
  const btn=document.createElement('button');btn.type='button';btn.className='compare-thumb';btn.setAttribute('aria-label',`Elegir manuscrito ${pad(i)} para panel ${side.toUpperCase()}`);
  const img=document.createElement('img');img.alt='';img.loading='lazy';img.src=window.ILANOT_INLINE?.[i]||`assets/ilan-${pad(i)}.webp`;
  const num=document.createElement('span');num.textContent=pad(i);
  btn.append(img,num);btn.addEventListener('click',()=>{if(side==='a')compareA=i;else compareB=i;compareOffsets[side]={x:0,y:0};refreshCompare()});
  (side==='a'?compareRailA:compareRailB).append(btn);
 }
}
function refreshCompare(){
 for(const side of ['a','b']){
  const i=side==='a'?compareA:compareB;
  const img=$('compareImage'+side.toUpperCase());
  const src=window.ILANOT_ORIGINALS?.[i]||`assets/ilan-${pad(i)}-original.jpg`;
  if(img.getAttribute('src')!==src) img.src=src;
  img.alt=`${titles[i][0]}, facsímil histórico original, panel ${side.toUpperCase()}`;
  $('compareTitle'+side.toUpperCase()).textContent=titles[i][0];
  document.querySelector(`.compare-wing.${side==='a'?'left':'right'} .compare-number`).firstChild.textContent=pad(i)+' ';
  const rail=side==='a'?compareRailA:compareRailB;
  [...rail.children].forEach((b,k)=>{b.classList.toggle('selected',k===i);b.setAttribute('aria-pressed',String(k===i))});
  const o=compareOffsets[side];img.style.transform=`translate(${o.x}px,${o.y}px) scale(${compareZoom})`;
 }
 $('compareZoomLabel').textContent=Math.round(compareZoom*100)+'%';$('compareZoom').value=Math.round(compareZoom*100);
}
function resetCompare(){compareZoom=1;compareOffsets={a:{x:0,y:0},b:{x:0,y:0}};refreshCompare()}
function setCompare(v){
 v=!!v;
 if(v){if(sequence)setSequence(false);if(threshold)setThreshold(false);if(vortex)setVortex(false);if(overview)setOverview(false);if(cinema)setCinema(false);setArchive(false);setTour(false)}
 compare=v;$('app').classList.toggle('compare-mode',v);compareOverlay.inert=!v;compareOverlay.setAttribute('aria-hidden',String(!v));
 $('compareToggle').textContent=v?'✕ DÍPTICO':'◈ DÍPTICO';$('compareToggle').setAttribute('aria-pressed',String(v));
 if(v){refreshCompare();$('compareExit').focus()}else{$('compareMain').focus()}
 lastInput=performance.now();
}
$('compareToggle').addEventListener('click',()=>setCompare(!compare));
$('compareMain').addEventListener('click',()=>setCompare(true));
$('compareExit').addEventListener('click',()=>setCompare(false));
$('compareSwap').addEventListener('click',()=>{[compareA,compareB]=[compareB,compareA];[compareOffsets.a,compareOffsets.b]=[compareOffsets.b,compareOffsets.a];refreshCompare()});
$('compareZoom').addEventListener('input',e=>{compareZoom=Number(e.target.value)/100;refreshCompare()});
$('compareReset').addEventListener('click',resetCompare);
for(const side of ['a','b']){
 const frame=$('compareFrame'+side.toUpperCase());
 frame.addEventListener('wheel',e=>{if(!compare)return;e.preventDefault();compareZoom=Math.min(3,Math.max(1,compareZoom*(e.deltaY<0?1.12:.89)));refreshCompare()},{passive:false});
 frame.addEventListener('pointerdown',e=>{if(!compare)return;compareDrag={side,id:e.pointerId,x:e.clientX,y:e.clientY,ox:compareOffsets[side].x,oy:compareOffsets[side].y};frame.setPointerCapture(e.pointerId)});
 frame.addEventListener('pointermove',e=>{if(!compareDrag||compareDrag.side!==side||compareDrag.id!==e.pointerId)return;compareOffsets[side].x=compareDrag.ox+e.clientX-compareDrag.x;compareOffsets[side].y=compareDrag.oy+e.clientY-compareDrag.y;refreshCompare()});
 const end=e=>{if(compareDrag?.side===side&&compareDrag.id===e.pointerId)compareDrag=null};frame.addEventListener('pointerup',end);frame.addEventListener('pointercancel',end);
 $('compareRead'+side.toUpperCase()).addEventListener('click',()=>{let i=side==='a'?compareA:compareB;setCompare(false);go(i);openViewer()});
}

// V0.7 / THE THRESHOLD — genuine WebGL gateway architecture and navigable stations.
const thresholdStations=$('thresholdStations');
for(let i=0;i<7;i++){
 const b=document.createElement('button');b.type='button';b.className='threshold-station';b.setAttribute('aria-label',`Viajar a estación ${i+1}: ${titles[i][0]}`);
 b.innerHTML=`<span class="threshold-numeral">${String(i+1).padStart(2,'0')}</span><span class="threshold-pillar"></span><span class="threshold-station-name">${titles[i][0]}</span>`;
 b.addEventListener('click',()=>go(i));thresholdStations.append(b);
}
function setThreshold(value){
 if(value&&compare)setCompare(false);threshold=!!value;thresholdAuto=threshold&&!reduced;refreshThresholdAuto();
 if(threshold){if(sequence)setSequence(false);setVortex(false);setOverview(false);setCinema(false);setArchive(false);setTour(false)}
 $('app').classList.toggle('threshold-mode',threshold);
 $('thresholdOverlay').inert=!threshold;$('thresholdOverlay').setAttribute('aria-hidden',String(!threshold));
 $('thresholdToggle').setAttribute('aria-pressed',String(threshold));
 $('thresholdToggle').textContent=threshold?'✕ SALIR DEL UMBRAL':'✺ UMBRAL';
 if(engine)engine.setThreshold(threshold);
 if($('cssFallback').classList.contains('show'))updateFallback();
 lastInput=performance.now();
}
function refreshThresholdAuto(){$('thresholdAuto').textContent=thresholdAuto?'Ⅱ PAUSAR VIAJE':'▶ AUTO-VUELO';$('thresholdAuto').setAttribute('aria-label',thresholdAuto?'Pausar recorrido automático por las estaciones':'Reanudar recorrido automático por las estaciones')}
$('thresholdAuto').addEventListener('click',()=>{thresholdAuto=!thresholdAuto;refreshThresholdAuto();lastInput=performance.now()});
$('thresholdMain').addEventListener('click',()=>setThreshold(true));
$('thresholdToggle').addEventListener('click',()=>setThreshold(!threshold));
$('thresholdExit').addEventListener('click',()=>setThreshold(false));
$('thresholdPrev').addEventListener('click',()=>go(index-1));
$('thresholdNext').addEventListener('click',()=>go(index+1));
$('thresholdInspect').addEventListener('click',openViewer);
// V0.6 / HELIX VII — accessible physical vortex and camera choreography.
const vortexChoices=$('vortexChoices');
for(let i=0;i<7;i++){
 const b=document.createElement('button');b.type='button';b.className='vortex-choice';
 b.innerHTML=`<span>${String(i+1).padStart(2,'0')}</span><strong>${titles[i][0]}</strong><em>↗</em>`;
 b.addEventListener('click',()=>{setVortex(false);go(i);setCinema(true)});vortexChoices.append(b);
}
function rotateVortex(delta){
 if(!vortex)return;
 vortexAngle+=delta;if(engine)engine.rotateVortex(delta);
 if($('cssFallback').classList.contains('show'))updateFallback();
}
function setVortex(v){
 if(v&&compare)setCompare(false);
 vortex=!!v;
 if(vortex){if(sequence)setSequence(false);setThreshold(false);setOverview(false);setCinema(false);setArchive(false);setTour(false)}
 $('app').classList.toggle('vortex-mode',vortex);
 $('vortexOverlay').setAttribute('aria-hidden',vortex?'false':'true');$('vortexOverlay').inert=!vortex;
 $('vortexToggle').setAttribute('aria-pressed',String(vortex));
 $('vortexToggle').textContent=vortex?'✕ SALIR DEL VÓRTICE':'◎ VÓRTICE';
 if(engine)engine.setVortex(vortex);
 if($('cssFallback').classList.contains('show'))updateFallback();
 lastInput=performance.now();
}
$('vortexToggle').addEventListener('click',()=>setVortex(!vortex));
$('vortexMain').addEventListener('click',()=>setVortex(true));
$('leaveVortex').addEventListener('click',()=>setVortex(false));
$('spinLeft').addEventListener('click',()=>rotateVortex(-Math.PI/7));
$('spinRight').addEventListener('click',()=>rotateVortex(Math.PI/7));
let vortexDrag=null;
$('space').addEventListener('pointerdown',e=>{if(vortex)vortexDrag=e.clientX});
window.addEventListener('pointermove',e=>{
 if(vortex&&vortexDrag!==null){const delta=(e.clientX-vortexDrag)/170;vortexDrag=e.clientX;rotateVortex(delta)}
});
window.addEventListener('pointerup',()=>{vortexDrag=null});
window.addEventListener('pointercancel',()=>{vortexDrag=null});
// V0.4 / SEVEN-IN-ONE — switch between an actual 3D constellation and flight.
const choiceHolder=$('constellationChoices');
for(let i=0;i<7;i++){
 const b=document.createElement('button');b.type='button';b.className='constellation-choice';
 b.innerHTML=`<span>${String(i+1).padStart(2,'0')}</span><strong>${titles[i][0]}</strong><em>↗</em>`;
 b.addEventListener('click',()=>{setOverview(false);go(i);setCinema(true)});choiceHolder.append(b);
}
function setOverview(next){
 if(next&&compare)setCompare(false);
 overview=!!next;if(overview){if(sequence)setSequence(false);setThreshold(false);setVortex(false);setCinema(false);setArchive(false);setTour(false)}
 $('app').classList.toggle('overview-mode',overview);
 $('constellationOverlay').setAttribute('aria-hidden',overview?'false':'true');$('constellationOverlay').inert=!overview;
 $('overviewToggle').setAttribute('aria-pressed',String(overview));
 $('overviewToggle').textContent=overview?'✕ SALIR DEL ATRIO':'✦ CONSTELACIÓN';
 if(engine)engine.setOverview(overview);if($('cssFallback').classList.contains('show'))updateFallback();
 lastInput=performance.now();
}
$('overviewToggle').addEventListener('click',()=>setOverview(!overview));
$('overviewMain').addEventListener('click',()=>setOverview(true));
// 0.3 / CINEMA — a distinct gallery experience that removes the editorial overlay
// and moves the world camera through each parchment on a curved flight path.
function setCinema(next){
 cinema=!!next;if(cinema&&sequence)setSequence(false);if(cinema&&overview)setOverview(false);if(cinema&&threshold)setThreshold(false);document.getElementById('app').classList.toggle('cinema-mode',cinema);
 $('cinemaHud').setAttribute('aria-hidden',cinema?'false':'true');
 $('cinemaToggle').setAttribute('aria-label',cinema?'Salir del modo cine':'Entrar en el modo cine');
 if(engine)engine.setCinema(cinema);
 if(cinema){setArchive(false);if(!reduced)setTour(true);}else lastInput=performance.now();
}
$('cinemaToggle').addEventListener('click',()=>setCinema(true));
$('cinemaClose').addEventListener('click',()=>setCinema(false));
$('cinemaInspect').addEventListener('click',openViewer);
function setArchive(value){
 archiveOpen=!!value;const dr=$('archiveDrawer');dr.classList.toggle('open',archiveOpen);
 dr.setAttribute('aria-hidden',archiveOpen?'false':'true');
 if(archiveOpen){setTour(false);$('archiveClose').focus();}else if(document.activeElement===$('archiveClose'))$('archiveOpen').focus();
}
$('archiveOpen').addEventListener('click',()=>setArchive(true));
$('archiveClose').addEventListener('click',()=>setArchive(false));
$('archiveDrawer').addEventListener('pointerdown',e=>{if(e.target===$('archiveDrawer'))setArchive(false)});
const archive=$('archiveGrid');
for(let i=0;i<7;i++){
 const b=document.createElement('button');b.className='archive-card';b.type='button';
 b.setAttribute('aria-label','Ir a la estación '+(i+1));
 const img=document.createElement('img');img.loading='lazy';img.alt='';img.src=window.ILANOT_INLINE?.[i]||`assets/ilan-${String(i+1).padStart(2,'0')}.webp`;
 const idx=document.createElement('span');idx.className='archive-number';idx.textContent=String(i+1).padStart(2,'0');
 const name=document.createElement('strong');name.textContent=titles[i][0];
 b.append(img,idx,name);b.addEventListener('click',()=>{go(i);setArchive(false)});archive.append(b);
}

$('prev').addEventListener('click',()=>go(index-1));$('next').addEventListener('click',()=>go(index+1));$('tourToggle').addEventListener('click',()=>setTour(!activeTour));$('inspect').addEventListener('click',openViewer);
$('quality').addEventListener('click',()=>{quality=quality==='high'?'low':'high';$('qualityName').textContent=quality==='high'?'ALTA':'ECO';$('quality').setAttribute('aria-label',`Calidad visual: ${quality==='high'?'alta':'económica'}`);if(engine)engine.setQuality(quality)});
function setReduced(v){reduced=v;$('reduce').classList.toggle('selected',v);$('reduce').textContent=v?'◉':'◌';$('reduce').title=v?'Restaurar animación':'Reducir movimiento';$('reduce').setAttribute('aria-label',v?'Restaurar movimiento':'Reducir movimiento');if(engine)engine.setReduced(v);if(v){setTour(false);thresholdAuto=false;sequenceRunning=false;refreshSequence();refreshThresholdAuto()}}
$('reduce').addEventListener('click',()=>setReduced(!reduced));$('fullscreen').addEventListener('click',()=>{if(document.fullscreenElement)document.exitFullscreen?.();else $('app').requestFullscreen?.().catch(()=>{})});
function pad(i){return String(i+1).padStart(2,'0')}
function applyZoom(){const img=$('viewerImage');img.style.transform=`translate(${offset.x}px,${offset.y}px) scale(${zoom})`;$('zoomValue').textContent=`${Math.round(zoom*100)}%`}
function openViewer(){if(sequence){sequenceWasRunning=sequenceRunning;sequenceRunning=false;refreshSequence()}viewerOpen=true;setTour(false);zoom=1;offset={x:0,y:0};$('viewerTitle').textContent=titles[index][0];$('viewerImage').src=window.ILANOT_ORIGINALS?.[index] || `assets/ilan-${pad(index)}-original.jpg`;applyZoom();$('viewer').classList.add('open');$('viewer').setAttribute('aria-hidden','false');$('closeViewer').focus()}
function closeViewer(){viewerOpen=false;$('viewer').classList.remove('open');$('viewer').setAttribute('aria-hidden','true');$('inspect').focus()}
function changeZoom(delta){zoom=Math.max(.5,Math.min(8,zoom*delta));applyZoom()}
$('closeViewer').addEventListener('click',closeViewer);$('zoomIn').addEventListener('click',()=>changeZoom(1.3));$('zoomOut').addEventListener('click',()=>changeZoom(1/1.3));$('resetView').addEventListener('click',()=>{zoom=1;offset={x:0,y:0};applyZoom()});
$('viewerStage').addEventListener('wheel',e=>{e.preventDefault();changeZoom(e.deltaY<0?1.14:1/1.14)},{passive:false});
$('viewerStage').addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,ox:offset.x,oy:offset.y};$('viewerStage').setPointerCapture(e.pointerId)});
$('viewerStage').addEventListener('pointermove',e=>{if(!drag)return;offset.x=drag.ox+e.clientX-drag.x;offset.y=drag.oy+e.clientY-drag.y;applyZoom()});$('viewerStage').addEventListener('pointerup',()=>{drag=null});$('viewerStage').addEventListener('pointercancel',()=>{drag=null});
let scrollBusy=0;window.addEventListener('wheel',e=>{if(viewerOpen||archiveOpen||compare||sequence)return;if(Math.abs(e.deltaY)<7)return;let now=performance.now();if(now-scrollBusy<720)return;scrollBusy=now;go(index+(e.deltaY>0?1:-1))},{passive:true});
let startX=null;const canvas=$('space');
canvas.addEventListener('webglcontextlost',e=>{
 e.preventDefault();if(engine)engine.stop();canvas.style.display='none';$('cssFallback').classList.add('show');
 if(!fallbackSheets.length)initFallback();$('quality').disabled=true;
 $('statusText').textContent='MODO DE RESPALDO 3D';
});
canvas.addEventListener('pointerdown',e=>{startX=e.clientX});canvas.addEventListener('pointerup',e=>{if(startX===null)return;let dx=e.clientX-startX;if(Math.abs(dx)>50)go(index+(dx<0?1:-1));else if(Math.abs(dx)<8&&!overview&&!vortex)openViewer();startX=null});
window.addEventListener('pointermove',e=>{if(engine&&!viewerOpen&&!reduced)engine.pointer=[(e.clientX/window.innerWidth-.5)*2,(.5-e.clientY/window.innerHeight)*2]});
window.addEventListener('keydown',e=>{if(compare){if(e.key==='Escape')setCompare(false);return}if(viewerOpen){if(e.key==='Escape')closeViewer();else if(e.key==='+'||e.key==='=')changeZoom(1.25);else if(e.key==='-')changeZoom(.8);return}if(archiveOpen){if(e.key==='Escape')setArchive(false);return}if(e.key==='Escape'&&sequence){setSequence(false);return}if(sequence){if(e.key===' '){e.preventDefault();sequenceRunning=!sequenceRunning;refreshSequence();return}if(e.key==='ArrowRight'){sequencePosition=Math.min(6,Math.floor(sequencePosition)+1);sequenceRunning=false;go(Math.floor(sequencePosition));refreshSequence();return}if(e.key==='ArrowLeft'){sequencePosition=Math.max(0,Math.floor(sequencePosition)-1);sequenceRunning=false;go(Math.floor(sequencePosition));refreshSequence();return}return}if(e.key.toLowerCase()==='s'){setSequence(true);return}if(e.key.toLowerCase()==='d'){setCompare(true);return}if(e.key==='Escape'&&threshold){setThreshold(false);return}if(e.key.toLowerCase()==='u'){setThreshold(!threshold);return}if(e.key==='Escape'&&vortex){setVortex(false);return}if(e.key.toLowerCase()==='v'){setVortex(!vortex);return}if(vortex&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){rotateVortex(e.key==='ArrowRight'?.36:-.36);return}if(e.key==='Escape'&&overview){setOverview(false);return}if(e.key==='Escape'&&cinema){setCinema(false);return}if(e.key.toLowerCase()==='o'){setOverview(!overview);return}if(e.key.toLowerCase()==='c'){setCinema(!cinema);return}if(e.key.toLowerCase()==='a'){setArchive(!archiveOpen);return}if(e.key==='ArrowRight'||e.key==='ArrowDown')go(index+1);else if(e.key==='ArrowLeft'||e.key==='ArrowUp')go(index-1);else if(e.key===' '){e.preventDefault();setTour(!activeTour)}else if(e.key==='Enter'&&document.activeElement===document.body)openViewer()});
document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(!visible){lastInput=performance.now();sequencePrevTime=0}});
function loop(now){tickSequence(now);if(visible&&threshold&&thresholdAuto&&!viewerOpen&&!archiveOpen&&!reduced&&now-lastInput>7800){go(index+1,false);lastInput=now}if(visible&&activeTour&&!reduced&&!viewerOpen&&!archiveOpen&&!compare&&!vortex&&!threshold&&now-lastInput>(cinema?7900:11200)){go(index+1,false);lastInput=now}requestAnimationFrame(loop)}
async function init(){go(0,false);setReduced(reduced);visible=true;try{engine=new IlanotScene(canvas);engine.setReduced(reduced);engine.setCinema(cinema);if(innerWidth<700){engine.setQuality('low');quality='low';$('qualityName').textContent='ECO';}const start=performance.now();await engine.load(p=>{$('loadProgress').style.width=`${p*100}%`});engine.start();let wait=Math.max(0,650-(performance.now()-start));setTimeout(()=>{$('loading').classList.add('done');lastInput=performance.now()},wait)}catch(err){console.error('ILANOT: fallback visual, WebGL no disponible:',err);canvas.style.display='none';$('cssFallback').classList.add('show');initFallback();$('loadProgress').style.width='100%';setTimeout(()=>$('loading').classList.add('done'),450);$('quality').disabled=true;}
 requestAnimationFrame(loop)}
init();
window.BESA_STUDY_API={
 getState:()=>({index,compare,compareA,compareB,viewerOpen,sequence,threshold}),
 pause:()=>{setTour(false);if(sequence){sequenceRunning=false;refreshSequence()}thresholdAuto=false;refreshThresholdAuto()},
 inspect:(i)=>{if(compare)setCompare(false);if(archiveOpen)setArchive(false);go(i);openViewer()}
};
})();
