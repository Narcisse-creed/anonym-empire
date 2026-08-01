import React, { useEffect, useRef } from 'react';

// Compact 3D Simplex Noise Field
class SimplexNoise {
  private p: Uint8Array;
  private perm: Uint8Array;
  private permMod12: Uint8Array;
  private grad3 = new Float32Array([
    1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0,
    1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1,
    0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1
  ]);

  constructor() {
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 0; i < 255; i++) {
      const r = i + ~~(Math.random() * (256 - i));
      const aux = p[i];
      p[i] = p[r];
      p[r] = aux;
    }
    this.p = p;
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  noise3D(x: number, y: number, z: number): number {
    const { permMod12, perm, grad3 } = this;
    let n0 = 0, n1 = 0, n2 = 0, n3 = 0;
    const s = (x + y + z) / 3;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const k = Math.floor(z + s);
    const t = (i + j + k) * (1 / 6);
    const X0 = i - t;
    const Y0 = j - t;
    const Z0 = k - t;
    const x0 = x - X0;
    const y0 = y - Y0;
    const z0 = z - Z0;

    let i1: number, j1: number, k1: number;
    let i2: number, j2: number, k2: number;

    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }

    const x1 = x0 - i1 + 1 / 6;
    const y1 = y0 - j1 + 1 / 6;
    const z1 = z0 - k1 + 1 / 6;
    const x2 = x0 - i2 + 1 / 3;
    const y2 = y0 - j2 + 1 / 3;
    const z2 = z0 - k2 + 1 / 3;
    const x3 = x0 - 1 + 0.5;
    const y3 = y0 - 1 + 0.5;
    const z3 = z0 - 1 + 0.5;

    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 >= 0) {
      const gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
      t0 *= t0;
      n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
    }

    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 >= 0) {
      const gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
      t1 *= t1;
      n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
    }

    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 >= 0) {
      const gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
      t2 *= t2;
      n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
    }

    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 >= 0) {
      const gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
      t3 *= t3;
      n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
    }

    return 32 * (n0 + n1 + n2 + n3);
  }
}

const TAU = 2 * Math.PI;
const rand = (n: number) => n * Math.random();
const fadeInOut = (t: number, m: number) => {
  const hm = 0.5 * m;
  return Math.abs((t + hm) % m - hm) / hm;
};
const lerp = (n1: number, n2: number, speed: number) => (1 - speed) * n1 + speed * n2;

export const SwirlBackgroundAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvasA = document.createElement('canvas');
    const canvasB = document.createElement('canvas');
    canvasB.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `;
    container.appendChild(canvasB);

    const ctxA = canvasA.getContext('2d');
    const ctxB = canvasB.getContext('2d');
    if (!ctxA || !ctxB) return;

    let animId: number;
    let tick = 0;
    const simplex = new SimplexNoise();

    const particleCount = 800;
    const particlePropCount = 9;
    const particlePropsLength = particleCount * particlePropCount;
    const particleProps = new Float32Array(particlePropsLength);

    const baseTTL = 70;
    const rangeTTL = 180;
    const baseSpeed = 0.2;
    const rangeSpeed = 2.4;
    const baseRadius = 1.5;
    const rangeRadius = 4.5;

    const noiseSteps = 8;
    const xOff = 0.0012;
    const yOff = 0.0012;
    const zOff = 0.0006;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      canvasA.width = width;
      canvasA.height = height;

      canvasB.width = width;
      canvasB.height = height;
    };

    resize();

    const initParticle = (i: number, initialRandomLife = false) => {
      const x = rand(width);
      const y = rand(height); // Distributed across full screen height
      const vx = 0;
      const vy = 0;
      const ttl = baseTTL + rand(rangeTTL);
      const life = initialRandomLife ? Math.floor(rand(ttl)) : 0;
      const speed = baseSpeed + rand(rangeSpeed);
      const radius = baseRadius + rand(rangeRadius);
      
      // Vibrant pink/magenta/purple/cyan spectrum from Webflow Swirl + Royal Gold
      const colorRoll = Math.random();
      let hue: number;
      if (colorRoll < 0.35) {
        // Magenta / Pink (280 - 330)
        hue = 280 + rand(50);
      } else if (colorRoll < 0.65) {
        // Cyan / Blue (190 - 240)
        hue = 190 + rand(50);
      } else {
        // Imperial Gold / Amber (35 - 55)
        hue = 38 + rand(17);
      }

      particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
    };

    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      initParticle(i, true);
    }

    const drawParticle = (
      x: number,
      y: number,
      x2: number,
      y2: number,
      life: number,
      ttl: number,
      radius: number,
      hue: number
    ) => {
      ctxA.save();
      ctxA.lineCap = 'round';
      ctxA.lineWidth = radius;
      ctxA.strokeStyle = `hsla(${hue}, 95%, 65%, ${fadeInOut(life, ttl)})`;
      ctxA.beginPath();
      ctxA.moveTo(x, y);
      ctxA.lineTo(x2, y2);
      ctxA.stroke();
      ctxA.restore();
    };

    const updateParticle = (i: number) => {
      const i2 = 1 + i, i3 = 2 + i, i4 = 3 + i, i5 = 4 + i, i6 = 5 + i, i7 = 6 + i, i8 = 7 + i, i9 = 8 + i;

      let x = particleProps[i];
      let y = particleProps[i2];
      const n = simplex.noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;
      const vx = lerp(particleProps[i3], Math.cos(n), 0.5);
      const vy = lerp(particleProps[i4], Math.sin(n), 0.5);
      let life = particleProps[i5];
      const ttl = particleProps[i6];
      const speed = particleProps[i7];
      const x2 = x + vx * speed;
      const y2 = y + vy * speed;
      const radius = particleProps[i8];
      const hue = particleProps[i9];

      drawParticle(x, y, x2, y2, life, ttl, radius, hue);

      life++;

      particleProps[i] = x2;
      particleProps[i2] = y2;
      particleProps[i3] = vx;
      particleProps[i4] = vy;
      particleProps[i5] = life;

      if (x2 > width || x2 < 0 || y2 > height || y2 < 0 || life > ttl) {
        initParticle(i, false);
      }
    };

    const renderGlow = () => {
      ctxB.save();
      ctxB.filter = 'blur(10px) brightness(220%)';
      ctxB.globalCompositeOperation = 'lighter';
      ctxB.drawImage(canvasA, 0, 0);
      ctxB.restore();

      ctxB.save();
      ctxB.filter = 'blur(4px) brightness(200%)';
      ctxB.globalCompositeOperation = 'lighter';
      ctxB.drawImage(canvasA, 0, 0);
      ctxB.restore();
    };

    const renderToScreen = () => {
      ctxB.save();
      ctxB.globalCompositeOperation = 'lighter';
      ctxB.drawImage(canvasA, 0, 0);
      ctxB.restore();
    };

    const render = () => {
      tick++;

      ctxA.clearRect(0, 0, width, height);

      // Semi-transparent dark background for dynamic particle trails
      ctxB.fillStyle = 'rgba(5, 5, 10, 0.25)';
      ctxB.fillRect(0, 0, width, height);

      for (let i = 0; i < particlePropsLength; i += particlePropCount) {
        updateParticle(i);
      }

      renderGlow();
      renderToScreen();

      animId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
      if (canvasB.parentNode) {
        canvasB.parentNode.removeChild(canvasB);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ background: '#050509' }}
    >
      {/* Dynamic Ambient Blur Glow Orbs */}
      <div className="absolute top-1/4 left-10 w-[600px] h-[600px] bg-[#d946ef]/20 rounded-full blur-[160px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[650px] h-[650px] bg-[#3b82f6]/20 rounded-full blur-[170px] animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-[#d4af37]/15 rounded-full blur-[150px] animate-pulse pointer-events-none" />
    </div>
  );
};
