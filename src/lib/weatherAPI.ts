export interface WeatherLocation {
  name: string;
  country: string;
  lat: number;
  lon: number;
  timezone?: number;  // Timezone offset in seconds from UTC
}

export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
    timezone: number;  // Timezone offset in seconds from UTC
  };
  current: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
    wind_speed: number;
    wind_deg: number;
    weather_code: number;
    weather_description: string;
    clouds: number;
    uvi: number;
    visibility: number;
    sunrise: number;
    sunset: number;
    dt: number;
  };
  forecast: {
    daily: Array<{
      dt: number;
      temp: {
        day: number;
        min: number;
        max: number;
      };
      weather_code: number;
      weather_description: string;
      pop: number; // Probability of precipitation
    }>;
    hourly: Array<{
      dt: number;
      temp: number;
      weather_code: number;
      weather_description: string;
      pop: number; // Probability of precipitation
    }>;
  };
}

// API call to get weather data by coordinates
export const fetchWeatherByCoords = async (
  lat: number, 
  lon: number, 
  apiKey: string
): Promise<WeatherData> => {
  try {
    // First, fetch current weather
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    
    if (!currentResponse.ok) {
      throw new Error(`Weather API Error: ${currentResponse.status}`);
    }
    
    const currentData = await currentResponse.json();
    
    // Then, fetch 5 day / 3 hour forecast data instead of one-call
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    
    if (!forecastResponse.ok) {
      throw new Error(`Forecast API Error: ${forecastResponse.status}`);
    }
    
    const forecastData = await forecastResponse.json();
    
    // Process forecast data to get daily data
    const dailyData = processDailyForecast(forecastData.list);
    const hourlyData = processHourlyForecast(forecastData.list);
    
    // Format and combine the data
    return {
      location: {
        name: currentData.name,
        country: currentData.sys.country,
        lat: currentData.coord.lat,
        lon: currentData.coord.lon,
        timezone: currentData.timezone, // Add timezone offset
      },
      current: {
        temp: currentData.main.temp,
        feels_like: currentData.main.feels_like,
        temp_min: currentData.main.temp_min,
        temp_max: currentData.main.temp_max,
        humidity: currentData.main.humidity,
        pressure: currentData.main.pressure,
        wind_speed: currentData.wind.speed,
        wind_deg: currentData.wind.deg,
        weather_code: currentData.weather[0].id,
        weather_description: currentData.weather[0].description,
        clouds: currentData.clouds.all,
        uvi: 0, // UV index not available in the free tier
        visibility: currentData.visibility,
        sunrise: currentData.sys.sunrise,
        sunset: currentData.sys.sunset,
        dt: currentData.dt,
      },
      forecast: {
        daily: dailyData,
        hourly: hourlyData,
      },
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Process forecast data to get daily forecast
const processDailyForecast = (forecastList: any[]) => {
  const dailyMap = new Map();
  
  forecastList.forEach(item => {
    // Get date without time
    const date = new Date(item.dt * 1000).setHours(0, 0, 0, 0);
    
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        dt: item.dt,
        temps: [item.main.temp],
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        weather_code: item.weather[0].id,
        weather_description: item.weather[0].description,
        pop: item.pop || 0
      });
    } else {
      const day = dailyMap.get(date);
      day.temps.push(item.main.temp);
      day.temp_min = Math.min(day.temp_min, item.main.temp_min);
      day.temp_max = Math.max(day.temp_max, item.main.temp_max);
      day.pop = Math.max(day.pop, item.pop || 0);
    }
  });
  
  // Convert to array and format
  return Array.from(dailyMap.values())
    .slice(0, 5)
    .map(day => ({
      dt: day.dt,
      temp: {
        day: day.temps.reduce((sum: number, temp: number) => sum + temp, 0) / day.temps.length,
        min: day.temp_min,
        max: day.temp_max
      },
      weather_code: day.weather_code,
      weather_description: day.weather_description,
      pop: day.pop
    }));
};

// Process forecast data to get hourly forecast
const processHourlyForecast = (forecastList: any[]) => {
  // Take only the first 24 hours (8 items, as they are 3 hours apart)
  return forecastList.slice(0, 8).map(item => ({
    dt: item.dt,
    temp: item.main.temp,
    weather_code: item.weather[0].id,
    weather_description: item.weather[0].description,
    pop: item.pop || 0
  }));
};

// API call to search for locations
export const searchLocations = async (
  query: string,
  apiKey: string
): Promise<WeatherLocation[]> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Location Search API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Format the response data
    return data.map((location: any) => ({
      name: location.name,
      country: location.country,
      lat: location.lat,
      lon: location.lon,
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
};
