// videoService.ts
import {
  VideoServiceConfig,
  VideoStatus,
  CreateVideoOptions,
  TokenQuota,
  StoryboardShot,
  StoryboardOptions,
  Character,
  CreateCharacterOptions,
  VideoAPIProvider
} from './types';
import ZhipuService from './zhipuService';

export type { VideoAPIProvider };

export interface VideoServiceConfigWithProvider extends VideoServiceConfig {
  provider?: VideoAPIProvider;
}

class VideoService {
  private config: VideoServiceConfigWithProvider;
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();
  private provider: VideoAPIProvider;

  constructor(config: VideoServiceConfigWithProvider) {
    this.config = config;
    this.provider = config.provider || 'openai';
  }

  setProvider(provider: VideoAPIProvider): void {
    this.provider = provider;
  }

  getProvider(): VideoAPIProvider {
    return this.provider;
  }

  private buildHeaders(contentType: string = 'application/json'): HeadersInit {
    // 确保所有请求头都只包含 ASCII 字符，避免 fetch 编码问题
    const apiKey = this.config.apiKey || '';
    
    // 验证 API Key 是否包含非 ASCII 字符
    if (!/^[\x00-\x7F]*$/.test(apiKey)) {
      console.warn('[VideoService] API Key contains non-ASCII characters, filtering...');
      // 过滤掉非 ASCII 字符
      const cleanApiKey = apiKey.replace(/[^\x00-\x7F]/g, '');
      if (!cleanApiKey) {
        throw new Error('API Key contains only non-ASCII characters');
      }
      return {
        'Authorization': `Bearer ${cleanApiKey}`,
        'Content-Type': contentType
      };
    }

    return {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': contentType
    };
  }

  private getOpenAIEndpoint(action: string): string {
    // For OpenAI Sora and compatible APIs (Shenma, etc.)
    // Use the baseUrl as-is, just append the correct endpoint path
    let baseUrl = this.config.baseUrl.replace(/\/$/, '');
    
    // Remove any /v4 or /v1 suffix if present to avoid duplication
    baseUrl = baseUrl.replace(/\/v[0-9]+$/, '');
    
    switch (action) {
      case 'create':
        return `${baseUrl}/v2/videos/generations`;
      case 'status':
        return `${baseUrl}/v2/videos/generations`;
      case 'quota':
        return `${baseUrl}/v1/token/quota`;
      case 'character':
        return `${baseUrl}/sora/v1/characters`;
      default:
        return baseUrl;
    }
  }

  private getDYUEndpoint(action: string): string {
    const baseUrl = this.config.baseUrl.replace(/\/$/, '');
    switch (action) {
      case 'create':
        return `${baseUrl}/v1/videos`;
      case 'status':
        return `${baseUrl}/v1/videos`;
      case 'quota':
        return `${baseUrl}/v1/token/quota`;
      case 'character':
        return `${baseUrl}/v1/videos`;
      default:
        return baseUrl;
    }
  }

  private getShenmaEndpoint(action: string): string {
    const baseUrl = this.config.baseUrl.replace(/\/$/, '');
    switch (action) {
      case 'create':
        // 神马 API 支持 OpenAI 兼容的 sora-video 端点
        return `${baseUrl}/v2/videos/generations`;
      case 'status':
        return `${baseUrl}/v2/videos/generations`;
      case 'quota':
        return `${baseUrl}/v1/token/quota`;
      default:
        return baseUrl;
    }
  }

  private getZhipuEndpoint(action: string): string {
    // 智谱 API 使用固定的基础 URL
    switch (action) {
      case 'create':
        return 'https://open.bigmodel.cn/api/paas/v4/videos/generations';
      case 'status':
        // 智谱使用 /async-result/{taskId} 查询异步任务结果
        return 'https://open.bigmodel.cn/api/paas/v4/async-result';
      default:
        return 'https://open.bigmodel.cn/api/paas/v4';
    }
  }

  async createVideo(
    prompt: string,
    options: CreateVideoOptions
  ): Promise<{ task_id: string; status: string; progress: string }> {
    try {
      if (this.provider === 'dyu') {
        return this.createVideoDYU(prompt, options);
      }
      if (this.provider === 'shenma') {
        return this.createVideoShenma(prompt, options);
      }
      if (this.provider === 'zhipu') {
        return this.createVideoZhipu(prompt, options);
      }
      return this.createVideoOpenAI(prompt, options);
    } catch (error) {
      console.error('Video creation error:', error);
      throw error;
    }
  }

  private async createVideoOpenAI(
    prompt: string,
    options: CreateVideoOptions
  ): Promise<{ task_id: string; status: string; progress: string }> {
    const endpoint = this.getOpenAIEndpoint('create');

    const body: any = {
      model: options.model || 'sora-2',
      prompt: prompt,
      aspect_ratio: options.aspect_ratio || '16:9',
      duration: options.duration || 10,
      hd: options.hd || false,
      watermark: options.watermark ?? false,
      private: options.private ?? false
    };

    if (options.images && options.images.length > 0) {
      body.images = options.images;
    }

    // 处理参考图像
    if (options.reference_image) {
      body.images = [options.reference_image];
    }

    if (options.notify_hook) {
      body.notify_hook = options.notify_hook;
    }

    if (options.character_url) {
      body.character_url = options.character_url;
    }

    if (options.character_timestamps) {
      body.character_timestamps = options.character_timestamps;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    const responseText = await response.text();
    const data = JSON.parse(responseText);

    return {
      task_id: data.task_id,
      status: data.status || 'SUBMITTED',
      progress: data.progress || '0%'
    };
  }

  private async createVideoDYU(
    prompt: string,
    options: CreateVideoOptions
  ): Promise<{ task_id: string; status: string; progress: string }> {
    const endpoint = this.getDYUEndpoint('create');

    // DYU API 使用不同的参数格式
    const body: any = {
      model: this.mapModelToDYU(options.model),
      prompt: prompt
    };

    // 处理风格参数
    if (options.style) {
      body.style = options.style;
    }

    // 处理图片参数
    if (options.images && options.images.length > 0) {
      body.image_url = options.images[0]; // DYU API 只支持单个图片 URL
    }

    // 处理故事板参数
    if (options.storyboard) {
      body.storyboard = true;
    }

    // 处理水印参数
    if (options.watermark === false) {
      body.trim = true; // DYU API 的 trim 参数用于去首帧水印
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    const responseText = await response.text();
    const data = JSON.parse(responseText);

    return {
      task_id: data.id || data.task_id,
      status: data.status || 'queued',
      progress: data.progress ? `${data.progress}%` : '0%'
    };
  }

  private mapModelToDYU(model: string): string {
    // 将 OpenAI 模型名称映射到 DYU API 模型名称
    const modelMap: Record<string, string> = {
      'sora-2': 'sora2-landscape',
      'sora-2-pro': 'sora2-pro-landscape-25s'
    };
    return modelMap[model] || model;
  }

  private mapModelFromDYU(model: string): string {
    // 将 DYU API 模型名称映射回 OpenAI 模型名称
    if (model.includes('pro')) {
      return 'sora-2-pro';
    }
    return 'sora-2';
  }

  private async createVideoShenma(
    prompt: string,
    options: CreateVideoOptions
  ): Promise<{ task_id: string; status: string; progress: string }> {
    // 神马 API 支持 OpenAI 兼容的 sora-video 端点
    // 使用 OpenAI 格式而不是 Seedance 格式
    return this.createVideoOpenAI(prompt, options);
  }

  private async createVideoZhipu(
    prompt: string,
    options: CreateVideoOptions
  ): Promise<{ task_id: string; status: string; progress: string }> {
    const zhipuService = new ZhipuService(this.config as any);
    
    // 映射尺寸参数
    const sizeMap: Record<string, any> = {
      '16:9': '1920x1080',
      '9:16': '1080x1920',
      '1:1': '1024x1024'
    };

    const result = await zhipuService.generateVideo(prompt, {
      imageUrl: options.reference_image || options.images?.[0],
      quality: options.hd ? 'quality' : 'speed',
      withAudio: false,
      watermarkEnabled: options.watermark ?? true,
      size: sizeMap[options.aspect_ratio || '16:9'] || '1920x1080',
      fps: 30,
      duration: (options.duration as 5 | 10) || 5,
      userId: 'default_user'
    });

    return {
      task_id: result.taskId,
      status: result.status,
      progress: '0%'
    };
  }

  async getVideoStatus(taskId: string): Promise<VideoStatus> {
    try {
      if (this.provider === 'dyu') {
        return this.getVideoStatusDYU(taskId);
      }
      if (this.provider === 'shenma') {
        return this.getVideoStatusShenma(taskId);
      }
      if (this.provider === 'zhipu') {
        return this.getVideoStatusZhipu(taskId);
      }
      return this.getVideoStatusOpenAI(taskId);
    } catch (error) {
      console.error('Get video status error:', error);
      throw error;
    }
  }

  private async getVideoStatusOpenAI(taskId: string): Promise<VideoStatus> {
    const endpoint = `${this.getOpenAIEndpoint('status')}/${taskId}`;

    const requestOptions = {
      method: 'GET',
      headers: this.buildHeaders(),
      redirect: 'follow' as RequestRedirect
    };

    const response = await fetch(endpoint, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    const responseText = await response.text();
    const data = JSON.parse(responseText);

    return {
      task_id: data.task_id,
      status: data.status || 'IN_PROGRESS',
      progress: data.progress || '0%',
      submit_time: data.submit_time,
      start_time: data.start_time,
      finish_time: data.finish_time,
      fail_reason: data.fail_reason,
      video_url: data.data?.output || data.video_url,
      error: data.error
    };
  }

  private async getVideoStatusDYU(taskId: string): Promise<VideoStatus> {
    const endpoint = `${this.getDYUEndpoint('status')}/${taskId}`;

    const requestOptions = {
      method: 'GET',
      headers: this.buildHeaders(),
      redirect: 'follow' as RequestRedirect
    };

    const response = await fetch(endpoint, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    const responseText = await response.text();
    const data = JSON.parse(responseText);

    // 映射 DYU API 的响应格式到统一的 VideoStatus 格式
    const statusMap: Record<string, string> = {
      'queued': 'NOT_START',
      'in_progress': 'IN_PROGRESS',
      'completed': 'SUCCESS',
      'failed': 'FAILURE'
    };

    return {
      task_id: data.id || taskId,
      status: statusMap[data.status] || data.status,
      progress: data.progress ? `${data.progress}%` : '0%',
      created_at: data.created_at,
      submit_time: data.created_at,
      start_time: data.created_at,
      finish_time: data.completed_at,
      model: this.mapModelFromDYU(data.model || ''),
      size: data.size,
      video_url: data.video_url || data.url,
      fail_reason: data.error?.message,
      error: data.error
    };
  }

  private async getVideoStatusShenma(taskId: string): Promise<VideoStatus> {
    // 神马 API 支持 OpenAI 兼容的 /v2/videos/generations 端点
    // 使用 OpenAI 格式进行状态查询
    return this.getVideoStatusOpenAI(taskId);
  }

  private async getVideoStatusZhipu(taskId: string): Promise<VideoStatus> {
    const zhipuService = new ZhipuService(this.config as any);
    const result = await zhipuService.getVideoStatus(taskId);

    // 映射智谱状态到统一的 VideoStatus 格式
    const statusMap: Record<string, string> = {
      'PROCESSING': 'IN_PROGRESS',
      'SUCCESS': 'SUCCESS',
      'FAIL': 'FAILURE'
    };

    // 计算进度：根据状态返回合理的进度值
    let progress = '0%';
    if (result.status === 'SUCCESS') {
      progress = '100%';
    } else if (result.status === 'PROCESSING') {
      // 处理中：显示动态进度（30-90%）
      progress = '30%';
    } else if (result.status === 'FAIL') {
      progress = '0%';
    }

    return {
      task_id: taskId,
      status: statusMap[result.status] as any || 'IN_PROGRESS',
      progress: progress,
      video_url: result.videoUrl,
      fail_reason: result.error
    };
  }

  async getTokenQuota(): Promise<TokenQuota> {
    try {
      if (this.provider === 'dyu') {
        return this.getTokenQuotaDYU();
      }
      if (this.provider === 'shenma') {
        return this.getTokenQuotaShenma();
      }
      return this.getTokenQuotaOpenAI();
    } catch (error) {
      console.error('Get token quota error:', error);
      throw error;
    }
  }

  private async getTokenQuotaOpenAI(): Promise<TokenQuota> {
    const endpoint = this.getOpenAIEndpoint('quota');

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: this.buildHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    const responseText = await response.text();
    const data = JSON.parse(responseText);

    return {
      total_quota: data.total_quota || 0,
      used_quota: data.used_quota || 0,
      remaining_quota: data.remaining_quota || 0
    };
  }

  private async getTokenQuotaDYU(): Promise<TokenQuota> {
    const endpoint = this.getDYUEndpoint('quota');

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: this.buildHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    const responseText = await response.text();
    const data = JSON.parse(responseText);

    return {
      total_quota: data.total_quota || 0,
      used_quota: data.used_quota || 0,
      remaining_quota: data.remaining_quota || 0
    };
  }

  private async getTokenQuotaShenma(): Promise<TokenQuota> {
    const endpoint = this.getShenmaEndpoint('quota');

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: this.buildHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    const responseText = await response.text();
    const data = JSON.parse(responseText);

    return {
      total_quota: data.total_quota || 0,
      used_quota: data.used_quota || 0,
      remaining_quota: data.remaining_quota || 0
    };
  }

  // 获取配额百分比
  async getQuotaPercentage(): Promise<number> {
    try {
      const quota = await this.getTokenQuota();
      if (quota.total_quota === 0) return 0;
      return Math.round((quota.used_quota / quota.total_quota) * 100);
    } catch (error) {
      console.error('Get quota percentage error:', error);
      return 0;
    }
  }

  // 检查配额是否充足
  async hasEnoughQuota(requiredQuota: number = 1): Promise<boolean> {
    try {
      const quota = await this.getTokenQuota();
      return quota.remaining_quota >= requiredQuota;
    } catch (error) {
      console.error('Check quota error:', error);
      return false;
    }
  }

  // 创建角色
  async createCharacter(options: CreateCharacterOptions): Promise<Character> {
    try {
      if (this.provider === 'dyu') {
        return this.createCharacterDYU(options);
      }
      return this.createCharacterOpenAI(options);
    } catch (error) {
      console.error('Create character error:', error);
      throw error;
    }
  }

  private async createCharacterOpenAI(options: CreateCharacterOptions): Promise<Character> {
    if (!options.url && !options.from_task) {
      throw new Error('Either url or from_task must be provided');
    }

    const endpoint = this.getOpenAIEndpoint('character');

    const body: any = {
      timestamps: options.timestamps
    };

    if (options.url) {
      body.url = options.url;
    }

    if (options.from_task) {
      body.from_task = options.from_task;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    const responseText = await response.text();
    const data = JSON.parse(responseText);

    return {
      id: data.id,
      username: data.username,
      permalink: data.permalink,
      profile_picture_url: data.profile_picture_url
    };
  }

  private async createCharacterDYU(options: CreateCharacterOptions): Promise<Character> {
    // DYU API 的角色创建使用不同的端点和参数格式
    const endpoint = `${this.getDYUEndpoint('character')}`;

    const body: any = {
      model: 'character-training',
      prompt: 'character creation',
      timestamps: options.timestamps
    };

    if (options.url) {
      body.url = options.url;
    }

    if (options.from_task) {
      body.character = options.from_task;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    const responseText = await response.text();
    const data = JSON.parse(responseText);

    return {
      id: data.id,
      username: data.id, // DYU API 可能不返回 username
      permalink: '',
      profile_picture_url: ''
    };
  }

  // 创建故事板视频
  async createStoryboardVideo(
    options: StoryboardOptions
  ): Promise<{ task_id: string; status: string; progress: string }> {
    try {
      // 构建故事板提示词格式
      let storyboardPrompt = '';
      options.shots.forEach((shot, index) => {
        storyboardPrompt += `Shot ${index + 1}:\nduration: ${shot.duration}sec\nScene: ${shot.scene}`;
        if (index < options.shots.length - 1) {
          storyboardPrompt += '\n\n';
        }
      });

      // 使用故事板提示词调用创建视频
      return this.createVideo(storyboardPrompt, {
        model: options.model,
        aspect_ratio: options.aspect_ratio,
        duration: options.duration,
        hd: options.hd,
        images: options.images,
        notify_hook: options.notify_hook,
        watermark: options.watermark,
        private: options.private
      });
    } catch (error) {
      console.error('Create storyboard video error:', error);
      throw error;
    }
  }

  // 格式化故事板提示词
  static formatStoryboardPrompt(shots: StoryboardShot[]): string {
    let prompt = '';
    shots.forEach((shot, index) => {
      prompt += `Shot ${index + 1}:\nduration: ${shot.duration}sec\nScene: ${shot.scene}`;
      if (index < shots.length - 1) {
        prompt += '\n\n';
      }
    });
    return prompt;
  }

  startPolling(
    taskId: string,
    onProgress: (status: VideoStatus) => void,
    onComplete: (videoUrl: string) => void,
    onError: (error: Error) => void,
    timeoutMs: number = 60 * 60 * 1000  // 60 分钟超时
  ): void {
    let pollInterval = 3000;  // 初始 3 秒
    const maxInterval = 15000;  // 最大 15 秒
    const backoffMultiplier = 1.2;  // 更温和的增长
    const startTime = Date.now();
    let pollCount = 0;

    const poll = async () => {
      pollCount++;
      try {
        // 检查超时
        const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
        if (Date.now() - startTime > timeoutMs) {
          console.error(`[Video Polling] Timeout after ${elapsedSeconds}s`);
          onError(new Error(`Video generation timeout (exceeded ${timeoutMs / 60 / 1000} minutes)`));
          this.stopPolling(taskId);
          return;
        }

        const status = await this.getVideoStatus(taskId);
        
        // 添加详细日志
        console.log(`[Video Polling #${pollCount}] Task: ${taskId}`);
        console.log(`  Status: ${status.status}`);
        console.log(`  Progress: ${status.progress}`);
        console.log(`  Elapsed: ${elapsedSeconds}s`);
        console.log(`  Next poll in: ${Math.round(pollInterval / 1000)}s`);
        
        onProgress(status);

        if (status.status === 'SUCCESS') {
          console.log(`[Video Polling] ✅ SUCCESS after ${elapsedSeconds}s and ${pollCount} polls`);
          if (status.video_url) {
            onComplete(status.video_url);
          } else {
            onError(new Error('Video generated but URL not found'));
          }
          this.stopPolling(taskId);
        } else if (status.status === 'FAILURE') {
          console.error(`[Video Polling] ❌ FAILURE after ${elapsedSeconds}s`);
          // 区分不同的失败原因
          let errorMessage = status.fail_reason || status.error?.message || 'Video generation failed';
          
          // 根据失败原因提供更详细的提示
          if (errorMessage.includes('真人') || errorMessage.includes('face')) {
            errorMessage = '❌ 审查失败: 图片中检测到真人或类似真人的内容，请使用非真人图片';
          } else if (errorMessage.includes('违规') || errorMessage.includes('暴力') || errorMessage.includes('色情')) {
            errorMessage = '❌ 审查失败: 提示词或内容违规，请修改后重试';
          } else if (errorMessage.includes('版权') || errorMessage.includes('名人')) {
            errorMessage = '❌ 审查失败: 涉及版权或活着的名人，请修改提示词';
          }
          
          onError(new Error(errorMessage));
          this.stopPolling(taskId);
        } else {
          // 增加轮询间隔（指数退避，但更温和）
          pollInterval = Math.min(pollInterval * backoffMultiplier, maxInterval);
        }
      } catch (error) {
        console.error('[Video Polling] Error:', error);
        onError(error as Error);
        this.stopPolling(taskId);
      }
    };

    // 立即执行第一次轮询
    poll();
    // 然后设置定时轮询
    const intervalId = setInterval(poll, pollInterval);
    this.pollingIntervals.set(taskId, intervalId);
  }

  stopPolling(taskId: string): void {
    const intervalId = this.pollingIntervals.get(taskId);
    if (intervalId) {
      clearInterval(intervalId);
      this.pollingIntervals.delete(taskId);
    }
  }

  cleanup(): void {
    this.pollingIntervals.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    this.pollingIntervals.clear();
  }
}

export default VideoService;
export type { VideoStatus, CreateVideoOptions, VideoServiceConfig, TokenQuota, StoryboardShot, StoryboardOptions, Character, CreateCharacterOptions };
