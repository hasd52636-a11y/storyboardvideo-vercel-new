# Requirements Document: Quick Storyboard Image-to-Image Fix

## Introduction

The Quick Storyboard feature has a critical bug where reference images are not being passed to the image generation API. The `generateSceneImage()` function in `geminiService.ts` has complete image-to-image (edits) endpoint implementation and is correctly used in `App.tsx` (passing the 6th parameter as reference image). However, `StoryboardApp.tsx` (Quick Storyboard component) fails to pass the reference image parameter when calling `generateSceneImage()`. This causes the system to always use text-to-image generation instead of image-to-image, resulting in completely different subjects being generated instead of variations of the uploaded image.

**Root Cause**: In `StoryboardApp.tsx`, the `handleQuickStoryboardGeneration()` function receives `referenceImage` and `referenceImageWeight` parameters but never passes them to `generateSceneImage()` calls. The function signature supports the reference image parameter (6th parameter), but all calls in StoryboardApp omit it, causing the reference image to be lost.

**Comparison**:
- ✅ `App.tsx` correctly calls: `generateSceneImage(prompt, true, isBlackAndWhite, undefined, aspectRatio, item.imageUrl)`
- ❌ `StoryboardApp.tsx` incorrectly calls: `generateSceneImage(prompt, true, false)` (missing 6th parameter)

## Glossary

- **Reference_Image**: An image uploaded by the user to serve as the basis for generation (e.g., a product photo for three-view generation)
- **Image_To_Image_API**: API endpoint that accepts both a reference image and a prompt to generate variations based on the reference
- **Text_To_Image_API**: API endpoint that only accepts a prompt text (fallback when no reference image is provided)
- **Quick_Storyboard_Service**: The service that orchestrates quick storyboard generation (three-view, multi-grid, style-comparison, narrative-progression)
- **Prompt_Text**: The instruction text describing what variations to generate
- **Generation_Request**: The complete request object containing both the reference image and prompt text
- **Image_Blob**: Binary image data formatted for API submission via FormData

## Requirements

### Requirement 1: Image-to-Image Endpoint Usage for Quick Storyboard

**User Story:** As a user, I want the quick storyboard feature to use the image-to-image API endpoint when I upload a reference image, so that generated variations are based on my uploaded image.

#### Acceptance Criteria

1. WHEN a user uploads a reference image for quick storyboard generation THEN the system SHALL detect the reference image
2. WHEN a reference image is detected THEN the system SHALL pass it to the `generateSceneImage()` function with all required parameters
3. WHEN `generateSceneImage()` receives a reference image THEN it SHALL use the image-to-image (edits) API endpoint instead of text-to-image
4. WHEN calling the image-to-image endpoint THEN the system SHALL include both the reference image and the prompt text in the FormData request
5. WHEN no reference image is provided THEN the system SHALL display an error message: "Please upload a reference image to generate storyboard"

### Requirement 1.1: Fix Parameter Passing in StoryboardApp

**User Story:** As a developer, I want the reference image parameters to be correctly passed through the generation pipeline, so that the image-to-image endpoint receives the reference image.

#### Acceptance Criteria

1. WHEN `handleQuickStoryboardGeneration()` receives `referenceImage` and `referenceImageWeight` parameters THEN it SHALL pass them to all `generateSceneImage()` calls
2. WHEN calling `generateSceneImage()` for three-view generation THEN the system SHALL pass the reference image as the 6th parameter
3. WHEN calling `generateSceneImage()` for multi-grid generation THEN the system SHALL pass the reference image as the 6th parameter
4. WHEN calling `generateSceneImage()` for style-comparison generation THEN the system SHALL pass the reference image as the 6th parameter
5. WHEN calling `generateSceneImage()` for narrative-progression generation THEN the system SHALL pass the reference image as the 6th parameter

### Requirement 2: Reference Image Format Handling

**User Story:** As a developer, I want the system to properly handle reference images in multiple formats, so that users can upload images in common formats.

#### Acceptance Criteria

1. WHEN a reference image is uploaded THEN the system SHALL accept common formats: JPEG, PNG, WebP, GIF
2. WHEN the image is in base64 format THEN the system SHALL convert it to a Blob for FormData submission
3. WHEN the image is a URL THEN the system SHALL download it and convert to a Blob
4. WHEN the image is a local file THEN the system SHALL convert it to a Blob
5. WHEN image conversion fails THEN the system SHALL log the error and fall back to text-to-image

### Requirement 3: Prompt Text Submission with Reference Image

**User Story:** As a user, I want the prompt text to be correctly submitted along with the reference image, so that the API understands what variations to generate.

#### Acceptance Criteria

1. WHEN a reference image is provided THEN the system SHALL include the prompt text in the image-to-image request
2. WHEN constructing the request THEN the system SHALL format the prompt according to the API's requirements
3. WHEN the prompt includes style information THEN the system SHALL preserve the style prefix in the request
4. WHEN the prompt includes generation parameters THEN the system SHALL include all parameters in the request
5. WHEN the API receives the request THEN it SHALL generate variations based on both the image and prompt

### Requirement 4: Three-View Generation with Reference Image

**User Story:** As a user, I want to upload an image and generate three orthographic views based on that image, so that the generated views accurately represent the uploaded subject.

#### Acceptance Criteria

1. WHEN a user uploads an image for three-view generation THEN the system SHALL capture the reference image
2. WHEN three-view generation is triggered THEN the system SHALL construct a prompt for three orthographic views
3. WHEN calling the image-to-image endpoint THEN the system SHALL pass the reference image and the three-view prompt
4. WHEN the API returns results THEN the system SHALL display the three generated views
5. WHEN the reference image is invalid THEN the system SHALL display an error message

### Requirement 5: Multi-Grid Generation with Reference Image

**User Story:** As a user, I want to generate multiple camera angles of an uploaded image, so that the generated angles show different perspectives of the same subject.

#### Acceptance Criteria

1. WHEN a user uploads an image for multi-grid generation THEN the system SHALL capture the reference image
2. WHEN multi-grid generation is triggered with a frame count THEN the system SHALL construct a prompt for multiple camera angles
3. WHEN calling the image-to-image endpoint THEN the system SHALL pass the reference image and the multi-grid prompt
4. WHEN the API returns results THEN the system SHALL display the grid of generated frames
5. WHEN the reference image is invalid THEN the system SHALL display an error message

### Requirement 6: Style Comparison Generation with Reference Image

**User Story:** As a user, I want to generate style variations of an uploaded image, so that I can see how the subject looks in different artistic styles.

#### Acceptance Criteria

1. WHEN a user uploads an image for style comparison generation THEN the system SHALL capture the reference image
2. WHEN style comparison generation is triggered THEN the system SHALL construct a prompt for different artistic styles
3. WHEN calling the image-to-image endpoint THEN the system SHALL pass the reference image and the style comparison prompt
4. WHEN the API returns results THEN the system SHALL display the style variations
5. WHEN the reference image is invalid THEN the system SHALL display an error message

### Requirement 7: Narrative Progression Generation with Reference Image

**User Story:** As a user, I want to generate narrative progression frames based on an uploaded image, so that the sequence shows story progression starting from the reference image.

#### Acceptance Criteria

1. WHEN a user uploads an image for narrative progression generation THEN the system SHALL capture the reference image
2. WHEN narrative progression generation is triggered with a frame count THEN the system SHALL construct a prompt for narrative sequence
3. WHEN calling the image-to-image endpoint THEN the system SHALL pass the reference image and the narrative progression prompt
4. WHEN the API returns results THEN the system SHALL display the narrative sequence
5. WHEN the reference image is invalid THEN the system SHALL display an error message

### Requirement 8: FormData Construction for Image-to-Image Requests

**User Story:** As a developer, I want the system to properly construct FormData requests with both image and prompt, so that the API receives correctly formatted requests.

#### Acceptance Criteria

1. WHEN constructing a FormData request THEN the system SHALL append the model parameter
2. WHEN constructing a FormData request THEN the system SHALL append the prompt text
3. WHEN constructing a FormData request THEN the system SHALL append the reference image as a Blob with filename
4. WHEN constructing a FormData request THEN the system SHALL append aspect ratio if specified
5. WHEN constructing a FormData request THEN the system SHALL append response format (url or b64_json)

### Requirement 9: Error Handling for Image-to-Image Failures

**User Story:** As a user, I want clear error messages when image-to-image generation fails, so that I understand what went wrong.

#### Acceptance Criteria

1. WHEN image-to-image generation fails THEN the system SHALL log the error with details
2. WHEN the API returns an error THEN the system SHALL display a user-friendly error message
3. WHEN image conversion fails THEN the system SHALL display an error message
4. WHEN the reference image is too large THEN the system SHALL compress it or display an error
5. WHEN an error occurs THEN the system SHALL allow the user to retry or proceed without the reference image

### Requirement 10: Backward Compatibility

**User Story:** As a developer, I want the system to maintain backward compatibility with existing code, so that existing functionality continues to work.

#### Acceptance Criteria

1. WHEN a user attempts quick storyboard generation without a reference image THEN the system SHALL display an error message: "Please upload a reference image to generate storyboard"
2. WHEN the API does not support image-to-image THEN the system SHALL display an error message: "Image-to-image generation is not supported by the current API"
3. WHEN existing tests run THEN they SHALL continue to pass without modification
4. WHEN the reference image is not provided THEN the system SHALL NOT fall back to text-to-image, but instead require the user to upload an image

