
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

  // Enhanced backgrounds by condition and time of day using mint and steel blue colors
  if (condition.includes('clear')) {
    return isNight 
      ? 'bg-gradient-to-b from-[#1e2d4a] to-[#0a1e3d]' // Clear night - deep blue
      : 'bg-gradient-to-b from-[#a5c7e2] to-[#607ebc]';   // Clear day - mint to steel blue
  }
  
  if (condition.includes('partly-cloudy')) {
    return isNight
      ? 'bg-gradient-to-b from-[#2c3e57] to-[#1e293b]' // Partly cloudy night
      : 'bg-gradient-to-b from-[#b0d4df] to-[#8fa8c9]';  // Partly cloudy day
  }
  
  if (condition === 'cloudy') {
    return isNight
      ? 'bg-gradient-to-b from-[#3a4756] to-[#2c3e50]' // Cloudy night
      : 'bg-gradient-to-b from-[#cfd9df] to-[#9bafc4]'; // Cloudy day
  }
  
  if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
    return isNight
      ? 'bg-gradient-to-b from-[#374151] to-[#1e293b]' // Rainy night
      : 'bg-gradient-to-b from-[#a7b9c0] to-[#607890]'; // Rainy day
  }
  
  if (condition.includes('thunder')) {
    return isNight
      ? 'bg-gradient-to-b from-[#1f2937] to-[#111827]' // Thunderstorm night
      : 'bg-gradient-to-b from-[#6b7280] to-[#4b5563]'; // Thunderstorm day
  }
  
  if (condition.includes('snow') || condition.includes('sleet') || condition.includes('hail')) {
    return isNight
      ? 'bg-gradient-to-b from-[#374151] to-[#1f2937]' // Snowy night
      : 'bg-gradient-to-b from-[#d1e0d7] to-[#cfd8dc]'; // Snowy day
  }
  
  if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze') || condition.includes('smoke')) {
    return isNight
      ? 'bg-gradient-to-b from-[#4a5568] to-[#2d3748]' // Foggy night
      : 'bg-gradient-to-b from-[#b8c7cb] to-[#8fa1a6]'; // Foggy day
  }
  
  if (condition.includes('dust') || condition.includes('sand')) {
    return isNight
      ? 'bg-gradient-to-b from-[#78350f] to-[#451a03]' // Dusty night
      : 'bg-gradient-to-b from-[#d4be98] to-[#b08968]'; // Dusty day
  }
  
  if (condition.includes('tornado')) {
    return isNight
      ? 'bg-gradient-to-b from-[#1e293b] to-[#0f172a]' // Tornado night
      : 'bg-gradient-to-b from-[#475569] to-[#334155]'; // Tornado day
  }
  
  // Default, clear sky with mint/blue theme
  return isNight
    ? 'bg-gradient-to-b from-[#1e2d4a] to-[#0a1e3d]' // Default night
    : 'bg-gradient-to-b from-[#a5c7e2] to-[#607ebc]';   // Default day - mint to steel blue
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
