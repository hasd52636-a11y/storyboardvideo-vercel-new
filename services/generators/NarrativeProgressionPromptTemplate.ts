/**
 * Narrative Progression Prompt Template Generator
 * Optimized for image-to-image generation with narrative progression
 * Generates prompts for sequential frames showing story progression
 */

export interface NarrativeProgressionPromptConfig {
  subject: string;
  referenceImageUrl: string;
  frameCount: number;
  currentFrameIndex: number;
  colorMode?: 'color' | 'blackAndWhite';
  aspectRatio?: string;
  narrativeContext?: string;
}

export interface NarrativeProgressionPromptOutput {
  prompt: string;
  jsonStructure?: Record<string, any>;
}

export class NarrativeProgressionPromptTemplate {
  /**
   * Generate optimized narrative progression prompt
   * Supports both text and JSON formats
   */
  generatePrompt(config: NarrativeProgressionPromptConfig, useJsonFormat: boolean = false): NarrativeProgressionPromptOutput {
    if (useJsonFormat) {
      return this.generateJsonStructuredPrompt(config);
    }
    return this.generateTextPrompt(config);
  }

  /**
   * Generate text-based prompt for image-to-image
   */
  private generateTextPrompt(config: NarrativeProgressionPromptConfig): NarrativeProgressionPromptOutput {
    const { subject, referenceImageUrl, frameCount, currentFrameIndex, colorMode, aspectRatio, narrativeContext } = config;

    // Build core role
    const coreRole = this.buildCoreRole(subject, frameCount);

    // Build frame specifications
    const frameSpec = this.buildFrameSpecification(currentFrameIndex, frameCount, narrativeContext);

    // Build progression rules
    const progressionRules = this.buildProgressionRules(subject, currentFrameIndex, frameCount);

    // Build technical requirements
    const technicalSpec = this.buildTechnicalSpecifications(colorMode, aspectRatio);

    const prompt = `
[核心角色]
${coreRole}

[参考信息]
参考图像: ${referenceImageUrl}
主体描述: ${subject}
${narrativeContext ? `叙事背景: ${narrativeContext}` : ''}

[分镜规范]
${frameSpec}

[叙事进展规则]
${progressionRules}

[技术规范]
${technicalSpec}

[输出格式]
基于参考图像，生成第${currentFrameIndex}/${frameCount}帧的叙事进展。
保持主体一致性，展示清晰的故事进展。
`.trim();

    return { prompt };
  }

  /**
   * Generate JSON-structured prompt
   */
  private generateJsonStructuredPrompt(config: NarrativeProgressionPromptConfig): NarrativeProgressionPromptOutput {
    const { subject, referenceImageUrl, frameCount, currentFrameIndex, colorMode, aspectRatio, narrativeContext } = config;

    const progressionPercentage = (currentFrameIndex / frameCount) * 100;
    const framePosition = this.getFramePosition(currentFrameIndex, frameCount);

    const jsonStructure = {
      generation_type: 'narrative_progression_image_to_image',
      operation_type: 'frame_progression',
      reference_image: referenceImageUrl,
      subject: subject,
      frame_number: currentFrameIndex,
      total_frames: frameCount,
      progression_percentage: progressionPercentage,
      frame_position: framePosition,
      narrative_context: narrativeContext || null,
      color_mode: colorMode || 'color',
      aspect_ratio: aspectRatio || '16:9',
      global_instructions: {
        subject_consistency: 'maintain subject identity and core features across all frames',
        visual_continuity: 'ensure smooth visual transitions between frames',
        progression_clarity: 'show clear narrative progression and story advancement',
        composition_evolution: 'evolve composition naturally while maintaining spatial relationships',
        lighting_consistency: 'maintain consistent lighting direction and quality',
        no_abrupt_changes: 'avoid sudden or jarring visual changes',
        no_content_loss: 'preserve all important elements from reference',
        no_timecode: true,
        no_labels: true,
        no_ui_elements: true
      }
    };

    const prompt = JSON.stringify(jsonStructure);
    return { prompt, jsonStructure };
  }

  /**
   * Build core role description
   */
  private buildCoreRole(subject: string, frameCount: number): string {
    return `专业叙事进展工具
定位：精准生成连贯的叙事进展序列
目标：生成${subject}的${frameCount}帧叙事进展
要求：保持主体一致性，展示清晰的故事发展`;
  }

  /**
   * Build frame specification
   */
  private buildFrameSpecification(currentFrameIndex: number, frameCount: number, narrativeContext?: string): string {
    const progressionPercentage = Math.round((currentFrameIndex / frameCount) * 100);
    const framePosition = this.getFramePosition(currentFrameIndex, frameCount);

    return `[当前分镜]
- 分镜编号: 第${currentFrameIndex}/${frameCount}帧
- 进展阶段: ${framePosition}
- 进展百分比: ${progressionPercentage}%
- 时间流逝: 约${currentFrameIndex * 5}秒

[分镜要求]
- 清晰展示故事进展
- 与前一帧保持视觉连贯性
- 向后续帧自然过渡
- 推进叙事逻辑${narrativeContext ? `\n- 叙事背景: ${narrativeContext}` : ''}`;
  }

  /**
   * Build progression rules
   */
  private buildProgressionRules(subject: string, currentFrameIndex: number, frameCount: number): string {
    const isEarlyFrame = currentFrameIndex <= frameCount / 3;
    const isMiddleFrame = currentFrameIndex > frameCount / 3 && currentFrameIndex <= (2 * frameCount) / 3;
    const isLateFrame = currentFrameIndex > (2 * frameCount) / 3;

    let stageDescription = '';
    if (isEarlyFrame) {
      stageDescription = `[早期阶段] 建立场景和主体状态，为故事奠定基础`;
    } else if (isMiddleFrame) {
      stageDescription = `[中期阶段] 推进故事发展，展示主体的变化或行动`;
    } else {
      stageDescription = `[后期阶段] 接近故事高潮或结论，展示最终状态`;
    }

    return `[主体一致性]
- ${subject}的核心特征保持不变
- 比例和比例关系保持一致
- 识别特征清晰可见

[视觉连贯性]
- 与参考图像保持视觉连贯
- 光影方向保持一致
- 色彩调性保持统一
- 背景元素逐步演变

[叙事进展]
${stageDescription}
- 展示${subject}的状态变化或行动进展
- 推进故事向前发展
- 为下一帧做自然过渡

[动作与变化]
- 展示适当的动作或变化
- 变化幅度与进展阶段相符
- 保持故事逻辑连贯`;
  }

  /**
   * Build technical specifications
   */
  private buildTechnicalSpecifications(colorMode?: string, aspectRatio?: string): string {
    const colorSpec = colorMode === 'blackAndWhite'
      ? 'Monochrome with high contrast'
      : 'Full color with balanced saturation';

    return `- 分辨率: 保持原始分辨率或更高
- 色彩: ${colorSpec}
- 画幅: ${aspectRatio || '16:9'}
- 质量: 高保真叙事进展
- 连贯性: 与参考图像和前一帧保持连贯
- 禁止: 主体特征改变、突兀变化、内容丢失、时间码、标签、UI元素
- 格式: 单张图像，与参考图同比例`;
  }

  /**
   * Get frame position description
   */
  private getFramePosition(frameNumber: number, totalFrames: number): string {
    const percentage = (frameNumber / totalFrames) * 100;

    if (percentage <= 20) {
      return '开场/建立';
    } else if (percentage <= 40) {
      return '上升/发展';
    } else if (percentage <= 60) {
      return '中点/转折';
    } else if (percentage <= 80) {
      return '高潮/冲突';
    } else {
      return '结局/收尾';
    }
  }

  /**
   * Validate configuration
   */
  validate(config: NarrativeProgressionPromptConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.subject || config.subject.trim().length === 0) {
      errors.push('Subject description is required');
    }

    if (!config.referenceImageUrl || config.referenceImageUrl.trim().length === 0) {
      errors.push('Reference image URL is required');
    }

    if (!Number.isInteger(config.frameCount) || config.frameCount < 2 || config.frameCount > 12) {
      errors.push('Frame count must be an integer between 2 and 12');
    }

    if (!Number.isInteger(config.currentFrameIndex) || config.currentFrameIndex < 1 || config.currentFrameIndex > config.frameCount) {
      errors.push(`Current frame index must be between 1 and ${config.frameCount}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export const narrativeProgressionPromptTemplate = new NarrativeProgressionPromptTemplate();
