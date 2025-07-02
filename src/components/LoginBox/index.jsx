import React, { useState, useEffect } from "react";
import HackerLoginFieldReveal from "../HackerLoginFieldReveal";
import "./styles.css";

// Componente Matrix Background
const MatrixBackground = () => {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const newColumns = [];
    const numColumns = Math.floor(window.innerWidth / 15);

    for (let i = 0; i < numColumns; i++) {
      const column = {
        id: i,
        left: `${(i / numColumns) * 100}%`,
        animationDelay: `${Math.random() * 6}s`,
        chars: Array.from({ length: 20 }, () => 
          chars[Math.floor(Math.random() * chars.length)]
        ).join('')
      };
      newColumns.push(column);
    }
    
    setColumns(newColumns);
  }, []);

  return (
    <div className="matrix-bg-login">
      {columns.map(column => (
        <div
          key={column.id}
          className="matrix-column-login"
          style={{
            left: column.left,
            animationDelay: column.animationDelay
          }}
        >
          {column.chars}
        </div>
      ))}
    </div>
  );
};

export default function LoginBox({ onDone, audioManager }) { // 🔥 RECEBE AUDIOMANAGER
  const [loginDone, setLoginDone] = useState(false);
  const [passwordStart, setPasswordStart] = useState(false);
  const [passwordDone, setPasswordDone] = useState(false);
  const [showGranted, setShowGranted] = useState(false);
  const [accessingDots, setAccessingDots] = useState(0);
  const [boxGlitch, setBoxGlitch] = useState(false);
  const [loginStarted, setLoginStarted] = useState(false);

  // 🔥 Delay de 2s antes de começar o login
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoginStarted(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Pontos animados só enquanto não foi concedido o acesso
  useEffect(() => {
    if (!showGranted) {
      const interval = setInterval(() => {
        setAccessingDots(dots => (dots + 1) % 4);
      }, 400);
      return () => clearInterval(interval);
    }
  }, [showGranted]);

  // Inicia senha depois do login
  useEffect(() => {
    if (loginDone) {
      // Efeito glitch ao terminar o login
      setBoxGlitch(true);
      setTimeout(() => setBoxGlitch(false), 300);
      setTimeout(() => setPasswordStart(true), 120);
    }
  }, [loginDone]);

  // Quando senha termina, mostra ACCESS GRANTED e fecha depois de 2s
  useEffect(() => {
    if (passwordDone) {
      setShowGranted(true);
      // Efeito glitch no granted
      setBoxGlitch(true);
      setTimeout(() => setBoxGlitch(false), 300);
      
      const timer = setTimeout(() => {
        if (onDone) onDone();
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [passwordDone, onDone]);

  return (
    <div className="login-bg">
      <MatrixBackground />
      <div className={`login-box ${boxGlitch ? 'glitch' : ''}`}>
        <div className={`login-status ${showGranted ? "granted pulse-green" : "accessing"}`}>
          {showGranted
            ? "ACCESS GRANTED"
            : <>ACCESSING
                <span className="accessing-dots">
                  {".".repeat(accessingDots).padEnd(3, " ")}
                </span>
              </>
          }
        </div>
        {/* Campos login/senha aparecem só durante o acesso */}
        {!showGranted && (
          <>
            <div className="login-label">LOGIN</div>
            <div className="login-field">
              {loginStarted && (
                <HackerLoginFieldReveal
                  target="hacker"
                  onFinish={() => setLoginDone(true)}
                  audioManager={audioManager} // 🔥 PASSA AUDIOMANAGER
                />
              )}
            </div>
            <div className="login-label">PASSWORD</div>
            <div className="login-field">
              {passwordStart && (
                <HackerLoginFieldReveal
                  target="********"
                  isPassword
                  onFinish={() => setPasswordDone(true)}
                  audioManager={audioManager} // 🔥 PASSA AUDIOMANAGER
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}