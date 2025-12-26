/**
 * Multi-Grid Prompt Template Generator
 * Generates prompts for multi-perspective view generation with camera angles
 * Precision-focused with structured JSON output support
 */

import { CameraAngle } from './CameraAngleLibrary';

export interface MultiGridPromptConfig {
  frameCount: number;
  gridDimensions: string;
  subject: string;
  selectedAngles: CameraAngle[];
  angleDescriptions: string[];
  referenceImageUrl?: string;
  style?: string;
  colorMode?: 'color' | 'blackAndWhite';
  aspectRatio?: string;
  customWatermark?: {
    text: string;
    position: 'top_left' | 'top_center' | 'top_right' | 'bottom_left' | 'bottom_center' | 'bottom_right';
    size: 'extremely_small' | 'small' | 'medium' | 'large' | 'extremely_large';
  };
}

export interface MultiGridPromptOutput {
  prompt: string;
  jsonStructure?: Record<string, any>;
}

export class MultiGridPromptTemplate {
  /**
   * Generate optimized multi-grid prompt with camera angles
   * Supports both simple text prompt and structured JSON format
   */
  generatePrompt(config: MultiGridPromptConfig, useJsonFormat: boolean = false): MultiGridPromptOutput {
    if (useJsonFormat) {
      return this.generateJsonStructuredPrompt(config);
    }
    return this.generateTextPrompt(config);
  }

  /**
   * Generate text-based prompt (for direct API calls)
   */
  private generateTextPrompt(config: MultiGridPromptConfig): MultiGridPromptOutput {
    const { frameCount, gridDimensions, subject, selectedAngles, angleDescriptions, style, colorMode, aspectRatio, referenceImageUrl } = config;

    // Build core role and positioning
    const coreRole = this.buildCoreRole(subject, style);

    // Build frame specifications with camera angles
    const frameSpec = this.buildFrameSpecification(frameCount, gridDimensions, angleDescriptions);

    // Build composition instructions
    const compositionRules = this.buildCompositionRules(subject);

    // Build technical requirements
    const technicalSpec = this.buildTechnicalSpecifications(colorMode, aspectRatio);

    const prompt = `
[核心角色]
${coreRole}

[参考信息]
${referenceImageUrl ? `参考图像: ${referenceImageUrl}` : '无参考图像'}
主体描述: ${subject}

[分镜规范]
${frameSpec}

[摄像机视角]
${angleDescriptions.join('\n')}

[构图与连贯性]
${compositionRules}

[技术规范]
${technicalSpec}

[输出格式]
生成单张图像，包含${frameCount}个独立分镜，排列为${gridDimensions}网格布局。
每个分镜必须：
- 在左上角清晰标注分镜编号和摄像机视角（格式：分镜X - 视角名称）
- 完全独立成帧
- 与其他分镜保持视觉连贯性
- 遵循摄像机视角顺序

[重要提示]
所有分镜显示的是同一个${subject}，从不同摄像机角度和距离拍摄。
不要重新创作或改变主体。只改变摄像机视角。
`.trim();

    return { prompt };
  }

  /**
   * Generate JSON-structured prompt (for advanced API integration)
   */
  private generateJsonStructuredPrompt(config: MultiGridPromptConfig): MultiGridPromptOutput {
    const { frameCount, gridDimensions, subject, selectedAngles, angleDescriptions, style, colorMode, aspectRatio, customWatermark, referenceImageUrl } = config;

    const shots = this.generateFramePrompts(frameCount, subject, selectedAngles, angleDescriptions, style, colorMode);

    const jsonStructure = {
      image_generation_model: 'auto',
      grid_layout: gridDimensions,
      grid_aspect_ratio: aspectRatio || '16:9',
      total_frames: frameCount,
      color_mode: colorMode || 'color',
      style: style || 'cinematic',
      subject: subject,
      reference_image: referenceImageUrl || null,
      global_watermark: customWatermark ? {
        text: customWatermark.text,
        position: customWatermark.position,
        size: customWatermark.size
      } : null,
      shots: shots,
      global_instructions: {
        frame_numbering: 'top-left corner, format: 分镜X - 视角名称',
        frame_independence: 'each frame is a complete, independent shot',
        visual_continuity: 'maintain consistent style, subject, and visual language across all frames',
        camera_consistency: 'all frames show the SAME subject from different camera angles',
        no_recreation: 'do NOT recreate or change the subject, only vary camera perspective',
        no_timecode: true,
        no_subtitles: true,
        no_ui_elements: true,
        composition_variety: 'use different camera angles and distances within each frame',
        environmental_consistency: 'maintain coherent setting and lighting throughout'
      }
    };

    const prompt = JSON.stringify(jsonStructure);
    return { prompt, jsonStructure };
  }

  /**
   * Generate individual frame prompts for JSON structure
   */
  private generateFramePrompts(
    frameCount: number,
    subject: string,
    selectedAngles: CameraAngle[],
    angleDescriptions: string[],
    style?: string,
    colorMode?: string
  ): Array<{
    shot_number: string;
    camera_angle: string;
    prompt_text: string;
  }> {
    const frames = [];
    const styleDesc = this.getStyleDescription(style);
    const colorDesc = colorMode === 'blackAndWhite' ? 'black and white' : 'vibrant color';

    for (let i = 0; i < frameCount; i++) {
      const angleDesc = angleDescriptions[i];
      const angleName = angleDesc.split(':')[0]; // Extract angle name
      
      // Generate detailed prompt (≥50 words as per professional standard)
      const prompt = `Frame ${i + 1} of ${frameCount}: ${subject} from ${angleName} perspective. ${angleDesc}. ${styleDesc}. ${colorDesc} palette. Cinematic lighting with professional depth of field. Frame ${i + 1} - ${angleName} in the top-left corner, no timecode, no subtitles. IMPORTANT: This is the SAME ${subject} from a different camera angle, not a recreation.`;
      
      frames.push({
        shot_number: `分镜${i + 1}`,
        camera_angle: angleName,
        prompt_text: prompt
      });
    }

    return frames;
  }

  /**
   * Build core role description
   */
  private buildCoreRole(subject: string, style?: string): string {
    const styleDesc = this.getStyleDescription(style);
    return `专业视频分镜视觉转化工具
定位：精准生成标准化多宫格分镜示意图
目标：生成${subject}的${style || '专业'}风格多宫格分镜（多摄像机视角）
输出：结构化提示词，可直接用于文生图模型调用`;
  }

  /**
   * Build frame specification with camera angles
   */
  private buildFrameSpecification(frameCount: number, gridDimensions: string, angleDescriptions: string[]): string {
    return `- 网格布局: ${gridDimensions}（共${frameCount}个分镜）
- 分镜编号: 1-${frameCount}，连续无遗漏
- 分镜独立性: 每个分镜必须是完整的独立镜头
- 分镜对齐: 所有分镜大小和比例一致
- 分镜间距: 清晰的分隔线便于区分
- 编号位置: 左上角清晰标注，格式：分镜X - 视角名称
- 摄像机视角: 每个分镜使用不同的摄像机视角
- 场景一致性: 所有分镜显示同一场景/物体，只改变摄像机角度`;
  }

  /**
   * Build composition and continuity rules
   */
  private buildCompositionRules(subject: string): string {
    return `[主体一致性]
- ${subject}在所有分镜中保持可识别性
- 角色/物体特征在各分镜中保持一致
- 不要重新创作或改变主体

[视觉连贯性]
- 相邻分镜之间保持平滑的视觉过渡
- 光影和材质风格统一
- 环境设置保持一致

[摄像机视角多样性]
- 使用不同的摄像机距离（特写、中景、全景）
- 变化摄像机角度（俯视、仰视、侧面等）
- 展示同一主体的不同视角

[场景一致性]
- 所有分镜显示同一场景/物体
- 背景、光照、时间保持一致
- 只改变摄像机位置和角度`;
  }

  /**
   * Build precise technical specifications
   */
  private buildTechnicalSpecifications(colorMode?: string, aspectRatio?: string): string {
    const colorSpec = colorMode === 'blackAndWhite'
      ? 'Monochrome with high contrast'
      : 'Full color with balanced saturation';

    return `- 分辨率: 4K或更高
- 色彩: ${colorSpec}
- 背景: 与场景相符，保持环境一致性
- 光照: 专业电影级光影，深度感强
- 画幅: ${aspectRatio || '16:9'}
- 禁止: 时间码、字幕、UI元素、分屏、边框
- 格式: 单张图像，${aspectRatio || '16:9'}比例`;
  }

  /**
   * Get style description for frame
   */
  private getStyleDescription(style?: string): string {
    const descriptions: Record<string, string> = {
      'cinematic': 'Professional cinematic composition with dramatic lighting',
      'realistic': 'Photorealistic with natural details',
      'illustration': 'Digital illustration style',
      'anime': 'Anime-style rendering',
      'comic': 'Comic book aesthetic',
      'minimalist': 'Minimalist design',
      'abstract': 'Abstract artistic style',
      'stylized': 'Stylized artistic interpretation'
    };
    return descriptions[style || 'cinematic'] || descriptions['cinematic'];
  }

  /**
   * Validate configuration
   */
  validate(config: MultiGridPromptConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.frameCount || config.frameCount < 2 || config.frameCount > 12) {
      errors.push('Frame count must be between 2 and 12');
    }

    if (!config.gridDimensions || config.gridDimensions.trim().length === 0) {
      errors.push('Grid dimensions are required');
    }

    if (!config.subject || config.subject.trim().length === 0) {
      errors.push('Subject description is required');
    }

    if (!config.selectedAngles || config.selectedAngles.length === 0) {
      errors.push('Selected angles are required');
    }

    if (!config.angleDescriptions || config.angleDescriptions.length === 0) {
      errors.push('Angle descriptions are required');
    }

    if (config.selectedAngles && config.angleDescriptions && 
        config.selectedAngles.length !== config.angleDescriptions.length) {
      errors.push('Number of selected angles must match number of angle descriptions');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export const multiGridPromptTemplate = new MultiGridPromptTemplate();
