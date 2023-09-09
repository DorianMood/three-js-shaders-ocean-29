uniform float uTime;
uniform float uBigWaveElevation;
uniform vec2 uBigWaveFrequency;
uniform float uBigWaveSpeed;


void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevation =
    sin(modelPosition.z * uBigWaveFrequency.y + uTime * uBigWaveSpeed) *
    sin(modelPosition.x * uBigWaveFrequency.x + uTime * uBigWaveSpeed) *
    uBigWaveElevation;
  modelPosition.y += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}
