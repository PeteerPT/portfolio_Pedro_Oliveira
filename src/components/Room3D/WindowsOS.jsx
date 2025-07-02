import React from 'react';

export default function WindowsOS() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      pointerEvents: 'auto' // 🎯 GARANTIR INTERAÇÃO
    }}>
      <iframe
        src="https://portfolioweb-ashen-alpha.vercel.app/"
        style={{
          width: '100%',
          height: '170%',
          border: 'none',
          borderRadius: '2px',
          transform: 'scale(4)',
          transformOrigin: 'center',
          imageRendering: 'crisp-edges',
          pointerEvents: 'auto', // 🎯 MOUSE FUNCIONA
          cursor: 'auto' // 🎯 CURSOR NORMAL
        }}
        title="Pedro's Portfolio"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock" // 🎯 POINTER LOCK PARA JOGOS
        allow="fullscreen; pointer-lock" // 🎯 PERMISSÕES EXTRAS
      />
    </div>
  );
}