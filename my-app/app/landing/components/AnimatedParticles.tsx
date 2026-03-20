'use client';

import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  cyan: boolean;
  alpha: number;
  reset: () => void;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
};

export default function AnimatedParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);
    let particles: Particle[] = [];

    const createParticle = (): Particle => {
      const particle: Particle = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        r: 1,
        cyan: false,
        alpha: 0.5,
        reset() {
          this.x = Math.random() * W;
          this.y = Math.random() * H;
          this.vx = (Math.random() - 0.5) * 0.3;
          this.vy = (Math.random() - 0.5) * 0.3;
          this.r = Math.random() * 2 + 1;
          this.cyan = Math.random() > 0.6;
          this.alpha = Math.random() * 0.8 + 0.4;
        },
        update() {
          this.x += this.vx;
          this.y += this.vy;
          if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
            this.reset();
          }
        },
        draw(drawCtx: CanvasRenderingContext2D) {
          drawCtx.beginPath();
          drawCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
          drawCtx.fillStyle = this.cyan
            ? `rgba(0, 245, 255, ${this.alpha})`
            : `rgba(255, 0, 255, ${this.alpha * 0.6})`;
          drawCtx.fill();
        },
      };

      particle.reset();
      return particle;
    };

    const initParticles = () => {
      particles = [];
      const particleCount = W < 768 ? 80 : 600;
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
      }
    };

    const drawGrid = () => {
      const gs = 80;
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += gs) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += gs) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
    };

    const drawConnections = () => {
      const d = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < d) {
            const alpha = (1 - dist / d) * 0.25;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 245, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      drawGrid();
      drawConnections();
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);
    initParticles();
    animate();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  );
}
