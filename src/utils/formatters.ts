
import { format, fromUnixTime } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

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
 * Formats a date to a readable string based on the timezone of the location
 * @param timestamp Unix timestamp in seconds or milliseconds
 * @param format The format to use ('time', 'day', 'date', or 'full')
 * @param timezone The timezone to use (e.g., 'America/New_York')
 */
export const formatTime = (
  timestamp: number, 
  format: 'time' | 'day' | 'date' | 'full' = 'time',
  timezone?: string
): string => {
  // Convert to milliseconds if in seconds
  const timestampMs = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
  
  // If no timezone provided, use local timezone
  if (!timezone) {
    const date = new Date(timestampMs);
    
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
  }
  
  // Use timezone-aware formatting with date-fns-tz
  try {
    switch (format) {
      case 'time':
        return formatInTimeZone(new Date(timestampMs), timezone, 'h:mm a');
      case 'day':
        return formatInTimeZone(new Date(timestampMs), timezone, 'EEE');
      case 'date':
        return formatInTimeZone(new Date(timestampMs), timezone, 'MMM d');
      case 'full':
        return formatInTimeZone(new Date(timestampMs), timezone, 'EEEE, MMMM d');
      default:
        return formatInTimeZone(new Date(timestampMs), timezone, 'h:mm a');
    }
  } catch (error) {
    console.error('Error formatting with timezone:', error);
    // Fallback to local timezone if there's an error with the timezone
    return formatTime(timestamp, format);
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
