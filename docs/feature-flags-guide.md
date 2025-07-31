# Feature Flags Guide

This guide explains how to use the feature flag system in the VibeSpec template to toggle between mock services and real Firebase services.

## Overview

The VibeSpec template includes a powerful feature flag system that allows you to:
- Start developing immediately without any Firebase setup
- Gradually adopt Firebase services as needed
- Switch between mock and real services with environment variables
- Save costs during development by using local mock services

## Quick Start

### 1. Initial Setup (Zero Configuration)

```bash
# Clone the template
npx create-next-app@latest my-app --example github.com/pittmanluke/vibespec-template
cd my-app

# Copy environment variables
cp .env.local.example .env.local

# Start developing (with mock services)
npm run dev
```

By default, all Firebase services are disabled and mock services are used.

### 2. Default Configuration

Your `.env.local` file starts with:

```env
# All Firebase services disabled by default
NEXT_PUBLIC_USE_FIREBASE_AUTH=false
NEXT_PUBLIC_USE_FIRESTORE=false
NEXT_PUBLIC_USE_STORAGE=false
```

## Understanding Feature Flags

This template has two types of feature flags:

1. **Firebase Service Flags** - Control whether to use mock or real Firebase services
2. **Application Feature Flags** - Control which app features are enabled

### Firebase Service Flags

| Flag | Purpose | When `false` (Default) | When `true` |
|------|---------|------------------------|-------------|
| `NEXT_PUBLIC_USE_FIREBASE_AUTH` | Authentication | Mock auth (any email/password works) | Real Firebase Auth |
| `NEXT_PUBLIC_USE_FIRESTORE` | Database | localStorage persistence | Real Firestore |
| `NEXT_PUBLIC_USE_STORAGE` | File Storage | Browser File API | Firebase Storage |

### Application Feature Flags

Located in `/src/lib/feature-flags.ts`:

| Flag | Purpose | Default | Environment Variable |
|------|---------|---------|---------------------|
| `enableUserOnboarding` | Redirect new users to onboarding flow | `true` | `NEXT_PUBLIC_ENABLE_USER_ONBOARDING` |

The feature flags system is extensible - you can add your own flags as needed:

```typescript
export interface FeatureFlags {
  enableUserOnboarding: boolean;  // Currently implemented
  
  // Example flags you could add:
  // enableEmailSubscription: boolean;
  // enableAdminFeatures: boolean;
  // enableDebugMode: boolean;
  // enableBetaFeatures: boolean;
}
```

## Using Mock Services

### Mock Authentication
- **Any email/password combination works**
- Emails containing "admin" get admin role
- Sessions persist in localStorage
- Perfect for UI development and demos

Example users:
- `admin@example.com` / `any-password` → Admin user
- `user@example.com` / `any-password` → Regular user

### Mock Database
- Data saves to browser localStorage
- Persists across page refreshes
- Clears when browser data is cleared
- Same API as Firestore

### Mock Storage
- Files stored temporarily in browser
- No real upload occurs
- Useful for testing file UI

## Enabling Firebase Services

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable the services you need:
   - Authentication
   - Firestore Database
   - Storage

### Step 2: Get Configuration

From Firebase Console → Project Settings → Your apps → Web app:

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

### Step 3: Update Environment Variables

Update your `.env.local`:

```env
# Enable desired services
NEXT_PUBLIC_USE_FIREBASE_AUTH=true
NEXT_PUBLIC_USE_FIRESTORE=true
NEXT_PUBLIC_USE_STORAGE=true

# Add Firebase configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Step 4: Restart Development Server

```bash
# Stop the server (Ctrl+C)
# Start again
npm run dev
```

## Common Scenarios

### Scenario 1: Prototyping
Keep all flags `false`:
- No Firebase setup required
- Immediate development
- Perfect for demos

### Scenario 2: Gradual Adoption
Enable services one at a time:
```env
# Start with just auth
NEXT_PUBLIC_USE_FIREBASE_AUTH=true
NEXT_PUBLIC_USE_FIRESTORE=false  # Still using mock
NEXT_PUBLIC_USE_STORAGE=false    # Still using mock
```

### Scenario 3: Development vs Production
**Development** (`.env.local`):
```env
NEXT_PUBLIC_USE_FIREBASE_AUTH=false
```

**Production** (Vercel environment variables):
```env
NEXT_PUBLIC_USE_FIREBASE_AUTH=true
```

## Debugging

### Check Active Services
Open browser console to see:
```
🔥 Firebase Feature Status: {
  auth: 'Initialized',      // or 'Disabled'
  firestore: 'Initialized', // or 'Disabled'
  storage: 'Disabled',      // or 'Initialized'
}
```

### Common Issues

**Issue**: Changes to `.env.local` not working
**Solution**: Restart the development server

**Issue**: Firebase not initializing
**Solution**: Check all required config values are set

**Issue**: Mock data disappearing
**Solution**: Check browser's localStorage wasn't cleared

## Using Application Feature Flags

### Adding New Feature Flags

1. **Define the flag** in `/src/lib/feature-flags.ts`:
```typescript
export interface FeatureFlags {
  enableUserOnboarding: boolean;
  enableNewFeature: boolean;  // Add your flag
}
```

2. **Update the configuration**:
```typescript
const defaultFlags: FeatureFlags = {
  enableUserOnboarding: true,
  enableNewFeature: false,  // Set default value
};
```

3. **Add environment variable** (optional):
```typescript
const newFeatureEnabled = process.env.NEXT_PUBLIC_ENABLE_NEW_FEATURE;
```

4. **Create helper function**:
```typescript
export const isNewFeatureEnabled = () => featureFlags.enableNewFeature;
```

5. **Use in your code**:
```typescript
import { isNewFeatureEnabled } from '@/lib/feature-flags';

if (isNewFeatureEnabled()) {
  // Show new feature
}
```

### Current Implementation

The template includes one active application feature flag:

**User Onboarding** (`enableUserOnboarding`):
- Controls whether new users are redirected to an onboarding flow
- Used in `/src/services/auth/use-auth-form.ts`
- Can be disabled by setting `NEXT_PUBLIC_ENABLE_USER_ONBOARDING=false`

## Implementation Details

### Key Files

1. **Configuration**
   - `.env.local.example` - Environment template
   - `/src/config/firebase.config.ts` - Feature flag definitions
   - `/src/lib/firebase.ts` - Conditional initialization

2. **Service Switching**
   - `/src/providers/auth-provider.tsx` - Auth provider logic
   - `/src/services/auth/mock/mock-auth-service.ts` - Mock implementation

3. **Feature Flag Utilities**
   - `/src/lib/feature-flags.ts` - Application feature flags

### How It Works

1. **Environment Check**: The system reads environment variables
2. **Conditional Init**: Firebase only initializes if flags are `true`
3. **Service Selection**: Providers choose mock or real based on flags
4. **Graceful Fallback**: Missing config doesn't crash the app

## Best Practices

### Development
- Start with all flags `false`
- Enable Firebase services only when needed
- Use mock services for testing and demos

### Testing
- Test with both mock and real services
- Ensure UI works regardless of flag state
- Verify data migration when switching

### Production
- Set appropriate flags for your environment
- Use environment-specific configurations
- Monitor Firebase usage and costs

## Migration Guide

### From Mock to Firebase

1. **Export mock data** (if needed):
   ```javascript
   // In browser console
   localStorage.getItem('mockAuthUser')
   ```

2. **Enable Firebase flags**

3. **Set up Firebase security rules**

4. **Test thoroughly**

### From Firebase to Mock

Simply set flags to `false` - no code changes needed!

## Summary

The feature flag system provides:
- ✅ Zero-config development start
- ✅ Gradual Firebase adoption
- ✅ Cost-effective development
- ✅ Seamless service switching
- ✅ Same code for mock and real

Start with mocks, add Firebase when ready. It's that simple!