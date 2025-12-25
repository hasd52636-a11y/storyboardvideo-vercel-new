# 🔧 前端 Bug 修复方案

**分析时间**: 2025年12月25日  
**问题**: API 成功但前端显示失败

---

## 问题根源分析

### 发现的问题

#### 1. ✅ videoService.ts 中的轮询逻辑 - 基本正确

```typescript
// 轮询配置
const timeoutMs: number = 30 * 60 * 1000  // 30 分钟超时
let pollInterval = 2000                    // 初始 2 秒
const maxInterval = 8000                   // 最大 8 秒
const backoffMultiplier = 2                // 指数退避

// 状态检查
if (status.status === 'SUCCESS') {
  if (status.video_url) {
    onComplete(status.video_url);
  } else {
    onError(new Error('Video generated but URL not found'));
  }
}
```

**问题**: 
- ❌ 轮询间隔从 2 秒开始太快
- ❌ 最大间隔 8 秒不够长
- ❌ 30 分钟超时对于 49 分钟的任务不够

#### 2. ❌ VideoGenDialog.tsx 中的问题

```typescript
// 问题 1: 没有加载分镜的提示词
const buildStructuredPrompt = () => {
  // 只提取了动作和运镜，没有完整的提示词
  // 应该使用 getOptimizedPrompts() 的逻辑
}

// 问题 2: 没有传递图片
// 生成视频时没有传递选中的分镜图片
await onGenerate(promptToUse, {
  model,
  aspect_ratio: aspectRatio,
  duration,
  hd
  // ❌ 缺少 images 参数
});
```

#### 3. ❌ App.tsx 中的视频生成处理

```typescript
// 需要检查:
- 是否正确处理了 videoService 的回调
- 是否正确更新了 videoItems 状态
- 是否正确显示了视频 URL
```

---

## 修复方案

### 修复 1: 优化轮询参数

**文件**: `videoService.ts`

```typescript
startPolling(
  taskId: string,
  onProgress: (status: VideoStatus) => void,
  onComplete: (videoUrl: string) => void,
  onError: (error: Error) => void,
  timeoutMs: number = 60 * 60 * 1000  // ✅ 改为 60 分钟
): void {
  let pollInterval = 5000;              // ✅ 改为 5 秒
  const maxInterval = 15000;            // ✅ 改为 15 秒
  const backoffMultiplier = 1.5;        // ✅ 改为 1.5 倍
  
  // ... 其余代码
}
```

**原因**:
- Sora2 API 处理时间长（~49 分钟）
- 轮询太频繁会浪费资源
- 需要更长的超时时间

---

### 修复 2: 完善 VideoGenDialog 提示词

**文件**: `components/VideoGenDialog.tsx`

```typescript
// 导入 getOptimizedPrompts 逻辑
const buildStructuredPrompt = () => {
  if (selectedFrames.length === 0) return prompt;

  // ✅ 使用完整的提示词格式（与预览提示词相同）
  let globalInstr = `【全局指令】必须按照以下规则生成视频：
1、禁止将参考图写入画面，按照参考图标注的序号生成视频
2、保持写实摄影风格
3、16:9画幅
【限制性指令】禁止闪烁，严禁背景形变，保持角色一致性。
单一连续电影镜头，沉浸式360度环境，无分屏，无边框，无分镜布局，无UI
【约束条件】不修改参考主体特征 | 保持视觉连续性 | 严格按编号顺序`;

  const scenesPrompt = selectedFrames.map((frame, index) => {
    const sceneNum = `SC-${String(index + 1).padStart(2, '0')}`;
    return `【${sceneNum}】\n${frame.prompt}`;
  }).join('\n\n');

  return `${globalInstr}\n\n${scenesPrompt}`;
};

// ✅ 传递图片 URL
const handleGenerate = async () => {
  const promptToUse = customPrompt.trim() || finalPrompt;
  
  // ✅ 提取选中分镜的图片 URL
  const imageUrls = selectedFrames.map(frame => frame.imageUrl).filter(Boolean);

  setIsLoading(true);
  try {
    await onGenerate(promptToUse, {
      model,
      aspect_ratio: aspectRatio,
      duration,
      hd,
      images: imageUrls  // ✅ 添加图片
    });
  } finally {
    setIsLoading(false);
  }
};
```

---

### 修复 3: 改进 App.tsx 中的视频生成处理

**文件**: `App.tsx`

```typescript
// 在处理视频生成时添加详细日志
const handleVideoGenerate = async (prompt: string, options: any) => {
  try {
    console.log('🎬 开始生成视频');
    console.log('提示词:', prompt);
    console.log('选项:', options);
    console.log('图片数量:', options.images?.length || 0);

    const videoService = new VideoService({
      apiKey: apiKey,
      baseUrl: 'https://api.sora.com'  // 确保 API 地址正确
    });

    // 创建视频
    const result = await videoService.createVideo(prompt, options);
    console.log('✅ 视频创建成功:', result);

    // 启动轮询
    videoService.startPolling(
      result.task_id,
      (status) => {
        console.log('📊 进度更新:', status.progress, status.status);
        // 更新 UI
        setVideoItems(prev => prev.map(item =>
          item.id === result.task_id
            ? { ...item, progress: status.progress, status: status.status }
            : item
        ));
      },
      (videoUrl) => {
        console.log('✅ 视频生成完成:', videoUrl);
        // 更新视频 URL
        setVideoItems(prev => prev.map(item =>
          item.id === result.task_id
            ? { ...item, videoUrl, status: 'SUCCESS', progress: '100%' }
            : item
        ));
      },
      (error) => {
        console.error('❌ 视频生成失败:', error);
        // 显示错误
        setVideoItems(prev => prev.map(item =>
          item.id === result.task_id
            ? { ...item, status: 'FAILURE', error: error.message }
            : item
        ));
      }
    );

  } catch (error) {
    console.error('❌ 视频生成错误:', error);
  }
};
```

---

### 修复 4: 改进导出分镜图功能

**文件**: `App.tsx` - `handleExportJPEG` 函数

```typescript
// 问题: Canvas 被污染导致图片无法导出
// 解决方案: 改进 CORS 处理

const loadAndDrawImage = async (url: string, x: number, y: number, w: number, h: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    
    // ✅ 改进 CORS 处理
    if (!url.startsWith('data:')) {
      img.crossOrigin = "anonymous";
    }
    
    // ✅ 增加超时时间
    const timeout = setTimeout(() => {
      console.warn(`⏱️ 图片加载超时: ${url.substring(0, 50)}`);
      resolve(false);
    }, 30000);  // ✅ 改为 30 秒
    
    img.onload = () => {
      clearTimeout(timeout);
      try {
        ctx.drawImage(img, x, y, w, h);
        console.log(`✅ 图片绘制成功`);
        resolve(true);
      } catch (e) {
        console.error('❌ Canvas 污染错误:', e);
        resolve(false);
      }
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      console.warn(`⚠️ 图片加载失败`);
      // ✅ 尝试不使用 CORS 重新加载
      const fallbackImg = new Image();
      fallbackImg.crossOrigin = null;
      
      fallbackImg.onload = () => {
        try {
          ctx.drawImage(fallbackImg, x, y, w, h);
          console.log('✅ 备用图片绘制成功');
          resolve(true);
        } catch (fallbackError) {
          console.error('❌ 备用绘制失败:', fallbackError);
          resolve(false);
        }
      };
      
      fallbackImg.onerror = () => {
        console.error('❌ 备用图片加载失败');
        resolve(false);
      };
      
      fallbackImg.src = url;
    };
    
    img.src = url;
  });
};
```

---

### 修复 5: 改进批量重绘功能

**文件**: `components/BatchRedrawDialog.tsx`

```typescript
// 问题: 只重绘了第一张图
// 解决方案: 修复循环逻辑

const handleBatchRedraw = async () => {
  if (selectedItems.length === 0) return;

  setIsProcessing(true);
  
  try {
    // ✅ 遍历所有选中的图片
    for (const item of selectedItems) {
      console.log(`🔄 重绘第 ${selectedItems.indexOf(item) + 1}/${selectedItems.length} 张`);
      
      // 获取提示词
      const promptToUse = customPrompt || item.prompt;
      
      // 重绘
      await onRedraw(item.id, promptToUse);
      
      // 添加延迟避免 API 限流
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('✅ 批量重绘完成');
  } catch (error) {
    console.error('❌ 批量重绘失败:', error);
  } finally {
    setIsProcessing(false);
  }
};
```

---

## 修复优先级

| 优先级 | 修复项 | 影响 | 工作量 |
|--------|--------|------|--------|
| 🔴 高 | 轮询参数优化 | 视频生成超时 | 小 |
| 🔴 高 | 视频生成提示词 | 功能不完整 | 中 |
| 🔴 高 | 视频 URL 处理 | 视频无法显示 | 中 |
| 🟡 中 | 导出分镜图 CORS | 导出功能失败 | 中 |
| 🟡 中 | 批量重绘逻辑 | 批量操作失败 | 小 |

---

## 测试清单

修复后需要测试:

- [ ] 生成视频能否正确提交多张图片
- [ ] 轮询能否正确处理 49 分钟的长任务
- [ ] 视频 URL 能否正确获取和显示
- [ ] 导出分镜图能否正确显示图片
- [ ] 批量重绘能否重绘所有选中的图片
- [ ] 提示词逻辑是否与预览提示词一致

---

## 关键代码位置

| 问题 | 文件 | 行号 | 修复内容 |
|------|------|------|---------|
| 轮询参数 | videoService.ts | ~180 | 增加超时，调整间隔 |
| 提示词 | VideoGenDialog.tsx | ~40 | 使用完整提示词格式 |
| 图片传递 | VideoGenDialog.tsx | ~70 | 添加 images 参数 |
| 视频处理 | App.tsx | ~1200 | 添加日志和错误处理 |
| CORS 处理 | App.tsx | ~1400 | 改进图片加载逻辑 |
| 批量重绘 | BatchRedrawDialog.tsx | ~50 | 修复循环逻辑 |

---

## 预期效果

修复后:

✅ 视频生成能正确处理 49 分钟的长任务  
✅ 视频 URL 能正确获取和显示  
✅ 导出分镜图能正确显示所有图片  
✅ 批量重绘能重绘所有选中的图片  
✅ 提示词逻辑与预览提示词一致  

---

**修复完成后需要重新部署到 Vercel**

```bash
vercel --prod
```

---

**分析完成**: 2025-12-25  
**建议**: 立即实施这些修复
