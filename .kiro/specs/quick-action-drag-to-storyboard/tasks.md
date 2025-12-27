# Implementation Plan: Quick Action Drag-to-Storyboard

## Overview

Implement drag-and-drop functionality that allows users to drag quick action icons from the Quick Storyboard panel onto storyboard cards in the canvas, triggering generation with the card's image as reference.

## Tasks

- [x] 1. Add drag initiation to QuickStoryboard component
  - Modify action buttons to support drag events
  - Serialize action metadata (type, template, parameters) to JSON
  - Set drag data with MIME type 'application/json'
  - Provide visual feedback during drag (cursor, icon preview)
  - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2_

- [x] 2. Add drop handling to StoryboardCard component
  - Implement onDragOver handler to validate drop targets
  - Implement onDragLeave handler to remove visual feedback
  - Implement onDrop handler to process dropped actions
  - Validate that drops are not on main reference card
  - Extract card's image URL as reference
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.3_

- [x] 3. Add drop validation logic
  - Parse drag data to extract action metadata
  - Validate action type is 'quick-action'
  - Validate card is not main reference card
  - Validate card's image URL is valid
  - Display appropriate error messages for invalid drops
  - _Requirements: 2.4, 4.3, 7.1, 7.2, 7.4_

- [x] 4. Add visual feedback for drag-drop operations
  - Highlight valid drop targets during drag over
  - Show "not-allowed" cursor for invalid targets
  - Provide visual confirmation when drop is completed
  - Show loading state during generation
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 5. Integrate drop handler with StoryboardApp
  - Add onDropQuickAction callback to StoryboardCard
  - Implement handler in StoryboardApp to receive drop events
  - Extract action type and parameters from drag data
  - Pass reference image to generation handler
  - _Requirements: 3.1, 3.2, 8.1, 8.2_

- [x] 6. Handle parameterized actions (multi-grid, narrative-progression)
  - Detect if action requires user input
  - Display input dialog when needed
  - Validate user input against allowed ranges
  - Pass validated parameters to generation
  - Allow user to cancel input dialog
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 7. Implement error handling and recovery
  - Display error message if drop is on main reference card
  - Display error message if card image is invalid
  - Display error message if generation fails
  - Allow user to retry after error
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 8. Write unit tests for drag-drop functionality
  - Test QuickStoryboard drag initiation
  - Test StoryboardCard drop validation
  - Test drag data serialization and parsing
  - Test image URL extraction
  - Test error scenarios
  - _Requirements: All_

- [ ] 9. Write property-based tests for correctness properties
  - **Property 1: Drag Data Integrity**
  - **Property 2: Drop Target Validation**
  - **Property 3: Reference Image Extraction**
  - **Property 4: Generation Execution**
  - **Property 5: Parameter Input for Parameterized Actions**
  - **Property 6: Error Handling on Invalid Reference**
  - **Property 7: Visual Feedback During Drag**
  - _Requirements: All_

- [ ] 10. Integration testing
  - Test complete drag-drop flow end-to-end
  - Test with all four action types
  - Test error scenarios and recovery
  - Test with various card configurations
  - _Requirements: All_

- [ ] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Do NOT modify other features or components
- Focus only on drag-drop functionality for quick actions
- Reuse existing generation logic from StoryboardApp
- Maintain consistency with existing error handling patterns
- Use existing visual feedback patterns from the application

