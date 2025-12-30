# 提示词纯净性修复 (Prompt Purity Fix)

## 问题描述

生成的画面提示词和视频提示词中混入了不应该出现的内容：

1. **AI思考/分析文本**：如"Continue from the previous scene"、"Show the natural next step"等指令性文本
2. **预制标签**：如"Video prompts:"、"Visual:"等前缀标签
3. **中英混杂**：中文和英文混合在同一个提示词中

### 问题示例

**原始问题的画面提示词：**
```
【Continue from the previous scene: "一只老鼠悄无声息地穿过昏暗的厨房..." 
Show the natural next step in the story. Maintain all character appearances...
Build upon the established narrative: 昏暗的厨房里...】
```

**原始问题的视频提示词：**
```
Video prompts: The camera gently pans across the dim kitchen...
```

## 解决方案

### 1. 更新 `parseScriptToScenes` 函数

**文件**: `geminiService.ts` (第 912-1120 行)

**改动**:
- 添加了 `language: 'zh' | 'en' = 'en'` 参数
- 创建了语言特定的系统提示词
- 添加了 **文 标记作为全局指令标记
- 添加了明确的禁止性指令：
  - 禁止包含指令性文本（"Continue from", "Show the", "Maintain", "Build upon"等）
  - 禁止包含标签或前缀（"Visual:", "Video prompts:"等）
  - 禁止包含AI的思考、分析或解释内容
  - 禁止中英混杂，所有内容必须是单一语言

### 2. 更新 `generateVideoPromptFromVisual` 函数

**文件**: `geminiService.ts` (第 27-170 行)

**改动**:
- 添加了 **文 标记
- 添加了禁止性指令部分，明确禁止：
  - 任何标签或前缀
  - 任何指令性文本
  - AI的思考或分析内容
  - 中英混杂

### 3. 更新 `generateStoryboardFromDialogue` 函数

**文件**: `geminiService.ts` (第 1452-1650 行)

**改动**:
- 添加了 **文 标记
- 添加了完整的禁止性指令部分
- 确保 visualPrompt 和 videoPrompt 是纯粹的场景描述

### 4. 更新 `App.tsx`

**文件**: `App.tsx` (第 257 行)

**改动**:
- 更新 `parseScriptToScenes` 调用，传递 `lang` 参数
- 确保使用当前语言生成提示词

## 系统提示词中的禁止性指令

### 中文版本

```
【禁止性指令】
1. 禁止包含任何标签或前缀，如"Video prompts:"、"视频提示词："等
2. 禁止包含任何指令性文本，如"Continue from"、"Show the"、"Maintain"等
3. 禁止包含AI的思考、分析或解释内容
4. 禁止包含中英混杂的内容，所有内容必须是中文
```

### 英文版本

```
【Prohibited Instructions】
1. Do NOT include any labels or prefixes, such as "Video prompts:", "Video prompt:" etc.
2. Do NOT include any instructional text, such as "Continue from", "Show the", "Maintain", etc.
3. Do NOT include AI's thinking, analysis, or explanatory content
4. Do NOT mix Chinese and English content, all content must be in English
```

## 预期结果

### 修复前的画面提示词
```
【Continue from the previous scene: "一只老鼠悄无声息地穿过昏暗的厨房..." 
Show the natural next step in the story. Maintain all character appearances...
Build upon the established narrative: 昏暗的厨房里...】
```

### 修复后的画面提示词
```
昏暗的厨房里，微弱的月光通过窗户洒下，地上一片杂乱。一只老鼠安静地穿行，小心翼翼地躲避散落的物品。
```

### 修复前的视频提示词
```
Video prompts: The camera gently pans across the dim kitchen, capturing the scattered objects...
```

### 修复后的视频提示词
```
摄像机缓缓扫过昏暗的厨房，捕捉地上散落的物品。老鼠停顿，竖起胡须，眼睛警惕而闪闪发光。它小心地在杂乱中穿行，动作迅速而精致。远处的钟声打破寂静。摄像机缓缓拉远，窗户的微弱光芒突出了一条潜在的逃生路线。老鼠犹豫，然后迅速冲向月光照亮的路径。
```

## 技术细节

### **文 标记的作用

**文 标记用作全局指令标记，表示以下内容是系统级别的指令，应该被严格遵循。这个标记帮助AI理解这些是核心要求，而不是可选的建议。

### 语言参数流程

1. 用户在UI中选择语言（中文或英文）
2. `App.tsx` 中的 `lang` 状态被传递给生成函数
3. 生成函数根据语言选择相应的系统提示词
4. AI 根据语言特定的指令生成纯粹的单语言内容

## 验证

所有改动已通过以下验证：
- ✅ TypeScript 编译成功
- ✅ 构建成功（npm run build）
- ✅ 没有类型错误
- ✅ 所有函数签名正确

## 部署

这些改动已准备好部署到生产环境。建议在部署后进行以下测试：

1. 使用中文生成脚本，验证输出全是中文
2. 使用英文生成脚本，验证输出全是英文
3. 检查生成的提示词中没有标签或前缀
4. 检查生成的提示词中没有指令性文本
5. 检查生成的提示词是纯粹的场景描述
