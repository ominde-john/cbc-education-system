# StaffManagement Refactoring TODO

## Files Created:
- [x] types.ts - StaffMember interface and Props
- [x] constants.ts - All constants (T, STATUS_CFG, DESIGNATIONS, etc.)
- [x] helpers.ts - Helper functions
- [x] styles.ts - Style objects and CSS
- [x] components/index.tsx - All small UI components
- [x] index.tsx - Main component (refactored to use view components)
- [x] StaffManagement.tsx - Updated entry point (re-exports)

## Progress: 7/7 ✅

## View Components Created (Step 2):
- [x] components/DashboardView.tsx - Dashboard with stats and quick actions
- [x] components/ListView.tsx - Staff list with filters and cards
- [x] components/FormView.tsx - Add/Edit form with 3 tabs
- [x] components/DetailsView.tsx - Staff profile details view
- [x] components/index.tsx - Updated with view component exports
- [x] index.tsx - Refactored to use view components

## Final File Structure:
```
Frontend/src/pages/teacher/StaffManagement/
├── TODO.md
├── types.ts                 # StaffMember interface and Props
├── constants.ts             # All constants (T, STATUS_CFG, DESIGNATIONS, etc.)
├── helpers.ts               # Helper functions (fmt, initials, avatarBg)
├── styles.ts                # Style objects and GLOBAL_CSS
├── components/
│   ├── TODO.md              # Component-specific TODO
│   ├── index.tsx            # Small UI components + exports
│   ├── DashboardView.tsx    # Dashboard view component
│   ├── ListView.tsx         # Staff list view component
│   ├── FormView.tsx         # Add/Edit form view component
│   └── DetailsView.tsx      # Staff details view component
├── index.tsx                # Main component (uses view components)
└── StaffManagement.tsx      # Re-exports from the new module (entry point)
```

## Notes:
- The page looks exactly the same as before
- All imports are properly configured
- No breaking changes to the existing API
- Main index.tsx is now ~80 lines (down from ~450 lines)
- View logic is now separated into dedicated components
