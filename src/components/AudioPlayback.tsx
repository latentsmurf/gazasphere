'use client'

import { useStore } from '@/lib/store'
import { Casualty } from '@/lib/dataLoader'
import { speak } from '@/lib/tts'
import { useEffect, useRef, useState } from 'react'
import { Play, Pause, SkipForward, Square, Volume2, ChevronUp, ChevronDown } from 'lucide-react'

interface AudioPlaybackProps {
  data: Casualty[]
  onPersonFocus: (person: Casualty, index: number) => void
  cameraSpeed?: number
  particlePositionsReady?: boolean
  voiceMuted?: boolean
}

export default function AudioPlayback({ data, onPersonFocus, cameraSpeed = 1.2, particlePositionsReady = false, voiceMuted = false }: AudioPlaybackProps) {
  const {
    playbackState,
    playbackQueue,
    currentTrack,
    language,
    isAutoPlaying,
    focusedPerson,
    startAutoPlayback,
    stopAutoPlayback,
    nextTrack,
    setFocusedPerson,
    setCameraTarget,
    setLanguage
  } = useStore()

  const isPlayingRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Calculate timing for continuous movement
  const getPersonDuration = () => {
    const cameraTransitionTime = Math.max(800, 1200 / cameraSpeed) // Time for camera to reach target
    const speechTime = 2000 // Estimated 2 seconds for speech
    const pauseTime = 800 // Brief pause after speech
    return cameraTransitionTime + speechTime + pauseTime
  }

  const getTotalDuration = () => {
    return (data.length * getPersonDuration()) / 1000 // Convert to seconds
  }

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

  const getEstimatedCompletion = () => {
    if (!isAutoPlaying || playbackQueue.length === 0) return null
    
    const remaining = playbackQueue.length - currentTrack
    const remainingSeconds = (remaining * getPersonDuration()) / 1000
    return formatDuration(remainingSeconds)
  }

  // Auto-advance to next track after speaking
  useEffect(() => {
    if (isAutoPlaying && playbackState === 'playing' && playbackQueue.length > 0) {
      const currentPerson = playbackQueue[currentTrack]
      if (currentPerson && !isPlayingRef.current) {
        isPlayingRef.current = true
        setFocusedPerson(currentPerson)
        
        // Find the person's index in the filtered data array (not the shuffled playback queue)
        const personIndex = data.findIndex(p => p.id === currentPerson.id)
        if (personIndex !== -1) {
          onPersonFocus(currentPerson, personIndex)
        }

        // Wait for camera transition to complete before speaking
        const cameraTransitionTime = Math.max(800, 1200 / cameraSpeed)
        
        timeoutRef.current = setTimeout(() => {
          if (!isAutoPlaying) return // Check if still playing
          
          // Now speak the name after camera has moved
          const nameToSpeak = language === 'ar' ? currentPerson.name_ar : currentPerson.name_en
          const speechLang = language === 'ar' ? 'ar-SA' : 'en-US'
          
          const handleSpeechComplete = () => {
            // Brief pause after speech then move to next
            timeoutRef.current = setTimeout(() => {
              if (isAutoPlaying) {
                nextTrack()
                isPlayingRef.current = false
              }
            }, 800) // Brief pause after speech before moving to next particle
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
            setTimeout(handleSpeechComplete, 1000)
          }
        }, cameraTransitionTime) // Wait for camera to reach target
      }
    }
  }, [isAutoPlaying, playbackState, currentTrack, playbackQueue, language, data, onPersonFocus, nextTrack, setFocusedPerson, setCameraTarget, cameraSpeed])

  // Cleanup timeout on unmount or stop
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handlePlay = () => {
    if (!isAutoPlaying && data.length > 0 && particlePositionsReady) {
      startAutoPlayback(data)
    }
  }

  const handleStop = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    isPlayingRef.current = false
    stopAutoPlayback()
    
    // Reset camera to overview
    setCameraTarget(null)
  }

  const handleNext = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    isPlayingRef.current = false
    nextTrack()
  }

  const currentPerson = playbackQueue[currentTrack]

  return (
    <>
      {/* Current Name Display - Visible during playback */}
      {isAutoPlaying && currentPerson && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <div className="bg-black bg-opacity-80 text-white p-6 rounded-2xl text-center border border-gray-600 shadow-2xl">
            <div className="text-4xl font-light mb-3 text-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              {language === 'ar' ? currentPerson.name_ar : currentPerson.name_en}
            </div>
            <div className="text-lg text-gray-300 mb-2">
              Age {currentPerson.age} • {currentPerson.gender}
            </div>
            <div className="text-sm text-gray-400">
              {currentTrack + 1} of {playbackQueue.length}
            </div>
          </div>
        </div>
      )}

      {/* Collapsible Audio Controls */}
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
