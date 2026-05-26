/* ─────────────────────────────────────────────
   AlterCast — Icon System v1.0
   All icons as React SVG components
   ───────────────────────────────────────────── */

/* ── ICON WRAPPER ── */
function Icon({ size = 16, color = "currentColor", style = {}, className = "", children, ...rest }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, display: 'inline-block', ...style }}
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

/* ── NAVIGATION ── */
function IcLayoutDashboard({ size, color }) {
  return <Icon size={size} color={color}><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></Icon>;
}
function IcSliders({ size, color }) {
  return <Icon size={size} color={color}><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></Icon>;
}
function IcUserSquare({ size, color }) {
  return <Icon size={size} color={color}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M6,21v-1a6,6 0 0,1 12,0v1"/></Icon>;
}
function IcMonitor({ size, color }) {
  return <Icon size={size} color={color}><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></Icon>;
}
function IcSettings({ size, color }) {
  return <Icon size={size} color={color}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></Icon>;
}
function IcHome({ size, color }) {
  return <Icon size={size} color={color}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Icon>;
}
function IcLayers({ size, color }) {
  return <Icon size={size} color={color}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></Icon>;
}

/* ── STREAM STATUS ── */
function IcRadio({ size, color }) {
  return <Icon size={size} color={color}><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></Icon>;
}
function IcWifi({ size, color }) {
  return <Icon size={size} color={color}><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></Icon>;
}
function IcWifiOff({ size, color }) {
  return <Icon size={size} color={color}><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></Icon>;
}
function IcSignal({ size, color }) {
  return <Icon size={size} color={color}><line x1="2" y1="20" x2="2" y2="14"/><line x1="7" y1="20" x2="7" y2="9"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="17" y1="20" x2="17" y2="9"/><line x1="22" y1="20" x2="22" y2="14"/></Icon>;
}

/* ── AI FEATURES ── */
function IcBrain({ size, color }) {
  return <Icon size={size} color={color}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></Icon>;
}
function IcCpu({ size, color }) {
  return <Icon size={size} color={color}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></Icon>;
}
function IcCloud({ size, color }) {
  return <Icon size={size} color={color}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></Icon>;
}
function IcZap({ size, color }) {
  return <Icon size={size} color={color}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Icon>;
}

/* ── AVATAR/VOICE CONTROLS ── */
function IcUser({ size, color }) {
  return <Icon size={size} color={color}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>;
}
function IcEye({ size, color }) {
  return <Icon size={size} color={color}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></Icon>;
}
function IcEyeOff({ size, color }) {
  return <Icon size={size} color={color}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></Icon>;
}
function IcMic({ size, color }) {
  return <Icon size={size} color={color}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></Icon>;
}
function IcMicOff({ size, color }) {
  return <Icon size={size} color={color}><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></Icon>;
}
function IcVolume2({ size, color }) {
  return <Icon size={size} color={color}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></Icon>;
}
function IcVolumeX({ size, color }) {
  return <Icon size={size} color={color}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></Icon>;
}
function IcCamera({ size, color }) {
  return <Icon size={size} color={color}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></Icon>;
}
function IcCameraOff({ size, color }) {
  return <Icon size={size} color={color}><line x1="1" y1="1" x2="23" y2="23"/><path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34"/><circle cx="12" cy="13" r="4"/></Icon>;
}

/* ── CHAT / INTERACTION ── */
function IcMessageSquare({ size, color }) {
  return <Icon size={size} color={color}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Icon>;
}
function IcHeart({ size, color }) {
  return <Icon size={size} color={color}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></Icon>;
}
function IcStar({ size, color }) {
  return <Icon size={size} color={color}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Icon>;
}
function IcSend({ size, color }) {
  return <Icon size={size} color={color}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></Icon>;
}

/* ── MODE CONTROLS ── */
function IcMaximize2({ size, color }) {
  return <Icon size={size} color={color}><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></Icon>;
}
function IcMinimize2({ size, color }) {
  return <Icon size={size} color={color}><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/></Icon>;
}
function IcMoon({ size, color }) {
  return <Icon size={size} color={color}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></Icon>;
}
function IcSun({ size, color }) {
  return <Icon size={size} color={color}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></Icon>;
}
function IcPlay({ size, color }) {
  return <Icon size={size} color={color}><polygon points="5 3 19 12 5 21 5 3"/></Icon>;
}
function IcSquare({ size, color }) {
  return <Icon size={size} color={color}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></Icon>;
}
function IcCircle({ size, color }) {
  return <Icon size={size} color={color}><circle cx="12" cy="12" r="10"/></Icon>;
}

/* ── MISC ── */
function IcDownload({ size, color }) {
  return <Icon size={size} color={color}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></Icon>;
}
function IcUpload({ size, color }) {
  return <Icon size={size} color={color}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></Icon>;
}
function IcCopy({ size, color }) {
  return <Icon size={size} color={color}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></Icon>;
}
function IcShare2({ size, color }) {
  return <Icon size={size} color={color}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></Icon>;
}
function IcRefreshCw({ size, color }) {
  return <Icon size={size} color={color}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></Icon>;
}
function IcChevronRight({ size, color }) {
  return <Icon size={size} color={color}><polyline points="9 18 15 12 9 6"/></Icon>;
}
function IcChevronDown({ size, color }) {
  return <Icon size={size} color={color}><polyline points="6 9 12 15 18 9"/></Icon>;
}
function IcChevronLeft({ size, color }) {
  return <Icon size={size} color={color}><polyline points="15 18 9 12 15 6"/></Icon>;
}
function IcX({ size, color }) {
  return <Icon size={size} color={color}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Icon>;
}
function IcCheck({ size, color }) {
  return <Icon size={size} color={color}><polyline points="20 6 9 17 4 12"/></Icon>;
}
function IcAlertTriangle({ size, color }) {
  return <Icon size={size} color={color}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></Icon>;
}
function IcInfo({ size, color }) {
  return <Icon size={size} color={color}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></Icon>;
}
function IcPlus({ size, color }) {
  return <Icon size={size} color={color}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Icon>;
}
function IcMinus({ size, color }) {
  return <Icon size={size} color={color}><line x1="5" y1="12" x2="19" y2="12"/></Icon>;
}
function IcGlobe({ size, color }) {
  return <Icon size={size} color={color}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></Icon>;
}
function IcLink({ size, color }) {
  return <Icon size={size} color={color}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></Icon>;
}
function IcCode({ size, color }) {
  return <Icon size={size} color={color}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></Icon>;
}
function IcActivity({ size, color }) {
  return <Icon size={size} color={color}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></Icon>;
}
function IcPower({ size, color }) {
  return <Icon size={size} color={color}><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></Icon>;
}
function IcLock({ size, color }) {
  return <Icon size={size} color={color}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Icon>;
}
function IcBox({ size, color }) {
  return <Icon size={size} color={color}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></Icon>;
}
function IcTrendingUp({ size, color }) {
  return <Icon size={size} color={color}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></Icon>;
}
function IcUsers({ size, color }) {
  return <Icon size={size} color={color}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>;
}
function IcClock({ size, color }) {
  return <Icon size={size} color={color}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>;
}
function IcFilter({ size, color }) {
  return <Icon size={size} color={color}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></Icon>;
}
function IcPalette({ size, color }) {
  return <Icon size={size} color={color}><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></Icon>;
}
function IcDatabase({ size, color }) {
  return <Icon size={size} color={color}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></Icon>;
}

/* ── CUSTOM / PLATFORM ICONS ── */
function IcTwitch({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
    </svg>
  );
}
function IcYouTube({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}
function IcTikTok({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.84 1.55V6.79a4.85 4.85 0 0 1-1.07-.1z"/>
    </svg>
  );
}

/* ── ALTERCAST LOGO ── */
function AlterCastLogo({ size = 32, showText = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="rgba(0,212,255,0.12)" stroke="rgba(0,212,255,0.3)" strokeWidth="1"/>
        <circle cx="16" cy="12" r="5" fill="none" stroke="#00D4FF" strokeWidth="1.5"/>
        <circle cx="21" cy="10" r="2" fill="none" stroke="#7C3AFF" strokeWidth="1.2"/>
        <path d="M9 24c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M23 20c0-1.66 1.34-3 3-3" stroke="#7C3AFF" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="16" cy="12" r="2" fill="#00D4FF" opacity="0.8"/>
      </svg>
      {showText && (
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1.1rem',
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #00D4FF 30%, #7C3AFF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
        }}>
          AlterCast
        </span>
      )}
    </div>
  );
}

/* ── EXPORT ALL ── */
Object.assign(window, {
  Icon, AlterCastLogo,
  IcLayoutDashboard, IcSliders, IcUserSquare, IcMonitor, IcSettings, IcHome, IcLayers,
  IcRadio, IcWifi, IcWifiOff, IcSignal,
  IcBrain, IcCpu, IcCloud, IcZap,
  IcUser, IcEye, IcEyeOff, IcMic, IcMicOff, IcVolume2, IcVolumeX, IcCamera, IcCameraOff,
  IcMessageSquare, IcHeart, IcStar, IcSend,
  IcMaximize2, IcMinimize2, IcMoon, IcSun, IcPlay, IcSquare, IcCircle,
  IcDownload, IcUpload, IcCopy, IcShare2, IcRefreshCw,
  IcChevronRight, IcChevronDown, IcChevronLeft,
  IcX, IcCheck, IcAlertTriangle, IcInfo, IcPlus, IcMinus,
  IcGlobe, IcLink, IcCode, IcActivity, IcPower, IcLock, IcBox,
  IcTrendingUp, IcUsers, IcClock, IcFilter, IcPalette, IcDatabase,
  IcTwitch, IcYouTube, IcTikTok,
});
