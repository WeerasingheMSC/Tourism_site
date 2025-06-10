import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Initialize Firebase Admin SDK
 * Two methods are supported:
 * 1. Using service account JSON file (recommended for development)
 * 2. Using environment variables (recommended for production)
 */

let firebaseApp = null;
let bucket = null;

/**
 * Fix private key formatting issues
 * @param {string} privateKey - The private key string
 * @returns {string} Properly formatted private key
 */
const fixPrivateKeyFormat = (privateKey) => {
  if (!privateKey) return privateKey;
  
  // Remove any extra whitespace and normalize line endings
  let fixedKey = privateKey.trim();
  
  // If the key doesn't have proper line breaks, add them
  if (!fixedKey.includes('\n')) {
    // Replace \\n with actual line breaks
    fixedKey = fixedKey.replace(/\\n/g, '\n');
  }
  
  // Ensure proper PEM format
  if (!fixedKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
    console.warn('⚠️ Private key does not start with proper PEM header');
  }
  
  if (!fixedKey.endsWith('-----END PRIVATE KEY-----')) {
    console.warn('⚠️ Private key does not end with proper PEM footer');
  }
  
  return fixedKey;
};

const initializeFirebase = async () => {
  try {
    // Prevent multiple initializations
    if (admin.apps.length > 0) {
      console.log('🔥 Firebase already initialized');
      firebaseApp = admin.apps[0];
      bucket = admin.storage().bucket();
      return { app: firebaseApp, bucket };
    }

    let credential;
    let storageBucket;

    // Method 1: Using environment variables (recommended for production)
    if (process.env.FIREBASE_PRIVATE_KEY) {
      console.log('🔑 Initializing Firebase with environment variables...');
      
      const privateKey = fixPrivateKeyFormat(process.env.FIREBASE_PRIVATE_KEY);
      
      credential = admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        clientId: process.env.FIREBASE_CLIENT_ID,
        authUri: process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
        tokenUri: process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
        authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs'
      });
      
      storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
    } 
    // Method 2: Using service account JSON file (recommended for development)
    else {
      console.log('📁 Initializing Firebase with service account file...');
      
      try {
        // Read the service account file using fs
        const serviceAccountPath = join(__dirname, 'serviceAccountKey.json');
        const serviceAccountContent = readFileSync(serviceAccountPath, 'utf8');
        
        // Check if the file is empty
        if (!serviceAccountContent.trim()) {
          throw new Error('Service account file is empty');
        }
        
        const serviceAccount = JSON.parse(serviceAccountContent);
        
        // Validate required fields
        if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
          throw new Error('Service account file is missing required fields (project_id, private_key, client_email)');
        }
        
        // Fix private key formatting
        const fixedServiceAccount = {
          ...serviceAccount,
          private_key: fixPrivateKeyFormat(serviceAccount.private_key)
        };
        
        console.log('🔧 Validating private key format...');
        
        credential = admin.credential.cert(fixedServiceAccount);
        storageBucket = process.env.FIREBASE_STORAGE_BUCKET || serviceAccount.project_id + '.appspot.com';
        
        console.log('✅ Private key format validation passed');
        
      } catch (fileError) {
        console.error('❌ Error reading service account file:', fileError.message);
        
        if (fileError.message.includes('ENOENT')) {
          throw new Error(
            'Service account file not found. Please:\n' +
            '1. Download your Firebase service account key from Firebase Console\n' +
            '2. Save it as "serviceAccountKey.json" in the config/ folder\n' +
            '3. Ensure the file path is correct'
          );
        } else if (fileError.message.includes('JSON')) {
          throw new Error(
            'Invalid JSON in service account file. Please:\n' +
            '1. Ensure the downloaded file is valid JSON\n' +
            '2. Check for any syntax errors\n' +
            '3. Re-download the file if necessary'
          );
        } else if (fileError.message.includes('private_key')) {
          throw new Error(
            'Private key format issue. Please:\n' +
            '1. Re-download the service account key from Firebase Console\n' +
            '2. Ensure you downloaded the file directly (not copy-pasted)\n' +
            '3. Check that the private_key field contains proper PEM format'
          );
        } else {
          throw fileError;
        }
      }
    }

    // Validate storage bucket
    if (!storageBucket) {
      throw new Error('Firebase storage bucket not configured. Please set FIREBASE_STORAGE_BUCKET environment variable.');
    }

    // Initialize Firebase app
    console.log('🚀 Initializing Firebase app...');
    firebaseApp = admin.initializeApp({
      credential,
      storageBucket
    });

    // Get storage bucket reference
    bucket = admin.storage().bucket();

    console.log('✅ Firebase Admin SDK initialized successfully');
    console.log(`🪣 Storage bucket: ${storageBucket}`);

    // Test bucket access
    try {
      const [bucketExists] = await bucket.exists();
      if (bucketExists) {
        console.log('✅ Storage bucket is accessible');
      } else {
        console.warn('⚠️  Storage bucket does not exist or is not accessible');
        console.log('💡 Make sure Firebase Storage is enabled in your project');
      }
    } catch (bucketError) {
      console.warn('⚠️  Could not verify bucket access:', bucketError.message);
      console.log('💡 This might be a permissions issue or network connectivity');
    }

    return { app: firebaseApp, bucket };

  } catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    console.log('\n📝 Firebase Setup Instructions:');
    console.log('=================================');
    console.log('1. Go to Firebase Console (https://console.firebase.google.com/)');
    console.log('2. Select your project (tourism-67334)');
    console.log('3. Go to Project Settings > Service Accounts');
    console.log('4. Click "Generate new private key"');
    console.log('5. Download the JSON file (don\'t copy-paste)');
    console.log('6. Save it as "serviceAccountKey.json" in config/ folder');
    console.log('7. Enable Firebase Storage in your project');
    console.log('8. Set FIREBASE_STORAGE_BUCKET=tourism-67334.firebasestorage.app in .env');
    console.log('\n🔧 Common Issues:');
    console.log('- Ensure you download the file directly (don\'t copy-paste the content)');
    console.log('- Check that the private_key field has proper line breaks');
    console.log('- Verify the project ID matches your storage bucket');
    
    throw error;
  }
};

// Initialize Firebase on module load with better error handling
const firebasePromise = initializeFirebase().catch(error => {
  console.error('❌ Failed to initialize Firebase on startup:', error.message);
  console.log('⚠️  Server will continue without Firebase. File uploads will not work.');
  return { app: null, bucket: null };
});

/**
 * Get Firebase app instance
 * @returns {Promise<admin.app.App>} Firebase app instance
 */
export const getFirebaseApp = async () => {
  const { app } = await firebasePromise;
  if (!app) {
    throw new Error('Firebase app is not initialized. Please check your configuration.');
  }
  return app;
};

/**
 * Get Firebase storage bucket instance
 * @returns {Promise<admin.storage.Bucket>} Firebase storage bucket instance
 */
export const getFirebaseBucket = async () => {
  const { bucket: bucketInstance } = await firebasePromise;
  if (!bucketInstance) {
    throw new Error('Firebase storage bucket is not initialized. Please check your configuration.');
  }
  return bucketInstance;
};

/**
 * Check if Firebase is properly initialized
 * @returns {Promise<boolean>} True if Firebase is initialized
 */
export const isFirebaseInitialized = async () => {
  try {
    const { app, bucket: bucketInstance } = await firebasePromise;
    return !!(app && bucketInstance);
  } catch (error) {
    return false;
  }
};

/**
 * Get Firebase configuration status
 * @returns {Promise<Object>} Configuration status
 */
export const getFirebaseStatus = async () => {
  try {
    const isInitialized = await isFirebaseInitialized();
    
    if (!isInitialized) {
      return {
        status: 'error',
        message: 'Firebase is not initialized',
        initialized: false
      };
    }

    const bucketInstance = await getFirebaseBucket();
    const [bucketExists] = await bucketInstance.exists();

    return {
      status: 'success',
      message: 'Firebase is properly configured',
      initialized: true,
      bucketExists,
      bucketName: bucketInstance.name,
      projectId: firebaseApp.options.projectId
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
      initialized: false
    };
  }
};

export default {
  getFirebaseApp,
  getFirebaseBucket,
  isFirebaseInitialized,
  getFirebaseStatus
};
