// SocialScribe+ Background Service Worker
console.log('SocialScribe+ background script loaded');

// Extension installation and update handling
chrome.runtime.onInstalled.addListener((details) => {
  console.log('SocialScribe+ installed/updated:', details.reason);
  
  if (details.reason === 'install') {
    // Set default settings
    chrome.storage.sync.set({
      enabled: true,
      autoSuggest: true,
      showFloatingButton: true,
      apiEndpoint: 'https://socialscribe.pages.dev/api/rewrite'
    });
    
    // Open welcome page
    chrome.tabs.create({
      url: 'https://socialscribe.pages.dev/welcome'
    });
  }
  
  // Create context menu
  createContextMenu();
});

// Create context menu for right-click suggestions
function createContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'socialscribe-improve',
      title: 'Improve with SocialScribe+',
      contexts: ['selection', 'editable']
    });
    
    chrome.contextMenus.create({
      id: 'socialscribe-formal',
      title: 'Make more formal',
      contexts: ['selection', 'editable']
    });
    
    chrome.contextMenus.create({
      id: 'socialscribe-casual',
      title: 'Make more casual',
      contexts: ['selection', 'editable']
    });
    
    chrome.contextMenus.create({
      id: 'socialscribe-shorten',
      title: 'Make shorter',
      contexts: ['selection', 'editable']
    });
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.startsWith('socialscribe-')) {
    const action = info.menuItemId.replace('socialscribe-', '');
    
    chrome.tabs.sendMessage(tab.id, {
      type: 'SOCIALSCRIBE_CONTEXT_ACTION',
      action: action,
      selectedText: info.selectionText
    });
  }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'open-socialscribe') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'SOCIALSCRIBE_TOGGLE'
      });
    });
  }
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'GET_SETTINGS':
      chrome.storage.sync.get([
        'enabled',
        'autoSuggest',
        'showFloatingButton',
        'apiEndpoint'
      ], (settings) => {
        sendResponse(settings);
      });
      return true; // Keep message channel open for async response
      
    case 'UPDATE_SETTINGS':
      chrome.storage.sync.set(request.settings, () => {
        sendResponse({ success: true });
        
        // Notify all tabs about settings change
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {
              type: 'SETTINGS_UPDATED',
              settings: request.settings
            }).catch(() => {
              // Ignore errors for tabs that don't have content script
            });
          });
        });
      });
      return true;
      
    case 'GET_USAGE_STATS':
      chrome.storage.local.get([
        'totalSuggestions',
        'acceptedSuggestions',
        'lastUsed'
      ], (stats) => {
        sendResponse({
          totalSuggestions: stats.totalSuggestions || 0,
          acceptedSuggestions: stats.acceptedSuggestions || 0,
          lastUsed: stats.lastUsed || null
        });
      });
      return true;
      
    case 'UPDATE_USAGE_STATS':
      chrome.storage.local.get([
        'totalSuggestions',
        'acceptedSuggestions'
      ], (stats) => {
        const updates = {
          lastUsed: Date.now()
        };
        
        if (request.action === 'suggestion_generated') {
          updates.totalSuggestions = (stats.totalSuggestions || 0) + 1;
        } else if (request.action === 'suggestion_accepted') {
          updates.acceptedSuggestions = (stats.acceptedSuggestions || 0) + 1;
        }
        
        chrome.storage.local.set(updates);
      });
      break;
      
    case 'OPEN_OPTIONS':
      chrome.runtime.openOptionsPage();
      break;
      
    case 'OPEN_WEBSITE':
      chrome.tabs.create({
        url: 'https://socialscribe.pages.dev'
      });
      break;
  }
});

// Badge management
function updateBadge(enabled) {
  if (enabled) {
    chrome.action.setBadgeText({ text: '' });
    chrome.action.setBadgeBackgroundColor({ color: '#6366f1' });
  } else {
    chrome.action.setBadgeText({ text: 'OFF' });
    chrome.action.setBadgeBackgroundColor({ color: '#9ca3af' });
  }
}

// Update badge when settings change
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.enabled) {
    updateBadge(changes.enabled.newValue);
  }
});

// Initialize badge
chrome.storage.sync.get(['enabled'], (result) => {
  updateBadge(result.enabled !== false);
});

// Handle tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Skip chrome:// and extension pages
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      return;
    }
    
    // Check if content script is already injected
    chrome.tabs.sendMessage(tabId, { type: 'PING' }).catch(() => {
      // Content script not found, inject it
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      }).catch(error => {
        console.log('Could not inject content script:', error);
      });
    });
  }
});

// Cleanup on extension disable/uninstall
chrome.management.onDisabled.addListener((info) => {
  if (info.id === chrome.runtime.id) {
    // Extension is being disabled
    chrome.storage.local.clear();
  }
});

// Error handling
chrome.runtime.onSuspend.addListener(() => {
  console.log('SocialScribe+ background script suspending');
});

// Keep service worker alive with periodic tasks
setInterval(() => {
  // Ping to keep service worker alive
  chrome.storage.local.get(['keepAlive'], () => {
    // This is just to keep the service worker active
  });
}, 25000); // Every 25 seconds