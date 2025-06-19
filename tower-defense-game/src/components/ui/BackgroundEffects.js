/**
 * Background visual effects component
 * Provides animated background elements and atmosphere
 */
const BackgroundEffects = ({ 
  showGrid = true, 
  showParticles = false, 
  animated = true,
  className = "" 
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Grid Pattern */}
      {showGrid && (
        <div 
          className="w-full h-full opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}
        />
      )}
      
      {/* Animated Particles */}
      {showParticles && (
        <div className="w-full h-full">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-white opacity-30 rounded-full ${
                animated ? 'animate-pulse' : ''
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { Player, Enemy, GameStats, UpgradePanel, GameOverlay, BackgroundEffects };