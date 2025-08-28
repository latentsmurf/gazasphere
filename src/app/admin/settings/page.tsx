/**
 * Admin Settings Page - Site configuration and settings
 * 
 * Allows admins to configure site settings, memorial data,
 * social media links, and other global configurations.
 */

'use client'

import { useState } from 'react'
import { Save, Globe, Users, BarChart3, Shield } from 'lucide-react'

interface SiteSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  socialMedia: {
    twitter?: string
    facebook?: string
    linkedin?: string
  }
  analytics: {
    googleAnalyticsId?: string
  }
  memorial: {
    totalCasualties: number
    lastUpdated: string
    dataSources: string[]
  }
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Palestine Memorial',
    siteDescription: 'Honoring the memory of lives lost in Gaza and the West Bank through interactive visualization and remembrance.',
    siteUrl: 'https://palestine-memorial.org',
    socialMedia: {
      twitter: '@PalestineMemorial',
      facebook: 'PalestineMemorial',
      linkedin: 'palestine-memorial'
    },
    analytics: {
      googleAnalyticsId: 'GA-XXXXXXXXX'
    },
    memorial: {
      totalCasualties: 63872,
      lastUpdated: '2024-01-15',
      dataSources: [
        'Tech for Palestine',
        'Gaza Ministry of Health',
        'Palestinian Centre for Human Rights',
        'Al Mezan Center for Human Rights'
      ]
    }
  })

  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'social' | 'memorial' | 'analytics'>('general')

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      // In a real app, you'd send this to your API
      console.log('Saving settings:', settings)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Settings saved successfully!')
    } catch (error) {
      alert('Error saving settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (path: string, value: any) => {
    setSettings(prev => {
      const keys = path.split('.')
      const newSettings = { ...prev }
      let current: any = newSettings
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newSettings
    })
  }

  const addDataSource = () => {
    const newSource = prompt('Enter new data source:')
    if (newSource && newSource.trim()) {
      setSettings(prev => ({
        ...prev,
        memorial: {
          ...prev.memorial,
          dataSources: [...prev.memorial.dataSources, newSource.trim()]
        }
      }))
    }
  }

  const removeDataSource = (index: number) => {
    setSettings(prev => ({
      ...prev,
      memorial: {
        ...prev.memorial,
        dataSources: prev.memorial.dataSources.filter((_, i) => i !== index)
      }
    }))
  }

  const tabs = [
    { id: 'general' as const, label: 'General', icon: Globe },
    { id: 'social' as const, label: 'Social Media', icon: Users },
    { id: 'memorial' as const, label: 'Memorial Data', icon: BarChart3 },
    { id: 'analytics' as const, label: 'Analytics', icon: Shield }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure your site settings and preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-lg p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">General Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => updateSetting('siteName', e.target.value)}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Site Description
                    </label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => updateSetting('siteDescription', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Site URL
                    </label>
                    <input
                      type="url"
                      value={settings.siteUrl}
                      onChange={(e) => updateSetting('siteUrl', e.target.value)}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Social Media Settings */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Social Media</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Twitter Handle
                    </label>
                    <input
                      type="text"
                      value={settings.socialMedia.twitter || ''}
                      onChange={(e) => updateSetting('socialMedia.twitter', e.target.value)}
                      placeholder="@username"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Facebook Page
                    </label>
                    <input
                      type="text"
                      value={settings.socialMedia.facebook || ''}
                      onChange={(e) => updateSetting('socialMedia.facebook', e.target.value)}
                      placeholder="PageName"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      LinkedIn Page
                    </label>
                    <input
                      type="text"
                      value={settings.socialMedia.linkedin || ''}
                      onChange={(e) => updateSetting('socialMedia.linkedin', e.target.value)}
                      placeholder="company-name"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Memorial Data Settings */}
            {activeTab === 'memorial' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Memorial Data</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Total Casualties
                    </label>
                    <input
                      type="number"
                      value={settings.memorial.totalCasualties}
                      onChange={(e) => updateSetting('memorial.totalCasualties', parseInt(e.target.value))}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Last Updated
                    </label>
                    <input
                      type="date"
                      value={settings.memorial.lastUpdated}
                      onChange={(e) => updateSetting('memorial.lastUpdated', e.target.value)}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Data Sources
                    </label>
                    <div className="space-y-2">
                      {settings.memorial.dataSources.map((source, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={source}
                            onChange={(e) => {
                              const newSources = [...settings.memorial.dataSources]
                              newSources[index] = e.target.value
                              updateSetting('memorial.dataSources', newSources)
                            }}
                            className="flex-1 px-3 py-2 bg-background border border-border rounded text-foreground focus:border-primary focus:outline-none"
                          />
                          <button
                            onClick={() => removeDataSource(index)}
                            className="px-3 py-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addDataSource}
                        className="px-4 py-2 bg-accent hover:bg-accent/80 text-foreground rounded transition-colors"
                      >
                        Add Data Source
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Settings */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Analytics</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      value={settings.analytics.googleAnalyticsId || ''}
                      onChange={(e) => updateSetting('analytics.googleAnalyticsId', e.target.value)}
                      placeholder="GA-XXXXXXXXX"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter your Google Analytics tracking ID to enable analytics
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
