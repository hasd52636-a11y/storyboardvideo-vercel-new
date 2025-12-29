# Implementation Plan: Creative Chat Image Attachment

## Overview

This implementation plan breaks down the image attachment feature into discrete coding tasks. The feature will be implemented incrementally, with testing integrated at each step to ensure correctness and maintain backward compatibility.

## Tasks

- [x] 1. Set up image utilities and validation
  - Create/extend `lib/image-utils.ts` with image validation functions
  - Implement `validateImageFile()` for format and size checking
  - Implement `generateImagePreview()` for thumbnail generation
  - Implement `getImageMetadata()` for dimension extraction
  - _Requirements: 1.3, 5.1, 5.2, 7.1_

- [x] 1.1 Write property tests for image validation
  - **Property 1: Image Format Validation**
  - **Validates: Requirements 1.3, 5.2**

- [x] 2. Create image attachment state management
  - Add `ImageAttachmentState` interface to `types.ts`
  - Add state hooks to `SidebarRight.tsx` for image attachment
  - Implement `handleImageSelect()` handler
  - Implement `handleRemoveImage()` handler
  - _Requirements: 1.4, 1.5, 2.1, 2.4_

- [x] 2.1 Write property tests for state management
  - **Property 3: Image Removal Clears State**
  - **Validates: Requirements 1.5, 2.4**

- [x] 3. Add attachment button and file picker UI
  - Add attachment icon button to chat input area (bottom-right corner)
  - Create hidden file input element
  - Wire button click to file picker
  - Style button to match existing UI (send button style)
  - _Requirements: 1.1, 1.2, 6.1, 6.2_

- [x] 3.1 Write unit tests for attachment button
  - Test button visibility and positioning
  - Test file picker opens on click
  - Test file input accepts correct formats

- [x] 4. Implement image preview display
  - Create preview container component
  - Display thumbnail image
  - Display image metadata (dimensions, file size)
  - Add remove button on hover
  - Style preview to not obscure input field
  - _Requirements: 2.1, 2.2, 2.3, 6.3_

- [x] 4.1 Write property tests for preview display
  - **Property 2: Image Preview Display**
  - **Validates: Requirements 1.4, 2.1**

- [x] 5. Extend chat message format for images
  - Modify `ChatMessage` interface to support images
  - Update chat history display to show images
  - Ensure text-only messages display unchanged
  - _Requirements: 3.3, 8.2_

- [x] 5.1 Write property tests for message format
  - **Property 4: Text-Only Messages Use Original Flow**
  - **Validates: Requirements 4.2, 8.1**

- [x] 6. Implement image conversion for API
  - Create `convertImageForAPI()` function
  - Handle base64 conversion for local images
  - Handle URL pass-through for remote images
  - Ensure conversion maintains image quality
  - _Requirements: 3.2, 7.1, 7.2, 7.3_

- [x] 6.1 Write property tests for image conversion
  - **Property 6: Image Conversion Maintains Quality**
  - **Validates: Requirements 7.1, 7.4**

- [x] 7. Modify chat send handler for image support
  - Update `handleSendChat()` to detect attached images
  - Build message with image_url content type when image present
  - Keep existing flow unchanged for text-only messages
  - Clear image attachment after successful send
  - _Requirements: 3.1, 3.5, 4.2, 4.3_

- [x] 7.1 Write property tests for API message format
  - **Property 5: Image Included in API Request**
  - **Validates: Requirements 3.1, 4.3**

- [x] 8. Implement error handling for image operations
  - Add error state to image attachment state
  - Display error messages for validation failures
  - Display error messages for API failures
  - Preserve image attachment on API errors for retry
  - _Requirements: 5.1, 5.2, 5.3, 5.6_

- [ ] 8.1 Write property tests for error handling
  - **Property 7: Chat History Preserved on Error**
  - **Property 8: Image Attachment Persists on Failure**
  - **Validates: Requirements 4.6, 5.3, 5.5, 5.6**

- [ ] 9. Add loading state management
  - Disable attachment button during chat loading
  - Disable attachment button during image analysis
  - Show loading indicator during image processing
  - _Requirements: 6.4_

- [ ] 9.1 Write property tests for loading state
  - **Property 9: Attachment Button Disabled During Loading**
  - **Validates: Requirements 6.4**

- [ ] 10. Verify API configuration is unchanged
  - Confirm Shenma API configuration is not modified
  - Verify API key and base URL remain the same
  - Test that existing API calls still work
  - _Requirements: 4.4, 8.4_

- [ ] 10.1 Write property tests for configuration
  - **Property 10: API Configuration Unchanged**
  - **Validates: Requirements 4.4, 8.4**

- [ ] 11. Implement metadata display
  - Display image dimensions in preview
  - Display file size in preview
  - Format metadata for readability
  - _Requirements: 2.2_

- [ ] 11.1 Write property tests for metadata
  - **Property 11: Image Metadata Display**
  - **Validates: Requirements 2.2**

- [ ] 12. Handle multiple images (sequential)
  - Implement sequential image handling
  - Allow user to select multiple images
  - Display images in order
  - _Requirements: 2.5_

- [ ] 12.1 Write property tests for multiple images
  - **Property 12: Multiple Images Sequential Handling**
  - **Validates: Requirements 2.5**

- [ ] 13. Checkpoint - Ensure all tests pass
  - Run all unit tests
  - Run all property-based tests
  - Verify no regressions in existing functionality
  - Test backward compatibility with text-only messages

- [ ] 14. Integration testing
  - Test complete flow: select image → preview → send → API call → response
  - Test error scenarios: invalid format, too large, API failure
  - Test recovery: retry after error, modify prompt and retry
  - Test UI responsiveness: no layout shifts, buttons remain accessible
  - _Requirements: 1.1-8.5_

- [ ] 14.1 Write integration tests
  - Test end-to-end image attachment flow
  - Test error recovery flows
  - Test backward compatibility

- [ ] 15. Final checkpoint - Ensure all tests pass
  - Run complete test suite
  - Verify all properties pass
  - Confirm no performance degradation
  - Verify chat history is preserved correctly

## Notes

- All tasks are required for comprehensive testing and quality assurance
- Each task builds on previous tasks
- Image attachment feature is completely optional - users can continue using text-only chat
- All existing chat functionality remains unchanged
- Property-based tests use fast-check library (already in dependencies)
- Tests should verify both success and failure paths
- Backward compatibility is critical - text-only messages must work identically to before

