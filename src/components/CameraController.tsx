'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useStore } from '@/lib/store'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

interface CameraControllerProps {
  transitionSpeed?: number
}

export default function CameraController({ transitionSpeed = 1.2 }: CameraControllerProps) {
  const { camera } = useThree()
  const { cameraTarget, focusedPerson, isAutoPlaying } = useStore()
  
  const targetPosition = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())
  const currentLookAt = useRef(new THREE.Vector3())
  
  // Default camera position (overview)
  const defaultPosition = new THREE.Vector3(15, 10, 15)
  const defaultLookAt = new THREE.Vector3(0, 0, 0)
  
  useEffect(() => {
    if (cameraTarget) {
      // For continuous movement during memorial playback, position camera closer to particles
      if (isAutoPlaying) {
        // Position camera at a medium distance for continuous viewing
        const particlePos = new THREE.Vector3(...cameraTarget.lookAt)
        const offset = new THREE.Vector3(2, 1, 2)
        targetPosition.current.copy(particlePos).add(offset)
        targetLookAt.current.set(...cameraTarget.lookAt)
      } else {
        // Normal zoom behavior for manual clicks
        targetPosition.current.set(...cameraTarget.position)
        targetLookAt.current.set(...cameraTarget.lookAt)
      }
    } else {
      targetPosition.current.copy(defaultPosition)
      targetLookAt.current.copy(defaultLookAt)
    }
  }, [cameraTarget, isAutoPlaying])

  useFrame((state, delta) => {
    // Use configurable transition speed for memorial playback
    const baseSpeed = delta * transitionSpeed
    // Faster transitions during continuous memorial playback
    const lerpSpeed = isAutoPlaying ? baseSpeed * 1.5 : (focusedPerson ? baseSpeed : baseSpeed * 1.2)
    
    // Smooth camera position transition
    camera.position.lerp(targetPosition.current, lerpSpeed)
    
    // Smooth look-at transition
    currentLookAt.current.lerp(targetLookAt.current, lerpSpeed)
    camera.lookAt(currentLookAt.current)
    
    // Update camera matrix
    camera.updateMatrixWorld()
  })

  return null
}
