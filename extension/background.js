// SocialScribe+ Background Script

// Install/Update handler
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings
    chrome.storage.sync.set({
      socialscribeSettings: {
        enabled: true,
        autoSuggest: true,
        keyboardShortcuts: true,
        defaultTone: 'professional'
      }
    })
    
    // Open welcome page
    chrome.tabs.create({ url: 'https://socialscribe.pages.dev' })
  }
})

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'fix-grammar') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { 
        action: 'fixGrammar' 
      })
    })
  }
})

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

// Context menu (right-click menu)
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

// Badge text to show extension status
chrome.action.setBadgeText({ text: 'AI' })
chrome.action.setBadgeBackgroundColor({ color: '#3b82f6' })