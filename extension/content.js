// SocialScribe+ Content Script
// Injects AI writing assistance into web pages

class SocialScribeContent {
  constructor() {
    this.isEnabled = true;
    this.currentTextArea = null;
    this.floatingButton = null;
    this.suggestionPanel = null;
    this.blurTimeout = null;
    this.isInteracting = false;
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.injectStyles();
    this.observeTextAreas();
    this.setupKeyboardShortcuts();
    
    // Listen for messages from popup/background
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'toggle') {
        this.isEnabled = !this.isEnabled;
        this.updateUI();
      }
      sendResponse({success: true});
    });
  }

  injectStyles() {
    if (document.getElementById('socialscribe-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'socialscribe-styles';
    style.textContent = `
      .socialscribe-floating-btn {
        position: absolute;
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #6366f1 0%, #5855eb 100%);
        border: none;
        border-radius: 8px;
        cursor: pointer;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        opacity: 0;
        transform: scale(0.8);
      }
      
      .socialscribe-floating-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
      }
      
      .socialscribe-floating-btn.show {
        opacity: 1;
        transform: scale(1);
      }
      
      .socialscribe-floating-btn svg {
        width: 18px;
        height: 18px;
        fill: white;
      }
      
      .socialscribe-panel {
        position: absolute;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 10001;
        min-width: 280px;
        max-width: 400px;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.2s ease;
        border: 1px solid #e2e8f0;
      }
      
      .socialscribe-panel.show {
        opacity: 1;
        transform: translateY(0);
      }
      
      .socialscribe-panel-header {
        padding: 16px;
        border-bottom: 1px solid #f1f5f9;
        font-weight: 600;
        font-size: 14px;
        color: #0f172a;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .socialscribe-panel-content {
        padding: 16px;
      }
      
      .socialscribe-action-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        padding: 12px;
        border: none;
        background: #f8fafc;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        color: #475569;
        margin-bottom: 8px;
        transition: all 0.2s ease;
      }
      
      .socialscribe-action-btn:hover {
        background: #f1f5f9;
        color: #334155;
      }
      
      .socialscribe-action-btn:last-child {
        margin-bottom: 0;
      }
      
      .socialscribe-loading {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        color: #6366f1;
        font-size: 14px;
      }
      
      .socialscribe-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid #e2e8f0;
        border-top: 2px solid #6366f1;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .socialscribe-suggestion {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 12px;
        font-size: 14px;
        line-height: 1.5;
      }
      
      .socialscribe-suggestion-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }
      
      .socialscribe-btn-accept {
        background: #6366f1;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
      }
      
      .socialscribe-btn-reject {
        background: #f1f5f9;
        color: #64748b;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }

  observeTextAreas() {
    // Watch for new text areas being added to the page
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.attachToTextAreas(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Attach to existing text areas
    this.attachToTextAreas(document);
  }

  attachToTextAreas(container) {
    const textAreas = container.querySelectorAll('textarea, [contenteditable="true"], [role="textbox"]');
    
    textAreas.forEach((textArea) => {
      if (textArea.dataset.socialscribeAttached) return;
      
      textArea.dataset.socialscribeAttached = 'true';
      
      textArea.addEventListener('focus', () => this.onTextAreaFocus(textArea));
      textArea.addEventListener('blur', () => this.onTextAreaBlur(textArea));
      textArea.addEventListener('input', () => this.onTextAreaInput(textArea));
    });
  }

  onTextAreaFocus(textArea) {
    if (!this.isEnabled) return;
    
    // Clear any pending blur timeout
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
      this.blurTimeout = null;
    }
    
    this.currentTextArea = textArea;
    this.showFloatingButton(textArea);
  }

  onTextAreaBlur(textArea) {
    // Don't hide if we're actively interacting with the UI
    if (this.isInteracting) return;
    
    // Delay hiding to allow clicking the button
    this.blurTimeout = setTimeout(() => {
      if (!this.isMouseOverPanel() && !this.isMouseOverButton() && !this.isInteracting) {
        this.hideFloatingButton();
        this.hideSuggestionPanel();
      }
    }, 500);
  }

  onTextAreaInput(textArea) {
    if (!this.isEnabled) return;
    
    // Update button position if text area size changes
    if (this.floatingButton && this.floatingButton.style.display !== 'none') {
      this.positionFloatingButton(textArea);
    }
  }

  showFloatingButton(textArea) {
    if (this.floatingButton) {
      this.floatingButton.remove();
    }

    this.floatingButton = document.createElement('button');
    this.floatingButton.className = 'socialscribe-floating-btn';
    this.floatingButton.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
        <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
        <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
      </svg>
    `;

    this.floatingButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.isInteracting = true;
      
      // Clear any pending blur timeout
      if (this.blurTimeout) {
        clearTimeout(this.blurTimeout);
        this.blurTimeout = null;
      }
      this.showSuggestionPanel(textArea);
    });

    // Prevent hiding when hovering over button
    this.floatingButton.addEventListener('mouseenter', () => {
      if (this.blurTimeout) {
        clearTimeout(this.blurTimeout);
        this.blurTimeout = null;
      }
    });

    this.floatingButton.addEventListener('mouseleave', () => {
      this.isInteracting = false;
    });

    document.body.appendChild(this.floatingButton);
    this.positionFloatingButton(textArea);

    // Show with animation
    setTimeout(() => {
      this.floatingButton.classList.add('show');
    }, 10);
  }

  positionFloatingButton(textArea) {
    if (!this.floatingButton) return;

    const rect = textArea.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    this.floatingButton.style.top = `${rect.top + scrollTop + 8}px`;
    this.floatingButton.style.left = `${rect.right + scrollLeft - 40}px`;
  }

  hideFloatingButton() {
    if (this.floatingButton) {
      this.floatingButton.classList.remove('show');
      setTimeout(() => {
        if (this.floatingButton) {
          this.floatingButton.remove();
          this.floatingButton = null;
        }
      }, 200);
    }
  }

  showSuggestionPanel(textArea) {
    if (this.suggestionPanel) {
      this.suggestionPanel.remove();
    }

    const text = this.getTextAreaValue(textArea);
    if (!text.trim()) {
      this.showQuickActions(textArea);
      return;
    }

    this.suggestionPanel = document.createElement('div');
    this.suggestionPanel.className = 'socialscribe-panel';
    this.suggestionPanel.innerHTML = `
      <div class="socialscribe-panel-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
          <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
        </svg>
        SocialScribe+
      </div>
      <div class="socialscribe-panel-content">
        <button class="socialscribe-action-btn" data-action="fix-grammar">
          <span>✏️</span> Fix Grammar
        </button>
        <button class="socialscribe-action-btn" data-action="rewrite-formal">
          <span>👔</span> Make Formal
        </button>
        <button class="socialscribe-action-btn" data-action="rewrite-friendly">
          <span>😊</span> Make Friendly
        </button>
        <button class="socialscribe-action-btn" data-action="shorten">
          <span>✂️</span> Shorten
        </button>
        <button class="socialscribe-action-btn" data-action="expand">
          <span>📝</span> Expand
        </button>
        <button class="socialscribe-action-btn" data-action="custom">
          <span>⚙️</span> Use Custom Instructions
        </button>
      </div>
    `;

    // Add event listeners
    this.suggestionPanel.querySelectorAll('.socialscribe-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const action = e.currentTarget.dataset.action;
        this.processText(textArea, text, action);
      });
    });

    // Prevent hiding when hovering over panel
    this.suggestionPanel.addEventListener('mouseenter', () => {
      if (this.blurTimeout) {
        clearTimeout(this.blurTimeout);
        this.blurTimeout = null;
      }
    });

    document.body.appendChild(this.suggestionPanel);
    this.positionSuggestionPanel(textArea);

    // Show with animation
    setTimeout(() => {
      this.suggestionPanel.classList.add('show');
    }, 10);
  }

  showQuickActions(textArea) {
    this.suggestionPanel = document.createElement('div');
    this.suggestionPanel.className = 'socialscribe-panel';
    this.suggestionPanel.innerHTML = `
      <div class="socialscribe-panel-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
          <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
        </svg>
        SocialScribe+
      </div>
      <div class="socialscribe-panel-content">
        <div style="color: #64748b; font-size: 14px; text-align: center; padding: 20px;">
          Start typing to get AI suggestions!
        </div>
      </div>
    `;

    document.body.appendChild(this.suggestionPanel);
    this.positionSuggestionPanel(textArea);

    setTimeout(() => {
      this.suggestionPanel.classList.add('show');
    }, 10);
  }

  positionSuggestionPanel(textArea) {
    if (!this.suggestionPanel) return;

    const rect = textArea.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    let top = rect.bottom + scrollTop + 8;
    let left = rect.left + scrollLeft;

    // Adjust if panel would go off screen
    const panelRect = this.suggestionPanel.getBoundingClientRect();
    if (left + 280 > window.innerWidth) {
      left = window.innerWidth - 290;
    }
    if (top + panelRect.height > window.innerHeight + scrollTop) {
      top = rect.top + scrollTop - panelRect.height - 8;
    }

    this.suggestionPanel.style.top = `${top}px`;
    this.suggestionPanel.style.left = `${left}px`;
  }

  hideSuggestionPanel() {
    if (this.suggestionPanel) {
      this.suggestionPanel.classList.remove('show');
      setTimeout(() => {
        if (this.suggestionPanel) {
          this.suggestionPanel.remove();
          this.suggestionPanel = null;
        }
      }, 200);
    }
  }

  async processText(textArea, text, action) {
    // Show loading state
    const content = this.suggestionPanel.querySelector('.socialscribe-panel-content');
    content.innerHTML = `
      <div class="socialscribe-loading">
        <div class="socialscribe-spinner"></div>
        Processing with AI...
      </div>
    `;

    try {
      // Use the web app's API endpoint
      const apiUrl = 'https://socialscribe.pages.dev/api/rewrite';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          action: action,
          tone: 'professional',
          platform: this.detectPlatform(),
          customInstructions: await this.getCustomInstructions()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process text');
      }

      const result = await response.json();
      this.showSuggestion(textArea, text, result.rewrittenText, action);

    } catch (error) {
      console.error('SocialScribe+ Error:', error);
      content.innerHTML = `
        <div style="color: #ef4444; font-size: 14px; text-align: center; padding: 20px;">
          <div style="margin-bottom: 8px;">⚠️ Connection Error</div>
          <div style="font-size: 12px; color: #64748b;">
            Please check your internet connection and try again.
          </div>
          <button class="socialscribe-action-btn" onclick="this.closest('.socialscribe-panel').remove()" style="margin-top: 12px; background: #f1f5f9;">
            Close
          </button>
        </div>
      `;
    }
  }

  showSuggestion(textArea, originalText, suggestion, action) {
    const content = this.suggestionPanel.querySelector('.socialscribe-panel-content');
    content.innerHTML = `
      <div class="socialscribe-suggestion">
        ${suggestion}
        <div class="socialscribe-suggestion-actions">
          <button class="socialscribe-btn-accept">Accept</button>
          <button class="socialscribe-btn-reject">Reject</button>
        </div>
      </div>
    `;

    // Add event listeners
    content.querySelector('.socialscribe-btn-accept').addEventListener('click', () => {
      this.setTextAreaValue(textArea, suggestion);
      this.hideSuggestionPanel();
      this.hideFloatingButton();
    });

    content.querySelector('.socialscribe-btn-reject').addEventListener('click', () => {
      this.hideSuggestionPanel();
    });
  }

  getTextAreaValue(textArea) {
    if (textArea.contentEditable === 'true') {
      return textArea.innerText || textArea.textContent || '';
    }
    return textArea.value || '';
  }

  setTextAreaValue(textArea, value) {
    if (textArea.contentEditable === 'true') {
      textArea.innerText = value;
      // Trigger input event
      textArea.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      textArea.value = value;
      // Trigger input event
      textArea.dispatchEvent(new Event('input', { bubbles: true }));
    }
    textArea.focus();
  }

  detectPlatform() {
    const hostname = window.location.hostname.toLowerCase();
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'twitter';
    if (hostname.includes('linkedin.com')) return 'linkedin';
    if (hostname.includes('gmail.com') || hostname.includes('mail.google.com')) return 'gmail';
    if (hostname.includes('facebook.com')) return 'facebook';
    if (hostname.includes('instagram.com')) return 'instagram';
    if (hostname.includes('reddit.com')) return 'reddit';
    return 'general';
  }

  isMouseOverPanel() {
    return this.suggestionPanel && this.suggestionPanel.matches(':hover');
  }

  isMouseOverButton() {
    return this.floatingButton && this.floatingButton.matches(':hover');
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+Shift+S (Cmd+Shift+S on Mac) to toggle
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        this.isEnabled = !this.isEnabled;
        this.updateUI();
      }
    });
  }

  async getCustomInstructions() {
    try {
      const result = await chrome.storage.local.get(['customInstructions']);
      return result.customInstructions || '';
    } catch (error) {
      console.error('Error getting custom instructions:', error);
      return '';
    }
  }

  updateUI() {
    if (!this.isEnabled) {
      this.hideFloatingButton();
      this.hideSuggestionPanel();
    }
  }
}

// Initialize when script loads
new SocialScribeContent();