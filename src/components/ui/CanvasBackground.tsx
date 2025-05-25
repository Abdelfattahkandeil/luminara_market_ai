import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  life: number;
  maxLife: number;
}

const CanvasBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  // Colors for particles
  const purpleBlueColors = [
    'rgba(79, 70, 229, 0.7)',  // Indigo
    'rgba(67, 56, 202, 0.7)',
    'rgba(55, 48, 163, 0.7)',
    'rgba(109, 40, 217, 0.7)', // Purple
    'rgba(91, 33, 182, 0.7)',
    'rgba(76, 29, 149, 0.7)',
    'rgba(37, 99, 235, 0.7)',  // Blue
    'rgba(29, 78, 216, 0.7)',
    'rgba(30, 64, 175, 0.7)',
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize particles
    const initParticles = () => {
      particles.current = [];
      const particleCount = Math.min(Math.floor(window.innerWidth * window.innerHeight / 10000), 100);
      
      for (let i = 0; i < particleCount; i++) {
        createParticle();
      }
    };

    const createParticle = () => {
      const randomColor = purpleBlueColors[Math.floor(Math.random() * purpleBlueColors.length)];
      const maxLife = 200 + Math.random() * 200;
      
      particles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 2 + Math.random() * 3,
        color: randomColor,
        life: 0,
        maxLife: maxLife
      });
    };

    // Draw particles and connections
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw each particle
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        
        // Boundary check with bounce
        if (p.x < 0 || p.x > canvas.width) {
          p.vx = -p.vx;
          p.x = Math.max(0, Math.min(p.x, canvas.width));
        }
        
        if (p.y < 0 || p.y > canvas.height) {
          p.vy = -p.vy;
          p.y = Math.max(0, Math.min(p.y, canvas.height));
        }
        
        // Update life
        p.life++;
        
        // Calculate remaining life ratio and ensure it's not negative
        const lifeRatio = Math.max(0, 1 - (p.life / p.maxLife));
        
        // Draw particle with opacity based on life
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * lifeRatio, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(')', `, ${lifeRatio})`);
        ctx.fill();
        
        // Replace particle if it's at end of life
        if (p.life >= p.maxLife) {
          particles.current[i] = createNewParticle();
        }
      }
      
      // Draw connections between close particles
      drawConnections();
    };

    const createNewParticle = (): Particle => {
      const randomColor = purpleBlueColors[Math.floor(Math.random() * purpleBlueColors.length)];
      const maxLife = 200 + Math.random() * 200;
      
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 2 + Math.random() * 3,
        color: randomColor,
        life: 0,
        maxLife: maxLife
      };
    };

    const drawConnections = () => {
      const maxDistance = 150;
      
      for (let i = 0; i < particles.current.length; i++) {
        const p1 = particles.current[i];
        
        for (let j = i + 1; j < particles.current.length; j++) {
          const p2 = particles.current[j];
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            // Opacity based on distance
            const opacity = 1 - (distance / maxDistance);
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(90, 80, 200, ${opacity * 0.2})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initParticles();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-neutral-50 to-neutral-100"
    />
  );
};

export default CanvasBackground;