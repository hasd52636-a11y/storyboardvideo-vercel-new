# Implementation Plan: Quick Storyboard Image-to-Image Fix

## Overview

Fix the parameter passing chain in StoryboardApp to correctly pass reference images to the generateSceneImage() function, enabling the image-to-image (edits) API endpoint to be used instead of text-to-image.

## Tasks

- [x] 1.1 Fix three-view generation calls in StoryboardApp
  - Update all 3 generateSceneImage() calls in three-view generation
  - Pass referenceImage as 6th parameter
  - _Requirements: 1.1.2_

- [x] 1.2 Fix multi-grid generation calls in StoryboardApp
  - Update generateSceneImage() call in multi-grid generation
  - Pass referenceImage as 6th parameter
  - _Requirements: 1.1.3_

- [x] 1.3 Fix style-comparison generation calls in StoryboardApp
  - Update all 5 generateSceneImage() calls in style-comparison generation
  - Pass referenceImage as 6th parameter
  - _Requirements: 1.1.4_

- [x] 1.4 Fix narrative-progression generation calls in StoryboardApp
  - Update all N generateSceneImage() calls in narrative-progression generation
  - Pass referenceImage as 6th parameter
  - _Requirements: 1.1.5_

- [x] 1.5 Add validation for missing reference image
  - Check if referenceImage is provided before generation
  - Display error message: "Please upload a reference image to generate storyboard"
  - _Requirements: 1.5_

- [ ]* 1.6 Write unit tests for reference image parameter passing
  - Test that generateSceneImage receives reference image parameter
  - Test that image-to-image endpoint is called when reference image is provided
  - _Requirements: 1.1.1, 1.1.2, 1.1.3, 1.1.4, 1.1.5_

- [ ] 2. Checkpoint - Verify all quick storyboard modes work with reference images
  - Test three-view generation with reference image
  - Test multi-grid generation with reference image
  - Test style-comparison generation with reference image
  - Test narrative-progression generation with reference image

