/* ─────────────────────────────────────────────
   AlterCast — Studio Page v1.0
   Main 3-column streaming studio layout with
   animated avatar canvas
   ───────────────────────────────────────────── */

/* ══ AVATAR CANVAS ══ */
function AvatarCanvas() {
  const { avatarState, isLive, isAFKMode, isVoiceOn } = useApp();
  const canvasRef = React.useRef(null);
  const [particles, setParticles] = React.useState([]);
  const [bgStyle, setBgStyle] = React.useState("gradient");
  const [talkPhase, setTalkPhase] = React.useState(0);

  // Generate particles
  React.useEffect(() => {
    const gen = () => Array.from({ length: 18 }, (_, i) => ({
      id: i, x: 10 + Math.random() * 80, delay: Math.random() * 6,
      dur: 4 + Math.random() * 4, tx: (Math.random() - 0.5) * 60,
      size: 2 + Math.random() * 3, opacity: 0.3 + Math.random() * 0.5,
    }));
    setParticles(gen());
  }, []);

  // Talking animation cycle
  React.useEffect(() => {
    if (avatarState !== "talking" && !isVoiceOn) return;
    const iv = setInterval(() => setTalkPhase(p => (p + 1) % 4), 120);
    return () => clearInterval(iv);
  }, [avatarState, isVoiceOn]);

  const isTalking = avatarState === "talking" || isVoiceOn;
  const isExcited = avatarState === "excited";
  const isSleepy  = avatarState === "sleepy" || isAFKMode;

  const mouthPaths = [
    "M85,112 Q100,118 115,112",
    "M85,112 Q100,124 115,112",
    "M85,112 Q100,120 115,112",
    "M85,112 Q100,126 115,112",
  ];

  const glowColor = isLive
    ? "rgba(255,60,60,0.25)"
    : isAFKMode
      ? "rgba(124,58,255,0.2)"
      : "rgba(0,212,255,0.2)";
  const borderColor = isLive ? "var(--status-live)" : isAFKMode ? "#7C3AFF" : "var(--accent-primary)";

  const bgOptions = {
    gradient: `radial-gradient(ellipse 70% 60% at 50% 55%, rgba(0,212,255,0.07) 0%, rgba(124,58,255,0.04) 50%, transparent 100%), var(--bg-void)`,
    dark: "var(--bg-void)",
    purple: `radial-gradient(ellipse 70% 60% at 50% 55%, rgba(124,58,255,0.12) 0%, transparent 70%), #0D0A1A`,
    cyan: `radial-gradient(ellipse 70% 60% at 50% 55%, rgba(0,212,255,0.1) 0%, transparent 70%), #060E12`,
    green: "#002200",
  };

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      background: "var(--bg-void)", overflow: "hidden", position: "relative",
    }}>
      {/* Canvas area */}
      <div style={{
        flex: 1, position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {/* BG grid lines */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.4,
        }} />

        {/* Glow backdrop */}
        <div style={{
          position: "absolute", inset: 0,
          background: bgOptions[bgStyle],
          transition: "background 0.5s ease",
        }} />

        {/* Scan line effect */}
        {isLive && (
          <div style={{
            position: "absolute", left: 0, right: 0, height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(255,60,60,0.3), transparent)",
            animation: "scan-line 4s linear infinite",
            zIndex: 2, pointerEvents: "none",
          }} />
        )}

        {/* Particles */}
        {particles.map(p => (
          <div key={p.id} style={{
            position: "absolute",
            bottom: "15%",
            left: `${p.x}%`,
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: isLive ? "rgba(255,60,60,0.6)" : isAFKMode ? "rgba(124,58,255,0.5)" : "rgba(0,212,255,0.5)",
            animation: `float-particle ${p.dur}s ${p.delay}s ease-in-out infinite`,
            "--tx": `${p.tx}px`,
            zIndex: 1,
          }} />
        ))}

        {/* Avatar SVG */}
        <div style={{
          position: "relative", zIndex: 3,
          animation: isExcited
            ? "excited-shake 0.4s ease infinite"
            : isSleepy
              ? "none"
              : "breathe 3.5s ease-in-out infinite",
          filter: `drop-shadow(0 0 24px ${glowColor}) drop-shadow(0 0 8px ${glowColor})`,
        }}>
          <svg
            viewBox="0 0 200 300"
            width="260" height="390"
            style={{ overflow: "visible" }}
          >
            {/* Outer glow ring */}
            <ellipse cx="100" cy="140" rx="95" ry="130"
              fill="none" stroke={borderColor} strokeWidth="0.5" opacity={isLive ? 0.4 : 0.15}
              style={{ animation: "glow-pulse-cyan 3s ease infinite" }}
            />

            {/* Shoulder glow base */}
            <path d="M25,240 Q65,195 100,192 Q135,195 175,240 L180,310 Q100,330 20,310 Z"
              fill={`rgba(0,212,255,0.04)`}
              stroke={borderColor} strokeWidth="0.8" opacity="0.3"
            />

            {/* Body / Shoulders */}
            <path d="M30,245 Q68,200 100,197 Q132,200 170,245 L172,295 Q100,312 28,295 Z"
              fill="var(--bg-void)"
              stroke={borderColor} strokeWidth="1.2" opacity="0.55"
            />

            {/* Chest detail lines */}
            <line x1="100" y1="215" x2="100" y2="255" stroke={borderColor} strokeWidth="0.6" opacity="0.25" />
            <path d="M75,230 Q100,240 125,230" stroke={borderColor} strokeWidth="0.8" fill="none" opacity="0.2" />

            {/* Neck */}
            <rect x="88" y="163" width="24" height="28" rx="4"
              fill="var(--bg-void)" stroke={borderColor} strokeWidth="1" opacity="0.4"
            />

            {/* Head glow */}
            <ellipse cx="100" cy="104" rx="54" ry="60"
              fill={`rgba(0,212,255,0.03)`}
              stroke="none"
            />

            {/* Head outline */}
            <ellipse cx="100" cy="104" rx="52" ry="58"
              fill="var(--bg-void)"
              stroke={borderColor} strokeWidth="1.4" opacity="0.65"
            />

            {/* Hair (top arc) */}
            <path d="M50,92 Q55,46 100,44 Q145,46 150,92"
              fill={`rgba(0,212,255,0.05)`}
              stroke={borderColor} strokeWidth="1.2" opacity="0.5"
            />

            {/* Hair details */}
            <path d="M70,60 Q85,50 100,48 Q115,50 130,60"
              fill="none" stroke={borderColor} strokeWidth="0.8" opacity="0.3"
            />

            {/* Ear left */}
            <ellipse cx="48" cy="108" rx="7" ry="10"
              fill="var(--bg-void)" stroke={borderColor} strokeWidth="1" opacity="0.45"
            />
            <ellipse cx="48" cy="108" rx="4" ry="6"
              fill="none" stroke={borderColor} strokeWidth="0.6" opacity="0.3"
            />

            {/* Ear right */}
            <ellipse cx="152" cy="108" rx="7" ry="10"
              fill="var(--bg-void)" stroke={borderColor} strokeWidth="1" opacity="0.45"
            />
            <ellipse cx="152" cy="108" rx="4" ry="6"
              fill="none" stroke={borderColor} strokeWidth="0.6" opacity="0.3"
            />

            {/* Eye sockets */}
            <ellipse cx="81" cy="96" rx="12" ry="10"
              fill={`rgba(0,212,255,0.04)`} stroke={borderColor} strokeWidth="0.8" opacity="0.35"
            />
            <ellipse cx="119" cy="96" rx="12" ry="10"
              fill={`rgba(0,212,255,0.04)`} stroke={borderColor} strokeWidth="0.8" opacity="0.35"
            />

            {/* Eyes — blinking */}
            <g style={{ animation: "blink 4s ease 2s infinite", transformOrigin: "81px 96px" }}>
              <ellipse cx="81" cy="96" rx="8" ry={isSleepy ? 3 : 7}
                fill={borderColor} opacity="0.85"
              />
              <circle cx="83" cy="94" r="2" fill="white" opacity="0.7" />
              <circle cx="78" cy="94" r="1.2" fill={borderColor} opacity="0.5" />
            </g>
            <g style={{ animation: "blink 4s ease 2s infinite", transformOrigin: "119px 96px" }}>
              <ellipse cx="119" cy="96" rx="8" ry={isSleepy ? 3 : 7}
                fill={borderColor} opacity="0.85"
              />
              <circle cx="121" cy="94" r="2" fill="white" opacity="0.7" />
              <circle cx="116" cy="94" r="1.2" fill={borderColor} opacity="0.5" />
            </g>

            {/* Eyebrows */}
            <path d={isExcited ? "M70,82 Q81,76 92,82" : isSleepy ? "M70,87 Q81,86 92,87" : "M70,84 Q81,79 92,84"}
              stroke={borderColor} strokeWidth="2" fill="none" opacity="0.7"
              style={{ transition: "d 0.3s ease" }}
            />
            <path d={isExcited ? "M108,82 Q119,76 130,82" : isSleepy ? "M108,87 Q119,86 130,87" : "M108,84 Q119,79 130,84"}
              stroke={borderColor} strokeWidth="2" fill="none" opacity="0.7"
              style={{ transition: "d 0.3s ease" }}
            />

            {/* Nose */}
            <path d="M97,110 Q100,116 103,110"
              stroke={borderColor} strokeWidth="1.2" fill="none" opacity="0.35"
            />

            {/* Mouth — animated when talking */}
            <path
              d={isTalking ? mouthPaths[talkPhase] : isExcited ? "M85,114 Q100,122 115,114" : "M85,112 Q100,118 115,112"}
              stroke={borderColor} strokeWidth="2" fill="none" opacity="0.8"
              style={{ transition: isTalking ? "none" : "d 0.4s ease" }}
            />
            {/* Talking open mouth */}
            {isTalking && talkPhase >= 1 && (
              <ellipse cx="100" cy="118" rx={4 + talkPhase * 2} ry={talkPhase * 2}
                fill={borderColor} opacity="0.15"
              />
            )}

            {/* Cheek blush (excited) */}
            {isExcited && (
              <>
                <ellipse cx="70" cy="112" rx="12" ry="6" fill="rgba(255,100,120,0.15)" />
                <ellipse cx="130" cy="112" rx="12" ry="6" fill="rgba(255,100,120,0.15)" />
              </>
            )}

            {/* ZZZ (sleepy) */}
            {isSleepy && (
              <g style={{ animation: "float-particle 3s ease infinite" }}>
                <text x="145" y="70" fill={borderColor} fontSize="12" opacity="0.6" fontFamily="var(--font-display)">z</text>
                <text x="158" y="58" fill={borderColor} fontSize="10" opacity="0.4" fontFamily="var(--font-display)">z</text>
                <text x="168" y="48" fill={borderColor} fontSize="8" opacity="0.25" fontFamily="var(--font-display)">z</text>
              </g>
            )}

            {/* Stars (excited) */}
            {isExcited && [
              [40, 50], [160, 45], [165, 80], [35, 75]
            ].map(([x, y], i) => (
              <g key={i} style={{ animation: `float-particle ${2 + i * 0.5}s ${i * 0.3}s ease-in-out infinite` }}>
                <text x={x} y={y} fill="#FFB800" fontSize="10" opacity="0.7"></text>
              </g>
            ))}

            {/* AFK MODE indicator */}
            {isAFKMode && (
              <g>
                <rect x="66" y="46" width="68" height="20" rx="10"
                  fill="rgba(124,58,255,0.3)" stroke="rgba(124,58,255,0.6)" strokeWidth="1"
                />
                <text x="100" y="60" fill="#7C3AFF" fontSize="9" fontWeight="bold"
                  textAnchor="middle" fontFamily="var(--font-display)" letterSpacing="1">
                  AFK MODE
                </text>
              </g>
            )}

            {/* LIVE badge on avatar */}
            {isLive && (
              <g>
                <rect x="72" y="270" width="56" height="18" rx="9"
                  fill="rgba(255,60,60,0.25)" stroke="rgba(255,60,60,0.5)" strokeWidth="1"
                  style={{ animation: "pulse-live 1.6s ease infinite" }}
                />
                <circle cx="84" cy="279" r="3" fill="var(--status-live)" />
                <text x="100" y="283" fill="var(--status-live)" fontSize="9" fontWeight="bold"
                  textAnchor="middle" fontFamily="var(--font-display)" letterSpacing="1">
                  LIVE
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Emotion tag overlay */}
        <div style={{
          position: "absolute", top: "12px", left: "12px", zIndex: 10,
        }}>
          <EmotionTag emotion={avatarState} size="sm" />
        </div>

        {/* Performance indicator */}
        <div style={{
          position: "absolute", top: "12px", right: "12px", zIndex: 10,
          display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end",
        }}>
          <div style={{
            background: "rgba(8,10,15,0.7)", backdropFilter: "blur(8px)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--r-sm)", padding: "4px 8px",
            fontSize: "0.6rem", fontFamily: "var(--font-mono)",
            color: "var(--status-online)", letterSpacing: "0.05em",
          }}>
            60 FPS
          </div>
          <div style={{
            background: "rgba(8,10,15,0.7)", backdropFilter: "blur(8px)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--r-sm)", padding: "4px 8px",
            fontSize: "0.6rem", fontFamily: "var(--font-mono)",
            color: "var(--text-secondary)", letterSpacing: "0.05em",
          }}>
            1080p
          </div>
        </div>
      </div>

      {/* Canvas controls toolbar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 16px",
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        flexShrink: 0, gap: "8px",
      }}>
        {/* BG picker */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>BG</span>
          {Object.entries({ gradient: "#00D4FF", dark: "#1A2030", purple: "#7C3AFF", cyan: "#00D4FF", green: "#00FF88" }).map(([key, color]) => (
            <button key={key}
              onClick={() => setBgStyle(key)}
              style={{
                width: "18px", height: "18px", borderRadius: "50%",
                background: key === "gradient" ? "linear-gradient(135deg, #00D4FF, #7C3AFF)" : key === "dark" ? "#1A2030" : key === "purple" ? "#3D1A7A" : key === "cyan" ? "#001520" : "#001A00",
                border: bgStyle === key ? `2px solid ${color}` : "1px solid var(--border-subtle)",
                cursor: "pointer", transition: "border var(--t-fast)",
              }}
            />
          ))}
        </div>

        {/* Camera angles */}
        <div style={{ display: "flex", gap: "4px" }}>
          {["Full Body", "Bust", "Face"].map(a => (
            <Chip key={a} selected={a === "Bust"} size="sm">{a}</Chip>
          ))}
        </div>

        {/* Lighting */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Lighting</span>
          <RangeSlider value={70} min={0} max={100} color="var(--accent-primary)" />
        </div>
      </div>
    </div>
  );
}

/* ══ STUDIO PAGE ══ */
function StudioPage() {
  const { lang, isLive, isAFKMode } = useApp();
  const S = STRINGS[lang];
  return (
    <div style={{
      flex: 1, display: "flex", overflow: "hidden",
      position: "relative",
    }}>
      {/* AFK Mode Banner */}
      {isAFKMode && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          background: "rgba(124,58,255,0.2)",
          borderBottom: "1px solid var(--border-violet)",
          padding: "8px 16px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
          zIndex: 20, backdropFilter: "blur(8px)",
          animation: "slide-down 0.3s ease",
        }}>
          <IcMoon size={14} color="#7C3AFF" />
          <span style={{ fontSize: "var(--text-sm)", color: "#7C3AFF", fontWeight: 600 }}>
            {lang === "id" ? "Mode AFK Aktif — AI sedang mengendalikan stream" : "AFK Mode Active — AI is controlling the stream"}
          </span>
          <Badge variant="secondary" size="xs">
            {lang === "id" ? "AI Takeover" : "AI Takeover"}
          </Badge>
        </div>
      )}

      {/* Left sidebar */}
      <Sidebar />

      {/* Center canvas */}
      <AvatarCanvas />

      {/* Right chat panel */}
      <ChatPanel />
    </div>
  );
}

Object.assign(window, { AvatarCanvas, StudioPage });
