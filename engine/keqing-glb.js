/* ═══════════════════════════════════════════════════════════
   AlterCast — Keqing GLB Engine (Main Avatar Renderer)
   Static import Three.js via importmap di live.html.
   Full 3D dari semua sisi — model Keqing + wajah asli user.
═══════════════════════════════════════════════════════════ */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class KeqingGLBRenderer {
  constructor(canvas) {
    this.canvas = canvas;

    /* State dibaca engine-bridge dan live.js */
    this.state = {
      rotX: 0, rotY: 0,
      rotXTarget: 0, rotYTarget: 0,
      orbit: false, orbitT: 0,
    };

    this.renderer  = null;
    this.scene     = null;
    this.camera    = null;
    this._model    = null;
    this._mixer    = null;
    this._clock    = new THREE.Clock();
    this._loader   = new GLTFLoader();
    this._loaded   = false;
    this._avatars  = {};
    this._currentId = null;
  }

  /* ── Init renderer (synchronous) ────────────────────── */
  async init() {
    try {
      this._setupRenderer();
      return true;
    } catch (e) {
      console.error("[KeqingGLB] init error:", e.message);
      return false;
    }
  }

  _setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.setClearColor(0x000000, 0);

    this.scene  = new THREE.Scene();

    /* Camera — 3/4 full-body portrait, slight low angle */
    this.camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100);
    this.camera.position.set(0, 0.6, 3.6);
    this.camera.lookAt(0, 0.5, 0);

    /* 3-point cinematic lighting */
    const key  = new THREE.DirectionalLight(0xfff8f0, 2.5);
    key.position.set(2, 4, 3);
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0xb0c8ff, 1.0);
    fill.position.set(-2, 2, 1);
    this.scene.add(fill);

    const rim  = new THREE.DirectionalLight(0x00d4ff, 1.2);
    rim.position.set(-0.5, 3, -2.5);
    this.scene.add(rim);

    this.scene.add(new THREE.AmbientLight(0x1a2038, 1.5));

    this.resize();
  }

  /* ── Load GLB ───────────────────────────────────────── */
  async loadModel(glbSrc) {
    return new Promise((resolve) => {
      this._loader.load(
        glbSrc,
        (gltf) => {
          const model = gltf.scene;

          /* Auto-scale & center */
          const box    = new THREE.Box3().setFromObject(model);
          const size   = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const s      = 2.0 / maxDim;
          model.scale.setScalar(s);
          model.position.sub(center.multiplyScalar(s));
          /* Lift slightly so feet are at y=0 */
          const boxAfter = new THREE.Box3().setFromObject(model);
          model.position.y -= boxAfter.min.y;
          model.position.y -= size.y * s * 0.5; /* drop to waist center */

          model.traverse(c => {
            if (!c.isMesh) return;
            console.log("[KeqingGLB] mesh:", c.name,
              "| mat:", (Array.isArray(c.material) ? c.material : [c.material]).map(m => m?.name));
            const mats = Array.isArray(c.material) ? c.material : [c.material];
            mats.forEach(m => {
              if (!m) return;
              m.side = THREE.FrontSide;
              /* Keep original Keqing textures sharp */
              if (m.map) { m.map.anisotropy = 8; m.map.needsUpdate = true; }
            });
          });

          this.scene.add(model);
          this._model = model;

          /* Animation — try idle first, fallback to any */
          if (gltf.animations?.length) {
            this._mixer = new THREE.AnimationMixer(model);
            const idle = gltf.animations.find(a =>
              /idle|stand|rest|wait|loop/i.test(a.name)
            ) || gltf.animations[0];
            const action = this._mixer.clipAction(idle);
            action.play();
            console.log("[KeqingGLB] animation:", idle.name);
          } else {
            console.log("[KeqingGLB] no animations — using bind pose");
            this._relaxArmBones(model);
          }

          this._loaded = true;
          console.log("[KeqingGLB] model loaded ✓", gltf.animations?.length, "anim(s)");
          resolve(true);
        },
        (xhr) => {
          if (xhr.total) console.log(`[KeqingGLB] ${Math.round(xhr.loaded/xhr.total*100)}%`);
        },
        (err) => {
          console.warn("[KeqingGLB] GLB load error:", err.message ?? err);
          resolve(false);
        }
      );
    });
  }

  /* Manually fold arms to sides when no animation present */
  _relaxArmBones(model) {
    model.traverse(b => {
      if (b.isBone || b.type === "Bone") {
        const n = b.name.toLowerCase();
        if (n.includes("upperarm") || n.includes("arm_l") || n.includes("arm_r") ||
            n.includes("shoulder") || n.includes("clavicle")) {
          if (n.includes("_l") || n.includes("left"))  b.rotation.z =  0.6;
          if (n.includes("_r") || n.includes("right")) b.rotation.z = -0.6;
        }
      }
    });
  }

  /* ── Load face texture per avatar ───────────────────── */
  async addAvatar(id, imgSrc, onProgress = () => {}) {
    onProgress("loading face texture…");
    let faceTex = null;
    try {
      const loader = new THREE.TextureLoader();
      faceTex = await loader.loadAsync(imgSrc);
      faceTex.colorSpace = THREE.SRGBColorSpace;
    } catch (e) {
      console.warn(`[KeqingGLB] face texture ${id} failed:`, e.message);
    }
    this._avatars[id] = { faceTex };
    onProgress("done");
    return this._avatars[id];
  }

  /* ── Pilih avatar → terapkan face texture ───────────── */
  selectAvatar(id) {
    if (!this._avatars[id] || !this._model) return false;
    this._currentId = id;
    /*
     * Face texture is only applied when we can positively identify the face
     * mesh by name. If no match, preserve original Keqing model textures.
     */
    const { faceTex } = this._avatars[id];
    if (!faceTex) return true;

    const FACE_KEYWORDS = ["face", "head", "skin", "hair01", "fac"];
    const EXCLUDE_KEYWORDS = ["cloth", "dress", "outfit", "skirt", "coat",
                               "hair", "weapon", "wing", "eye", "brow",
                               "lash", "lip", "tooth", "tongue"];

    this._model.traverse(child => {
      if (!child.isMesh) return;
      const name = (child.name || "").toLowerCase();
      const matName = (() => {
        const m = Array.isArray(child.material) ? child.material[0] : child.material;
        return (m?.name || "").toLowerCase();
      })();
      const combined = name + " " + matName;
      const isExcluded = EXCLUDE_KEYWORDS.some(k => combined.includes(k));
      const isFace = FACE_KEYWORDS.some(k => combined.includes(k));
      if (!isFace || isExcluded) return;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach(m => {
        if (m && m.map) { m.map = faceTex; m.needsUpdate = true; }
      });
      console.log("[KeqingGLB] applied face texture to:", child.name);
    });
    return true;
  }

  /* ── Engine API (dipanggil engine-bridge) ───────────── */
  setRotation(rx, ry)   { this.state.rotXTarget = rx; this.state.rotYTarget = ry; }
  setHeadLook(rx, ry)   { this.state.rotXTarget += rx * 0.12; this.state.rotYTarget += ry * 0.12; }
  setEyeLook()          {}
  setMouthOpen()        {}
  setOrbit(on)          { this.state.orbit = on; if (!on) this.state.orbitT = 0; }

  setEmotion(cfg) {
    if (!this.scene) return;
    this.scene.children.forEach(c => {
      if (c.isDirectionalLight && c.position.x < 0 && c.position.z < 0) {
        if (cfg.rimRGB) c.color.setRGB(cfg.rimRGB[0], cfg.rimRGB[1], cfg.rimRGB[2]);
        if (cfg.rimA  !== undefined) c.intensity = 0.5 + cfg.rimA * 0.9;
      }
    });
  }

  /* ── Render (dipanggil per-frame dari live.js) ───────── */
  render(extraX = 0, extraY = 0) {
    if (!this.renderer || !this.scene || !this.camera) return;

    const dt = this._clock.getDelta();
    if (this._mixer) this._mixer.update(dt);

    const s = this.state;
    if (s.orbit) {
      s.orbitT    += dt * 0.45;
      s.rotYTarget = Math.sin(s.orbitT) * 0.55;
      s.rotXTarget = Math.sin(s.orbitT * 0.35) * 0.08;
    }
    s.rotX += (s.rotXTarget - s.rotX) * 0.07;
    s.rotY += (s.rotYTarget - s.rotY) * 0.07;

    if (this._model) {
      this._model.rotation.x = s.rotX  + extraY * 0.3;
      this._model.rotation.y = s.rotY  + extraX * 0.3;
    }

    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    if (!this.renderer || !this.camera) return;
    const w = this.canvas.clientWidth  || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  get loaded() { return this._loaded; }

  destroy() { if (this.renderer) this.renderer.dispose(); }
}
