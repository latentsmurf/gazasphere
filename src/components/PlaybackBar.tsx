'use client'

import { Play, Pause, SkipForward } from 'lucide-react'
import { useStore } from '@/lib/store'
import { useEffect } from 'react'
import { speak } from '@/lib/tts'

export default function PlaybackBar() {
  const {
    playbackState,
    playbackQueue,
    currentTrack,
    language,
    setPlaybackState,
    nextTrack,
    setLanguage,
  } = useStore()

  const person = playbackQueue[currentTrack]

  useEffect(() => {
    if (playbackState === 'playing' && person) {
      const text = language === 'en' ? person.name_en : person.name_ar
      const lang = language === 'en' ? 'en-US' : 'ar-SA'
      speak(text, lang)
        .then(() => {
          if (playbackState === 'playing') { // Check if still playing
            nextTrack()
          }
        })
        .catch(console.error)
    }
  }, [currentTrack, language, playbackState, person, nextTrack])

  const handlePlayPause = () => {
    if (playbackState === 'playing') {
      setPlaybackState('paused')
      window.speechSynthesis.cancel()
    } else {
      setPlaybackState('playing')
    }
  }

  const handleSkip = () => {
    window.speechSynthesis.cancel()
    nextTrack()
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 h-24 bg-black bg-opacity-50 backdrop-blur-sm text-white flex items-center justify-between px-8">
      <div className="flex items-center gap-4">
        <button onClick={handlePlayPause} className="text-white">
          {playbackState === 'playing' ? <Pause size={32} /> : <Play size={32} />}
        </button>
        <button onClick={handleSkip} className="text-white">
          <SkipForward size={32} />
        </button>
      </div>
      <div className="text-center">
        {person && (
          <>
            <p className="text-xl">{language === 'en' ? person.name_en : person.name_ar}</p>
            <p className="text-sm text-gray-400">
              Age {person.age}
            </p>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button onClick={() => setLanguage('ar')} className={language === 'ar' ? 'font-bold' : ''}>AR</button>
        <span>|</span>
        <button onClick={() => setLanguage('en')} className={language === 'en' ? 'font-bold' : ''}>EN</button>
      </div>
    </div>
  )
}
