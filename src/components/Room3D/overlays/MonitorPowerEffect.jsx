import React, { useEffect, useRef, useState } from "react";

export default function MonitorPowerEffect({ show = "on", onEnd }) {
  const ref = useRef();
  const audioRef = useRef();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.85;
      audio.play().catch(() => {});
    }

    const handleEnd = () => {
      if (onEnd) onEnd();
    };

    el.addEventListener("animationend", handleEnd);
    return () => el.removeEventListener("animationend", handleEnd);
  }, [show, onEnd]);

  const shouldPlayAudio = hasMounted || show === "on";

  return (
    <>
      <style>{`
        .monitor-power-effect {
          position: absolute;
          inset: 0;
          background: black;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          pointer-events: none;
        }

        .monitor-power-effect::before {
          content: "";
          width: 3px;
          height: 3px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 10px white, 0 0 32px white;
          opacity: 0;
          transform: scale(0.2, 0.2);
        }

        .monitor-power-effect.on {
          animation: fadeOut 0.7s ease-out forwards;
        }

        .monitor-power-effect.on::before {
          animation: crtOn 0.7s ease-out forwards;
        }

        .monitor-power-effect.off {
          animation: fadeIn 0.7s ease-in forwards;
        }

        .monitor-power-effect.off::before {
          animation: crtOff 0.7s ease-in forwards;
        }

        @keyframes crtOn {
          0% { opacity: 1; transform: scale(1, 1); }
          40% { transform: scale(15, 0.1); opacity: 1; }
          100% { opacity: 0; transform: scale(100, 0.05); }
        }

        @keyframes crtOff {
          0% { opacity: 0; transform: scale(100, 0.05); }
          40% { opacity: 1; transform: scale(15, 0.1); }
          100% { opacity: 1; transform: scale(0, 0); }
        }

        @keyframes fadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes fadeIn {
          0% { opacity: 0; }
          40% { opacity: 1; }
          100% { opacity: 1; }
        }
      `}</style>

      <div ref={ref} className={`monitor-power-effect ${show}`} />
      
      {/* Só carrega o áudio se for seguro */}
      {shouldPlayAudio && (
        <audio
          ref={audioRef}
          src={
            show === "on"
              ? "/static/audio/atmosphere/tv-on.mp3"
              : "/static/audio/atmosphere/tv-off.mp3"
          }
          preload="auto"
          style={{ display: "none" }}
        />
      )}
    </>
  );
}
