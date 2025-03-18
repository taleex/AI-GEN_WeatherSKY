
import { LucideIcon } from "lucide-react";
import { 
  Sun, Moon, Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning,
  CloudDrizzle, CloudHail, Tornado, CloudSun, CloudMoon
} from "lucide-react";

export type WeatherCondition = 
  | 'clear-day' | 'clear-night' 
  | 'partly-cloudy-day' | 'partly-cloudy-night'
  | 'cloudy' 
  | 'rain' | 'drizzle' | 'showers'
  | 'thunderstorm' 
  | 'snow' | 'sleet' | 'hail'
  | 'mist' | 'fog' | 'smoke' | 'haze'
  | 'dust' | 'sand' | 'tornado';

// Map OpenWeather condition codes to our simplified condition types
export const mapConditionCode = (code: number, isDay: boolean = true): WeatherCondition => {
  // Clear sky
  if (code === 800) {
    return isDay ? 'clear-day' : 'clear-night';
  }
  
  // Cloud conditions (801-804)
  if (code === 801) { // few clouds
    return isDay ? 'partly-cloudy-day' : 'partly-cloudy-night';
  }
  if (code >= 802 && code <= 804) { // scattered, broken, or overcast clouds
    return 'cloudy';
  }
  
  // Thunderstorm (200-232)
  if (code >= 200 && code <= 232) {
    return 'thunderstorm';
  }
  
  // Drizzle (300-321)
  if (code >= 300 && code <= 321) {
    return 'drizzle';
  }
  
  // Rain (500-531)
  if (code >= 500 && code <= 504) { // light/moderate/heavy/extreme rain
    return 'rain';
  }
  if (code === 511) { // freezing rain
    return 'sleet';
  }
  if (code >= 520 && code <= 531) { // shower rain
    return 'showers';
  }
  
  // Snow (600-622)
  if (code >= 600 && code <= 602 || code >= 620 && code <= 622) { // snow
    return 'snow';
  }
  if (code >= 611 && code <= 616) { // sleet
    return 'sleet';
  }
  
  // Atmosphere (700-781)
  if (code === 701 || code === 741) { // mist or fog
    return 'fog';
  }
  if (code === 711 || code === 721 || code === 731) { // smoke, haze, or dust
    return 'haze';
  }
  if (code === 751 || code === 761) { // sand
    return 'dust';
  }
  if (code === 762) { // volcanic ash
    return 'smoke';
  }
  if (code === 771) { // squalls
    return 'showers';
  }
  if (code === 781) { // tornado
    return 'tornado';
  }
  
  // Default to clear day if unknown
  return isDay ? 'clear-day' : 'clear-night';
};

// Map weather conditions to Lucide icons
export const conditionIcons: Record<WeatherCondition, LucideIcon> = {
  'clear-day': Sun,
  'clear-night': Moon,
  'partly-cloudy-day': CloudSun,
  'partly-cloudy-night': CloudMoon,
  'cloudy': Cloud,
  'rain': CloudRain,
  'drizzle': CloudDrizzle,
  'showers': CloudRain,
  'thunderstorm': CloudLightning,
  'snow': CloudSnow,
  'sleet': CloudSnow,
  'hail': CloudHail,
  'mist': CloudFog,
  'fog': CloudFog,
  'smoke': CloudFog,
  'haze': CloudFog,
  'dust': CloudFog,
  'sand': CloudFog,
  'tornado': Tornado
};

// Map conditions to background colors/gradients
export const getWeatherBackground = (condition: WeatherCondition, sunsetTime?: number, sunriseTime?: number): string => {
  const now = new Date();
  const isNight = sunsetTime && sunriseTime ? 
    (now.getTime() / 1000 > sunsetTime || now.getTime() / 1000 < sunriseTime) : 
    (condition.includes('night'));

  // Basic backgrounds by condition
  if (isNight) {
    return 'bg-gradient-to-b from-weather-night to-weather-night/80';
  }
  
  if (condition.includes('clear')) {
    return 'bg-gradient-to-b from-weather-clear to-sky-300';
  }
  
  if (condition.includes('cloud')) {
    return 'bg-gradient-to-b from-weather-cloudy to-sky-200';
  }
  
  if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
    return 'bg-gradient-to-b from-weather-rain to-slate-400';
  }
  
  if (condition.includes('thunder')) {
    return 'bg-gradient-to-b from-weather-thunderstorm to-slate-600';
  }
  
  if (condition.includes('snow') || condition.includes('sleet') || condition.includes('hail')) {
    return 'bg-gradient-to-b from-weather-snow to-slate-200';
  }
  
  if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze') || condition.includes('smoke')) {
    return 'bg-gradient-to-b from-weather-mist to-slate-300';
  }
  
  // Default, clear sky
  return 'bg-gradient-to-b from-weather-clear to-sky-300';
};

// Map conditions to text describing the weather
export const getConditionText = (condition: WeatherCondition): string => {
  if (condition.includes('clear')) {
    return condition.includes('night') ? 'Clear Night' : 'Clear Sky';
  }
  
  if (condition === 'partly-cloudy-day') {
    return 'Partly Cloudy';
  }
  
  if (condition === 'partly-cloudy-night') {
    return 'Partly Cloudy Night';
  }
  
  if (condition === 'cloudy') {
    return 'Cloudy';
  }
  
  if (condition === 'rain') {
    return 'Rain';
  }
  
  if (condition === 'drizzle') {
    return 'Drizzle';
  }
  
  if (condition === 'showers') {
    return 'Showers';
  }
  
  if (condition === 'thunderstorm') {
    return 'Thunderstorm';
  }
  
  if (condition === 'snow') {
    return 'Snow';
  }
  
  if (condition === 'sleet') {
    return 'Sleet';
  }
  
  if (condition === 'hail') {
    return 'Hail';
  }
  
  if (condition === 'mist' || condition === 'fog') {
    return 'Fog';
  }
  
  if (condition === 'smoke') {
    return 'Smoke';
  }
  
  if (condition === 'haze') {
    return 'Haze';
  }
  
  if (condition === 'dust' || condition === 'sand') {
    return 'Dust';
  }
  
  if (condition === 'tornado') {
    return 'Tornado';
  }
  
  return 'Unknown';
};
