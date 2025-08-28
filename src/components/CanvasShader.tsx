/**
 * CanvasShader - Full-canvas shader effects inspired by Shadertoy
 * 
 * Provides various full-screen shader effects that can be overlaid on the entire canvas
 * for enhanced visual atmosphere and creative effects.
 */

import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface CanvasShaderProps {
  /** Shader effect mode (0=none, 1=plasma, 2=noise, 3=waves, 4=aurora) */
  mode: number
  /** Effect intensity (0.0 to 1.0) */
  intensity: number
  /** Color temperature effect (-1.0 to 1.0) */
  colorTemperature: number
}

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float time;
  uniform vec2 resolution;
  uniform float mode;
  uniform float intensity;
  uniform float colorTemperature;
  
  varying vec2 vUv;
  
  // Noise function
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  // Smooth noise
  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  // Plasma effect
  vec3 plasma(vec2 uv) {
    float t = time * 0.5;
    float x = uv.x * 8.0;
    float y = uv.y * 8.0;
    
    float v = sin(x + t);
    v += sin(y + t);
    v += sin((x + y) + t);
    v += sin(sqrt(x * x + y * y) + t);
    v *= 0.25;
    
    vec3 col = vec3(
      sin(v * 3.14159),
      sin(v * 3.14159 + 2.0),
      sin(v * 3.14159 + 4.0)
    );
    
    return col * 0.5 + 0.5;
  }
  
  // Noise waves
  vec3 noiseWaves(vec2 uv) {
    float t = time * 0.3;
    vec2 p = uv * 4.0;
    
    float n1 = smoothNoise(p + vec2(t, 0.0));
    float n2 = smoothNoise(p * 2.0 + vec2(0.0, t));
    float n3 = smoothNoise(p * 4.0 + vec2(t * 0.5, t * 0.3));
    
    float combined = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
    
    return vec3(combined * 0.8, combined * 0.9, combined);
  }
  
  // Water waves
  vec3 waterWaves(vec2 uv) {
    float t = time * 0.8;
    vec2 p = uv * 6.0;
    
    float wave1 = sin(p.x * 2.0 + t) * 0.5;
    float wave2 = sin(p.y * 3.0 + t * 1.2) * 0.3;
    float wave3 = sin((p.x + p.y) * 1.5 + t * 0.8) * 0.4;
    
    float combined = (wave1 + wave2 + wave3) * 0.5 + 0.5;
    
    return vec3(0.1, 0.3 + combined * 0.4, 0.6 + combined * 0.3);
  }
  
  // Aurora effect
  vec3 aurora(vec2 uv) {
    float t = time * 0.4;
    vec2 p = uv * 3.0;
    
    float aurora1 = sin(p.x * 2.0 + t) * sin(p.y * 1.5 + t * 0.7);
    float aurora2 = cos(p.x * 1.8 + t * 1.3) * cos(p.y * 2.2 + t * 0.9);
    
    aurora1 = smoothstep(-0.2, 0.8, aurora1);
    aurora2 = smoothstep(-0.3, 0.7, aurora2);
    
    vec3 color1 = vec3(0.0, 0.8, 0.4) * aurora1;
    vec3 color2 = vec3(0.6, 0.0, 0.8) * aurora2;
    
    return color1 + color2;
  }
  
  // Color temperature adjustment
  vec3 adjustColorTemperature(vec3 color, float temperature) {
    // Warm (positive) vs Cool (negative) temperature
    if (temperature > 0.0) {
      // Warm: increase red/yellow, decrease blue
      color.r += temperature * 0.3;
      color.g += temperature * 0.1;
      color.b -= temperature * 0.2;
    } else {
      // Cool: increase blue, decrease red/yellow
      color.r += temperature * 0.2;
      color.g += temperature * 0.1;
      color.b -= temperature * 0.3;
    }
    
    return clamp(color, 0.0, 1.0);
  }
  
  void main() {
    vec2 uv = vUv;
    vec3 color = vec3(0.0);
    
    if (mode < 0.5) {
      // No effect
      color = vec3(0.0);
    } else if (mode < 1.5) {
      // Plasma effect
      color = plasma(uv);
    } else if (mode < 2.5) {
      // Noise waves
      color = noiseWaves(uv);
    } else if (mode < 3.5) {
      // Water waves
      color = waterWaves(uv);
    } else {
      // Aurora effect
      color = aurora(uv);
    }
    
    // Apply color temperature
    color = adjustColorTemperature(color, colorTemperature);
    
    // Apply intensity and blend mode
    color *= intensity;
    
    gl_FragColor = vec4(color, intensity * 0.3);
  }
`

export default function CanvasShader({ mode, intensity, colorTemperature }: CanvasShaderProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const { size } = useThree()
  
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(size.width, size.height) },
    mode: { value: mode },
    intensity: { value: intensity },
    colorTemperature: { value: colorTemperature }
  }), [mode, intensity, colorTemperature, size.width, size.height])
  
  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.time.value = state.clock.elapsedTime
      material.uniforms.mode.value = mode
      material.uniforms.intensity.value = intensity
      material.uniforms.colorTemperature.value = colorTemperature
    }
  })
  
  // Only render if there's an effect active
  if (mode === 0 && intensity === 0) {
    return null
  }
  
  return (
    <mesh ref={meshRef} position={[0, 0, -100]} scale={[200, 200, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

