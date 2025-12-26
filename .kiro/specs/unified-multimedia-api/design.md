# 统一多媒体 API 集成 - 设计文档

## 1. 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                     应用层（UI/Components）                  │
├─────────────────────────────────────────────────────────────┤
│  API 配置界面 │ 文生图界面 │ 图生图界面 │ 文本界面 │ 视频界面 │
├─────────────────────────────────────────────────────────────┤
│                    API 路由层（/api/multimedia/）            │
├─────────────────────────────────────────────────────────────┤
│                   MultiMediaService（业务逻辑）              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ - 路由请求到相应提供商                               │   │
│  │ - 统一请求/响应格式转换                              │   │
│  │ - 错误处理和重试机制                                 │   │
│  │ - 配置管理                                           │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    提供商适配器层                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ OpenAIAdapter│  │  DYUAdapter  │  │ShenmaAdapter │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
├─────────────────────────────────────────────────────────────┤
│                    外部 API 服务                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  OpenAI API  │  │   DYU API    │  │ Shenma API   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 2. 核心组件设计

### 2.1 MultiMediaService

```typescript
/**
 * 统一多媒体服务
 * 负责：
 * 1. 根据配置路由请求到相应提供商
 * 2. 统一请求/响应格式
 * 3. 错误处理和重试
 * 4. 配置管理
 */
class MultiMediaService {
  private configManager: APIConfigManager;
  private adapters: Map<string, IMediaAdapter>;
  private logger: Logger;

  // 文生图
  async generateImage(request: TextToImageRequest): Promise<GenerationResponse>;
  
  // 图生图
  async editImage(request: ImageEditRequest): Promise<GenerationResponse>;
  
  // 文本生成
  async generateText(request: TextGenerationRequest): Promise<GenerationResponse>;
  
  // 图片分析
  async analyzeImage(request: ImageAnalysisRequest): Promise<GenerationResponse>;
  
  // 视频生成
  async generateVideo(request: VideoGenerationRequest): Promise<GenerationResponse>;
  
  // 视频分析
  async analyzeVideo(request: VideoAnalysisRequest): Promise<GenerationResponse>;
  
  // 配置管理
  async getConfig(): Promise<MultiMediaConfig>;
  async updateConfig(config: MultiMediaConfig): Promise<void>;
  async syncConfig(provider: string): Promise<void>;
}
```

### 2.2 提供商适配器接口

```typescript
/**
 * 媒体适配器接口
 * 所有提供商适配器必须实现此接口
 */
interface IMediaAdapter {
  name: string;
  isAvailable(): Promise<boolean>;
  
  // 文生图
  generateImage?(request: TextToImageRequest): Promise<GenerationResponse>;
  
  // 图生图
  editImage?(request: ImageEditRequest): Promise<GenerationResponse>;
  
  // 文本生成
  generateText?(request: TextGenerationRequest): Promise<GenerationResponse>;
  
  // 图片分析
  analyzeImage?(request: ImageAnalysisRequest): Promise<GenerationResponse>;
  
  // 视频生成
  generateVideo?(request: VideoGenerationRequest): Promise<GenerationResponse>;
  
  // 视频分析
  analyzeVideo?(request: VideoAnalysisRequest): Promise<GenerationResponse>;
}
```

### 2.3 提供商支持矩阵

```typescript
/**
 * 提供商功能支持矩阵
 * 用于确定每个功能应该使用哪个提供商
 */
interface ProviderCapabilities {
  openai: {
    textToImage: true;      // DALL-E
    imageToImage: true;     // DALL-E Edits
    textGeneration: true;   // GPT 系列
    imageAnalysis: true;    // GPT-4V
    videoGeneration: false;
    videoAnalysis: false;
  };
  zhipu: {
    textToImage: true;      // 文生图
    imageToImage: false;
    textGeneration: true;   // 对话
    imageAnalysis: false;
    videoGeneration: true;  // 可提供但未配置
    videoAnalysis: false;
  };
  shenma: {
    textToImage: true;      // Nano-banana
    imageToImage: true;     // Nano-banana Edits
    textGeneration: true;   // Chat API
    imageAnalysis: true;    // Vision
    videoGeneration: true;  // Sora2（推荐，已验证）
    videoAnalysis: true;    // Gemini Video
  };
  dayuyu: {
    textToImage: false;
    imageToImage: false;
    textGeneration: false;
    imageAnalysis: false;
    videoGeneration: true;  // 视频生成（可选，待测试）
    videoAnalysis: false;
  };
  custom: {
    textToImage: true;      // 支持自定义
    imageToImage: true;     // 支持自定义
    textGeneration: true;   // 支持自定义
    imageAnalysis: true;    // 支持自定义
    videoGeneration: true;  // 支持自定义
    videoAnalysis: true;    // 支持自定义
  };
  gemini: {
    textToImage: true;      // 后期开发
    imageToImage: true;     // 后期开发
    textGeneration: true;   // 后期开发
    imageAnalysis: true;    // 后期开发
    videoGeneration: true;  // 后期开发
    videoAnalysis: true;    // 后期开发
  };
}
```

### 2.3 ShenmaAPIAdapter

```typescript
/**
 * Shenma API 适配器
 * 实现所有多媒体功能
 */
class ShenmaAPIAdapter implements IMediaAdapter {
  name = 'Shenma';
  private apiKey: string;
  private baseUrl: string = 'https://api.whatai.cc';
  private timeout: number = 30000;

  constructor(config: APIProviderConfig);

  async isAvailable(): Promise<boolean>;

  // 文生图：POST /v1/images/generations
  async generateImage(request: TextToImageRequest): Promise<GenerationResponse>;

  // 图生图：POST /v1/images/edits
  async editImage(request: ImageEditRequest): Promise<GenerationResponse>;

  // 文本生成：POST /v1/chat/completions
  async generateText(request: TextGenerationRequest): Promise<GenerationResponse>;

  // 图片分析：POST /v1/chat/completions (with image_url)
  async analyzeImage(request: ImageAnalysisRequest): Promise<GenerationResponse>;

  // 视频生成：POST /v1/chat/completions (Sora2 model)
  async generateVideo(request: VideoGenerationRequest): Promise<GenerationResponse>;

  // 视频分析：POST /v1/chat/completions (with video_url)
  async analyzeVideo(request: VideoAnalysisRequest): Promise<GenerationResponse>;

  private buildHeaders(contentType?: string): HeadersInit;
  private handleError(error: any): AppError;
}
```

### 2.4 APIConfigManager

```typescript
/**
 * API 配置管理器
 * 负责：
 * 1. 配置的持久化
 * 2. 配置的验证
 * 3. 配置的同步
 */
class APIConfigManager {
  private db: Database;
  private cache: Map<string, MultiMediaConfig>;

  // 获取配置
  async getConfig(userId: number): Promise<MultiMediaConfig>;

  // 更新配置
  async updateConfig(userId: number, config: MultiMediaConfig): Promise<void>;

  // 同步配置（一键同步）
  async syncConfig(userId: number, provider: string): Promise<void>;

  // 验证配置
  async validateConfig(config: MultiMediaConfig): Promise<ValidationResult>;

  // 获取提供商状态
  async getProviderStatus(provider: string): Promise<ProviderStatus>;

  private validateAPIKey(provider: string, apiKey: string): Promise<boolean>;
  private persistConfig(userId: number, config: MultiMediaConfig): Promise<void>;
}
```

## 3. 数据流设计

### 3.1 文生图流程

```
用户请求
    ↓
API 端点 (/api/multimedia/text-to-image)
    ↓
MultiMediaService.generateImage()
    ↓
获取配置 → 确定提供商（textToImage provider）
    ↓
获取对应适配器（ShenmaAdapter / OpenAIAdapter）
    ↓
调用适配器的 generateImage()
    ↓
适配器转换请求格式 → 调用外部 API
    ↓
处理响应 → 统一格式
    ↓
返回给用户
```

### 3.2 配置同步流程

```
用户选择 Shenma 提供商
    ↓
输入 API Key
    ↓
点击 "一键同步"
    ↓
APIConfigManager.syncConfig('shenma')
    ↓
验证 API Key 有效性
    ↓
更新所有功能的提供商映射：
  - textToImage: 'shenma'
  - imageToImage: 'shenma'
  - textGeneration: 'shenma'
  - imageAnalysis: 'shenma'
  - videoGeneration: 'shenma'
  - videoAnalysis: 'shenma'
    ↓
保存配置到数据库
    ↓
更新 UI 显示 "✓ 已同步"
```

## 4. 请求/响应格式

### 4.1 文生图

**请求**：
```typescript
interface TextToImageRequest {
  prompt: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '2:3' | '3:2' | '4:5' | '5:4' | '21:9';
  size?: string;  // '1K' | '2K' | '4K' 或 '256x256' | '512x512' | '1024x1024'
  responseFormat?: 'url' | 'b64_json';
  n?: number;     // 1-10
  quality?: 'high' | 'medium' | 'low';
  model?: string; // 可选，指定特定模型
}
```

**响应**：
```typescript
interface GenerationResponse {
  success: boolean;
  data?: {
    images: string[];  // URL 或 base64
    created?: number;
  };
  error?: {
    code: string;
    message: string;
    retryable: boolean;
  };
  metadata?: {
    provider: string;
    model: string;
    tokensUsed?: number;
    duration?: number;
  };
}
```

### 4.2 图生图

**请求**：
```typescript
interface ImageEditRequest {
  prompt: string;
  images: string[];  // URL 或 base64
  mask?: string;     // 可选遮罩
  aspectRatio?: string;
  size?: string;
  responseFormat?: 'url' | 'b64_json';
  n?: number;
  quality?: 'high' | 'medium' | 'low';
  model?: string;
}
```

### 4.3 文本生成

**请求**：
```typescript
interface TextGenerationRequest {
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  responseFormat?: { type: 'json_object' | 'text' };
}
```

### 4.4 图片分析

**请求**：
```typescript
interface ImageAnalysisRequest {
  images: string[];  // URL 或 base64
  prompt: string;
  model?: string;
  maxTokens?: number;
}
```

### 4.5 视频生成

**请求**：
```typescript
interface VideoGenerationRequest {
  prompt: string;
  images?: string[];  // 可选参考图
  duration?: number;
  aspectRatio?: '16:9' | '9:16';
  hd?: boolean;
  watermark?: boolean;
  model?: string;
}
```

### 4.6 视频分析

**请求**：
```typescript
interface VideoAnalysisRequest {
  videoUrl: string;
  prompt: string;
  model?: string;
  maxTokens?: number;
}
```

## 5. 错误处理

### 5.1 错误分类

```typescript
enum ErrorCode {
  // 配置错误
  INVALID_API_KEY = 'INVALID_API_KEY',
  PROVIDER_NOT_CONFIGURED = 'PROVIDER_NOT_CONFIGURED',
  INVALID_CONFIGURATION = 'INVALID_CONFIGURATION',
  
  // 请求错误
  INVALID_REQUEST = 'INVALID_REQUEST',
  INVALID_PARAMETER = 'INVALID_PARAMETER',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // API 错误
  API_ERROR = 'API_ERROR',
  API_TIMEOUT = 'API_TIMEOUT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  
  // 业务错误
  GENERATION_FAILED = 'GENERATION_FAILED',
  CONTENT_POLICY_VIOLATION = 'CONTENT_POLICY_VIOLATION',
  
  // 系统错误
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}
```

### 5.2 重试策略

```typescript
interface RetryConfig {
  maxRetries: number;        // 最大重试次数
  initialDelayMs: number;    // 初始延迟
  maxDelayMs: number;        // 最大延迟
  backoffMultiplier: number; // 退避倍数
  retryableErrors: ErrorCode[]; // 可重试的错误
}

// 默认配置
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  retryableErrors: [
    ErrorCode.API_TIMEOUT,
    ErrorCode.RATE_LIMIT_EXCEEDED,
    ErrorCode.SERVICE_UNAVAILABLE,
  ],
};
```

## 6. 配置持久化

### 6.1 数据库模式

```sql
-- API 配置表
CREATE TABLE api_configs (
  id UUID PRIMARY KEY,
  user_id INT NOT NULL,
  provider VARCHAR(50) NOT NULL,
  api_key VARCHAR(500) NOT NULL ENCRYPTED,
  base_url VARCHAR(500),
  features JSON,
  default_models JSON,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(user_id, provider)
);

-- 多媒体配置表
CREATE TABLE multimedia_configs (
  id UUID PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  providers JSON,  -- 功能到提供商的映射
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 6.2 缓存策略

- 配置缓存：5 分钟 TTL
- 提供商状态缓存：1 分钟 TTL
- 模型列表缓存：1 小时 TTL

## 7. 安全考虑

### 7.1 API Key 管理

- API Key 加密存储
- 不在日志中输出 API Key
- 支持 API Key 轮换
- 支持 API Key 过期设置

### 7.2 请求验证

- 验证用户权限
- 验证请求参数
- 限制请求大小
- 实现速率限制

### 7.3 内容安全

- 支持内容审查
- 记录所有请求和响应
- 支持审计日志

## 8. 性能优化

### 8.1 缓存策略

- 配置缓存
- 模型列表缓存
- 响应缓存（可选）

### 8.2 并发处理

- 支持并发请求
- 实现连接池
- 支持请求队列

### 8.3 监控和告警

- 记录 API 调用指标
- 监控错误率
- 告警配额使用情况

## 9. 扩展性设计

### 9.1 添加新提供商

1. 创建新的适配器类实现 `IMediaAdapter` 接口
2. 在 `MultiMediaService` 中注册适配器
3. 在配置管理中添加提供商支持
4. 更新 UI 配置界面

### 9.2 添加新功能

1. 在 `IMediaAdapter` 接口中添加新方法
2. 在各适配器中实现新方法
3. 在 `MultiMediaService` 中添加路由
4. 创建新的 API 端点

## 10. 测试策略

### 10.1 单元测试

- 测试各适配器的功能
- 测试配置管理
- 测试错误处理

### 10.2 集成测试

- 测试端到端流程
- 测试多提供商切换
- 测试配置同步

### 10.3 性能测试

- 测试并发请求
- 测试缓存效果
- 测试重试机制

## 11. 部署和迁移

### 11.1 数据库迁移

- 创建新表
- 迁移现有配置
- 验证数据完整性

### 11.2 向后兼容

- 保留现有 API 端点
- 支持旧配置格式
- 提供迁移工具

### 11.3 灰度发布

- 先在测试环境验证
- 逐步发布到生产环境
- 监控错误率和性能

