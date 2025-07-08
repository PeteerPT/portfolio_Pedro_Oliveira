// HackerLoginFieldReveal.jsx - VERSÃO FINAL OTIMIZADA
import React, { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export default function HackerLoginFieldReveal({
  target,
  isPassword = false,
  onFinish
}) {
  const [display, setDisplay] = useState(Array(target.length).fill(""));
  const [green, setGreen] = useState(Array(target.length).fill(false));
  const [pulse, setPulse] = useState(Array(target.length).fill(false));
  const intervals = useRef([]);
  const finished = useRef(false);

  // 🔥 FUNÇÃO PARA TOCAR SOM SINCRONIZADO - SEM LOGS
  const playKeySound = (letterIndex, foundLetter) => {
    try {
      // 🔥 TOCA SOM APENAS QUANDO ENCONTRA A LETRA CERTA
      const event = new CustomEvent('hackerLoginKey', {
        detail: {
          volume: 0.4 + Math.random() * 0.3, // Volume entre 0.4 e 0.7
          pitch: Math.random() * 6 - 3, // Pitch variado
          randDetuneScale: 0.3,
          letterIndex: letterIndex,
          foundLetter: foundLetter,
          isPassword: isPassword,
        }
      });
      document.dispatchEvent(event);
    } catch (error) {
      // Silent fail
    }
  };

  useEffect(() => {
    // Reset states
    setDisplay(Array(target.length).fill(""));
    setGreen(Array(target.length).fill(false));
    setPulse(Array(target.length).fill(false));
    intervals.current.forEach(clearInterval);
    finished.current = false;

    function spinLetter(letterIndex) {
      if (finished.current) {
        return;
      }
      
      let attempts = 0;
      const targetLetter = target[letterIndex];
      
      intervals.current[letterIndex] = setInterval(() => {
        if (finished.current) {
          clearInterval(intervals.current[letterIndex]);
          return;
        }
        
        // Gera letra aleatória
        const randomLetter = CHARS[Math.floor(Math.random() * CHARS.length)];
        
        setDisplay(prev =>
          prev.map((c, idx) =>
            idx === letterIndex ? randomLetter : prev[idx]
          )
        );
        
        attempts++;
        
        // 🔥 TIMING ULTRA-RÁPIDO PARA HACKER
        const maxAttempts = isPassword ? 
          2 + Math.floor(Math.random() * 3) :  // Password: 2-4 tentativas (bem rápido)
          2 + Math.floor(Math.random() * 2);   // Username: 2-3 tentativas (super rápido)
        
        if (attempts >= maxAttempts) {
          // Para o interval
          clearInterval(intervals.current[letterIndex]);
          
          // 🔥 TOCA SOM EXATAMENTE QUANDO ENCONTRA A LETRA
          playKeySound(letterIndex, targetLetter);
          
          // Mostra a letra encontrada
          setDisplay(prev =>
            prev.map((c, idx) =>
              idx === letterIndex ? (isPassword ? "*" : targetLetter) : prev[idx]
            )
          );
          
          // Marca como verde
          setGreen(prev =>
            prev.map((g, idx) => (idx === letterIndex ? true : g))
          );
          
          // Efeito de pulse
          setPulse(prev =>
            prev.map((p, idx) => (idx === letterIndex ? true : p))
          );
          
          // Remove pulse e continua para próxima letra
          setTimeout(() => {
            setPulse(prev =>
              prev.map((p, idx) => (idx === letterIndex ? false : p))
            );
            
            if (letterIndex + 1 < target.length) {
              spinLetter(letterIndex + 1);
            } else {
              finished.current = true;
              if (onFinish) {
                setTimeout(() => onFinish(), 150); // Delay menor antes de finalizar
              }
            }
          }, 120); // Delay menor entre letras para ser mais rápido
        }
      }, 12); // 🔥 TIMING ULTRA-RÁPIDO: 12ms (era 25ms)
    }

    // Inicia com a primeira letra
    if (target.length > 0) {
      spinLetter(0);
    }

    // Cleanup
    return () => {
      finished.current = true;
      intervals.current.forEach(clearInterval);
    };
  }, [target, isPassword, onFinish]);

  return (
    <span>
      {display.map((c, i) => (
        <span
          key={i}
          className={
            "hacker-login-char" +
            (green[i] ? " green" : "") +
            (pulse[i] ? " pulse-green" : "")
          }
        >
          {c}
        </span>
      ))}
    </span>
  );
}