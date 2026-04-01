# UI/UX Design & Wireframes

## Design Philosophy

### Core Principles
1. **Simplicity First:** Clean, uncluttered interfaces that focus on learning
2. **Consistency:** Uniform design patterns across all pages
3. **Accessibility:** Readable fonts, sufficient contrast, responsive design
4. **User-Centric:** Intuitive navigation and clear call-to-actions
5. **Visual Hierarchy:** Important elements stand out through size and color

---

## Color Palette

### Primary Colors
```css
--primary-blue: #3498db      /* Primary actions, links, active states */
--primary-dark: #2c3e50      /* Headers, important text */
--primary-light: #ecf0f1     /* Backgrounds */
```

### Secondary Colors
```css
--success-green: #27ae60     /* Progress indicators, success messages */
--warning-orange: #e67e22    /* Alerts, pending states */
--danger-red: #e74c3c        /* Errors, deletion warnings */
--accent-purple: #9b59b6     /* Highlights, badges */
```

### Neutral Colors
```css
--text-primary: #2c3e50      /* Main text */
--text-secondary: #7f8c8d    /* Secondary text, descriptions */
--background: #ffffff        /* Main background */
--border: #bdc3c7            /* Borders, dividers */
--shadow: rgba(0,0,0,0.1)    /* Box shadows */
```

### Semantic Colors
```css
--beginner: #27ae60          /* Beginner level courses */
--intermediate: #f39c12      /* Intermediate level courses */
--advanced: #e74c3c          /* Advanced level courses */
```

---

## Typography

### Font Families
```css
--font-primary: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
--font-heading: 'Segoe UI Semibold', sans-serif;
--font-mono: 'Courier New', monospace;
```

### Font Sizes
```css
--text-xs: 0.75rem    /* 12px - Captions, metadata */
--text-sm: 0.875rem   /* 14px - Secondary text */
--text-base: 1rem     /* 16px - Body text */
--text-lg: 1.125rem   /* 18px - Subheadings */
--text-xl: 1.5rem     /* 24px - Headings */
--text-2xl: 2rem      /* 32px - Page titles */
--text-3xl: 2.5rem    /* 40px - Hero text */
```

### Font Weights
```css
--weight-normal: 400
--weight-medium: 500
--weight-semibold: 600
--weight-bold: 700
```

---

## Layout & Spacing

### Spacing Scale (8px base unit)
```css
--space-1: 0.5rem    /* 8px */
--space-2: 1rem      /* 16px */
--space-3: 1.5rem    /* 24px */
--space-4: 2rem      /* 32px */
--space-6: 3rem      /* 48px */
--space-8: 4rem      /* 64px */
```

### Breakpoints (Responsive Design)
```css
/* Mobile First Approach */
--mobile: 320px      /* Small phones */
--tablet: 768px      /* Tablets */
--desktop: 1024px    /* Desktops */
--wide: 1440px       /* Large screens */
```

---

## UI Components Library

### Buttons

#### Primary Button
```
┌─────────────────────────┐
│   ► ENROLL NOW          │  Blue background (#3498db)
└─────────────────────────┘  White text, rounded corners
                             Hover: Darker blue (#2980b9)
```

#### Secondary Button
```
┌─────────────────────────┐
│     View Details        │  White background
└─────────────────────────┘  Blue border & text
                             Hover: Light blue background
```

#### Danger Button
```
┌─────────────────────────┐
│   ✕ Delete Course       │  Red background (#e74c3c)
└─────────────────────────┘  White text
                             Hover: Darker red
```

### Cards

#### Course Card
```
┌───────────────────────────────────┐
│  ╔════════════════════════════╗  │
│  ║    COURSE IMAGE            ║  │
│  ║    (16:9 ratio)            ║  │
│  ╚════════════════════════════╝  │
│                                   │
│  React.js Complete Course        │  ← Title (bold, large)
│  Master React from basics...     │  ← Description (truncated)
│                                   │
│  🏷 Web Development  ⏱ 8 weeks  │  ← Metadata
│  📊 Intermediate                  │  ← Level badge
│                                   │
│  ┌──────────────────────────┐   │
│  │    View Course Details    │   │  ← CTA Button
│  └──────────────────────────┘   │
└───────────────────────────────────┘
   
Shadow: 0 2px 8px rgba(0,0,0,0.1)
Border-radius: 8px
Hover: Lift effect (translateY(-4px))
```

#### Progress Card
```
┌───────────────────────────────────┐
│  Python Programming               │  ← Course title
│  ────────────────────────────────  │
│                                   │
│  Progress: 65%                    │
│  ████████████████░░░░░░░░░       │  ← Progress bar
│                                   │
│  📚 13/20 Modules completed       │
│  🕐 Last accessed: 2 hours ago    │
│                                   │
│  [Continue Learning →]            │  ← Primary button
└───────────────────────────────────┘
```

### Navigation Bar
```
┌─────────────────────────────────────────────────────────────────┐
│  🎓 EDSL Platform     [Dashboard] [Courses] [My Learning]      │
│                                                   [Profile ▼]   │
└─────────────────────────────────────────────────────────────────┘
Fixed position, white background, shadow on scroll
Height: 60px, Padding: 0 32px
```

### Sidebar (Dashboard)
```
┌──────────────────┐
│  ≡ MENU          │  ← Toggle on mobile
├──────────────────┤
│  📊 Dashboard    │  ← Active (blue background)
│  📚 Courses      │
│  ✅ My Progress  │
│  👤 Profile      │
│  🏆 Certificates │
├──────────────────┤
│  [Logout]        │
└──────────────────┘

Width: 240px (desktop), Slide-in (mobile)
Background: #f8f9fa
```

### Form Inputs
```
Label: Email Address          ← Label (bold, small)
┌─────────────────────────┐
│ john@example.com        │   ← Input field
└─────────────────────────┘
                            
Border: 1px solid #bdc3c7
Focus: Blue border (2px), box-shadow
Height: 40px, Padding: 8px 12px
Border-radius: 4px
```

### Badge Components
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ ● Beginner   │  │ ● Intermediate│  │ ● Advanced   │
└──────────────┘  └──────────────┘  └──────────────┘
   Green              Orange            Red

Small, rounded pill shape
Font-size: 12px, Padding: 4px 12px
```

---

## Page Wireframes

### 1. Landing Page

```
═══════════════════════════════════════════════════════════
                    NAVIGATION BAR
───────────────────────────────────────────────────────────

                 ┌──────────────────────┐
     HERO        │                      │
    SECTION      │   Welcome to EDSL    │
                 │   Platform!          │
                 │                      │
                 │   [Get Started]      │
                 └──────────────────────┘

───────────────────────────────────────────────────────────

             Featured Course Categories

    ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
    │   💻    │  │   📊    │  │   🎨    │  │   🤖    │
    │  Web    │  │  Data   │  │ Design  │  │   AI    │
    │  Dev    │  │ Science │  │         │  │         │
    └─────────┘  └─────────┘  └─────────┘  └─────────┘

───────────────────────────────────────────────────────────

                  Why Choose Us?

    ✓ Expert-curated content    ✓ Track your progress
    ✓ Flexible learning         ✓ Earn certificates

───────────────────────────────────────────────────────────
                      FOOTER
═══════════════════════════════════════════════════════════
```

**User Journey:**
1. Land on page → See hero message
2. Scroll to view categories
3. Click "Get Started" → Redirected to Register/Login
4. Browse features before signing up

---

### 2. Login/Register Page

```
═══════════════════════════════════════════════════════════
                    NAVIGATION BAR
───────────────────────────────────────────────────────────


          ┌────────────────────────────────┐
          │                                │
          │      LOGIN TO YOUR ACCOUNT     │
          │                                │
          │  Email Address                 │
          │  ┌───────────────────────┐    │
          │  │                       │    │
          │  └───────────────────────┘    │
          │                                │
          │  Password                      │
          │  ┌───────────────────────┐    │
          │  │ ●●●●●●●●●             │    │
          │  └───────────────────────┘    │
          │                                │
          │  ┌───────────────────────┐    │
          │  │      LOGIN            │    │
          │  └───────────────────────┘    │
          │                                │
          │  Don't have an account?        │
          │  [Register here]               │
          │                                │
          └────────────────────────────────┘


═══════════════════════════════════════════════════════════
```

**Register Page Additional Fields:**
- Name field
- Interests selection (checkboxes)
- Password confirmation

---

### 3. Dashboard (Student View)

```
═══════════════════════════════════════════════════════════
                    NAVIGATION BAR
───────────────────────────────────────────────────────────
  SIDEBAR
┌────────┐    ┌─────────────────────────────────────────┐
│        │    │  Welcome back, John! 👋                 │
│  Menu  │    │                                         │
│        │    │  ┌──────────┐  ┌──────────┐           │
│ Active │    │  │    3     │  │    8     │           │
│ Items  │    │  │ Enrolled │  │  Hours   │           │
│        │    │  └──────────┘  └──────────┘           │
│        │    │                                         │
│        │    │  Your Progress                         │
│        │    │  ═══════════════════════════════════  │
│        │    │                                         │
│        │    │  ┌─────────────────────────────────┐  │
│        │    │  │ React Course      [65%] ████▓░  │  │
│        │    │  │ Continue Learning →             │  │
│        │    │  └─────────────────────────────────┘  │
│        │    │                                         │
│        │    │  ┌─────────────────────────────────┐  │
│        │    │  │ Python Course     [40%] ███░░░  │  │
│        │    │  │ Continue Learning →             │  │
│        │    │  └─────────────────────────────────┘  │
│        │    │                                         │
│        │    │  Recommended for You                   │
│        │    │  ───────────────────────────────────  │
│        │    │                                         │
│        │    │  [Course 1]  [Course 2]  [Course 3]  │
│        │    │                                         │
└────────┘    └─────────────────────────────────────────┘

═══════════════════════════════════════════════════════════
```

**Key Elements:**
- Sidebar navigation (collapsible on mobile)
- Statistics cards (enrolled courses, hours spent)
- Progress cards with continue learning CTA
- Recommended courses based on interests

---

### 4. Courses Page (Browse)

```
═══════════════════════════════════════════════════════════
                    NAVIGATION BAR
───────────────────────────────────────────────────────────

   ┌────────────────────────────────────────────────────┐
   │  🔍 Search courses...                [Search]     │
   └────────────────────────────────────────────────────┘

   Filters: [All] [Web Dev] [Data Science] [Design] ...

───────────────────────────────────────────────────────────

   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
   │ COURSE 1 │  │ COURSE 2 │  │ COURSE 3 │  │ COURSE 4 │
   │  IMAGE   │  │  IMAGE   │  │  IMAGE   │  │  IMAGE   │
   │          │  │          │  │          │  │          │
   │ Title    │  │ Title    │  │ Title    │  │ Title    │
   │ Desc...  │  │ Desc...  │  │ Desc...  │  │ Desc...  │
   │          │  │          │  │          │  │          │
   │ [View]   │  │ [View]   │  │ [View]   │  │ [View]   │
   └──────────┘  └──────────┘  └──────────┘  └──────────┘

   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
   │ COURSE 5 │  │ COURSE 6 │  │ COURSE 7 │  │ COURSE 8 │
   │  IMAGE   │  │  IMAGE   │  │  IMAGE   │  │  IMAGE   │
   │          │  │          │  │          │  │          │
   │ Title    │  │ Title    │  │ Title    │  │ Title    │
   │ Desc...  │  │ Desc...  │  │ Desc...  │  │ Desc...  │
   │          │  │          │  │          │  │          │
   │ [View]   │  │ [View]   │  │ [View]   │  │ [View]   │
   └──────────┘  └──────────┘  └──────────┘  └──────────┘

              [← Previous]  1  2  3  [Next →]

═══════════════════════════════════════════════════════════
```

**Features:**
- Search functionality
- Category filters
- Grid layout (responsive: 4 columns → 2 → 1)
- Pagination

---

### 5. Course Detail Page

```
═══════════════════════════════════════════════════════════
                    NAVIGATION BAR
───────────────────────────────────────────────────────────

  ← Back to Courses

  ┌──────────────────────────────────────────────────────┐
  │           COURSE BANNER IMAGE                        │
  │                                                      │
  └──────────────────────────────────────────────────────┘

  React.js Complete Course                      [Intermediate]

  Master React from basics to advanced concepts including
  hooks, context, routing, and state management.

  ⏱ 8 weeks    📚 20 modules    🏷 Web Development

  ┌───────────────────┐
  │  ENROLL NOW       │  ← Primary CTA
  └───────────────────┘

───────────────────────────────────────────────────────────

  Course Modules                                Total: 20

  ┌────────────────────────────────────────────────────┐
  │  ✓ Module 1: Introduction to React                │
  │     Duration: 45 mins       [Completed]            │
  └────────────────────────────────────────────────────┘

  ┌────────────────────────────────────────────────────┐
  │  ▶ Module 2: Components and Props                  │
  │     Duration: 60 mins       [Start Module]         │
  └────────────────────────────────────────────────────┘

  ┌────────────────────────────────────────────────────┐
  │  🔒 Module 3: State and Lifecycle                  │
  │     Duration: 75 mins       [Locked]               │
  └────────────────────────────────────────────────────┘

  ... (More modules)

═══════════════════════════════════════════════════════════
```

**States:**
- ✓ Completed (green checkmark)
- ▶ Current/Available (clickable)
- 🔒 Locked (grayed out)

---

### 6. Admin Panel

```
═══════════════════════════════════════════════════════════
                    NAVIGATION BAR (Admin)
───────────────────────────────────────────────────────────
  SIDEBAR
┌────────┐    ┌─────────────────────────────────────────┐
│        │    │  Admin Dashboard                        │
│ Admin  │    │                                         │
│ Menu   │    │  ┌──────┐  ┌──────┐  ┌──────┐         │
│        │    │  │  45  │  │  12  │  │ 234  │         │
│ Analytics   │  │Users │  │Courses│  │Active│         │
│ Users  │    │  └──────┘  └──────┘  └──────┘         │
│ Courses│    │                                         │
│        │    │  User Activity Chart                    │
│        │    │  ┌───────────────────────────────────┐ │
│        │    │  │        📊 Bar Chart                │ │
│        │    │  │                                    │ │
│        │    │  └───────────────────────────────────┘ │
│        │    │                                         │
│        │    │  Recent Registrations                   │
│        │    │  ───────────────────────────────────   │
│        │    │                                         │
│        │    │  • John Doe (2 hours ago)              │
│        │    │  • Jane Smith (5 hours ago)            │
│        │    │  • Bob Wilson (1 day ago)              │
│        │    │                                         │
│        │    │  ┌─────────────────────────────────┐  │
│        │    │  │  + CREATE NEW COURSE            │  │
│        │    │  └─────────────────────────────────┘  │
└────────┘    └─────────────────────────────────────────┘

═══════════════════════════════════════════════════════════
```

---

## Responsive Design Strategy

### Mobile (< 768px)
```
- Single column layout
- Hamburger menu for navigation
- Stacked cards
- Full-width buttons
- Collapsible sidebar
- Touch-friendly targets (min 44px)
```

### Tablet (768px - 1024px)
```
- 2-column grid for courses
- Visible sidebar (toggleable)
- Adjusted spacing
- Responsive images
```

### Desktop (> 1024px)
```
- 3-4 column grid
- Fixed sidebar
- Hover effects enabled
- Larger padding and margins
```

---

## Animations & Interactions

### Micro-interactions
1. **Button Hover:** Scale(1.05) + shadow increase
2. **Card Hover:** Lift effect (translateY(-4px))
3. **Input Focus:** Blue border pulse
4. **Progress Bar:** Animated fill on load
5. **Page Transitions:** Fade in (0.3s)

### Loading States
```
Course cards: Skeleton screens
Data loading: Spinner (blue rotating circle)
Form submission: Button text "Loading..." + spinner
```

### Success Feedback
```
Toast Notifications:
┌─────────────────────────────┐
│ ✓ Successfully enrolled!    │  Green background
└─────────────────────────────┘  Auto-dismiss: 3s
```

### Error Feedback
```
┌─────────────────────────────┐
│ ✗ Invalid email format      │  Red background
└─────────────────────────────┘  Below form field
```

---

## Accessibility (A11Y) Features

### WCAG 2.1 Level AA Compliance

1. **Color Contrast:**
   - Text-background ratio: 4.5:1 minimum
   - Large text: 3:1 minimum

2. **Keyboard Navigation:**
   - Tab order: Logical left-to-right, top-to-bottom
   - Focus indicators: Blue outline (2px)
   - Skip to content link

3. **Screen Reader Support:**
   - Semantic HTML (header, nav, main, article)
   - ARIA labels on icons
   - Alt text on all images
   - Form labels properly associated

4. **Responsive Text:**
   - Zoomable up to 200% without loss of functionality
   - Relative units (rem, em) instead of px

---

## Design Tools & Resources

### Tools Used
- **Wireframing:** Figma / Adobe XD / Hand-sketched
- **Color Palette:** Coolors.co
- **Icons:** Emoji + Custom SVG icons
- **Fonts:** System fonts for performance

### Design Assets Location
```
frontend/src/
├── App.css          # Global styles
├── index.css        # CSS variables, resets
└── pages/
    └── [Page].css   # Page-specific styles
```

---

## User Flow Diagrams

### Student Registration Flow
```
Landing Page
     ↓
Register Page → Enter Details → Select Interests
     ↓
Email Verification (Future)
     ↓
Dashboard (Auto-login with JWT)
     ↓
Browse Recommended Courses
     ↓
Enroll in Course
     ↓
Start Learning
```

### Course Enrollment Flow
```
Courses Page → Browse/Filter → Click Course Card
     ↓
Course Detail Page → View Modules → Click "Enroll"
     ↓
Check if already enrolled → If yes: Redirect to progress
     ↓                       If no: Create progress record
Dashboard/My Courses
     ↓
Click "Continue Learning"
     ↓
Course modules with progress tracking
```

### Admin Course Creation Flow
```
Admin Panel → Navigate to Courses
     ↓
Click "Add New Course"
     ↓
Fill Form: Title, Description, Category, etc.
     ↓
Add Modules (minimum 1 required)
     ↓
Submit → Validation
     ↓
Success Toast → Course appears in catalog
```

---

## Design System Documentation

### Component Hierarchy
```
Layout Components
├── Navbar (fixed)
├── Sidebar (contextual)
├── Main Content Area
└── Footer

Interactive Components
├── Buttons (Primary, Secondary, Danger)
├── Forms (Input, Textarea, Select, Checkbox)
├── Cards (Course, Progress, Stats)
├── Modals (Confirmation, Info)
└── Toasts (Success, Error, Warning)

Data Display
├── Progress Bars
├── Charts (Bar, Doughnut)
├── Tables (User list, Course list)
└── Badges (Level, Status)
```

---

## Usability Testing Checklist

- [ ] All CTAs clearly visible and understandable
- [ ] Navigation intuitive (max 3 clicks to any page)
- [ ] Forms have clear labels and error messages
- [ ] Mobile responsive (320px - 1920px)
- [ ] Loading states for all async operations
- [ ] Success/error feedback for all actions
- [ ] Consistent design patterns across pages
- [ ] Accessible via keyboard only
- [ ] Readable at 200% zoom
- [ ] Works without JavaScript (graceful degradation where possible)

---

