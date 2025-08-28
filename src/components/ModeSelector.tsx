'use client'

import { useStore } from '@/lib/store'

export default function ModeSelector() {
  const { mode, setMode } = useStore()

  return (
    <div className="absolute top-4 left-4 z-10 flex gap-2">
      <button
        onClick={() => setMode('cloud')}
        className={`px-4 py-2 rounded text-white ${
          mode === 'cloud' ? 'bg-blue-500' : 'bg-gray-700'
        }`}
      >
        Cloud
      </button>
      <button
        onClick={() => setMode('plane')}
        className={`px-4 py-2 rounded text-white ${
          mode === 'plane' ? 'bg-blue-500' : 'bg-gray-700'
        }`}
      >
        Plane
      </button>
    </div>
  )
}
