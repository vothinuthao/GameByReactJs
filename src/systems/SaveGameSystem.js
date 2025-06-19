/**
 * Save game system for persistent progress
 * Handles local storage and game state serialization
 */
export class SaveGameSystem {
  static SAVE_KEY = 'tower_defense_save';

  /**
   * Save current game state to local storage
   */
  static saveGame(gameState) {
    const saveData = {
      highScore: gameState.highScore || 0,
      highestWave: gameState.highestWave || 1,
      totalGamesPlayed: gameState.totalGamesPlayed || 0,
      totalEnemiesDefeated: gameState.totalEnemiesDefeated || 0,
      achievements: gameState.achievements || [],
      settings: gameState.settings || {},
      savedAt: Date.now(),
    };

    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
      return true;
    } catch (error) {
      console.warn('Failed to save game data:', error);
      return false;
    }
  }

  /**
   * Load game state from local storage
   */
  static loadGame() {
    try {
      const savedData = localStorage.getItem(this.SAVE_KEY);
      if (!savedData) return null;

      const gameData = JSON.parse(savedData);
      
      // Validate save data structure
      if (!gameData.savedAt || typeof gameData.highScore !== 'number') {
        return null;
      }

      return gameData;
    } catch (error) {
      console.warn('Failed to load game data:', error);
      return null;
    }
  }

  /**
   * Update high scores and statistics
   */
  static updateStats(currentScore, currentWave, enemiesDefeated = 0) {
    const existingData = this.loadGame() || {};
    
    const updatedData = {
      ...existingData,
      highScore: Math.max(existingData.highScore || 0, currentScore),
      highestWave: Math.max(existingData.highestWave || 1, currentWave),
      totalGamesPlayed: (existingData.totalGamesPlayed || 0) + 1,
      totalEnemiesDefeated: (existingData.totalEnemiesDefeated || 0) + enemiesDefeated,
    };

    return this.saveGame(updatedData);
  }

  /**
   * Clear all saved data
   */
  static clearSave() {
    try {
      localStorage.removeItem(this.SAVE_KEY);
      return true;
    } catch (error) {
      console.warn('Failed to clear save data:', error);
      return false;
    }
  }
}