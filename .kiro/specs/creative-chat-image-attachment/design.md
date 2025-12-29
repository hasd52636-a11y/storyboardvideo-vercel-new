# Design Document: Creative Chat Image Attachment

## Overview

This design adds image attachment capability to the Creative Chat Mode in the right sidebar. Users can upload images via an attachment icon in the input area, and the system will send them to the Shenma API's gpt-4o model for analysis. The implementation maintains full backward compatibility with existing chat functionality.

## Architecture

### Component Structure

```
SidebarRight (existing)
├── Chat Tab Content
│   ├── Chat History Display (existing)
│   ├── Chat Input Area (modified)
│   │   ├── Textarea (existing)
│   │   ├── Image Preview Container (new)
│   │   │   ├── Thumbnail Preview
│   │   │   ├── Image Metadata (dimensions, size)
│   │   │   └── Remove Button
│   │   ├── Button Container (existing)
│   │   │   ├── Send Button (existing)
│   │   │   ├── Clear History Button (existing)
│   │   │   └── Attachment Button (new)
│   │   └── Hidden File Input (new)
│   └── Generate Storyboard Button (existing)
```

### Data Flow

```
User clicks attachment icon
    ↓
File picker opens
    ↓
User selects image
    ↓
Image validation (format, size)
    ↓
Image preview displayed
    ↓
User types message + clicks send
    ↓
Image converted to base64/URL
    ↓
Message + image sent to Shenma API
    ↓
API response received
    ↓
Response displayed in chat history
    ↓
Image attachment cleared
```

## Components and Interfaces

### 1. Image Attachment State Management

```typescript
interface ImageAttachmentState {
  file: File | null;
  preview: string; // base64 or URL
  dimensions: { width: number; height: number } | null;
  fileSize: number; // in bytes
  isLoading: boolean;
  error: string | null;
}
```

### 2. Modified Chat Input Component

The existing `SidebarRight` component will be enhanced with:

- New state: `attachedImage` (ImageAttachmentState)
- New handler: `handleImageSelect(file: File)`
- New handler: `handleRemoveImage()`
- New handler: `handleSendChatWithImage()`
- Modified handler: `handleSendChat()` to support images

### 3. Image Processing Utilities

Create a new utility file: `lib/image-utils.ts` (already exists, will be extended)

```typescript
// Image validation
export function validateImageFile(file: File): { valid: boolean; error?: string }

// Image preview generation
export function generateImagePreview(file: File): Promise<string>

// Image metadata extraction
export function getImageMetadata(file: File): Promise<{ width: number; height: number }>

// Image conversion for API
export function convertImageForAPI(preview: string): Promise<string>
```

### 4. API Integration

Modify the existing `handleSendChat` function to:

1. Check if an image is attached
2. If image exists:
   - Convert image to base64 or URL
   - Build message with image_url content type
   - Call Shenma API with image
3. If no image:
   - Use existing chat flow (unchanged)

### 5. Message Format for API

When image is attached, the message format will be:

```typescript
{
  role: 'user',
  content: [
    {
      type: 'text',
      text: 'User message text'
    },
    {
      type: 'image_url',
      image_url: {
        url: 'base64_or_url_here',
        detail: 'auto'
      }
    }
  ]
}
```

When no image is attached, the existing format is used:

```typescript
{
  role: 'user',
  content: 'User message text'
}
```

## Data Models

### ChatMessage (Extended)

The existing `ChatMessage` type will be extended to support images:

```typescript
interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  images?: string[]; // base64 or URLs
}
```

### Image Attachment Metadata

```typescript
interface ImageMetadata {
  width: number;
  height: number;
  size: number; // bytes
  format: string; // 'jpeg', 'png', 'webp', 'gif'
  uploadedAt: Date;
}
```

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Image Format Validation
*For any* selected file, if the file extension is not in the supported formats list (JPEG, PNG, WebP, GIF), the system should reject it and display an error message.
**Validates: Requirements 1.3, 5.2**

### Property 2: Image Preview Display
*For any* valid image file selected, the system should display a thumbnail preview within 500ms of selection.
**Validates: Requirements 1.4, 2.1**

### Property 3: Image Removal Clears State
*For any* attached image, clicking the remove button should clear the image state and return the UI to the pre-attachment state.
**Validates: Requirements 1.5, 2.4**

### Property 4: Text-Only Messages Use Original Flow
*For any* message sent without an attached image, the system should use the exact same API call format as the original implementation.
**Validates: Requirements 4.2, 8.1**

### Property 5: Image Included in API Request
*For any* message sent with an attached image, the API request should include the image in the content array with type 'image_url'.
**Validates: Requirements 3.1, 4.3**

### Property 6: Image Conversion Maintains Quality
*For any* local image file, converting it to base64 should preserve the image data such that re-decoding produces an equivalent image.
**Validates: Requirements 7.1, 7.4**

### Property 7: Chat History Preserved on Error
*For any* API error that occurs during image analysis, the chat history should remain unchanged and the user should be able to retry.
**Validates: Requirements 4.6, 5.3, 5.5**

### Property 8: Image Attachment Persists on Failure
*For any* failed image analysis attempt, the image attachment should remain in the input area, allowing the user to modify the prompt and retry.
**Validates: Requirements 5.6**

### Property 9: Attachment Button Disabled During Loading
*For any* chat message being processed, the attachment button should be disabled to prevent concurrent submissions.
**Validates: Requirements 6.4**

### Property 10: API Configuration Unchanged
*For any* image attachment operation, the system should not modify the existing Shenma API configuration (API key, base URL, endpoints).
**Validates: Requirements 4.4, 8.4**

### Property 11: Image Metadata Display
*For any* attached image, the system should display the image dimensions and file size in the preview area.
**Validates: Requirements 2.2**

### Property 12: Multiple Images Sequential Handling
*For any* multiple image selection, the system should handle them sequentially or display them in a carousel without errors.
**Validates: Requirements 2.5**

## Error Handling

### Image Validation Errors

1. **Unsupported Format**
   - Message: "Unsupported image format. Please use JPEG, PNG, WebP, or GIF."
   - Action: Reject file, keep input state unchanged

2. **File Too Large**
   - Message: "Image file is too large (max 10MB). Please select a smaller image."
   - Action: Reject file, keep input state unchanged

3. **File Read Error**
   - Message: "Failed to read image file. Please try again."
   - Action: Reject file, keep input state unchanged

### API Errors

1. **Image Analysis Failed**
   - Message: "Failed to analyze image. Please check your API configuration and try again."
   - Action: Display error, keep image attached for retry

2. **API Timeout**
   - Message: "Image analysis timed out. Please try again."
   - Action: Display error, keep image attached for retry

3. **Rate Limit**
   - Message: "Too many requests. Please wait a moment and try again."
   - Action: Display error, keep image attached for retry

### Recovery Strategies

- **Preserve Image on Failure**: If image analysis fails, keep the image attached so user can retry
- **Preserve Chat History**: Never clear chat history on errors
- **Clear on Success**: Only clear image attachment after successful message send
- **User Control**: Always allow user to manually remove image

## Testing Strategy

### Unit Tests

1. **Image Validation Tests**
   - Test file format validation for all supported formats
   - Test rejection of unsupported formats
   - Test file size validation
   - Test file read error handling

2. **Image Preview Tests**
   - Test preview generation from file
   - Test metadata extraction (dimensions, size)
   - Test preview display timing
   - Test preview removal

3. **State Management Tests**
   - Test image attachment state transitions
   - Test image removal state reset
   - Test error state handling
   - Test loading state management

4. **API Integration Tests**
   - Test message formatting with image
   - Test message formatting without image (backward compatibility)
   - Test API call with correct endpoint
   - Test API response handling
   - Test error response handling

5. **UI Integration Tests**
   - Test attachment button visibility
   - Test file picker opening
   - Test preview display positioning
   - Test button disabled state during loading

### Property-Based Tests

Each correctness property will be implemented as a property-based test:

- **Feature: creative-chat-image-attachment, Property 1: Image Format Validation**
  - Generate random file extensions
  - Verify only supported formats are accepted

- **Feature: creative-chat-image-attachment, Property 2: Image Preview Display**
  - Generate random valid images
  - Verify preview displays within timeout

- **Feature: creative-chat-image-attachment, Property 3: Image Removal Clears State**
  - Generate random images
  - Verify state is cleared after removal

- **Feature: creative-chat-image-attachment, Property 4: Text-Only Messages Use Original Flow**
  - Generate random text messages
  - Verify API call format matches original

- **Feature: creative-chat-image-attachment, Property 5: Image Included in API Request**
  - Generate random images and messages
  - Verify image is in API request

- **Feature: creative-chat-image-attachment, Property 6: Image Conversion Maintains Quality**
  - Generate random images
  - Verify conversion preserves data

- **Feature: creative-chat-image-attachment, Property 7: Chat History Preserved on Error**
  - Generate random chat history
  - Simulate API errors
  - Verify history is unchanged

- **Feature: creative-chat-image-attachment, Property 8: Image Attachment Persists on Failure**
  - Generate random images
  - Simulate failures
  - Verify image remains attached

- **Feature: creative-chat-image-attachment, Property 9: Attachment Button Disabled During Loading**
  - Simulate loading state
  - Verify button is disabled

- **Feature: creative-chat-image-attachment, Property 10: API Configuration Unchanged**
  - Verify configuration before and after operations
  - Ensure no modifications

- **Feature: creative-chat-image-attachment, Property 11: Image Metadata Display**
  - Generate random images
  - Verify metadata is displayed

- **Feature: creative-chat-image-attachment, Property 12: Multiple Images Sequential Handling**
  - Generate multiple images
  - Verify sequential handling

### Test Configuration

- Minimum 100 iterations per property test
- Use fast-check or similar library for property generation
- Mock Shenma API responses for integration tests
- Test both success and failure paths

