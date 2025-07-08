import useIsMobile from "./useIsMobile";

export default function use3DPerformanceConfig() {
  const isMobile = useIsMobile();
  return {
    isMobile,
    cameraFov: isMobile ? 60 : 35,
    dpr: isMobile ? 0.8 : 2,
    gl: {
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance",
    },
    shadows: !isMobile,
    ambientLight: isMobile ? 0.9 : 1.2,
    directionalLight: isMobile ? 0 : 1,
    showScreenFake: true,
  };
}
