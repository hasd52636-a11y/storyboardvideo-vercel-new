# 分镜脚本生成UI优化设计

## 概述

本设计文档描述了分镜脚本生成界面的优化方案，包括简化编辑界面、改进交互流程、以及优化AI脚本整合逻辑。

## 架构

### 组件结构

```
StoryboardPreviewDialog
├── Frame List Container
│   └── Frame Item (可展开/收缩)
│       ├── Frame Header (场景标题和预览)
│       └── Frame Content (展开时显示)
│           ├── Visual Prompt Input (当前语言)
│           └── Video Prompt Input (当前语言)
└── Action Buttons
    ├── Cancel
    ├── Confirm Script
    └── Generate Images

VideoGenDialog
├── Prompt Section
│   ├── Visual Prompt Input
│   └── Video Prompt Input
├── Settings Section
│   ├── Model Selection
│   ├── Aspect Ratio
│   ├── Duration
│   └── HD Option
└── Action Buttons
    ├── Generate
    └── Cancel
```

## 组件和接口

### StoryboardPreviewDialog 改进

**关键改进**:
1. 移除多语言编辑 - 只显示当前语言的提示词
2. 修复展开/收缩逻辑 - 点击文本框不会触发收缩
3. 改进事件处理 - 正确的事件冒泡控制

**接口变化**:
```typescript
interface StoryboardFrame {
  id: string;
  visualPromptZh: string;
  visualPromptEn: string;
  videoPromptZh: string;
  videoPromptEn: string;
  imageUrl?: string;
  index: number;
}

// 编辑状态只跟踪当前语言
interface EditedFrames {
  [frameId: string]: {
    visualPrompt: string;
    videoPrompt: string;
  }
}
```

### VideoGenDialog 改进

**关键改进**:
1. 简化提示词输入 - 只显示两个输入框
2. 移除冗余的提示词显示
3. 保持模型和参数选项

**接口变化**:
```typescript
interface VideoGenDialogProps {
  // ... 现有属性
  visualPrompt?: string;
  videoPrompt?: string;
  onGenerateWithPrompts?: (visualPrompt: string, videoPrompt: string, options: any) => void;
}
```

### AI脚本整合服务

**新增功能**:
```typescript
interface ScriptIntegrationService {
  // 根据分镜数量整理脚本
  organizeScriptByFrameCount(
    aiGeneratedContent: string,
    frameCount: number,
    language: string
  ): StoryboardFrame[];
  
  // 提取关键内容作为画面提示词
  extractVisualPrompt(content: string, language: string): string;
  
  // 生成视频提示词
  generateVideoPrompt(content: string, visualPrompt: string, language: string): string;
}
```

## 数据模型

### 场景数据结构

```typescript
interface StoryboardFrame {
  id: string;
  index: number;
  visualPromptZh: string;      // 中文画面提示词
  visualPromptEn: string;      // 英文画面提示词
  videoPromptZh: string;       // 中文视频提示词
  videoPromptEn: string;       // 英文视频提示词
  imageUrl?: string;           // 生成的分镜图
}
```

### 编辑状态

```typescript
// 简化的编辑状态 - 只跟踪当前语言
interface EditState {
  [frameId: string]: {
    visualPrompt: string;
    videoPrompt: string;
  }
}
```

## 交互流程

### 脚本预览编辑流程

1. 用户打开脚本预览对话框
2. 系统显示所有场景的列表，每个场景显示标题和预览文本
3. 用户点击场景卡片
4. 系统展开该场景，显示两个输入框（当前语言）
5. 用户编辑画面提示词和视频提示词
6. 用户点击其他场景或确认按钮
7. 系统保存编辑内容并关闭对话框

### 视频生成流程

1. 用户打开视频生成对话框
2. 系统显示两个提示词输入框
3. 用户输入或修改提示词
4. 用户选择模型和参数
5. 用户点击生成按钮
6. 系统调用视频生成API

## 正确性属性

### 属性 1: 编辑内容持久化
*对于任何* 场景编辑，当用户修改画面提示词或视频提示词后，这些修改应该被保存并在用户确认时返回。

**验证: 需求 1.3, 1.4**

### 属性 2: 语言一致性
*对于任何* 语言设置，系统应该只显示和编辑对应语言的提示词，不会混合显示多个语言。

**验证: 需求 2.1, 2.2, 2.3, 6.1, 6.2, 6.3**

### 属性 3: 事件隔离
*对于任何* 展开的场景，点击其内部的文本框或输入框不应该触发场景的收缩。

**验证: 需求 4.1, 4.2**

### 属性 4: 脚本整合准确性
*对于任何* AI生成的内容和指定的分镜数量，系统应该将内容分成对应数量的部分，每个部分包含画面提示词和视频提示词。

**验证: 需求 3.1, 3.2, 3.3**

### 属性 5: 语言保持
*对于任何* 指定的语言，系统在整合脚本时应该保持该语言的内容，不进行翻译。

**验证: 需求 3.4**

### 属性 6: 单语言显示
*对于任何* 视频生成对话框和预览界面，系统应该只显示当前语言的提示词，不显示其他语言版本。

**验证: 需求 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3**

## 错误处理

### 编辑错误
- 如果编辑内容超过限制，显示警告信息
- 如果保存失败，显示错误提示并允许重试

### 脚本整合错误
- 如果AI生成的内容无法解析，显示错误信息
- 如果分镜数量不匹配，使用最接近的分镜数量

## 测试策略

### 单元测试
- 测试编辑状态管理
- 测试事件处理逻辑
- 测试脚本整合算法
- 测试语言切换逻辑

### 属性测试
- 验证编辑内容持久化
- 验证语言一致性
- 验证事件隔离
- 验证脚本整合准确性
- 验证语言保持

### 集成测试
- 测试完整的编辑流程
- 测试视频生成流程
- 测试多语言切换
