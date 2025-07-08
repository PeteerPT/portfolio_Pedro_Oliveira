import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

export default function AudioControl({ isVisible = false, delay = 0 }) {
  const [isMuted, setIsMuted] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const soundOnRef = useRef();
  const soundOffRef = useRef();

  // Detecta mobile
  useEffect(() => {
    const check = () =>
      /android|blackberry|iphone|ipad|ipod|opera mini|iemobile|wpdesktop/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768;
    const onResize = () => setIsMobile(check());
    setIsMobile(check());
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShouldShow(true), delay);
      return () => clearTimeout(timer);
    } else {
      setShouldShow(false);
    }
  }, [isVisible, delay]);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    const sound = newMuted ? soundOffRef.current : soundOnRef.current;
    if (sound) {
      sound.currentTime = 0;
      sound.volume = 0.8;
      sound.play();
    }

    if (window.globalAudioManager?.setMuted) {
      window.globalAudioManager.setMuted(newMuted);
    } else {
      window.globalMasterMuted = newMuted;
    }
  };

  useEffect(() => {
    const syncMute = () => {
      if (window.globalMasterMuted !== isMuted) {
        setIsMuted(window.globalMasterMuted);
      }
    };
    const interval = setInterval(syncMute, 1000);
    return () => clearInterval(interval);
  }, [isMuted]);

  if (!isVisible) return null;

  // Estilo corrigido
  const containerStyle = isMobile
    ? {
        position: 'fixed',
        top: 14,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2025,
      }
    : {
        position: 'fixed',
        bottom: 0,
        top: '91%',
        left: '5%',
        zIndex: 2025,
      };

  const animClass = shouldShow
    ? isMobile
      ? 'audio-slide-down'
      : 'audio-slide-left'
    : '';

  return (
    <div
      className={`audio-control-container ${shouldShow ? 'visible' : ''} ${animClass}`}
      style={containerStyle}
    >
      <div
        className="audio-control-panel"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <button
          onClick={toggleMute}
          className={`audio-button ${isMuted ? 'muted' : ''}`}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          style={{
            minWidth: 78,
            padding: '6px 14px 6px 12px',
            fontSize: 13,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <img
            src={isMuted ? '/static/textures/UI/audioOff.ico' : '/static/textures/UI/audioOn.ico'}
            alt={isMuted ? 'Audio Off' : 'Audio On'}
            className="audio-icon"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = isMuted ? '🔇' : '🔊';
            }}
            style={{ width: 18, height: 18, marginRight: 5 }}
          />
          <span
            style={{
              fontFamily: "'PressStart2P', monospace",
              letterSpacing: 1.1,
              fontSize: 10,
            }}
          >
            {isMuted ? 'MUTED' : 'SOUND ON'}
          </span>
        </button>
        <div className={`audio-waves ${isMuted ? 'muted' : ''}`} style={{ marginTop: 5 }}>
          <div className="audio-wave"></div>
          <div className="audio-wave"></div>
          <div className="audio-wave"></div>
          <div className="audio-wave"></div>
        </div>
      </div>

      {/* Áudios de feedback */}
      <audio ref={soundOnRef} src="/static/audio/sound/soundon.mp3" preload="auto" />
      <audio ref={soundOffRef} src="/static/audio/sound/soundoff.mp3" preload="auto" />
    </div>
  );
}
