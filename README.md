# AI-Powered Learning Platform

A modern, full-featured e-learning platform built with Next.js, featuring AI-powered course generation, user authentication, progress tracking, and a beautiful responsive UI.

## 🚀 Features

### Core Features
- **AI-Powered Course Generation**: Create comprehensive courses using Google's Gemini AI
- **User Authentication**: Secure authentication with Clerk
- **Course Management**: Create, edit, and manage courses with rich content
- **Progress Tracking**: Real-time progress tracking and completion status
- **Course Enrollment**: Browse and enroll in available courses
- **Responsive Design**: Mobile-first design that works on all devices

### Pages & Functionality
- **Landing Page**: Modern marketing page with features, testimonials, and CTAs
- **Dashboard**: Overview of user's courses and learning progress
- **Course Detail**: Interactive learning interface with chapter navigation
- **Explore Courses**: Browse and search through available courses
- **My Learning**: View enrolled courses and track progress
- **Profile Management**: User account settings and preferences
- **Billing & Subscriptions**: Subscription management and payment handling
- **AI Tools**: Additional AI-powered utilities for content creation

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with modern features
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Beautiful, accessible UI components
- **Lucide React**: Modern icon library

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Drizzle ORM**: Type-safe database operations
- **Neon Database**: Serverless PostgreSQL database
- **Clerk**: Authentication and user management

### AI & External Services
- **Google Gemini AI**: Course content generation
- **Axios**: HTTP client for API requests

## 📁 Project Structure

```
online-learning-platform/
├── app/
│   ├── (auth)/                 # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── api/                    # API routes
│   │   ├── courses/
│   │   ├── enrollments/
│   │   ├── progress/
│   │   └── user/
│   ├── workspace/              # Main application pages
│   │   ├── _components/        # Reusable components
│   │   ├── course/[courseId]/  # Dynamic course pages
│   │   ├── explore/            # Course exploration
│   │   ├── my-courses/         # User's enrolled courses
│   │   ├── profile/            # User profile management
│   │   ├── billing/            # Subscription management
│   │   └── ai-tools/           # AI utilities
│   ├── globals.css
│   ├── layout.js
│   └── page.js                 # Landing page
├── components/
│   └── ui/                     # Shadcn/ui components
├── config/
│   ├── db.jsx                  # Database configuration
│   └── schema.js               # Database schema
├── context/
│   └── UserDetailsContext.jsx  # User context provider
├── hooks/
│   └── use-mobile.js           # Mobile detection hook
├── lib/
│   └── utils.js                # Utility functions
└── public/                     # Static assets
```

## 🗄️ Database Schema

### Tables
- **users**: User account information
- **courses**: Course data and metadata
- **enrollments**: User course enrollments
- **progress**: Chapter completion tracking
- **subscriptions**: User subscription plans

### Key Relationships
- Users can have multiple courses (one-to-many)
- Users can enroll in multiple courses (many-to-many via enrollments)
- Progress is tracked per user per course per chapter

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Neon database account
- Clerk account
- Google AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd online-learning-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with the following variables:
   ```env
   # Database
   DATABASE_URL=your_neon_database_url
   
   # Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # AI
   GEMINI_API_KEY=your_google_gemini_api_key
   
   # Next.js
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/workspace
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/workspace
   ```

4. **Database Setup**
   ```bash
   # Generate database migrations
   npx drizzle-kit generate
   
   # Apply migrations
   npx drizzle-kit push
   ```

5. **Start Development Server**
```bash
npm run dev
   ```

6. **Open in Browser**
   Navigate to `http://localhost:3000`

## 📱 Usage

### For Students
1. **Sign Up**: Create an account using email or Google OAuth
2. **Browse Courses**: Explore available courses in the catalog
3. **Enroll**: Click "Enroll Course" on any course you're interested in
4. **Learn**: Access your enrolled courses from "My Learning"
5. **Track Progress**: Monitor your completion status and progress

### For Educators
1. **Create Courses**: Use the "Create New Course" button to generate AI-powered courses
2. **Customize Content**: Provide course details, difficulty level, and topics
3. **Publish**: Make your courses available for enrollment
4. **Monitor**: Track student progress and engagement

### AI Tools
- **Course Generator**: Create complete course structures with AI
- **Content Rewriter**: Improve existing content
- **Image Generator**: Generate course banners and illustrations
- **Video Script Generator**: Create scripts for course videos

## 🔧 API Endpoints

### Authentication
- `POST /api/user` - Create or get user
- `PUT /api/user` - Update user profile

### Courses
- `GET /api/courses` - Get user's courses
- `GET /api/courses/all` - Get all published courses
- `GET /api/courses/[courseId]` - Get specific course
- `POST /api/courses/[courseId]/enroll` - Enroll in course
- `POST /api/generate-course-layout` - Generate AI course

### Progress & Enrollments
- `GET /api/enrollments` - Get user enrollments
- `POST /api/enrollments` - Create enrollment
- `GET /api/progress` - Get user progress
- `POST /api/progress` - Update progress

## 🎨 UI Components

The application uses Shadcn/ui components for a consistent, accessible design:

- **Button**: Various button styles and sizes
- **Card**: Content containers with headers and content
- **Dialog**: Modal dialogs for forms and confirmations
- **Input**: Form input fields
- **Select**: Dropdown selection components
- **Tabs**: Tabbed navigation
- **Progress**: Progress bars and indicators
- **Badge**: Status indicators and labels

## 🔒 Security Features

- **Authentication**: Secure user authentication with Clerk
- **Authorization**: Route protection and user-specific data access
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Drizzle ORM prevents SQL injection
- **CORS**: Proper CORS configuration for API routes

## 📊 Performance Optimizations

- **Server-Side Rendering**: Fast initial page loads
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting for smaller bundles
- **Caching**: Efficient data caching strategies
- **Responsive Images**: Optimized images for different screen sizes

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Static site deployment
- **Railway**: Full-stack deployment
- **AWS**: EC2 or Lambda deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **Shadcn/ui** for the beautiful UI components
- **Clerk** for authentication services
- **Neon** for the serverless database
- **Google** for the Gemini AI API

## 📞 Support

For support, email support@hormariyeacademy.com or create an issue in the repository.

---

**Built with ❤️ by Hormariye Academy**