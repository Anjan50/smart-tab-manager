// Listen for tab events
chrome.tabs.onCreated.addListener(handleNewTab);
chrome.tabs.onUpdated.addListener(handleTabUpdate);
chrome.tabs.onRemoved.addListener(handleTabRemove);

// Handle new tab creation
function handleNewTab(tab) {
  updateTabGroups();
}

// Handle tab updates
function handleTabUpdate(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    updateTabGroups();
  }
}

// Handle tab removal
function handleTabRemove(tabId, removeInfo) {
  updateTabGroups();
}

// Update tab groups
async function updateTabGroups() {
  const tabs = await chrome.tabs.query({});
  
  // Group tabs by domain
  const groups = {};
  tabs.forEach(tab => {
    const url = new URL(tab.url);
    const domain = url.hostname;
    
    if (!groups[domain]) {
      groups[domain] = [];
    }
    groups[domain].push(tab);
  });
  
  // Save groups to storage
  chrome.storage.local.set({ tabGroups: groups });
}