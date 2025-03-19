
import React from 'react';
import { WeatherCondition, mapConditionCode } from '@/utils/iconMap';
import { formatTemperature, formatTime } from '@/utils/formatters';
import WeatherSVGIcon from './WeatherSVGIcons';
import { motion } from 'framer-motion';

interface ForecastCardProps {
  day: {
    dt: number;
    temp: {
      day: number;
      min: number;
      max: number;
    };
    weather_code: number;
  };
  index: number;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ day, index }) => {
  const isToday = index === 0;
  const condition = mapConditionCode(day.weather_code, true);
  
  return (
    <motion.div 
      className="forecast-card flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: 0.1 * index,
        duration: 0.5
      }}
    >
      <div className="text-sm font-medium text-white/90 mb-1">
        {isToday ? 'Today' : formatTime(day.dt, 'day')}
      </div>
      
      <WeatherSVGIcon condition={condition} size="md" className="my-2" />
      
      <div className="flex justify-between w-full mt-2">
        <span className="text-xs text-white/80">
          {formatTemperature(day.temp.min)}
        </span>
        <span className="text-sm font-medium text-white">
          {formatTemperature(day.temp.max)}
        </span>
      </div>
    </motion.div>
  );
};

export default ForecastCard;
