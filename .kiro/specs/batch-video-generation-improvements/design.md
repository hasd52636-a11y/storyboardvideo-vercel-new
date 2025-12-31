# 批量视频生成改进 - 设计文档

## 概述

本设计文档描述如何改进批量视频生成功能，解决三个主要问题：
1. 失败视频无法定位和重新提交
2. 视频和提示词没有对应标记
3. 生成的视频没有下载按钮

## 架构

### 当前架构问题

```
当前流程:
用户输入提示词 → 批量生成 → 视频生成 → 显示结果
                                    ↓
                            问题1: 失败无法定位
                            问题2: 无对应标记
                            问题3: 无下载按钮
```

### 改进后的架构

```
改进流程:
用户输入提示词 → 分配场景ID → 批量生成 → 视频生成 → 保存元数据 → 显示结果
                                                              ↓
                                        问题1: 清晰的失败定位和重新生成
                                        问题2: 场景ID和提示词对应标记
                                        问题3: 下载按钮和下载功能
```

## 数据模型

### VideoItem 接口（扩展）

```typescript
interface VideoItem {
  // 基础信息
  id: string;                    // 唯一标识符（UUID）
  sceneId: string;               // 场景ID（SC-01, SC-02 等）
  
  // 提示词信息
  visualPrompt: string;          // 画面提示词
  videoPrompt: string;           // 视频提示词
  
  // 生成配置
  model: string;                 // 模型（sora-2, sora-2-pro 等）
  aspectRatio: string;           // 宽高比（16:9, 9:16 等）
  duration: number;              // 时长（秒）
  hd: boolean;                   // 是否高清
  
  // 生成状态
  status: 'pending' | 'generating' | 'success' | 'failed';
  progress: number;              // 进度百分比（0-100）
  errorMessage?: string;         // 错误信息
  
  // 生成结果
  videoUrl?: string;             // 视频URL
  taskId?: string;               // 任务ID（用于轮询）
  
  // 时间戳
  createdAt: number;             // 创建时间
  updatedAt: number;             // 更新时间
  completedAt?: number;          // 完成时间
  
  // 重试信息
  retryCount: number;            // 重试次数
  maxRetries: number;            // 最大重试次数
  lastRetryAt?: number;          // 最后重试时间
}
```

### BatchGenerationState 接口

```typescript
interface BatchGenerationState {
  id: string;                    // 批量生成ID
  items: VideoItem[];            // 视频项列表
  
  // 统计信息
  total: number;                 // 总数
  completed: number;             // 已完成数
  failed: number;                // 失败数
  pending: number;               // 待处理数
  
  // 状态
  status: 'idle' | 'processing' | 'completed' | 'paused';
  
  // 时间戳
  startedAt?: number;            // 开始时间
  completedAt?: number;          // 完成时间
}
```

## 组件和接口

### 1. VideoItem 卡片组件（改进）

```typescript
interface VideoItemCardProps {
  item: VideoItem;
  onRetry?: (itemId: string) => void;
  onDownload?: (itemId: string) => void;
  lang?: 'zh' | 'en';
  theme?: 'light' | 'dark';
}

export function VideoItemCard({
  item,
  onRetry,
  onDownload,
  lang = 'zh',
  theme = 'dark'
}: VideoItemCardProps) {
  // 显示场景ID
  // 显示提示词摘要
  // 显示状态指示器
  // 显示下载按钮（成功时）
  // 显示重新生成按钮（失败时）
  // 显示进度条（生成中时）
}
```

### 2. 批量生成进度组件

```typescript
interface BatchProgressProps {
  state: BatchGenerationState;
  lang?: 'zh' | 'en';
  theme?: 'light' | 'dark';
}

export function BatchProgress({
  state,
  lang = 'zh',
  theme = 'dark'
}: BatchProgressProps) {
  // 显示进度条
  // 显示统计信息（成功/失败/总数）
  // 显示预计完成时间
}
```

### 3. 视频下载管理器

```typescript
class VideoDownloadManager {
  /**
   * 下载视频文件
   * @param videoUrl - 视频URL
   * @param sceneId - 场景ID
   * @param onProgress - 进度回调
   */
  async downloadVideo(
    videoUrl: string,
    sceneId: string,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    // 1. 获取视频文件
    // 2. 创建Blob对象
    // 3. 生成下载链接
    // 4. 触发下载
    // 5. 清理资源
  }

  /**
   * 生成文件名
   * @param sceneId - 场景ID
   * @returns 文件名
   */
  generateFileName(sceneId: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `video_${sceneId}_${timestamp}.mp4`;
  }
}
```

### 4. 视频状态管理器

```typescript
class VideoStatusManager {
  /**
   * 创建新的视频项
   * @param sceneId - 场景ID
   * @param visualPrompt - 画面提示词
   * @param videoPrompt - 视频提示词
   * @param config - 生成配置
   */
  createVideoItem(
    sceneId: string,
    visualPrompt: string,
    videoPrompt: string,
    config: any
  ): VideoItem {
    return {
      id: crypto.randomUUID(),
      sceneId,
      visualPrompt,
      videoPrompt,
      model: config.model,
      aspectRatio: config.aspectRatio,
      duration: config.duration,
      hd: config.hd,
      status: 'pending',
      progress: 0,
      retryCount: 0,
      maxRetries: config.maxRetries || 3,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  /**
   * 更新视频项状态
   * @param item - 视频项
   * @param status - 新状态
   * @param updates - 其他更新
   */
  updateVideoItem(
    item: VideoItem,
    status: VideoItem['status'],
    updates?: Partial<VideoItem>
  ): VideoItem {
    return {
      ...item,
      status,
      updatedAt: Date.now(),
      ...updates
    };
  }

  /**
   * 标记视频生成失败
   * @param item - 视频项
   * @param error - 错误信息
   */
  markAsFailed(item: VideoItem, error: Error): VideoItem {
    return this.updateVideoItem(item, 'failed', {
      errorMessage: error.message,
      progress: 0
    });
  }

  /**
   * 标记视频生成成功
   * @param item - 视频项
   * @param videoUrl - 视频URL
   */
  markAsSuccess(item: VideoItem, videoUrl: string): VideoItem {
    return this.updateVideoItem(item, 'success', {
      videoUrl,
      progress: 100,
      completedAt: Date.now()
    });
  }
}
```

## 实现流程

### 1. 批量生成初始化

```typescript
const handleGenerateVideoBatch = async (
  scenes: Scene[],
  config: any
) => {
  // 1. 为每个场景分配ID
  const videoItems = scenes.map((scene, index) => {
    const sceneId = `SC-${String(index + 1).padStart(2, '0')}`;
    return statusManager.createVideoItem(
      sceneId,
      scene.visualPrompt,
      scene.videoPrompt,
      config
    );
  });

  // 2. 保存到状态
  setBatchState({
    id: crypto.randomUUID(),
    items: videoItems,
    total: videoItems.length,
    completed: 0,
    failed: 0,
    pending: videoItems.length,
    status: 'processing',
    startedAt: Date.now()
  });

  // 3. 开始生成
  for (const item of videoItems) {
    await generateVideoItem(item);
  }
};
```

### 2. 单个视频生成

```typescript
const generateVideoItem = async (item: VideoItem) => {
  try {
    // 1. 更新状态为生成中
    updateVideoItemStatus(item.id, 'generating');

    // 2. 调用视频生成API
    const result = await videoService.createVideo(
      item.videoPrompt,
      {
        model: item.model,
        aspect_ratio: item.aspectRatio,
        duration: item.duration,
        hd: item.hd
      }
    );

    // 3. 轮询任务状态
    const videoUrl = await pollVideoStatus(result.task_id);

    // 4. 标记为成功
    updateVideoItemStatus(item.id, 'success', { videoUrl });

  } catch (error) {
    // 5. 处理失败
    if (item.retryCount < item.maxRetries) {
      // 重试
      item.retryCount++;
      item.lastRetryAt = Date.now();
      await generateVideoItem(item);
    } else {
      // 标记为失败
      updateVideoItemStatus(item.id, 'failed', {
        errorMessage: error.message
      });
    }
  }
};
```

### 3. 视频下载

```typescript
const handleDownloadVideo = async (itemId: string) => {
  const item = batchState.items.find(i => i.id === itemId);
  if (!item || !item.videoUrl) return;

  try {
    setDownloadingId(itemId);
    await downloadManager.downloadVideo(
      item.videoUrl,
      item.sceneId,
      (progress) => {
        setDownloadProgress(prev => ({
          ...prev,
          [itemId]: progress
        }));
      }
    );
    showNotification('下载成功', 'success');
  } catch (error) {
    showNotification('下载失败: ' + error.message, 'error');
  } finally {
    setDownloadingId(null);
  }
};
```

## UI 设计

### 视频卡片布局

```
┌─────────────────────────────────────┐
│ SC-01 ✓                             │  <- 场景ID + 状态图标
├─────────────────────────────────────┤
│                                     │
│         [视频预览/占位符]           │
│                                     │
├─────────────────────────────────────┤
│ 提示词: 一个年轻女性在咖啡馆...    │  <- 提示词摘要
├─────────────────────────────────────┤
│ [下载] [重新生成] [详情]            │  <- 操作按钮
└─────────────────────────────────────┘
```

### 状态指示器

```
✓ 成功 (绿色)
⏳ 生成中 (蓝色)
✗ 失败 (红色)
⏸ 待处理 (灰色)
```

## 错误处理

### 场景 1: 视频生成失败

```typescript
if (error instanceof VideoGenerationError) {
  // 记录错误
  console.error('Video generation failed:', error);
  
  // 更新状态
  updateVideoItemStatus(item.id, 'failed', {
    errorMessage: error.message
  });
  
  // 显示通知
  showNotification(
    `场景 ${item.sceneId} 生成失败: ${error.message}`,
    'error'
  );
}
```

### 场景 2: 下载失败

```typescript
if (error instanceof DownloadError) {
  // 记录错误
  console.error('Download failed:', error);
  
  // 显示通知
  showNotification(
    `下载失败: ${error.message}`,
    'error'
  );
  
  // 提供重试选项
  showRetryDialog();
}
```

## 测试策略

### 单元测试

1. **VideoStatusManager 测试**
   - 创建视频项
   - 更新视频项状态
   - 标记为成功/失败

2. **VideoDownloadManager 测试**
   - 生成文件名
   - 下载视频文件
   - 处理下载错误

3. **批量生成逻辑测试**
   - 初始化批量生成
   - 生成单个视频
   - 处理重试

### 集成测试

1. **端到端批量生成**
   - 输入多个提示词
   - 生成视频
   - 验证结果

2. **下载功能**
   - 生成视频
   - 下载视频
   - 验证文件

## 正确性属性

### 属性 1: 场景ID唯一性

**对于任何** 批量生成的视频集合，每个视频 **应该** 有唯一的场景ID

**验证**: Requirements 1.1

### 属性 2: 失败定位准确性

**对于任何** 失败的视频，系统 **应该** 清晰显示失败的场景ID和错误信息

**验证**: Requirements 1.2

### 属性 3: 视频提示词对应

**对于任何** 生成的视频，系统 **应该** 保持视频和提示词的一一对应关系

**验证**: Requirements 2.1, 2.2

### 属性 4: 下载文件完整性

**对于任何** 下载的视频，系统 **应该** 完整下载视频文件到本地

**验证**: Requirements 3.1, 3.2

### 属性 5: 状态一致性

**对于任何** 视频项，系统 **应该** 保持状态、进度和UI显示的一致性

**验证**: Requirements 1.5, 4.1

### 属性 6: 数据持久化

**对于任何** 生成的视频，系统 **应该** 将其信息保存到本地存储

**验证**: Requirements 5.1, 5.2

