/* ─────────────────────────────────────────────
   AlterCast — UI Components v1.0
   Buttons, Inputs, Panels, Modals, Toasts,
   Sliders, Selects, Cards
   ───────────────────────────────────────────── */

/* ══ BUTTON ══ */
function Button({
  children, onClick, variant = "primary", size = "md",
  icon, iconRight, disabled = false, loading = false,
  fullWidth = false, style = {}, ...rest
}) {
  const [hovered, setHovered] = React.useState(false);
  const variants = {
    primary: {
      bg: hovered ? "var(--accent-primary-dim)" : "var(--accent-primary)",
      color: "var(--text-inverse)",
      border: "var(--accent-primary)",
      shadow: hovered ? "var(--shadow-glow-cyan)" : "none",
    },
    secondary: {
      bg: hovered ? "rgba(124,58,255,0.2)" : "rgba(124,58,255,0.12)",
      color: "var(--accent-secondary)",
      border: "rgba(124,58,255,0.35)",
      shadow: hovered ? "var(--shadow-glow-violet)" : "none",
    },
    outline: {
      bg: hovered ? "var(--bg-hover)" : "transparent",
      color: "var(--accent-primary)",
      border: "var(--border-accent)",
      shadow: "none",
    },
    ghost: {
      bg: hovered ? "var(--bg-hover)" : "transparent",
      color: "var(--text-secondary)",
      border: "transparent",
      shadow: "none",
    },
    danger: {
      bg: hovered ? "rgba(255,60,60,0.2)" : "rgba(255,60,60,0.12)",
      color: "var(--status-live)",
      border: "rgba(255,60,60,0.35)",
      shadow: hovered ? "var(--shadow-glow-live)" : "none",
    },
    surface: {
      bg: hovered ? "var(--bg-elevated)" : "var(--bg-surface)",
      color: "var(--text-primary)",
      border: "var(--border-normal)",
      shadow: "none",
    },
    live: {
      bg: hovered ? "#cc2f2f" : "var(--status-live)",
      color: "#fff",
      border: "var(--status-live)",
      shadow: hovered ? "var(--shadow-glow-live)" : "none",
    },
  };
  const sizes = {
    xs: { height: "24px", px: "8px",  fontSize: "var(--text-xs)", gap: "4px", iconSize: 12, radius: "var(--r-sm)" },
    sm: { height: "30px", px: "12px", fontSize: "var(--text-sm)", gap: "5px", iconSize: 14, radius: "var(--r-sm)" },
    md: { height: "36px", px: "16px", fontSize: "var(--text-sm)", gap: "6px", iconSize: 15, radius: "var(--r-md)" },
    lg: { height: "44px", px: "20px", fontSize: "var(--text-base)", gap: "8px", iconSize: 16, radius: "var(--r-md)" },
    xl: { height: "52px", px: "28px", fontSize: "var(--text-lg)", gap: "8px", iconSize: 18, radius: "var(--r-lg)" },
  };
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;
  const isDisabled = disabled || loading;
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      onMouseEnter={() => !isDisabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: s.gap,
        height: s.height, padding: `0 ${s.px}`,
        background: v.bg, color: v.color,
        border: `1px solid ${v.border}`,
        borderRadius: s.radius,
        fontSize: s.fontSize, fontWeight: 600,
        fontFamily: "var(--font-display)",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.5 : 1,
        transition: "all var(--t-fast)",
        boxShadow: v.shadow,
        width: fullWidth ? "100%" : "auto",
        whiteSpace: "nowrap",
        outline: "none",
        letterSpacing: "0.01em",
        ...style
      }}
      {...rest}
    >
      {loading ? <Spinner size={s.iconSize} color={v.color} /> : (
        icon && React.cloneElement(icon, { size: s.iconSize, color: v.color })
      )}
      {children}
      {iconRight && !loading && React.cloneElement(iconRight, { size: s.iconSize, color: v.color })}
    </button>
  );
}

/* ══ ICON BUTTON ══ */
function IconButton({ icon, onClick, variant = "ghost", size = "md", tooltip, active = false, disabled = false, style = {} }) {
  const [hovered, setHovered] = React.useState(false);
  const sizes = { sm: 28, md: 32, lg: 40 };
  const iconSizes = { sm: 14, md: 16, lg: 18 };
  const s = sizes[size] || sizes.md;
  const is = iconSizes[size] || iconSizes.md;
  const getStyle = () => {
    if (active) return { bg: "var(--accent-primary-glow)", color: "var(--accent-primary)", border: "var(--border-accent)" };
    if (hovered) return { bg: "var(--bg-hover)", color: "var(--text-primary)", border: "var(--border-subtle)" };
    return { bg: "transparent", color: "var(--text-secondary)", border: "transparent" };
  };
  const st = getStyle();
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: s, height: s,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: st.bg, color: st.color,
        border: `1px solid ${st.border}`,
        borderRadius: "var(--r-sm)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "all var(--t-fast)",
        flexShrink: 0,
        outline: "none",
        ...style
      }}
    >
      {React.cloneElement(icon, { size: is })}
    </button>
  );
}

/* ══ INPUT ══ */
function Input({ value, onChange, placeholder, type = "text", icon, iconRight, size = "md", disabled = false, error, style = {} }) {
  const [focused, setFocused] = React.useState(false);
  const sizes = {
    sm: { height: "30px", px: "10px", fontSize: "var(--text-sm)" },
    md: { height: "38px", px: "12px", fontSize: "var(--text-sm)" },
    lg: { height: "44px", px: "14px", fontSize: "var(--text-base)" },
  };
  const s = sizes[size] || sizes.md;
  return (
    <div style={{ position: "relative", width: "100%", ...style }}>
      {icon && (
        <div style={{
          position: "absolute", left: s.px, top: "50%", transform: "translateY(-50%)",
          color: focused ? "var(--accent-primary)" : "var(--text-muted)",
          display: "flex", transition: "color var(--t-fast)",
        }}>
          {React.cloneElement(icon, { size: 15 })}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", height: s.height,
          padding: `0 ${icon ? "36px" : s.px}`,
          paddingRight: iconRight ? "36px" : s.px,
          background: "var(--bg-elevated)",
          border: `1px solid ${error ? "var(--status-live)" : focused ? "var(--border-focus)" : "var(--border-normal)"}`,
          borderRadius: "var(--r-md)",
          color: "var(--text-primary)",
          fontSize: s.fontSize,
          fontFamily: "var(--font-display)",
          outline: "none",
          transition: "border-color var(--t-fast), box-shadow var(--t-fast)",
          boxShadow: focused ? `0 0 0 3px ${error ? "rgba(255,60,60,0.15)" : "var(--accent-primary-glow)"}` : "none",
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "text",
        }}
      />
      {iconRight && (
        <div style={{
          position: "absolute", right: s.px, top: "50%", transform: "translateY(-50%)",
          color: "var(--text-muted)", display: "flex",
        }}>
          {React.cloneElement(iconRight, { size: 15 })}
        </div>
      )}
      {error && (
        <div style={{ fontSize: "var(--text-xs)", color: "var(--status-live)", marginTop: "4px", paddingLeft: "4px" }}>
          {error}
        </div>
      )}
    </div>
  );
}

/* ══ TEXTAREA ══ */
function Textarea({ value, onChange, placeholder, rows = 4, disabled = false, style = {} }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <textarea
      value={value}
      onChange={e => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        padding: "10px 12px",
        background: "var(--bg-elevated)",
        border: `1px solid ${focused ? "var(--border-focus)" : "var(--border-normal)"}`,
        borderRadius: "var(--r-md)",
        color: "var(--text-primary)",
        fontSize: "var(--text-sm)",
        fontFamily: "var(--font-display)",
        resize: "vertical",
        outline: "none",
        transition: "border-color var(--t-fast)",
        boxShadow: focused ? "0 0 0 3px var(--accent-primary-glow)" : "none",
        lineHeight: 1.6,
        ...style
      }}
    />
  );
}

/* ══ SELECT ══ */
function Select({ value, onChange, options = [], disabled = false, style = {} }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ position: "relative", ...style }}>
      <select
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", height: "38px",
          padding: "0 32px 0 12px",
          background: "var(--bg-elevated)",
          border: `1px solid ${focused ? "var(--border-focus)" : "var(--border-normal)"}`,
          borderRadius: "var(--r-md)",
          color: "var(--text-primary)",
          fontSize: "var(--text-sm)",
          fontFamily: "var(--font-display)",
          outline: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          appearance: "none",
          transition: "border-color var(--t-fast)",
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} style={{ background: "var(--bg-elevated)" }}>
            {opt.label}
          </option>
        ))}
      </select>
      <div style={{
        position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
        color: "var(--text-muted)", pointerEvents: "none",
      }}>
        <IcChevronDown size={14} />
      </div>
    </div>
  );
}

/* ══ RANGE SLIDER ══ */
function RangeSlider({ value, onChange, min = 0, max = 100, step = 1, color = "var(--accent-primary)", label, valueLabel }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
      {(label || valueLabel !== undefined) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {label && <span style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", fontWeight: 500 }}>{label}</span>}
          {valueLabel !== undefined && (
            <span style={{ fontSize: "var(--text-xs)", color: color, fontFamily: "var(--font-mono)", fontWeight: 600 }}>{valueLabel}</span>
          )}
        </div>
      )}
      <div style={{ position: "relative", height: "20px", display: "flex", alignItems: "center" }}>
        <div style={{
          position: "absolute", height: "4px", width: "100%",
          background: "var(--bg-overlay)", borderRadius: "var(--r-full)", overflow: "hidden",
        }}>
          <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "var(--r-full)", transition: "width 0.1s" }} />
        </div>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange && onChange(Number(e.target.value))}
          style={{
            position: "absolute", width: "100%", height: "100%",
            opacity: 0, cursor: "pointer", margin: 0,
          }}
        />
        <div style={{
          position: "absolute",
          left: `calc(${pct}% - 8px)`,
          width: "16px", height: "16px",
          borderRadius: "50%",
          background: color,
          border: "2px solid var(--bg-base)",
          boxShadow: `0 0 8px ${color}50`,
          transition: "left 0.1s",
          pointerEvents: "none",
        }} />
      </div>
    </div>
  );
}

/* ══ PANEL ══ */
function Panel({ children, title, icon, glow = false, variant = "default", footer, actions, style = {}, bodyStyle = {} }) {
  const borderColors = {
    default: "var(--border-subtle)",
    accent: "var(--border-accent)",
    live: "var(--border-live)",
    violet: "var(--border-violet)",
  };
  return (
    <div style={{
      background: "var(--bg-surface)",
      border: `1px solid ${borderColors[variant] || borderColors.default}`,
      borderRadius: "var(--r-lg)",
      overflow: "hidden",
      boxShadow: glow
        ? (variant === "live" ? "var(--shadow-glow-live)" : "var(--shadow-glow-cyan)")
        : "var(--shadow-sm)",
      display: "flex", flexDirection: "column",
      ...style
    }}>
      {(title || actions) && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border-subtle)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {icon && <span style={{ color: "var(--accent-primary)", display: "flex" }}>{icon}</span>}
            <span style={{
              fontSize: "var(--text-xs)", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.1em", color: "var(--text-secondary)",
            }}>
              {title}
            </span>
          </div>
          {actions && <div style={{ display: "flex", gap: "4px" }}>{actions}</div>}
        </div>
      )}
      <div style={{ flex: 1, overflow: "auto", ...bodyStyle }}>
        {children}
      </div>
      {footer && (
        <div style={{ padding: "10px 16px", borderTop: "1px solid var(--border-subtle)", flexShrink: 0 }}>
          {footer}
        </div>
      )}
    </div>
  );
}

/* ══ MODAL ══ */
function Modal({ open, onClose, title, children, footer, width = 480 }) {
  if (!open) return null;
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose && onClose()}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(8,10,15,0.8)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: "var(--z-modal)",
        animation: "fade-in 0.2s ease",
        padding: "20px",
      }}
    >
      <div style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-normal)",
        borderRadius: "var(--r-xl)",
        width: "100%", maxWidth: width,
        boxShadow: "var(--shadow-lg)",
        animation: "scale-in 0.2s ease",
        overflow: "hidden",
      }}>
        {title && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "18px 20px",
            borderBottom: "1px solid var(--border-subtle)",
          }}>
            <span style={{ fontWeight: 700, fontSize: "var(--text-lg)" }}>{title}</span>
            <IconButton icon={<IcX />} onClick={onClose} size="sm" />
          </div>
        )}
        <div style={{ padding: "20px" }}>{children}</div>
        {footer && (
          <div style={{
            padding: "14px 20px",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex", justifyContent: "flex-end", gap: "8px",
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══ TOAST ══ */
function Toast({ message, type = "default", onDismiss }) {
  const types = {
    default: { bg: "var(--bg-elevated)", border: "var(--border-normal)",  icon: <IcInfo size={14} />,          color: "var(--text-secondary)" },
    success: { bg: "rgba(0,255,136,0.1)", border: "rgba(0,255,136,0.3)", icon: <IcCheck size={14} />,         color: "var(--status-online)" },
    error:   { bg: "rgba(255,60,60,0.1)", border: "rgba(255,60,60,0.3)", icon: <IcAlertTriangle size={14} />, color: "var(--status-live)" },
    warning: { bg: "rgba(255,184,0,0.1)", border: "rgba(255,184,0,0.3)", icon: <IcAlertTriangle size={14} />, color: "var(--status-warning)" },
    info:    { bg: "rgba(0,212,255,0.1)", border: "rgba(0,212,255,0.3)", icon: <IcInfo size={14} />,          color: "var(--accent-primary)" },
  };
  const t = types[type] || types.default;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      background: t.bg, border: `1px solid ${t.border}`,
      borderRadius: "var(--r-lg)",
      padding: "10px 14px",
      animation: "toast-enter 0.3s ease",
      backdropFilter: "blur(12px)",
      minWidth: "200px", maxWidth: "380px",
      boxShadow: "var(--shadow-lg)",
    }}>
      <span style={{ color: t.color, display: "flex", flexShrink: 0 }}>{t.icon}</span>
      <span style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)", flex: 1 }}>{message}</span>
      <IconButton icon={<IcX />} onClick={onDismiss} size="sm" style={{ flexShrink: 0 }} />
    </div>
  );
}

/* ══ TOAST CONTAINER ══ */
function ToastContainer({ toasts, onDismiss }) {
  return (
    <div style={{
      position: "fixed", bottom: "80px", left: "50%",
      transform: "translateX(-50%)",
      display: "flex", flexDirection: "column", gap: "8px",
      zIndex: "var(--z-toast)",
      alignItems: "center",
    }}>
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
}

/* ══ FORM FIELD ══ */
function FormField({ label, children, hint, required = false, style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", ...style }}>
      {label && (
        <label style={{
          fontSize: "var(--text-xs)", fontWeight: 600,
          color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em",
        }}>
          {label} {required && <span style={{ color: "var(--status-live)" }}>*</span>}
        </label>
      )}
      {children}
      {hint && <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{hint}</span>}
    </div>
  );
}

/* ══ SECTION HEADER ══ */
function SectionHeader({ label, action }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 0 8px 0",
      marginBottom: "4px",
    }}>
      <span style={{
        fontSize: "var(--text-xs)", fontWeight: 700,
        color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em",
      }}>
        {label}
      </span>
      {action && action}
    </div>
  );
}

/* ══ EMPTY STATE ══ */
function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: "12px", padding: "40px 20px", textAlign: "center",
    }}>
      {icon && (
        <div style={{ color: "var(--text-muted)", opacity: 0.5 }}>
          {React.cloneElement(icon, { size: 32 })}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {title && <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-secondary)" }}>{title}</div>}
        {description && <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{description}</div>}
      </div>
      {action && action}
    </div>
  );
}

/* ══ CODE BLOCK ══ */
function CodeBlock({ children, lang = "" }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div style={{
      position: "relative",
      background: "var(--bg-void)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--r-md)",
      overflow: "hidden",
    }}>
      {lang && (
        <div style={{
          padding: "6px 12px",
          borderBottom: "1px solid var(--border-subtle)",
          fontSize: "var(--text-xs)", color: "var(--text-muted)", fontFamily: "var(--font-mono)",
          display: "flex", justifyContent: "space-between",
        }}>
          <span>{lang}</span>
          <button
            onClick={() => { navigator.clipboard?.writeText(children); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "var(--status-online)" : "var(--text-muted)", fontSize: "0.7rem", fontFamily: "var(--font-mono)" }}
          >
            {copied ? " copied" : "copy"}
          </button>
        </div>
      )}
      <pre style={{
        padding: "12px", margin: 0,
        fontSize: "var(--text-sm)", fontFamily: "var(--font-mono)",
        color: "var(--text-secondary)", lineHeight: 1.6,
        overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all",
      }}>
        {children}
      </pre>
    </div>
  );
}

/* ══ EXPORT ══ */
Object.assign(window, {
  Button, IconButton, Input, Textarea, Select, RangeSlider,
  Panel, Modal, Toast, ToastContainer, FormField, SectionHeader,
  EmptyState, CodeBlock,
});
