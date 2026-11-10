// Single source of truth for every word, date and link on the page.
// Anything marked TODO is still missing.

import { asset } from '@/lib/asset';

const TODO = '#todo';

export const links = {
  register: TODO, // TODO: registration link
  template: asset('/downloads/ACKATHON-2026-One-Pager-Template.docx'),
  buildSessions: TODO, // TODO: AI build session sign-up
  help: TODO, // TODO: help channel or contact email
};

export const brand = {
  header: asset('/brand/Logo/horizontal/White.svg'),
  ring: asset('/brand/Logo/Badge/Ring.svg'),
  icon: asset('/brand/Logo/Badge/icon.svg'),
};

// All dates are IST (+05:30).
export const dates = {
  ideaCutoff: '2026-11-25T23:59:00+05:30',
  kickoff: '2026-12-04T18:00:00+05:30', // TODO: confirm kick-off time
  finale: '2026-12-09T14:00:00+05:30', // TODO: confirm finale time
};

export const cta = 'Register now';

export const hero = {
  tagline: 'Imagination is the only limit.',
  dates: '4–9 Dec',
  meta: '2026 · ACKO Tech, HSR',
};

export const eyebrows = {
  beats: 'The brief',
  timeline: 'The timeline',
  crew: 'Anyone can build',
  onePager: 'How to register',
  prizes: 'Beyond bragging rights',
  footer: '4–9 Dec · ACKO Tech, HSR',
};

export const beats = ['Pick a real problem.', 'Build it with your crew.', 'Pitch it to the founders.'];

// The confirmed schedule, told as five stacked date cards. A star beside them gains a point
// with every card (3 → 7 points) and glows on the finale.
export const timeline = {
  heading: 'From problem to podium',
  chapters: [
    {
      day: 'Thu',
      num: '12',
      month: 'November',
      title: 'Registrations open',
      line: 'Form a crew of 3–5 and submit your one-pager.',
      rows: [
        { date: '16 Nov', label: 'Format & scoring Q&A' },
        { date: '17 & 19 Nov', label: 'AI build sessions' },
      ],
    },
    {
      day: 'Wed',
      num: '25',
      month: 'November',
      title: 'Registrations close',
      line: 'Last call for one-pagers. Every page gets read.',
    },
    {
      day: 'Mon',
      num: '30',
      month: 'November',
      title: 'Builders’ list announced',
      line: 'The shortlisted crews find out they’re in.',
    },
    {
      day: 'Fri–Tue',
      num: '4–8',
      month: 'December',
      title: 'The build',
      line: 'Kick off together, then two days to make it.',
      rows: [
        { date: '4 Dec', label: 'Kickoff & fireside' },
        { date: '7–8 Dec', label: 'Build' },
      ],
    },
    {
      num: '9',
      month: 'December',
      title: 'The finale and winners announcement',
      line: 'Demos on the stage. The founders pick the winners.',
      finale: true,
    },
  ],
} as const;

export const crew = {
  image: asset('/media/team-crew.jpg'),
  quote: 'Whoever writes the spec, be it a PM, a lawmaker, an engineer, a marketer, is now the programmer.',
  quoteBy: 'Sean Grove, OpenAI',
  quoteWhere: 'AI Engineer World’s Fair 2025',
  newbie: 'Never built anything?',
  newbieLine: 'AI build sessions on 17 & 19 Nov get you ready.',
  newbieCta: 'Join an AI build session',
};

// How to register: one page, and the template to write it in.
export const onePager = {
  heading: 'Your idea, on one page.',
  line: 'Register with one page: the problem, the idea and the bet. About 400 words and a sketch. Use our template.',
  file: {
    name: 'One-pager template',
    meta: 'DOCX · 1 page',
    thumb: asset('/downloads/one-pager-thumb.jpg'),
    cta: 'Download template',
  },
};

export const prizes = {
  heading: 'What you win',
  tiers: [
    { place: 'Winner', amount: 2.5, note: 'prize pool for the team' },
    { place: '1st runner-up', amount: 2, note: 'prize pool for the team' },
    { place: '2nd runner-up', amount: 1.5, note: 'prize pool for the team' },
  ],
  ackelerator: {
    title: 'Ackelerator program',
    line: 'Select teams take their build to production: a sponsor, a budget and a date to ship. Not a trophy and a thank-you.',
  },
  kit: {
    title: 'ACKATHON kit',
    line: 'Hoodie and swag for every participant. Pick yours up after the kickoff.',
  },
  note: '₹6 lakh across three teams, plus a real path from demo to production.',
};

export const footer = {
  closing: 'What will you build?',
  place: 'ACKO Tech building, HSR, Bengaluru',
  help: 'Questions? #ackathon', // TODO: channel or email
};
