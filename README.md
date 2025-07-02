# 🌌 Portfolio 3D - Immersive Web Experience

> A cutting-edge 3D web portfolio featuring spatial audio, retro-inspired interface, and interactive 3D environments.

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![React](https://img.shields.io/badge/React-18%2B-61dafb)
![Three.js](https://img.shields.io/badge/Three.js-Latest-orange)
![WebGL](https://img.shields.io/badge/WebGL-2.0-red)

## 🎯 Overview

An innovative 3D web portfolio that combines modern web technologies with nostalgic design elements. Features a fully interactive 3D environment, spatial audio system, and Windows 95-inspired UI components that create a unique and memorable user experience.

### ✨ Key Features

- 🌐 **Interactive 3D Environment**: Fully navigable 3D scenes with WebGL
- 🎵 **Spatial Audio System**: Positioned audio with atmospheric soundscapes
- 🎨 **Retro UI Components**: Windows 95/98-inspired interface elements
- 🎚️ **Advanced Audio Controls**: Smart mute/unmute system with visual feedback
- ⌨️ **Interactive Feedback**: Keyboard and mouse sound effects
- 📱 **Responsive Design**: Optimized for desktop and mobile devices
- 🔄 **Dynamic Loading**: Progressive loading with animated indicators
- 🪟 **Authentic Windows Elements**: Login screens, dialog boxes, and classic components

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
├── public/                    # Static assets
│   └── static/
│       ├── assets/           # 3D models
│       │   └── room.glb
│       ├── audio/            # Audio files
│       │   ├── atmosphere/   # Ambient sounds
│       │   │   ├── hackersound.mp3
│       │   │   ├── roomsound.mp3
│       │   │   └── roomsound2.mp3
│       │   ├── cc/          # Creative Commons audio
│       │   │   └── type.mp3
│       │   ├── computer/    # Computer interaction sounds
│       │   │   └── idle_2.wav
│       │   ├── keyboard/    # Keyboard feedback
│       │   │   ├── key_1.mp3 → key_6.mp3
│       │   ├── mouse/       # Mouse interaction sounds
│       │   │   ├── mouse_down.mp3
│       │   │   └── mouse_up.mp3
│       │   ├── radio/       # Radio/broadcast sounds
│       │   └── startup/     # System startup sounds
│       │       ├── startup3D.mp3
│       │       └── startupLogin.mp3
│       ├── images/          # Image assets
│       ├── textures/        # 3D textures
│       │   ├── monitor/     # Monitor textures
│       │   │   ├── compressed/
│       │   │   ├── png/
│       │   │   └── video/   # Video textures
│       │   └── UI/          # Interface icons
│       │       ├── audioOff.ico
│       │       ├── audioOn.ico
│       │       ├── favicon.ico
│       │       └── gitkeep
│       └── index.html
├── src/
│   ├── Audio/               # Audio management system
│   │   ├── AudioManager.js  # Core audio manager
│   │   └── AudioSources.js  # Audio source definitions
│   ├── components/          # React components
│   │   ├── AudioControl/    # Audio control interface
│   │   │   ├── index.jsx
│   │   │   └── styles.css
│   │   ├── HackerLoginDemo/ # Login simulation
│   │   │   ├── HackerLoginFieldReveal.jsx
│   │   │   ├── HackerRootsOverlay.jsx
│   │   │   ├── HackerRootsTransition.jsx
│   │   │   └── index.jsx
│   │   ├── LoadingScreen/   # Loading interfaces
│   │   │   ├── index.jsx
│   │   │   └── styles.css
│   │   ├── LoginBox/        # Authentication UI
│   │   │   ├── index.jsx
│   │   │   └── styles.css
│   │   ├── Room3D/          # 3D room component
│   │   │   ├── index.jsx
│   │   │   └── WindowsOS.jsx
│   │   ├── ScreenEffects/   # Visual effects
│   │   │   ├── index.jsx
│   │   │   └── styles.css
│   │   └── WindowsSelector/ # Windows-style selector
│   │       ├── index.jsx
│   │       └── styles.css
│   ├── scenes/              # 3D scene configurations
│   │   └── OfficeScene.jsx
│   ├── screen/              # WebGL shaders
│   │   ├── fragment.glsl
│   │   └── vertex.glsl
│   ├── styles/              # Global styles
│   │   ├── reset.css
│   │   └── variables.css
│   ├── App.jsx              # Main application
│   ├── App.test.js          # Tests
│   ├── index.jsx            # Entry point
│   ├── logo.svg
│   ├── reportWebVitals.js
│   ├── setupTests.js
│   ├── style.css            # Main styles
│   └── theme.js             # Theme configuration
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

## 🎮 Features & Controls

### Audio System

- **🔊 Master Control**: Located in top-left corner
- **🎚️ Adaptive Volumes**: Automatically calibrated for optimal experience
- **🎵 3D Positioning**: Spatial audio that responds to camera movement
- **🔇 Smart Muting**: Preserves session state with visual feedback

### Navigation

- **Mouse**: Free camera movement in 3D space
- **Touch**: Full mobile support with gesture controls
- **Keyboard**: Interface interaction and shortcuts

### Interface Components

- **Windows Login**: Authentic Windows-style authentication
- **Loading Screens**: Animated progress indicators
- **Dialog Boxes**: Classic Windows 95/98 modal dialogs
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
- **Dynamic Loading**: Lazy audio resource loading
- **Fallback Systems**: Synthetic audio generation
- **Cross-browser**: Compatible audio codecs

### Assets
- **3D Models**: GLTF/GLB format
- **Audio**: MP3, WAV multi-format support
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

1. Place audio files in appropriate `/public/static/audio/[category]/`
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

# Linting & Formatting
npm run lint             # ESLint check
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
- ES6+ JavaScript

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add: amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Standards

- **Components**: PascalCase (e.g., `AudioControl`)
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

- **Three.js Community** for exceptional 3D library
- **React Team** for the outstanding framework
- **Web Audio API** for enabling spatial audio
- **Retro Computing Community** for design inspiration

---

⭐ **Star this repository if you find it useful!** ⭐