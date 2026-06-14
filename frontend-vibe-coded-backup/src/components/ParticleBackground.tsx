"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  hue: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    function resize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
    }

    function createParticle(): Particle {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        life: Math.random() * 100 + 50,
        maxLife: 0,
        hue: 230 + Math.random() * 40,
      };
    }

    function initParticles() {
      const particles: Particle[] = [];
      for (let i = 0; i < 120; i++) {
        const p = createParticle();
        p.maxLife = p.life;
        particles.push(p);
      }
      particlesRef.current = particles;
    }

    function updateParticle(p: Particle) {
      const angle =
        (p.x * 0.003 + p.y * 0.003 + timeRef.current * 0.0005) * Math.PI * 2;
      p.vx += Math.cos(angle) * 0.01;
      p.vy += Math.sin(angle) * 0.01;

      const dx = p.x - mouseRef.current.x;
      const dy = p.y - mouseRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        const force = ((150 - dist) / 150) * 0.5;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      p.vx *= 0.99;
      p.vy *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      if (
        p.life <= 0 ||
        p.x < 0 ||
        p.x > width ||
        p.y < 0 ||
        p.y > height
      ) {
        const np = createParticle();
        p.x = np.x;
        p.y = np.y;
        p.vx = np.vx;
        p.vy = np.vy;
        p.size = np.size;
        p.life = np.life;
        p.maxLife = np.life;
        p.hue = np.hue;
      }
    }

    function drawConnections(particles: Particle[]) {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.12;
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `hsla(235, 50%, 60%, ${alpha})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      timeRef.current++;

      const particles = particlesRef.current;
      for (const p of particles) {
        updateParticle(p);
        const alpha = (p.life / p.maxLife) * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, ${alpha})`;
        ctx.fill();
      }

      drawConnections(particles);
      rafRef.current = requestAnimationFrame(animate);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleResize = () => resize();

    resize();
    initParticles();
    animate();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        opacity: 0.35,
        pointerEvents: "none",
      }}
    />
  );
}
