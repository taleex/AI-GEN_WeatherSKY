
import React, { useEffect, useState, useRef } from 'react';
import { WeatherCondition, getWeatherBackground } from '@/utils/iconMap';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cloudsControls = useAnimation();
  const starsControls = useAnimation();
  const rainControls = useAnimation();
  
  // Determine if it's night time
  const isNight = (() => {
    if (!sunriseTime || !sunsetTime) return condition.includes('night');
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    return now < sunriseTime || now > sunsetTime;
  })();
  
  useEffect(() => {
    const bgClass = getWeatherBackground(condition, sunsetTime, sunriseTime);
    setBackgroundClass(bgClass);
  }, [condition, sunriseTime, sunsetTime]);

  // Handle mouse movement for interactive effects
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    // Get container bounds
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to container (0 to 1)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
    
    // Animate clouds based on mouse position
    if (condition.includes('cloud')) {
      cloudsControls.start({
        x: (x - 0.5) * 30,
        y: (y - 0.5) * 15,
        transition: { duration: 2, ease: "easeOut" }
      });
    }
    
    // Animate stars based on mouse movement if it's night
    if (isNight) {
      starsControls.start({
        scale: 1 + y * 0.1,
        rotate: (x - 0.5) * 5,
        transition: { duration: 2 }
      });
    }
    
    // Animate rain/snow direction slightly based on mouse
    if (condition.includes('rain') || condition.includes('snow')) {
      rainControls.start({
        x: (x - 0.5) * 10,
        transition: { duration: 1 }
      });
    }
  };
  
  // Create interactive cloud animation on click
  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (condition.includes('cloud') || condition.includes('clear')) {
      // Add a temporary cloud effect at click position
      const cloud = document.createElement('div');
      cloud.className = 'absolute bg-white/40 rounded-full blur-2xl pointer-events-none';
      cloud.style.width = `${Math.random() * 100 + 100}px`;
      cloud.style.height = `${Math.random() * 50 + 50}px`;
      cloud.style.left = `${x - 50}px`;
      cloud.style.top = `${y - 25}px`;
      cloud.style.opacity = '0';
      cloud.style.transition = 'all 2s ease-out';
      
      containerRef.current.appendChild(cloud);
      
      // Animate the cloud
      setTimeout(() => {
        cloud.style.opacity = '0.7';
        cloud.style.transform = `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 50}px)`;
      }, 10);
      
      // Remove the cloud after animation
      setTimeout(() => {
        cloud.style.opacity = '0';
        setTimeout(() => cloud.remove(), 2000);
      }, 2000);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full overflow-hidden" 
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={backgroundClass}
          className={`absolute inset-0 w-full h-full ${backgroundClass}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          {/* Sun or Moon based on time of day */}
          {condition.includes('clear') && !isNight && (
            <motion.div 
              className="absolute rounded-full bg-yellow-300 blur-xl opacity-70 pointer-events-none"
              style={{ 
                width: '150px', 
                height: '150px', 
                right: '10%', 
                top: '10%' 
              }}
              animate={{
                y: [0, 10, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
          
          {isNight && (
            <motion.div 
              className="absolute rounded-full bg-gray-100 blur-sm opacity-80 pointer-events-none"
              style={{ 
                width: '100px', 
                height: '100px', 
                right: '10%', 
                top: '10%',
                boxShadow: '0 0 20px 5px rgba(255, 255, 255, 0.3)'
              }}
              animate={{
                y: [0, 5, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
          
          {/* Stars at night */}
          {isNight && (
            <motion.div 
              className="absolute inset-0 overflow-hidden pointer-events-none"
              animate={starsControls}
            >
              {Array.from({ length: 100 }).map((_, i) => (
                <motion.div 
                  key={i}
                  className="absolute bg-white rounded-full"
                  style={{
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 70}%`,
                    opacity: Math.random() * 0.8 + 0.2,
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: Math.random() * 5 + 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 5,
                  }}
                />
              ))}
            </motion.div>
          )}
          
          {/* Clouds */}
          {condition.includes('cloud') && (
            <motion.div 
              className="absolute inset-0 opacity-70 pointer-events-none overflow-hidden"
              animate={cloudsControls}
            >
              {Array.from({ length: condition === 'cloudy' ? 7 : 3 }).map((_, i) => (
                <motion.div 
                  key={i}
                  className="absolute bg-white rounded-full blur-2xl"
                  style={{
                    width: `${Math.random() * 300 + 200}px`,
                    height: `${Math.random() * 150 + 100}px`,
                    left: `${Math.random() * 120 - 10}%`,
                    top: `${Math.random() * 40}%`,
                    opacity: Math.random() * 0.5 + 0.3,
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
            </motion.div>
          )}
          
          {/* Rain effect */}
          {condition.includes('rain') && (
            <motion.div 
              className="absolute inset-0 opacity-70 pointer-events-none"
              animate={rainControls}
            >
              {Array.from({ length: 80 }).map((_, i) => (
                <motion.div 
                  key={i}
                  className="absolute bg-blue-200 rounded-full"
                  style={{
                    width: `${Math.random() * 1 + 1}px`,
                    height: `${Math.random() * 10 + 15}px`,
                    left: `${Math.random() * 100}%`,
                    top: `-20px`,
                    opacity: Math.random() * 0.7 + 0.3,
                  }}
                  animate={{
                    y: ['0vh', '105vh'],
                  }}
                  transition={{
                    duration: Math.random() * 1 + 0.7,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </motion.div>
          )}
          
          {/* Snow effect */}
          {condition.includes('snow') && (
            <motion.div 
              className="absolute inset-0 opacity-70 pointer-events-none"
              animate={rainControls}
            >
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div 
                  key={i}
                  className="absolute bg-white rounded-full"
                  style={{
                    width: `${Math.random() * 5 + 3}px`,
                    height: `${Math.random() * 5 + 3}px`,
                    left: `${Math.random() * 100}%`,
                    top: `-20px`,
                    opacity: Math.random() * 0.8 + 0.2,
                  }}
                  animate={{
                    y: ['0vh', '100vh'],
                    x: [0, Math.random() * 100 - 50]
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 5,
                  }}
                />
              ))}
            </motion.div>
          )}
          
          {/* Thunderstorm effect */}
          {condition.includes('thunder') && (
            <>
              {/* Regular rain in background */}
              <motion.div className="absolute inset-0 opacity-60 pointer-events-none">
                {Array.from({ length: 60 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    className="absolute bg-blue-200 rounded-full"
                    style={{
                      width: `${Math.random() * 1 + 1}px`,
                      height: `${Math.random() * 10 + 15}px`,
                      left: `${Math.random() * 100}%`,
                      top: `-20px`,
                      opacity: Math.random() * 0.7 + 0.3,
                    }}
                    animate={{
                      y: ['0vh', '105vh'],
                    }}
                    transition={{
                      duration: Math.random() * 1 + 0.7,
                      repeat: Infinity,
                      ease: "linear",
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </motion.div>
              
              {/* Lightning flashes */}
              <motion.div 
                className="absolute inset-0 bg-white pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0, 0.8, 0, 0.2, 0, 0, 0, 0, 0, 0, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeOut",
                  repeatDelay: Math.random() * 10 + 5,
                }}
              />
            </>
          )}
          
          {/* Fog/Mist effect */}
          {(condition.includes('fog') || condition.includes('mist')) && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div 
                  key={i}
                  className="absolute w-full h-40 bg-white/30 blur-xl"
                  style={{
                    top: `${i * 20}%`,
                    opacity: 0.6 - i * 0.1,
                  }}
                  animate={{
                    x: ['-10%', '110%', '-10%'],
                  }}
                  transition={{
                    duration: 120 + i * 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default WeatherBackground;
