import React, { useState, useEffect } from "react";
import "./styles.css";

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

export default function LoadingScreen({ onFinish }) {
    const [displayText, setDisplayText] = useState('');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [currentFile, setCurrentFile] = useState('');
    const [glitchText, setGlitchText] = useState('');
    const [showSecurityPrompt, setShowSecurityPrompt] = useState(false); // 🎯 NOVO STATE
    const [loadingComplete, setLoadingComplete] = useState(false); // 🎯 NOVO STATE

    const getTime = () => {
        const date = new Date();
        const h = date.getHours();
        const m = date.getMinutes();
        const s = date.getSeconds();
        const ms = date.getMilliseconds();
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
    };

    const filesList = [
        'C:\\WINDOWS\\system32\\pedro_portfolio.exe',
        'C:\\WINDOWS\\system32\\military_experience.dll',
        'C:\\WINDOWS\\system32\\react_components.sys',
        'C:\\WINDOWS\\system32\\threejs_engine.exe',
        'C:\\WINDOWS\\system32\\security_protocols.dll',
        'C:\\Users\\Pedro\\Documents\\leadership_skills.dat',
        'C:\\Program Files\\Portfolio\\interactive_3d.exe',
        'C:\\WINDOWS\\system32\\hacker_mode.sys',
        'C:\\Users\\Pedro\\AppData\\encrypted_data.bin',
        'C:\\WINDOWS\\system32\\portfolio_loader.exe',
        'C:\\WINDOWS\\system32\\webgl_shaders.dll',
        'C:\\Program Files\\Pedro\\contact_form.exe',
        'C:\\WINDOWS\\system32\\animation_engine.sys',
        'C:\\Users\\Pedro\\Desktop\\projects_database.db',
        'C:\\WINDOWS\\system32\\css3_transformer.dll',
        'C:\\Program Files\\Portfolio\\3d_models.pak',
        'C:\\WINDOWS\\system32\\user_interface.exe',
        'C:\\Users\\Pedro\\Documents\\certifications.enc',
        'C:\\WINDOWS\\system32\\responsive_design.dll',
        'C:\\Program Files\\Pedro\\portfolio_assets.pak',
        'C:\\WINDOWS\\system32\\texture_loader.dll',
        'C:\\Users\\Pedro\\AppData\\skills_matrix.bin',
        'C:\\Program Files\\Portfolio\\mesh_renderer.exe',
        'C:\\WINDOWS\\system32\\lighting_engine.sys',
        'C:\\Users\\Pedro\\Documents\\career_timeline.json'
    ];

    const fullHackerText = `PEDRO-OS SECURE BOOT SEQUENCE INITIATED...

===============================================
[${getTime()}] Starting kernel initialization... OK
[${getTime()}] Loading encrypted boot sectors... OK
[${getTime()}] Mounting secure filesystem... OK

ACCESSING MILITARY-GRADE SECURITY PROTOCOLS...
===============================================
[CLASSIFIED] Establishing connection to PEDRO-SERVER:8080...
[CLASSIFIED] Authentication: MILITARY_CLEARANCE_LEVEL_5
[CLASSIFIED] RSA-4096 encryption key validated

INJECTING PORTFOLIO PAYLOAD...
===============================================
EXPLOIT: Buffer overflow in explorer.exe... SUCCESS
PAYLOAD: Injecting React.js Framework v18.2.0... SUCCESS
PAYLOAD: Loading Three.js WebGL Engine v0.154... SUCCESS
PAYLOAD: Deploying Military Experience Module... SUCCESS
PAYLOAD: Installing Leadership Skills Database... SUCCESS

EXECUTING PENETRATION TESTING SUITE...
===============================================
[VULNERABILITY_SCAN] Target: localhost:3000
[SQL_INJECTION] Testing database endpoints... SECURE ✓
[XSS_PROTECTION] Validating React components... SECURE ✓
[BUFFER_OVERFLOW] Testing Three.js memory... SECURE ✓

LOADING PEDRO'S DIGITAL ARSENAL...
===============================================
[WEAPON_SYSTEM] React Component Library... LOADED ✓
[WEAPON_SYSTEM] Three.js Animation Engine... LOADED ✓
[WEAPON_SYSTEM] Portfolio Database... LOADED ✓
[WEAPON_SYSTEM] Military Experience Data... LOADED ✓

FINAL SYSTEM COMPROMISE...
===============================================
[${getTime()}] Disabling Windows Defender... SUCCESS
[${getTime()}] Bypassing UAC controls... SUCCESS
[${getTime()}] Installing rootkit persistence... SUCCESS

MISSION ACCOMPLISHED
===============================================
[${getTime()}] INFILTRATION STATUS: 100% COMPLETE
[${getTime()}] TARGET COMPROMISED: PEDRO'S PORTFOLIO
[${getTime()}] ACCESS LEVEL: FULL ADMINISTRATIVE

Welcome to Pedro's Secured Digital Environment
Launching interactive portfolio interface...

SYSTEM READY FOR DEPLOYMENT`;

    // 🎯 FUNÇÃO PARA PROCEDER APÓS SECURITY
    const handleSecurityProceed = () => {
        onFinish();
    };

    // Efeito de glitch nos textos
    useEffect(() => {
        const glitchInterval = setInterval(() => {
            const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?~`';
            const randomGlitch = Array.from({length: 30}, () => 
                glitchChars[Math.floor(Math.random() * glitchChars.length)]
            ).join('');
            setGlitchText(randomGlitch);
        }, 100);

        return () => clearInterval(glitchInterval);
    }, []);

    useEffect(() => {
        const typewriterEffect = async () => {
            setDisplayText('');
            setLoadingProgress(0);
            setCurrentFile('Initializing boot sequence...');
            
            let currentText = '';
            const textLength = fullHackerText.length;
            const batchSize = 10;
            
            for (let i = 0; i < textLength; i++) {
                currentText += fullHackerText[i];
                
                if (i % batchSize === 0 || i === textLength - 1) {
                    const progress = ((i + 1) / textLength) * 100;
                    const fileIndex = Math.floor(progress / 4) % filesList.length;
                    
                    setDisplayText(currentText);
                    setLoadingProgress(progress);
                    setCurrentFile(filesList[fileIndex]);
                    
                    await delay(1);
                }
                
                let speed = 0.2;
                if (fullHackerText[i] === '\n') {
                    speed = 0.2;
                } else if (fullHackerText[i] === '.') {
                    speed = 0.5;
                } else if (fullHackerText[i] === ' ') {
                    speed = 0.1;
                }
                
                await delay(speed);
            }
            
            // 🎯 FINALIZAR E MOSTRAR SECURITY PROMPT
            setLoadingProgress(100);
            setCurrentFile('Boot sequence complete. Awaiting security clearance...');
            setLoadingComplete(true);
            await delay(1000); // Pequena pausa
            setShowSecurityPrompt(true); // 🎯 MOSTRAR SECURITY
        };
        
        typewriterEffect();
    }, []);

    return (
        <div className="hacker-loading-screen">
            {/* Conteúdo principal (fica desfocado quando security aparece) */}
            <div className={`loading-content ${showSecurityPrompt ? 'blurred' : ''}`}>
                {/* Efeito Matrix de fundo */}
                <div className="matrix-bg">
                    {Array.from({length: 60}).map((_, i) => (
                        <div key={i} className="matrix-column" style={{
                            left: `${i * 1.5}%`,
                            animationDelay: `${Math.random() * 8}s`,
                            animationDuration: `${6 + Math.random() * 4}s`
                        }}>
                            {glitchText}
                        </div>
                    ))}
                </div>

                {/* Console principal */}
                <div className="hacker-console">
                    <div className="console-header">
                        <span className="console-title">PEDRO-OS TERMINAL [INFILTRATION MODE]</span>
                        <span className="console-status">STATUS: COMPROMISING SYSTEM...</span>
                    </div>
                    
                    <div className="console-content">
                        <pre className="hacker-text">
                            {displayText}
                            <span className="cursor">█</span>
                        </pre>
                    </div>
                </div>

                {/* Barra de carregamento inferior */}
                <div className="loading-bottom-section">
                    <div className="loading-info">
                        <div className="loading-label">Loading files...</div>
                        <div className="current-file">{currentFile}</div>
                    </div>
                    
                    <div className="progress-container">
                        <div className="progress-bar-wrapper">
                            <div className="progress-bar-bg">
                                <div 
                                    className="progress-bar-fill" 
                                    style={{ width: `${loadingProgress}%` }}
                                />
                            </div>
                        </div>
                        <div className="progress-text">
                            <span>{Math.round(loadingProgress)}% Complete</span>
                        </div>
                    </div>
                </div>

                {/* Efeitos de scan */}
                <div className="scan-line"></div>
                <div className="glitch-overlay"></div>
            </div>

            {/* 🎯 SECURITY PROMPT - Aparece por cima */}
            {showSecurityPrompt && (
                <div className="security-overlay">
                    <div className="security-prompt">
                        <div className="security-icon">⚠️</div>
                        <h2>SECURITY CLEARANCE REQUIRED</h2>
                        <p>You are about to access classified portfolio data.</p>
                        <p>This system contains confidential information about Pedro's professional experience.</p>
                        <button onClick={handleSecurityProceed} className="security-button">
                            GRANT ACCESS
                        </button>
                        <div className="security-footer">
                            <small>CLASSIFIED • LEVEL 5 CLEARANCE • PEDRO-OS v2.1</small>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}