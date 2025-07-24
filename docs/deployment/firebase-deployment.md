# Deploying to Firebase Hosting

This guide covers deploying your VibeSpec application to Firebase Hosting, which provides fast and secure hosting for web apps.

## Prerequisites

- [Firebase CLI](https://firebase.google.com/docs/cli) installed
- A Firebase project (create at [Firebase Console](https://console.firebase.google.com))
- Your VibeSpec project built locally
- Firebase services configured (if using)

## Initial Setup

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Firebase in Your Project

In your project root:

```bash
firebase init
```

Select the following options:
1. Choose "Hosting" (and other services if needed)
2. Select your existing Firebase project or create new
3. Set public directory to `out` (for static export) or `.next` (for SSR)
4. Configure as single-page app: No (Next.js handles routing)
5. Don't overwrite existing files

## Configuration

### Update firebase.json

For static export deployment:

```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "cleanUrls": true,
    "trailingSlash": false,
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|ico)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### Update package.json

Add deployment scripts:

```json
{
  "scripts": {
    "build:static": "next build && next export",
    "deploy": "npm run build:static && firebase deploy --only hosting",
    "deploy:preview": "npm run build:static && firebase hosting:channel:deploy preview"
  }
}
```

### Configure Next.js for Static Export

Update `next.config.ts`:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  // Add your domain for images if using external sources
  // images: {
  //   domains: ['your-domain.com'],
  // },
}

export default nextConfig
```

## Deployment Process

### Step 1: Build Your Application

For static export:
```bash
npm run build
npx next export
```

This creates an `out` directory with static files.

### Step 2: Deploy to Firebase

```bash
firebase deploy --only hosting
```

Your app will be available at:
- `https://[PROJECT-ID].web.app`
- `https://[PROJECT-ID].firebaseapp.com`

## Environment Variables

### Setting Environment Variables

Firebase Hosting doesn't support server-side environment variables. For static sites:

1. Use `NEXT_PUBLIC_` prefixed variables only
2. Set them during build time:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-key npm run build
```

Or create a `.env.production` file:

```bash
NEXT_PUBLIC_USE_FIREBASE_AUTH=true
NEXT_PUBLIC_USE_FIRESTORE=true
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

## Custom Domain Setup

### Step 1: Add Custom Domain

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter your domain
4. Verify ownership

### Step 2: Update DNS Records

Add these records at your DNS provider:

**For root domain:**
```
Type: A
Host: @
Value: [Firebase provides IPs]
```

**For subdomain:**
```
Type: CNAME
Host: app
Value: [PROJECT-ID].web.app
```

### Step 3: SSL Certificate

Firebase automatically provisions SSL certificates. Wait 24-48 hours for propagation.

## Preview Channels

Deploy to preview channels for testing:

```bash
# Deploy to a preview channel
firebase hosting:channel:deploy preview-feature-x

# Your preview URL will be:
# https://[PROJECT-ID]--preview-feature-x-[HASH].web.app
```

## CI/CD with GitHub Actions

### Create Workflow File

`.github/workflows/firebase-deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci --legacy-peer-deps
        
      - name: Build
        run: npm run build && npx next export
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

### Setup GitHub Secrets

1. Get service account key from Firebase Console
2. Add to GitHub repository secrets:
   - `FIREBASE_SERVICE_ACCOUNT`
   - Firebase config values

## Security Rules

Update `firebase.json` with security headers:

```json
{
  "hosting": {
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Frame-Options",
            "value": "SAMEORIGIN"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          }
        ]
      }
    ]
  }
}
```

## Performance Optimization

### 1. Enable Compression

```json
{
  "hosting": {
    "headers": [
      {
        "source": "**/*.@(js|css|html)",
        "headers": [
          {
            "key": "Content-Encoding",
            "value": "gzip"
          }
        ]
      }
    ]
  }
}
```

### 2. Configure Caching

```json
{
  "hosting": {
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=86400"
          }
        ]
      }
    ]
  }
}
```

## Monitoring

### Firebase Hosting Dashboard

Monitor your deployment:
1. Go to Firebase Console → Hosting
2. View usage statistics
3. Check domain status
4. Monitor bandwidth usage

### Performance Monitoring

Enable Firebase Performance Monitoring:

```typescript
import { getPerformance } from 'firebase/performance'

if (typeof window !== 'undefined') {
  const perf = getPerformance()
}
```

## Troubleshooting

### Common Issues

**Build fails with "out directory not found"**
- Ensure you run `next export` after `next build`
- Check `next.config.ts` has `output: 'export'`

**404 errors on routes**
- Verify `cleanUrls` is set to `true` in firebase.json
- Check that routes work locally

**Environment variables not working**
- Remember only `NEXT_PUBLIC_` variables work in static builds
- Set variables before building, not at runtime

**Images not loading**
- Use `unoptimized: true` in next.config.ts for static export
- Host images on Firebase Storage or CDN

### Rollback Deployment

View and rollback to previous versions:

```bash
# List recent deployments
firebase hosting:releases:list

# Rollback to previous
firebase hosting:rollback
```

## Cost Considerations

### Free Tier (Spark Plan)
- 10GB hosting storage
- 360MB/day bandwidth
- Custom domain support
- SSL certificates

### Optimizing Costs
1. Implement proper caching
2. Optimize images and assets
3. Use Firebase CDN effectively
4. Monitor usage in console

## Server-Side Rendering (SSR)

For SSR with Firebase Functions, see our [Advanced Firebase Deployment Guide](./firebase-ssr-deployment.md).

## Best Practices

1. **Use Preview Channels**: Test before production
2. **Automate Deployment**: Use GitHub Actions
3. **Monitor Performance**: Use Firebase tools
4. **Implement Caching**: Reduce bandwidth costs
5. **Security Headers**: Protect your app

## Next Steps

1. Set up custom domain
2. Configure CI/CD pipeline
3. Enable Firebase Performance Monitoring
4. Set up alerts for hosting issues
5. Implement proper caching strategy

## Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Next.js Static Export](https://nextjs.org/docs/advanced-features/static-html-export)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [GitHub Actions for Firebase](https://github.com/FirebaseExtended/action-hosting-deploy)