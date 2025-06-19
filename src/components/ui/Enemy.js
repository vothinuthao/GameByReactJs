import { GAME_CONFIG } from '../../utils/gameConstants';
import { getPercentage } from '../../utils/gameHelpers';

/**
 * Enemy component with dynamic visual states
 * Displays enemy character with health indication and movement animations
 */
const Enemy = ({ enemy, isTargeted = false, showHealthBar = true }) => {
  const healthPercentage = getPercentage(enemy.health, enemy.maxHealth);
  const isDamaged = enemy.health < enemy.maxHealth;
  
  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100"
      style={{ 
        left: enemy.x, 
        top: enemy.y 
      }}
    >
      {/* Target Indicator */}
      {isTargeted && (
        <div 
          className="absolute border-2 border-red-400 rounded-full animate-pulse"
          style={{
            width: GAME_CONFIG.ENEMY_SIZE + 10,
            height: GAME_CONFIG.ENEMY_SIZE + 10,
            left: -5,
            top: -5,
          }}
        />
      )}
      
      {/* Enemy Character */}
      <div 
        className={`bg-red-500 rounded-full border-2 border-red-700 flex items-center justify-center shadow-md relative z-10 transition-all duration-200 ${
          isDamaged ? 'animate-pulse' : ''
        } ${isTargeted ? 'scale-110' : ''}`}
        style={{ 
          width: GAME_CONFIG.ENEMY_SIZE, 
          height: GAME_CONFIG.ENEMY_SIZE 
        }}
      >
        <span className="text-white font-bold text-sm">👹</span>
      </div>
      
      {/* Health Bar */}
      {showHealthBar && (
        <div className="w-8 h-1 bg-gray-800 rounded mt-1 border border-gray-600">
          <div 
            className="h-full bg-red-500 rounded transition-all duration-200"
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
      )}
    </div>
  );
};
