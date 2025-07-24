# Deploying to Vercel

This guide walks you through deploying your VibeSpec application to Vercel, the platform created by the makers of Next.js.

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier available)
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- Environment variables ready (if using Firebase)

## One-Click Deploy

The fastest way to deploy is using the Deploy button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvibespec%2Fvibespec&env=NEXT_PUBLIC_USE_FIREBASE_AUTH,NEXT_PUBLIC_USE_FIRESTORE,NEXT_PUBLIC_USE_STORAGE,NEXT_PUBLIC_USE_FUNCTIONS&envDescription=Configure%20Firebase%20feature%20flags%20and%20credentials&envLink=https%3A%2F%2Fgithub.com%2Fvibespec%2Fvibespec%23environment-variables)

## Manual Deployment

### Step 1: Import Your Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Select the repository containing your VibeSpec project

### Step 2: Configure Build Settings

Vercel automatically detects Next.js projects. Verify these settings:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` or leave as default
- **Output Directory**: Leave as default
- **Install Command**: `npm install --legacy-peer-deps`

### Step 3: Set Environment Variables

Add your environment variables in the Vercel dashboard:

#### Required for Mock Services Only
```
NEXT_PUBLIC_USE_FIREBASE_AUTH=false
NEXT_PUBLIC_USE_FIRESTORE=false
NEXT_PUBLIC_USE_STORAGE=false
NEXT_PUBLIC_USE_FUNCTIONS=false
```

#### Required for Firebase Integration
```
NEXT_PUBLIC_USE_FIREBASE_AUTH=true
NEXT_PUBLIC_USE_FIRESTORE=true
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

#### Optional Configuration
```
NEXT_PUBLIC_APP_NAME=Your App Name
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SUPPORT_EMAIL=support@yourdomain.com
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 2-3 minutes)
3. Your app will be live at `https://[project-name].vercel.app`

## Custom Domain Configuration

### Adding a Custom Domain

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your domain (e.g., `app.yourdomain.com`)
4. Follow the DNS configuration instructions

### DNS Configuration

Add one of these records to your DNS provider:

**For root domain (yourdomain.com):**
- Type: A
- Name: @
- Value: 76.76.21.21

**For subdomain (app.yourdomain.com):**
- Type: CNAME
- Name: app
- Value: cname.vercel-dns.com

### SSL Certificates

Vercel automatically provisions SSL certificates for your custom domains. No additional configuration needed.

## Production Optimizations

### 1. Enable Static Optimization

Ensure your pages use static generation where possible:

```typescript
// For static pages
export default function Page() {
  return <div>...</div>
}

// For dynamic pages with static paths
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}
```

### 2. Image Optimization

Use Next.js Image component for automatic optimization:

```typescript
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
/>
```

### 3. Configure Caching Headers

Add caching headers in `next.config.ts`:

```typescript
module.exports = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

## Monitoring and Analytics

### Vercel Analytics

1. Enable Analytics in your project dashboard
2. No code changes required
3. View Core Web Vitals and performance metrics

### Runtime Logs

Access logs from the Vercel dashboard:
1. Go to your project
2. Click "Functions" tab
3. View real-time logs

## Deployment Environments

### Preview Deployments

Every push to a non-production branch creates a preview deployment:
- Unique URL for each deployment
- Perfect for testing changes
- Automatic cleanup after merging

### Production Deployment

Pushes to your main branch automatically deploy to production.

### Environment-Specific Variables

Set different variables for preview and production:
1. Go to Settings → Environment Variables
2. Choose environment: Production, Preview, or Development
3. Add environment-specific values

## Troubleshooting

### Build Failures

**Common issues:**
1. **Missing environment variables**: Check all required vars are set
2. **Type errors**: Run `npm run typecheck` locally
3. **Dependency issues**: Use `npm install --legacy-peer-deps`

### Runtime Errors

1. Check Functions logs in Vercel dashboard
2. Verify environment variables are accessible
3. Ensure Firebase project allows your domain

### Performance Issues

1. Enable caching for static assets
2. Optimize images and fonts
3. Use Vercel Analytics to identify bottlenecks

## CI/CD Integration

### Automatic Deployments

Vercel automatically deploys when you push to Git. No additional CI/CD setup required.

### Deploy Hooks

Create deploy hooks for external triggers:
1. Go to Settings → Git
2. Create a Deploy Hook
3. Use the webhook URL to trigger deployments

### GitHub Integration

The Vercel GitHub integration provides:
- Automatic deployments
- Preview deployments for PRs
- Deployment status checks
- Comments with preview URLs

## Cost Considerations

### Free Tier Limits
- 100GB bandwidth/month
- 100GB-hours of function execution
- Unlimited static requests

### Optimizing Costs
1. Use static generation where possible
2. Implement proper caching
3. Optimize images and assets
4. Monitor usage in dashboard

## Best Practices

1. **Use Environment Variables**: Never commit secrets
2. **Test Preview Deployments**: Before merging to main
3. **Monitor Performance**: Use Vercel Analytics
4. **Set Up Alerts**: For errors and performance issues
5. **Regular Updates**: Keep dependencies current

## Next Steps

After deployment:
1. Configure your custom domain
2. Set up monitoring and alerts
3. Enable Vercel Analytics
4. Test all features in production
5. Set up error tracking (e.g., Sentry)

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Environment Variables Guide](https://vercel.com/docs/environment-variables)