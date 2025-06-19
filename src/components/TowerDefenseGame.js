// components/TowerDefenseGame.js
import React, { useCallback } from 'react';
import { useGameState } from '../hooks/useGameState';
import { usePlayer } from '../hooks/usePlayer';
import { useEnemyManager } from '../hooks/useEnemyManager';
import { useCombatSystem } from '../hooks/useCombatSystem';
import { useGameLoop } from '../hooks/useGameLoop';
import { GAME_CONFIG } from '../utils/gameConstants';
import Player from './Player';
import Enemy from './Enemy';
import GameStats from './GameStats';
import UpgradePanel from './UpgradePanel';
import GameOverlay from './GameOverlay';

/**
 * Main game component that orchestrates all game systems
 * Uses custom hooks for modular state management and game logic
 */
const TowerDefenseGame = () => {
  // Initialize game systems using custom hooks
  const gameState = useGameState();
  const player = usePlayer({ 
    x: GAME_CONFIG.GAME_WIDTH / 2, 
    y: GAME_CONFIG.GAME_HEIGHT / 2 
  });
  const enemyManager = useEnemyManager(gameState.wave, player.position);
  const combatSystem = useCombatSystem();

  /**
   * Handle player upgrade purchases
   * Validates upgrade costs and applies stat improvements
   */
  const handleUpgrade = useCallback((statKey, cost) => {
    if (gameState.upgradePoints >= cost) {
      gameState.setUpgradePoints(prev => prev - cost);
      
      // Apply upgrade based on stat type
      const upgradeValues = {
        attack: 5,
        defense: 5,
        attackSpeed: -100,
        healing: 1,
        maxHealth: 20
      };
      
      player.upgradeStats(statKey, upgradeValues[statKey]);
    }
  }, [gameState.upgradePoints, gameState.setUpgradePoints, player.upgradeStats]);

  /**
   * Handle enemy spawning based on wave progression
   * Controls spawn timing and wave completion detection
   */
  const handleEnemySpawning = useCallback((currentTime) => {
    const spawnRate = GAME_CONFIG.BASE_SPAWN_RATE / gameState.wave;
    const shouldSpawn = currentTime % spawnRate < 16; // Approximate frame time
    
    if (shouldSpawn) {
      enemyManager.spawnEnemy();
    }
    
    // Check for wave completion
    if (enemyManager.isWaveComplete()) {
      gameState.nextWave();
      enemyManager.resetWave();
    }
  }, [gameState.wave, gameState.nextWave, enemyManager]);

  /**
   * Handle player combat actions
   * Manages attack timing and target selection
   */
  const handlePlayerCombat = useCallback(() => {
    if (combatSystem.performAttack(player.stats.attackSpeed)) {
      const enemiesInRange = enemyManager.getEnemiesInRange(
        player.position, 
        GAME_CONFIG.PLAYER_ATTACK_RANGE
      );
      
      if (enemiesInRange.length > 0) {
        const target = enemiesInRange[0];
        const damage = player.stats.attack;
        const enemyKilled = enemyManager.damageEnemy(target.id, damage);
        
        if (enemyKilled) {
          gameState.incrementScore(10);
          gameState.addUpgradePoints(1);
        }
      }
    }
  }, [combatSystem, player.stats, player.position, enemyManager, gameState]);

  /**
   * Handle enemy attacks on player
   * Calculates damage from enemies in contact with player
   */
  const handleEnemyAttacks = useCallback(() => {
    const attackingEnemies = enemyManager.getEnemiesInRange(
      player.position, 
      GAME_CONFIG.ENEMY_SIZE
    );
    
    if (attackingEnemies.length > 0) {
      const totalDamage = attackingEnemies.reduce((total, enemy) => 
        total + enemy.attackDamage, 0
      );
      player.takeDamage(totalDamage);
    }
  }, [enemyManager, player.position, player.takeDamage]);

  /**
   * Handle player healing over time
   * Applies regeneration based on healing stat
   */
  const handlePlayerHealing = useCallback(() => {
    if (combatSystem.performHeal()) {
      player.heal(player.stats.healing);
    }
  }, [combatSystem, player.heal, player.stats.healing]);

  /**
   * Main game update function called by game loop
   * Coordinates all game systems and checks win/lose conditions
   */
  const updateGame = useCallback((currentTime, deltaTime) => {
    // Update game systems
    enemyManager.moveEnemies();
    handleEnemySpawning(currentTime);
    handlePlayerCombat();
    handleEnemyAttacks();
    handlePlayerHealing();
    
    // Check game over condition
    if (player.health <= 0) {
      gameState.setGameStatus('gameOver');
    }
  }, [
    enemyManager,
    handleEnemySpawning,
    handlePlayerCombat,
    handleEnemyAttacks,
    handlePlayerHealing,
    player.health,
    gameState.setGameStatus
  ]);

  // Initialize game loop
  useGameLoop(gameState.gameStatus, updateGame);

  /**
   * Reset game to initial state
   * Coordinates reset across all game systems
   */
  const resetGame = useCallback(() => {
    gameState.resetGame();
    player.resetPlayer();
    enemyManager.resetWave();
    combatSystem.resetCombatTimers();
  }, [gameState, player, enemyManager, combatSystem]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      {/* Game Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white mb-2">Tower Defense Game</h1>
        <div className="flex space-x-4">
          <button
            onClick={gameState.togglePause}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            disabled={gameState.gameStatus === 'gameOver'}
          >
            {gameState.gameStatus === 'playing' ? 'Pause' : 'Resume'}
          </button>
          <button
            onClick={resetGame}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Reset Game
          </button>
        </div>
      </div>

      {/* Game Area */}
      <div 
        className="relative bg-green-800 border-4 border-green-900 rounded-lg overflow-hidden"
        style={{ 
          width: GAME_CONFIG.GAME_WIDTH, 
          height: GAME_CONFIG.GAME_HEIGHT 
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Game Objects */}
        <Player 
          position={player.position}
          health={player.health}
          maxHealth={player.stats.maxHealth}
          stats={player.stats}
        />

        {enemyManager.enemies.map(enemy => (
          <Enemy 
            key={enemy.id}
            enemy={enemy}
          />
        ))}

        {/* UI Components */}
        <GameStats 
          wave={gameState.wave}
          score={gameState.score}
          playerHealth={player.health}
          playerMaxHealth={player.stats.maxHealth}
          gameStatus={gameState.gameStatus}
        />

        <UpgradePanel 
          stats={player.stats}
          points={gameState.upgradePoints}
          onUpgrade={handleUpgrade}
          gameStatus={gameState.gameStatus}
        />

        {/* Game Overlays */}
        <GameOverlay 
          gameStatus={gameState.gameStatus}
          score={gameState.score}
          wave={gameState.wave}
          onRestart={resetGame}
        />
      </div>

      {/* Instructions */}
      <div className="mt-4 text-white text-center max-w-2xl">
        <h3 className="text-lg font-bold mb-2">How to Play:</h3>
        <p className="text-sm">
          Defend your character in the center! Enemies spawn from all sides and move toward you. 
          Your character automatically attacks enemies within range. Use upgrade points to improve 
          your stats and survive longer waves. Gain points by defeating enemies and completing waves.
        </p>
      </div>
    </div>
  );
};

export default TowerDefenseGame;