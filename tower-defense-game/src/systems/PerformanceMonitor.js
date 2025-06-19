/**
 * Performance monitoring system for optimization
 * Tracks frame rate and optimization metrics
 */
export class PerformanceMonitor {
  constructor() {
    this.frameCount = 0;
    this.lastFpsUpdate = 0;
    this.currentFps = 60;
    this.updateInterval = 1000; // Update FPS every second
    this.performanceMetrics = {
      averageFps: 60,
      minFps: 60,
      maxFps: 60,
      frameTimeHistory: [],
    };
  }

  /**
   * Update performance metrics
   */
  update(currentTime, deltaTime) {
    this.frameCount++;
    this.performanceMetrics.frameTimeHistory.push(deltaTime);

    // Keep only last 60 frames for averaging
    if (this.performanceMetrics.frameTimeHistory.length > 60) {
      this.performanceMetrics.frameTimeHistory.shift();
    }

    // Update FPS calculation
    if (currentTime - this.lastFpsUpdate >= this.updateInterval) {
      this.currentFps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsUpdate = currentTime;

      // Update metrics
      this.performanceMetrics.minFps = Math.min(this.performanceMetrics.minFps, this.currentFps);
      this.performanceMetrics.maxFps = Math.max(this.performanceMetrics.maxFps, this.currentFps);
      
      const avgFrameTime = this.performanceMetrics.frameTimeHistory.reduce((a, b) => a + b, 0) / 
                          this.performanceMetrics.frameTimeHistory.length;
      this.performanceMetrics.averageFps = Math.round(1000 / avgFrameTime);
    }
  }

  /**
   * Get current performance statistics
   */
  getMetrics() {
    return {
      ...this.performanceMetrics,
      currentFps: this.currentFps,
    };
  }

  /**
   * Check if performance optimization is needed
   */
  shouldOptimize() {
    return this.currentFps < 30 || this.performanceMetrics.averageFps < 40;
  }

  /**
   * Reset performance tracking
   */
  reset() {
    this.frameCount = 0;
    this.lastFpsUpdate = 0;
    this.currentFps = 60;
    this.performanceMetrics = {
      averageFps: 60,
      minFps: 60,
      maxFps: 60,
      frameTimeHistory: [],
    };
  }
}