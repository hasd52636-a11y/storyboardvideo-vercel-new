// zhipuModels.ts - 智谱模型配置和管理

export interface ZhipuModelConfig {
  id: string;
  name: string;
  nameZh: string;
  category: 'text' | 'vision' | 'video' | 'image' | 'thinking';
  tier: 'free' | 'standard' | 'premium';
  description: string;
  descriptionZh: string;
  maxTokens: number;
  costLevel: 'low' | 'medium' | 'high';
}

// 普惠模型系列（推荐，费用便宜）
export const ZHIPU_FREE_MODELS: Record<string, ZhipuModelConfig> = {
  'glm-4-flash': {
    id: 'glm-4-flash',
    name: 'GLM-4-Flash',
    nameZh: 'GLM-4-Flash (文本生成)',
    category: 'text',
    tier: 'free',
    description: 'Fast text generation, cost-effective',
    descriptionZh: '快速文本生成，成本低廉',
    maxTokens: 128000,
    costLevel: 'low'
  },
  'glm-4.5-flash': {
    id: 'glm-4.5-flash',
    name: 'GLM-4.5-Flash',
    nameZh: 'GLM-4.5-Flash (深度思考)',
    category: 'thinking',
    tier: 'free',
    description: 'Deep thinking with reasoning, cost-effective',
    descriptionZh: '深度思考推理，成本低廉',
    maxTokens: 128000,
    costLevel: 'low'
  },
  'glm-4v-flash': {
    id: 'glm-4v-flash',
    name: 'GLM-4V-Flash',
    nameZh: 'GLM-4V-Flash (视觉理解)',
    category: 'vision',
    tier: 'free',
    description: 'Vision understanding, cost-effective',
    descriptionZh: '视觉理解，成本低廉',
    maxTokens: 128000,
    costLevel: 'low'
  },
  'cogvideox-flash': {
    id: 'cogvideox-flash',
    name: 'CogVideoX-Flash',
    nameZh: 'CogVideoX-Flash (视频生成)',
    category: 'video',
    tier: 'free',
    description: 'Fast video generation, cost-effective',
    descriptionZh: '快速视频生成，成本低廉',
    maxTokens: 0,
    costLevel: 'low'
  },
  'cogview-3-flash': {
    id: 'cogview-3-flash',
    name: 'CogView-3-Flash',
    nameZh: 'CogView-3-Flash (图像生成)',
    category: 'image',
    tier: 'free',
    description: 'Fast image generation, cost-effective',
    descriptionZh: '快速图像生成，成本低廉',
    maxTokens: 0,
    costLevel: 'low'
  }
};

// 高端模型系列（高质量）
export const ZHIPU_PREMIUM_MODELS: Record<string, ZhipuModelConfig> = {
  'glm-4.6v': {
    id: 'glm-4.6v',
    name: 'GLM-4.6V',
    nameZh: 'GLM-4.6V (高端视觉)',
    category: 'vision',
    tier: 'premium',
    description: 'Premium vision understanding',
    descriptionZh: '高端视觉理解',
    maxTokens: 32768,
    costLevel: 'high'
  },
  'cogvideox-3': {
    id: 'cogvideox-3',
    name: 'CogVideoX-3',
    nameZh: 'CogVideoX-3 (高端视频)',
    category: 'video',
    tier: 'premium',
    description: 'Premium video generation',
    descriptionZh: '高端视频生成',
    maxTokens: 0,
    costLevel: 'high'
  },
  'cogview-3': {
    id: 'cogview-3',
    name: 'CogView-3',
    nameZh: 'CogView-3 (高端图像)',
    category: 'image',
    tier: 'premium',
    description: 'Premium image generation',
    descriptionZh: '高端图像生成',
    maxTokens: 0,
    costLevel: 'high'
  }
};

// 所有模型
export const ALL_ZHIPU_MODELS = {
  ...ZHIPU_FREE_MODELS,
  ...ZHIPU_PREMIUM_MODELS
};

// 按类别获取模型
export const getModelsByCategory = (category: string): ZhipuModelConfig[] => {
  return Object.values(ALL_ZHIPU_MODELS).filter(m => m.category === category);
};

// 获取默认模型配置
export const getDefaultZhipuModels = () => ({
  text: 'glm-4-flash',           // 文本生成
  thinking: 'glm-4.5-flash',     // 深度思考
  vision: 'glm-4v-flash',        // 视觉理解
  video: 'cogvideox-flash',      // 视频生成
  image: 'cogview-3-flash'       // 图像生成
});

// 模型分组（用于 UI 显示）
export const ZHIPU_MODEL_GROUPS = [
  {
    label: '普惠模型系列 (推荐)',
    labelZh: '普惠模型系列 (推荐)',
    description: 'Cost-effective models for most use cases',
    descriptionZh: '成本低廉，适合大多数场景',
    models: Object.values(ZHIPU_FREE_MODELS)
  },
  {
    label: 'Premium Models',
    labelZh: '高端模型系列',
    description: 'Premium models for high-quality output',
    descriptionZh: '高质量输出，适合专业应用',
    models: Object.values(ZHIPU_PREMIUM_MODELS)
  }
];

// 获取模型的显示名称
export const getModelDisplayName = (modelId: string, lang: 'zh' | 'en' = 'zh'): string => {
  const model = ALL_ZHIPU_MODELS[modelId];
  if (!model) return modelId;
  return lang === 'zh' ? model.nameZh : model.name;
};

// 获取模型的描述
export const getModelDescription = (modelId: string, lang: 'zh' | 'en' = 'zh'): string => {
  const model = ALL_ZHIPU_MODELS[modelId];
  if (!model) return '';
  return lang === 'zh' ? model.descriptionZh : model.description;
};

// 验证模型是否有效
export const isValidZhipuModel = (modelId: string): boolean => {
  return modelId in ALL_ZHIPU_MODELS;
};

// 获取模型的成本等级
export const getModelCostLevel = (modelId: string): 'low' | 'medium' | 'high' => {
  const model = ALL_ZHIPU_MODELS[modelId];
  return model?.costLevel || 'medium';
};

// 获取模型的等级
export const getModelTier = (modelId: string): 'free' | 'standard' | 'premium' => {
  const model = ALL_ZHIPU_MODELS[modelId];
  return model?.tier || 'standard';
};
