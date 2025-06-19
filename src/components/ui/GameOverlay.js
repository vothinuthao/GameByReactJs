import { formatNumber } from '../../utils/gameHelpers';

/**
 * Game overlay component for pause and game over states
 * Provides contextual information and action buttons
 */
const GameOverlay = ({ gameStatus, score, wave, onRestart, onResume, className = "" }) => {
  if (gameStatus === 'playing') return null;

  const overlayContent = {
    paused: {
      title: "Game Paused",
      subtitle: "Press Resume to continue",
      titleColor: "text-yellow-400",
      showStats: false,
      actions: (
        <button
          onClick={onResume}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-200"
        >
          Resume Game
        </button>
      )
    },
    gameOver: {
      title: "Game Over!",
      subtitle: "Your defense has fallen",
      titleColor: "text-red-400",
      showStats: true,
      actions: (
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-200 w-full"
          >
            Play Again
          </button>
          <div className="text-center text-sm text-gray-400">
            Challenge yourself to beat your record!
          </div>
        </div>
      )
    }
  };

  const content = overlayContent[gameStatus];
  if (!content) return null;

  return (
    <div className={`absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center ${className}`}>
      <div className="text-center text-white max-w-md mx-4">
        <h2 className={`text-4xl font-bold mb-2 ${content.titleColor}`}>
          {content.title}
        </h2>
        
        <p className="text-lg mb-6 text-gray-300">
          {content.subtitle}
        </p>
        
        {content.showStats && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-600">
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Final Statistics</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Final Score</div>
                <div className="text-lg font-bold text-green-400">{formatNumber(score)}</div>
              </div>
              <div>
                <div className="text-gray-400">Wave Reached</div>
                <div className="text-lg font-bold text-yellow-400">{wave}</div>
              </div>
            </div>
          </div>
        )}
        
        {content.actions}
      </div>
    </div>
  );
};