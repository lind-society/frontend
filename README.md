# Lind Society — Admin Dashboard

Back office for the team: villas, properties for sale, activities, owners,
bookings, reviews, blog posts and the inquiries guests send from the website.

Built with React 19, Vite, React Router, TanStack Query and Tailwind CSS 4.

## Getting started

```bash
cp .env.example .env     # point VITE_BASE_API_URL at the backend
pnpm install
pnpm dev                 # http://localhost:4781
```

The first admin account does not exist on a fresh database; create it from the
backend folder: `pnpm admin:create --email you@example.com --password Secret123`.

| Script           | What it does                        |
| ---------------- | ----------------------------------- |
| `pnpm dev`       | Dev server with hot reload          |
| `pnpm build`     | Type-check and build to `dist/`     |
| `pnpm preview`   | Serve the production build          |
| `pnpm lint`      | ESLint                              |
| `pnpm typecheck` | TypeScript                          |
| `pnpm format`    | Prettier (`format:check` to verify) |

## Environment

| Variable                  | Description                                           |
| ------------------------- | ----------------------------------------------------- |
| `VITE_BASE_API_URL`       | Backend API base, e.g. `http://localhost:4782/api/v1` |
| `VITE_SECONDARY_API_URL`  | Fallback API base (same value is fine)                |
| `VITE_GOOGLE_MAP_API_URL` | Google Maps key, optional                             |

`VITE_*` values are inlined at build time, so changing one needs a rebuild.

## Pages

Dashboard sections live under `src/pages/dashboard`. **Inquiries** is the inbox
for the website's contact, villa, property and early-bird forms; **Blog
Management** writes the articles shown on the journal.
