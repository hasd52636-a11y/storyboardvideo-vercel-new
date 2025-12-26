# Camera Angle Library Design - Multi-Perspective View Generation

## Overview

The **Camera Angle Library** is an enhanced version of the Multi-Grid feature that generates multiple camera angles and distances of the **same subject/scene**, rather than creating new content. This feature enables storyboard creators to quickly visualize a subject from different perspectives without recreating the scene.

## Key Concept

**Same Scene, Different Perspectives**: All generated frames show the same subject/scene from different camera angles and distances, maintaining scene consistency while varying the viewpoint.

## 12 Standard Camera Angles

The system maintains a library of 12 standard camera angles organized by distance and perspective:

### Close Category (3 angles)
1. **Extreme Close-Up** (1-2 units distance)
   - Macro detail focus
   - Shows fine details and textures
   - Keywords: "extreme close-up", "macro", "detail focus"

2. **Close-Up** (2-3 units distance)
   - Facial/detail focus
   - Shows specific features clearly
   - Keywords: "close-up", "facial focus", "detail shot"

3. **Medium Close-Up** (3-4 units distance)
   - Upper body/object focus
   - Shows subject with some context
   - Keywords: "medium close-up", "upper body", "object focus"

### Medium Category (4 angles)
4. **Medium Shot** (4-5 units distance)
   - Waist-up framing
   - Standard conversational distance
   - Keywords: "medium shot", "waist-up", "standard framing"

5. **Medium Wide** (5-6 units distance)
   - Full body/object visible
   - Subject with surrounding space
   - Keywords: "medium wide", "full body", "wide framing"

6. **Wide Shot** (6-8 units distance)
   - Full scene with context
   - Subject in environment
   - Keywords: "wide shot", "full scene", "environmental context"

7. **Very Wide Shot** (8-10 units distance)
   - Landscape/establishing view
   - Entire location visible
   - Keywords: "very wide shot", "landscape", "establishing shot"

### Special Category (5 angles)
8. **Overhead View** (90° angle)
   - Bird's eye perspective
   - Top-down view
   - Keywords: "overhead", "bird's eye", "top-down"

9. **Low Angle View** (-45° angle)
   - Dramatic upward perspective
   - Looking up at subject
   - Keywords: "low angle", "dramatic", "upward perspective"

10. **Three-Quarter View** (45° rotated)
    - Rotated perspective
    - Shows depth and dimension
    - Keywords: "three-quarter", "rotated", "dimensional"

11. **Side Profile** (90° lateral)
    - Lateral view
    - Shows profile clearly
    - Keywords: "side profile", "lateral", "profile view"

12. **Bird's Eye View** (85-90° angle)
    - Extreme overhead
    - Flat top-down perspective
    - Keywords: "bird's eye", "extreme overhead", "flat perspective"

## Intelligent Selection Algorithm

When a user requests N camera angles (2-12), the system:

1. **Mandatory Representation**: Always includes:
   - At least 1 close-up angle (from Close category)
   - At least 1 medium shot (from Medium category)
   - At least 1 wide shot (from Medium or Special category)

2. **Random Selection**: Randomly selects remaining angles to reach N total

3. **Uniqueness**: Ensures no duplicate angles in the selection

4. **Visual Variety**: Distributes angles across categories for comprehensive coverage

### Example Selections

**N=2**: Close-Up + Wide Shot (minimum mandatory coverage)

**N=3**: Extreme Close-Up + Medium Shot + Very Wide Shot

**N=4**: Close-Up + Medium Shot + Wide Shot + Overhead View

**N=6**: Extreme Close-Up + Close-Up + Medium Shot + Wide Shot + Low Angle View + Three-Quarter View

**N=12**: All 12 angles (complete coverage)

## Grid Dimension Calculation

The system calculates optimal grid dimensions for N frames:

| N | Dimensions | Layout |
|---|-----------|--------|
| 2 | 2x1 | 2 columns, 1 row |
| 3 | 3x1 | 3 columns, 1 row |
| 4 | 2x2 | 2 columns, 2 rows |
| 5 | 5x1 | 5 columns, 1 row |
| 6 | 3x2 | 3 columns, 2 rows |
| 7 | 7x1 | 7 columns, 1 row |
| 8 | 4x2 | 4 columns, 2 rows |
| 9 | 3x3 | 3 columns, 3 rows |
| 10 | 5x2 | 5 columns, 2 rows |
| 11 | 11x1 | 11 columns, 1 row |
| 12 | 4x3 | 4 columns, 3 rows |

## Prompt Generation

For each selected camera angle, the system generates a detailed prompt that:

1. **Specifies the camera angle**: Uses angle-specific keywords and descriptions
2. **Maintains scene consistency**: Emphasizes that all frames show the same subject/scene
3. **Includes distance information**: Specifies relative distance for each angle
4. **Provides composition guidance**: Describes framing and composition for each angle

### Example Prompt Structure

```
Generate 6 camera angles of [SUBJECT]:

Frame 1 (Extreme Close-Up): Macro detail focus, 1-2 units distance. Show fine details and textures. [SUBJECT] fills the frame.

Frame 2 (Close-Up): Facial/detail focus, 2-3 units distance. Show specific features clearly.

Frame 3 (Medium Shot): Waist-up framing, 4-5 units distance. Standard conversational distance.

Frame 4 (Wide Shot): Full scene with context, 6-8 units distance. [SUBJECT] in environment.

Frame 5 (Low Angle View): Dramatic upward perspective, -45° angle. Looking up at [SUBJECT].

Frame 6 (Three-Quarter View): Rotated perspective, 45° angle. Shows depth and dimension.

IMPORTANT: All frames show the SAME [SUBJECT] and SAME SCENE from different camera angles and distances. 
Do NOT recreate or change the subject. Only vary the camera perspective.
```

## Frame Labeling

Each frame in the generated grid includes:
- **Frame number**: Sequential numbering (1-N)
- **Camera angle name**: e.g., "Close-Up", "Wide Shot"
- **Distance/angle info**: e.g., "2-3 units", "45° angle"

Example label: "Frame 2: Close-Up (2-3 units)"

## Implementation Details

### Data Structure

```typescript
enum CameraAngle {
  EXTREME_CLOSE_UP = 'extreme_close_up',
  CLOSE_UP = 'close_up',
  MEDIUM_CLOSE_UP = 'medium_close_up',
  MEDIUM_SHOT = 'medium_shot',
  MEDIUM_WIDE = 'medium_wide',
  WIDE_SHOT = 'wide_shot',
  VERY_WIDE_SHOT = 'very_wide_shot',
  OVERHEAD_VIEW = 'overhead_view',
  LOW_ANGLE_VIEW = 'low_angle_view',
  THREE_QUARTER_VIEW = 'three_quarter_view',
  SIDE_PROFILE = 'side_profile',
  BIRDS_EYE_VIEW = 'birds_eye_view'
}

interface CameraAngleDefinition {
  angle: CameraAngle;
  name: string;
  description: string;
  category: 'close' | 'medium' | 'wide' | 'special';
  distance: number; // relative scale 1-10
  angleInDegrees: number; // 0-360
  promptKeywords: string[];
}
```

### Selection Algorithm Pseudocode

```
function selectCameraAngles(frameCount: number): CameraAngle[] {
  const selected = [];
  
  // Step 1: Add mandatory angles
  selected.push(randomAngleFromCategory('close'));
  selected.push(randomAngleFromCategory('medium'));
  selected.push(randomAngleFromCategory('wide'));
  
  // Step 2: Add remaining angles
  const remaining = frameCount - 3;
  const allAngles = getAllAngles();
  const available = allAngles.filter(a => !selected.includes(a));
  
  for (let i = 0; i < remaining; i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    selected.push(available[randomIndex]);
    available.splice(randomIndex, 1);
  }
  
  return selected;
}
```

## Benefits

1. **Scene Consistency**: All frames show the same subject/scene
2. **Comprehensive Coverage**: Mandatory representation ensures key perspectives
3. **Visual Variety**: 12 angles provide diverse viewpoints
4. **Intelligent Selection**: Algorithm ensures balanced angle distribution
5. **Quick Generation**: One-click generation of multi-perspective views
6. **Professional Output**: Grid layout with proper labeling and organization

## Use Cases

1. **Product Photography**: Show a product from multiple angles
2. **Character Design**: Visualize a character from different perspectives
3. **Environment Design**: Show a location from various viewpoints
4. **Storyboarding**: Visualize scenes from different camera positions
5. **Architectural Visualization**: Show buildings/spaces from multiple angles
6. **Animation Planning**: Plan camera movements and angles

## Integration with Existing System

The Camera Angle Library integrates with:
- **Quick Storyboard Module**: Multi-Grid quick-action button
- **Prompt Template Engine**: Uses customizable templates with camera angle placeholders
- **Image Generation Service**: Calls API with camera-angle-specific prompts
- **Generation History**: Persists selected angles and grid configuration
- **Database**: Stores camera angle selections and metadata

## Future Enhancements

1. **Custom Angle Library**: Allow users to define custom camera angles
2. **Angle Presets**: Save frequently-used angle combinations
3. **Animation Paths**: Generate camera movement paths between angles
4. **Depth Information**: Include depth maps for 3D visualization
5. **Lighting Variations**: Combine with different lighting conditions
6. **Time-of-Day Variations**: Show subject at different times
