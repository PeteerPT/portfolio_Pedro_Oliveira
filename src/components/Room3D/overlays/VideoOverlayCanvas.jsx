import React, { useEffect, useRef } from "react";

export default function VideoOverlayCanvas({ src, style = {}, opacity = 1 }) {
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let raf;
    const ctx = canvas.getContext("2d");

    video.play().catch(() => {}); // auto play sem som

    function draw() {
      if (video.readyState >= 2) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = opacity;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      raf = requestAnimationFrame(draw);
    }

    draw();

    return () => raf && cancelAnimationFrame(raf);
  }, [src, opacity]);

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        style={{ display: "none" }}
      />
      <canvas
        ref={canvasRef}
        width={320}   // ajuste para a resolução real do seu vídeo!
        height={240}
        style={{
          ...style,
          pointerEvents: "none",
          touchAction: "none",
          userSelect: "none",
        }}
      />
    </>
  );
}
