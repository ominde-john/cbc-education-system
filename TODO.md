# TODO (blackboxai)

## Backend: Teachers endpoint (fix 500)
- [ ] Add dev logging + include Supabase error details in `listTeachers` responses
- [ ] Implement fallback query in `listTeachers` if complex nested joins fail
- [ ] Ensure `listTeachers` returns consistent success payload shape

## Frontend: Environment warnings (after backend is fixed)
- [ ] Add/verify `Frontend/.env` values: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- [ ] Ensure `VITE_API_URL`/proxy resolves to backend correctly in dev

