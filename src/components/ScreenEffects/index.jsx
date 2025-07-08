// src/components/ScreenEffects/index.jsx
import React, { useEffect, useState } from 'react';
import './ScreenEffects.css';

export default function ScreenEffects({ 
  intensity = 1.0,
  enableStatic = true,
  enableSmudges = true,
  enableReflection = true,
  enableDust = true,
  enableScanlines = true,
  enableVignette = true 
}) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const animate = () => {
      setTime(Date.now() * 0.001);
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <div className="screen-effects-container" style={{ opacity: intensity }}>
      {/* 🔥 STATIC LAYER */}
      {enableStatic && (
        <div className="static-layer">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="static-video"
            style={{
              transform: `translate(${Math.sin(time * 10) * 2}px, ${Math.cos(time * 15) * 2}px)`
            }}
          >
            <source src="/static/video/static-texture-layer.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      {/* 🔥 SMUDGES LAYER */}
      {enableSmudges && (
        <div 
          className="smudges-layer"
          style={{
            backgroundImage: 'url(/static/textures/monitor/png/smudges.png)'
          }}
        />
      )}

      {/* 🔥 DUST LAYER */}
      {enableDust && (
        <div 
          className="dust-layer"
          style={{
            backgroundImage: 'url(/static/textures/monitor/png/dust.png)'
          }}
        />
      )}

      {/* 🔥 REFLECTION LAYER */}
      {enableReflection && (
        <div 
          className="reflection-layer"
          style={{
            backgroundImage: 'url(/static/textures/monitor/png/reflection.png)',
            transform: `translate(${Math.sin(time * 2) * 3}px, ${Math.cos(time * 3) * 3}px)`
          }}
        />
      )}

      {/* 🔥 SCANLINES */}
      {enableScanlines && <div className="scanlines-layer" />}

      {/* 🔥 VIGNETTE */}
      {enableVignette && <div className="vignette-layer" />}
    </div>
  );
}