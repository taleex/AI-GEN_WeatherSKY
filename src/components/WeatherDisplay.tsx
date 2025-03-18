
import React from 'react';
import { WeatherData } from '@/lib/weatherAPI';
import { formatTemperature, formatTime, formatWind, capitalizeWords } from '@/utils/formatters';
import { mapConditionCode, getConditionText } from '@/utils/iconMap';
import ForecastCard from './ForecastCard';
import WeatherIcon from './WeatherIcon';
import { Droplets, Thermometer, Compass, Sunrise, Sunset, ArrowDown, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherDisplayProps {
  data: WeatherData;
  isLoading: boolean;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ data, isLoading }) => {
  if (isLoading || !data) {
    return (
      <div className="weather-container h-full flex items-center justify-center">
        <div className="weather-card w-full flex flex-col items-center justify-center py-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-32 bg-white/20 rounded mb-4"></div>
            <div className="h-20 w-20 bg-white/20 rounded-full mb-6"></div>
            <div className="h-12 w-40 bg-white/20 rounded mb-8"></div>
            <div className="w-full grid grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-white/20 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { current, forecast, location } = data;
  const weatherCondition = mapConditionCode(current.weather_code, 
    current.dt > current.sunrise && current.dt < current.sunset);
  const conditionText = getConditionText(weatherCondition);

  return (
    <div className="weather-container flex flex-col justify-center">
      {/* Current Weather */}
      <motion.div 
        className="weather-card mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-6">
          <motion.div 
            className="flex flex-col items-center md:items-start mb-4 md:mb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-2xl md:text-3xl font-display font-medium text-white">
              {location.name}
            </h1>
            <p className="text-white/80 text-sm mt-1">
              {formatTime(current.dt, 'full')}
            </p>
          </motion.div>

          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="text-right">
              <p className="text-white/90 text-sm font-medium">Feels like</p>
              <p className="text-white text-lg">
                {formatTemperature(current.feels_like)}
              </p>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            className="flex items-center mb-4 md:mb-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <WeatherIcon condition={weatherCondition} size="xl" className="mr-4" />
            <div>
              <h2 className="text-white text-xl font-medium">{conditionText}</h2>
              <p className="text-white/80 text-sm">
                {capitalizeWords(current.weather_description)}
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="text-center md:text-right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-white text-5xl md:text-6xl font-display font-light">
              {formatTemperature(current.temp)}
            </h2>
            <div className="flex items-center justify-center md:justify-end text-sm mt-1 text-white/80">
              <span className="flex items-center">
                <ArrowDown className="w-3 h-3 mr-1 text-blue-300" />
                {formatTemperature(current.temp_min)}
              </span>
              <span className="mx-2">|</span>
              <span className="flex items-center">
                <ArrowDown className="w-3 h-3 mr-1 text-blue-300 transform rotate-180" />
                {formatTemperature(current.temp_max)}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Weather Details */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex flex-col items-center sm:items-start bg-white/10 rounded-lg p-3">
            <div className="flex items-center text-blue-200 mb-1">
              <Wind className="w-4 h-4 mr-1" />
              <span className="text-xs uppercase">Wind</span>
            </div>
            <p className="text-white text-sm">
              {formatWind(current.wind_speed, current.wind_deg)}
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-start bg-white/10 rounded-lg p-3">
            <div className="flex items-center text-blue-200 mb-1">
              <Droplets className="w-4 h-4 mr-1" />
              <span className="text-xs uppercase">Humidity</span>
            </div>
            <p className="text-white text-sm">{current.humidity}%</p>
          </div>

          <div className="flex flex-col items-center sm:items-start bg-white/10 rounded-lg p-3">
            <div className="flex items-center text-blue-200 mb-1">
              <Sunrise className="w-4 h-4 mr-1" />
              <span className="text-xs uppercase">Sunrise</span>
            </div>
            <p className="text-white text-sm">{formatTime(current.sunrise)}</p>
          </div>

          <div className="flex flex-col items-center sm:items-start bg-white/10 rounded-lg p-3">
            <div className="flex items-center text-blue-200 mb-1">
              <Sunset className="w-4 h-4 mr-1" />
              <span className="text-xs uppercase">Sunset</span>
            </div>
            <p className="text-white text-sm">{formatTime(current.sunset)}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Forecast */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h3 className="text-white/90 text-sm font-medium mb-3">5-Day Forecast</h3>
        <div className="grid grid-cols-5 gap-3">
          {forecast.daily.map((day, index) => (
            <ForecastCard key={day.dt} day={day} index={index} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WeatherDisplay;
