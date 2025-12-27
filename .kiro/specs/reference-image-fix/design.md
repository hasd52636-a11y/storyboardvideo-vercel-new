# Design Document: Reference Image Support in Image Generation

## Overview

This design addresses the critical bug where reference images are not being passed through the image generation pipeline. The fix involves modifying the `ImageGenerationService`, `ImageGenerationAdapter`, and related components to properly capture, validate, and forward reference images to the image generation APIs.

The solution maintains backward compatibility by making reference images optional while ensuring that when provided, they are correctly passed through all layers of the system.

## Architecture

### Current Flow (Broken)
```
User uploads image → QuickStoryboard captures image
  ↓
User triggers generation (e.g., Three-View)
  ↓
QuickStoryboard calls ImageGenerationService.generateImages()
  ├─ prompt: "Generate front orthographic view..." ✅
  └─ referenceImage: undefined ❌ (NOT PASSED)
  ↓
ImageGenerationService calls adapter.generateImages()
  ├─ prompt: "Generate front orthographic view..." ✅
  └─ referenceImage: undefined ❌ (NOT PASSED)
  ↓
API receives only prompt, ignores reference image
  ↓
Generated images are pure text-based, not based on original image
```

### Fixed Flow
```
User uploads image → QuickStoryboard captures image
  ↓
User triggers generation (e.g., Three-View)
  ↓
QuickStoryboard calls ImageGenerationService.generateImages()
  ├─ prompt: "Generate front orthographic view..." ✅
  └─ referenceImage: base64 or URL ✅ (PASSED)
  ↓
ImageGenerationService validates and passes to adapter
  ├─ prompt: "Generate front orthographic view..." ✅
  └─ referenceImage: base64 or URL ✅ (PASSED)
  ↓
ImageGenerationAdapter formats for API
  ├─ prompt: "Generate front orthographic view..." ✅
  └─ referenceImage: formatted for API ✅ (PASSED)
  ↓
API receives both prompt and reference image
  ↓
Generated images are based on reference image
```

## Components and Interfaces

### 1. ImageGenerationService Updates

**File**: `services/ImageGenerationService.ts`

**Changes**:
- Update `GenerationRequest` interface to include optional `referenceImage` parameter
- Update `generateImages()` method to accept and pass reference image
- Add reference image validation logic
- Update `callImageGenerationAPI()` to accept reference image parameter

**New Interface**:
```typescript
export interface GenerationRequest {
  type: GenerationType;
  userId: number;
  template: string;
  parameters: Record<string, string>;
  subject?: string;
  currentImage?: string;
  script?: string;
  referenceImage?: string;  // NEW: base64 or URL
  referenceImageWeight?: number;  // NEW: 0.0-1.0, default 0.8
}
```

**Key Methods**:
- `generateImages(request: GenerationRequest)`: Accept reference image in request
- `validateReferenceImage(image: string)`: Validate image format and size
- `callImageGenerationAPI(prompt, type, referenceImage?)`: Pass reference image to adapter

### 2. ImageGenerationAdapter Updates

**File**: `services/api/ImageGenerationAdapter.ts`

**Changes**:
- Update `IImageGenerationAdapter` interface to include reference image parameter
- Update all adapter implementations to accept reference image
- Add reference image formatting logic for each API type
- Update `APIManager.generateImages()` to accept and forward reference image

**New Interface**:
```typescript
export interface IImageGenerationAdapter {
  name: string;
  isAvailable(): Promise<boolean>;
  generateImages(
    prompt: string,
    count?: number,
    referenceImage?: string,
    referenceWeight?: number
  ): Promise<ImageGenerationAPIResponse>;
}
```

**Adapter Implementations**:
- `PrimaryAPIAdapter`: Format reference image for Sora/Gemini API
- `NanobanaAPIAdapter`: Format reference image for Nanobanana API
- `JiMengAPIAdapter`: Format reference image for 即梦 API

### 3. QuickStoryboard Component Updates

**File**: `components/QuickStoryboard.tsx`

**Changes**:
- Capture uploaded image when user drags symbol or uploads image
- Store reference image in component state
- Pass reference image to generation trigger
- Update `triggerGeneration()` to include reference image

**Key Changes**:
```typescript
const triggerGeneration = async (
  type: GenerationType,
  parameters: Record<string, string>,
  referenceImage?: string  // NEW
) => {
  await onGenerate?.(type, parameters, referenceImage);
};
```

### 4. Image Upload and Validation

**New Utility**: `lib/image-utils.ts`

**Functions**:
- `validateImageFile(file: File)`: Validate file type and size
- `fileToBase64(file: File)`: Convert file to base64 string
- `compressImage(base64: string, maxSize: number)`: Compress image if needed
- `getImageDimensions(base64: string)`: Get image dimensions

**Validation Rules**:
- Supported formats: JPEG, PNG, WebP, GIF
- Max file size: 5MB
- Min dimensions: 100x100px
- Max dimensions: 4096x4096px (will be resized if larger)

## Data Models

### Reference Image Storage

**In GenerationHistory**:
```typescript
interface GenerationHistory {
  id: string;
  userId: number;
  type: string;
  prompt: string;
  images: string[];
  referenceImage?: string;  // NEW: base64 or URL
  referenceImageWeight?: number;  // NEW
  metadata: Record<string, any>;
  createdAt: Date;
}
```

**In Metadata**:
```typescript
metadata: {
  type: 'three-view' | 'multi-grid' | 'style-comparison' | 'narrative-progression',
  timestamp: string,
  referenceImageUsed: boolean,  // NEW
  referenceImageDimensions?: {  // NEW
    width: number,
    height: number
  },
  referenceImageWeight?: number,  // NEW
  // ... other metadata
}
```

## Error Handling

### Reference Image Validation Errors

1. **Invalid Format**
   - Error: "Unsupported image format. Supported formats: JPEG, PNG, WebP, GIF"
   - Action: Display error to user, allow retry

2. **File Too Large**
   - Error: "Image file is too large (max 5MB). Compressing..."
   - Action: Automatically compress and retry

3. **Invalid Dimensions**
   - Warning: "Image dimensions are very small (100x100px). Generation may have poor quality."
   - Action: Allow user to proceed or re-upload

4. **Corrupted Image**
   - Error: "Unable to process image. Please try a different image."
   - Action: Display error to user, allow retry

### API Error Handling

1. **API Doesn't Support Reference Image**
   - Fallback: Proceed with text-only generation
   - Log: "API does not support reference images. Proceeding with text-only generation."

2. **Reference Image Rejected by API**
   - Error: "API rejected the reference image. Please try a different image."
   - Action: Display error to user, allow retry without reference image

3. **API Timeout with Reference Image**
   - Retry: Automatically retry up to 3 times
   - Fallback: If all retries fail, try text-only generation

## Testing Strategy

### Unit Tests

**Test File**: `services/__tests__/ImageGenerationService.test.ts`

**Test Cases**:
1. Reference image is passed through to adapter
2. Reference image validation rejects invalid formats
3. Reference image validation rejects oversized images
4. Reference image is optional (backward compatibility)
5. Reference image weight is applied correctly
6. Reference image is persisted to database

**Test File**: `services/api/__tests__/ImageGenerationAdapter.test.ts`

**Test Cases**:
1. Adapter accepts reference image parameter
2. Adapter formats reference image for API
3. Adapter handles missing reference image gracefully
4. Adapter handles API rejection of reference image
5. Adapter falls back to text-only generation if needed

**Test File**: `lib/__tests__/image-utils.test.ts`

**Test Cases**:
1. Image validation accepts valid formats
2. Image validation rejects invalid formats
3. Image validation rejects oversized files
4. File to base64 conversion works correctly
5. Image compression reduces file size
6. Image dimension detection works correctly

### Property-Based Tests

**Property 1: Reference Image Round-Trip**
- For any valid reference image, passing it through the service and adapter should preserve the image data
- **Validates: Requirements 1.1, 2.1**

**Property 2: Backward Compatibility**
- For any generation request without a reference image, the system should behave identically to before the fix
- **Validates: Requirements 9.1, 9.2, 9.3**

**Property 3: Reference Image Validation**
- For any invalid reference image, the system should reject it with a descriptive error
- **Validates: Requirements 8.1, 8.2, 8.3**

**Property 4: Three-View with Reference Image**
- For any valid reference image, three-view generation should produce three orthographic views based on that image
- **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

**Property 5: Multi-Grid with Reference Image**
- For any valid reference image, multi-grid generation should produce multiple camera angles of that image
- **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

**Property 6: Style Comparison with Reference Image**
- For any valid reference image, style comparison should produce variations of that image in different styles
- **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

**Property 7: Narrative Progression with Reference Image**
- For any valid reference image, narrative progression should produce sequential frames starting from that image
- **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Reference Image Preservation
*For any* valid reference image passed to the Image Generation Service, the image data should be preserved and passed to the adapter without modification or loss.
**Validates: Requirements 1.1, 1.2, 1.3, 1.4**

### Property 2: Backward Compatibility Invariant
*For any* generation request that does not include a reference image, the system should behave identically to the pre-fix version, producing the same results.
**Validates: Requirements 9.1, 9.2, 9.3, 9.4**

### Property 3: Reference Image Validation
*For any* invalid reference image (wrong format, oversized, corrupted), the system should reject it with a descriptive error message and not attempt to send it to the API.
**Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

### Property 4: Three-View Generation with Reference
*For any* valid reference image, three-view generation should produce three orthographic views (front, side, top) that visually represent the reference image from different angles.
**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

### Property 5: Multi-Grid Generation with Reference
*For any* valid reference image and frame count N (2-12), multi-grid generation should produce N frames showing different camera angles of the reference image.
**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

### Property 6: Style Comparison with Reference
*For any* valid reference image, style comparison generation should produce 5 variations of the reference image in different artistic styles.
**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

### Property 7: Narrative Progression with Reference
*For any* valid reference image, narrative progression generation should produce sequential frames showing story progression starting from the reference image.
**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

### Property 8: Reference Image Format Support
*For any* supported image format (JPEG, PNG, WebP, GIF), the system should accept and process it correctly.
**Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

### Property 9: Reference Image Persistence
*For any* generated image with a reference image, the reference image should be persisted to the database along with the generation metadata.
**Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

### Property 10: Error Handling Completeness
*For any* error condition (invalid image, API rejection, timeout), the system should return a descriptive error message and allow the user to retry or proceed without the reference image.
**Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**

## Implementation Notes

### Phase 1: Core Reference Image Support
1. Update `GenerationRequest` interface to include reference image
2. Add reference image validation utility functions
3. Update `ImageGenerationService` to accept and validate reference images
4. Update `ImageGenerationAdapter` to accept and forward reference images
5. Write unit tests for core functionality

### Phase 2: Component Integration
1. Update `QuickStoryboard` component to capture and pass reference images
2. Update generation trigger functions to include reference image
3. Update database schema to store reference image metadata
4. Write integration tests

### Phase 3: Error Handling and Fallback
1. Implement comprehensive error handling
2. Add fallback to text-only generation if API doesn't support reference images
3. Add retry logic for transient failures
4. Write error handling tests

### Phase 4: Testing and Validation
1. Write property-based tests for all correctness properties
2. Run comprehensive test suite
3. Validate against all requirements
4. Performance testing with large images

## Backward Compatibility

- Reference image parameter is optional in all interfaces
- Existing code that doesn't pass reference images will continue to work
- API adapters will gracefully handle missing reference images
- Database schema changes are additive (new optional fields)
- No breaking changes to existing APIs

## Performance Considerations

- Image compression happens asynchronously to avoid blocking UI
- Base64 encoding is done client-side to reduce server load
- Reference image size is limited to 5MB to prevent memory issues
- API calls with reference images may take longer (expected behavior)

## Security Considerations

- Validate image file types to prevent malicious uploads
- Limit image file size to prevent DoS attacks
- Sanitize image data before storing in database
- Use HTTPS for all image uploads and API calls
- Implement rate limiting on image generation endpoints

