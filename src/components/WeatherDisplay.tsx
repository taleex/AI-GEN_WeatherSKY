
import React from 'react';
import { WeatherData } from '@/lib/weatherAPI';
import { formatTemperature, formatTime, formatWind, capitalizeWords } from '@/utils/formatters';
import { mapConditionCode, getConditionText } from '@/utils/iconMap';
import ForecastCard from './ForecastCard';
import WeatherSVGIcon from './WeatherSVGIcons';
import { Droplets, Thermometer, Wind, Sunrise, Sunset, ArrowDown, MapPin, CloudRain } from 'lucide-react';
import { motion } from 'framer-motion';
import LocationSearch from './LocationSearch';
import HourlyForecast from './HourlyForecast';

interface WeatherDisplayProps {
  data: WeatherData;
  isLoading: boolean;
  onSearch: (query: string) => Promise<any[]>;
  onSelectLocation: (location: any) => void;
  onGetCurrentLocation: () => void;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ 
  data, 
  isLoading,
  onSearch,
  onSelectLocation,
  onGetCurrentLocation
}) => {
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
  
  // Calculate timezone offset in hours from UTC
  const timezoneOffsetHours = location.timezone / 3600;
  const timezoneString = `Etc/GMT${timezoneOffsetHours >= 0 ? '-' : '+'}${Math.abs(timezoneOffsetHours)}`;

  // Create a style object for the right weather card that has a background image
  const weatherCardStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1)), url('/lovable-uploads/2b0c0778-4f66-4ec4-8028-2cfb894a3d88.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8 flex flex-col items-center">
      
      {/* Search bar at the top */}
      <motion.div 
        className="w-full max-w-lg mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LocationSearch 
          onSearch={onSearch}
          onSelectLocation={onSelectLocation}
          onGetCurrentLocation={onGetCurrentLocation}
          isInHeader={false}
        />
      </motion.div>
      
      {/* Main weather display - 2 cards layout */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left card - weather info */}
        <motion.div 
          className="main-weather-card p-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-700 mr-2" />
                  <h1 className="text-3xl font-bold text-gray-900">{location.name}</h1>
                </div>
                <p className="text-gray-500">
                  {formatTime(current.dt, 'time', timezoneString)} {formatTime(current.dt, 'full', timezoneString)}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-gray-500 text-sm">Feels like</p>
                <p className="text-gray-800 font-medium">
                  {formatTemperature(current.feels_like)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col items-start">
                <h2 className="text-7xl font-light text-gray-900">
                  {formatTemperature(current.temp, false)}
                </h2>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <span className="flex items-center mr-4">
                    <ArrowDown className="w-3 h-3 mr-1 text-blue-500 transform rotate-180" />
                    High: {formatTemperature(current.temp_max)}
                  </span>
                  <span className="flex items-center">
                    <ArrowDown className="w-3 h-3 mr-1 text-blue-500" />
                    Low: {formatTemperature(current.temp_min)}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <WeatherSVGIcon condition={weatherCondition} size="xl" />
                <p className="text-gray-800 font-medium mt-2">{conditionText}</p>
                <p className="text-gray-500 text-sm">
                  {capitalizeWords(current.weather_description)}
                </p>
              </div>
            </div>
            
            {/* Weather Details in 2x2 grid */}
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className="bg-gray-100 rounded-lg p-3 flex items-center">
                <Wind className="w-8 h-8 text-gray-600 mr-3" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Wind</p>
                  <p className="text-gray-800 font-medium">
                    {formatWind(current.wind_speed, current.wind_deg)}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-3 flex items-center">
                <Droplets className="w-8 h-8 text-gray-600 mr-3" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Humidity</p>
                  <p className="text-gray-800 font-medium">{current.humidity}%</p>
                </div>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-3 flex items-center">
                <Sunrise className="w-8 h-8 text-gray-600 mr-3" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Sunrise</p>
                  <p className="text-gray-800 font-medium">{formatTime(current.sunrise, 'time', timezoneString)}</p>
                </div>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-3 flex items-center">
                <Sunset className="w-8 h-8 text-gray-600 mr-3" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Sunset</p>
                  <p className="text-gray-800 font-medium">{formatTime(current.sunset, 'time', timezoneString)}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Right card - weather showcase */}
        <motion.div 
          className="weather-showcase flex"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={weatherCardStyle}
        >
          <div className="p-8 w-full h-full flex flex-col justify-between">
            <div>
              <h2 className="text-4xl font-bold text-white">
                {location.name}
              </h2>
              <p className="text-white/80">Chance of Rain: {Math.round(current.clouds)}%</p>
            </div>
            
            <div className="flex items-center justify-center flex-grow py-8">
              <h3 className="text-8xl font-bold text-white flex items-start">
                {formatTemperature(current.temp, false)}
                <span className="text-4xl mt-2">°</span>
              </h3>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {forecast.hourly.slice(0, 3).map((hour, index) => (
                <div key={hour.dt} className="flex flex-col items-center">
                  <WeatherSVGIcon 
                    condition={mapConditionCode(hour.weather_code, true)} 
                    size="sm"
                    className="text-white mb-1"
                  />
                  <p className="text-white/90 text-xs">
                    {formatTime(hour.dt, 'hour', timezoneString)}
                  </p>
                  <p className="text-white font-medium">{Math.round(hour.temp)}°</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Hourly forecast */}
      <HourlyForecast hourlyData={forecast.hourly} timezone={timezoneString} />
      
      {/* 5-Day forecast */}
      <motion.div
        className="w-full mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h3 className="text-gray-700 font-medium mb-3">5-Day Forecast</h3>
        <div className="daily-forecast-card">
          <div className="grid grid-cols-5 gap-3">
            {forecast.daily.map((day, index) => (
              <ForecastCard 
                key={day.dt} 
                day={day} 
                index={index} 
                timezone={timezoneString} 
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WeatherDisplay;
