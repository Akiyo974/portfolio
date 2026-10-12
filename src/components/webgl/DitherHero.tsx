import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { onIntroDone } from '../../lib/motion';

// WebGL brut (sans three.js) : un simple triangle plein écran suffit pour ce shader
const vertex = /* glsl */ `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
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
  uniform vec3 uFocus; // portrait : centre (uv) + échelle mesurés dans la page ; z = 0 si inactif
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

    // placement : à droite sur grand écran ; en portrait, centrée dans le tiers haut
    // (au-dessus du titre) et un peu plus petite. Remonte au défilement.
    float aspect=uRes.x/uRes.y;
    bool portrait=aspect<1.2;
    if(portrait&&uFocus.z>0.0&&uCenter<0.5){
      uv=(uv-uFocus.xy)*uFocus.z;
    }else if(portrait){
      uv.y-=0.2*(uRes.y/uRes.x)*(1.0-uCenter);
      uv*=mix(1.3,1.0,uCenter);
    }else{
      uv.x-=(0.5*aspect-0.62)*(1.0-uCenter);
      uv.y-=0.1*(1.0-uCenter);
    }
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
      // mobile (sphère cadrée) : halo réduit, sinon sa trame forme une grille sous le texte
      if(uFocus.z>0.0) lum*=0.35;
      float star=step(0.997,fract(sin(dot(cell,vec2(12.9898,78.233)))*43758.5453));
      lum+=star*0.6*(0.5+0.5*sin(uTime*2.0+cell.x));
    }
    lum*=(1.0-uScroll*0.55)*(portrait&&uCenter<0.5?0.85:1.0);

    float threshold=bayer8(cell);
    float on=step(threshold,clamp(lum,0.0,1.0)*0.98);
    gl_FragColor=vec4(mix(uInk,uPaper,on),1.0);
  }
`;

type Uniforms = {
  uTime: number;
  uRes: [number, number];
  uMouse: [number, number];
  uHover: number;
  uScroll: number;
  uPixel: number;
  uIntro: number;
  uCenter: number;
  uFocus: [number, number, number];
};

const INK: [number, number, number] = [5 / 255, 5 / 255, 5 / 255];
const PAPER: [number, number, number] = [242 / 255, 242 / 255, 238 / 255];

/**
 * Lance la compilation du programme SANS lire son statut : lire COMPILE/LINK_STATUS
 * bloque le thread principal jusqu'à la fin de la compilation (des centaines de ms).
 */
const compileProgram = (gl: WebGLRenderingContext) => {
  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    return sh;
  };
  const vs = compile(gl.VERTEX_SHADER, vertex);
  const fs = compile(gl.FRAGMENT_SHADER, fragment);
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  return prog;
};

/**
 * Fond WebGL du hero : sphère organique tramée, interactive.
 */
const DitherHero: React.FC<{ className?: string; intro?: boolean; centered?: boolean; scrollLinked?: boolean }> = ({
  className = '',
  intro = true,
  centered = false,
  scrollLinked = true,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [fallback, setFallback] = useState(false);
  const introRef = useRef(intro);
  introRef.current = intro;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) {
      setFallback(true);
      return;
    }

    /** Démarre le rendu une fois le programme prêt ; renvoie la fonction de nettoyage. */
    const run = (prog: WebGLProgram): (() => void) => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      // Écran tactile : pas d'effet loupe, donc chaque point de trame = 1 pixel calculé,
      // agrandi en CSS (≈ 25 à 50× moins de calcul, rendu identique)
      const lowRes = isMobile || window.matchMedia('(hover: none)').matches;
      const CELL = 4;
      const dpr = lowRes ? 1 / CELL : Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.style.display = 'block';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      if (lowRes) canvas.style.imageRendering = 'pixelated';
      wrap.appendChild(canvas);

      // Triangle couvrant tout l'écran
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'position');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      const u = (name: string) => gl.getUniformLocation(prog, name);
      const L = {
        uTime: u('uTime'), uRes: u('uRes'), uMouse: u('uMouse'), uHover: u('uHover'), uScroll: u('uScroll'),
        uPixel: u('uPixel'), uIntro: u('uIntro'), uCenter: u('uCenter'), uFocus: u('uFocus'),
      };
      gl.uniform3fv(u('uInk'), INK);
      gl.uniform3fv(u('uPaper'), PAPER);

      const U: Uniforms = {
        uTime: 0,
        uRes: [1, 1],
        uMouse: [0.2, 0.1],
        uHover: 0,
        uScroll: 0,
        uPixel: lowRes ? 1 : 4 * dpr,
        uIntro: 0,
        uCenter: centered ? 1 : 0,
        uFocus: [0, 0, 0],
      };

      const draw = () => {
        gl.uniform1f(L.uTime, U.uTime);
        gl.uniform2fv(L.uRes, U.uRes);
        gl.uniform2fv(L.uMouse, U.uMouse);
        gl.uniform1f(L.uHover, U.uHover);
        gl.uniform1f(L.uScroll, U.uScroll);
        gl.uniform1f(L.uPixel, U.uPixel);
        gl.uniform1f(L.uIntro, U.uIntro);
        gl.uniform1f(L.uCenter, U.uCenter);
        gl.uniform3fv(L.uFocus, U.uFocus);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };

      const resize = () => {
        const { width, height } = wrap.getBoundingClientRect();
        canvas.width = Math.max(1, Math.round(width * dpr));
        canvas.height = Math.max(1, Math.round(height * dpr));
        gl.viewport(0, 0, canvas.width, canvas.height);
        U.uRes = [canvas.width, canvas.height];
        // Portrait : la sphère occupe l'espace libre au-dessus du titre ([data-sphere-bottom])
        U.uFocus = [0, 0, 0];
        const marker = wrap.parentElement?.querySelector<HTMLElement>('[data-sphere-bottom]');
        if (!centered && marker && width / height < 1.2) {
          const bandTop = 16;
          const band = marker.getBoundingClientRect().top - wrap.getBoundingClientRect().top - 12 - bandTop;
          if (band > 90) {
            const m = Math.min(width, height);
            const visible = Math.min(band * 0.4, width * 0.3);
            // 0.32 ≈ rayon de la partie éclairée (visible) de la sphère entièrement déployée, en uv, à l'échelle 1 (mesuré)
            U.uFocus = [0, (0.5 * height - (bandTop + band / 2)) / m, 0.32 / (visible / m)];
          } else {
            // Petit écran sans espace libre : sphère hors champ, seul le champ d'étoiles reste
            U.uFocus = [0, 10, 1];
          }
        }
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(wrap);
      // Le titre se met en place après le chargement des polices et l'intro : on remesure
      void document.fonts?.ready.then(resize);
      let remeasure = 0;
      const offIntro = onIntroDone(() => {
        remeasure = window.setTimeout(resize, 1600); // après l'apparition du titre (~1,1 s + délais)
      });

      // Souris (lissée) en coordonnées -1..1
      const target: [number, number] = [0.2, 0.1];
      let hoverTarget = 0;
      const onMove = (e: PointerEvent) => {
        const r = wrap.getBoundingClientRect();
        target[0] = ((e.clientX - r.left) / r.width) * 2 - 1;
        target[1] = -(((e.clientY - r.top) / r.height) * 2 - 1);
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

      // Hors du hero (ex. Lab), la sphère ne se dissout pas au défilement
      const scrollRatio = () => (scrollLinked ? Math.min(1, Math.max(0, window.scrollY / (wrap.offsetHeight || 1))) : 0);

      const cleanup = () => {
        offIntro();
        window.clearTimeout(remeasure);
        window.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerleave', onLeave);
        ro.disconnect();
        io.disconnect();
        gl.deleteBuffer(buf);
        gl.deleteProgram(prog);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        canvas.remove();
      };

      if (prefersReducedMotion) {
        U.uIntro = 1;
        U.uTime = 4;
        draw();
        const onScroll = () => {
          U.uScroll = scrollRatio();
          draw();
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
          window.removeEventListener('scroll', onScroll);
          cleanup();
        };
      }

      let raf = 0;
      const start = performance.now();
      let last = 0;
      const render = (now: number) => {
        raf = requestAnimationFrame(render);
        if (!visible) return;
        // 30 images/s suffisent sur mobile (économie de batterie)
        if (lowRes && now - last < 32) return;
        last = now;
        U.uTime = (now - start) / 1000;
        U.uMouse = [U.uMouse[0] + (target[0] - U.uMouse[0]) * 0.06, U.uMouse[1] + (target[1] - U.uMouse[1]) * 0.06];
        U.uHover += (hoverTarget - U.uHover) * 0.04;
        U.uIntro += ((introRef.current ? 1 : 0) - U.uIntro) * 0.035;
        U.uScroll = scrollRatio();
        draw();
      };
      raf = requestAnimationFrame(render);

      return () => {
        cancelAnimationFrame(raf);
        cleanup();
      };
    };

    // Compilation lancée quand le navigateur est libre (après le premier affichage),
    // puis attendue sans bloquer grâce à KHR_parallel_shader_compile si disponible.
    let disposed = false;
    let stop: (() => void) | undefined;
    let poll = 0;
    const parallel = gl.getExtension('KHR_parallel_shader_compile');
    const boot = () => {
      if (disposed) return;
      const prog = compileProgram(gl);
      if (!prog) {
        setFallback(true);
        return;
      }
      const ready = () => {
        if (disposed) return;
        if (parallel && !gl.getProgramParameter(prog, parallel.COMPLETION_STATUS_KHR)) {
          poll = requestAnimationFrame(ready);
          return;
        }
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
          setFallback(true);
          return;
        }
        stop = run(prog);
      };
      ready();
    };
    const hasIdle = typeof window.requestIdleCallback === 'function';
    const idle = hasIdle ? window.requestIdleCallback(boot, { timeout: 1500 }) : window.setTimeout(boot, 300);

    return () => {
      disposed = true;
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cancelAnimationFrame(poll);
      if (stop) stop();
      else gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [prefersReducedMotion, centered, scrollLinked]);

  return (
    <div ref={wrapRef} className={`absolute inset-0 ${className}`} aria-hidden="true">
      {fallback && (
        <img src="/assets/art/globe-halftone.png" alt="" className="h-full w-full object-cover object-right opacity-70" />
      )}
    </div>
  );
};

export default DitherHero;
