'use client'

import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Casualty } from '@/lib/dataLoader'
import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { useStore } from '@/lib/store'

// @ts-ignore
import vertexShader from '@/lib/shaders/morph.vert.glsl'
// @ts-ignore
import fragmentShader from '@/lib/shaders/glyph_sdf.frag.glsl'

const GlyphMaterial = shaderMaterial(
  { uMorph: 0.0, uHovered: -1.0 },
  vertexShader,
  fragmentShader
)

extend({ GlyphMaterial })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      glyphMaterial: any
    }
  }
}


interface GlyphFieldProps {
  data: Casualty[]
}

export default function GlyphField({ data }: GlyphFieldProps) {
  const { mode, setHovered, setSelected } = useStore()
  const materialRef = useRef<any>(null)
  const pointsRef = useRef<THREE.Points>(null!)
  const { raycaster, camera, mouse } = useThree()
  const [lastHovered, setLastHovered] = useState<number | null>(null)

  useFrame(() => {
    if (materialRef.current) {
      const targetMorph = mode === 'plane' ? 1.0 : 0.0
      materialRef.current.uMorph +=
        (targetMorph - materialRef.current.uMorph) * 0.1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObject(pointsRef.current)

      if (intersects.length > 0) {
        const index = intersects[0].index
        if (index !== undefined) {
          if (lastHovered !== index) {
            setHovered(data[index].id)
            materialRef.current.uHovered = index
            setLastHovered(index)
          }
        }
      } else {
        if (lastHovered !== null) {
          setHovered(null)
          materialRef.current.uHovered = -1.0
          setLastHovered(null)
        }
      }
    }
  })

  const { positions, planePositions, indices } = useMemo(() => {
    const pos = new Float32Array(data.length * 3)
    const planePos = new Float32Array(data.length * 3)
    const idx = new Float32Array(data.length)

    for (let i = 0; i < data.length; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10

      planePos[i * 3 + 0] = (i % 100) * 0.1 - 5
      planePos[i * 3 + 1] = Math.floor(i / 100) * 0.1 - 5
      planePos[i * 3 + 2] = 0
      
      idx[i] = i
    }
    return { positions: pos, planePositions: planePos, indices: idx }
  }, [data])

  return (
    <points 
      ref={pointsRef}
      onClick={() => {
        if (lastHovered !== null) {
          setSelected(data[lastHovered].id)
        }
      }}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-posCloud"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-posPlane"
          args={[planePositions, 3]}
          count={planePositions.length / 3}
          array={planePositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aIndex"
          args={[indices, 1]}
          count={indices.length}
          array={indices}
          itemSize={1}
        />
      </bufferGeometry>
      {/* @ts-ignore */}
      <glyphMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
      />
    </points>
  )
}
