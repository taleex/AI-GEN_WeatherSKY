
import React from 'react';
import { formatTemperature, formatTime } from '@/utils/formatters';
import { mapConditionCode } from '@/utils/iconMap';
import WeatherSVGIcon from './WeatherSVGIcons';
import { CloudRain } from 'lucide-react';
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
    weather_description: string;
    pop: number;
  };
  index: number;
  timezone?: string;
}

const ForecastCard = ({ day, index, timezone }: ForecastCardProps) => {
  const weatherCondition = mapConditionCode(day.weather_code, true);
  const hasPrecipitation = day.pop > 0.2; // Show precipitation if probability > 20%

  return (
    <motion.div 
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-center mb-1 text-gray-700 font-medium">
        {index === 0 ? 'Today' : formatTime(day.dt, 'day', timezone)}
      </div>
      <div className="flex flex-col items-center">
        <WeatherSVGIcon condition={weatherCondition} size="md" />
        <div className="text-gray-900 font-medium mt-2">
          {formatTemperature(day.temp.day)}
        </div>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <span>{formatTemperature(day.temp.min)}</span>
          <span className="mx-1">|</span>
          <span>{formatTemperature(day.temp.max)}</span>
        </div>
        {hasPrecipitation && (
          <div className="flex items-center text-xs text-blue-500 mt-2">
            <CloudRain className="h-3 w-3 mr-1" />
            <span>{Math.round(day.pop * 100)}%</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ForecastCard;
