import React, { useState, useEffect } from 'react';
import './styles.css';

export default function AudioControl({ isVisible = false, delay = 0 }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  // 🎯 Controle de visibilidade com delay gradual
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

  // 🔇 Toggle mute simples
  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    
    console.log(`🎚️ Audio: ${newMuted ? 'MUTED' : 'UNMUTED'}`);
    
    if (window.globalAudioManager && window.globalAudioManager.setMuted) {
      window.globalAudioManager.setMuted(newMuted);
    } else {
      // Fallback se AudioManager não estiver pronto
      window.globalMasterMuted = newMuted;
    }
  };

  // Escuta mudanças globais
  useEffect(() => {
    const checkMuteStatus = () => {
      if (window.globalMasterMuted !== isMuted) {
        setIsMuted(window.globalMasterMuted);
      }
    };
    
    const interval = setInterval(checkMuteStatus, 1000);
    return () => clearInterval(interval);
  }, [isMuted]);

  // 🚫 Não renderizar se não deve aparecer
  if (!isVisible) return null;

  return (
    <div className={`audio-control-container ${shouldShow ? 'visible' : ''}`}>
      <div 
        className="audio-control-panel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button 
          onClick={toggleMute}
          className={`audio-button ${isMuted ? 'muted' : ''}`}
          /* REMOVIDO: title attribute */
        >
          <img 
            src={isMuted ? '/static/textures/UI/audioOff.ico' : '/static/textures/UI/audioOn.ico'} 
            alt={isMuted ? 'Audio Off' : 'Audio On'}
            className="audio-icon"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = isMuted ? '🔇' : '🔊';
            }}
          />
        </button>
        
        <div className={`audio-status ${isMuted ? 'muted' : ''}`}>
          {isMuted ? 'Silencioso' : 'Ambiente'}
        </div>
        
        {/* 🎵 Ondas visuais */}
        <div className={`audio-waves ${isMuted ? 'muted' : ''}`}>
          <div className="audio-wave"></div>
          <div className="audio-wave"></div>
          <div className="audio-wave"></div>
          <div className="audio-wave"></div>
        </div>
      </div>
    </div>
  );
}