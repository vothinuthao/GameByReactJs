import { useState, useCallback } from 'react';

/**
 * Custom hook for managing player state and upgrades
 * Handles player statistics, health, and upgrade mechanics
 */
export const usePlayer = (initialPosition) => {
  const [position] = useState(initialPosition);
  const [health, setHealth] = useState(100);
  const [stats, setStats] = useState({
    maxHealth: 100,
    attack: 10,
    defense: 5,
    attackSpeed: 1000, // milliseconds between attacks
    healing: 1, // health per second
  });

  const takeDamage = useCallback((damage) => {
    const actualDamage = Math.max(1, damage - stats.defense);
    setHealth(prev => Math.max(0, prev - actualDamage));
  }, [stats.defense]);

  const heal = useCallback((amount) => {
    setHealth(prev => Math.min(stats.maxHealth, prev + amount));
  }, [stats.maxHealth]);

  const upgradeStats = useCallback((statKey, upgradeValue) => {
    setStats(prev => ({
      ...prev,
      [statKey]: prev[statKey] + upgradeValue
    }));

    // Special handling for max health upgrade
    if (statKey === 'maxHealth') {
      setHealth(prev => Math.min(prev + upgradeValue, stats.maxHealth + upgradeValue));
    }
  }, [stats.maxHealth]);

  const resetPlayer = useCallback(() => {
    setHealth(100);
    setStats({
      maxHealth: 100,
      attack: 10,
      defense: 5,
      attackSpeed: 1000,
      healing: 1,
    });
  }, []);

  return {
    position,
    health,
    stats,
    takeDamage,
    heal,
    upgradeStats,
    resetPlayer,
    setHealth
  };
};