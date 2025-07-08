import React from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export default function ComputerScreenFake3D({ position, isMobile }) {
  const texture = useLoader(
    TextureLoader,
    isMobile
      ? "/static/textures/monitor/png/monitor-zoomout-mobile.webp"
      : "/static/textures/monitor/png/monitor-zoomout.png"
  );
  return (
    <mesh
      position={position}
      rotation={[3.143, Math.PI / 4.2, Math.PI]}
      scale={isMobile ? [0.34, 0.19, 1] : [0.67, 0.38, 1]} // Ajuste para alinhar
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}
