import { useState, useCallback } from 'react';

/**
 * Custom hook for managing core game state
 * Centralizes game status, wave progression, and scoring
 */
export const useGameState = () => {
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'paused', 'gameOver'
  const [wave, setWave] = useState(1);
  const [score, setScore] = useState(0);
  const [upgradePoints, setUpgradePoints] = useState(3);

  const incrementScore = useCallback((points) => {
    setScore(prev => prev + points);
  }, []);

  const addUpgradePoints = useCallback((points) => {
    setUpgradePoints(prev => prev + points);
  }, []);

  const nextWave = useCallback(() => {
    setWave(prev => prev + 1);
    setUpgradePoints(prev => prev + 2); // Wave completion bonus
  }, []);

  const resetGame = useCallback(() => {
    setGameStatus('playing');
    setWave(1);
    setScore(0);
    setUpgradePoints(3);
  }, []);

  const togglePause = useCallback(() => {
    setGameStatus(prev => prev === 'playing' ? 'paused' : 'playing');
  }, []);

  return {
    gameStatus,
    wave,
    score,
    upgradePoints,
    setGameStatus,
    setUpgradePoints,
    incrementScore,
    addUpgradePoints,
    nextWave,
    resetGame,
    togglePause
  };
};