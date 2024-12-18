import React, { useState, useEffect } from 'react';
import { Moon, Sun, Save, RefreshCw } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    autoGroupTabs: true,
    closeInactiveTabs: false,
    inactiveTimeout: 24,
    compactView: false,
  });

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    chrome.storage.sync.get(['settings'], (result) => {
      if (result.settings) {
        setSettings(result.settings);
        applySettings(result.settings);
      }
    });
  };

  // Apply settings to extension
  const applySettings = (newSettings) => {
    // Apply theme
    document.documentElement.classList.toggle('dark', newSettings.theme === 'dark');

    // Apply compact view
    document.documentElement.classList.toggle('compact', newSettings.compactView);

    // Set up inactive tabs timer if enabled
    if (newSettings.closeInactiveTabs) {
      setupInactiveTabsTimer(newSettings.inactiveTimeout);
    }
  };

  const setupInactiveTabsTimer = (timeout) => {
    const checkInactiveTabs = async () => {
      const tabs = await chrome.tabs.query({});
      const currentTime = Date.now();
      const inactiveTime = timeout * 60 * 60 * 1000; // Convert hours to milliseconds

      tabs.forEach(tab => {
        if (tab.lastAccessed && (currentTime - tab.lastAccessed) > inactiveTime) {
          chrome.tabs.remove(tab.id);
        }
      });
    };

    // Check every hour
    setInterval(checkInactiveTabs, 3600000);
  };

  const saveSettings = () => {
    chrome.storage.sync.set({ settings }, () => {
      applySettings(settings);
      // Show success message
      const successMessage = document.getElementById('successMessage');
      if (successMessage) {
        successMessage.classList.remove('opacity-0');
        setTimeout(() => {
          successMessage.classList.add('opacity-0');
        }, 2000);
      }
    });
  };

  const resetSettings = () => {
    const defaultSettings = {
      theme: 'light',
      autoGroupTabs: true,
      closeInactiveTabs: false,
      inactiveTimeout: 24,
      compactView: false,
    };
    setSettings(defaultSettings);
    chrome.storage.sync.set({ settings: defaultSettings }, () => {
      applySettings(defaultSettings);
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Success Message */}
      <div 
        id="successMessage" 
        className="fixed top-4 right-4 bg-green-100 text-green-700 px-4 py-2 rounded-md opacity-0 transition-opacity duration-200"
      >
        Settings saved!
      </div>

      {/* Theme Setting */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Theme</h3>
          <p className="text-xs text-gray-500">Choose your preferred theme</p>
        </div>
        <button 
          onClick={() => setSettings(prev => ({
            ...prev,
            theme: prev.theme === 'light' ? 'dark' : 'light'
          }))}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          {settings.theme === 'light' ? 
            <Sun className="w-5 h-5 text-yellow-500" /> : 
            <Moon className="w-5 h-5 text-gray-600" />
          }
        </button>
      </div>

      {/* Auto Group Tabs */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Auto Group Tabs</h3>
          <p className="text-xs text-gray-500">Automatically group tabs by domain</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.autoGroupTabs}
            onChange={() => setSettings(prev => ({
              ...prev,
              autoGroupTabs: !prev.autoGroupTabs
            }))}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Close Inactive Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Close Inactive Tabs</h3>
            <p className="text-xs text-gray-500">Automatically close inactive tabs</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.closeInactiveTabs}
              onChange={() => setSettings(prev => ({
                ...prev,
                closeInactiveTabs: !prev.closeInactiveTabs
              }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        {settings.closeInactiveTabs && (
          <div className="flex items-center gap-2 pl-6">
            <input
              type="number"
              min="1"
              max="720"
              value={settings.inactiveTimeout}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                inactiveTimeout: parseInt(e.target.value)
              }))}
              className="w-20 px-2 py-1 border rounded-md"
            />
            <span className="text-sm text-gray-600">hours</span>
          </div>
        )}
      </div>

      {/* Compact View */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Compact View</h3>
          <p className="text-xs text-gray-500">Use a more compact layout</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.compactView}
            onChange={() => setSettings(prev => ({
              ...prev,
              compactView: !prev.compactView
            }))}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 space-y-2">
        <button
          onClick={saveSettings}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>

        <button
          onClick={resetSettings}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <RefreshCw className="w-4 h-4" />
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default Settings;