
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { WeatherCondition, mapConditionCode } from './utils/iconMap';

// Function to update favicon based on weather condition
const updateFavicon = (condition: WeatherCondition) => {
  const faviconLink = document.getElementById('favicon') as HTMLLinkElement;
  if (!faviconLink) return;
  
  // Create a canvas to draw the icon
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Set background gradient based on condition
  let gradient;
  if (condition.includes('clear')) {
    gradient = ctx.createLinearGradient(0, 0, 64, 64);
    gradient.addColorStop(0, '#a5c7e2');
    gradient.addColorStop(1, '#607ebc');
  } else if (condition.includes('cloud')) {
    gradient = ctx.createLinearGradient(0, 0, 64, 64);
    gradient.addColorStop(0, '#b0d4df');
    gradient.addColorStop(1, '#8fa8c9');
  } else if (condition.includes('rain') || condition.includes('drizzle')) {
    gradient = ctx.createLinearGradient(0, 0, 64, 64);
    gradient.addColorStop(0, '#a7b9c0');
    gradient.addColorStop(1, '#607890');
  } else if (condition.includes('thunder')) {
    gradient = ctx.createLinearGradient(0, 0, 64, 64);
    gradient.addColorStop(0, '#6b7280');
    gradient.addColorStop(1, '#4b5563');
  } else if (condition.includes('snow')) {
    gradient = ctx.createLinearGradient(0, 0, 64, 64);
    gradient.addColorStop(0, '#d1e0d7');
    gradient.addColorStop(1, '#cfd8dc');
  } else if (condition.includes('fog') || condition.includes('mist')) {
    gradient = ctx.createLinearGradient(0, 0, 64, 64);
    gradient.addColorStop(0, '#b8c7cb');
    gradient.addColorStop(1, '#8fa1a6');
  } else {
    gradient = ctx.createLinearGradient(0, 0, 64, 64);
    gradient.addColorStop(0, '#d1e0d7');
    gradient.addColorStop(1, '#607ebc');
  }
  
  // Fill background
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  
  // Draw icon based on condition
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  
  if (condition.includes('clear')) {
    // Draw sun
    ctx.beginPath();
    ctx.arc(32, 32, 14, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw rays
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(32 + 16 * Math.cos(angle), 32 + 16 * Math.sin(angle));
      ctx.lineTo(32 + 22 * Math.cos(angle), 32 + 22 * Math.sin(angle));
      ctx.stroke();
    }
  } else if (condition.includes('cloud')) {
    // Draw clouds
    ctx.beginPath();
    ctx.arc(28, 36, 12, Math.PI, Math.PI * 2);
    ctx.arc(40, 36, 12, Math.PI, Math.PI * 2);
    ctx.arc(34, 30, 12, Math.PI, Math.PI * 2);
    ctx.arc(22, 30, 12, Math.PI, Math.PI * 2);
    ctx.rect(22, 30, 18, 12);
    ctx.fill();
  } else if (condition.includes('rain') || condition.includes('drizzle')) {
    // Draw cloud with rain
    ctx.beginPath();
    ctx.arc(28, 28, 12, Math.PI, Math.PI * 2);
    ctx.arc(40, 28, 12, Math.PI, Math.PI * 2);
    ctx.arc(34, 22, 12, Math.PI, Math.PI * 2);
    ctx.arc(22, 22, 12, Math.PI, Math.PI * 2);
    ctx.rect(22, 22, 18, 12);
    ctx.fill();
    
    // Draw raindrops
    ctx.beginPath();
    ctx.moveTo(24, 38);
    ctx.lineTo(24, 48);
    ctx.moveTo(34, 38);
    ctx.lineTo(34, 48);
    ctx.moveTo(44, 38);
    ctx.lineTo(44, 48);
    ctx.stroke();
  } else if (condition.includes('thunder')) {
    // Draw cloud
    ctx.beginPath();
    ctx.arc(28, 22, 12, Math.PI, Math.PI * 2);
    ctx.arc(40, 22, 12, Math.PI, Math.PI * 2);
    ctx.arc(34, 16, 12, Math.PI, Math.PI * 2);
    ctx.arc(22, 16, 12, Math.PI, Math.PI * 2);
    ctx.rect(22, 16, 18, 12);
    ctx.fill();
    
    // Draw lightning bolt
    ctx.beginPath();
    ctx.moveTo(36, 28);
    ctx.lineTo(28, 40);
    ctx.lineTo(38, 36);
    ctx.lineTo(32, 48);
    ctx.fill();
  } else if (condition.includes('snow')) {
    // Draw cloud
    ctx.beginPath();
    ctx.arc(28, 22, 12, Math.PI, Math.PI * 2);
    ctx.arc(40, 22, 12, Math.PI, Math.PI * 2);
    ctx.arc(34, 16, 12, Math.PI, Math.PI * 2);
    ctx.arc(22, 16, 12, Math.PI, Math.PI * 2);
    ctx.rect(22, 16, 18, 12);
    ctx.fill();
    
    // Draw snowflakes
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(24 + i * 10, 42, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Default icon (simple cloud)
    ctx.beginPath();
    ctx.arc(32, 32, 16, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Update favicon
  faviconLink.href = canvas.toDataURL('image/png');
};

// Create and append weather condition listener to update favicon
window.addEventListener('weather-condition-change', ((e: CustomEvent) => {
  if (e.detail && e.detail.condition) {
    updateFavicon(e.detail.condition);
  }
}) as EventListener);

// Set default favicon
document.addEventListener('DOMContentLoaded', () => {
  updateFavicon('clear-day');
});

createRoot(document.getElementById("root")!).render(<App />);
