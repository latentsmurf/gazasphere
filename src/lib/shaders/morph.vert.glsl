uniform float uMorph; 
uniform float uHovered;

in vec3 posCloud;
in vec3 posPlane;

attribute float aIndex;

void main(){
  vec3 p = mix(posCloud, posPlane, uMorph);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  
  float size = 32.0;
  if (aIndex == uHovered) {
    size = 48.0;
  }
  gl_PointSize = size;
}
