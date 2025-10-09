# Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Authentication URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/workspace
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/workspace

# AI (Google Gemini)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Stripe for payments
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Required Services Setup

### 1. Neon Database
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to `DATABASE_URL`

### 2. Clerk Authentication
1. Go to [clerk.com](https://clerk.com)
2. Create a new application
3. Copy the publishable key and secret key
4. Configure the authentication URLs as shown above

### 3. Google Gemini AI
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create a new API key
3. Copy the key to `GEMINI_API_KEY`

### 4. Optional: Stripe (for payments)
1. Go to [stripe.com](https://stripe.com)
2. Create an account and get your API keys
3. Set up webhooks for subscription management

## Database Migration

After setting up the environment variables, run the database migration:

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.
