
import { useState, useEffect, useCallback } from 'react';
import { fetchWeatherByCoords, searchLocations, WeatherData, WeatherLocation } from '../lib/weatherAPI';
import { toast } from "@/components/ui/use-toast";

interface UseWeatherProps {
  apiKey: string;
}

export const useWeather = ({ apiKey }: UseWeatherProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<WeatherLocation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
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
  
  // Initially try to get user's location
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
  };
};
