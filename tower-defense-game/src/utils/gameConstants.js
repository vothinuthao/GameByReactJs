export const GAME_CONFIG = {
  GAME_WIDTH: 800,
  GAME_HEIGHT: 600,
  PLAYER_SIZE: 40,
  ENEMY_SIZE: 30,
  PLAYER_ATTACK_RANGE: 100,
  BASE_SPAWN_RATE: 2000,
  TARGET_FPS: 60,

  WAVE_DIFFICULTY_MULTIPLIER: 0.2,
  ENEMY_HEALTH_BASE: 20,
  ENEMY_HEALTH_PER_WAVE: 5,
};

export const UI_CONFIG = {
  HEALTH_BAR_WIDTH: 12,
  HEALTH_BAR_HEIGHT: 2,
  UPGRADE_PANEL_WIDTH: 264,
  STATS_PANEL_MIN_WIDTH: 192,
};

export const UPGRADE_CONFIG = {
  attack: { cost: 1, increment: 5, icon: '⚔️', label: 'Attack' },
  defense: { cost: 1, increment: 5, icon: '🛡️', label: 'Defense' },
  attackSpeed: { cost: 2, increment: -100, icon: '⚡', label: 'Attack Speed' },
  healing: { cost: 3, increment: 1, icon: '❤️', label: 'Healing' },
  maxHealth: { cost: 2, increment: 20, icon: '💪', label: 'Max Health' },
};

export const ENEMY_CONFIG = {
  baseHealth: 20,
  healthPerWave: 5,
  baseSpeed: 1,
  speedPerWave: 0.1,
  baseDamage: 5,
  damagePerWave: 0.5,
};

export const UPGRADE_DEFINITIONS = {
  attack: {
    cost: 1,
    increment: 5,
    icon: '⚔️',
    label: 'Attack Power',
    description: 'Increase damage dealt to enemies',
  },
  defense: {
    cost: 1,
    increment: 5,
    icon: '🛡️',
    label: 'Defense',
    description: 'Reduce damage taken from enemies',
  },
  attackSpeed: {
    cost: 2,
    increment: -100,
    icon: '⚡',
    label: 'Attack Speed',
    description: 'Attack more frequently',
    minValue: 100,
  },
  healing: {
    cost: 3,
    increment: 1,
    icon: '❤️',
    label: 'Regeneration',
    description: 'Heal faster over time',
  },
  maxHealth: {
    cost: 2,
    increment: 20,
    icon: '💪',
    label: 'Max Health',
    description: 'Increase maximum health capacity',
  },
};