'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { galaxyFragment, galaxyVertex } from './galaxy.glsl';

type Props = {
  stars?: number;
  arms?: number;
  twist?: number;
  armStrength?: number;
  dust?: number;
  thickness?: number;
  starSize?: number;
  tilt?: number; // degrees, 0 = face-on
  roll?: number; // degrees
  centerY?: number; // 0 top … 1 bottom
  scale?: number;
  colors?: [string, string]; // arms, core
};

const input = { mouse: new THREE.Vector2(9, 9), hover: false, ripple: -1 };

function glowTexture(inner: string, outer: string) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, inner);
  grd.addColorStop(0.25, outer);
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function Stars({ stars, arms, twist, armStrength, dust, thickness, starSize, tilt, roll, centerY, scale, colors }: Required<Props>) {
  const { gl, viewport } = useThree();

  const geometry = useMemo(() => {
    const r = new Float32Array(stars);
    const th = new Float32Array(stars);
    const y = new Float32Array(stars);
    const seed = new Float32Array(stars);
    const gauss = () => (Math.random() + Math.random() + Math.random() + Math.random() - 2) / 2;
    for (let i = 0; i < stars; i++) {
      if (Math.random() < 0.07) {
        // Bulge: a tight, puffy ball of old stars.
        r[i] = Math.abs(gauss()) * 0.1 + 0.005;
        y[i] = gauss() * 2.2;
      } else {
        // Disc: exponential fall-off with radius.
        r[i] = Math.min(1, -Math.log(1 - Math.random() * 0.9) * 0.46 + 0.03);
        y[i] = gauss();
      }
      th[i] = Math.random() * Math.PI * 2;
      seed[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    // Positions are computed in the shader; this attribute only sets the draw count and bounds.
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(stars * 3), 3));
    g.setAttribute('aR', new THREE.BufferAttribute(r, 1));
    g.setAttribute('aTheta', new THREE.BufferAttribute(th, 1));
    g.setAttribute('aY', new THREE.BufferAttribute(y, 1));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    return g;
  }, [stars]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: 1 },
      uArms: { value: arms },
      uTwist: { value: twist },
      uArmStrength: { value: armStrength },
      uDust: { value: dust },
      uThickness: { value: thickness },
      uStarSize: { value: starSize },
      uPixelRatio: { value: 1 },
      uBoost: { value: 0 },
      uMouse: { value: new THREE.Vector2(9, 9) },
      uRipple: { value: -1 },
      uArmColor: { value: new THREE.Color(colors[0]) },
      uCoreColor: { value: new THREE.Color(colors[1]) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const core = useMemo(() => glowTexture('rgba(255,244,232,0.9)', 'rgba(255,214,236,0.18)'), []);
  const haze = useMemo(() => glowTexture('rgba(143,124,247,0.55)', 'rgba(123,92,240,0.12)'), []);
  const group = useRef<THREE.Group>(null);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const u = uniforms;
    u.uBoost.value += ((input.hover ? 1 : 0) - u.uBoost.value) * (1 - Math.exp(-dt * 3));
    // Hovering quickens the spin a little.
    u.uTime.value += dt * (1 + u.uBoost.value * 0.5);
    u.uPixelRatio.value = gl.getPixelRatio();
    u.uMouse.value.lerp(input.mouse, 1 - Math.exp(-dt * 8));
    if (input.ripple >= 0) {
      input.ripple += dt * 0.45;
      if (input.ripple > 1) input.ripple = -1;
    }
    u.uRipple.value = input.ripple;
  });

  const deg = Math.PI / 180;
  const lift = (0.5 - centerY) * viewport.height;
  const s = scale * Math.min(viewport.width * 0.62, viewport.height * 1.15);

  return (
    // The disc lies in the XZ plane (edge-on to the camera), so tilt 0 = face-on means a 90° turn about X.
    <group ref={group} position={[0, lift, 0]} rotation={[(90 - tilt) * deg, 0, roll * deg]} scale={s}>
      <sprite scale={[2.4, 2.4, 1]}>
        <spriteMaterial map={haze} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.35} />
      </sprite>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          vertexShader={galaxyVertex}
          fragmentShader={galaxyFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <sprite scale={[0.3, 0.3, 1]}>
        <spriteMaterial map={core} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
}

// A tilted spiral galaxy of stars streaming through its arms. Hover quickens and brightens it;
// clicking sends a ring of light out through the disc. Renders only while on screen.
export default function Galaxy(props: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setNarrow(window.innerWidth < 760);
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = wrap.current!;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '200px 0px' });
    io.observe(el);
    // Listen on the section so the copy and button above the canvas don't block the pointer.
    const host = el.parentElement ?? el;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      input.mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      input.hover = true;
    };
    const leave = () => {
      input.hover = false;
      input.mouse.set(9, 9);
    };
    const click = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a,button')) return;
      input.ripple = 0.02;
    };
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerleave', leave);
    host.addEventListener('click', click);
    return () => {
      io.disconnect();
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
      host.removeEventListener('click', click);
    };
  }, []);

  const p: Required<Props> = {
    stars: narrow ? 30000 : 90000,
    arms: 3,
    twist: 3.5,
    armStrength: 0.5,
    dust: 0.5,
    thickness: 0.02,
    starSize: 1.7,
    tilt: 62,
    roll: -8,
    centerY: 0.42,
    scale: 1,
    colors: ['#8f7cf7', '#ffd9ea'],
    ...props,
  };

  return (
    <div ref={wrap} aria-hidden style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        frameloop={visible && !reduced ? 'always' : 'demand'}
        dpr={narrow ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0, 6], fov: 40 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <Stars {...p} />
      </Canvas>
    </div>
  );
}
