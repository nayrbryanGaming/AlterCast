/* ═══════════════════════════════════════════════════════════
   AlterCast — Atmosphere Layer
   • Background canvas: radial gradient, grid, mouse parallax
   • Particles canvas: rising sparkles, color reactive to emotion
═══════════════════════════════════════════════════════════ */

import { store, EMOTIONS } from "./store.js";

export class Atmosphere {
  constructor(bgCanvas, partCanvas) {
    this.bgCanvas = bgCanvas;
    this.bgCtx = bgCanvas.getContext("2d");
    this.partCanvas = partCanvas;
    this.partCtx = partCanvas.getContext("2d");
    this.parts = [];
    this.mouse = { tx: 0, ty: 0, x: 0, y: 0 };

    this.resize();
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("mousemove", (e) => {
      this.mouse.tx = e.clientX;
      this.mouse.ty = e.clientY;
    });

    this._initParticles();
  }

  resize() {
    [this.bgCanvas, this.partCanvas].forEach(c => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    });
  }

  _initParticles() {
    this.parts.length = 0;
    const w = this.partCanvas.width || window.innerWidth;
    const h = this.partCanvas.height || window.innerHeight;
    for (let i = 0; i < 100; i++) {
      this.parts.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: -Math.random() * 0.35 - 0.08,
        r: Math.random() * 2.2 + 0.4,
        op: Math.random() * 0.55 + 0.2,
        life: Math.random() * 180,
        maxLife: Math.random() * 200 + 120,
      });
    }
  }

  render(t) {
    this.mouse.x += (this.mouse.tx - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.ty - this.mouse.y) * 0.06;
    if (store.get("gridBackground")) this._drawBG(t);
    else this.bgCtx.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
    if (store.get("particles")) this._drawParts(t);
    else this.partCtx.clearRect(0, 0, this.partCanvas.width, this.partCanvas.height);
  }

  _drawBG(t) {
    const c = this.bgCanvas, x = this.bgCtx;
    const w = c.width, h = c.height;

    const g = x.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
    g.addColorStop(0, "#0D1525");
    g.addColorStop(1, "#080A0F");
    x.fillStyle = g;
    x.fillRect(0, 0, w, h);

    x.strokeStyle = "rgba(255,255,255,.022)";
    x.lineWidth = 1;
    const gs = 38;
    const ox = (this.mouse.x * 0.05 % gs + gs) % gs;
    const oy = (this.mouse.y * 0.05 % gs + gs) % gs;
    for (let xx = -gs + ox; xx < w + gs; xx += gs) {
      x.beginPath();
      x.moveTo(xx, 0);
      x.lineTo(xx, h);
      x.stroke();
    }
    for (let yy = -gs + oy; yy < h + gs; yy += gs) {
      x.beginPath();
      x.moveTo(0, yy);
      x.lineTo(w, yy);
      x.stroke();
    }

    /* Bottom accent gradient */
    const bot = x.createLinearGradient(0, h * 0.55, 0, h);
    bot.addColorStop(0, "rgba(0,0,0,0)");
    bot.addColorStop(1, "rgba(0,90,140,.16)");
    x.fillStyle = bot;
    x.fillRect(0, 0, w, h);

    /* Horizon line */
    x.strokeStyle = "rgba(0,212,255,.04)";
    x.lineWidth = 1;
    x.beginPath();
    x.moveTo(0, h * 0.78);
    x.lineTo(w, h * 0.78);
    x.stroke();
  }

  _drawParts(t) {
    const x = this.partCtx;
    x.clearRect(0, 0, this.partCanvas.width, this.partCanvas.height);

    const emoCfg = EMOTIONS[store.get("emotion")] || EMOTIONS.idle;
    const c = emoCfg.rimRGB;
    const colStr = `${Math.floor(c[0] * 255)},${Math.floor(c[1] * 255)},${Math.floor(c[2] * 255)}`;

    for (const p of this.parts) {
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      if (p.y < -8 || p.life > p.maxLife) {
        p.x = Math.random() * this.partCanvas.width;
        p.y = this.partCanvas.height + 8;
        p.life = 0;
        p.maxLife = Math.random() * 200 + 120;
        p.vy = -Math.random() * 0.35 - 0.08;
      }
      const a = Math.sin(p.life / p.maxLife * Math.PI) * p.op * emoCfg.partA;
      x.beginPath();
      x.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      x.fillStyle = `rgba(${colStr},${Math.min(1, a)})`;
      x.fill();
      if (p.r > 1.5) {
        x.beginPath();
        x.arc(p.x, p.y, p.r * 2.8, 0, Math.PI * 2);
        x.fillStyle = `rgba(${colStr},${Math.min(1, a) * 0.12})`;
        x.fill();
      }
    }
  }
}
