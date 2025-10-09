# Project: Online Learning Platform (No AI Generation)

## Overview

Build a fully-featured online learning platform similar to the UI/UX provided in the screenshots. **All courses are uploaded/created manually or imported from YouTube or other sources via API.** The platform will have the following core features:

- Landing page with marketing and product information
- User authentication and profile management
- Dashboard with sidebar navigation
- Course browsing, enrollment, and management
- User progress tracking and personalized learning paths
- Billing and subscription management
- Responsive, modern UI/UX

## Major Requirements

### 1. Landing Page
- Modern, clean hero section with call to action ("Unlock Your Potential with Online Learning 🚀").
- Features section highlighting key selling points (personalized learning paths, instant feedback, progress tracking).
- Signup and trial CTA buttons.
- Testimonials from students and educators.
- Footer with quick links, legal, and follow-us sections.

### 2. Sidebar & Header Navigation

#### User Sidebar (seen by all users)
- Dashboard (default/home)
- My Learning (active/enrolled courses)
- Explore Courses (course catalog, including imported YouTube or API-based courses)
- Billing (subscription, payment methods)
- Profile (account management)
- Current user indicator (profile icon, dropdown)

#### Admin Sidebar (only seen by admin/instructors)
- All of the above, plus:
  - **Admin Panel**
    - "Create New Course" (content creation)
    - Manage Courses (edit, delete, reorder)
    - Manage Users (view, moderate)
    - Analytics & Reports (see enrollments, completions, payments)

**Note:** Only admins/instructors see the Admin Panel in the sidebar. Regular users do not see admin features.

### 3. Dashboard & User Home
- Welcome message and user's learning overview.
- Display of current, active, or recommended courses.
- Empty state with CTA for first-time users (“Look like you haven't created any courses yet”).

### 4. Course Management
- Course catalog showing available and imported courses (YouTube or other sources).
- Course cards with progress, enroll buttons, and chapter count.
- Detailed course view:
  - List of chapters/modules
  - Chapter content with embedded video (YouTube or uploaded), text, and quizzes
  - Mark chapter as completed
  - Track and display user progress

### 5. Course Creation/Upload (Admin/Instructor Only)
- Admin/instructor can create new courses via the Admin Panel.
- Form includes:
  - Basic Info: Course name, description, category, difficulty level, and price/free toggle.
  - Content: Add course chapters, descriptions, duration, and content type.
  - Chapters: Add/upload each chapter with:
    - Chapter title and description
    - Video URL (YouTube or upload)
    - Content type (video, text, quiz)
    - Duration
    - Add resources/quizzes (optional)
- Save as draft or publish.
- Example UI: Tabbed form for Basic Info, Content, Chapters (as seen in the screenshots).

### 6. Learning Experience
- Interactive chapter view:
  - Video section (embedded or uploaded), text content, and related resources
  - Navigation between chapters
  - Mark as complete functionality

### 7. Profile Management
- Edit profile, manage email addresses, connected accounts (OAuth).
- View and update subscription plan
- Manage payment methods

### 8. Billing & Subscription
- Subscription plans (Free, Starter, Premium)
- Select/Upgrade plan functionality
- View billing statements and payment info

## UI/UX Reference (from screenshots)

- Sidebar navigation on the left, header at the top of the main content.
- Primary color palette: White backgrounds, purple/blue accents, and simple icons.
- Clear CTAs: “Create New Course,” “Enroll Course,” “Sign Up for Free.”
- Feedback for empty states (e.g., no courses yet).
- Consistent card and modal design for forms and content.
- Tabbed course creation for admin: Basic Info, Content, Chapters.

## Functional Requirements

- User authentication (email/password, Google OAuth).
- Responsive design for desktop and mobile.
- Accessible (a11y best practices).
- State management for user, courses, and progress.
- Backend for user data, courses, and course content (API endpoints).
- Payment processing for subscriptions (EVC, E-dahab, etc).
- Analytics for progress tracking.
- Integration with video hosting/embedding for course chapters (YouTube embed, file upload).

## Development Stack Suggestion

- Frontend: Next.js (React), TailwindCSS/Shadcn UI, Javascript
- Backend: Node.js/Express or Next.js API routes
- Database: PostgreSQL, MongoDB, or Prisma ORM
- Authentication: Clerk, Auth0, or NextAuth
- Payments: Stripe API, EVC, E-dahab (Somalia support)
- Deployment: Vercel, AWS, or similar

## Example User Flows

1. Visitor lands on homepage, learns about platform, and signs up.
2. User logs in, sees dashboard and sidebar (user-only features).
3. Admin logs in and sees Admin Panel options in the sidebar.
4. Admin creates a course via multi-step form (Basic Info, Content, Chapters).
5. User browses, enrolls in a course, and begins learning (videos, text, quizzes).
6. User tracks progress, marks chapters as complete, and sees analytics.
7. User manages subscription and billing from their profile.

---

**Use this context to generate all necessary components, pages, and backend logic for a modern online learning platform. Prioritize usability, fast onboarding, and a seamless course creation and learning experience. Remove all AI-powered course generation. Enable easy import/upload of course videos (YouTube or file upload) and ensure local payment options are supported if required. Only admins see admin content creation and management features.**
