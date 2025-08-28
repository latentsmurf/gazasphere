/**
 * @fileoverview Particle Fragment Shader - Controls particle coloring and visual effects
 *
 * This fragment shader determines the final appearance of each particle, including
 * color blending, opacity effects, glow, and special shader modes. It handles
 * the visual feedback for user interactions and creates atmospheric effects.
 *
 * Key Features:
 * - Multi-mode shader effects (Ethereal, Cosmic, Aurora)
 * - Dynamic color blending and opacity control
 * - Interactive feedback (focused/hovered states)
 * - Rim lighting and glow effects
 * - Distance-based visual attenuation
 *
 * @author Gaza Memorial Visualization Team
 * @version 1.0.0
 */

// ============================================================================
// UNIFORM INPUTS - Values passed from JavaScript
// ============================================================================

/** Particle texture sampler (circular dot texture) */
uniform sampler2D map;

/** Base particle color (RGB values 0.0-1.0) */
uniform vec3 color;

/** Base particle opacity (0.0 = transparent, 1.0 = opaque) */
uniform float opacity;

/** Intensity of glow effect (0.0 = no glow, 2.0 = strong glow) */
uniform float glowIntensity;

/** Current time for animations (seconds since shader start) */
uniform float time;

/** Shader mode selector (0=default, 1=ethereal, 2=cosmic, 3=aurora) */
uniform float shaderMode;

// ============================================================================
// VARYING INPUTS - Values passed from vertex shader
// ============================================================================

/** Whether this particle is currently focused (0.0 or 1.0) */
varying float vFocused;

/** Whether this particle is currently hovered (0.0 or 1.0) */
varying float vHovered;

/** Pulsing animation value (0.0-1.0) for dynamic effects */
varying float vPulse;

/** Shader mode value from vertex shader */
varying float vShaderMode;

/** Filter animation progress (0.0-1.0) for transition effects */
varying float vFilterAnimation;

/** Filter visibility state from vertex shader */
varying float vFilterVisible;

/** Filter flicker intensity from vertex shader */
varying float vFilterFlicker;

// ============================================================================
// MAIN SHADER LOGIC
// ============================================================================

void main() {
  // Sample the particle texture (circular dot)
  vec4 texColor = texture2D(map, gl_PointCoord);

  // Discard transparent pixels for performance
  if (texColor.a < 0.1) discard;

  // Initialize final color and opacity
  vec3 finalColor = color;
  float finalOpacity = opacity;

  // ==========================================================================
  // TEXTURE COORDINATES & DISTANCE CALCULATION
  // ==========================================================================

  // Convert texture coordinates to centered UV space (-0.5 to 0.5)
  vec2 uv = gl_PointCoord - vec2(0.5);
  // Calculate distance from center (0.0 = center, 0.5 = edge)
  float distance = length(uv);

  // ==========================================================================
  // SHADER MODE EFFECTS - Creative and atmospheric visual styles
  // ==========================================================================

  if (vShaderMode > 0.5) {
    // Ethereal mode - soft, flowing colors like mist with rainbow shifts
    if (vShaderMode < 1.5) {
      float flow = sin(time * 2.0 + distance * 10.0) * 0.5 + 0.5;
      float rainbow = sin(time * 0.8 + distance * 20.0) * 0.5 + 0.5;
      vec3 etherealColor = mix(vec3(0.8, 0.9, 1.0), vec3(1.0, 0.8, 0.9), rainbow);
      finalColor = mix(color, etherealColor, flow * 0.4);
      finalOpacity *= (0.8 + flow * 0.4);
      
      // Add sparkle effect
      float sparkle = step(0.95, sin(time * 10.0 + distance * 50.0));
      finalOpacity += sparkle * 0.3;
    }
    // Cosmic mode - deep space with nebula colors and stellar effects
    else if (vShaderMode < 2.5) {
      float twinkle = sin(time * 3.0 + distance * 15.0) * 0.5 + 0.5;
      float nebula = sin(time * 1.2 + uv.x * 12.0) * cos(time * 0.9 + uv.y * 8.0) * 0.5 + 0.5;
      vec3 cosmicColor = mix(vec3(0.2, 0.1, 0.8), vec3(0.8, 0.2, 0.6), nebula);
      finalColor = mix(color, cosmicColor, twinkle * 0.6);
      finalOpacity *= (0.6 + twinkle * 0.6);
      
      // Add stellar burst effect
      float burst = pow(1.0 - distance * 2.0, 3.0) * sin(time * 8.0) * 0.5 + 0.5;
      finalColor += vec3(burst * 0.3, burst * 0.1, burst * 0.5);
    }
    // Aurora mode - northern lights with dynamic color waves
    else if (vShaderMode < 3.5) {
      float aurora1 = sin(time * 1.5 + uv.x * 8.0) * sin(time * 2.0 + uv.y * 6.0) * 0.5 + 0.5;
      float aurora2 = cos(time * 1.8 + uv.y * 10.0) * sin(time * 1.3 + uv.x * 7.0) * 0.5 + 0.5;
      vec3 auroraColor1 = vec3(0.0, 0.8, 0.4);
      vec3 auroraColor2 = vec3(0.6, 0.0, 0.8);
      finalColor = mix(color, mix(auroraColor1, auroraColor2, aurora2), aurora1 * 0.7);
      finalOpacity *= (0.7 + aurora1 * 0.5);
      
      // Add wave effect
      float wave = sin(time * 4.0 + distance * 25.0) * 0.2 + 0.8;
      finalOpacity *= wave;
    }
    // Plasma mode - energetic plasma effects with electric colors
    else {
      float plasma1 = sin(time * 4.0 + uv.x * 20.0 + uv.y * 15.0) * 0.5 + 0.5;
      float plasma2 = cos(time * 3.5 + uv.x * 18.0 - uv.y * 12.0) * 0.5 + 0.5;
      float electric = plasma1 * plasma2;
      vec3 plasmaColor = vec3(electric, electric * 0.3 + 0.7, 1.0 - electric * 0.5);
      finalColor = mix(color, plasmaColor, electric * 0.8);
      finalOpacity *= (0.5 + electric * 0.7);
      
      // Add electric arc effect
      float arc = step(0.9, sin(time * 15.0 + distance * 100.0));
      finalColor += vec3(arc * 0.5, arc * 0.8, arc);
    }
  }

  // ==========================================================================
  // INTERACTION STATES - Visual feedback for user interaction
  // ==========================================================================

  // Apply special effects to focused particle (during memorial narration)
  if (vFocused > 0.5) {
    finalColor = vec3(0.8, 0.1, 0.1); // Deep red background color
    finalOpacity = 0.95 + vPulse * 0.05; // Nearly opaque with subtle breathing
  }
  // Apply effects to hovered particle (for user interaction feedback)
  else if (vHovered > 0.5) {
    finalColor = vec3(1.0, 0.27, 0.27); // Bright red color for hover
    finalOpacity = opacity * (1.0 + vPulse * 0.15); // Subtle pulsing

    // Enhanced rim glow for hovered particle
    float rim = 1.0 - smoothstep(0.4, 0.5, distance);
    finalOpacity *= (1.0 + rim * 0.3 * glowIntensity);
  }
  else {
    // ==========================================================================
    // DEFAULT PARTICLE EFFECTS - Normal state particles
    // ==========================================================================

    // Apply general rim lighting glow effect
    float rim = 1.0 - smoothstep(0.3, 0.5, distance);
    finalOpacity *= (1.0 + rim * 0.15 * glowIntensity);

    // Add subtle animation for enhanced shader modes
    if (vShaderMode > 0.5) {
      float animation = sin(time * 2.0 + distance * 5.0) * 0.1 + 0.9;
      finalOpacity *= animation;
    }
  }

  // ==========================================================================
  // FILTER TRANSITION EFFECTS - Visual feedback for filter changes
  // ==========================================================================

  // Apply filter transition effects if animation is active
  if (vFilterAnimation < 1.0) {
    // Create flicker effect during transition
    float flickerTime = time * 15.0 + distance * 50.0; // Fast flicker
    float flicker = sin(flickerTime) * 0.5 + 0.5;
    
    // Intensity based on transition progress and flicker setting
    float flickerIntensity = (1.0 - vFilterAnimation) * vFilterFlicker;
    
    if (vFilterVisible > 0.5) {
      // Particle is becoming visible - fade in with flicker
      float fadeIn = vFilterAnimation;
      finalOpacity *= fadeIn + flicker * flickerIntensity * 0.3;
      
      // Add bright flash effect for newly visible particles
      if (vFilterFlicker > 0.8) {
        finalColor += vec3(0.3, 0.6, 1.0) * flicker * flickerIntensity;
      }
    } else {
      // Particle is becoming hidden - fade out with flicker
      float fadeOut = 1.0 - vFilterAnimation;
      finalOpacity *= fadeOut + flicker * flickerIntensity * 0.2;
      
      // Add red flash effect for disappearing particles
      if (vFilterFlicker > 0.8) {
        finalColor += vec3(1.0, 0.3, 0.1) * flicker * flickerIntensity;
      }
    }
  } else {
    // Animation complete - apply final visibility state
    if (vFilterVisible < 0.5) {
      finalOpacity *= 0.15; // Dim filtered-out particles instead of hiding completely
      finalColor *= 0.4; // Desaturate filtered-out particles
    }
  }

  // ==========================================================================
  // FINAL OUTPUT - Combine texture with computed color and opacity
  // ==========================================================================

  // Multiply particle color by texture color and apply final opacity
  gl_FragColor = vec4(finalColor * texColor.rgb, texColor.a * finalOpacity);
}
