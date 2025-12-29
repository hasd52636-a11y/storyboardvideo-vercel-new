# App Title Display Fix - Implementation Tasks

## Overview

Fix the app title "分镜大师" (Storyboard Master) display issue in the header. The title should be visible next to the logo with proper styling, color contrast, and positioning.

## Tasks

- [ ] 1. Inspect Header Element
  - Open browser DevTools and inspect the header element
  - Check if the title text is present in the DOM
  - Verify the title container has correct dimensions (not zero width/height)
  - Check if text is hidden by CSS (display: none, visibility: hidden, opacity: 0)
  - _Requirements: 1.1, 1.3_

- [ ] 2. Verify Text Color and Contrast
  - Check the computed CSS color for the title text
  - Verify text color matches the theme (white for dark, dark for light)
  - Ensure text color has sufficient contrast with background
  - Test with both dark and light themes
  - _Requirements: 1.2, 4.1, 4.2_

- [ ] 3. Check Container Overflow
  - Verify the title container doesn't have `overflow-hidden`
  - Ensure the container has sufficient width to display the text
  - Check if text is being clipped by parent container
  - Verify flex layout is working correctly
  - _Requirements: 1.3, 1.4_

- [ ] 4. Verify Z-Index and Positioning
  - Check the z-index of the header (should be z-40)
  - Verify the title is not hidden behind other elements
  - Check if pointer-events-auto is applied to title container
  - Ensure positioning is correct (flex items-center)
  - _Requirements: 2.1, 2.2, 2.3_

- [ ]* 4.1 Write property test for title visibility
  - **Property 1: App Title Is Visible**
  - **Validates: Requirements 1.1, 1.4**

- [ ] 5. Test Language Support
  - Switch language to Chinese and verify "分镜大师" displays
  - Switch language to English and verify "Storyboard Master" displays
  - Verify subtitle displays correct text for each language
  - _Requirements: 4.3, 4.4_

- [ ]* 5.1 Write property test for language support
  - **Property 6: Language Support**
  - **Validates: Requirements 4.3, 4.4**

- [ ] 6. Test Theme Support
  - Switch to dark theme and verify title is white
  - Switch to light theme and verify title is dark
  - Verify subtitle is purple in both themes
  - _Requirements: 4.1, 4.2_

- [ ]* 6.1 Write property test for theme support
  - **Property 7: Theme Support**
  - **Validates: Requirements 4.1, 4.2**

- [ ] 7. Verify Font Rendering
  - Check that font-black class is applied (font-weight: 900)
  - Verify text-lg class is applied (font-size: 1.125rem)
  - Check that tracking-tight class is applied (letter-spacing: -0.025em)
  - Ensure text renders without visual artifacts
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ]* 7.1 Write property test for font rendering
  - **Property 8: Font Rendering**
  - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**

- [ ] 8. Fix Any Issues Found
  - If text color is wrong, update the className to use correct color
  - If container is too small, add width constraints
  - If text is hidden, remove any display: none or visibility: hidden
  - If z-index is too low, increase it
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 9. Checkpoint - Verify Title Display
  - Manually verify title is visible in header
  - Test with both themes (dark and light)
  - Test with both languages (Chinese and English)
  - Verify subtitle is displayed below title
  - Verify no TypeScript errors or diagnostics

- [ ]* 9.1 Write integration test for title display
  - **Property 1: App Title Is Visible**
  - **Property 2: Title Color Contrasts with Background**
  - **Property 3: Title Is Not Hidden**
  - **Property 4: Title Positioning Is Correct**
  - **Property 5: Subtitle Is Visible**
  - **Validates: All Requirements**

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Use browser DevTools to inspect and debug the header element
- Test with multiple themes and languages to ensure proper display
- Verify no CSS conflicts or overrides are hiding the title
