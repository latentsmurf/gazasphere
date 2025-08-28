'use client'

/**
 * Gaza Memorial Visualization - Main 3D Scene Component
 *
 * This component serves as the primary interface for the Palestine Memorial,
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
 * @author Palestine Memorial Project
 * @version 1.0.0
 * @since 2024
 */

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, shaderMaterial } from '@react-three/drei'
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
      transparent?: boolean
      blending?: THREE.Blending
      depthWrite?: boolean
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
  focusedIndex
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
  }
  focusedIndex?: number | null
}) {
  const pointsRef = useRef<THREE.Points>(null!)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null!)
  const trailsRef = useRef<THREE.Group>(null!)
  const { raycaster, camera, mouse, gl } = useThree()
  const { filters, isFiltered, focusedPerson, isAutoPlaying } = useStore()
  
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
  
  // Enhanced trail system with "breaking free" behavior
  const trailFrameCount = useRef(0)

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
  
  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Skip physics calculations on some frames for better performance
      frameSkipCount.current++
      const skipPhysics = frameSkipCount.current % 2 === 0 // Run physics every other frame
      
      const currentPositions = pointsRef.current.geometry.attributes.position.array as Float32Array
      
      // Physics settings from controls
      const gravity = visualSettings?.gravity || 0.0
      const velocityDamping = visualSettings?.velocityDamping || 0.99
      const sphereRadius = 12
      const sphereStrength = visualSettings?.sphereStrength || 0.1
      
      // Optimized flock behavior parameters - reduced complexity
      const separationDistance = 1.0
      const alignmentDistance = 2.5
      const cohesionDistance = 3.5
      const separationStrength = 0.003  // Further reduced
      const alignmentStrength = 0.0005  // Further reduced  
      const cohesionStrength = 0.0004   // Further reduced
      const noiseStrength = 0.002       // Further reduced
      
      // Performance optimization: only calculate flocking for subset of particles
      // Note: flockCalculationStep kept for future performance optimization
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const flockCalculationStep = Math.max(1, Math.floor(particleCount / 5000)) // Reduce flock calculations
      
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
        
        // Special behavior for trailed particles - breaking free and ascending
        const hasTrail = trailedParticleIndices.current.has(i)
        const isHovered = hoveredIndex !== null && i === hoveredIndex

        if (hasTrail) {
          // Debug: Log trailed particle processing (only occasionally)
          if (i === 0 && frameSkipCount.current % 60 === 0) {
            console.log('Processing trailed particle physics for', trailedParticleIndices.current.size, 'particles')
          }
          // Trailed particles have erratic, upward movement as if breaking free
          const time = state.clock.elapsedTime

          // Add strong upward drift force (heaven-bound)
          const heavenDriftStrength = 0.02
          vy += heavenDriftStrength * (1 + Math.sin(time * 0.5 + i * 0.1))

          // Add erratic horizontal movement (breaking free)
          const erraticStrength = 0.015
          vx += Math.sin(time * 2.3 + i * 0.7) * erraticStrength
          vz += Math.cos(time * 1.8 + i * 0.9) * erraticStrength

          // Add burst escape velocity when particle is far from center
          const distanceFromCenter = Math.sqrt(x * x + y * y + z * z)
          if (distanceFromCenter > sphereRadius * 0.8) {
            const escapeStrength = 0.008
            const nx = x / distanceFromCenter
            const ny = y / distanceFromCenter
            const nz = z / distanceFromCenter

            // Push outward and upward
            vx += nx * escapeStrength + Math.sin(time + i) * 0.003
            vy += ny * escapeStrength + heavenDriftStrength * 0.5
            vz += nz * escapeStrength + Math.cos(time + i) * 0.003
          }

        if (isHovered) {
          // Dampen the hovered particle's movement for stability
          vx *= 0.8
          vy *= 0.8
          vz *= 0.8
        }
        
        // Flock behavior forces
        let sepX = 0, sepY = 0, sepZ = 0
        let alignX = 0, alignY = 0, alignZ = 0
        let cohX = 0, cohY = 0, cohZ = 0
        let sepCount = 0, alignCount = 0, cohCount = 0


        
        // Check nearby particles (heavily reduced for performance)
        const sampleSize = Math.min(20, particleCount) // Reduced from 50 to 20
        const step = Math.max(1, Math.floor(particleCount / sampleSize))
        
        for (let j = 0; j < particleCount; j += step) {
          if (i === j) continue
          
          const j3 = j * 3
          const dx = currentPositions[j3] - x
          const dy = currentPositions[j3 + 1] - y
          const dz = currentPositions[j3 + 2] - z
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
          
          if (distance > 0) {
            // Separation: avoid crowding neighbors
            if (distance < separationDistance) {
              sepX -= dx / distance
              sepY -= dy / distance
              sepZ -= dz / distance
              sepCount++
            }
            
            // Alignment: steer towards average heading of neighbors
            if (distance < alignmentDistance) {
              alignX += velocities[j3]
              alignY += velocities[j3 + 1]
              alignZ += velocities[j3 + 2]
              alignCount++
            }
            
            // Cohesion: steer towards average position of neighbors
            if (distance < cohesionDistance) {
              cohX += dx
              cohY += dy
              cohZ += dz
              cohCount++
            }
          }
        }
        
        // Apply flock forces (reduced for hovered particle and particles near it)
        const flockReduction = isHovered ? 0.2 : 1.0 // Reduce flock forces for hovered particle
        
        // Reduce flocking forces for particles with trails (more erratic behavior)
        let effectiveSepCount = sepCount
        let effectiveAlignCount = alignCount
        let effectiveCohCount = cohCount

        if (hasTrail) {
          const erraticReduction = 0.3 // Reduce flock influence for more erratic behavior
          effectiveSepCount *= erraticReduction
          effectiveAlignCount *= erraticReduction
          effectiveCohCount *= erraticReduction
        }

        if (effectiveSepCount > 0) {
          vx += (sepX / effectiveSepCount) * separationStrength * flockReduction
          vy += (sepY / effectiveSepCount) * separationStrength * flockReduction
          vz += (sepZ / effectiveSepCount) * separationStrength * flockReduction
        }

        if (effectiveAlignCount > 0) {
          vx += (alignX / effectiveAlignCount) * alignmentStrength * flockReduction
          vy += (alignY / effectiveAlignCount) * alignmentStrength * flockReduction
          vz += (alignZ / effectiveAlignCount) * alignmentStrength * flockReduction
        }

        if (effectiveCohCount > 0) {
          vx += (cohX / effectiveCohCount) * cohesionStrength * flockReduction
          vy += (cohY / effectiveCohCount) * cohesionStrength * flockReduction
          vz += (cohZ / effectiveCohCount) * cohesionStrength * flockReduction
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
          
          // Calculate distance from hovered particle
          const dx = x - hoveredX
          const dy = y - hoveredY
          const dz = z - hoveredZ
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
          
          // Apply repulsion force within a certain radius
          const forceRadius = 4.0 // Larger radius of the force field
          const forceStrength = 0.15 // Stronger repulsion force
          
          if (distance > 0 && distance < forceRadius) {
            // Normalize direction vector
            const nx = dx / distance
            const ny = dy / distance
            const nz = dz / distance
            
            // Calculate force strength (exponentially stronger when closer)
            const normalizedDistance = distance / forceRadius
            const forceMagnitude = forceStrength * Math.pow(1 - normalizedDistance, 2)
            
            // Apply repulsion force
            vx += nx * forceMagnitude
            vy += ny * forceMagnitude
            vz += nz * forceMagnitude
          }
        }
        
        // Sound-responsive forces during memorial playback - much gentler
        if (isAutoPlaying) {
          const audioLevel = getAudioLevel()
          const soundStrength = audioLevel * 0.01 // Reduced from 0.05
          
          // Create ripple effects based on audio
          const rippleFreq = time * 0.5 + audioLevel * 2 // Slower frequency
          const rippleX = Math.sin(rippleFreq + i * 0.01) * soundStrength
          const rippleY = Math.cos(rippleFreq * 1.3 + i * 0.02) * soundStrength
          const rippleZ = Math.sin(rippleFreq * 0.7 + i * 0.015) * soundStrength
          
          vx += rippleX
          vy += rippleY
          vz += rippleZ
          
          // Special behavior for the focused particle - freeze and move very close to camera
          if (focusedIndex !== null && i === focusedIndex) {
            // Freeze the particle by zeroing its velocity
            vx = 0
            vy = 0
            vz = 0
            
            // Move the particle very close to the camera for full-screen effect
            const currentDistance = Math.sqrt(x * x + y * y + z * z)
            const targetDistance = 2.5 // Very close to camera for full coverage
            
            if (currentDistance > 0) {
              const nx = x / currentDistance
              const ny = y / currentDistance  
              const nz = z / currentDistance
              
              // Smoothly interpolate to the target position
              const lerpSpeed = 0.05
              const targetX = nx * targetDistance
              const targetY = ny * targetDistance
              const targetZ = nz * targetDistance
              
              // Override position directly for immediate effect
              currentPositions[i3] = x + (targetX - x) * lerpSpeed
              currentPositions[i3 + 1] = y + (targetY - y) * lerpSpeed
              currentPositions[i3 + 2] = z + (targetZ - z) * lerpSpeed
              
              // Skip normal physics for this particle
              continue
            }
          }
          
          // Add pulsing effect based on audio intensity
          const pulseStrength = audioLevel * 0.005 // Reduced from 0.02
          const distanceFromFocus = focusedIndex !== null ? 
            Math.sqrt((x - 0) * (x - 0) + (y - 0) * (y - 0) + (z - 0) * (z - 0)) : 10
          
          if (distanceFromFocus < 5) {
            // Particles near the focused soul respond more strongly
            const proximityMultiplier = (5 - distanceFromFocus) / 5
            vx += Math.sin(time * 1 + i * 0.1) * pulseStrength * proximityMultiplier // Slower time
            vy += Math.cos(time * 1 + i * 0.1) * pulseStrength * proximityMultiplier
            vz += Math.sin(time * 1 + i * 0.1) * pulseStrength * proximityMultiplier
          }
        }
        
        // Apply gravity (downward force)
        vy -= gravity * delta
        
        // Apply sphere constraint with enhanced distortion controls for organic, irregular shapes
        const sphereDistance = Math.sqrt(x * x + y * y + z * z)
        if (sphereDistance > 0) {
          // Sphere distortion parameters - now with complex multi-layer distortion
          const sphereDistortion = visualSettings?.sphereDistortion || 1.0
          const sphereNoise = visualSettings?.sphereNoise || 0.0
          const spherePulse = visualSettings?.spherePulse || 0.0
          
          // Calculate distorted target distance with enhanced irregularity
          let targetDistance = sphereRadius * sphereDistortion

          // Add fractal-like distortion for more complex organic shapes
          if (sphereDistortion > 1.0) {
            // Fractal distortion - creates irregular, organic bulges
            const fractalDistortion = Math.sin(x * 0.5 + y * 0.3 + z * 0.4 + noiseTime * 0.2) *
                                    Math.sin(x * 1.1 + y * 0.8 + z * 0.9 + noiseTime * 0.3) *
                                    (sphereDistortion - 1.0) * 0.5
            targetDistance += fractalDistortion * sphereRadius * 0.3
          }

          // Add axis-specific stretching to break spherical symmetry
          const axisStretchX = 1 + Math.sin(x * 0.15 + noiseTime * 0.6) * 0.1
          const axisStretchY = 1 + Math.cos(y * 0.12 + noiseTime * 0.4) * 0.08
          const axisStretchZ = 1 + Math.sin(z * 0.18 + noiseTime * 0.8) * 0.12

          // Apply directional stretching
          const stretchFactor = (axisStretchX + axisStretchY + axisStretchZ) / 3
          targetDistance *= stretchFactor
          
          // Trailed particles can break free - allow them to go much further
          if (hasTrail) {
            // Allow trailed particles to break free and ascend
            targetDistance *= 2.5 // Much larger sphere for trailed particles
            // Add time-based expansion to simulate breaking free
            const expansionFactor = 1 + Math.sin(state.clock.elapsedTime * 0.3 + i * 0.2) * 0.5
            targetDistance *= expansionFactor
          }
          
          // Add complex noise-based distortion for organic, irregular shapes
          if (sphereNoise > 0) {
            // Primary noise layer - smooth waves
            const noiseX = Math.sin(x * 0.1 + noiseTime * 0.5) * sphereNoise
            const noiseY = Math.cos(y * 0.1 + noiseTime * 0.3) * sphereNoise
            const noiseZ = Math.sin(z * 0.1 + noiseTime * 0.7) * sphereNoise

            // Secondary noise layer - finer details with different frequencies
            const detailNoiseX = Math.sin(x * 0.3 + noiseTime * 1.1) * sphereNoise * 0.5
            const detailNoiseY = Math.cos(y * 0.3 + noiseTime * 0.9) * sphereNoise * 0.5
            const detailNoiseZ = Math.sin(z * 0.3 + noiseTime * 1.3) * sphereNoise * 0.5

            // Tertiary noise layer - very fine texture
            const microNoiseX = Math.sin(x * 0.8 + noiseTime * 2.1) * sphereNoise * 0.2
            const microNoiseY = Math.cos(y * 0.8 + noiseTime * 1.8) * sphereNoise * 0.2
            const microNoiseZ = Math.sin(z * 0.8 + noiseTime * 2.4) * sphereNoise * 0.2

            // Combine all noise layers with directional bias for more organic shapes
            const totalNoise = (noiseX + noiseY + noiseZ +
                              detailNoiseX + detailNoiseY + detailNoiseZ +
                              microNoiseX + microNoiseY + microNoiseZ)

            // Add directional distortion - make some areas bulge out more than others
            const directionalDistortion = Math.sin(x * 0.2 + y * 0.15 + z * 0.1 + noiseTime * 0.4) * sphereNoise * 0.8

            targetDistance += totalNoise * 2 + directionalDistortion
          }
          
          // Add organic pulsing effect with irregular rhythm
          if (spherePulse > 0) {
            // Primary pulse - main breathing rhythm
            const primaryPulse = Math.sin(noiseTime * 2) * spherePulse

            // Secondary pulse - irregular heartbeat-like rhythm
            const secondaryPulse = Math.sin(noiseTime * 3.7 + Math.sin(noiseTime * 0.5)) * spherePulse * 0.3

            // Micro pulses - subtle surface ripples
            const microPulse = Math.sin(noiseTime * 7.3 + i * 0.1) * spherePulse * 0.1

            // Combine pulses with some directional variation
            const totalPulse = primaryPulse + secondaryPulse + microPulse
            const directionalPulse = totalPulse * (1 + Math.sin(x * 0.1 + y * 0.1 + z * 0.1 + noiseTime) * 0.2)

            targetDistance += directionalPulse * 3
          }
          
          const difference = targetDistance - sphereDistance

          // Reduce constraint strength for trailed particles
          let constraintStrength = sphereStrength
          if (hasTrail) {
            constraintStrength *= 0.3 // Much weaker constraint for trailed particles
          }

          const forceStrength = difference * constraintStrength

          // Only apply constraint if particle is significantly outside bounds
          // Allow trailed particles more freedom
          const constraintThreshold = hasTrail ? 1.5 : 0.1
          if (Math.abs(difference) > constraintThreshold) {
          // Normalize direction and apply force
          const nx = x / sphereDistance
          const ny = y / sphereDistance
          const nz = z / sphereDistance
          
          vx += nx * forceStrength * delta
          vy += ny * forceStrength * delta
          vz += nz * forceStrength * delta
          }
        }
        
        // Apply velocity damping (less for trailed particles)
        const dampingFactor = hasTrail ? 0.98 : velocityDamping
        vx *= dampingFactor
        vy *= dampingFactor
        vz *= dampingFactor

        // Limit velocity for stability - allow trailed particles to move faster
        const maxVelocity = hasTrail ? 0.3 : 0.1 // Trailed particles can move faster
        const velocityMagnitude = Math.sqrt(vx * vx + vy * vy + vz * vz)
        if (velocityMagnitude > maxVelocity) {
          const scale = maxVelocity / velocityMagnitude
          vx *= scale
          vy *= scale
          vz *= scale
        }
        
        // Update positions - trailed particles move faster and more erratically
        const speedMultiplier = hasTrail ? 15 : 10 // Trailed particles move faster
        x += vx * delta * speedMultiplier
        y += vy * delta * speedMultiplier
        z += vz * delta * speedMultiplier
        
        // Store updated values
        currentPositions[i3] = x
        currentPositions[i3 + 1] = y
        currentPositions[i3 + 2] = z
        
        velocities[i3] = vx
        velocities[i3 + 1] = vy
        velocities[i3 + 2] = vz
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    
    // Update particle trails
    if (visualSettings?.particleTrails && trailsRef.current) {
      updateTrails(
        currentPositions, 
        visualSettings.trailLength || 25,
        visualSettings.trailColor || '#e6f3ff',
        visualSettings.trailCount || 75
      )
    }
      
      // Raycasting for hover detection
      if (!focusedPerson) {
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObject(pointsRef.current)

        if (intersects.length > 0) {
          const _index = intersects[0].index
          if (_index !== undefined && _index !== hoveredIndex) {
            setHoveredIndex(_index)
            gl.domElement.style.cursor = 'pointer'
          }
        } else if (hoveredIndex !== null) {
          setHoveredIndex(null)
          gl.domElement.style.cursor = 'default'
        }
      } else {
        // Clear hover state during auto-playback
        if (hoveredIndex !== null) {
          setHoveredIndex(null)
          gl.domElement.style.cursor = 'default'
        }
      }
    }
    
    // Update shader uniforms
    if (materialRef.current && frameSkipCount.current % 3 === 0) { // Update every 3rd frame for performance
      // Update color based on filters
      const currentColor = getParticleColor()
      materialRef.current.color.setHex(parseInt(currentColor.replace('#', '0x')))
      materialRef.current.opacity = visualSettings?.particleOpacity || 0.9
      materialRef.current.focusedIndex = focusedIndex !== null ? focusedIndex : -1.0
      materialRef.current.hoveredIndex = hoveredIndex !== null ? hoveredIndex : -1.0
      materialRef.current.time = state.clock.elapsedTime
      materialRef.current.particleSize = visualSettings?.particleSize || 0.2
      materialRef.current.glowIntensity = visualSettings?.glowIntensity || 1.0
      materialRef.current.shaderMode = visualSettings?.shaderMode || 0
    }
    }  // Close the if (pointsRef.current) block
  })
  
  const handleClick = (event: THREE.Event) => {
    event.stopPropagation()
    // Only allow clicks when not in auto-playback mode
    if (!focusedPerson && hoveredIndex !== null && hoveredIndex < data.length) {
      onParticleClick(data[hoveredIndex], hoveredIndex)
    }
  }

  return (
    <group>
      {/* Particle trails */}
      <group ref={trailsRef}>
        {/* Trail lines will be added here dynamically */}
      </group>
      
      {/* Main particles */}
      <points ref={pointsRef} onClick={handleClick} geometry={geometry}>
        <particleMaterial
          ref={materialRef}
          map={createDotTexture()}
          color={getParticleColor()}
          opacity={visualSettings?.particleOpacity || 0.9}
          focusedIndex={focusedIndex !== null ? focusedIndex : -1.0}
          hoveredIndex={hoveredIndex !== null ? hoveredIndex : -1.0}
          time={0.0}
          particleSize={visualSettings?.particleSize || 0.2}
          glowIntensity={visualSettings?.glowIntensity || 1.0}
          shaderMode={visualSettings?.shaderMode || 0}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
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
  focusedIndex
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
  }
  focusedIndex?: number | null
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
      {/* Dynamic atmospheric lighting */}
      <ambientLight intensity={visualSettings?.ambientLightIntensity || 0.2} />
      
      {/* Color temperature lighting */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={0.5} 
        color={(visualSettings?.colorTemperature || 0.5) > 0.5 ? "#ffddaa" : "#aaddff"} 
      />
      <pointLight 
        position={[10, 10, 10]} 
        intensity={0.3} 
        color={(visualSettings?.colorTemperature || 0.5) > 0.5 ? "#ffccaa" : "#ccccff"} 
      />
      <pointLight 
        position={[-10, -10, -10]} 
        intensity={0.3} 
        color={(visualSettings?.colorTemperature || 0.5) > 0.5 ? "#ffaacc" : "#aaffcc"} 
      />
      
      {/* Atmospheric fog */}
      {(visualSettings?.fogDensity || 0) > 0 && (
        <fog attach="fog" args={['#000000', 10, 50 / ((visualSettings?.fogDensity || 0.01) * 100)]} />
      )}
      
      {/* Background stars */}
      {visualSettings?.showStars && (
        <Stars radius={100} depth={50} count={1000} factor={2} saturation={0} fade />
      )}
      
      {/* Main particle field */}
      <FloatingParticles 
        data={data} 
        onParticleClick={onParticleClick}
        hoveredIndex={hoveredIndex}
        setHoveredIndex={setHoveredIndex}
        onParticlePositions={onParticlePositions}
        visualSettings={visualSettings}
        focusedIndex={focusedIndex}
      />
      
      
      {/* Central memorial light */}
      {visualSettings?.showCentralLight && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
      )}
      
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
    sphereStrength: 0.1, // Force pulling particles back to sphere surface
    sphereDistortion: 1.2, // Sphere shape distortion (1.0 = perfect sphere) - now more distorted
    sphereNoise: 0.3, // Noise-based surface distortion - increased for more irregularity
    spherePulse: 0.2, // Pulsing effect strength - subtle organic movement
    // Creative atmosphere controls - enhanced for heavenly ascension
    ambientLightIntensity: 0.3, // Slightly brighter for ethereal effect
    fogDensity: 0.01, // Subtle fog for depth and mystery
    particleTrails: true, // Enabled to showcase "breaking free" behavior
    trailLength: 25, // Longer trails for more dramatic effect
    trailCount: 75, // Fewer trails but more impactful (each represents breaking free)
    trailColor: '#e6f3ff', // Soft blue-white for heavenly appearance
    glowIntensity: 1.0, // Enhanced glow for ethereal effect
    colorTemperature: 0.7, // Warmer color temperature for heavenly atmosphere
    shaderMode: 0 // 0=default, 1=ethereal, 2=cosmic, 3=aurora
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
    setLoadingProgress('Starting data fetch...')

      try {
        console.log('SceneCanvas: Starting data fetch...')

      // Set up fallback timeout
      const fallbackTimeout = setTimeout(() => {
        console.log('⏰ 15-second timeout reached, falling back to CSV data...')
        loadCSVFallbackData()
      }, 15000)

      // First, try to load West Bank and Infrastructure data quickly for display during loading
      setLoadingProgress('Loading West Bank and Infrastructure data for preview...')
      console.log('🔄 Starting preview data loading...')

      try {
        const [westBankResponse, infrastructureResponse] = await Promise.allSettled([
          fetch('https://data.techforpalestine.org/api/v2/west_bank_daily.json'),
          fetch('https://data.techforpalestine.org/api/v3/infrastructure-damaged.json')
        ])

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

      setLoadingProgress('Processing data...')
        setData(dataResult.casualties)
        setDataInfo(dataResult)
        setError(null)
      setLoadingProgress('Complete!')
      } catch (err) {
        console.error('SceneCanvas: Error loading data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred while loading data')
      setLoadingProgress('Failed to load data')
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
        // Calculate direction from origin to particle
        const particleDistance = Math.sqrt(x * x + y * y + z * z)
        const nx = particleDistance > 0 ? x / particleDistance : 0
        const ny = particleDistance > 0 ? y / particleDistance : 0
        const nz = particleDistance > 0 ? z / particleDistance : 1
        
        // Position camera along the same direction but at a safe distance
        // Since the particle will move to 2.5 units from origin, camera should be further back
        const cameraDistance = 8 // Camera distance from origin
        const cameraPos: [number, number, number] = [
          nx * cameraDistance, 
          ny * cameraDistance, 
          nz * cameraDistance
        ]
        
        // Look at a point slightly below the particle's target position to show particle above center
        const targetDistance = 2.5 // Where the particle will be
        const lookAt: [number, number, number] = [
          nx * targetDistance, 
          ny * targetDistance - 1.0, // Look lower to show particle higher in frame
          nz * targetDistance
        ]
        
        setCameraTarget({ position: cameraPos, lookAt })
      } else {
        // Normal click behavior - zoom in close to current particle position
        const distance = 3
        const cameraPos: [number, number, number] = [x + distance, y + distance, z + distance]
        const lookAt: [number, number, number] = [x, y, z]
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
      <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_50%)] animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-60 animation-delay-300"></div>
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-70 animation-delay-700"></div>
        </div>

        <div className="relative z-10 text-center text-white max-w-6xl mx-auto p-8">
          {/* Main Loading Animation */}
          <div className="mb-12">
            <div className="relative mb-8">
              {/* Outer rotating ring */}
              <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
              {/* Inner pulsing circle */}
              <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto top-4 animate-pulse"></div>
              {/* Center dot */}
              <div className="absolute inset-0 w-2 h-2 bg-white rounded-full mx-auto top-11 animate-ping"></div>
            </div>

            <h1 className="text-4xl md:text-6xl font-light mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              Gaza Memorial
            </h1>
            <div className="text-xl md:text-2xl font-light text-gray-300 mb-2">
              Honoring Lives Lost
            </div>
            <div className="text-lg text-gray-400 font-mono">
              {loadingProgress}
            </div>
          </div>

          {/* Progress Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {/* System Status Card */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3"></div>
                <h3 className="text-lg font-medium text-white">System Status</h3>
              </div>

              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center justify-between">
                  <span>API Connection</span>
                  <span className="text-green-400">● Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Data Processing</span>
                  <span className="text-blue-400">● Loading</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Backup Systems</span>
                  <span className="text-yellow-400">● Ready</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700/50">
                <div className="text-xs text-gray-400 space-y-1">
                  <p>• Connecting to Tech for Palestine APIs</p>
                  <p>• Loading casualty records and statistics</p>
                  <p>• Processing infrastructure damage data</p>
                  <p>• Preparing memorial visualization</p>
                </div>
              </div>
            </div>

            {/* West Bank Data Card */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">West Bank Updates</h3>
                <button
                  onClick={() => setShowWestBankHistory(!showWestBankHistory)}
                  className="text-blue-400 hover:text-blue-300 text-sm underline transition-colors"
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

            {/* Infrastructure Damage Card */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Infrastructure Damage</h3>
                <button
                  onClick={() => setShowInfrastructureDetails(!showInfrastructureDetails)}
                  className="text-blue-400 hover:text-blue-300 text-sm underline transition-colors"
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
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                🔄 Reload Preview Data
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
                className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-gray-500"
                title="Skip loading screen and continue to visualization (data will load in background)"
              >
                ⏭️ Skip & Continue
              </button>
            </div>

            <div className="text-sm text-gray-400">
              <div className="mb-2">Debug Commands:</div>
              <div className="flex flex-wrap gap-2 justify-center">
                <code className="bg-gray-800/80 px-2 py-1 rounded text-xs">loadPreviewData()</code>
                <code className="bg-gray-800/80 px-2 py-1 rounded text-xs">testAPIs()</code>
                <code className="bg-gray-800/80 px-2 py-1 rounded text-xs">testCSV()</code>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <div className="text-sm text-gray-500 mb-2">
              Memorial data provided by Tech for Palestine
            </div>
            <div className="flex justify-center items-center gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Data</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>CSV Backup</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>15s Timeout</span>
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

              <p className="text-xs text-gray-400 text-center">
                <div className="mb-2">Debug commands:</div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <code className="bg-gray-800/80 px-2 py-1 rounded text-xs">loadPreviewData()</code>
                  <code className="bg-gray-800/80 px-2 py-1 rounded text-xs">loadWestBankOnly()</code>
                  <code className="bg-gray-800/80 px-2 py-1 rounded text-xs">loadInfrastructureOnly()</code>
                  <code className="bg-gray-800/80 px-2 py-1 rounded text-xs">testAPIs()</code>
                  <code className="bg-gray-800/80 px-2 py-1 rounded text-xs">testCSV()</code>
                </div>
              </p>
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
              <h1 className="text-3xl font-light tracking-wide">Memorial</h1>
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
        />
      </Canvas>

      {/* Background Loading Indicator */}
      {backgroundLoading && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700 shadow-2xl max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-400 rounded-full animate-spin"></div>
            <div>
              <div className="text-white text-sm font-medium">Loading Data...</div>
              <div className="text-gray-400 text-xs">Memorial data is loading in background</div>
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
