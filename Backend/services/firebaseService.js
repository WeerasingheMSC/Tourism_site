import { getFirebaseBucket, isFirebaseInitialized } from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload a single file to Firebase Storage
 * @param {Object} file - Multer file object
 * @param {string} folder - Folder name in storage bucket
 * @returns {Promise<Object>} Upload result with fileName and publicUrl
 */
export const uploadFile = async (file, folder = 'uploads') => {
  try {
    // Check if Firebase is initialized
    const isInitialized = await isFirebaseInitialized();
    if (!isInitialized) {
      throw new Error('Firebase Storage not initialized. Please check your configuration.');
    }

    const bucket = await getFirebaseBucket();

    // Validate file
    if (!file || !file.buffer) {
      throw new Error('Invalid file provided');
    }

    // Generate unique filename
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${folder}/${uuidv4()}_${Date.now()}.${fileExtension}`;
    
    // Create file reference
    const fileUpload = bucket.file(fileName);

    // Create write stream
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString()
        }
      },
      resumable: false // For smaller files, resumable upload is not needed
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        console.error('Upload stream error:', error);
        reject(new Error(`Upload failed: ${error.message}`));
      });

      stream.on('finish', async () => {
        try {
          // Make the file publicly accessible
          await fileUpload.makePublic();
          
          // Get the public URL
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          
          console.log(`✅ File uploaded successfully: ${fileName}`);
          
          resolve({
            fileName,
            publicUrl,
            size: file.size,
            mimetype: file.mimetype,
            originalName: file.originalname
          });
        } catch (error) {
          console.error('Error making file public:', error);
          reject(new Error(`Failed to make file public: ${error.message}`));
        }
      });

      // Write the file buffer to the stream
      stream.end(file.buffer);
    });
  } catch (error) {
    console.error('Upload file error:', error);
    throw error;
  }
};

/**
 * Upload multiple files to Firebase Storage
 * @param {Array} files - Array of Multer file objects
 * @param {string} folder - Folder name in storage bucket
 * @returns {Promise<Array>} Array of upload results
 */
export const uploadMultipleFiles = async (files, folder = 'uploads') => {
  try {
    if (!files || files.length === 0) {
      return [];
    }

    console.log(`📤 Uploading ${files.length} files to ${folder}...`);

    // Upload all files concurrently
    const uploadPromises = files.map(file => uploadFile(file, folder));
    const results = await Promise.all(uploadPromises);

    console.log(`✅ Successfully uploaded ${results.length} files`);
    return results;
  } catch (error) {
    console.error('Upload multiple files error:', error);
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage
 * @param {string} fileName - Full file path in storage bucket
 * @returns {Promise<boolean>} Success status
 */
export const deleteFile = async (fileName) => {
  try {
    // Check if Firebase is initialized
    const isInitialized = await isFirebaseInitialized();
    if (!isInitialized) {
      throw new Error('Firebase Storage not initialized. Please check your configuration.');
    }

    const bucket = await getFirebaseBucket();

    if (!fileName) {
      throw new Error('File name is required');
    }

    const file = bucket.file(fileName);
    
    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      console.warn(`⚠️  File not found: ${fileName}`);
      return true; // Consider it successful if file doesn't exist
    }

    // Delete the file
    await file.delete();
    console.log(`🗑️  File deleted successfully: ${fileName}`);
    
    return true;
  } catch (error) {
    console.error('Delete file error:', error);
    throw error;
  }
};

/**
 * Delete multiple files from Firebase Storage
 * @param {Array} fileNames - Array of file paths
 * @returns {Promise<Array>} Array of deletion results
 */
export const deleteMultipleFiles = async (fileNames) => {
  try {
    if (!fileNames || fileNames.length === 0) {
      return [];
    }

    console.log(`🗑️  Deleting ${fileNames.length} files...`);

    // Delete all files concurrently
    const deletePromises = fileNames.map(fileName => 
      deleteFile(fileName).catch(error => {
        console.error(`Failed to delete ${fileName}:`, error);
        return false;
      })
    );
    
    const results = await Promise.all(deletePromises);
    const successCount = results.filter(result => result === true).length;
    
    console.log(`✅ Successfully deleted ${successCount}/${fileNames.length} files`);
    return results;
  } catch (error) {
    console.error('Delete multiple files error:', error);
    throw error;
  }
};

/**
 * Get file metadata from Firebase Storage
 * @param {string} fileName - Full file path in storage bucket
 * @returns {Promise<Object>} File metadata
 */
export const getFileMetadata = async (fileName) => {
  try {
    // Check if Firebase is initialized
    const isInitialized = await isFirebaseInitialized();
    if (!isInitialized) {
      throw new Error('Firebase Storage not initialized. Please check your configuration.');
    }

    const bucket = await getFirebaseBucket();
    const file = bucket.file(fileName);
    const [metadata] = await file.getMetadata();
    
    return {
      name: metadata.name,
      size: metadata.size,
      contentType: metadata.contentType,
      timeCreated: metadata.timeCreated,
      updated: metadata.updated,
      downloadUrl: `https://storage.googleapis.com/${bucket.name}/${fileName}`
    };
  } catch (error) {
    console.error('Get file metadata error:', error);
    throw error;
  }
};

/**
 * Validate file before upload
 * @param {Object} file - Multer file object
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
  } = options;

  const errors = [];

  // Check file exists
  if (!file) {
    errors.push('No file provided');
    return { isValid: false, errors };
  }

  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${(maxSize / 1024 / 1024).toFixed(2)}MB)`);
  }

  // Check MIME type
  if (!allowedTypes.includes(file.mimetype)) {
    errors.push(`File type ${file.mimetype} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }

  // Check file extension
  const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    errors.push(`File extension .${fileExtension} is not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    fileInfo: {
      name: file.originalname,
      size: file.size,
      type: file.mimetype,
      extension: fileExtension
    }
  };
};

export default {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  deleteMultipleFiles,
  getFileMetadata,
  validateFile
};