import React, { useEffect, useRef } from 'react';

export const RoyalBackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Create 3D floating gold dust particle system
    const particleCount = Math.min(Math.floor(width / 25), 60);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.8,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * 0.05 + 0.01,
      pulseDirection: 1,
      color: ['#D4AF37', '#F3E5AB', '#AA771C', '#FFEFA6', '#E2C26D'][
        Math.floor(Math.random() * 5)
      ],
    }));

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Mouse Parallax factor
      const targetOffsetX = (mouseX - width / 2) * 0.02;
      const targetOffsetY = (mouseY - height / 2) * 0.02;

      // Draw each 3D golden particle with glowing aura
      particles.forEach((p) => {
        // Move particle upwards
        p.y -= p.speedY;
        p.x += p.speedX;

        // Reset if off top or sides
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Pulse opacity
        p.opacity += p.pulse * p.pulseDirection;
        if (p.opacity >= 0.85) p.pulseDirection = -1;
        if (p.opacity <= 0.15) p.pulseDirection = 1;

        const drawX = p.x + targetOffsetX;
        const drawY = p.y + targetOffsetY;

        // Radial glow gradient for Spline/Webflow 3D flare look
        const gradient = ctx.createRadialGradient(
          drawX,
          drawY,
          0,
          drawX,
          drawY,
          p.size * 3.5
        );
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(0.5, p.color + '66');
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(drawX, drawY, p.size * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Core bright center dot
        ctx.beginPath();
        ctx.arc(drawX, drawY, p.size * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = p.opacity * 0.9;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Animated Ambient Webflow Gradient Aura Orbs */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[600px] h-[600px] bg-[#AA771C]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* 3D Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-75"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
};
