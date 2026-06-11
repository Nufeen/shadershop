precision mediump float;

varying vec2 vTexCoord;

uniform vec2 uResolution;
uniform float uTime;
uniform float uBlurRadius;
uniform sampler2D uTexture;
uniform sampler2D uTraceTexture;
uniform vec2 uMouse;
uniform float uMousePressed;

vec4 sampleBlur(vec2 uv, float radius) {
  const int SAMPLES = 16;
  vec4 acc = vec4(0.0);
  for (int i = 0; i < SAMPLES; i++) {
    float t = (float(i) + 0.5) / float(SAMPLES);
    float a = t * 6.2831853 * 4.0;
    float r = radius * sqrt(t);
    vec2 off = vec2(cos(a), sin(a)) * r;
    acc += texture2D(uTexture, uv + off);
  }
  return acc / float(SAMPLES);
}

void main() {
  vec2 uv = vec2(vTexCoord.x, 1.0 - vTexCoord.y);

  float trace = texture2D(uTraceTexture, uv).r;
  float aspect = uResolution.x / uResolution.y;
  vec2 dv = uv - uMouse;
  dv.x *= aspect;
  float d = length(dv);

  float brushRadius = 0.08;
  float mask = (1.0 - smoothstep(brushRadius * 0.7, brushRadius, d)) * uMousePressed;

  vec4 base = texture2D(uTexture, uv);
  float effectiveRadius = uBlurRadius * max(trace, mask);
  vec4 blurred = sampleBlur(uv, effectiveRadius);
  gl_FragColor = mix(base, blurred, max(trace, mask));
}
