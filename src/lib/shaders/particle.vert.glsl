/**
 * @fileoverview Particle Vertex Shader - Controls particle positioning and sizing
 *
 * This vertex shader manages the visual representation of particles in 3D space.
 * It handles particle sizing, interaction states, and shader mode effects.
 *
 * Key Features:
 * - Dynamic particle sizing based on interaction state
 * - Multiple shader modes (Ethereal, Cosmic, Aurora)
 * - Distance-based size attenuation
 * - Pulsing animations for focused particles
 *
 * @author Gaza Memorial Visualization Team
 * @version 1.0.0
 */

// ============================================================================
// UNIFORM INPUTS - Values passed from JavaScript
// ============================================================================

/** Unique identifier for each particle (used for indexing) */
attribute float particleIndex;

/** Index of currently focused particle (-1 if none) */
uniform float focusedIndex;

/** Index of currently hovered particle (-1 if none) */
uniform float hoveredIndex;

/** Current time for animations (seconds since shader start) */
uniform float time;

/** Base particle size multiplier (0.1-2.0 typical range) */
uniform float particleSize;

/** Shader mode selector (0=normal, 1=ethereal, 2=cosmic, 3=aurora) */
uniform float shaderMode;

/** Filter transition start time for animation timing */
uniform float filterTransitionTime;

/** Filter animation delay for staggered effects */
attribute float filterDelay;

/** Filter visibility state (0.0 = hidden, 1.0 = visible) */
attribute float filterVisible;

/** Filter flicker intensity for transition effects */
attribute float filterFlicker;

// ============================================================================
// VARYING OUTPUTS - Values passed to fragment shader
// ============================================================================

/** Whether this particle is currently focused (0.0 or 1.0) */
varying float vFocused;

/** Whether this particle is currently hovered (0.0 or 1.0) */
varying float vHovered;

/** Pulsing animation value (0.0-1.0) for dynamic effects */
varying float vPulse;

/** Shader mode value passed to fragment shader */
varying float vShaderMode;

/** Filter animation progress (0.0-1.0) for transition effects */
varying float vFilterAnimation;

/** Filter visibility state passed to fragment shader */
varying float vFilterVisible;

/** Filter flicker intensity passed to fragment shader */
varying float vFilterFlicker;

// ============================================================================
// MAIN SHADER LOGIC
// ============================================================================

void main() {
  // Determine particle interaction states
  vFocused = (particleIndex == focusedIndex) ? 1.0 : 0.0;
  vHovered = (particleIndex == hoveredIndex) ? 1.0 : 0.0;

  // Create subtle pulsing animation for all particles
  vPulse = sin(time * 3.0) * 0.5 + 0.5;

  // Pass shader mode to fragment shader
  vShaderMode = shaderMode;

  // ==========================================================================
  // FILTER TRANSITION ANIMATION LOGIC
  // ==========================================================================

  // Calculate animation progress based on time and delay
  float timeSinceTransition = time - filterTransitionTime;
  float animationStart = filterDelay / 1000.0; // Convert ms to seconds
  float animationProgress = clamp((timeSinceTransition - animationStart) / 0.3, 0.0, 1.0); // 300ms animation

  // Pass filter animation data to fragment shader
  vFilterAnimation = animationProgress;
  vFilterVisible = filterVisible;
  vFilterFlicker = filterFlicker;

  // Transform particle position to view space
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  // ==========================================================================
  // PARTICLE SIZING LOGIC
  // ==========================================================================

  // Base size controlled by uniform - optimized for performance
  float size = particleSize * 4.0;

  // Make focused particle MASSIVE to fill the screen during memorial
  if (vFocused > 0.5) {
    size = 2000.0 + vPulse * 100.0; // Massive size for full-screen coverage
  }
  // Make hovered particle slightly larger with subtle pulsing
  else if (vHovered > 0.5) {
    size = size * 1.5 + vPulse * 0.2; // Slightly larger with subtle pulsing
  }

  // ==========================================================================
  // SHADER MODE EFFECTS - Visual style modifications
  // ==========================================================================

  if (shaderMode > 0.5) {
    if (shaderMode < 1.5) {
      // Ethereal mode - soft, glowing particles
      size *= 1.2;
    } else if (shaderMode < 2.5) {
      // Cosmic mode - distant, twinkling stars
      size *= 0.8;
    } else {
      // Aurora mode - flowing, dynamic particles
      size *= 1.1 + sin(time * 2.0 + particleIndex * 0.1) * 0.2;
    }
  }

  // ==========================================================================
  // FINAL POSITIONING & SIZE
  // ==========================================================================

  // Set point size with distance-based attenuation
  // Larger particles appear smaller when far away
  gl_PointSize = size * (300.0 / -mvPosition.z);

  // Transform to screen space
  gl_Position = projectionMatrix * mvPosition;
}
