# 智谱图片分析功能集成计划

## 📋 概述

智谱 AI 提供了强大的视觉理解能力，通过 `GLM-4V` 系列模型支持：
- 图片理解和描述
- 视觉问答 (VQA)
- 对象检测
- 视频理解
- 文档识别

目前项目中**未集成**这些功能，本文档提供集成方案。

---

## 🎯 可集成的功能

### 1. 图片分析 (Image Analysis)
**用途**: 分析用户上传的参考图片，生成详细的视觉描述

**当前流程**:
```
用户上传参考图片 → 直接用于图片生成 → 生成新图片
```

**改进后流程**:
```
用户上传参考图片 
  ↓
调用 GLM-4V 分析图片 → 获取详细描述
  ↓
将描述融入提示词 → 生成更精准的新图片
```

**实现位置**: `geminiService.ts` 中新增 `analyzeImageWithZhipu()` 函数

### 2. 视频理解 (Video Understanding)
**用途**: 分析视频内容，提取关键帧和场景描述

**实现位置**: `geminiService.ts` 中新增 `analyzeVideoWithZhipu()` 函数

---

## 🔧 技术实现

### 智谱 Vision API 调用方式

```typescript
// 使用 OpenAI 兼容格式调用智谱 Vision 模型
POST https://open.bigmodel.cn/api/paas/v4/chat/completions
Authorization: Bearer {API_KEY}
Content-Type: application/json

{
  "model": "glm-4v",  // 或 glm-4.5v, glm-4.6v
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "image_url",
          "image_url": {
            "url": "https://example.com/image.jpg"  // 或 data:image/png;base64,...
          }
        },
        {
          "type": "text",
          "text": "请详细描述这张图片..."
        }
      ]
    }
  ]
}
```

### 支持的模型

| 模型 | 用途 | 特点 |
|------|------|------|
| `glm-4v` | 通用视觉理解 | 功能完整，性能均衡 |
| `glm-4.5v` | 高级视觉推理 | 性能更强，支持视频 |
| `glm-4.6v` | 最新视觉模型 | 最新发布，性能最优 |
| `glm-4v-flash` | 快速图片分析 | 速度快，适合实时处理 |

---

## 📝 集成步骤

### 步骤 1: 添加图片分析函数

在 `geminiService.ts` 中添加：

```typescript
/**
 * 使用智谱 Vision 模型分析图片
 * @param imageUrl 图片 URL 或 base64 数据
 * @param prompt 分析提示词
 * @returns 分析结果
 */
export const analyzeImageWithZhipu = async (
  imageUrl: string,
  prompt: string = '请详细描述这张图片的内容、风格、构图、光线等视觉元素。'
): Promise<string> => {
  const config = getAppConfig();
  
  if (config?.provider !== 'zhipu') {
    console.warn('[analyzeImageWithZhipu] Not using Zhipu provider');
    return '';
  }
  
  if (!config?.apiKey) {
    console.error('[analyzeImageWithZhipu] No API key provided');
    return '';
  }

  try {
    const response = await fetch(`${config.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: 'glm-4v',  // 或使用 config.imageModel
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              },
              {
                type: 'text',
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[analyzeImageWithZhipu] API Error:', response.status, errorText);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || '';
    console.log('[analyzeImageWithZhipu] Analysis result:', result.substring(0, 100) + '...');
    return result;
  } catch (e) {
    console.error('[analyzeImageWithZhipu] Error:', e);
    return '';
  }
};
```

### 步骤 2: 在图片生成前调用分析

修改 `generateSceneImage()` 函数：

```typescript
// 如果有参考图片且使用智谱，先分析图片
if (referenceImageUrl && config?.provider === 'zhipu') {
  console.log('[generateSceneImage] Analyzing reference image with Zhipu Vision...');
  const imageAnalysis = await analyzeImageWithZhipu(
    referenceImageUrl,
    '请详细描述这张图片的视觉元素、风格、构图、光线、色彩等，用于生成相似风格的新图片。'
  );
  
  if (imageAnalysis) {
    // 将分析结果融入提示词
    prompt = `${prompt}\n\n参考图片分析：${imageAnalysis}`;
    console.log('[generateSceneImage] Updated prompt with image analysis');
  }
}
```

### 步骤 3: 添加到 UI

在 `components/SidebarRight.tsx` 中添加图片分析选项：

```typescript
// 添加按钮用于分析上传的图片
<button
  onClick={async () => {
    if (attachedImage.previews.length > 0) {
      const analysis = await analyzeImageWithZhipu(
        attachedImage.previews[0],
        '请详细描述这张图片...'
      );
      // 显示分析结果
      alert(analysis);
    }
  }}
  className="..."
>
  🔍 分析图片
</button>
```

---

## 🎬 视频理解集成

### 支持的视频格式
- MP4, WebM, MOV 等常见格式
- 最大文件大小: 取决于智谱限制
- 最大时长: 建议 < 5 分钟

### 实现方式

```typescript
/**
 * 使用智谱 Vision 模型分析视频
 */
export const analyzeVideoWithZhipu = async (
  videoUrl: string,
  prompt: string = '请分析这个视频的内容、场景、动作等...'
): Promise<string> => {
  // 类似图片分析，但使用 video_url 类型
  const response = await fetch(`${config.baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: 'glm-4.5v',  // 需要支持视频的模型
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'video_url',
              video_url: {
                url: videoUrl
              }
            },
            {
              type: 'text',
              text: prompt
            }
          ]
        }
      ]
    })
  });
  // ... 处理响应
};
```

---

## ⚠️ 注意事项

### 1. API 限制
- 图片大小: 建议 < 20MB
- 视频大小: 建议 < 100MB
- 请求频率: 遵守智谱 API 限制

### 2. 成本考虑
- 图片分析会增加 API 调用次数
- 建议添加缓存机制避免重复分析

### 3. 用户体验
- 分析需要时间（通常 2-5 秒）
- 建议显示加载状态
- 提供取消选项

---

## 📊 预期效果

### 使用前
```
用户上传参考图片 → 直接生成新图片 → 可能风格不一致
```

### 使用后
```
用户上传参考图片 
  ↓
AI 分析图片风格、构图、光线等
  ↓
融入分析结果到提示词
  ↓
生成风格一致的新图片 ✅
```

---

## 🚀 实现优先级

1. **高优先级** (立即实现)
   - 图片分析功能
   - 集成到图片生成流程

2. **中优先级** (后续实现)
   - 视频理解功能
   - UI 优化

3. **低优先级** (可选)
   - 缓存机制
   - 批量分析

---

## 📚 参考资源

- [智谱 Vision API 文档](https://docs.bigmodel.cn)
- [GLM-4V 模型说明](https://huggingface.co/zai-org/GLM-4.5V)
- [OpenAI Vision API 格式](https://platform.openai.com/docs/guides/vision)

---

## ✅ 集成检查清单

- [ ] 添加 `analyzeImageWithZhipu()` 函数
- [ ] 修改 `generateSceneImage()` 集成分析
- [ ] 添加 UI 按钮用于手动分析
- [ ] 测试图片分析功能
- [ ] 添加错误处理
- [ ] 优化用户体验
- [ ] 文档更新

---

**状态**: 📋 计划中
**优先级**: 🔴 高
**预计工作量**: 2-4 小时
