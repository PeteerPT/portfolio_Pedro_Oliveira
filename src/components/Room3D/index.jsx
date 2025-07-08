import React, { Suspense, useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Sphere } from "@react-three/drei";
import * as THREE from "three";
import Monitor2D from "./Monitor2D";
import "./MonitorButton.css";

// ----------- INÍCIO: Função para liberar sons de teclado -----------
const keySounds = [
  "/static/audio/keyboard/key_1.mp3",
  "/static/audio/keyboard/key_4.mp3",
  "/static/audio/keyboard/key_6.mp3",
  "/static/audio/keyboard/key_2.mp3",
  "/static/audio/keyboard/key_5.mp3",
  "/static/audio/keyboard/key_3.mp3",
];

function useUnlockAudio() {
  useEffect(() => {
    function unlockAudios() {
      keySounds.forEach((src) => {
        const a = new window.Audio(src);
        a.muted = true;
        a.play().then(() => {
          a.pause();
          a.muted = false;
        });
      });
      window.removeEventListener("pointerdown", unlockAudios);
    }
    window.addEventListener("pointerdown", unlockAudios);
    return () => window.removeEventListener("pointerdown", unlockAudios);
  }, []);
}
// ----------- FIM: Função para liberar sons de teclado -----------

// ----------- TypewriterText Suave -----------
function TypewriterText({ text, style, className = "" }) {
  const [displayCount, setDisplayCount] = useState(0);
  const soundIdx = useRef(0);
  const audioRefs = useRef(keySounds.map(() => React.createRef()));

  useEffect(() => {
    setDisplayCount(0);
    if (!text) return;

    let idx = 0;
    function showNext() {
      setDisplayCount(idx + 1);

      if (text[idx] !== " ") {
        const audioRef = audioRefs.current[soundIdx.current % keySounds.length].current;
        if (audioRef) {
          audioRef.currentTime = 0;
          audioRef.volume = 0.78;
          audioRef.play();
        }
        soundIdx.current++;
      }

      idx++;
      if (idx < text.length) {
        const nextDelay = 34 + Math.random() * 58;
        setTimeout(showNext, nextDelay);
      }
    }

    setTimeout(showNext, 260);
    return () => {
      idx = text.length;
    };
    // eslint-disable-next-line
  }, [text]);

  return (
    <>
      {keySounds.map((src, i) => (
        <audio ref={audioRefs.current[i]} src={src} preload="auto" key={src} style={{ display: "none" }} />
      ))}
      <span className={className} style={style}>
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="typewriter-char"
            style={{
              animationDelay: `${i * 0.038}s`,
              opacity: i < displayCount ? 1 : 0,
              transition: "opacity 0.22s",
              whiteSpace: "pre",
            }}
          >
            {i < displayCount ? char : ""}
          </span>
        ))}
      </span>
    </>
  );
}
// ----------- FIM: TypewriterText -----------

// Hook para detectar mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () =>
      /android|blackberry|iphone|ipad|ipod|opera mini|iemobile|wpdesktop/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768;
    const onResize = () => setIsMobile(check());
    setIsMobile(check());
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);
  return isMobile;
}

// Modelo principal 3D
function RoomModel() {
  const { scene } = useGLTF("/assets/room.glb");
  return <primitive object={scene} />;
}

// OrbitControls customizado
function ControlledOrbit({ enabled, target, controlsRef, onStart, isMobile }) {
  return (
    <OrbitControls
      ref={controlsRef}
      enabled={enabled}
      target={target}
      enableDamping
      dampingFactor={0.1}
      makeDefault={enabled}
      enablePan={false}
      enableZoom
      enableRotate={false}
      minDistance={isMobile ? 2.0 : 1.2}
      maxDistance={25}
      onStart={onStart}
      mouseButtons={{
        LEFT: undefined,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: undefined,
      }}
      touches={{
        ONE: undefined,
        TWO: THREE.TOUCH.DOLLY_PAN,
      }}
    />
  );
}

// Câmera animada
const cameraViews = {
  loopA: { pos: [30.14, 30.30, -10] },
  loopB: { pos: [10, 30.48, -30.80] },
};
const monitorPosition = [-2.43, 5.14, 3.186];

function AnimatedCamera({ mode, setMode, isMobile, visible }) {
  const { camera } = useThree();
  const timeRef = useRef(0);
  const controlsRef = useRef();

  const handleStart = useCallback(() => {
    if (mode === "loop") setMode("zoom");
  }, [mode, setMode]);

  useFrame((_, delta) => {
    if (!visible || mode !== "loop") return;
    timeRef.current += delta * 0.1;
    const t = 0.5 + 0.5 * Math.sin(timeRef.current);
    const [ax, ay, az] = cameraViews.loopA.pos;
    const [bx, by, bz] = cameraViews.loopB.pos;
    camera.position.set(
      ax + (bx - ax) * t,
      ay + (by - ay) * t,
      az + (bz - az) * t
    );
    camera.lookAt(...monitorPosition);
  });

  useFrame(() => {
    if (!visible) return;
    const dist = camera.position.distanceTo(
      new THREE.Vector3(...monitorPosition)
    );
    if (mode === "zoom" && dist > 22) setMode("loop");
  });

  return (
    <ControlledOrbit
      enabled={visible && mode === "zoom"}
      target={monitorPosition}
      controlsRef={controlsRef}
      onStart={handleStart}
      isMobile={isMobile}
    />
  );
}

export default function Room3D({ visible }) {
  useUnlockAudio();
  const [cameraMode, setCameraMode] = useState("loop");
  const [mode2D, setMode2D] = useState(false);
  const [showTypewriter, setShowTypewriter] = useState(false);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (visible && !mode2D) {
      const timeout = setTimeout(() => setShowTypewriter(true), 1000);
      return () => clearTimeout(timeout);
    }
    setShowTypewriter(false);
  }, [visible, mode2D]);

  useEffect(() => {
    function setZoomMode(event) {
      if (
        event.target.tagName === "IFRAME" ||
        event.target.closest("iframe") ||
        event.target.closest(".r3d-html-content")
      ) {
        return;
      }
      if (cameraMode === "loop") setCameraMode("zoom");
    }
    const iv = setInterval(() => {
      const canvas = document.querySelector("canvas");
      if (canvas) {
        canvas.addEventListener("pointerdown", setZoomMode);
        canvas.addEventListener("wheel", setZoomMode, { passive: true });
        canvas.addEventListener("touchstart", setZoomMode);
        clearInterval(iv);
      }
    }, 100);
    return () => {
      clearInterval(iv);
      const canvas = document.querySelector("canvas");
      if (canvas) {
        canvas.removeEventListener("pointerdown", setZoomMode);
        canvas.removeEventListener("wheel", setZoomMode);
        canvas.removeEventListener("touchstart", setZoomMode);
      }
    };
  }, [cameraMode]);

  const goToMonitor2D = useCallback(() => setMode2D(true), []);
  const handleBackTo3D = useCallback(() => setMode2D(false), []);
  // const goToLoop = useCallback(() => setCameraMode("loop"), []);

  // FULLSCREEN INVISIBLE BUTTON
  const handleFullClick = () => {
    const audio = new window.Audio("/static/audio/sound/button-screen.mp3");
    audio.currentTime = 0;
    audio.volume = 0.96;
    audio.play();
    setTimeout(goToMonitor2D, 110); // delay para animação/som
  };

  return (
    <>
      {!mode2D && (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            background: "#000",
            position: "relative",
            pointerEvents: visible ? "auto" : "none",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s",
          }}
        >
          <Canvas
            camera={{ fov: isMobile ? 45 : 35 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
              pixelRatio: Math.min(
                window.devicePixelRatio,
                isMobile ? 1.5 : 2
              ),
            }}
            dpr={[1, isMobile ? 1.5 : 2]}
          >
            <ambientLight intensity={1.2} />
            <directionalLight position={[10, 10, 10]} />
            <Suspense fallback={null}>
              <RoomModel />
              <Sphere
                args={[0.05, 35, 35]}
                position={[-2.45, 5.416, 3.186]}
              >
                <meshStandardMaterial color="red" />
              </Sphere>
              {/* ComputerScreenFake REMOVIDO */}
              <AnimatedCamera
                mode={cameraMode}
                setMode={setCameraMode}
                isMobile={isMobile}
                visible={visible}
              />
            </Suspense>
          </Canvas>

          {/* BOTÃO FULLSCREEN */}
          <button
            onClick={handleFullClick}
            className="room3d-full-btn"
            tabIndex={-1}
            aria-label="Click to enter monitor view"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100vw",
              height: isMobile ? "calc(100vh - 80px)" : "100vh",
              opacity: 0,
              border: 0,
              background: "transparent",
              cursor: "pointer",
              zIndex: 2005,
            }}
          />

          {/* TYPEWRITER TEXT */}
          {showTypewriter && (
            <div
              style={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: isMobile ? 30 : 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2010,
                pointerEvents: "auto",
              }}
            >
              <TypewriterText
                text="CLICK ANYWHERE TO ENTER"
                style={{
                  fontFamily: "'PressStart2P', monospace",
                  fontSize: isMobile ? 11 : 14,
                  color: "#fff",
                  textShadow: "0 2px 8px #000c, 0 0px 2px rgb(185, 0, 0), 0 0px 2px rgb(255, 255, 255)",
                  background: "rgba(0,0,0,0.7)",
                  borderRadius: 6,
                  padding: isMobile ? "8px 12px" : "11px 25px",
                  letterSpacing: isMobile ? "1.2px" : "1.65px",
                  border: "2px solid #fff",
                  boxShadow: "0 2px 14px #000b",
                  textAlign: "center",
                  cursor: isMobile ? "pointer" : "default",
                  userSelect: "none",
                  animation: "btn-slide-bottom .66s cubic-bezier(.11,.65,.46,1.1)",
                  maxWidth: isMobile ? "90vw" : "auto",
                  wordBreak: isMobile ? "break-word" : "normal",
                  overflowWrap: "break-word",
                }}
                onClick={isMobile ? handleFullClick : undefined}
              />
            </div>
          )}
        </div>
      )}

      {mode2D && <Monitor2D onBack={handleBackTo3D} />}
    </>
  );
}
