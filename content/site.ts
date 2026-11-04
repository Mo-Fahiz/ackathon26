// Single source of truth for every word, date and link on the page.
// Anything marked TODO is still missing.

const TODO = '#todo';

export const links = {
  register: TODO, // TODO: registration link
  template: TODO, // TODO: one-pager template link
  buildSessions: TODO, // TODO: Build session sign-up
  help: TODO, // TODO: help channel or contact email
};

export const brand = {
  header: '/brand/Logo/horizontal/White.svg',
  ring: '/brand/Logo/Badge/Ring.svg',
  icon: '/brand/Logo/Badge/icon.svg',
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
  meta: '4–9 Dec · ACKO Tech, HSR',
};

export const beats = ['Pick a real problem.', 'Build it in five days.', 'Pitch it to the founders.'];

// Outermost orbit first; the camera falls inward through them.
export const orbits = [
  { date: '10 Nov', title: 'Problems land', line: 'Leaders post real problems, each with a metric to move.' },
  { date: '12 Nov', title: 'Crew up', line: 'Form a team of 3–5 and submit your one-pager.' },
  { date: '25 Nov', title: 'Shortlist', line: 'Every page is read. The best ideas go to build.' },
  { date: '4–9 Dec', title: 'Build orbit', line: 'Five days to build. Then a 10-minute pitch.', week: true },
  { date: '9 Dec', title: 'Finale', line: 'Varun, Vish and Nitin pick the winners.' },
];

export const week = [
  { day: 4, label: 'Kick-off' },
  { day: 5, label: 'Build' },
  { day: 6, label: 'Build' },
  { day: 7, label: 'Build' },
  { day: 8, label: 'Build' },
  { day: 9, label: 'Finale' },
];

export const crew = {
  heading: "Everyone's in.",
  line: 'Any ACKO employee. Teams of 3–5.',
  newbie: 'Never built anything? Join a Build session',
};

export const onePager = {
  heading: 'Your idea, on one page.',
  line: '400 words. One sketch. Only the page counts.',
  parts: ['The problem', 'The idea', 'The bet'],
  flavours: [
    { id: 'grounded', name: 'Grounded', line: "Shippable with today's data." },
    { id: 'stretch', name: 'Stretch', line: 'Needs a partner or new data.' },
    { id: 'wild', name: 'Wild', line: 'A bold bet. A quarter of places are reserved.' },
  ],
  template: 'Get the template',
};

export const scoring = {
  heading: 'What wins',
  criteria: [
    { weight: 40, name: 'Live demo' },
    { weight: 35, name: 'Value' },
    { weight: 15, name: 'Novelty' },
    { weight: 10, name: 'Presentation' },
  ],
};

export const footer = {
  closing: 'What will you build?',
  place: 'ACKO Tech building, HSR, Bengaluru',
  help: 'Questions? #ackathon', // TODO: channel or email
};
