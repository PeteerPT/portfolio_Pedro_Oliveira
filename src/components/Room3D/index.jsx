import React, { Suspense, useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, Sphere } from "@react-three/drei";
import * as THREE from "three";
import WindowsOS from './WindowsOS';

// Coordenadas e rotacionamento do monitor - COORDENADAS EXATAS DO USUÁRIO
const cameraViews = {
  loopA: { pos: [51.14, 30.30, 2.02] },
  loopB: { pos: [-4.54, 31.48, -49.80] },
  // 🖥️ POSIÇÕES PARA DESKTOP - SUAS COORDENADAS EXATAS
  desktop: {
    monitor: { pos: [-0.74, 5.43, 1.35], rot: [-5, 7.73, 5.05] }, // 🎯 PC
  },
  // 📱 POSIÇÕES PARA MOBILE - SUAS COORDENADAS EXATAS
  mobile: {
    monitor: { pos: [1.75, 5.72, -1.97], rot: [-3.02, 0.74, 3.06] }, // 🎯 MOBILE
  }
};
const monitorPosition = [-2.43, 5.14, 3.186];

// 🔍 HOOK PARA DETECTAR SE É MOBILE
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileUA = /android|blackberry|iphone|ipad|ipod|opera mini|iemobile|wpdesktop/i.test(userAgent);
      const isMobileScreen = window.innerWidth <= 768;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      return isMobileUA || isMobileScreen || isTouchDevice;
    };

    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };

    // Verificação inicial
    setIsMobile(checkIsMobile());

    // Listener para mudanças de tamanho de tela
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return isMobile;
}

function RoomModel() {
  const { scene } = useGLTF("/assets/room.glb");
  return <primitive object={scene} />;
}

// 🔥 EFEITOS DE VIDRO AJUSTADOS - TAMANHO E OPACIDADE CORRETOS
function ScreenEffects() {
  const [time, setTime] = useState(0);
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);

  useEffect(() => {
    const animate = () => {
      setTime(Date.now() * 0.001);
      requestAnimationFrame(animate);
    };
    animate();

    // 🔧 FORÇAR CARREGAMENTO DOS VÍDEOS
    const loadVideo = (ref, src) => {
      if (ref.current) {
        ref.current.load();
        ref.current.play().catch(e => console.log('Erro ao tocar vídeo:', e));
      }
    };

    setTimeout(() => {
      loadVideo(videoRef1, '/static/textures/video/base-static.mp4');
      loadVideo(videoRef2, '/static/textures/video/static-texture-layer.mp4');
    }, 1000);
  }, []);

  return (
    <div 
      style={{
        position: 'absolute',
        top: -1700,           // 🔧 POSIÇÃO VERTICAL
        left: -1775,          // 🔧 POSIÇÃO HORIZONTAL  
        width: '405%',        // 🔧 LARGURA EXATA DO MONITOR
        height: '684%',       // 🔧 ALTURA EXATA DO MONITOR
        pointerEvents: 'none',
        zIndex: 10,
        opacity: 0.25,         // 🔧 OPACIDADE GERAL MUITO BAIXA
      }}
    >
      {/* 🔥 SHADOW - SOMBRAS SUTIS DA TELA */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/static/textures/monitor/png/shadow.png)',
          backgroundSize: '100% 100%',  
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 1,                
          mixBlendMode: 'multiply'      
        }}
      />

      {/* 🔥 BASE STATIC - ABORDAGEM DIFERENTE COM REF */}
      <video 
        ref={videoRef1}
        autoPlay 
        loop 
        muted 
        playsInline
        preload="auto"
        onLoadedData={() => console.log('✅ BASE STATIC carregou!')}
        onError={(e) => console.log('❌ BASE STATIC erro:', e)}
        onCanPlay={() => console.log('✅ BASE STATIC pode tocar!')}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 1,           // 🔧 OPACIDADE TOTAL PARA TESTE
          zIndex: 5,
          mixBlendMode: 'screen', // 🔧 BLEND MODE DIFERENTE
          filter: 'brightness(3) contrast(2) saturate(0)', // 🔧 SUPER BRILHANTE
          pointerEvents: 'none'
        }}
      >
        <source src="/static/textures/video/base-static.mp4" type="video/mp4" />
      </video>

      {/* 🔥 STATIC TEXTURE LAYER - ABORDAGEM DIFERENTE COM REF */}
      <video 
        ref={videoRef2}
        autoPlay 
        loop 
        muted 
        playsInline
        preload="auto"
        onLoadedData={() => console.log('✅ STATIC TEXTURE carregou!')}
        onError={(e) => console.log('❌ STATIC TEXTURE erro:', e)}
        onCanPlay={() => console.log('✅ STATIC TEXTURE pode tocar!')}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 1,           // 🔧 OPACIDADE TOTAL PARA TESTE
          zIndex: 6,
          mixBlendMode: 'overlay', // 🔧 BLEND MODE DIFERENTE
          filter: 'brightness(4) contrast(3) hue-rotate(60deg)', // 🔧 AMARELO BRILHANTE
          transform: `translate(${Math.sin(time * 6) * 2}px, ${Math.cos(time * 8) * 2}px)`, // 🔧 MOVIMENTO MAIOR
          pointerEvents: 'none'
        }}
      >
        <source src="/static/textures/video/static-texture-layer.mp4" type="video/mp4" />
      </video>

      {/* 🔥 ALTERNATIVA: CANVAS COM VÍDEO SE NÃO FUNCIONAR */}
      <canvas
        ref={(canvas) => {
          if (canvas && videoRef1.current) {
            const ctx = canvas.getContext('2d');
            const drawFrame = () => {
              if (videoRef1.current && videoRef1.current.readyState >= 2) {
                ctx.drawImage(videoRef1.current, 0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = 'screen';
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
              }
              requestAnimationFrame(drawFrame);
            };
            drawFrame();
          }
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.8,
          mixBlendMode: 'difference',
          zIndex: 7,
          pointerEvents: 'none',
          display: 'none' // 🔧 ATIVAR SE OS VÍDEOS NÃO FUNCIONAREM
        }}
      />

      {/* 🔥 SMUDGES - TAMANHO PERFEITO, OPACIDADE MÍNIMA */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/static/textures/monitor/png/smudges.png)',
          backgroundSize: '100% 100%',  
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.5,                
          mixBlendMode: 'overlay'       
        }}
      />

      {/* 🔥 DUST - TAMANHO PERFEITO, SUPER DISCRETO */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/static/textures/monitor/png/dust.png)',
          backgroundSize: '100% 100%',  
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.5,               
          mixBlendMode: 'soft-light'    
        }}
      />

      {/* 🔥 REFLECTION - EFEITO VIDRO SUTIL */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/static/textures/monitor/png/reflection.png)',
          backgroundSize: '100% 100%',  
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.5,               
          mixBlendMode: 'screen',
          filter: 'brightness(2) contrast(0.5)', 
          transform: `translate(${Math.sin(time * 1) * 1}px, ${Math.cos(time * 1.5) * 1}px)`
        }}
      />

      {/* 🔥 SCANLINES QUASE IMPERCEPTÍVEIS */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 4px,                      
            rgba(255, 255, 255, 0.002) 4px,     
            rgba(255, 255, 255, 0.002) 8px      
          )`,
          pointerEvents: 'none'
        }}
      />

      {/* 🔥 VIGNETTE SUTIL */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(
            ellipse at center,
            transparent 50%,                     
            rgba(0, 0, 0, 0.01) 80%,            
            rgba(0, 0, 0, 0.03) 100%            
          )`,
          pointerEvents: 'none'
        }}
      />

      {/* 🔥 EFEITO VIDRO - MICRO REFLEXO DIAGONAL */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.008) 0%,     
            transparent 25%,
            transparent 75%,
            rgba(255, 255, 255, 0.004) 100%    
          )`,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}

function ComputerScreen({ position }) {
  const isMobile = useIsMobile();

  return (
    <Html
      transform
      position={position}
      rotation={[3.143, Math.PI / 4.2, Math.PI]}
      scale={[0.043, 0.037, 1]}
      distanceFactor={3.5}
      occlude={false}
      style={{
        pointerEvents: "auto",
        width: 1176,
        height: 664,
        background: "transparent",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#222",
          borderRadius: 2,
          boxShadow: "0 0 16px #000a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `perspective(${isMobile ? '3400px' : '1800px'}) rotateX(0.99deg)`,
          pointerEvents: "auto",
          position: "relative",
          imageRendering: "crisp-edges",
          filter: "contrast(1.1) brightness(1.05) saturate(1.1)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        }}
      >
        <WindowsOS />
        <ScreenEffects />
      </div>
    </Html>
  );
}

// 🔥 CONTROLES SIMPLIFICADOS - APENAS ZOOM
function ControlledOrbit({ enabled, target, controlsRef, onStart, mode, isMobile }) {
  return (
    <OrbitControls
      ref={controlsRef}
      enabled={enabled}
      target={target}
      enableDamping
      dampingFactor={0.1}
      makeDefault={enabled}
      // 🔥 DESABILITAR TODAS AS ROTAÇÕES E PAN
      enablePan={false}          // ❌ SEM PAN
      enableZoom={true}          // ✅ APENAS ZOOM
      enableRotate={false}       // ❌ SEM ROTAÇÃO
      minDistance={isMobile ? 2.0 : 1.2}
      maxDistance={25}
      onStart={onStart}
      // 🔥 CONFIGURAR APENAS ZOOM
      mouseButtons={{
        LEFT: undefined,           // ❌ SEM ROTAÇÃO COM BOTÃO ESQUERDO
        MIDDLE: THREE.MOUSE.DOLLY, // ✅ ZOOM COM BOTÃO MEIO
        RIGHT: undefined           // ❌ SEM PAN COM BOTÃO DIREITO
      }}
      touches={{
        ONE: undefined,            // ❌ SEM ROTAÇÃO COM UM DEDO
        TWO: THREE.TOUCH.DOLLY_PAN // ✅ ZOOM COM DOIS DEDOS (mas sem pan)
      }}
    />
  );
}

function AnimatedCamera({ mode, setMode, isMobile }) {
  const { camera } = useThree();
  const timeRef = useRef(0);
  const controlsRef = useRef();

  const handleOrbitStart = useCallback(() => {
    if (mode === "loop") setMode("zoom");
  }, [mode, setMode]);

  // 🔄 SISTEMA DE ANIMAÇÃO AUTOMÁTICA
  useFrame((_, delta) => {
    if (mode === "loop") {
      timeRef.current += delta * 0.10;
      const t = 0.5 + 0.5 * Math.sin(timeRef.current);
      const posA = cameraViews.loopA.pos;
      const posB = cameraViews.loopB.pos;
      camera.position.set(
        posA[0] + (posB[0] - posA[0]) * t,
        posA[1] + (posB[1] - posA[1]) * t,
        posA[2] + (posB[2] - posA[2]) * t
      );
      camera.lookAt(...monitorPosition);
    }
  });

  // 🔥 SISTEMA SIMPLIFICADO - APENAS ZOOM
  useFrame(() => {
    const dist = camera.position.distanceTo(new THREE.Vector3(...monitorPosition));
    
    // Se estiver no modo zoom e muito longe, volta para loop
    if (mode === "zoom" && dist > 22) {
      setMode("loop");
    }
  });

  useEffect(() => {
    if (mode === "monitor") {
      // 🎯 USA COORDENADAS EXATAS FORNECIDAS PELO USUÁRIO
      const cameraConfig = isMobile ? cameraViews.mobile.monitor : cameraViews.desktop.monitor;
      camera.position.set(...cameraConfig.pos);
      camera.rotation.set(...cameraConfig.rot);
      
      console.log(`🎯 Câmera posicionada - ${isMobile ? 'MOBILE' : 'PC'}:`, {
        position: cameraConfig.pos,
        rotation: cameraConfig.rot
      });
    }
  }, [mode, camera, isMobile]);

  return (
    <ControlledOrbit
      enabled={mode === "zoom" || mode === "monitor"}
      target={monitorPosition}
      controlsRef={controlsRef}
      onStart={handleOrbitStart}
      mode={mode}
      isMobile={isMobile}
    />
  );
}

export default function Room3D() {
  const [cameraMode, setCameraMode] = useState("loop");
  const isMobile = useIsMobile();

  useEffect(() => {
    function setZoomMode(event) {
      if (event.target.tagName === 'IFRAME' || event.target.closest('iframe')) {
        return;
      }
      if (cameraMode === "loop") setCameraMode("zoom");
    }

    const interval = setInterval(() => {
      const canvas = document.querySelector("canvas");
      if (canvas) {
        canvas.addEventListener("pointerdown", setZoomMode);
        canvas.addEventListener("wheel", setZoomMode, { passive: true });
        canvas.addEventListener("touchstart", setZoomMode);
        clearInterval(interval);
      }
    }, 100);

    return () => {
      const canvas = document.querySelector("canvas");
      if (canvas) {
        canvas.removeEventListener("pointerdown", setZoomMode);
        canvas.removeEventListener("wheel", setZoomMode);
        canvas.removeEventListener("touchstart", setZoomMode);
      }
      clearInterval(interval);
    };
  }, [cameraMode]);

  const goToMonitor = useCallback(() => setCameraMode("monitor"), []);
  const goToLoop = useCallback(() => setCameraMode("loop"), []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000", position: "relative" }}>
      <Canvas 
        camera={{ fov: isMobile ? 45 : 35 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          pixelRatio: Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)
        }}
        dpr={[1, isMobile ? 1.5 : 2]}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <RoomModel />
          <Sphere args={[0.05, 35, 35]} position={[-2.45, 5.416, 3.186]}>
            <meshStandardMaterial color="red" />
          </Sphere>
          <ComputerScreen position={[-2.45, 5.215, 3.186]} />
          <AnimatedCamera mode={cameraMode} setMode={setCameraMode} isMobile={isMobile} />
        </Suspense>
      </Canvas>
      
      {/* 📱 INTERFACE RESPONSIVA */}
      <div style={{
        position: "absolute", 
        top: isMobile ? 10 : 20, 
        left: isMobile ? 10 : 20, 
        zIndex: 1000,
        padding: isMobile ? "6px 12px" : "8px 16px", 
        background: "rgba(0,0,0,0.7)", 
        color: "#fff", 
        borderRadius: 6,
        fontSize: isMobile ? 12 : 14, 
        fontWeight: "bold"
      }}>
        {isMobile ? "📱" : "🖥️"} {cameraMode === "loop" ? "Looping Automático" : cameraMode === "zoom" ? "Modo Zoom" : "Foco no Monitor"}
      </div>

      {cameraMode !== "loop" && (
        <button
          onClick={goToLoop}
          style={{
            position: "absolute", 
            top: isMobile ? 10 : 20, 
            right: isMobile ? 10 : 20, 
            zIndex: 1000,
            padding: isMobile ? "10px 16px" : "14px 24px", 
            background: "#111", 
            color: "#fff", 
            border: "3px solid #fff", 
            borderRadius: 9,
            fontWeight: "bold", 
            fontSize: isMobile ? 14 : 18, 
            cursor: "pointer", 
            opacity: 0.97, 
            boxShadow: "0 2px 24px #000c"
          }}
        >
          {isMobile ? "🔄 Loop" : "Voltar para looping da câmera"}
        </button>
      )}
      {cameraMode !== "monitor" && (
        <button
          onClick={goToMonitor}
          style={{
            position: "absolute", 
            top: isMobile ? 60 : 70, 
            right: isMobile ? 10 : 20, 
            zIndex: 1000,
            padding: isMobile ? "10px 16px" : "14px 24px", 
            background: "#fff", 
            color: "#222", 
            border: "3px solid #222", 
            borderRadius: 9,
            fontWeight: "bold", 
            fontSize: isMobile ? 14 : 18, 
            cursor: "pointer", 
            opacity: 0.97, 
            boxShadow: "0 2px 24px #000c"
          }}
        >
          {isMobile ? "📺 Monitor" : "Ir para tela do monitor"}
        </button>
      )}
    </div>
  );
}