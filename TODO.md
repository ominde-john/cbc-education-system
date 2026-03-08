# TODO - Layout Fix for Dashboard

## Task: Fix Next.js Dashboard Layout with Shadcn UI

### Issues to Fix:
1. Sidebar navigation not properly aligned with header
2. Stats cards overlapping with sidebar
3. Learning area cards not properly indented from sidebar
4. Main content needs proper padding/margin adjustments

### Expected Layout:
- Sidebar width: 280px (desktop)
- Main content: Takes remaining width with left margin of 280px
- Header: Full width with content shifting properly
- Stats cards: Grid layout with 4 columns using gap-4
- Learning areas: Properly aligned with left padding matching sidebar offset

### Implementation Steps:

- [x] 1. Fix DashboardLayout.tsx - Remove duplicate nested elements
- [x] 2. Fix DashboardLayout.tsx - Add proper left margin to main content
- [x] 3. Fix DashboardLayout.tsx - Update sidebar width to 280px
- [x] 4. Fix DashboardLayout.tsx - Ensure header alignment is correct

### Files to Edit:
- `Frontend/src/components/layout/DashboardLayout.tsx`

### Changes Made:
1. **Sidebar Width**: Changed from `w-64` (256px) to `w-[280px]` (280px)
2. **Main Content Margin**: Added `lg:ml-[280px]` when expanded and `lg:ml-16` when collapsed
3. **Removed Duplicate Elements**: Removed the duplicate nested `<main>` and `<header>` elements
4. **Fixed Header Alignment**: Header is now properly aligned and takes full width

