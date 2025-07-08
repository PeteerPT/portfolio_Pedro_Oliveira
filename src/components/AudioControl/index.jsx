// src/components/AudioControl/index.jsx

import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

export default function AudioControl({ isVisible = false, delay = 0 }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const soundOnRef = useRef();
  const soundOffRef = useRef();

  // Detecta se é mobile
  useEffect(() => {
    const check = () =>
      /android|blackberry|iphone|ipad|ipod|opera mini|iemobile|wpdesktop/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768;
    const onResize = () => setIsMobile(check());
    setIsMobile(check());
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShouldShow(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setShouldShow(false);
    }
  }, [isVisible, delay]);

  // Toggle mute/unmute com som
  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);

    if (newMuted) {
      if (soundOffRef.current) {
        soundOffRef.current.currentTime = 0;
        soundOffRef.current.volume = 0.8;
        soundOffRef.current.play();
      }
    } else {
      if (soundOnRef.current) {
        soundOnRef.current.currentTime = 0;
        soundOnRef.current.volume = 0.7;
        soundOnRef.current.play();
      }
    }

    // Controle global
    if (window.globalAudioManager && window.globalAudioManager.setMuted) {
      window.globalAudioManager.setMuted(newMuted);
    } else {
      window.globalMasterMuted = newMuted;
    }
  };

  useEffect(() => {
    const checkMuteStatus = () => {
      if (window.globalMasterMuted !== isMuted) {
        setIsMuted(window.globalMasterMuted);
      }
    };
    const interval = setInterval(checkMuteStatus, 1000);
    return () => clearInterval(interval);
  }, [isMuted]);

  if (!isVisible) return null;

  // POSIÇÃO + CLASSE ANIMAÇÃO
  let containerStyle = {};
  let animClass = '';
  if (isMobile) {
    containerStyle = {
      position: 'fixed',
      top: 14,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 2025,
      transition: 'opacity .42s cubic-bezier(.11,.71,.62,1.01)',
      padding: 0,
    };
    animClass = shouldShow ? 'audio-slide-down' : '';
  } else {
    containerStyle = {
      position: '',
      top: 1000,
      left: 120,
      zIndex: 2025,
      transition: 'opacity .42s cubic-bezier(.11,.71,.62,1.01)',
      padding: 0,
    };
    animClass = shouldShow ? 'audio-slide-left' : '';
  }

  return (
    <div
      className={`audio-control-container ${shouldShow ? 'visible' : ''} ${animClass}`}
      style={containerStyle}
    >
      <div
        className="audio-control-panel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
          <span style={{ fontFamily: "'PressStart2P', monospace", letterSpacing: 1.1, fontSize: 10 }}>
            {isMuted ? 'MUTED' : 'SOUND ON'}
          </span>
        </button>
        <div className={`audio-waves ${isMuted ? 'muted' : ''}`}
          style={{ marginTop: 5 }}>
          <div className="audio-wave"></div>
          <div className="audio-wave"></div>
          <div className="audio-wave"></div>
          <div className="audio-wave"></div>
        </div>
      </div>
      {/* Sons de mute/unmute reais */}
      <audio ref={soundOnRef} src="/static/audio/sound/soundon.mp3" preload="auto" />
      <audio ref={soundOffRef} src="/static/audio/sound/soundoff.mp3" preload="auto" />
    </div>
  );
}
