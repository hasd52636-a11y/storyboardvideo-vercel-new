# Requirements Document: Quick Action Drag-to-Storyboard

## Introduction

This feature enables users to drag quick action icons (Three-View, Multi-Grid, Style Comparison, Narrative Progression) from the Quick Storyboard panel directly onto storyboard cards in the canvas. When an icon is dropped on a card, the corresponding generation instruction is executed using that card's image as the reference.

## Glossary

- **Quick Action Icon**: Visual representation (emoji) of a generation type (📐, 🎬, 🎨, 📖)
- **Storyboard Card**: Individual scene card displayed on the canvas with an image
- **Reference Image**: The image currently displayed on the storyboard card that will be used for generation
- **Generation Type**: One of four types: three-view, multi-grid, style-comparison, narrative-progression
- **Drag Source**: The Quick Storyboard panel where icons originate
- **Drop Target**: A storyboard card on the canvas that accepts the dropped icon
- **Quick Storyboard Panel**: The right-side panel containing quick action buttons and templates

## Requirements

### Requirement 1: Drag Quick Action Icons

**User Story:** As a user, I want to drag quick action icons from the Quick Storyboard panel, so that I can apply generation instructions to specific storyboard cards.

#### Acceptance Criteria

1. WHEN a user presses and holds on a quick action button in the Quick Storyboard panel, THE System SHALL initiate a drag operation with the action type as drag data
2. WHEN a quick action is being dragged, THE System SHALL display visual feedback (cursor change, icon preview, or highlight)
3. WHEN a user drags a quick action icon, THE System SHALL preserve the action type and template information during the drag operation
4. WHEN a drag operation is in progress, THE System SHALL allow the user to move the cursor over storyboard cards without triggering other interactions

### Requirement 2: Accept Drops on Storyboard Cards

**User Story:** As a user, I want to drop quick action icons onto storyboard cards, so that the generation uses the card's image as reference.

#### Acceptance Criteria

1. WHEN a quick action icon is dragged over a storyboard card, THE System SHALL highlight the card to indicate it is a valid drop target
2. WHEN a quick action icon is dropped on a storyboard card, THE System SHALL accept the drop and extract the card's image as reference
3. WHEN a quick action is dropped on a non-main storyboard card, THE System SHALL execute the generation instruction
4. WHEN a quick action is dropped on the main reference card, THE System SHALL prevent the drop and display an error message

### Requirement 3: Execute Generation with Card Reference

**User Story:** As a user, I want the generation to use the dropped-on card's image as reference, so that I can generate variations based on existing storyboard content.

#### Acceptance Criteria

1. WHEN a quick action is dropped on a storyboard card, THE System SHALL extract the card's image URL as the reference image
2. WHEN a generation is triggered via drag-drop, THE System SHALL pass the reference image to the generation service
3. WHEN a generation requires user input (frame count), THE System SHALL display an input dialog before starting generation
4. WHEN generation completes, THE System SHALL display the generated images in the Generation Canvas
5. WHEN generation fails, THE System SHALL display an error message and allow the user to retry

### Requirement 4: Drag Data Transfer

**User Story:** As a developer, I want drag data to be properly formatted and transferred, so that the drop handler can identify the action type and parameters.

#### Acceptance Criteria

1. WHEN a quick action is dragged, THE System SHALL set the drag data type to 'application/json' with action metadata
2. WHEN drag data is transferred, THE System SHALL include: action type, template, and any required parameters
3. WHEN a drop occurs, THE System SHALL parse the drag data to extract the action type and parameters
4. WHEN drag data is invalid or missing, THE System SHALL reject the drop and display an error

### Requirement 5: User Input for Parameterized Actions

**User Story:** As a user, I want to specify parameters (frame count) for actions that require them, so that I can customize the generation.

#### Acceptance Criteria

1. WHEN a multi-grid or narrative-progression action is dropped, THE System SHALL display an input dialog
2. WHEN a user enters a frame count, THE System SHALL validate it against the allowed range (2-12 for multi-grid, 1-12 for narrative-progression)
3. WHEN a user cancels the input dialog, THE System SHALL abort the generation
4. WHEN a user submits valid input, THE System SHALL proceed with generation using the specified parameters

### Requirement 6: Visual Feedback During Drag-Drop

**User Story:** As a user, I want clear visual feedback during drag-drop operations, so that I understand what will happen when I drop.

#### Acceptance Criteria

1. WHEN a quick action is being dragged, THE System SHALL display a drag preview or cursor indicator
2. WHEN a quick action is dragged over a valid drop target, THE System SHALL highlight the target card with a visual indicator
3. WHEN a quick action is dragged over an invalid drop target, THE System SHALL display a "not-allowed" cursor
4. WHEN a drop is completed, THE System SHALL provide visual confirmation (loading state, success message, or error)

### Requirement 7: Error Handling

**User Story:** As a user, I want clear error messages when drag-drop operations fail, so that I can understand what went wrong.

#### Acceptance Criteria

1. IF a drop occurs on the main reference card, THEN THE System SHALL display an error message: "Cannot apply quick actions to the reference image"
2. IF the card's image is missing or invalid, THEN THE System SHALL display an error message: "Invalid reference image"
3. IF generation fails, THEN THE System SHALL display an error message with details about the failure
4. IF drag data is invalid, THEN THE System SHALL reject the drop silently or display a warning

### Requirement 8: Integration with Existing Generation Flow

**User Story:** As a developer, I want the drag-drop feature to integrate seamlessly with existing generation logic, so that all generation types work consistently.

#### Acceptance Criteria

1. WHEN a generation is triggered via drag-drop, THE System SHALL use the same generation service as button-based generation
2. WHEN generation completes, THE System SHALL display results in the same Generation Canvas component
3. WHEN generation fails, THE System SHALL use the same error handling as button-based generation
4. WHEN a user cancels generation, THE System SHALL allow them to retry or cancel the operation

