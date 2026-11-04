// Fullscreen ray-marched black hole: bent light (Schwarzschild photon paths),
// a turbulent accretion disk with Doppler beaming, and a starfield behind.

export const quadVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const blackHoleFragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec3 uCamPos;
  uniform mat4 uCamWorld;
  uniform mat4 uProjInv;
  uniform float uFlash;
  uniform float uExposure;
  uniform vec3 uHot;
  uniform vec3 uCool;
  varying vec2 vUv;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
      f.z);
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }

  vec3 sky(vec3 d) {
    vec3 col = vec3(0.0);
    for (int i = 0; i < 2; i++) {
      float s = i == 0 ? 90.0 : 220.0;
      vec3 p = d * s;
      vec3 id = floor(p);
      vec3 f = fract(p) - 0.5;
      float h = hash(id);
      if (h > 0.982) {
        float b = smoothstep(0.12, 0.0, length(f)) * (h - 0.982) * 55.0;
        col += mix(vec3(0.75, 0.8, 1.0), vec3(1.0, 0.9, 0.8), hash(id + 3.1)) * b;
      }
    }
    float n = fbm(d * 2.2 + 4.0);
    col += uCool * pow(n, 3.5) * 0.35;
    return col;
  }

  const float DISK_IN = 2.6;
  const float DISK_OUT = 8.5;

  vec4 disk(vec3 p, vec3 rd) {
    float r = length(p.xz);
    if (r < DISK_IN || r > DISK_OUT) return vec4(0.0);
    // Keplerian spin: inner gas turns faster.
    float w = 4.0 / pow(r, 1.5);
    float a = uTime * w;
    vec2 q = mat2(cos(a), -sin(a), sin(a), cos(a)) * p.xz;
    float n = fbm(vec3(q * 1.3, r * 0.6));
    float streaks = fbm(vec3(q * 0.35, r * 3.5));
    float t = (r - DISK_IN) / (DISK_OUT - DISK_IN);
    float edge = smoothstep(0.0, 0.06, t) * smoothstep(1.0, 0.55, t);
    float dens = edge * (0.35 + 0.9 * n * streaks);
    vec3 c = mix(uHot, uCool * 1.6, smoothstep(0.05, 0.85, t));
    c *= 1.0 + 2.2 * pow(1.0 - t, 3.0);
    // Doppler beaming: the side spinning toward us is brighter.
    vec3 orbit = normalize(vec3(-p.z, 0.0, p.x));
    float dop = 1.0 + 0.75 * dot(orbit, -rd);
    c *= dop * dop;
    return vec4(c * dens * 2.2, clamp(dens * 1.4, 0.0, 1.0));
  }

  void main() {
    vec2 ndc = vUv * 2.0 - 1.0;
    vec4 v = uProjInv * vec4(ndc, 1.0, 1.0);
    v /= v.w;
    vec3 rd = normalize((uCamWorld * vec4(v.xyz, 0.0)).xyz);

    vec3 pos = uCamPos;
    vec3 vel = rd;
    vec3 h = cross(pos, vel);
    float h2 = dot(h, h);

    vec3 col = vec3(0.0);
    float alpha = 0.0;
    bool captured = false;

    for (int i = 0; i < 160; i++) {
      float r = length(pos);
      if (r < 1.0) { captured = true; break; }
      if (r > 60.0 && dot(pos, vel) > 0.0) break;
      float dt = clamp(0.09 * r, 0.04, 3.0);
      vec3 prev = pos;
      vel += -1.5 * h2 * pos / pow(r, 5.0) * dt;
      pos += vel * dt;
      if (prev.y * pos.y < 0.0) {
        vec3 p = mix(prev, pos, prev.y / (prev.y - pos.y));
        vec4 d = disk(p, normalize(vel));
        col += (1.0 - alpha) * d.rgb * d.a;
        alpha += (1.0 - alpha) * d.a;
        if (alpha > 0.98) break;
      }
    }

    if (!captured) col += (1.0 - alpha) * sky(normalize(vel));

    col = vec3(1.0) - exp(-col * uExposure);
    col = mix(col, vec3(1.0), uFlash);
    gl_FragColor = vec4(col, 1.0);
  }
`;
