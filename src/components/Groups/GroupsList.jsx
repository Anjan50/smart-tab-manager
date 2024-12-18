import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, ExternalLink } from 'lucide-react';

const GroupsList = ({ searchTerm }) => {
  const [groups, setGroups] = useState({});

  useEffect(() => {
    loadTabs();
    const interval = setInterval(loadTabs, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadTabs = async () => {
    const tabs = await chrome.tabs.query({});
    const groupedTabs = groupTabsByDomain(tabs);
    setGroups(groupedTabs);
  };

  const groupTabsByDomain = (tabs) => {
    return tabs.reduce((acc, tab) => {
      try {
        const url = new URL(tab.url);
        const domain = url.hostname;
        
        if (!acc[domain]) {
          acc[domain] = {
            tabs: [],
            color: getGroupColor(domain)
          };
        }
        acc[domain].tabs.push(tab);
      } catch (e) {
        const domain = 'Other';
        if (!acc[domain]) {
          acc[domain] = {
            tabs: [],
            color: '#718096'
          };
        }
        acc[domain].tabs.push(tab);
      }
      return acc;
    }, {});
  };

  const getGroupColor = (domain) => {
    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
    let hash = 0;
    for (let i = 0; i < domain.length; i++) {
      hash = domain.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const switchToTab = (tabId) => {
    chrome.tabs.update(tabId, { active: true });
  };

  const closeTab = (e, tabId) => {
    e.stopPropagation();
    chrome.tabs.remove(tabId);
    loadTabs();
  };

  // New function to close all tabs in a group
  const closeGroupTabs = async (e, domain) => {
    e.stopPropagation();
    const tabIds = groups[domain].tabs.map(tab => tab.id);
    await chrome.tabs.remove(tabIds);
    loadTabs();
  };

  const muteTab = (e, tabId, muted) => {
    e.stopPropagation();
    chrome.tabs.update(tabId, { muted: !muted });
    loadTabs();
  };

  const filteredGroups = Object.entries(groups).filter(([domain, group]) => {
    return !searchTerm || 
      domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.tabs.some(tab => tab.title.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="p-3 space-y-2">
      {filteredGroups.map(([domain, group]) => (
        <div 
          key={domain}
          className="bg-white border rounded-md shadow-sm"
        >
          <div className="p-2 border-b bg-gray-50 rounded-t-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: group.color }}
              />
              <span className="font-medium text-sm">{domain}</span>
              <span className="text-xs text-gray-500">
                {group.tabs.length} tabs
              </span>
            </div>
            {/* Add close group button */}
            <button
              onClick={(e) => closeGroupTabs(e, domain)}
              className="p-1 hover:bg-red-100 rounded-md group/close"
            >
              <X className="w-4 h-4 text-gray-400 group-hover/close:text-red-500" />
            </button>
          </div>
          <div>
            {group.tabs.map((tab, idx) => (
              <div 
                key={tab.id}
                onClick={() => switchToTab(tab.id)}
                className={`flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer group ${
                  idx !== 0 ? 'border-t' : ''
                }`}
              >
                <img 
                  src={tab.favIconUrl || '#'} 
                  className="w-4 h-4 flex-shrink-0"
                  onError={(e) => e.target.style.display = 'none'}
                />
                <span className="text-sm flex-grow truncate">{tab.title}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {tab.audible && (
                    <button
                      onClick={(e) => muteTab(e, tab.id, tab.mutedInfo?.muted)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      {tab.mutedInfo?.muted ? 
                        <VolumeX className="w-3.5 h-3.5 text-gray-500" /> :
                        <Volume2 className="w-3.5 h-3.5 text-blue-500" />
                      }
                    </button>
                  )}
                  <button
                    onClick={(e) => closeTab(e, tab.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupsList;