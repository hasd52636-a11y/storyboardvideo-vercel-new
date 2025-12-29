
export enum FilterMode {
  NORMAL = 'normal',
  BLACK_WHITE = 'grayscale',
  LINE_ART = 'lineart'
}

export enum ToolType {
  SELECT = 'select',
  HAND = 'hand',
  BRUSH = 'brush',
  TEXT = 'text'
}

export type ModelProvider = 'gemini' | 'openai' | 'zhipu' | 'qianwen' | 'deepseek' | 'custom' | 'banana' | 'veo';

export interface ProviderConfig {
  provider: ModelProvider;
  apiKey: string;
  baseUrl: string;
  llmModel: string;
  imageModel: string;
}

export interface StoryboardSymbol {
  id: string;
  type: string;
  name: string;
  label: string;
  x: number;
  y: number;
  rotation: number;
}

export interface StoryboardItem {
  id: string;
  imageUrl: string;
  prompt: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMain: boolean;
  filter: FilterMode;
  order: number;
  symbols: StoryboardSymbol[];
  scale?: number;
  colorMode?: 'color' | 'blackAndWhite';
  aspectRatio?: string;
  isLoading?: boolean;
}

// 工具函数：将比例字符串转换为数字
export const parseAspectRatio = (ratio: string): number => {
  try {
    const [w, h] = ratio.split(':').map(Number);
    if (!w || !h || isNaN(w) || isNaN(h)) {
      console.warn(`Invalid aspect ratio: ${ratio}, using default 16:9`);
      return 16 / 9;
    }
    return w / h;
  } catch (e) {
    console.warn(`Error parsing aspect ratio: ${ratio}, using default 16:9`);
    return 16 / 9;
  }
};

// 工具函数：根据宽度和比例计算高度
export const calculateHeight = (width: number, aspectRatio: string): number => {
  const ratio = parseAspectRatio(aspectRatio);
  return width / ratio;
};

export interface ScriptScene {
  index: number;
  description: string;
  visualPrompt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  images?: string[]; // base64 or URLs
}

export interface ImageAttachmentState {
  file: File | null;
  preview: string; // base64 or URL
  dimensions: { width: number; height: number } | null;
  fileSize: number; // in bytes
  isLoading: boolean;
  error: string | null;
}

export interface ImageMetadata {
  width: number;
  height: number;
  size: number; // bytes
  format: string; // 'jpeg', 'png', 'webp', 'gif'
  uploadedAt?: Date;
}

export type Language = 'zh' | 'en';
export type Theme = 'dark' | 'light';

export type ExportLayout = '2x2' | '2x3' | '3x3' | '4x3' | 'main-2x2' | 'main-2x3' | 'main-3x3' | 'main-4x3';

export type AspectRatio = '16:9' | '4:3' | '9:16' | '1:1' | '21:9' | '4:5' | '3:2';

export interface StyleOption {
  id: string;
  name: string;
  nameZh?: string;
  color: string;
  description: string;
  descriptionZh?: string;
}

export interface VideoItem {
  id: string;
  taskId: string;
  prompt: string;
  status: 'loading' | 'completed' | 'failed';
  progress: number;
  videoUrl?: string;
  error?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  createdAt: number;
}

// Video Service Types
export interface VideoServiceConfig {
  baseUrl: string;
  apiKey: string;
}

export type VideoAPIProvider = 'openai' | 'dyu' | 'shenma';

export interface VideoServiceConfigWithProvider extends VideoServiceConfig {
  provider?: VideoAPIProvider;
}

export interface VideoStatus {
  task_id: string;
  status: 'NOT_START' | 'SUBMITTED' | 'QUEUED' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILURE';
  progress: string;
  created_at?: number;
  submit_time?: number;
  start_time?: number;
  finish_time?: number;
  model?: string;
  duration?: number;
  size?: string;
  video_url?: string;
  fail_reason?: string;
  error?: {
    code: string;
    message: string;
  };
  // Sora2 特定字段
  object?: string;
  created?: number;
  choices?: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
}

export interface CreateVideoOptions {
  model: 'sora-2' | 'sora-2-pro' | 'sora_video2' | 'sora_video2-portrait' | 'sora_video2-landscape' | 'sora_video2-portrait-hd' | 'sora_video2-portrait-15s' | 'sora_video2-portrait-hd-15s';
  aspect_ratio?: '16:9' | '9:16';
  duration?: 10 | 15 | 25;
  hd?: boolean;
  images?: string[];
  notify_hook?: string;
  watermark?: boolean;
  private?: boolean;
  character_url?: string;
  character_timestamps?: string;
  // DYU API 特定参数
  style?: string;
  storyboard?: boolean;
}

export interface TokenQuota {
  total_quota: number;
  used_quota: number;
  remaining_quota: number;
}

export interface StoryboardShot {
  duration: number;
  scene: string;
}

export interface StoryboardOptions extends CreateVideoOptions {
  shots: StoryboardShot[];
}

export interface Character {
  id: string;
  username: string;
  permalink: string;
  profile_picture_url: string;
}

export interface CreateCharacterOptions {
  url?: string;
  from_task?: string;
  timestamps: string;
}

export const STYLES: StyleOption[] = [
  { id: 'sketch', name: 'Minimal Sketch', nameZh: '极简素描', color: '#a8a29e', description: 'Rough pencil, loose lines', descriptionZh: '铅笔草稿，线条疏松' },
  { id: 'realistic', name: 'Realistic', nameZh: '写实风格', color: '#8B5CF6', description: 'Photorealistic, detailed', descriptionZh: '写实摄影，细节丰富' },
  { id: 'documentary', name: 'Documentary', nameZh: '纪录片风格', color: '#06b6d4', description: 'Documentary, natural lighting', descriptionZh: '纪录片风格，自然光影' },
  { id: 'cinematic', name: 'Cinematic', nameZh: '电影风格', color: '#8B5CF6', description: 'Professional cinematic look', descriptionZh: '专业电影风格' },
  { id: 'scifi', name: 'Sci-Fi', nameZh: '科幻未来', color: '#06b6d4', description: 'Futuristic, clean lines, neon accents', descriptionZh: '未来主义，线条干净，霓虹点缀' },
  { id: 'cyberpunk', name: 'Cyberpunk', nameZh: '赛博朋克', color: '#d946ef', description: 'High contrast, grit, tech elements', descriptionZh: '高对比度，科技感，坚硬质感' },
  { id: 'ink', name: 'Ink Wash', nameZh: '水墨国风', color: '#1e293b', description: 'Traditional Asian ink style, fluid', descriptionZh: '传统水墨，飘逸流畅' },
  { id: 'anime', name: 'Anime', nameZh: '日系动漫', color: '#f59e0b', description: 'Expressive, dynamic angles', descriptionZh: '表现力强，动态视角' },
  { id: 'noir', name: 'Film Noir', nameZh: '黑白电影', color: '#525252', description: 'Heavy shadows, high contrast b&w', descriptionZh: '重阴影，高对比黑白' },
  { id: 'clay', name: 'Claymation', nameZh: '粘土风格', color: '#e67e22', description: 'Plasticine texture, stop motion look', descriptionZh: '橡皮泥质感，定格动画' },
  { id: 'lego', name: 'Voxel/Brick', nameZh: '乐高积木', color: '#c0392b', description: '3D blocks, voxel art', descriptionZh: '3D积木，体素艺术' },
  { id: 'steampunk', name: 'Steampunk', nameZh: '蒸汽朋克', color: '#d35400', description: 'Brass, gears, victorian retro', descriptionZh: '黄铜齿轮，维多利亚复古' },
  { id: 'vangogh', name: 'Van Gogh', nameZh: '梵高抽象', color: '#f1c40f', description: 'Oil painting, swirling strokes', descriptionZh: '油画质感，漩涡笔触' },
];

export const SYMBOL_DESCRIPTIONS: Record<Language, Record<string, string>> = {
  zh: {
    'pan-left': '镜头向左平移 (Pan Left)',
    'pan-right': '镜头向右平移 (Pan Right)',
    'tilt-up': '镜头向上摇移 (Tilt Up)',
    'tilt-down': '镜头向下摇移 (Tilt Down)',
    'zoom-in': '镜头推近 (Zoom In)',
    'zoom-out': '镜头拉远 (Zoom Out)',
    'hitchcock': '希区柯克变焦 (Dolly Zoom)',
    'pov-shot': '主观视角运镜 (POV Shot)',
    'action-forward': '前进动作 (Forward Motion)',
    'action-rotate': '旋转动作 (Rotation)',
    'action-jump': '跳跃动作 (Jump Motion)',
    'action-fly': '飞行动作 (Flying Motion)',
    'quick-three-view': '三视图生成 (Three-View)',
    'quick-multi-grid': '多格布局生成 (Multi-Grid)',
    'quick-style-comparison': '风格对比生成 (Style Comparison)',
    'quick-narrative-progression': '叙事进展生成 (Narrative Progression)'
  },
  en: {
    'pan-left': 'Pan Left',
    'pan-right': 'Pan Right',
    'tilt-up': 'Tilt Up',
    'tilt-down': 'Tilt Down',
    'zoom-in': 'Zoom In',
    'zoom-out': 'Zoom Out',
    'hitchcock': 'Dolly Zoom',
    'pov-shot': 'POV Shot',
    'action-forward': 'Forward Motion',
    'action-rotate': 'Rotation',
    'action-jump': 'Jump Motion',
    'action-fly': 'Flying Motion',
    'quick-three-view': 'Three-View',
    'quick-multi-grid': 'Multi-Grid',
    'quick-style-comparison': 'Style Comparison',
    'quick-narrative-progression': 'Narrative Progression'
  }
};

export const SYMBOL_LABELS: Record<string, string> = {
  'pan-left': '←',
  'pan-right': '→',
  'tilt-up': '↑',
  'tilt-down': '↓',
  'zoom-in': '⊕',
  'zoom-out': '⊖',
  'hitchcock': '🌀',
  'pov-shot': '👁️',
  'action-forward': '➡️',
  'action-rotate': '🔄',
  'action-jump': '⬆️',
  'action-fly': '✈️',
  'quick-three-view': '📐',
  'quick-multi-grid': '🎬',
  'quick-style-comparison': '🎨',
  'quick-narrative-progression': '📖'
};

export const I18N = {
  zh: {
    unnamed: "未命名分镜项目",
    designerTitle: "分镜大师",
    designerSub: "AI 智能分镜创作平台",
    scriptMode: "剧本生成",
    chatMode: "创意对话",
    generate: "开始生成",
    frameCount: "分镜数量",
    exportPrompts: "导出提示词",
    previewPrompts: "预览提示词",
    langToggle: "EN",
    loading: "导演构思中...",
    regenerate: "重绘",
    redrawViewScript: "重绘（查看脚本）",
    downloadImage: "下载图片",
    delete: "删除镜头",
    copy: "克隆镜头",
    replace: "上传替换图片",
    setKey: "设为参考主体",
    symbols: "符号库",
    layouts: "导出排版布局",
    settings: "系统设置",
    guide: "智慧客服",
    apiConfig: "API 接口配置",
    themeToggle: "主题模式",
    compositeExport: "导出分镜图 (JPEG)",
    inputPlaceholder: "输入创意剧本...",
    importImage: "参考主体",
    importFrame: "导入分镜图片",
    noSelection: "请先框选或Ctrl+A选择至少一个分镜图",
    guides: ["如何使用", "分镜技巧", "提示词参考", "快捷键"],
    exportGlobalInstr: "【全局指令】保持写实摄影风格，16:9画幅，专业光影。\n【限制性指令】禁止闪烁，严禁背景形变，保持角色一致性。",
    labelRef: "参考主体 / REFERENCE SUBJECT",
    labelFrame: "分镜画面 / STORYBOARD FRAME",
    provider: "服务商",
    apiKey: "API 密钥",
    baseUrl: "接口地址 (Base URL)",
    model: "模型名称",
    save: "保存配置",
    exportPreviewTitle: "提示词预览与修改",
    collapse: "收起",
    expand: "展开",
    language: "语言",
    theme: "主题",
    darkMode: "深色",
    lightMode: "浅色",
    copyMessage: "复制此条消息",
    copiedMessage: "已复制"
  },
  en: {
    unnamed: "Untitled Storyboard",
    designerTitle: "Storyboard Master",
    designerSub: "AI-Powered Storyboarding Platform",
    scriptMode: "Script to Viz",
    chatMode: "Creative Chat",
    generate: "Gen Frames",
    frameCount: "Scenes",
    exportPrompts: "Export Prompts",
    previewPrompts: "Preview Prompts",
    langToggle: "中",
    loading: "Directing...",
    regenerate: "Redraw Frame",
    redrawViewScript: "Redraw (View Script)",
    downloadImage: "Download Image",
    delete: "Remove",
    copy: "Clone",
    replace: "Upload & Replace",
    setKey: "Set as Main",
    symbols: "Symbols",
    layouts: "Export Layouts",
    settings: "Settings",
    guide: "Smart Service",
    apiConfig: "API Interface Config",
    themeToggle: "Color Mode",
    compositeExport: "Export Storyboard (JPEG)",
    inputPlaceholder: "Enter your script...",
    importImage: "Import Ref Subject",
    importFrame: "Import Storyboard Frame",
    noSelection: "Please marquee select or Ctrl+A to select frames",
    guides: ["Getting Started", "Shot Tips", "Prompt Help", "Shortcuts"],
    exportGlobalInstr: "[GLOBAL] Maintain realistic cinematic style, 16:9 aspect ratio, professional lighting.\n[RESTRICTIVE] No flickering, no background warping, maintain character consistency.",
    labelRef: "REFERENCE SUBJECT",
    labelFrame: "STORYBOARD FRAME",
    provider: "Provider",
    apiKey: "API Key",
    baseUrl: "Base URL",
    model: "Model Name",
    save: "Save Config",
    exportPreviewTitle: "Preview & Edit Prompts",
    collapse: "Collapse",
    expand: "Expand",
    language: "Language",
    theme: "Theme",
    darkMode: "Dark",
    lightMode: "Light",
    copyMessage: "Copy this message",
    copiedMessage: "Copied"
  }
};
