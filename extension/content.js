// SocialScribe Redesigned Content Script
class SocialScribeWidget {
  constructor() {
    this.apiUrl = 'https://socialscribe.pages.dev/api/rewrite';
    this.activeElement = null;
    this.currentWidget = null;
    this.currentPanel = null;
    this.selectedTone = 'professional';
    this.isProcessing = false;
    this.platform = this.detectPlatform();
    this.isDarkMode = this.detectDarkMode();
    this.suggestions = new Map();
    
    this.tones = [
      { id: 'professional', emoji: '🎓', label: 'Professional' },
      { id: 'casual', emoji: '😎', label: 'Casual' },
      { id: 'friendly', emoji: '😊', label: 'Friendly' },
      { id: 'formal', emoji: '👔', label: 'Formal' },
      { id: 'flirty', emoji: '💕', label: 'Flirty' },
      { id: 'confident', emoji: '💪', label: 'Confident' },
      { id: 'humorous', emoji: '😄', label: 'Humorous' },
      { id: 'empathetic', emoji: '🤗', label: 'Empathetic' }
    ];
    
    this.init();
  }

  init() {
    console.log('SocialScribe: Initializing content script');
    this.injectStyles();
    this.setupObserver();
    
    // Wait a bit for page to load, then attach to existing fields
    setTimeout(() => {
      this.attachToExistingFields();
    }, 1000);
    
    this.setupKeyboardShortcuts();
    this.setupMessageListener();
    
    // Platform-specific initialization
    this.platformSpecificInit();
    
    console.log('SocialScribe: Content script initialized');
  }

  injectStyles() {
    if (document.getElementById('socialscribe-styles')) return;
    
    const link = document.createElement('link');
    link.id = 'socialscribe-styles';
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('content.css');
    document.head.appendChild(link);
  }

  detectPlatform() {
    const hostname = window.location.hostname.toLowerCase();
    
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'twitter';
    if (hostname.includes('linkedin.com')) return 'linkedin';
    if (hostname.includes('gmail.com')) return 'gmail';
    if (hostname.includes('medium.com')) return 'medium';
    if (hostname.includes('reddit.com')) return 'reddit';
    if (hostname.includes('facebook.com')) return 'facebook';
    if (hostname.includes('notion.so')) return 'notion';
    if (hostname.includes('docs.google.com')) return 'gdocs';
    
    return 'general';
  }

  detectDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ||
           document.documentElement.classList.contains('dark') ||
           document.body.classList.contains('dark');
  }

  platformSpecificInit() {
    switch (this.platform) {
      case 'twitter':
        this.setupTwitterSpecific();
        break;
      case 'linkedin':
        this.setupLinkedInSpecific();
        break;
      case 'gmail':
        this.setupGmailSpecific();
        break;
      default:
        this.setupGeneralPlatform();
    }
  }

  setupTwitterSpecific() {
    // Twitter-specific optimizations
    this.observeTwitterCompose();
  }

  setupLinkedInSpecific() {
    // LinkedIn-specific optimizations
    this.observeLinkedInEditor();
  }

  setupGmailSpecific() {
    // Gmail-specific optimizations
    this.observeGmailCompose();
  }

  setupGeneralPlatform() {
    // General platform setup
  }

  setupObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            this.attachToNewElements(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  attachToExistingFields() {
    const selectors = this.getTextFieldSelectors();
    console.log('SocialScribe: Looking for elements with selectors:', selectors);
    const elements = document.querySelectorAll(selectors.join(', '));
    console.log('SocialScribe: Found', elements.length, 'text elements');
    
    elements.forEach(element => {
      this.attachToElement(element);
    });
  }

  attachToNewElements(container) {
    const selectors = this.getTextFieldSelectors();
    
    if (this.matchesSelector(container, selectors)) {
      this.attachToElement(container);
    }
    
    const elements = container.querySelectorAll(selectors.join(', '));
    elements.forEach(element => {
      this.attachToElement(element);
    });
  }

  getTextFieldSelectors() {
    const baseSelectors = [
      'textarea',
      'input[type="text"]',
      'input[type="email"]',
      'input[type="search"]',
      '[contenteditable="true"]',
      '[contenteditable=""]'
    ];

    // Platform-specific selectors
    const platformSelectors = {
      twitter: [
        '[data-testid="tweetTextarea_0"]',
        '[data-testid="dmComposerTextInput"]',
        '.DraftEditor-editorContainer'
      ],
      linkedin: [
        '.ql-editor',
        '[data-placeholder*="Share an update"]',
        '.msg-form__contenteditable'
      ],
      gmail: [
        '[contenteditable="true"][role="textbox"]',
        '.Am.Al.editable'
      ]
    };

    return [...baseSelectors, ...(platformSelectors[this.platform] || [])];
  }

  matchesSelector(element, selectors) {
    return selectors.some(selector => {
      try {
        return element.matches(selector);
      } catch (e) {
        return false;
      }
    });
  }

  attachToElement(element) {
    if (element.dataset.socialscribeAttached || !this.isValidElement(element)) {
      return;
    }

    console.log('SocialScribe: Attaching to element', element);
    element.dataset.socialscribeAttached = 'true';
    
    // Create widget for this element
    const widget = this.createWidget(element);
    
    // Setup event listeners
    this.setupElementListeners(element, widget);
    
    // Position widget initially (hidden)
    this.positionWidget(element, widget);
    
    console.log('SocialScribe: Widget created and attached', widget);
  }

  isValidElement(element) {
    try {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      
      const isValid = rect.width > 20 && 
             rect.height > 15 && 
             style.display !== 'none' && 
             style.visibility !== 'hidden' &&
             !element.disabled &&
             !element.readOnly;
      
      console.log('SocialScribe: Element validation', element, {
        width: rect.width,
        height: rect.height,
        display: style.display,
        visibility: style.visibility,
        disabled: element.disabled,
        readOnly: element.readOnly,
        isValid
      });
      
      return isValid;
    } catch (error) {
      console.error('SocialScribe: Error validating element', error);
      return false;
    }
  }

  createWidget(element) {
    const widget = document.createElement('div');
    widget.className = 'socialscribe-widget';
    widget.dataset.platform = this.platform;
    
    if (this.isDarkMode) {
      widget.classList.add('ss-dark');
    }

    const button = document.createElement('div');
    button.className = 'socialscribe-floating-button';
    button.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
        <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
        <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
      </svg>
    `;

    widget.appendChild(button);
    
    // Create quick panel
    const panel = this.createQuickPanel();
    widget.appendChild(panel);
    
    // Initially hide the widget
    widget.style.display = 'none';
    
    document.body.appendChild(widget);

    return widget;
  }

  createQuickPanel() {
    const panel = document.createElement('div');
    panel.className = 'socialscribe-quick-panel';
    
    panel.innerHTML = `
      <div class="socialscribe-quick-header">
        <div class="socialscribe-quick-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
          SocialScribe
        </div>
        <button class="socialscribe-close-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="socialscribe-tone-radial">
        ${this.tones.slice(0, 6).map(tone => `
          <div class="socialscribe-tone-option ${tone.id === this.selectedTone ? 'active' : ''}" 
               data-tone="${tone.id}" 
               title="${tone.label}">
            <span class="socialscribe-tone-emoji">${tone.emoji}</span>
          </div>
        `).join('')}
      </div>
      
      <div class="socialscribe-quick-actions">
        <button class="socialscribe-action-btn" data-action="fix_grammar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
          Fix Grammar
        </button>
        <button class="socialscribe-action-btn" data-action="rewrite">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
          Rewrite
        </button>
        <button class="socialscribe-action-btn" data-action="shorten">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
            <path d="M6 12h9"/>
          </svg>
          Shorten
        </button>
        <button class="socialscribe-action-btn" data-action="expand">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17,8 12,3 7,8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Expand
        </button>
      </div>
    `;

    return panel;
  }

  setupElementListeners(element, widget) {
    const button = widget.querySelector('.socialscribe-floating-button');
    const panel = widget.querySelector('.socialscribe-quick-panel');
    const closeBtn = widget.querySelector('.socialscribe-close-btn');
    
    // Show/hide widget based on focus
    element.addEventListener('focus', () => {
      this.activeElement = element;
      this.currentWidget = widget;
      this.currentPanel = panel;
      this.showWidget(widget);
      this.positionWidget(element, widget);
    });

    element.addEventListener('blur', (e) => {
      setTimeout(() => {
        if (!widget.contains(document.activeElement) && 
            document.activeElement !== element) {
          this.hideWidget(widget);
        }
      }, 150);
    });

    // Button click to toggle panel
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePanel(panel);
    });

    // Close button
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hidePanel(panel);
    });

    // Tone selection
    const toneOptions = panel.querySelectorAll('.socialscribe-tone-option');
    toneOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectTone(option.dataset.tone, panel);
      });
    });

    // Action buttons
    const actionBtns = panel.querySelectorAll('.socialscribe-action-btn');
    actionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleAction(btn.dataset.action, element);
      });
    });

    // Real-time suggestions
    this.setupRealTimeSuggestions(element);

    // Resize observer for repositioning
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(() => {
        this.positionWidget(element, widget);
      });
      resizeObserver.observe(element);
    }
  }

  setupRealTimeSuggestions(element) {
    let timeout;
    
    element.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.checkForSuggestions(element);
      }, 1000);
    });
  }

  async checkForSuggestions(element) {
    const text = this.getElementText(element);
    if (!text || text.length < 10) return;

    // Simple grammar check (this could be enhanced with a proper grammar API)
    const suggestions = this.getQuickSuggestions(text);
    if (suggestions.length > 0) {
      this.showSuggestionTooltip(element, suggestions[0]);
    }
  }

  getQuickSuggestions(text) {
    const suggestions = [];
    
    // Basic grammar checks
    if (text.includes(' i ')) {
      suggestions.push({
        type: 'grammar',
        message: 'Consider capitalizing "I"',
        fix: text.replace(/ i /g, ' I ')
      });
    }
    
    if (text.match(/\w+\s+\w+\s+\w+\s+\w+\s+\w+\s+\w+\s+\w+/)) {
      suggestions.push({
        type: 'style',
        message: 'This sentence might be too long',
        action: 'shorten'
      });
    }
    
    return suggestions;
  }

  showSuggestionTooltip(element, suggestion) {
    const existing = document.querySelector('.socialscribe-suggestion-tooltip');
    if (existing) existing.remove();

    const tooltip = document.createElement('div');
    tooltip.className = 'socialscribe-suggestion-tooltip';
    
    tooltip.innerHTML = `
      <div>${suggestion.message}</div>
      <div class="socialscribe-suggestion-actions">
        <button class="socialscribe-suggestion-btn primary" data-action="apply">
          ${suggestion.fix ? 'Fix' : 'Improve'}
        </button>
        <button class="socialscribe-suggestion-btn" data-action="dismiss">
          Dismiss
        </button>
      </div>
    `;

    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
    
    setTimeout(() => tooltip.classList.add('show'), 10);

    // Setup tooltip actions
    tooltip.querySelector('[data-action="apply"]').addEventListener('click', () => {
      if (suggestion.fix) {
        this.setElementText(element, suggestion.fix);
      } else if (suggestion.action) {
        this.handleAction(suggestion.action, element);
      }
      tooltip.remove();
    });

    tooltip.querySelector('[data-action="dismiss"]').addEventListener('click', () => {
      tooltip.remove();
    });

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      if (tooltip.parentNode) tooltip.remove();
    }, 5000);
  }

  positionWidget(element, widget) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    // Position in bottom-right corner of element
    widget.style.position = 'absolute';
    widget.style.left = (rect.right - 45 + scrollLeft) + 'px';
    widget.style.top = (rect.bottom - 45 + scrollTop) + 'px';
    widget.style.zIndex = '999999';
  }

  showWidget(widget) {
    console.log('SocialScribe: Showing widget', widget);
    widget.style.display = 'block';
    const button = widget.querySelector('.socialscribe-floating-button');
    setTimeout(() => {
      button.style.opacity = '1';
      button.style.transform = 'scale(1)';
    }, 10);
  }

  hideWidget(widget) {
    const button = widget.querySelector('.socialscribe-floating-button');
    const panel = widget.querySelector('.socialscribe-quick-panel');
    
    button.style.opacity = '0';
    button.style.transform = 'scale(0.8)';
    panel.classList.remove('show');
    
    setTimeout(() => {
      widget.style.display = 'none';
    }, 300);
  }

  togglePanel(panel) {
    panel.classList.toggle('show');
  }

  hidePanel(panel) {
    panel.classList.remove('show');
  }

  selectTone(toneId, panel) {
    this.selectedTone = toneId;
    
    const toneOptions = panel.querySelectorAll('.socialscribe-tone-option');
    toneOptions.forEach(option => {
      option.classList.toggle('active', option.dataset.tone === toneId);
    });

    // Haptic feedback
    this.addHapticFeedback();
  }

  async handleAction(action, element) {
    if (this.isProcessing) return;

    const text = this.getElementText(element);
    if (!text.trim()) {
      this.showToast('Please enter some text first', 'warning');
      return;
    }

    this.setProcessingState(true);

    try {
      const result = await this.processText(text, action, this.selectedTone);
      if (result) {
        this.setElementText(element, result);
        this.showToast(`Text ${action}ed successfully!`, 'success');
        this.addHapticFeedback();
        
        // Hide panel after successful action
        if (this.currentPanel) {
          this.hidePanel(this.currentPanel);
        }
      }
    } catch (error) {
      console.error('Action error:', error);
      this.showToast('Failed to process text. Please try again.', 'error');
    } finally {
      this.setProcessingState(false);
    }
  }

  async processText(text, action, tone) {
    try {
      // Try direct API call first
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          action: action,
          tone: tone,
          platform: this.platform
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process text');
      }

      return await this.processStreamResponse(response);
    } catch (error) {
      // Fallback: Use background script as proxy for CORS issues
      console.log('Direct API failed, trying background script proxy:', error);
      return await this.processTextViaBackground(text, action, tone);
    }
  }

  async processTextViaBackground(text, action, tone) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        action: 'processText',
        data: {
          text: text,
          action: action,
          tone: tone,
          platform: this.platform
        }
      }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response.result);
        }
      });
    });
  }

  async processStreamResponse(response) {

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
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    return result.trim();
  }

  getElementText(element) {
    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
      return element.value;
    } else if (element.contentEditable === 'true') {
      return element.textContent || element.innerText;
    }
    return '';
  }

  setElementText(element, text) {
    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
      element.value = text;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (element.contentEditable === 'true') {
      element.textContent = text;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  setProcessingState(processing) {
    this.isProcessing = processing;
    
    if (this.currentPanel) {
      const actionBtns = this.currentPanel.querySelectorAll('.socialscribe-action-btn');
      actionBtns.forEach(btn => {
        btn.disabled = processing;
        btn.style.opacity = processing ? '0.6' : '1';
      });
    }
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Cmd/Ctrl + Shift + S to open SocialScribe
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        if (this.activeElement && this.currentWidget) {
          const panel = this.currentWidget.querySelector('.socialscribe-quick-panel');
          this.togglePanel(panel);
        }
      }
    });
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'contextMenuAction') {
        if (this.activeElement) {
          this.handleAction(request.type, this.activeElement);
        }
      }
    });
  }

  addHapticFeedback() {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `socialscribe-status ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      z-index: 999999 !important;
      animation: ss-fadeIn 0.3s ease !important;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'ss-fadeIn 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Platform-specific observers
  observeTwitterCompose() {
    // Twitter-specific DOM observation
    const observer = new MutationObserver(() => {
      const composeAreas = document.querySelectorAll('[data-testid="tweetTextarea_0"]');
      composeAreas.forEach(area => this.attachToElement(area));
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }

  observeLinkedInEditor() {
    // LinkedIn-specific DOM observation
    const observer = new MutationObserver(() => {
      const editors = document.querySelectorAll('.ql-editor');
      editors.forEach(editor => this.attachToElement(editor));
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }

  observeGmailCompose() {
    // Gmail-specific DOM observation
    const observer = new MutationObserver(() => {
      const composeAreas = document.querySelectorAll('[contenteditable="true"][role="textbox"]');
      composeAreas.forEach(area => this.attachToElement(area));
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SocialScribeWidget();
  });
} else {
  new SocialScribeWidget();
}