# ACKATHON 2026 landing page

**Beyond the Horizon.** A single scrolling page told as one dive into a black hole: the place where
imagination is the only limit.

Next.js (static export) · React Three Fiber · Framer Motion · Lenis.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/, host anywhere
```

## The page

| Section | What happens |
| --- | --- |
| Hero | Ray-traced black hole, turned 20° anticlockwise, with spiral star dust orbiting it. Hovering near it raises its exposure. |
| Three beats | "Pick a real problem. Build it in five days. Pitch it to the founders." The camera rises to look straight down. |
| From problem to podium | Gravity map: five stage cards wired to the hole by light lines that light up in order as you scroll. |
| Everyone's in | A slow push through the shadow, fading to black. |
| Your idea, on one page | The one-pager and its three flavours. |
| What wins | One segmented ring (40/35/15/10). The badge forms on scroll; star dust gathers into the icon. |
| Footer | A WebGL spiral galaxy. Hover quickens it; clicking sends a ring outward. |

From "Everyone's in" onward the page moves one full screen per scroll gesture.

## Where things live

- `content/site.ts`: every word, date and link. Items marked `TODO` are still missing
  (registration, template and Build session links, help channel, kick-off and finale times).
- `lib/universe.ts`: scroll → camera choreography for the black hole.
- `components/three/`: the black hole, star dust and footer galaxy (shaders in `*.glsl.ts`).
- `components/sections/`: one file per section.
- `components/ui/SmoothScroll.tsx`: smooth scrolling and the full-screen snapping.
- `public/brand/Logo/`: the logo files the site uses. `public/media/`: still fallbacks and the share image.

Devices without WebGL, or with reduced motion on, get a still poster instead of the live scene.

## QA the clock

Add `?now=YYYY-MM-DD` to the URL to pin the clock, e.g. `/?now=2026-11-30` (countdown switches to
kick-off) or `/?now=2026-12-06` (today is highlighted in the build week).
