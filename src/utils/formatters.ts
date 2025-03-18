
/**
 * Formats a temperature value to a readable string
 * @param temp Temperature in Kelvin, Celsius, or Fahrenheit
 * @param unit The unit to display ('C' or 'F')
 */
export const formatTemperature = (temp: number, unit: 'C' | 'F' = 'C'): string => {
  if (isNaN(temp)) return 'N/A';
  return `${Math.round(temp)}°${unit}`;
};

/**
 * Formats a date to a readable string
 * @param timestamp Unix timestamp in seconds or milliseconds
 * @param format The format to use ('time', 'day', 'date', or 'full')
 */
export const formatTime = (timestamp: number, format: 'time' | 'day' | 'date' | 'full' = 'time'): string => {
  // Convert to milliseconds if in seconds
  const date = new Date(timestamp * (timestamp < 10000000000 ? 1000 : 1));
  
  switch (format) {
    case 'time':
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    case 'day':
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    case 'date':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'full':
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    default:
      return date.toLocaleTimeString();
  }
};

/**
 * Formats a wind speed and direction to a readable string
 * @param speed Wind speed in meters/second or miles/hour
 * @param deg Wind direction in degrees
 * @param unit The unit to display ('m/s' or 'mph')
 */
export const formatWind = (speed: number, deg: number, unit: 'm/s' | 'mph' = 'm/s'): string => {
  if (isNaN(speed) || isNaN(deg)) return 'N/A';
  
  // Convert direction degrees to cardinal direction
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  const direction = directions[index];
  
  return `${Math.round(speed)} ${unit} ${direction}`;
};

/**
 * Capitalize the first letter of each word in a string
 * @param str The string to capitalize
 */
export const capitalizeWords = (str: string): string => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
