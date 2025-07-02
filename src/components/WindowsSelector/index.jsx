import React, { useState, useEffect } from 'react';
import './styles.css';

const WindowsSelector = ({ onSelectOS }) => {
    const [selectedOS, setSelectedOS] = useState('win95');
    const [countdown, setCountdown] = useState(30);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    onSelectOS('win95');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onSelectOS]);

    // 🎯 FUNÇÃO PARA INICIAR O OS SELECIONADO
    const handleStart = () => {
        onSelectOS(selectedOS);
    };

    // 🎯 FUNÇÃO PARA CLICAR EM UMA OPÇÃO E JÁ INICIAR
    const handleOptionClick = (osType) => {
        setSelectedOS(osType);
        // Pequeno delay para mostrar a seleção antes de iniciar
        setTimeout(() => {
            // 🔥 SE FOR SAFE MODE, VAI DIRETO PARA O 3D
            if (osType === 'safe') {
                onSelectOS('room3d'); // 🎯 NOVA OPÇÃO PARA 3D
            } else {
                onSelectOS(osType);
            }
        }, 200);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            // 🔥 SE FOR SAFE MODE, VAI DIRETO PARA O 3D
            if (selectedOS === 'safe') {
                onSelectOS('room3d'); // 🎯 NOVA OPÇÃO PARA 3D
            } else {
                handleStart();
            }
        } else if (e.key === 'ArrowUp') {
            setSelectedOS(selectedOS === 'win95' ? 'safe' : selectedOS === 'dos' ? 'win95' : 'dos');
        } else if (e.key === 'ArrowDown') {
            setSelectedOS(selectedOS === 'win95' ? 'dos' : selectedOS === 'dos' ? 'safe' : 'win95');
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [selectedOS]);

    return (
        <div className="windows-selector">
            <div className="selector-container">
                <div className="selector-header">
                    Advanced Boot Options
                </div>
                
                <div className="selector-text">
                    Choose Advanced Options for: Pedro Portfolio System<br />
                    (Use the arrow keys to highlight your choice, or click to select and start.)
                </div>

                <div className="os-options">
                    <div 
                        className={`os-option ${selectedOS === 'win95' ? 'selected' : ''}`}
                        onClick={() => handleOptionClick('win95')} // 🎯 CLIQUE JÁ INICIA
                    >
                        Start Windows Normally (Pedro Portfolio)
                    </div>
                    
                    <div style={{ margin: '15px 0' }}></div>
                    
                    <div 
                        className={`os-option ${selectedOS === 'safe' ? 'selected' : ''}`}
                        onClick={() => handleOptionClick('safe')} // 🎯 CLIQUE JÁ INICIA - VAI PARA 3D
                    >
                        Safe Mode (3D Environment) {/* 🔥 TEXTO ATUALIZADO */}
                    </div>
                    
                    <div 
                        className={`os-option ${selectedOS === 'dos' ? 'selected' : ''}`}
                        onClick={() => handleOptionClick('dos')} // 🎯 CLIQUE JÁ INICIA
                    >
                        MS-DOS Mode
                    </div>
                </div>

                <div className="selector-tools">
                    Description: Start Pedro's Portfolio with full interactive experience.<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Use Safe Mode to access 3D room environment directly. {/* 🔥 DESCRIÇÃO ATUALIZADA */}
                </div>

                <div className="countdown">
                    Seconds until the highlighted choice will be started automatically: <span className="countdown-number">{countdown}</span>
                </div>

                <button onClick={handleStart} className="enter-button">
                    ENTER=Choose (or click any option above)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ESC=Cancel
                </button>
            </div>
        </div>
    );
};

export default WindowsSelector;