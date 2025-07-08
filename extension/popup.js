// SocialScribe+ Popup Script
// Grammarly-like interface for the extension popup

class SocialScribePopup {
  constructor() {
    this.init();
  }

  async init() {
    await this.loadUserData();
    this.setupEventListeners();
    this.updateUI();
    this.checkCurrentTab();
  }

  async loadUserData() {
    try {
      const result = await chrome.storage.local.get(['isEnabled', 'userStats', 'settings']);
      this.isEnabled = result.isEnabled !== false; // Default to true
      this.userStats = result.userStats || { corrections: 0, wordsImproved: 0, timesSaved: 0 };
      this.settings = result.settings || { 
        autoCorrect: true, 
        toneDetection: true, 
        contextAware: true,
        showSuggestions: true 
      };
    } catch (error) {
      console.error('Error loading user data:', error);
      this.isEnabled = true;
      this.userStats = { corrections: 0, wordsImproved: 0, timesSaved: 0 };
      this.settings = { autoCorrect: true, toneDetection: true, contextAware: true, showSuggestions: true };
    }
  }

  setupEventListeners() {
    // Toggle switch
    const toggleSwitch = document.getElementById('enableToggle');
    if (toggleSwitch) {
      toggleSwitch.checked = this.isEnabled;
      toggleSwitch.addEventListener('change', (e) => {
        this.toggleExtension(e.target.checked);
      });
    }

    // Settings toggles
    const settingsToggles = document.querySelectorAll('.setting-toggle');
    settingsToggles.forEach(toggle => {
      const setting = toggle.dataset.setting;
      if (this.settings[setting] !== undefined) {
        toggle.checked = this.settings[setting];
      }
      toggle.addEventListener('change', (e) => {
        this.updateSetting(setting, e.target.checked);
      });
    });

    // Action buttons
    document.getElementById('openWebApp')?.addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://socialscribe.pages.dev' });
    });

    document.getElementById('viewStats')?.addEventListener('click', () => {
      this.showStatsModal();
    });

    document.getElementById('reportIssue')?.addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://socialscribe.pages.dev/support' });
    });

    // Quick actions
    document.getElementById('quickFix')?.addEventListener('click', () => {
      this.performQuickAction('fix');
    });

    document.getElementById('quickRewrite')?.addEventListener('click', () => {
      this.performQuickAction('rewrite');
    });

    document.getElementById('quickTone')?.addEventListener('click', () => {
      this.performQuickAction('tone');
    });

    // Close modal
    document.getElementById('closeModal')?.addEventListener('click', () => {
      this.hideStatsModal();
    });

    // Custom instructions
    document.getElementById('saveInstructions')?.addEventListener('click', () => {
      this.saveCustomInstructions();
    });

    // Load custom instructions
    this.loadCustomInstructions();
  }

  async toggleExtension(enabled) {
    this.isEnabled = enabled;
    await chrome.storage.local.set({ isEnabled: enabled });
    
    // Send message to content script
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        chrome.tabs.sendMessage(tab.id, { 
          action: 'toggleExtension', 
          enabled: enabled 
        });
      }
    } catch (error) {
      console.error('Error sending message to content script:', error);
    }

    this.updateUI();
    this.showToast(enabled ? 'SocialScribe+ enabled' : 'SocialScribe+ disabled');
  }

  async updateSetting(setting, value) {
    this.settings[setting] = value;
    await chrome.storage.local.set({ settings: this.settings });
    
    // Send updated settings to content script
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        chrome.tabs.sendMessage(tab.id, { 
          action: 'updateSettings', 
          settings: this.settings 
        });
      }
    } catch (error) {
      console.error('Error sending settings to content script:', error);
    }
  }

  updateUI() {
    const statusElement = document.getElementById('status');
    const statusDot = document.querySelector('.status-dot');
    const quickActions = document.getElementById('quickActions');

    if (this.isEnabled) {
      statusElement.textContent = 'Active';
      statusElement.className = 'status active';
      statusDot.className = 'status-dot active';
      quickActions.style.display = 'block';
    } else {
      statusElement.textContent = 'Disabled';
      statusElement.className = 'status disabled';
      statusDot.className = 'status-dot disabled';
      quickActions.style.display = 'none';
    }

    // Update stats
    document.getElementById('correctionsCount').textContent = this.userStats.corrections;
    document.getElementById('wordsCount').textContent = this.userStats.wordsImproved;
    document.getElementById('timesCount').textContent = this.userStats.timesSaved;
  }

  async checkCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        const siteInfo = this.getSiteInfo(tab.url);
        document.getElementById('currentSite').textContent = siteInfo.name;
        
        // Check if site is supported
        const supportedElement = document.getElementById('siteSupported');
        if (siteInfo.supported) {
          supportedElement.textContent = '✓ Supported';
          supportedElement.className = 'site-status supported';
        } else {
          supportedElement.textContent = '⚠ Limited support';
          supportedElement.className = 'site-status limited';
        }
      }
    } catch (error) {
      console.error('Error checking current tab:', error);
    }
  }

  getSiteInfo(url) {
    const supportedSites = {
      'twitter.com': { name: 'Twitter', supported: true },
      'x.com': { name: 'X (Twitter)', supported: true },
      'linkedin.com': { name: 'LinkedIn', supported: true },
      'gmail.com': { name: 'Gmail', supported: true },
      'outlook.com': { name: 'Outlook', supported: true },
      'facebook.com': { name: 'Facebook', supported: true },
      'instagram.com': { name: 'Instagram', supported: true },
      'reddit.com': { name: 'Reddit', supported: true },
      'medium.com': { name: 'Medium', supported: true },
      'notion.so': { name: 'Notion', supported: true }
    };

    for (const [domain, info] of Object.entries(supportedSites)) {
      if (url.includes(domain)) {
        return info;
      }
    }

    return { name: 'Current site', supported: false };
  }

  async performQuickAction(action) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        chrome.tabs.sendMessage(tab.id, { 
          action: 'quickAction', 
          type: action 
        });
        this.showToast(`${action.charAt(0).toUpperCase() + action.slice(1)} applied`);
      }
    } catch (error) {
      console.error('Error performing quick action:', error);
      this.showToast('Error: Please refresh the page and try again');
    }
  }

  showStatsModal() {
    document.getElementById('statsModal').style.display = 'flex';
  }

  hideStatsModal() {
    document.getElementById('statsModal').style.display = 'none';
  }

  async saveCustomInstructions() {
    const textarea = document.getElementById('customInstructions');
    const instructions = textarea.value.trim();
    
    try {
      await chrome.storage.local.set({ customInstructions: instructions });
      this.showToast('Custom instructions saved!');
    } catch (error) {
      console.error('Error saving custom instructions:', error);
      this.showToast('Error saving instructions');
    }
  }

  async loadCustomInstructions() {
    try {
      const result = await chrome.storage.local.get(['customInstructions']);
      const textarea = document.getElementById('customInstructions');
      if (textarea && result.customInstructions) {
        textarea.value = result.customInstructions;
      }
    } catch (error) {
      console.error('Error loading custom instructions:', error);
    }
  }

  showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    toast.style.opacity = '1';

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.style.display = 'none';
      }, 300);
    }, 2000);
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SocialScribePopup();
});

// Handle messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateStats') {
    // Update stats in real-time
    const popup = window.socialScribePopup;
    if (popup) {
      popup.userStats = message.stats;
      popup.updateUI();
    }
  }
});