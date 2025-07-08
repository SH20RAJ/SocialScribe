// SocialScribe+ Popup Script

document.addEventListener('DOMContentLoaded', function() {
  // Load settings
  loadSettings()
  
  // Settings button
  document.getElementById('settingsBtn').addEventListener('click', function() {
    chrome.tabs.create({ url: 'https://socialscribe.pages.dev' })
  })
  
  // Check if extension is working on current tab
  checkExtensionStatus()
})

function loadSettings() {
  chrome.storage.sync.get(['socialscribeSettings'], function(result) {
    const settings = result.socialscribeSettings || {
      enabled: true,
      autoSuggest: true,
      keyboardShortcuts: true
    }
    
    // Update UI based on settings
    updateStatusDisplay(settings.enabled)
  })
}

function updateStatusDisplay(enabled) {
  const statusElement = document.querySelector('.status')
  const statusTitle = statusElement.querySelector('h4')
  const statusText = statusElement.querySelector('p')
  
  if (enabled) {
    statusElement.classList.add('status-active')
    statusTitle.textContent = '🟢 Extension Active'
    statusText.textContent = 'Ready to help improve your writing'
  } else {
    statusElement.classList.remove('status-active')
    statusTitle.textContent = '🔴 Extension Disabled'
    statusText.textContent = 'Click to enable writing assistance'
  }
}

function checkExtensionStatus() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTab = tabs[0]
    
    if (!currentTab) return
    
    // Check if we can inject scripts on this page
    const url = currentTab.url
    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('moz-extension://')) {
      updateStatusDisplay(false)
      const statusElement = document.querySelector('.status')
      const statusTitle = statusElement.querySelector('h4')
      const statusText = statusElement.querySelector('p')
      
      statusTitle.textContent = '⚠️ Not Available'
      statusText.textContent = 'Extension cannot run on this page'
      return
    }
    
    // Try to communicate with content script
    chrome.tabs.sendMessage(currentTab.id, { action: 'ping' }, function(response) {
      if (chrome.runtime.lastError) {
        // Content script not loaded, try to inject it
        chrome.scripting.executeScript({
          target: { tabId: currentTab.id },
          files: ['content.js']
        }, function() {
          if (chrome.runtime.lastError) {
            console.error('Failed to inject content script:', chrome.runtime.lastError)
          }
        })
      }
    })
  })
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'updateStatus') {
    updateStatusDisplay(request.enabled)
  }
})