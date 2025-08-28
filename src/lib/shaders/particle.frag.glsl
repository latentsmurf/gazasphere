uniform sampler2D map;
uniform vec3 color;
uniform float opacity;
uniform float glowIntensity;
uniform float time;
uniform float shaderMode; // 0=default, 1=ethereal, 2=cosmic, 3=aurora

varying float vFocused;
varying float vHovered;
varying float vPulse;
varying float vShaderMode;

void main() {
  vec4 texColor = texture2D(map, gl_PointCoord);

  if (texColor.a < 0.1) discard;

  vec3 finalColor = color;
  float finalOpacity = opacity;

  // Enhanced shader effects based on mode
  vec2 uv = gl_PointCoord - vec2(0.5);
  float distance = length(uv);

  // Apply different shader effects based on vShaderMode
  if (vShaderMode > 0.5) {
    // Ethereal mode - soft, flowing colors
    if (vShaderMode < 1.5) {
      float flow = sin(time * 2.0 + distance * 10.0) * 0.5 + 0.5;
      finalColor = mix(color, vec3(0.8, 0.9, 1.0), flow * 0.3);
      finalOpacity *= (0.8 + flow * 0.4);
    }
    // Cosmic mode - deep space colors with twinkling
    else if (vShaderMode < 2.5) {
      float twinkle = sin(time * 3.0 + distance * 15.0) * 0.5 + 0.5;
      finalColor = mix(color, vec3(0.2, 0.4, 0.8), twinkle * 0.5);
      finalOpacity *= (0.6 + twinkle * 0.6);
    }
    // Aurora mode - northern lights effect
    else {
      float aurora = sin(time * 1.5 + uv.x * 8.0) * sin(time * 2.0 + uv.y * 6.0) * 0.5 + 0.5;
      finalColor = mix(color, vec3(0.0, 0.8, 0.4), aurora * 0.6);
      finalOpacity *= (0.7 + aurora * 0.5);
    }
  }

  // Apply red color to focused particle during name reading - full screen coverage
  if (vFocused > 0.5) {
    finalColor = vec3(0.8, 0.1, 0.1); // Deep red background color
    finalOpacity = 0.95 + vPulse * 0.05; // Nearly opaque with subtle breathing
  }
  // Apply red color to hovered particle - normal size but red
  else if (vHovered > 0.5) {
    finalColor = vec3(1.0, 0.27, 0.27); // Bright red color for hover
    finalOpacity = opacity * (1.0 + vPulse * 0.15); // Subtle pulsing

    // Enhanced glow for hovered particle
    float rim = 1.0 - smoothstep(0.4, 0.5, distance);
    finalOpacity *= (1.0 + rim * 0.3 * glowIntensity);
  }
  else {
    // Apply general glow effect to normal particles
    float rim = 1.0 - smoothstep(0.3, 0.5, distance);
    finalOpacity *= (1.0 + rim * 0.15 * glowIntensity);

    // Add subtle animation for enhanced modes
    if (vShaderMode > 0.5) {
      float animation = sin(time * 2.0 + distance * 5.0) * 0.1 + 0.9;
      finalOpacity *= animation;
    }
  }

  gl_FragColor = vec4(finalColor * texColor.rgb, texColor.a * finalOpacity);
}
