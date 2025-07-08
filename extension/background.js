// SocialScribe+ Background Script

class SocialScribeBackground {
  constructor() {
    this.apiUrl = 'https://socialscribe.pages.dev/api/rewrite';
    this.dailyStats = { fixes: 0, rewrites: 0, date: new Date().toDateString() };
    this.userPreferences = {
      defaultTone: 'professional',
      autoSuggestions: true,
      keyboardShortcuts: true,
      darkMode: false,
      platforms: {
        twitter: { enabled: true, tone: 'casual' },
        linkedin: { enabled: true, tone: 'professional' },
        gmail: { enabled: true, tone: 'formal' },
        general: { enabled: true, tone: 'professional' }
      }
    };
    
    this.init();
  }

  init() {
    this.setupInstallHandler();
    this.setupContextMenus();
    this.setupCommandHandlers();
    this.setupMessageHandlers();
    this.setupBadge();
    this.loadUserPreferences();
    this.setupDailyStatsReset();
  }

  setupInstallHandler() {
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstall(details);
    });
  }

  async handleInstall(details) {
    // Initialize storage
    await this.initializeStorage();
    
    // Create context menus
    this.createContextMenus();
    
    // Set initial badge
    this.updateBadge();
    
    if (details.reason === 'install') {
      // First-time installation
      this.handleFirstInstall();
    } else if (details.reason === 'update') {
      // Extension update
      this.handleUpdate(details.previousVersion);
    }
  }

  async initializeStorage() {
    const defaultData = {
      socialscribePreferences: this.userPreferences,
      socialscribeStats: this.dailyStats,
      socialscribeHistory: [],
      socialscribeCustomTones: []
    };

    // Only set defaults if they don't exist
    for (const [key, value] of Object.entries(defaultData)) {
      const existing = await this.getStorageData(key);
      if (!existing) {
        await this.setStorageData(key, value);
      }
    }
  }

  handleFirstInstall() {
    // Open welcome page
    chrome.tabs.create({ 
      url: 'https://socialscribe.pages.dev?welcome=true' 
    });

    // Track installation
    this.trackEvent('extension_installed');
  }

  handleUpdate(previousVersion) {
    // Handle version-specific updates
    if (this.isVersionLower(previousVersion, '2.0.0')) {
      this.migrateToV2();
    }
  }

  migrateToV2() {
    // Migrate old data format to new format
    // This would handle any breaking changes
  }

  createContextMenus() {
    // Remove existing menus
    chrome.contextMenus.removeAll(() => {
      // Create new context menus
      chrome.contextMenus.create({
        id: 'socialscribe-main',
        title: 'SocialScribe+',
        contexts: ['editable']
      });

      chrome.contextMenus.create({
        id: 'fix-grammar',
        parentId: 'socialscribe-main',
        title: 'Fix Grammar',
        contexts: ['editable']
      });

      chrome.contextMenus.create({
        id: 'rewrite-professional',
        parentId: 'socialscribe-main',
        title: 'Rewrite (Professional)',
        contexts: ['editable']
      });

      chrome.contextMenus.create({
        id: 'rewrite-casual',
        parentId: 'socialscribe-main',
        title: 'Rewrite (Casual)',
        contexts: ['editable']
      });

      chrome.contextMenus.create({
        id: 'shorten-text',
        parentId: 'socialscribe-main',
        title: 'Make Shorter',
        contexts: ['editable']
      });
    });
  }

  setupContextMenus() {
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      this.handleContextMenuClick(info, tab);
    });
  }

  async handleContextMenuClick(info, tab) {
    const action = info.menuItemId;
    
    // Parse action and tone
    let actionType, tone;
    
    if (action.startsWith('rewrite-')) {
      actionType = 'rewrite';
      tone = action.replace('rewrite-', '');
    } else if (action === 'fix-grammar') {
      actionType = 'fix_grammar';
      tone = 'professional';
    } else if (action === 'shorten-text') {
      actionType = 'shorten';
      tone = 'professional';
    }

    // Send message to content script
    try {
      await chrome.tabs.sendMessage(tab.id, {
        action: 'contextMenuAction',
        type: actionType,
        tone: tone,
        selectedText: info.selectionText
      });

      // Update stats
      this.updateStats(actionType);
      
    } catch (error) {
      console.error('Failed to send message to content script:', error);
    }
  }

  setupCommandHandlers() {
    if (chrome.commands && chrome.commands.onCommand) {
      chrome.commands.onCommand.addListener((command) => {
        this.handleCommand(command);
      });
    }
  }

  async handleCommand(command) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) return;

    switch (command) {
      case 'open-socialscribe':
        chrome.tabs.sendMessage(tab.id, {
          action: 'openQuickPanel'
        });
        break;
        
      case 'fix-grammar':
        chrome.tabs.sendMessage(tab.id, {
          action: 'contextMenuAction',
          type: 'fix_grammar',
          tone: 'professional'
        });
        this.updateStats('fix_grammar');
        break;
        
      case 'rewrite-casual':
        chrome.tabs.sendMessage(tab.id, {
          action: 'contextMenuAction',
          type: 'rewrite',
          tone: 'casual'
        });
        this.updateStats('rewrite');
        break;
    }
  }

  setupMessageHandlers() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep message channel open for async responses
    });
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'getPreferences':
          const prefs = await this.getStorageData('socialscribePreferences');
          sendResponse({ preferences: prefs || this.userPreferences });
          break;

        case 'updatePreferences':
          await this.setStorageData('socialscribePreferences', request.preferences);
          this.userPreferences = request.preferences;
          sendResponse({ success: true });
          break;

        case 'getStats':
          const stats = await this.getStorageData('socialscribeStats');
          sendResponse({ stats: stats || this.dailyStats });
          break;

        case 'updateStats':
          this.updateStats(request.type);
          sendResponse({ success: true });
          break;

        case 'processText':
          this.processTextProxy(request.data, sendResponse);
          return true; // Keep channel open for async response

        case 'trackEvent':
          this.trackEvent(request.event, request.data);
          sendResponse({ success: true });
          break;

        default:
          sendResponse({ error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Message handler error:', error);
      sendResponse({ error: error.message });
    }
  }

  async processTextProxy(data, sendResponse) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: data.text,
          action: data.action,
          tone: data.tone,
          platform: data.platform
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      let result = '';
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataLine = line.slice(6);
            try {
              const parsed = JSON.parse(dataLine);
              if (parsed.content) {
                result += parsed.content;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      sendResponse({ result: result.trim() });
    } catch (error) {
      console.error('Background script API proxy error:', error);
      sendResponse({ error: error.message });
    }
  }

  async updateStats(actionType) {
    let stats = await this.getStorageData('socialscribeStats') || this.dailyStats;
    
    // Reset stats if it's a new day
    const today = new Date().toDateString();
    if (stats.date !== today) {
      stats = { fixes: 0, rewrites: 0, date: today };
    }

    // Update counters
    if (actionType === 'fix_grammar') {
      stats.fixes++;
    } else if (['rewrite', 'shorten', 'expand'].includes(actionType)) {
      stats.rewrites++;
    }

    await this.setStorageData('socialscribeStats', stats);
    this.dailyStats = stats;
    this.updateBadge();
  }

  setupBadge() {
    // Set initial badge
    this.updateBadge();
    
    // Update badge periodically
    setInterval(() => {
      this.updateBadge();
    }, 60000); // Every minute
  }

  updateBadge() {
    const total = this.dailyStats.fixes + this.dailyStats.rewrites;
    
    if (total > 0) {
      chrome.action.setBadgeText({ 
        text: total > 99 ? '99+' : total.toString() 
      });
      chrome.action.setBadgeBackgroundColor({ color: '#6366f1' });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  }

  setupDailyStatsReset() {
    // Check every hour if we need to reset daily stats
    setInterval(async () => {
      const stats = await this.getStorageData('socialscribeStats');
      const today = new Date().toDateString();
      
      if (stats && stats.date !== today) {
        const newStats = { fixes: 0, rewrites: 0, date: today };
        await this.setStorageData('socialscribeStats', newStats);
        this.dailyStats = newStats;
        this.updateBadge();
      }
    }, 3600000); // Every hour
  }

  async loadUserPreferences() {
    const prefs = await this.getStorageData('socialscribePreferences');
    if (prefs) {
      this.userPreferences = { ...this.userPreferences, ...prefs };
    }
  }

  trackEvent(event, data = {}) {
    // Analytics tracking (privacy-focused)
    console.log('Event tracked:', event, data);
  }

  // Utility methods
  async getStorageData(key) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key]);
      });
    });
  }

  async setStorageData(key, value) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, resolve);
    });
  }

  isVersionLower(version1, version2) {
    const v1parts = version1.split('.').map(Number);
    const v2parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
      const v1part = v1parts[i] || 0;
      const v2part = v2parts[i] || 0;
      
      if (v1part < v2part) return true;
      if (v1part > v2part) return false;
    }
    
    return false;
  }
}

// Initialize background script
new SocialScribeBackground();