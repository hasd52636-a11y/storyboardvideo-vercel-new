# 统一多媒体 API 集成规范

## 1. 功能概述

### 1.1 核心目标
创建一个统一的多媒体服务层，支持通过单一 API Key 访问多个功能：
- 文生图（Text-to-Image）
- 图生图（Image-to-Image）
- 文本生成（Text Generation）
- 图片分析（Image Analysis）
- 视频生成（Video Generation）
- 视频分析（Video Analysis）

### 1.2 支持的提供商
- **OpenAI**：文生图、图生图、文本生成、图片分析（现有）
- **智谱（Zhipu）**：文本生成、文生图（现有，保留）
- **Shenma（神马）**：文生图、图生图、文本、图片分析、视频分析、视频生成（新增，推荐）
- **Dayuyu（大洋芋）**：视频生成（现有，待测试，可选）
- **Custom API**：自定义第三方接口（现有，保留）
- **Gemini**：全模态服务（保留，后期开发）

---

## 2. 用户故事

### 用户故事 1：一键配置神马 API
**作为** 应用用户
**我想** 只需输入一个神马 API Key
**以便** 自动获得文生图、图生图、文本生成、图片分析、视频分析的完整功能

**验收标准**：
1. WHEN 用户在配置界面选择"神马"作为提供商
2. THEN 系统自动将该 API Key 应用到所有支持的功能
3. AND 用户无需为每个功能单独配置 API Key
4. AND 下拉框显示"已同步"状态

### 用户故事 2：灵活的多提供商支持
**作为** 应用用户
**我想** 为不同功能配置不同的提供商
**以便** 根据需求灵活选择最优的 API 服务

**验收标准**：
1. WHEN 用户配置图片生成功能
2. THEN 可以选择 OpenAI、Shenma 或其他提供商
3. AND 选择不同提供商时，其他功能的配置不受影响
4. AND 系统记住用户的选择

### 用户故事 3：向后兼容
**作为** 现有用户
**我想** 继续使用现有的 OpenAI 和 DYU 配置
**以便** 无需迁移即可升级系统

**验收标准**：
1. WHEN 系统升级后
2. THEN 现有的 OpenAI API Key 继续工作
3. AND 现有的 DYU 视频配置继续工作
4. AND 新的 Shenma 功能是可选的

---

## 3. 功能需求

### 3.1 文生图（Text-to-Image）

**需求 3.1.1**：支持多个提供商的文生图
- WHEN 用户请求文生图
- THEN 系统根据配置的提供商调用相应 API
- AND 支持的提供商：OpenAI (DALL-E)、Shenma (Nano-banana)

**需求 3.1.2**：支持图片参数配置
- WHEN 用户生成图片
- THEN 支持以下参数：
  - 宽高比（aspect_ratio）：1:1, 16:9, 9:16, 4:3, 3:4 等
  - 图片大小（size）：1K, 2K, 4K（Shenma）或 256x256, 512x512, 1024x1024（OpenAI）
  - 返回格式（response_format）：url 或 base64
  - 生成数量（n）：1-10 张

**需求 3.1.3**：统一的响应格式
- WHEN API 返回结果
- THEN 统一格式为：`{ images: string[], success: boolean, error?: string }`

### 3.2 图生图（Image-to-Image / Image Editing）

**需求 3.2.1**：支持多图参考
- WHEN 用户上传参考图片
- THEN 系统支持单图或多图编辑
- AND Shenma 支持多图，OpenAI 支持单图

**需求 3.2.2**：支持编辑参数
- WHEN 用户编辑图片
- THEN 支持以下参数：
  - 提示词（prompt）
  - 参考图片（images）
  - 宽高比（aspect_ratio）
  - 遮罩（mask）- 可选
  - 质量（quality）- 可选

**需求 3.2.3**：图片上传处理
- WHEN 用户上传图片
- THEN 系统支持：
  - URL 直接引用
  - Base64 编码上传
  - 本地文件上传（转换为 Base64 或 URL）

### 3.3 文本生成（Text Generation）

**需求 3.3.1**：支持多个 LLM 模型
- WHEN 用户请求文本生成
- THEN 系统支持通过 Shenma 访问：
  - OpenAI 模型（GPT-4, GPT-3.5 等）
  - Claude 模型
  - Gemini 模型
  - DeepSeek 模型
  - 其他开源模型

**需求 3.3.2**：支持流式和非流式响应
- WHEN 用户请求文本生成
- THEN 支持 `stream: true/false` 参数
- AND 流式响应实时返回 token

**需求 3.3.3**：支持结构化输出
- WHEN 用户需要 JSON 格式输出
- THEN 支持 JSON Schema 模式
- AND 支持 Claude Thinking 模式

### 3.4 图片分析（Image Analysis）

**需求 3.4.1**：支持图片识别
- WHEN 用户上传图片进行分析
- THEN 系统通过 Shenma Chat API 调用视觉模型
- AND 支持多种分析任务：
  - 图片描述
  - 物体识别
  - 文字识别（OCR）
  - 场景理解

**需求 3.4.2**：支持多图分析
- WHEN 用户上传多张图片
- THEN 系统支持同时分析多张图片
- AND 支持图片间的关系分析

### 3.5 视频生成（Video Generation）

**需求 3.5.1**：支持多个视频模型
- WHEN 用户请求视频生成
- THEN 系统支持：
  - **Shenma Sora2 模型**（推荐，已验证）
  - **Dayuyu 模型**（可选，待测试）

**需求 3.5.2**：视频生成提供商选择
- WHEN 用户配置视频生成
- THEN 可以选择：
  - Shenma（默认，已验证）
  - Dayuyu（可选，待测试）
- AND 系统记住用户的选择

**需求 3.5.3**：统一的视频生成接口
- WHEN 用户生成视频
- THEN 支持参数：
  - 提示词（prompt）
  - 参考图片（images）- 可选
  - 时长（duration）
  - 宽高比（aspect_ratio）
  - 高清模式（hd）
  - 水印（watermark）

### 3.6 视频分析（Video Analysis）

**需求 3.6.1**：支持视频理解
- WHEN 用户上传视频进行分析
- THEN 系统通过 Shenma Chat API 调用 Gemini 视频模型
- AND 支持视频内容理解、场景识别等

---

## 4. 配置管理

### 4.1 API Key 配置结构

```typescript
interface APIProviderConfig {
  // 提供商标识
  provider: 'openai' | 'dyu' | 'shenma';
  
  // API 密钥
  apiKey: string;
  
  // 基础 URL（可选，用于自定义端点）
  baseUrl?: string;
  
  // 功能启用状态
  features: {
    textToImage: boolean;      // 文生图
    imageToImage: boolean;     // 图生图
    textGeneration: boolean;   // 文本生成
    imageAnalysis: boolean;    // 图片分析
    videoGeneration: boolean;  // 视频生成
    videoAnalysis: boolean;    // 视频分析
  };
  
  // 默认模型配置
  defaultModels?: {
    textGeneration?: string;   // 默认文本模型
    imageGeneration?: string;  // 默认图片模型
    videoGeneration?: string;  // 默认视频模型
  };
}

interface MultiMediaConfig {
  // 各功能的提供商映射
  providers: {
    textToImage: 'openai' | 'shenma';
    imageToImage: 'openai' | 'shenma';
    textGeneration: 'openai' | 'shenma';
    imageAnalysis: 'shenma';
    videoGeneration: 'openai' | 'dyu' | 'shenma';
    videoAnalysis: 'shenma';
  };
  
  // 各提供商的配置
  configs: {
    openai?: APIProviderConfig;
    dyu?: APIProviderConfig;
    shenma?: APIProviderConfig;
  };
}
```

### 4.2 配置同步规则

**规则 4.2.1**：Shenma 一键同步
- WHEN 用户选择 Shenma 作为提供商
- THEN 自动将 Shenma API Key 应用到所有支持的功能
- AND 更新配置中的 `providers` 映射

**规则 4.2.2**：提供商优先级
- 优先级：用户显式选择 > 默认配置 > 系统默认
- 当某个提供商不可用时，自动降级到备选提供商

---

## 5. UI/UX 设计

### 5.1 配置界面布局

```
┌─────────────────────────────────────────┐
│ API 配置                                 │
├─────────────────────────────────────────┤
│                                         │
│ 选择提供商：[OpenAI ▼] [DYU ▼] [Shenma ▼] │
│                                         │
│ ┌─ Shenma 配置 ─────────────────────┐  │
│ │ API Key: [________________]        │  │
│ │ Base URL: [________________]       │  │
│ │                                   │  │
│ │ 功能启用：                         │  │
│ │ ☑ 文生图                          │  │
│ │ ☑ 图生图                          │  │
│ │ ☑ 文本生成                        │  │
│ │ ☑ 图片分析                        │  │
│ │ ☑ 视频生成                        │  │
│ │ ☑ 视频分析                        │  │
│ │                                   │  │
│ │ [一键同步到所有功能] [保存]        │  │
│ └───────────────────────────────────┘  │
│                                         │
│ ┌─ 功能提供商映射 ──────────────────┐  │
│ │ 文生图：[Shenma ▼] ✓ 已同步       │  │
│ │ 图生图：[Shenma ▼] ✓ 已同步       │  │
│ │ 文本生成：[Shenma ▼] ✓ 已同步     │  │
│ │ 图片分析：[Shenma ▼] ✓ 已同步     │  │
│ │ 视频生成：[Shenma ▼] ✓ 已同步     │  │
│ │ 视频分析：[Shenma ▼] ✓ 已同步     │  │
│ └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### 5.2 交互流程

**流程 1：用户选择 Shenma**
1. 用户在下拉框选择 "Shenma"
2. 系统显示 Shenma 配置面板
3. 用户输入 API Key
4. 用户点击 "一键同步到所有功能"
5. 系统自动更新所有功能的提供商映射
6. UI 显示 "✓ 已同步" 标记

**流程 2：用户为不同功能选择不同提供商**
1. 用户在 "功能提供商映射" 中修改某个功能的提供商
2. 系统验证该提供商是否已配置
3. 如果未配置，提示用户先配置该提供商
4. 更新映射后，保存配置

---

## 6. 技术需求

### 6.1 新建服务

**服务 6.1.1**：`MultiMediaService`
- 统一的多媒体服务入口
- 根据配置自动路由到相应提供商
- 统一的错误处理和重试机制

**服务 6.1.2**：`ShenmaAPIAdapter`
- 实现 Shenma API 的所有功能
- 支持文生图、图生图、文本、图片分析、视频分析
- 统一的请求/响应格式转换

### 6.2 配置管理

**模块 6.2.1**：`APIConfigManager`
- 管理多个提供商的配置
- 支持配置的持久化（数据库或本地存储）
- 支持配置的验证和同步

### 6.3 API 端点

**端点 6.3.1**：`/api/multimedia/config`
- GET：获取当前配置
- POST：更新配置
- PUT：同步配置

**端点 6.3.2**：`/api/multimedia/text-to-image`
- POST：文生图请求

**端点 6.3.3**：`/api/multimedia/image-to-image`
- POST：图生图请求

**端点 6.3.4**：`/api/multimedia/text-generation`
- POST：文本生成请求

**端点 6.3.5**：`/api/multimedia/image-analysis`
- POST：图片分析请求

**端点 6.3.6**：`/api/multimedia/video-generation`
- POST：视频生成请求

**端点 6.3.7**：`/api/multimedia/video-analysis`
- POST：视频分析请求

---

## 7. 数据模型

### 7.1 请求/响应格式

```typescript
// 文生图请求
interface TextToImageRequest {
  prompt: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  size?: string;
  responseFormat?: 'url' | 'b64_json';
  n?: number;
  quality?: 'high' | 'medium' | 'low';
}

// 统一响应格式
interface GenerationResponse {
  success: boolean;
  data?: {
    images?: string[];
    text?: string;
    videoUrl?: string;
    taskId?: string;
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

---

## 8. 验收标准

### 8.1 功能验收

- [ ] 用户可以配置 Shenma API Key
- [ ] 用户可以一键同步 Shenma 到所有功能
- [ ] 文生图功能正常工作
- [ ] 图生图功能正常工作
- [ ] 文本生成功能正常工作
- [ ] 图片分析功能正常工作
- [ ] 视频生成功能正常工作
- [ ] 视频分析功能正常工作
- [ ] 现有 OpenAI 功能继续工作
- [ ] 现有 DYU 功能继续工作

### 8.2 性能验收

- [ ] 文生图响应时间 < 30 秒
- [ ] 图生图响应时间 < 30 秒
- [ ] 文本生成响应时间 < 10 秒
- [ ] 图片分析响应时间 < 15 秒
- [ ] 视频生成响应时间 < 5 分钟
- [ ] 视频分析响应时间 < 30 秒

### 8.3 可靠性验收

- [ ] API 调用失败时自动重试
- [ ] 提供商不可用时自动降级
- [ ] 错误信息清晰易懂
- [ ] 支持配置备份和恢复

---

## 9. 实现优先级

### Phase 1（核心功能）
1. 创建 `MultiMediaService` 框架
2. 实现 `ShenmaAPIAdapter`
3. 实现文生图功能
4. 实现配置管理

### Phase 2（扩展功能）
1. 实现图生图功能
2. 实现文本生成功能
3. 实现图片分析功能

### Phase 3（高级功能）
1. 实现视频生成功能
2. 实现视频分析功能
3. 优化和性能调优

---

## 10. 风险和缓解

### 风险 10.1：API 配额限制
- **缓解**：实现配额管理和告警机制

### 风险 10.2：提供商 API 变更
- **缓解**：使用适配器模式，便于快速适配

### 风险 10.3：用户配置混乱
- **缓解**：提供清晰的 UI 和文档，支持配置验证

