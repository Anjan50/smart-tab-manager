import React, { useState, useEffect } from 'react';
import { Globe, ExternalLink } from 'lucide-react';

const MostVisited = () => {
  const [topSites, setTopSites] = useState([]);

  useEffect(() => {
    chrome.topSites.get((sites) => {
      setTopSites(sites);
    });
  }, []);

  const getFaviconUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
    } catch {
      return null;
    }
  };

  const formatUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="p-3 space-y-2">
      {topSites.map((site, index) => (
        
        <a key={index}
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-md border group"
        >
          {/* Number */}
          <div className="w-6 h-6 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
            {index + 1}
          </div>

          {/* Favicon */}
          <div className="relative w-5 h-5 flex-shrink-0">
            <img
              src={getFaviconUrl(site.url)}
              className="w-5 h-5 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            <Globe 
              className="w-5 h-5 text-gray-400 absolute top-0 left-0 hidden" 
              style={{ display: 'none' }}
            />
          </div>

          {/* Title and URL */}
          <div className="flex-grow min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {site.title}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {formatUrl(site.url)}
            </div>
          </div>

          {/* External Link Icon */}
          <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </a>
      ))}

      {topSites.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No frequently visited sites yet
        </div>
      )}
    </div>
  );
};

export default MostVisited;