import * as THREE from 'three';
import { ComputerAudio, AtmosphereAudio } from './AudioSources.js';

const POS_DEBUG = false;
const DEFAULT_REF_DISTANCE = 10000;

// 🎚️ VOLUMES GLOBAIS BAIXOS E SUAVES
const AUDIO_VOLUMES = {
    // Música de fundo - bem baixinha
    hackersound: 0.15,        // Era 0.6, agora 15%
    startupLogin: 0.25,       // Era 0.9, agora 25%
    startup3D: 0.20,          // Era 0.8, agora 20%
    
    // Room sounds - BEM BAIXOS para fundo suave
    roomsound: 0.02,          // Era 0.5, agora 12%
    roomsound2: 0.02,         // Era 0.4, agora 8%
    
    // Efeitos sonoros - moderados
    keyboardSounds: 0.15,     // Era 0.6-0.8, agora 15%
    mouseSounds: 0.10,        // Era 0.3-0.4, agora 10%
};

// 🎚️ Sistema de mute simples
window.globalMasterMuted = window.globalMasterMuted || false;

export default class AudioManager {
    constructor(scene, loadedAudio) {
        this.listener = new THREE.AudioListener();
        this.scene = scene;
        this.loadedAudio = loadedAudio || {};
        this.audioPool = {};
        this.context = this.listener.context;
        
        // 🔥 CONTROLES PARA MÚSICA DE FUNDO E SEQUÊNCIAS
        this.backgroundMusic = {};
        this.currentSequence = null;

        this.loadAllSounds().then(() => {
            this.audioSources = {
                computer: new ComputerAudio(this),
                atmosphere: new AtmosphereAudio(this),
            };
            window.globalAudioManager = this;
            
            // 🔥 EVENTO DE SISTEMA PRONTO
            document.dispatchEvent(new CustomEvent('audioSystemReady'));
        }).catch(error => {
            this.createFallbackSounds();
        });
    }

    // 🎚️ Aplica volume baixo baseado no tipo de som
    getVolumeForSound(soundName, originalVolume = 1) {
        if (window.globalMasterMuted) return 0;
        
        // Mapeia nomes de sons para volumes específicos
        for (const [key, volume] of Object.entries(AUDIO_VOLUMES)) {
            if (soundName.includes(key) || key.includes(soundName)) {
                return volume;
            }
        }
        
        // Volume padrão baixo se não encontrar
        return Math.min(originalVolume * 0.2, 0.3);
    }

    // 🔇 MUTE/UNMUTE simples
    setMuted(muted) {
        window.globalMasterMuted = muted;
        console.log(`🎚️ AudioManager: ${muted ? 'MUTED' : 'UNMUTED'}`);
        
        if (muted) {
            // Mute: Para tudo
            this.muteAll();
        } else {
            // Unmute: Retoma sequência atual se necessário
            this.unmuteAll();
        }
    }

    muteAll() {
        console.log('🔇 Mutando todos os áudios...');
        
        // Para background music
        Object.entries(this.backgroundMusic).forEach(([name, data]) => {
            if (data.audio && data.audio.setVolume) {
                data.audio.setVolume(0);
            }
        });
        
        // Para audio pool
        Object.entries(this.audioPool).forEach(([id, audio]) => {
            if (audio && audio.setVolume) {
                audio.setVolume(0);
            }
        });
        
        // Suspende contexto
        if (this.context && this.context.state === 'running') {
            this.context.suspend();
        }
    }

    unmuteAll() {
        console.log('🔊 Desmutando áudios...');
        
        // Resume contexto
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
        
        // Restaura volumes baixos
        Object.entries(this.backgroundMusic).forEach(([name, data]) => {
            if (data.audio && data.audio.setVolume && data.originalVolume) {
                const newVolume = this.getVolumeForSound(name, data.originalVolume);
                data.audio.setVolume(newVolume);
                console.log(`🔊 ${name}: volume restaurado para ${newVolume}`);
            }
        });
        
        // Se estava na sequência 3D e não tem roomsounds, retoma
        if (this.currentSequence === '3d' && Object.keys(this.backgroundMusic).length === 0) {
            console.log('🔊 Retomando roomsounds...');
            setTimeout(() => {
                this.start3DAudio();
            }, 500);
        }
    }

    // 🔥 CARREGA TODOS OS SONS (KEYBOARD + MOUSE + ATMOSPHERE)
    async loadAllSounds() {
        await Promise.all([
            this.loadKeyboardSounds(),
            this.loadMouseSounds(),
            this.loadAtmosphereSounds()
        ]);
    }

    // 🔥 CARREGA SONS ATMOSFÉRICOS
    async loadAtmosphereSounds() {
        const atmosphereFiles = [
            { path: '/static/audio/atmosphere/hackersound.mp3', name: 'hackersound' },
            { path: '/static/audio/startup/startupLogin.mp3', name: 'startupLogin' },
            { path: '/static/audio/startup/startup3D.mp3', name: 'startup3D' },
            { path: '/static/audio/atmosphere/roomsound.mp3', name: 'roomsound' },
            { path: '/static/audio/atmosphere/roomsound2.mp3', name: 'roomsound2' },
        ];

        let loadedCount = 0;
        
        for (const audioFile of atmosphereFiles) {
            try {
                const testResponse = await fetch(audioFile.path, { method: 'HEAD' });
                
                if (testResponse.ok) {
                    const response = await fetch(audioFile.path);
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    
                    const arrayBuffer = await response.arrayBuffer();
                    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
                    
                    this.loadedAudio[audioFile.name] = audioBuffer;
                    loadedCount++;
                    console.log(`✅ Loaded: ${audioFile.name}`);
                }
            } catch (error) {
                console.warn(`❌ Failed to load: ${audioFile.path}`, error);
            }
        }
        
        console.log(`🎵 Loaded ${loadedCount}/${atmosphereFiles.length} atmosphere sounds`);
        return this.loadedAudio;
    }

    async loadKeyboardSounds() {
        const keyFiles = [
            '/static/audio/keyboard/key_1.mp3',
            '/static/audio/keyboard/key_2.mp3',
            '/static/audio/keyboard/key_3.mp3',
            '/static/audio/keyboard/key_4.mp3',
            '/static/audio/keyboard/key_5.mp3',
            '/static/audio/keyboard/key_6.mp3',
        ];

        let loadedCount = 0;
        
        for (let i = 0; i < keyFiles.length; i++) {
            const filePath = keyFiles[i];
            const keyName = `key${i + 1}`;
            
            try {
                const testResponse = await fetch(filePath, { method: 'HEAD' });
                
                if (testResponse.ok) {
                    const response = await fetch(filePath);
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    
                    const arrayBuffer = await response.arrayBuffer();
                    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
                    
                    this.loadedAudio[keyName] = audioBuffer;
                    loadedCount++;
                }
            } catch (error) {
                // Silent fail
            }
        }
        
        if (loadedCount === 0) {
            await this.createFallbackKeyboardSounds();
        }
        
        return this.loadedAudio;
    }

    async loadMouseSounds() {
        const mouseFiles = [
            { path: '/static/audio/mouse/mouse_down.mp3', name: 'mouseDown' },
            { path: '/static/audio/mouse/mouse_up.mp3', name: 'mouseUp' },
        ];

        let loadedCount = 0;
        
        for (const mouseFile of mouseFiles) {
            try {
                const testResponse = await fetch(mouseFile.path, { method: 'HEAD' });
                
                if (testResponse.ok) {
                    const response = await fetch(mouseFile.path);
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    
                    const arrayBuffer = await response.arrayBuffer();
                    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
                    
                    this.loadedAudio[mouseFile.name] = audioBuffer;
                    loadedCount++;
                }
            } catch (error) {
                // Silent fail
            }
        }
        
        if (loadedCount === 0) {
            await this.createFallbackMouseSounds();
        }
        
        return this.loadedAudio;
    }

    // 🔥 FUNÇÕES DE SEQUÊNCIA DE ÁUDIO - COM VOLUMES BAIXOS
    startLoadingAudio() {
        console.log("🚀 AudioManager: Starting Loading Audio (volume baixo)");
        this.currentSequence = 'loading';
        
        this.playBackgroundMusic('hackersound', {
            volume: AUDIO_VOLUMES.hackersound, // 15% em vez de 60%
            fadeInDuration: 3000,
            loop: true
        });
    }

    startLoginTransition() {
        console.log("🔐 AudioManager: Starting Login Transition");
        this.currentSequence = 'loginTransition';
        
        this.stopBackgroundMusic('hackersound', 2000);
    }

    playAuthorizedSound() {
        console.log("✅ AudioManager: Access Authorized (volume baixo)");
        this.currentSequence = 'authorized';
        
        this.stopAllBackgroundMusic(100);
        
        setTimeout(() => {
            console.log("🎵 AudioManager: Tocando startupLogin em volume baixo");
            this.playAudio('startupLogin', {
                volume: AUDIO_VOLUMES.startupLogin, // 25% em vez de 90%
                loop: false
            });
        }, 50);
    }

    // 🔥 3D AUDIO - VOLUMES BEM BAIXINHOS PARA FUNDO SUAVE
    start3DAudio() {
        console.log("🌌 AudioManager: Starting 3D Audio (volumes BAIXOS)");
        this.currentSequence = '3d';
        
        // startup3D em volume baixo
        this.playBackgroundMusic('startup3D', {
            volume: AUDIO_VOLUMES.startup3D, // 20% em vez de 80%
            fadeInDuration: 2000,
            loop: false
        });
        
        // Roomsounds BEM BAIXINHOS - só ambiente de fundo
        setTimeout(() => {
            console.log("🎵 AudioManager: Iniciando roomsound1 (BAIXO)");
            this.playBackgroundMusic('roomsound', {
                volume: AUDIO_VOLUMES.roomsound, // 12% - bem baixinho
                fadeInDuration: 3000,
                loop: true
            });
        }, 500);
        
        setTimeout(() => {
            console.log("🎵 AudioManager: Iniciando roomsound2 (MUITO BAIXO)");
            this.playBackgroundMusic('roomsound2', {
                volume: AUDIO_VOLUMES.roomsound2, // 8% - quase imperceptível
                fadeInDuration: 4000,
                loop: true
            });
        }, 1000);
        
        // Para startup3D
        setTimeout(() => {
            console.log("🎵 AudioManager: Parando startup3D");
            this.stopBackgroundMusic('startup3D', 1500);
        }, 10000);
    }

    stopAllAudio() {
        this.stopAllBackgroundMusic(1000);
        this.currentSequence = null;
    }

    // 🔥 MÚSICA DE FUNDO - USA VOLUMES BAIXOS
    playBackgroundMusic(soundName, options = {}) {
        try {
            if (window.globalMasterMuted) {
                console.log(`🔇 ${soundName}: Bloqueado por mute`);
                return null;
            }

            if (this.context && this.context.state === 'suspended') {
                this.context.resume();
            }

            const buffer = this.loadedAudio[soundName];
            if (!buffer) {
                console.warn(`❌ Audio not found: ${soundName}`);
                return null;
            }

            if (this.backgroundMusic[soundName]) {
                this.stopBackgroundMusic(soundName);
            }

            const audio = new THREE.Audio(this.listener);
            audio.setBuffer(buffer);
            audio.setLoop(options.loop !== false);
            audio.setVolume(0);

            audio.play();

            // USA VOLUME BAIXO AUTOMATICAMENTE
            const requestedVolume = options.volume || 0.5;
            const finalVolume = this.getVolumeForSound(soundName, requestedVolume);
            const fadeInDuration = options.fadeInDuration || 2000;
            
            this.fadeAudioIn(audio, finalVolume, fadeInDuration);

            this.backgroundMusic[soundName] = {
                audio: audio,
                targetVolume: finalVolume,
                originalVolume: requestedVolume
            };

            console.log(`🎵 ${soundName}: Tocando em volume ${finalVolume} (${Math.round(finalVolume * 100)}%)`);
            return soundName;

        } catch (error) {
            console.error(`❌ Error playing background music ${soundName}:`, error);
            return null;
        }
    }

    stopBackgroundMusic(soundName, fadeOutDuration = 1000) {
        if (this.backgroundMusic[soundName]) {
            const musicData = this.backgroundMusic[soundName];
            
            this.fadeAudioOut(musicData.audio, fadeOutDuration, () => {
                musicData.audio.stop();
                delete this.backgroundMusic[soundName];
            });
        }
    }

    stopAllBackgroundMusic(fadeOutDuration = 1000) {
        Object.keys(this.backgroundMusic).forEach(soundName => {
            this.stopBackgroundMusic(soundName, fadeOutDuration);
        });
    }

    fadeAudioIn(audio, targetVolume, duration) {
        const steps = 20;
        const stepDuration = duration / steps;
        const volumeStep = targetVolume / steps;
        let currentStep = 0;

        const fadeInterval = setInterval(() => {
            currentStep++;
            const newVolume = Math.min(volumeStep * currentStep, targetVolume);
            audio.setVolume(newVolume);

            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                audio.setVolume(targetVolume);
            }
        }, stepDuration);
    }

    fadeAudioOut(audio, duration, callback) {
        const currentVolume = audio.getVolume();
        const steps = 20;
        const stepDuration = duration / steps;
        const volumeStep = currentVolume / steps;
        let currentStep = 0;

        const fadeInterval = setInterval(() => {
            currentStep++;
            const newVolume = Math.max(currentVolume - (volumeStep * currentStep), 0);
            audio.setVolume(newVolume);

            if (currentStep >= steps || newVolume <= 0) {
                clearInterval(fadeInterval);
                audio.setVolume(0);
                if (callback) callback();
            }
        }, stepDuration);
    }

    createFallbackSounds() {
        this.createFallbackKeyboardSounds();
        this.createFallbackMouseSounds();
    }

    createFallbackKeyboardSounds() {
        const sampleRate = this.context.sampleRate;
        const duration = 0.15;
        const length = sampleRate * duration;
        
        for (let i = 1; i <= 6; i++) {
            const buffer = this.context.createBuffer(1, length, sampleRate);
            const data = buffer.getChannelData(0);
            
            const frequency = 600 + (i * 120);
            
            for (let sample = 0; sample < length; sample++) {
                const t = sample / sampleRate;
                
                const envelope = Math.exp(-t * 8);
                const tone = Math.sin(2 * Math.PI * frequency * t);
                const harmonics = Math.sin(2 * Math.PI * frequency * 2 * t) * 0.3;
                const noise = (Math.random() - 0.5) * 0.05;
                
                data[sample] = (tone + harmonics + noise) * envelope * 0.4;
            }
            
            this.loadedAudio[`key${i}`] = buffer;
        }
    }

    createFallbackMouseSounds() {
        const sampleRate = this.context.sampleRate;
        
        const downDuration = 0.08;
        const downLength = sampleRate * downDuration;
        const downBuffer = this.context.createBuffer(1, downLength, sampleRate);
        const downData = downBuffer.getChannelData(0);
        
        for (let sample = 0; sample < downLength; sample++) {
            const t = sample / sampleRate;
            const envelope = Math.exp(-t * 15);
            const click = Math.sin(2 * Math.PI * 800 * t) + Math.sin(2 * Math.PI * 400 * t) * 0.5;
            const noise = (Math.random() - 0.5) * 0.3;
            
            downData[sample] = (click + noise) * envelope * 0.6;
        }
        
        this.loadedAudio['mouseDown'] = downBuffer;
        
        const upDuration = 0.06;
        const upLength = sampleRate * upDuration;
        const upBuffer = this.context.createBuffer(1, upLength, sampleRate);
        const upData = upBuffer.getChannelData(0);
        
        for (let sample = 0; sample < upLength; sample++) {
            const t = sample / sampleRate;
            const envelope = Math.exp(-t * 20);
            const click = Math.sin(2 * Math.PI * 1200 * t) + Math.sin(2 * Math.PI * 600 * t) * 0.3;
            const noise = (Math.random() - 0.5) * 0.2;
            
            upData[sample] = (click + noise) * envelope * 0.5;
        }
        
        this.loadedAudio['mouseUp'] = upBuffer;
    }

    // 🎚️ PLAYAUDIO COM VOLUMES BAIXOS
    playAudio(sourceName, options = {}) {
        try {
            if (window.globalMasterMuted) {
                return null;
            }

            if (this.context && this.context.state === 'suspended') {
                this.context.resume();
            }

            const originalSourceName = sourceName;
            sourceName = this.getRandomVariant(sourceName);

            const buffer = this.loadedAudio[sourceName];
            
            if (!buffer) {
                return null;
            }

            const poolKey = sourceName + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

            let audio;
            
            if (options.position) {
                audio = new THREE.PositionalAudio(this.listener);
                audio.setRefDistance(options.refDistance || DEFAULT_REF_DISTANCE);

                const sphere = new THREE.SphereGeometry(100, 8, 8);
                const material = new THREE.MeshBasicMaterial({
                    color: 0xff0000,
                    transparent: !POS_DEBUG,
                    opacity: POS_DEBUG ? 1 : 0,
                });
                const mesh = new THREE.Mesh(sphere, material);
                mesh.position.copy(options.position);
                mesh.name = poolKey;
                this.scene.add(mesh);
            } else {
                audio = new THREE.Audio(this.listener);
            }

            audio.setBuffer(buffer);
            audio.setLoop(options.loop || false);
            
            // APLICA VOLUME BAIXO AUTOMATICAMENTE
            const requestedVolume = options.volume || 1;
            const finalVolume = this.getVolumeForSound(sourceName, requestedVolume);
            audio.setVolume(finalVolume);

            if (options.filter) {
                const filter = audio.context.createBiquadFilter();
                filter.type = options.filter.type;
                filter.frequency.setValueAtTime(options.filter.frequency, audio.context.currentTime);
                audio.setFilter(filter);
            }

            audio.play();

            setTimeout(() => {
                try {
                    if (audio.source) {
                        if (options.randDetuneScale) {
                            const detuneAmount = (Math.random() * 200 - 100) * options.randDetuneScale;
                            audio.setDetune(detuneAmount);
                        }

                        if (options.pitch !== undefined) {
                            audio.setDetune(options.pitch * 100);
                        }

                        audio.source.onended = () => {
                            delete this.audioPool[poolKey];
                            if (options.position) {
                                const mesh = this.scene.getObjectByName(poolKey);
                                if (mesh) this.scene.remove(mesh);
                            }
                        };
                    }
                } catch (detuneError) {
                    // Silent fail
                }
            }, 20);

            this.audioPool[poolKey] = audio;

            return poolKey;

        } catch (error) {
            return null;
        }
    }

    getRandomVariant(sourceName) {
        const variants = Object.keys(this.loadedAudio).filter(key => key.includes(sourceName));
        
        if (variants.length === 0) {
            return sourceName;
        }
        
        const selected = variants[Math.floor(Math.random() * variants.length)];
        return selected;
    }

    setAudioFilterFrequency(audio, frequency) {
        const a = this.audioPool[audio];
        if (a && a.getFilter()) {
            const f = Math.max(0, Math.min(22050, frequency));
            a.getFilter().frequency.setValueAtTime(f, a.context.currentTime);
        }
    }

    setAudioVolume(audio, volume) {
        const a = this.audioPool[audio];
        if (a) {
            a.setVolume(volume);
        }
    }

    update() {
        if (this.audioSources) {
            for (const key in this.audioSources) {
                this.audioSources[key].update();
            }
        }
    }
}