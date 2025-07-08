import React, { useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";
import HackerLoginDemo from "./components/HackerLoginDemo";
import Room3D from "./components/Room3D";
import WindowsSelector from "./components/WindowsSelector";
import AudioControl from "./components/AudioControl";
import { ThemeProvider } from "styled-components";
import theme from "./theme";
import "./style.css";
import * as THREE from 'three';
import AudioManager from './Audio/AudioManager.js';

function Application() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <div>
        <h1>🚀 Pedro's Portfolio</h1>
        <p>Application Component - Portfolio do Pedro vai aqui!</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '10px 20px',
            background: '#fff',
            color: '#333',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Reiniciar Demo
        </button>
      </div>
    </div>
  );
}

function SafeModeTransition({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const messages = [
    "🔒 SAFE MODE ACTIVATED",
    "Bypassing security protocols...",
    "Loading 3D environment...",
    "Initializing WebGL renderer...",
    "Loading room assets...",
    "Preparing camera systems...",
    "Safe mode boot complete ✓"
  ];
  useEffect(() => {
    const totalDuration = 3000;
    const interval = 50;
    const increment = 100 / (totalDuration / interval);

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 500);
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    const messageTimer = setInterval(() => {
      setCurrentMessage(prev => {
        if (prev < messages.length - 1) {
          return prev + 1;
        }
        clearInterval(messageTimer);
        return prev;
      });
    }, 400);

    return () => {
      clearInterval(timer);
      clearInterval(messageTimer);
    };
  }, [onFinish]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000080',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'monospace',
      fontSize: '18px',
      zIndex: 10000
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <div style={{ 
          marginBottom: '30px', 
          fontSize: '24px',
          fontWeight: 'bold',
          minHeight: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {messages[currentMessage]}
        </div>
        <div style={{ 
          marginBottom: '30px', 
          fontSize: '14px',
          opacity: 0.7,
          textAlign: 'left',
          minHeight: '140px'
        }}>
          {messages.slice(0, currentMessage).map((msg, index) => (
            <div key={index} style={{ marginBottom: '5px' }}>
              {`> ${msg}`}
            </div>
          ))}
        </div>
        <div style={{
          width: '100%',
          height: '20px',
          background: '#000040',
          border: '2px solid #c0c0c0',
          marginBottom: '20px',
          position: 'relative'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: progress < 100 ? '#00ff00' : '#ffff00',
            transition: 'width 0.1s ease'
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '12px'
          }}>
            {Math.round(progress)}%
          </div>
        </div>
        <div style={{ 
          fontSize: '12px', 
          opacity: 0.6,
          fontStyle: 'italic'
        }}>
          Safe Mode: Direct access to 3D environment
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [selectedOS, setSelectedOS] = useState('');
  const [audioReady, setAudioReady] = useState(false);
  const [loginStarted, setLoginStarted] = useState(false);

  useEffect(() => {
    const initAudio = async () => {
      try {
        const audioScene = new THREE.Scene();
        const manager = new AudioManager(audioScene, {});
        window.globalAudioManager = manager;
        setAudioReady(true);
      } catch (error) {
        console.error('❌ App: Erro ao inicializar áudio:', error);
      }
    };
    initAudio();
  }, []);

  const handleOSSelection = (osType) => {
    setSelectedOS(osType);
    if (osType === 'win95' || osType === 'dos') {
      document.dispatchEvent(new CustomEvent('audioLoadingStart'));
      setStep(1);
    } else if (osType === 'room3d') {
      document.dispatchEvent(new CustomEvent('audio3DStart'));
      setStep(5);
    }
  };

  const handleLoadingFinish = () => {
    document.dispatchEvent(new CustomEvent('audioLoginTransition'));
    document.dispatchEvent(new CustomEvent('loginModeStart'));
    setLoginStarted(true);
    setStep(2);
  };

  const handleLoginFinish = () => {
    document.dispatchEvent(new CustomEvent('loginModeEnd'));
    document.dispatchEvent(new CustomEvent('audioAuthorized'));
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('audio3DStart'));
      setStep(3);
    }, 1000);
  };

  const handleSafeModeFinish = () => {
    setStep(3);
  };

  useEffect(() => {
    if (step !== 2 && loginStarted) {
      document.dispatchEvent(new CustomEvent('loginModeEnd'));
      setLoginStarted(false);
    }
  }, [step, loginStarted]);

  return (
    <ThemeProvider theme={theme}>
      <div className="crt-scanlines" />
      <div className="crt-vignette" />
      <div className="crt-flicker" />

      {/* Room3D é sempre montado, só aparece/interage no step 3 */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 20,
          pointerEvents: step === 3 ? "auto" : "none",
          opacity: step === 3 ? 1 : 0,
          transition: "opacity 0.5s"
        }}
      >
        <Room3D visible={step === 3} />
      </div>

      {/* PASSO 0: SELETOR DO WINDOWS */}
      {step === 0 && (
        <WindowsSelector onSelectOS={handleOSSelection} />
      )}
      {/* PASSO 1: LOADING */}
      {step === 1 && (
        <LoadingScreen onFinish={handleLoadingFinish} />
      )}
      {/* PASSO 2: HACKER LOGIN */}
      {step === 2 && (
        <HackerLoginDemo onFinish={handleLoginFinish} />
      )}
      {/* PASSO 4: APPLICATION */}
      {step === 4 && (
        <Application />
      )}
      {/* PASSO 5: SAFE MODE */}
      {step === 5 && (
        <SafeModeTransition onFinish={handleSafeModeFinish} />
      )}
      {/* 🎵 CONTROLE DE ÁUDIO - SÓ APARECE NO 3D COM DELAY */}
      <AudioControl isVisible={step === 3} delay={2500} />
    </ThemeProvider>
  );
}