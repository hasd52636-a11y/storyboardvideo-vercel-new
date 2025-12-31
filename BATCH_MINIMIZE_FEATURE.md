# 批量生成窗口最小化功能

## 功能概述

在批量生成模式下，用户可以最小化对话框窗口，将其转换为一个浮动的进度指示器，显示在左侧工具栏上方。这样用户可以继续在画布上工作，同时监控生成进度。

## 🎯 核心特性

### 1. 最小化按钮
- **位置**: 对话框头部，关闭按钮左侧
- **显示条件**: 仅在批量模式且正在生成时显示
- **图标**: 电话图标（表示最小化）
- **提示文本**: "最小化" (中文) / "Minimize" (英文)

### 2. 浮动进度指示器
- **位置**: 左侧工具栏上方（距离底部 80px）
- **大小**: 64x64 像素圆形
- **显示内容**:
  - 旋转的进度圆环
  - 中心显示百分比（0% - 100%）
  - 实时更新进度

### 3. 恢复窗口
- **触发方式**: 点击浮动指示器
- **效果**: 恢复完整的对话框窗口
- **光标**: 鼠标悬停时显示指针光标

## 📐 UI 设计

### 浮动指示器样式

```
┌─────────────────┐
│   ⟲ 45%        │  <- 旋转的进度圆环 + 百分比
│                 │
│  (64x64px)      │
└─────────────────┘
```

### 颜色方案

**深色主题**:
- 背景: `bg-zinc-800`
- 边框: `border-zinc-700`
- 进度圆: `stroke-purple-400`
- 文字: `text-purple-300`

**浅色主题**:
- 背景: `bg-white`
- 边框: `border-zinc-200`
- 进度圆: `stroke-purple-500`
- 文字: `text-purple-600`

## 🔄 工作流程

### 批量生成流程

```
用户点击"批量生成"
  ↓
对话框开始生成
  ↓
显示"最小化"按钮
  ↓
用户可以：
  ├─ 继续在对话框中操作
  └─ 点击"最小化"按钮
      ↓
      对话框转换为浮动指示器
      ↓
      用户可以在画布上工作
      ↓
      点击浮动指示器恢复窗口
      ↓
      继续监控进度或操作
```

## 💻 实现细节

### 状态管理

```typescript
const [isMinimized, setIsMinimized] = useState(false);
const [isGenerating, setIsGenerating] = useState(false);
const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 });
```

### 最小化处理函数

```typescript
const handleMinimize = () => {
  setIsMinimized(true);
  onMinimize?.(true);
};

const handleRestore = () => {
  setIsMinimized(false);
  onMinimize?.(false);
};
```

### 条件渲染

```typescript
if (!isOpen) return null;

// 最小化状态：显示浮动进度指示器
if (isMinimized && isBatchMode && isGenerating) {
  return (
    <div
      onClick={handleRestore}
      className="fixed bottom-20 left-4 z-40 cursor-pointer..."
    >
      {/* 浮动指示器 */}
    </div>
  );
}

// 正常状态：显示完整对话框
return (
  <div className="fixed inset-0 z-50...">
    {/* 完整对话框 */}
  </div>
);
```

### 进度圆环计算

```typescript
// SVG 圆环进度计算
const circumference = 2 * Math.PI * 45; // 半径45
const strokeDasharray = `${(current / total) * circumference} ${circumference}`;
```

## 🎨 交互细节

### 最小化按钮

- **显示条件**: `isBatchMode && isGenerating`
- **禁用条件**: 无（始终可点击）
- **样式**: 与关闭按钮相同的悬停效果

### 浮动指示器

- **位置**: `fixed bottom-20 left-4`
- **z-index**: `z-40`（在工具栏下方）
- **悬停效果**: `hover:scale-110`
- **动画**: 旋转的进度圆环 (`animate-spin`)
- **点击**: 恢复窗口

## 📱 响应式设计

### 位置调整

- **左侧工具栏宽度**: 80px
- **浮动指示器距离左边**: 16px (`left-4`)
- **浮动指示器距离底部**: 80px (`bottom-20`)
- **大小**: 64x64px (固定)

### 不同屏幕尺寸

- **桌面**: 正常显示
- **平板**: 位置可能需要调整
- **手机**: 可能需要隐藏或调整位置

## 🔧 配置选项

### Props

```typescript
interface ManualSceneInputDialogProps {
  // ... 其他 props
  onMinimize?: (isMinimized: boolean) => void;
}
```

### 回调函数

- `onMinimize(true)`: 窗口被最小化
- `onMinimize(false)`: 窗口被恢复

## 📊 进度显示

### 百分比计算

```typescript
const percentage = Math.round((current / total) * 100);
```

### 显示格式

- 范围: 0% - 100%
- 更新频率: 实时（每次进度更新）
- 字体大小: `text-xs`
- 字体粗细: `font-bold`

## 🎯 用户体验

### 优势

✅ **不中断工作流**: 用户可以继续在画布上工作
✅ **实时监控**: 始终可以看到生成进度
✅ **快速恢复**: 一键恢复完整窗口
✅ **节省空间**: 最小化时不占用屏幕空间
✅ **清晰指示**: 百分比和旋转动画清晰显示进度

### 使用场景

1. **长时间生成**: 用户最小化窗口，继续编辑其他内容
2. **多任务处理**: 同时进行多个操作
3. **进度监控**: 快速查看生成进度
4. **空间节省**: 在小屏幕上节省空间

## 🚀 实现步骤

1. ✅ 添加 `isMinimized` 状态
2. ✅ 添加 `handleMinimize` 和 `handleRestore` 函数
3. ✅ 添加最小化按钮到对话框头部
4. ✅ 实现浮动指示器 UI
5. ✅ 添加进度圆环动画
6. ✅ 添加 `onMinimize` 回调
7. ⏳ 在 App.tsx 中处理最小化事件
8. ⏳ 测试最小化/恢复功能

## 📝 相关文档

- `MANUAL_SCENE_DIALOG_COMPLETE.md` - 完整实现说明
- `BATCH_TEMPLATE_DOWNLOAD_FEATURE.md` - 模板下载功能
- `MANUAL_SCENE_BATCH_GENERATION_DESIGN.md` - 设计文档

