# Feature Flags

This document explains the feature flag system that enables flexible service toggling in VibeSpec projects.

## Overview

Feature flags allow you to:
- Start development without external dependencies
- Gradually adopt services as needed
- Test with and without services
- Deploy with different configurations

## Firebase Service Flags

All Firebase services can be toggled via environment variables:

### Available Flags

```bash
# Authentication service
NEXT_PUBLIC_USE_FIREBASE_AUTH=false

# Firestore database
NEXT_PUBLIC_USE_FIRESTORE=false

# Cloud Storage
NEXT_PUBLIC_USE_STORAGE=false

# Cloud Functions
NEXT_PUBLIC_USE_FUNCTIONS=false
```

### How It Works

Each flag controls whether to use the real Firebase service or a mock implementation:

```typescript
// lib/feature-flags.ts
export const USE_FIREBASE_AUTH = 
  process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH === 'true'

// services/auth/index.ts
import { USE_FIREBASE_AUTH } from '@/lib/feature-flags'

export const authService = USE_FIREBASE_AUTH
  ? new FirebaseAuthService()
  : new MockAuthService()
```

## Mock Services Pattern

When a Firebase service is disabled, mock services provide the same API:

### Mock Authentication

Location: `src/services/auth/mock/mock-auth-service.ts`

Features:
- Sessions persist in localStorage
- Any email/password combination works
- Emails containing "admin" get admin role
- Instant response (no network delay)

```typescript
// Example usage
const mockAuth = new MockAuthService()

// Sign in - always succeeds
await mockAuth.signIn('user@example.com', 'any-password')

// Admin detection
await mockAuth.signIn('admin@company.com', 'password')
// Returns user with role: 'admin'
```

### Mock Firestore

When `USE_FIRESTORE=false`, data operations use localStorage:

```typescript
export class MockFirestoreService {
  async getDocument(path: string) {
    const data = localStorage.getItem(`firestore:${path}`)
    return data ? JSON.parse(data) : null
  }
  
  async setDocument(path: string, data: any) {
    localStorage.setItem(`firestore:${path}`, JSON.stringify(data))
  }
}
```

### Mock Storage

File uploads are simulated with base64 in localStorage:

```typescript
export class MockStorageService {
  async uploadFile(path: string, file: File) {
    const base64 = await fileToBase64(file)
    localStorage.setItem(`storage:${path}`, base64)
    return `mock://storage/${path}`
  }
}
```

## Development Workflow

### 1. Start with All Flags Disabled

```bash
# .env.local
NEXT_PUBLIC_USE_FIREBASE_AUTH=false
NEXT_PUBLIC_USE_FIRESTORE=false
NEXT_PUBLIC_USE_STORAGE=false
NEXT_PUBLIC_USE_FUNCTIONS=false
```

Benefits:
- No Firebase setup required
- Immediate development start
- Predictable behavior
- Works offline

### 2. Enable Services Gradually

```bash
# Enable auth first
NEXT_PUBLIC_USE_FIREBASE_AUTH=true

# Test auth works, then add Firestore
NEXT_PUBLIC_USE_FIRESTORE=true

# Continue with other services as needed
```

### 3. Test Both States

Always test with services both enabled and disabled:

```typescript
// Component should work in both states
function UserProfile() {
  const { user } = useAuth()  // Works with mock or real
  
  if (!user) return <LoginPrompt />
  
  return <Profile user={user} />
}
```

## Implementation Guide

### Creating a New Mock Service

1. **Define the interface**
   ```typescript
   // services/email/types.ts
   export interface EmailService {
     sendEmail(to: string, subject: string, body: string): Promise<void>
     getEmails(userId: string): Promise<Email[]>
   }
   ```

2. **Implement mock version**
   ```typescript
   // services/email/mock/mock-email-service.ts
   export class MockEmailService implements EmailService {
     async sendEmail(to: string, subject: string, body: string) {
       console.log(`Mock: Sending email to ${to}`)
       // Store in localStorage for testing
       const emails = this.getStoredEmails()
       emails.push({ to, subject, body, sentAt: new Date() })
       localStorage.setItem('mock-emails', JSON.stringify(emails))
     }
     
     async getEmails(userId: string) {
       const emails = this.getStoredEmails()
       return emails.filter(e => e.to === userId)
     }
     
     private getStoredEmails() {
       const stored = localStorage.getItem('mock-emails')
       return stored ? JSON.parse(stored) : []
     }
   }
   ```

3. **Implement real version**
   ```typescript
   // services/email/email-service.ts
   export class EmailService implements EmailService {
     async sendEmail(to: string, subject: string, body: string) {
       const response = await fetch('/api/send-email', {
         method: 'POST',
         body: JSON.stringify({ to, subject, body })
       })
       
       if (!response.ok) {
         throw new Error('Failed to send email')
       }
     }
     
     async getEmails(userId: string) {
       const response = await fetch(`/api/emails/${userId}`)
       return response.json()
     }
   }
   ```

4. **Add feature flag**
   ```typescript
   // lib/feature-flags.ts
   export const USE_EMAIL_SERVICE = 
     process.env.NEXT_PUBLIC_USE_EMAIL_SERVICE === 'true'
   ```

5. **Export with toggle**
   ```typescript
   // services/email/index.ts
   import { USE_EMAIL_SERVICE } from '@/lib/feature-flags'
   
   export const emailService = USE_EMAIL_SERVICE
     ? new EmailService()
     : new MockEmailService()
   ```

### Using Feature Flags in Components

```typescript
// Direct flag usage
import { USE_FIREBASE_AUTH } from '@/lib/feature-flags'

function AuthStatus() {
  if (!USE_FIREBASE_AUTH) {
    return (
      <Alert>
        <AlertDescription>
          Using mock authentication (development mode)
        </AlertDescription>
      </Alert>
    )
  }
  
  return <div>Connected to Firebase</div>
}
```

### Conditional Features

Some features might only make sense with real services:

```typescript
function UserProfile() {
  const { user } = useAuth()
  
  return (
    <div>
      <h1>{user.name}</h1>
      
      {USE_FIREBASE_STORAGE && (
        <AvatarUpload userId={user.id} />
      )}
      
      {!USE_FIREBASE_STORAGE && (
        <p>Avatar upload available in production</p>
      )}
    </div>
  )
}
```

## Best Practices

### 1. Always Provide Mocks

Every external service should have a mock:

```typescript
// ✅ Good: Has mock
export const authService = USE_FIREBASE_AUTH
  ? new FirebaseAuthService()
  : new MockAuthService()

// ❌ Bad: No fallback
export const authService = new FirebaseAuthService()
```

### 2. Mock Behavior Should Match Real

Mocks should behave similarly to real services:

```typescript
// ✅ Good: Simulates network delay
async signIn(email: string, password: string) {
  // Simulate network delay
  await delay(500)
  
  // Simulate validation
  if (!email || !password) {
    throw new Error('Email and password required')
  }
  
  // Return mock user
  return { id: '1', email }
}
```

### 3. Test Error States

Mocks should help test error conditions:

```typescript
async signIn(email: string, password: string) {
  // Test error state
  if (email === 'error@test.com') {
    throw new Error('Network error')
  }
  
  // Test invalid credentials
  if (password === 'wrong') {
    throw new Error('Invalid credentials')
  }
  
  // Normal flow
  return { id: '1', email }
}
```

### 4. Document Mock Behavior

```typescript
/**
 * Mock authentication service for development.
 * 
 * Special behaviors:
 * - Any email/password works
 * - Emails with "admin" get admin role
 * - Email "error@test.com" triggers network error
 * - Password "wrong" triggers auth error
 * - Sessions persist in localStorage
 */
export class MockAuthService {
  // Implementation
}
```

## Production Configuration

### Deployment Environments

Different configurations for different environments:

```bash
# Development (.env.local)
NEXT_PUBLIC_USE_FIREBASE_AUTH=false
NEXT_PUBLIC_USE_FIRESTORE=false

# Staging (.env.staging)
NEXT_PUBLIC_USE_FIREBASE_AUTH=true
NEXT_PUBLIC_USE_FIRESTORE=true
NEXT_PUBLIC_USE_STORAGE=false  # Not ready yet

# Production (.env.production)
NEXT_PUBLIC_USE_FIREBASE_AUTH=true
NEXT_PUBLIC_USE_FIRESTORE=true
NEXT_PUBLIC_USE_STORAGE=true
```

### Gradual Rollout

Enable features for specific users:

```typescript
export function useFeatureFlag(flag: string) {
  const { user } = useAuth()
  
  // Check environment flag first
  if (process.env[`NEXT_PUBLIC_${flag}`] === 'true') {
    return true
  }
  
  // Check user-specific flags
  if (user?.features?.includes(flag)) {
    return true
  }
  
  return false
}
```

## Troubleshooting

### Service Not Switching

If toggling flags doesn't switch services:

1. **Restart dev server** - Environment variables are loaded at startup
2. **Clear cache** - Try hard refresh
3. **Check flag name** - Must match exactly
4. **Verify import** - Ensure using the toggled service

### Mock Data Persistence

Mock data in localStorage:

```bash
# View all mock data
localStorage

# Clear specific service
localStorage.removeItem('mock-auth-user')

# Clear all mock data
localStorage.clear()
```

### Type Mismatches

Ensure mock and real services implement same interface:

```typescript
// ✅ Good: Implements interface
class MockAuthService implements IAuthService {
  // All methods from interface
}

class FirebaseAuthService implements IAuthService {
  // Same methods
}
```

## Summary

Feature flags enable:
- **Flexible development** - Work with or without services
- **Progressive adoption** - Add services as needed
- **Better testing** - Test all scenarios
- **Risk mitigation** - Deploy features safely
- **Faster development** - No blocked dependencies