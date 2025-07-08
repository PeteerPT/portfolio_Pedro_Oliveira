# 🌌 3D Portfolio - Immersive Web Experience

> A cutting-edge 3D web portfolio with spatial audio, retro-inspired interface and interactive 3D environments.

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![React](https://img.shields.io/badge/React-18%2B-61dafb)
![Three.js](https://img.shields.io/badge/Three.js-Latest-orange)
![WebGL](https://img.shields.io/badge/WebGL-2.0-red)

## 🎯 Overview

A highly immersive 3D portfolio that combines **Three.js**, **React** and **Web Audio API** to simulate a retro operating system in a 3D environment with realistic sounds, interactions and textures.

### ✨ Key Features

- 🌐 **Interactive 3D Environment**: Fully navigable 3D scenes with WebGL
- 🎵 **Spatial Audio System**: Positioned audio with atmospheric soundscapes
- 🎨 **Retro UI Components**: Interface elements inspired by Windows 95/98
- 🎚️ **Advanced Audio Controls**: Smart mute/unmute system with visual feedback
- ⌨️ **Interactive Feedback**: Keyboard and mouse sound effects
- 📱 **Responsive Design**: Optimized for desktop and mobile devices
- 🔄 **Dynamic Loading**: Progressive loading with animated indicators
- 🪟 **Authentic Windows Elements**: Login screens, dialog boxes and classic components

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** or **yarn**
- Modern browser with WebGL 2.0 support

### Installation

```bash
# Clone the repository
git clone https://github.com/PeteerPT/portfolio_Pedro_Oliveira.git
cd portfolio_Pedro_Oliveira

# Install dependencies
npm install

# Start development server
npm start
```

### Project Structure

```
portfolio_Pedro_Oliveira/
├── public/
│   ├── assets/
│   │   └── room.glb                         # Main 3D model of the virtual environment
│
│   ├── static/                              # Static runtime assets
│   │   ├── assets/
│   │   │   └── fonts/
│   │   │       └── PressStart2P-Regular.ttf # Retro font used in 2D monitor button
│   │   │
│   │   ├── audio/                           # Audio files organized by purpose
│   │   │   ├── atmosphere/                  # Ambient sounds and monitor effects
│   │   │   │   ├── hackersound.mp3
│   │   │   │   ├── roomsound*.mp3
│   │   │   │   ├── tv-on.mp3                # ✅ Monitor turning on sound effect
│   │   │   │   └── tv-off.mp3               # ✅ Monitor turning off sound effect (muted on first mount)
│   │   │   ├── cc/                          # Typing sounds
│   │   │   │   └── type.mp3
│   │   │   ├── computer/
│   │   │   │   └── idle_2.wav               # System idle background noise
│   │   │   ├── keyboard/
│   │   │   │   ├── key_1.mp3 → key_6.mp3     # Key press feedback
│   │   │   ├── mouse/
│   │   │   │   ├── mouse_down.mp3
│   │   │   │   └── mouse_up.mp3
│   │   │   ├── sound/
│   │   │   │   ├── button-screen.mp3        # 2D button click sound
│   │   │   │   ├── soundon.mp3
│   │   │   │   └── soundoff.mp3
│   │   │   └── startup/
│   │   │       ├── startup3D.mp3
│   │   │       └── startupLogin.mp3
│   │   │
│   │   ├── textures/
│   │   │   ├── monitor/
│   │   │   │   ├── compressed/              # Optimized PNGs for performance
│   │   │   │   ├── png/                     # Full quality textures for the monitor
│   │   │   │   └── video/                   # 🎥 Video files used as monitor textures
│   │   │   └── UI/
│   │   │       ├── audioOn.ico
│   │   │       ├── audioOff.ico
│   │   │       └── favicon.ico
│   └── index.html                           # Main HTML file served by React
│
├── src/
│   ├── Audio/                               # 🎧 Core logic for sound playback
│   │   ├── AudioManager.js                  # Manages global audio volumes and events
│   │   └── AudioSources.js                  # Categorized sound source list
│
│   ├── components/                          # Functional and visual components
│   │   ├── AudioControl/                    # UI mute toggle and feedback button
│   │   ├── HackerLoginDemo/                 # Terminal-style login animation
│   │   │   ├── HackerLoginFieldReveal.jsx
│   │   │   ├── HackerRootsOverlay.jsx
│   │   │   ├── HackerRootsTransition.jsx
│   │   │   └── index.jsx
│   │   ├── LoadingScreen/                   # Animated loading screen while loading assets
│   │   ├── LoginBox/                        # Retro Windows-style login form
│   │   ├── Room3D/                          # 🧠 Logic for 3D environment rendering
│   │   │   ├── hooks/
│   │   │   │   ├── useIsMobile.jsx          # Detects mobile devices for adaptive UX
│   │   │   │   └── use3DPerformanceConfig.js# Adjusts scene performance settings
│   │   │   ├── overlays/                    # Monitor overlays and effects
│   │   │   │   ├── AmbilightOverlay.jsx
│   │   │   │   ├── GlassOverlay.jsx         # Semi-transparent screen glass layer
│   │   │   │   ├── MonitorPowerEffect.jsx   # ✅ CRT-style screen power ON/OFF animation with sound
│   │   │   │   ├── VideoOverlayCanvas.jsx   # Video textures on monitor surface
│   │   │   │   └── index.jsx
│   │   │   ├── Monitor2D.jsx                # Embedded 2D web interface in 3D scene
│   │   │   ├── MonitorButton.css            # Styling for monitor on/off toggle
│   │   │   ├── overlaysConfig.js            # Overlay texture configuration
│   │   │   └── WindowsOS.jsx                # ✅ Controls iframe visibility + screen effect timing
│   │   ├── ScreenEffects/
│   │   │   └── index.jsx                    # Glitch, CRT scanlines, flicker, etc.
│   │   ├── WindowsSelector/
│   │   │   └── index.jsx                    # Window selection/management (retro style)
│
│   ├── scenes/
│   │   └── OfficeScene.jsx                  # Main 3D environment scene setup
│
│   ├── screen/
│   │   ├── fragment.glsl                    # GLSL fragment shader for color and effects
│   │   └── vertex.glsl                      # GLSL vertex shader for geometry
│
│   ├── styles/
│   │   ├── reset.css
│   │   ├── variables.css
│   │   ├── style.css                        # Global styles
│   │   └── monitor2d-button.css             # ✅ Retro button style using PressStart2P font
│
│   ├── App.jsx                              # Main React application
│   ├── App.test.js
│   ├── index.jsx                            # React entry point
│   ├── reportWebVitals.js
│   ├── setupTests.js
│   ├── theme.js                             # Global color and theme settings
│   └── type.d.ts                            # TypeScript definitions (if used)
│
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md                                # 🗂️ Main documentation (EN)
└── README-pt.md                             # 🇧🇷 Full Portuguese documentation
```

## 🎮 Features and Controls

### Audio System

- **🔊 Main Control**: Located in the top left corner
- **🎚️ Adaptive Volumes**: Automatically calibrated for optimized experience
- **🎵 3D Positioning**: Spatial audio that responds to camera movement
- **🔇 Smart Mute**: Preserves session state with visual feedback

### Navigation

- **Mouse**: Free camera movement in 3D space
- **Touch**: Full mobile support with gesture controls
- **Keyboard**: Interface interaction and shortcuts

### Interface Components

- **Windows Login**: Authentic Windows-style authentication
- **Loading Screens**: Animated progress indicators
- **Dialog Boxes**: Classic Windows 95/98 modal windows
- **Audio Visualizer**: Real-time waveform display

## 🛠️ Technology Stack

### Frontend
- **React 18+**: Modern React with hooks
- **Three.js**: 3D rendering and WebGL
- **Web Audio API**: Advanced spatial audio
- **CSS3**: Modern styling with animations
- **WebGL 2.0**: Hardware-accelerated graphics

### Audio Processing
- **Spatial Audio**: 3D positioned sound sources
- **Dynamic Loading**: Lazy loading of audio resources
- **Fallback Systems**: Synthetic audio generation
- **Cross-browser**: Compatible audio codecs

### Assets
- **3D Models**: GLTF/GLB format
- **Audio**: Multi-format support MP3, WAV
- **Textures**: Optimized PNG/JPG with compression
- **Shaders**: Custom GLSL vertex/fragment shaders

## ⚙️ Configuration

### Audio Volume Settings

```javascript
const AUDIO_VOLUMES = {
    // Background music (subtle)
    hackersound: 0.15,        // 15%
    startupLogin: 0.25,       // 25%
    startup3D: 0.20,          // 20%
    
    // Ambient sounds (very low)
    roomsound: 0.12,          // 12%
    roomsound2: 0.08,         // 8%
    
    // Interaction feedback
    keyboardSounds: 0.15,     // 15%
    mouseSounds: 0.10,        // 10%
};
```

### Component Customization

```css
/* Theme Variables */
:root {
  --retro-bg: #c0c0c0;
  --retro-border: #808080;
  --retro-highlight: #ffffff;
  --retro-shadow: #000000;
  --accent-blue: #0066cc;
}
```

## 🎨 Customization

### Adding New Audio

1. Place audio files in `/public/static/audio/[category]/`
2. Register in `AudioManager.js`:

```javascript
const atmosphereFiles = [
    { path: '/static/audio/atmosphere/new-sound.mp3', name: 'newSound' }
];
```

3. Configure volume in `AUDIO_VOLUMES` object

### Creating New Components

```jsx
// Example: New Windows-style component
import React from 'react';
import './NewComponent.css';

export default function NewComponent() {
    return (
        <div className="windows-panel">
            <div className="windows-titlebar">
                <span>Component Title</span>
            </div>
            <div className="windows-content">
                {/* Component content */}
            </div>
        </div>
    );
}
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm start                 # Start development server
npm run build            # Production build
npm test                 # Run tests
npm run eject            # Eject from Create React App

# Linting and Formatting
npm run lint             # ESLint verification
npm run lint:fix         # Fix linting issues
```

### Performance Optimization

- **Asset Compression**: Automated texture and audio compression
- **Lazy Loading**: Components loaded on demand
- **Audio Pooling**: Efficient audio instance management
- **Shader Optimization**: Optimized GLSL for better performance

## 📱 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 80+     | ✅ Full |
| Firefox | 75+     | ✅ Full |
| Safari  | 13+     | ✅ Full |
| Edge    | 80+     | ✅ Full |

**Requirements:**
- WebGL 2.0 support
- Web Audio API
- JavaScript ES6+

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create feature branch: `git checkout -b feature/awesome-feature`
3. Commit changes: `git commit -m 'Add: awesome feature'`
4. Push to branch: `git push origin feature/awesome-feature`
5. Open Pull Request

### Code Standards

- **Components**: PascalCase (e.g. `AudioControl`)
- **Files**: camelCase for JS, kebab-case for assets
- **Commits**: Conventional format (`Add:`, `Fix:`, `Update:`)
- **Comments**: Use emojis for categorization

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**PeteerPT**
- GitHub: [@PeteerPT](https://github.com/PeteerPT)
- Portfolio: [Your Portfolio URL]

## 🙏 Acknowledgments

- **Three.js Community** for the exceptional 3D library
- **React Team** for the extraordinary framework
- **Web Audio API** for enabling spatial audio
- **Retro Computing Community** for design inspiration

---

⭐ **Give this repository a star if you found it useful!** ⭐