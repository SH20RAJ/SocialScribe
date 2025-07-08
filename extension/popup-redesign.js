// SocialScribe Redesigned Popup JavaScript
class SocialScribePopup {
  constructor() {
    this.currentTab = 'rewriter';
    this.selectedTone = 'professional';
    this.customTone = '';
    this.isLoading = false;
    this.apiUrl = 'https://socialscribe.pages.dev/api/rewrite';
    
    this.init();
  }

  init() {
    this.setupTabNavigation();
    this.setupToneSelector();
    this.setupRewriteButton();
    this.setupCustomToneInput();
    this.setupToggleButtons();
    this.loadSavedData();
    this.setupKeyboardShortcuts();
  }

  setupTabNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show corresponding content
        tabContents.forEach(content => {
          content.style.display = 'none';
        });
        
        const targetContent = document.getElementById(`${targetTab}-tab`);
        if (targetContent) {
          targetContent.style.display = 'block';
          targetContent.style.animation = 'slideIn 0.3s ease';
        }
        
        this.currentTab = targetTab;
        this.saveData();
      });
    });
  }

  setupToneSelector() {
    const toneOptions = document.querySelectorAll('.tone-option');
    
    toneOptions.forEach(option => {
      option.addEventListener('click', () => {
        // Remove active class from all options
        toneOptions.forEach(opt => opt.classList.remove('active'));
        
        // Add active class to clicked option
        option.classList.add('active');
        
        // Update selected tone
        this.selectedTone = option.dataset.tone;
        
        // Hide custom tone input if not custom
        const customInput = document.getElementById('customToneInput');
        if (this.selectedTone !== 'custom') {
          customInput.classList.remove('active');
          this.customTone = '';
        }
        
        this.saveData();
        this.addHapticFeedback();
      });
    });
  }

  setupCustomToneInput() {
    const customInput = document.getElementById('customToneInput');
    
    customInput.addEventListener('click', () => {
      if (!customInput.classList.contains('active')) {
        // Activate custom tone
        document.querySelectorAll('.tone-option').forEach(opt => opt.classList.remove('active'));
        customInput.classList.add('active');
        this.selectedTone = 'custom';
        
        // Convert to input field
        const currentText = customInput.textContent;
        customInput.innerHTML = `<input type="text" placeholder="e.g., witty and professional" style="
          background: transparent;
          border: none;
          outline: none;
          width: 100%;
          text-align: center;
          font-size: 13px;
          color: var(--primary);
        ">`;
        
        const input = customInput.querySelector('input');
        input.focus();
        
        input.addEventListener('blur', () => {
          const value = input.value.trim();
          if (value) {
            this.customTone = value;
            customInput.innerHTML = `✨ ${value}`;
          } else {
            customInput.classList.remove('active');
            customInput.innerHTML = '✨ Describe custom tone...';
            this.selectedTone = 'professional';
            document.querySelector('[data-tone="professional"]').classList.add('active');
          }
          this.saveData();
        });
        
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            input.blur();
          }
        });
      }
    });
  }

  setupRewriteButton() {
    const button = document.getElementById('rewriteButton');
    const inputText = document.getElementById('inputText');
    
    button.addEventListener('click', () => {
      this.handleRewrite();
    });
    
    // Auto-save input text
    inputText.addEventListener('input', () => {
      this.saveData();
      this.updateButtonState();
    });
    
    // Initial button state
    this.updateButtonState();
  }

  updateButtonState() {
    const button = document.getElementById('rewriteButton');
    const inputText = document.getElementById('inputText').value.trim();
    
    if (!inputText) {
      button.disabled = true;
      button.style.opacity = '0.6';
    } else {
      button.disabled = false;
      button.style.opacity = '1';
    }
  }

  async handleRewrite() {
    const inputText = document.getElementById('inputText').value.trim();
    const button = document.getElementById('rewriteButton');
    const resultSection = document.getElementById('resultSection');
    
    if (!inputText) {
      this.showToast('Please enter some text to rewrite', 'warning');
      return;
    }
    
    if (this.selectedTone === 'custom' && !this.customTone) {
      this.showToast('Please describe your custom tone', 'warning');
      return;
    }
    
    this.setLoadingState(true);
    
    try {
      const tone = this.selectedTone === 'custom' ? this.customTone : this.selectedTone;
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          action: 'rewrite',
          tone: tone,
          platform: 'general'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to rewrite text');
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
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                result += parsed.content;
                // Update result in real-time
                document.getElementById('resultText').textContent = result;
                resultSection.style.display = 'block';
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      if (result.trim()) {
        this.showResult(result.trim());
        this.addToHistory(inputText, result.trim(), tone);
        this.showToast('Text rewritten successfully!', 'success');
        this.addHapticFeedback();
      }

    } catch (error) {
      console.error('Rewrite error:', error);
      this.showToast('Failed to rewrite text. Please try again.', 'error');
    } finally {
      this.setLoadingState(false);
    }
  }

  setLoadingState(loading) {
    const button = document.getElementById('rewriteButton');
    const buttonContent = button.querySelector('.action-button-content');
    
    this.isLoading = loading;
    
    if (loading) {
      button.disabled = true;
      buttonContent.innerHTML = `
        <div class="loading">
          <div class="loading-spinner"></div>
          <span>Rewriting...</span>
        </div>
      `;
    } else {
      button.disabled = false;
      buttonContent.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
        <span>Rewrite with AI</span>
      `;
      this.updateButtonState();
    }
  }

  showResult(text) {
    const resultSection = document.getElementById('resultSection');
    const resultText = document.getElementById('resultText');
    
    resultText.textContent = text;
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Setup copy button
    const copyButton = document.getElementById('copyButton');
    copyButton.onclick = () => {
      navigator.clipboard.writeText(text).then(() => {
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
          copyButton.textContent = 'Copy';
        }, 2000);
        this.addHapticFeedback();
      });
    };
  }

  setupToggleButtons() {
    const toggles = document.querySelectorAll('.toggle');
    
    toggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        this.addHapticFeedback();
        
        // Handle specific toggle actions
        const settingItem = toggle.closest('.setting-item');
        const label = settingItem.querySelector('.setting-label').textContent;
        
        if (label === 'Dark mode') {
          this.toggleDarkMode(toggle.classList.contains('active'));
        }
        
        this.saveData();
      });
    });
  }

  toggleDarkMode(enabled) {
    if (enabled) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Cmd/Ctrl + Enter to rewrite
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        this.handleRewrite();
      }
      
      // Cmd/Ctrl + 1-4 for tab navigation
      if ((e.metaKey || e.ctrlKey) && ['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault();
        const tabIndex = parseInt(e.key) - 1;
        const tabs = document.querySelectorAll('.nav-tab');
        if (tabs[tabIndex]) {
          tabs[tabIndex].click();
        }
      }
    });
  }

  addToHistory(original, rewritten, tone) {
    const history = this.getHistory();
    const entry = {
      id: Date.now(),
      original,
      rewritten,
      tone,
      timestamp: new Date().toISOString(),
      platform: this.detectCurrentPlatform()
    };
    
    history.unshift(entry);
    
    // Keep only last 50 entries
    if (history.length > 50) {
      history.splice(50);
    }
    
    chrome.storage.local.set({ socialscribeHistory: history });
  }

  getHistory() {
    // This would be loaded from chrome.storage.local
    return [];
  }

  detectCurrentPlatform() {
    // This would detect the current website
    return 'extension';
  }

  showToast(message, type = 'info') {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 16px;
      border-radius: 8px;
      color: white;
      font-size: 13px;
      font-weight: 500;
      z-index: 1000;
      animation: slideIn 0.3s ease;
      background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--warning)'};
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  addHapticFeedback() {
    // Subtle visual feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }

  saveData() {
    const data = {
      currentTab: this.currentTab,
      selectedTone: this.selectedTone,
      customTone: this.customTone,
      inputText: document.getElementById('inputText').value,
      darkMode: document.body.classList.contains('dark')
    };
    
    chrome.storage.local.set({ socialscribePopupData: data });
  }

  loadSavedData() {
    chrome.storage.local.get(['socialscribePopupData'], (result) => {
      const data = result.socialscribePopupData || {};
      
      // Restore input text
      if (data.inputText) {
        document.getElementById('inputText').value = data.inputText;
      }
      
      // Restore selected tone
      if (data.selectedTone) {
        this.selectedTone = data.selectedTone;
        if (data.selectedTone === 'custom' && data.customTone) {
          this.customTone = data.customTone;
          const customInput = document.getElementById('customToneInput');
          customInput.classList.add('active');
          customInput.innerHTML = `✨ ${data.customTone}`;
        } else {
          const toneOption = document.querySelector(`[data-tone="${data.selectedTone}"]`);
          if (toneOption) {
            document.querySelectorAll('.tone-option').forEach(opt => opt.classList.remove('active'));
            toneOption.classList.add('active');
          }
        }
      }
      
      // Restore dark mode
      if (data.darkMode) {
        document.body.classList.add('dark');
        const darkModeToggle = document.querySelector('.setting-item:nth-child(2) .toggle');
        if (darkModeToggle) {
          darkModeToggle.classList.add('active');
        }
      }
      
      // Restore current tab
      if (data.currentTab && data.currentTab !== 'rewriter') {
        const tab = document.querySelector(`[data-tab="${data.currentTab}"]`);
        if (tab) {
          tab.click();
        }
      }
      
      this.updateButtonState();
    });
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SocialScribePopup();
});

// Handle extension context
if (typeof chrome !== 'undefined' && chrome.runtime) {
  // Extension-specific initialization
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // Could send message to content script if needed
  });
}