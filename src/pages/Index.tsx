
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import WeatherDisplay from '@/components/WeatherDisplay';
import LocationSearch from '@/components/LocationSearch';
import WeatherBackground from '@/components/WeatherBackground';
import { useWeather } from '@/hooks/useWeather';
import { mapConditionCode } from '@/utils/iconMap';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Index = () => {
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('weatherApiKey') || '';
  });
  const [isSettingApiKey, setIsSettingApiKey] = useState<boolean>(!apiKey);
  const [keyError, setKeyError] = useState<string | null>(null);
  
  const {
    weatherData,
    isLoading,
    error,
    getCurrentLocation,
    searchLocation,
    selectLocation,
    validateApiKey
  } = useWeather({ apiKey });
  
  const handleApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setKeyError(null);
    
    try {
      // Validate the API key before saving
      const isValid = await validateApiKey(apiKey);
      if (isValid) {
        localStorage.setItem('weatherApiKey', apiKey);
        setIsSettingApiKey(false);
      }
    } catch (error: any) {
      setKeyError(error.message || 'Invalid API key. Please try again.');
    }
  };
  
  const handleChangeApiKey = () => {
    setIsSettingApiKey(true);
    setKeyError(null);
  };
  
  // Determine the current weather condition
  const weatherCondition = weatherData?.current 
    ? mapConditionCode(
        weatherData.current.weather_code, 
        weatherData.current.dt > weatherData.current.sunrise && weatherData.current.dt < weatherData.current.sunset
      ) 
    : 'clear-day';
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Dynamic background based on weather */}
      <WeatherBackground 
        condition={weatherCondition}
        sunriseTime={weatherData?.current.sunrise}
        sunsetTime={weatherData?.current.sunset}
      />
      
      {/* Semi-transparent overlay for better readability */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-xs"></div>
      
      {/* Content layer */}
      <div className="relative z-10 min-h-screen">
        <Navbar title="Stellar Sky">
          {!isSettingApiKey && (
            <Button 
              variant="ghost" 
              className="text-xs text-white/70 hover:text-white hover:bg-white/10"
              onClick={handleChangeApiKey}
            >
              Change API Key
            </Button>
          )}
        </Navbar>
        
        <AnimatePresence mode="wait">
          {isSettingApiKey ? (
            <motion.div 
              key="apiKeyForm"
              className="min-h-screen flex items-center justify-center px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="w-full max-w-md weather-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h2 className="text-2xl font-display font-medium text-white mb-6 text-center">
                  Welcome to Stellar Sky
                </h2>
                <p className="text-white/80 mb-6 text-center">
                  Please enter your OpenWeatherMap API key to get started. 
                  You can get a free API key by signing up at 
                  <a 
                    href="https://openweathermap.org/api" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200 ml-1 underline underline-offset-2"
                  >
                    openweathermap.org
                  </a>
                </p>
                
                {keyError && (
                  <Alert variant="destructive" className="mb-4 bg-red-500/20 border-red-500/50 text-white">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{keyError}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleApiKeySubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="apiKey" className="text-white/90 text-sm">
                      API Key
                    </label>
                    <Input
                      id="apiKey"
                      type="text"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your OpenWeatherMap API key"
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="weatherDisplay"
              className="pt-20 pb-10 min-h-screen flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-end px-6 mb-6">
                <LocationSearch
                  onSearch={searchLocation}
                  onSelectLocation={selectLocation}
                  onGetCurrentLocation={getCurrentLocation}
                />
              </div>
              
              {error && (
                <div className="px-6">
                  <Alert variant="destructive" className="bg-red-500/20 border-red-500/50 text-white">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
              )}
              
              {weatherData && (
                <WeatherDisplay data={weatherData} isLoading={isLoading} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
