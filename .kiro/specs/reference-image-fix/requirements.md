# Requirements Document: Reference Image Support in Image Generation

## Introduction

This feature fixes a critical bug where reference images uploaded by users are not being passed to the image generation API. Currently, when users upload an image for three-view generation or other image-based operations, the system only sends the text prompt to the API, ignoring the reference image entirely. This results in generated images that don't respect the original uploaded image. This spec addresses the complete flow of reference image handling from upload through API call.

## Glossary

- **Reference_Image**: An image uploaded by the user to serve as a basis for image generation (e.g., a product photo for three-view generation)
- **Image_Generation_Request**: The complete request object sent to the image generation API, including prompt and reference image
- **Image_Generation_Service**: The service layer that constructs and sends image generation requests
- **Image_Generation_Adapter**: The adapter that communicates with external image generation APIs
- **Three_View_Generation**: The process of generating front, side, and top orthographic views of a subject based on a reference image
- **Image_to_Image_API**: API capability that accepts both a prompt and a reference image to generate variations
- **Base64_Encoding**: Method of encoding binary image data as text for transmission in JSON payloads
- **Image_URL**: Direct URL reference to an image hosted on a server or CDN

## Requirements

### Requirement 1: Reference Image Parameter Support in Image Generation Service

**User Story:** As a developer, I want the Image Generation Service to accept and pass reference images to the API, so that generated images are based on the uploaded reference image.

#### Acceptance Criteria

1. WHEN the Image Generation Service receives a generation request THEN it SHALL accept an optional `referenceImage` parameter
2. WHEN a reference image is provided THEN the service SHALL validate that it is a valid image (base64 string or URL)
3. WHEN a reference image is valid THEN the service SHALL include it in the request object passed to the adapter
4. WHEN the adapter is called THEN the service SHALL pass both the prompt and the reference image
5. WHEN no reference image is provided THEN the service SHALL proceed with text-only generation (backward compatible)

### Requirement 2: Reference Image Parameter Support in Image Generation Adapter

**User Story:** As a developer, I want the Image Generation Adapter to accept and forward reference images to the API, so that the API receives complete generation requests.

#### Acceptance Criteria

1. WHEN the Image Generation Adapter receives a generation request THEN it SHALL accept an optional `referenceImage` parameter
2. WHEN a reference image is provided THEN the adapter SHALL include it in the API request payload
3. WHEN constructing the API request THEN the adapter SHALL format the reference image according to the API's requirements (base64, URL, or file upload)
4. WHEN the API returns results THEN the adapter SHALL return the generated images to the caller
5. WHEN the API does not support reference images THEN the adapter SHALL gracefully handle the error and return a descriptive message

### Requirement 3: Reference Image Handling in Three-View Generation

**User Story:** As a user, I want to upload an image and generate three-view diagrams based on that image, so that the generated views accurately represent the uploaded subject.

#### Acceptance Criteria

1. WHEN a user uploads an image for three-view generation THEN the system SHALL capture and store the uploaded image
2. WHEN three-view generation is triggered THEN the system SHALL pass the uploaded image as the reference image to the Image Generation Service
3. WHEN the Image Generation Service receives the reference image THEN it SHALL construct a prompt that indicates the generation should be based on the reference image
4. WHEN the API receives the request THEN it SHALL generate three orthographic views based on the reference image
5. WHEN generation completes THEN the system SHALL display the three generated views on the canvas

### Requirement 4: Reference Image Handling in Multi-Grid Generation

**User Story:** As a user, I want to generate multiple camera angles of an uploaded image, so that the generated angles show different perspectives of the same subject.

#### Acceptance Criteria

1. WHEN a user uploads an image for multi-grid generation THEN the system SHALL capture and store the uploaded image
2. WHEN multi-grid generation is triggered THEN the system SHALL pass the uploaded image as the reference image to the Image Generation Service
3. WHEN the Image Generation Service receives the reference image THEN it SHALL construct a prompt that indicates the generation should show different camera angles of the reference image
4. WHEN the API receives the request THEN it SHALL generate multiple frames showing different camera angles of the reference image
5. WHEN generation completes THEN the system SHALL display the grid of generated frames on the canvas

### Requirement 5: Reference Image Handling in Style Comparison Generation

**User Story:** As a user, I want to generate style variations of an uploaded image, so that I can see how the subject looks in different artistic styles.

#### Acceptance Criteria

1. WHEN a user uploads an image for style comparison generation THEN the system SHALL capture and store the uploaded image
2. WHEN style comparison generation is triggered THEN the system SHALL pass the uploaded image as the reference image to the Image Generation Service
3. WHEN the Image Generation Service receives the reference image THEN it SHALL construct a prompt that indicates the generation should apply different styles to the reference image
4. WHEN the API receives the request THEN it SHALL generate variations of the reference image in different artistic styles
5. WHEN generation completes THEN the system SHALL display the style variations on the canvas

### Requirement 6: Reference Image Handling in Narrative Progression Generation

**User Story:** As a user, I want to generate narrative progression frames based on an uploaded image, so that the sequence shows story progression starting from the reference image.

#### Acceptance Criteria

1. WHEN a user uploads an image for narrative progression generation THEN the system SHALL capture and store the uploaded image
2. WHEN narrative progression generation is triggered THEN the system SHALL pass the uploaded image as the reference image to the Image Generation Service
3. WHEN the Image Generation Service receives the reference image THEN it SHALL construct a prompt that indicates the generation should create a narrative sequence starting from the reference image
4. WHEN the API receives the request THEN it SHALL generate sequential frames showing narrative progression based on the reference image
5. WHEN generation completes THEN the system SHALL display the narrative sequence on the canvas

### Requirement 7: Reference Image Format Support

**User Story:** As a developer, I want the system to support multiple reference image formats, so that users can upload images in common formats.

#### Acceptance Criteria

1. WHEN a user uploads an image THEN the system SHALL accept common image formats: JPEG, PNG, WebP, GIF
2. WHEN an image is uploaded THEN the system SHALL convert it to the format required by the API (typically base64 or URL)
3. WHEN the image is converted THEN the system SHALL maintain image quality during conversion
4. WHEN the image is too large THEN the system SHALL compress it to a reasonable size (e.g., max 5MB)
5. WHEN the image format is not supported THEN the system SHALL return a descriptive error message

### Requirement 8: Reference Image Validation

**User Story:** As a developer, I want the system to validate reference images before sending them to the API, so that invalid images don't cause API errors.

#### Acceptance Criteria

1. WHEN a reference image is provided THEN the system SHALL validate that it is a valid image file
2. WHEN the image is invalid THEN the system SHALL return a descriptive error message
3. WHEN the image is valid THEN the system SHALL proceed with generation
4. WHEN the image dimensions are too small THEN the system SHALL warn the user but allow generation to proceed
5. WHEN the image dimensions are too large THEN the system SHALL resize it to a reasonable size

### Requirement 9: Backward Compatibility

**User Story:** As a developer, I want the system to maintain backward compatibility with existing code, so that existing functionality continues to work.

#### Acceptance Criteria

1. WHEN existing code calls the Image Generation Service without a reference image THEN the system SHALL proceed with text-only generation
2. WHEN existing code calls the Image Generation Adapter without a reference image THEN the adapter SHALL proceed with text-only generation
3. WHEN the API does not support reference images THEN the system SHALL fall back to text-only generation
4. WHEN existing tests run THEN they SHALL continue to pass without modification

### Requirement 10: Error Handling for Reference Image Issues

**User Story:** As a user, I want clear error messages when reference image handling fails, so that I can understand what went wrong.

#### Acceptance Criteria

1. WHEN a reference image upload fails THEN the system SHALL display a clear error message
2. WHEN a reference image is invalid THEN the system SHALL display a clear error message
3. WHEN the API rejects the reference image THEN the system SHALL display a clear error message
4. WHEN reference image processing fails THEN the system SHALL log the error for debugging
5. WHEN an error occurs THEN the system SHALL allow the user to retry or proceed without the reference image

