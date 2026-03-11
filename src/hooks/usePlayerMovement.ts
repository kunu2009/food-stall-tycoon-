import { useState, useEffect, useRef } from 'react';

export function usePlayerMovement(bounds: { w: number, h: number }, isPaused: boolean) {
  const [pos, setPos] = useState({ x: bounds.w / 2, y: bounds.h / 2 });
  const [isMoving, setIsMoving] = useState(false);
  const keys = useRef<{ [key: string]: boolean }>({});
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const speed = 6;

    const updatePosition = () => {
      if (!isPausedRef.current) {
        let moving = false;
        setPos(p => {
          let newX = p.x;
          let newY = p.y;
          
          if (keys.current['arrowup'] || keys.current['w']) newY -= speed;
          if (keys.current['arrowdown'] || keys.current['s']) newY += speed;
          if (keys.current['arrowleft'] || keys.current['a']) newX -= speed;
          if (keys.current['arrowright'] || keys.current['d']) newX += speed;

          newX = Math.max(24, Math.min(bounds.w - 24, newX));
          newY = Math.max(48, Math.min(bounds.h - 24, newY));

          if (newX !== p.x || newY !== p.y) {
            moving = true;
            return { x: newX, y: newY };
          }
          return p;
        });
        setIsMoving(moving);
      }
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    animationFrameId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animationFrameId);
  }, [bounds.w, bounds.h]);

  return { pos, isMoving };
}
