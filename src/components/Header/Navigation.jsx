import React from 'react';

const Navigation = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'groups', label: 'Groups' },
        { id: 'bookmarks', label: 'Bookmarks' },
        { id: 'mostVisited', label: 'Frequent' },
        { id: 'settings', label: 'Settings' }
      ];

  return (
    <div className="px-4 flex gap-4 border-b">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === tab.id 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-600 hover:border-gray-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Navigation;