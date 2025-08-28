'use client'

/**
 * @fileoverview AudioPlayback Component - Memorial Audio Narration System
 *
 * This component manages the automated playback of casualty names with synchronized
 * camera movements and voice narration. It creates an immersive memorial experience
 * where each particle is highlighted with camera focus and voice narration.
 *
 * Key Features:
 * - Automated sequential playback of casualty names
 * - Synchronized camera movements for each person
 * - Multi-language support (English/Arabic)
 * - Text-to-speech integration with fallback handling
 * - Collapsible UI controls for immersive experience
 * - Progress tracking and duration estimation
 * - Keyboard controls (ESC to stop)
 *
 * @author Gaza Memorial Visualization Team
 * @version 1.0.0
 */

import { useStore } from '@/lib/store'
import { Casualty } from '@/lib/dataLoader'
import { speak } from '@/lib/tts'
import { useEffect, useRef, useState } from 'react'
import { Play, Pause, SkipForward, Square, Volume2, ChevronUp, ChevronDown } from 'lucide-react'

/**
 * Props for the AudioPlayback component
 */
interface AudioPlaybackProps {
  /** Array of casualty data to narrate through */
  data: Casualty[]
  /** Callback function called when focusing on a person */
  onPersonFocus: (person: Casualty, index: number) => void
  /** Camera transition speed multiplier (default: 1.2) */
  cameraSpeed?: number
  /** Whether particle positions are ready for playback */
  particlePositionsReady?: boolean
  /** Whether voice narration should be muted */
  voiceMuted?: boolean
}

/**
 * AudioPlayback - Main Component for Memorial Narration
 *
 * Manages the complete memorial experience including:
 * - Sequential playback of casualty names
 * - Camera movements synchronized with narration
 * - Multi-language voice synthesis
 * - Progress tracking and user controls
 * - Immersive UI with collapsible controls
 *
 * The component creates a solemn, respectful memorial experience where each
 * casualty's name is spoken while the camera focuses on their particle
 * representation in the 3D visualization.
 *
 * @param props - Component configuration
 * @returns React component for audio playback controls
 */
export default function AudioPlayback({ data, onPersonFocus, cameraSpeed = 1.2, particlePositionsReady = false, voiceMuted = false }: AudioPlaybackProps) {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const {
    /** Current playback state ('idle', 'playing', 'paused') */
    playbackState,
    /** Shuffled queue of casualties for playback */
    playbackQueue,
    /** Index of currently playing track */
    currentTrack,
    /** Selected language for narration ('en' or 'ar') */
    language,
    /** Whether auto-playback is currently active */
    isAutoPlaying,
    /** Currently focused casualty object */
    focusedPerson,
    /** Function to start auto-playback with data */
    startAutoPlayback,
    /** Function to stop auto-playback */
    stopAutoPlayback,
    /** Function to advance to next track */
    nextTrack,
    /** Function to set focused person */
    setFocusedPerson,
    /** Function to set camera target */
    setCameraTarget,
    /** Function to change language */
    setLanguage
  } = useStore()

  // ============================================================================
  // REFS & LOCAL STATE
  // ============================================================================

  /** Ref to track if currently playing to prevent double-playback */
  const isPlayingRef = useRef(false)
  /** Ref to store timeout for speech/camera coordination */
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  /** Local state for collapsible UI */
  const [isCollapsed, setIsCollapsed] = useState(false)

  // ============================================================================
  // TIMING CALCULATIONS
  // ============================================================================

  /**
   * Calculate the total duration for displaying one person
   * Includes camera transition, speech time, and pause
   *
   * @returns Duration in milliseconds for one person
   */
  const getPersonDuration = () => {
    const cameraTransitionTime = Math.max(800, 1200 / cameraSpeed) // Time for camera to reach target
    const speechTime = 2000 // Estimated 2 seconds for speech
    const pauseTime = 800 // Brief pause after speech
    return cameraTransitionTime + speechTime + pauseTime
  }

  /**
   * Calculate the total estimated duration for the entire memorial
   *
   * @returns Total duration in seconds
   */
  const getTotalDuration = () => {
    return (data.length * getPersonDuration()) / 1000 // Convert to seconds
  }

  /**
   * Format duration in seconds to human-readable string
   *
   * @param seconds - Duration in seconds
   * @returns Formatted duration string (e.g., "2h 30m 15s")
   */
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    } else {
      return `${remainingSeconds}s`
    }
  }

  /**
   * Calculate estimated time remaining in current memorial session
   *
   * @returns Formatted duration string or null if not playing
   */
  const getEstimatedCompletion = () => {
    if (!isAutoPlaying || playbackQueue.length === 0) return null

    const remaining = playbackQueue.length - currentTrack
    const remainingSeconds = (remaining * getPersonDuration()) / 1000
    return formatDuration(remainingSeconds)
  }

  // ============================================================================
  // AUTO-PLAYBACK LOGIC
  // ============================================================================

  /**
   * Main useEffect for auto-playback functionality
   *
   * This effect manages the complete memorial experience flow:
   * 1. Focus camera on current person's particle
   * 2. Wait for camera transition to complete
   * 3. Speak the person's name (if voice not muted)
   * 4. Brief pause before advancing to next person
   *
   * The process creates a solemn, respectful experience where each
   * name is honored with focused attention and voice narration.
   */
  useEffect(() => {
    if (isAutoPlaying && playbackState === 'playing' && playbackQueue.length > 0) {
      const currentPerson = playbackQueue[currentTrack]
      if (currentPerson && !isPlayingRef.current) {
        isPlayingRef.current = true
        setFocusedPerson(currentPerson)

        // Find the person's index in the filtered data array (not the shuffled playback queue)
        const personIndex = data.findIndex(p => p.id === currentPerson.id)
        
        if (personIndex !== -1) {
          // Enhanced camera movement: First search, then focus
          const searchPhase = () => {
            // Create a searching camera movement - looking for the soul
            const searchRadius = 18 + Math.random() * 8 // Random search distance (18-26)
            const searchAngle1 = Math.random() * Math.PI * 2
            const searchAngle2 = (Math.random() - 0.5) * Math.PI * 0.8 // Limit vertical angle
            
            const searchPos: [number, number, number] = [
              Math.cos(searchAngle1) * Math.cos(searchAngle2) * searchRadius,
              Math.sin(searchAngle2) * searchRadius * 0.7, // Slightly flattened vertically
              Math.sin(searchAngle1) * Math.cos(searchAngle2) * searchRadius
            ]
            
            // Look towards a random area in the memorial space
            const searchLookAt: [number, number, number] = [
              (Math.random() - 0.5) * 8, // Random area around center
              (Math.random() - 0.5) * 6,
              (Math.random() - 0.5) * 8
            ]
            
            setCameraTarget({ position: searchPos, lookAt: searchLookAt })
          }

          // Start with search phase
          searchPhase()
          
          // Wait for search movement, then focus on the actual person
          const searchTime = Math.max(1200, 2000 / cameraSpeed) // 1.2-2 seconds search
          
          setTimeout(() => {
            if (!isAutoPlaying) return
            onPersonFocus(currentPerson, personIndex)
          }, searchTime)
        }

        // Wait for complete camera transition (search + focus) before speaking
        const totalCameraTime = Math.max(2000, 3200 / cameraSpeed) // 2-3.2 seconds total

        timeoutRef.current = setTimeout(() => {
          if (!isAutoPlaying) return // Check if still playing

          // Now speak the name after camera has found and focused on the red particle
          const nameToSpeak = language === 'ar' ? currentPerson.name_ar : currentPerson.name_en
          const speechLang = language === 'ar' ? 'ar-SA' : 'en-US'

          /**
           * Handle completion of speech synthesis
           * Advances to next person after brief pause
           */
          const handleSpeechComplete = () => {
            // Longer pause after speech for reflection and respect
            timeoutRef.current = setTimeout(() => {
              if (isAutoPlaying) {
                nextTrack()
                isPlayingRef.current = false
              }
            }, 1200) // Longer pause for more respectful pacing
          }

          if (!voiceMuted) {
            speak(nameToSpeak, speechLang)
              .then(handleSpeechComplete)
              .catch((error) => {
                console.error('Speech error:', error)
                // Continue anyway - speech is optional
                handleSpeechComplete()
              })
          } else {
            // If voice is muted, just wait a moment then continue
            setTimeout(handleSpeechComplete, 1500)
          }
        }, totalCameraTime) // Wait for complete camera movement
      }
    }
  }, [isAutoPlaying, playbackState, currentTrack, playbackQueue, language, data, onPersonFocus, nextTrack, setFocusedPerson, setCameraTarget, cameraSpeed])

  // ============================================================================
  // CLEANUP & LIFECYCLE
  // ============================================================================

  /**
   * Cleanup useEffect - clears timeouts on unmount or stop
   * Prevents memory leaks and ensures clean component unmounting
   */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // ============================================================================
  // USER CONTROL HANDLERS
  // ============================================================================

  /**
   * Start the memorial playback experience
   *
   * Validates that data is loaded and particles are ready before
   * initializing the auto-playback sequence with shuffled queue
   */
  const handlePlay = () => {
    if (!isAutoPlaying && data.length > 0 && particlePositionsReady) {
      startAutoPlayback(data)
    }
  }

  /**
   * Stop the memorial playback and reset to overview
   *
   * Cleans up timeouts, resets playback state, and returns
   * camera to overview position for general exploration
   */
  const handleStop = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    isPlayingRef.current = false
    stopAutoPlayback()

    // Reset camera to overview
    setCameraTarget(null)
  }

  /**
   * Skip to the next person in the memorial sequence
   *
   * Useful for users who want to advance through the memorial
   * faster or skip particularly difficult moments
   */
  const handleNext = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    isPlayingRef.current = false
    nextTrack()
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  const currentPerson = playbackQueue[currentTrack]

  return (
    <>
      {/* ===================================================================== */}
      {/* CURRENT NAME DISPLAY - Visible during playback */}
      {/* ===================================================================== */}
      {isAutoPlaying && currentPerson && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <div className="bg-black bg-opacity-80 text-white p-6 rounded-2xl text-center border border-gray-600 shadow-2xl">
            {/* Person's name in selected language */}
            <div className="text-4xl font-light mb-3 text-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              {language === 'ar' ? currentPerson.name_ar : currentPerson.name_en}
            </div>
            {/* Person's age and gender */}
            <div className="text-lg text-gray-300 mb-2">
              Age {currentPerson.age} • {currentPerson.gender}
            </div>
            {/* Progress indicator */}
            <div className="text-sm text-gray-400">
              {currentTrack + 1} of {playbackQueue.length}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* COLLAPSIBLE AUDIO CONTROLS - Main user interface */}
      {/* ===================================================================== */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        {/* Collapse/Expand Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg border border-gray-600 transition-colors"
        >
          {isCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <div className={`bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl transition-all duration-300 ${
          isCollapsed ? 'p-2 min-w-16' : 'p-4 min-w-96'
        }`}>
        {/* Memorial Duration Info (when not playing and not collapsed) */}
        {!isCollapsed && !isAutoPlaying && data.length > 0 && (
          <div className="text-center mb-4 p-4 bg-gray-800 rounded-lg">
            <div className="text-lg font-medium text-white mb-2">Memorial Duration</div>
            <div className="text-2xl font-light text-blue-400 mb-2">
              {formatDuration(getTotalDuration())}
            </div>
            <div className="text-sm text-gray-400">
              {data.length.toLocaleString()} names • ~{Math.round(getPersonDuration() / 1000)}s each
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Camera Speed: {cameraSpeed.toFixed(1)}x • Adjust in visualization settings
            </div>
          </div>
        )}

        {/* Current Person Display - Hidden during playback for immersive experience */}

        {/* Controls */}
        <div className={`flex items-center justify-center ${isCollapsed ? 'gap-1' : 'gap-4'}`}>
          {/* Language Toggle - Hidden when collapsed */}
          {!isCollapsed && (
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
            >
              {language === 'ar' ? 'العربية' : 'English'}
            </button>
          )}

          {/* Play/Stop Button */}
          {!isAutoPlaying ? (
            <button
              onClick={handlePlay}
              disabled={!particlePositionsReady || data.length === 0}
              className={`flex items-center gap-2 rounded-lg font-medium transition-colors ${
                isCollapsed 
                  ? 'p-2' 
                  : 'px-6 py-3'
              } ${
                particlePositionsReady && data.length > 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Play size={20} />
              {!isCollapsed && (particlePositionsReady ? 'Play Memorial' : 'Loading...')}
            </button>
          ) : (
            <button
              onClick={handleStop}
              className={`flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors ${
                isCollapsed ? 'p-2' : 'px-6 py-3'
              }`}
            >
              <Square size={20} />
              {!isCollapsed && 'Stop'}
            </button>
          )}

          {/* Next Button */}
          {isAutoPlaying && !isCollapsed && (
            <button
              onClick={handleNext}
              className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <SkipForward size={20} />
            </button>
          )}

          {/* Status Indicator - Hidden when collapsed */}
          {!isCollapsed && (
            <div className="flex items-center gap-2 text-gray-400">
              <Volume2 size={16} />
              <span className="text-xs">
                {isAutoPlaying && playbackState === 'playing' ? 'Memorial in progress...' : 'Ready'}
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar - Hidden when collapsed */}
        {!isCollapsed && isAutoPlaying && playbackQueue.length > 0 && (
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentTrack + 1) / playbackQueue.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Memorial Progress</span>
              <span>{Math.round(((currentTrack + 1) / playbackQueue.length) * 100)}%</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>
                {formatDuration(((currentTrack + 1) * getPersonDuration()) / 1000)} elapsed
              </span>
              <span>
                {getEstimatedCompletion()} remaining
              </span>
            </div>
          </div>
        )}

        {/* ESC hint - only show when playing and not collapsed */}
        {!isCollapsed && isAutoPlaying && (
          <div className="text-center mt-2 pb-2">
            <p className="text-xs text-gray-400">Press ESC to stop memorial</p>
          </div>
        )}
        </div>
      </div>
    </>
  )
}
