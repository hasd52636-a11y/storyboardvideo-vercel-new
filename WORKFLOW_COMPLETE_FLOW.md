# 完整工作流程：从创意到生成视频

## 📋 总体流程

```
用户输入 → 生成分镜 → 编辑分镜 → 导出/预览 → 生成视频
```

---

## 🔄 详细流程分类

### **第一阶段：生成分镜（handleGenerateFromDialogue）**

#### 输入
- 用户提供的场景信息（scenes 数组）
- 分镜数量（frameCount）
- 风格（styleId）
- 宽高比（aspectRatio）
- 时长（duration）

#### 处理流程

**Step 1: 清理画面提示词**
```
原始 visualPrompt
  ↓
检测占位符（### 画面X、### Scene X）
  ↓ 如果是占位符 → 跳过此场景
  ↓
清理特殊符号（【】、（）、[]、()、全文XXX字等）
  ↓
检测语言类型
```

**Step 2: 语言检测与处理**

**情况一：纯中文**
```
cleanedPrompt（中文）
  ↓
visualPromptZh = cleanedPrompt
visualPromptEn = translateText(cleanedPrompt, 'en')
  ↓
videoPromptZh = generateVideoPromptFromVisual(cleanedPrompt, 'zh')
videoPromptEn = translateText(videoPromptZh, 'en')
```

**情况二：纯英文**
```
cleanedPrompt（英文）
  ↓
visualPromptEn = cleanedPrompt
visualPromptZh = translateText(cleanedPrompt, 'zh')
  ↓
videoPromptEn = generateVideoPromptFromVisual(cleanedPrompt, 'en')
videoPromptZh = translateText(videoPromptEn, 'zh')
```

**情况三：中英混杂**
```
cleanedPrompt（混杂）
  ↓
visualPromptZh = translateText(cleanedPrompt, 'zh')
visualPromptEn = translateText(cleanedPrompt, 'en')
  ↓
videoPromptZh = generateVideoPromptFromVisual(visualPromptZh, 'zh')
videoPromptEn = translateText(videoPromptZh, 'en')
```

**Step 3: 生成图片**
```
enrichedPrompt = 【SC-XX】+ 【场景描述】+ 【视觉提示】+ 【时长】
  ↓
generateSceneImage(enrichedPrompt)
  ↓
imageUrl
```

**Step 4: 创建 StoryboardItem**
```
{
  id: UUID
  imageUrl: 生成的图片
  prompt: enrichedPrompt（混杂内容，用于存储）
  description: 场景描述
  visualPrompt: visualPromptZh（纯中文画面提示词）
  visualPromptEn: visualPromptEn（纯英文画面提示词）
  videoPrompt: videoPromptZh（纯中文视频提示词）
  videoPromptEn: videoPromptEn（纯英文视频提示词）
  ... 其他字段
}
```

#### 输出
- StoryboardItem 数组（包含所有提示词字段）
- 失败场景列表

---

### **第二阶段：编辑分镜**

#### 场景1：重绘图片（右键 → 重绘）

**编辑框显示内容**
```
visualPrompt（纯画面提示词）
```

**重绘流程**
```
用户编辑 visualPrompt
  ↓
点击"重绘"
  ↓
regenerate 动作
  ↓
promptToUse = 编辑后的 visualPrompt
  ↓
generateSceneImage(promptToUse)
  ↓
更新 item.visualPrompt = promptToUse
更新 item.imageUrl = 新图片
```

#### 场景2：生成视频（右键 → 生成视频）

**使用的提示词**
```
videoPrompt（纯视频提示词 - 包含动作、运镜、表情等）
```

**流程**
```
选中分镜
  ↓
右键 → 生成视频
  ↓
打开 VideoGenDialog
  ↓
使用 item.videoPrompt（中文）或 item.videoPromptEn（英文）
  ↓
调用视频生成 API
```

---

### **第三阶段：导出/预览**

#### 场景1：预览提示词（导出提示词 → 预览）

**中文框内容**
```
【全局指令】...
【SC-XX】
【场景描述】...
【视觉提示】visualPromptZh
【视频提示】videoPromptZh
【动作和运动】...
```

**英文框内容**
```
[GLOBAL] ...
[SC-XX]
[Visual Prompt] visualPromptEn
[Video Prompt] videoPromptEn
[Action & Motion] ...
```

**关键点**
- ✅ 中文框只有中文内容
- ✅ 英文框只有英文内容
- ✅ 不混杂

#### 场景2：导出提示词文件

```
导出格式：纯文本
内容：getFormattedPrompts() 返回的内容
```

---

### **第四阶段：生成视频**

#### 输入
- 选中的分镜（StoryboardItem）
- 视频参数（时长、宽高比等）

#### 流程
```
选中分镜
  ↓
右键 → 生成视频
  ↓
VideoGenDialog 打开
  ↓
使用 item.videoPrompt（中文）或 item.videoPromptEn（英文）
  ↓
调用视频生成 API（Sora、DYU 等）
  ↓
返回 video_url
  ↓
创建 VideoItem
  ↓
显示视频预览
```

---

## 📊 数据流向图

```
原始场景信息
    ↓
[语言检测]
    ├─ 纯中文 → visualPromptZh, videoPromptZh
    ├─ 纯英文 → visualPromptEn, videoPromptEn
    └─ 混杂 → 强制翻译成中文
    ↓
[翻译]
    ├─ 中文 → 翻译成英文
    └─ 英文 → 翻译成中文
    ↓
[生成图片]
    使用：visualPromptZh/En
    ↓
[生成视频提示词]
    使用：visualPromptZh/En
    ↓
StoryboardItem
    ├─ visualPrompt: 中文画面提示词
    ├─ visualPromptEn: 英文画面提示词
    ├─ videoPrompt: 中文视频提示词
    ├─ videoPromptEn: 英文视频提示词
    └─ prompt: 混杂内容（仅用于存储）
```

---

## ✅ 各环节的正确性检查

### 生成分镜阶段
- [x] 语言检测正确（三种情况）
- [x] 翻译逻辑正确
- [x] 画面提示词和视频提示词分离
- [x] 图片生成使用画面提示词

### 编辑分镜阶段
- [x] 重绘编辑框显示 visualPrompt（纯画面提示词）
- [x] 重绘使用 visualPrompt 生成图片
- [x] 生成视频使用 videoPrompt（纯视频提示词）

### 导出/预览阶段
- [x] 中文框只有中文
- [x] 英文框只有英文
- [x] 不混杂

### 生成视频阶段
- [x] 使用 videoPrompt（包含动作、运镜、表情）
- [x] 不使用 visualPrompt

---

## 🎯 关键字段说明

| 字段 | 用途 | 内容 |
|------|------|------|
| `prompt` | 存储 | 混杂内容（【SC-XX】【场景描述】【视觉提示】【时长】） |
| `visualPrompt` | 重绘图片 | 纯中文画面提示词 |
| `visualPromptEn` | 重绘图片 | 纯英文画面提示词 |
| `videoPrompt` | 生成视频 | 纯中文视频提示词（动作、运镜、表情） |
| `videoPromptEn` | 生成视频 | 纯英文视频提示词（动作、运镜、表情） |

---

## 🔍 可能的问题点

### 问题1：重绘时显示混杂内容
- ❌ 错误：显示 `prompt`
- ✅ 正确：显示 `visualPrompt`
- **状态**：已修复 ✅

### 问题2：导出预览中英混杂
- ❌ 错误：英文框包含中文内容
- ✅ 正确：英文框只有英文
- **状态**：已修复 ✅

### 问题3：生成视频用错提示词
- ❌ 错误：用 `visualPrompt`（只有画面）
- ✅ 正确：用 `videoPrompt`（包含动作、运镜）
- **状态**：正确 ✅

---

## 📝 总结

**流程正确性**：✅ 完全正确

**关键点**：
1. 语言检测 → 三种情况分别处理
2. 翻译 → 中英互译
3. 分离 → visualPrompt（画面）vs videoPrompt（视频）
4. 使用 → 重绘用画面，生成视频用视频提示词
5. 导出 → 中英完全分离
