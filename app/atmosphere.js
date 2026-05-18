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

    /* ── Dinding studio belakang — gradient hangat ── */
    const wall = x.createLinearGradient(0, 0, 0, h * 0.75);
    wall.addColorStop(0, "#0e1520");
    wall.addColorStop(0.5, "#111a2a");
    wall.addColorStop(1, "#0a1018");
    x.fillStyle = wall;
    x.fillRect(0, 0, w, h);

    /* ── Spotlight dari atas tengah (broadcast key light) ── */
    const spot = x.createRadialGradient(w * 0.5, 0, 0, w * 0.5, h * 0.3, w * 0.55);
    spot.addColorStop(0, "rgba(60,100,160,.22)");
    spot.addColorStop(0.5, "rgba(30,60,110,.10)");
    spot.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = spot;
    x.fillRect(0, 0, w, h);

    /* ── Rak produk kiri & kanan (silhouette studio shelf) ── */
    this._drawShelf(x, w * 0.04, h * 0.18, w * 0.14, h, t, "left");
    this._drawShelf(x, w * 0.82, h * 0.18, w * 0.14, h, t, "right");

    /* ── Lantai studio — perspektif reflection ── */
    const floor = x.createLinearGradient(0, h * 0.72, 0, h);
    floor.addColorStop(0, "#0a0e18");
    floor.addColorStop(0.4, "#0d1422");
    floor.addColorStop(1, "#06090f");
    x.fillStyle = floor;
    x.fillRect(0, h * 0.72, w, h * 0.28);

    /* Garis perspektif lantai */
    x.strokeStyle = "rgba(0,180,255,.055)";
    x.lineWidth = 1;
    const vp = { x: w * 0.5, y: h * 0.72 };
    const lanes = 10;
    for (let i = 0; i <= lanes; i++) {
      const bx = (i / lanes) * w;
      x.beginPath();
      x.moveTo(vp.x, vp.y);
      x.lineTo(bx, h);
      x.stroke();
    }
    /* Horizontal grid lines on floor */
    for (let row = 1; row <= 5; row++) {
      const fy = vp.y + (h - vp.y) * (row / 5);
      const blend = row / 5;
      x.strokeStyle = `rgba(0,180,255,${0.04 * (1 - blend)})`;
      x.beginPath();
      x.moveTo(0, fy);
      x.lineTo(w, fy);
      x.stroke();
    }

    /* ── Glow lantai bawah avatar ── */
    const floorGlow = x.createRadialGradient(w * 0.5, h * 0.78, 0, w * 0.5, h * 0.78, w * 0.2);
    floorGlow.addColorStop(0, "rgba(0,200,255,.14)");
    floorGlow.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = floorGlow;
    x.fillRect(w * 0.2, h * 0.65, w * 0.6, h * 0.35);

    /* ── Accent light kiri-kanan ── */
    const lR = x.createRadialGradient(0, h * 0.5, 0, 0, h * 0.5, w * 0.35);
    lR.addColorStop(0, "rgba(100,60,255,.10)");
    lR.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = lR;
    x.fillRect(0, 0, w * 0.4, h);

    const rR = x.createRadialGradient(w, h * 0.5, 0, w, h * 0.5, w * 0.35);
    rR.addColorStop(0, "rgba(0,180,255,.10)");
    rR.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = rR;
    x.fillRect(w * 0.6, 0, w * 0.4, h);

    /* ── Horizon line separator dinding/lantai ── */
    const hl = x.createLinearGradient(w * 0.15, 0, w * 0.85, 0);
    hl.addColorStop(0, "rgba(0,200,255,0)");
    hl.addColorStop(0.2, "rgba(0,200,255,.25)");
    hl.addColorStop(0.8, "rgba(0,200,255,.25)");
    hl.addColorStop(1, "rgba(0,200,255,0)");
    x.strokeStyle = hl;
    x.lineWidth = 1.5;
    x.beginPath();
    x.moveTo(w * 0.15, h * 0.72);
    x.lineTo(w * 0.85, h * 0.72);
    x.stroke();
  }

  _drawShelf(x, sx, sy, sw, h, t, side) {
    const shelfH = h * 0.55;
    /* Rak panel */
    const shelfGrad = x.createLinearGradient(sx, 0, sx + sw, 0);
    if (side === "left") {
      shelfGrad.addColorStop(0, "rgba(20,35,60,.9)");
      shelfGrad.addColorStop(1, "rgba(12,22,40,.4)");
    } else {
      shelfGrad.addColorStop(0, "rgba(12,22,40,.4)");
      shelfGrad.addColorStop(1, "rgba(20,35,60,.9)");
    }
    x.fillStyle = shelfGrad;
    x.fillRect(sx, sy, sw, shelfH);

    /* Shelf lines */
    const shelves = 4;
    for (let i = 1; i <= shelves; i++) {
      const ly = sy + (shelfH / shelves) * i;
      x.strokeStyle = "rgba(0,180,255,.18)";
      x.lineWidth = 1;
      x.beginPath();
      x.moveTo(sx, ly);
      x.lineTo(sx + sw, ly);
      x.stroke();
    }

    /* Product boxes on shelves */
    const boxColors = [
      "rgba(0,200,255,.4)", "rgba(120,60,255,.4)", "rgba(255,160,0,.35)",
      "rgba(0,255,120,.3)", "rgba(255,80,80,.3)",
    ];
    for (let i = 0; i < shelves; i++) {
      const ly = sy + (shelfH / shelves) * i + 4;
      const numBoxes = 1 + (i % 2);
      for (let b = 0; b < numBoxes; b++) {
        const bx = sx + (b * sw * 0.55) + sw * 0.05;
        const bw = sw * 0.38;
        const bh = (shelfH / shelves) - 10;
        const col = boxColors[(i * 2 + b) % boxColors.length];
        const pulse = 0.85 + Math.sin(t * 0.8 + i + b) * 0.12;
        x.globalAlpha = pulse;
        x.fillStyle = col;
        x.fillRect(bx, ly, bw, bh);
        /* Price tag glow */
        x.fillStyle = "rgba(255,255,255,.65)";
        x.fillRect(bx + 2, ly + bh - 10, bw - 4, 8);
        x.globalAlpha = 1;
      }
    }

    /* Shelf edge light */
    x.strokeStyle = side === "left"
      ? "rgba(0,200,255,.35)"
      : "rgba(120,60,255,.35)";
    x.lineWidth = 1.5;
    x.beginPath();
    if (side === "left") {
      x.moveTo(sx + sw, sy);
      x.lineTo(sx + sw, sy + shelfH);
    } else {
      x.moveTo(sx, sy);
      x.lineTo(sx, sy + shelfH);
    }
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
