// On GitHub Pages the site is served from a subpath (/ackathon26), so files in public/
// need that prefix. Next rewrites its own bundles via basePath, but not paths we write
// by hand in <img src> or metadata, so those go through asset().
// Empty locally, which keeps `npm run dev` served from the root.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const asset = (path: string) => `${BASE_PATH}${path}`;
