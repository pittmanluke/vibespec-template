# Deployment Overview

This guide provides a general overview of deploying your VibeSpec application to various platforms.

## Prerequisites

Before deploying, ensure you have:

- [ ] Completed local development and testing
- [ ] Set up environment variables
- [ ] Configured Firebase (if using Firebase services)
- [ ] Run build locally to verify no errors
- [ ] Committed all changes to Git

## Pre-Deployment Checklist

### 1. Environment Variables

Ensure all required environment variables are configured:

```bash
# Feature Flags (required)
NEXT_PUBLIC_USE_FIREBASE_AUTH
NEXT_PUBLIC_USE_FIRESTORE
NEXT_PUBLIC_USE_STORAGE
NEXT_PUBLIC_USE_FUNCTIONS

# Firebase Config (if using Firebase)
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID

# Optional
NEXT_PUBLIC_APP_NAME
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SUPPORT_EMAIL
```

### 2. Build Verification

Run these commands locally:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Type checking
npm run typecheck

# Linting
npm run lint

# Production build
npm run build
```

### 3. Security Audit

```bash
# Check for vulnerabilities
npm audit

# Update dependencies if needed
npm update
```

## Deployment Options

### Recommended Platforms

1. **[Vercel](./vercel-deployment.md)** ⭐ Recommended
   - Zero-config deployment
   - Automatic CI/CD
   - Edge functions support
   - Great Next.js integration

2. **[Firebase Hosting](./firebase-deployment.md)**
   - Good for Firebase-heavy apps
   - Integrated with Firebase services
   - Preview channels
   - Custom domain support

3. **[Netlify](https://www.netlify.com)**
   - Easy deployment
   - Good free tier
   - Form handling
   - Identity services

4. **[Railway](https://railway.app)**
   - Simple deployment
   - Good for full-stack apps
   - Database hosting
   - Background jobs

5. **[Render](https://render.com)**
   - Docker support
   - Auto-scaling
   - Managed databases
   - Background workers

### Platform Comparison

| Feature | Vercel | Firebase | Netlify | Railway | Render |
|---------|---------|----------|---------|---------|---------|
| Free Tier | ✅ Good | ✅ Good | ✅ Good | ⚠️ Limited | ⚠️ Limited |
| CI/CD | ✅ Built-in | ✅ Actions | ✅ Built-in | ✅ Built-in | ✅ Built-in |
| Custom Domains | ✅ Free | ✅ Free | ✅ Free | 💰 Paid | ✅ Free |
| SSL | ✅ Auto | ✅ Auto | ✅ Auto | ✅ Auto | ✅ Auto |
| Edge Functions | ✅ Yes | ❌ No | ✅ Yes | ❌ No | ❌ No |
| Preview URLs | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |

## Build Configuration

### Next.js Configuration

Ensure your `next.config.ts` is production-ready:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // For static export (Firebase Hosting, GitHub Pages)
  // output: 'export',
  
  // Image optimization
  images: {
    domains: ['your-image-domain.com'],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  }
}

export default nextConfig
```

### TypeScript Configuration

Ensure strict mode for production:

```json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true
  }
}
```

## Environment Management

### Development vs Production

Use different `.env` files:

```bash
.env.local          # Local development
.env.production     # Production values
.env.staging        # Staging environment
```

### Secrets Management

**Never commit secrets!** Use platform-specific secret management:

- **Vercel**: Environment Variables in dashboard
- **Firebase**: Firebase Functions config
- **Netlify**: Environment Variables in UI
- **GitHub Actions**: Repository secrets

## Performance Optimization

### 1. Bundle Size Optimization

```bash
# Analyze bundle size
npm run build
```

Check `.next/analyze/` for bundle analysis.

### 2. Image Optimization

- Use Next.js Image component
- Serve images from CDN
- Use modern formats (WebP, AVIF)
- Implement lazy loading

### 3. Caching Strategy

Configure caching headers:

```typescript
// next.config.ts
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

### Essential Monitoring

1. **Uptime Monitoring**
   - [UptimeRobot](https://uptimerobot.com)
   - [Pingdom](https://www.pingdom.com)
   - Platform-specific monitoring

2. **Error Tracking**
   - [Sentry](https://sentry.io)
   - [LogRocket](https://logrocket.com)
   - [Bugsnag](https://www.bugsnag.com)

3. **Analytics**
   - [Vercel Analytics](https://vercel.com/analytics)
   - [Google Analytics](https://analytics.google.com)
   - [Plausible](https://plausible.io)

### Performance Monitoring

```typescript
// Add Web Vitals tracking
export function reportWebVitals(metric: any) {
  if (metric.label === 'web-vital') {
    console.log(metric)
    // Send to analytics
  }
}
```

## Database Considerations

### Using Firebase

If using Firestore:
1. Set up security rules
2. Create composite indexes
3. Enable offline persistence
4. Configure backups

### Using Other Databases

Consider:
- [Supabase](https://supabase.com) - Open source Firebase alternative
- [PlanetScale](https://planetscale.com) - Serverless MySQL
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Managed MongoDB
- [PostgreSQL on Railway](https://railway.app) - Managed PostgreSQL

## CI/CD Setup

### GitHub Actions Example

`.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install
        run: npm ci --legacy-peer-deps
        
      - name: Lint
        run: npm run lint
        
      - name: Type Check
        run: npm run typecheck
        
      - name: Build
        run: npm run build
        
      - name: Deploy
        run: |
          # Platform-specific deploy command
          echo "Deploy to your platform"
```

## Post-Deployment

### 1. Verify Deployment

- [ ] Check all pages load correctly
- [ ] Test authentication flows
- [ ] Verify API endpoints work
- [ ] Check mobile responsiveness
- [ ] Test forms and interactions

### 2. Set Up Monitoring

- [ ] Configure uptime monitoring
- [ ] Set up error alerts
- [ ] Enable performance tracking
- [ ] Configure backup strategy

### 3. Security Hardening

- [ ] Review security headers
- [ ] Check HTTPS enforcement
- [ ] Verify environment variables
- [ ] Test rate limiting

## Rollback Strategy

Always have a rollback plan:

1. **Git-based**: Tag releases for easy rollback
2. **Platform-based**: Use platform rollback features
3. **Database**: Have backup strategy
4. **DNS**: Keep TTL low during migration

## Cost Optimization

### Tips to Reduce Costs

1. **Use CDN**: Serve static assets from CDN
2. **Optimize Images**: Reduce bandwidth usage
3. **Enable Caching**: Reduce server load
4. **Monitor Usage**: Set up billing alerts
5. **Choose Right Tier**: Start small, scale as needed

### Free Tier Limits

Most platforms offer free tiers:
- **Vercel**: 100GB bandwidth/month
- **Firebase**: 10GB hosting, 360MB/day bandwidth
- **Netlify**: 100GB bandwidth/month
- **Railway**: $5 credit/month
- **Render**: 750 hours/month

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node version matches locally
   - Verify all environment variables set
   - Use `--legacy-peer-deps` for install

2. **Runtime Errors**
   - Check logs on platform dashboard
   - Verify API keys are correct
   - Check CORS configuration

3. **Performance Issues**
   - Enable caching
   - Optimize bundle size
   - Use CDN for assets

## Next Steps

1. Choose your deployment platform
2. Follow platform-specific guide
3. Set up monitoring
4. Configure custom domain
5. Implement CI/CD pipeline

## Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Web.dev Performance Guide](https://web.dev/performance)
- [Security Headers Reference](https://securityheaders.com)
- [12 Factor App Principles](https://12factor.net)