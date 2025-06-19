// systems/ParticleSystem.js
/**
 * Particle system for visual effects and feedback
 * Enhances game feel through dynamic visual elements
 */
export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.nextId = 0;
  }

  /**
   * Create explosion effect at specified position
   */
  createExplosion(x, y, options = {}) {
    const {
      count = 8,
      colors = ['#ff6b6b', '#ffa500', '#ffff00'],
      size = 3,
      speed = 100,
      lifetime = 1000,
    } = options;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const velocity = {
        x: Math.cos(angle) * speed * (0.5 + Math.random() * 0.5),
        y: Math.sin(angle) * speed * (0.5 + Math.random() * 0.5),
      };

      this.particles.push({
        id: this.nextId++,
        x: x,
        y: y,
        velocity: velocity,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: size * (0.5 + Math.random() * 0.5),
        lifetime: lifetime,
        age: 0,
        type: 'explosion',
      });
    }
  }

  /**
   * Create healing effect particles
   */
  createHealingEffect(x, y, options = {}) {
    const {
      count = 5,
      color = '#00ff00',
      size = 2,
      speed = 50,
      lifetime = 2000,
    } = options;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        id: this.nextId++,
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        velocity: {
          x: (Math.random() - 0.5) * speed,
          y: -Math.random() * speed,
        },
        color: color,
        size: size,
        lifetime: lifetime,
        age: 0,
        type: 'healing',
      });
    }
  }

  /**
   * Create damage number floating text
   */
  createDamageNumber(x, y, damage, options = {}) {
    const {
      color = '#ff0000',
      size = 16,
      lifetime = 1500,
    } = options;

    this.particles.push({
      id: this.nextId++,
      x: x + (Math.random() - 0.5) * 20,
      y: y,
      velocity: {
        x: (Math.random() - 0.5) * 30,
        y: -80,
      },
      color: color,
      size: size,
      lifetime: lifetime,
      age: 0,
      type: 'text',
      text: `-${damage}`,
    });
  }

  /**
   * Update all particles
   */
  update(deltaTime) {
    this.particles = this.particles.filter(particle => {
      particle.age += deltaTime;
      
      if (particle.age >= particle.lifetime) {
        return false; // Remove expired particle
      }

      // Update position
      particle.x += particle.velocity.x * (deltaTime / 1000);
      particle.y += particle.velocity.y * (deltaTime / 1000);

      // Apply gravity to explosion particles
      if (particle.type === 'explosion') {
        particle.velocity.y += 200 * (deltaTime / 1000);
      }

      return true;
    });
  }

  /**
   * Get particles for rendering
   */
  getParticles() {
    return this.particles.map(particle => ({
      ...particle,
      opacity: 1 - (particle.age / particle.lifetime),
    }));
  }

  /**
   * Clear all particles
   */
  clear() {
    this.particles = [];
  }
}