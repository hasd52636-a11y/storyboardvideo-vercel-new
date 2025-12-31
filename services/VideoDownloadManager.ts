/**
 * 视频下载管理器
 * 负责下载视频文件和生成文件名
 */
export class VideoDownloadManager {
  /**
   * 下载视频文件
   */
  async downloadVideo(
    videoUrl: string,
    sceneId: string,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    try {
      // 获取视频文件
      const response = await fetch(videoUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`);
      }

      // 获取文件大小
      const contentLength = response.headers.get('content-length');
      const total = parseInt(contentLength || '0', 10);

      // 读取响应体
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Unable to read response body');
      }

      const chunks: Uint8Array[] = [];
      let loaded = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        loaded += value.length;

        // 报告进度
        if (onProgress && total > 0) {
          onProgress(Math.round((loaded / total) * 100));
        }
      }

      // 创建 Blob
      const blob = new Blob(chunks, { type: 'video/mp4' });

      // 生成下载链接
      const downloadUrl = URL.createObjectURL(blob);
      const fileName = this.generateFileName(sceneId);

      // 创建下载链接并触发下载
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // 清理资源
      URL.revokeObjectURL(downloadUrl);

      console.log(`Video downloaded: ${fileName}`);
    } catch (error) {
      console.error('Video download error:', error);
      throw error;
    }
  }

  /**
   * 生成文件名
   */
  generateFileName(sceneId: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    return `video_${sceneId}_${timestamp}.mp4`;
  }

  /**
   * 验证视频 URL 是否可访问
   */
  async validateVideoUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Video URL validation failed:', error);
      return false;
    }
  }
}

export default VideoDownloadManager;
