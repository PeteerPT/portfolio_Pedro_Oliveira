import React, { useState, useEffect, useRef } from "react";
import WindowsOS from "./WindowsOS";
import "./MonitorButton.css";

const IMG_ROOM = { width: 1980, height: 1024 };
const MONITOR_RECT = { x: 377, y: 12, width: 1500, height: 1000 };
const MONITOR_CENTER = {
  x: MONITOR_RECT.x + MONITOR_RECT.width / 2,
  y: MONITOR_RECT.y + MONITOR_RECT.height / 2,
};

function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

function isMobile() {
  if (typeof window === "undefined") return false;
  return /android|iphone|ipad|ipod|opera mini|iemobile|mobile|blackberry|webos|windows phone/i.test(navigator.userAgent) || window.innerWidth < 650;
}

export default function Monitor2D({ onBack }) {
  const mobile = isMobile();
  const { width: vw, height: vh } = useWindowSize();
  const ZOOM_MIN = mobile ? 1.8 : 1.5;
  const ZOOM_MAX = mobile ? 3 : 5;
  const [zoom, setZoom] = useState(ZOOM_MIN);
  const [showBtn, setShowBtn] = useState(false);
  const [readyToBack, setReadyToBack] = useState(false);
  const btnRef = useRef();
  const powerOffFn = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => setShowBtn(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  const handleBackClick = () => {
    if (readyToBack || !powerOffFn.current) return;
    setReadyToBack(true);
    const audio = new Audio("/static/audio/sound/button-screen.mp3");
    audio.volume = 0.95;
    audio.play();

    // Executa efeito desligar no WindowsOS
    powerOffFn.current(() => {
      onBack(); // volta pro 3D
    });
  };

  const onWheel = (e) => {
    e.preventDefault();
    let nextZoom = zoom - e.deltaY * 0.002;
    nextZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, nextZoom));
    setZoom(nextZoom);
  };

  const commonProps = {
    zoom,
    onWheel,
    handleBackClick,
    showBtn,
    readyToBack,
    btnRef,
    mobile,
    vw,
    vh,
    registerPowerOff: (fn) => (powerOffFn.current = fn),
  };

  return mobile ? <MonitorMobile {...commonProps} /> : <MonitorDesktop {...commonProps} />;
}

function MonitorMobile({ zoom, onWheel, handleBackClick, showBtn, readyToBack, btnRef, vh, registerPowerOff }) {
  const imgW = IMG_ROOM.width * zoom;
  const imgH = IMG_ROOM.height * zoom;
  const centerX = vh / 1.61;
  const centerY = vh / 2;
  const imgLeft = centerX - MONITOR_CENTER.x * zoom;
  const imgTop = centerY - MONITOR_CENTER.y * zoom;
  const monitorLeft = centerX - (MONITOR_RECT.width * zoom) / 2;
  const monitorTop = centerY - (MONITOR_RECT.height * zoom) / 2;
  const monitorW = MONITOR_RECT.width * zoom;
  const monitorH = MONITOR_RECT.height * zoom;

  return (
    <div onWheel={onWheel} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#000", overflow: "hidden", zIndex: 2000 }}>
      <img src="/static/textures/monitor/png/monitor-room.png" alt="Sala/Monitor" style={{ position: "absolute", width: imgW, height: imgH, left: imgLeft, top: imgTop, pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: monitorLeft, top: monitorTop, width: monitorW, height: monitorH, overflowY: "auto", pointerEvents: "auto" }}>
        <div style={{ width: MONITOR_RECT.width, height: MONITOR_RECT.height, transform: `scale(${zoom})`, transformOrigin: "top left", position: "absolute", left: 0, top: 0 }}>
          <WindowsOS registerPowerOff={registerPowerOff} />
        </div>
      </div>
      <button
        ref={btnRef}
        className={`monitor2d-btn${showBtn ? " show" : ""}`}
        onClick={handleBackClick}
        tabIndex={1}
        disabled={readyToBack}
        style={{ position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 3000, opacity: readyToBack ? 0.4 : 1 }}
      >
        BACK
      </button>
    </div>
  );
}

function MonitorDesktop({ zoom, onWheel, handleBackClick, showBtn, readyToBack, btnRef, vw, vh, registerPowerOff }) {
  const imgW = IMG_ROOM.width * zoom;
  const imgH = IMG_ROOM.height * zoom;
  const offsetX = (vw - imgW) / 2;
  const offsetY = (vh - imgH) / 2;
  const monitorLeft = offsetX + MONITOR_RECT.x * zoom;
  const monitorTop = offsetY + MONITOR_RECT.y * zoom;
  const monitorW = MONITOR_RECT.width * zoom;
  const monitorH = MONITOR_RECT.height * zoom;

  return (
    <div onWheel={onWheel} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#000", overflow: "hidden", zIndex: 2000 }}>
      <img src="/static/textures/monitor/png/monitor-room.png" alt="Sala/Monitor" style={{ position: "absolute", width: IMG_ROOM.width, height: IMG_ROOM.height, top: "50%", left: "50%", transform: `translate(-50%, -50%) scale(${zoom})`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: monitorLeft, top: monitorTop, width: monitorW, height: monitorH, overflow: "hidden", pointerEvents: "auto" }}>
        <div style={{ width: MONITOR_RECT.width, height: MONITOR_RECT.height, transform: `scale(${zoom})`, transformOrigin: "top left", position: "absolute", left: 0, top: 0 }}>
          <WindowsOS registerPowerOff={registerPowerOff} />
        </div>
      </div>
      <button
        ref={btnRef}
        className={`monitor2d-btn${showBtn ? " show" : ""}`}
        onClick={handleBackClick}
        tabIndex={1}
        disabled={readyToBack}
        style={{ position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 3000, opacity: readyToBack ? 0.4 : 1 }}
      >
        BACK
      </button>
    </div>
  );
}
