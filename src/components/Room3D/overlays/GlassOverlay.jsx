import React from "react";

export default function GlassOverlay({ style }) {
  return (
    <div
      style={{
        ...style,
        borderRadius: "4px",
        background: "rgba(255,255,255,0.15)",
        boxShadow: "0 8px 32px 0 rgba(31,38,135,0.15)",
        border: "1px solid rgba(255,255,255,0.17)",
        backdropFilter: "blur(16px) brightness(1.08)",
        WebkitBackdropFilter: "blur(16px) brightness(1.08)",
        zIndex: 10,
        pointerEvents: "none",
      }}
    />
  );
}
