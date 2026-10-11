import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Sphère organique raymarchée + tramage ordonné (Bayer 8x8).
// La souris agit comme une loupe : la trame s'affine autour du curseur.
const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uScroll;
  uniform float uPixel;
  uniform float uIntro;
  uniform float uCenter;
  uniform vec3 uInk;
  uniform vec3 uPaper;

  // --- Bruit simplex 3D (Ashima Arts, MIT) ---
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  // --- Bayer sans opérations binaires ---
  float bayer2(vec2 a){a=floor(a);return fract(a.x/2.0+a.y*a.y*0.75);}
  float bayer4(vec2 a){return bayer2(0.5*a)*0.25+bayer2(a);}
  float bayer8(vec2 a){return bayer4(0.5*a)*0.25+bayer2(a);}

  mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}

  float map(vec3 p){
    p.xz*=rot(uTime*0.12+uMouse.x*0.9);
    p.yz*=rot(uMouse.y*0.6-0.2);
    float n=snoise(p*1.25+vec3(0.0,0.0,uTime*0.18));
    n+=0.5*snoise(p*2.6-vec3(uTime*0.1));
    float radius=mix(0.08,0.62,uIntro)*(1.0-uScroll*0.3);
    return length(p)-radius-0.11*n*(0.6+uHover*0.7);
  }

  vec3 normalAt(vec3 p){
    const vec2 k=vec2(1.0,-1.0);
    const float h=0.0015;
    return normalize(k.xyy*map(p+k.xyy*h)+k.yyx*map(p+k.yyx*h)+k.yxy*map(p+k.yxy*h)+k.xxx*map(p+k.xxx*h));
  }

  void main(){
    vec2 frag=gl_FragCoord.xy;
    vec2 mousePx=(uMouse*0.5+0.5)*uRes;
    float dm=length(frag-mousePx)/uRes.y;
    // loupe : trame plus fine près du curseur
    float px=floor(uPixel*mix(0.34,1.0,smoothstep(0.04,0.22,dm/(0.4+uHover*0.6))));
    px=max(px,1.0);
    vec2 cell=floor(frag/px);
    vec2 c=(cell+0.5)*px;
    vec2 uv=(c-0.5*uRes)/min(uRes.x,uRes.y);

    // placement : légèrement à droite sur grand écran, remonte au défilement
    float aspect=uRes.x/uRes.y;
    bool portrait=aspect<1.2;
    uv.x-=(portrait?0.32:0.5*aspect-0.62)*(1.0-uCenter);
    uv.y-=(portrait?0.5*uRes.y/uRes.x-0.95:0.1)*(1.0-uCenter);
    uv.y+=uScroll*0.45;

    vec3 ro=vec3(0.0,0.0,3.1);
    vec3 rd=normalize(vec3(uv,-1.75));
    float t=0.0;
    float hit=0.0;
    for(int i=0;i<44;i++){
      vec3 p=ro+rd*t;
      float d=map(p);
      if(d<0.002){hit=1.0;break;}
      t+=d*0.9;
      if(t>6.0)break;
    }

    float lum;
    if(hit>0.5){
      vec3 p=ro+rd*t;
      vec3 n=normalAt(p);
      vec3 l=normalize(vec3(uMouse.x*1.4-0.6,uMouse.y*1.2+0.7,0.9));
      float diff=max(dot(n,l),0.0);
      float rim=pow(1.0-max(dot(n,-rd),0.0),3.0);
      float bands=0.08*sin(dot(p,vec3(9.0,7.0,5.0))+uTime*0.6);
      lum=0.03+diff*0.8+rim*0.3+bands;
    } else {
      // halo + champ d'étoiles tramé
      float r=length(uv);
      lum=max(0.0,0.14*exp(-r*2.2)-0.06);
      float star=step(0.997,fract(sin(dot(cell,vec2(12.9898,78.233)))*43758.5453));
      lum+=star*0.6*(0.5+0.5*sin(uTime*2.0+cell.x));
    }
    lum*=(1.0-uScroll*0.55)*(portrait&&uCenter<0.5?0.4:1.0);

    float threshold=bayer8(cell);
    float on=step(threshold,clamp(lum,0.0,1.0)*0.98);
    gl_FragColor=vec4(mix(uInk,uPaper,on),1.0);
  }
`;

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

/**
 * Fond WebGL du hero : sphère organique tramée, interactive.
 */
const DitherHero: React.FC<{ className?: string; intro?: boolean; centered?: boolean }> = ({
  className = '',
  intro = true,
  centered = false,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [fallback, setFallback] = useState(false);
  const introRef = useRef(intro);
  introRef.current = intro;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (!hasWebGL()) {
      setFallback(true);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
    } catch {
      setFallback(true);
      return;
    }

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    // Écran tactile : pas d'effet loupe, donc chaque point de trame = 1 pixel calculé,
    // agrandi en CSS (≈ 25 à 50× moins de calcul, rendu identique)
    const lowRes = isMobile || window.matchMedia('(hover: none)').matches;
    const CELL = 5;
    const dpr = lowRes ? 1 / CELL : Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    if (lowRes) renderer.domElement.style.imageRendering = 'pixelated';
    wrap.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.2, 0.1) },
      uHover: { value: 0 },
      uScroll: { value: 0 },
      uPixel: { value: lowRes ? 1 : 4 * dpr },
      uIntro: { value: 0 },
      uCenter: { value: centered ? 1 : 0 },
      uInk: { value: new THREE.Color('#050505') },
      uPaper: { value: new THREE.Color('#f2f2ee') },
    };
    const material = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms });
    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));

    const resize = () => {
      const { width, height } = wrap.getBoundingClientRect();
      renderer.setSize(width, height, false);
      uniforms.uRes.value.set(width * dpr, height * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // Souris (lissée) en coordonnées -1..1
    const target = new THREE.Vector2(0.2, 0.1);
    let hoverTarget = 0;
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      target.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
      hoverTarget = 1;
    };
    const onLeave = () => {
      hoverTarget = 0;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(wrap);

    let raf = 0;
    const start = performance.now();
    let last = 0;
    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      if (!visible) return;
      // 30 images/s suffisent sur mobile (économie de batterie)
      if (lowRes && now - last < 32) return;
      last = now;
      const t = (now - start) / 1000;
      uniforms.uTime.value = prefersReducedMotion ? 4 : t;
      uniforms.uMouse.value.lerp(target, 0.06);
      uniforms.uHover.value += (hoverTarget - uniforms.uHover.value) * 0.04;
      const introTarget = introRef.current ? 1 : 0;
      uniforms.uIntro.value += (introTarget - uniforms.uIntro.value) * 0.035;
      const h = wrap.offsetHeight || 1;
      uniforms.uScroll.value = Math.min(1, Math.max(0, window.scrollY / h));
      renderer.render(scene, camera);
    };

    if (prefersReducedMotion) {
      uniforms.uIntro.value = 1;
      uniforms.uTime.value = 4;
      renderer.render(scene, camera);
      const onScroll = () => {
        uniforms.uScroll.value = Math.min(1, window.scrollY / (wrap.offsetHeight || 1));
        renderer.render(scene, camera);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerleave', onLeave);
        ro.disconnect();
        io.disconnect();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      ro.disconnect();
      io.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [prefersReducedMotion, centered]);

  return (
    <div ref={wrapRef} className={`absolute inset-0 ${className}`} aria-hidden="true">
      {fallback && (
        <img src="/assets/art/globe-halftone.png" alt="" className="h-full w-full object-cover object-right opacity-70" />
      )}
    </div>
  );
};

export default DitherHero;
