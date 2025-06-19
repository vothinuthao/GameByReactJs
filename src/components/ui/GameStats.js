import React from 'react';
import { formatNumber } from '../../utils/gameHelpers';

/**
 * Game statistics display component
 * Shows current game state information with dynamic status indicators
 */
const GameStats = ({ 
  wave, 
  score, 
  playerHealth, 
  playerMaxHealth, 
  gameStatus,
  enemiesRemaining = 0,
  upgradePoints = 0 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'playing': return 'text-green-400';
      case 'paused': return 'text-yellow-400';
      case 'gameOver': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white p-4 rounded-lg border border-gray-600 min-w-48">
      <div className="space-y-2">
        <div className="text-lg font-bold text-blue-400 border-b border-gray-600 pb-2">
          Game Statistics
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Wave:</div>
          <div className="font-semibold text-yellow-400">{wave}</div>
          
          <div>Score:</div>
          <div className="font-semibold text-green-400">{formatNumber(score)}</div>
          
          <div>Health:</div>
          <div className="font-semibold">{playerHealth}/{playerMaxHealth}</div>
          
          <div>Points:</div>
          <div className="font-semibold text-purple-400">{upgradePoints}</div>
          
          {enemiesRemaining > 0 && (
            <>
              <div>Enemies:</div>
              <div className="font-semibold text-red-400">{enemiesRemaining}</div>
            </>
          )}
        </div>
        
        <div className="pt-2 border-t border-gray-600">
          <div className="text-xs">Status:</div>
          <div className={`font-bold text-sm ${getStatusColor(gameStatus)}`}>
            {gameStatus.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};
