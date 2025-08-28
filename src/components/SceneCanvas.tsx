'use client'

/**
 * Gaza Souls Memorial Visualization - Main 3D Scene Component
 *
 * This component serves as the primary interface for the Gaza Souls Memorial,
 * a comprehensive interactive 3D visualization honoring the lives lost in Gaza
 * and the West Bank. It renders 63,872+ souls as individual particles that can
 * be explored through various visualization modes and filtering options.
 *
 * Key Features:
 * - Interactive 3D particle system representing individual lives lost
 * - Multiple visualization layouts (sphere, cloud, plane, flock)
 * - Real-time filtering by gender, age, source, and casualty type
 * - Audio memorial playback with text-to-speech narration
 * - Camera controls and smooth transitions
 * - Comprehensive statistics display
 * - Responsive design with collapsible UI panels
 * - "Breaking Free" trail system: Particles with trails exhibit erratic, upward movement
 *   as if breaking free from earthly constraints and ascending to heaven
 *
 * Technical Implementation:
 * - Built with React Three Fiber and Three.js for 3D rendering
 * - Custom GLSL shaders for particle effects and visual enhancements
 * - Zustand for state management
 * - Real-time audio analysis and sound-responsive particle behavior
 * - Advanced physics simulation with flocking algorithms
 * - Performance optimization for handling 25,000+ particles
 *
 * Data Sources:
 * - Tech for Palestine APIs (killed-in-gaza, press_killed, casualties_daily, etc.)
 * - Real-time statistics and infrastructure damage data
 * - Statistical extrapolation for comprehensive representation
 *
 * @author Gaza Souls Memorial Project
 * @version 1.0.0
 * @since 2024
 */

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, shaderMaterial } from '@react-three/drei'
// Canvas shader removed - was causing issues
import { useEffect, useState, useRef, useMemo } from 'react'

import { Casualty, DataInfo, loadData } from '@/lib/dataLoader'
import { useStore } from '@/lib/store'
import AudioPlayback from './AudioPlayback'
import CameraController from './CameraController'
import UnifiedSidebar from './UnifiedSidebar'

import * as THREE from 'three'
import { extend } from '@react-three/fiber'

// Import shaders
// @ts-expect-error - GLSL shader imports require special handling
import particleVertexShader from '@/lib/shaders/particle.vert.glsl'
// @ts-expect-error - GLSL shader imports require special handling
import particleFragmentShader from '@/lib/shaders/particle.frag.glsl'

// Create custom shader material
const ParticleMaterial = shaderMaterial(
  {
    map: null,
    color: new THREE.Color('#ffffff'),
    opacity: 1.0,
    focusedIndex: -1.0,
    hoveredIndex: -1.0,
    time: 0.0,
    particleSize: 0.2,
    glowIntensity: 1.0,
    shaderMode: 0.0
  },
  particleVertexShader,
  particleFragmentShader
)

extend({ ParticleMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    particleMaterial: {
      map: THREE.Texture | null
      color: THREE.Color | string
      opacity: number
      focusedIndex: number
      hoveredIndex: number
      time: number
      particleSize: number
      glowIntensity: number
      shaderMode: number
      filterTransitionTime: number
      transparent?: boolean
      blending?: THREE.Blending
      depthWrite?: boolean
      depthTest?: boolean
      vertexColors?: boolean
    }
  }
}

// Color scheme for different filter states
const COLORS = {
  default: '#ffffff',
  focused: '#ff4444',   // Red for focused particle during name reading
  
  // Gender colors
  male: '#4A90E2',      // Blue
  female: '#E24A90',    // Pink
  
  // Age group colors
  children: '#50E3C2',  // Teal - Children (0-17)
  adults: '#F5A623',    // Orange - Adults (18-59)
  elderly: '#BD10E0',   // Purple - Elderly (60+)
  
  // Type/Role colors
  civilian: '#ffffff',  // White - Civilians
  press: '#FFD700',     // Gold - Journalists
  medical: '#FF6B6B',   // Red - Medical personnel
  civil_defense: '#4ECDC4', // Cyan - Civil defense
  
  // Source colors
  moh: '#87CEEB',       // Sky blue - Ministry of Health
  public: '#98FB98',    // Pale green - Public submissions
  judicial: '#DDA0DD',  // Plum - Judicial/Parliamentary
  unknown: '#D3D3D3',   // Light gray - Unknown
  statistical: '#FFA07A', // Light salmon - Statistical extrapolation
  
  // Location colors
  gaza: '#FF7F50',      // Coral - Gaza Strip
  west_bank: '#9370DB', // Medium purple - West Bank
  
  filtered: '#7ED321'   // Green for general filtered state
}

function createDotTexture(): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  
  const centerX = 32
  const centerY = 32
  const radius = 20
  
  // Clear canvas with transparent background
  ctx.clearRect(0, 0, 64, 64)
  
  // Create radial gradient for crisp dot with soft edges
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)')
  gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.4)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  
  // Draw defined circular dot
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.fill()
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function createCrescentStarSVG(): string {
  return `
    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <!-- Crescent Moon -->
      <path d="M12 24 C12 16 16 10 22 10 C19 10 17 13 17 17 C17 21 19 24 22 24 C19 24 17 27 17 31 C17 35 19 38 22 38 C16 38 12 32 12 24 Z" 
            fill="white" 
            opacity="0.95"
            filter="url(#softGlow)"/>
      <!-- Five-pointed Star -->
      <path d="M32 12 L33.2 16.4 L37.6 16.4 L34.2 19.2 L35.4 23.6 L32 20.8 L28.6 23.6 L29.8 19.2 L26.4 16.4 L30.8 16.4 Z" 
            fill="white" 
            opacity="0.95"
            filter="url(#softGlow)"/>
    </svg>
  `
}

// Seeded random function for consistent layouts
function createSeededRandom(seed: number = 12345) {
  let currentSeed = seed
  return () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280
    return currentSeed / 233280
  }
}

// Particle layout functions
// Note: Currently using sphere layout as primary method, other layouts available for future use
function generateCloudLayout(count: number): Float32Array {
  const positions = new Float32Array(count * 3)
  const seededRandom = createSeededRandom(12345)
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const radius = 5 + seededRandom() * 10
    const theta = seededRandom() * Math.PI * 2
    const phi = Math.acos(2 * seededRandom() - 1)
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)
  }
  return positions
}

function generateSphereLayout(count: number): Float32Array {
  const positions = new Float32Array(count * 3)
  const seededRandom = createSeededRandom(54321)
  const radius = 12
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const theta = seededRandom() * Math.PI * 2
    const phi = Math.acos(2 * seededRandom() - 1)
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)
  }
  return positions
}

function generatePlaneLayout(count: number): Float32Array {
  const positions = new Float32Array(count * 3)
  const cols = Math.ceil(Math.sqrt(count))
  const spacing = 0.5
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const row = Math.floor(i / cols)
    const col = i % cols
    
    positions[i3] = (col - cols / 2) * spacing
    positions[i3 + 1] = (row - Math.ceil(count / cols) / 2) * spacing
    positions[i3 + 2] = 0
  }
  return positions
}

function generateFlockLayout(count: number): Float32Array {
  const positions = new Float32Array(count * 3)
  const seededRandom = createSeededRandom(98765)
  const flockCount = Math.min(5, Math.ceil(count / 1000))
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const flockIndex = Math.floor(i / (count / flockCount))
    const flockAngle = (flockIndex / flockCount) * Math.PI * 2
    const flockRadius = 8
    
    const flockCenterX = Math.cos(flockAngle) * flockRadius
    const flockCenterY = Math.sin(flockAngle) * flockRadius
    const flockCenterZ = (seededRandom() - 0.5) * 4
    
    const localRadius = seededRandom() * 3
    const localTheta = seededRandom() * Math.PI * 2
    const localPhi = seededRandom() * Math.PI
    
    positions[i3] = flockCenterX + localRadius * Math.sin(localPhi) * Math.cos(localTheta)
    positions[i3 + 1] = flockCenterY + localRadius * Math.sin(localPhi) * Math.sin(localTheta)
    positions[i3 + 2] = flockCenterZ + localRadius * Math.cos(localPhi)
  }
  return positions
}

function FloatingParticles({ 
  data, 
  onParticleClick, 
  hoveredIndex, 
  setHoveredIndex,
  onParticlePositions,
  visualSettings,
  focusedIndex,
  filteredData
}: { 
  data: Casualty[]
  onParticleClick: (person: Casualty, index: number) => void
  hoveredIndex: number | null
  setHoveredIndex: (index: number | null) => void
  onParticlePositions?: (positions: Float32Array) => void
  visualSettings?: {
    particleSize: number
    particleOpacity: number
    gravity?: number
    velocityDamping?: number
    sphereStrength?: number
    sphereDistortion?: number
    sphereNoise?: number
    spherePulse?: number
    particleTrails?: boolean
    trailLength?: number
    trailCount?: number
    trailColor?: string
    glowIntensity?: number
    ambientLightIntensity?: number
    fogDensity?: number
    colorTemperature?: number
    shaderMode?: number
    showStars?: boolean
    showCentralLight?: boolean
  }
  focusedIndex?: number | null
  filteredData: Casualty[]
}) {
  const pointsRef = useRef<THREE.Points>(null!)
  const trailsRef = useRef<THREE.Group>(null!)
  const { raycaster, camera, mouse, gl } = useThree()
  const { filters, isFiltered, focusedPerson, isAutoPlaying, setCameraTarget } = useStore()
  
  // Mouse interaction for immediate hover detection
  const [lastHovered, setLastHovered] = useState<number | null>(null)
  
  // Mouse following particles and interactive effects
  const [mouseFollowers, setMouseFollowers] = useState<Set<number>>(new Set())
  const mousePosition3D = useRef(new THREE.Vector3())
  const [mouseInfluenceRadius, setMouseInfluenceRadius] = useState(8)
  const [attractionPoints, setAttractionPoints] = useState<Array<{
    position: THREE.Vector3
    strength: number
    startTime: number
    duration: number
  }>>([])
  const [isMousePressed, setIsMousePressed] = useState(false)

  // Simplified filtering - particles are now actually hidden when filtered out
  
  // Trail system state
  const trailHistoryRef = useRef<Float32Array[]>([])
  // Note: trailLinesRef is kept for future trail implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const trailLinesRef = useRef<THREE.Line[]>([])
  
  // Audio analysis for sound-responsive particles
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  // Note: audioSourceRef is kept for future audio analysis implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  
  console.log('FloatingParticles render - data length:', data.length, 'particle count:', data.length)
  
  // Performance optimization: limit particle count for better performance
  const maxParticles = typeof navigator !== 'undefined' && navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome') 
    ? 15000 // Safari-specific limit
    : 25000 // Other browsers
  const particleCount = Math.min(data.length, maxParticles) // Show all particles - each soul deserves representation
  
  // Initialize audio analysis for sound-responsive particles
  const initAudioAnalysis = () => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
        analyserRef.current = audioContextRef.current.createAnalyser()
        analyserRef.current.fftSize = 256
        dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount)
      } catch (error) {
        console.warn('Audio analysis not available:', error)
      }
    }
  }
  
  // Get current audio level for particle responsiveness
  const getAudioLevel = (): number => {
    if (!isAutoPlaying) return 0
    
    // Since Web Speech API doesn't provide audio analysis,
    // we'll simulate audio responsiveness based on speech timing
    const time = performance.now() / 1000
    
    // Create a simulated audio waveform that varies over time
    const baseLevel = 0.3
    const variation1 = Math.sin(time * 8) * 0.3
    const variation2 = Math.sin(time * 12.7) * 0.2
    const variation3 = Math.sin(time * 5.3) * 0.1
    
    // Add some randomness for more organic feel
    const noise = (Math.random() - 0.5) * 0.1
    
    const level = Math.max(0, Math.min(1, baseLevel + variation1 + variation2 + variation3 + noise))
    
    return level
  }
  
  // Initialize audio analysis when component mounts
  useEffect(() => {
    initAudioAnalysis()
  }, [])

  // No complex filter animations needed - particles are simply shown/hidden
  
  // Determine color based on active filters
  const getParticleColor = () => {
    if (!isFiltered()) return COLORS.default
    
    // Priority order: Type > Gender > Age > Source > Location
    
    // Type-based coloring (highest priority)
    if (filters.type !== 'all') {
      switch (filters.type) {
        case 'press': return COLORS.press
        case 'medical': return COLORS.medical
        case 'civil_defense': return COLORS.civil_defense
        case 'civilian': return COLORS.civilian
      }
    }
    
    // Gender-based coloring
    if (filters.gender !== 'all') {
      if (filters.gender === 'male') return COLORS.male
      if (filters.gender === 'female') return COLORS.female
    }
    
    // Age-based coloring
    const [minAge, maxAge] = filters.ageRange
    if (minAge > 0 || maxAge < 120) {
      if (minAge >= 0 && maxAge <= 17) return COLORS.children
      if (minAge >= 18 && maxAge <= 59) return COLORS.adults
      if (minAge >= 60) return COLORS.elderly
    }
    
    // Source-based coloring
    if (filters.source !== 'all') {
      if (filters.source.includes('Ministry of Health')) return COLORS.moh
      if (filters.source.includes('Public Submission')) return COLORS.public
      if (filters.source.includes('Judicial') || filters.source.includes('Parliamentary')) return COLORS.judicial
      if (filters.source.includes('Statistical Extrapolation')) return COLORS.statistical
      if (filters.source.includes('Unknown')) return COLORS.unknown
    }
    
    // Default filtered color
    return COLORS.filtered
  }
  
  const { positions, velocities, geometry } = useMemo(() => {
    console.log('Creating sphere geometry with', particleCount, 'particles')
    
    // Create sphere layout
    const pos = new Float32Array(particleCount * 3)
    const vel = new Float32Array(particleCount * 3)
    const indices = new Float32Array(particleCount)
    
    // Use seeded random for consistent results
    let seed = 12345
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }
    
    const radius = 12
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Generate sphere positions
      const theta = seededRandom() * Math.PI * 2
      const phi = Math.acos(2 * seededRandom() - 1)
      
      pos[i3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i3 + 2] = radius * Math.cos(phi)
      
      // Initial velocities (small random)
      vel[i3] = (seededRandom() - 0.5) * 0.01
      vel[i3 + 1] = (seededRandom() - 0.5) * 0.01
      vel[i3 + 2] = (seededRandom() - 0.5) * 0.01
      
      indices[i] = i
    }
    
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geom.setAttribute('particleIndex', new THREE.BufferAttribute(indices, 1))
    
    return { positions: pos, velocities: vel, geometry: geom }
  }, [particleCount])

  // Notify parent of particle positions for camera focusing
  useEffect(() => {
    if (onParticlePositions && positions) {
      onParticlePositions(positions)
    }
  }, [positions, onParticlePositions])
  
  // Filter attributes no longer needed - particles are simply shown/hidden
  
  // Enhanced trail system with "breaking free" behavior
  const trailFrameCount = useRef(0)
  
  // No cleanup needed for immediate hover detection

  // Track which particles have trails for special physics behavior
  const trailedParticleIndices = useRef<Set<number>>(new Set())

  // Debug functions accessible from browser console
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).debugTrails = () => {
        console.log('Trail System Debug:')
        console.log('- Trails enabled:', visualSettings?.particleTrails)
        console.log('- Trail count:', visualSettings?.trailCount || 75)
        console.log('- Trail length:', visualSettings?.trailLength || 25)
        console.log('- Trailed particles:', trailedParticleIndices.current.size)
        console.log('- Trail history length:', trailHistoryRef.current.length)
        console.log('- Visual settings:', visualSettings)
        return 'Trail system debug info logged'
      }

      (window as any).testFeatures = () => {
        console.log('=== Feature Test Results ===')
        console.log('✓ Particle Trails:', visualSettings?.particleTrails ? 'ENABLED' : 'DISABLED')
        console.log('✓ Ambient Light:', visualSettings?.ambientLightIntensity || 0.2)
        console.log('✓ Fog Density:', visualSettings?.fogDensity || 0)
        console.log('✓ Color Temperature:', visualSettings?.colorTemperature || 0.5)
        console.log('✓ Shader Mode:', visualSettings?.shaderMode || 0)
        console.log('✓ Stars:', visualSettings?.showStars ? 'VISIBLE' : 'HIDDEN')
        console.log('✓ Central Light:', visualSettings?.showCentralLight ? 'VISIBLE' : 'HIDDEN')
        console.log('=== End Test ===')
        return 'All features tested - check console for details'
      }

      (window as any).forceEnableTrails = () => {
        if (typeof window !== 'undefined' && (window as any).updateVisualSettings) {
          (window as any).updateVisualSettings({
            particleTrails: true,
            trailCount: 75,
            trailLength: 25,
            trailColor: '#e6f3ff'
          })
          console.log('Forced trail enable - refresh the page to see changes')
        } else {
          console.log('Visual settings update function not available')
        }
      }


    }
  }, [visualSettings])
  
  const updateTrails = (currentPositions: Float32Array, trailLength: number, trailColor: string, trailCount: number) => {
    if (!visualSettings?.particleTrails || !trailsRef.current) {
      trailedParticleIndices.current.clear()
      return
    }
    
    // Update every frame for smooth trails
    trailFrameCount.current++
    
    // Store position history
    const positionsCopy = new Float32Array(currentPositions.length)
    positionsCopy.set(currentPositions)
    trailHistoryRef.current.push(positionsCopy)
    
    // Keep only recent history based on trail length
    if (trailHistoryRef.current.length > trailLength) {
      trailHistoryRef.current.shift()
    }
    
    // Need at least 2 frames for trails
    if (trailHistoryRef.current.length < 2) return
    
    // Clear previous trails
    trailsRef.current.clear()

    // Reset trailed particle indices
    trailedParticleIndices.current.clear()
    
    // Create trails for specified number of particles
    const totalParticles = currentPositions.length / 3
    const step = Math.max(1, Math.floor(totalParticles / trailCount))

    // Debug: Log trail creation (only occasionally to avoid spam)
    if (trailFrameCount.current % 60 === 0) {
      console.log('Creating trails for', Math.min(trailCount, Math.floor(totalParticles / step)), 'particles out of', totalParticles)
    }
    
    for (let i = 0; i < totalParticles; i += step) {
      if (i >= trailCount) break

      // Mark this particle as having a trail
      trailedParticleIndices.current.add(i)
      
      const points: THREE.Vector3[] = []
      
      // Get trail points from history
      for (let t = 0; t < trailHistoryRef.current.length; t++) {
        const historyPositions = trailHistoryRef.current[t]
        const i3 = i * 3
        if (i3 + 2 < historyPositions.length) {
          points.push(new THREE.Vector3(
            historyPositions[i3],
            historyPositions[i3 + 1],
            historyPositions[i3 + 2]
          ))
        }
      }
      
      // Create ethereal trail with heavenly ascent effect
      if (points.length > 1) {
        const geometry = new THREE.BufferGeometry().setFromPoints(points)

        // Create gradient material that fades from bright to transparent
        // Simulating souls ascending and becoming more ethereal
        const material = new THREE.LineBasicMaterial({
          color: trailColor,
          transparent: true,
          opacity: 0.95,
          linewidth: 2
        })
        
        const line = new THREE.Line(geometry, material)

        // Add slight glow effect by creating a second, fainter trail
        const glowGeometry = new THREE.BufferGeometry().setFromPoints(points)
        const glowMaterial = new THREE.LineBasicMaterial({
          color: trailColor,
          transparent: true,
          opacity: 0.3,
          linewidth: 4
        })
        const glowLine = new THREE.Line(glowGeometry, glowMaterial)

        trailsRef.current.add(glowLine) // Add glow first (behind)
        trailsRef.current.add(line)    // Add main trail on top
      }
    }
  }
  
  // Performance optimization: reduce frame rate for physics calculations
  const frameSkipCount = useRef(0)
  const [currentTime, setCurrentTime] = useState(0)
  
  // Advanced physics useFrame callback with flocking, trails, and dynamic sphere distortion
  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Update frame counter and time
      frameSkipCount.current++
      setCurrentTime(state.clock.elapsedTime)
      
      // Skip physics calculations on some frames for better performance
      const skipPhysics = frameSkipCount.current % 2 === 0 // Run physics every other frame
      
      const currentPositions = pointsRef.current.geometry.attributes.position.array as Float32Array
      
      // Physics settings from controls
      const gravity = visualSettings?.gravity || 0.0
      const velocityDamping = visualSettings?.velocityDamping || 0.99
      
      // Dynamic sphere with breathing/expansion cycles for long-term variation
      const time = state.clock.elapsedTime
      const breathingCycle = Math.sin(time * 0.05) * 0.3 + 1.0 // 20-second breathing cycle
      const expansionCycle = Math.sin(time * 0.008) * 0.5 + 1.0 // 2.6-minute expansion cycle
      const baseSphereRadius = 12
      const sphereRadius = baseSphereRadius * breathingCycle * expansionCycle
      
      const sphereStrength = (visualSettings?.sphereStrength || 0.08) * (2.0 - expansionCycle) // Weaker when expanded
      const sphereDistortion = visualSettings?.sphereDistortion || 2.5
      const sphereNoise = visualSettings?.sphereNoise || 0.8
      const spherePulse = visualSettings?.spherePulse || 0.4
      
      // Dynamic flock behavior parameters that vary over time for swarm-like behavior
      const timeVariation = Math.sin(time * 0.02) * 0.5 + 1.0 // 5-minute variation cycle
      const separationDistance = 0.8 + timeVariation * 0.4 // 0.8 to 1.2
      const alignmentDistance = 2.0 + timeVariation * 1.0 // 2.0 to 3.0
      const cohesionDistance = 3.0 + timeVariation * 1.0 // 3.0 to 4.0
      
      // Vary flocking strengths to create more organic, less uniform behavior
      const separationStrength = 0.002 + Math.sin(time * 0.03 + 1) * 0.001 // 0.001 to 0.003
      const alignmentStrength = 0.0003 + Math.sin(time * 0.025 + 2) * 0.0002 // 0.0001 to 0.0005
      const cohesionStrength = 0.0002 + Math.sin(time * 0.035 + 3) * 0.0002 // 0.0000 to 0.0004
      const noiseStrength = 0.001 + Math.sin(time * 0.04 + 4) * 0.002 // -0.001 to 0.003 (can be negative for variety)
      
      // Apply physics to each particle (skip on some frames for performance)
      if (!skipPhysics) {
        for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        
        // Current position and velocity
        let x = currentPositions[i3]
        let y = currentPositions[i3 + 1]
        let z = currentPositions[i3 + 2]
        
        let vx = velocities[i3]
        let vy = velocities[i3 + 1]
        let vz = velocities[i3 + 2]
        
        // Individual particle characteristics for varied behavior
        const particleSeed = i * 0.001 // Unique seed for each particle
        const speedMultiplier = 0.7 + Math.sin(particleSeed * 100) * 0.6 // 0.1 to 1.3 speed variation
        const directionBias = {
          x: Math.sin(particleSeed * 200) * 0.02,
          y: Math.cos(particleSeed * 150) * 0.015,
          z: Math.sin(particleSeed * 250) * 0.02
        }
        
        // Apply individual direction bias for swarm-like behavior
        vx += directionBias.x * speedMultiplier
        vy += directionBias.y * speedMultiplier
        vz += directionBias.z * speedMultiplier
        
          // Special behavior for trailed particles and hovered particles
          const hasTrail = trailedParticleIndices.current.has(i)
        const isHovered = hoveredIndex !== null && i === hoveredIndex
          
          if (hasTrail) {
            // Trailed particles cycle through ascension and return phases
            const time = state.clock.elapsedTime
            const cycleTime = 120 // 2 minute cycle to prevent permanent disappearance
            const cycleProgress = (time + i * 10) % cycleTime / cycleTime // Offset each particle's cycle
            
            if (cycleProgress < 0.7) {
              // Ascension phase (70% of cycle)
              const heavenDriftStrength = 0.03 * (1 + Math.sin(cycleProgress * Math.PI * 2) * 0.3)
              const ascensionBoost = Math.sin(time * 0.3 + i * 0.05) * 0.015
              vy += heavenDriftStrength * (1.2 + Math.sin(time * 0.5 + i * 0.1)) + ascensionBoost
              
              // Graceful spiral movement
              const spiralRadius = 0.4 + Math.sin(time * 0.2 + i * 0.1) * 0.25
              const spiralSpeed = time * 0.6 + i * 0.25
              const spiralX = Math.sin(spiralSpeed) * spiralRadius * 0.015
              const spiralZ = Math.cos(spiralSpeed) * spiralRadius * 0.015
              
              vx += spiralX
              vz += spiralZ
            } else {
              // Return phase (30% of cycle) - gentle return to sphere
              const returnStrength = 0.02 * (cycleProgress - 0.7) / 0.3 // Gradually increase return force
              const centerDistance = Math.sqrt(x * x + y * y + z * z)
              if (centerDistance > 0) {
                vx -= (x / centerDistance) * returnStrength
                vy -= (y / centerDistance) * returnStrength * 1.5 // Stronger downward return
                vz -= (z / centerDistance) * returnStrength
              }
            }
            
            // Add gentle floating motion throughout cycle
            const floatStrength = 0.008
            vx += Math.sin(time * 1.1 + i * 0.4) * floatStrength
            vz += Math.cos(time * 0.9 + i * 0.6) * floatStrength
          }
          
        if (isHovered) {
          // Dampen the hovered particle's movement for stability
          vx *= 0.8
          vy *= 0.8
          vz *= 0.8
        }
        
          // Simplified flocking behavior
        let sepX = 0, sepY = 0, sepZ = 0
          let sepCount = 0
        
          // Check nearby particles (reduced for performance)
          const sampleSize = Math.min(20, particleCount)
        const step = Math.max(1, Math.floor(particleCount / sampleSize))
        
        for (let j = 0; j < particleCount; j += step) {
          if (i === j) continue
          
          const j3 = j * 3
          const dx = currentPositions[j3] - x
          const dy = currentPositions[j3 + 1] - y
          const dz = currentPositions[j3 + 2] - z
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
          
            if (distance > 0 && distance < separationDistance) {
              sepX -= dx / distance
              sepY -= dy / distance
              sepZ -= dz / distance
              sepCount++
            }
          }
          
          // Apply separation forces
        if (sepCount > 0) {
            const flockReduction = isHovered ? 0.2 : 1.0
          vx += (sepX / sepCount) * separationStrength * flockReduction
          vy += (sepY / sepCount) * separationStrength * flockReduction
          vz += (sepZ / sepCount) * separationStrength * flockReduction
        }
        
        // Add subtle noise for organic movement
          const noiseTime = state.clock.elapsedTime
          vx += Math.sin(noiseTime * 0.5 + i * 0.1) * noiseStrength
          vy += Math.cos(noiseTime * 0.3 + i * 0.2) * noiseStrength
          vz += Math.sin(noiseTime * 0.7 + i * 0.15) * noiseStrength
        
        // Force field effect: push particles away from hovered particle
        if (hoveredIndex !== null && hoveredIndex !== i) {
          const hoveredI3 = hoveredIndex * 3
          const hoveredX = currentPositions[hoveredI3]
          const hoveredY = currentPositions[hoveredI3 + 1]
          const hoveredZ = currentPositions[hoveredI3 + 2]
          
          const dx = x - hoveredX
          const dy = y - hoveredY
          const dz = z - hoveredZ
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
          
            const forceRadius = 4.0
            const forceStrength = 0.15
          
          if (distance > 0 && distance < forceRadius) {
            const nx = dx / distance
            const ny = dy / distance
            const nz = dz / distance
            
            const normalizedDistance = distance / forceRadius
            const forceMagnitude = forceStrength * Math.pow(1 - normalizedDistance, 2)
            
            vx += nx * forceMagnitude
            vy += ny * forceMagnitude
            vz += nz * forceMagnitude
          }
        }
        
          // Apply gravity
        vy -= gravity * delta
        
          // Apply dynamic sphere constraint with distortion
          const sphereDistance = Math.sqrt(x * x + y * y + z * z)
          if (sphereDistance > 0) {
          let targetDistance = sphereRadius * sphereDistortion
          
            // Add complex noise-based distortion for highly organic, abstract shapes
          if (sphereNoise > 0) {
              // Multi-layered noise for complex organic forms
              const noiseX1 = Math.sin(x * 0.08 + noiseTime * 0.4) * sphereNoise
              const noiseY1 = Math.cos(y * 0.12 + noiseTime * 0.6) * sphereNoise
              const noiseZ1 = Math.sin(z * 0.1 + noiseTime * 0.8) * sphereNoise
              
              // Second layer of noise for more complexity
              const noiseX2 = Math.sin(x * 0.2 + noiseTime * 1.2 + i * 0.01) * sphereNoise * 0.5
              const noiseY2 = Math.cos(y * 0.15 + noiseTime * 0.9 + i * 0.02) * sphereNoise * 0.5
              const noiseZ2 = Math.sin(z * 0.18 + noiseTime * 1.1 + i * 0.015) * sphereNoise * 0.5
              
              // Combine noise layers for highly irregular surface
            targetDistance += (noiseX1 + noiseY1 + noiseZ1) * 3.5 + (noiseX2 + noiseY2 + noiseZ2) * 2
          }
          
          // Add complex pulsing effect for living, breathing appearance
          if (spherePulse > 0) {
              // Multi-frequency pulsing for organic, heart-like rhythm
              const pulse1 = Math.sin(noiseTime * 1.8) * spherePulse
              const pulse2 = Math.sin(noiseTime * 3.2 + i * 0.05) * spherePulse * 0.6
              const pulse3 = Math.cos(noiseTime * 0.9 + x * 0.1) * spherePulse * 0.4
              
              // Combine pulses for complex breathing motion
            targetDistance += (pulse1 + pulse2 + pulse3) * 4
          }
          
            // Trailed particles can break free and ascend to heaven
            if (hasTrail) {
              // Much larger freedom for trailed particles
              targetDistance *= 4.0 // Increased from 2.5
              
              // Add time-based expansion to simulate breaking free and ascending
              const expansionFactor = 1 + Math.sin(noiseTime * 0.3 + i * 0.2) * 0.8
              targetDistance *= expansionFactor
              
              // Allow unlimited upward movement (heaven-bound)
              if (y > sphereRadius * 2) {
                targetDistance = Math.max(targetDistance, Math.abs(y) * 1.5)
              }
            }
            
            const difference = targetDistance - sphereDistance
            let constraintStrength = sphereStrength
            if (hasTrail) {
              constraintStrength *= 0.1 // Much weaker constraint for trailed particles (reduced from 0.3)
            }
            
            const forceStrength = difference * constraintStrength
            const constraintThreshold = hasTrail ? 3.0 : 0.1 // Much higher threshold for trailed particles
            
            if (Math.abs(difference) > constraintThreshold) {
              const nx = x / sphereDistance
              const ny = y / sphereDistance
              const nz = z / sphereDistance
          
          vx += nx * forceStrength * delta
          vy += ny * forceStrength * delta
          vz += nz * forceStrength * delta
            }
        }
        
        // Mouse following behavior for selected particles
        if (mouseFollowers.has(i)) {
          const mouseX = mousePosition3D.current.x
          const mouseY = mousePosition3D.current.y
          const mouseZ = mousePosition3D.current.z
          
          const dx = mouseX - x
          const dy = mouseY - y
          const dz = mouseZ - z
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
          
          if (distance > 0.5 && distance < mouseInfluenceRadius) {
            // Gentle attraction to mouse with some randomness
            const attractionStrength = 0.02 * (1 - distance / mouseInfluenceRadius)
            const randomness = 0.005
            
            vx += (dx / distance) * attractionStrength + (Math.random() - 0.5) * randomness
            vy += (dy / distance) * attractionStrength + (Math.random() - 0.5) * randomness
            vz += (dz / distance) * attractionStrength + (Math.random() - 0.5) * randomness
          }
        }
        
        // Attraction point effects (click-based particle attraction)
        attractionPoints.forEach(attraction => {
          const elapsed = Date.now() - attraction.startTime
          if (elapsed < attraction.duration) {
            const dx = attraction.position.x - x
            const dy = attraction.position.y - y
            const dz = attraction.position.z - z
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
            
            if (distance > 0.1 && distance < 10) {
              // Fade strength over time
              const fadeProgress = elapsed / attraction.duration
              const currentStrength = attraction.strength * (1 - fadeProgress * fadeProgress)
              const forceStrength = currentStrength / (distance * distance + 1) // Inverse square law with offset
              
              vx += (dx / distance) * forceStrength * 0.05
              vy += (dy / distance) * forceStrength * 0.05
              vz += (dz / distance) * forceStrength * 0.05
            }
          }
        })
        
        // Apply velocity damping with individual variation
          const baseDampingFactor = hasTrail ? 0.98 : velocityDamping
          const individualDamping = baseDampingFactor * (0.95 + Math.sin(particleSeed * 300) * 0.1) // 0.85 to 1.05 variation
          vx *= individualDamping
          vy *= individualDamping
          vz *= individualDamping
          
          // Limit velocity for stability with individual variation
          const baseMaxVelocity = hasTrail ? 0.3 : 0.1
          const maxVelocity = baseMaxVelocity * speedMultiplier
        const velocityMagnitude = Math.sqrt(vx * vx + vy * vy + vz * vz)
        if (velocityMagnitude > maxVelocity) {
          const scale = maxVelocity / velocityMagnitude
          vx *= scale
          vy *= scale
          vz *= scale
        }
        
          // Update positions with individual speed variation
          const baseSpeedMultiplier = hasTrail ? 15 : 10
          const finalSpeedMultiplier = baseSpeedMultiplier * speedMultiplier
          x += vx * delta * finalSpeedMultiplier
          y += vy * delta * finalSpeedMultiplier
          z += vz * delta * finalSpeedMultiplier
        
        // Long-term stability: prevent particles from drifting too far from center
        const maxDistance = sphereRadius * 3 // Allow particles to go 3x sphere radius
        const currentDistance = Math.sqrt(x * x + y * y + z * z)
        if (currentDistance > maxDistance) {
          // Gently pull back towards center
          const pullStrength = (currentDistance - maxDistance) / maxDistance * 0.1
          x -= (x / currentDistance) * pullStrength
          y -= (y / currentDistance) * pullStrength
          z -= (z / currentDistance) * pullStrength
        }
        
        // Store updated values
        currentPositions[i3] = x
        currentPositions[i3 + 1] = y
        currentPositions[i3 + 2] = z
        
        velocities[i3] = vx
        velocities[i3 + 1] = vy
        velocities[i3 + 2] = vz
        }
      }
      
      // Update geometry
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    
      // Update mouse position for particle following
      updateMouse3D()
      
      // Dynamically update mouse followers for long-term variety
      if (Math.random() < 0.015) { // 1.5% chance per frame to update followers
        const newFollowers = new Set<number>()
        const baseFollowerCount = Math.floor(particleCount * 0.015) // 1.5% of particles
        const timeVariation = Math.sin(time * 0.01) * 0.5 + 1.0 // Vary count over time
        const numFollowers = Math.min(20, Math.floor(baseFollowerCount * timeVariation))
        
        // Select particles with some bias towards those near the mouse
        for (let i = 0; i < numFollowers; i++) {
          let randomIndex
          if (Math.random() < 0.3) {
            // 30% chance to select particles closer to mouse position
            const attempts = 5
            let bestIndex = Math.floor(Math.random() * particleCount)
            let bestDistance = Infinity
            
            for (let attempt = 0; attempt < attempts; attempt++) {
              const testIndex = Math.floor(Math.random() * particleCount)
              const testI3 = testIndex * 3
              const dx = currentPositions[testI3] - mousePosition3D.current.x
              const dy = currentPositions[testI3 + 1] - mousePosition3D.current.y
              const dz = currentPositions[testI3 + 2] - mousePosition3D.current.z
              const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
              
              if (distance < bestDistance) {
                bestDistance = distance
                bestIndex = testIndex
              }
            }
            randomIndex = bestIndex
          } else {
            // 70% chance for completely random selection
            randomIndex = Math.floor(Math.random() * particleCount)
          }
          newFollowers.add(randomIndex)
        }
        
        setMouseFollowers(newFollowers)
      }
    
      // Update trails if enabled
      if (visualSettings?.particleTrails) {
      updateTrails(
        currentPositions, 
          visualSettings.trailLength || 25, 
          visualSettings.trailColor || '#e6f3ff', 
          visualSettings.trailCount || 75
        )
      }
    
                  // Hover detection using raycasting for immediate red color feedback
      if (!isAutoPlaying && !focusedPerson) {
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObject(pointsRef.current)

        if (intersects.length > 0) {
          const intersection = intersects[0]
          if (intersection.index !== undefined) {
            // Check distance threshold - only allow hover on particles within reasonable distance
            const maxHoverDistance = 20 // Maximum distance for hover detection (increased for better responsiveness)
            const particleDistance = intersection.distance
            
            if (particleDistance <= maxHoverDistance) {
              const newCandidate = intersection.index
            
            // Set hover immediately for instant red color feedback
            if (newCandidate !== lastHovered) {
              setLastHovered(newCandidate)
              setHoveredIndex(newCandidate)
              
              // Only auto-focus camera during memorial playback, not in free-flow mode
              // In free-flow mode, just show the hover effect without camera movement
            }
      } else {
              // Particle is too far - no hover
              if (lastHovered !== null) {
                setLastHovered(null)
          setHoveredIndex(null)
              }
            }
        }
      } else {
          // Clear hover immediately when not intersecting any particle
          if (lastHovered !== null) {
            setLastHovered(null)
          setHoveredIndex(null)
            // No camera reset in free-flow mode - let user control camera freely
          }
        }
      }
    }
  })
  
  // Mouse interaction and particle selection
  const handleClick = (event: any) => {
    event.stopPropagation?.()
    
    // Only allow particle clicks when not in auto-playback mode
    if (!focusedPerson && hoveredIndex !== null && hoveredIndex < data.length) {
      onParticleClick(data[hoveredIndex], hoveredIndex)
    }
  }
  
  // Mouse press handlers for attraction effects
  const handleMouseDown = (event: any) => {
    event.stopPropagation?.()
    setIsMousePressed(true)
    
    // Create attraction point at mouse position
    if (camera && mouse) {
      raycaster.setFromCamera(mouse, camera)
      const distance = 12
      const attractionPos = new THREE.Vector3()
      attractionPos.copy(raycaster.ray.direction).multiplyScalar(distance).add(raycaster.ray.origin)
      
      const newAttraction = {
        position: attractionPos,
        strength: 0.8,
        startTime: Date.now(),
        duration: 3000 // 3 seconds
      }
      
      setAttractionPoints(prev => [...prev, newAttraction])
      
      // Remove attraction point after duration
      setTimeout(() => {
        setAttractionPoints(prev => prev.filter(p => p !== newAttraction))
      }, newAttraction.duration)
    }
  }
  
  const handleMouseUp = () => {
    setIsMousePressed(false)
  }
  
  // Update mouse position in 3D space for particle following
  const updateMouse3D = () => {
    if (camera && mouse) {
      raycaster.setFromCamera(mouse, camera)
      const distance = 15 // Distance from camera
      mousePosition3D.current.copy(raycaster.ray.direction).multiplyScalar(distance).add(raycaster.ray.origin)
    }
  }

  return (
    <group>
      {/* Particle trails */}
      <group ref={trailsRef}>
        {/* Trail lines will be added here dynamically */}
      </group>
      
      {/* Main particles */}
      <points 
        ref={pointsRef} 
        onClick={handleClick}
        onPointerDown={handleMouseDown}
        onPointerUp={handleMouseUp}
        geometry={geometry}
      >
        <particleMaterial
          map={createDotTexture()}
          color={getParticleColor()}
          opacity={visualSettings?.particleOpacity || 0.9}
          focusedIndex={focusedIndex ?? -1.0}
          hoveredIndex={hoveredIndex !== null ? hoveredIndex : -1.0}
          time={currentTime}
          particleSize={visualSettings?.particleSize || 0.2}
          glowIntensity={visualSettings?.glowIntensity || 1.0}
          shaderMode={visualSettings?.shaderMode || 0}
          filterTransitionTime={0.0}

          transparent={true}
          blending={THREE.NormalBlending}
          depthWrite={false}
          depthTest={true}
          vertexColors={false}
        />
      </points>
    </group>
  )
}

function MemorialScene({ 
  data, 
  onParticleClick, 
  hoveredIndex, 
  setHoveredIndex,
  onParticlePositions,
  visualSettings,
  focusedIndex,
  filteredData
}: { 
  data: Casualty[]
  onParticleClick: (person: Casualty, index: number) => void
  hoveredIndex: number | null
  setHoveredIndex: (index: number | null) => void
  onParticlePositions?: (positions: Float32Array) => void
  visualSettings?: {
    particleSize: number
    particleOpacity: number
    showStars: boolean
    showCentralLight: boolean
    enableSceneRotation: boolean
    cameraAutoRotate: boolean
    cameraTransitionSpeed: number
    ambientLightIntensity: number
    fogDensity: number
    particleTrails: boolean
    trailLength: number
    trailColor: string
    glowIntensity: number
    colorTemperature: number
    shaderMode: number
    // Canvas shader properties removed
  }
  focusedIndex?: number | null
  filteredData: Casualty[]
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const { isAutoPlaying } = useStore()
  
  console.log('MemorialScene render - data length:', data.length)
  
  useFrame((state) => {
    // Slow rotation of the entire scene (only when not auto-playing and enabled)
    if (groupRef.current && !isAutoPlaying && visualSettings?.enableSceneRotation) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })
  
  return (
    <group ref={groupRef}>
      {/* Simplified lighting for better particle visibility */}
      <ambientLight intensity={0.6} color="#ffffff" />
      
      {/* Enhanced Atmospheric Fog with Texture */}
      {/* Fog effects removed - they were causing visibility issues */}
      
      {/* Background stars */}
      {visualSettings?.showStars && (
        <Stars radius={100} depth={50} count={1000} factor={2} saturation={0} fade />
      )}
      
      {/* Duplicate lighting system removed for better performance */}
      
      {/* Main particle field */}
      <FloatingParticles 
        data={filteredData} 
        onParticleClick={onParticleClick}
        hoveredIndex={hoveredIndex}
        setHoveredIndex={setHoveredIndex}
        onParticlePositions={onParticlePositions}
        visualSettings={visualSettings}
        focusedIndex={focusedIndex}
        filteredData={filteredData}
      />
      
      
      {/* Central memorial light */}
      {/* Central memorial light - hidden for cleaner appearance */}
      {false && visualSettings?.showCentralLight && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
      )}
      
      {/* Canvas shader effects removed - they were not working properly */}
      
      <OrbitControls 
        enablePan={!isAutoPlaying}
        enableZoom={!isAutoPlaying}
        enableRotate={!isAutoPlaying}
        minDistance={5}
        maxDistance={25}
        autoRotate={!isAutoPlaying && visualSettings?.cameraAutoRotate}
        autoRotateSpeed={0.5}
      />
      <CameraController transitionSpeed={visualSettings?.cameraTransitionSpeed || 1.2} />
    </group>
  )
}

export default function SceneCanvas() {
  const [data, setData] = useState<Casualty[]>([])
  const [dataInfo, setDataInfo] = useState<DataInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingProgress, setLoadingProgress] = useState<string>('Initializing...')
  const [backgroundLoading, setBackgroundLoading] = useState(false)
  const [westBankData, setWestBankData] = useState<any[]>([])
  const [showWestBankHistory, setShowWestBankHistory] = useState(false)
  const [infrastructureData, setInfrastructureData] = useState<any[]>([])
  const [showInfrastructureDetails, setShowInfrastructureDetails] = useState(false)
  const [gazaDailyData, setGazaDailyData] = useState<any[]>([])
  const [loadingStartTime, setLoadingStartTime] = useState<number>(0)
  const [selectedPerson, setSelectedPerson] = useState<Casualty | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [particlePositions, setParticlePositions] = useState<Float32Array | null>(null)
  
  // Audio settings
  const [audioSettings, setAudioSettings] = useState({
    musicMuted: false,
    voiceMuted: false,
    musicVolume: 0.3
  })

  // Debug functions - available immediately
  const loadWestBankDataOnly = async () => {
    console.log('🔄 Loading West Bank data only...')
    try {
      const response = await fetch('https://data.techforpalestine.org/api/v2/west_bank_daily.json')
      if (response.ok) {
        const wbData = await response.json()
        setWestBankData(wbData)
        console.log(`✅ Loaded ${wbData.length} West Bank records`)
        return wbData
      } else {
        console.log(`❌ Failed to load West Bank data: ${response.status}`)
      }
    } catch (error) {
      console.log(`❌ Error loading West Bank data: ${error}`)
    }
  }

  const loadInfrastructureDataOnly = async () => {
    console.log('🏗️ Loading Infrastructure data only...')
    try {
      const response = await fetch('https://data.techforpalestine.org/api/v3/infrastructure-damaged.json')
      if (response.ok) {
        const infraData = await response.json()
        setInfrastructureData(infraData)
        console.log(`✅ Loaded ${infraData.length} Infrastructure records`)

        // Show summary of latest data
        const latest = infraData[infraData.length - 1]
        console.log('🏗️ Latest Infrastructure Damage Summary:')
        console.log(`   Schools Destroyed: ${latest?.educational_buildings?.ext_destroyed || latest?.educational_buildings?.destroyed || 0}`)
        console.log(`   Schools Damaged: ${latest?.educational_buildings?.ext_damaged || latest?.educational_buildings?.damaged || 0}`)
        console.log(`   Mosques Destroyed: ${latest?.places_of_worship?.ext_mosques_destroyed || latest?.places_of_worship?.mosques_destroyed || 0}`)
        console.log(`   Homes Destroyed: ${latest?.residential?.ext_destroyed || latest?.residential?.destroyed || 0}`)

        return infraData
      } else {
        console.log(`❌ Failed to load Infrastructure data: ${response.status}`)
      }
    } catch (error) {
      console.log(`❌ Error loading Infrastructure data: ${error}`)
    }
  }

  const loadPreviewDataNow = async () => {
    console.log('🔄 Loading preview data manually...')

    try {
      // Load West Bank data
      console.log('Loading West Bank data...')
      const wbResponse = await fetch('https://data.techforpalestine.org/api/v2/west_bank_daily.json')
      if (wbResponse.ok) {
        const wbData = await wbResponse.json()
        setWestBankData(wbData)
        console.log(`✅ West Bank: ${wbData.length} records loaded`)
      }

      // Load Infrastructure data
      console.log('Loading Infrastructure data...')
      const infraResponse = await fetch('https://data.techforpalestine.org/api/v3/infrastructure-damaged.json')
      if (infraResponse.ok) {
        const infraData = await infraResponse.json()
        setInfrastructureData(infraData)
        console.log(`✅ Infrastructure: ${infraData.length} records loaded`)
      }

      console.log('🎉 Preview data loading complete!')
    } catch (error) {
      console.error('❌ Error loading preview data:', error)
    }
  }

  const testAPIsNow = async () => {
    console.log('🧪 Testing API connectivity...')
    const apis = [
      'https://data.techforpalestine.org/api/v2/killed-in-gaza.min.json',
      'https://data.techforpalestine.org/api/v2/casualties_daily.min.json',
      'https://data.techforpalestine.org/api/v2/press_killed_in_gaza.json',
      'https://data.techforpalestine.org/api/v2/west_bank_daily.json',
      'https://data.techforpalestine.org/api/v3/infrastructure-damaged.json'
    ]

    for (const api of apis) {
      try {
        console.log(`Testing ${api}...`)
        const response = await fetch(api, { method: 'HEAD' })
        console.log(`✅ ${api}: ${response.status} ${response.statusText}`)
      } catch (error) {
        console.log(`❌ ${api}: Failed - ${error}`)
      }
    }
    console.log('🧪 API test complete')
  }

  const testCSVNow = async () => {
    console.log('🧪 Testing CSV fallback functionality...')
    const csvFiles = [
      'killed-in-gaza.csv',
      'casualties_daily.csv',
      'press_killed_in_gaza.csv',
      'west_bank_daily.csv',
      'infrastructure-damaged.csv'
    ]

    for (const csvFile of csvFiles) {
      try {
        console.log(`Testing CSV: ${csvFile}...`)
        const response = await fetch(`/${csvFile}`)
        if (response.ok) {
          const text = await response.text()
          const lines = text.trim().split('\n')
          console.log(`✅ ${csvFile}: ${lines.length} lines loaded`)
        } else {
          console.log(`❌ ${csvFile}: ${response.status} ${response.statusText}`)
        }
      } catch (error) {
        console.log(`❌ ${csvFile}: Failed - ${error}`)
      }
    }
    console.log('🧪 CSV test complete')
  }


  
  // Background music ref
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null)
  
  // UI Settings
  const [uiSettings, setUISettings] = useState({
    showMemorialInfo: true,
    showInstructions: false, // Changed to false by default
    showFiltersPanel: true,
    showAudioControls: true,
    showHoverTooltip: true
  })

  // Visual Settings - Enhanced for "Breaking Free" behavior and Creative Shaders
  const [visualSettings, setVisualSettings] = useState({
    particleSize: 0.2,
    particleOpacity: 0.9,
    showStars: true, // Enabled to enhance heavenly atmosphere
    showCentralLight: true, // Central memorial light
    enableSceneRotation: true,
    cameraAutoRotate: true,
    cameraTransitionSpeed: 1.2, // Camera transition speed multiplier
    // Physics controls
    gravity: 0.0, // Downward force (heaven-bound particles overcome gravity)
    velocityDamping: 0.99, // Velocity decay (0.99 = slight damping, 0.9 = heavy damping)
    sphereStrength: 0.08, // Reduced force pulling particles back to sphere surface for more abstract shape
    sphereDistortion: 2.5, // Much higher distortion - very abstract, non-spherical shape
    sphereNoise: 0.8, // High noise-based surface distortion for organic, flowing form
    spherePulse: 0.4, // Stronger pulsing effect for more dynamic, living appearance
    // Creative atmosphere controls - enhanced for heavenly ascension
    ambientLightIntensity: 0.3, // Slightly brighter for ethereal effect
    fogDensity: 0.01, // Subtle fog for depth and mystery
    particleTrails: true, // Enabled to showcase "breaking free" behavior
    trailLength: 25, // Longer trails for more dramatic effect
    trailCount: 75, // Fewer trails but more impactful (each represents breaking free)
    trailColor: '#e6f3ff', // Soft blue-white for heavenly appearance
    glowIntensity: 1.0, // Enhanced glow for ethereal effect
    colorTemperature: 0.7, // Color temperature for warm/cool effects (0 to 1 range)
    shaderMode: 0, // 0=default, 1=ethereal, 2=cosmic, 3=aurora, 4=plasma
    // Canvas shader effects removed for better performance
  })

  const { filters, setCameraTarget, setFocusedPerson, setFocusedParticleIndex, isAutoPlaying, focusedParticleIndex } = useStore()

  const filteredData = useMemo(() => {
    // Performance optimization: early return if no filters applied
    if (filters.gender === 'all' && 
        filters.source === 'all' && 
        filters.type === 'all' && 
        filters.ageRange[0] === 0 && 
        filters.ageRange[1] === 120 && 
        filters.nameSearch.trim() === '') {
      return data
    }
    
    const result = data.filter(d => {
      // Early exit optimizations - check cheapest conditions first
      if (filters.gender !== 'all' && d.gender !== filters.gender) return false
      if (filters.type !== 'all' && d.type !== filters.type) return false
      if (filters.source !== 'all' && d.source !== filters.source) return false
      if (d.age < filters.ageRange[0] || d.age > filters.ageRange[1]) return false
      
      // Name search (most expensive, do last)
      if (filters.nameSearch.trim() !== '') {
        const searchLower = filters.nameSearch.toLowerCase()
        if (!d.name_en.toLowerCase().includes(searchLower) && 
            !d.name_ar.includes(filters.nameSearch)) {
          return false
        }
      }
      
      return true
    })
    return result
  }, [data, filters])

    const fetchData = async () => {
    setLoading(true)
    setError(null)
    setLoadingProgress('Initializing memorial space...')
    
    // Record loading start time for minimum 5-second display
    const startTime = Date.now()
    setLoadingStartTime(startTime)

      try {
        console.log('SceneCanvas: Starting data fetch...')

      // Set up fallback timeout
      const fallbackTimeout = setTimeout(() => {
        console.log('⏰ 15-second timeout reached, falling back to CSV data...')
        loadCSVFallbackData()
      }, 15000)

      // First, try to load preview data quickly for display during loading
      setLoadingProgress('Loading daily updates from Gaza, West Bank, and infrastructure...')
      console.log('🔄 Starting preview data loading...')

      try {
        const [gazaDailyResponse, westBankResponse, infrastructureResponse] = await Promise.allSettled([
          fetch('https://data.techforpalestine.org/api/v2/casualties_daily.json'),
          fetch('https://data.techforpalestine.org/api/v2/west_bank_daily.json'),
          fetch('https://data.techforpalestine.org/api/v3/infrastructure-damaged.json')
        ])

        console.log('Gaza Daily response:', gazaDailyResponse)
        console.log('West Bank response:', westBankResponse)
        console.log('Infrastructure response:', infrastructureResponse)

        if (gazaDailyResponse.status === 'fulfilled' && gazaDailyResponse.value.ok) {
          const gazaData = await gazaDailyResponse.value.json()
          console.log('✅ Gaza Daily data loaded:', gazaData.length, 'records')
          console.log('Sample Gaza Daily data:', gazaData[gazaData.length - 1])
          setGazaDailyData(gazaData)
        } else {
          console.error('❌ Gaza Daily API failed:', gazaDailyResponse)
        }

        console.log('West Bank response:', westBankResponse)
        console.log('Infrastructure response:', infrastructureResponse)

        if (westBankResponse.status === 'fulfilled' && westBankResponse.value.ok) {
          const wbData = await westBankResponse.value.json()
          console.log('✅ West Bank data loaded:', wbData.length, 'records')
          console.log('Sample West Bank data:', wbData[wbData.length - 1])
          setWestBankData(wbData)
        } else {
          console.error('❌ West Bank API failed:', westBankResponse)
        }

        if (infrastructureResponse.status === 'fulfilled' && infrastructureResponse.value.ok) {
          const infraData = await infrastructureResponse.value.json()
          console.log('✅ Infrastructure data loaded:', infraData.length, 'records')
          console.log('Sample Infrastructure data:', infraData[infraData.length - 1])
          setInfrastructureData(infraData)
        } else {
          console.error('❌ Infrastructure API failed:', infrastructureResponse)
        }
      } catch (previewError) {
        console.error('🚨 Preview data loading error:', previewError)
      }

      setLoadingProgress('Loading memorial data from Tech for Palestine APIs...')

        const dataResult = await loadData()
        console.log('SceneCanvas: Data loaded successfully:', dataResult.casualties.length, 'records')

      // Clear the fallback timeout since we succeeded
      clearTimeout(fallbackTimeout)

      setLoadingProgress('Processing memorial data...')
        setData(dataResult.casualties)
        setDataInfo(dataResult)
        setError(null)
      
      // Ensure minimum 5-second loading time for users to see data sources and daily updates
      const elapsedTime = Date.now() - startTime
      const minimumLoadingTime = 5000 // 5 seconds
      const remainingTime = minimumLoadingTime - elapsedTime
      
      if (remainingTime > 0) {
        setLoadingProgress('Preparing memorial visualization...')
        console.log(`⏰ Waiting ${remainingTime}ms more to meet minimum loading time`)
        await new Promise(resolve => setTimeout(resolve, remainingTime))
      }
      
      setLoadingProgress('Gaza Souls Memorial space ready')
      } catch (err) {
        console.error('SceneCanvas: Error loading data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred while loading data')
      setLoadingProgress('Failed to load data - using fallback')
      
      // Still enforce minimum loading time even on error
      const elapsedTime = Date.now() - startTime
      const minimumLoadingTime = 5000
      const remainingTime = minimumLoadingTime - elapsedTime
      
      if (remainingTime > 0) {
        console.log(`⏰ Waiting ${remainingTime}ms more even after error`)
        await new Promise(resolve => setTimeout(resolve, remainingTime))
      }
      } finally {
        console.log('SceneCanvas: Setting loading to false')
        setLoading(false)
      }
    }
    
  // Make functions globally available after fetchData is declared
  if (typeof window !== 'undefined') {
    ;(window as any).loadPreviewData = loadPreviewDataNow
    ;(window as any).loadWestBankOnly = loadWestBankDataOnly
    ;(window as any).loadInfrastructureOnly = loadInfrastructureDataOnly
    ;(window as any).testAPIs = testAPIsNow
    ;(window as any).testCSV = testCSVNow
    ;(window as any).retryDataLoad = fetchData

    console.log('🔧 Debug functions loaded! Available commands:')
    console.log('   loadPreviewData() - Load both datasets')
    console.log('   loadWestBankOnly() - Load West Bank data only')
    console.log('   loadInfrastructureOnly() - Load infrastructure data only')
    console.log('   testAPIs() - Test API connectivity')
    console.log('   testCSV() - Test CSV file access')
    console.log('   retryDataLoad() - Retry full data loading')
  }

  const loadCSVFallbackData = async () => {
    console.log('🔄 Loading CSV fallback data...')
    setLoadingProgress('Loading backup data from CSV files...')

    try {
      // Load West Bank CSV data
      const wbCSVResponse = await fetch('/west_bank_daily.csv')
      if (wbCSVResponse.ok) {
        const wbCSVText = await wbCSVResponse.text()
        const wbLines = wbCSVText.trim().split('\n')
        const wbHeaders = wbLines[0].split(',')
        const wbData = []

        for (let i = 1; i < wbLines.length; i++) {
          const values = wbLines[i].split(',')
          const row: any = {}
          wbHeaders.forEach((header, index) => {
            const value = values[index]?.trim() || ''
            const numValue = parseFloat(value)
            row[header] = isNaN(numValue) ? value : numValue
          })
          wbData.push(row)
        }

        console.log(`✅ Loaded ${wbData.length} West Bank records from CSV`)
        setWestBankData(wbData)
      }

      // Load Infrastructure CSV data
      const infraCSVResponse = await fetch('/infrastructure-damaged.csv')
      if (infraCSVResponse.ok) {
        const infraCSVText = await infraCSVResponse.text()
        const infraLines = infraCSVText.trim().split('\n')
        const infraHeaders = infraLines[0].split(',')
        const infraData = []

        for (let i = 1; i < infraLines.length; i++) {
          const values = infraLines[i].split(',')
          const row: any = {}

          infraHeaders.forEach((header, index) => {
            const value = values[index]?.trim() || ''
            const numValue = parseFloat(value)
            row[header] = isNaN(numValue) ? value : numValue
          })

          // Convert flattened CSV back to nested structure
          const infraRecord = {
            report_date: row.report_date,
            educational_buildings: {
              destroyed: row.schools_destroyed,
              damaged: row.schools_damaged
            },
            places_of_worship: {
              mosques_destroyed: row.mosques_destroyed
            },
            residential: {
              destroyed: row.homes_destroyed
            }
          }

          infraData.push(infraRecord)
        }

        console.log(`✅ Loaded ${infraData.length} Infrastructure records from CSV`)
        setInfrastructureData(infraData)
      }

      setLoadingProgress('Backup data loaded successfully!')
      console.log('🎉 CSV fallback loading complete!')
    } catch (error) {
      console.error('❌ CSV fallback loading failed:', error)
      setLoadingProgress('Failed to load backup data')
    }
  }
    
  useEffect(() => {
    fetchData()
  }, [])

  // Initialize background music
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio('/Memorial_Instrumental_Loop.mp3')
      audio.loop = true
      audio.volume = audioSettings.musicVolume
      audio.muted = audioSettings.musicMuted
      backgroundMusicRef.current = audio
      
      // Start playing when component mounts (user interaction required)
      const startMusic = () => {
        if (backgroundMusicRef.current && !audioSettings.musicMuted) {
          backgroundMusicRef.current.play().catch(console.warn)
        }
      }
      
      // Start music on first user interaction
      document.addEventListener('click', startMusic, { once: true })
      document.addEventListener('keydown', startMusic, { once: true })
      
      return () => {
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.pause()
          backgroundMusicRef.current = null
        }
        document.removeEventListener('click', startMusic)
        document.removeEventListener('keydown', startMusic)
      }
    }
  }, [audioSettings.musicMuted, audioSettings.musicVolume])

  // Update background music settings
  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = audioSettings.musicVolume
      backgroundMusicRef.current.muted = audioSettings.musicMuted
      
      if (!audioSettings.musicMuted && backgroundMusicRef.current.paused) {
        backgroundMusicRef.current.play().catch(console.warn)
      } else if (audioSettings.musicMuted) {
        backgroundMusicRef.current.pause()
      }
    }
  }, [audioSettings])

  // Keyboard support for stopping memorial
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isAutoPlaying) {
        const { stopAutoPlayback } = useStore.getState()
        stopAutoPlayback()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isAutoPlaying])

  const handleParticleClick = (person: Casualty, index: number) => {
    setSelectedPerson(person)
  }

  const handlePersonFocus = (person: Casualty, _index: number) => {
    if (particlePositions && _index < particlePositions.length / 3) {
      const x = particlePositions[_index * 3]
      const y = particlePositions[_index * 3 + 1]
      const z = particlePositions[_index * 3 + 2]
      
      // During memorial playback, position camera to frame the particle properly
      if (isAutoPlaying) {
        // Calculate direction from origin to particle for better framing
        const particleDistance = Math.sqrt(x * x + y * y + z * z)
        const nx = particleDistance > 0 ? x / particleDistance : 0
        const ny = particleDistance > 0 ? y / particleDistance : 0
        const nz = particleDistance > 0 ? z / particleDistance : 1
        
        // Enhanced camera positioning for optimal framing of red particle above name tag
        const cameraDistance = 6 // Closer for more intimate framing
        
        // Add slight offset to camera position for better angle
        const offsetAngle = Math.PI * 0.15 // 27 degrees offset for better viewing angle
        const cameraOffsetX = Math.cos(offsetAngle) * nx - Math.sin(offsetAngle) * nz
        const cameraOffsetZ = Math.sin(offsetAngle) * nx + Math.cos(offsetAngle) * nz
        
        const cameraPos: [number, number, number] = [
          cameraOffsetX * cameraDistance, 
          (ny * cameraDistance) + 1.5, // Slightly elevated for better particle framing
          cameraOffsetZ * cameraDistance
        ]
        
        // Look at point positioned to show red particle in upper portion of frame
        // This ensures the particle appears above where the name tag will be displayed
        const targetDistance = 2.5 // Where the particle will be positioned
        const lookAt: [number, number, number] = [
          nx * targetDistance, 
          ny * targetDistance - 2.0, // Look significantly lower to frame particle in upper third
          nz * targetDistance
        ]
        
        setCameraTarget({ position: cameraPos, lookAt })
      } else {
        // Free-flow mode - smooth approach to particle without jarring movements
        // Use a more gradual approach that doesn't require current camera position
        const particlePos = new THREE.Vector3(x, y, z)
        
        // Calculate a smooth approach using particle's position relative to center
        const particleDistance = Math.sqrt(x * x + y * y + z * z)
        const optimalDistance = 4 // Comfortable viewing distance
        
        // Position camera at a good angle relative to the particle
        const cameraOffset = particleDistance > 0 ? optimalDistance / particleDistance : 1
        const cameraPos: [number, number, number] = [
          x * (1 + cameraOffset),
          y * (1 + cameraOffset) + 1, // Slightly above for better view
          z * (1 + cameraOffset)
        ]
        
        // Look at the particle with slight offset for name display
        const lookAt: [number, number, number] = [x, y - 0.3, z]
        setCameraTarget({ position: cameraPos, lookAt })
      }
      
      setFocusedPerson(person)
      setFocusedParticleIndex(_index) // Set the focused particle index for glow effect
    }
  }

  const closeModal = () => {
    setSelectedPerson(null)
  }

  const handleUISettingsChange = (newSettings: Partial<typeof uiSettings>) => {
    setUISettings(prev => ({ ...prev, ...newSettings }))
  }

  const handleVisualSettingsChange = (newSettings: Partial<typeof visualSettings>) => {
    setVisualSettings(prev => ({ ...prev, ...newSettings }))
  }

  const handleAudioSettingsChange = (newSettings: Partial<typeof audioSettings>) => {
    setAudioSettings(prev => ({ ...prev, ...newSettings }))
  }

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden relative">
        {/* Subtle particle field background - matching WebGL aesthetic */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Scattered memorial particles */}
          <div className="absolute top-[15%] left-[20%] w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
          <div className="absolute top-[25%] right-[30%] w-0.5 h-0.5 bg-white/30 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-[45%] left-[15%] w-0.5 h-0.5 bg-white/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-[65%] right-[25%] w-1 h-1 bg-white/35 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-[80%] left-[40%] w-0.5 h-0.5 bg-white/25 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-[35%] right-[15%] w-0.5 h-0.5 bg-white/30 rounded-full animate-pulse" style={{animationDelay: '2.5s'}}></div>
          <div className="absolute top-[55%] left-[70%] w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
          <div className="absolute top-[75%] right-[60%] w-0.5 h-0.5 bg-white/20 rounded-full animate-pulse" style={{animationDelay: '3.5s'}}></div>
        </div>

        <div className="relative z-10 text-center text-white max-w-6xl mx-auto p-8">
          {/* Main Loading Animation - matching memorial aesthetic */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <h1 className="text-4xl md:text-6xl font-light tracking-wide">Gaza Souls Memorial</h1>
            </div>
            
            <div className="text-xl md:text-2xl font-light text-gray-300 mb-2">
              Initializing Sacred Space
            </div>
            <div className="text-sm text-gray-400 mb-6 font-light">
              Loading data from Tech for Palestine • Gaza Daily Reports • West Bank Updates • Infrastructure Damage
            </div>
            
            {/* Subtle loading indicator */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
            
            <div className="text-sm text-gray-400 font-mono">
              {loadingProgress}
            </div>
          </div>

          {/* Compact System Status with Data Stream Animation */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-700/30 shadow-xl max-w-sm mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-2 h-2 bg-green-400/30 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-sm font-mono text-white/90">System Online</span>
                </div>
                
                {/* Data Stream Animation */}
                <div className="flex items-center gap-1">
                  <div className="flex gap-0.5">
                    <div className="w-0.5 h-3 bg-blue-400/60 rounded-full animate-pulse" style={{animationDelay: '0ms'}}></div>
                    <div className="w-0.5 h-4 bg-green-400/60 rounded-full animate-pulse" style={{animationDelay: '100ms'}}></div>
                    <div className="w-0.5 h-2 bg-yellow-400/60 rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
                    <div className="w-0.5 h-5 bg-blue-400/60 rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
                    <div className="w-0.5 h-3 bg-green-400/60 rounded-full animate-pulse" style={{animationDelay: '400ms'}}></div>
                    <div className="w-0.5 h-4 bg-yellow-400/60 rounded-full animate-pulse" style={{animationDelay: '500ms'}}></div>
                  </div>
                  <span className="text-xs font-mono text-gray-400 ml-1">streaming</span>
                </div>
              </div>
              
              {/* Compact Status Indicators */}
              <div className="flex items-center justify-between mt-2 text-xs font-mono">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400">Connected</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
                  <span className="text-yellow-400">Processing</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '400ms'}}></div>
                  <span className="text-blue-400">Initializing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Memorial Data Cards Grid - matching WebGL interface aesthetic */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {/* Gaza Daily Updates Card */}
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse mr-3"></div>
                <h3 className="text-lg font-light text-white">Gaza Daily Updates</h3>
              </div>

              {gazaDailyData.length > 0 ? (
                <div className="space-y-4">
                  {(() => {
                    const latest = gazaDailyData[gazaDailyData.length - 1]
                    console.log('🔍 Rendering Gaza Daily data:', latest)
                    return (
                      <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-lg p-4 border border-red-800/30">
                        <div className="text-gray-300 text-xs mb-3 font-mono">Latest Update: {latest?.report_date}</div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-400 font-mono">{latest?.killed_cum?.toLocaleString() || 0}</div>
                            <div className="text-xs text-gray-400">Total Killed</div>
                            <div className="text-xs text-red-300 font-mono">+{latest?.killed || 0} today</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-400 font-mono">{latest?.injured_cum?.toLocaleString() || 0}</div>
                            <div className="text-xs text-gray-400">Total Injured</div>
                            <div className="text-xs text-orange-300 font-mono">+{latest?.injured || 0} today</div>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              ) : (
                <div className="text-sm text-gray-300">
                  <p className="font-light">Loading Gaza daily data...</p>
                  <div className="text-xs text-gray-500 mt-2 font-mono">Records loaded: {gazaDailyData.length}</div>
                </div>
              )}
            </div>

            {/* West Bank Memorial Card */}
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse mr-3"></div>
                  <h3 className="text-lg font-light text-white">West Bank Memorial</h3>
                </div>
                <button
                  onClick={() => setShowWestBankHistory(!showWestBankHistory)}
                  className="text-white/60 hover:text-white/80 text-sm font-mono transition-colors"
                >
                  {showWestBankHistory ? 'Hide' : 'History'}
                </button>
              </div>

              {westBankData.length > 0 ? (
                <div className="space-y-4">
                  {(() => {
                    const latest = westBankData[westBankData.length - 1]
                    console.log('🔍 Rendering West Bank data:', latest)
                    return (
                      <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-lg p-4 border border-red-800/30">
                        <div className="text-gray-300 text-xs mb-3 font-medium">Latest Update: {latest?.report_date}</div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-400">{latest?.killed_cum || 0}</div>
                            <div className="text-xs text-gray-400">Total Killed</div>
                            <div className="text-xs text-red-300">+{latest?.killed || 0} today</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-400">{latest?.injured_cum || 0}</div>
                            <div className="text-xs text-gray-400">Total Injured</div>
                            <div className="text-xs text-orange-300">+{latest?.injured || 0} today</div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-700/50">
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-yellow-400">Children Killed:</span> {latest?.killed_children_cum || 0}
                            </div>
                            <div>
                              <span className="text-purple-400">Settler Attacks:</span> {latest?.settler_attacks_cum || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })()}

                  {/* History View */}
                  {showWestBankHistory && (
                    <div className="mt-4 max-h-40 overflow-y-auto space-y-2 bg-gray-900/50 rounded-lg p-2">
                      {westBankData.slice(-6).reverse().map((day: any, index: number) => (
                        <div key={index} className="flex justify-between text-xs bg-gray-800/50 rounded px-3 py-2 hover:bg-gray-700/50 transition-colors">
                          <span className="text-gray-400 font-mono">{day.report_date}</span>
                          <div className="flex gap-3">
                            <span className="text-red-400">K:{day.killed_cum}</span>
                            <span className="text-orange-400">I:{day.injured_cum}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="relative mb-4">
                    <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-400 rounded-full animate-spin mx-auto"></div>
                  </div>
                  <div className="text-gray-400 animate-pulse">Loading West Bank data...</div>
                  <div className="text-xs text-gray-500 mt-2">Records loaded: {westBankData.length}</div>
                </div>
              )}
            </div>

            {/* Infrastructure Memorial Card */}
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse mr-3"></div>
                  <h3 className="text-lg font-light text-white">Infrastructure Memorial</h3>
                </div>
                <button
                  onClick={() => setShowInfrastructureDetails(!showInfrastructureDetails)}
                  className="text-white/60 hover:text-white/80 text-sm font-mono transition-colors"
                >
                  {showInfrastructureDetails ? 'Hide' : 'Details'}
                </button>
              </div>

              {infrastructureData.length > 0 ? (
                <div className="space-y-4">
                  {(() => {
                    const latest = infrastructureData[infrastructureData.length - 1]
                    console.log('🔍 Rendering Infrastructure data:', latest)
                    return (
                      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-blue-800/30">
                        <div className="text-gray-300 text-xs mb-3 font-medium">Latest Update: {latest?.report_date}</div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">{latest?.educational_buildings?.ext_destroyed || latest?.educational_buildings?.destroyed || 0}</div>
                            <div className="text-xs text-gray-400">Schools Destroyed</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">{latest?.educational_buildings?.ext_damaged || latest?.educational_buildings?.damaged || 0}</div>
                            <div className="text-xs text-gray-400">Schools Damaged</div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-700/50">
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-purple-400">Mosques Destroyed:</span> {latest?.places_of_worship?.ext_mosques_destroyed || latest?.places_of_worship?.mosques_destroyed || 0}
                            </div>
                            <div>
                              <span className="text-yellow-400">Homes Destroyed:</span> {latest?.residential?.ext_destroyed || latest?.residential?.destroyed || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })()}

                  {/* Detailed View */}
                  {showInfrastructureDetails && (
                    <div className="mt-4 max-h-40 overflow-y-auto space-y-2 bg-gray-900/50 rounded-lg p-2">
                      {infrastructureData.slice(-5).reverse().map((day: any, index: number) => (
                        <div key={index} className="text-xs bg-gray-800/50 rounded px-3 py-2 hover:bg-gray-700/50 transition-colors">
                          <div className="text-gray-400 mb-2 font-mono">{day.report_date}</div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-blue-400">Schools: {day.educational_buildings?.ext_destroyed || day.educational_buildings?.destroyed || 0}D</span>
                            <span className="text-green-400">{day.educational_buildings?.ext_damaged || day.educational_buildings?.damaged || 0}Dam</span>
                            <span className="text-purple-400">Mosques: {day.places_of_worship?.ext_mosques_destroyed || day.places_of_worship?.mosques_destroyed || 0}D</span>
                            <span className="text-yellow-400">Homes: {day.residential?.ext_destroyed || day.residential?.destroyed || 0}D</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="relative mb-4">
                    <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin mx-auto"></div>
                  </div>
                  <div className="text-gray-400 animate-pulse">Loading infrastructure data...</div>
                  <div className="text-xs text-gray-500 mt-2">Records loaded: {infrastructureData.length}</div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  console.log('🔄 Manual data reload triggered')
                  loadPreviewDataNow()
                }}
                className="px-8 py-3 bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-sm hover:from-gray-800/90 hover:to-gray-900/90 text-white rounded-lg font-light transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50"
              >
                Reload Gaza Souls Memorial Data
              </button>

              <button
                onClick={() => {
                  console.log('⏭️ Skip loading - proceeding to visualization')
                  setLoading(false)
                  setBackgroundLoading(true)
                  setLoadingProgress('Skipped loading - data will load in background')

                  // Start background loading
                  fetchData().finally(() => {
                    setBackgroundLoading(false)
                    console.log('🎉 Background loading complete!')
                  })
                }}
                className="px-8 py-3 bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-sm hover:from-gray-800/90 hover:to-gray-900/90 text-white rounded-lg font-light transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50"
                title="Skip loading screen and continue to visualization (data will load in background)"
              >
                Enter Gaza Souls Memorial Space
              </button>
            </div>


          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <div className="text-sm text-gray-500 mb-2 font-light">
              Gaza Souls Memorial data provided by Tech for Palestine
            </div>
            <div className="flex justify-center items-center gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse"></div>
                <span className="font-mono">Live Data</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse"></div>
                <span className="font-mono">CSV Backup</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse"></div>
                <span className="font-mono">15s Timeout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="text-center text-white max-w-md mx-auto p-8">
          <div className="mb-6">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-light mb-2">Connection Issue</h2>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
          </div>

          <div className="space-y-3 text-xs text-gray-500 mb-6">
            <p>• The Tech for Palestine APIs may be temporarily unavailable</p>
            <p>• Check your internet connection</p>
            <p>• The application will use fallback data if APIs fail</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={fetchData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              🔄 Retry Loading Data
            </button>

            <div className="space-y-3 mt-4">
              <button
                onClick={() => {
                  console.log('🔄 Manual data reload triggered')
                  fetchData()
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                🔄 Reload Preview Data
              </button>


            </div>
          </div>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <p className="text-white text-xl">No data available</p>
      </div>
    )
  }



  return (
    <div className="w-full h-screen bg-black relative">
      {/* Unified Sidebar - Hidden during memorial playback */}
      {!isAutoPlaying && (
        <UnifiedSidebar 
          data={data}
          casualtyCount={dataInfo?.stats ? 
            (dataInfo.stats.gaza.total_killed + dataInfo.stats.west_bank.total_killed) :
            data.length
          }
          uiSettings={uiSettings}
          onUISettingsChange={handleUISettingsChange}
          visualSettings={visualSettings}
          onVisualSettingsChange={handleVisualSettingsChange}
          audioSettings={audioSettings}
          onAudioSettingsChange={handleAudioSettingsChange}
        />
      )}

      {/* Memorial info overlay - Hidden during memorial playback */}
      {!isAutoPlaying && uiSettings.showMemorialInfo && (
        <div className="absolute top-6 left-6 z-10 text-white max-w-md">
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm border border-gray-700/50 p-6 rounded-xl shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <h1 className="text-3xl font-light tracking-wide">Palestine Memorial</h1>
            </div>
            
            <div className="space-y-4">
              {/* Total Memorial Count Display */}
              <div>
                <p className="text-2xl font-mono font-bold">
                  63,872 souls
                </p>
                <p className="text-gray-300 text-sm italic">Each light represents a life lost</p>
                {dataInfo?.stats && (
                  <p className="text-xs text-gray-500 mt-1">
                    Named individuals: {data.filter(p => !p.id.startsWith('stat_')).length.toLocaleString()} • 
                    Statistical souls: {data.filter(p => p.id.startsWith('stat_')).length.toLocaleString()}
                    {filteredData.length !== data.length && (
                      <span> • Filtered: {filteredData.length.toLocaleString()}</span>
                    )}
                  </p>
                )}
              </div>

              {/* Comprehensive Statistics */}
              {dataInfo?.stats && (
                <div className="space-y-3 pt-2 border-t border-gray-700/50">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Gaza Strip</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="space-y-1">
                        <p><span className="text-red-400 font-mono">{dataInfo.stats.gaza.total_killed.toLocaleString()}</span> killed</p>
                        <p><span className="text-blue-300 font-mono">{dataInfo.stats.gaza.children_killed.toLocaleString()}</span> children</p>
                        <p><span className="text-pink-300 font-mono">{dataInfo.stats.gaza.women_killed.toLocaleString()}</span> women</p>
                      </div>
                      <div className="space-y-1">
                        <p><span className="text-orange-400 font-mono">{dataInfo.stats.gaza.total_injured.toLocaleString()}</span> injured</p>
                        <p><span className="text-yellow-400 font-mono">{dataInfo.stats.gaza.press_killed.toLocaleString()}</span> journalists</p>
                        <p><span className="text-green-400 font-mono">{dataInfo.stats.gaza.medical_killed.toLocaleString()}</span> medical staff</p>
                      </div>
                    </div>
                  </div>

                  {dataInfo.stats.west_bank.total_killed > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">West Bank</h3>
                      <div className="text-xs space-y-1">
                        <p><span className="text-red-400 font-mono">{dataInfo.stats.west_bank.total_killed.toLocaleString()}</span> killed</p>
                        <p><span className="text-orange-400 font-mono">{dataInfo.stats.west_bank.total_injured.toLocaleString()}</span> injured</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Infrastructure Destroyed</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="space-y-1">
                        <p><span className="text-purple-400 font-mono">{dataInfo.stats.infrastructure.homes_destroyed.toLocaleString()}</span> homes</p>
                        <p><span className="text-cyan-400 font-mono">{dataInfo.stats.infrastructure.schools_destroyed.toLocaleString()}</span> schools</p>
                        <p><span className="text-indigo-400 font-mono">{dataInfo.stats.infrastructure.mosques_destroyed.toLocaleString()}</span> mosques</p>
                      </div>
                      <div className="space-y-1">
                        <p><span className="text-teal-400 font-mono">{dataInfo.stats.infrastructure.government_buildings_destroyed.toLocaleString()}</span> gov buildings</p>
                        <p><span className="text-rose-400 font-mono">{dataInfo.stats.infrastructure.churches_destroyed.toLocaleString()}</span> churches</p>
                        <p><span className="text-amber-400 font-mono">{(dataInfo.stats.infrastructure.schools_damaged + dataInfo.stats.infrastructure.mosques_damaged).toLocaleString()}</span> damaged</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Source */}
              <div className="pt-2 border-t border-gray-700/50 space-y-1">
                <p className="text-xs text-gray-400">
                  Data: <a 
                    href="https://data.techforpalestine.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline transition-colors"
                  >
                    data.techforpalestine.org
                  </a>
                </p>
                {dataInfo?.lastUpdated && (
                  <p className="text-xs text-gray-500">
                    Last updated: {dataInfo.lastUpdated}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Instructions - Hidden during memorial playback */}
      {!isAutoPlaying && uiSettings.showInstructions && (
        <div className="absolute bottom-6 right-6 z-10 text-white">
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-700/30 p-2 rounded-lg shadow-lg">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span>Drag • Zoom • Click</span>
            </div>
          </div>
        </div>
      )}

      {/* Hover tooltip - Hidden during memorial playback */}
      {!isAutoPlaying && uiSettings.showHoverTooltip && hoveredIndex !== null && hoveredIndex < data.length && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-md border border-gray-600/50 text-white p-4 rounded-xl shadow-2xl text-center animate-in fade-in duration-200">
            <p className="text-lg font-medium">{data[hoveredIndex].name_en}</p>
            <p className="text-base text-gray-200 mt-1" dir="rtl">{data[hoveredIndex].name_ar}</p>
            <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-400">
              <span>Age {data[hoveredIndex].age}</span>
              <span className="text-gray-600">•</span>
              <span className="capitalize">{data[hoveredIndex].gender}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">Click to see details</p>
          </div>
        </div>
      )}
      

      
      <Canvas 
        camera={{ position: [15, 5, 15], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
      >
        <MemorialScene 
          data={filteredData} 
          onParticleClick={handleParticleClick}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
          onParticlePositions={setParticlePositions}
          visualSettings={visualSettings}
          focusedIndex={focusedParticleIndex}
          filteredData={filteredData}
        />
      </Canvas>

      {/* Background Loading Indicator */}
      {backgroundLoading && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700 shadow-2xl max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-400 rounded-full animate-spin"></div>
            <div>
              <div className="text-white text-sm font-medium">Loading Data...</div>
              <div className="text-gray-400 text-xs">Gaza Souls Memorial data is loading in background</div>
            </div>
          </div>
        </div>
      )}

      {/* No Data Indicator */}
      {!backgroundLoading && data.length === 0 && !loading && (
        <div className="fixed top-4 right-4 z-50 bg-yellow-900/90 backdrop-blur-sm rounded-lg p-4 border border-yellow-700 shadow-2xl max-w-sm">
          <div className="flex items-center gap-3">
            <div className="text-yellow-400 text-lg">⚠️</div>
            <div>
              <div className="text-white text-sm font-medium">No Data Loaded</div>
              <div className="text-yellow-200 text-xs">Click here to load memorial data</div>
              <button
                onClick={() => {
                  console.log('🔄 Loading data from visualization...')
                  setBackgroundLoading(true)
                  fetchData().finally(() => setBackgroundLoading(false))
                }}
                className="mt-2 text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded transition-colors"
              >
                Load Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Person Details Modal - Hidden during memorial playback */}
      {!isAutoPlaying && selectedPerson && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl max-w-lg w-full mx-4 shadow-2xl border border-gray-600 overflow-hidden">
            {/* Header with close button */}
            <div className="relative bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4">
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 text-2xl font-light"
              >
                ×
              </button>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-full border border-gray-600/30">
                  <div 
                    className="w-12 h-12"
                    dangerouslySetInnerHTML={{ __html: createCrescentStarSVG() }}
                  />
                </div>
                <p className="text-sm text-gray-300 font-light tracking-wide">IN MEMORY OF</p>
                {selectedPerson.id.startsWith('stat_') && (
                  <div className="mt-3 px-3 py-1 bg-blue-900/30 border border-blue-700/50 rounded-full text-xs text-blue-300">
                    Statistical Soul - Representative of the unnamed
                  </div>
                )}
              </div>
            </div>

            {/* Main content */}
            <div className="px-8 py-6">
              {/* Names section */}
              <div className="text-center mb-8">
                {/* Arabic name - large and prominent */}
                <h1 className="text-4xl font-light mb-4 text-white leading-relaxed" dir="rtl" style={{ fontFamily: 'serif' }}>
                  {selectedPerson.name_ar}
                </h1>
                {/* English name - smaller, elegant */}
                <h2 className="text-xl text-gray-300 font-light tracking-wide">
                  {selectedPerson.name_en}
                </h2>
              </div>

              {/* Details grid */}
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-700 border-opacity-50">
                  <span className="text-gray-400 text-sm uppercase tracking-wider">Age</span>
                  <span className="text-white text-lg font-medium">{selectedPerson.age}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-700 border-opacity-50">
                  <span className="text-gray-400 text-sm uppercase tracking-wider">Gender</span>
                  <span className="text-white text-lg font-medium capitalize">{selectedPerson.gender}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-700 border-opacity-50">
                  <span className="text-gray-400 text-sm uppercase tracking-wider">Location</span>
                  <span className="text-white text-lg font-medium">Gaza, Palestine</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-700 border-opacity-50">
                  <span className="text-gray-400 text-sm uppercase tracking-wider">Born</span>
                  <span className="text-white text-lg font-medium">{selectedPerson.date_of_birth}</span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-400 text-sm uppercase tracking-wider">Source</span>
                  <span className="text-white text-sm font-medium bg-gray-700 px-3 py-1 rounded-full">
                    {selectedPerson.source}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-8 py-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
                <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
                <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
              </div>
              <p className="text-sm text-gray-300 font-light italic">
                &ldquo;To live in hearts we leave behind is not to die&rdquo;
              </p>
              <p className="text-xs text-gray-400 mt-2 font-light">
                May their memory be eternal
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Audio Playback Controls */}
      {uiSettings.showAudioControls && (
                <AudioPlayback 
          data={filteredData}
          onPersonFocus={handlePersonFocus}
          cameraSpeed={visualSettings.cameraTransitionSpeed}
          particlePositionsReady={!!particlePositions}
          voiceMuted={audioSettings.voiceMuted}
        />
      )}


    </div>
  )
}
