/* ═══════════════════════════════════════════════════════════
   AlterCast — Keqing GLB Engine (Main Avatar Renderer)
   THREE.js + GLTFLoader. Full 3D dari semua sisi.
   Foto wajah asli user diterapkan sebagai face texture.
   API kompatibel dengan engine-bridge (render dipanggil per-frame).
═══════════════════════════════════════════════════════════ */

const THREE_CDN = "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";
const GLTF_CDN  = "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/loaders/GLTFLoader.js";

export class KeqingGLBRenderer {
  constructor(canvas) {
    this.canvas = canvas;

    /* State yang dibaca engine-bridge dan live.js */
    this.state = {
      rotX: 0, rotY: 0,
      rotXTarget: 0, rotYTarget: 0,
      orbit: false, orbitT: 0,
    };

    this._THREE    = null;
    this._loader   = null;
    this.renderer  = null;
    this.scene     = null;
    this.camera    = null;
    this._model    = null;
    this._mixer    = null;
    this._clock    = null;
    this._loaded   = false;
    this._avatars  = {};   /* { id: { faceTex } } */
    this._currentId = null;
  }

  /* ── Init Three.js dari CDN ─────────────────────────── */
  async init() {
    try {
      const THREE = await import(THREE_CDN);
      const { GLTFLoader } = await import(GLTF_CDN);
      this._THREE  = THREE;
      this._loader = new GLTFLoader();
      this._setupRenderer();
      return true;
    } catch (e) {
      console.warn("[KeqingGLB] Three.js CDN gagal:", e.message);
      return false;
    }
  }

  _setupRenderer() {
    const THREE = this._THREE;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(this.canvas.clientWidth || 800, this.canvas.clientHeight || 600, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.setClearColor(0x000000, 0); /* transparan */

    this.scene  = new THREE.Scene();
    this._clock = new THREE.Clock();

    /* Camera — portrait framing, full body */
    const aspect = (this.canvas.clientWidth || 800) / (this.canvas.clientHeight || 600);
    this.camera  = new THREE.PerspectiveCamera(38, aspect, 0.01, 100);
    this.camera.position.set(0, 1.35, 2.8);
    this.camera.lookAt(0, 1.1, 0);

    /* Lighting cinematic 3-point */
    const key  = new THREE.DirectionalLight(0xfff8f0, 2.2);
    key.position.set(2, 4, 3);
    key.castShadow = false;
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0xb0c8ff, 0.8);
    fill.position.set(-2, 2, 1);
    this.scene.add(fill);

    const rim  = new THREE.DirectionalLight(0x00d4ff, 1.1);
    rim.position.set(-0.5, 3, -2.5);
    this.scene.add(rim);

    const amb = new THREE.AmbientLight(0x1a2038, 1.2);
    this.scene.add(amb);
  }

  /* ── Load GLB model sekali ──────────────────────────── */
  async loadModel(glbSrc) {
    if (!this._loader) return false;
    const THREE = this._THREE;

    return new Promise((resolve) => {
      this._loader.load(
        glbSrc,
        (gltf) => {
          const model = gltf.scene;

          /* Auto-scale & center */
          const box    = new THREE.Box3().setFromObject(model);
          const size   = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const scale  = 2.2 / Math.max(size.x, size.y, size.z);
          model.scale.setScalar(scale);
          model.position.sub(center.multiplyScalar(scale));
          model.position.y += 0.05;

          model.traverse(c => {
            if (c.isMesh) {
              c.castShadow    = false;
              c.receiveShadow = false;
              /* Pastikan material support alpha */
              const mats = Array.isArray(c.material) ? c.material : [c.material];
              mats.forEach(m => {
                if (m) { m.side = THREE.FrontSide; }
              });
            }
          });

          this.scene.add(model);
          this._model = model;

          /* Animasi idle */
          if (gltf.animations?.length) {
            this._mixer = new THREE.AnimationMixer(model);
            const idle = gltf.animations.find(a =>
              a.name.toLowerCase().includes("idle")
            ) || gltf.animations[0];
            this._mixer.clipAction(idle).play();
          }

          this._loaded = true;
          resolve(true);
        },
        undefined,
        (err) => {
          console.warn("[KeqingGLB] GLB load error:", err.message ?? err);
          resolve(false);
        }
      );
    });
  }

  /* ── Tambah avatar: load face texture ──────────────── */
  async addAvatar(id, imgSrc, onProgress = () => {}) {
    if (!this._THREE) return null;
    const THREE = this._THREE;

    onProgress("loading face texture…");
    let faceTex = null;
    try {
      const loader = new THREE.TextureLoader();
      faceTex = await loader.loadAsync(imgSrc);
      faceTex.colorSpace = THREE.SRGBColorSpace;
    } catch (e) {
      console.warn("[KeqingGLB] face texture load failed:", e.message);
    }
    this._avatars[id] = { faceTex };
    onProgress("done");
    return this._avatars[id];
  }

  /* ── Pilih avatar: ganti face texture di model ──────── */
  selectAvatar(id) {
    if (!this._avatars[id] || !this._model) return false;
    this._currentId = id;
    const faceTex = this._avatars[id]?.faceTex;
    if (!faceTex || !this._THREE) return true;

    const THREE = this._THREE;
    this._model.traverse(child => {
      if (!child.isMesh) return;
      const name = (child.name || "").toLowerCase();
      /* Cari mesh wajah/kepala berdasarkan nama */
      const isFace = name.includes("face") || name.includes("head") ||
                     name.includes("skin") || name.includes("body") ||
                     name.includes("chr")  || name.includes("mesh");
      if (!isFace) return;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach(mat => {
        if (mat && mat.map) {
          mat.map = faceTex;
          mat.needsUpdate = true;
        }
      });
    });
    return true;
  }

  /* ── Engine API (engine-bridge.js) ─────────────────── */
  setRotation(rx, ry) {
    this.state.rotXTarget = rx;
    this.state.rotYTarget = ry;
  }
  setHeadLook(rx, ry) {
    /* Sedikit pengaruh ke rotasi keseluruhan */
    this.state.rotXTarget += rx * 0.15;
    this.state.rotYTarget += ry * 0.15;
  }
  setEyeLook()    {}    /* stub */
  setMouthOpen()  {}    /* stub */
  setOrbit(on)    { this.state.orbit = on; if (!on) this.state.orbitT = 0; }
  setEmotion(cfg) {
    /* Sesuaikan rim light warna berdasarkan emosi */
    if (!this.scene || !this._THREE) return;
    const THREE = this._THREE;
    this.scene.children.forEach(c => {
      if (c.isDirectionalLight && c.position.x < 0 && c.position.z < 0) {
        /* Rim light */
        if (cfg.rimRGB) {
          c.color.setRGB(cfg.rimRGB[0], cfg.rimRGB[1], cfg.rimRGB[2]);
        }
        if (cfg.rimA !== undefined) c.intensity = 0.6 + cfg.rimA * 0.8;
      }
    });
  }

  /** Dipanggil per-frame dari loop utama live.js */
  render(extraX = 0, extraY = 0) {
    if (!this.renderer || !this.scene || !this.camera) return;

    const dt = this._clock.getDelta();
    if (this._mixer) this._mixer.update(dt);

    const s = this.state;
    if (s.orbit) {
      s.orbitT += dt * 0.45;
      s.rotYTarget = Math.sin(s.orbitT) * 0.55;
      s.rotXTarget = Math.sin(s.orbitT * 0.35) * 0.08;
    }
    s.rotX += (s.rotXTarget - s.rotX) * 0.07;
    s.rotY += (s.rotYTarget - s.rotY) * 0.07;

    if (this._model) {
      this._model.rotation.x = s.rotX + extraY * 0.5;
      this._model.rotation.y = s.rotY + extraX * 0.5;
    }

    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    if (!this.renderer || !this.camera) return;
    const w = this.canvas.clientWidth  || 800;
    const h = this.canvas.clientHeight || 600;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  get loaded() { return this._loaded; }

  destroy() {
    if (this.renderer) this.renderer.dispose();
  }
}
