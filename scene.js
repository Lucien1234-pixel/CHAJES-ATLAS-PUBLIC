/* ILANOT COSMOS v0.4 — THE OBSERVATORY / TWO REAL 3D WORLDS.
   WebGL2 original manuscript installations; no network/library dependencies. */
(function(global){'use strict';
const SH={
quadV:`#version 300 es
precision highp float;out vec2 vUV;
void main(){ vec2 p=vec2(gl_VertexID==2?3.:-1.,gl_VertexID==1?3.:-1.);vUV=(p+1.)*.5;gl_Position=vec4(p,0.,1.);}`,
spaceF:`#version 300 es
precision highp float;in vec2 vUV;out vec4 color;uniform float uTime,uAspect,uJourney,uWarp,uThreshold;
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float no(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+1.),f.x),f.y);}
void main(){
 vec2 q=(vUV-.5)*2.;q.x*=uAspect;float t=uTime*.045;
 vec2 b=q*vec2(.57,.86)+vec2(uJourney*.073,-t*.21);
 // Light-speed radial shafts flare subtly only during inter-station travel.
 float wa=atan(q.y,q.x);float wr=length(q);float beams=pow(max(0.,cos(wa*56.+t*17.)),48.)*smoothstep(.2,1.4,wr);
 float n=no(b*1.6)*.6+no(b*3.6+t*.034)*.28+no(b*9.7)*.12;
 float mist=pow(max(0.,n-.35),1.85);
 float locus=length((q-vec2(.61,.04))*vec2(.79,1.));
 vec3 c=vec3(.004,.009,.015);
 c+=vec3(.010,.031,.043)*(1.-smoothstep(.10,2.9,locus));
 c+=vec3(.038,.115,.122)*mist*.93;
 c+=vec3(.063,.034,.021)*mist*.45;
 float horizon=exp(-pow((q.y+.31)*2.3,2.))*exp(-pow((q.x-.28)*.67,2.));
 c+=vec3(.012,.046,.048)*horizon;
 c+=vec3(.12,.25,.26)*beams*uWarp*.68;
 // A directional star tunnel emerges only while crossing the Threshold.
 float phi=atan(q.y,q.x),dist=length(q);
 float streak=pow(max(0.,cos(phi*95.+sin(dist*5.)*1.7)),82.)*smoothstep(.12,.65,dist)*exp(-dist*.8);
 float flare=exp(-pow((dist-(.66+.1*sin(uTime*.14+uJourney)))*85.,2.));
 c+=uThreshold*(vec3(.12,.40,.42)*streak*.44+vec3(.40,.29,.13)*flare*.09);
 // Astronomical coordinate engravings visible in the distance
 vec2 v=q-vec2(.56,.02);float r=length(v),a=atan(v.y,v.x);
 float ring=exp(-pow((r-1.24)*270.,2.))*.52+exp(-pow((r-1.92)*210.,2.))*.38;
 float minute=pow(max(0.,sin(a*60.+uTime*.025)),125.)*exp(-pow((r-1.24)*125.,2.));
 c+=vec3(.22,.13,.058)*(ring*.46+minute*.22);
 vec2 grid=vUV*vec2(940.,590.);
 float rnd=h21(floor(grid));float st=step(.9988,rnd);
 float sparkle=.55+.24*sin(uTime*(.27+.2*rnd)+rnd*17.);
 c+=vec3(.40,.67,.68)*st*sparkle;
 c*=1.-.43*smoothstep(.52,1.55,length(q*vec2(.76,1.)));
 color=vec4(c,1.);
}`,
meshV:`#version 300 es
precision highp float;
layout(location=0)in vec3 aPos;layout(location=1)in vec2 aUV;
uniform mat4 uVP,uModel;uniform vec2 uDims;uniform float uTime,uSeed,uCurl;
out vec2 vUV;out vec3 vWorld;out vec3 vNormal;out float vEdge;
void main(){vec3 p=aPos;p.x*=uDims.x;p.y*=uDims.y;
float x=aUV.x, y=aUV.y;
float curvature=uCurl*(pow(2.*x-1.,2.)-.30)+.055*sin(y*14.+uSeed*3.+uTime*.28)*sin(3.14159*x);
p.z+=curvature;
p.x+=.018*sin(y*12.+uSeed+uTime*.37);
vec4 wp=uModel*vec4(p,1.);
vWorld=wp.xyz;vUV=aUV;vEdge=max(abs(aUV.x-.5),abs(aUV.y-.5))*2.;vNormal=normalize((uModel*vec4(-uCurl*(2.*x-1.)/max(.5,uDims.x),0.,1.,0.)).xyz);
gl_Position=uVP*wp;}`,
meshF:`#version 300 es
precision highp float;in vec2 vUV;in vec3 vWorld;in vec3 vNormal;in float vEdge;out vec4 color;
uniform sampler2D uTex;uniform vec3 uEye;uniform float uOpacity,uFocus,uTime,uDefocus;
void main(){vec3 src=texture(uTex,vUV).rgb;
if(uDefocus>.001){vec2 texel=vec2(1.)/vec2(textureSize(uTex,0));vec2 r=texel*(1.5+uDefocus*4.);vec3 b=(texture(uTex,vUV+vec2(r.x,0.)).rgb+texture(uTex,vUV-vec2(r.x,0.)).rgb+texture(uTex,vUV+vec2(0.,r.y)).rgb+texture(uTex,vUV-vec2(0.,r.y)).rgb)*.25;src=mix(src,b,clamp(uDefocus*.7,0.,.8));}
vec3 N=normalize(vNormal);vec3 light=normalize(vec3(-.65,1.3,1.75));float lit=.84+.16*max(0.,dot(N,light));
float amber=pow(clamp(vEdge,0.,1.),5.)*.065;float spec=pow(max(0.,dot(reflect(-light,N),normalize(uEye-vWorld))),26.)*.055;
vec3 c=src*lit+vec3(.16,.085,.031)*amber+vec3(.2,.15,.08)*spec;
// Preserve facsimile: all labels and printed details remain original pixels.
float edgeShadow=1.-.14*pow(vEdge,9.);c*=edgeShadow;
color=vec4(c*mix(.72,1.,uFocus),uOpacity);}`,
ringV:`#version 300 es
precision highp float;layout(location=0)in vec3 aPos;layout(location=1)in vec2 aUV;
uniform mat4 uVP,uModel;uniform vec2 uDims;out vec2 vUV;
void main(){vUV=aUV;gl_Position=uVP*uModel*vec4(aPos.xy*uDims*1.5,-.35,1.);}`,
ringF:`#version 300 es
precision highp float;in vec2 vUV;out vec4 color;uniform float uTime,uAlpha,uSeed;
void main(){
 vec2 p=(vUV-.5)*2.;float r=length(p),a=atan(p.y,p.x);
 float w=mod(a+6.283185,6.283185);
 float major=exp(-pow((r-.86)*310.,2.))*.85;
 float inner=exp(-pow((r-.615)*290.,2.))*.58;
 float outer=exp(-pow((r-1.075)*330.,2.))*.55;
 float shell=exp(-pow((r-.85)*11.,2.))*.25;
 float arc=(.35+.65*smoothstep(-.75,.45,cos(a*2.2-uTime*.08+uSeed)));
 float ticks=pow(max(0.,sin(w*72.+uSeed)),110.)*exp(-pow((r-.86)*120.,2.))*.60;
 float spokes=pow(max(0.,cos(w*12.-uTime*.09)),88.)*exp(-pow((r-.63)*55.,2.))*.38;
 float corona=exp(-pow((r-.96)*5.3,2.))*.14;
 float v=(major+inner+outer)*arc+ticks+spokes+shell+corona;
 vec3 c=mix(vec3(.26,.74,.76),vec3(1.,.67,.27),smoothstep(.65,1.18,r));
 color=vec4(c*(v+.025)*1.35,clamp(v*uAlpha*.66,0.,.95));
}`,
veilV:`#version 300 es
precision highp float;layout(location=0)in vec3 aPos;layout(location=1)in vec2 aUV;
uniform mat4 uVP,uModel;uniform vec2 uDims;out vec2 vUV;
void main(){vUV=aUV;gl_Position=uVP*uModel*vec4(aPos.xy*uDims*1.4,-1.4,1.);}`,
veilF:`#version 300 es
precision highp float;in vec2 vUV;out vec4 color;uniform float uTime,uAlpha,uSeed;
void main(){vec2 p=(vUV-.5)*2.;float a=atan(p.y,p.x);
float r=length(p*vec2(.95,1.12));float curtain=exp(-pow((p.x-sin(p.y*1.5+uTime*.1+uSeed)*.06)*2.1,2.))*exp(-pow(p.y*.65,2.));
float ion=exp(-pow((r-.42)*4.,2.))*(.6+.4*sin(a*6.-uTime*.12+uSeed));
float glow=(curtain*.38+ion*.23)*(1.-smoothstep(.4,1.25,r));
vec3 c=mix(vec3(.08,.67,.67),vec3(1.,.60,.25),smoothstep(-.25,.95,p.y));
color=vec4(c*glow,clamp(glow*uAlpha*.18,0.,.13));}`,
filamentV:`#version 300 es
precision highp float;layout(location=0)in vec4 aPoint;layout(location=1)in vec3 aInk;
uniform mat4 uVP;uniform float uTime;out vec3 vInk;out float vWave;
void main(){vec3 p=aPoint.xyz;p.y+=sin(uTime*.18+aPoint.w*5.)*.024;
gl_Position=uVP*vec4(p,1.);vInk=aInk;
vWave=.68+.32*sin(aPoint.w*23.+uTime*.49);}`, 
filamentF:`#version 300 es
precision highp float;in vec3 vInk;in float vWave;out vec4 color;
void main(){color=vec4(vInk*(.77+.23*vWave),.27*vWave);}`, 
pointV:`#version 300 es
precision highp float;layout(location=0)in vec4 aPoint;uniform mat4 uVP;uniform float uTime,uSize;
out float vLight;out float vHue;
void main(){vec3 p=aPoint.xyz;p.x+=sin(uTime*.25+aPoint.w*17.)*.17;p.y+=cos(uTime*.19+aPoint.w*14.)*.14;
vec4 clip=uVP*vec4(p,1.);gl_Position=clip;
float dist=max(0.5,clip.w);gl_PointSize=clamp(uSize*(5.+aPoint.w*13.)/sqrt(dist),.4,9.);vLight=.38+.62*aPoint.w;vHue=step(.56,aPoint.w);}`,
pointF:`#version 300 es
precision highp float;in float vLight,vHue;out vec4 color;
void main(){float d=length(gl_PointCoord-.5)*2.;float glow=pow(1.-smoothstep(0.,1.,d),3.);vec3 c=mix(vec3(.68,.88,.79),vec3(1.,.76,.40),vHue);color=vec4(c*glow*vLight,glow*.6);}`,
blurF:`#version 300 es
precision highp float;in vec2 vUV;out vec4 color;uniform sampler2D uImage;uniform vec2 uDirection;uniform float uThreshold;
vec3 sampleC(vec2 uv){vec3 c=texture(uImage,uv).rgb;if(uThreshold>.5){float brightness=max(c.r,max(c.g,c.b));c*=smoothstep(.28,.77,brightness);}return c;}
void main(){vec3 c=sampleC(vUV)*.227027;for(int i=1;i<=4;i++){float w=i==1?.1945946:i==2?.1216216:i==3?.054054:.016216;c+=sampleC(vUV+uDirection*float(i))*w;c+=sampleC(vUV-uDirection*float(i))*w;}color=vec4(c,1.);}`,
postF:`#version 300 es
precision highp float;in vec2 vUV;out vec4 color;uniform sampler2D uScene,uGlow;uniform float uBloom;
void main(){vec3 c=texture(uScene,vUV).rgb;vec3 g=texture(uGlow,vUV).rgb;float neutralLevel=min(c.r,min(c.g,c.b));float protectPaper=1.-smoothstep(.12,.31,neutralLevel);c+=g*uBloom*.52*protectPaper;c=clamp(c,0.,1.);color=vec4(c,1.);}`
};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function id(){return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]}
function perspective(fovy,aspect,near,far){let f=1/Math.tan(fovy/2), nf=1/(near-far);return [f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*nf,-1, 0,0,(2*far*near)*nf,0]}
function lookAt(eye,at,up=[0,1,0]){let z=norm(sub(eye,at)),x=norm(cross(up,z)),y=cross(z,x);return [x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]}
function mul(a,b){let out=Array(16);for(let col=0;col<4;col++)for(let row=0;row<4;row++){let n=0;for(let k=0;k<4;k++)n+=a[k*4+row]*b[col*4+k];out[col*4+row]=n}return out}
function translateRotate(x,y,z,yaw,roll){let cy=Math.cos(yaw),sy=Math.sin(yaw),cr=Math.cos(roll),sr=Math.sin(roll);return [cy*cr,sr, -sy*cr,0,-cy*sr,cr,sy*sr,0,sy,0,cy,0,x,y,z,1]}
function sub(a,b){return a.map((n,i)=>n-b[i])}function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]}function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}function norm(a){let l=Math.hypot(...a)||1;return a.map(x=>x/l)}
function shader(gl,type,src){let s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
function program(gl,v,f){let p=gl.createProgram();gl.attachShader(p,shader(gl,gl.VERTEX_SHADER,v));gl.attachShader(p,shader(gl,gl.FRAGMENT_SHADER,f));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p}
class IlanotScene{
 constructor(canvas,options={}){
  this.canvas=canvas;this.gl=canvas.getContext('webgl2',{antialias:true,alpha:false,depth:true,powerPreference:'high-performance',premultipliedAlpha:false});
  if(!this.gl)throw Error('WebGL2 no disponible');this.options=options;this.g=this.gl;this.index=0;this.progress=0;this.target=0;this.quality='high';this.reduced=false;this.cinema=false;this.cinemaMix=0;this.overview=false;this.overviewMix=0;this.vortex=false;this.vortexMix=0;this.threshold=false;this.thresholdMix=0;this.sequence=false;this.sequenceMix=0;this.sequenceTravel=0;this.vortexAngle=0;this.vortexAngleTarget=0;this.pointer=[0,0];this.pointerSmooth=[0,0];this.time=0;this.last=0;this.rendering=false;
  let gl=this.gl;this.programs={space:program(gl,SH.quadV,SH.spaceF),paper:program(gl,SH.meshV,SH.meshF),ring:program(gl,SH.ringV,SH.ringF),point:program(gl,SH.pointV,SH.pointF),blur:program(gl,SH.quadV,SH.blurF),post:program(gl,SH.quadV,SH.postF),filament:program(gl,SH.filamentV,SH.filamentF),veil:program(gl,SH.veilV,SH.veilF)};
  this.items=Array.from({length:7},(_,i)=>{let dims=[[2.13,6.47],[5.45,4.42],[4.24,5.34],[4.26,5.47],[5.15,5.18],[4.4,6],[4.56,5.65]][i];return {i,x:Math.sin(i*1.13)*3.8,y:Math.sin(i*.81)*.72,z:-i*6.2,w:dims[0],h:dims[1],seed:i*.913,tex:null}});
  this.initGeometry();this.initFilaments();this.initConstellation();this.initVortexGeometry();this.initThresholdGeometry();this.resize();window.addEventListener('resize',()=>this.resize());
 }
 initGeometry(){let g=this.g;
  const nu=32,nv=44,vertices=[],indices=[];for(let y=0;y<=nv;y++)for(let x=0;x<=nu;x++){let u=x/nu,v=y/nv;vertices.push(u-.5,v-.5,0,u,v)}for(let y=0;y<nv;y++)for(let x=0;x<nu;x++){let a=y*(nu+1)+x,b=a+1,c=a+nu+1,d=c+1;indices.push(a,c,b,b,c,d)}
  this.paperVAO=g.createVertexArray();g.bindVertexArray(this.paperVAO);let vbo=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,vbo);g.bufferData(g.ARRAY_BUFFER,new Float32Array(vertices),g.STATIC_DRAW);g.enableVertexAttribArray(0);g.vertexAttribPointer(0,3,g.FLOAT,false,20,0);g.enableVertexAttribArray(1);g.vertexAttribPointer(1,2,g.FLOAT,false,20,12);
  let ibo=g.createBuffer();g.bindBuffer(g.ELEMENT_ARRAY_BUFFER,ibo);g.bufferData(g.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),g.STATIC_DRAW);this.paperCount=indices.length;
  this.quadVAO=g.createVertexArray();g.bindVertexArray(this.quadVAO);let quad=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,-.5,.5,0,0,1,.5,.5,0,1,1]);let qb=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,qb);g.bufferData(g.ARRAY_BUFFER,quad,g.STATIC_DRAW);g.enableVertexAttribArray(0);g.vertexAttribPointer(0,3,g.FLOAT,false,20,0);g.enableVertexAttribArray(1);g.vertexAttribPointer(1,2,g.FLOAT,false,20,12);
  const pv=[];let seed=743912;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};for(let i=0;i<960;i++)pv.push((rnd()-.5)*48,(rnd()-.5)*28,-rnd()*92+12,rnd());this.pointVAO=g.createVertexArray();g.bindVertexArray(this.pointVAO);let pb=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,pb);g.bufferData(g.ARRAY_BUFFER,new Float32Array(pv),g.STATIC_DRAW);g.enableVertexAttribArray(0);g.vertexAttribPointer(0,4,g.FLOAT,false,16,0);this.pointCount=pv.length/4;g.bindVertexArray(null);
 }
 initFilaments(){
  // Eight genuine 3D elliptical astrolabe paths surround each pergamino.
  // Plus seven interconnecting luminous threads through the entire corridor.
  const gl=this.g,lines=[];
  const push=(x,y,z,t,r,g,b)=>lines.push(x,y,z,t,r,g,b);
  for(const it of this.items){
   for(let orbit=0;orbit<8;orbit++){
    const radius=1.45+orbit*.49;const yRadius=1.15+orbit*.40;
    const pitch=.12+orbit*.11;const tilt=.22+orbit*.16;
    const phase=it.seed+orbit*.74;
    for(let k=0;k<156;k++){
     const theta=phase+k*Math.PI*2/156;
     const point=(a)=>{let x=Math.cos(a)*radius,z=Math.sin(a)*radius*.33;
       let y=Math.sin(a)*yRadius;
       return [it.x+x*Math.cos(pitch)+z*Math.sin(pitch),it.y+y*Math.cos(tilt)-z*Math.sin(tilt),it.z-1.5-x*Math.sin(pitch)+z*Math.cos(pitch)];};
     const [x1,y1,z1]=point(theta),[x2,y2,z2]=point(theta+Math.PI*2/156);
     const m=orbit%3===0?[.78,.52,.22]:orbit%3===1?[.15,.48,.50]:[.52,.37,.18];
     push(x1,y1,z1,orbit*.33+k/156,...m);push(x2,y2,z2,orbit*.33+(k+1)/156,...m);
    }
   }
  }
  // NEW 0.3: deep 3D nave, not screen-space decorative circles. Each station
  // carries three physical elliptical portal arches and a constellation of ribs.
  for(const it of this.items){
    for(let gate=0;gate<4;gate++){
      const rx=3.7+gate*.85,ry=4.7+gate*.7,depth=it.z-3.0-gate*.79;
      for(let k=0;k<240;k++){
        const point=(ang)=>[it.x+Math.sin(ang)*rx,it.y+Math.cos(ang)*ry,depth+Math.sin(ang*2+gate)*.46];
        const theta=k*Math.PI*2/240;
        const a=point(theta),b=point(theta+Math.PI*2/240);
        const ink=gate%2===0?[.37,.23,.095]:[.08,.32,.36];
        push(...a,k*.012,...ink);push(...b,(k+1)*.012,...ink);
      }
    }
    // Framed navigational constellations around each parchment.
    for(let ray=0;ray<18;ray++){
      let ang=ray*Math.PI/9, r=4.95;
      const a=[it.x+Math.cos(ang)*r,it.y+Math.sin(ang)*r,it.z-3.1];
      const b=[it.x+Math.cos(ang)*(r+(.23+(ray%3)*.15)),it.y+Math.sin(ang)*(r+(.23+(ray%3)*.15)),it.z-3.1];
      push(...a,ray*.05,.55,.33,.13);push(...b,ray*.05+.01,.55,.33,.13);
    }
  }
  // A network of long lines, deliberately sparse to keep the facsimile legible.
  for(let lane=0;lane<13;lane++){
   for(let k=0;k<380;k++){
    const point=(t)=>{const z=9-t*59;const x=Math.sin(t*.105+lane*1.13)*(6+lane*.21);
      const y=Math.cos(t*.075+lane*.9)*(4+lane*.14);
      return [x,y,z];};
    const t1=k*.155,t2=(k+1)*.155;
    const a=point(t1),b=point(t2),ink=lane%3===0?[.48,.29,.14]:[.09,.38,.38];
    push(...a,t1*.12,...ink);push(...b,t2*.12,...ink);
   }
  }
  this.filamentCount=lines.length/7;
  this.filamentVAO=gl.createVertexArray();gl.bindVertexArray(this.filamentVAO);
  const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(lines),gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,4,gl.FLOAT,false,28,0);
  gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,28,16);
  gl.bindVertexArray(null);
 }
 initConstellation(){
  // Seven physical parchment planes surrounding a central lectern. Connections
  // are genuine world-space line segments (not a decorative HTML background).
  const gl=this.g,verts=[];
  const p=this.items.map(it=>this.constellationPoint(it.i));
  const add=(a,b,r,g,bl)=>{verts.push(a[0],a[1],a[2],.5,r,g,bl,b[0],b[1],b[2],.5,r,g,bl)};
  for(let i=1;i<7;i++){
    add(p[0],p[i],.56,.35,.16);
    add(p[i],p[i===6?1:i+1],.14,.50,.53);
    for(let n=0;n<10;n++){const u=n/10,v=(n+1)/10;
      let a=p[i].map((c,k)=>c+(p[0][k]-c)*u),b=p[i].map((c,k)=>c+(p[0][k]-c)*v);
      add(a,b,.30,.30,.24);
    }
  }
  this.constellationVAO=gl.createVertexArray();gl.bindVertexArray(this.constellationVAO);
  let buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verts),gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,4,gl.FLOAT,false,28,0);
  gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,28,16);
  this.constellationCount=verts.length/7;gl.bindVertexArray(null);
 }
 constellationPoint(i){if(i===0)return [0,0,-12];const a=((i-1)/6)*Math.PI*2+Math.PI/6;return [Math.sin(a)*10.25,Math.cos(a)*5.55,-15.8+.7*Math.sin(a*2)];}
 vortexPoint(i){
  const a=(i*2*Math.PI/7)+this.vortexAngle+Math.PI*.14;
  const r=7.55+.75*Math.sin(i*2.4);
  return [Math.sin(a)*r,Math.cos(a)*5.30,-18.4+2.5*Math.cos(a+.65)-i*.34];
 }
 initVortexGeometry(){
  // Actual world-space helix filaments, physically surrounding the seven textures.
  const gl=this.g, v=[];
  const add=(a,b,r,g,bl)=>{v.push(...a,.2,r,g,bl,...b,.2,r,g,bl)};
  for(let strand=0;strand<5;strand++){
   const offset=strand*2*Math.PI/5;
   for(let k=0;k<700;k++){
    let at=(k/700)*Math.PI*4.25+offset;
    const p=ang=>[Math.sin(ang)*7.8,Math.cos(ang)*5.7,-26+14*(ang-offset)/(Math.PI*4.25)];
    add(p(at),p(at+Math.PI*4.25/700),strand%2?.14:.58,strand%2?.49:.38,strand%2?.52:.15);
   }
  }
  // Long, translucent observation chords and a radial meridian grid.
  for(let j=0;j<24;j++){
   let a=j*Math.PI/12;
   add([Math.sin(a)*.65,Math.cos(a)*.65,-19],[Math.sin(a)*10.2,Math.cos(a)*7.3,-19],.16,.35,.35);
  }
  this.vortexVAO=gl.createVertexArray();gl.bindVertexArray(this.vortexVAO);
  const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,4,gl.FLOAT,false,28,0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,28,16);
  this.vortexCount=v.length/7;gl.bindVertexArray(null);
 }
 thresholdPoint(i){
  // Deliberate giant spatial offset: pieces appear in different physical planes
  // inside the corridor, never as a flat carousel.
  return [Math.sin(i*.9+.5)*3.1, Math.cos(i*1.07+.3)*1.7, -7.2-i*6.8];
 }
 initThresholdGeometry(){
  const gl=this.g, v=[];
  const push=(a,b,ink)=>{v.push(...a,.38,...ink,...b,.38,...ink)};
  // 34 multi-plane elliptical gateways, astrolabe markings and connecting rays.
  for(let gate=0;gate<34;gate++){
   const z=2.8-gate*2.0, rx=5.7+Math.sin(gate*.31)*.54, ry=4.5+Math.cos(gate*.35)*.44;
   const phase=gate*.173;
   for(let k=0;k<140;k++){
    const f=(a)=>[Math.cos(a)*rx,Math.sin(a)*ry,z+Math.sin(a*2+phase)*.3];
    const a=phase+k*2*Math.PI/140, b=a+2*Math.PI/140;
    const gold=gate%4===0, ink=gold?[.59,.36,.145]:[.085,.33,.37];
    push(f(a),f(b),ink);
   }
   for(let spoke=0;spoke<12;spoke++){
    const a=phase+spoke*Math.PI/6;const c=[Math.cos(a)*rx,Math.sin(a)*ry,z],d=[Math.cos(a)*(rx+.22),Math.sin(a)*(ry+.22),z];
    push(c,d,[.64,.43,.21]);
   }
  }
  // Helical tracks vanish beyond the exit of the nave. The parallax is genuine.
  for(let h=0;h<9;h++){
   for(let k=0;k<600;k++){
    const p=(n)=>{const z=7.0-n*.12, a=n*.115+h*Math.PI*2/9;return [Math.cos(a)*6.05,Math.sin(a)*4.55,z]};
    push(p(k),p(k+1),h%3===0?[.43,.27,.12]:[.07,.26,.29]);
   }
  }
  this.thresholdVAO=gl.createVertexArray();gl.bindVertexArray(this.thresholdVAO);
  const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,4,gl.FLOAT,false,28,0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,28,16);
  this.thresholdCount=v.length/7;gl.bindVertexArray(null);
 }
 displayPoint(it){
  const cp=this.constellationPoint(it.i), f=this.overviewMix, g=this.vortexMix, u=this.thresholdMix, tp=this.thresholdPoint(it.i);
  const vp=this.vortexPoint(it.i);
  return {x:it.x*(1-f-g-u)+cp[0]*f+vp[0]*g+tp[0]*u,
    y:it.y*(1-f-g-u)+cp[1]*f+vp[1]*g+tp[1]*u,
    z:it.z*(1-f-g-u)+cp[2]*f+vp[2]*g+tp[2]*u,
    w:it.w*(1-.35*f-.48*g+.04*u),h:it.h*(1-.35*f-.48*g+.04*u)};
 }
 setSequence(v){this.sequence=!!v;this.pointer=[0,0]}
 setSequenceProgress(t){this.sequenceTravel=clamp(t,0,6)}
 setThreshold(v){this.threshold=!!v;this.pointer=[0,0]}
 setVortex(v){this.vortex=!!v;this.pointer=[0,0]}
 rotateVortex(delta){this.vortexAngleTarget+=delta}

 setOverview(v){this.overview=!!v;this.pointer=[0,0]}
 async load(progress){const gl=this.g;const promises=this.items.map(async(it,i)=>{let img=new Image();img.decoding='async';img.src=global.ILANOT_INLINE?.[i] || `assets/ilan-${String(i+1).padStart(2,'0')}.webp`;await img.decode();let t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.generateMipmap(gl.TEXTURE_2D);it.tex=t;progress?.((this.items.filter(a=>a.tex).length)/7);});await Promise.all(promises);}
 setIndex(i){this.target=clamp(i,0,6);this.index=this.target}
 setQuality(q){this.quality=q;this.resize()}
 setReduced(reduced){this.reduced=reduced;this.pointer=[0,0]}
 setCinema(value){this.cinema=!!value}
 resize(){let gl=this.g;let rect=this.canvas.getBoundingClientRect();this.w=Math.max(1,Math.round(rect.width));this.h=Math.max(1,Math.round(rect.height));const dpr=Math.min(window.devicePixelRatio||1,this.quality==='high'?1.7:1.05);let w=Math.round(this.w*dpr),h=Math.round(this.h*dpr);if(w!==this.canvas.width||h!==this.canvas.height){this.canvas.width=w;this.canvas.height=h}this.g.viewport(0,0,w,h);this.dpr=dpr;if(this.quality==='high')this.createTargets();}
 makeTarget(w,h){const gl=this.g;let t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);let fb=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);return{t,fb,w,h}}
 createTargets(){const gl=this.g;if(this.targets){for(let o of Object.values(this.targets)){gl.deleteFramebuffer(o.fb);gl.deleteTexture(o.t);if(o.rb)gl.deleteRenderbuffer(o.rb)}}let w=this.canvas.width,h=this.canvas.height;this.targets={scene:this.makeTarget(w,h),blurA:this.makeTarget(Math.max(2,Math.round(w/3)),Math.max(2,Math.round(h/3))),blurB:this.makeTarget(Math.max(2,Math.round(w/3)),Math.max(2,Math.round(h/3)))};let rb=gl.createRenderbuffer();gl.bindRenderbuffer(gl.RENDERBUFFER,rb);gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,w,h);gl.bindFramebuffer(gl.FRAMEBUFFER,this.targets.scene.fb);gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,rb);this.targets.scene.rb=rb;this.canBloom=gl.checkFramebufferStatus(gl.FRAMEBUFFER)===gl.FRAMEBUFFER_COMPLETE;gl.bindFramebuffer(gl.FRAMEBUFFER,null)}
 uniform(p,n,...v){const gl=this.g,loc=gl.getUniformLocation(p,n);if(loc===null)return;if(v.length===1)gl.uniform1f(loc,v[0]);else if(v.length===2)gl.uniform2f(loc,...v);else if(v.length===3)gl.uniform3f(loc,...v);}
 mat(p,n,m){this.g.uniformMatrix4fv(this.g.getUniformLocation(p,n),false,new Float32Array(m))}
 render(timestamp){const gl=this.g;let dt=Math.min(.05,(timestamp-(this.last||timestamp))/1000);this.last=timestamp;if(!this.reduced)this.time+=dt;
  let speed=this.reduced?22:2.2;this.progress+=(this.target-this.progress)*(1-Math.exp(-dt*speed));if(Math.abs(this.target-this.progress)<.001)this.progress=this.target;
  this.pointerSmooth[0]+=(this.pointer[0]-this.pointerSmooth[0])*(1-Math.exp(-dt*3));this.pointerSmooth[1]+=(this.pointer[1]-this.pointerSmooth[1])*(1-Math.exp(-dt*3));
  this.cinemaMix+=(Number(this.cinema)-this.cinemaMix)*(1-Math.exp(-dt*1.4));
  this.overviewMix+=(Number(this.overview)-this.overviewMix)*(1-Math.exp(-dt*(this.reduced?25:1.55)));
  this.vortexMix+=(Number(this.vortex)-this.vortexMix)*(1-Math.exp(-dt*(this.reduced?25:1.36)));
  this.thresholdMix+=(Number(this.threshold)-this.thresholdMix)*(1-Math.exp(-dt*(this.reduced?25:1.18)));
  this.sequenceMix+=(Number(this.sequence)-this.sequenceMix)*(1-Math.exp(-dt*(this.reduced?25:1.55)));
  if(this.sequence)this.target=this.sequenceTravel;
  if(this.vortex&&!this.reduced)this.vortexAngleTarget+=dt*.095;
  this.vortexAngle+=(this.vortexAngleTarget-this.vortexAngle)*(1-Math.exp(-dt*(this.reduced?25:2.5)));
  const center=this.positionAt(this.progress);const t=this.time;const mouse=this.reduced?[0,0]:this.pointerSmooth;
  const s=this.progress-Math.floor(this.progress),moving=Math.sin(s*3.14159);
  // Dollying between stations follows their curved 3D positions instead of
  // cross-fading still pictures. Cinema approaches the manuscript head-on.
  let eye=[center.x+.8+mouse[0]*.88+Math.sin(t*.12)*.34+moving*1.9,
           center.y+.24+mouse[1]*.48+Math.cos(t*.17)*.22+moving*.38,
           center.z+9.15+(center.w>5?.8:0)-moving*2.6];
  let aim=[center.x-1.25+mouse[0]*.22,center.y-.05+mouse[1]*.13,center.z-1.5];
  const ci=this.cinemaMix;
  eye[0]+=ci*(-.55+Math.sin(t*.17)*.7+mouse[0]*.5);
  eye[1]+=ci*(.03+Math.cos(t*.13)*.25);
  eye[2]+=ci*(1.7+moving*.8);
  aim[0]+=ci*(1.25+mouse[0]*.3);
  aim[2]+=ci*.85;
  if(this.w<750){eye[0]=center.x+.15+mouse[0]*.25;aim[0]=center.x-.2;eye[2]=center.z+13.4-ci*.4;aim[1]=center.y+1.15-ci*.7}
  // In constellation mode the camera retreats into the observatory to reveal
  // all seven originals together. Mouse inertia gives the architecture parallax.
  const ov=this.overviewMix,op=[mouse[0]*2.9+Math.sin(t*.07)*.5,mouse[1]*1.6,12.5],oa=[0,0,-14];
  eye=eye.map((n,k)=>n*(1-ov)+op[k]*ov);aim=aim.map((n,k)=>n*(1-ov)+oa[k]*ov);
  const vv=this.vortexMix;
  const ve=[mouse[0]*2.1+Math.sin(t*.12)*.85,mouse[1]*1.5,15.9],va=[0,0,-18.6];
  eye=eye.map((n,k)=>n*(1-vv)+ve[k]*vv);
  aim=aim.map((n,k)=>n*(1-vv)+va[k]*vv);
  // V0.7 gateway: physical fly-through, separate from existing film and vortex.
  const uu=this.thresholdMix;const gate=this.thresholdPoint(this.progress);
  const te=[Math.sin(this.progress*.45)*1.25+mouse[0]*.72, Math.cos(this.progress*.55)*.56+mouse[1]*.54,10.4-this.progress*6.8];
  const ta=[gate[0]*.65,gate[1]*.60,gate[2]-1.8];
  eye=eye.map((n,k)=>n*(1-uu)+te[k]*uu);aim=aim.map((n,k)=>n*(1-uu)+ta[k]*uu);
  // Sequence director's dolly: breathing focal length, gentle orbit, deliberate rack of depth.
  const ss=this.sequenceMix;
  const sp=this.progress;
  const se=[center.x+Math.sin(t*.31+sp*1.75)*1.45+mouse[0]*.29,center.y+Math.cos(t*.21+sp)*.58+mouse[1]*.16,center.z+(this.w<700?14.4:10.9)+Math.sin(t*.47)*.80];
  const sa=[center.x,center.y+.06,center.z-1.65];
  eye=eye.map((n,k)=>n*(1-ss)+se[k]*ss);aim=aim.map((n,k)=>n*(1-ss)+sa[k]*ss);
  let proj=perspective(((this.w<700?52:44)+ov*(this.w<700?21:5)+uu*(this.w<700?14:15)+ss*(this.w<700?10:6)+ss*Math.sin(t*.4)*2.0)*Math.PI/180,this.canvas.width/this.canvas.height,.18,200);
  let view=lookAt(eye,aim,[Math.sin(moving*.10)*(1-ov),1,0]);this.vp=mul(proj,view);this.eye=eye;
  let bloom=this.quality==='high'&&this.canBloom;
  if(bloom){gl.bindFramebuffer(gl.FRAMEBUFFER,this.targets.scene.fb);gl.viewport(0,0,this.targets.scene.w,this.targets.scene.h)}else{gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,this.canvas.width,this.canvas.height)}
  gl.disable(gl.BLEND);gl.disable(gl.DEPTH_TEST);gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(this.programs.space);gl.bindVertexArray(null);this.uniform(this.programs.space,'uTime',t);this.uniform(this.programs.space,'uAspect',this.w/this.h);this.uniform(this.programs.space,'uJourney',this.progress);this.uniform(this.programs.space,'uWarp',clamp(Math.abs(this.target-this.progress)*.7+uu*.55+ss*.21,0,1)*(1-this.overviewMix));this.uniform(this.programs.space,'uThreshold',uu);gl.drawArrays(gl.TRIANGLES,0,3);
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.enable(gl.DEPTH_TEST);gl.depthMask(false);
  // Spectral light curtains float BEHIND the original image geometry.
  gl.useProgram(this.programs.veil);gl.bindVertexArray(this.quadVAO);this.mat(this.programs.veil,'uVP',this.vp);
  this.items.forEach(it=>{const d=Math.abs(it.i-this.progress);if(d>2.25&&this.overviewMix<.01&&this.vortexMix<.01&&this.thresholdMix<.01)return;
    const p=this.displayPoint(it);
    this.mat(this.programs.veil,'uModel',translateRotate(p.x,p.y,p.z-1.5,.03,0));
    this.uniform(this.programs.veil,'uDims',p.w*1.3,p.h*1.15);this.uniform(this.programs.veil,'uTime',t);
    this.uniform(this.programs.veil,'uAlpha',clamp(1-d*.36,.1,1)*(1-this.overviewMix-this.vortexMix-this.thresholdMix)+this.overviewMix*.3+this.vortexMix*.35+this.thresholdMix*.60);this.uniform(this.programs.veil,'uSeed',it.seed);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4)});
  // Rings are world-space meshes: their parallax changes as the camera flies through the gallery.
  gl.useProgram(this.programs.ring);gl.bindVertexArray(this.quadVAO);this.mat(this.programs.ring,'uVP',this.vp);
  this.items.forEach(it=>{const d=Math.abs(it.i-this.progress);if((d>2.65||it.i<this.progress-.9)&&this.overviewMix<.01&&this.vortexMix<.01&&this.thresholdMix<.01)return;const p=this.displayPoint(it);let m=translateRotate(p.x,p.y,p.z-.75,0,0);this.mat(this.programs.ring,'uModel',m);this.uniform(this.programs.ring,'uDims',p.w,p.h);this.uniform(this.programs.ring,'uTime',t);this.uniform(this.programs.ring,'uAlpha',clamp(.78-d*.25,.06,1)*(1-this.overviewMix-this.vortexMix-this.thresholdMix)+.38*this.overviewMix+.35*this.vortexMix+.44*this.thresholdMix);this.uniform(this.programs.ring,'uSeed',it.seed);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)});
  // Fine physical filaments, at actual world positions and behind paper (depth-tested).
  if(this.quality==='high'&&this.overviewMix<.95&&this.vortexMix<.15&&this.thresholdMix<.1){
   gl.useProgram(this.programs.filament);gl.bindVertexArray(this.filamentVAO);this.mat(this.programs.filament,'uVP',this.vp);this.uniform(this.programs.filament,'uTime',t);
   gl.drawArrays(gl.LINES,0,this.filamentCount);
  }
  if(this.vortexMix>.01){
   gl.useProgram(this.programs.filament);gl.bindVertexArray(this.vortexVAO);
   this.mat(this.programs.filament,'uVP',this.vp);this.uniform(this.programs.filament,'uTime',t);
   gl.drawArrays(gl.LINES,0,this.vortexCount);
  }
  if(this.thresholdMix>.01){
   gl.useProgram(this.programs.filament);gl.bindVertexArray(this.thresholdVAO);
   this.mat(this.programs.filament,'uVP',this.vp);this.uniform(this.programs.filament,'uTime',t);
   gl.drawArrays(gl.LINES,0,this.thresholdCount);
  }
  if(this.overviewMix>.01){
   gl.useProgram(this.programs.filament);gl.bindVertexArray(this.constellationVAO);this.mat(this.programs.filament,'uVP',this.vp);this.uniform(this.programs.filament,'uTime',t);gl.drawArrays(gl.LINES,0,this.constellationCount);
  }
  gl.useProgram(this.programs.point);gl.bindVertexArray(this.pointVAO);this.mat(this.programs.point,'uVP',this.vp);this.uniform(this.programs.point,'uTime',t);this.uniform(this.programs.point,'uSize',this.quality==='high'?1.35:.9);gl.drawArrays(gl.POINTS,0,this.pointCount);
  gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(true);
  gl.useProgram(this.programs.paper);gl.bindVertexArray(this.paperVAO);this.mat(this.programs.paper,'uVP',this.vp);this.uniform(this.programs.paper,'uEye',...eye);this.uniform(this.programs.paper,'uTime',t);
  let ordered=[...this.items].sort((a,b)=>a.z-b.z);
  ordered.forEach(it=>{if(!it.tex)return;let d=Math.abs(it.i-this.progress);if((d>2.8||it.i<this.progress-.95)&&this.overviewMix<.01&&this.vortexMix<.01&&this.thresholdMix<.01)return;const p=this.displayPoint(it);
    let yaw=.19*Math.sin(it.i*1.7)+.12*Math.sin(t*.24+it.seed)+mouse[0]*.16;let roll=.035*Math.sin(t*.34+it.seed*3);
    let y=p.y+(this.reduced?0:.095*Math.sin(t*.61+it.seed));let m=translateRotate(p.x,y,p.z,yaw*(1-this.overviewMix*.78-this.vortexMix*.83-this.thresholdMix*.75),roll);
    this.mat(this.programs.paper,'uModel',m);this.uniform(this.programs.paper,'uDims',p.w,p.h);this.uniform(this.programs.paper,'uTime',t);this.uniform(this.programs.paper,'uSeed',it.seed);this.uniform(this.programs.paper,'uCurl',this.reduced?.035:.29);
    this.uniform(this.programs.paper,'uOpacity',clamp(1-d*.42,.12,1)*clamp(1-Math.max(0,this.progress-it.i)*1.1,0,1)*(1-this.overviewMix-this.vortexMix-this.thresholdMix)+this.overviewMix+this.vortexMix+this.thresholdMix);this.uniform(this.programs.paper,'uFocus',clamp(1-d,0,1)*(1-this.overviewMix-this.vortexMix-this.thresholdMix)+this.overviewMix+this.vortexMix+this.thresholdMix);this.uniform(this.programs.paper,'uDefocus',this.quality==='high'?clamp(d*.60,0,.90)*(1-this.overviewMix-this.vortexMix-this.thresholdMix):0);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,it.tex);gl.uniform1i(gl.getUniformLocation(this.programs.paper,'uTex'),0);gl.drawElements(gl.TRIANGLES,this.paperCount,gl.UNSIGNED_SHORT,0)});
  gl.bindVertexArray(null);gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);
  if(bloom)this.applyBloom();
 }
 positionAt(v){let a=Math.floor(clamp(v,0,6)),b=Math.min(6,a+1),s=clamp(v-a,0,1);s=s*s*(3-2*s);let A=this.items[a],B=this.items[b];return {x:A.x+(B.x-A.x)*s,y:A.y+(B.y-A.y)*s,z:A.z+(B.z-A.z)*s,w:A.w+(B.w-A.w)*s}}
 applyBloom(){let g=this.g,t=this.targets;
  const blur=(input,out,dir,threshold)=>{g.bindFramebuffer(g.FRAMEBUFFER,out.fb);g.viewport(0,0,out.w,out.h);g.useProgram(this.programs.blur);g.bindVertexArray(null);g.activeTexture(g.TEXTURE0);g.bindTexture(g.TEXTURE_2D,input.t);g.uniform1i(g.getUniformLocation(this.programs.blur,'uImage'),0);this.uniform(this.programs.blur,'uDirection',...dir);this.uniform(this.programs.blur,'uThreshold',threshold);g.drawArrays(g.TRIANGLES,0,3)};
  blur(t.scene,t.blurA,[1/t.scene.w,0],1);blur(t.blurA,t.blurB,[0,1/t.blurA.h],0);
  g.bindFramebuffer(g.FRAMEBUFFER,null);g.viewport(0,0,this.canvas.width,this.canvas.height);g.useProgram(this.programs.post);g.activeTexture(g.TEXTURE0);g.bindTexture(g.TEXTURE_2D,t.scene.t);g.uniform1i(g.getUniformLocation(this.programs.post,'uScene'),0);g.activeTexture(g.TEXTURE1);g.bindTexture(g.TEXTURE_2D,t.blurB.t);g.uniform1i(g.getUniformLocation(this.programs.post,'uGlow'),1);this.uniform(this.programs.post,'uBloom',.60);g.drawArrays(g.TRIANGLES,0,3);
 }
 start(){if(this.rendering)return;this.rendering=true;const frame=(t)=>{if(!this.rendering)return;this.render(t);requestAnimationFrame(frame)};requestAnimationFrame(frame)}
 stop(){this.rendering=false}
}
global.IlanotScene=IlanotScene;
})(window);
