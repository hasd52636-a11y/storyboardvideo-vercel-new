/**
 * Style Comparison Prompt Template Generator
 * Optimized for image-to-image generation with style variations
 * Generates prompts for rendering the same subject in different artistic styles
 */

export interface StyleComparisonPromptConfig {
  subject: string;
  referenceImageUrl: string;
  style: string;
  colorMode?: 'color' | 'blackAndWhite';
  aspectRatio?: string;
}

export interface StyleComparisonPromptOutput {
  prompt: string;
  jsonStructure?: Record<string, any>;
}

export class StyleComparisonPromptTemplate {
  /**
   * Generate optimized style comparison prompt
   * Supports both text and JSON formats
   */
  generatePrompt(config: StyleComparisonPromptConfig, useJsonFormat: boolean = false): StyleComparisonPromptOutput {
    if (useJsonFormat) {
      return this.generateJsonStructuredPrompt(config);
    }
    return this.generateTextPrompt(config);
  }

  /**
   * Generate text-based prompt for image-to-image
   */
  private generateTextPrompt(config: StyleComparisonPromptConfig): StyleComparisonPromptOutput {
    const { subject, referenceImageUrl, style, colorMode, aspectRatio } = config;

    // Build core role
    const coreRole = this.buildCoreRole(subject, style);

    // Build style specifications
    const styleSpec = this.buildStyleSpecification(style, colorMode);

    // Build composition rules
    const compositionRules = this.buildCompositionRules(subject);

    // Build technical requirements
    const technicalSpec = this.buildTechnicalSpecifications(colorMode, aspectRatio);

    const prompt = `
[核心角色]
${coreRole}

[参考信息]
参考图像: ${referenceImageUrl}
主体描述: ${subject}

[风格规范]
${styleSpec}

[构图与一致性]
${compositionRules}

[技术规范]
${technicalSpec}

[输出格式]
基于参考图像，生成同一主体在${style}风格下的渲染。
保持原始构图、比例和空间关系，仅改变艺术风格。
`.trim();

    return { prompt };
  }

  /**
   * Generate JSON-structured prompt
   */
  private generateJsonStructuredPrompt(config: StyleComparisonPromptConfig): StyleComparisonPromptOutput {
    const { subject, referenceImageUrl, style, colorMode, aspectRatio } = config;

    const jsonStructure = {
      generation_type: 'style_comparison_image_to_image',
      operation_type: 'style_transfer',
      reference_image: referenceImageUrl,
      subject: subject,
      target_style: style,
      color_mode: colorMode || 'color',
      aspect_ratio: aspectRatio || '16:9',
      style_description: this.getStyleDescription(style),
      global_instructions: {
        composition_preservation: 'maintain exact composition and spatial relationships from reference',
        subject_consistency: 'keep subject proportions and features identical',
        style_application: `apply ${style} artistic style consistently`,
        color_mode: colorMode === 'blackAndWhite' ? 'monochrome' : 'full color',
        no_content_change: 'do not add, remove, or modify subject elements',
        no_perspective_change: 'maintain original perspective and camera angle',
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
  private buildCoreRole(subject: string, style: string): string {
    const styleDesc = this.getStyleDescription(style);
    return `专业风格转换工具
定位：精准进行图生图风格转换
目标：将${subject}转换为${style}风格
要求：保持原始构图和主体特征，仅改变艺术表现形式`;
  }

  /**
   * Build style specification
   */
  private buildStyleSpecification(style: string, colorMode?: string): string {
    const styleDesc = this.getStyleDescription(style);
    const colorSpec = colorMode === 'blackAndWhite'
      ? '黑白/单色调'
      : '全彩/丰富色彩';

    return `[目标风格]
${styleDesc}

[色彩模式]
${colorSpec}

[风格特征]
- 艺术表现形式: ${style}
- 笔触/纹理: 符合${style}风格特征
- 色彩调性: 与${style}风格相符
- 光影处理: 按${style}风格处理`;
  }

  /**
   * Build composition rules
   */
  private buildCompositionRules(subject: string): string {
    return `[构图保持]
- 保持原始构图完全一致
- 主体位置、大小、角度不变
- 背景元素位置保持不变
- 光影方向保持一致

[主体一致性]
- ${subject}的所有特征保持不变
- 比例和比例关系完全相同
- 细节特征保持一致
- 无任何内容添加或删除

[空间关系]
- 前景、中景、背景关系不变
- 深度感保持一致
- 透视关系不变`;
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
- 质量: 高保真风格转换
- 禁止: 内容修改、透视变化、元素添加/删除、时间码、标签、UI元素
- 格式: 单张图像，与参考图同比例`;
  }

  /**
   * Get style description
   */
  private getStyleDescription(style: string): string {
    const styleMap: Record<string, string> = {
      'oil_painting': 'Oil painting style with visible brushstrokes and rich texture',
      'watercolor': 'Watercolor style with soft washes and transparent layers',
      'digital_art': 'Digital art style with clean lines and vibrant colors',
      'anime': 'Anime-style rendering with expressive features and bold outlines',
      'photorealistic': 'Photorealistic style with natural details and authentic textures',
      'cartoon': 'Cartoon style with simplified forms and bold outlines',
      'sketch': 'Sketch style with line drawings and minimal shading',
      'abstract': 'Abstract artistic style with conceptual interpretation',
      'impressionist': 'Impressionist style with loose brushwork and light emphasis',
      'surrealism': 'Surrealism style with dreamlike and fantastical elements',
      'cyberpunk': 'Cyberpunk style with neon colors and futuristic elements',
      'steampunk': 'Steampunk style with industrial and Victorian elements',
      'minimalist': 'Minimalist style with essential elements and clean composition',
      'noir': 'Film noir style with high contrast and dramatic lighting',
      'renaissance': 'Renaissance style with classical composition and techniques',
      'baroque': 'Baroque style with dramatic lighting and ornate details',
      'art_deco': 'Art Deco style with geometric patterns and luxurious elements',
      'pop_art': 'Pop art style with bold colors and graphic elements',
      'graffiti': 'Graffiti style with street art aesthetic and vibrant colors'
    };

    return styleMap[style] || styleMap['digital_art'];
  }

  /**
   * Validate configuration
   */
  validate(config: StyleComparisonPromptConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.subject || config.subject.trim().length === 0) {
      errors.push('Subject description is required');
    }

    if (!config.referenceImageUrl || config.referenceImageUrl.trim().length === 0) {
      errors.push('Reference image URL is required');
    }

    if (!config.style || config.style.trim().length === 0) {
      errors.push('Style is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export const styleComparisonPromptTemplate = new StyleComparisonPromptTemplate();
