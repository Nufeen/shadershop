precision mediump float;

varying vec2 vTexCoord;

uniform vec2 uResolution;
uniform float uTime;
uniform float uBlurRadius;
uniform sampler2D uTexture;

void main() {
  vec2 uv = vec2(vTexCoord.x, 1.0 - vTexCoord.y);
  gl_FragColor = texture2D(uTexture, uv);
}
