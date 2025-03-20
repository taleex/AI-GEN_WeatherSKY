
import React from 'react';
import { motion } from 'framer-motion';
import { formatTime } from '@/utils/formatters';
import { mapConditionCode } from '@/utils/iconMap';
import WeatherSVGIcon from './WeatherSVGIcons';

interface HourlyForecastProps {
  hourlyData: {
    dt: number;
    temp: number;
    weather_code: number;
  }[];
  timezone: string;
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyData, timezone }) => {
  // Take only next 6 hours
  const limitedHourlyData = hourlyData.slice(0, 5);
  
  return (
    <motion.div 
      className="hourly-forecast-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="grid grid-cols-5 gap-2">
        {limitedHourlyData.map((hour, index) => {
          const weatherCondition = mapConditionCode(hour.weather_code, true);
          
          return (
            <motion.div 
              key={hour.dt}
              className="flex flex-col items-center p-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-xs font-medium text-gray-700">
                {index === 0 ? 'Now' : formatTime(hour.dt, 'hour', timezone)}
              </p>
              <div className="my-2">
                <WeatherSVGIcon condition={weatherCondition} size="sm" />
              </div>
              <p className="font-medium text-gray-900">
                {Math.round(hour.temp)}°
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default HourlyForecast;
