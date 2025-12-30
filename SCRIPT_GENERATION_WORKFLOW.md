# 脚本生成工作流实现

## 概述
实现了"生成脚本"的完整工作流，用户可以在脚本创作标签页中通过对话生成脚本，然后在预览对话框中编辑提示词，最后确认生成分镜（图片）。

## 工作流步骤

### 1. 生成脚本（第一步）
- **位置**: 脚本创作标签页
- **按钮**: "生成脚本"（之前是"生成分镜"）
- **功能**: 
  - 根据对话历史生成脚本数据
  - AI生成画面提示词和视频提示词
  - 不生成图片

### 2. 脚本预览与编辑（第二步）
- **对话框**: StoryboardPreviewDialog
- **显示内容**:
  - 按场景分类显示
  - 每个场景显示：
    - 画面提示词（中文）
    - 画面提示词（英文）
    - 视频提示词（中文）
    - 视频提示词（英文）
- **用户操作**:
  - 可以编辑所有提示词
  - 点击"确认脚本"关闭对话框（保存编辑）
  - 点击"生成分镜"生成图片

### 3. 生成分镜（第三步）
- **触发**: 用户点击"生成分镜"按钮
- **功能**:
  - 使用编辑后的提示词生成图片
  - 创建占位符卡片
  - 异步生成每个场景的图片
  - 显示生成进度通知

## 文件修改

### components/SidebarRight.tsx
- 修改按钮文本："生成分镜" → "生成脚本"
- 添加新 prop: `onGenerateScriptPreview`
- 修改 `handleGenerateStoryboard` 调用 `onGenerateScriptPreview` 而不是 `onGenerateFromDialogue`

### components/StoryboardPreviewDialog.tsx
- 修改标题："分镜预览与编辑" → "脚本预览与编辑"
- 修改场景标签："分镜" → "场景"
- 移除图片显示（因为还没有生成图片）
- 更新 props:
  - 移除: `onGenerateImage`, `onGenerateFrames`, `onGenerateVideo`
  - 添加: `onConfirm`, `onGenerateImages`
- 更新按钮:
  - "确认脚本" - 关闭对话框，保存编辑
  - "生成分镜" - 生成图片

### App.tsx
- 添加新 prop 传递给 SidebarRight: `onGenerateScriptPreview={handleGenerateStoryboardPreview}`
- 更新 StoryboardPreviewDialog 调用:
  - 使用 `onConfirm` 关闭对话框
  - 使用 `onGenerateImages` 生成图片

## 数据流

```
用户对话
    ↓
点击"生成脚本"
    ↓
AI生成脚本数据（提示词）
    ↓
显示预览对话框
    ↓
用户编辑提示词
    ↓
点击"确认脚本" → 关闭对话框
    ↓
点击"生成分镜" → 生成图片
    ↓
图片添加到画布
```

## 关键特性

1. **两步确认**: 先确认脚本，再生成图片
2. **完整编辑**: 用户可以编辑所有提示词（中英文）
3. **异步生成**: 图片生成不阻塞UI
4. **进度反馈**: 显示每个场景的生成状态
5. **独立风格**: 脚本创作风格和视频编辑风格独立

## 测试
- ✅ 构建成功
- ✅ 部署到 Vercel 成功
- ✅ 所有 TypeScript 类型检查通过
