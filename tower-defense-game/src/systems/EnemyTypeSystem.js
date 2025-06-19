
/**
 * Advanced enemy type system with different behaviors and characteristics
 * Provides variety in gameplay through diverse enemy mechanics
 */
export class EnemyTypeSystem {
  static ENEMY_TYPES = {
    BASIC: {
      id: 'basic',
      name: 'Grunt',
      icon: '👹',
      baseHealth: 20,
      baseSpeed: 1,
      baseDamage: 5,
      color: 'bg-red-500',
      borderColor: 'border-red-700',
      reward: 10,
      upgradePoints: 1,
      size: 30,
      spawnWeight: 70, // Higher weight = more common
    },
    FAST: {
      id: 'fast',
      name: 'Scout',
      icon: '🏃',
      baseHealth: 15,
      baseSpeed: 2,
      baseDamage: 3,
      color: 'bg-yellow-500',
      borderColor: 'border-yellow-700',
      reward: 15,
      upgradePoints: 1,
      size: 25,
      spawnWeight: 20,
    },
    TANK: {
      id: 'tank',
      name: 'Bruiser',
      icon: '🛡️',
      baseHealth: 50,
      baseSpeed: 0.5,
      baseDamage: 10,
      color: 'bg-gray-600',
      borderColor: 'border-gray-800',
      reward: 25,
      upgradePoints: 2,
      size: 40,
      spawnWeight: 10,
    },
    BOSS: {
      id: 'boss',
      name: 'Demon Lord',
      icon: '👿',
      baseHealth: 100,
      baseSpeed: 0.8,
      baseDamage: 15,
      color: 'bg-purple-600',
      borderColor: 'border-purple-800',
      reward: 50,
      upgradePoints: 5,
      size: 50,
      spawnWeight: 1,
      isBoss: true,
    }
  };
  static selectEnemyType(wave) {
    const availableTypes = Object.values(this.ENEMY_TYPES).filter(type => {
      if (type.isBoss) return wave % 5 === 0 && wave >= 5;
      return true;
    });

    const totalWeight = availableTypes.reduce((sum, type) => sum + type.spawnWeight, 0);
    let random = Math.random() * totalWeight;

    for (const type of availableTypes) {
      random -= type.spawnWeight;
      if (random <= 0) return type;
    }

    return this.ENEMY_TYPES.BASIC; // Fallback
  }

  static createTypedEnemy(type, wave, spawnPosition, enemyId) {
    const waveMultiplier = 1 + (wave - 1) * 0.2;
    
    return {
      id: enemyId,
      type: type.id,
      x: spawnPosition.x,
      y: spawnPosition.y,
      health: Math.round(type.baseHealth * waveMultiplier),
      maxHealth: Math.round(type.baseHealth * waveMultiplier),
      speed: type.baseSpeed + wave * 0.05,
      attackDamage: Math.round(type.baseDamage * waveMultiplier),
      reward: Math.round(type.reward * waveMultiplier),
      upgradePoints: type.upgradePoints,
      size: type.size,
      color: type.color,
      borderColor: type.borderColor,
      icon: type.icon,
      name: type.name,
      isBoss: type.isBoss || false,
    };
  }
}