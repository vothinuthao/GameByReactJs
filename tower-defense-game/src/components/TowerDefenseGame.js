import React, { useCallback, useState, useRef, useEffect } from 'react';
import { GAME_CONFIG, UPGRADE_CONFIG } from '../utils/gameConstants';

/**
 * Complete Tower Defense Game Component
 * Includes all game logic, styling, and functionality
 */
const TowerDefenseGame = () => {
  // Game State
  const [gameStatus, setGameStatus] = useState('playing');
  const [wave, setWave] = useState(1);
  const [score, setScore] = useState(0);
  const [upgradePoints, setUpgradePoints] = useState(3);
  
  // Player State
  const [playerHealth, setPlayerHealth] = useState(100);
  const [playerStats, setPlayerStats] = useState({
    maxHealth: 100,
    attack: 10,
    defense: 5,
    attackSpeed: 1000,
    healing: 1,
  });
  
  // Enemy State
  const [enemies, setEnemies] = useState([]);
  const enemyIdCounter = useRef(0);
  const lastAttackTime = useRef(0);
  const lastHealTime = useRef(0);
  const lastSpawnTime = useRef(0);
  const waveEnemiesSpawned = useRef(0);
  const gameLoopRef = useRef();

  // Player position (center of game area)
  const playerPosition = {
    x: GAME_CONFIG.GAME_WIDTH / 2,
    y: GAME_CONFIG.GAME_HEIGHT / 2
  };

  // Helper functions
  const formatNumber = (num) => num.toLocaleString();
  const getPercentage = (current, max) => Math.max(0, Math.min(100, (current / max) * 100));
  const calculateDistance = (pos1, pos2) => {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Game Logic Functions
  const getRandomSpawnPosition = useCallback(() => {
    const side = Math.floor(Math.random() * 4);
    switch (side) {
      case 0: return { x: Math.random() * GAME_CONFIG.GAME_WIDTH, y: -50 };
      case 1: return { x: GAME_CONFIG.GAME_WIDTH + 50, y: Math.random() * GAME_CONFIG.GAME_HEIGHT };
      case 2: return { x: Math.random() * GAME_CONFIG.GAME_WIDTH, y: GAME_CONFIG.GAME_HEIGHT + 50 };
      case 3: return { x: -50, y: Math.random() * GAME_CONFIG.GAME_HEIGHT };
      default: return { x: 0, y: 0 };
    }
  }, []);

  const createEnemy = useCallback(() => {
    const spawnPosition = getRandomSpawnPosition();
    const enemyHealth = 20 + wave * 5;
    
    return {
      id: ++enemyIdCounter.current,
      x: spawnPosition.x,
      y: spawnPosition.y,
      health: enemyHealth,
      maxHealth: enemyHealth,
      speed: 1 + wave * 0.1,
      attackDamage: 5 + Math.floor(wave / 2),
    };
  }, [wave, getRandomSpawnPosition]);

  const spawnEnemy = useCallback(() => {
    const currentTime = Date.now();
    const spawnRate = Math.max(500, GAME_CONFIG.BASE_SPAWN_RATE / wave);
    const enemiesForWave = wave * 5;
    
    if (currentTime - lastSpawnTime.current >= spawnRate && 
        waveEnemiesSpawned.current < enemiesForWave) {
      setEnemies(prev => [...prev, createEnemy()]);
      waveEnemiesSpawned.current += 1;
      lastSpawnTime.current = currentTime;
    }
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
  }, []);

  const playerAttack = useCallback(() => {
    const currentTime = Date.now();
    if (currentTime - lastAttackTime.current >= playerStats.attackSpeed) {
      const enemiesInRange = enemies.filter(enemy => 
        calculateDistance(playerPosition, enemy) <= GAME_CONFIG.PLAYER_ATTACK_RANGE
      );
      
      if (enemiesInRange.length > 0) {
        const target = enemiesInRange[0];
        setEnemies(prev => 
          prev.map(enemy => {
            if (enemy.id === target.id) {
              const newHealth = enemy.health - playerStats.attack;
              if (newHealth <= 0) {
                setScore(s => s + 10);
                setUpgradePoints(p => p + 1);
                return null;
              }
              return { ...enemy, health: newHealth };
            }
            return enemy;
          }).filter(Boolean)
        );
        lastAttackTime.current = currentTime;
      }
    }
  }, [enemies, playerStats.attack, playerStats.attackSpeed]);

  const enemyAttack = useCallback(() => {
    const attackingEnemies = enemies.filter(enemy => 
      calculateDistance(playerPosition, enemy) <= GAME_CONFIG.ENEMY_SIZE
    );
    
    if (attackingEnemies.length > 0) {
      const totalDamage = attackingEnemies.reduce((total, enemy) => 
        total + enemy.attackDamage, 0
      );
      const actualDamage = Math.max(1, totalDamage - playerStats.defense);
      setPlayerHealth(prev => Math.max(0, prev - actualDamage));
    }
  }, [enemies, playerStats.defense]);

  const playerHeal = useCallback(() => {
    const currentTime = Date.now();
    if (currentTime - lastHealTime.current >= 1000) {
      setPlayerHealth(prev => Math.min(playerStats.maxHealth, prev + playerStats.healing));
      lastHealTime.current = currentTime;
    }
  }, [playerStats.maxHealth, playerStats.healing]);

  const checkWaveComplete = useCallback(() => {
    const enemiesForWave = wave * 5;
    if (waveEnemiesSpawned.current >= enemiesForWave && enemies.length === 0) {
      setWave(prev => prev + 1);
      setUpgradePoints(prev => prev + 2);
      waveEnemiesSpawned.current = 0;
    }
  }, [wave, enemies.length]);

  // Game Loop
  const gameUpdate = useCallback(() => {
    if (gameStatus !== 'playing') return;
    
    moveEnemies();
    spawnEnemy();
    playerAttack();
    enemyAttack();
    playerHeal();
    checkWaveComplete();
    
    if (playerHealth <= 0) {
      setGameStatus('gameOver');
    }
  }, [gameStatus, moveEnemies, spawnEnemy, playerAttack, enemyAttack, playerHeal, checkWaveComplete, playerHealth]);

  // Game Loop Effect
  useEffect(() => {
    if (gameStatus === 'playing') {
      gameLoopRef.current = setInterval(gameUpdate, 1000 / 60);
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
  }, [gameUpdate, gameStatus]);

  // Event Handlers
  const handleUpgrade = useCallback((statKey, cost) => {
    if (upgradePoints >= cost && gameStatus === 'playing') {
      setUpgradePoints(prev => prev - cost);
      
      const upgradeValues = {
        attack: 5,
        defense: 5,
        attackSpeed: -100,
        healing: 1,
        maxHealth: 20
      };
      
      setPlayerStats(prev => ({
        ...prev,
        [statKey]: prev[statKey] + upgradeValues[statKey]
      }));

      if (statKey === 'maxHealth') {
        setPlayerHealth(prev => prev + upgradeValues[statKey]);
      }
    }
  }, [upgradePoints, gameStatus]);

  const togglePause = useCallback(() => {
    setGameStatus(prev => prev === 'playing' ? 'paused' : 'playing');
  }, []);

  const resetGame = useCallback(() => {
    setGameStatus('playing');
    setWave(1);
    setScore(0);
    setUpgradePoints(3);
    setPlayerHealth(100);
    setPlayerStats({
      maxHealth: 100,
      attack: 10,
      defense: 5,
      attackSpeed: 1000,
      healing: 1,
    });
    setEnemies([]);
    enemyIdCounter.current = 0;
    waveEnemiesSpawned.current = 0;
    lastAttackTime.current = 0;
    lastHealTime.current = 0;
    lastSpawnTime.current = 0;
  }, []);

  // Component Rendering
  const Player = ({ position, health, maxHealth }) => {
    const healthPercentage = getPercentage(health, maxHealth);
    
    return (
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: position.x, top: position.y }}
      >
        <div 
          className="absolute border-2 border-blue-300 border-dashed rounded-full opacity-30"
          style={{
            width: GAME_CONFIG.PLAYER_ATTACK_RANGE * 2,
            height: GAME_CONFIG.PLAYER_ATTACK_RANGE * 2,
            left: -GAME_CONFIG.PLAYER_ATTACK_RANGE,
            top: -GAME_CONFIG.PLAYER_ATTACK_RANGE,
          }}
        />
        <div 
          className="bg-blue-500 rounded-full border-4 border-blue-700 flex items-center justify-center shadow-lg relative z-10"
          style={{ width: GAME_CONFIG.PLAYER_SIZE, height: GAME_CONFIG.PLAYER_SIZE }}
        >
          <span className="text-white font-bold text-lg">🛡️</span>
        </div>
        <div className="w-12 h-2 bg-gray-800 rounded mt-2 border border-gray-600">
          <div 
            className={`h-full rounded transition-all duration-300 ${
              healthPercentage > 60 ? 'bg-green-500' :
              healthPercentage > 30 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
        <div className="text-center text-xs text-white font-semibold mt-1">
          {health}/{maxHealth}
        </div>
      </div>
    );
  };

  const Enemy = ({ enemy }) => {
    const healthPercentage = getPercentage(enemy.health, enemy.maxHealth);
    
    return (
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: enemy.x, top: enemy.y }}
      >
        <div 
          className="bg-red-500 rounded-full border-4 border-red-700 flex items-center justify-center shadow-lg"
          style={{ width: GAME_CONFIG.ENEMY_SIZE, height: GAME_CONFIG.ENEMY_SIZE }}
        >
          <span className="text-white font-bold text-sm">👹</span>
        </div>
        <div className="w-8 h-1 bg-gray-800 rounded mt-1 border border-gray-600">
          <div 
            className="h-full bg-red-500 rounded transition-all duration-200"
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
      </div>
    );
  };

  const GameStats = () => (
    <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white p-4 rounded-lg border border-gray-600 min-w-48">
      <div className="text-lg font-bold text-blue-400 mb-3 border-b border-gray-600 pb-2">
        Game Status
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Wave:</span>
          <span className="text-lg font-bold text-yellow-400">{wave}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Score:</span>
          <span className="text-lg font-bold text-green-400">{formatNumber(score)}</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Health:</span>
            <span className="text-sm font-semibold">{playerHealth}/{playerStats.maxHealth}</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded border border-gray-600">
            <div 
              className={`h-full rounded transition-all duration-300 ${
                getPercentage(playerHealth, playerStats.maxHealth) > 60 ? 'bg-green-500' :
                getPercentage(playerHealth, playerStats.maxHealth) > 30 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${getPercentage(playerHealth, playerStats.maxHealth)}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Status:</span>
          <span className={`text-sm font-semibold capitalize ${
            gameStatus === 'playing' ? 'text-green-400' :
            gameStatus === 'paused' ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {gameStatus}
          </span>
        </div>
      </div>
    </div>
  );

  const UpgradePanel = () => (
    <div className="absolute top-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg border border-gray-600 w-64">
      <div className="text-lg font-bold text-purple-400 mb-3 border-b border-gray-600 pb-2">
        Character Upgrades
      </div>
      <div className="mb-3 text-center">
        <span className="text-sm text-gray-300">Available Points: </span>
        <span className="text-lg font-bold text-purple-400">{upgradePoints}</span>
      </div>
      <div className="space-y-2">
        {Object.entries(UPGRADE_CONFIG).map(([key, config]) => {
          const currentValue = playerStats[key];
          const canAfford = upgradePoints >= config.cost;
          const canUpgrade = canAfford && gameStatus === 'playing';
          
          return (
            <div 
              key={key} 
              className={`flex items-center justify-between p-2 rounded border transition-all duration-200 ${
                canUpgrade ? 'border-gray-600 hover:border-purple-400 hover:bg-gray-800' : 'border-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2 flex-1">
                <span className="text-lg">{config.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{config.label}</div>
                  <div className="text-xs text-gray-400">
                    Current: {key === 'attackSpeed' ? `${currentValue}ms` : currentValue}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleUpgrade(key, config.cost)}
                disabled={!canUpgrade}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all duration-200 ${
                  canUpgrade 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {config.cost} pt
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const GameOverlay = () => {
    if (gameStatus === 'playing') return null;

    const overlayContent = {
      paused: {
        title: "Game Paused",
        subtitle: "Press Resume to continue",
        titleColor: "text-yellow-400",
        showStats: false,
        actions: (
          <button
            onClick={togglePause}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold"
          >
            Resume Game
          </button>
        )
      },
      gameOver: {
        title: "Game Over!",
        subtitle: "Your defense has fallen",
        titleColor: "text-red-400",
        showStats: true,
        actions: (
          <div className="space-y-3">
            <button
              onClick={resetGame}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-semibold w-full"
            >
              Play Again
            </button>
          </div>
        )
      }
    };

    const content = overlayContent[gameStatus];
    if (!content) return null;

    return (
      <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-4">
          <h2 className={`text-4xl font-bold mb-2 ${content.titleColor}`}>
            {content.title}
          </h2>
          <p className="text-lg mb-6 text-gray-300">
            {content.subtitle}
          </p>
          {content.showStats && (
            <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-600">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">Final Statistics</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Final Score</div>
                  <div className="text-lg font-bold text-green-400">{formatNumber(score)}</div>
                </div>
                <div>
                  <div className="text-gray-400">Wave Reached</div>
                  <div className="text-lg font-bold text-yellow-400">{wave}</div>
                </div>
              </div>
            </div>
          )}
          {content.actions}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white mb-2">Tower Defense Game</h1>
        <div className="flex space-x-4">
          <button
            onClick={togglePause}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            disabled={gameStatus === 'gameOver'}
          >
            {gameStatus === 'playing' ? 'Pause' : 'Resume'}
          </button>
          <button
            onClick={resetGame}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Reset Game
          </button>
        </div>
      </div>

      <div 
        className="relative bg-green-800 border-4 border-green-900 rounded-lg overflow-hidden"
        style={{ width: GAME_CONFIG.GAME_WIDTH, height: GAME_CONFIG.GAME_HEIGHT }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <Player 
          position={playerPosition}
          health={playerHealth}
          maxHealth={playerStats.maxHealth}
        />

        {enemies.map(enemy => (
          <Enemy key={enemy.id} enemy={enemy} />
        ))}

        <GameStats />
        <UpgradePanel />
        <GameOverlay />
      </div>

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