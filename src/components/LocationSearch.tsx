
import React, { useState, useEffect, useRef } from 'react';
import { WeatherLocation } from '@/lib/weatherAPI';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "@/components/ui/input";

interface LocationSearchProps {
  onSearch: (query: string) => Promise<WeatherLocation[]>;
  onSelectLocation: (location: WeatherLocation) => void;
  onGetCurrentLocation: () => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  onSearch,
  onSelectLocation,
  onGetCurrentLocation,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WeatherLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const locations = await onSearch(query);
      setResults(locations);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle location selection
  const handleSelectLocation = (location: WeatherLocation) => {
    onSelectLocation(location);
    setQuery('');
    setResults([]);
    setIsExpanded(false);
  };

  // Handle current location button click
  const handleGetCurrentLocation = () => {
    onGetCurrentLocation();
    setQuery('');
    setResults([]);
    setIsExpanded(false);
  };

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search on query change with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query && query.length >= 3) {
        handleSearchSubmit();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  return (
    <motion.div 
      ref={searchRef}
      className="relative z-[100]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {!isExpanded ? (
        <motion.button
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(true)}
        >
          <Search className="w-5 h-5" />
        </motion.button>
      ) : (
        <motion.div
          className="w-72 bg-white/20 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-white/30"
          initial={{ width: 40, height: 40, borderRadius: 20 }}
          animate={{ width: 288, height: "auto", borderRadius: 12 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center px-3 py-2">
              <Search className="w-5 h-5 text-white/80 mr-2" />
              <Input 
                ref={inputRef}
                type="text"
                placeholder="Search for a location..."
                className="flex-1 bg-transparent border-none text-white placeholder-white/60 focus:outline-none focus:ring-0"
                value={query}
                onChange={handleSearchChange}
              />
              <button
                type="button"
                className="w-6 h-6 flex items-center justify-center text-white/80 hover:text-white"
                onClick={() => setIsExpanded(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <AnimatePresence>
              {(results.length > 0 || isSearching) && (
                <motion.div
                  className="border-t border-white/10 max-h-60 overflow-y-auto"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isSearching ? (
                    <div className="p-4 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                      <span className="ml-2 text-white">Searching...</span>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleGetCurrentLocation}
                        className="w-full px-4 py-3 flex items-center text-left text-white hover:bg-white/10 transition-colors"
                      >
                        <MapPin className="w-4 h-4 mr-2 text-blue-300" />
                        Use current location
                      </button>
                      
                      {results.map((location, index) => (
                        <button
                          key={`${location.name}-${location.country}-${index}`}
                          type="button"
                          onClick={() => handleSelectLocation(location)}
                          className="w-full px-4 py-3 flex flex-col text-left text-white hover:bg-white/10 transition-colors"
                        >
                          <span className="font-medium">{location.name}</span>
                          <span className="text-sm text-white/70">{location.country}</span>
                        </button>
                      ))}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LocationSearch;
