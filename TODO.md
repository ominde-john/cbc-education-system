# TODO - Investigate/Prevent Render Deployment Failure (Frontend API routing)

- [ ] Reproduce the failing behaviour (confirm which endpoint fails from Reset Password page).
- [x] Fix inconsistent API base URL selection across:
  - [x] `Frontend/src/lib/auth.ts` (Reset Password relies on this)
  - [ ] `Frontend/src/contexts/AuthContext.tsx`
  - [ ] API helpers in `Frontend/src/lib/api/*`

- [ ] Choose a single, correct production API base strategy for Vercel frontend + Render backend.
- [ ] Set up env usage expectations (`VITE_API_URL` preferred) and ensure `/api` rewrite assumptions are removed.
- [x] Build frontend locally (`Frontend npm run build`) to ensure compilation passes.
- [ ] Deploy and verify Reset Password works end-to-end.


