# Classes Management Module

Professional class management system for the Education Management System. Features include class creation, learner enrollment, timetable management, and capacity tracking.

## 📁 Folder Structure

```
ClassesManagement/
├── ClassManagement.tsx          # Main component with state management
├── types.ts                      # TypeScript interfaces and types
├── constants.ts                  # Design tokens, colors, mock data
├── utils.ts                      # Utility functions for filtering and calculations
├── components/                   # Reusable sub-components
│   ├── index.ts                  # Component exports
│   ├── DashboardView.tsx         # Dashboard view component
│   ├── ListView.tsx              # List view with search/filters
│   ├── DetailView.tsx            # Detailed class information
│   ├── CreateClassDialog.tsx     # Create class modal
│   ├── DeleteClassDialog.tsx     # Delete confirmation modal
│   └── NavigationHeader.tsx      # Header with navigation
├── index.ts                      # Module exports
└── README.md                     # This file
```

## 🎯 Features

- **Dashboard View**: Overview of classes, learners, and capacity utilization
- **List View**: Searchable and filterable class list with grid layout
- **Detail View**: Comprehensive class information with tabs for:
  - Enrolled Learners (table view)
  - Weekly Timetable (day-by-day schedule)
  - Subject Assignments
- **CRUD Operations**: Create, read, update, and toggle class status
- **Responsive Design**: Mobile, tablet, and desktop optimized layouts

## 🏗️ Component Architecture

### ClassManagement.tsx
Main component handling:
- State management (view, classes, filters, dialogs)
- Event handlers (create, delete, toggle, navigate)
- Component composition and data flow

### Components

#### DashboardView.tsx
Statistics dashboard with:
- Stats grid (total, active, learners, full classes)
- Capacity utilization progress
- Branch distribution analysis
- Grade level breakdown
- Quick action buttons

#### ListView.tsx
Class listings with:
- Search functionality
- Grade level filtering
- Status filtering (active/inactive)
- Grid layout with cards
- Hover actions (view, activate/deactivate)
- Empty state handling

#### DetailView.tsx
Expanded class details featuring:
- Class identity header
- Stats cards
- Tabbed interface with learners, timetable, and subjects
- Enrollment table
- Weekly schedule display
- Subject-teacher assignments

#### CreateClassDialog.tsx
Modal form for:
- Grade level selection (required)
- Stream name input
- Capacity number input
- Form submission and cancellation

#### DeleteClassDialog.tsx
Confirmation dialog for:
- Deletion warning
- Class identification
- Confirmation and cancellation

#### NavigationHeader.tsx
Page header with:
- Dynamic title based on current view
- Breadcrumb-style description
- Navigation buttons
- Back button for detail/list views

### Types (types.ts)
```typescript
- ClassItem: Class definition with capacity, learners, teachers, branch
- TimetableSlot: Period information with teacher, room, learning area
- Learner: Student information with enrollment status
- View: Union type for 'dashboard' | 'list' | 'detail'
```

### Constants (constants.ts)
- **COLORS**: Color palette tokens
- **GRADIENTS**: Gradient definitions for UI elements
- **GRADE_LEVELS**: Available grade levels (PP1-Grade 9)
- **DAYS**: Weekdays for timetable
- **MOCK_CLASSES**: Sample class data
- **MOCK_TIMETABLE**: Sample schedule data
- **MOCK_LEARNERS**: Sample learner data

### Utils (utils.ts)
Utility functions:
- `filterClasses()`: Filter classes by multiple criteria
- `getBranches()`: Extract unique branches
- `getTotalLearners()`: Sum enrollment across classes
- `getTotalCapacity()`: Sum capacity across classes
- `getActiveClassesCount()`: Count active classes
- `getFullClassesCount()`: Count at-capacity classes
- `getUtilizationRate()`: Calculate percentage utilization

## 🎨 Design System

### Color Scheme
- **Primary**: Indigo-600 to Blue-500
- **Success**: Emerald-600 to Emerald-500
- **Warning**: Amber-600 to Amber-500
- **Danger**: Red-600 to Red-500
- **Neutral**: Gray scale

### Component Style
- Rounded corners (rounded-xl, rounded-2xl, rounded-3xl)
- Subtle shadows and borders
- Gradient backgrounds for primary actions
- Consistent spacing and sizing
- Responsive grid layouts

## 📦 Dependencies

- React 18+
- TypeScript
- shadcn/ui components (Card, Button, Input, Select, Dialog, Tabs, Table, Badge)
- lucide-react (icons)
- sonner (toast notifications)
- tailwindcss

## 🚀 Usage

### Import the Component
```typescript
import { ClassManagement } from '@/pages/ClassesManagement';

// Or import individually
import ClassManagement from '@/pages/ClassesManagement/ClassManagement';
```

### As a Page Route
```typescript
// In your router configuration
{
  path: '/classes',
  element: <ClassManagement />
}
```

## 🔄 State Flow

```
ClassManagement
├── view state (dashboard/list/detail)
├── classes (CRUD operations)
├── selected (for detail view)
├── filter states (grade, status, branch, search)
├── dialog states (create, delete)
└── form states (grade, stream, capacity)
```

## 🎓 Design Patterns

### Separation of Concerns
- Large components split into smaller, focused modules
- Types isolated for reusability
- Constants centralized for maintainability
- Utilities separated for business logic

### Component Composition
- Top-level component orchestrates data flow
- Sub-components receive props for rendering and callbacks for events
- No prop drilling through intermediate components
- Clear interface contracts via TypeScript

### Data Management
- Single source of truth in main component
- Derived state calculated efficiently
- Immutable state updates
- No external state management (local state only)

## 🧪 Extensibility

### Adding New Features
1. Add new type to `types.ts` if needed
2. Create component in `components/` folder
3. Add constants to `constants.ts`
4. Add utility functions to `utils.ts`
5. Import and integrate in `ClassManagement.tsx`

### Customizing Styles
- All tailwindcss classes are clearly visible
- Gradient definitions in `GRADIENTS` object
- Color tokens in `COLORS` object
- Sizing and spacing follow consistent patterns

### Mock Data
Replace `MOCK_CLASSES`, `MOCK_TIMETABLE`, and `MOCK_LEARNERS` with API calls to your backend service.

## 📝 Notes

- All mock data is self-contained and easily replaceable
- Responsive design works on all screen sizes
- Toast notifications provide user feedback for all actions
- Empty states handled for better UX
- Validation included for critical operations
