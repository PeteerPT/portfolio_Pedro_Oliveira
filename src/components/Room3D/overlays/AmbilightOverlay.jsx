import React from "react";

export default function AmbilightOverlay({ style }) {
  return (
    <div
      style={{
        ...style,
        filter: "blur(32px) brightness(1.4)",
        opacity: 1,
        borderRadius: "2px",
        zIndex: 5,
        pointerEvents: "none",
        background: "linear-gradient(120deg,rgba(214, 0, 0, 0.47) 0%,rgb(214, 0, 0) 100%)",
        maskImage: "radial-gradient(ellipse at center, white 65%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, white 65%, transparent 100%)",
      }}
    />
  );
}
