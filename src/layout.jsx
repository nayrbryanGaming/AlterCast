/* ─────────────────────────────────────────────
   AlterCast — Layout Components v1.0
   Navbar, Sidebar, BottomBar, ChatPanel
   ───────────────────────────────────────────── */

/* ══ NAVBAR ══ */
function Navbar() {
  const { lang, currentPage, setCurrentPage, isLive, theme, setTheme, setLang } = useApp();
  const S = STRINGS[lang];
  const navItems = [
    { id: "studio",    icon: <IcSliders />,        label: S.nav_studio },
    { id: "avatar",    icon: <IcUserSquare />,     label: S.nav_avatar },
    { id: "dashboard", icon: <IcLayoutDashboard />, label: S.nav_dashboard },
    { id: "settings",  icon: <IcSettings />,       label: S.nav_settings },
    { id: "overlay",   icon: <IcMonitor />,        label: S.nav_overlay },
  ];
  return (
    <nav style={{
      height: "var(--navbar-height)",
      background: "var(--bg-surface)",
      borderBottom: "1px solid var(--border-subtle)",
      display: "flex", alignItems: "center",
      padding: "0 16px", gap: "8px",
      flexShrink: 0,
      backdropFilter: "blur(12px)",
      position: "relative", zIndex: "var(--z-sticky)",
    }}>
      {/* Logo */}
      <button
        onClick={() => setCurrentPage("landing")}
        style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", borderRadius: "var(--r-sm)", display: "flex" }}
      >
        <AlterCastLogo size={28} />
      </button>

      <div style={{ width: 1, height: 24, background: "var(--border-subtle)", margin: "0 4px" }} />

      {/* Nav Items */}
      <div style={{ display: "flex", gap: "2px", flex: 1 }}>
        {navItems.map(item => {
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "6px 12px", borderRadius: "var(--r-sm)",
                background: active ? "var(--accent-primary-glow)" : "transparent",
                border: `1px solid ${active ? "var(--border-accent)" : "transparent"}`,
                color: active ? "var(--accent-primary)" : "var(--text-secondary)",
                fontSize: "var(--text-sm)", fontWeight: active ? 600 : 500,
                fontFamily: "var(--font-display)",
                cursor: "pointer", transition: "all var(--t-fast)", outline: "none",
              }}
              onMouseOver={e => !active && Object.assign(e.currentTarget.style, { background: "var(--bg-hover)", color: "var(--text-primary)" })}
              onMouseOut={e => !active && Object.assign(e.currentTarget.style, { background: "transparent", color: "var(--text-secondary)" })}
            >
              {React.cloneElement(item.icon, { size: 14 })}
              <span style={{ "@media (max-width: 768px)": { display: "none" } }}>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right side controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        {/* Language Toggle */}
        <button
          onClick={() => setLang(lang === "id" ? "en" : "id")}
          style={{
            background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
            borderRadius: "var(--r-sm)", padding: "4px 8px",
            fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.06em",
            color: "var(--text-secondary)", cursor: "pointer",
            fontFamily: "var(--font-display)", transition: "all var(--t-fast)",
          }}
          onMouseOver={e => Object.assign(e.currentTarget.style, { borderColor: "var(--border-accent)", color: "var(--accent-primary)" })}
          onMouseOut={e => Object.assign(e.currentTarget.style, { borderColor: "var(--border-subtle)", color: "var(--text-secondary)" })}
        >
          {lang === "id" ? " ID" : " EN"}
        </button>

        {/* Theme toggle */}
        <IconButton
          icon={theme === "dark" ? <IcSun /> : <IcMoon />}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          tooltip={theme === "dark" ? "Light mode" : "Dark mode"}
          size="sm"
        />

        {/* Live badge */}
        <LiveBadge isLive={isLive} lang={lang} />

        {/* Profile */}
        <AvatarCircle name="NB" size={30} status={isLive ? "live" : "online"} color="#00D4FF" />
      </div>
    </nav>
  );
}

/* ══ SIDEBAR ══ */
function Sidebar() {
  const { lang, avatarState, setAvatarState, isLive, isMicOn, setIsMicOn,
          isVoiceOn, setIsVoiceOn, isCameraOn, setIsCameraOn,
          isAIActive, setIsAIActive, isAFKMode, setIsAFKMode, addToast } = useApp();
  const S = STRINGS[lang];

  const emotions = [
    { id: "idle",    emoji: "", label: lang === "id" ? "Siaga" : "Idle" },
    { id: "happy",   emoji: "[SMILE]", label: lang === "id" ? "Senang" : "Happy" },
    { id: "excited", emoji: "[HOT]", label: lang === "id" ? "Excited" : "Excited" },
    { id: "sleepy",  emoji: "", label: lang === "id" ? "Ngantuk" : "Sleepy" },
    { id: "laughing",emoji: "[LOL]", label: lang === "id" ? "Ketawa" : "Laugh" },
    { id: "sad",     emoji: "", label: lang === "id" ? "Sedih" : "Sad" },
  ];

  return (
    <aside style={{
      width: "var(--sidebar-width)",
      background: "var(--bg-surface)",
      borderRight: "1px solid var(--border-subtle)",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      <div style={{ flex: 1, overflow: "auto", padding: "12px 10px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* MODE SECTION */}
        <div>
          <SectionHeader label={S.mode} />
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {[
              { id: "active", icon: <IcRadio size={13} />, label: isLive ? S.status_live : S.status_offline, color: isLive ? "var(--status-live)" : "var(--text-secondary)" },
              { id: "afk",    icon: <IcMoon size={13} />,  label: S.status_afk,   color: isAFKMode ? "#7C3AFF" : "var(--text-secondary)" },
              { id: "idle",   icon: <IcZap size={13} />,   label: S.status_idle,  color: "var(--text-secondary)" },
            ].map(item => (
              <button key={item.id}
                onClick={() => {
                  if (item.id === "afk") { setIsAFKMode(!isAFKMode); addToast(isAFKMode ? S.toast_afk_off : S.toast_afk_on, isAFKMode ? "default" : "info"); }
                }}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "7px 10px", borderRadius: "var(--r-sm)",
                  background: (item.id === "afk" && isAFKMode) ? "rgba(124,58,255,0.1)" : "transparent",
                  border: "none", cursor: "pointer",
                  color: item.color,
                  fontSize: "var(--text-sm)", fontWeight: 500,
                  fontFamily: "var(--font-display)",
                  transition: "background var(--t-fast)",
                  textAlign: "left", width: "100%",
                }}
                onMouseOver={e => e.currentTarget.style.background = "var(--bg-hover)"}
                onMouseOut={e => e.currentTarget.style.background = (item.id === "afk" && isAFKMode) ? "rgba(124,58,255,0.1)" : "transparent"}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <Divider />

        {/* EMOTION SECTION */}
        <div>
          <SectionHeader label={S.emotion} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
            {emotions.map(e => (
              <button key={e.id}
                onClick={() => setAvatarState(e.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "6px 8px", borderRadius: "var(--r-sm)",
                  background: avatarState === e.id ? "var(--accent-primary-glow)" : "transparent",
                  border: `1px solid ${avatarState === e.id ? "var(--border-accent)" : "transparent"}`,
                  color: avatarState === e.id ? "var(--accent-primary)" : "var(--text-secondary)",
                  fontSize: "var(--text-xs)", fontWeight: 500,
                  fontFamily: "var(--font-display)",
                  cursor: "pointer", transition: "all var(--t-fast)", outline: "none",
                }}
                onMouseOver={e2 => avatarState !== e.id && (e2.currentTarget.style.background = "var(--bg-hover)")}
                onMouseOut={e2 => avatarState !== e.id && (e2.currentTarget.style.background = "transparent")}
              >
                <span>{e.emoji}</span>
                <span>{e.label}</span>
              </button>
            ))}
          </div>
        </div>

        <Divider />

        {/* CONTROLS */}
        <div>
          <SectionHeader label={S.controls} />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "0 2px" }}>
            {[
              { key: "mic",    icon: isMicOn ? <IcMic size={13}/> : <IcMicOff size={13}/>,       label: S.mic,    val: isMicOn,    set: setIsMicOn },
              { key: "voice",  icon: isVoiceOn ? <IcVolume2 size={13}/> : <IcVolumeX size={13}/>, label: S.voice,  val: isVoiceOn,  set: setIsVoiceOn },
              { key: "camera", icon: isCameraOn ? <IcCamera size={13}/> : <IcCameraOff size={13}/>, label: S.camera, val: isCameraOn, set: setIsCameraOn },
            ].map(ctrl => (
              <div key={ctrl.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px", color: ctrl.val ? "var(--text-primary)" : "var(--text-muted)", fontSize: "var(--text-xs)", fontWeight: 500 }}>
                  {ctrl.icon}
                  {ctrl.label}
                </div>
                <Toggle checked={ctrl.val} onChange={ctrl.set} size="sm" />
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* AI STATUS */}
        <div>
          <SectionHeader label={S.ai_status} />
          <div style={{
            background: "var(--bg-elevated)",
            border: `1px solid ${isAIActive ? "var(--border-accent)" : "var(--border-subtle)"}`,
            borderRadius: "var(--r-md)", padding: "10px 12px",
            display: "flex", flexDirection: "column", gap: "8px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: isAIActive ? "var(--accent-primary)" : "var(--text-muted)", fontSize: "var(--text-xs)", fontWeight: 600 }}>
                <IcBrain size={13} />
                {lang === "id" ? "Qwen2.5:7b" : "Qwen2.5:7b"}
              </div>
              <Toggle checked={isAIActive} onChange={setIsAIActive} size="sm" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{S.latency}</span>
              <span style={{ fontSize: "0.65rem", color: "var(--status-online)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>~320ms</span>
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              <Badge variant={isAIActive ? "primary" : "ghost"} size="xs">
                <IcCpu size={9} style={{ marginRight: 3 }} />
                LOCAL
              </Badge>
              <Badge variant="ghost" size="xs">CLOUD</Badge>
            </div>
          </div>
        </div>

        <Divider />

        {/* STREAM PLATFORMS */}
        <div>
          <SectionHeader label={lang === "id" ? "Platform" : "Platforms"} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <PlatformBadge platform="twitch" connected={isLive} />
            <PlatformBadge platform="youtube" connected={false} />
            <PlatformBadge platform="tiktok" connected={false} />
          </div>
        </div>

      </div>
    </aside>
  );
}

/* ══ BOTTOM BAR ══ */
function BottomBar() {
  const { lang, isLive, setIsLive, addToast, isAFKMode, setIsAFKMode,
          isOBSConnected, setIsOBSConnected, volume, setVolume } = useApp();
  const S = STRINGS[lang];
  return (
    <div style={{
      height: "var(--bottombar-height)",
      background: "var(--bg-surface)",
      borderTop: "1px solid var(--border-subtle)",
      display: "flex", alignItems: "center",
      padding: "0 16px", gap: "10px",
      flexShrink: 0,
    }}>
      {/* START/STOP STREAM */}
      <Button
        variant={isLive ? "live" : "primary"}
        size="md"
        icon={isLive ? <IcSquare /> : <IcPlay />}
        onClick={() => { setIsLive(!isLive); addToast(isLive ? S.toast_stopped : S.toast_live, isLive ? "default" : "success"); }}
        style={{ minWidth: 140 }}
      >
        {isLive ? S.stop_stream : S.start_stream}
      </Button>

      {/* RECORD */}
      <Button variant="surface" size="md" icon={<IcCircle />}>
        {lang === "id" ? "Rekam" : "Record"}
      </Button>

      {/* OBS */}
      <Button
        variant={isOBSConnected ? "outline" : "surface"}
        size="md"
        icon={isOBSConnected ? <IcWifi /> : <IcWifiOff />}
        onClick={() => { setIsOBSConnected(!isOBSConnected); addToast(isOBSConnected ? S.obs_disconnected : S.toast_obs_ok, isOBSConnected ? "warning" : "success"); }}
      >
        OBS {isOBSConnected ? (lang === "id" ? "Terhubung" : "Connected") : (lang === "id" ? "Hubungkan" : "Connect")}
      </Button>

      {/* AFK MODE */}
      <Button
        variant={isAFKMode ? "secondary" : "ghost"}
        size="md"
        icon={<IcMoon />}
        onClick={() => { setIsAFKMode(!isAFKMode); addToast(isAFKMode ? S.toast_afk_off : S.toast_afk_on, "info"); }}
        style={{ borderColor: isAFKMode ? "var(--border-violet)" : undefined }}
      >
        {S.enable_afk}
      </Button>

      {/* SPACER */}
      <div style={{ flex: 1 }} />

      {/* VOLUME */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 140 }}>
        <IcVolume2 size={14} color="var(--text-muted)" />
        <RangeSlider value={volume} onChange={setVolume} min={0} max={100} color="var(--accent-primary)" />
        <span style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: "var(--text-muted)", minWidth: "28px", textAlign: "right" }}>
          {volume}%
        </span>
      </div>

      {/* FULLSCREEN */}
      <IconButton
        icon={<IcMaximize2 />}
        tooltip={S.fullscreen}
        size="md"
        onClick={() => document.documentElement.requestFullscreen?.()}
      />

      {/* SETTINGS shortcut */}
      <IconButton icon={<IcSettings />} tooltip={S.nav_settings} size="md" />
    </div>
  );
}

/* ══ CHAT PANEL ══ */
function ChatPanel() {
  const { lang, isLive, isAIActive, chatMessages, setChatMessages, addToast } = useApp();
  const S = STRINGS[lang];
  const [manualMsg, setManualMsg] = React.useState("");
  const [aiTyping, setAiTyping] = React.useState(false);
  const chatEndRef = React.useRef(null);

  // Auto-scroll
  React.useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.parentElement.scrollTop = chatEndRef.current.offsetTop;
    }
  }, [chatMessages, aiTyping]);

  // Simulate incoming chat
  React.useEffect(() => {
    if (!isLive) return;
    let idx = 0;
    const interval = setInterval(() => {
      const msg = MOCK_NEW_MSGS[idx % MOCK_NEW_MSGS.length];
      const newMsg = { ...msg, id: Date.now() + Math.random(), type: "message", ts: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) };
      setChatMessages(prev => [...prev.slice(-99), newMsg]);
      idx++;
      // Trigger AI response
      if (isAIActive && idx % 3 === 0) {
        setAiTyping(true);
        setTimeout(() => {
          const resp = MOCK_AI_RESPONSES[Math.floor(Math.random() * MOCK_AI_RESPONSES.length)];
          setChatMessages(prev => [...prev, {
            id: Date.now(), user: "AlterCast AI", color: "#00D4FF",
            text: resp, type: "ai", ts: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
          }]);
          setAiTyping(false);
        }, 1800 + Math.random() * 1200);
      }
    }, 3500 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [isLive, isAIActive]);

  const sendManual = () => {
    if (!manualMsg.trim()) return;
    setChatMessages(prev => [...prev, {
      id: Date.now(), user: lang === "id" ? "Streamer" : "Streamer",
      color: "#FFB800", text: manualMsg, type: "manual",
      ts: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    }]);
    setManualMsg("");
  };

  return (
    <div style={{
      width: "var(--chat-width)",
      background: "var(--bg-surface)",
      borderLeft: "1px solid var(--border-subtle)",
      display: "flex", flexDirection: "column",
      flexShrink: 0, overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "10px 14px",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <IcMessageSquare size={14} color="var(--accent-primary)" />
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>
            {S.chat}
          </span>
          <Badge variant="primary" size="xs">{chatMessages.length}</Badge>
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          <IconButton icon={<IcFilter size={12} />} size="sm" tooltip="Filter" />
          <IconButton icon={<IcRefreshCw size={12} />} size="sm" tooltip="Clear" onClick={() => setChatMessages([])} />
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflow: "auto",
        padding: "8px 12px",
        display: "flex", flexDirection: "column", gap: "6px",
      }}>
        {chatMessages.length === 0 ? (
          <EmptyState
            icon={<IcMessageSquare />}
            title={isLive ? S.chat_waiting : S.chat_empty}
            description={!isLive ? (lang === "id" ? "Mulai siaran untuk melihat chat" : "Start stream to see chat") : ""}
          />
        ) : (
          chatMessages.map(msg => (
            <ChatMessage key={msg.id} msg={msg} />
          ))
        )}
        {aiTyping && (
          <div style={{ animation: "slide-up 0.2s ease" }}>
            <TypingIndicator label={S.ai_typing} />
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* AI Response preview */}
      {isAIActive && (
        <div style={{
          padding: "8px 12px",
          borderTop: "1px solid var(--border-subtle)",
          background: "var(--bg-elevated)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
            <IcBrain size={11} color="var(--accent-primary)" />
            <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>
              {S.ai_response}
            </span>
            <Badge variant="primary" size="xs">ACTIVE</Badge>
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", lineHeight: 1.5, fontStyle: "italic" }}>
            {lang === "id" ? "AI siap merespons chat..." : "AI ready to respond to chat..."}
          </div>
        </div>
      )}

      {/* Donation box */}
      <DonationBox lang={lang} isLive={isLive} />

      {/* Manual input */}
      <div style={{
        padding: "10px 12px",
        borderTop: "1px solid var(--border-subtle)",
        display: "flex", gap: "6px",
        flexShrink: 0,
      }}>
        <input
          value={manualMsg}
          onChange={e => setManualMsg(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendManual()}
          placeholder={S.type_message}
          style={{
            flex: 1, height: "32px",
            padding: "0 10px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-normal)",
            borderRadius: "var(--r-full)",
            color: "var(--text-primary)",
            fontSize: "var(--text-xs)",
            fontFamily: "var(--font-display)",
            outline: "none",
          }}
          onFocus={e => e.target.style.borderColor = "var(--border-focus)"}
          onBlur={e => e.target.style.borderColor = "var(--border-normal)"}
        />
        <button
          onClick={sendManual}
          style={{
            width: "32px", height: "32px",
            borderRadius: "50%",
            background: manualMsg.trim() ? "var(--accent-primary)" : "var(--bg-overlay)",
            border: "none", cursor: manualMsg.trim() ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background var(--t-fast)",
            flexShrink: 0,
          }}
        >
          <IcSend size={13} color={manualMsg.trim() ? "var(--text-inverse)" : "var(--text-muted)"} />
        </button>
      </div>
    </div>
  );
}

/* ══ CHAT MESSAGE ══ */
function ChatMessage({ msg }) {
  const isAI = msg.type === "ai";
  const isDonation = msg.type === "donation";
  return (
    <div style={{
      animation: "slide-up 0.2s ease",
      background: isDonation ? "rgba(255,184,0,0.06)" : isAI ? "var(--accent-primary-glow)" : "transparent",
      border: isDonation ? "1px solid rgba(255,184,0,0.2)" : isAI ? "1px solid var(--border-accent)" : "none",
      borderRadius: isDonation || isAI ? "var(--r-md)" : "var(--r-sm)",
      padding: isDonation || isAI ? "8px 10px" : "2px 4px",
    }}>
      {isDonation && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
          <IcHeart size={11} color="#FFB800" />
          <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#FFB800", letterSpacing: "0.05em" }}>
            {msg.amount}
          </span>
        </div>
      )}
      <div style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
        <AvatarCircle name={msg.user} size={18} color={msg.color} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "1px" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: msg.color, flexShrink: 0 }}>
              {msg.user}
            </span>
            {isAI && <Badge variant="primary" size="xs">AI</Badge>}
            <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginLeft: "auto", flexShrink: 0 }}>{msg.ts}</span>
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", lineHeight: 1.5, wordBreak: "break-word" }}>
            {msg.text}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ DONATION BOX ══ */
function DonationBox({ lang, isLive }) {
  const [donations] = React.useState([
    { user: "gifter_pro", amount: "Rp 10.000", msg: "Semangat terus!" },
    { user: "big_donator", amount: "Rp 50.000", msg: "teruskan karyanya bro!" },
  ]);
  if (!isLive) return null;
  return (
    <div style={{
      padding: "8px 12px",
      borderTop: "1px solid var(--border-subtle)",
      flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
        <IcHeart size={11} color="#FFB800" />
        <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>
          {lang === "id" ? "Donasi Terbaru" : "Recent Donations"}
        </span>
      </div>
      {donations.slice(-2).map((d, i) => (
        <div key={i} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "4px 0", borderBottom: i === 0 ? "1px solid var(--border-subtle)" : "none",
        }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>{d.user}</span>
          <Badge variant="warning" size="xs">{d.amount}</Badge>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { Navbar, Sidebar, BottomBar, ChatPanel, ChatMessage, DonationBox });
