/* ─────────────────────────────────────────────
   AlterCast — App Context + Translations
   ───────────────────────────────────────────── */

const AppContext = React.createContext(null);
function useApp() { return React.useContext(AppContext); }

/* ── TRANSLATIONS ── */
const STRINGS = {
  id: {
    /* Navigation */
    nav_landing:    "Beranda",
    nav_studio:     "Studio",
    nav_avatar:     "Avatar",
    nav_dashboard:  "Dasbor",
    nav_settings:   "Pengaturan",
    nav_overlay:    "Overlay OBS",
    nav_components: "Komponen",

    /* Status */
    status_live:    "SIARAN",
    status_offline: "OFFLINE",
    status_idle:    "SIAGA",
    status_talking: "BICARA",
    status_excited: "EXCITED",
    status_afk:     "MODE AFK",
    status_sleepy:  "NGANTUK",
    status_reading: "BACA CHAT",

    /* Actions */
    start_stream:   "Mulai Siaran",
    stop_stream:    "Hentikan Siaran",
    enable_ai:      "Aktifkan AI",
    disable_ai:     "Nonaktifkan AI",
    enable_afk:     "Mode AFK / Sakit",
    disable_afk:    "Nonaktifkan AFK",
    connect_obs:    "Hubungkan OBS",
    disconnect:     "Putus Sambungan",
    save:           "Simpan",
    cancel:         "Batal",
    apply:          "Terapkan",
    close:          "Tutup",
    back:           "Kembali",
    next:           "Lanjut",
    copy:           "Salin",
    copied:         "Tersalin!",
    upload:         "Unggah",
    download:       "Unduh",
    refresh:        "Segarkan",
    test:           "Tes",
    preview:        "Pratinjau",
    delete:         "Hapus",
    create:         "Buat",

    /* Controls */
    mic:            "Mikrofon",
    mic_on:         "Mikrofon Aktif",
    mic_off:        "Mikrofon Mati",
    voice:          "Suara TTS",
    voice_on:       "Suara Aktif",
    voice_off:      "Suara Mati",
    camera:         "Kamera",
    camera_on:      "Kamera Aktif",
    camera_off:     "Kamera Mati",
    fullscreen:     "Layar Penuh",
    exit_fullscreen:"Keluar Layar Penuh",

    /* Sections */
    emotion:        "Emosi",
    mode:           "Mode",
    controls:       "Kontrol",
    ai_status:      "Status AI",
    chat:           "Chat",
    ai_response:    "Respons AI",
    donation:       "Donasi",
    queue:          "Antrean",
    manual_input:   "Input Manual",

    /* Settings */
    persona:        "Persona",
    avatar_cfg:     "Pengaturan Avatar",
    stream_cfg:     "Pengaturan Siaran",
    ai_cfg:         "Pengaturan AI",
    voice_cfg:      "Pengaturan Suara",
    obs_cfg:        "Pengaturan OBS",
    privacy:        "Privasi",
    appearance:     "Tampilan",
    language:       "Bahasa",
    theme:          "Tema",

    /* Avatar Creator */
    upload_photo:   "Unggah Foto Wajah",
    create_avatar:  "Buat Avatar",
    avatar_name:    "Nama Avatar",
    avatar_preview: "Pratinjau Avatar",
    avatar_style:   "Gaya Avatar",
    loading_avatar: "Membuat avatar...",

    /* AI */
    ai_model:       "Model AI",
    local_llm:      "LLM Lokal (Ollama)",
    cloud_llm:      "LLM Cloud (OpenAI)",
    latency:        "Latensi",
    temperature:    "Temperatur",
    max_tokens:     "Maks Token",
    system_prompt:  "System Prompt",

    /* Dashboard */
    session:        "Sesi",
    total_messages: "Total Pesan",
    donations:      "Total Donasi",
    ai_responses:   "Respons AI",
    duration:       "Durasi",
    viewers:        "Penonton",
    peak_viewers:   "Puncak Penonton",
    chat_per_min:   "Chat/Menit",
    session_log:    "Log Sesi",

    /* Chat */
    type_message:   "Ketik pesan manual...",
    send:           "Kirim",
    chat_empty:     "Belum ada pesan",
    chat_waiting:   "Menunggu chat masuk...",
    ai_typing:      "AI sedang mengetik",
    connecting:     "Menghubungkan...",

    /* OBS */
    obs_url:        "URL WebSocket OBS",
    obs_password:   "Password OBS",
    obs_connected:  "OBS Terhubung",
    obs_disconnected: "OBS Terputus",
    overlay_url:    "URL Overlay",
    copy_overlay:   "Salin URL Overlay",
    obs_guide:      "Panduan Setup OBS",

    /* Landing */
    tagline:        "Stay Live. Even When You're Gone.",
    subtitle:       "AI Streaming Twin kamu yang menjaga stream tetap hidup saat kamu sakit, AFK, atau burnout.",
    get_started:    "Mulai Sekarang",
    learn_more:     "Pelajari Lebih",
    open_studio:    "Buka Studio",
    features:       "Fitur",
    how_it_works:   "Cara Kerja",

    /* Toast Messages */
    toast_saved:    "Pengaturan disimpan!",
    toast_copied:   "URL disalin!",
    toast_live:     "Siaran dimulai!",
    toast_stopped:  "Siaran dihentikan.",
    toast_obs_ok:   "OBS berhasil terhubung!",
    toast_obs_fail: "Gagal terhubung ke OBS.",
    toast_afk_on:   "Mode AFK diaktifkan. AI mengambil alih.",
    toast_afk_off:  "Mode AFK dinonaktifkan.",
    toast_error:    "Terjadi kesalahan.",
  },

  en: {
    /* Navigation */
    nav_landing:    "Home",
    nav_studio:     "Studio",
    nav_avatar:     "Avatar",
    nav_dashboard:  "Dashboard",
    nav_settings:   "Settings",
    nav_overlay:    "OBS Overlay",
    nav_components: "Components",

    /* Status */
    status_live:    "LIVE",
    status_offline: "OFFLINE",
    status_idle:    "IDLE",
    status_talking: "TALKING",
    status_excited: "EXCITED",
    status_afk:     "AFK MODE",
    status_sleepy:  "SLEEPY",
    status_reading: "READING",

    /* Actions */
    start_stream:   "Start Stream",
    stop_stream:    "Stop Stream",
    enable_ai:      "Enable AI",
    disable_ai:     "Disable AI",
    enable_afk:     "AFK / Sick Mode",
    disable_afk:    "Disable AFK",
    connect_obs:    "Connect OBS",
    disconnect:     "Disconnect",
    save:           "Save",
    cancel:         "Cancel",
    apply:          "Apply",
    close:          "Close",
    back:           "Back",
    next:           "Next",
    copy:           "Copy",
    copied:         "Copied!",
    upload:         "Upload",
    download:       "Download",
    refresh:        "Refresh",
    test:           "Test",
    preview:        "Preview",
    delete:         "Delete",
    create:         "Create",

    /* Controls */
    mic:            "Microphone",
    mic_on:         "Mic Active",
    mic_off:        "Mic Off",
    voice:          "TTS Voice",
    voice_on:       "Voice Active",
    voice_off:      "Voice Off",
    camera:         "Camera",
    camera_on:      "Camera Active",
    camera_off:     "Camera Off",
    fullscreen:     "Fullscreen",
    exit_fullscreen:"Exit Fullscreen",

    /* Sections */
    emotion:        "Emotion",
    mode:           "Mode",
    controls:       "Controls",
    ai_status:      "AI Status",
    chat:           "Chat",
    ai_response:    "AI Response",
    donation:       "Donation",
    queue:          "Queue",
    manual_input:   "Manual Input",

    /* Settings */
    persona:        "Persona",
    avatar_cfg:     "Avatar Settings",
    stream_cfg:     "Stream Settings",
    ai_cfg:         "AI Settings",
    voice_cfg:      "Voice Settings",
    obs_cfg:        "OBS Settings",
    privacy:        "Privacy",
    appearance:     "Appearance",
    language:       "Language",
    theme:          "Theme",

    /* Avatar Creator */
    upload_photo:   "Upload Face Photo",
    create_avatar:  "Create Avatar",
    avatar_name:    "Avatar Name",
    avatar_preview: "Avatar Preview",
    avatar_style:   "Avatar Style",
    loading_avatar: "Creating avatar...",

    /* AI */
    ai_model:       "AI Model",
    local_llm:      "Local LLM (Ollama)",
    cloud_llm:      "Cloud LLM (OpenAI)",
    latency:        "Latency",
    temperature:    "Temperature",
    max_tokens:     "Max Tokens",
    system_prompt:  "System Prompt",

    /* Dashboard */
    session:        "Session",
    total_messages: "Total Messages",
    donations:      "Donations",
    ai_responses:   "AI Responses",
    duration:       "Duration",
    viewers:        "Viewers",
    peak_viewers:   "Peak Viewers",
    chat_per_min:   "Chat/Min",
    session_log:    "Session Log",

    /* Chat */
    type_message:   "Type manual message...",
    send:           "Send",
    chat_empty:     "No messages yet",
    chat_waiting:   "Waiting for chat...",
    ai_typing:      "AI is typing",
    connecting:     "Connecting...",

    /* OBS */
    obs_url:        "OBS WebSocket URL",
    obs_password:   "OBS Password",
    obs_connected:  "OBS Connected",
    obs_disconnected: "OBS Disconnected",
    overlay_url:    "Overlay URL",
    copy_overlay:   "Copy Overlay URL",
    obs_guide:      "OBS Setup Guide",

    /* Landing */
    tagline:        "Stay Live. Even When You're Gone.",
    subtitle:       "Your AI-powered streaming twin that keeps your stream alive when you're sick, AFK, or burned out.",
    get_started:    "Get Started",
    learn_more:     "Learn More",
    open_studio:    "Open Studio",
    features:       "Features",
    how_it_works:   "How It Works",

    /* Toast Messages */
    toast_saved:    "Settings saved!",
    toast_copied:   "URL copied!",
    toast_live:     "Stream started!",
    toast_stopped:  "Stream stopped.",
    toast_obs_ok:   "OBS connected successfully!",
    toast_obs_fail: "Failed to connect to OBS.",
    toast_afk_on:   "AFK Mode enabled. AI taking over.",
    toast_afk_off:  "AFK Mode disabled.",
    toast_error:    "An error occurred.",
  }
};

/* ── MOCK DATA ── */
const MOCK_CHAT = [
  { id:1,  user:"nayrbryan",    color:"#00D4FF", text:"halo semua! lagi test AlterCast nih [HOT]",       type:"message",  ts:"12:01" },
  { id:2,  user:"StreamerX",    color:"#7C3AFF", text:"wah avatar lo keren banget bro!",               type:"message",  ts:"12:01" },
  { id:3,  user:"anime_fan99",  color:"#00FF88", text:"suaranya mirip banget sama lo hahaha",          type:"message",  ts:"12:02" },
  { id:4,  user:"xXDarkXx",     color:"#FFB800", text:"ini pakai AI apa? GPT?",                        type:"message",  ts:"12:02" },
  { id:5,  user:"gifter_pro",   color:"#FF3C3C", text:"Semangat terus!",                               type:"donation", amount:"Rp 10.000", ts:"12:03" },
  { id:6,  user:"tech_wizard",  color:"#00D4FF", text:"bisa konek ke OBS juga? mantap",               type:"message",  ts:"12:03" },
  { id:7,  user:"luna_chan",    color:"#7C3AFF", text:"udah berapa lama live nih?",                    type:"message",  ts:"12:04" },
  { id:8,  user:"pro_gamer_99", color:"#00FF88", text:"!song",                                         type:"command",  ts:"12:04" },
  { id:9,  user:"viewer_123",   color:"#FFB800", text:"mantap jiwa ",                               type:"message",  ts:"12:05" },
  { id:10, user:"big_donator",  color:"#FF3C3C", text:"teruskan karyanya bro!",                        type:"donation", amount:"Rp 50.000", ts:"12:05" },
];

const MOCK_NEW_MSGS = [
  { user:"random_user1",   color:"#00D4FF", text:"lagi ngapain nih bang?" },
  { user:"coolstreamer",   color:"#7C3AFF", text:"salam dari Bandung!" },
  { user:"night_owl_id",   color:"#00FF88", text:"AI-nya bisa jawab pertanyaan gak?" },
  { user:"gamer_sejati",   color:"#FFB800", text:"stream-nya bagus banget kualitasnya" },
  { user:"sub_hype",       color:"#FF3C3C", text:"baru tau ada tools kayak gini" },
  { user:"vtuber_fan",     color:"#00D4FF", text:"mirip vtuber jepang!" },
  { user:"donate_king",    color:"#7C3AFF", text:"kapan collab sama creator lain?" },
  { user:"tech_nerd_42",   color:"#00FF88", text:"open source gak ini?" },
  { user:"pinky_star",     color:"#FFB800", text:"suara AI-nya halus banget" },
  { user:"night_chat_404", color:"#FF3C3C", text:"wkwkwk ngakak" },
];

const MOCK_AI_RESPONSES = [
  "Haha makasih ya udah tanya! Jadi ceritanya aku ini AI yang ngejaga stream kalau streamer-nya lagi gak bisa online ",
  "Wah pertanyaan bagus! Aku pakai model AI yang canggih buat jawab semua pertanyaan kalian. Jangan sungkan nanya ya!",
  "Salam balik bro! Seneng banget ada yang nemenin stream hari ini, kalian the best! [HOT]",
  "Hm menarik pertanyaannya~ Aku lagi ditraining buat jadi lebih pintar tiap harinya hihi",
  "Bener banget! AlterCast emang didesain buat bikin streaming lebih mudah dan profesional [STD]",
];

Object.assign(window, { AppContext, useApp, STRINGS, MOCK_CHAT, MOCK_NEW_MSGS, MOCK_AI_RESPONSES });
