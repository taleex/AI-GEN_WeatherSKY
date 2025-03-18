
import { useState, useEffect, useCallback } from 'react';
import { fetchWeatherByCoords, searchLocations, WeatherData, WeatherLocation } from '../lib/weatherAPI';
import { toast } from "@/hooks/use-toast";

interface UseWeatherProps {
  apiKey: string;
}

export const useWeather = ({ apiKey }: UseWeatherProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<WeatherLocation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Function to validate API key
  const validateApiKey = useCallback(async (key: string): Promise<boolean> => {
    if (!key) {
      throw new Error('API key is required');
    }
    
    try {
      // Test the API key with a simple request
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${key}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }
      
      return true;
    } catch (err: any) {
      console.error('API key validation error:', err);
      throw err;
    }
  }, []);
  
  // Function to fetch weather data for a location
  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    if (!apiKey) {
      setError('API key is required');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchWeatherByCoords(lat, lon, apiKey);
      setWeatherData(data);
      setLocation({
        name: data.location.name,
        country: data.location.country,
        lat: data.location.lat,
        lon: data.location.lon,
      });
    } catch (err: any) {
      console.error('Error fetching weather:', err);
      setError(err.message || 'Failed to fetch weather data');
      toast({
        title: "Error",
        description: err.message || 'Failed to fetch weather data',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);
  
  // Function to get the user's current location
  const getCurrentLocation = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError('Failed to get your location. Please enable location services.');
          toast({
            title: "Location Error",
            description: 'Failed to get your location. Please enable location services.',
            variant: "destructive"
          });
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      toast({
        title: "Location Not Supported",
        description: 'Geolocation is not supported by your browser',
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, [fetchWeather]);
  
  // Function to search for a location
  const searchLocation = useCallback(async (query: string) => {
    if (!apiKey) {
      setError('API key is required');
      return [];
    }
    
    try {
      return await searchLocations(query, apiKey);
    } catch (err: any) {
      console.error('Error searching location:', err);
      setError(err.message || 'Failed to search location');
      toast({
        title: "Search Error",
        description: err.message || 'Failed to search location',
        variant: "destructive"
      });
      return [];
    }
  }, [apiKey]);
  
  // Fetch weather for a selected location
  const selectLocation = useCallback((loc: WeatherLocation) => {
    setLocation(loc);
    fetchWeather(loc.lat, loc.lon);
  }, [fetchWeather]);
  
  // Initially try to get user's location if API key is present
  useEffect(() => {
    if (apiKey) {
      getCurrentLocation();
    }
  }, [apiKey, getCurrentLocation]);
  
  return {
    weatherData,
    location,
    isLoading,
    error,
    fetchWeather,
    getCurrentLocation,
    searchLocation,
    selectLocation,
    validateApiKey
  };
};
