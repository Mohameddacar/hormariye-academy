# Netlify Deployment Guide

## Prerequisites

Before deploying to Netlify, make sure you have:

1. **GitHub Repository**: Your code is pushed to GitHub (✅ Done)
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **Required Services**: Set up the following services

## Required Services Setup

### 1. Neon Database (PostgreSQL)
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string (it will look like: `postgresql://username:password@host:port/database`)
4. Keep this for Netlify environment variables

### 2. Clerk Authentication
1. Go to [clerk.com](https://clerk.com)
2. Create a new application
3. Get your publishable key (starts with `pk_test_` or `pk_live_`)
4. Get your secret key (starts with `sk_test_` or `sk_live_`)
5. Configure authentication URLs:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/workspace`
   - After sign-up URL: `/workspace`

### 3. Google Gemini AI
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create a new API key
3. Keep this for Netlify environment variables

### 4. Optional: Stripe (for payments)
1. Go to [stripe.com](https://stripe.com)
2. Create an account and get your API keys
3. Set up webhooks for subscription management

## Deploy to Netlify

### Step 1: Connect Repository
1. Log in to [Netlify](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and authorize Netlify
4. Select your repository: `Mohameddacar/hormariye-academy`

### Step 2: Configure Build Settings
Netlify should auto-detect these settings:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 18

### Step 3: Set Environment Variables
In Netlify dashboard, go to:
**Site settings** → **Environment variables** → **Add variable**

Add these variables:

```
DATABASE_URL=postgresql://username:password@host:port/database
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/workspace
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/workspace
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 4: Deploy
1. Click "Deploy site"
2. Wait for the build to complete
3. Your site will be available at `https://your-site-name.netlify.app`

## Post-Deployment Setup

### 1. Database Migration
After deployment, you need to run database migrations:

1. Go to Netlify dashboard → **Functions** → **Function logs**
2. Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify functions:invoke migrate
   ```

### 2. Configure Clerk for Production
1. In Clerk dashboard, add your Netlify domain to allowed origins
2. Update the domain in Clerk settings
3. Test authentication flow

### 3. Test Your Application
1. Visit your Netlify URL
2. Test user registration/login
3. Test course creation and enrollment
4. Test AI features

## Custom Domain (Optional)

1. In Netlify dashboard → **Domain management**
2. Click "Add custom domain"
3. Enter your domain name
4. Configure DNS settings as instructed
5. Enable HTTPS (automatic with Netlify)

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check environment variables are set correctly
2. **Database Connection**: Verify DATABASE_URL is correct
3. **Authentication Issues**: Check Clerk keys and domain settings
4. **API Routes Not Working**: Ensure Netlify Next.js plugin is installed

### Useful Commands:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from local
netlify deploy

# Deploy to production
netlify deploy --prod

# View function logs
netlify functions:log
```

## Security Notes

- Never commit `.env` files to Git
- Use production keys for live sites
- Enable HTTPS (automatic with Netlify)
- Regularly update dependencies
- Monitor function logs for errors

## Support

If you encounter issues:
1. Check Netlify build logs
2. Check function logs
3. Verify all environment variables
4. Test locally first with `npm run dev`
