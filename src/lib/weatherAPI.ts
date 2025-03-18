
export interface WeatherLocation {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
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
    
    // Then, fetch one-call API for forecast
    const oneCallResponse = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${apiKey}&units=metric`
    );
    
    if (!oneCallResponse.ok) {
      throw new Error(`Forecast API Error: ${oneCallResponse.status}`);
    }
    
    const forecastData = await oneCallResponse.json();
    
    // Format and combine the data
    return {
      location: {
        name: currentData.name,
        country: currentData.sys.country,
        lat: currentData.coord.lat,
        lon: currentData.coord.lon,
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
        uvi: forecastData.current.uvi,
        visibility: currentData.visibility,
        sunrise: currentData.sys.sunrise,
        sunset: currentData.sys.sunset,
        dt: currentData.dt,
      },
      forecast: {
        daily: forecastData.daily.slice(0, 5).map((day: any) => ({
          dt: day.dt,
          temp: {
            day: day.temp.day,
            min: day.temp.min,
            max: day.temp.max,
          },
          weather_code: day.weather[0].id,
          weather_description: day.weather[0].description,
          pop: day.pop,
        })),
        hourly: forecastData.hourly.slice(0, 24).map((hour: any) => ({
          dt: hour.dt,
          temp: hour.temp,
          weather_code: hour.weather[0].id,
          weather_description: hour.weather[0].description,
          pop: hour.pop,
        })),
      },
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
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
