// Scroll → camera choreography for the black hole, shared by the WebGL scene and the HTML overlays
// so labels stay in sync even when WebGL is off.

export type Shot = {
  dist: number; // camera distance from the hole
  elev: number; // camera elevation above the disk, radians (≈1.4 = looking straight down)
  flash: number; // 0..1 white-out
  shiftX: number; // where the hole sits on screen, as a share of width (+ = right)
  shiftY: number; // share of height (+ = up)
  roll?: number; // on-screen rotation, radians (+ = anticlockwise)
};

type Key = Required<Shot> & { y: number };

let keys: Key[] = [];
// Portrait screens see less of the scene sideways, so the camera stands further back.
let zoom = 1;

function top(id: string): number | null {
  const el = document.getElementById(id);
  return el ? el.getBoundingClientRect().top + window.scrollY : null;
}

function bottom(id: string): number | null {
  const el = document.getElementById(id);
  return el ? el.getBoundingClientRect().bottom + window.scrollY : null;
}

const FACE_ON = 1.38;

// Where the hole sits during the gravity map, as a share of screen height above centre.
// The section's HTML reads this too, so its light lines land on the hole.
export const holeLift = (narrow: boolean) => (narrow ? 0.2 : 0.06);

// The stage currently lit in the gravity map; written by the section, read by the scene.
export const stage = { focus: 0 };

// Rebuild keyframes from section positions. Call on load and resize.
export function measure() {
  const vh = window.innerHeight;
  const narrow = window.innerWidth < 760;
  zoom = narrow ? 2.1 : 1;
  const k: Key[] = [];
  // Distances inside the hole (< 2) are not scaled: that's where everything goes black.
  const add = (y: number | null, s: Shot) =>
    y !== null && k.push({ y, roll: 0, ...s, dist: s.dist < 2 ? s.dist : s.dist * zoom });

  // First sight: edge-on, the classic lensed silhouette.
  // Resting state is turned 20° anticlockwise; it straightens out as the camera rises.
  add(0, { dist: narrow ? 17 : 26, elev: 0.075, flash: 0, shiftX: 0, shiftY: 0.2, roll: (20 * Math.PI) / 180 });
  // Over the three beats the camera rises until it looks straight down the throat.
  add(top('beats'), { dist: 40, elev: 0.3, flash: 0, shiftX: 0, shiftY: 0 });
  const d0 = top('descent');
  const d1 = bottom('descent');
  if (d0 !== null && d1 !== null) {
    // The gravity map: the hole holds the centre while every stage feeds into it,
    // with a slow push-in across the five stages.
    const sy = holeLift(narrow);
    add(d0, { dist: narrow ? 42 : 78, elev: FACE_ON, flash: 0, shiftX: 0, shiftY: sy });
    add(d1 - vh, { dist: narrow ? 24 : 44, elev: FACE_ON, flash: 0, shiftX: 0, shiftY: sy });
  }
  const h0 = top('horizon');
  if (h0 !== null) {
    // Then the dive: a long, steady push through the shadow while the section fades to black.
    add(h0, { dist: narrow ? 24 : 44, elev: FACE_ON, flash: 0, shiftX: 0, shiftY: holeLift(narrow) });
    add(h0 + vh * 1.5, { dist: 3, elev: FACE_ON, flash: 0, shiftX: 0, shiftY: 0 });
    add(h0 + vh * 2, { dist: 0.9, elev: FACE_ON, flash: 0, shiftX: 0, shiftY: 0 });
  }
  keys = k.sort((a, b) => a.y - b.y);
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

export function shotAt(y: number): Required<Shot> {
  if (!keys.length) return { dist: 26, elev: 0.075, flash: 0, shiftX: 0, shiftY: 0.2, roll: (20 * Math.PI) / 180 };
  if (y <= keys[0].y) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (y <= b.y) {
      const raw = b.y === a.y ? 1 : (y - a.y) / (b.y - a.y);
      // The face-on dolly runs in log space, so every orbit gets an equal share of the scroll.
      const dolly = a.elev === FACE_ON && b.elev === FACE_ON;
      const t = dolly ? raw : smooth(raw);
      return {
        dist: dolly ? Math.exp(lerp(Math.log(a.dist), Math.log(b.dist), t)) : lerp(a.dist, b.dist, t),
        elev: lerp(a.elev, b.elev, t),
        flash: lerp(a.flash, b.flash, t),
        shiftX: lerp(a.shiftX, b.shiftX, t),
        shiftY: lerp(a.shiftY, b.shiftY, t),
        roll: lerp(a.roll, b.roll, t),
      };
    }
  }
  return keys[keys.length - 1];
}

// The WebGL scene runs from the hero to the horizon; past that, sections and the footer video take over.
export function sceneVisible(y: number): boolean {
  const a = top('one-pager');
  return a === null || y < a;
}
