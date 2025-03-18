
import React from "react";
import { motion } from "framer-motion";
import { WeatherCondition } from "@/utils/iconMap";

interface WeatherSVGIconProps {
  condition: WeatherCondition;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "w-6 h-6",
  md: "w-10 h-10",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

const WeatherSVGIcon: React.FC<WeatherSVGIconProps> = ({
  condition,
  size = "md",
  className = "",
}) => {
  const renderIcon = () => {
    switch (condition) {
      case "clear-day":
        return (
          <svg viewBox="0 0 64 64" className={`${sizes[size]} ${className}`}>
            <g>
              <motion.circle
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, type: "spring" }}
                cx="32" cy="32" r="12" fill="#FFD700" stroke="#ff9e0b" strokeWidth="1"
              />
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                  <motion.line
                    key={i}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: [0.8, 1, 0.8] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2 + (i % 3), 
                      delay: i * 0.1,
                      repeatType: "reverse" 
                    }}
                    x1="32"
                    y1="32"
                    x2={32 + 16 * Math.cos(angle * Math.PI / 180)}
                    y2={32 + 16 * Math.sin(angle * Math.PI / 180)}
                    stroke="#FFD700"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ))}
              </motion.g>
            </g>
          </svg>
        );
        
      case "clear-night":
        return (
          <svg viewBox="0 0 64 64" className={`${sizes[size]} ${className}`}>
            <motion.path
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, type: "spring" }}
              d="M32 12C18.745 12 8 22.745 8 36s10.745 24 24 24 24-10.745 24-24c0-1.231-.093-2.441-.271-3.622-2.324 9.123-10.548 15.882-20.379 15.882-11.598 0-21-9.402-21-21 0-9.831 6.759-18.055 15.882-20.379C34.441 12.093 33.231 12 32 12z"
              fill="#E6E6FA"
              stroke="#9999cc"
              strokeWidth="1"
            />
          </svg>
        );
        
      case "partly-cloudy-day":
        return (
          <svg viewBox="0 0 64 64" className={`${sizes[size]} ${className}`}>
            <defs>
              <clipPath id="sunClip">
                <rect x="0" y="0" width="64" height="32" />
              </clipPath>
            </defs>
            <g>
              <motion.circle
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, type: "spring" }}
                cx="24" cy="22" r="10" fill="#FFD700" stroke="#ff9e0b" strokeWidth="1"
                clipPath="url(#sunClip)"
              />
              <motion.g
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <path
                  d="M46 38c0-8.837-7.163-16-16-16-7.498 0-13.773 5.145-15.546 12.095C11.624 34.434 10 36.84 10 39.667c0 3.866 3.134 7 7 7h26c3.866 0 7-3.134 7-7 0-1.633-.559-3.133-1.496-4.333"
                  fill="#FFFFFF"
                  stroke="#CCCCCC"
                  strokeWidth="1"
                />
              </motion.g>
            </g>
          </svg>
        );
        
      case "partly-cloudy-night":
        return (
          <svg viewBox="0 0 64 64" className={`${sizes[size]} ${className}`}>
            <g>
              <motion.path
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, type: "spring" }}
                d="M32 16c-6.627 0-12 5.373-12 12 0 .683.058 1.35.168 2.001-4.616.65-8.168 4.617-8.168 9.399 0 5.246 4.254 9.5 9.5 9.5h23c4.418 0 8-3.582 8-8 0-3.883-2.765-7.125-6.43-7.865C46.678 27.348 40.542 22 33 22c-.338 0-.671.015-1 .046"
                fill="#CCCCCC"
                stroke="#999999"
                strokeWidth="1"
              />
              <motion.path
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, type: "spring", delay: 0.3 }}
                d="M24 18C16.268 18 10 24.268 10 32c0 .691.064 1.366.18 2.022C6.979 35.15 4 38.861 4 43.25c0 5.385 4.365 9.75 9.75 9.75h23.5c4.694 0 8.5-3.806 8.5-8.5 0-4.116-2.924-7.55-6.832-8.348C41.969 29.193 37.954 24 32.5 24c-.36 0-.72.016-1.069.049"
                fill="#E6E6FA"
                stroke="#9999cc"
                strokeWidth="1"
              />
            </g>
          </svg>
        );
        
      case "cloudy":
        return (
          <svg viewBox="0 0 64 64" className={`${sizes[size]} ${className}`}>
            <motion.g
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, type: "spring" }}
            >
              <path
                d="M46 38c0-8.837-7.163-16-16-16-7.498 0-13.773 5.145-15.546 12.095C11.624 34.434 10 36.84 10 39.667c0 3.866 3.134 7 7 7h26c3.866 0 7-3.134 7-7 0-1.633-.559-3.133-1.496-4.333"
                fill="#FFFFFF"
                stroke="#CCCCCC"
                strokeWidth="1"
              />
              <motion.g
                animate={{ 
                  x: [0, 3, 0, -3, 0],
                  y: [0, -1, 0, 1, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 20,
                  ease: "easeInOut"
                }}
              >
                <path
                  d="M56 44c0-6.627-5.373-12-12-12-5.623 0-10.33 3.859-11.66 9.072C30.218 41.635 29 43.63 29 46c0 2.9 2.35 5.25 5.25 5.25H55c2.9 0 5.25-2.35 5.25-5.25 0-1.225-.42-2.35-1.122-3.25"
                  fill="#F5F5F5"
                  stroke="#CCCCCC"
                  strokeWidth="1"
                />
              </motion.g>
            </motion.g>
          </svg>
        );
        
      case "rain":
      case "showers":
        return (
          <svg viewBox="0 0 64 64" className={`${sizes[size]} ${className}`}>
            <g>
              <motion.path
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                d="M46 24c0-8.837-7.163-16-16-16-7.498 0-13.773 5.145-15.546 12.095C11.624 20.434 10 22.84 10 25.667c0 3.866 3.134 7 7 7h26c3.866 0 7-3.134 7-7 0-1.633-.559-3.133-1.496-4.333"
                fill="#8A898C"
                stroke="#666666"
                strokeWidth="1"
              />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <motion.line
                    key={i}
                    x1={16 + i * 8}
                    y1={35}
                    x2={16 + i * 8}
                    y2={42}
                    stroke="#607EBC"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ y1: 35, y2: 35 }}
                    animate={{ y1: 35, y2: 45 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      delay: i * 0.2,
                      repeatDelay: 0.5,
                      ease: "easeIn"
                    }}
                  />
                ))}
              </motion.g>
            </g>
          </svg>
        );
        
      case "drizzle":
        return (
          <svg viewBox="0 0 64 64" className={`${sizes[size]} ${className}`}>
            <g>
              <motion.path
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                d="M46 24c0-8.837-7.163-16-16-16-7.498 0-13.773 5.145-15.546 12.095C11.624 20.434 10 22.84 10 25.667c0 3.866 3.134 7 7 7h26c3.866 0 7-3.134 7-7 0-1.633-.559-3.133-1.496-4.333"
                fill="#AAAAAA"
                stroke="#999999"
                strokeWidth="1"
              />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <motion.line
                    key={i}
                    x1={14 + i * 6}
                    y1={35}
                    x2={14 + i * 6}
                    y2={38}
                    stroke="#90A4D4"
                    strokeWidth="1"
                    strokeLinecap="round"
                    initial={{ y1: 35, y2: 35 }}
                    animate={{ y1: 35, y2: 40 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      delay: i * 0.1,
                      repeatDelay: 0.3,
                      ease: "easeIn"
                    }}
                  />
                ))}
              </motion.g>
            </g>
          </svg>
        );
        
      case "thunderstorm":
        return (
          <svg viewBox="0 0 64 64" className={`${sizes[size]} ${className}`}>
            <g>
              <motion.path
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                d="M46 20c0-8.837-7.163-16-16-16-7.498 0-13.773 5.145-15.546 12.095C11.624 16.434 10 18.84 10 21.667c0 3.866 3.134 7 7 7h26c3.866 0 7-3.134 7-7 0-1.633-.559-3.133-1.496-4.333"
                fill="#4A5568"
                stroke="#2D3748"
                strokeWidth="1"
              />
              <motion.polygon
                points="30,28 18,45 28,45 25,55 38,38 28,38 32,28"
                fill="#FFD700"
                initial={{ scale: 0.1, opacity: 0 }}
                animate={{ 
                  scale: [0.5, 1, 0.8],
                  opacity: [0, 1, 0.8, 1]
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 3
                }}
              />
            </g>
          </svg>
        );
        
      case "snow":
        return (
          <svg viewBox="0 0 64 64" className={`${sizes[size]} ${className}`}>
            <g>
              <motion.path
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                d="M46 24c0-8.837-7.163-16-16-16-7.498 0-13.773 5.145-15.546 12.095C11.624 20.434 10 22.84 10 25.667c0 3.866 3.134 7 7 7h26c3.866 0 7-3.134 7-7 0-1.633-.559-3.133-1.496-4.333"
                fill="#E5F1F8"
                stroke="#CCCCCC"
                strokeWidth="1"
              />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.g key={i}>
                    <motion.circle
                      cx={16 + i * 8}
                      cy={38}
                      r={2}
                      fill="#FFFFFF"
                      stroke="#E5F1F8"
                      strokeWidth="0.5"
                      initial={{ y: 30 }}
                      animate={{ y: 55 }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        delay: i * 0.3,
                        ease: "linear"
                      }}
                    />
                  </motion.g>
                ))}
              </motion.g>
            </g>
          </svg>
        );
        
      case "sleet":
      case "hail":
        return (
          <svg viewBox="0 0 64 64" className={`${sizes[size]} ${className}`}>
            <g>
              <motion.path
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                d="M46 24c0-8.837-7.163-16-16-16-7.498 0-13.773 5.145-15.546 12.095C11.624 20.434 10 22.84 10 25.667c0 3.866 3.134 7 7 7h26c3.866 0 7-3.134 7-7 0-1.633-.559-3.133-1.496-4.333"
                fill="#8A898C"
                stroke="#666666"
                strokeWidth="1"
              />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.circle
                    key={i}
                    cx={16 + i * 8}
                    cy={38}
                    r={2}
                    fill="#FFFFFF"
                    stroke="#E5F1F8"
                    strokeWidth="0.5"
                    initial={{ y: 30 }}
                    animate={{ y: 55 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: i * 0.3,
                      ease: "easeIn"
                    }}
                  />
                ))}
                {[0, 1, 2].map((i) => (
                  <motion.line
                    key={`line-${i}`}
                    x1={20 + i * 12}
                    y1={35}
                    x2={20 + i * 12}
                    y2={40}
                    stroke="#607EBC"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ y1: 35, y2: 35 }}
                    animate={{ y1: 35, y2: 43 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      delay: i * 0.4 + 0.2,
                      repeatDelay: 0.5,
                      ease: "easeIn"
                    }}
                  />
                ))}
              </motion.g>
            </g>
          </svg>
        );
        
      case "fog":
      case "mist":
        return (
          <svg viewBox="0 0 64 64" className={`${sizes[size]} ${className}`}>
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.line
                  key={i}
                  x1="12"
                  y1={18 + i * 7}
                  x2="52"
                  y2={18 + i * 7}
                  stroke="#9F9EA1"
                  strokeWidth="4"
                  strokeLinecap="round"
                  animate={{ 
                    x1: [12, 16, 12, 8, 12],
                    x2: [52, 48, 52, 56, 52]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 10,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.g>
          </svg>
        );
        
      case "dust":
      case "sand":
        return (
          <svg viewBox="0 0 64 64" className={`${sizes[size]} ${className}`}>
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.line
                  key={i}
                  x1="12"
                  y1={18 + i * 7}
                  x2="52"
                  y2={18 + i * 7}
                  stroke="#C8C8C9"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="1, 8"
                  animate={{ 
                    x1: [12, 20, 12],
                    x2: [52, 44, 52]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 8,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.g>
          </svg>
        );
        
      case "tornado":
        return (
          <svg viewBox="0 0 64 64" className={`${sizes[size]} ${className}`}>
            <motion.g
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <motion.path
                d="M32 8 Q42 16 37 24 Q29 32 34 40 Q40 48 32 56"
                fill="none"
                stroke="#403E43"
                strokeWidth="8"
                strokeLinecap="round"
                animate={{ 
                  d: [
                    "M32 8 Q42 16 37 24 Q29 32 34 40 Q40 48 32 56",
                    "M32 8 Q38 16 35 24 Q32 32 36 40 Q42 48 32 56",
                    "M32 8 Q40 16 40 24 Q30 32 32 40 Q36 48 32 56",
                    "M32 8 Q42 16 37 24 Q29 32 34 40 Q40 48 32 56"
                  ]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut"
                }}
              />
            </motion.g>
          </svg>
        );
        
      case "smoke":
      case "haze":
        return (
          <svg viewBox="0 0 64 64" className={`${sizes[size]} ${className}`}>
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.ellipse
                  key={i}
                  cx={32}
                  cy={16 + i * 8}
                  rx={20 - i * 2}
                  ry={3}
                  fill="#9F9EA1"
                  animate={{ 
                    rx: [20 - i * 2, 22 - i * 2, 20 - i * 2],
                    cy: [16 + i * 8, 15 + i * 8, 16 + i * 8]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 5,
                    delay: i * 0.4,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.g>
          </svg>
        );
        
      default:
        return (
          <svg viewBox="0 0 64 64" className={`${sizes[size]} ${className}`}>
            <circle cx="32" cy="32" r="16" fill="#d1e0d7" stroke="#607ebc" strokeWidth="2" />
          </svg>
        );
    }
  };

  return (
    <motion.div
      className={`${className}`}
      initial={{ scale: 0.8, opacity: .9 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
    >
      {renderIcon()}
    </motion.div>
  );
};

export default WeatherSVGIcon;
