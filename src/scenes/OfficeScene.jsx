import React from 'react';
import '../styles/variables.css';

export default function OfficeScene() {
  return (
    <div 
      className="office-scene"
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#001800',
        color: '#00ff7f',
      }}
    >
      <h1>SISTEMA ATIVO</h1>
      <p>Terminal de administração inicializado</p>
      <p>Acesso autorizado</p>
      <p style={{ marginTop: '30px' }}>© 2023 Sistema Seguro</p>
    </div>
  );
}