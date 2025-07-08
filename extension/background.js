// SocialScribe+ Background Script

// Install/Update handler
chrome.runtime.onInstalled.addListener((details) => {
  // Set default settings
  chrome.storage.sync.set({
    socialscribeSettings: {
      enabled: true,
      autoSuggest: true,
      keyboardShortcuts: true,
      defaultTone: 'professional'
    }
  })
  
  // Create context menus
  chrome.contextMenus.create({
    id: 'socialscribe-fix-grammar',
    title: 'Fix Grammar with SocialScribe+',
    contexts: ['editable']
  })

  chrome.contextMenus.create({
    id: 'socialscribe-rewrite',
    title: 'Rewrite with SocialScribe+',
    contexts: ['editable']
  })
  
  // Set badge
  chrome.action.setBadgeText({ text: 'AI' })
  chrome.action.setBadgeBackgroundColor({ color: '#3b82f6' })
  
  if (details.reason === 'install') {
    // Open welcome page only on first install
    chrome.tabs.create({ url: 'https://socialscribe.pages.dev' })
  }
})

// Handle keyboard shortcuts (wrapped in try-catch for safety)
try {
  if (typeof chrome !== 'undefined' && chrome.commands && chrome.commands.onCommand) {
    chrome.commands.onCommand.addListener((command) => {
      if (command === 'fix-grammar') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { 
              action: 'fixGrammar' 
            })
          }
        })
      }
    })
  }
} catch (error) {
  console.log('Commands API not available:', error)
}

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSettings') {
    chrome.storage.sync.get(['socialscribeSettings'], (result) => {
      sendResponse(result.socialscribeSettings || {
        enabled: true,
        autoSuggest: true,
        keyboardShortcuts: true,
        defaultTone: 'professional'
      })
    })
    return true // Keep message channel open for async response
  }
  
  if (request.action === 'saveSettings') {
    chrome.storage.sync.set({
      socialscribeSettings: request.settings
    }, () => {
      sendResponse({ success: true })
    })
    return true
  }
})

// Context menu click handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'socialscribe-fix-grammar') {
    chrome.tabs.sendMessage(tab.id, { 
      action: 'contextMenuAction',
      type: 'fix_grammar'
    })
  } else if (info.menuItemId === 'socialscribe-rewrite') {
    chrome.tabs.sendMessage(tab.id, { 
      action: 'contextMenuAction',
      type: 'rewrite'
    })
  }
})