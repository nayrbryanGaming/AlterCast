# AlterCast

**Tetap Siaran. Walau Kamu Tidak Ada.**

AI streaming avatar 3D real-time yang hidup di browser, ngobrol Bahasa Indonesia, dan tidak butuh install. Tidak butuh Unreal Engine, tidak butuh Blender runtime. WebGL native + Web Speech API native + MediaPipe-ready.

---

## Cara Menjalankan (Quick Start)

```bash
# Dari folder AlterCast/
node server.cjs

# Atau pilih port:
node server.cjs 8080
```

Lalu buka di browser:

| URL | Halaman |
|-----|---------|
| `http://localhost:3000/` | Landing page + hero preview avatar |
| `http://localhost:3000/studio.html` | **Studio utama** — full layout dengan sidebar + canvas + chat |
| `http://localhost:3000/live.html` | **Mode Hologram** — fullscreen avatar (ala Gatebox capsule) |
| `http://localhost:3000/avatar.html` | Avatar creator + upload foto |
| `http://localhost:3000/overlay.html` | OBS browser source overlay (transparent BG) |
| `http://localhost:3000/dashboard.html` | Analytics dashboard |

**Tidak ada `npm install`** — server zero-dependency, hanya butuh Node.js ≥18.

---

## Struktur Project

```
AlterCast/
├── index.html              ← Landing page
├── studio.html             ← Studio utama (3 panel: sidebar+canvas+chat)
├── live.html               ← Hologram fullscreen mode
├── avatar.html             ← Avatar creator (upload foto)
├── overlay.html            ← OBS transparent overlay
├── dashboard.html          ← Analytics
├── server.cjs              ← Zero-dep static HTTP server
├── package.json
├── assets/
│   ├── avatars/
│   │   ├── yuna.png
│   │   └── aetheria.png
│   └── styles/
│       ├── tokens.css      ← Design tokens (color, type, spacing, anim)
│       ├── studio.css      ← Studio layout (3-col grid)
│       ├── live.css        ← Hologram capsule UI
│       └── landing.css     ← Landing page
├── engine/
│   └── vtuber3d.js         ← WebGL procedural 3D engine (head + face + hair + eyes)
└── app/
    ├── store.js            ← Central reactive state store (pub/sub)
    ├── engine-bridge.js    ← Connects store → engine (every key drives engine)
    ├── i18n.js             ← Bahasa Indonesia + English strings
    ├── icons.js            ← Inline SVG icons (Lucide-style)
    ├── tts.js              ← Web Speech API (Indonesian voice priority)
    ├── atmosphere.js       ← Background canvas + particle layer
    ├── chat.js             ← Chat panel + AI mock responses
    ├── studio.js           ← Studio controller (wires every UI control)
    └── live.js             ← Live mode controller
```

---

## Bagaimana Parameter Terhubung

**Inti arsitektur:** semua UI control read/write ke satu Store. Engine subscribe ke Store dan update dirinya. Tidak ada "static image" — setiap tombol dan slider menggerakkan parameter engine real-time.

### Alur data
```
USER CLICK / SLIDER / KEY
        ↓
   store.set(key, value)
        ↓
   store fires subscribers
        ↓
   ┌────────┬──────────┬──────────┐
   ↓        ↓          ↓          ↓
Engine   UI label   Atmosphere   Chat
update   update     update       update
```

### Contoh konkret

| UI Control | Store Key | Affects Engine |
|------------|-----------|----------------|
| Emotion buttons (😐✨⚡👋💧😮) | `emotion` | rim color, rim amount, shake, particle color |
| Lighting preset (Cinematic / Sunset / Studio / Neon / Hologram) | `lightingPreset` | key/fill/rim/hair light dirs + colors + amts + ambient |
| Angle bar (Front / ¾L / Profile / Hero / Top) | `angle` | engine rotX/rotY |
| Avatar library cards | `currentAvatar` | engine.selectAvatar() |
| Toggle Auto Orbit | `orbit` | engine orbit animation |
| Toggle Mouse Track | `mouseTrack` | enables real-time head/eye follow |
| Toggle Landmarks | `showLandmarks` | overlay decorative tracking dots |
| Toggle Particles | `particles` | particle canvas on/off |
| Toggle Grid Background | `gridBackground` | atmosphere grid on/off |
| Slider Depth | `depth` | engine depth strength |
| Slider Rim Glow | `rim` | scales emotion rim amount |
| Slider Light Angle | `lightAngle` | engine keyDir vector recomputed |
| Slider Breath | `breathSpeed` | breath animation speed |
| Volume slider | `volume` | TTS utterance volume |
| Stream button | `isLive` | starts live chat simulation |
| AFK button | `isAFKMode` | AI auto-responds to chat |
| Mute button | `muted` | cancels TTS, fallback mouth simulation |
| Language toggle (🇮🇩 ID / 🇺🇸 EN) | `lang` | re-renders entire UI strings |

### Real-time avatar (yang membuatnya "live")

- **Mouse-follow head + eye**: setiap mousemove → head tilts toward cursor (subtle), eyes track aggressively
- **Drag-to-rotate**: mousedown on canvas → drag mouse → engine rotation updated
- **Click react**: click on avatar → ripple effect + random emotion (wave/excited/surprised/happy) + TTS reaction line
- **Auto blink**: random blink every ~3.5–5.5 seconds
- **Breath**: subtle scale Y oscillation continuous
- **Lip-sync**: TTS audio drives mouthOpen via Math.sin envelope + onboundary spikes
- **Idle hair sway**: per-strand sine wave
- **Speech bubble**: appears above avatar when speaking, auto-dismisses after TTS done
- **Auto-hide UI in Live mode**: 4.5s of no interaction → all UI fades, only avatar visible (cinematic capsule)

### Hologram-mode (live.html)

Mirip dengan referensi Gatebox capsule Hatsune Miku:
- Pure WebGL avatar fullscreen
- Capsule frame: dua garis horizontal atas+bawah + dua garis vertikal samping (cyan glow)
- Scan-line stripe animasi
- Vignette + floor reflection
- Floating side rails: kiri = avatar swap, kanan = action dock (orbit/speak/wave/excited/mute/light/fullscreen)
- Default lighting: **Hologram preset** (cyan-dominant lighting)
- Speech bubble bottom-center
- Stats overlay bottom-right (FPS, avatar, emotion, lighting)

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Avatar bicara (random line) |
| `W` | Lambai |
| `O` | Toggle auto orbit |
| `E` | Reaksi excited (live mode) |
| `L` | Cycle lighting preset (live mode) |
| `F` | Toggle fullscreen |
| `1` | Pilih avatar Yuna |
| `2` | Pilih avatar Aetheria |
| `Escape` | Cancel TTS / hide bubble |

---

## Bahasa Indonesia

- **Default UI**: Bahasa Indonesia (`<html lang="id">`)
- **TTS**: Web Speech API memilih voice `id-ID` jika tersedia, fallback ke `ms`, lalu default
- **Greeting & reactions**: 30+ kalimat natural Indonesia per avatar
- **Chat mock**: Indonesia ("halo bro!", "wah avatarnya hidup banget", "mantap btw")
- **Toggle EN tersedia** di pojok kanan atas navbar studio

---

## OBS Browser Source Setup

1. Run `node server.cjs`
2. OBS → Add Source → Browser
3. URL: `http://localhost:3000/overlay.html?clean=1&avatar=yuna&emotion=idle&light=hologram`
4. Width 1080, Height 1920 (portrait), atau 1920×1080 (landscape)
5. **Custom CSS** (optional): `body { background-color: transparent !important; }`

Query parameters:
- `clean=1` → hide config panel + watermark
- `avatar=yuna|aetheria` → preselect avatar
- `emotion=idle|happy|excited|wave|sad|surprised|laughing|thinking`
- `light=cinematic|sunset|studio|neon|hologram`

Bridge dari Studio: studio bisa kirim postMessage ke window overlay (untuk multi-window setup).

---

## Avatar Engine

Engine 3D adalah **procedural WebGL** (vtuber3d.js) — bukan VRM loader, bukan three.js wrapper:

- **Head**: sphere (lat 36 × lon 48)
- **Face**: curved patch yang melengkung mengikuti sphere head, dengan foto sebagai tekstur
- **Hair**: 14 strand cards yang menggantung dari kepala (skip front strands)
- **Eyes**: sphere sclera + plane iris + plane pupil + plane highlight (4 layer per mata)
- **Body**: cylinder torso + sphere shoulders + cylinder arms (upper + forearm)
- **Lighting**: 4-point (key + fill + rim + hair) + ambient + SSS approximation
- **BG removal**: smart luminance/saturation detect — buang background putih foto otomatis
- **Custom shader**: vertex + fragment GLSL untuk smart-shading

Tidak butuh model file. Tinggal upload foto wajah → engine sample warna kulit/rambut/baju otomatis → render 3D.

---

## Stack

- **Vanilla ES Modules** (no build step, no bundler)
- **WebGL 1.0** (compatible iOS Safari, Android Chrome, desktop)
- **Web Speech API** (TTS)
- **Web Audio API** (mouth envelope)
- **Canvas 2D** (atmosphere, particles)
- **CSS Custom Properties** (design tokens, theme switch)
- **No frameworks** — React, Vue, Next.js semuanya tidak dipakai supaya bisa langsung jalan tanpa build

---

## Roadmap (Phase 2+)

- [ ] MediaPipe FaceLandmarker integration (webcam → avatar live)
- [ ] ElevenLabs voice clone (replace Web Speech API)
- [ ] Ollama / OpenAI integration untuk AI brain (replace mock chat responses)
- [ ] Twitch / YouTube Live chat API
- [ ] OBS WebSocket v5 client (auto-scene-switch on emotion)
- [ ] Electron desktop build (.exe)
- [ ] Capacitor mobile build (.apk + iOS)
- [ ] VRM avatar support (untuk yang sudah punya rig)
- [ ] Multi-language: JP, KR, EN voice presets

---

## License

MIT. Bikinan Indonesia — gunakan untuk apa pun.
