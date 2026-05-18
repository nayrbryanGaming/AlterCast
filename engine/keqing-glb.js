/* ═══════════════════════════════════════════════════════════
   AlterCast — Keqing GLB Avatar Renderer
   Three.js + GLTFLoader. Renders keqing.glb di canvas terpisah.
   Face mesh diganti dengan foto wajah asli user (host-real.png).
═══════════════════════════════════════════════════════════ */

const THREE_CDN = "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";
const GLTF_CDN  = "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/loaders/GLTFLoader.js";

export class KeqingGLBRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene  = null;
    this.camera = null;
    this.renderer = null;
    this.model  = null;
    this.mixer  = null;
    this.clock  = null;
    this.rotY   = 0;
    this.rotYTarget = 0;
    this.orbit  = false;
    this.orbitT = 0;
    this.faceTexture = null;
    this._loaded = false;
    this._raf = null;
  }

  async init() {
    try {
      const THREE  = await import(THREE_CDN);
      const { GLTFLoader } = await import(GLTF_CDN);
      this._THREE  = THREE;
      this._loader = new GLTFLoader();
      return true;
    } catch (e) {
      console.warn("[KeqingGLB] Three.js CDN load failed:", e.message);
      return false;
    }
  }

  async load(glbSrc, faceImgSrc) {
    const THREE = this._THREE;
    if (!THREE) return false;

    /* Renderer */
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    /* Scene */
    this.scene = new THREE.Scene();
    this.clock  = new THREE.Clock();

    /* Camera — portrait framing, full body visible */
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera  = new THREE.PerspectiveCamera(40, aspect, 0.01, 100);
    this.camera.position.set(0, 1.2, 3.2);
    this.camera.lookAt(0, 1.0, 0);

    /* Lighting: cinematic 3-point */
    const key  = new THREE.DirectionalLight(0xfff8f0, 1.6);
    key.position.set(2, 3, 3);
    key.castShadow = true;
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0xc8d8ff, 0.6);
    fill.position.set(-2, 2, 1);
    this.scene.add(fill);

    const rim  = new THREE.DirectionalLight(0x00d4ff, 0.9);
    rim.position.set(-1, 3, -3);
    this.scene.add(rim);

    const amb  = new THREE.AmbientLight(0x101828, 1.0);
    this.scene.add(amb);

    /* Load face texture (user's real face) */
    if (faceImgSrc) {
      const loader = new THREE.TextureLoader();
      this.faceTexture = await loader.loadAsync(faceImgSrc);
      this.faceTexture.colorSpace = THREE.SRGBColorSpace;
    }

    /* Load GLB */
    return new Promise((resolve) => {
      this._loader.load(
        glbSrc,
        (gltf) => {
          this.model = gltf.scene;

          /* Auto-scale and center model */
          const box = new THREE.Box3().setFromObject(this.model);
          const size   = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale  = 2.0 / maxDim;
          this.model.scale.setScalar(scale);
          this.model.position.sub(center.multiplyScalar(scale));
          /* Lift to floor */
          this.model.position.y += 0.05;

          /* Apply face texture to face/head mesh if found */
          if (this.faceTexture) {
            this.model.traverse((child) => {
              if (!child.isMesh) return;
              const name = (child.name || "").toLowerCase();
              /* Heuristic: find head/face mesh by name */
              if (name.includes("face") || name.includes("head") || name.includes("skin") || name.includes("body")) {
                if (child.material) {
                  const mat = Array.isArray(child.material) ? child.material[0] : child.material;
                  if (mat && mat.map) {
                    mat.map = this.faceTexture;
                    mat.needsUpdate = true;
                  }
                }
              }
            });
          }

          /* Enable shadows */
          this.model.traverse((c) => {
            if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; }
          });

          this.scene.add(this.model);

          /* Animations */
          if (gltf.animations?.length) {
            this.mixer = new THREE.AnimationMixer(this.model);
            const idle = gltf.animations.find(a => a.name.toLowerCase().includes("idle")) || gltf.animations[0];
            const action = this.mixer.clipAction(idle);
            action.play();
          }

          this._loaded = true;
          this._startRender();
          resolve(true);
        },
        undefined,
        (err) => {
          console.warn("[KeqingGLB] GLB load error:", err);
          resolve(false);
        }
      );
    });
  }

  _startRender() {
    const animate = () => {
      this._raf = requestAnimationFrame(animate);
      const dt = this.clock.getDelta();
      if (this.mixer) this.mixer.update(dt);

      if (this.orbit) {
        this.orbitT += dt * 0.4;
        this.rotYTarget = Math.sin(this.orbitT) * 0.5;
      }
      this.rotY += (this.rotYTarget - this.rotY) * 0.06;
      if (this.model) this.model.rotation.y = this.rotY;

      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  setRotation(rx, ry) { this.rotYTarget = ry; }
  setOrbit(on) { this.orbit = on; }

  resize() {
    if (!this.renderer || !this.camera) return;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  destroy() {
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this.renderer) this.renderer.dispose();
  }

  get loaded() { return this._loaded; }
}
