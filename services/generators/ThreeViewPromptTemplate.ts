/**
 * Three-View Prompt Template Generator
 * Optimized for generating orthographic reference sheets (front, side, back views)
 * Precision-focused with structured JSON output support
 */

export interface ThreeViewPromptConfig {
  subject: string;
  style?: string;
  colorMode?: 'color' | 'blackAndWhite';
  aspectRatio?: string;
  detailLevel?: 'basic' | 'detailed' | 'ultra-detailed';
  referenceImageUrl?: string;
}

export interface ThreeViewPromptOutput {
  prompt: string;
  viewsDescription: string;
  jsonStructure?: Record<string, any>;
}

export class ThreeViewPromptTemplate {
  /**
   * Generate optimized three-view prompt with precision control
   */
  generatePrompt(config: ThreeViewPromptConfig, useJsonFormat: boolean = false): ThreeViewPromptOutput {
    if (useJsonFormat) {
      return this.generateJsonStructuredPrompt(config);
    }
    return this.generateTextPrompt(config);
  }

  /**
   * Generate text-based prompt (for direct API calls)
   */
  private generateTextPrompt(config: ThreeViewPromptConfig): ThreeViewPromptOutput {
    const { subject, style, colorMode, detailLevel, referenceImageUrl } = config;

    // Build core role and positioning
    const coreRole = this.buildCoreRole(subject, style);

    // Build view specifications with precise instructions
    const viewsSpec = this.buildPreciseViewsSpecification();

    // Build technical requirements
    const technicalSpec = this.buildPreciseTechnicalSpecifications(colorMode, detailLevel);

    // Build composition and alignment rules
    const compositionRules = this.buildCompositionRules();

    const prompt = `
[核心角色]
${coreRole}

[参考信息]
${referenceImageUrl ? `参考图像: ${referenceImageUrl}` : '无参考图像'}
主体描述: ${subject}

[视图规范]
${viewsSpec}

[构图与对齐]
${compositionRules}

[技术规范]
${technicalSpec}

[输出格式]
生成单张图像，包含3个正交投影视图，水平排列：
- 左侧：正视图
- 中间：侧视图
- 右侧：背视图

每个视图必须完全对齐，高度相同，比例一致。
`.trim();

    return {
      prompt,
      viewsDescription: 'Front, Side, and Back orthographic views'
    };
  }

  /**
   * Generate JSON-structured prompt (for advanced API integration)
   */
  private generateJsonStructuredPrompt(config: ThreeViewPromptConfig): ThreeViewPromptOutput {
    const { subject, style, colorMode, detailLevel, referenceImageUrl } = config;

    const views = this.generateViewPrompts(subject, style, colorMode, detailLevel);

    const jsonStructure = {
      generation_type: 'three_view_orthographic',
      total_views: 3,
      view_layout: 'horizontal',
      views: views,
      reference_image: referenceImageUrl || null,
      subject: subject,
      style: style || 'realistic',
      color_mode: colorMode || 'color',
      detail_level: detailLevel || 'detailed',
      global_instructions: {
        projection_type: 'orthographic',
        alignment: 'perfectly aligned at same height and scale',
        background: 'plain white, no shadows or gradients',
        lighting: 'neutral, even illumination from front',
        consistency: 'identical proportions and scale across all views',
        no_perspective_distortion: true,
        no_timecode: true,
        no_labels: true,
        no_ui_elements: true
      }
    };

    const prompt = JSON.stringify(jsonStructure);
    return {
      prompt,
      viewsDescription: 'Front, Side, and Back orthographic views',
      jsonStructure
    };
  }

  /**
   * Generate individual view prompts
   */
  private generateViewPrompts(subject: string, style?: string, colorMode?: string, detailLevel?: string): Array<{
    view_number: number;
    view_name: string;
    prompt: string;
  }> {
    const styleDesc = this.getStyleDescription(style);
    const detailDesc = this.getDetailDescription(detailLevel);
    const colorDesc = colorMode === 'blackAndWhite' ? 'black and white' : 'full color';

    const views = [
      {
        view_number: 1,
        view_name: 'Front View',
        prompt: `Front orthographic view of ${subject}. Direct frontal perspective showing primary features, proportions, and facial/front details. ${styleDesc}. ${detailDesc}. ${colorDesc} palette. Neutral lighting. No perspective distortion.`
      },
      {
        view_number: 2,
        view_name: 'Side View',
        prompt: `Side orthographic view (profile) of ${subject}. Direct side perspective from right showing depth, silhouette, and profile details. ${styleDesc}. ${detailDesc}. ${colorDesc} palette. Neutral lighting. No perspective distortion.`
      },
      {
        view_number: 3,
        view_name: 'Back View',
        prompt: `Back orthographic view of ${subject}. Direct rear perspective showing back details, consistency with front view, and rear features. ${styleDesc}. ${detailDesc}. ${colorDesc} palette. Neutral lighting. No perspective distortion.`
      }
    ];

    return views;
  }

  /**
   * Build core role description
   */
  private buildCoreRole(subject: string, style?: string): string {
    const styleDesc = this.getStyleDescription(style);
    return `专业三视图参考表生成工具
定位：精准生成正交投影参考表，用于角色/物体设计参考
目标：生成${subject}的标准化三视图（正视图、侧视图、背视图）
风格：${styleDesc}`;
  }

  /**
   * Build precise views specification
   */
  private buildPreciseViewsSpecification(): string {
    return `1. 正视图 (Front View)
   - 直接正面视角，显示主要特征和比例
   - 清晰展示面部/前方细节
   - 完整显示身体/物体宽度和高度

2. 侧视图 (Side View / Profile)
   - 直接侧面视角（从右侧看）
   - 显示深度和轮廓
   - 清晰展示侧面细节和厚度

3. 背视图 (Back View)
   - 直接背面视角
   - 显示背部细节
   - 确保与正视图的一致性`;
  }

  /**
   * Build composition and alignment rules
   */
  private buildCompositionRules(): string {
    return `[对齐规则]
- 三个视图必须完全对齐，顶部和底部在同一水平线上
- 所有视图使用相同的比例和高度
- 视图之间保持一致的间距

[一致性规则]
- 相同的特征在所有视图中的位置必须对应
- 比例在所有视图中保持一致
- 光影和材质风格统一

[投影规则]
- 使用正交投影（无透视变形）
- 不允许任何透视扭曲
- 保持完美的几何对齐`;
  }

  /**
   * Build precise technical specifications
   */
  private buildPreciseTechnicalSpecifications(colorMode?: string, detailLevel?: string): string {
    const resolution = detailLevel === 'ultra-detailed' ? '8K resolution' : '4K resolution';
    const textureDetail = detailLevel === 'ultra-detailed' 
      ? 'High fidelity textures with micro-details and surface imperfections'
      : detailLevel === 'detailed'
      ? 'Clear textures and material definition with visible details'
      : 'Clean, simplified textures with basic material definition';
    const colorSpec = colorMode === 'blackAndWhite'
      ? 'Monochrome with high contrast'
      : 'Full color with balanced saturation';

    return `- 分辨率: ${resolution}
- 纹理: ${textureDetail}
- 背景: 纯白色，无阴影或渐变
- 光照: 中性均匀照明，从正面照亮
- 色彩: ${colorSpec}
- 一致性: 所有视图中的角色/物体完全一致
- 禁止: 时间码、标签、UI元素、阴影、背景变化
- 格式: 单张图像，三个视图水平排列`;
  }

  /**
   * Get style description
   */
  private getStyleDescription(style?: string): string {
    const styleMap: Record<string, string> = {
      'realistic': 'Photorealistic with natural details and textures',
      'illustration': 'High-quality digital illustration style',
      'anime': 'Anime-style character design',
      'comic': 'Comic book aesthetic',
      'minimalist': 'Minimalist design with essential elements',
      'technical': 'Technical/industrial design style',
      'stylized': 'Stylized artistic interpretation',
      '3d-model': '3D model render style'
    };

    return styleMap[style || 'realistic'] || styleMap['realistic'];
  }

  /**
   * Get detail level description
   */
  private getDetailDescription(detailLevel?: string): string {
    const detailMap: Record<string, string> = {
      'basic': 'Basic forms and proportions, simplified details',
      'detailed': 'Moderate detail with clear features and textures',
      'ultra-detailed': 'Extreme detail with all micro-features and textures'
    };

    return detailMap[detailLevel || 'detailed'] || detailMap['detailed'];
  }

  /**
   * Validate configuration
   */
  validate(config: ThreeViewPromptConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.subject || config.subject.trim().length === 0) {
      errors.push('Subject description is required');
    }

    if (config.subject && config.subject.length > 500) {
      errors.push('Subject description is too long (max 500 characters)');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export const threeViewPromptTemplate = new ThreeViewPromptTemplate();
