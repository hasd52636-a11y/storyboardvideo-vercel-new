# Video Prompt Generation with Scene Transitions

## 修改概述

改进了视频提示词的生成方式，使其能够考虑场景之间的过渡和连接，从而生成更连贯的视频提示词。

## 核心改变

### 1. 修改 `generateVideoPromptFromVisual` 函数签名

**旧签名**：
```typescript
export const generateVideoPromptFromVisual = async (
  visualPrompt: string,
  sceneDescription: string,
  style: string,
  frameCount: number,
  sceneIndex: number,
  language: 'zh' | 'en' = 'en'
): Promise<string>
```

**新签名**：
```typescript
export const generateVideoPromptFromVisual = async (
  visualPrompt: string,
  sceneDescription: string,
  style: string,
  frameCount: number,
  sceneIndex: number,
  language: 'zh' | 'en' = 'en',
  prevVisualPrompt?: string,        // 前一个场景的画面提示词
  prevSceneDescription?: string     // 前一个场景的描述
): Promise<string>
```

### 2. 三种场景处理方式

#### 场景 1：第一个场景（sceneIndex === 1）
- 只关注当前场景本身
- 不需要前一个场景的信息
- 系统提示词专注于该场景的视觉和动态描述

#### 场景 2：中间场景（1 < sceneIndex < frameCount）
- 发送**两个连续场景**的信息给AI
- 包括前一个场景的画面提示词和描述
- 包括当前场景的画面提示词和描述
- 系统提示词强调**场景过渡的连贯性**
- AI生成的视频提示词会考虑从前一场景到当前场景的自然过渡

#### 场景 3：最后一个场景（sceneIndex === frameCount）
- 只关注当前场景本身
- 系统提示词告诉AI这是故事的结尾
- 生成的视频提示词应该有适当的收尾感

### 3. 更新的调用位置

#### `handleGenerateStoryboardPreview` (App.tsx)
```typescript
// 获取前一个场景的信息（如果不是第一个场景）
const prevScene = index > 0 ? scenes[index - 1] : null;
const prevVisualPrompt = prevScene?.visualPrompt || '';
const prevSceneDescription = prevScene?.description || '';

videoPromptZh = await generateVideoPromptFromVisual(
  visualPromptZh,
  scene.description,
  style?.nameZh || style?.name || 'Realistic Photography',
  frameCount,
  index + 1,
  'zh',
  prevVisualPrompt,           // 新增参数
  prevSceneDescription        // 新增参数
);
```

#### `handleGenerateFromDialogue` (App.tsx)
- 同样的逻辑，在生成图片后调用 `generateVideoPromptFromVisual`
- 传递前一个场景的信息

#### `handleGenerateFromScript` (App.tsx)
- 同样的逻辑，在生成图片后调用 `generateVideoPromptFromVisual`
- 传递前一个场景的信息

## 系统提示词改进

### 中间场景的系统提示词（中文）
```
【重要规则】：
1. 必须严格遵循【当前场景说明】中描述的故事内容
2. 必须严格遵循【当前画面描述】中的视觉元素
3. 考虑从【前一场景】到【当前场景】的自然过渡
4. 不要改变场景的内容、顺序或含义
5. 不要添加原文中没有的元素
6. 只添加动作、表情、光线、摄像机运动等动态描述

【核心要素（必须包含）】：
- 场景过渡的连贯性（从前一场景到当前场景）
- 角色姿态和肢体语言（基于画面描述）
- 角色表情和眼神（基于画面描述）
- 环境光线变化（基于画面描述）
- 摄像机运动（根据故事情节和过渡设计）
```

### 最后一个场景的系统提示词（中文）
```
【重要规则】：
...
6. 这是结尾场景，应该有适当的收尾感
```

## 优势

1. **更好的场景连贯性**：AI能够看到前后两个场景，生成更自然的过渡
2. **更流畅的视频**：视频提示词会考虑摄像机运动和角色动作的连接
3. **故事完整性**：最后一个场景会有适当的收尾感
4. **语言一致性**：仍然只生成当前语言的内容，不进行翻译

## 测试方式

1. 在脚本创作模式下，输入一个多场景的脚本
2. 选择分镜数（例如3个）
3. 点击"生成脚本"按钮
4. 在预览对话框中查看生成的视频提示词
5. 观察视频提示词是否考虑了场景之间的过渡

## 部署信息

- **提交信息**：feat: Generate video prompts based on scene transitions - send two consecutive scenes to AI for better continuity
- **修改文件**：
  - `geminiService.ts`：修改 `generateVideoPromptFromVisual` 函数
  - `App.tsx`：更新三个调用位置（`handleGenerateStoryboardPreview`、`handleGenerateFromDialogue`、`handleGenerateFromScript`）
- **构建状态**：✅ 成功
- **部署状态**：✅ 已推送到 GitHub，Vercel 自动部署中
