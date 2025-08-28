'use client'

import { useStore } from '@/lib/store'
import { useMemo, useState } from 'react'
import { 
  ChevronRight, 
  ChevronDown, 
  Settings, 
  X, 
  Eye, 
  EyeOff, 
  Palette, 
  Layout,
  Info,
  Filter,
  Volume2,
  RotateCcw
} from 'lucide-react'

interface VisualizationPanelProps {
  uiSettings: {
    showMemorialInfo: boolean
    showInstructions: boolean
    showFiltersPanel: boolean
    showAudioControls: boolean
    showHoverTooltip: boolean
  }
  onUISettingsChange: (settings: Partial<VisualizationPanelProps['uiSettings']>) => void
  visualSettings: {
    particleSize: number
    particleOpacity: number
    showStars: boolean
    showCentralLight: boolean
    enableSceneRotation: boolean
    cameraAutoRotate: boolean
    cameraTransitionSpeed: number
  }
  onVisualSettingsChange: (settings: Partial<VisualizationPanelProps['visualSettings']>) => void
}

export default function VisualizationPanel({ 
  uiSettings, 
  onUISettingsChange,
  visualSettings,
  onVisualSettingsChange
}: VisualizationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    display: true,
    ui: true,
    scene: false
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const resetVisualSettings = () => {
    onVisualSettingsChange({
      particleSize: 0.2,
      particleOpacity: 0.9,
      showStars: false, // Focus on real names, not decorative stars
      showCentralLight: true,
      enableSceneRotation: true,
      cameraAutoRotate: true,
      cameraTransitionSpeed: 1.2
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

  return (
    <div className="fixed top-0 right-0 h-full z-20">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`absolute top-16 ${isExpanded ? 'right-80' : 'right-4'} bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-l-lg transition-all duration-300 shadow-lg border border-gray-600`}
      >
        <div className="flex items-center gap-2">
          <Settings size={20} />
          {isExpanded ? <ChevronRight size={16} className="rotate-180" /> : <ChevronRight size={16} />}
        </div>
      </button>

      {/* Sidebar Panel */}
      <div className={`h-full w-80 bg-gray-900 border-l border-gray-700 shadow-2xl transform transition-transform duration-300 ${
        isExpanded ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Settings size={20} />
                Visualization
              </h2>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Customize how the memorial is displayed
            </p>
          </div>

          {/* Settings Sections */}
          <div className="p-6 space-y-6">
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
                <div className="pl-6 space-y-4">
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
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
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
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  {/* Camera Transition Speed */}
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
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Slow (0.3x)</span>
                      <span>Fast (3.0x)</span>
                    </div>
                  </div>

                  {/* Toggle Switches */}
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Background Stars</span>
                      <button
                        onClick={() => onVisualSettingsChange({ showStars: !visualSettings.showStars })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          visualSettings.showStars ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          visualSettings.showStars ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Central Memorial Light</span>
                      <button
                        onClick={() => onVisualSettingsChange({ showCentralLight: !visualSettings.showCentralLight })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          visualSettings.showCentralLight ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          visualSettings.showCentralLight ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Scene Rotation</span>
                      <button
                        onClick={() => onVisualSettingsChange({ enableSceneRotation: !visualSettings.enableSceneRotation })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          visualSettings.enableSceneRotation ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          visualSettings.enableSceneRotation ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Camera Auto-Rotate</span>
                      <button
                        onClick={() => onVisualSettingsChange({ cameraAutoRotate: !visualSettings.cameraAutoRotate })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          visualSettings.cameraAutoRotate ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          visualSettings.cameraAutoRotate ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </label>
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
                <div className="pl-6 space-y-3">
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
                      <Eye size={14} />
                      <span className="text-sm text-gray-300">Instructions</span>
                    </div>
                    <button
                      onClick={() => onUISettingsChange({ showInstructions: !uiSettings.showInstructions })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        uiSettings.showInstructions ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        uiSettings.showInstructions ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter size={14} />
                      <span className="text-sm text-gray-300">Filters Panel</span>
                    </div>
                    <button
                      onClick={() => onUISettingsChange({ showFiltersPanel: !uiSettings.showFiltersPanel })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        uiSettings.showFiltersPanel ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        uiSettings.showFiltersPanel ? 'translate-x-6' : 'translate-x-1'
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

                  <label className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <EyeOff size={14} />
                      <span className="text-sm text-gray-300">Hover Tooltips</span>
                    </div>
                    <button
                      onClick={() => onUISettingsChange({ showHoverTooltip: !uiSettings.showHoverTooltip })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        uiSettings.showHoverTooltip ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        uiSettings.showHoverTooltip ? 'translate-x-6' : 'translate-x-1'
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

            {/* Scene Information */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('scene')}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-2 text-white font-medium">
                  <Info size={16} />
                  Scene Info
                </div>
                {expandedSections.scene ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>

              {expandedSections.scene && (
                <div className="pl-6 space-y-3">
                  <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                    <div className="text-sm font-medium text-white mb-2">Performance</div>
                    <div className="text-xs text-gray-300 space-y-1">
                      <div className="flex justify-between">
                        <span>Rendering:</span>
                        <span className="font-medium">WebGL 2.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Particles:</span>
                        <span className="font-medium">GPU Accelerated</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Audio:</span>
                        <span className="font-medium">Web Speech API</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
