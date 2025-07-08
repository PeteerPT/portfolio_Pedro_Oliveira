import React, { useRef, useState, useEffect } from "react";
import VideoOverlayCanvas from "./../Room3D/overlays/VideoOverlayCanvas";
import MonitorPowerEffect from "./../Room3D/overlays/MonitorPowerEffect";

const overlays = [
  { src: "/static/textures/monitor/png/shadow.png", opacity: 0.85 },
  { src: "/static/textures/monitor/png/smudges.png", opacity: 0.08 },
  { src: "/static/textures/monitor/png/reflection.png", opacity: 0.15 },
  { src: "/static/textures/monitor/png/dust.png", opacity: 0.1 },
];

export default function WindowsOS({ showPowerEffect = "on", registerPowerOff }) {
  const clickAudio = useRef();

  const [powerEffect, setPowerEffect] = useState(null); // "on" | "off" | "waiting" | null
  const [showIframe, setShowIframe] = useState(false);
  const [hasMounted, setHasMounted] = useState(false); // controle inicial de montagem

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // LIGANDO
  useEffect(() => {
    if (showPowerEffect === "on") {
      setPowerEffect("waiting");
      setShowIframe(false);

      const t = setTimeout(() => {
        setPowerEffect("on");
        setShowIframe(true);
      }, 2000);

      return () => clearTimeout(t);
    }
  }, [showPowerEffect]);

  // DESLIGANDO
  useEffect(() => {
    if (registerPowerOff) {
      registerPowerOff((onFinish) => {
        setPowerEffect("off");

        setTimeout(() => {
          setShowIframe(false);
          onFinish?.();
        }, 700);
      });
    }
  }, [registerPowerOff]);

  function playClickSound(e) {
    if (e.button !== 0) return;
    if (clickAudio.current) {
      clickAudio.current.currentTime = 0;
      clickAudio.current.volume = 0.82;
      clickAudio.current.play();
    }
  }

  // POSIÇÃO DO MONITOR
  const glassLeft = "33.6%";
  const glassTop = "40.85%";
  const glassWidth = "14.85%";
  const glassHeight = "18.25%";
  const left = "33.6%";
  const top = "40.85%";
  const width = "14.85%";
  const height = "18.24%";
  const ambilightLeft = "33.6%";
  const ambilightTop = "40.9%";
  const ambilightWidth = "14.9%";
  const ambilightHeight = "18.4%";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        pointerEvents: "auto",
      }}
    >
      {/* AMBILIGHT */}
      <div
        style={{
          position: "absolute",
          left: ambilightLeft,
          top: ambilightTop,
          width: ambilightWidth,
          height: ambilightHeight,
          filter: "blur(32px) brightness(1.5)",
          opacity: 0.2,
          borderRadius: "2px",
          zIndex: 4,
          pointerEvents: "none",
          background: "linear-gradient(120deg,rgba(163, 0, 0, 0.32) 0%,rgba(180, 0, 0, 0.47) 100%)",
          maskImage: "radial-gradient(ellipse at center, white 65%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, white 65%, transparent 100%)",
        }}
      />

      {/* MONITOR EFFECT (abaixo do vidro) */}
      <div
        style={{
          position: "absolute",
          left,
          top,
          width,
          height,
          zIndex: 15, // agora por baixo do vidro
          pointerEvents: "none",
        }}
      >
        {powerEffect && (powerEffect !== "off" || hasMounted) && (
          <MonitorPowerEffect show={powerEffect} />
        )}
      </div>

      {/* IFRAME WEB */}
      {showIframe && (
        <iframe
          src="https://portfolioweb-tau-silk.vercel.app/"
          style={{
            width: "82%",
            height: "100%",
            border: "none",
            borderRadius: "2px",
            transform: "scale(0.1752)",
            transformOrigin: "center",
            imageRendering: "crisp-edges",
            pointerEvents: "auto",
            cursor: "auto",
            filter: "brightness(0.9) contrast(1.1)",
          }}
          title="Pedro's Portfolio"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
          allow="fullscreen; pointer-lock"
          onPointerDown={playClickSound}
        />
      )}

      {/* ÁUDIO DE CLIQUE */}
      <audio
        ref={clickAudio}
        src="/static/audio/sound/button-screen.mp3"
        preload="auto"
        style={{ display: "none" }}
      />

      {/* OVERLAYS VÍDEO */}
      <VideoOverlayCanvas
        src="/static/textures/monitor/video/base-static.mp4"
        opacity={0.09}
        style={{ position: "absolute", left, top, width, height, zIndex: 20 }}
      />
      <VideoOverlayCanvas
        src="/static/textures/monitor/video/static-texture-layer.mp4"
        opacity={0.09}
        style={{ position: "absolute", left, top, width, height, zIndex: 21 }}
      />

      {/* OVERLAYS PNG */}
      {overlays.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt={`overlay-${i}`}
          style={{
            position: "absolute",
            left,
            top,
            width,
            height,
            pointerEvents: "none",
            touchAction: "none",
            userSelect: "none",
            zIndex: 30 + i,
            opacity: img.opacity,
          }}
          draggable={false}
        />
      ))}

      {/* VIDRO */}
      <div
        style={{
          position: "absolute",
          left: glassLeft,
          top: glassTop,
          width: glassWidth,
          height: glassHeight,
          borderRadius: "0px",
          opacity: 0.2,
          background: "rgba(255, 255, 255, 0.26)",
          border: "1px solid rgba(255,255,255,0.09)",
          backdropFilter: "blur(19px) brightness(1.04)",
          WebkitBackdropFilter: "blur(19px) brightness(1.04)",
          zIndex: 999, // vidro no topo
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
