import * as THREE from 'three';

export class AudioSource {
    constructor(manager) {
        this.manager = manager;
    }

    update() {}
}

export class ComputerAudio extends AudioSource {
    constructor(manager) {
        super(manager);
        this.lastKey = '';
        this.isInLoginMode = false;

        document.addEventListener('loginModeStart', () => {
            this.isInLoginMode = true;
        });

        document.addEventListener('loginModeEnd', () => {
            this.isInLoginMode = false;
        });

        // EVENT LISTENER DE LOGIN HACKER
        document.addEventListener('hackerLoginKey', (event) => {
            if (!this.isInLoginMode) {
                return;
            }
            
            try {
                const details = event.detail || {};
                
                this.manager.playAudio('key', {
                    volume: 0.6 + Math.random() * 0.3,
                    randDetuneScale: 0.6,
                    pitch: (Math.random() * 8 - 4),
                });
                
                setTimeout(() => {
                    if (this.isInLoginMode && Math.random() < 0.4) {
                        this.manager.playAudio('key', {
                            volume: 0.3 + Math.random() * 0.2,
                            randDetuneScale: 0.8,
                            pitch: (Math.random() * 6 - 3),
                        });
                    }
                }, 30 + Math.random() * 50);
                
            } catch (error) {
                // Silent fail
            }
        });

        // 🔥 EVENTOS GLOBAIS DE MOUSE
        document.addEventListener('mousedown', (event) => {
            this.manager.playAudio('mouseDown', {
                volume: 0.4 + Math.random() * 0.2,
                randDetuneScale: 0.3,
                pitch: (Math.random() * 2 - 1),
            });
        });

        document.addEventListener('mouseup', (event) => {
            this.manager.playAudio('mouseUp', {
                volume: 0.3 + Math.random() * 0.2,
                randDetuneScale: 0.3,
                pitch: (Math.random() * 2 - 1),
            });
        });

        // EVENTOS ANTIGOS (mantidos para compatibilidade)
        document.addEventListener('keyup', (event) => {
            if (event.inComputer && !this.isInLoginMode) {
                this.lastKey = '';
            }
        });

        document.addEventListener('keydown', (event) => {
            if (this.lastKey === event.key) return;
            this.lastKey = event.key;

            if (event.inComputer && !this.isInLoginMode) {
                this.manager.playAudio('keyboardKeydown', {
                    volume: 0.8,
                    position: new THREE.Vector3(-300, -400, 1200),
                });
            }
        });
    }
}

// 🔥 NOVA CLASSE PARA GERENCIAR AS SEQUÊNCIAS DE ÁUDIO
export class AtmosphereAudio extends AudioSource {
    constructor(manager) {
        super(manager);
        this.setupSequenceListeners();
    }

    setupSequenceListeners() {
        // 🚀 LOADING SCREEN
        document.addEventListener('audioLoadingStart', () => {
            this.manager.startLoadingAudio();
        });

        // 🔐 LOGIN TRANSITION
        document.addEventListener('audioLoginTransition', () => {
            this.manager.startLoginTransition();
        });

        // ✅ AUTHORIZED
        document.addEventListener('audioAuthorized', () => {
            this.manager.playAuthorizedSound();
        });

        // 🌌 3D ENVIRONMENT
        document.addEventListener('audio3DStart', () => {
            this.manager.start3DAudio();
        });

        // 🔇 STOP ALL
        document.addEventListener('audioStopAll', () => {
            this.manager.stopAllAudio();
        });
    }
}