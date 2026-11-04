'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { measure, sceneVisible, shotAt } from '@/lib/universe';
import { blackHoleFragment, quadVertex } from './blackhole.glsl';
import { dustFragment, dustVertex } from './dust.glsl';

const pointer = new THREE.Vector2(9, 9); // NDC; 9 = pointer off the page
const ZERO = new THREE.Vector2();
const narrowScreen = () => typeof window !== 'undefined' && window.innerWidth < 760;

// Shared per-frame state, written by the camera rig and read by the scene pieces.
// `glow` is the hover boost: 0 normally, rising toward 1 as the pointer nears the hole in the hero.
const state = { flash: 0, elev: 0, glow: 0 };

const copyFragment = /* glsl */ `
  uniform sampler2D tMap;
  varying vec2 vUv;
  void main() { gl_FragColor = texture2D(tMap, vUv); }
`;

// The ray-marched hole is the only expensive pixel work, so it renders into its own buffer at an
// adaptive fraction of screen resolution and is smoothly upscaled behind the full-resolution scene.
function BlackHole() {
  const { camera, gl, size } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCamPos: { value: new THREE.Vector3() },
      uCamWorld: { value: new THREE.Matrix4() },
      uProjInv: { value: new THREE.Matrix4() },
      uFlash: { value: 0 },
      uExposure: { value: 1.25 },
      uHot: { value: new THREE.Color('#fff1dc') },
      uCool: { value: new THREE.Color('#4e29bb') },
    }),
    [],
  );

  const { target, hole, ortho } = useMemo(() => {
    const target = new THREE.WebGLRenderTarget(2, 2, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
    });
    const hole = new THREE.Scene();
    hole.add(
      new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({ vertexShader: quadVertex, fragmentShader: blackHoleFragment, uniforms, depthTest: false, depthWrite: false }),
      ),
    );
    return { target, hole, ortho: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1) };
  }, [uniforms]);

  useEffect(() => () => target.dispose(), [target]);

  const maxQ = narrowScreen() ? 0.5 : 0.65;
  const quality = useRef(maxQ);
  const frame = useRef({ avg: 1 / 60, cooldown: 0 });

  useFrame((s, dt) => {
    uniforms.uTime.value += dt;
    uniforms.uCamPos.value.copy(camera.position);
    uniforms.uCamWorld.value.copy(camera.matrixWorld);
    uniforms.uProjInv.value.copy(camera.projectionMatrixInverse);
    uniforms.uFlash.value = state.flash;
    // Face-on, the disk reads as quieter smoke; hovering the hole in the hero turns it up.
    uniforms.uExposure.value = (1.25 - 0.5 * Math.min(1, state.elev / 1.38)) * (1 + 0.9 * state.glow);

    // Trade resolution for frame rate on slower GPUs, and win it back when there's headroom.
    const f = frame.current;
    f.avg += (Math.min(dt, 0.1) - f.avg) * 0.1;
    f.cooldown -= dt;
    if (f.cooldown <= 0) {
      if (f.avg > 1 / 40 && quality.current > 0.3) quality.current -= 0.05;
      else if (f.avg < 1 / 57 && quality.current < maxQ) quality.current += 0.025;
      f.cooldown = 0.5;
    }
    const pr = gl.getPixelRatio();
    const w = Math.max(2, Math.round(size.width * pr * quality.current));
    const h = Math.max(2, Math.round(size.height * pr * quality.current));
    if (target.width !== w || target.height !== h) target.setSize(w, h);

    gl.setRenderTarget(target);
    gl.render(hole, ortho);
    gl.setRenderTarget(null);
    gl.render(s.scene, s.camera);
  }, 1);

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={quadVertex}
        fragmentShader={copyFragment}
        uniforms={{ tMap: { value: target.texture } }}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

// Tens of thousands of grains orbiting the hole through a spiral-arm pattern; positions are
// computed on the GPU from each grain's radius, starting angle and the clock.
function Dust() {
  const count = narrowScreen() ? 15000 : 40000;
  const geometry = useMemo(() => {
    const r = new Float32Array(count);
    const th = new Float32Array(count);
    const y = new Float32Array(count);
    const seed = new Float32Array(count);
    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
    for (let i = 0; i < count; i++) {
      r[i] = Math.min(48, 3 + -Math.log(1 - Math.random() * 0.97) * 9);
      th[i] = Math.random() * Math.PI * 2;
      // Thin disc with a sparse puffier halo; height is a share of radius.
      y[i] = gauss() * (Math.random() < 0.1 ? 0.18 : 0.025);
      seed[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute('aR', new THREE.BufferAttribute(r, 1));
    g.setAttribute('aTheta', new THREE.BufferAttribute(th, 1));
    g.setAttribute('aY', new THREE.BufferAttribute(y, 1));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    return g;
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 }, uBoost: { value: 0 } }), []);
  const { gl } = useThree();

  useFrame((_, dt) => {
    uniforms.uTime.value += Math.min(dt, 0.05);
    uniforms.uPixelRatio.value = gl.getPixelRatio();
    uniforms.uBoost.value = state.glow;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={dustVertex}
        fragmentShader={dustFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Rig() {
  const { camera, size } = useThree();
  const cur = useRef(shotAt(0));
  const tilt = useRef(new THREE.Vector2());

  useFrame((_, dt) => {
    const target = shotAt(window.scrollY);
    const c = cur.current;
    // Time-based damping so the camera settles at the same pace on slow and fast devices.
    const k = 1 - Math.exp(-Math.min(dt, 0.5) * 5);
    c.dist += (target.dist - c.dist) * k;
    c.elev += (target.elev - c.elev) * k;
    c.flash += (target.flash - c.flash) * Math.min(1, k * 1.8);
    c.shiftX += (target.shiftX - c.shiftX) * k;
    c.shiftY += (target.shiftY - c.shiftY) * k;
    c.roll += (target.roll - c.roll) * k;
    const inHero = window.scrollY < window.innerHeight * 0.8;
    const onPage = Math.abs(pointer.x) <= 1 && Math.abs(pointer.y) <= 1;
    tilt.current.lerp(inHero && onPage ? pointer : ZERO, 1 - Math.exp(-Math.min(dt, 0.5) * 2.5));

    const az = -Math.PI / 2 + tilt.current.x * 0.12;
    const el = c.elev + tilt.current.y * 0.05;
    camera.position.set(
      Math.cos(el) * Math.cos(az) * c.dist,
      Math.sin(el) * c.dist,
      Math.cos(el) * Math.sin(az) * c.dist,
    );
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);
    // Rolling the camera clockwise turns the scene anticlockwise on screen.
    camera.rotateZ(-c.roll);
    const cam = camera as THREE.PerspectiveCamera;
    cam.setViewOffset(size.width, size.height, -c.shiftX * size.width, c.shiftY * size.height, size.width, size.height);
    camera.updateMatrixWorld();

    // Hover glow: the closer the pointer to the hole on screen (hero only), the brighter it burns.
    const hx = c.shiftX * 2;
    const hy = c.shiftY * 2;
    const near = inHero ? Math.max(0, 1 - Math.hypot(pointer.x - hx, (pointer.y - hy) * (size.height / size.width)) / 0.45) : 0;
    state.glow += (near - state.glow) * (1 - Math.exp(-Math.min(dt, 0.5) * 4));
    state.flash = c.flash;
    state.elev = c.elev;
  });

  return null;
}

function Scene() {
  return (
    <>
      <BlackHole />
      {/* Depth-only stand-in for the shadow, so dust behind the hole is hidden. */}
      <mesh renderOrder={0}>
        <sphereGeometry args={[2.6, 48, 48]} />
        <meshBasicMaterial colorWrite={false} />
      </mesh>
      <Dust />
      <Rig />
    </>
  );
}

export default function Universe() {
  const [visible, setVisible] = useState(true);
  const [narrow] = useState(narrowScreen);

  useEffect(() => {
    const remeasure = () => measure();
    // Sections may change height as fonts and images load.
    remeasure();
    const t = window.setTimeout(remeasure, 800);
    window.addEventListener('resize', remeasure);
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);
    const onScroll = () => setVisible(sceneVisible(window.scrollY));
    const onMove = (e: PointerEvent) => pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    const onLeave = () => pointer.set(9, 9);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', remeasure);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      ro.disconnect();
    };
  }, []);

  return (
    // Near-monochrome universe with a breath of colour left in it.
    <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', filter: 'saturate(0.45)' }}>
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={narrow ? [1, 1.5] : [1, 2]}
        camera={{ fov: 42, near: 0.1, far: 500, position: [0, 8, -44] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
