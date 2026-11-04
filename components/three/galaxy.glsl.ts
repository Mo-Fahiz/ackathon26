// A tilted spiral galaxy. Stars orbit with a flat rotation curve (inner stars sweep round faster),
// while the spiral arms are a fixed density pattern: stars brighten as they stream through an arm
// and dim between arms, with a dark dust lane hugging each arm's inner edge.

export const galaxyVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uArms;
  uniform float uTwist;
  uniform float uArmStrength;
  uniform float uDust;
  uniform float uThickness;
  uniform float uStarSize;
  uniform float uPixelRatio;
  uniform float uBoost;
  uniform vec2 uMouse;
  uniform float uRipple;
  uniform vec3 uArmColor;
  uniform vec3 uCoreColor;

  attribute float aR;
  attribute float aTheta;
  attribute float aY;
  attribute float aSeed;

  varying vec3 vColor;
  varying float vAlpha;

  const float TAU = 6.2831853;

  void main() {
    float r = aR;
    // Flat rotation curve: constant speed, so angular speed falls off as 1/r.
    float omega = uSpeed * 0.32 / (r + 0.12);
    float th = aTheta + omega * uTime;

    vec3 p = vec3(cos(th) * r, aY * uThickness * (1.0 + 6.0 * exp(-r * 9.0)), sin(th) * r);

    // Position relative to the arm pattern at this radius.
    float armAngle = uTwist * log(r + 0.02);
    float phase = (th - armAngle) * uArms / TAU;
    float arm = pow(0.5 + 0.5 * cos(phase * TAU), 4.0);
    float lane = pow(0.5 + 0.5 * cos((phase + 0.16) * TAU), 18.0);
    // armStrength 0.5 leaves inter-arm stars at ~15% so the spiral reads clearly.
    float density = mix(1.0 - min(0.9, uArmStrength * 1.7), 1.0, arm) * (1.0 - uDust * 0.8 * lane);

    float core = exp(-r * r * 60.0);
    vec3 col = mix(uArmColor, uCoreColor, smoothstep(0.38, 0.02, r));
    col = mix(col, vec3(1.0), core * 0.7);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Far side of the disc dims a little; stars near the pointer and on the ripple glow.
    float depth = clamp(1.0 + (mv.z + 6.0) * 0.4, 0.55, 1.15);
    vec2 ndc = gl_Position.xy / gl_Position.w;
    float near = smoothstep(0.22, 0.0, length(ndc - uMouse));
    float ring = uRipple > 0.0 ? exp(-pow((r - uRipple) * 18.0, 2.0)) * (1.0 - uRipple) : 0.0;

    float twinkle = 0.75 + 0.25 * sin(uTime * (1.2 + aSeed * 4.0) + aSeed * 50.0);
    float sparkle = step(0.965, aSeed);

    vColor = col;
    // Many stars add up, so each is faint; the core is kept from blowing out.
    vAlpha = 0.62 * density * depth * twinkle * (0.5 + 0.5 * aSeed) * (1.0 + uBoost * 0.35 + near * 1.2 + ring * 2.5) * (1.0 - core * 0.55);
    gl_PointSize = uStarSize * uPixelRatio * (0.5 + aSeed * 0.5 + sparkle * 1.4) * (0.75 + arm * 0.5) * (1.0 + ring) * (6.0 / -mv.z);
  }
`;

export const galaxyFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;
