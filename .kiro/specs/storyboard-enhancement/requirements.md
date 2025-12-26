# Requirements Document: Storyboard Enhancement

## Introduction

This feature enhances the storyboard creation tool with user-customizable symbol libraries and one-click AI-powered generation features. Users can upload custom symbols with icons, names, and descriptions, define storyboard parameters through a dedicated module, and leverage four quick-action commands to automatically generate variations: three-view diagrams, multi-grid layouts, style comparisons, and narrative progressions.

## Glossary

- **Symbol**: A reusable visual element with icon, name, and description that users can upload and manage
- **Symbol_Library**: User's collection of custom symbols with metadata
- **Quick_Storyboard**: Dedicated module with four quick-action commands and customizable prompt templates for rapid storyboard generation
- **Quick_Action**: One of four preset generation commands (Three-View, Multi-Grid, Style-Comparison, Narrative-Progression)
- **Prompt_Template**: Customizable AI prompt with placeholders for generation parameters
- **Image_Generation_API**: Backend service for generating images (Sora, Gemini, or fallback to Nanobanana/即梦)
- **Three_View**: Orthographic projection showing front, side, and top views of a subject
- **Multi_Grid**: Grid layout containing 2-12 total storyboard frames arranged in optimal dimensions
- **Style_Comparison**: 5 randomly selected variations of the same subject in different artistic styles from the available style library
- **Narrative_Progression**: N sequential frames showing story progression based on current image and script
- **Persistence_Layer**: Database storage for symbols, definitions, and generation history

## Requirements

### Requirement 1: User-Customizable Symbol Library

**User Story:** As a storyboard creator, I want to upload and manage custom symbols with icons, names, and descriptions, so that I can build a personalized visual vocabulary for my projects.

#### Acceptance Criteria

1. WHEN a user accesses the Symbol Library module THEN the system SHALL display a grid layout showing all uploaded symbols with icon, name, and description
2. WHEN a user clicks the upload button THEN the system SHALL open a file dialog allowing image selection for the symbol icon
3. WHEN a user uploads a symbol THEN the system SHALL require input for symbol name and description before saving
4. WHEN a symbol is uploaded THEN the system SHALL persist the symbol data (icon, name, description) to the database
5. WHEN a user hovers over a symbol THEN the system SHALL display edit and delete options
6. WHEN a user edits a symbol THEN the system SHALL allow modification of icon, name, and description
7. WHEN a user deletes a symbol THEN the system SHALL remove it from the library and database
8. WHEN the Symbol Library loads THEN the system SHALL retrieve all user symbols from persistent storage

### Requirement 2: Quick Storyboard (快捷分镜) Module

**User Story:** As a storyboard creator, I want to use a dedicated Quick Storyboard module with four quick-action commands and customizable prompt templates, so that I can rapidly generate storyboard variations with one click.

#### Acceptance Criteria

1. WHEN a user accesses the Quick Storyboard module THEN the system SHALL display a layout similar to Symbol Library with four quick-action buttons (Three-View, Multi-Grid, Style-Comparison, Narrative-Progression)
2. WHEN a user views the Quick Storyboard module THEN the system SHALL display embedded prompt templates for each of the four quick-action commands
3. WHEN a user modifies a prompt template THEN the system SHALL allow editing of the template text with placeholder support
4. WHEN a user saves a Quick Storyboard configuration THEN the system SHALL persist the configuration (name, description, prompt templates) to the database
5. WHEN the Quick Storyboard module loads THEN the system SHALL retrieve saved configurations from persistent storage
6. WHEN a user creates a new configuration THEN the system SHALL initialize default prompt templates for all four quick-actions

### Requirement 3: Symbol Drag-to-Canvas Three-View Generation

**User Story:** As a storyboard creator, I want to drag a symbol onto the storyboard canvas and automatically generate three-view diagrams, so that I can quickly visualize subjects from multiple perspectives.

#### Acceptance Criteria

1. WHEN a user drags a symbol from the Symbol Library onto the canvas THEN the system SHALL detect the drop event
2. WHEN a symbol is dropped on the canvas THEN the system SHALL trigger the Three-View quick-action command from Quick Storyboard
3. WHEN Three-View generation is triggered THEN the system SHALL construct a prompt using the symbol data and current Quick Storyboard configuration
4. WHEN the prompt is constructed THEN the system SHALL call the Image Generation API with the Three-View prompt
5. WHEN the API returns images THEN the system SHALL display three orthographic views (front, side, top) on the canvas
6. WHEN Three-View generation completes THEN the system SHALL persist the generated images and metadata to the database

### Requirement 4: Camera Angle Library - Multi-Perspective View Generation

**User Story:** As a storyboard creator, I want to generate multiple camera angles and distances of the same subject with one click, so that I can quickly visualize the subject from different perspectives without recreating the scene.

#### Acceptance Criteria

1. WHEN a user clicks the Multi-Grid quick-action button in Quick Storyboard THEN the system SHALL prompt for the number of camera angles (N value, between 2 and 12)
2. WHEN the user inputs N THEN the system SHALL validate that N is an integer between 2 and 12
3. WHEN N is validated THEN the system SHALL define a library of 12 standard camera angles: extreme close-up, close-up, medium close-up, medium shot, medium wide, wide shot, very wide shot, overhead view, low angle view, three-quarter view, side profile, and bird's eye view
4. WHEN N is validated THEN the system SHALL intelligently select N camera angles from the library, ensuring representation of key perspectives: at least one close-up (extreme close-up or close-up), at least one medium shot, and at least one wide shot
5. WHEN camera angles are selected THEN the system SHALL calculate the optimal grid dimensions (e.g., 2x1, 2x2, 3x2, 3x3, 3x4, 4x3) based on N
6. WHEN grid dimensions are calculated THEN the system SHALL construct a prompt for generating N frames of the same subject from different camera angles using the Quick Storyboard template
7. WHEN the prompt is constructed THEN the system SHALL call the Image Generation API with the Multi-Grid prompt, specifying that all frames show the same subject/scene from different angles
8. WHEN the API returns the grid image THEN the system SHALL display it on the canvas with camera angle labels for each frame
9. WHEN Multi-Grid generation completes THEN the system SHALL persist the generated image, camera angle configuration, and grid metadata to the database

### Requirement 5: One-Click Style Comparison Generation

**User Story:** As a storyboard creator, I want to generate variations of the same subject in different artistic styles with one click, so that I can explore style options for my storyboard.

#### Acceptance Criteria

1. WHEN a user clicks the Style-Comparison quick-action button in Quick Storyboard THEN the system SHALL randomly select 5 distinct artistic styles from the available style library
2. WHEN 5 styles are selected THEN the system SHALL construct prompts for generating the subject in each of the 5 selected styles using the Quick Storyboard template
3. WHEN the prompts are constructed THEN the system SHALL call the Image Generation API with each Style-Comparison prompt
4. WHEN the API returns multiple images THEN the system SHALL display them in a comparison layout on the canvas
5. WHEN Style-Comparison generation completes THEN the system SHALL persist all generated images and style metadata to the database
6. WHEN the system selects styles THEN the system SHALL ensure variety by avoiding duplicate or similar styles in the same generation

### Requirement 6: One-Click Narrative Progression Generation

**User Story:** As a storyboard creator, I want to generate N sequential frames showing story progression based on the current image and script with one click, so that I can quickly develop narrative sequences.

#### Acceptance Criteria

1. WHEN a user clicks the Narrative-Progression quick-action button in Quick Storyboard THEN the system SHALL prompt for the number of progression frames (N value)
2. WHEN the user inputs N THEN the system SHALL validate that N is a positive integer between 1 and 12
3. WHEN N is validated THEN the system SHALL retrieve the current canvas image and associated script
4. WHEN the current context is retrieved THEN the system SHALL construct a prompt for generating N narrative progression frames using the Quick Storyboard template
5. WHEN the prompt is constructed THEN the system SHALL call the Image Generation API with the Narrative-Progression prompt
6. WHEN the API returns sequential images THEN the system SHALL display them in narrative order on the canvas
7. WHEN Narrative-Progression generation completes THEN the system SHALL persist all generated images and sequence metadata to the database

### Requirement 7: Image Generation API Integration with Fallback

**User Story:** As a system, I want to support multiple image generation backends with automatic fallback, so that generation requests succeed even if the primary API is unavailable.

#### Acceptance Criteria

1. WHEN an image generation request is made THEN the system SHALL first attempt to use the current Image Generation API endpoint
2. IF the primary API does not support the required generation type THEN the system SHALL fall back to Nanobanana or 即梦 image-to-image API
3. WHEN a fallback API is used THEN the system SHALL adapt the prompt format to match the fallback API requirements
4. WHEN the API call completes THEN the system SHALL return the generated image(s) to the caller
5. IF all API calls fail THEN the system SHALL return a descriptive error message to the user

### Requirement 8: Data Persistence for Symbols, Quick Storyboard Configurations, and Generation History

**User Story:** As a storyboard creator, I want all my custom symbols, Quick Storyboard configurations, and generation history to be persisted, so that I can access and reuse them across sessions.

#### Acceptance Criteria

1. WHEN a symbol is created, modified, or deleted THEN the system SHALL immediately persist the change to the database
2. WHEN a Quick Storyboard configuration is created or modified THEN the system SHALL immediately persist the change to the database
3. WHEN an image is generated THEN the system SHALL persist the generated image, prompt, and metadata to the database
4. WHEN the application loads THEN the system SHALL retrieve all user symbols and Quick Storyboard configurations from the database
5. WHEN a user requests generation history THEN the system SHALL retrieve and display all previous generations with their metadata
6. WHEN the database is queried THEN the system SHALL return results within 500ms for typical operations

### Requirement 9: Prompt Template Customization in Quick Storyboard

**User Story:** As a storyboard creator, I want to customize prompt templates for each quick-action command in Quick Storyboard, so that I can fine-tune the AI generation to match my creative vision.

#### Acceptance Criteria

1. WHEN a user accesses the Quick Storyboard module THEN the system SHALL display editable prompt templates for each of the four quick-actions
2. WHEN a user modifies a prompt template THEN the system SHALL support placeholder syntax (e.g., {subject}, {style}, {count})
3. WHEN a user saves a modified template THEN the system SHALL validate that the template contains required placeholders
4. WHEN a template is saved THEN the system SHALL persist the custom template to the database
5. WHEN a quick-action is triggered THEN the system SHALL use the user's custom template if available, otherwise use the default template
6. WHEN a user resets a template THEN the system SHALL restore the default template for that quick-action

