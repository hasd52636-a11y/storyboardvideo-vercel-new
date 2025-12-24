// videoService.ts

interface VideoServiceConfig {
  baseUrl: string;
  apiKey: string;
}

interface VideoStatus {
  task_id: string;
  status: 'NOT_START' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILURE';
  progress: number;
  created_at: number;
  model: string;
  duration: number;
  size: string;
  video_url?: string;
  error?: {
    code: string;
    message: string;
  };
}

interface CreateVideoOptions {
  model: 'sora-2' | 'sora-2-pro';
  aspect_ratio?: '16:9' | '9:16';
  duration?: 10 | 15 | 25;
  hd?: boolean;
  images?: string[];
}

interface TokenQuota {
  total_quota: number;
  used_quota: number;
  remaining_quota: number;
}

class VideoService {
  private config: VideoServiceConfig;
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(config: VideoServiceConfig) {
    this.config = config;
  }

  private buildHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  async createVideo(
    prompt: string,
    options: CreateVideoOptions
  ): Promise<{ task_id: string; status: string; progress: number }> {
    try {
      const endpoint = `${this.config.baseUrl}/v2/videos/generations`;

      const body: any = {
        model: options.model,
        prompt: prompt,
        aspect_ratio: options.aspect_ratio || '16:9',
        duration: options.duration || 10,
        hd: options.hd || false
      };

      if (options.images && options.images.length > 0) {
        body.images = options.images;
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
        status: data.status,
        progress: data.progress
      };
    } catch (error) {
      console.error('Video creation error:', error);
      throw error;
    }
  }

  async getVideoStatus(taskId: string): Promise<VideoStatus> {
    try {
      const endpoint = `${this.config.baseUrl}/v2/videos/generations/${taskId}`;

      const myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${this.config.apiKey}`);

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
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
        status: data.status,
        progress: data.progress,
        created_at: data.created_at,
        model: data.model,
        duration: data.duration,
        size: data.size,
        video_url: data.video_url,
        error: data.error
      };
    } catch (error) {
      console.error('Get video status error:', error);
      throw error;
    }
  }

  async remixVideo(
    taskId: string,
    prompt: string
  ): Promise<{ task_id: string; status: string; progress: number }> {
    try {
      const endpoint = `${this.config.baseUrl}/v1/videos/${taskId}/remix`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error (${response.status}): ${errorText}`);
      }

      const responseText = await response.text();
      const data = JSON.parse(responseText);

      return {
        task_id: data.task_id,
        status: data.status,
        progress: data.progress
      };
    } catch (error) {
      console.error('Remix video error:', error);
      throw error;
    }
  }

  async getTokenQuota(): Promise<TokenQuota> {
    try {
      const endpoint = `${this.config.baseUrl}/v1/token/quota`;

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
        total_quota: data.total_quota,
        used_quota: data.used_quota,
        remaining_quota: data.remaining_quota
      };
    } catch (error) {
      console.error('Get token quota error:', error);
      throw error;
    }
  }

  startPolling(
    taskId: string,
    onProgress: (status: VideoStatus) => void,
    onComplete: (videoUrl: string) => void,
    onError: (error: Error) => void
  ): void {
    let retryCount = 0;
    const maxRetries = 120;
    const pollInterval = 3000;

    const poll = async () => {
      try {
        const status = await this.getVideoStatus(taskId);

        onProgress(status);

        if (status.status === 'SUCCESS') {
          if (status.video_url) {
            onComplete(status.video_url);
          }
          this.stopPolling(taskId);
        } else if (status.status === 'FAILURE') {
          const errorMessage = status.error?.message || 'Video generation failed';
          onError(new Error(errorMessage));
          this.stopPolling(taskId);
        } else {
          retryCount++;
          if (retryCount >= maxRetries) {
            onError(new Error('Video generation timeout (exceeded max retries)'));
            this.stopPolling(taskId);
          }
        }
      } catch (error) {
        onError(error as Error);
        this.stopPolling(taskId);
      }
    };

    poll();
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
export type { VideoStatus, CreateVideoOptions, VideoServiceConfig, TokenQuota };
