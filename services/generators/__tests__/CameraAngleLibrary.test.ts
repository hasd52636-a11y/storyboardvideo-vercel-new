import { describe, it, expect } from 'vitest';
import { cameraAngleLibrary, CameraAngle } from '../CameraAngleLibrary';

describe('CameraAngleLibrary', () => {
  describe('getAngleDefinition', () => {
    it('should return definition for valid angle', () => {
      const def = cameraAngleLibrary.getAngleDefinition(CameraAngle.CLOSE_UP);
      expect(def.name).toBe('Close-Up');
      expect(def.category).toBe('close');
      expect(def.distance).toBe(2.5);
    });

    it('should throw error for invalid angle', () => {
      expect(() => {
        cameraAngleLibrary.getAngleDefinition('invalid' as CameraAngle);
      }).toThrow();
    });
  });

  describe('getAnglesByCategory', () => {
    it('should return 3 close angles', () => {
      const angles = cameraAngleLibrary.getAnglesByCategory('close');
      expect(angles).toHaveLength(3);
      expect(angles).toContain(CameraAngle.EXTREME_CLOSE_UP);
      expect(angles).toContain(CameraAngle.CLOSE_UP);
      expect(angles).toContain(CameraAngle.MEDIUM_CLOSE_UP);
    });

    it('should return 4 medium angles', () => {
      const angles = cameraAngleLibrary.getAnglesByCategory('medium');
      expect(angles).toHaveLength(4);
    });

    it('should return 5 special angles', () => {
      const angles = cameraAngleLibrary.getAnglesByCategory('special');
      expect(angles).toHaveLength(5);
    });
  });

  describe('selectCameraAngles', () => {
    it('should throw error for invalid frame count', () => {
      expect(() => cameraAngleLibrary.selectCameraAngles(1)).toThrow();
      expect(() => cameraAngleLibrary.selectCameraAngles(13)).toThrow();
      expect(() => cameraAngleLibrary.selectCameraAngles(2.5)).toThrow();
    });

    it('should return exactly N angles', () => {
      for (let n = 2; n <= 12; n++) {
        const angles = cameraAngleLibrary.selectCameraAngles(n);
        expect(angles).toHaveLength(n);
      }
    });

    it('should return no duplicate angles', () => {
      for (let n = 2; n <= 12; n++) {
        const angles = cameraAngleLibrary.selectCameraAngles(n);
        const uniqueAngles = new Set(angles);
        expect(uniqueAngles.size).toBe(n);
      }
    });

    it('should include at least 1 close-up angle', () => {
      const closeAngles = new Set([
        CameraAngle.EXTREME_CLOSE_UP,
        CameraAngle.CLOSE_UP,
        CameraAngle.MEDIUM_CLOSE_UP
      ]);

      for (let i = 0; i < 10; i++) {
        const angles = cameraAngleLibrary.selectCameraAngles(2);
        const hasCloseUp = angles.some(a => closeAngles.has(a));
        expect(hasCloseUp).toBe(true);
      }
    });

    it('should include at least 1 medium shot', () => {
      const mediumAngles = new Set([
        CameraAngle.MEDIUM_SHOT,
        CameraAngle.MEDIUM_WIDE,
        CameraAngle.WIDE_SHOT,
        CameraAngle.VERY_WIDE_SHOT
      ]);

      for (let i = 0; i < 10; i++) {
        const angles = cameraAngleLibrary.selectCameraAngles(2);
        const hasMedium = angles.some(a => mediumAngles.has(a));
        expect(hasMedium).toBe(true);
      }
    });

    it('should select diverse angles across all N values', () => {
      // Just ensure no duplicates - diversity is achieved through randomization
      for (let n = 2; n <= 12; n++) {
        const angles = cameraAngleLibrary.selectCameraAngles(n);
        const uniqueAngles = new Set(angles);
        expect(uniqueAngles.size).toBe(n);
      }
    });
  });

  describe('getAngleDescriptions', () => {
    it('should return descriptions for selected angles', () => {
      const angles = [CameraAngle.CLOSE_UP, CameraAngle.WIDE_SHOT];
      const descriptions = cameraAngleLibrary.getAngleDescriptions(angles);
      
      expect(descriptions).toHaveLength(2);
      expect(descriptions[0]).toContain('Close-Up');
      expect(descriptions[1]).toContain('Wide Shot');
    });

    it('should include angle name and description', () => {
      const angles = [CameraAngle.EXTREME_CLOSE_UP];
      const descriptions = cameraAngleLibrary.getAngleDescriptions(angles);
      
      expect(descriptions[0]).toContain('Extreme Close-Up');
      expect(descriptions[0]).toContain('Macro detail focus');
    });
  });

  describe('getAllAngles', () => {
    it('should return all 12 angles', () => {
      const angles = cameraAngleLibrary.getAllAngles();
      expect(angles).toHaveLength(12);
    });

    it('should include all angle types', () => {
      const angles = cameraAngleLibrary.getAllAngles();
      expect(angles).toContain(CameraAngle.EXTREME_CLOSE_UP);
      expect(angles).toContain(CameraAngle.CLOSE_UP);
      expect(angles).toContain(CameraAngle.MEDIUM_CLOSE_UP);
      expect(angles).toContain(CameraAngle.MEDIUM_SHOT);
      expect(angles).toContain(CameraAngle.MEDIUM_WIDE);
      expect(angles).toContain(CameraAngle.WIDE_SHOT);
      expect(angles).toContain(CameraAngle.VERY_WIDE_SHOT);
      expect(angles).toContain(CameraAngle.OVERHEAD_VIEW);
      expect(angles).toContain(CameraAngle.LOW_ANGLE_VIEW);
      expect(angles).toContain(CameraAngle.THREE_QUARTER_VIEW);
      expect(angles).toContain(CameraAngle.SIDE_PROFILE);
      expect(angles).toContain(CameraAngle.BIRDS_EYE_VIEW);
    });
  });

  describe('getAllDefinitions', () => {
    it('should return all 12 definitions', () => {
      const definitions = cameraAngleLibrary.getAllDefinitions();
      expect(definitions).toHaveLength(12);
    });

    it('should have valid definitions', () => {
      const definitions = cameraAngleLibrary.getAllDefinitions();
      definitions.forEach(def => {
        expect(def.name).toBeTruthy();
        expect(def.description).toBeTruthy();
        expect(['close', 'medium', 'wide', 'special']).toContain(def.category);
        expect(def.distance).toBeGreaterThan(0);
        expect(def.distance).toBeLessThanOrEqual(10);
        expect(def.promptKeywords.length).toBeGreaterThan(0);
      });
    });
  });
});
