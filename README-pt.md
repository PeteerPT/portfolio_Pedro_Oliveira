# 🌌 Portfolio 3D - Experiência Web Imersiva

> Um portfólio web 3D de última geração com áudio espacial, interface inspirada no retro e ambientes 3D interativos.

![Status](https://img.shields.io/badge/Status-Ativo-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![React](https://img.shields.io/badge/React-18%2B-61dafb)
![Three.js](https://img.shields.io/badge/Three.js-Latest-orange)
![WebGL](https://img.shields.io/badge/WebGL-2.0-red)

## 🎯 Visão Geral

Um portfólio 3D altamente imersivo que combina **Three.js**, **React** e **Web Audio API** para simular um sistema operacional retrô em ambiente 3D com sons, interações e texturas realistas.

### ✨ Características Principais

- 🌐 **Ambiente 3D Interativo**: Cenas 3D totalmente navegáveis com WebGL
- 🎵 **Sistema de Áudio Espacial**: Áudio posicionado com paisagens sonoras atmosféricas
- 🎨 **Componentes UI Retrô**: Elementos de interface inspirados no Windows 95/98
- 🎚️ **Controles de Áudio Avançados**: Sistema inteligente de mute/unmute com feedback visual
- ⌨️ **Feedback Interativo**: Efeitos sonoros de teclado e mouse
- 📱 **Design Responsivo**: Otimizado para dispositivos desktop e móveis
- 🔄 **Carregamento Dinâmico**: Carregamento progressivo com indicadores animados
- 🪟 **Elementos Autênticos do Windows**: Telas de login, caixas de diálogo e componentes clássicos

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** 18.0.0 ou superior
- **npm** ou **yarn**
- Navegador moderno com suporte ao WebGL 2.0

### Instalação

```bash
# Clone o repositório
git clone https://github.com/PeteerPT/portfolio_Pedro_Oliveira.git
cd portfolio_Pedro_Oliveira

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

### Estrutura do Projeto

```
portfolio_Pedro_Oliveira/
├── public/
│   ├── assets/
│   │   └── room.glb                         # Modelo 3D do ambiente principal
│
│   ├── static/                              # Recursos estáticos usados no runtime
│   │   ├── assets/
│   │   │   └── fonts/
│   │   │       └── PressStart2P-Regular.ttf # Fonte retrô usada no botão do 2D
│   │   │
│   │   ├── audio/                           # Arquivos de áudio organizados por função
│   │   │   ├── atmosphere/                  # Sons de ambiente e efeitos do monitor
│   │   │   │   ├── hackersound.mp3
│   │   │   │   ├── roomsound*.mp3
│   │   │   │   ├── tv-on.mp3                # 🔊 Efeito sonoro de monitor ligando
│   │   │   │   └── tv-off.mp3               # 🔇 Efeito sonoro de monitor desligando
│   │   │   ├── cc/                          # Sons de digitação
│   │   │   │   └── type.mp3
│   │   │   ├── computer/
│   │   │   │   └── idle_2.wav               # Ruído do sistema inativo
│   │   │   ├── keyboard/                    # Feedback de teclas individuais
│   │   │   │   ├── key_1.mp3 → key_6.mp3
│   │   │   ├── mouse/
│   │   │   │   ├── mouse_down.mp3
│   │   │   │   └── mouse_up.mp3
│   │   │   ├── sound/
│   │   │   │   ├── button-screen.mp3        # Clique no botão do monitor
│   │   │   │   ├── soundon.mp3              # Som ao ativar
│   │   │   │   └── soundoff.mp3             # Som ao desativar
│   │   │   └── startup/
│   │   │       ├── startup3D.mp3
│   │   │       └── startupLogin.mp3
│   │   │
│   │   ├── textures/
│   │   │   ├── monitor/
│   │   │   │   ├── compressed/              # PNGs otimizados para performance
│   │   │   │   ├── png/                     # Texturas completas do monitor
│   │   │   │   └── video/                   # 🎥 Vídeos usados como texturas dinâmicas
│   │   │   └── UI/
│   │   │       ├── audioOn.ico
│   │   │       ├── audioOff.ico
│   │   │       └── favicon.ico
│   └── index.html                           # HTML principal do app
│
├── src/
│   ├── Audio/                               # 🎧 Lógica de controle de som
│   │   ├── AudioManager.js                  # Controla todos os volumes e instâncias de áudio
│   │   └── AudioSources.js                  # Lista os arquivos e categoriza fontes sonoras
│
│   ├── components/                          # Componentes reutilizáveis e interativos
│   │   ├── AudioControl/                    # Componente visual de controle de áudio (mute)
│   │   ├── HackerLoginDemo/                 # Animação e tela de login estilo "hacker"
│   │   │   ├── HackerLoginFieldReveal.jsx
│   │   │   ├── HackerRootsOverlay.jsx
│   │   │   ├── HackerRootsTransition.jsx
│   │   │   └── index.jsx
│   │   ├── LoadingScreen/                   # Tela de carregamento animada
│   │   ├── LoginBox/                        # Caixa de login estilo Windows retrô
│   │   ├── Room3D/                          # 🎮 Lógica de renderização da cena 3D
│   │   │   ├── hooks/
│   │   │   │   ├── useIsMobile.jsx          # Hook para detectar dispositivos móveis
│   │   │   │   └── use3DPerformanceConfig.js# Ajuste automático de qualidade 3D
│   │   │   ├── overlays/                    # Camadas de efeito sobre o monitor
│   │   │   │   ├── AmbilightOverlay.jsx
│   │   │   │   ├── GlassOverlay.jsx         # Vidro do monitor (blur e opacidade)
│   │   │   │   ├── MonitorPowerEffect.jsx   # ✅ Efeito CRT animado com áudio
│   │   │   │   ├── VideoOverlayCanvas.jsx   # Vídeo como textura sobre monitor
│   │   │   │   └── index.jsx
│   │   │   ├── Monitor2D.jsx                # Tela 2D simulada no monitor 3D
│   │   │   ├── MonitorButton.css            # Estilo do botão de ativar/desativar
│   │   │   ├── overlaysConfig.js            # Configuração e ordem dos overlays
│   │   │   └── WindowsOS.jsx                # ✅ Controla iframe e efeito de tela ON/OFF
│   │   ├── ScreenEffects/
│   │   │   └── index.jsx                    # Efeitos como glitch, CRT, etc
│   │   ├── WindowsSelector/
│   │   │   └── index.jsx                    # Seletor de janelas abertas
│
│   ├── scenes/
│   │   └── OfficeScene.jsx                  # Cena principal do ambiente virtual
│
│   ├── screen/
│   │   ├── fragment.glsl                    # Shader de pixels (cores e efeitos visuais)
│   │   └── vertex.glsl                      # Shader de vértices (formas e posicionamento)
│
│   ├── styles/
│   │   ├── reset.css
│   │   ├── variables.css
│   │   ├── style.css                        # Estilo global
│   │   └── monitor2d-button.css             # ✅ Estilo do botão retrô em tela 2D
│
│   ├── App.jsx                              # Componente raiz
│   ├── App.test.js
│   ├── index.jsx                            # Ponto de entrada do React
│   ├── reportWebVitals.js
│   ├── setupTests.js
│   ├── theme.js                             # Paleta de cores do app
│   └── type.d.ts                            # Tipagens auxiliares
│
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md                                # Documentação em inglês
└── README-pt.md                             # ✅ Documentação principal em português
```

## 🎮 Recursos e Controles

### Sistema de Áudio

- **🔊 Controle Principal**: Localizado no canto superior esquerdo
- **🎚️ Volumes Adaptativos**: Automaticamente calibrados para experiência otimizada
- **🎵 Posicionamento 3D**: Áudio espacial que responde ao movimento da câmera
- **🔇 Mute Inteligente**: Preserva estado da sessão com feedback visual

### Navegação

- **Mouse**: Movimento livre da câmera no espaço 3D
- **Touch**: Suporte móvel completo com controles por gestos
- **Teclado**: Interação com interface e atalhos

### Componentes da Interface

- **Login Windows**: Autenticação autêntica estilo Windows
- **Telas de Carregamento**: Indicadores de progresso animados
- **Caixas de Diálogo**: Janelas modais clássicas do Windows 95/98
- **Visualizador de Áudio**: Exibição de forma de onda em tempo real

## 🛠️ Stack Tecnológico

### Frontend
- **React 18+**: React moderno com hooks
- **Three.js**: Renderização 3D e WebGL
- **Web Audio API**: Áudio espacial avançado
- **CSS3**: Estilização moderna com animações
- **WebGL 2.0**: Gráficos acelerados por hardware

### Processamento de Áudio
- **Áudio Espacial**: Fontes sonoras posicionadas em 3D
- **Carregamento Dinâmico**: Carregamento lazy de recursos de áudio
- **Sistemas de Fallback**: Geração sintética de áudio
- **Cross-browser**: Codecs de áudio compatíveis

### Assets
- **Modelos 3D**: Formato GLTF/GLB
- **Áudio**: Suporte multi-formato MP3, WAV
- **Texturas**: PNG/JPG otimizados com compressão
- **Shaders**: Shaders GLSL vertex/fragment customizados

## ⚙️ Configuração

### Configurações de Volume de Áudio

```javascript
const AUDIO_VOLUMES = {
    // Música de fundo (sutil)
    hackersound: 0.15,        // 15%
    startupLogin: 0.25,       // 25%
    startup3D: 0.20,          // 20%
    
    // Sons ambientes (muito baixos)
    roomsound: 0.12,          // 12%
    roomsound2: 0.08,         // 8%
    
    // Feedback de interação
    keyboardSounds: 0.15,     // 15%
    mouseSounds: 0.10,        // 10%
};
```

### Personalização de Componentes

```css
/* Variáveis do Tema */
:root {
  --retro-bg: #c0c0c0;
  --retro-border: #808080;
  --retro-highlight: #ffffff;
  --retro-shadow: #000000;
  --accent-blue: #0066cc;
}
```

## 🎨 Personalização

### Adicionando Novo Áudio

1. Coloque arquivos de áudio em `/public/static/audio/[categoria]/`
2. Registre no `AudioManager.js`:

```javascript
const atmosphereFiles = [
    { path: '/static/audio/atmosphere/novo-som.mp3', name: 'novoSom' }
];
```

3. Configure volume no objeto `AUDIO_VOLUMES`

### Criando Novos Componentes

```jsx
// Exemplo: Novo componente estilo Windows
import React from 'react';
import './NovoComponente.css';

export default function NovoComponente() {
    return (
        <div className="windows-panel">
            <div className="windows-titlebar">
                <span>Título do Componente</span>
            </div>
            <div className="windows-content">
                {/* Conteúdo do componente */}
            </div>
        </div>
    );
}
```

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
npm start                 # Iniciar servidor de desenvolvimento
npm run build            # Build de produção
npm test                 # Executar testes
npm run eject            # Ejetar do Create React App

# Linting e Formatação
npm run lint             # Verificação ESLint
npm run lint:fix         # Corrigir problemas de linting
```

### Otimização de Performance

- **Compressão de Assets**: Compressão automatizada de texturas e áudio
- **Lazy Loading**: Componentes carregados sob demanda
- **Audio Pooling**: Gerenciamento eficiente de instâncias de áudio
- **Otimização de Shaders**: GLSL otimizado para melhor performance

## 📱 Suporte a Navegadores

| Navegador | Versão | Suporte |
|-----------|--------|---------|
| Chrome    | 80+    | ✅ Completo |
| Firefox   | 75+    | ✅ Completo |
| Safari    | 13+    | ✅ Completo |
| Edge      | 80+    | ✅ Completo |

**Requisitos:**
- Suporte ao WebGL 2.0
- Web Audio API
- JavaScript ES6+

## 🤝 Contribuição

### Configuração de Desenvolvimento

1. Faça fork do repositório
2. Crie branch de feature: `git checkout -b feature/funcionalidade-incrivel`
3. Commit das mudanças: `git commit -m 'Add: funcionalidade incrível'`
4. Push para branch: `git push origin feature/funcionalidade-incrivel`
5. Abra Pull Request

### Padrões de Código

- **Componentes**: PascalCase (ex: `AudioControl`)
- **Arquivos**: camelCase para JS, kebab-case para assets
- **Commits**: Formato convencional (`Add:`, `Fix:`, `Update:`)
- **Comentários**: Use emojis para categorização

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT** - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👤 Autor

**PeteerPT**
- GitHub: [@PeteerPT](https://github.com/PeteerPT)
- Portfolio: [URL do seu Portfolio]

## 🙏 Agradecimentos

- **Comunidade Three.js** pela biblioteca 3D excepcional
- **Equipe React** pelo framework extraordinário
- **Web Audio API** por possibilitar áudio espacial
- **Comunidade Retro Computing** pela inspiração de design

---

⭐ **Dê uma estrela neste repositório se achou útil!** ⭐