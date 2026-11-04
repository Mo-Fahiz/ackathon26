// Star dust around the hole, in the same style as the footer galaxy: grains orbit with a
// flattening rotation curve (inner ones sweep round faster) and brighten as they stream
// through a fixed spiral-arm pattern, with a dark lane on each arm's inner edge.

export const dustVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uBoost;

  attribute float aR;
  attribute float aTheta;
  attribute float aY;
  attribute float aSeed;

  varying float vAlpha;
  varying float vHeat;

  const float TAU = 6.2831853;
  const float ARMS = 2.0;
  const float TWIST = 3.2;

  void main() {
    float r = aR;
    float omega = 5.0 / pow(r, 1.2);
    float th = aTheta + omega * uTime;
    vec3 p = vec3(cos(th) * r, aY * r, sin(th) * r);

    float phase = (th - TWIST * log(r / 3.0)) * ARMS / TAU;
    float arm = pow(0.5 + 0.5 * cos(phase * TAU), 3.0);
    float lane = pow(0.5 + 0.5 * cos((phase + 0.15) * TAU), 16.0);
    float density = mix(0.22, 1.0, arm) * (1.0 - 0.7 * lane);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Fade in from the rim and out at the inner edge where the ray-traced disk takes over.
    float edge = smoothstep(48.0, 36.0, r) * smoothstep(2.8, 4.5, r);
    float twinkle = 0.7 + 0.3 * sin(uTime * (1.4 + aSeed * 3.0) + aSeed * 40.0);
    vHeat = smoothstep(16.0, 3.5, r);
    vAlpha = edge * density * twinkle * (0.3 + 0.7 * aSeed) * (1.0 + uBoost * 0.5);
    float sparkle = step(0.97, aSeed);
    gl_PointSize = (0.7 + aSeed * 1.1 + sparkle * 1.6) * (0.8 + arm * 0.5) * uPixelRatio * clamp(22.0 / -mv.z, 0.5, 3.0);
  }
`;

export const dustFragment = /* glsl */ `
  varying float vAlpha;
  varying float vHeat;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    vec3 col = mix(vec3(0.72, 0.68, 0.95), vec3(1.0, 0.92, 0.82), vHeat);
    gl_FragColor = vec4(col, a * vAlpha * 0.8);
  }
`;
