// Track tabs and their groups
let tabGroups = {};

// Listen for tab events
chrome.tabs.onCreated.addListener(async (tab) => {
  updateTabGroups();
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    updateTabGroups();
  }
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  updateTabGroups();
});

// Function to update tab groups
async function updateTabGroups() {
  const tabs = await chrome.tabs.query({});
  
  // Group tabs by domain
  tabGroups = tabs.reduce((groups, tab) => {
    try {
      const url = new URL(tab.url);
      const domain = url.hostname;
      
      if (!groups[domain]) {
        groups[domain] = {
          tabs: [],
          color: getRandomColor()
        };
      }
      
      groups[domain].tabs.push(tab);
    } catch (e) {
      // Handle special pages like chrome:// urls
      if (!groups['Other']) {
        groups['Other'] = {
          tabs: [],
          color: '#808080'
        };
      }
      groups['Other'].tabs.push(tab);
    }
    
    return groups;
  }, {});
  
  // Store updated groups
  chrome.storage.local.set({ tabGroups });
}

function getRandomColor() {
  const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
  return colors[Math.floor(Math.random() * colors.length)];
}