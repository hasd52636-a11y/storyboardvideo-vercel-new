# Implementation Plan: Reference Image Support in Image Generation

## Overview

This implementation plan breaks down the reference image fix into discrete, incremental tasks. The approach follows a layered strategy: first establishing core utilities and interfaces, then updating the service layer, then integrating with components, and finally adding comprehensive testing.

## Tasks

- [x] 1. Create image utility functions and validation
  - Create `lib/image-utils.ts` with image validation and conversion functions
  - Implement `validateImageFile()` for format and size validation
  - Implement `fileToBase64()` for file to base64 conversion
  - Implement `compressImage()` for image compression
  - Implement `getImageDimensions()` for dimension detection
  - _Requirements: 7.1, 7.2, 7.4, 7.5, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 1.1 Write unit tests for image utilities
  - **Property 8: Reference Image Format Support**
  - **Validates: Requirements 7.1, 7.2, 7.4, 7.5**

- [x] 2. Update ImageGenerationService to support reference images
  - Update `GenerationRequest` interface to include `referenceImage` and `referenceImageWeight` parameters
  - Add reference image validation in `generateImages()` method
  - Update `callImageGenerationAPI()` to accept and pass reference image
  - Update metadata building to include reference image information
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2.1 Write unit tests for ImageGenerationService reference image support
  - **Property 1: Reference Image Preservation**
  - **Property 2: Backward Compatibility Invariant**
  - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 9.1, 9.4**

- [x] 3. Update ImageGenerationAdapter to support reference images
  - Update `IImageGenerationAdapter` interface to include reference image parameters
  - Update `PrimaryAPIAdapter.generateImages()` to accept and format reference image
  - Update `NanobanaAPIAdapter.generateImages()` to accept and format reference image
  - Update `JiMengAPIAdapter.generateImages()` to accept and format reference image
  - Update `APIManager.generateImages()` to accept and forward reference image
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 3.1 Write unit tests for ImageGenerationAdapter reference image support
  - **Property 3: Reference Image Validation**
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 9.2, 9.3**
  - All 18 tests passing ✅

- [x] 4. Update database schema to store reference image metadata
  - Add `referenceImage` field to `GenerationHistory` model (optional, string)
  - Add `referenceImageWeight` field to `GenerationHistory` model (optional, float)
  - Update Prisma schema and generate migrations
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 5. Update QuickStoryboard component to capture and pass reference images
  - Add state to track uploaded reference image
  - Update `handleQuickAction()` to capture reference image
  - Update `triggerGeneration()` to pass reference image to `onGenerate` callback
  - Add image upload handler for drag-and-drop or file input
  - _Requirements: 3.1, 3.2, 4.1, 4.2, 5.1, 5.2, 6.1, 6.2_

- [x] 5.1 Write unit tests for QuickStoryboard reference image capture
  - Test that reference image is captured when uploaded
  - Test that reference image is passed to generation callback
  - All 16 tests passing ✅
  - _Requirements: 3.1, 3.2, 4.1, 4.2, 5.1, 5.2, 6.1, 6.2_

- [x] 6. Update generation trigger functions to include reference image
  - Update `ImageGenerationService.generateImages()` calls to include reference image
  - Update all generation type handlers (three-view, multi-grid, style-comparison, narrative-progression) to pass reference image
  - _Requirements: 3.2, 3.3, 4.2, 4.3, 5.2, 5.3, 6.2, 6.3_

- [x] 6.1 Write unit tests for generation trigger functions
  - **Property 4: Three-View Generation with Reference**
  - **Property 5: Multi-Grid Generation with Reference**
  - **Property 6: Style Comparison with Reference**
  - **Property 7: Narrative Progression with Reference**
  - **Validates: Requirements 3.2, 3.3, 4.2, 4.3, 5.2, 5.3, 6.2, 6.3**
  - All 18 tests passing ✅

- [ ] 7. Implement error handling for reference image issues
  - Add try-catch blocks for image validation errors
  - Add error messages for unsupported formats
  - Add error messages for oversized images
  - Add fallback to text-only generation if API rejects reference image
  - Add retry logic for transient failures
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 7.1 Write unit tests for error handling
  - **Property 10: Error Handling Completeness**
  - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**

- [ ] 8. Checkpoint - Ensure all unit tests pass
  - Run all unit tests for image utilities, services, adapters, and components
  - Verify no regressions in existing tests
  - Ensure all new tests pass
  - _Requirements: All_

- [ ] 8.1 Write property-based tests for reference image round-trip
  - **Property 1: Reference Image Preservation**
  - **Validates: Requirements 1.1, 1.2, 1.3, 1.4**

- [ ] 8.2 Write property-based tests for backward compatibility
  - **Property 2: Backward Compatibility Invariant**
  - **Validates: Requirements 9.1, 9.2, 9.3, 9.4**

- [ ] 8.3 Write property-based tests for reference image validation
  - **Property 3: Reference Image Validation**
  - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

- [ ] 8.4 Write property-based tests for three-view generation
  - **Property 4: Three-View Generation with Reference**
  - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

- [ ] 8.5 Write property-based tests for multi-grid generation
  - **Property 5: Multi-Grid Generation with Reference**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

- [ ] 8.6 Write property-based tests for style comparison generation
  - **Property 6: Style Comparison with Reference**
  - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

- [ ] 8.7 Write property-based tests for narrative progression generation
  - **Property 7: Narrative Progression with Reference**
  - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

- [ ] 8.8 Write property-based tests for image format support
  - **Property 8: Reference Image Format Support**
  - **Validates: Requirements 7.1, 7.2, 7.4, 7.5**

- [ ] 8.9 Write property-based tests for reference image persistence
  - **Property 9: Reference Image Persistence**
  - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

- [ ] 8.10 Write property-based tests for error handling
  - **Property 10: Error Handling Completeness**
  - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**

- [ ] 9. Integration testing
  - Test end-to-end flow: upload image → trigger generation → verify reference image is used
  - Test with different image formats (JPEG, PNG, WebP, GIF)
  - Test with different image sizes (small, medium, large)
  - Test error scenarios (invalid format, oversized, corrupted)
  - _Requirements: All_

- [ ] 10. Final checkpoint - Ensure all tests pass
  - Run complete test suite (unit + property-based + integration)
  - Verify no regressions
  - Verify all requirements are met
  - _Requirements: All_

## Notes

- All tasks are required for comprehensive implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation maintains backward compatibility throughout

