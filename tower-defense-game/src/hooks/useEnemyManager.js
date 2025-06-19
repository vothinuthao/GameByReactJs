import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for managing enemy spawning, movement, and lifecycle
 * Handles enemy AI, collision detection, and wave management
 */
export const useEnemyManager = (wave, playerPosition) => {
  const [enemies, setEnemies] = useState([]);
  const enemyIdCounter = useRef(0);
  const waveEnemiesSpawned = useRef(0);
  const waveEnemiesKilled = useRef(0);

  const generateEnemyId = useCallback(() => {
    return ++enemyIdCounter.current;
  }, []);

  const getRandomSpawnPosition = useCallback(() => {
    const side = Math.floor(Math.random() * 4);
    const gameWidth = 800;
    const gameHeight = 600;
    
    switch (side) {
      case 0: return { x: Math.random() * gameWidth, y: -50 }; // Top
      case 1: return { x: gameWidth + 50, y: Math.random() * gameHeight }; // Right
      case 2: return { x: Math.random() * gameWidth, y: gameHeight + 50 }; // Bottom
      case 3: return { x: -50, y: Math.random() * gameHeight }; // Left
      default: return { x: 0, y: 0 };
    }
  }, []);

  const createEnemy = useCallback(() => {
    const spawnPosition = getRandomSpawnPosition();
    const enemyHealth = 20 + wave * 5;
    
    return {
      id: generateEnemyId(),
      x: spawnPosition.x,
      y: spawnPosition.y,
      health: enemyHealth,
      maxHealth: enemyHealth,
      speed: 1 + wave * 0.1,
      attackDamage: 5 + Math.floor(wave / 2),
    };
  }, [wave, generateEnemyId, getRandomSpawnPosition]);

  const spawnEnemy = useCallback(() => {
    const enemiesForWave = wave * 5;
    
    if (waveEnemiesSpawned.current < enemiesForWave) {
      setEnemies(prev => [...prev, createEnemy()]);
      waveEnemiesSpawned.current += 1;
      return true;
    }
    return false;
  }, [wave, createEnemy]);

  const moveEnemies = useCallback(() => {
    setEnemies(prevEnemies => 
      prevEnemies.map(enemy => {
        const dx = playerPosition.x - enemy.x;
        const dy = playerPosition.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
          const moveX = (dx / distance) * enemy.speed;
          const moveY = (dy / distance) * enemy.speed;
          
          return {
            ...enemy,
            x: enemy.x + moveX,
            y: enemy.y + moveY,
          };
        }
        return enemy;
      })
    );
  }, [playerPosition]);

  const damageEnemy = useCallback((enemyId, damage) => {
    let enemyKilled = false;
    
    setEnemies(prevEnemies => 
      prevEnemies.map(enemy => {
        if (enemy.id === enemyId) {
          const newHealth = enemy.health - damage;
          if (newHealth <= 0) {
            enemyKilled = true;
            waveEnemiesKilled.current += 1;
            return null; // Mark for removal
          }
          return { ...enemy, health: newHealth };
        }
        return enemy;
      }).filter(Boolean) // Remove null enemies
    );
    
    return enemyKilled;
  }, []);

  const getEnemiesInRange = useCallback((position, range) => {
    return enemies.filter(enemy => {
      const distance = Math.sqrt(
        Math.pow(position.x - enemy.x, 2) + 
        Math.pow(position.y - enemy.y, 2)
      );
      return distance <= range;
    });
  }, [enemies]);

  const isWaveComplete = useCallback(() => {
    const enemiesForWave = wave * 5;
    return waveEnemiesKilled.current >= enemiesForWave && enemies.length === 0;
  }, [wave, enemies.length]);

  const resetWave = useCallback(() => {
    waveEnemiesSpawned.current = 0;
    waveEnemiesKilled.current = 0;
    setEnemies([]);
  }, []);

  return {
    enemies,
    spawnEnemy,
    moveEnemies,
    damageEnemy,
    getEnemiesInRange,
    isWaveComplete,
    resetWave,
    waveEnemiesSpawned: waveEnemiesSpawned.current,
    waveEnemiesKilled: waveEnemiesKilled.current
  };
};