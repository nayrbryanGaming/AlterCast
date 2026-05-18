/* ═══════════════════════════════════════════════════════════
   AlterCast — Engine Bridge
   Pakai Face3DEngine: render wajah asli dari foto dalam 3D.
   Gantikan VTuber3D (robot procedural) sepenuhnya.
═══════════════════════════════════════════════════════════ */

import { Face3DEngine } from "../engine/face3d-engine.js";
import { store, AVATARS, EMOTIONS, ANGLES, LIGHTING_PRESETS } from "./store.js";

export class EngineBridge {
  constructor(canvas) {
    this.engine = new Face3DEngine(canvas);
    this.canvas = canvas;
    this.loaded = false;
    this._unsubs = [];
    this._frame = 0;
    this._lastFpsTime = 0;
    this._frameCount = 0;
    this._shaking = false;
    this._shakeMag = 0;
    this._emoTimeout = null;
  }

  async boot() {
    /* Load avatars — Face3DEngine: addAvatar(id, src, onProgress) */
    for (const [id, av] of Object.entries(AVATARS)) {
      await this.engine.addAvatar(id, av.src, (msg) => {
        console.log(`[Avatar:${id}] ${msg}`);
      });
    }
    this.engine.selectAvatar(store.get("currentAvatar"));
    this.loaded = true;
    this._wireStore();
    this._applyLighting(store.get("lightingPreset"));
    this._applyEmotion(store.get("emotion"));
    this._applyAngle(store.get("angle"));
  }

  _wireStore() {
    /* Every relevant store key drives engine behavior */
    this._unsubs.push(store.subscribe("currentAvatar", id => {
      this.engine.selectAvatar(id);
      this._applyEmotion(store.get("emotion"));
    }));
    this._unsubs.push(store.subscribe("emotion", e => this._applyEmotion(e)));
    this._unsubs.push(store.subscribe("angle", a => this._applyAngle(a)));
    this._unsubs.push(store.subscribe("orbit", on => this.engine.setOrbit(on)));
    this._unsubs.push(store.subscribe("mouthOpen", v => this.engine.setMouthOpen(v)));
    this._unsubs.push(store.subscribe("lightingPreset", p => this._applyLighting(p)));
    this._unsubs.push(store.subscribe("rim", () => this._applyEmotion(store.get("emotion"))));
  }

  _applyEmotion(emo) {
    const cfg = EMOTIONS[emo] || EMOTIONS.idle;
    const rimUserScale = store.get("rim") / 0.55;
    this.engine.setEmotion({
      rimA: cfg.rimA * rimUserScale,
      rimRGB: cfg.rimRGB,
    });
    if (cfg.shake && !this._shaking) {
      this._shaking = true;
      this._shakeMag = 0.012;
    }
  }

  _applyAngle(name) {
    const a = ANGLES[name];
    if (!a) return;
    this.engine.setRotation(a.rx, a.ry);
  }

  _applyLighting(name) {
    const p = LIGHTING_PRESETS[name];
    if (!p) return;
    const s = this.engine.state;
    /* Face3DEngine: pakai lightDir (key light), rimColor, keyLight */
    if (p.key)  s.lightDir  = p.key;
    if (p.keyC) s.lightDir  = p.key;
    if (p.keyA) s.keyLight  = p.keyA;
    if (p.rimC) s.rimColor  = p.rimC;
    if (p.rimA) s.rimStrength = p.rimA * (store.get("rim") / 0.55);
  }

  /** Set engine rotation directly (used for drag, mouse-track) */
  setRotation(rx, ry) {
    this.engine.setRotation(rx, ry);
    store.set("rotation", { x: rx, y: ry });
  }
  setHeadLook(rx, ry) {
    this.engine.setHeadLook(rx, ry);
    store.set("headLook", { x: rx, y: ry });
  }
  setEyeLook(rx, ry) {
    this.engine.setEyeLook(rx, ry);
    store.set("eyeLook", { x: rx, y: ry });
  }

  triggerEmotionTransient(emo, durMs = 2200) {
    const prev = store.get("emotion");
    store.set("emotion", emo);
    if (this._emoTimeout) clearTimeout(this._emoTimeout);
    this._emoTimeout = setTimeout(() => store.set("emotion", "idle"), durMs);
  }

  resize() { this.engine.resize(); }

  /** Frame render — called from main RAF loop */
  render(t) {
    /* FPS counter */
    this._frameCount++;
    if (t - this._lastFpsTime >= 1) {
      store.set("fps", this._frameCount);
      this._frameCount = 0;
      this._lastFpsTime = t;
    }

    /* Shake on excited emotion */
    let sx = 0, sy = 0;
    if (this._shaking) {
      this._shakeMag *= 0.88;
      sx = (Math.random() - 0.5) * this._shakeMag;
      sy = (Math.random() - 0.5) * this._shakeMag * 0.5;
      if (this._shakeMag < 0.001) {
        this._shaking = false;
        this._shakeMag = 0;
      }
    }
    this.engine.render(sx, sy);
  }

  destroy() {
    this._unsubs.forEach(u => u());
    this._unsubs = [];
  }
}
