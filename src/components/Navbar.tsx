
import React from 'react';
import { motion } from 'framer-motion';

interface NavbarProps {
  title?: string;
  children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ title = 'Weather', children }) => {
  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-sm bg-white/5"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="text-2xl font-display font-medium text-white"
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
