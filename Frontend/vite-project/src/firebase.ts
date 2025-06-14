// src/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

// 1️⃣ Your Firebase config (put these in .env as VITE_…)
const firebaseConfig = {
  apiKey:           import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:       import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:        import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:            import.meta.env.VITE_FIREBASE_APP_ID,
};

// 2️⃣ Initialize Firebase
const app = initializeApp(firebaseConfig);

// 3️⃣ Get a reference to storage
const storage = getStorage(app);

/**
 * Upload a single file to Firebase Storage under `folder/filename` and return its download URL.
 */
export async function uploadFileAndGetURL(
  file: File,
  folder: string
): Promise<string> {
  // Create a unique filename
  const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
  // Upload the file
  await uploadBytes(fileRef, file);
  // Get the public URL
  return getDownloadURL(fileRef);
}
