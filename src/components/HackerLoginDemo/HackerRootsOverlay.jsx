import React, { useEffect, useRef } from "react";

function lerp(a, b, t) { return a + (b - a) * t; }
function randomBetween(a, b) { return a + Math.random() * (b - a); }
function getLoginBoxTargets(box, nRoots = 22) {
  if (!box) {
    // fallback central
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const w = 280, h = 100;
    box = { x: centerX - w / 2, y: centerY - h / 2, w, h };
  }
  const { x, y, w, h } = box;
  const points = [];
  points.push({ x: x, y: y });
  points.push({ x: x + w, y: y });
  points.push({ x: x, y: y + h });
  points.push({ x: x + w, y: y + h });
  points.push({ x: x + w / 2, y: y });
  points.push({ x: x + w / 2, y: y + h });
  points.push({ x: x, y: y + h / 2 });
  points.push({ x: x + w, y: y + h / 2 });
  for (let i = 0; i < nRoots - 8; i++) {
    const side = i % 4;
    let tx, ty;
    if (side === 0) { tx = randomBetween(x, x + w); ty = y + randomBetween(-8, 8); }
    else if (side === 1) { tx = randomBetween(x, x + w); ty = y + h + randomBetween(-8, 8); }
    else if (side === 2) { tx = x + randomBetween(-8, 8); ty = randomBetween(y, y + h); }
    else { tx = x + w + randomBetween(-8, 8); ty = randomBetween(y, y + h); }
    points.push({ x: tx, y: ty });
  }
  return points;
}
function generateRootPath(start, end, steps = 19, jitter = 42) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    let x = lerp(start.x, end.x, t);
    let y = lerp(start.y, end.y, t);
    if (i !== 0 && i !== steps) {
      const jitterFactor = Math.pow(1 - t, 1.5);
      x += randomBetween(-jitter, jitter) * jitterFactor;
      y += randomBetween(-jitter, jitter) * jitterFactor;
    }
    points.push({ x, y });
  }
  return points;
}

export default function HackerRootsOverlay({ loginBoxRect, isAuthorized = false, rootsPulse = false, duration = 3000 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let running = true;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const fontSize = 21;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const nRoots = 22;
    const rootsConfig = [];
    const loginTargets = getLoginBoxTargets(loginBoxRect, nRoots);
    const canvasPoints = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: 0, y: height },
      { x: width, y: height },
      { x: width / 2, y: 0 },
      { x: width / 2, y: height },
      { x: 0, y: height / 2 },
      { x: width, y: height / 2 },
    ];
    for (let i = 0; i < nRoots; i++) {
      const from = canvasPoints[i % canvasPoints.length];
      const to = loginTargets[i];
      rootsConfig.push(generateRootPath(
        { x: from.x + randomBetween(-40, 40), y: from.y + randomBetween(-40, 40) },
        to, randomBetween(16, 22), randomBetween(30, 60)
      ));
    }
    const progressArr = rootsConfig.map(() => 0);
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    let startTime = null;

    function draw(globalAlpha = 1, pulse = false) {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.globalAlpha = globalAlpha;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px 'Fira Mono', 'Consolas', monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let r = 0; r < rootsConfig.length; r++) {
        const path = rootsConfig[r];
        const prog = progressArr[r];
        const count = Math.floor(path.length * prog);
        for (let i = 0; i < count; i++) {
          const pt = path[i];
          ctx.save();
          let pulseScale = 1;
          if (isAuthorized && pulse) {
            let t = r / 10;
            pulseScale = 1 + 0.09 * Math.exp(-t) * Math.sin(t * 11);
          }
          ctx.globalAlpha = globalAlpha * (0.82 - Math.abs(0.5 - (i / path.length)) * 0.52);
          ctx.fillStyle = isAuthorized ? "#0f0" : "#fff";
          ctx.shadowColor = isAuthorized ? "#0f0" : "#fff";
          ctx.shadowBlur = isAuthorized ? 10 : 5;
          ctx.setTransform(pulseScale, 0, 0, pulseScale, pt.x, pt.y);
          const char = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(char, 0, 0);
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.restore();
        }
      }
      ctx.restore();
    }

    let animationFrame;
    let pulseTimeout;

    function animate(now) {
      if (!running) return;
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const frac = Math.min(elapsed / duration, 1);
      for (let r = 0; r < rootsConfig.length; r++) {
        const delay = (r / rootsConfig.length) * 0.22 + Math.random() * 0.11;
        progressArr[r] = Math.max(0, Math.min(1, (frac - delay) / (1 - delay * 1.3)));
      }
      draw();
      if (frac < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    }

    function pulseAnim() {
      let count = 0;
      function pulseLoop() {
        if (!running) return;
        draw(1, true);
        count++;
        if (count < 6) { // Diminui para pulse mais sutil e rápido
          animationFrame = requestAnimationFrame(pulseLoop);
        }
      }
      pulseLoop();
    }

    animate();

    if (isAuthorized && rootsPulse) {
      pulseTimeout = setTimeout(pulseAnim, 30);
    }

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      draw();
    }
    window.addEventListener("resize", handleResize);
    return () => {
      running = false;
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrame);
      clearTimeout(pulseTimeout);
    };
  }, [duration, loginBoxRect, isAuthorized, rootsPulse]);

  // Fundo preto de segurança
  return (
    <>
      <div style={{
        background: "#000",
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9,
        pointerEvents: "none"
      }} />
      <canvas
        ref={canvasRef}
        className="hacker-root-canvas"
        width={window.innerWidth}
        height={window.innerHeight}
        aria-hidden="true"
        style={{ pointerEvents: "none" }}
      />
    </>
  );
}