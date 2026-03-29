# Fix StaffManagement 404 Error (Vite HMR missing styles.ts)

## Steps:
- [x] 1. Fix import in `src/pages/teacher/StaffManagement/components/index.tsx` ( "./styles" -> "../styles")
- [x] 2. Fix imports in `src/pages/teacher/StaffManagement/components/ListView.tsx` ( "./styles" -> "./index"; add Users icon; cleanup)
- [ ] 3. Restart Vite dev server (`cd Frontend && npm run dev`)
- [ ] 4. Verify no 404 in browser console
- [ ] 5. Test StaffManagement page loads correctly

## Additional Fix
- [x] 6. Fix DashboardView.tsx import "../helpers" → "./index"
