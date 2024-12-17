import React, { useState, useEffect } from 'react';
import { LayoutGrid, X, Search, Volume2, VolumeX } from 'lucide-react';

const TabManagerPopup = () => {
  const [activeTab, setActiveTab] = useState('groups');
  const [tabGroups, setTabGroups] = useState({});
  const [stats, setStats] = useState({
    totalTabs: 0,
    groups: 0,
    memoryUsage: '0 MB'
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTabData();
    const interval = setInterval(loadTabData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadTabData = () => {
    chrome.storage.local.get(['tabGroups'], (result) => {
      if (result.tabGroups) {
        setTabGroups(result.tabGroups);
        setStats({
          totalTabs: Object.values(result.tabGroups)
            .reduce((sum, group) => sum + group.tabs.length, 0),
          groups: Object.keys(result.tabGroups).length,
          memoryUsage: '~' + (Object.values(result.tabGroups)
            .reduce((sum, group) => sum + group.tabs.length, 0) * 50) + 'MB'
        });
      }
    });
  };

  const switchToTab = (tabId) => {
    chrome.tabs.update(tabId, { active: true });
  };

  const closeTab = (e, tabId) => {
    e.stopPropagation();
    chrome.tabs.remove(tabId);
    loadTabData();
  };

  const muteTab = (e, tabId, muted) => {
    e.stopPropagation();
    chrome.tabs.update(tabId, { muted: !muted });
    loadTabData();
  };

  const filteredGroups = Object.entries(tabGroups).filter(([domain, group]) => {
    return domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
           group.tabs.some(tab => tab.title.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="w-[350px] h-[600px] bg-white flex flex-col">
      {/* Header */}
      <div className="shrink-0 border-b">
        <div className="px-4 py-3">
          <h2 className="text-base font-semibold flex items-center gap-2 text-gray-800">
            <LayoutGrid className="w-4 h-4 text-blue-600" />
            SmartTab Manager+
          </h2>
        </div>

        {/* Search */}
        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tabs..."
              className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 flex gap-4">
          <button
            onClick={() => setActiveTab('groups')}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'groups' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-600 hover:border-gray-200'
            }`}
          >
            Groups
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'stats' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-600 hover:border-gray-200'
            }`}
          >
            Stats
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {activeTab === 'groups' ? (
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
                  </div>
                  <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full">
                    {group.tabs.length} tabs
                  </span>
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
        ) : (
          <div className="p-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border text-center">
                <div className="text-lg font-semibold text-blue-600">{stats.totalTabs}</div>
                <div className="text-xs text-gray-600">Open Tabs</div>
              </div>
              <div className="bg-white p-3 rounded-lg border text-center">
                <div className="text-lg font-semibold text-green-600">{stats.groups}</div>
                <div className="text-xs text-gray-600">Groups</div>
              </div>
              <div className="bg-white p-3 rounded-lg border text-center">
                <div className="text-lg font-semibold text-purple-600">{stats.memoryUsage}</div>
                <div className="text-xs text-gray-600">Memory</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabManagerPopup;