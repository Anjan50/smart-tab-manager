import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load theme from storage
    chrome.storage.sync.get(['settings'], (result) => {
      if (result.settings?.theme) {
        setIsDark(result.settings.theme === 'dark');
      }
    });
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    chrome.storage.sync.get(['settings'], (result) => {
      const settings = result.settings || {};
      settings.theme = !isDark ? 'dark' : 'light';
      chrome.storage.sync.set({ settings });
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={isDark ? 'dark hide-scrollbar' : 'hide-scrollbar'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);