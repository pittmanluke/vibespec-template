import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { HttpsError, onCall, CallableRequest, FunctionsErrorCode } from 'firebase-functions/v2/https';

// Initialize Firebase Admin
admin.initializeApp();

/**
 * Structured error response format
 */
interface ErrorResponse {
  code: string;       // Machine-readable error code
  message: string;    // User-friendly message
  details?: unknown;  // Additional context (when safe)
  traceId?: string;   // For support reference
}

/**
 * Helper function to handle errors consistently
 */
function handleError(error: Error | unknown, customMessage: string, errorCode: FunctionsErrorCode): HttpsError {
  logger.error(customMessage, error);
  
  // Generate a trace ID for tracking this error instance
  const traceId = Date.now().toString(36) + Math.random().toString(36).substring(2);
  
  // Log with trace ID for server-side tracking
  logger.error(`Error ID: ${traceId}`, { error });
  
  // Determine if we should expose the original error message
  const isDetailSafe = process.env.NODE_ENV !== 'production' || 
                       errorCode === 'invalid-argument' || 
                       errorCode === 'not-found';
  
  const errorResponse: ErrorResponse = {
    code: errorCode,
    message: customMessage,
    traceId
  };
  
  // Only include details in non-production environments or for safe errors
  if (isDetailSafe && error instanceof Error) {
    errorResponse.details = error.message;
  }
  
  return new HttpsError(errorCode, customMessage, errorResponse);
}

// Example: Trigger when a new user document is created
export const onUserCreated = onDocumentCreated('users/{userId}', async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.error('No data associated with the event');
    return;
  }
  
  const userData = snapshot.data();
  const userId = event.params.userId;
  
  logger.info(`New user created: ${userId}`, { userData });
  
  // Example: Send welcome email, create default settings, etc.
  // await sendWelcomeEmail(userData.email);
});

// Example: Callable function with authentication
export const exampleCallableFunction = onCall({
  cors: true,
  enforceAppCheck: false, // Enable for production
}, async (request: CallableRequest) => {
  // Check authentication
  if (!request.auth) {
    throw handleError(
      new Error('User not authenticated'),
      'Authentication required',
      'unauthenticated'
    );
  }
  
  try {
    // Your function logic here
    const { data } = request;
    
    // Example validation
    if (!data.someField) {
      throw handleError(
        new Error('Missing required field'),
        'someField is required',
        'invalid-argument'
      );
    }
    
    // Example operation
    const result = {
      success: true,
      message: 'Operation completed successfully',
      userId: request.auth.uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };
    
    return result;
    
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error;
    }
    throw handleError(error, 'An unexpected error occurred', 'internal');
  }
});