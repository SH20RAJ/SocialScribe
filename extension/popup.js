// Extension popup functionality
let selectedAction = 'fix_grammar'
let selectedTone = 'professional'
let isLoading = false
let outputText = ''

// Initialize popup
document.addEventListener('DOMContentLoaded', function() {
  initializeChips()
  initializeButtons()
  loadSavedData()
})

function initializeChips() {
  // Action chips
  const actionChips = document.querySelectorAll('#actionChips .chip')
  actionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      actionChips.forEach(c => c.classList.remove('active'))
      chip.classList.add('active')
      selectedAction = chip.dataset.value
      saveData()
    })
  })

  // Tone chips
  const toneChips = document.querySelectorAll('#toneChips .chip')
  const customToneSection = document.getElementById('customToneSection')
  const customToneInput = document.getElementById('customTone')
  
  toneChips.forEach(chip => {
    chip.addEventListener('click', () => {
      toneChips.forEach(c => c.classList.remove('active'))
      chip.classList.add('active')
      selectedTone = chip.dataset.value
      
      // Show/hide custom tone input
      if (selectedTone === 'custom') {
        customToneSection.style.display = 'block'
      } else {
        customToneSection.style.display = 'none'
      }
      
      saveData()
    })
  })
  
  // Custom tone input
  customToneInput.addEventListener('input', saveData)
}

function initializeButtons() {
  // Rewrite button
  document.getElementById('rewriteBtn').addEventListener('click', handleRewrite)
  
  // Copy buttons
  document.getElementById('copyText').addEventListener('click', () => copyToClipboard('text'))
  document.getElementById('copyMarkdown').addEventListener('click', () => copyToClipboard('markdown'))
  
  // Open web app
  document.getElementById('openWebApp').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://socialscribe.pages.dev' })
  })

  // Auto-save input
  document.getElementById('inputText').addEventListener('input', saveData)
  document.getElementById('customInstructions').addEventListener('input', saveData)
}

async function handleRewrite() {
  const inputText = document.getElementById('inputText').value.trim()
  const customInstructions = document.getElementById('customInstructions').value.trim()
  const customTone = document.getElementById('customTone').value.trim()
  
  if (!inputText) {
    showError('Please enter some text to rewrite')
    return
  }

  // Validate custom tone if selected
  if (selectedTone === 'custom' && !customTone) {
    showError('Please describe your custom tone')
    return
  }

  setLoading(true)
  
  try {
    const response = await fetch('https://socialscribe.pages.dev/api/rewrite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: inputText,
        action: selectedAction,
        tone: selectedTone === 'custom' ? customTone : selectedTone,
        platform: 'general',
        customInstructions: customInstructions
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to rewrite text')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    outputText = ''

    // Show result container
    document.getElementById('result').style.display = 'block'
    document.getElementById('result').textContent = ''

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
              outputText += parsed.content
              // Convert markdown to plain text for display in extension
              const plainText = convertMarkdownToPlainText(outputText)
              document.getElementById('result').textContent = plainText
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    // Show copy buttons
    document.getElementById('copyButtons').style.display = 'flex'
    
  } catch (error) {
    console.error('Error:', error)
    showError('Sorry, there was an error processing your request. Please try again.')
  } finally {
    setLoading(false)
  }
}

function convertMarkdownToPlainText(markdown) {
  return markdown
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1') // Italic
    .replace(/`(.*?)`/g, '$1') // Inline code
    .replace(/#{1,6}\s/g, '') // Headers
    .replace(/^\s*[-*+]\s/gm, '') // List items
    .replace(/^\s*\d+\.\s/gm, '') // Numbered lists
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/^\s*>\s/gm, '') // Blockquotes
    .trim()
}

async function copyToClipboard(type) {
  try {
    let textToCopy = outputText
    
    if (type === 'text') {
      textToCopy = convertMarkdownToPlainText(outputText)
    }
    
    await navigator.clipboard.writeText(textToCopy)
    
    // Visual feedback
    const button = type === 'text' ? document.getElementById('copyText') : document.getElementById('copyMarkdown')
    const originalText = button.textContent
    button.textContent = 'Copied!'
    button.classList.add('copied')
    
    setTimeout(() => {
      button.textContent = originalText
      button.classList.remove('copied')
    }, 2000)
    
  } catch (err) {
    console.error('Failed to copy text: ', err)
    showError('Failed to copy text')
  }
}

function setLoading(loading) {
  isLoading = loading
  const btn = document.getElementById('rewriteBtn')
  const result = document.getElementById('result')
  
  if (loading) {
    btn.disabled = true
    btn.innerHTML = '<div class="spinner"></div> Rewriting...'
    result.style.display = 'block'
    result.className = 'result loading'
    result.innerHTML = '<div class="spinner"></div>'
    document.getElementById('copyButtons').style.display = 'none'
  } else {
    btn.disabled = false
    btn.textContent = 'Rewrite text'
    result.className = 'result'
  }
}

function showError(message) {
  const result = document.getElementById('result')
  result.style.display = 'block'
  result.className = 'result'
  result.textContent = message
  result.style.color = '#dc2626'
  document.getElementById('copyButtons').style.display = 'none'
}

function saveData() {
  const data = {
    inputText: document.getElementById('inputText').value,
    customInstructions: document.getElementById('customInstructions').value,
    customTone: document.getElementById('customTone').value,
    selectedAction,
    selectedTone
  }
  chrome.storage.local.set(data)
}

function loadSavedData() {
  chrome.storage.local.get(['inputText', 'customInstructions', 'customTone', 'selectedAction', 'selectedTone'], (result) => {
    if (result.inputText) {
      document.getElementById('inputText').value = result.inputText
    }
    if (result.customInstructions) {
      document.getElementById('customInstructions').value = result.customInstructions
    }
    if (result.customTone) {
      document.getElementById('customTone').value = result.customTone
    }
    if (result.selectedAction) {
      selectedAction = result.selectedAction
      updateActiveChip('#actionChips', selectedAction)
    }
    if (result.selectedTone) {
      selectedTone = result.selectedTone
      updateActiveChip('#toneChips', selectedTone)
      
      // Show custom tone section if custom is selected
      if (selectedTone === 'custom') {
        document.getElementById('customToneSection').style.display = 'block'
      }
    }
  })
}

function updateActiveChip(container, value) {
  const chips = document.querySelectorAll(`${container} .chip`)
  chips.forEach(chip => {
    chip.classList.remove('active')
    if (chip.dataset.value === value) {
      chip.classList.add('active')
    }
  })
}