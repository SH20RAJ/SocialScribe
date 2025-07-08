// SocialScribe+ Content Script
class SocialScribeExtension {
  constructor() {
    this.apiUrl = 'https://socialscribe.pages.dev/api/rewrite'
    this.activeElement = null
    this.floatingButton = null
    this.popup = null
    this.isProcessing = false
    
    this.init()
  }

  init() {
    this.createFloatingButton()
    this.attachEventListeners()
    this.observeTextareas()
  }

  // Create the floating AI button
  createFloatingButton() {
    this.floatingButton = document.createElement('div')
    this.floatingButton.id = 'socialscribe-floating-btn'
    this.floatingButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
        <path d="M19 15L20.09 18.26L23 19L20.09 19.74L19 23L17.91 19.74L15 19L17.91 18.26L19 15Z" fill="currentColor"/>
        <path d="M5 6L6.09 9.26L9 10L6.09 10.74L5 14L3.91 10.74L1 10L3.91 9.26L5 6Z" fill="currentColor"/>
      </svg>
    `
    this.floatingButton.style.display = 'none'
    document.body.appendChild(this.floatingButton)
  }

  // Create the popup interface
  createPopup() {
    if (this.popup) return

    this.popup = document.createElement('div')
    this.popup.id = 'socialscribe-popup'
    this.popup.innerHTML = `
      <div class="socialscribe-popup-header">
        <div class="socialscribe-logo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
          </svg>
          SocialScribe+
        </div>
        <button class="socialscribe-close-btn">&times;</button>
      </div>
      <div class="socialscribe-popup-content">
        <div class="socialscribe-actions">
          <button class="socialscribe-action-btn" data-action="fix_grammar">
            <span class="action-icon">✓</span>
            Fix Grammar
          </button>
          <button class="socialscribe-action-btn" data-action="rewrite">
            <span class="action-icon">✍️</span>
            Rewrite
          </button>
          <button class="socialscribe-action-btn" data-action="shorten">
            <span class="action-icon">📝</span>
            Shorten
          </button>
          <button class="socialscribe-action-btn" data-action="expand">
            <span class="action-icon">📄</span>
            Expand
          </button>
          <button class="socialscribe-action-btn" data-action="formalize">
            <span class="action-icon">👔</span>
            Formalize
          </button>
          <button class="socialscribe-action-btn" data-action="summarize">
            <span class="action-icon">📋</span>
            Summarize
          </button>
        </div>
        <div class="socialscribe-tone-selector" style="display: none;">
          <label>Tone:</label>
          <select class="socialscribe-tone-select">
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
            <option value="humorous">Humorous</option>
            <option value="persuasive">Persuasive</option>
            <option value="empathetic">Empathetic</option>
            <option value="confident">Confident</option>
          </select>
        </div>
        <div class="socialscribe-loading" style="display: none;">
          <div class="socialscribe-spinner"></div>
          <span>Improving your text...</span>
        </div>
      </div>
    `
    document.body.appendChild(this.popup)

    // Add event listeners
    this.popup.querySelector('.socialscribe-close-btn').addEventListener('click', () => {
      this.hidePopup()
    })

    this.popup.querySelectorAll('.socialscribe-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action
        if (action === 'rewrite') {
          this.showToneSelector()
        } else {
          this.processText(action)
        }
      })
    })

    this.popup.querySelector('.socialscribe-tone-select').addEventListener('change', (e) => {
      this.processText('rewrite', e.target.value)
    })
  }

  // Observe textareas and input fields
  observeTextareas() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            this.attachToTextInputs(node)
          }
        })
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // Initial attachment
    this.attachToTextInputs(document)
  }

  attachToTextInputs(container) {
    const textInputs = container.querySelectorAll('textarea, input[type="text"], [contenteditable="true"]')
    
    textInputs.forEach(input => {
      if (input.dataset.socialscribeAttached) return
      
      input.dataset.socialscribeAttached = 'true'
      
      input.addEventListener('focus', (e) => {
        this.activeElement = e.target
        this.showFloatingButton(e.target)
      })
      
      input.addEventListener('blur', (e) => {
        setTimeout(() => {
          if (!this.popup || !this.popup.contains(document.activeElement)) {
            this.hideFloatingButton()
          }
        }, 100)
      })
    })
  }

  attachEventListeners() {
    this.floatingButton.addEventListener('click', () => {
      this.createPopup()
      this.showPopup()
    })

    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
      if (this.popup && !this.popup.contains(e.target) && !this.floatingButton.contains(e.target)) {
        this.hidePopup()
      }
    })

    // Keyboard shortcut: Cmd/Ctrl + Shift + G
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'G') {
        e.preventDefault()
        if (this.activeElement && this.getTextFromElement(this.activeElement)) {
          this.processText('fix_grammar')
        }
      }
    })
  }

  showFloatingButton(element) {
    const rect = element.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    
    this.floatingButton.style.display = 'flex'
    this.floatingButton.style.top = (rect.bottom + scrollTop - 10) + 'px'
    this.floatingButton.style.left = (rect.right + scrollLeft - 40) + 'px'
  }

  hideFloatingButton() {
    this.floatingButton.style.display = 'none'
  }

  showPopup() {
    if (!this.popup) this.createPopup()
    
    const rect = this.floatingButton.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    
    this.popup.style.display = 'block'
    this.popup.style.top = (rect.top + scrollTop - 200) + 'px'
    this.popup.style.left = (rect.left + scrollLeft - 150) + 'px'
    
    // Adjust position if popup goes off screen
    const popupRect = this.popup.getBoundingClientRect()
    if (popupRect.right > window.innerWidth) {
      this.popup.style.left = (window.innerWidth - popupRect.width - 20) + 'px'
    }
    if (popupRect.top < 0) {
      this.popup.style.top = '20px'
    }
  }

  hidePopup() {
    if (this.popup) {
      this.popup.style.display = 'none'
      this.hideToneSelector()
    }
  }

  showToneSelector() {
    const toneSelector = this.popup.querySelector('.socialscribe-tone-selector')
    toneSelector.style.display = 'block'
  }

  hideToneSelector() {
    const toneSelector = this.popup.querySelector('.socialscribe-tone-selector')
    if (toneSelector) {
      toneSelector.style.display = 'none'
    }
  }

  showLoading() {
    const loading = this.popup.querySelector('.socialscribe-loading')
    const actions = this.popup.querySelector('.socialscribe-actions')
    loading.style.display = 'flex'
    actions.style.display = 'none'
    this.hideToneSelector()
  }

  hideLoading() {
    const loading = this.popup.querySelector('.socialscribe-loading')
    const actions = this.popup.querySelector('.socialscribe-actions')
    loading.style.display = 'none'
    actions.style.display = 'grid'
  }

  getTextFromElement(element) {
    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
      return element.value
    } else if (element.contentEditable === 'true') {
      return element.textContent || element.innerText
    }
    return ''
  }

  setTextToElement(element, text) {
    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
      element.value = text
      element.dispatchEvent(new Event('input', { bubbles: true }))
    } else if (element.contentEditable === 'true') {
      element.textContent = text
      element.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }

  async processText(action, tone = 'professional') {
    if (!this.activeElement || this.isProcessing) return

    const originalText = this.getTextFromElement(this.activeElement)
    if (!originalText.trim()) return

    this.isProcessing = true
    this.showLoading()

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: originalText,
          action: action,
          tone: tone,
          platform: this.detectPlatform()
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to process text')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let improvedText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                improvedText += parsed.content
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      if (improvedText.trim()) {
        this.setTextToElement(this.activeElement, improvedText.trim())
      }

    } catch (error) {
      console.error('SocialScribe+ Error:', error)
      // Show error message to user
      alert('Sorry, there was an error processing your text. Please try again.')
    } finally {
      this.isProcessing = false
      this.hideLoading()
      this.hidePopup()
    }
  }

  detectPlatform() {
    const hostname = window.location.hostname.toLowerCase()
    
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      return 'twitter'
    } else if (hostname.includes('linkedin.com')) {
      return 'linkedin'
    } else if (hostname.includes('gmail.com')) {
      return 'gmail'
    } else if (hostname.includes('medium.com')) {
      return 'medium'
    } else if (hostname.includes('reddit.com')) {
      return 'reddit'
    }
    
    return 'general'
  }
}

// Initialize the extension when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SocialScribeExtension()
  })
} else {
  new SocialScribeExtension()
}