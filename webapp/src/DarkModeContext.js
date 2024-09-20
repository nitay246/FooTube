// DarkModeContext.js

import React, { createContext, useContext, useEffect, useState } from 'react';

// Create a Context for the dark mode
const DarkModeContext = createContext();

// Custom hook to use the dark mode context
export const useDarkMode = () => useContext(DarkModeContext);

// DarkModeProvider component manages dark mode state and provides context
export const DarkModeProvider = ({ children }) => {
  // State to hold dark mode preference, initializes from local storage if available
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage for dark mode preference
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Effect to update local storage whenever dark mode state changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    // Update body class based on darkMode state
    if (darkMode) {
      document.body.classList.add('dark-mode'); // Apply dark mode styles
    } else {
      document.body.classList.remove('dark-mode'); // Remove dark mode styles
    }
  }, [darkMode]);

  // Effect to handle global event for toggling dark mode
  useEffect(() => {
    const handleDarkModeToggle = () => {
      setDarkMode(prevMode => !prevMode); // Toggle dark mode state
    };

    window.addEventListener('toggleDarkMode', handleDarkModeToggle); // Listen for custom event

    return () => {
      window.removeEventListener('toggleDarkMode', handleDarkModeToggle); // Clean up event listener
    };
  }, []);

  // Provide dark mode state and setter to children components via context
  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children} {/* Render all children components */}
    </DarkModeContext.Provider>
  );
};
