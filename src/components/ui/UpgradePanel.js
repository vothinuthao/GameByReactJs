import { UPGRADE_CONFIG } from '../../utils/gameConstants';

/**
 * Player upgrade interface component
 * Provides interactive upgrade purchasing with cost validation
 */
const UpgradePanel = ({ stats, points, onUpgrade, gameStatus, className = "" }) => {
  const canAfford = (cost) => points >= cost;
  const isGameActive = gameStatus === 'playing';

  return (
    <div className={`absolute top-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg border border-gray-600 w-64 ${className}`}>
      <div className="text-lg font-bold text-purple-400 mb-3 border-b border-gray-600 pb-2">
        Character Upgrades
      </div>
      
      <div className="mb-3 text-center">
        <span className="text-sm text-gray-300">Available Points: </span>
        <span className="text-lg font-bold text-purple-400">{points}</span>
      </div>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {Object.entries(UPGRADE_CONFIG).map(([key, config]) => {
          const currentValue = stats[key];
          const affordable = canAfford(config.cost);
          const canUpgrade = affordable && isGameActive;
          
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
                onClick={() => onUpgrade(key, config.cost)}
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
      
      {!isGameActive && (
        <div className="mt-3 text-center text-xs text-yellow-400">
          Game must be active to upgrade
        </div>
      )}
    </div>
  );
};
