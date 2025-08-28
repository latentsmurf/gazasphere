attribute float particleIndex;
uniform float focusedIndex;
uniform float hoveredIndex;
uniform float time;
uniform float particleSize;
uniform float shaderMode;

varying float vFocused;
varying float vHovered;
varying float vPulse;
varying float vShaderMode;

void main() {
  vFocused = (particleIndex == focusedIndex) ? 1.0 : 0.0;
  vHovered = (particleIndex == hoveredIndex) ? 1.0 : 0.0;
  vPulse = sin(time * 3.0) * 0.5 + 0.5;
  vShaderMode = shaderMode;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  // Base size controlled by uniform - much smaller
  float size = particleSize * 4.0; // Reduced from 10.0 to 4.0

  // Make focused particle HUGE to fill the screen
  if (vFocused > 0.5) {
    size = 2000.0 + vPulse * 100.0; // Massive size for full-screen coverage
  }
  // Make hovered particle slightly larger but normal size
  else if (vHovered > 0.5) {
    size = size * 1.5 + vPulse * 0.2; // Slightly larger with subtle pulsing
  }

  // Adjust size based on shader mode for more dramatic effects
  if (shaderMode > 0.5) {
    if (shaderMode < 1.5) {
      // Ethereal mode - slightly larger particles
      size *= 1.2;
    } else if (shaderMode < 2.5) {
      // Cosmic mode - smaller, distant stars
      size *= 0.8;
    } else {
      // Aurora mode - flowing particles
      size *= 1.1 + sin(time * 2.0 + particleIndex * 0.1) * 0.2;
    }
  }

  gl_PointSize = size * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
