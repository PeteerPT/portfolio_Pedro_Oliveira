import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
import HackerLoginFieldReveal from "./HackerLoginFieldReveal";
import HackerRootsOverlay from "./HackerRootsOverlay";

const style = `
.hacker-root-bg {
  position: fixed;
  inset: 0;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  pointer-events: none;
}
.hacker-root-canvas {
  position: fixed;
  inset: 0;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 10;
  pointer-events: none;
  display: block;
  background: #000;
}
.hacker-login-box {
  background: 
    linear-gradient(135deg, rgba(0,0,0,0.98) 0%, rgba(10,10,10,0.99) 50%, rgba(0,0,0,0.98) 100%);
  border: 2px solid transparent;
  background-clip: padding-box;
  position: relative;
  color: #fff;
  padding: 35px 50px;
  font-family: 'Fira Mono', 'Consolas', 'Courier New', monospace;
  border-radius: 12px;
  width: 380px;
  box-shadow: 
    0 0 30px rgba(0, 255, 127, 0.15),
    0 0 60px rgba(0, 255, 127, 0.05),
    inset 0 0 20px rgba(0, 255, 127, 0.02);
  z-index: 30;
  pointer-events: auto;
  animation: hackerBoxEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Borda animada para o hacker box */
.hacker-login-box::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 2px;
  background: linear-gradient(45deg, 
    #00ff7f 0%, 
    #00cc66 25%, 
    #00ff7f 50%, 
    #00cc66 75%, 
    #00ff7f 100%);
  background-size: 400% 400%;
  border-radius: 12px;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: xor;
  -webkit-mask-composite: xor;
  animation: hackerBorderFlow 3s ease-in-out infinite;
  opacity: 0.7;
}

@keyframes hackerBorderFlow {
  0%, 100% { 
    background-position: 0% 50%; 
    opacity: 0.5;
  }
  50% { 
    background-position: 100% 50%; 
    opacity: 1;
  }
}

@keyframes hackerBoxEntrance {
  0% { 
    opacity: 0; 
    transform: scale(0.85) translateY(30px);
    box-shadow: 0 0 0 rgba(0, 255, 127, 0);
  }
  100% { 
    opacity: 1; 
    transform: scale(1) translateY(0);
  }
}

.hacker-login-label {
  font-size: 1.1rem;
  margin-top: 12px;
  margin-bottom: 4px;
  color: #fff;
  font-weight: bold;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}

.hacker-login-label::before {
  content: '> ';
  color: #00ff7f;
  text-shadow: 0 0 8px #00ff7f;
}

.hacker-login-field {
  background: 
    linear-gradient(135deg, #0a0a0a 0%, #151515 50%, #0a0a0a 100%);
  border: 1.5px solid #333;
  font-size: 1.15rem;
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  letter-spacing: 2px;
  min-height: 1.5em;
  display: flex;
  gap: 1px;
  position: relative;
  transition: all 0.3s ease;
}

.hacker-login-field:focus-within {
  border-color: #00ff7f;
  box-shadow: 0 0 15px rgba(0, 255, 127, 0.3);
}

.hacker-login-char {
  display: inline-block;
  min-width: 1ch;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: #fff;
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.2);
}

.hacker-login-char.green {
  color: #00ff7f !important;
  text-shadow: 
    0 0 8px #00ff7f,
    0 0 15px rgba(0, 255, 127, 0.4);
  transform: scale(1.03);
}

@keyframes pulse-green {
  0% { 
    color: #fff; 
    transform: scale(1);
    text-shadow: 0 0 3px rgba(255, 255, 255, 0.2);
  }
  40% { 
    color: #00ff7f; 
    transform: scale(1.13);
    text-shadow: 
      0 0 15px #00ff7f,
      0 0 25px rgba(0, 255, 127, 0.6);
  }
  100% { 
    color: #00ff7f; 
    transform: scale(1.03);
    text-shadow: 
      0 0 8px #00ff7f,
      0 0 15px rgba(0, 255, 127, 0.4);
  }
}

.pulse-green {
  animation: pulse-green 0.17s cubic-bezier(.8,-0.5,.2,1.5) 1;
  color: #00ff7f !important;
  text-shadow: 
    0 0 16px #00ff7f, 
    0 0 8px #00ff7f;
}

.access-granted {
  color: #00ff7f;
  font-weight: bold;
  font-size: 1.4rem;
  text-align: center;
  letter-spacing: 3px;
  margin-bottom: 15px;
  text-transform: uppercase;
  text-shadow:
    0 0 25px #00ff7f,
    0 0 50px rgba(0, 255, 127, 0.6),
    0 0 10px #00ff7f,
    0 0 2px #fff;
  transition: all 0.3s ease;
  opacity: 0.95;
  animation: grantedGlow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes grantedGlow {
  0% { 
    transform: scale(1);
    text-shadow: 0 0 10px #00ff7f;
  }
  50% { 
    transform: scale(1.15);
    text-shadow: 
      0 0 35px #00ff7f,
      0 0 70px rgba(0, 255, 127, 0.8),
      0 0 15px #fff;
  }
  100% { 
    transform: scale(1);
    text-shadow:
      0 0 25px #00ff7f,
      0 0 50px rgba(0, 255, 127, 0.6),
      0 0 10px #00ff7f,
      0 0 2px #fff;
  }
}

.access-granted.glow {
  text-shadow:
    0 0 32px #00ff7f,
    0 0 64px rgba(0, 255, 127, 0.8),
    0 0 15px #00ff7f,
    0 0 5px #fff;
  filter: brightness(1.2);
}

.accessing {
  color: #00ff7f;
  font-weight: bold;
  font-size: 1.3rem;
  text-align: center;
  margin-bottom: 15px;
  letter-spacing: 2.5px;
  opacity: 0.95;
  text-transform: uppercase;
  text-shadow:
    0 0 20px #00ff7f,
    0 0 40px rgba(0, 255, 127, 0.4),
    0 0 8px #00ff7f;
  min-height: 2em;
  font-family: 'Fira Mono', 'Consolas', 'Courier New', monospace;
  animation: accessingPulse 2s ease-in-out infinite;
}

@keyframes accessingPulse {
  0%, 100% { 
    text-shadow:
      0 0 20px #00ff7f,
      0 0 40px rgba(0, 255, 127, 0.4),
      0 0 8px #00ff7f;
  }
  50% { 
    text-shadow:
      0 0 25px #00ff7f,
      0 0 50px rgba(0, 255, 127, 0.6),
      0 0 12px #00ff7f;
  }
}

.accessing-dots {
  display: inline-block;
  min-width: 2em;
  margin-left: 2px;
  letter-spacing: 2px;
  font-family: 'Fira Mono', 'Consolas', 'Courier New', monospace;
}
`;

function HackerLoginBox({ onDone, boxRef }) {
  const [loginDone, setLoginDone] = useState(false);
  const [passwordStart, setPasswordStart] = useState(false);
  const [passwordDone, setPasswordDone] = useState(false);
  const [status, setStatus] = useState("accessing");
  const [dots, setDots] = useState(0);

  const handleLoginFinish = useCallback(() => {
    console.log('🔐 HackerLoginBox: Login terminado');
    setLoginDone(true);
  }, []);
  
  const handlePasswordFinish = useCallback(() => {
    console.log('🔐 HackerLoginBox: Password terminado');
    setPasswordDone(true);
  }, []);

  // 🔥 REMOVIDO CONTROLE DE ÁUDIO - AGORA É SÓ UI!
  // O App.jsx agora controla tudo

  // Pontos animados — "ACCESSING"
  useEffect(() => {
    if (status === "accessing") {
      const interval = setInterval(() => {
        setDots(d => (d + 1) % 4);
      }, 360);
      return () => clearInterval(interval);
    }
  }, [status]);

  // Iniciar senha após login terminar
  useEffect(() => {
    if (loginDone && !passwordStart) {
      console.log('🔐 HackerLoginBox: Iniciando password após delay');
      setTimeout(() => setPasswordStart(true), 120);
    }
  }, [loginDone, passwordStart]);

  // Delay de 2s antes de começar o login
  useEffect(() => {
    console.log('🔐 HackerLoginBox: Agendando início do login em 2s');
    const timer = setTimeout(() => {
      console.log('🔐 HackerLoginBox: Login pode começar agora');
      // O login vai começar automaticamente após 2s
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // 🔥 QUANDO SENHA TERMINA - SÓ UI, SEM ÁUDIO
  useEffect(() => {
    if (passwordDone && status === "accessing") {
      console.log('🔐 HackerLoginBox: Mostrando ACCESS GRANTED');
      setStatus("granted-pulse");
      
      // Chama onDone imediatamente - O App.jsx vai controlar o áudio
      if (onDone) onDone();
    }
  }, [passwordDone, status, onDone]);

  return (
    <div className="hacker-root-bg">
      <style>{style}</style>
      <div className="hacker-login-box" ref={boxRef}>
        {/* Status do topo */}
        {status === "accessing" && (
          <div className="accessing">
            ACCESSING
            <span className="accessing-dots">
              {".".repeat(dots).padEnd(3, " ")}
            </span>
          </div>
        )}
        {status === "granted-pulse" && (
          <div className="access-granted pulse-green">ACCESS GRANTED</div>
        )}
        {/* Os campos SEMPRE ficam montados */}
        <div className="hacker-login-label">LOGIN</div>
        <div className="hacker-login-field">
          <HackerLoginFieldReveal
            target="hacker"
            onFinish={handleLoginFinish}
          />
        </div>
        <div className="hacker-login-label">PASSWORD</div>
        <div className="hacker-login-field">
          {passwordStart && (
            <HackerLoginFieldReveal
              target="********"
              isPassword
              onFinish={handlePasswordFinish}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function Index({ onFinish }) {
  const loginRef = useRef();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [rootsPulse, setRootsPulse] = useState(false);
  const [loginBoxRect, setLoginBoxRect] = useState(null);

  useEffect(() => {
    console.log('🔐 HackerLoginDemo: Componente montado');
    
    if (!document.getElementById("hacker-root-style")) {
      const styleTag = document.createElement("style");
      styleTag.id = "hacker-root-style";
      styleTag.innerHTML = style;
      document.head.appendChild(styleTag);
    }
  }, []);

  useLayoutEffect(() => {
    if (loginRef.current) {
      setTimeout(() => {
        const rect = loginRef.current.getBoundingClientRect();
        setLoginBoxRect({
          x: rect.left,
          y: rect.top,
          w: rect.width,
          h: rect.height
        });
      }, 40);
    }
  }, [loginRef]);

  // 🔥 APENAS UI - MANTÉM OVERLAY POR 2s
  const handleLoginDone = useCallback(() => {
    console.log('🔐 HackerLoginDemo: Login feito, mostrando overlay');
    setIsAuthorized(true);
    setRootsPulse(true);
    setTimeout(() => setRootsPulse(false), 350);
    
    setTimeout(() => {
      console.log('🔐 HackerLoginDemo: Overlay terminado, chamando onFinish');
      setIsAuthorized(false);
      if (onFinish) onFinish();
    }, 2000);
  }, [onFinish]);

  return (
    <>
      <HackerRootsOverlay
        duration={3000}
        loginBoxRect={loginBoxRect}
        isAuthorized={isAuthorized}
        rootsPulse={rootsPulse}
      />
      <HackerLoginBox
        onDone={handleLoginDone}
        boxRef={loginRef}
      />
    </>
  );
}