/**
 * Gaza Memorial State Management
 *
 * Centralized state management for the Palestine Memorial visualization using Zustand.
 * Manages application state including visualization modes, data filtering, audio playback,
 * camera controls, and user interactions.
 *
 * State Categories:
 * - Visualization: Particle layout modes, visual settings, camera controls
 * - Data: Filters, casualty data, statistics
 * - Audio: Playback state, voice settings, memorial narration
 * - UI: Panel visibility, tooltips, user preferences
 * - Interaction: Hover states, selections, focus management
 *
 * Key Features:
 * - Reactive state updates across all components
 * - Persistent filter state during user interactions
 * - Camera target management for smooth transitions
 * - Audio playback coordination with visual elements
 * - Comprehensive filter system with real-time updates
 *
 * Architecture:
 * - Single source of truth for application state
 * - Actions as pure functions for predictable updates
 * - Computed properties for derived state (isFiltered)
 * - Event-driven updates for cross-component communication
 *
 * @author Palestine Memorial Project
 * @version 1.0.0
 * @since 2024
 */

import { create } from 'zustand'
import { Casualty } from './dataLoader'

/**
 * Available visualization modes for particle layout
 *
 * @typedef {'cloud' | 'sphere' | 'plane' | 'flock' | 'stats'} VisualizationMode
 */
type VisualizationMode = 'cloud' | 'sphere' | 'plane' | 'flock' | 'stats'

/**
 * Data filtering configuration for casualty visualization
 *
 * Defines the active filters applied to the memorial dataset.
 * All filters work together to create complex queries.
 *
 * @interface Filters
 * @property {'all' | 'male' | 'female'} gender - Gender filter (all = no filter)
 * @property {[number, number]} ageRange - Age range filter [min, max] (0-120 = no filter)
 * @property {'all' | string} source - Data source filter (all = no filter)
 * @property {string} nameSearch - Text search in English/Arabic names (empty = no filter)
 * @property {'all' | 'civilian' | 'press' | 'medical' | 'civil_defense'} type - Casualty type filter
 */
export type Filters = {
  gender: 'all' | 'male' | 'female'
  ageRange: [number, number]
  source: 'all' | string
  nameSearch: string
  type: 'all' | 'civilian' | 'press' | 'medical' | 'civil_defense'
}

/**
 * Audio playback state for memorial narration
 *
 * @typedef {'playing' | 'paused'} PlaybackState
 */
type PlaybackState = 'playing' | 'paused'

/**
 * Supported languages for audio narration
 *
 * @typedef {'en' | 'ar'} Language
 */
type Language = 'en' | 'ar'

/**
 * Complete application state interface for the Gaza Memorial
 *
 * Defines the structure of the Zustand store containing all application state.
 * Provides reactive state management across all components with actions for
 * updating state in a predictable manner.
 *
 * State Organization:
 * - Visualization: Particle layout and camera controls
 * - Data Management: Filtering and casualty data handling
 * - Audio System: Memorial narration and playback controls
 * - User Interaction: Hover, selection, and focus management
 * - UI State: Panel visibility and user preferences
 *
 * @interface AppState
 */
interface AppState {
  // Visualization State
  /** Current particle visualization mode */
  mode: VisualizationMode
  /** Update visualization mode */
  setMode: (mode: VisualizationMode) => void

  // Data Filtering State
  /** Active data filters configuration */
  filters: Filters
  /** Update filters (partial update supported) */
  setFilters: (filters: Partial<Filters>) => void
  /** Computed property: true if any filters are active */
  isFiltered: () => boolean

  // User Interaction State
  /** Currently hovered casualty ID */
  hovered: string | null
  /** Update hovered casualty */
  setHovered: (id: string | null) => void
  /** Currently selected casualty ID */
  selected: string | null
  /** Update selected casualty */
  setSelected: (id: string | null) => void

  // Audio Playback State
  /** Current audio playback state */
  playbackState: PlaybackState
  /** Queue of casualties for audio narration */
  playbackQueue: Casualty[]
  /** Current track index in playback queue */
  currentTrack: number
  /** Audio narration language */
  language: Language
  /** True when memorial auto-playback is active */
  isAutoPlaying: boolean

  // Focus Management State
  /** Currently focused casualty for memorial playback */
  focusedPerson: Casualty | null
  /** Index of focused particle in visualization */
  focusedParticleIndex: number | null
  /** Camera target for smooth transitions */
  cameraTarget: { position: [number, number, number]; lookAt: [number, number, number] } | null

  // Audio Control Actions
  /** Update playback state */
  setPlaybackState: (state: PlaybackState) => void
  /** Set playback queue with optional shuffling */
  setPlaybackQueue: (queue: Casualty[], shuffle?: boolean) => void
  /** Advance to next track in queue */
  nextTrack: () => void
  /** Set audio narration language */
  setLanguage: (lang: Language) => void
  /** Enable/disable auto-playback mode */
  setAutoPlaying: (playing: boolean) => void

  // Focus Management Actions
  /** Set focused casualty for memorial playback */
  setFocusedPerson: (person: Casualty | null) => void
  /** Set focused particle index for visual highlighting */
  setFocusedParticleIndex: (index: number | null) => void
  /** Set camera target for smooth transitions */
  setCameraTarget: (target: { position: [number, number, number]; lookAt: [number, number, number] } | null) => void

  // Playback Control Actions
  /** Start memorial auto-playback with shuffled data */
  startAutoPlayback: (data: Casualty[]) => void
  /** Stop memorial auto-playback and reset state */
  stopAutoPlayback: () => void
}

/**
 * Gaza Memorial Zustand Store
 *
 * Main application state store created with Zustand. Provides reactive state
 * management with actions for updating state across all components.
 *
 * Store Architecture:
 * - Reactive state updates trigger re-renders in subscribed components
 * - Actions use set() for immutable state updates
 * - get() provides access to current state within actions
 * - Computed properties (like isFiltered) are recalculated on each access
 *
 * Key Behaviors:
 * - Filter changes automatically switch to 'plane' mode for better filtered visualization
 * - Audio playback state is tightly coordinated with visual focus
 * - Camera targets enable smooth transitions between memorial subjects
 * - Playback queue shuffling ensures varied memorial experiences
 *
 * State Initialization:
 * - Default visualization mode: 'cloud'
 * - Default filters: show all data (no filtering)
 * - Default language: Arabic (language of the Palestinian people)
 * - Auto-playback: disabled by default (user interaction required)
 *
 * @example
 * // Using the store in a component
 * const { filters, setFilters, isAutoPlaying } = useStore()
 *
 * // Update filters
 * setFilters({ gender: 'female', ageRange: [0, 18] })
 *
 * // Check if any filters are active
 * if (useStore.getState().isFiltered()) {
 *   // Handle filtered state
 * }
 */
export const useStore = create<AppState>((set, get) => ({
  // Visualization State
  mode: 'cloud',
  setMode: (mode) => set({ mode }),

  // Data Filtering State
  filters: {
    gender: 'all',
    ageRange: [0, 120],
    source: 'all',
    nameSearch: '',
    type: 'all'
  },
  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }))
    const isFiltered = get().isFiltered()
    if (isFiltered) {
      set({ mode: 'plane' }) // Switch to plane mode when filters are active
    }
  },
  isFiltered: () => {
    const { filters } = get()
    return filters.gender !== 'all' ||
           filters.source !== 'all' ||
           filters.ageRange[0] !== 0 ||
           filters.ageRange[1] !== 120 ||
           filters.nameSearch.trim() !== '' ||
           filters.type !== 'all'
  },
  hovered: null,
  setHovered: (id) => set({ hovered: id }),
  selected: null,
  setSelected: (id) => set({ selected: id }),
  playbackState: 'paused',
  playbackQueue: [],
  currentTrack: 0,
  language: 'ar',
  isAutoPlaying: false,
  focusedPerson: null,
  focusedParticleIndex: null,
  cameraTarget: null,
  setPlaybackState: (state) => set({ playbackState: state }),
  setPlaybackQueue: (queue, shuffle = true) => {
    const newQueue = shuffle ? [...queue].sort(() => Math.random() - 0.5) : queue
    set({ playbackQueue: newQueue, currentTrack: 0 })
  },
  nextTrack: () => {
    const { playbackQueue, currentTrack } = get()
    const next = (currentTrack + 1) % playbackQueue.length
    set({ currentTrack: next })
  },
  setLanguage: (lang) => set({ language: lang }),
  setAutoPlaying: (playing) => set({ isAutoPlaying: playing }),
  setFocusedPerson: (person) => set({ focusedPerson: person }),
  setFocusedParticleIndex: (index) => set({ focusedParticleIndex: index }),
  setCameraTarget: (target) => set({ cameraTarget: target }),
  startAutoPlayback: (data) => {
    const shuffledData = [...data].sort(() => Math.random() - 0.5)
    set({ 
      playbackQueue: shuffledData, 
      currentTrack: 0, 
      isAutoPlaying: true, 
      playbackState: 'playing' 
    })
  },
  stopAutoPlayback: () => {
    set({ 
      isAutoPlaying: false, 
      playbackState: 'paused', 
      focusedPerson: null, 
      focusedParticleIndex: null,
      cameraTarget: null 
    })
  },
}))
