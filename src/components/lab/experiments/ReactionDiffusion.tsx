import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

// Réaction-diffusion de Gray-Scott sur le GPU (textures flottantes en ping-pong),
// affichée en tramage Bayer 8×8 deux couleurs comme le reste du site.

const vert = /* glsl */ `#version 300 es
in vec2 p;
out vec2 uv;
void main(){ uv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

const simFrag = /* glsl */ `#version 300 es
precision highp float;
in vec2 uv;
out vec4 o;
uniform sampler2D S;
uniform vec2 px;
uniform float F, K;
uniform vec3 brush; // xy en uv, z = rayon (0 = inactif)
uniform float aspect;
void main(){
  vec2 c = texture(S, uv).rg;
  vec2 lap = -c
    + 0.2  * (texture(S, uv + vec2(px.x, 0.)).rg + texture(S, uv - vec2(px.x, 0.)).rg
            + texture(S, uv + vec2(0., px.y)).rg + texture(S, uv - vec2(0., px.y)).rg)
    + 0.05 * (texture(S, uv + px).rg + texture(S, uv - px).rg
            + texture(S, uv + vec2(px.x, -px.y)).rg + texture(S, uv + vec2(-px.x, px.y)).rg);
  float a = c.r, b = c.g, abb = a * b * b;
  a += 1.0 * lap.r - abb + F * (1.0 - a);
  b += 0.5 * lap.g + abb - (K + F) * b;
  if (brush.z > 0.0) {
    vec2 d = (uv - brush.xy) * vec2(aspect, 1.0);
    if (length(d) < brush.z) b = 0.9;
  }
  o = vec4(clamp(a, 0., 1.), clamp(b, 0., 1.), 0., 1.);
}`;

const showFrag = /* glsl */ `#version 300 es
precision highp float;
in vec2 uv;
out vec4 o;
uniform sampler2D S;
uniform float cell;
float b2(vec2 a){ a = floor(a); return fract(a.x / 2. + a.y * a.y * .75); }
float b4(vec2 a){ return b2(.5 * a) * .25 + b2(a); }
float b8(vec2 a){ return b4(.5 * a) * .25 + b2(a); }
void main(){
  vec2 ci = floor(gl_FragCoord.xy / cell);
  float v = texture(S, uv).g;
  float lum = smoothstep(0.08, 0.38, v);
  float on = step(b8(ci) + .5 / 64., lum);
  vec2 q = fract(gl_FragCoord.xy / cell) - .5;
  on *= step(length(q), .45);
  o = vec4(mix(vec3(5., 5., 5.) / 255., vec3(242., 242., 238.) / 255., on), 1.);
}`;

const PRESETS = {
  coral: { F: 0.0545, K: 0.062 },
  mitosis: { F: 0.0367, K: 0.0649 },
  maze: { F: 0.029, K: 0.057 },
} as const;
type Preset = keyof typeof PRESETS;

/**
 * Expérience : réaction-diffusion de Gray-Scott, semée à la souris.
 */
export const ReactionDiffusion: React.FC<{ className?: string }> = ({ className = '' }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const presetRef = useRef<Preset>('coral');
  const resetRef = useRef<() => void>(() => {});
  const [preset, setPreset] = useState<Preset>('coral');
  const [unsupported, setUnsupported] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'block h-full w-full touch-none';
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
    if (!gl || !gl.getExtension('EXT_color_buffer_float')) {
      setUnsupported(true);
      return;
    }
    wrap.appendChild(canvas);

    const compile = (fs: string) => {
      const prog = gl.createProgram()!;
      for (const [type, src] of [[gl.VERTEX_SHADER, vert], [gl.FRAGMENT_SHADER, fs]] as const) {
        const sh = gl.createShader(type)!;
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        gl.attachShader(prog, sh);
      }
      gl.bindAttribLocation(prog, 0, 'p');
      gl.linkProgram(prog);
      return prog;
    };
    const sim = compile(simFrag);
    const show = compile(showFrag);
    if (!gl.getProgramParameter(sim, gl.LINK_STATUS) || !gl.getProgramParameter(show, gl.LINK_STATUS)) {
      setUnsupported(true);
      canvas.remove();
      return;
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const U = {
      S: gl.getUniformLocation(sim, 'S'), px: gl.getUniformLocation(sim, 'px'), F: gl.getUniformLocation(sim, 'F'),
      K: gl.getUniformLocation(sim, 'K'), brush: gl.getUniformLocation(sim, 'brush'), aspect: gl.getUniformLocation(sim, 'aspect'),
      showS: gl.getUniformLocation(show, 'S'), cell: gl.getUniformLocation(show, 'cell'),
    };

    // Un texel de simulation = un point de trame à l'écran
    const CELL = 4;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 1, H = 1;
    let tex: WebGLTexture[] = [];
    let fbo: WebGLFramebuffer[] = [];
    let cur = 0;

    const seed = () => {
      const data = new Float32Array(W * H * 4);
      for (let i = 0; i < W * H; i++) data[i * 4] = 1;
      // Quelques germes aléatoires
      for (let n = 0; n < 9; n++) {
        const cx = Math.floor(W * (0.15 + Math.random() * 0.7));
        const cy = Math.floor(H * (0.15 + Math.random() * 0.7));
        const r = 2 + Math.floor(Math.random() * 4);
        for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
          const i = ((cy + y + H) % H) * W + ((cx + x + W) % W);
          data[i * 4 + 1] = 1;
        }
      }
      tex.forEach((t) => {
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, W, H, 0, gl.RGBA, gl.FLOAT, data);
      });
    };

    const alloc = () => {
      const r = wrap.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      const nw = Math.max(16, Math.round(canvas.width / (CELL * dpr)));
      const nh = Math.max(16, Math.round(canvas.height / (CELL * dpr)));
      if (nw === W && nh === H && tex.length) return;
      W = nw;
      H = nh;
      tex.forEach((t) => gl.deleteTexture(t));
      fbo.forEach((f) => gl.deleteFramebuffer(f));
      tex = [0, 1].map(() => {
        const t = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        return t;
      });
      seed();
      fbo = tex.map((t) => {
        const f = gl.createFramebuffer()!;
        gl.bindFramebuffer(gl.FRAMEBUFFER, f);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
        return f;
      });
    };
    alloc();
    resetRef.current = seed;

    const brush = { x: 0, y: 0, down: false };
    const toUv = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      brush.x = (e.clientX - r.left) / r.width;
      brush.y = 1 - (e.clientY - r.top) / r.height;
    };
    const onDown = (e: PointerEvent) => {
      brush.down = true;
      toUv(e);
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => toUv(e);
    const onUp = () => (brush.down = false);
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);

    const step = (n: number) => {
      gl.useProgram(sim);
      gl.viewport(0, 0, W, H);
      const { F, K } = PRESETS[presetRef.current];
      gl.uniform1f(U.F, F);
      gl.uniform1f(U.K, K);
      gl.uniform2f(U.px, 1 / W, 1 / H);
      gl.uniform1f(U.aspect, W / H);
      gl.uniform1i(U.S, 0);
      gl.activeTexture(gl.TEXTURE0);
      for (let i = 0; i < n; i++) {
        gl.uniform3f(U.brush, brush.x, brush.y, brush.down && i === 0 ? 0.035 : 0);
        gl.bindTexture(gl.TEXTURE_2D, tex[cur]);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo[1 - cur]);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        cur = 1 - cur;
      }
    };
    const draw = () => {
      gl.useProgram(show);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1i(U.showS, 0);
      gl.uniform1f(U.cell, CELL * dpr);
      gl.bindTexture(gl.TEXTURE_2D, tex[cur]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const ro = new ResizeObserver(() => {
      alloc();
      if (prefersReducedMotion) {
        step(2500);
        draw();
      }
    });
    ro.observe(wrap);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(wrap);

    let raf = 0;
    if (prefersReducedMotion) {
      // Pas d'animation : on calcule l'état final et on n'actualise qu'à l'interaction
      step(2500);
      draw();
      const redraw = () => {
        if (!brush.down) return;
        step(40);
        draw();
      };
      canvas.addEventListener('pointermove', redraw);
    } else {
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible) return;
        step(12);
        draw();
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    };
  }, [prefersReducedMotion]);

  const choose = (p: Preset) => {
    presetRef.current = p;
    setPreset(p);
    resetRef.current();
  };

  return (
    <div className={`relative h-full w-full ${className}`}>
      <div ref={wrapRef} className="absolute inset-0 cursor-crosshair" data-cursor="Seed" />
      {unsupported && (
        <p className="label absolute inset-0 flex items-center justify-center p-6 text-center">WebGL2 · float textures unsupported</p>
      )}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
        {(Object.keys(PRESETS) as Preset[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => choose(p)}
            aria-pressed={preset === p}
            className={`chip bg-ink/80 backdrop-blur-sm ${preset === p ? 'border-paper text-paper' : ''}`}
          >
            {p}
          </button>
        ))}
        <button type="button" onClick={() => resetRef.current()} className="chip bg-ink/80 backdrop-blur-sm">
          ↺
        </button>
      </div>
    </div>
  );
};

export default ReactionDiffusion;
