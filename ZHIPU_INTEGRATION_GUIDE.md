# 智谱 GLM 集成指南

## 概述

本应用已完整集成智谱 GLM 的以下能力：

### 1. **GLM-4.6V 多模态图片分析**
- 支持图片理解和内容分析
- 可用于场景识别、内容描述、视觉元素提取
- 支持 Base64 和 URL 两种图片格式

### 2. **CogVideoX-3 视频生成**
- 文本转视频（Text-to-Video）
- 图像转视频（Image-to-Video）
- 支持多种分辨率和帧率
- 异步生成，支持轮询查询结果

---

## 快速开始

### 第 1 步：获取 API Key

1. 访问 [智谱开放平台](https://open.bigmodel.cn/usercenter/apikeys)
2. 登录或注册账户
3. 创建新的 API Key
4. 复制 API Key（格式通常为 `sk-...`）

### 第 2 步：在应用中配置

1. 打开应用的 **API 接口配置** 对话框
2. 选择 **智谱 GLM (推荐)** 作为服务商
3. 点击 **👉 点击获取 API Key** 按钮（会打开新标签页）
4. 将 API Key 粘贴到输入框
5. 点击 **✨ 测试连接** 按钮验证配置
6. 看到 ✅ 连接成功提示后，配置完成

### 第 3 步：开始使用

配置完成后，应用会自动使用智谱的能力：

- **图片分析**：上传参考图片时，系统会使用 GLM-4.6V 进行分析
- **视频生成**：生成视频时，系统会使用 CogVideoX-3 进行生成

---

## 功能详解

### GLM-4.6V 多模态分析

#### 支持的操作

1. **图片内容分析**
   ```
   输入：图片 URL 或 Base64
   输出：图片内容描述、场景分析、视觉元素提取
   ```

2. **场景理解**
   - 识别图片中的人物、物体、场景
   - 分析光线、色彩、构图
   - 提取视觉风格特征

3. **提示词生成**
   - 基于图片生成详细的视觉描述
   - 用于后续的图片生成或视频生成

#### 使用示例

```typescript
import { analyzeImageWithProvider } from './geminiService';

const imageUrl = 'https://example.com/image.jpg';
const prompt = '描述这张图片中的场景、人物和光线效果';

const analysis = await analyzeImageWithProvider(imageUrl, prompt);
console.log(analysis);
// 输出：详细的图片分析结果
```

### CogVideoX-3 视频生成

#### 支持的模式

1. **文本转视频**
   - 输入：文本提示词
   - 输出：生成的视频

2. **图像转视频**
   - 输入：参考图片 + 文本提示词
   - 输出：基于图片的视频

#### 配置参数

| 参数 | 说明 | 可选值 | 默认值 |
|------|------|--------|--------|
| `quality` | 生成质量 | `speed`, `quality` | `speed` |
| `size` | 视频分辨率 | `1280x720`, `720x1280`, `1024x1024`, `1920x1080`, `1080x1920`, `2048x1080`, `3840x2160` | `1920x1080` |
| `fps` | 帧率 | `30`, `60` | `30` |
| `duration` | 视频时长 | `5`, `10` | `5` |
| `with_audio` | 是否生成音效 | `true`, `false` | `false` |
| `watermark_enabled` | 是否添加水印 | `true`, `false` | `true` |

#### 使用示例

```typescript
import ZhipuService from './zhipuService';

const config = {
  apiKey: 'your-api-key',
  baseUrl: 'https://open.bigmodel.cn',
  llmModel: 'glm-4.6v',
  imageModel: 'glm-4.6v',
  provider: 'zhipu'
};

const zhipuService = new ZhipuService(config);

// 文本转视频
const result = await zhipuService.generateVideo(
  'A cat is playing with a ball in a sunny garden',
  {
    quality: 'quality',
    size: '1920x1080',
    fps: 30,
    duration: 5,
    withAudio: true
  }
);

console.log('Task ID:', result.taskId);
console.log('Status:', result.status);

// 查询视频生成结果
const status = await zhipuService.getVideoStatus(result.taskId);
console.log('Video URL:', status.videoUrl);
```

---

## 集成架构

### 文件结构

```
├── zhipuService.ts              # 智谱 API 服务类
├── videoService.ts              # 视频服务（支持多个提供商）
├── geminiService.ts             # 通用图片分析服务
├── types.ts                     # 类型定义
└── components/
    └── APIConfigDialog.tsx      # API 配置对话框
```

### 核心类

#### ZhipuService

```typescript
class ZhipuService {
  // 视频生成
  generateVideo(prompt, options): Promise<{taskId, status}>
  
  // 查询视频状态
  getVideoStatus(taskId): Promise<{status, videoUrl, error}>
  
  // 图片分析
  analyzeImage(imageUrl, prompt, options): Promise<string>
  
  // 轮询管理
  startPolling(taskId, onProgress, onComplete, onError)
  stopPolling(taskId)
  
  // 连接测试
  testConnection(): Promise<boolean>
}
```

#### VideoService

```typescript
class VideoService {
  // 支持的提供商：'openai' | 'dyu' | 'shenma' | 'zhipu'
  setProvider(provider): void
  
  // 创建视频（自动路由到对应提供商）
  createVideo(prompt, options): Promise<{task_id, status, progress}>
  
  // 查询视频状态
  getVideoStatus(taskId): Promise<VideoStatus>
  
  // 启动轮询
  startPolling(taskId, onProgress, onComplete, onError)
}
```

---

## 配置说明

### 环境变量

可选：在 `.env.local` 中配置默认的智谱 API Key

```env
VITE_ZHIPU_API_KEY=your-api-key-here
```

### 本地存储

配置会自动保存到浏览器本地存储：

```javascript
// API Key 保存位置
localStorage.getItem('sora_api_key_zhipu')

// 提供商选择
localStorage.getItem('video_api_provider')
```

---

## 常见问题

### Q1: API Key 在哪里获取？

A: 访问 [智谱开放平台](https://open.bigmodel.cn/usercenter/apikeys)，登录后在 API 密钥管理页面创建新的 API Key。

### Q2: 支持哪些图片格式？

A: GLM-4.6V 支持以下格式：
- JPEG
- PNG
- WebP
- GIF

### Q3: 视频生成需要多长时间？

A: 取决于选择的质量模式：
- `speed` 模式：通常 1-3 分钟
- `quality` 模式：通常 3-10 分钟

### Q4: 如何切换提供商？

A: 在 API 配置对话框中选择不同的提供商，系统会自动切换。

### Q5: API Key 是否安全？

A: 是的，API Key 只保存在你的浏览器本地存储中，不会上传到任何服务器。

### Q6: 支持离线使用吗？

A: 不支持。所有 API 调用都需要网络连接。

---

## 错误处理

### 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|--------|
| `401 Unauthorized` | API Key 无效 | 检查 API Key 是否正确复制 |
| `403 Forbidden` | 无权限访问 | 检查账户是否有权限使用该 API |
| `429 Too Many Requests` | 请求过于频繁 | 等待一段时间后重试 |
| `500 Internal Server Error` | 服务器错误 | 稍后重试 |

### 调试

启用浏览器控制台查看详细日志：

```javascript
// 查看所有智谱服务日志
console.log('[ZhipuService]')

// 查看视频服务日志
console.log('[Video Polling]')
```

---

## 性能优化

### 建议

1. **使用 `speed` 模式进行快速测试**
   - 生成速度快，成本低
   - 适合原型开发和测试

2. **使用 `quality` 模式生成最终内容**
   - 生成质量高
   - 适合最终输出

3. **合理设置轮询间隔**
   - 初始间隔：3 秒
   - 最大间隔：15 秒
   - 自动指数退避

4. **缓存分析结果**
   - 避免重复分析相同的图片
   - 减少 API 调用次数

---

## 更新日志

### v1.0.0 (2025-01-01)

- ✅ 集成 GLM-4.6V 多模态图片分析
- ✅ 集成 CogVideoX-3 视频生成
- ✅ 支持异步视频生成和轮询
- ✅ 完整的错误处理和日志记录
- ✅ API 配置对话框支持智谱

---

## 技术支持

- 官方文档：https://open.bigmodel.cn/dev/api
- API 状态：https://open.bigmodel.cn/status
- 社区论坛：https://open.bigmodel.cn/community

---

## 许可证

本集成遵循应用的原始许可证。

智谱 API 的使用受 [智谱服务条款](https://open.bigmodel.cn/terms) 约束。
