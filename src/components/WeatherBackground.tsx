
import React, { useEffect, useState } from 'react';
import { WeatherCondition, getWeatherBackground } from '@/utils/iconMap';
import { motion, AnimatePresence } from 'framer-motion';

interface WeatherBackgroundProps {
  condition: WeatherCondition;
  sunriseTime?: number;
  sunsetTime?: number;
}

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ 
  condition,
  sunriseTime,
  sunsetTime
}) => {
  const [backgroundClass, setBackgroundClass] = useState('');
  
  useEffect(() => {
    const bgClass = getWeatherBackground(condition, sunsetTime, sunriseTime);
    setBackgroundClass(bgClass);
  }, [condition, sunriseTime, sunsetTime]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={backgroundClass}
        className={`absolute inset-0 w-full h-full ${backgroundClass}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
      >
        {/* Add decorative elements based on weather condition */}
        {condition.includes('rain') && (
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-0.5 bg-blue-200 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-20px`,
                  height: `${Math.random() * 10 + 15}px`,
                  opacity: Math.random() * 0.5 + 0.5,
                  animationDuration: `${Math.random() * 1 + 0.5}s`,
                  animationDelay: `${Math.random() * 2}s`,
                  animation: `rainDrop ${Math.random() * 1 + 0.5}s linear ${Math.random() * 5}s infinite`
                }}
              />
            ))}
          </div>
        )}
        
        {condition.includes('cloud') && (
          <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div 
                key={i}
                className="absolute bg-white rounded-full blur-3xl"
                style={{
                  width: `${Math.random() * 300 + 200}px`,
                  height: `${Math.random() * 150 + 100}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 30}%`,
                  opacity: Math.random() * 0.3 + 0.2,
                }}
                animate={{
                  x: [0, Math.random() * 50 - 25, 0],
                  y: [0, Math.random() * 20 - 10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: Math.random() * 60 + 30,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}
        
        {condition.includes('clear') && !condition.includes('night') && (
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-yellow-300 blur-3xl opacity-40 pointer-events-none" />
        )}
        
        {condition.includes('night') && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
              <div 
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 60}%`,
                  opacity: Math.random() * 0.8 + 0.2,
                  animation: `twinkle ${Math.random() * 5 + 2}s ease-in-out infinite ${Math.random() * 5}s`
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// Add animation keyframes to global style
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes rainDrop {
    0% { transform: translateY(-20px); }
    100% { transform: translateY(calc(100vh + 20px)); }
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  @keyframes twinkle {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 1; }
  }
`, styleSheet.cssRules.length);

export default WeatherBackground;
