import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for managing the main game loop
 * Orchestrates all game systems and maintains consistent frame rate
 */
export const useGameLoop = (gameStatus, updateCallback, fps = 60) => {
  const gameLoopRef = useRef();
  const lastFrameTime = useRef(0);

  const gameLoop = useCallback(() => {
    if (gameStatus !== 'playing') return;

    const currentTime = Date.now();
    const deltaTime = currentTime - lastFrameTime.current;
    
    // Maintain consistent frame rate
    if (deltaTime >= 1000 / fps) {
      updateCallback(currentTime, deltaTime);
      lastFrameTime.current = currentTime;
    }
  }, [gameStatus, updateCallback, fps]);

  useEffect(() => {
    if (gameStatus === 'playing') {
      gameLoopRef.current = setInterval(gameLoop, 1000 / fps);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameLoop, gameStatus, fps]);

  const stopGameLoop = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
  }, []);

  return { stopGameLoop };
};