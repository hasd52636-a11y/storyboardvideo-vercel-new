/**
 * 多媒体 API 客户端
 * 统一处理所有多媒体 API 调用
 */

export interface MultimediaApiOptions {
  action: string;
  method?: 'GET' | 'POST' | 'PUT';
  body?: any;
}

/**
 * 从 localStorage 获取配置
 */
function getConfigFromStorage(): any {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = window.localStorage.getItem('multimedia_config_default');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Failed to load config from localStorage:', error);
    return null;
  }
}

/**
 * 获取 API base URL
 */
function getBaseUrl(): string {
  // 优先使用环境变量
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // 浏览器环境中使用当前域名
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // 默认值
  return 'http://localhost:3000';
}

/**
 * 调用多媒体 API
 */
export async function callMultimediaApi(options: MultimediaApiOptions) {
  const { action, method = 'POST', body } = options;
  
  const baseUrl = getBaseUrl();
  const url = new URL('/api/multimedia', baseUrl);
  url.searchParams.set('action', action);

  // 获取配置并添加到请求体
  const config = getConfigFromStorage();
  const requestBody = {
    ...body,
    _config: config, // 传递配置给 API
  };

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (requestBody) {
    fetchOptions.body = JSON.stringify(requestBody);
  }

  const response = await fetch(url.toString(), fetchOptions);
  return response.json();
}

/**
 * 文字转图像
 */
export async function textToImage(prompt: string, provider?: string, options?: any) {
  return callMultimediaApi({
    action: 'text-to-image',
    method: 'POST',
    body: { prompt, provider, ...options },
  });
}

/**
 * 图像编辑（图生图）
 */
export async function imageToImage(imageUrl: string, prompt: string, provider?: string, options?: any) {
  return callMultimediaApi({
    action: 'image-to-image',
    method: 'POST',
    body: { imageUrl, prompt, provider, ...options },
  });
}

/**
 * 文本生成
 */
export async function textGeneration(prompt: string, provider?: string, options?: any) {
  return callMultimediaApi({
    action: 'text-generation',
    method: 'POST',
    body: { prompt, provider, ...options },
  });
}

/**
 * 图像分析
 */
export async function imageAnalysis(imageUrl: string, prompt?: string, provider?: string, options?: any) {
  return callMultimediaApi({
    action: 'image-analysis',
    method: 'POST',
    body: { imageUrl, prompt, provider, ...options },
  });
}

/**
 * 视频生成
 */
export async function videoGeneration(prompt: string, provider?: string, options?: any) {
  return callMultimediaApi({
    action: 'video-generation',
    method: 'POST',
    body: { prompt, provider, ...options },
  });
}

/**
 * 视频分析
 */
export async function videoAnalysis(videoUrl: string, prompt?: string, provider?: string, options?: any) {
  return callMultimediaApi({
    action: 'video-analysis',
    method: 'POST',
    body: { videoUrl, prompt, provider, ...options },
  });
}

/**
 * 获取配置
 */
export async function getConfig() {
  return callMultimediaApi({
    action: 'config',
    method: 'GET',
  });
}

/**
 * 更新配置
 */
export async function updateConfig(config: any) {
  return callMultimediaApi({
    action: 'config',
    method: 'POST',
    body: config,
  });
}

/**
 * 同步配置
 */
export async function syncConfig(provider: string) {
  return callMultimediaApi({
    action: 'config',
    method: 'PUT',
    body: { provider },
  });
}
