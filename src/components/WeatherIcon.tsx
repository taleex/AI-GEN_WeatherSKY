
import React from 'react';
import { WeatherCondition, conditionIcons } from '@/utils/iconMap';
import { motion } from 'framer-motion';

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-20 h-20'
};

const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  condition, 
  size = 'md',
  className = '' 
}) => {
  const Icon = conditionIcons[condition];
  
  return (
    <motion.div 
      className={`${sizes[size]} ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 15 
      }}
    >
      <Icon className="w-full h-full" />
    </motion.div>
  );
};

export default WeatherIcon;
