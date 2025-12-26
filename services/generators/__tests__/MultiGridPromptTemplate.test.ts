import { describe, it, expect } from 'vitest';
import { multiGridPromptTemplate, MultiGridPromptConfig } from '../MultiGridPromptTemplate';
import { CameraAngle } from '../CameraAngleLibrary';

describe('MultiGridPromptTemplate', () => {
  const baseConfig: MultiGridPromptConfig = {
    frameCount: 4,
    gridDimensions: '2x2',
    subject: 'a red apple',
    selectedAngles: [
      CameraAngle.EXTREME_CLOSE_UP,
      CameraAngle.MEDIUM_SHOT,
      CameraAngle.WIDE_SHOT,
      CameraAngle.OVERHEAD_VIEW
    ],
    angleDescriptions: [
      'Extreme Close-Up: Macro detail focus, 1-2 units distance',
      'Medium Shot: Waist-up framing, 4-5 units distance',
      'Wide Shot: Full scene with context, 6-8 units distance',
      'Overhead View: Bird\'s eye perspective, 90° angle'
    ]
  };

  describe('generatePrompt', () => {
    it('should generate text prompt with camera angles', () => {
      const result = multiGridPromptTemplate.generatePrompt(baseConfig, false);
      
      expect(result.prompt).toBeTruthy();
      expect(result.prompt).toContain('a red apple');
      expect(result.prompt).toContain('2x2');
      expect(result.prompt).toContain('Extreme Close-Up');
      expect(result.prompt).toContain('Medium Shot');
      expect(result.prompt).toContain('Wide Shot');
      expect(result.prompt).toContain('Overhead View');
      expect(result.prompt).toContain('同一个');
      expect(result.prompt).toContain('不要重新创作');
    });

    it('should generate JSON structured prompt', () => {
      const result = multiGridPromptTemplate.generatePrompt(baseConfig, true);
      
      expect(result.prompt).toBeTruthy();
      expect(result.jsonStructure).toBeTruthy();
      
      const json = result.jsonStructure!;
      expect(json.total_frames).toBe(4);
      expect(json.grid_layout).toBe('2x2');
      expect(json.subject).toBe('a red apple');
      expect(json.shots).toHaveLength(4);
      expect(json.global_instructions.camera_consistency).toContain('SAME subject');
      expect(json.global_instructions.no_recreation).toBeTruthy();
    });

    it('should include camera angle information in shots', () => {
      const result = multiGridPromptTemplate.generatePrompt(baseConfig, true);
      const json = result.jsonStructure!;
      
      json.shots.forEach((shot: any, index: number) => {
        expect(shot.camera_angle).toBeTruthy();
        expect(shot.prompt_text).toContain('SAME');
        expect(shot.prompt_text).toContain('camera angle');
      });
    });
  });

  describe('validate', () => {
    it('should validate correct configuration', () => {
      const result = multiGridPromptTemplate.validate(baseConfig);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid frame count', () => {
      const config = { ...baseConfig, frameCount: 1 };
      const result = multiGridPromptTemplate.validate(config);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Frame count'))).toBe(true);
    });

    it('should reject missing grid dimensions', () => {
      const config = { ...baseConfig, gridDimensions: '' };
      const result = multiGridPromptTemplate.validate(config);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Grid dimensions'))).toBe(true);
    });

    it('should reject missing subject', () => {
      const config = { ...baseConfig, subject: '' };
      const result = multiGridPromptTemplate.validate(config);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Subject'))).toBe(true);
    });

    it('should reject missing selected angles', () => {
      const config = { ...baseConfig, selectedAngles: [] };
      const result = multiGridPromptTemplate.validate(config);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Selected angles'))).toBe(true);
    });

    it('should reject mismatched angles and descriptions', () => {
      const config = {
        ...baseConfig,
        selectedAngles: [CameraAngle.CLOSE_UP, CameraAngle.WIDE_SHOT],
        angleDescriptions: ['Close-Up: ...'] // Only 1 description for 2 angles
      };
      const result = multiGridPromptTemplate.validate(config);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('must match'))).toBe(true);
    });
  });

  describe('prompt content', () => {
    it('should emphasize same subject across frames', () => {
      const result = multiGridPromptTemplate.generatePrompt(baseConfig, false);
      expect(result.prompt).toContain('同一个');
      expect(result.prompt).toContain('不要重新创作');
      expect(result.prompt).toContain('只改变摄像机视角');
    });

    it('should include all angle descriptions', () => {
      const result = multiGridPromptTemplate.generatePrompt(baseConfig, false);
      baseConfig.angleDescriptions.forEach(desc => {
        expect(result.prompt).toContain(desc);
      });
    });

    it('should include frame numbering format', () => {
      const result = multiGridPromptTemplate.generatePrompt(baseConfig, false);
      expect(result.prompt).toContain('分镜编号和摄像机视角');
      expect(result.prompt).toContain('分镜X - 视角名称');
    });

    it('should include technical specifications', () => {
      const result = multiGridPromptTemplate.generatePrompt(baseConfig, false);
      expect(result.prompt).toContain('4K');
      expect(result.prompt).toContain('16:9');
      expect(result.prompt).toContain('电影级光影');
    });
  });

  describe('style variations', () => {
    it('should include style description when provided', () => {
      const config = { ...baseConfig, style: 'anime' };
      const result = multiGridPromptTemplate.generatePrompt(config, true);
      const json = result.jsonStructure!;
      expect(json.style).toBe('anime');
    });

    it('should use default style when not provided', () => {
      const config = { ...baseConfig, style: undefined };
      const result = multiGridPromptTemplate.generatePrompt(config, true);
      const json = result.jsonStructure!;
      expect(json.style).toBe('cinematic');
    });

    it('should handle color mode variations', () => {
      const config = { ...baseConfig, colorMode: 'blackAndWhite' };
      const result = multiGridPromptTemplate.generatePrompt(config, true);
      const json = result.jsonStructure!;
      expect(json.color_mode).toBe('blackAndWhite');
    });
  });

  describe('JSON structure', () => {
    it('should have correct JSON structure', () => {
      const result = multiGridPromptTemplate.generatePrompt(baseConfig, true);
      const json = result.jsonStructure!;
      
      expect(json.image_generation_model).toBe('auto');
      expect(json.grid_layout).toBe('2x2');
      expect(json.total_frames).toBe(4);
      expect(json.color_mode).toBe('color');
      expect(json.style).toBe('cinematic');
      expect(json.subject).toBe('a red apple');
      expect(Array.isArray(json.shots)).toBe(true);
      expect(json.global_instructions).toBeTruthy();
    });

    it('should include camera consistency instructions', () => {
      const result = multiGridPromptTemplate.generatePrompt(baseConfig, true);
      const json = result.jsonStructure!;
      
      expect(json.global_instructions.camera_consistency).toContain('SAME subject');
      expect(json.global_instructions.no_recreation).toContain('NOT recreate');
    });
  });
});
