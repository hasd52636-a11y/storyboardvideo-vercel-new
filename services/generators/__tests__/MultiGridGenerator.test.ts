import { describe, it, expect } from 'vitest';
import { multiGridGenerator } from '../MultiGridGenerator';
import { cameraAngleLibrary, CameraAngle } from '../CameraAngleLibrary';

describe('MultiGridGenerator', () => {
  describe('Camera Angle Selection', () => {
    it('should select N distinct camera angles for N=2', () => {
      const selectedAngles = cameraAngleLibrary.selectCameraAngles(2);
      expect(selectedAngles).toHaveLength(2);
      
      const uniqueAngles = new Set(selectedAngles);
      expect(uniqueAngles.size).toBe(2);
    });

    it('should select N distinct camera angles for N=6', () => {
      const selectedAngles = cameraAngleLibrary.selectCameraAngles(6);
      expect(selectedAngles).toHaveLength(6);
      
      const uniqueAngles = new Set(selectedAngles);
      expect(uniqueAngles.size).toBe(6);
    });

    it('should select N distinct camera angles for N=12', () => {
      const selectedAngles = cameraAngleLibrary.selectCameraAngles(12);
      expect(selectedAngles).toHaveLength(12);
      
      const uniqueAngles = new Set(selectedAngles);
      expect(uniqueAngles.size).toBe(12);
    });

    it('should never have duplicate angles in selection', () => {
      for (let n = 2; n <= 12; n++) {
        const selectedAngles = cameraAngleLibrary.selectCameraAngles(n);
        const uniqueAngles = new Set(selectedAngles);
        expect(uniqueAngles.size).toBe(n);
      }
    });
  });

  describe('Grid Dimension Calculation', () => {
    it('should calculate correct grid dimensions for all N values', () => {
      const expectedDimensions: Record<number, string> = {
        2: '2x1',
        3: '3x1',
        4: '2x2',
        5: '5x1',
        6: '3x2',
        7: '7x1',
        8: '4x2',
        9: '3x3',
        10: '5x2',
        11: '11x1',
        12: '4x3',
      };

      for (let n = 2; n <= 12; n++) {
        const dimensions = multiGridGenerator.calculateGridDimensions(n);
        expect(dimensions).toBe(expectedDimensions[n]);
      }
    });

    it('should result in exactly N total frames', () => {
      for (let n = 2; n <= 12; n++) {
        const gridDimensions = multiGridGenerator.calculateGridDimensions(n);
        const [cols, rows] = gridDimensions.split('x').map(Number);
        const totalFrames = cols * rows;
        expect(totalFrames).toBe(n);
      }
    });

    it('should throw error for invalid frame count', () => {
      expect(() => multiGridGenerator.calculateGridDimensions(1)).toThrow();
      expect(() => multiGridGenerator.calculateGridDimensions(13)).toThrow();
      expect(() => multiGridGenerator.calculateGridDimensions(0)).toThrow();
    });
  });

  describe('Prompt Generation', () => {
    it('should generate valid prompt with camera angles', () => {
      const request = {
        frameCount: 4,
        subject: 'a red apple',
        template: 'Generate {frameCount} camera angles of {subject}',
        context: 'test context'
      };

      const result = multiGridGenerator.generatePrompt(request);

      expect(result.prompt).toBeTruthy();
      expect(result.gridDimensions).toBe('2x2');
      expect(result.selectedAngles).toHaveLength(4);
      expect(result.angleDescriptions).toHaveLength(4);
      expect(result.prompt).toContain('a red apple');
    });

    it('should have no duplicate angles in generated result', () => {
      const request = {
        frameCount: 6,
        subject: 'a landscape',
        template: 'Generate {frameCount} camera angles of {subject}'
      };

      const result = multiGridGenerator.generatePrompt(request);
      const uniqueAngles = new Set(result.selectedAngles);
      expect(uniqueAngles.size).toBe(6);
    });

    it('should include angle descriptions in prompt', () => {
      const request = {
        frameCount: 3,
        subject: 'a building',
        template: 'Generate {frameCount} camera angles of {subject}: {angleDescriptions}'
      };

      const result = multiGridGenerator.generatePrompt(request);
      result.angleDescriptions.forEach(desc => {
        expect(result.prompt).toContain(desc);
      });
    });
  });

  describe('Validation', () => {
    it('should validate correct requests', () => {
      const request = {
        frameCount: 4,
        subject: 'test subject',
        template: 'Generate {frameCount} camera angles of {subject}'
      };

      expect(multiGridGenerator.validate(request)).toBe(true);
    });

    it('should reject invalid frame count', () => {
      const request1 = {
        frameCount: 1,
        subject: 'test',
        template: 'Generate {frameCount} camera angles'
      };
      expect(multiGridGenerator.validate(request1)).toBe(false);

      const request2 = {
        frameCount: 13,
        subject: 'test',
        template: 'Generate {frameCount} camera angles'
      };
      expect(multiGridGenerator.validate(request2)).toBe(false);
    });

    it('should reject empty subject', () => {
      const request = {
        frameCount: 4,
        subject: '',
        template: 'Generate {frameCount} camera angles'
      };
      expect(multiGridGenerator.validate(request)).toBe(false);
    });

    it('should reject empty template', () => {
      const request = {
        frameCount: 4,
        subject: 'test',
        template: ''
      };
      expect(multiGridGenerator.validate(request)).toBe(false);
    });
  });
});
