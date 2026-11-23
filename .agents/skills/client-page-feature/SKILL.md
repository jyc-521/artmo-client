---
name: client-page-feature
description: >
  Add or update ARTMO React pages, HashRouter routes, React Query hooks, and
  Axios API service methods, including the emotion input, result card, and
  share flow. Use when adding pages, forms, or Express API integrations.
  Do not use for standalone CSS tweaks, copy edits, or design token changes.
compatibility: Requires Node.js 24+ and npm
---

# Client Page & API Feature

1. Check the route, guard and response shape in `references/routes-and-api.md`. Confirm the endpoint's role in `docs/PRD.md` 5-3.
2. For a new API module, adapt `assets/service-template.ts`: `publicApi` for public reads, `authApi` for signed-in calls.
3. Register the route inside `<HashRouter>` in `src/App.tsx` and keep the `/auth/callback` check before the router.
4. From the repository root, run `node .agents/skills/client-page-feature/scripts/check-client-safety.mjs`.
5. Run `npm run typecheck` and `npm exec -- eslint <changed-files>`. Run `npm run build` when routes or Vite config change. Report which checks ran.
