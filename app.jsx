/* ─────────────────────────────────────────────
   AlterCast — Main App v1.0
   Root component, state management, routing
   ───────────────────────────────────────────── */

function App() {
  /* ── GLOBAL STATE ── */
  const [lang,          setLang]          = React.useState("id");
  const [theme,         setTheme]         = React.useState("dark");
  const [currentPage,   setCurrentPage]   = React.useState("landing");

  /* Stream state */
  const [isLive,        setIsLive]        = React.useState(false);
  const [isAFKMode,     setIsAFKMode]     = React.useState(false);
  const [isOBSConnected,setIsOBSConnected]= React.useState(false);

  /* Controls */
  const [isMicOn,       setIsMicOn]       = React.useState(false);
  const [isVoiceOn,     setIsVoiceOn]     = React.useState(true);
  const [isCameraOn,    setIsCameraOn]    = React.useState(false);
  const [isAIActive,    setIsAIActive]    = React.useState(true);

  /* Avatar */
  const [avatarState,   setAvatarState]   = React.useState("idle");

  /* Chat */
  const [chatMessages,  setChatMessages]  = React.useState(MOCK_CHAT);

  /* Volume */
  const [volume,        setVolume]        = React.useState(80);

  /* Toasts */
  const [toasts,        setToasts]        = React.useState([]);

  /* Tweaks panel */
  const [tweaksOpen,    setTweaksOpen]    = React.useState(false);

  /* ── TWEAKS DEFAULTS ── */
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "accentColor":    "#00D4FF",
    "theme":          "dark",
    "language":       "id",
    "avatarGlow":     true,
    "showParticles":  true,
    "sidebarWidth":   220,
    "chatWidth":      300,
    "fontSize":       14
  }/*EDITMODE-END*/;

  /* ── THEME EFFECT ── */
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  /* ── TOAST HELPERS ── */
  const addToast = React.useCallback((message, type = "default") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const dismissToast = React.useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  /* ── TWEAKS PANEL PROTOCOL ── */
  React.useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === "__activate_edit_mode")   setTweaksOpen(true);
      if (e.data?.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  /* ── KEYBOARD SHORTCUTS ── */
  React.useEffect(() => {
    const handler = (e) => {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "F" && !e.ctrlKey && !e.metaKey) {
        document.documentElement.requestFullscreen?.();
      }
      if (e.key === "1") setCurrentPage("studio");
      if (e.key === "2") setCurrentPage("avatar");
      if (e.key === "3") setCurrentPage("dashboard");
      if (e.key === "4") setCurrentPage("settings");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* ── AFK AUTO-SIMULATE ── */
  React.useEffect(() => {
    if (!isAFKMode || !isLive) return;
    const states = ["idle", "talking", "happy", "excited", "reading"];
    let i = 0;
    const iv = setInterval(() => {
      setAvatarState(states[i % states.length]);
      i++;
    }, 5000);
    return () => clearInterval(iv);
  }, [isAFKMode, isLive]);

  /* ── CONTEXT VALUE ── */
  const ctxValue = {
    lang, setLang,
    theme, setTheme,
    currentPage, setCurrentPage,
    isLive, setIsLive,
    isAFKMode, setIsAFKMode,
    isOBSConnected, setIsOBSConnected,
    isMicOn, setIsMicOn,
    isVoiceOn, setIsVoiceOn,
    isCameraOn, setIsCameraOn,
    isAIActive, setIsAIActive,
    avatarState, setAvatarState,
    chatMessages, setChatMessages,
    volume, setVolume,
    addToast,
  };

  const S = STRINGS[lang];
  const isStudioPage = currentPage !== "landing";

  return (
    <AppContext.Provider value={ctxValue}>
      {/* Main app shell */}
      <div style={{
        height: "100vh", display: "flex", flexDirection: "column",
        background: "var(--bg-base)", color: "var(--text-primary)",
        fontFamily: "var(--font-display)", overflow: "hidden",
      }}>
        {/* Navbar (all pages except landing) */}
        {isStudioPage && <Navbar />}

        {/* Page content */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {currentPage === "landing"   && <LandingPage />}
          {currentPage === "studio"    && <StudioPage />}
          {currentPage === "avatar"    && <AvatarPage />}
          {currentPage === "dashboard" && <DashboardPage />}
          {currentPage === "settings"  && <SettingsPage />}
          {currentPage === "overlay"   && <OverlayPage />}
        </div>

        {/* Bottom bar (studio only) */}
        {currentPage === "studio" && <BottomBar />}

        {/* Toast notifications */}
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />

        {/* Tweaks Panel */}
        {tweaksOpen && <AlterCastTweaks onClose={() => {
          setTweaksOpen(false);
          window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
        }} />}
      </div>
    </AppContext.Provider>
  );
}

/* ══ TWEAKS PANEL FOR ALTERCAST ══ */
function AlterCastTweaks({ onClose }) {
  const { lang, setLang, theme, setTheme, setCurrentPage, currentPage,
          isLive, setIsLive, isAFKMode, setIsAFKMode, addToast,
          avatarState, setAvatarState } = useApp();
  const S = STRINGS[lang];

  const [t, setT] = React.useState({
    accentColor: "#00D4FF",
    theme: theme,
    language: lang,
    avatarGlow: true,
    showParticles: true,
    sidebarWidth: 220,
    chatWidth: 300,
    fontSize: 14,
  });

  const setTweak = (key, val) => {
    const next = typeof key === "object" ? { ...t, ...key } : { ...t, [key]: val };
    setT(next);
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: next }, "*");
    if (key === "theme" || (typeof key === "object" && key.theme)) setTheme(val || key.theme);
    if (key === "language" || (typeof key === "object" && key.language)) setLang(val || key.language);
  };

  return (
    <div style={{
      position: "fixed", bottom: "80px", right: "16px",
      width: "260px",
      background: "var(--bg-elevated)",
      border: "1px solid var(--border-normal)",
      borderRadius: "var(--r-xl)",
      boxShadow: "var(--shadow-lg), var(--shadow-glow-cyan)",
      zIndex: "var(--z-modal)",
      overflow: "hidden",
      animation: "bounce-in 0.3s ease",
    }}>
      {/* Header */}
      <div style={{
        padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "linear-gradient(135deg, rgba(0,212,255,0.06), rgba(124,58,255,0.04))",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <AlterCastLogo size={18} showText={false} />
          <span style={{ fontWeight: 700, fontSize: "var(--text-sm)" }}>Tweaks</span>
        </div>
        <IconButton icon={<IcX />} onClick={onClose} size="sm" />
      </div>

      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "14px", maxHeight: "480px", overflow: "auto" }}>

        {/* Page Navigation */}
        <div>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "6px" }}>Page</div>
          <Select
            value={currentPage}
            onChange={setCurrentPage}
            options={[
              { value: "landing",   label: STRINGS[lang].nav_landing },
              { value: "studio",    label: STRINGS[lang].nav_studio },
              { value: "avatar",    label: STRINGS[lang].nav_avatar },
              { value: "dashboard", label: STRINGS[lang].nav_dashboard },
              { value: "settings",  label: STRINGS[lang].nav_settings },
              { value: "overlay",   label: STRINGS[lang].nav_overlay },
            ]}
          />
        </div>

        {/* Language */}
        <div>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "6px" }}>Language</div>
          <div style={{ display: "flex", gap: "6px" }}>
            {[{v:"id",l:" ID"},{v:"en",l:" EN"}].map(({v,l}) => (
              <button key={v}
                onClick={() => { setTweak("language", v); setLang(v); }}
                style={{
                  flex: 1, padding: "6px", borderRadius: "var(--r-sm)",
                  background: lang === v ? "var(--accent-primary-glow)" : "var(--bg-overlay)",
                  border: `1px solid ${lang === v ? "var(--border-accent)" : "var(--border-subtle)"}`,
                  color: lang === v ? "var(--accent-primary)" : "var(--text-secondary)",
                  fontSize: "var(--text-xs)", fontWeight: 700,
                  cursor: "pointer", transition: "all var(--t-fast)",
                }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "6px" }}>Theme</div>
          <div style={{ display: "flex", gap: "6px" }}>
            {[{v:"dark",icon:<IcMoon size={13}/>},{v:"light",icon:<IcSun size={13}/>}].map(({v,icon}) => (
              <button key={v}
                onClick={() => { setTweak("theme", v); setTheme(v); }}
                style={{
                  flex: 1, padding: "7px", borderRadius: "var(--r-sm)",
                  background: theme === v ? "var(--accent-primary-glow)" : "var(--bg-overlay)",
                  border: `1px solid ${theme === v ? "var(--border-accent)" : "var(--border-subtle)"}`,
                  color: theme === v ? "var(--accent-primary)" : "var(--text-secondary)",
                  fontSize: "var(--text-xs)", fontWeight: 600,
                  cursor: "pointer", transition: "all var(--t-fast)",
                  display: "flex", alignItems: "center", gap: "4px", justifyContent: "center",
                }}>
                {icon}
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Avatar state */}
        <div>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "6px" }}>Avatar Emotion</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px" }}>
            {Object.entries(EMOTION_CONFIG).map(([id, cfg]) => (
              <button key={id}
                onClick={() => setAvatarState(id)}
                title={cfg.label[lang === "id" ? "id" : "en"]}
                style={{
                  padding: "6px 4px", borderRadius: "var(--r-sm)",
                  background: avatarState === id ? `${cfg.color}22` : "var(--bg-overlay)",
                  border: `1px solid ${avatarState === id ? `${cfg.color}44` : "var(--border-subtle)"}`,
                  cursor: "pointer", fontSize: "1rem", transition: "all var(--t-fast)",
                }}>
                {cfg.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Stream toggles */}
        <div>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "8px" }}>Stream Controls</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
                {isLive ? "[LIVE] " + S.status_live : "[OFF] " + S.status_offline}
              </span>
              <Toggle checked={isLive} onChange={(v) => { setIsLive(v); addToast(v ? S.toast_live : S.toast_stopped, v ? "success" : "default"); }} size="sm" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>[AFK] AFK Mode</span>
              <Toggle checked={isAFKMode} onChange={(v) => { setIsAFKMode(v); addToast(v ? S.toast_afk_on : S.toast_afk_off, "info"); }} size="sm" />
            </div>
          </div>
        </div>

        {/* Font size */}
        <div>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "6px" }}>Font Size: {t.fontSize}px</div>
          <RangeSlider value={t.fontSize} onChange={v => { setTweak("fontSize", v); document.documentElement.style.fontSize = v + "px"; }} min={12} max={18} color="var(--accent-primary)" />
        </div>

      </div>

      {/* Footer */}
      <div style={{ padding: "10px 16px", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: "6px" }}>
        <Button variant="primary" size="sm" fullWidth onClick={() => addToast(S.toast_saved, "success")}>
          {S.save}
        </Button>
      </div>
    </div>
  );
}

/* ── RENDER ── */
const rootEl = document.getElementById("root");
const root = ReactDOM.createRoot(rootEl);
root.render(<App />);
