/**
 * Image Utility Functions
 * Handles image validation, conversion, and processing
 */

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  maxSizeBytes?: number;
  quality?: number;
}

// Supported image formats
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// Size limits
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const MIN_DIMENSION = 100;
const MAX_DIMENSION = 4096;

/**
 * Validate image file
 * Checks format, size, and dimensions
 */
export async function validateImageFile(file: File): Promise<ImageValidationResult> {
  // Check file type
  if (!SUPPORTED_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported image format. Supported formats: ${SUPPORTED_EXTENSIONS.join(', ')}`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Image file is too large (${formatBytes(file.size)}). Maximum size: ${formatBytes(MAX_FILE_SIZE_BYTES)}`,
    };
  }

  // Check dimensions
  try {
    const dimensions = await getImageDimensions(file);
    
    if (dimensions.width < MIN_DIMENSION || dimensions.height < MIN_DIMENSION) {
      return {
        valid: true,
        error: `Warning: Image dimensions are very small (${dimensions.width}x${dimensions.height}px). Minimum recommended: ${MIN_DIMENSION}x${MIN_DIMENSION}px. Generation may have poor quality.`,
        dimensions,
      };
    }

    if (dimensions.width > MAX_DIMENSION || dimensions.height > MAX_DIMENSION) {
      return {
        valid: true,
        error: `Warning: Image dimensions are very large (${dimensions.width}x${dimensions.height}px). Will be resized to maximum ${MAX_DIMENSION}x${MAX_DIMENSION}px.`,
        dimensions,
      };
    }

    return {
      valid: true,
      dimensions,
    };
  } catch (error) {
    return {
      valid: false,
      error: `Unable to process image. Please try a different image. Error: ${(error as Error).message}`,
    };
  }
}

/**
 * Validate base64 image string
 */
export async function validateBase64Image(base64String: string): Promise<ImageValidationResult> {
  try {
    // Check if it's valid base64
    if (!isValidBase64(base64String)) {
      return {
        valid: false,
        error: 'Invalid base64 image string',
      };
    }

    // Check size
    const sizeBytes = Math.ceil((base64String.length * 3) / 4);
    if (sizeBytes > MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: `Image is too large (${formatBytes(sizeBytes)}). Maximum size: ${formatBytes(MAX_FILE_SIZE_BYTES)}`,
      };
    }

    // Get dimensions from base64
    const dimensions = await getBase64ImageDimensions(base64String);
    
    if (dimensions.width < MIN_DIMENSION || dimensions.height < MIN_DIMENSION) {
      return {
        valid: true,
        error: `Warning: Image dimensions are very small (${dimensions.width}x${dimensions.height}px).`,
        dimensions,
      };
    }

    return {
      valid: true,
      dimensions,
    };
  } catch (error) {
    return {
      valid: false,
      error: `Unable to validate image. Error: ${(error as Error).message}`,
    };
  }
}

/**
 * Convert File to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Convert base64 string to File
 */
export function base64ToFile(base64String: string, filename: string): File {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  
  return new File([u8arr], filename, { type: mime });
}

/**
 * Compress image
 * Resizes and reduces quality if needed
 */
export async function compressImage(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = MAX_DIMENSION,
    maxHeight = MAX_DIMENSION,
    maxSizeBytes = MAX_FILE_SIZE_BYTES,
    quality = 0.8,
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            // Check if compressed size is still too large
            if (blob.size > maxSizeBytes) {
              // Try again with lower quality
              if (quality > 0.5) {
                compressImage(file, {
                  ...options,
                  quality: quality - 0.1,
                }).then(resolve).catch(reject);
              } else {
                reject(new Error('Unable to compress image to required size'));
              }
              return;
            }

            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: file.lastModified,
            });

            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Get image dimensions from File
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        });
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Get image dimensions from base64 string
 */
export function getBase64ImageDimensions(base64String: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = base64String;
  });
}

/**
 * Check if string is valid base64
 */
function isValidBase64(str: string): boolean {
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * Math.pow(10, dm)) / Math.pow(10, dm) + ' ' + sizes[i];
}

/**
 * Extract MIME type from base64 string
 */
export function getBase64MimeType(base64String: string): string | null {
  const match = base64String.match(/^data:([^;]+);base64,/);
  return match ? match[1] : null;
}

/**
 * Check if image is URL (HTTP/HTTPS only, not data URIs)
 */
export function isImageUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Check if string is base64 image
 */
export function isBase64Image(str: string): boolean {
  return str.startsWith('data:image/') && str.includes(';base64,');
}

/**
 * Generate image preview (thumbnail)
 * Returns base64 data URL for preview display
 */
export async function generateImagePreview(file: File): Promise<string> {
  return fileToBase64(file);
}

/**
 * Get image metadata
 * Returns dimensions and file size
 */
export async function getImageMetadata(file: File): Promise<{
  width: number;
  height: number;
  size: number;
  format: string;
}> {
  const dimensions = await getImageDimensions(file);
  const format = file.type.split('/')[1] || 'unknown';
  
  return {
    width: dimensions.width,
    height: dimensions.height,
    size: file.size,
    format,
  };
}

/**
 * Convert image for API (to base64 or keep URL)
 * If image is already a URL, return it as-is
 * If image is a File or base64, convert to base64
 */
export async function convertImageForAPI(imageInput: File | string): Promise<string> {
  // If it's already a URL, return as-is
  if (typeof imageInput === 'string' && isImageUrl(imageInput)) {
    return imageInput;
  }

  // If it's a File, convert to base64
  if (imageInput instanceof File) {
    return fileToBase64(imageInput);
  }

  // If it's already base64, return as-is
  if (typeof imageInput === 'string' && isBase64Image(imageInput)) {
    return imageInput;
  }

  throw new Error('Invalid image input: must be a File, URL, or base64 string');
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  return formatBytes(bytes);
}

