# Requirements Document: Quick Storyboard Reference Image Fix

## Introduction

The Quick Storyboard feature currently fails to properly use reference images when generating variations. When users upload an image and request generation (three-view, multi-grid, style-comparison, or narrative-progression), the system should generate variations **based on the uploaded reference image**, not completely different subjects. For example, when generating three views of a mechanical dog, the output should show three views of the same dog, not a tank, superhero, and building.

## Glossary

- **Reference_Image**: An image uploaded by the user to serve as the basis for all generated variations
- **Quick_Storyboard_Mode**: One of four generation modes: three-view, multi-grid, style-comparison, narrative-progression
- **Image_Generation_Request**: The complete request sent to the image generation API, including both the reference image and the instruction prompt
- **Instruction_Prompt**: The text prompt that describes what variations to generate (e.g., "Generate three orthographic views")
- **Image_to_Image_API**: API capability that accepts both a reference image and instructions to generate variations based on that image
- **Text_to_Image_API**: API capability that only accepts text prompts without reference images
- **Fallback_Behavior**: When image-to-image fails, the system should gracefully fall back to text-to-image generation

## Requirements

### Requirement 1: Reference Image Capture and Storage

**User Story:** As a user, I want to upload a reference image for quick storyboard generation, so that all generated variations are based on my uploaded image.

#### Acceptance Criteria

1. WHEN a user uploads an image to the Quick Storyboard component THEN the system SHALL capture and store the image in memory
2. WHEN an image is uploaded THEN the system SHALL display a preview of the uploaded image
3. WHEN an image is uploaded THEN the system SHALL validate that it is a valid image file (JPEG, PNG, WebP, GIF)
4. WHEN an invalid image is uploaded THEN the system SHALL display a clear error message
5. WHEN a user clears the uploaded image THEN the system SHALL remove it from memory and clear the preview

### Requirement 2: Reference Image Passing to Generation Service

**User Story:** As a developer, I want the Quick Storyboard component to pass the reference image to the generation service, so that all generation modes use the reference image.

#### Acceptance Criteria

1. WHEN a user triggers generation (three-view, multi-grid, style-comparison, or narrative-progression) THEN the system SHALL pass the reference image to the generation service
2. WHEN the reference image is passed THEN the system SHALL include it in the request parameters
3. WHEN no reference image is provided THEN the system SHALL proceed with text-only generation (backward compatible)
4. WHEN the reference image is provided THEN the system SHALL NOT fall back to text-only generation unless the image-to-image API fails

### Requirement 3: Three-View Generation with Reference Image

**User Story:** As a user, I want to generate three orthographic views of my uploaded image, so that I can see front, side, and top perspectives of the same subject.

#### Acceptance Criteria

1. WHEN a user selects three-view generation with a reference image THEN the system SHALL construct a prompt that explicitly instructs the API to generate three views of the reference image
2. WHEN the prompt is constructed THEN it SHALL include clear instructions like "Generate three orthographic views (front, side, top) of this image"
3. WHEN the API receives the request THEN it SHALL generate three views based on the reference image, not a different subject
4. WHEN generation completes THEN the system SHALL display the three generated views on the canvas

### Requirement 4: Multi-Grid Generation with Reference Image

**User Story:** As a user, I want to generate a grid of variations of my uploaded image, so that I can see multiple perspectives or variations of the same subject.

#### Acceptance Criteria

1. WHEN a user selects multi-grid generation with a reference image THEN the system SHALL construct a prompt that explicitly instructs the API to generate multiple frames of the reference image
2. WHEN the prompt is constructed THEN it SHALL include clear instructions like "Generate a 3×3 grid showing different camera angles of this image"
3. WHEN the API receives the request THEN it SHALL generate multiple frames based on the reference image, not different subjects
4. WHEN generation completes THEN the system SHALL display the grid of generated frames on the canvas

### Requirement 5: Style Comparison Generation with Reference Image

**User Story:** As a user, I want to generate style variations of my uploaded image, so that I can see how the subject looks in different artistic styles.

#### Acceptance Criteria

1. WHEN a user selects style-comparison generation with a reference image THEN the system SHALL construct a prompt that explicitly instructs the API to apply different styles to the reference image
2. WHEN the prompt is constructed THEN it SHALL include clear instructions like "Generate 5 variations of this image in different artistic styles"
3. WHEN the API receives the request THEN it SHALL generate style variations of the reference image, not different subjects
4. WHEN generation completes THEN the system SHALL display the style variations on the canvas

### Requirement 6: Narrative Progression Generation with Reference Image

**User Story:** As a user, I want to generate narrative progression frames based on my uploaded image, so that I can see a story sequence starting from my reference image.

#### Acceptance Criteria

1. WHEN a user selects narrative-progression generation with a reference image THEN the system SHALL construct a prompt that explicitly instructs the API to create a narrative sequence starting from the reference image
2. WHEN the prompt is constructed THEN it SHALL include clear instructions like "Generate 5 sequential frames showing narrative progression starting from this image"
3. WHEN the API receives the request THEN it SHALL generate narrative frames based on the reference image, not different subjects
4. WHEN generation completes THEN the system SHALL display the narrative sequence on the canvas

### Requirement 7: Instruction Prompt Construction

**User Story:** As a developer, I want the system to construct clear, explicit instruction prompts that emphasize using the reference image, so that the API generates variations of the reference image rather than different subjects.

#### Acceptance Criteria

1. WHEN constructing a prompt for image-to-image generation THEN the system SHALL explicitly state "based on this image" or "of this image"
2. WHEN constructing a prompt THEN the system SHALL avoid ambiguous language that could be interpreted as generating a different subject
3. WHEN constructing a prompt THEN the system SHALL include specific instructions for the type of variation (e.g., "different camera angles", "different artistic styles")
4. WHEN the prompt is constructed THEN it SHALL be clear and unambiguous to the image generation API

### Requirement 8: Image-to-Image API Usage

**User Story:** As a developer, I want the system to use the image-to-image API endpoint when a reference image is provided, so that the API can generate variations based on the reference image.

#### Acceptance Criteria

1. WHEN a reference image is provided THEN the system SHALL use the image-to-image (edits) API endpoint instead of text-to-image
2. WHEN calling the image-to-image endpoint THEN the system SHALL include both the reference image and the instruction prompt
3. WHEN the image-to-image endpoint is called THEN the system SHALL properly format the request according to the API's requirements
4. WHEN the image-to-image endpoint fails THEN the system SHALL gracefully fall back to text-to-image generation

### Requirement 9: Error Handling and Fallback

**User Story:** As a user, I want clear error messages when generation fails, so that I understand what went wrong and can retry if needed.

#### Acceptance Criteria

1. WHEN image-to-image generation fails THEN the system SHALL log the error for debugging
2. WHEN image-to-image generation fails THEN the system SHALL fall back to text-to-image generation
3. WHEN fallback occurs THEN the system SHALL notify the user that generation is proceeding without the reference image
4. WHEN generation fails completely THEN the system SHALL display a clear error message to the user

### Requirement 10: Backward Compatibility

**User Story:** As a developer, I want the system to maintain backward compatibility with existing code, so that existing functionality continues to work.

#### Acceptance Criteria

1. WHEN a user does not upload a reference image THEN the system SHALL proceed with text-only generation
2. WHEN existing code calls the generation service without a reference image THEN the service SHALL proceed with text-only generation
3. WHEN existing tests run THEN they SHALL continue to pass without modification
4. WHEN the API does not support image-to-image THEN the system SHALL fall back to text-only generation

