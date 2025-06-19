export class PowerUpSystem {
  static POWER_UP_TYPES = {
    DAMAGE_BOOST: {
      id: 'damage_boost',
      name: 'Damage Surge',
      icon: '⚔️',
      duration: 10000, // 10 seconds
      color: 'bg-red-500',
      effect: (stats) => ({ ...stats, attack: stats.attack * 2 }),
      description: 'Double attack damage for 10 seconds',
    },
    SPEED_BOOST: {
      id: 'speed_boost',
      name: 'Rapid Fire',
      icon: '⚡',
      duration: 8000,
      color: 'bg-yellow-500',
      effect: (stats) => ({ ...stats, attackSpeed: Math.max(100, stats.attackSpeed * 0.3) }),
      description: 'Greatly increased attack speed',
    },
    SHIELD: {
      id: 'shield',
      name: 'Barrier Shield',
      icon: '🛡️',
      duration: 15000,
      color: 'bg-blue-500',
      effect: (stats) => ({ ...stats, defense: stats.defense + 20 }),
      description: 'Massive defense boost for 15 seconds',
    },
    HEALING: {
      id: 'healing',
      name: 'Regeneration',
      icon: '❤️',
      duration: 12000,
      color: 'bg-green-500',
      effect: (stats) => ({ ...stats, healing: stats.healing + 5 }),
      description: 'Greatly enhanced healing rate',
    }
  };

  constructor() {
    this.activePowerUps = new Map();
    this.spawnCooldown = 0;
    this.powerUpInstances = [];
  }
  update(currentTime, deltaTime) {
    this.spawnCooldown -= deltaTime;
    this.updateActivePowerUps(currentTime);
  }

  shouldSpawnPowerUp() {
    return this.spawnCooldown <= 0 && Math.random() < 0.02;
  }
  spawnPowerUp(gameWidth, gameHeight) {
    if (!this.shouldSpawnPowerUp()) return null;

    const types = Object.values(PowerUpSystem.POWER_UP_TYPES);
    const selectedType = types[Math.floor(Math.random() * types.length)];
    
    const powerUp = {
      id: Date.now(),
      type: selectedType,
      x: Math.random() * (gameWidth - 100) + 50,
      y: Math.random() * (gameHeight - 100) + 50,
      createdAt: Date.now(),
      collected: false,
    };

    this.powerUpInstances.push(powerUp);
    this.spawnCooldown = 15000 + Math.random() * 10000;

    return powerUp;
  }
  collectPowerUp(powerUpId, playerStats) {
    const powerUpIndex = this.powerUpInstances.findIndex(p => p.id === powerUpId);
    if (powerUpIndex === -1) return playerStats;

    const powerUp = this.powerUpInstances[powerUpIndex];
    const endTime = Date.now() + powerUp.type.duration;

    this.powerUpInstances.splice(powerUpIndex, 1);

    this.activePowerUps.set(powerUp.type.id, {
      type: powerUp.type,
      endTime: endTime,
    });

    return this.applyAllEffects(playerStats);
  }
  applyAllEffects(baseStats) {
    let modifiedStats = { ...baseStats };

    this.activePowerUps.forEach((powerUp) => {
      modifiedStats = powerUp.type.effect(modifiedStats);
    });

    return modifiedStats;
  }

  /**
   * Update active power-ups and remove expired ones
   */
  updateActivePowerUps(currentTime) {
    const expiredPowerUps = [];

    this.activePowerUps.forEach((powerUp, id) => {
      if (currentTime >= powerUp.endTime) {
        expiredPowerUps.push(id);
      }
    });

    expiredPowerUps.forEach(id => this.activePowerUps.delete(id));
  }

  /**
   * Get currently active power-ups for UI display
   */
  getActivePowerUps() {
    return Array.from(this.activePowerUps.values());
  }

  /**
   * Reset power-up system
   */
  reset() {
    this.activePowerUps.clear();
    this.powerUpInstances = [];
    this.spawnCooldown = 0;
  }
}