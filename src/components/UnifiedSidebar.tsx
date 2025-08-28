/**
 * @fileoverview UnifiedSidebar Component - Main Control Panel for Gaza Memorial Visualization
 *
 * This component serves as the comprehensive control center for the 3D memorial visualization,
 * providing users with intuitive controls to customize every aspect of the experience.
 *
 * Key Features:
 * - Visual Settings: Particle appearance, sphere distortion, lighting, shaders
 * - Audio Controls: Volume settings, voice synthesis options
 * - UI Customization: Panel visibility, tooltips, information display
 * - Data Filtering: Search, filter, and navigate through casualty data
 * - Social Sharing: Export and share the memorial experience
 * - Real-time Preview: Live updates of all visualization changes
 *
 * The sidebar is designed to be collapsible and responsive, ensuring it doesn't
 * interfere with the immersive memorial experience while providing full control
 * over all visualization parameters.
 *
 * @author Gaza Memorial Visualization Team
 * @version 1.0.0
 * @since 2024
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  ChevronDown,
  Settings,
  Share2,
  Filter,
  X,
  Eye,
  EyeOff,
  Palette,
  Layout,
  Info,
  Volume2,
  RotateCcw,
  Users,
  Calendar,
  FileText,
  Search,
  Twitter,
  Facebook,
  Link as LinkIcon,
  Mail,
  MessageCircle,
  Linkedin
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Casualty } from '@/lib/dataLoader'
import { useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

/**
 * Props for the UnifiedSidebar component
 */
interface UnifiedSidebarProps {
  /** Array of casualty data for filtering and display */
  data: Casualty[]
  /** Total number of casualties in current view */
  casualtyCount: number
  /** UI visibility settings */
  uiSettings: {
    /** Show memorial information panel */
    showMemorialInfo: boolean
    /** Show user instructions */
    showInstructions: boolean
    /** Show data filtering panel */
    showFiltersPanel: boolean
    /** Show audio control panel */
    showAudioControls: boolean
    /** Show hover tooltips */
    showHoverTooltip: boolean
  }
  /** Callback to update UI settings */
  onUISettingsChange: (settings: Partial<UnifiedSidebarProps['uiSettings']>) => void
  /** Visual appearance and behavior settings */
  visualSettings: {
    /** Size of individual particles (0.1-2.0) */
    particleSize: number
    /** Opacity of particles (0.0-1.0) */
    particleOpacity: number
    /** Show background stars */
    showStars: boolean
    /** Show central light source */
    showCentralLight: boolean
    /** Enable automatic scene rotation */
    enableSceneRotation: boolean
    /** Enable automatic camera rotation */
    cameraAutoRotate: boolean
    /** Speed of camera transitions (0.5-2.0) */
    cameraTransitionSpeed: number
    /** Downward gravitational force */
    gravity: number
    /** Velocity decay factor (0.9-0.99) */
    velocityDamping: number
    /** Sphere containment force strength */
    sphereStrength: number
    /** Sphere shape distortion factor (1.0 = perfect sphere) */
    sphereDistortion: number
    /** Surface noise intensity for organic shapes */
    sphereNoise: number
    /** Pulsing animation intensity */
    spherePulse: number
    /** Creative atmosphere controls */
    /** Ambient lighting intensity */
    ambientLightIntensity: number
    /** Fog density removed - was causing visibility issues */
    /** Enable particle trail effects */
    particleTrails: boolean
    /** Length of particle trails */
    trailLength: number
    /** Maximum number of trails */
    trailCount: number
    /** Color of particle trails */
    trailColor: string
    /** Intensity of particle glow effect */
    glowIntensity: number
    /** Color temperature adjustment */
    colorTemperature: number
    /** Shader mode selector (0=normal, 1=ethereal, 2=cosmic, 3=aurora, 4=plasma) */
    shaderMode: number
    /** Canvas shader properties removed */
  }
  /** Callback to update visual settings */
  onVisualSettingsChange: (settings: Partial<UnifiedSidebarProps['visualSettings']>) => void
  /** Audio playback settings */
  audioSettings: {
    /** Whether background music is muted */
    musicMuted: boolean
    /** Whether voice narration is muted */
    voiceMuted: boolean
    /** Background music volume (0.0-1.0) */
    musicVolume: number
  }
  /** Callback to update audio settings */
  onAudioSettingsChange: (settings: Partial<UnifiedSidebarProps['audioSettings']>) => void
}

/**
 * Get human-readable name for shader mode
 *
 * @param mode - Shader mode number (0-3)
 * @returns Human-readable shader mode name
 */
function getShaderModeName(mode: number): string {
  switch (mode) {
    case 0: return 'Default'
    case 1: return 'Ethereal'
    case 2: return 'Cosmic'
    case 3: return 'Aurora'
    case 4: return 'Plasma'
    default: return 'Unknown'
  }
}

// Canvas shader function removed - no longer needed

/**
 * UnifiedSidebar - Main Control Panel Component
 *
 * This component provides a comprehensive interface for controlling all aspects
 * of the Gaza Memorial Visualization. It features multiple collapsible panels
 * for different control categories and real-time updates to the 3D scene.
 *
 * The sidebar is designed to be:
 * - **Collapsible**: Can be minimized to not interfere with the memorial experience
 * - **Responsive**: Adapts to different screen sizes
 * - **Organized**: Groups controls by functionality (Visual, Audio, Data, etc.)
 * - **Real-time**: All changes are immediately reflected in the visualization
 *
 * Key Control Categories:
 * 1. **Visual Settings**: Particle appearance, sphere distortion, lighting
 * 2. **Creative Atmosphere**: Shader modes, lighting, atmospheric effects
 * 3. **Audio Controls**: Volume settings, voice synthesis options
 * 4. **Data Filtering**: Search and filter casualty data
 * 5. **UI Customization**: Panel visibility and display options
 * 6. **Social Sharing**: Export and share functionality
 *
 * @param props - Component configuration
 * @returns React component for the unified control sidebar
 */
export default function UnifiedSidebar({
  data,
  casualtyCount,
  uiSettings,
  onUISettingsChange,
  visualSettings,
  onVisualSettingsChange,
  audioSettings,
  onAudioSettingsChange
}: UnifiedSidebarProps) {
  const { filters, setFilters, isFiltered } = useStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<'filters' | 'settings' | 'audio' | 'share'>('filters')
  const [expandedSections, setExpandedSections] = useState({
    // Filters sections
    gender: true,
    age: true,
    source: true,
    statistics: false,
    // Settings sections
    display: true,
    ui: true,
    scene: false
  })
  const [copied, setCopied] = useState(false)

  const sources = useMemo(() => {
    if (data.length === 0) return ['all']
    const uniqueSources = new Set(data.map((d) => d.source))
    return ['all', ...Array.from(uniqueSources)]
  }, [data.length]) // Only recalculate when data length changes, not content

  const ageStats = useMemo(() => {
    if (data.length === 0) return { min: 0, max: 120 }
    const ages = data.map(d => d.age).filter(age => age > 0)
    return {
      min: Math.min(...ages),
      max: Math.max(...ages)
    }
  }, [data])

  const statistics = useMemo(() => {
    if (data.length === 0) return { male: 0, female: 0, children: 0, adults: 0, elderly: 0 }
    
    const male = data.filter(d => d.gender === 'male').length
    const female = data.filter(d => d.gender === 'female').length
    const children = data.filter(d => d.age < 18).length
    const adults = data.filter(d => d.age >= 18 && d.age < 60).length
    const elderly = data.filter(d => d.age >= 60).length
    
    return { male, female, children, adults, elderly }
  }, [data])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const resetFilters = () => {
    setFilters({ 
      gender: 'all', 
      ageRange: [ageStats.min, ageStats.max], 
      source: 'all',
      nameSearch: '',
      type: 'all'
    })
  }

  const resetVisualSettings = () => {
    onVisualSettingsChange({
      particleSize: 0.2,
      particleOpacity: 0.9,
      showStars: false,
      showCentralLight: false,
      enableSceneRotation: true,
      cameraAutoRotate: true,
      cameraTransitionSpeed: 1.2,
      gravity: 0.0,
      velocityDamping: 0.99,
      sphereStrength: 0.1,
      sphereDistortion: 1.2,
      sphereNoise: 0.3,
      spherePulse: 0.2,
      // Creative atmosphere defaults (optimized for performance)
      ambientLightIntensity: 0.2,
      // fogDensity removed
      particleTrails: false,
      trailLength: 20,
      trailCount: 100,
      trailColor: '#ffffff',
      glowIntensity: 0.8,
      colorTemperature: 0.5
    })
  }

  const resetUISettings = () => {
    onUISettingsChange({
      showMemorialInfo: true,
      showInstructions: true,
      showFiltersPanel: true,
      showAudioControls: true,
      showHoverTooltip: true
    })
  }

  const handleCopyLink = async () => {
    try {
      const urlToCopy = window.location.href
      await navigator.clipboard.writeText(urlToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
      const textArea = document.createElement('textarea')
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareTitle = `Palestine Memorial - Honoring ${casualtyCount.toLocaleString()} Lives Lost`
  const shareText = `Each light represents a life lost. Visit this interactive memorial to honor ${casualtyCount.toLocaleString()} Palestinian souls. 🕯️ #PalestineMemorial #NeverForget #Palestine #RememberThem`
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  
  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`,
      color: 'hover:bg-blue-600'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(shareText)}`,
      color: 'hover:bg-blue-700'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`,
      color: 'hover:bg-green-600'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(shareTitle)}`,
      color: 'hover:bg-blue-800'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + '\n\n' + currentUrl)}`,
      color: 'hover:bg-gray-600'
    }
  ]

  const tabs = [
    { id: 'filters' as const, label: 'Filters', icon: Filter, active: isFiltered() },
    { id: 'settings' as const, label: 'Settings', icon: Settings, active: false },
    { id: 'share' as const, label: 'Share', icon: Share2, active: false }
  ]

  return (
    <div className="fixed top-0 right-0 h-full z-20">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`absolute top-4 ${isExpanded ? 'right-80' : 'right-4'} bg-gray-800/90 hover:bg-gray-700 text-white p-3 rounded-l-lg transition-all duration-300 shadow-lg border border-gray-600/50 backdrop-blur-sm`}
      >
        <div className="flex items-center gap-2">
          {activeTab === 'filters' && <Filter size={20} />}
          {activeTab === 'settings' && <Settings size={20} />}
          {activeTab === 'audio' && <Volume2 size={20} />}
          {activeTab === 'share' && <Share2 size={20} />}
          {isFiltered() && activeTab === 'filters' && (
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          )}
          {isExpanded ? <ChevronRight size={16} /> : <ChevronRight size={16} className="rotate-180" />}
        </div>
      </button>

      {/* Sidebar Panel */}
      <div className={`h-full w-80 bg-gray-900 border-l border-gray-700 shadow-2xl transform transition-transform duration-300 ${
        isExpanded ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header with Tabs */}
          <div className="border-b border-gray-700">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                {/* Navigation Links - Made bigger and more prominent */}
                <div className="flex items-center gap-3">
                  <Link
                    href="/blog"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800/50 transition-colors rounded-lg"
                    title="News & Updates"
                  >
                    <FileText size={16} />
                    News
                  </Link>
                  <span className="text-gray-600">•</span>
                  <Link
                    href="/about"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800/50 transition-colors rounded-lg"
                    title="About the Project"
                  >
                    <Info size={16} />
                    About
                  </Link>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-white bg-gray-800'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                  {tab.active && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  )}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* Filters Tab */}
            {activeTab === 'filters' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">
                    Explore the memorial by filtering the data
                  </p>
                  {isFiltered() && (
                    <button
                      onClick={resetFilters}
                      className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <RotateCcw size={14} />
                      Reset
                    </button>
                  )}
                </div>

                {/* Statistics Overview */}
                <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Info size={16} />
                    Memorial Statistics
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Total Souls:</span>
                        <span className="text-white ml-2">{casualtyCount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Filtered:</span>
                        <span className="text-white ml-2">{(() => {
                          // Performance optimization: calculate filtered count efficiently
                          if (filters.gender === 'all' && 
                              filters.source === 'all' && 
                              filters.type === 'all' && 
                              filters.ageRange[0] === 0 && 
                              filters.ageRange[1] === 120 && 
                              !filters.nameSearch.trim()) {
                            return data.length.toLocaleString()
                          }
                          
                          let count = 0
                          for (const d of data) {
                            if (filters.gender !== 'all' && d.gender !== filters.gender) continue
                            if (filters.type !== 'all' && d.type !== filters.type) continue
                            if (filters.source !== 'all' && d.source !== filters.source) continue
                            if (d.age < filters.ageRange[0] || d.age > filters.ageRange[1]) continue
                            if (filters.nameSearch.trim() && 
                                !d.name_en.toLowerCase().includes(filters.nameSearch.toLowerCase()) && 
                                !d.name_ar.includes(filters.nameSearch)) continue
                            count++
                          }
                          return count.toLocaleString()
                        })()}</span>
                      </div>
                    </div>
                    
                    {/* Data Source Breakdown */}
                    <div className="pt-2 border-t border-gray-700">
                      <p className="text-xs text-gray-400 mb-2 font-medium">DATA SOURCES</p>
                      <div className="space-y-1 text-xs">
                        {sources.slice(1).map((source) => {
                          const count = data.filter(d => d.source === source).length
                          return (
                            <div key={source} className="flex justify-between">
                              <span className="text-gray-300 truncate">{source}</span>
                              <span className="text-white">{count.toLocaleString()}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    
                    {/* Type Breakdown */}
                    <div className="pt-2 border-t border-gray-700">
                      <p className="text-xs text-gray-400 mb-2 font-medium">ROLES</p>
                      <div className="space-y-1 text-xs">
                        {['civilian', 'press', 'medical', 'civil_defense'].map((type) => {
                          const count = data.filter(d => d.type === type).length
                          if (count === 0) return null
                          return (
                            <div key={type} className="flex justify-between">
                              <span className="text-gray-300 capitalize">{type.replace('_', ' ')}</span>
                              <span className="text-white">{count.toLocaleString()}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Name Search */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Search size={16} />
                    Name Search
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name (English or Arabic)..."
                      value={filters.nameSearch}
                      onChange={(e) => setFilters({ nameSearch: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {filters.nameSearch && (
                      <button
                        onClick={() => setFilters({ nameSearch: '' })}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Gender Filter */}
                <div className="space-y-3">
                  <button
                    onClick={() => toggleSection('gender')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-2 text-white font-medium">
                      <Users size={16} />
                      Gender
                    </div>
                    {expandedSections.gender ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  
                  {expandedSections.gender && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        {['all', 'male', 'female'].map((gender) => (
                          <button
                            key={gender}
                            onClick={() => setFilters({ gender: gender as any })}
                            className={`px-3 py-2 text-sm rounded transition-colors ${
                              filters.gender === gender
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {gender === 'all' ? 'All' : gender.charAt(0).toUpperCase() + gender.slice(1)}
                          </button>
                        ))}
                      </div>
                      <div className="text-xs text-gray-400 space-y-1">
                        <div>Male: {statistics.male.toLocaleString()}</div>
                        <div>Female: {statistics.female.toLocaleString()}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Age Filter */}
                <div className="space-y-3">
                  <button
                    onClick={() => toggleSection('age')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-2 text-white font-medium">
                      <Calendar size={16} />
                      Age Range
                    </div>
                    {expandedSections.age ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  
                  {expandedSections.age && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm text-gray-300 mb-2">
                          <span>{filters.ageRange[0]} years</span>
                          <span>{filters.ageRange[1]} years</span>
                        </div>
                        <Slider
                          min={ageStats.min}
                          max={ageStats.max}
                          step={1}
                          value={filters.ageRange}
                          onValueChange={(value) => setFilters({ ageRange: value as [number, number] })}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 gap-1">
                        <button
                          onClick={() => setFilters({ ageRange: [0, 17] })}
                          className="text-left px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                        >
                          Children (0-17): {statistics.children.toLocaleString()}
                        </button>
                        <button
                          onClick={() => setFilters({ ageRange: [18, 59] })}
                          className="text-left px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                        >
                          Adults (18-59): {statistics.adults.toLocaleString()}
                        </button>
                        <button
                          onClick={() => setFilters({ ageRange: [60, ageStats.max] })}
                          className="text-left px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                        >
                          Elderly (60+): {statistics.elderly.toLocaleString()}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Source Filter */}
                <div className="space-y-3">
                  <button
                    onClick={() => toggleSection('source')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-2 text-white font-medium">
                      <FileText size={16} />
                      Data Source
                    </div>
                    {expandedSections.source ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  
                  {expandedSections.source && (
                    <div className="space-y-3">
                      <Select
                        value={filters.source}
                        onValueChange={(value) => setFilters({ source: value })}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 text-white border-gray-600">
                          <SelectItem value="all">All Sources</SelectItem>
                          {sources.slice(1).map((source) => (
                            <SelectItem key={source} value={source}>
                              {source}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Color Legend */}
                {isFiltered() && (
                  <div className="space-y-3">
                    <div className="text-white font-medium flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-current"></div>
                      Color Legend
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 space-y-3">
                      {/* Type Colors */}
                      {filters.type !== 'all' && (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-400 font-medium">ROLES</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {filters.type === 'press' && (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#FFD700'}}></div>
                                <span className="text-gray-300">Journalists</span>
                              </div>
                            )}
                            {filters.type === 'medical' && (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#FF6B6B'}}></div>
                                <span className="text-gray-300">Medical</span>
                              </div>
                            )}
                            {filters.type === 'civil_defense' && (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#4ECDC4'}}></div>
                                <span className="text-gray-300">Civil Defense</span>
                              </div>
                            )}
                            {filters.type === 'civilian' && (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#ffffff'}}></div>
                                <span className="text-gray-300">Civilians</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Gender Colors */}
                      {filters.gender !== 'all' && (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-400 font-medium">GENDER</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {filters.gender === 'male' && (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#4A90E2'}}></div>
                                <span className="text-gray-300">Male</span>
                              </div>
                            )}
                            {filters.gender === 'female' && (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#E24A90'}}></div>
                                <span className="text-gray-300">Female</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Age Colors */}
                      {(filters.ageRange[0] > 0 || filters.ageRange[1] < 120) && (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-400 font-medium">AGE GROUPS</p>
                          <div className="grid grid-cols-1 gap-2 text-xs">
                            {filters.ageRange[0] <= 17 && filters.ageRange[1] >= 0 && (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#50E3C2'}}></div>
                                <span className="text-gray-300">Children (0-17)</span>
                              </div>
                            )}
                            {filters.ageRange[0] <= 59 && filters.ageRange[1] >= 18 && (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#F5A623'}}></div>
                                <span className="text-gray-300">Adults (18-59)</span>
                              </div>
                            )}
                            {filters.ageRange[1] >= 60 && (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#BD10E0'}}></div>
                                <span className="text-gray-300">Elderly (60+)</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Source Colors */}
                      {filters.source !== 'all' && (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-400 font-medium">DATA SOURCES</p>
                          <div className="grid grid-cols-1 gap-2 text-xs">
                            {filters.source.includes('Ministry of Health') && (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#87CEEB'}}></div>
                                <span className="text-gray-300">Ministry of Health</span>
                              </div>
                            )}
                            {filters.source.includes('Public Submission') && (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#98FB98'}}></div>
                                <span className="text-gray-300">Public Submissions</span>
                              </div>
                            )}
                            {(filters.source.includes('Judicial') || filters.source.includes('Parliamentary')) && (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#DDA0DD'}}></div>
                                <span className="text-gray-300">Judicial/Parliamentary</span>
                              </div>
                            )}
                            {filters.source.includes('Statistical Extrapolation') && (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#FFA07A'}}></div>
                                <span className="text-gray-300">Statistical Data</span>
                              </div>
                            )}
                            {filters.source.includes('Unknown') && (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#D3D3D3'}}></div>
                                <span className="text-gray-300">Unknown Source</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Default message when no specific filters */}
                      {filters.type === 'all' && filters.gender === 'all' && filters.source === 'all' && 
                       filters.ageRange[0] === 0 && filters.ageRange[1] === 120 && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#7ED321'}}></div>
                          <span className="text-gray-300 text-xs">Filtered particles</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="p-6 space-y-6">
                <p className="text-sm text-gray-400">
                  Customize how the memorial is displayed
                </p>

                {/* Physics Controls */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Layout size={16} />
                    Physics Controls
                  </div>
                  
                  {/* Gravity */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Gravity: {visualSettings.gravity.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={visualSettings.gravity}
                      onChange={(e) => onVisualSettingsChange({ gravity: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>No Gravity</span>
                      <span>Strong Pull</span>
                    </div>
                  </div>

                  {/* Velocity Damping */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Damping: {Math.round((1 - visualSettings.velocityDamping) * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.9"
                      max="0.999"
                      step="0.01"
                      value={visualSettings.velocityDamping}
                      onChange={(e) => onVisualSettingsChange({ velocityDamping: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Heavy Damping</span>
                      <span>Free Motion</span>
                    </div>
                  </div>

                  {/* Sphere Strength */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Sphere Force: {visualSettings.sphereStrength.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={visualSettings.sphereStrength}
                      onChange={(e) => onVisualSettingsChange({ sphereStrength: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Loose</span>
                      <span>Tight Sphere</span>
                    </div>
                  </div>

                  {/* Sphere Distortion Controls */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Sphere Shape: {visualSettings.sphereDistortion.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.01"
                      value={visualSettings.sphereDistortion}
                      onChange={(e) => onVisualSettingsChange({ sphereDistortion: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Compressed</span>
                      <span>Expanded</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Surface Noise: {visualSettings.sphereNoise.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="3"
                      step="0.01"
                      value={visualSettings.sphereNoise}
                      onChange={(e) => onVisualSettingsChange({ sphereNoise: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Smooth</span>
                      <span>Chaotic</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Pulse Effect: {visualSettings.spherePulse.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.01"
                      value={visualSettings.spherePulse}
                      onChange={(e) => onVisualSettingsChange({ spherePulse: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Static</span>
                      <span>Pulsing</span>
                    </div>
                  </div>
                </div>

                {/* Display Settings */}
                <div className="space-y-3">
                  <button
                    onClick={() => toggleSection('display')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-2 text-white font-medium">
                      <Palette size={16} />
                      Display Settings
                    </div>
                    {expandedSections.display ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {expandedSections.display && (
                    <div className="space-y-4">
                      {/* Particle Size */}
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">
                          Particle Size: {visualSettings.particleSize.toFixed(1)}
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.1"
                          value={visualSettings.particleSize}
                          onChange={(e) => onVisualSettingsChange({ particleSize: parseFloat(e.target.value) })}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Particle Opacity */}
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">
                          Particle Opacity: {Math.round(visualSettings.particleOpacity * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.1"
                          value={visualSettings.particleOpacity}
                          onChange={(e) => onVisualSettingsChange({ particleOpacity: parseFloat(e.target.value) })}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Camera Speed */}
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">
                          Camera Speed: {visualSettings.cameraTransitionSpeed.toFixed(1)}x
                        </label>
                        <input
                          type="range"
                          min="0.3"
                          max="3.0"
                          step="0.1"
                          value={visualSettings.cameraTransitionSpeed}
                          onChange={(e) => onVisualSettingsChange({ cameraTransitionSpeed: parseFloat(e.target.value) })}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <button
                        onClick={resetVisualSettings}
                        className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <RotateCcw size={14} />
                        Reset Display Settings
                      </button>
                    </div>
                  )}
                </div>

                {/* UI Elements */}
                <div className="space-y-3">
                  <button
                    onClick={() => toggleSection('ui')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-2 text-white font-medium">
                      <Layout size={16} />
                      UI Elements
                    </div>
                    {expandedSections.ui ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {expandedSections.ui && (
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Info size={14} />
                          <span className="text-sm text-gray-300">Memorial Info</span>
                        </div>
                        <button
                          onClick={() => onUISettingsChange({ showMemorialInfo: !uiSettings.showMemorialInfo })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            uiSettings.showMemorialInfo ? 'bg-blue-600' : 'bg-gray-600'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            uiSettings.showMemorialInfo ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </label>

                      <label className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Volume2 size={14} />
                          <span className="text-sm text-gray-300">Audio Controls</span>
                        </div>
                        <button
                          onClick={() => onUISettingsChange({ showAudioControls: !uiSettings.showAudioControls })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            uiSettings.showAudioControls ? 'bg-blue-600' : 'bg-gray-600'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            uiSettings.showAudioControls ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </label>

                      <button
                        onClick={resetUISettings}
                        className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <RotateCcw size={14} />
                        Reset UI Settings
                      </button>
                    </div>
                  )}
          </div>

          {/* Creative Atmosphere Controls */}
          <div className="space-y-3 pt-4 border-t border-gray-700/50">
            <div className="flex items-center gap-2 text-white font-medium">
              <Palette size={16} />
              Creative Atmosphere
            </div>
            
            {/* Ambient Light */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Ambient Light: {Math.round(visualSettings.ambientLightIntensity * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={visualSettings.ambientLightIntensity}
                onChange={(e) => onVisualSettingsChange({ ambientLightIntensity: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Atmospheric Fog control removed - was causing visibility issues */}

            {/* Glow Intensity */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Particle Glow: {Math.round(visualSettings.glowIntensity * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={visualSettings.glowIntensity}
                onChange={(e) => onVisualSettingsChange({ glowIntensity: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Color Temperature */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Color Temperature: {visualSettings.colorTemperature > 0.5 ? 'Warm' : 'Cool'}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={visualSettings.colorTemperature}
                onChange={(e) => onVisualSettingsChange({ colorTemperature: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Cool Blue</span>
                <span>Warm Orange</span>
              </div>
            </div>

            {/* Shader Mode */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Shader Mode: {getShaderModeName(visualSettings.shaderMode)}
              </label>
              <select
                value={visualSettings.shaderMode}
                onChange={(e) => onVisualSettingsChange({ shaderMode: parseInt(e.target.value) })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value={0}>Default</option>
                <option value={1}>Ethereal</option>
                <option value={2}>Cosmic</option>
                <option value={3}>Aurora</option>
                <option value={4}>Plasma</option>
              </select>
            </div>

            {/* Canvas shader controls removed - they were not working properly */}

            {/* Particle Trails Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Particle Trails</span>
              <button
                onClick={() => onVisualSettingsChange({ particleTrails: !visualSettings.particleTrails })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  visualSettings.particleTrails ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    visualSettings.particleTrails ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Trail Length - Only show when trails are enabled */}
            {visualSettings.particleTrails && (
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Trail Length: {visualSettings.trailLength} frames
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={visualSettings.trailLength}
                  onChange={(e) => onVisualSettingsChange({ trailLength: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Short</span>
                  <span>Long</span>
                </div>
              </div>
            )}

            {/* Trail Count - Only show when trails are enabled */}
            {visualSettings.particleTrails && (
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Trail Count: {visualSettings.trailCount} particles
                </label>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={visualSettings.trailCount}
                  onChange={(e) => onVisualSettingsChange({ trailCount: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Few</span>
                  <span>Many</span>
                </div>
              </div>
            )}

            {/* Trail Color - Only show when trails are enabled */}
            {visualSettings.particleTrails && (
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Trail Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={visualSettings.trailColor}
                    onChange={(e) => onVisualSettingsChange({ trailColor: e.target.value })}
                    className="w-12 h-8 rounded border border-gray-600 bg-gray-700 cursor-pointer"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => onVisualSettingsChange({ trailColor: '#ffffff' })}
                      className="w-6 h-6 rounded-full bg-white border border-gray-600 hover:scale-110 transition-transform"
                      title="White"
                    />
                    <button
                      onClick={() => onVisualSettingsChange({ trailColor: '#ff4444' })}
                      className="w-6 h-6 rounded-full bg-red-500 border border-gray-600 hover:scale-110 transition-transform"
                      title="Red"
                    />
                    <button
                      onClick={() => onVisualSettingsChange({ trailColor: '#4444ff' })}
                      className="w-6 h-6 rounded-full bg-blue-500 border border-gray-600 hover:scale-110 transition-transform"
                      title="Blue"
                    />
                    <button
                      onClick={() => onVisualSettingsChange({ trailColor: '#44ff44' })}
                      className="w-6 h-6 rounded-full bg-green-500 border border-gray-600 hover:scale-110 transition-transform"
                      title="Green"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
              </div>
        )}
        
        {/* Audio Tab */}
        {activeTab === 'audio' && (
          <div className="p-6 space-y-6">
            <p className="text-sm text-gray-400">
              Control background music and voice settings for your memorial experience
            </p>

            {/* Background Music Controls */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white font-medium">
                <Volume2 size={16} />
                Background Music
              </div>
              
              {/* Music Mute Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Enable Music</span>
                <button
                  onClick={() => onAudioSettingsChange({ musicMuted: !audioSettings.musicMuted })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    !audioSettings.musicMuted ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      !audioSettings.musicMuted ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Music Volume */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Music Volume: {Math.round(audioSettings.musicVolume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={audioSettings.musicVolume}
                  onChange={(e) => onAudioSettingsChange({ musicVolume: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  disabled={audioSettings.musicMuted}
                />
              </div>
            </div>

            {/* Voice Controls */}
            <div className="space-y-4 pt-4 border-t border-gray-700/50">
              <div className="flex items-center gap-2 text-white font-medium">
                <MessageCircle size={16} />
                Voice Narration
              </div>
              
              {/* Voice Mute Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Enable Voice</span>
                <button
                  onClick={() => onAudioSettingsChange({ voiceMuted: !audioSettings.voiceMuted })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    !audioSettings.voiceMuted ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      !audioSettings.voiceMuted ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <p className="text-xs text-gray-500">
                Voice narration reads each name during memorial playback
              </p>
            </div>
          </div>
        )}
        
        {/* Share Tab */}
        {activeTab === 'share' && (
              <div className="p-6 space-y-6">
                <p className="text-sm text-gray-400">
                  Help others discover this memorial honoring {casualtyCount.toLocaleString()} lives
                </p>

                {/* Social Share Buttons */}
                <div className="space-y-3">
                  <h3 className="text-white font-medium">Share on Social Media</h3>
                  <div className="space-y-2">
                    {shareLinks.map((platform) => (
                      <a
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 p-3 bg-gray-800 ${platform.color} text-white rounded-lg transition-colors text-sm w-full`}
                      >
                        <platform.icon size={16} />
                        {platform.name}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Copy Link */}
                <div className="space-y-3">
                  <h3 className="text-white font-medium">Direct Link</h3>
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                  >
                    <LinkIcon size={16} />
                    {copied ? 'Link Copied!' : 'Copy Link'}
                  </button>
                </div>

                {/* Memorial Message */}
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-300 text-sm italic text-center">
                    "To live in hearts we leave behind is not to die"
                  </p>
                  <p className="text-gray-500 text-xs mt-2 text-center">
                    Share to honor their memory
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
