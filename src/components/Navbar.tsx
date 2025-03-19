
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { WeatherCondition } from '@/utils/iconMap';

interface NavbarProps {
  title?: string;
  children?: React.ReactNode;
  weatherCondition?: WeatherCondition;
}

const Navbar: React.FC<NavbarProps> = ({ 
  title = 'WeatherSKY', 
  children,
  weatherCondition 
}) => {
  useEffect(() => {
    if (weatherCondition) {
      // Dispatch event to update favicon
      const event = new CustomEvent('weather-condition-change', {
        detail: { condition: weatherCondition }
      });
      window.dispatchEvent(event);
      
      // Update document title
      document.title = `${title} - ${weatherCondition.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')}`;
    }
  }, [weatherCondition, title]);

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="text-2xl font-display font-medium text-white drop-shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        {title}
      </motion.div>
      
      {children}
    </motion.nav>
  );
};

export default Navbar;
