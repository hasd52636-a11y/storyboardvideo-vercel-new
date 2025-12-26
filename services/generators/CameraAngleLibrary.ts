/**
 * Camera Angle Library
 * Manages 12 standard camera angles for multi-perspective view generation
 */

export enum CameraAngle {
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

export interface CameraAngleDefinition {
  angle: CameraAngle;
  name: string;
  description: string;
  category: 'close' | 'medium' | 'wide' | 'special';
  distance: number; // relative scale 1-10
  angleInDegrees: number; // 0-360
  promptKeywords: string[];
}

export class CameraAngleLibrary {
  private angles: Map<CameraAngle, CameraAngleDefinition>;

  constructor() {
    this.angles = this.initializeAngles();
  }

  /**
   * Initialize 12 standard camera angles
   */
  private initializeAngles(): Map<CameraAngle, CameraAngleDefinition> {
    const angles = new Map<CameraAngle, CameraAngleDefinition>();

    // Close Category (3 angles)
    angles.set(CameraAngle.EXTREME_CLOSE_UP, {
      angle: CameraAngle.EXTREME_CLOSE_UP,
      name: 'Extreme Close-Up',
      description: 'Macro detail focus, 1-2 units distance. Shows fine details and textures.',
      category: 'close',
      distance: 1.5,
      angleInDegrees: 0,
      promptKeywords: ['extreme close-up', 'macro', 'detail focus', 'fine details']
    });

    angles.set(CameraAngle.CLOSE_UP, {
      angle: CameraAngle.CLOSE_UP,
      name: 'Close-Up',
      description: 'Facial/detail focus, 2-3 units distance. Shows specific features clearly.',
      category: 'close',
      distance: 2.5,
      angleInDegrees: 0,
      promptKeywords: ['close-up', 'facial focus', 'detail shot', 'specific features']
    });

    angles.set(CameraAngle.MEDIUM_CLOSE_UP, {
      angle: CameraAngle.MEDIUM_CLOSE_UP,
      name: 'Medium Close-Up',
      description: 'Upper body/object focus, 3-4 units distance. Shows subject with some context.',
      category: 'close',
      distance: 3.5,
      angleInDegrees: 0,
      promptKeywords: ['medium close-up', 'upper body', 'object focus', 'with context']
    });

    // Medium Category (4 angles)
    angles.set(CameraAngle.MEDIUM_SHOT, {
      angle: CameraAngle.MEDIUM_SHOT,
      name: 'Medium Shot',
      description: 'Waist-up framing, 4-5 units distance. Standard conversational distance.',
      category: 'medium',
      distance: 4.5,
      angleInDegrees: 0,
      promptKeywords: ['medium shot', 'waist-up', 'standard framing', 'conversational']
    });

    angles.set(CameraAngle.MEDIUM_WIDE, {
      angle: CameraAngle.MEDIUM_WIDE,
      name: 'Medium Wide',
      description: 'Full body/object visible, 5-6 units distance. Subject with surrounding space.',
      category: 'medium',
      distance: 5.5,
      angleInDegrees: 0,
      promptKeywords: ['medium wide', 'full body', 'wide framing', 'surrounding space']
    });

    angles.set(CameraAngle.WIDE_SHOT, {
      angle: CameraAngle.WIDE_SHOT,
      name: 'Wide Shot',
      description: 'Full scene with context, 6-8 units distance. Subject in environment.',
      category: 'medium',
      distance: 7,
      angleInDegrees: 0,
      promptKeywords: ['wide shot', 'full scene', 'environmental context', 'in environment']
    });

    angles.set(CameraAngle.VERY_WIDE_SHOT, {
      angle: CameraAngle.VERY_WIDE_SHOT,
      name: 'Very Wide Shot',
      description: 'Landscape/establishing view, 8-10 units distance. Entire location visible.',
      category: 'medium',
      distance: 9,
      angleInDegrees: 0,
      promptKeywords: ['very wide shot', 'landscape', 'establishing shot', 'entire location']
    });

    // Special Category (5 angles)
    angles.set(CameraAngle.OVERHEAD_VIEW, {
      angle: CameraAngle.OVERHEAD_VIEW,
      name: 'Overhead View',
      description: 'Bird\'s eye perspective, 90° angle. Top-down view.',
      category: 'special',
      distance: 5,
      angleInDegrees: 90,
      promptKeywords: ['overhead', 'bird\'s eye', 'top-down', 'aerial view']
    });

    angles.set(CameraAngle.LOW_ANGLE_VIEW, {
      angle: CameraAngle.LOW_ANGLE_VIEW,
      name: 'Low Angle View',
      description: 'Dramatic upward perspective, -45° angle. Looking up at subject.',
      category: 'special',
      distance: 4,
      angleInDegrees: -45,
      promptKeywords: ['low angle', 'dramatic', 'upward perspective', 'looking up']
    });

    angles.set(CameraAngle.THREE_QUARTER_VIEW, {
      angle: CameraAngle.THREE_QUARTER_VIEW,
      name: 'Three-Quarter View',
      description: 'Rotated perspective, 45° angle. Shows depth and dimension.',
      category: 'special',
      distance: 5,
      angleInDegrees: 45,
      promptKeywords: ['three-quarter', 'rotated', 'dimensional', 'depth']
    });

    angles.set(CameraAngle.SIDE_PROFILE, {
      angle: CameraAngle.SIDE_PROFILE,
      name: 'Side Profile',
      description: 'Lateral view, 90° lateral angle. Shows profile clearly.',
      category: 'special',
      distance: 5,
      angleInDegrees: 90,
      promptKeywords: ['side profile', 'lateral', 'profile view', 'side view']
    });

    angles.set(CameraAngle.BIRDS_EYE_VIEW, {
      angle: CameraAngle.BIRDS_EYE_VIEW,
      name: 'Bird\'s Eye View',
      description: 'Extreme overhead, 85-90° angle. Flat top-down perspective.',
      category: 'special',
      distance: 8,
      angleInDegrees: 88,
      promptKeywords: ['bird\'s eye', 'extreme overhead', 'flat perspective', 'top view']
    });

    return angles;
  }

  /**
   * Get angle definition by angle enum
   */
  getAngleDefinition(angle: CameraAngle): CameraAngleDefinition {
    const definition = this.angles.get(angle);
    if (!definition) {
      throw new Error(`Unknown camera angle: ${angle}`);
    }
    return definition;
  }

  /**
   * Get all angles in a category
   */
  getAnglesByCategory(category: 'close' | 'medium' | 'wide' | 'special'): CameraAngle[] {
    const result: CameraAngle[] = [];
    this.angles.forEach((def, angle) => {
      if (def.category === category) {
        result.push(angle);
      }
    });
    return result;
  }

  /**
   * Intelligently select N camera angles with mandatory representation
   * - At least 1 close-up angle
   * - At least 1 medium shot
   * - At least 1 wide shot (when N >= 3)
   * - Remaining angles randomly selected
   */
  selectCameraAngles(frameCount: number): CameraAngle[] {
    if (!Number.isInteger(frameCount) || frameCount < 2 || frameCount > 12) {
      throw new Error('Frame count must be an integer between 2 and 12');
    }

    const selected: CameraAngle[] = [];
    const used = new Set<CameraAngle>();

    // Step 1: Add mandatory angles based on frameCount
    // At least 1 close-up
    const closeAngles = this.getAnglesByCategory('close');
    const closeAngle = closeAngles[Math.floor(Math.random() * closeAngles.length)];
    selected.push(closeAngle);
    used.add(closeAngle);

    // At least 1 medium shot
    const mediumAngles = this.getAnglesByCategory('medium');
    let mediumAngle = mediumAngles[Math.floor(Math.random() * mediumAngles.length)];
    while (used.has(mediumAngle)) {
      mediumAngle = mediumAngles[Math.floor(Math.random() * mediumAngles.length)];
    }
    selected.push(mediumAngle);
    used.add(mediumAngle);

    // At least 1 wide shot (only if frameCount >= 3)
    if (frameCount >= 3) {
      const widePool = [
        ...this.getAnglesByCategory('medium').filter(a => !used.has(a)),
        ...this.getAnglesByCategory('special')
      ];
      const wideAngle = widePool[Math.floor(Math.random() * widePool.length)];
      selected.push(wideAngle);
      used.add(wideAngle);
    }

    // Step 2: Add remaining angles
    const remaining = frameCount - selected.length;
    const allAngles = Array.from(this.angles.keys());
    const available = allAngles.filter(a => !used.has(a));

    for (let i = 0; i < remaining; i++) {
      if (available.length === 0) break;
      const randomIndex = Math.floor(Math.random() * available.length);
      const angle = available[randomIndex];
      selected.push(angle);
      available.splice(randomIndex, 1);
    }

    return selected;
  }

  /**
   * Get descriptions for selected angles
   */
  getAngleDescriptions(angles: CameraAngle[]): string[] {
    return angles.map(angle => {
      const def = this.getAngleDefinition(angle);
      return `${def.name}: ${def.description}`;
    });
  }

  /**
   * Get all angles
   */
  getAllAngles(): CameraAngle[] {
    return Array.from(this.angles.keys());
  }

  /**
   * Get all angle definitions
   */
  getAllDefinitions(): CameraAngleDefinition[] {
    return Array.from(this.angles.values());
  }
}

export const cameraAngleLibrary = new CameraAngleLibrary();
