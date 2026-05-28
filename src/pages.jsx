/* ─────────────────────────────────────────────
   AlterCast — Secondary Pages v1.0
   Avatar Creator, Dashboard, Settings, Landing,
   Overlay, Components Gallery
   ───────────────────────────────────────────── */

/* ══════════════════════════════
   AVATAR CREATOR PAGE
   ══════════════════════════════ */
function AvatarPage() {
  const { lang } = useApp();
  const S = STRINGS[lang];
  const [step, setStep] = React.useState(1);
  const [avatarName, setAvatarName] = React.useState("");
  const [style, setStyleOption] = React.useState("realistic");
  const [loading, setLoading] = React.useState(false);
  const [created, setCreated] = React.useState(false);

  const handleCreate = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setCreated(true); setStep(3); }, 2800);
  };

  const styles = [
    { id: "realistic", label: lang === "id" ? "Realistik" : "Realistic",   desc: lang === "id" ? "Mirip foto asli" : "Photorealistic" },
    { id: "anime",     label: "Anime / VTuber",                              desc: lang === "id" ? "Gaya anime Jepang" : "Japanese anime style" },
    { id: "cartoon",   label: lang === "id" ? "Kartun" : "Cartoon",         desc: lang === "id" ? "Bergaya karakter kartun" : "Cartoonish character" },
    { id: "lowpoly",   label: "Low Poly",                                   desc: lang === "id" ? "Geometrik modern" : "Modern geometric" },
  ];

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Left: Steps & Config */}
      <div style={{
        width: "420px", borderRight: "1px solid var(--border-subtle)",
        display: "flex", flexDirection: "column", overflow: "auto",
        background: "var(--bg-surface)", flexShrink: 0,
      }}>
        <div style={{ padding: "20px" }}>
          <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 800, marginBottom: "4px", letterSpacing: "-0.02em" }}>
            {S.create_avatar}
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginBottom: "24px" }}>
            {lang === "id" ? "Buat avatar 3D personalmu dalam 3 langkah mudah" : "Create your personal 3D avatar in 3 easy steps"}
          </p>

          {/* Step Indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "28px" }}>
            {[1, 2, 3].map((s, i) => (
              <React.Fragment key={s}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: step >= s ? "var(--accent-primary)" : "var(--bg-overlay)",
                  border: `2px solid ${step >= s ? "var(--accent-primary)" : "var(--border-normal)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "var(--text-xs)", fontWeight: 800,
                  color: step >= s ? "var(--text-inverse)" : "var(--text-muted)",
                  flexShrink: 0, transition: "all var(--t-base)",
                  boxShadow: step === s ? "var(--shadow-glow-cyan)" : "none",
                }}>
                  {step > s ? <IcCheck size={14} /> : s}
                </div>
                {i < 2 && (
                  <div style={{
                    flex: 1, height: "2px",
                    background: step > s ? "var(--accent-primary)" : "var(--border-subtle)",
                    transition: "background var(--t-slow)",
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* STEP 1: Upload Photo */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", animation: "slide-up 0.3s ease" }}>
              <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700 }}>
                {lang === "id" ? "1. Unggah Foto Wajah" : "1. Upload Face Photo"}
              </h3>

              {/* Upload area */}
              <div style={{
                border: "2px dashed var(--border-accent)",
                borderRadius: "var(--r-lg)",
                padding: "40px 20px",
                textAlign: "center",
                background: "var(--accent-primary-glow)",
                cursor: "pointer",
                transition: "all var(--t-fast)",
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}></div>
                <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                  {lang === "id" ? "Klik atau drag foto selfie" : "Click or drag selfie photo"}
                </div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                  JPG, PNG • max 10MB • {lang === "id" ? "Wajah menghadap depan, pencahayaan baik" : "Front-facing, good lighting"}
                </div>
              </div>

              <Divider label={lang === "id" ? "atau" : "or"} />

              <Button variant="outline" fullWidth icon={<IcLink />}
                onClick={() => { setStep(2); }}>
                {lang === "id" ? "Gunakan Ready Player Me" : "Use Ready Player Me"}
              </Button>

              <Button variant="primary" fullWidth onClick={() => setStep(2)}>
                {lang === "id" ? "Lanjut dengan Foto" : "Continue with Photo"}
                <IcChevronRight size={14} />
              </Button>
            </div>
          )}

          {/* STEP 2: Customize */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", animation: "slide-up 0.3s ease" }}>
              <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700 }}>
                {lang === "id" ? "2. Konfigurasi Avatar" : "2. Configure Avatar"}
              </h3>

              <FormField label={S.avatar_name} required>
                <Input
                  value={avatarName}
                  onChange={setAvatarName}
                  placeholder={lang === "id" ? "Mis: AlterMe, NayrBot..." : "e.g. AlterMe, NayrBot..."}
                  icon={<IcUser />}
                />
              </FormField>

              <FormField label={lang === "id" ? "Gaya Avatar" : "Avatar Style"}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {styles.map(s => (
                    <button key={s.id}
                      onClick={() => setStyleOption(s.id)}
                      style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "10px 14px", borderRadius: "var(--r-md)",
                        background: style === s.id ? "var(--accent-primary-glow)" : "var(--bg-elevated)",
                        border: `1px solid ${style === s.id ? "var(--border-accent)" : "var(--border-subtle)"}`,
                        cursor: "pointer", transition: "all var(--t-fast)", outline: "none",
                        textAlign: "left",
                      }}>
                      <div>
                        <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: style === s.id ? "var(--accent-primary)" : "var(--text-primary)" }}>{s.label}</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{s.desc}</div>
                      </div>
                      {style === s.id && <IcCheck size={16} color="var(--accent-primary)" />}
                    </button>
                  ))}
                </div>
              </FormField>

              <FormField label={lang === "id" ? "Kepribadian" : "Personality"}>
                <Textarea
                  placeholder={lang === "id" ? "Describe personality, tone of voice, topics to discuss..." : "Describe personality, tone of voice..."}
                  rows={3}
                />
              </FormField>

              <div style={{ display: "flex", gap: "8px" }}>
                <Button variant="ghost" onClick={() => setStep(1)} icon={<IcChevronLeft />}>{S.back}</Button>
                <Button variant="primary" fullWidth onClick={handleCreate} loading={loading}>
                  {loading ? (lang === "id" ? "Membuat..." : "Creating...") : S.create_avatar}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Done */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", animation: "bounce-in 0.5s ease" }}>
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "3rem", marginBottom: "8px" }}>[YAY]</div>
                <h3 style={{ fontSize: "var(--text-xl)", fontWeight: 800, marginBottom: "4px" }}>
                  {lang === "id" ? "Avatar Berhasil Dibuat!" : "Avatar Created!"}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
                  {lang === "id" ? `"${avatarName || "AlterBot"}" siap untuk streaming` : `"${avatarName || "AlterBot"}" is ready to stream`}
                </p>
              </div>
              <Button variant="primary" fullWidth icon={<IcSliders />}>
                {lang === "id" ? "Buka di Studio" : "Open in Studio"}
              </Button>
              <Button variant="ghost" fullWidth onClick={() => setStep(1)}>
                {lang === "id" ? "Buat Avatar Baru" : "Create Another Avatar"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right: Preview */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        background: "var(--bg-void)", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: "20px",
        }}>
          {loading ? (
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
              <Spinner size={48} />
              <div>
                <div style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "4px" }}>{S.loading_avatar}</div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
                  {lang === "id" ? "Ready Player Me API sedang memproses..." : "Ready Player Me API processing..."}
                </div>
              </div>
              <ProgressBar value={65} animated color="var(--accent-primary)" height={4} glow />
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              {/* Mock avatar preview — same as studio but smaller */}
              <div style={{
                filter: `drop-shadow(0 0 30px rgba(0,212,255,0.3))`,
                animation: "breathe 3s ease-in-out infinite",
              }}>
                <svg viewBox="0 0 200 280" width="200" height="280">
                  <ellipse cx="100" cy="95" rx="52" ry="58" fill="var(--bg-void)" stroke="var(--accent-primary)" strokeWidth="1.4" opacity="0.7" />
                  <path d="M50,85 Q55,42 100,40 Q145,42 150,85" fill="rgba(0,212,255,0.05)" stroke="var(--accent-primary)" strokeWidth="1.2" opacity="0.5" />
                  <ellipse cx="81" cy="88" rx="8" ry="7" fill="var(--accent-primary)" opacity="0.85" />
                  <ellipse cx="119" cy="88" rx="8" ry="7" fill="var(--accent-primary)" opacity="0.85" />
                  <circle cx="83" cy="86" r="2" fill="white" opacity="0.7" />
                  <circle cx="121" cy="86" r="2" fill="white" opacity="0.7" />
                  <path d="M85,105 Q100,113 115,105" stroke="var(--accent-primary)" strokeWidth="2" fill="none" opacity="0.8" />
                  <rect x="88" y="148" width="24" height="26" rx="4" fill="var(--bg-void)" stroke="var(--accent-primary)" strokeWidth="1" opacity="0.4" />
                  <path d="M32,228 Q68,187 100,183 Q132,187 168,228 L170,270 Q100,285 30,270 Z" fill="var(--bg-void)" stroke="var(--accent-primary)" strokeWidth="1.2" opacity="0.5" />
                  {created && (
                    <g>
                      <rect x="68" y="250" width="64" height="18" rx="9" fill="rgba(0,255,136,0.2)" stroke="rgba(0,255,136,0.5)" strokeWidth="1" />
                      <text x="100" y="263" fill="#00FF88" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">READY </text>
                    </g>
                  )}
                </svg>
              </div>
              <div style={{ textAlign: "center", marginTop: "12px" }}>
                <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--text-primary)" }}>
                  {avatarName || "AlterBot"}
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "6px" }}>
                  <Tag color="cyan">VRM 1.0</Tag>
                  <Tag color="violet">{style}</Tag>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Available Avatars */}
        <div style={{ padding: "16px", borderTop: "1px solid var(--border-subtle)", background: "var(--bg-surface)" }}>
          <SectionHeader label={lang === "id" ? "Avatar Tersimpan" : "Saved Avatars"} />
          <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "4px" }}>
            {["AlterBot","StreamerX","NayrAI"].map((name, i) => (
              <div key={i} style={{
                flexShrink: 0, textAlign: "center", cursor: "pointer",
                padding: "8px", borderRadius: "var(--r-md)",
                border: i === 0 ? "1px solid var(--border-accent)" : "1px solid transparent",
                background: i === 0 ? "var(--accent-primary-glow)" : "transparent",
                transition: "all var(--t-fast)",
              }}>
                <AvatarCircle name={name} size={36} color={["#00D4FF","#7C3AFF","#00FF88"][i]} />
                <div style={{ fontSize: "0.65rem", marginTop: "4px", color: i === 0 ? "var(--accent-primary)" : "var(--text-muted)", fontWeight: 600 }}>{name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   DASHBOARD PAGE
   ══════════════════════════════ */
function DashboardPage() {
  const { lang, isLive } = useApp();
  const S = STRINGS[lang];
  const [sessionTime, setSessionTime] = React.useState(7342);

  React.useEffect(() => {
    if (!isLive) return;
    const iv = setInterval(() => setSessionTime(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [isLive]);

  const fmt = s => {
    const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
    return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${sec.toString().padStart(2,"0")}`;
  };

  const chatData = [45,62,38,71,55,80,67,92,48,73,61,85,54,78,63];

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 800, letterSpacing: "-0.02em" }}>{S.nav_dashboard}</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginTop: "4px" }}>
              {lang === "id" ? "Ringkasan sesi streaming saat ini" : "Current streaming session summary"}
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button variant="surface" size="sm" icon={<IcDownload />}>
              {lang === "id" ? "Ekspor CSV" : "Export CSV"}
            </Button>
            <LiveBadge isLive={isLive} lang={lang} />
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
          {[
            { label: S.duration,       value: fmt(sessionTime), icon: <IcClock size={14} />, color: "var(--accent-primary)", trend: null },
            { label: S.viewers,        value: isLive ? "247" : "0", icon: <IcUsers size={14} />, color: "#7C3AFF", trend: 12 },
            { label: S.total_messages, value: "1,842",          icon: <IcMessageSquare size={14} />, color: "var(--accent-primary)", trend: 8 },
            { label: S.ai_responses,   value: "214",            icon: <IcBrain size={14} />, color: "#7C3AFF", trend: 23 },
            { label: S.donations,      value: "Rp 235k",        icon: <IcHeart size={14} />, color: "#FFB800", trend: 45 },
            { label: S.chat_per_min,   value: "12.4",           icon: <IcActivity size={14} />, color: "var(--status-online)", trend: -3 },
          ].map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
          {/* Chat activity chart */}
          <Panel title={lang === "id" ? "Aktivitas Chat" : "Chat Activity"} icon={<IcActivity size={13} />}>
            <div style={{ padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "80px" }}>
                {chatData.map((v, i) => (
                  <div key={i} style={{
                    flex: 1, background: `rgba(0,212,255,${0.15 + (v/100)*0.6})`,
                    borderRadius: "3px 3px 0 0",
                    height: `${v}%`,
                    transition: "height 0.5s ease",
                    border: "1px solid rgba(0,212,255,0.2)",
                    cursor: "pointer",
                  }} title={`${v} msgs`} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  {lang === "id" ? "-15 mnt" : "-15 min"}
                </span>
                <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  {lang === "id" ? "Sekarang" : "Now"}
                </span>
              </div>
            </div>
          </Panel>

          {/* Top chatters */}
          <Panel title={lang === "id" ? "Top Chatter" : "Top Chatters"} icon={<IcStar size={13} />}>
            <div style={{ padding: "8px 16px" }}>
              {[
                { user: "anime_fan99", msgs: 142, color: "#00FF88" },
                { user: "StreamerX",  msgs: 98,  color: "#7C3AFF" },
                { user: "tech_wizard",msgs: 87,  color: "#00D4FF" },
                { user: "luna_chan",  msgs: 63,  color: "#FFB800" },
                { user: "pro_gamer_99",msgs: 51, color: "#FF6B9D" },
              ].map((u, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "6px 0",
                  borderBottom: i < 4 ? "1px solid var(--border-subtle)" : "none",
                }}>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", fontFamily: "var(--font-mono)", minWidth: "16px" }}>
                    #{i+1}
                  </span>
                  <AvatarCircle name={u.user} size={22} color={u.color} />
                  <span style={{ flex: 1, fontSize: "var(--text-xs)", fontWeight: 600 }}>{u.user}</span>
                  <Badge variant="ghost" size="xs">{u.msgs}</Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Recent donations */}
        <Panel
          title={lang === "id" ? "Donasi Terbaru" : "Recent Donations"}
          icon={<IcHeart size={13} />}
          actions={<Badge variant="warning" size="sm">Rp 235.000 total</Badge>}
        >
          <div style={{ padding: "0 16px" }}>
            {[
              { user: "big_donator", amount: "Rp 50.000", msg: "teruskan karyanya bro!",    time: "12:05" },
              { user: "gifter_pro",  amount: "Rp 10.000", msg: "Semangat terus!",            time: "12:03" },
              { user: "super_fan",   amount: "Rp 100.000",msg: "konten lo selalu keren!",    time: "11:58" },
              { user: "night_owl",   amount: "Rp 25.000", msg: "salam dari Yogyakarta ",   time: "11:52" },
            ].map((d, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "10px 0",
                borderBottom: i < 3 ? "1px solid var(--border-subtle)" : "none",
              }}>
                <AvatarCircle name={d.user} size={28} color="#FFB800" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 700 }}>{d.user}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{d.msg}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Badge variant="warning" size="sm">{d.amount}</Badge>
                  <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginTop: "2px", fontFamily: "var(--font-mono)" }}>{d.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* AI Performance */}
        <Panel title={lang === "id" ? "Performa AI" : "AI Performance"} icon={<IcBrain size={13} />}>
          <div style={{ padding: "16px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              { label: lang === "id" ? "Avg Latensi" : "Avg Latency",   value: "342ms", color: "var(--status-online)" },
              { label: lang === "id" ? "Total Request" : "Total Requests", value: "214",   color: "var(--accent-primary)" },
              { label: lang === "id" ? "TTS Usage" : "TTS Usage",       value: "68%",   color: "#FFB800" },
            ].map((m, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "4px" }}>{m.label}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   SETTINGS PAGE
   ══════════════════════════════ */
function SettingsPage() {
  const { lang } = useApp();
  const S = STRINGS[lang];
  const [activeSection, setActiveSection] = React.useState("persona");
  const [saved, setSaved] = React.useState(false);
  const { addToast } = useApp();

  const sections = [
    { id: "persona",    label: S.persona,     icon: <IcUser size={14} /> },
    { id: "avatar",     label: S.avatar_cfg,  icon: <IcUserSquare size={14} /> },
    { id: "stream",     label: S.stream_cfg,  icon: <IcRadio size={14} /> },
    { id: "ai",         label: S.ai_cfg,      icon: <IcBrain size={14} /> },
    { id: "voice",      label: S.voice_cfg,   icon: <IcVolume2 size={14} /> },
    { id: "obs",        label: S.obs_cfg,     icon: <IcMonitor size={14} /> },
    { id: "appearance", label: S.appearance,  icon: <IcPalette size={14} /> },
    { id: "privacy",    label: S.privacy,     icon: <IcLock size={14} /> },
  ];

  const handleSave = () => { addToast(S.toast_saved, "success"); };

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Settings nav */}
      <div style={{
        width: "200px", background: "var(--bg-surface)",
        borderRight: "1px solid var(--border-subtle)",
        padding: "12px 8px", overflow: "auto", flexShrink: 0,
      }}>
        <SectionHeader label={lang === "id" ? "Kategori" : "Category"} />
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {sections.map(s => (
            <button key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "8px 10px", borderRadius: "var(--r-sm)",
                background: activeSection === s.id ? "var(--accent-primary-glow)" : "transparent",
                border: `1px solid ${activeSection === s.id ? "var(--border-accent)" : "transparent"}`,
                color: activeSection === s.id ? "var(--accent-primary)" : "var(--text-secondary)",
                fontSize: "var(--text-sm)", fontWeight: activeSection === s.id ? 600 : 500,
                fontFamily: "var(--font-display)",
                cursor: "pointer", transition: "all var(--t-fast)", outline: "none",
                textAlign: "left", width: "100%",
              }}
              onMouseOver={e => activeSection !== s.id && (e.currentTarget.style.background = "var(--bg-hover)")}
              onMouseOut={e => activeSection !== s.id && (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ opacity: 0.8 }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Settings content */}
      <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>
        <div style={{ maxWidth: "640px" }}>
          <SettingsSection activeSection={activeSection} lang={lang} S={S} onSave={handleSave} />
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ activeSection, lang, S, onSave }) {
  const { theme, setTheme, setLang, lang: currentLang } = useApp();
  const [aiModel, setAiModel] = React.useState("ollama");
  const [ollamaModel, setOllamaModel] = React.useState("qwen2.5:7b");
  const [temperature, setTemperature] = React.useState(0.8);
  const [ttsSpeed, setTtsSpeed] = React.useState(1.0);
  const [obsUrl, setObsUrl] = React.useState("ws://localhost:4455");
  const [obsPassword, setObsPassword] = React.useState("");

  const sectionTitles = {
    persona:    { id: "Persona & Karakter", en: "Persona & Character" },
    avatar:     { id: "Pengaturan Avatar", en: "Avatar Settings" },
    stream:     { id: "Koneksi Streaming", en: "Stream Connection" },
    ai:         { id: "Konfigurasi AI Brain", en: "AI Brain Configuration" },
    voice:      { id: "Sistem Suara & TTS", en: "Voice & TTS System" },
    obs:        { id: "OBS WebSocket", en: "OBS WebSocket" },
    appearance: { id: "Tampilan & Bahasa", en: "Appearance & Language" },
    privacy:    { id: "Privasi & Keamanan", en: "Privacy & Security" },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", animation: "slide-up 0.2s ease" }}>
      <div>
        <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "4px" }}>
          {sectionTitles[activeSection]?.[lang === "id" ? "id" : "en"] || activeSection}
        </h2>
        <Divider style={{ marginTop: "12px" }} />
      </div>

      {activeSection === "persona" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <FormField label={lang === "id" ? "Nama Avatar" : "Avatar Name"} required>
            <Input defaultValue="AlterBot" icon={<IcUser />} />
          </FormField>
          <FormField label={lang === "id" ? "Nama Streamer" : "Streamer Name"}>
            <Input defaultValue="nayrbryan" icon={<IcUser />} />
          </FormField>
          <FormField label={lang === "id" ? "Alasan AFK" : "AFK Reason"}>
            <Select value="sick" options={[
              { value: "sick",    label: lang === "id" ? "Sakit" : "Sick" },
              { value: "tired",   label: lang === "id" ? "Kelelahan" : "Tired" },
              { value: "afk",     label: "AFK" },
              { value: "custom",  label: lang === "id" ? "Kustom..." : "Custom..." },
            ]} />
          </FormField>
          <FormField label={lang === "id" ? "Deskripsi Kepribadian" : "Personality Description"}>
            <Textarea placeholder={lang === "id" ? "Ceria, suka game, sering bikin meme, bahasa santai..." : "Cheerful, gamer, meme-maker, casual language..."} rows={4} />
          </FormField>
          <FormField label={lang === "id" ? "Topik yang Dilarang" : "Blacklisted Topics"}>
            <Input placeholder={lang === "id" ? "politik, SARA, 18+ (pisahkan koma)" : "politics, NSFW, gambling (comma-separated)"} icon={<IcFilter />} />
          </FormField>
          <FormField label={lang === "id" ? "System Prompt Kustom" : "Custom System Prompt"} hint={lang === "id" ? "Kosongkan untuk pakai default" : "Leave empty to use default"}>
            <Textarea rows={5} placeholder={lang === "id" ? "Tulis system prompt kustom di sini..." : "Write custom system prompt here..."} />
          </FormField>
        </div>
      )}

      {activeSection === "ai" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <FormField label={lang === "id" ? "Sumber AI" : "AI Source"}>
            <div style={{ display: "flex", gap: "8px" }}>
              {["ollama","openai"].map(m => (
                <button key={m}
                  onClick={() => setAiModel(m)}
                  style={{
                    flex: 1, padding: "12px", borderRadius: "var(--r-md)",
                    background: aiModel === m ? (m === "ollama" ? "rgba(0,212,255,0.1)" : "rgba(124,58,255,0.1)") : "var(--bg-elevated)",
                    border: `1px solid ${aiModel === m ? (m === "ollama" ? "var(--border-accent)" : "var(--border-violet)") : "var(--border-subtle)"}`,
                    cursor: "pointer", transition: "all var(--t-fast)", outline: "none",
                  }}>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: aiModel === m ? (m === "ollama" ? "var(--accent-primary)" : "var(--accent-secondary)") : "var(--text-primary)", marginBottom: "2px" }}>
                    {m === "ollama" ? <><IcCpu size={12} /> &nbsp;{S.local_llm}</> : <><IcCloud size={12} /> &nbsp;{S.cloud_llm}</>}
                  </div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                    {m === "ollama" ? (lang === "id" ? "Gratis, privat, butuh GPU" : "Free, private, requires GPU") : (lang === "id" ? "Cloud, akurat, berbayar" : "Cloud, accurate, paid")}
                  </div>
                </button>
              ))}
            </div>
          </FormField>
          {aiModel === "ollama" ? (
            <FormField label="Ollama Model">
              <Select value={ollamaModel} onChange={setOllamaModel} options={[
                { value: "qwen2.5:7b",    label: "Qwen2.5:7b (Recommended)" },
                { value: "deepseek-r1:8b",label: "DeepSeek-R1:8b" },
                { value: "llama3.2:3b",   label: "Llama 3.2:3b (Fast)" },
                { value: "mistral:7b",    label: "Mistral:7b" },
              ]} />
            </FormField>
          ) : (
            <FormField label="OpenAI API Key">
              <Input type="password" placeholder="sk-..." icon={<IcLock />} />
            </FormField>
          )}
          <FormField label={`${S.temperature}: ${temperature.toFixed(1)}`}>
            <RangeSlider value={temperature * 100} onChange={v => setTemperature(v/100)} min={0} max={100} color="var(--accent-primary)" valueLabel={temperature.toFixed(1)} />
          </FormField>
          <FormField label={lang === "id" ? "Batas Token Output" : "Max Output Tokens"}>
            <Input type="number" defaultValue="300" />
          </FormField>
          <div style={{ padding: "12px", background: "var(--bg-elevated)", borderRadius: "var(--r-md)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>{lang === "id" ? "Status Koneksi" : "Connection Status"}</span>
              <StatusDot status="online" size={8} pulse />
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              {aiModel === "ollama" ? `http://localhost:11434 — Qwen2.5:7b ` : `api.openai.com — gpt-4o-mini`}
            </div>
          </div>
        </div>
      )}

      {activeSection === "obs" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <FormField label={S.obs_url}>
            <Input value={obsUrl} onChange={setObsUrl} placeholder="ws://localhost:4455" icon={<IcLink />} />
          </FormField>
          <FormField label={S.obs_password}>
            <Input type="password" value={obsPassword} onChange={setObsPassword} placeholder="••••••••" icon={<IcLock />} />
          </FormField>
          <Button variant="outline" icon={<IcWifi />}>{lang === "id" ? "Test Koneksi" : "Test Connection"}</Button>

          <Divider label={lang === "id" ? "URL Overlay OBS" : "OBS Overlay URL"} />
          <CodeBlock lang="OBS Browser Source URL">
            https://altercast.vercel.app/overlay
          </CodeBlock>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button variant="surface" size="sm" icon={<IcCopy />} fullWidth>
              {S.copy_overlay}
            </Button>
            <Button variant="surface" size="sm" icon={<IcShare2 />} fullWidth>
              {lang === "id" ? "Buka" : "Open"}
            </Button>
          </div>

          <Panel title={lang === "id" ? "Panduan Setup" : "Setup Guide"} icon={<IcInfo size={13} />}>
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                lang === "id" ? "1. Buka OBS → Tools → WebSocket Server Settings" : "1. Open OBS → Tools → WebSocket Server Settings",
                lang === "id" ? "2. Aktifkan WebSocket server, Port: 4455" : "2. Enable WebSocket server, Port: 4455",
                lang === "id" ? "3. Set password dan klik OK" : "3. Set password and click OK",
                lang === "id" ? "4. Masukkan URL & password di atas, klik Test" : "4. Enter URL & password above, click Test",
                lang === "id" ? "5. Tambah Browser Source dengan URL Overlay" : "5. Add Browser Source with Overlay URL",
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "var(--accent-primary-glow)", border: "1px solid var(--border-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: "var(--accent-primary)", fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", lineHeight: 1.6 }}>{step}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {activeSection === "voice" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <FormField label={lang === "id" ? "Engine TTS" : "TTS Engine"}>
            <Select value="elevenlabs" options={[
              { value: "elevenlabs", label: "ElevenLabs (Recommended)" },
              { value: "browser",   label: lang === "id" ? "Browser Native (Gratis)" : "Browser Native (Free)" },
              { value: "gtts",      label: "Google TTS" },
            ]} />
          </FormField>
          <FormField label="ElevenLabs API Key">
            <Input type="password" placeholder="••••••••••••••••" icon={<IcLock />} />
          </FormField>
          <FormField label={lang === "id" ? "Voice ID" : "Voice ID"}>
            <Input placeholder="e.g. 21m00Tcm4TlvDq8ikWAM" icon={<IcVolume2 />} />
          </FormField>
          <FormField label={`${lang === "id" ? "Kecepatan Bicara" : "Speech Speed"}: ${ttsSpeed.toFixed(1)}x`}>
            <RangeSlider value={ttsSpeed * 50} onChange={v => setTtsSpeed(v/50)} min={25} max={100} color="#7C3AFF" valueLabel={`${ttsSpeed.toFixed(1)}x`} />
          </FormField>
          <FormField label={lang === "id" ? "Volume Output" : "Output Volume"}>
            <RangeSlider value={80} min={0} max={100} color="var(--accent-primary)" valueLabel="80%" />
          </FormField>
          <Button variant="outline" icon={<IcPlay />}>{lang === "id" ? "Tes Suara" : "Test Voice"}</Button>
        </div>
      )}

      {activeSection === "appearance" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <FormField label={lang === "id" ? "Tema" : "Theme"}>
            <div style={{ display: "flex", gap: "8px" }}>
              {["dark","light"].map(t => (
                <button key={t}
                  onClick={() => setTheme(t)}
                  style={{
                    flex: 1, padding: "12px", borderRadius: "var(--r-md)",
                    background: theme === t ? "var(--accent-primary-glow)" : "var(--bg-elevated)",
                    border: `1px solid ${theme === t ? "var(--border-accent)" : "var(--border-subtle)"}`,
                    cursor: "pointer", transition: "all var(--t-fast)", outline: "none",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                  }}>
                  {t === "dark" ? <IcMoon size={20} color={theme === t ? "var(--accent-primary)" : "var(--text-muted)"} /> : <IcSun size={20} color={theme === t ? "var(--accent-primary)" : "var(--text-muted)"} />}
                  <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: theme === t ? "var(--accent-primary)" : "var(--text-secondary)" }}>
                    {t === "dark" ? (lang === "id" ? "Gelap" : "Dark") : (lang === "id" ? "Terang" : "Light")}
                  </span>
                </button>
              ))}
            </div>
          </FormField>
          <FormField label={lang === "id" ? "Bahasa / Language" : "Language / Bahasa"}>
            <div style={{ display: "flex", gap: "8px" }}>
              {[{v:"id",l:" Indonesia"},{v:"en",l:" English"}].map(({v,l}) => (
                <button key={v}
                  onClick={() => setLang(v)}
                  style={{
                    flex: 1, padding: "10px", borderRadius: "var(--r-md)",
                    background: currentLang === v ? "var(--accent-primary-glow)" : "var(--bg-elevated)",
                    border: `1px solid ${currentLang === v ? "var(--border-accent)" : "var(--border-subtle)"}`,
                    cursor: "pointer", transition: "all var(--t-fast)", outline: "none",
                    fontSize: "var(--text-sm)", fontWeight: 600,
                    color: currentLang === v ? "var(--accent-primary)" : "var(--text-secondary)",
                  }}>
                  {l}
                </button>
              ))}
            </div>
          </FormField>
          <FormField label={lang === "id" ? "Warna Aksen" : "Accent Color"}>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { color: "#00D4FF", label: "Cyan" },
                { color: "#7C3AFF", label: "Violet" },
                { color: "#00FF88", label: "Green" },
                { color: "#FFB800", label: "Amber" },
                { color: "#FF3C3C", label: "Red" },
              ].map(({ color, label }) => (
                <button key={color} title={label}
                  style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: color, border: color === "#00D4FF" ? "2px solid white" : "2px solid transparent",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </FormField>
        </div>
      )}

      {activeSection === "stream" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <SectionHeader label="Twitch" />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "16px", background: "var(--bg-elevated)", borderRadius: "var(--r-md)", border: "1px solid rgba(145,70,255,0.2)" }}>
            <FormField label="Channel Name">
              <Input placeholder="nayrbryan" icon={<IcTwitch size={14} />} />
            </FormField>
            <Button variant="secondary" icon={<IcTwitch size={14} />}>{lang === "id" ? "Hubungkan Twitch" : "Connect Twitch"}</Button>
          </div>

          <SectionHeader label="YouTube Live" />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "16px", background: "var(--bg-elevated)", borderRadius: "var(--r-md)", border: "1px solid rgba(255,0,0,0.15)" }}>
            <FormField label="YouTube API Key">
              <Input type="password" placeholder="AIza..." icon={<IcYouTube size={14} />} />
            </FormField>
            <Button variant="danger" icon={<IcYouTube size={14} />}>{lang === "id" ? "Hubungkan YouTube" : "Connect YouTube"}</Button>
          </div>

          <SectionHeader label="TikTok LIVE" />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "16px", background: "var(--bg-elevated)", borderRadius: "var(--r-md)", border: "1px solid rgba(255,0,80,0.15)" }}>
            <FormField label="TikTok Session ID" hint={lang === "id" ? "Opsional — butuh browser extension" : "Optional — requires browser extension"}>
              <Input placeholder="session_..." icon={<IcTikTok size={14} />} />
            </FormField>
          </div>
        </div>
      )}

      {!["persona","ai","obs","voice","appearance","stream"].includes(activeSection) && (
        <EmptyState
          icon={<IcSettings />}
          title={lang === "id" ? "Pengaturan tersedia" : "Settings available"}
          description={lang === "id" ? "Pilih kategori di kiri untuk mengkonfigurasi" : "Select a category on the left to configure"}
        />
      )}

      {/* Save button */}
      <div style={{ paddingTop: "8px", borderTop: "1px solid var(--border-subtle)" }}>
        <Button variant="primary" icon={<IcCheck />} onClick={onSave}>
          {S.save} {lang === "id" ? "Pengaturan" : "Settings"}
        </Button>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   OVERLAY PAGE (OBS)
   ══════════════════════════════ */
function OverlayPage() {
  const { lang, isLive, avatarState, isVoiceOn } = useApp();
  const [talkPhase, setTalkPhase] = React.useState(0);
  const isTalking = avatarState === "talking" || isVoiceOn;

  React.useEffect(() => {
    if (!isTalking) return;
    const iv = setInterval(() => setTalkPhase(p => (p + 1) % 4), 120);
    return () => clearInterval(iv);
  }, [isTalking]);

  const mouthPaths = [
    "M85,112 Q100,118 115,112",
    "M85,112 Q100,124 115,112",
    "M85,112 Q100,120 115,112",
    "M85,112 Q100,126 115,112",
  ];

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      background: "var(--bg-void)", overflow: "hidden",
    }}>
      {/* Control bar (not included in actual overlay) */}
      <div style={{
        padding: "10px 20px",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex", alignItems: "center", gap: "12px",
        background: "var(--bg-surface)",
        flexShrink: 0,
      }}>
        <Badge variant="secondary" size="sm">
          {lang === "id" ? "Preview Overlay OBS" : "OBS Overlay Preview"}
        </Badge>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
          {lang === "id" ? "Tampilan ini ditangkap OBS (1920×1080, bg transparan)" : "This view is captured by OBS (1920×1080, transparent bg)"}
        </span>
        <div style={{ marginLeft: "auto" }}>
          <CodeBlock>https://altercast.vercel.app/overlay</CodeBlock>
        </div>
      </div>

      {/* Actual overlay preview */}
      <div style={{
        flex: 1, position: "relative", overflow: "hidden",
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='20' height='20' fill='%23222'/%3E%3Crect width='10' height='10' fill='%23333'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23333'/%3E%3C/svg%3E\")",
        backgroundSize: "20px 20px",
      }}>
        <div style={{ position: "absolute", top: "10px", left: "10px" }}>
          <Badge variant="ghost" size="xs">{lang === "id" ? "Latar transparan" : "Transparent background"}</Badge>
        </div>

        {/* Avatar centered-bottom */}
        <div style={{
          position: "absolute", bottom: "60px", left: "60px",
          animation: "breathe 3.5s ease-in-out infinite",
          filter: "drop-shadow(0 0 24px rgba(0,212,255,0.4))",
        }}>
          <svg viewBox="0 0 200 300" width="200" height="300">
            <path d="M30,245 Q68,200 100,197 Q132,200 170,245 L172,295 Q100,312 28,295 Z" fill="rgba(0,0,0,0.8)" stroke="rgba(0,212,255,0.6)" strokeWidth="1.5" />
            <rect x="88" y="163" width="24" height="28" rx="4" fill="rgba(0,0,0,0.8)" stroke="rgba(0,212,255,0.5)" strokeWidth="1" />
            <ellipse cx="100" cy="104" rx="52" ry="58" fill="rgba(0,0,0,0.85)" stroke="rgba(0,212,255,0.7)" strokeWidth="1.5" />
            <path d="M50,92 Q55,46 100,44 Q145,46 150,92" fill="rgba(0,212,255,0.08)" stroke="rgba(0,212,255,0.5)" strokeWidth="1.2" />
            <ellipse cx="81" cy="96" rx="8" ry="7" fill="#00D4FF" opacity="0.9" />
            <ellipse cx="119" cy="96" rx="8" ry="7" fill="#00D4FF" opacity="0.9" />
            <circle cx="83" cy="94" r="2" fill="white" opacity="0.8" />
            <circle cx="121" cy="94" r="2" fill="white" opacity="0.8" />
            <path d={isTalking ? mouthPaths[talkPhase] : "M85,112 Q100,118 115,112"} stroke="#00D4FF" strokeWidth="2.5" fill="none" opacity="0.9" />
            {isLive && (
              <g>
                <rect x="72" y="270" width="56" height="18" rx="9" fill="rgba(255,60,60,0.3)" stroke="rgba(255,60,60,0.6)" strokeWidth="1" style={{ animation: "pulse-live 1.6s ease infinite" }} />
                <circle cx="84" cy="279" r="3" fill="#FF3C3C" />
                <text x="100" y="283" fill="#FF3C3C" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">LIVE</text>
              </g>
            )}
          </svg>
        </div>

        {/* Watermark */}
        <div style={{
          position: "absolute", bottom: "12px", right: "12px",
          display: "flex", alignItems: "center", gap: "5px",
          opacity: 0.4,
        }}>
          <AlterCastLogo size={16} showText={false} />
          <span style={{ fontSize: "0.6rem", color: "var(--accent-primary)", fontFamily: "var(--font-mono)" }}>AlterCast</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   LANDING PAGE
   ══════════════════════════════ */
function LandingPage() {
  const { lang, setCurrentPage } = useApp();
  const S = STRINGS[lang];
  const features = [
    { icon: <IcUserSquare size={20} />, title: lang === "id" ? "Avatar 3D Realtime" : "Realtime 3D Avatar",   desc: lang === "id" ? "Avatar 3D yang bergerak, berkedip, dan bicara menggunakan AI" : "3D avatar that moves, blinks, and speaks using AI" },
    { icon: <IcBrain size={20} />,      title: lang === "id" ? "AI Brain Hybrid" : "Hybrid AI Brain",         desc: lang === "id" ? "LLM lokal (Ollama) + cloud (OpenAI) untuk respons cerdas" : "Local LLM (Ollama) + cloud (OpenAI) for intelligent responses" },
    { icon: <IcVolume2 size={20} />,    title: lang === "id" ? "Voice Clone" : "Voice Clone",                 desc: lang === "id" ? "Kloning suara streamer dengan ElevenLabs API" : "Clone your voice with ElevenLabs API for authentic TTS" },
    { icon: <IcMonitor size={20} />,    title: lang === "id" ? "OBS Integration" : "OBS Integration",         desc: lang === "id" ? "Capture avatar via Browser Source, kontrol dari web" : "Capture avatar via Browser Source, control from the web" },
    { icon: <IcMessageSquare size={20} />, title: lang === "id" ? "Multi-Platform Chat" : "Multi-Platform Chat", desc: lang === "id" ? "Twitch, YouTube, dan TikTok LIVE dalam satu panel" : "Twitch, YouTube, and TikTok LIVE in one panel" },
    { icon: <IcMoon size={20} />,       title: lang === "id" ? "AFK / Sick Mode" : "AFK / Sick Mode",         desc: lang === "id" ? "AI takeover penuh saat streamer tidak bisa hadir" : "Full AI takeover when the streamer can't be present" },
  ];

  return (
    <div style={{ flex: 1, overflow: "auto", background: "var(--bg-base)" }}>
      {/* Hero */}
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "80px 24px 60px",
        background: `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,212,255,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(124,58,255,0.06) 0%, transparent 60%)`,
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)",
          backgroundSize: "60px 60px", opacity: 0.3, pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "740px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <AlterCastLogo size={48} />
          </div>

          <Badge variant="primary" size="md" style={{ marginBottom: "20px" }}>
            <IcZap size={11} style={{ marginRight: 5 }} />
            {lang === "id" ? "AI Streaming Twin · Platform Siaran Indonesia" : "AI Streaming Twin · Platform Siaran Indonesia"}
          </Badge>

          <h1 style={{
            fontSize: "var(--text-hero)", fontWeight: 800,
            letterSpacing: "-0.03em", lineHeight: 1.1,
            marginBottom: "20px",
            background: "linear-gradient(135deg, var(--text-primary) 40%, var(--accent-primary) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            {S.tagline}
          </h1>

          <p style={{
            fontSize: "var(--text-xl)", color: "var(--text-secondary)",
            lineHeight: 1.6, marginBottom: "36px", maxWidth: "560px", margin: "0 auto 36px",
          }}>
            {S.subtitle}
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Button variant="primary" size="xl" icon={<IcPlay />} onClick={() => setCurrentPage("studio")}>
              {S.open_studio}
            </Button>
            <Button variant="outline" size="xl" icon={<IcUserSquare />} onClick={() => setCurrentPage("avatar")}>
              {S.create_avatar}
            </Button>
          </div>

          <div style={{ display: "flex", gap: "24px", justifyContent: "center", marginTop: "48px", flexWrap: "wrap" }}>
            {[
              { value: "60fps", label: lang === "id" ? "Avatar FPS" : "Avatar FPS" },
              { value: "<500ms", label: lang === "id" ? "Latensi AI" : "AI Latency" },
              { value: "3+", label: lang === "id" ? "Platform" : "Platforms" },
              { value: "100%", label: lang === "id" ? "Browser Native" : "Browser Native" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: "var(--accent-primary)", fontFamily: "var(--font-mono)" }}>{s.value}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features grid */}
      <div style={{ padding: "80px 40px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "var(--text-3xl)", fontWeight: 800, letterSpacing: "-0.02em" }}>{S.features}</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
              borderRadius: "var(--r-lg)", padding: "24px",
              transition: "border-color var(--t-fast), box-shadow var(--t-fast)",
              animation: `slide-up 0.4s ease ${i * 0.06}s both`,
            }}
            onMouseOver={e => Object.assign(e.currentTarget.style, { borderColor: "var(--border-accent)", boxShadow: "var(--shadow-glow-cyan)" })}
            onMouseOut={e => Object.assign(e.currentTarget.style, { borderColor: "var(--border-subtle)", boxShadow: "none" })}
            >
              <div style={{ width: "40px", height: "40px", borderRadius: "var(--r-md)", background: "var(--accent-primary-glow)", border: "1px solid var(--border-accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-primary)", marginBottom: "14px" }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700, marginBottom: "6px" }}>{f.title}</h3>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        padding: "80px 40px", textAlign: "center",
        background: "linear-gradient(to bottom, transparent, var(--bg-surface))",
      }}>
        <h2 style={{ fontSize: "var(--text-3xl)", fontWeight: 800, marginBottom: "12px" }}>
          {lang === "id" ? "Siap untuk mulai?" : "Ready to get started?"}
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "28px" }}>
          {lang === "id" ? "Setup dalam 5 menit. Tidak perlu coding." : "Setup in 5 minutes. No coding required."}
        </p>
        <Button variant="primary" size="xl" icon={<IcPlay />} onClick={() => {}}>
          {S.get_started}
        </Button>
      </div>
    </div>
  );
}

Object.assign(window, { AvatarPage, DashboardPage, SettingsPage, OverlayPage, LandingPage, SettingsSection });
