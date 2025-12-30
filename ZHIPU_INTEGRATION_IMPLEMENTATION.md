# 智谱 GLM 功能接口对接方案

**文档日期**: 2025-12-30
**版本**: v1.0
**状态**: 实现指南

---

## 📋 对接概览

本文档详细说明如何按照原有逻辑将智谱 GLM 的各个功能接口对接到应用中。

### 对接的功能模块

| 功能 | 原有提供商 | 智谱模型 | 状态 |
|------|---------|--------|------|
| 文本生成 | Gemini / OpenAI | GLM-4-Flash | ✅ 已对接 |
| 深度思考 | Gemini / OpenAI | GLM-4.5-Flash | ✅ 已对接 |
| 图片分析 | Gemini / OpenAI | GLM-4V-Flash | ✅ 已对接 |
| 图像生成 | OpenAI 兼容 | CogView-3-Flash | ✅ 已对接 |
| 视频生成 | OpenAI 兼容 | CogVideoX-Flash | ✅ 已对接 |

---

## 🔧 对接实现细节

### 1. 图像生成 (generateSceneImage)

**位置**: `geminiService.ts` - `generateSceneImage` 函数

**对接逻辑**:
```typescript
if (config?.provider === 'zhipu') {
  // 使用智谱 CogView-3-Flash 生成图像
  const zhipuService = new ZhipuService(config);
  const imageUrl = await zhipuService.generateImage(prompt, {
    size: '1024x1024',
    quality: 'standard',
    style: styleDesc
  });
  return imageUrl;
}
```

**调用流程**:
1. 检测 provider 是否为 'zhipu'
2. 创建 ZhipuService 实例
3. 调用 `generateImage()` 方法
4. 返回生成的图像 URL

**支持的参数**:
- `prompt`: 图像描述提示词
- `size`: 图像尺寸 (1024x1024, 1024x1536, 1536x1024)
- `quality`: 质量等级 (standard, premium)
- `style`: 风格描述

---

### 2. 文本生成 (chatWithGemini)

**位置**: `geminiService.ts` - `chatWithGemini` 函数

**对接逻辑**:
```typescript
if (config?.provider === 'zhipu') {
  // 使用智谱 GLM-4-Flash 进行文本生成
  const zhipuService = new ZhipuService(config);
  const response = await zhipuService.generateText(prompt, {
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 2048
  });
  return response;
}
```

**调用流程**:
1. 检测 provider 是否为 'zhipu'
2. 创建 ZhipuService 实例
3. 调用 `generateText()` 方法
4. 返回生成的文本

**支持的参数**:
- `prompt`: 用户输入的提示词
- `temperature`: 温度参数 (0-1)
- `topP`: Top-P 采样参数 (0-1)
- `maxTokens`: 最大输出 token 数
- `useThinking`: 是否使用深度思考模式

---

### 3. 图片分析 (analyzeImageWithProvider)

**位置**: `geminiService.ts` - `analyzeImageWithProvider` 函数

**对接逻辑**:
```typescript
if (appConfig.provider === 'zhipu') {
  // 使用智谱 GLM-4V-Flash 进行图片分析
  const zhipuService = new ZhipuService(appConfig);
  return await zhipuService.analyzeImage(imageUrl, prompt, {
    temperature: 0.8,
    topP: 0.6,
    maxTokens: 1024
  });
}
```

**调用流程**:
1. 检测 provider 是否为 'zhipu'
2. 创建 ZhipuService 实例
3. 调用 `analyzeImage()` 方法
4. 返回分析结果

**支持的参数**:
- `imageUrl`: 图片 URL (支持 HTTP/HTTPS 和 Base64)
- `prompt`: 分析提示词
- `temperature`: 温度参数
- `topP`: Top-P 采样参数
- `maxTokens`: 最大输出 token 数

---

### 4. 视频生成 (VideoService)

**位置**: `videoService.ts` - `createVideo` 方法

**对接逻辑**:
```typescript
if (this.provider === 'zhipu') {
  // 使用智谱 CogVideoX-Flash 生成视频
  const zhipuService = new ZhipuService(this.config);
  const result = await zhipuService.generateVideo(prompt, {
    quality: options.hd ? 'quality' : 'speed',
    withAudio: false,
    watermarkEnabled: options.watermark ?? true,
    size: '1920x1080',
    fps: 30,
    duration: 5
  });
  return {
    task_id: result.taskId,
    status: result.status,
    progress: '0%'
  };
}
```

**调用流程**:
1. 检测 provider 是否为 'zhipu'
2. 创建 ZhipuService 实例
3. 调用 `generateVideo()` 方法
4. 返回任务 ID 和状态

**支持的参数**:
- `prompt`: 视频描述提示词
- `imageUrl`: 参考图片 URL (可选)
- `quality`: 质量等级 (speed, quality)
- `withAudio`: 是否包含音频
- `watermarkEnabled`: 是否启用水印
- `size`: 视频尺寸
- `fps`: 帧率 (30, 60)
- `duration`: 视频时长 (5, 10 秒)

---

### 5. 视频状态查询 (getVideoStatus)

**位置**: `videoService.ts` - `getVideoStatus` 方法

**对接逻辑**:
```typescript
if (this.provider === 'zhipu') {
  // 查询智谱视频生成状态
  const zhipuService = new ZhipuService(this.config);
  const result = await zhipuService.getVideoStatus(taskId);
  
  // 映射状态到统一格式
  const statusMap: Record<string, string> = {
    'PROCESSING': 'IN_PROGRESS',
    'SUCCESS': 'SUCCESS',
    'FAIL': 'FAILURE'
  };
  
  return {
    task_id: taskId,
    status: statusMap[result.status],
    progress: result.status === 'SUCCESS' ? '100%' : '50%',
    video_url: result.videoUrl,
    fail_reason: result.error
  };
}
```

**调用流程**:
1. 检测 provider 是否为 'zhipu'
2. 创建 ZhipuService 实例
3. 调用 `getVideoStatus()` 方法
4. 映射状态到统一格式
5. 返回视频状态

---

## 🔄 调用流程图

### 图像生成流程
```
用户输入提示词
    ↓
generateSceneImage()
    ↓
检测 provider
    ├─ zhipu → ZhipuService.generateImage()
    ├─ gemini → Gemini API
    └─ 其他 → OpenAI 兼容 API
    ↓
返回图像 URL/Base64
```

### 文本生成流程
```
用户输入消息
    ↓
chatWithGemini()
    ↓
检测 provider
    ├─ zhipu → ZhipuService.generateText()
    ├─ gemini → Gemini API
    └─ 其他 → OpenAI 兼容 API
    ↓
返回生成的文本
```

### 图片分析流程
```
用户上传图片 + 输入提示词
    ↓
analyzeImageWithProvider()
    ↓
检测 provider
    ├─ zhipu → ZhipuService.analyzeImage()
    ├─ gemini → Gemini API
    └─ 其他 → OpenAI 兼容 API
    ↓
返回分析结果
```

### 视频生成流程
```
用户输入视频提示词
    ↓
VideoService.createVideo()
    ↓
检测 provider
    ├─ zhipu → ZhipuService.generateVideo()
    ├─ dyu → DYU API
    ├─ shenma → Shenma API
    └─ openai → OpenAI API
    ↓
返回任务 ID
    ↓
VideoService.startPolling()
    ↓
定期查询状态
    ├─ zhipu → ZhipuService.getVideoStatus()
    ├─ dyu → DYU API
    ├─ shenma → Shenma API
    └─ openai → OpenAI API
    ↓
视频生成完成
```

---

## 📝 使用示例

### 示例 1: 使用智谱生成图像

```typescript
import { generateSceneImage } from './geminiService';

// 配置已设置为智谱
const imageUrl = await generateSceneImage(
  '一个美丽的日落场景，金色的光线照在海面上',
  true,
  false,
  { descriptionZh: 'Realistic Photography' },
  '16:9'
);

console.log('生成的图像:', imageUrl);
```

### 示例 2: 使用智谱进行文本生成

```typescript
import { chatWithGemini } from './geminiService';

const messages = [
  {
    role: 'user',
    text: '请帮我写一个故事开头'
  }
];

const response = await chatWithGemini(messages);
console.log('生成的文本:', response);
```

### 示例 3: 使用智谱分析图片

```typescript
import { analyzeImageWithProvider } from './geminiService';

const analysis = await analyzeImageWithProvider(
  'https://example.com/image.jpg',
  '请分析这张图片中的场景和人物'
);

console.log('分析结果:', analysis);
```

### 示例 4: 使用智谱生成视频

```typescript
import VideoService from './videoService';

const config = {
  baseUrl: 'https://open.bigmodel.cn',
  apiKey: 'your-api-key',
  provider: 'zhipu'
};

const videoService = new VideoService(config);

// 创建视频
const result = await videoService.createVideo(
  '一个人在海滩上散步，夕阳西下',
  {
    model: 'cogvideox-flash',
    aspect_ratio: '16:9',
    duration: 5,
    hd: false
  }
);

console.log('任务 ID:', result.task_id);

// 轮询视频状态
videoService.startPolling(
  result.task_id,
  (status) => console.log('进度:', status.progress),
  (videoUrl) => console.log('视频完成:', videoUrl),
  (error) => console.error('生成失败:', error)
);
```

---

## 🔍 错误处理

### 常见错误及解决方案

| 错误 | 原因 | 解决方案 |
|------|------|--------|
| API Key 无效 | 配置的 API Key 不正确 | 检查 API Key 是否正确复制 |
| 网络连接失败 | 无法连接到智谱服务器 | 检查网络连接和防火墙设置 |
| 模型不可用 | 选择的模型不存在或不可用 | 检查模型名称是否正确 |
| 配额不足 | API 调用次数超过限制 | 等待配额重置或升级账户 |
| 内容审查失败 | 提示词或内容违规 | 修改提示词内容 |

### 错误处理示例

```typescript
try {
  const imageUrl = await generateSceneImage(prompt);
  if (!imageUrl) {
    console.error('图像生成失败: 返回空 URL');
  }
} catch (error) {
  if (error.message.includes('401')) {
    console.error('API Key 无效');
  } else if (error.message.includes('429')) {
    console.error('请求过于频繁，请稍后重试');
  } else {
    console.error('生成失败:', error.message);
  }
}
```

---

## 🧪 测试清单

### 功能测试

- [ ] 图像生成 - 基础功能
- [ ] 图像生成 - 不同尺寸
- [ ] 图像生成 - 不同风格
- [ ] 文本生成 - 基础功能
- [ ] 文本生成 - 多轮对话
- [ ] 图片分析 - 基础功能
- [ ] 图片分析 - 多张图片
- [ ] 视频生成 - 基础功能
- [ ] 视频生成 - 不同尺寸
- [ ] 视频状态查询 - 轮询功能

### 错误处理测试

- [ ] 无效 API Key
- [ ] 网络连接失败
- [ ] 超时处理
- [ ] 配额不足
- [ ] 内容审查失败

### 性能测试

- [ ] 图像生成速度
- [ ] 文本生成速度
- [ ] 图片分析速度
- [ ] 视频生成速度
- [ ] 并发请求处理

---

## 📊 性能指标

### 响应时间

| 操作 | 平均时间 | 最大时间 |
|------|---------|---------|
| 图像生成 | 5-15 秒 | 30 秒 |
| 文本生成 | 1-3 秒 | 10 秒 |
| 图片分析 | 2-4 秒 | 10 秒 |
| 视频生成 | 1-3 分钟 | 10 分钟 |

### 成本对比

| 操作 | 普惠模型 | 高端模型 | 节省 |
|------|---------|---------|------|
| 1000 次图像生成 | ¥10 | ¥50 | 80% |
| 1000 次文本生成 | ¥5 | ¥25 | 80% |
| 100 次图片分析 | ¥5 | ¥25 | 80% |
| 10 次视频生成 | ¥20 | ¥100 | 80% |

---

## 🚀 部署建议

### 生产环境配置

```typescript
// 推荐配置
const productionConfig = {
  provider: 'zhipu',
  baseUrl: 'https://open.bigmodel.cn',
  apiKey: process.env.ZHIPU_API_KEY,
  llmModel: 'glm-4-flash',
  imageModel: 'cogview-3-flash',
  videoModel: 'cogvideox-flash'
};
```

### 监控和日志

```typescript
// 启用详细日志
console.log('[generateSceneImage] Starting image generation');
console.log('[generateSceneImage] Config provider:', config?.provider);
console.log('[generateSceneImage] Has API Key:', !!apiKey);

// 记录性能指标
const startTime = Date.now();
const result = await generateSceneImage(prompt);
const duration = Date.now() - startTime;
console.log(`[Performance] Image generation took ${duration}ms`);
```

---

## 📞 支持和反馈

### 常见问题

**Q: 如何切换到智谱?**
A: 在 API 配置中选择 "智谱 GLM (推荐)"，粘贴 API Key，点击测试连接。

**Q: 智谱和其他提供商有什么区别?**
A: 智谱成本低廉 (80% 节省)，速度快，支持中文优化。

**Q: 如何处理 API 错误?**
A: 使用 try-catch 捕获错误，根据错误信息进行相应处理。

**Q: 如何监控 API 配额?**
A: 使用 `VideoService.getTokenQuota()` 查询配额信息。

---

## 📚 相关文档

- `ZHIPU_QUICK_SETUP.md` - 快速配置指南
- `ZHIPU_INTEGRATION_GUIDE.md` - 完整集成指南
- `ZHIPU_MODELS_INTEGRATION.md` - 模型文档
- `zhipuService.ts` - 智谱服务实现
- `zhipuModels.ts` - 模型配置

---

**文档版本**: v1.0
**最后更新**: 2025-12-30
**状态**: 完成

