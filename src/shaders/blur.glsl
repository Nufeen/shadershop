precision mediump float;

varying vec2 vTexCoord;

uniform vec2 uResolution;
uniform float uTime;
uniform float uBlurRadius;

void main() {
  vec2 uv = vTexCoord;
  uv.x *= uResolution.x / uResolution.y;
  gl_FragColor = vec4(uv, 1.0, 1.0);
}
