# Implementation Plan: Storyboard Enhancement

## Overview

This implementation plan breaks down the storyboard enhancement feature into discrete, incremental coding tasks. The plan follows a layered approach: first establishing data models and persistence, then implementing core services, followed by UI components, and finally integrating everything together with comprehensive testing.

## Tasks

- [x] 1. Set up database schema and Prisma models
  - Add Symbol, QuickStoryboardConfig, and GenerationHistory models to prisma/schema.prisma
  - Run Prisma migrations to create tables
  - Generate Prisma client
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 2. Implement Symbol Service
  - [x] 2.1 Create SymbolService class with CRUD operations
    - Implement uploadSymbol, getSymbols, updateSymbol, deleteSymbol methods
    - Add input validation for symbol data
    - _Requirements: 1.3, 1.4, 1.6, 1.7_

  - [x] 2.2 Write property tests for Symbol Service
    - **Property 1: Symbol Persistence Round-Trip**
    - **Property 2: Symbol Validation**
    - **Property 3: Symbol Deletion Completeness**
    - **Validates: Requirements 1.3, 1.4, 1.6, 1.7, 8.1**

- [x] 3. Implement Quick Storyboard Service
  - [x] 3.1 Create QuickStoryboardService class
    - Implement createConfig, getConfig, updateConfig methods
    - Initialize default templates for all four quick-actions
    - _Requirements: 2.4, 2.5, 2.6_

  - [x] 3.2 Write property tests for Quick Storyboard Service
    - **Property 4: Quick Storyboard Configuration Persistence**
    - **Property 5: Default Templates Initialization**
    - **Validates: Requirements 2.4, 2.5, 2.6, 8.2**

- [x] 4. Implement Prompt Template Engine
  - [x] 4.1 Create PromptEngine class
    - Implement parseTemplate, validateTemplate, renderPrompt methods
    - Support placeholder syntax validation (e.g., {subject}, {frameCount})
    - _Requirements: 9.2, 9.3_

  - [x] 4.2 Write property tests for Prompt Template Engine
    - **Property 6: Template Placeholder Validation**
    - **Property 7: Template Substitution Correctness**
    - **Validates: Requirements 9.2, 9.3**

- [x] 5. Implement Image Generation Service (Primary API)
  - [x] 5.1 Create ImageGenerationService class
    - Implement generateImages method for primary API (Sora/Gemini)
    - Implement prompt construction for each quick-action type
    - Add API call logic with error handling
    - _Requirements: 3.3, 3.4, 4.4, 5.2, 6.4_

  - [x] 5.2 Implement Three-View generation logic
    - Construct Three-View prompt using template and symbol data
    - Call API and return three orthographic views
    - _Requirements: 3.3, 3.4, 3.5_

  - [x] 5.3 Implement Multi-Grid generation logic
    - Validate N parameter (2-12)
    - Calculate optimal grid dimensions
    - Construct Multi-Grid prompt
    - Call API and return grid image
    - _Requirements: 4.2, 4.3, 4.4, 4.5_

  - [x] 5.4 Implement Style-Comparison generation logic
    - Select 5 distinct styles from style library
    - Construct Style-Comparison prompts for each style
    - Call API for each style
    - Return comparison layout
    - _Requirements: 5.1, 5.2, 5.3, 5.6_

  - [x] 5.5 Implement Narrative-Progression generation logic
    - Validate N parameter (1-12)
    - Retrieve current canvas image and script
    - Construct Narrative-Progression prompt
    - Call API and return sequential images
    - _Requirements: 6.2, 6.3, 6.4, 6.5_

  - [x] 5.6 Write property tests for Image Generation Service
    - **Property 8: Three-View Generation Trigger**
    - **Property 9: Multi-Grid Dimension Calculation**
    - **Property 10: Style Diversity in Comparison**
    - **Property 11: Narrative Progression Sequence Order**
    - **Validates: Requirements 3.3, 4.2, 5.1, 6.2**

- [x] 6. Implement API Fallback and Error Handling
  - [x] 6.1 Create API adapter pattern for fallback support
    - Implement primary API adapter (Sora/Gemini)
    - Implement fallback adapters (Nanobanana, 即梦) - placeholder for future integration
    - Implement fallback logic with automatic retry
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 6.2 Implement error handling and user messaging
    - Return descriptive error messages on API failure
    - Implement retry logic with exponential backoff
    - _Requirements: 7.5_

  - [x] 6.3 Write property tests for API Fallback
    - **Property 13: API Fallback Activation**
    - **Property 14: Error Message on Complete Failure**
    - **Validates: Requirements 7.2, 7.5**

- [x] 7. Implement Generation History Service
  - [x] 7.1 Create GenerationHistoryService class
    - Implement persistGeneration method
    - Implement getGenerationHistory method
    - _Requirements: 8.3, 8.5_

  - [x] 7.2 Write property tests for Generation History
    - **Property 12: Generation History Persistence**
    - **Validates: Requirements 8.3, 8.5**

- [x] 8. Implement Symbol Library UI Component
  - [x] 8.1 Create SymbolLibrary React component
    - Display grid layout of user symbols
    - Implement symbol upload functionality
    - Implement edit and delete UI
    - _Requirements: 1.1, 1.2, 1.5, 1.8_

  - [x] 8.2 Implement drag-to-canvas functionality
    - Enable dragging symbols from library to canvas
    - Trigger Three-View generation on drop
    - _Requirements: 3.1, 3.2_

  - [x] 8.3 Write unit tests for Symbol Library UI
    - Test symbol grid rendering
    - Test upload dialog
    - Test edit/delete interactions
    - _Requirements: 1.1, 1.5_

- [x] 9. Implement Quick Storyboard UI Component
  - [x] 9.1 Create QuickStoryboard React component
    - Display four quick-action buttons (Three-View, Multi-Grid, Style-Comparison, Narrative-Progression)
    - Display editable prompt templates
    - _Requirements: 2.1, 2.2, 9.1_

  - [x] 9.2 Implement template editing UI
    - Allow users to modify prompt templates
    - Validate templates with placeholder support
    - Implement reset to defaults
    - _Requirements: 2.3, 9.2, 9.3, 9.6_

  - [x] 9.3 Implement quick-action dialogs
    - Multi-Grid: prompt for N (2-12)
    - Narrative-Progression: prompt for N (1-12)
    - Style-Comparison: no input needed (auto-select 5 styles)
    - Three-View: triggered by drag-drop
    - _Requirements: 4.1, 6.1_

  - [x] 9.4 Write unit tests for Quick Storyboard UI
    - Test button rendering
    - Test template editing
    - Test input validation dialogs
    - _Requirements: 2.1, 2.2, 9.1_

- [x] 10. Implement Canvas Integration
  - [x] 10.1 Integrate generation results with canvas
    - Display generated images on canvas
    - Support Three-View layout (3 images)
    - Support Multi-Grid layout (N images in grid)
    - Support Style-Comparison layout (5 images in row)
    - Support Narrative-Progression layout (N images in sequence)
    - _Requirements: 3.5, 4.6, 5.4, 6.6_

  - [x] 10.2 Implement generation history display
    - Show previous generations with metadata
    - Allow users to view and reuse past generations
    - _Requirements: 8.5_

  - [x] 10.3 Write unit tests for Canvas Integration
    - Test image rendering for each layout type
    - Test generation history display
    - _Requirements: 3.5, 4.6, 5.4, 6.6_

- [x] 11. Checkpoint - Ensure all tests pass
  - Run all unit tests and property tests
  - Verify test coverage >80% for core logic
  - Fix any failing tests
  - _Requirements: All_

- [x] 12. Implement Database Query Performance Optimization
  - [x] 12.1 Add database indexes
    - Index on userId for Symbol, QuickStoryboardConfig, GenerationHistory
    - Index on type for GenerationHistory
    - _Requirements: 8.6_

  - [x] 12.2 Implement query caching
    - Cache user symbols and configurations
    - Implement cache invalidation on updates
    - _Requirements: 8.6_

  - [x] 12.3 Write property tests for Database Performance
    - **Property 15: Database Query Performance**
    - **Validates: Requirements 8.6**

- [x] 13. Implement Custom Template Usage Priority
  - [x] 13.1 Update quick-action logic
    - Check for custom templates before using defaults
    - Use custom template if available
    - _Requirements: 9.5_

  - [x] 13.2 Write property tests for Template Priority
    - **Property 16: Custom Template Usage Priority**
    - **Validates: Requirements 9.5**

- [x] 14. Final Integration and Testing
  - [x] 14.1 End-to-end workflow testing
    - Test complete flow: upload symbol → drag to canvas → generate three-view
    - Test complete flow: create config → modify template → trigger quick-action
    - Test complete flow: generate images → view history → reuse generation
    - _Requirements: All_

  - [x] 14.2 Error scenario testing
    - Test invalid symbol upload
    - Test invalid template modification
    - Test API failures and fallback
    - Test database errors
    - _Requirements: 7.5, 8.1, 8.2, 8.3_

  - [x] 14.3 Write integration tests
    - Test symbol upload → retrieval → deletion
    - Test config creation → modification → retrieval
    - Test generation → persistence → history retrieval
    - _Requirements: All_

- [x] 15. Final checkpoint - Ensure all tests pass
  - Run all tests (unit, property, integration)
  - Verify test coverage >80% for core logic, >60% for UI
  - Verify database performance <500ms
  - Fix any remaining issues
  - _Requirements: All_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests use fast-check library for property-based testing
- Minimum 100 iterations per property test
- Database performance tests should use realistic data sizes
- All API calls should include timeout handling (30 seconds default)
- Symbol icons should be stored as Base64 or URLs (not raw files in DB)
- Generation history should be paginated (20 items per page) for performance

