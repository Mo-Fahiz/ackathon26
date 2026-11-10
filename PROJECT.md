# ACKATHON 2026 landing page: project context

> **This is the handover file.** If you start a new chat, ask Claude to read this file first.
> It's updated after every round of changes, so it always shows the current state.
> Last updated: 10 Nov 2026 (round 4)

## The event
- **ACKATHON 2026** is ACKO's internal hackathon, running **4–9 Dec 2026** at the ACKO Tech building in HSR, Bengaluru.
- Tagline: **"Imagination is the only limit."**
- Any ACKO employee can take part, in teams of 3–5. Teams register an idea by submitting a **one-pager**.
- The site launches on **12 Nov**, so there's no "registration not open yet" state. **Register now** is the CTA everywhere.
- Owner: Mohammed Fahiz (mohammed.fahiz@acko.tech).

## Where it lives
- **Live site:** https://mo-fahiz.github.io/ackathon26/
- **Repo:** https://github.com/Mo-Fahiz/ackathon26 (**public**). Pushes go over SSH with the key at `~/.ssh/id_ed25519`.
- **Deploy:** `.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`, in about a minute.
- The site is served from the `/ackathon26` subpath. The workflow sets `NEXT_PUBLIC_BASE_PATH`, and every hand-written path to a file in `public/` must go through `asset()` from `lib/asset.ts`. Locally the base path is empty.
- Vercel was tried and failed. The error was never shared.

## Stack
- Next.js 16 (App Router, `output: 'export'`, static), React 19, Framer Motion, Lenis (smooth scroll), React Three Fiber and Three.js.
- Font: **Instrument Sans**. Keep it; the user explicitly wanted this original choice.
- Commands: `npm run dev` · `npm run build` (output goes to `out/`).

## Concept: "Beyond the Horizon"
The whole page is one dive into an Interstellar-inspired black hole. Past the event horizon the rules stop, which is where imagination has no limit.

| # | Section | File | What it is |
|---|---|---|---|
| 1 | Hero | `sections/Hero.tsx` | A ray-marched black hole shader, tilted 20° anticlockwise, with rotating star dust (no planets); hovering raises its exposure. The tagline sits above a big **"4–9 DEC"** lockup with a purple glow. The countdown is unchanged, but its "Idea cutoff" label line was removed. |
| 2 | Beats | `sections/Beats.tsx` | Eyebrow "The brief". Three lines in turn: Pick a real problem → Build it with your crew → Pitch it to the founders. |
| 3 | Timeline | `sections/Descent.tsx`, `ui/MorphStar.tsx` | Eyebrow "The timeline". **Stacked date cards**: a date tile (weekday, big number, month) plus title, line and bullets. The card in focus has a purple border and gradient number; passed cards tuck in behind and fade. Beside them, **one star gains a point per card (3 → 7)**, drawn in code in the style of the user's `public/media/Star 1–5.svg`. On 9 Dec it becomes a glowing violet star, and the finale card glows too. No background images.
| 4 | Quote ("Anyone can build") | `sections/Horizon.tsx` | The team photo `team-crew.jpg` sits at 10%, and the cursor's light reveals it at 80%. Sean Grove's quote is set large. The newbie container has a secondary CTA, "Join an AI build session". The "Everyone's in" heading was removed. |
| 5 | One-pager | `sections/OnePager.tsx` | Only the eyebrow, title, subtitle and a download card (thumbnail plus the DOCX template). |
| 6 | What you win | `sections/Prizes.tsx` | Three tiers: ₹2.5L (winner, purple glow with the rotating Ring.svg behind it), ₹2L and ₹1.5L, which count up. Then the Ackelerator program (purple card), the ACKATHON kit, and the ₹6 lakh footnote. |
| 7 | Footer | `sections/Footer.tsx` | Eyebrow "4–9 Dec · ACKO Tech, HSR". The procedural Milky Way **galaxy dust** (`three/Galaxy.tsx`, keep it), "What will you build?" and Register now. |

**Global UI:**
- The header **Register now** is secondary (outlined) while the hero is on screen, and becomes primary (white) once you scroll past the hero.
- A minimal purple scroll progress line runs down the right edge (`ui/ScrollProgress.tsx`), hidden on mobile.
- Each section has a small `.eyebrow` above its heading. The text for each is in `eyebrows` in `content/site.ts`.

## Confirmed schedule (source of truth)
| Date | Event |
|---|---|
| 12 Nov | Registrations open |
| 16 Nov | Format & scoring Q&A |
| 17 & 19 Nov | AI build sessions |
| 25 Nov | Registrations close |
| 30 Nov | Builders' list announced |
| 4 Dec | Kickoff & fireside |
| 7–8 Dec | Build sprint |
| 9 Dec | Finale & winners |

The timeline shows these as 5 cards: 12 Nov (with 16 Nov and 17 & 19 Nov as bullets) · 25 Nov · 30 Nov · 4–8 Dec (with 4 Dec Kickoff & fireside and 7–8 Dec Build as bullets) · 9 Dec "The finale and winners announcement". The old "10 Nov Problems land" stage was dropped.

## Prizes
₹2.5L winner · ₹2L 1st runner-up · ₹1.5L 2nd runner-up (each a prize pool for the team). The Ackelerator program takes select teams to production. The ACKATHON kit (hoodie and swag) goes to everyone. ₹6 lakh in total.

Every word, date and link is in **`content/site.ts`**.

## Visual system
- Background `#030306`, white `#f5f4fa`, grey `#9a98a8`. **Accent purple `#6841E6`** (it replaced the old green), with `#9a82f4` for small accent text.
- **Primary CTA:** pure white with a purple glow and faint sparks on hover; no magnify effect. **Secondary CTA:** `.btn-secondary`, outlined, turns purple on hover.
- No stage counters like "01/05".
- A star-dust overlay runs the whole length of the page (`ui/StarDust.tsx`).
- It's inspired by Interstellar and blackholeexperience.com, and orizon.one for the timeline, but never names or copies them.
- The timeline must have no background images (the Magnific plates were tried and rejected on 10 Nov).
- Physics matters to the user: nothing orbits without reason, and orbits follow Kepler (inner orbits are faster).

## Decisions and preferences (from the user)
- Keep it crisp: few levels of hierarchy, little to read.
- **Eyebrows ARE wanted** on every section (reversed from the original brief). A minimal right-edge scroll progress line is wanted too.
- The countdown timer must not change.
- The quote uses a real attribution (Sean Grove, OpenAI); no invented quotes.
- **No scroll snapping or scroll lock.** It was tried and removed on 5 Nov because it didn't feel seamless. The sections after "Everyone's in" are still each 100vh.
- No heavy videos. Both black-hole videos were removed, and everything visual is procedural WebGL.
- The paid React Bits "Binary Orbits" component isn't licensed, so the galaxy is custom-built.
- **`resources/` (the leadership deck, content draft and one-pager guide) stays git-ignored and must never be pushed**, because the repo is public.
- Git identity is set repo-locally to the user's email.
- Magnific (MCP) is available for generating images and video, in project "ACKATHON 2026 – Beyond the Horizon".

## Assets
- Logos: `public/brand/Logo/` (horizontal White in the header; Badge Ring.svg and icon.svg in Scoring).
- `public/media/team-crew.jpg` is compressed from `team 1.png` (2000px, about 140 KB). The original PNGs (`team.png`, `team 1.png`) aren't used.
- `public/media/Star 1–5.svg` are the user's reference stars (3, 4, 5, 6 and 7 points, the last glowing). The timeline draws its own morphing star in the same colours, so these files aren't loaded by the page.
- `public/downloads/ACKATHON-2026-One-Pager-Template.docx` is generated by `scripts/make-template.py` (needs `python-docx`). `one-pager-thumb.jpg` is a Quick Look render of it.

## Open items
- Placeholder links (`#todo`) in `content/site.ts`: **register**, **buildSessions** (AI build session sign-up) and **help**. The template link is real.
- "Teams of 3–5" now appears only in the 12 Nov timeline chapter.
- The kick-off time (6 pm, 4 Dec) and finale time (2 pm, 9 Dec) are guesses marked `TODO: confirm`.
- Not yet tested on a real device or at a real frame rate. The preview pane throttles rendering.

## Change log
- **4 Nov:** Built the site and the concept; iterated on the black hole, the gravity map, the scoring ring and the galaxy footer; switched the accent to purple; added scroll snapping; cleaned the repo; pushed it; went live on GitHub Pages.
- **5 Nov:** Removed scroll snapping/lock. Redesigned the one-pager section (page anatomy, example toggle, downloadable DOCX template with a thumbnail). Added the team photo cursor reveal to "Everyone's in", and moved the Build session prompt into a container with a secondary CTA. Added this file.
- **5 Nov (round 3):** Copy pass. Hero "4–9 DEC" lockup. Header CTA goes secondary → primary. Scroll progress line. Eyebrows restored. Timeline rebuilt as 5 cinematic chapters on the confirmed schedule, with Magnific plates. Quote section (Sean Grove) replaces "Everyone's in". One-pager slimmed to a title plus the download card. "What you win" prizes replace the scoring ring (`Scoring.tsx` and `DustIcon.tsx` deleted).
- **10 Nov (round 4):** Timeline rebuilt as stacked date cards with a morphing star (3 → 7 points, glowing on the finale). Background images removed. Copy updated for 12 Nov, 4–8 Dec and 9 Dec.
