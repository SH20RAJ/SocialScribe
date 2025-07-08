"use client"

import { createContext, useContext, useState, useEffect } from 'react'

const ExtensionContext = createContext()

export function ExtensionProvider({ children }) {
  const [settings, setSettings] = useState({
    enabled: true,
    autoSuggest: true,
    keyboardShortcuts: true,
    defaultTone: 'professional',
    platforms: {
      twitter: true,
      linkedin: true,
      gmail: true,
      medium: true,
      reddit: true,
      general: true
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('socialscribe-settings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (err) {
        console.error('Failed to parse saved settings:', err)
      }
    }
  }, [])

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('socialscribe-settings', JSON.stringify(settings))
  }, [settings])

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const resetSettings = () => {
    setSettings({
      enabled: true,
      autoSuggest: true,
      keyboardShortcuts: true,
      defaultTone: 'professional',
      platforms: {
        twitter: true,
        linkedin: true,
        gmail: true,
        medium: true,
        reddit: true,
        general: true
      }
    })
  }

  const value = {
    settings,
    updateSettings,
    resetSettings,
    isLoading,
    setIsLoading,
    error,
    setError
  }

  return (
    <ExtensionContext.Provider value={value}>
      {children}
    </ExtensionContext.Provider>
  )
}

export function useExtension() {
  const context = useContext(ExtensionContext)
  if (!context) {
    throw new Error('useExtension must be used within an ExtensionProvider')
  }
  return context
}