/* ─────────────────────────────────────────────
   AlterCast — Atoms v1.0
   Smallest building blocks: badges, chips,
   status dots, toggles, avatars, loaders, etc.
   ───────────────────────────────────────────── */

/* ══ STATUS DOT ══ */
function StatusDot({ status = "offline", pulse = false, size = 8 }) {
  const colors = {
    live:    "var(--status-live)",
    online:  "var(--status-online)",
    warning: "var(--status-warning)",
    offline: "var(--status-offline)",
    info:    "var(--status-info)",
    idle:    "var(--status-warning)",
  };
  return (
    <span style={{
      display: "inline-block",
      width: size, height: size,
      borderRadius: "50%",
      backgroundColor: colors[status] || colors.offline,
      flexShrink: 0,
      animation: pulse && status === "live" ? "pulse-live 1.6s ease infinite" : "none",
      boxShadow: status === "live" ? `0 0 0 0 ${colors.live}` : "none",
    }} />
  );
}

/* ══ BADGE ══ */
function Badge({ children, variant = "default", size = "sm", glow = false, style = {} }) {
  const variants = {
    default:   { bg: "var(--bg-elevated)", color: "var(--text-secondary)", border: "var(--border-subtle)" },
    primary:   { bg: "rgba(0,212,255,0.12)", color: "var(--accent-primary)", border: "rgba(0,212,255,0.25)" },
    secondary: { bg: "rgba(124,58,255,0.12)", color: "var(--accent-secondary)", border: "rgba(124,58,255,0.25)" },
    live:      { bg: "rgba(255,60,60,0.12)", color: "var(--status-live)", border: "rgba(255,60,60,0.3)" },
    online:    { bg: "rgba(0,255,136,0.10)", color: "var(--status-online)", border: "rgba(0,255,136,0.25)" },
    warning:   { bg: "rgba(255,184,0,0.10)", color: "var(--status-warning)", border: "rgba(255,184,0,0.25)" },
    danger:    { bg: "rgba(255,60,60,0.12)", color: "#FF6B6B", border: "rgba(255,60,60,0.25)" },
    ghost:     { bg: "transparent", color: "var(--text-muted)", border: "var(--border-subtle)" },
  };
  const sizes = {
    xs: { fontSize: "0.625rem", padding: "1px 6px", height: "16px" },
    sm: { fontSize: "0.7rem",   padding: "2px 8px",  height: "20px" },
    md: { fontSize: "0.75rem",  padding: "3px 10px", height: "24px" },
    lg: { fontSize: "0.875rem", padding: "4px 12px", height: "28px" },
  };
  const v = variants[variant] || variants.default;
  const s = sizes[size] || sizes.sm;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      backgroundColor: v.bg, color: v.color,
      border: `1px solid ${v.border}`,
      borderRadius: "var(--r-full)",
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      letterSpacing: "0.07em",
      textTransform: "uppercase",
      lineHeight: 1,
      whiteSpace: "nowrap",
      boxShadow: glow ? `0 0 12px ${v.bg}` : "none",
      ...s, ...style
    }}>
      {children}
    </span>
  );
}

/* ══ LIVE BADGE (animated) ══ */
function LiveBadge({ isLive = false, lang = "id" }) {
  const label = isLive ? (lang === "id" ? "SIARAN" : "LIVE") : (lang === "id" ? "OFFLINE" : "OFFLINE");
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "6px",
      background: isLive ? "rgba(255,60,60,0.12)" : "rgba(74,85,104,0.2)",
      border: `1px solid ${isLive ? "rgba(255,60,60,0.35)" : "var(--border-subtle)"}`,
      borderRadius: "var(--r-full)",
      padding: "4px 10px",
      fontSize: "0.7rem", fontWeight: 700,
      letterSpacing: "0.1em",
      color: isLive ? "var(--status-live)" : "var(--text-muted)",
    }}>
      <StatusDot status={isLive ? "live" : "offline"} pulse={isLive} size={6} />
      {label}
    </div>
  );
}

/* ══ CHIP ══ */
function Chip({ children, selected = false, onClick, icon, removable = false, onRemove, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        background: selected ? "var(--accent-primary-glow)" : "var(--bg-elevated)",
        border: `1px solid ${selected ? "var(--border-accent)" : "var(--border-subtle)"}`,
        borderRadius: "var(--r-full)",
        padding: "5px 12px",
        fontSize: "var(--text-sm)",
        fontFamily: "var(--font-display)",
        fontWeight: 500,
        color: selected ? "var(--accent-primary)" : "var(--text-secondary)",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all var(--t-fast)",
        opacity: disabled ? 0.5 : 1,
        outline: "none",
      }}
      onMouseOver={e => !disabled && !selected && (e.currentTarget.style.borderColor = "var(--border-normal)")}
      onMouseOut={e => !disabled && !selected && (e.currentTarget.style.borderColor = "var(--border-subtle)")}
    >
      {icon && <span style={{ display: "flex", opacity: 0.8 }}>{icon}</span>}
      {children}
      {removable && (
        <span
          onClick={e => { e.stopPropagation(); onRemove && onRemove(); }}
          style={{ display: "flex", opacity: 0.6, cursor: "pointer" }}
        >
          <IcX size={12} />
        </span>
      )}
    </button>
  );
}

/* ══ TOGGLE / SWITCH ══ */
function Toggle({ checked = false, onChange, size = "md", label, disabled = false }) {
  const sizes = {
    sm: { width: 28, height: 16, knob: 10, offset: 2 },
    md: { width: 36, height: 20, knob: 14, offset: 3 },
    lg: { width: 44, height: 24, knob: 18, offset: 3 },
  };
  const s = sizes[size] || sizes.md;
  return (
    <label style={{
      display: "inline-flex", alignItems: "center", gap: "8px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
    }}>
      <div
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          position: "relative",
          width: s.width, height: s.height,
          borderRadius: s.height / 2,
          background: checked ? "var(--accent-primary)" : "var(--bg-overlay)",
          border: `1px solid ${checked ? "var(--accent-primary)" : "var(--border-normal)"}`,
          transition: "all var(--t-fast)",
          boxShadow: checked ? "0 0 12px rgba(0,212,255,0.3)" : "none",
          flexShrink: 0,
        }}
      >
        <div style={{
          position: "absolute",
          top: s.offset, left: checked ? s.width - s.knob - s.offset : s.offset,
          width: s.knob, height: s.knob,
          borderRadius: "50%",
          background: checked ? "var(--text-inverse)" : "var(--text-muted)",
          transition: "left var(--t-fast), background var(--t-fast)",
        }} />
      </div>
      {label && (
        <span style={{
          fontSize: "var(--text-sm)",
          color: checked ? "var(--text-primary)" : "var(--text-secondary)",
          fontWeight: 500,
        }}>
          {label}
        </span>
      )}
    </label>
  );
}

/* ══ AVATAR CIRCLE ══ */
function AvatarCircle({ name = "?", size = 32, src, color, status }) {
  const colors = ["#00D4FF","#7C3AFF","#00FF88","#FFB800","#FF3C3C","#FF6B9D","#4ECDC4","#45B7D1"];
  const bgColor = color || colors[name.charCodeAt(0) % colors.length];
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{
        width: size, height: size,
        borderRadius: "50%",
        background: src ? "transparent" : `${bgColor}22`,
        border: `1.5px solid ${bgColor}55`,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        fontSize: size * 0.38,
        fontWeight: 700,
        color: bgColor,
        fontFamily: "var(--font-display)",
      }}>
        {src
          ? <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : initials
        }
      </div>
      {status && (
        <div style={{
          position: "absolute", bottom: 1, right: 1,
        }}>
          <StatusDot status={status} size={8} />
        </div>
      )}
    </div>
  );
}

/* ══ LOADER / SPINNER ══ */
function Spinner({ size = 20, color = "var(--accent-primary)", thickness = 2 }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: "50%",
      border: `${thickness}px solid rgba(0,212,255,0.15)`,
      borderTopColor: color,
      animation: "spin 0.8s linear infinite",
      flexShrink: 0,
    }} />
  );
}

/* ══ SKELETON ══ */
function Skeleton({ width = "100%", height = 16, radius = "var(--r-sm)", style = {} }) {
  return (
    <div style={{
      width, height,
      borderRadius: radius,
      background: "linear-gradient(90deg, var(--bg-elevated) 25%, var(--bg-overlay) 50%, var(--bg-elevated) 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s ease infinite",
      ...style
    }} />
  );
}

/* ══ PROGRESS BAR ══ */
function ProgressBar({ value = 0, max = 100, color = "var(--accent-primary)", height = 4, glow = false, animated = false }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{
      width: "100%", height,
      background: "var(--bg-overlay)",
      borderRadius: "var(--r-full)",
      overflow: "hidden",
    }}>
      <div style={{
        height: "100%",
        width: `${pct}%`,
        background: color,
        borderRadius: "var(--r-full)",
        transition: animated ? "width 0.6s ease" : "none",
        boxShadow: glow ? `0 0 8px ${color}` : "none",
      }} />
    </div>
  );
}

/* ══ DIVIDER ══ */
function Divider({ label, style = {} }) {
  if (!label) {
    return <div style={{ height: 1, background: "var(--border-subtle)", width: "100%", ...style }} />;
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", ...style }}>
      <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
      <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
    </div>
  );
}

/* ══ KEYBOARD SHORTCUT ══ */
function Kbd({ children }) {
  return (
    <kbd style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg-overlay)",
      border: "1px solid var(--border-normal)",
      borderBottomWidth: "2px",
      borderRadius: "var(--r-xs)",
      padding: "1px 6px",
      fontSize: "0.65rem",
      fontFamily: "var(--font-mono)",
      fontWeight: 600,
      color: "var(--text-secondary)",
      lineHeight: 1.6,
    }}>
      {children}
    </kbd>
  );
}

/* ══ TYPING INDICATOR ══ */
function TypingIndicator({ label = "AI is typing" }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "8px",
      padding: "6px 12px",
      background: "var(--bg-elevated)",
      borderRadius: "var(--r-lg)",
      border: "1px solid var(--border-subtle)",
    }}>
      <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", height: "12px" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 4, height: 4,
            borderRadius: "50%",
            background: "var(--accent-primary)",
            animation: `typing-bounce 1.2s ease ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", fontStyle: "italic" }}>
        {label}
      </span>
    </div>
  );
}

/* ══ EMOTION TAG ══ */
const EMOTION_CONFIG = {
  idle:    { emoji: "😐", color: "#8B96B0", label: { id: "Siaga",   en: "Idle"    } },
  happy:   { emoji: "😊", color: "#00FF88", label: { id: "Senang",  en: "Happy"   } },
  talking: { emoji: "🗣️", color: "#00D4FF", label: { id: "Bicara",  en: "Talking" } },
  excited: { emoji: "🔥", color: "#FFB800", label: { id: "Excited", en: "Excited" } },
  sad:     { emoji: "😔", color: "#7C3AFF", label: { id: "Sedih",   en: "Sad"     } },
  angry:   { emoji: "😠", color: "#FF3C3C", label: { id: "Marah",   en: "Angry"   } },
  sleepy:  { emoji: "😴", color: "#4A5568", label: { id: "Ngantuk", en: "Sleepy"  } },
  laughing:{ emoji: "😂", color: "#FFB800", label: { id: "Ketawa",  en: "Laughing"} },
  afk:     { emoji: "🌙", color: "#7C3AFF", label: { id: "AFK",     en: "AFK"     } },
};

function EmotionTag({ emotion = "idle", lang = "id", size = "sm" }) {
  const cfg = EMOTION_CONFIG[emotion] || EMOTION_CONFIG.idle;
  const sizes = { sm: { fontSize: "0.75rem", padding: "3px 10px" }, md: { fontSize: "0.875rem", padding: "5px 14px" } };
  const s = sizes[size] || sizes.sm;
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      background: `${cfg.color}15`,
      border: `1px solid ${cfg.color}35`,
      borderRadius: "var(--r-full)",
      color: cfg.color,
      fontWeight: 600,
      letterSpacing: "0.04em",
      ...s
    }}>
      <span>{cfg.emoji}</span>
      <span style={{ textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.7em" }}>
        {cfg.label[lang]}
      </span>
    </div>
  );
}

/* ══ PLATFORM BADGE ══ */
function PlatformBadge({ platform = "twitch", connected = false }) {
  const platforms = {
    twitch:  { icon: <IcTwitch size={12} />, color: "#9146FF", name: "Twitch" },
    youtube: { icon: <IcYouTube size={12} />, color: "#FF0000", name: "YouTube" },
    tiktok:  { icon: <IcTikTok size={12} />, color: "#ff0050", name: "TikTok" },
  };
  const p = platforms[platform] || platforms.twitch;
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      background: connected ? `${p.color}18` : "var(--bg-elevated)",
      border: `1px solid ${connected ? `${p.color}40` : "var(--border-subtle)"}`,
      borderRadius: "var(--r-full)",
      padding: "3px 8px",
      fontSize: "0.7rem", fontWeight: 600,
      color: connected ? p.color : "var(--text-muted)",
    }}>
      <span style={{ color: p.color }}>{p.icon}</span>
      {p.name}
      <StatusDot status={connected ? "online" : "offline"} size={5} />
    </div>
  );
}

/* ══ STAT CARD ══ */
function StatCard({ label, value, icon, trend, color = "var(--accent-primary)", style = {} }) {
  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--r-md)",
      padding: "16px",
      display: "flex", flexDirection: "column", gap: "8px",
      ...style
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {label}
        </span>
        {icon && (
          <div style={{
            width: 28, height: 28,
            borderRadius: "var(--r-sm)",
            background: `${color}15`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: color,
          }}>
            {icon}
          </div>
        )}
      </div>
      <div style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>
        {value}
      </div>
      {trend !== undefined && (
        <div style={{ fontSize: "var(--text-xs)", color: trend >= 0 ? "var(--status-online)" : "var(--status-live)", fontWeight: 600 }}>
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}% vs kemarin
        </div>
      )}
    </div>
  );
}

/* ══ TAG / LABEL ══ */
function Tag({ children, color = "default", dot = false }) {
  const colors = {
    default:  { bg: "var(--bg-elevated)", text: "var(--text-secondary)", dot: "var(--text-muted)" },
    cyan:     { bg: "rgba(0,212,255,0.1)",  text: "#00D4FF", dot: "#00D4FF" },
    violet:   { bg: "rgba(124,58,255,0.1)", text: "#7C3AFF", dot: "#7C3AFF" },
    green:    { bg: "rgba(0,255,136,0.1)",  text: "#00FF88", dot: "#00FF88" },
    amber:    { bg: "rgba(255,184,0,0.1)",  text: "#FFB800", dot: "#FFB800" },
    red:      { bg: "rgba(255,60,60,0.1)",  text: "#FF6B6B", dot: "#FF3C3C" },
  };
  const c = colors[color] || colors.default;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      background: c.bg,
      borderRadius: "var(--r-sm)",
      padding: "2px 8px",
      fontSize: "var(--text-xs)",
      fontWeight: 600,
      color: c.text,
      lineHeight: 1.6,
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />}
      {children}
    </span>
  );
}

/* ══ EXPORT ══ */
Object.assign(window, {
  StatusDot, Badge, LiveBadge, Chip, Toggle, AvatarCircle,
  Spinner, Skeleton, ProgressBar, Divider, Kbd, TypingIndicator,
  EmotionTag, EMOTION_CONFIG, PlatformBadge, StatCard, Tag,
});
