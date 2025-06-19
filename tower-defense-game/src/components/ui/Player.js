import { GAME_CONFIG } from '../../utils/gameConstants';
import { getPercentage } from '../../utils/gameHelpers';

/**
 * Player component with visual representation and status indicators
 * Displays player character, health bar, and attack range visualization
 */
const Player = ({ position, health, maxHealth, stats, showRange = true }) => {
  const healthPercentage = getPercentage(health, maxHealth);
  
  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{ 
        left: position.x, 
        top: position.y 
      }}
    >
      {/* Attack Range Indicator */}
      {showRange && (
        <div 
          className="absolute border-2 border-blue-300 border-dashed rounded-full opacity-30 pointer-events-none"
          style={{
            width: GAME_CONFIG.PLAYER_ATTACK_RANGE * 2,
            height: GAME_CONFIG.PLAYER_ATTACK_RANGE * 2,
            left: -GAME_CONFIG.PLAYER_ATTACK_RANGE,
            top: -GAME_CONFIG.PLAYER_ATTACK_RANGE,
          }}
        />
      )}
      
      {/* Player Character */}
      <div 
        className="bg-blue-500 rounded-full border-4 border-blue-700 flex items-center justify-center shadow-lg relative z-10"
        style={{ 
          width: GAME_CONFIG.PLAYER_SIZE, 
          height: GAME_CONFIG.PLAYER_SIZE 
        }}
      >
        <span className="text-white font-bold text-lg">🛡️</span>
      </div>
      
      {/* Health Bar */}
      <div className="w-12 h-2 bg-gray-800 rounded mt-2 border border-gray-600">
        <div 
          className={`h-full rounded transition-all duration-300 ${
            healthPercentage > 60 ? 'bg-green-500' :
            healthPercentage > 30 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${healthPercentage}%` }}
        />
      </div>
      
      {/* Health Text */}
      <div className="text-center text-xs text-white font-semibold mt-1">
        {health}/{maxHealth}
      </div>
    </div>
  );
};