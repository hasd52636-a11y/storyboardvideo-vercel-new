# 手动场景批量生成设计

## 概述

用户可以在"生成画面"对话框中使用两种模式：
1. **单个输入模式**：逐个添加场景描述
2. **批量输入模式**：使用格式标记批量输入多个场景

## 关键设计决策

### 1. 图片比例和风格来源

**图片比例和风格由"脚本创作"标签页中的选择决定**

- 用户在"脚本创作"标签页选择风格（Style）
- 用户在"脚本创作"标签页选择画面比例（Aspect Ratio）
- 这些选择会被保存在 `SidebarRight` 的状态中：
  - `chatStyle`: 选择的风格
  - `chatAspectRatio`: 选择的画面比例
- 当用户点击"生成画面"按钮打开对话框时，这些值已经确定
- 对话框中不需要再次选择比例和风格

### 2. 间隔时间控制

**间隔时间仅在批量模式下显示和使用**

- 单个输入模式：不显示间隔时间控制
- 批量输入模式：显示间隔时间滑块和快速按钮
  - 默认值：2000ms（2秒）
  - 范围：500ms - 10000ms
  - 快速按钮：0.5s、2s、5s
- 间隔时间通过 `onGenerate` 回调传递给父组件

### 3. 批量输入格式

**使用 `<<<` 和 `>>>` 标记分隔场景**

```
<<<
场景1的画面描述
>>>

<<<
场景2的画面描述
>>>
```

- 系统自动识别标记之间的内容
- 支持多行描述
- 自动去除前后空白

### 4. 生成流程

```
用户在"脚本创作"选择风格和比例
    ↓
用户点击"生成画面"按钮
    ↓
打开 ManualSceneInputDialog
    ↓
用户选择模式（单个/批量）
    ↓
用户输入场景描述
    ↓
用户点击"生成画面"
    ↓
对话框传递：
  - scenes: Scene[]
  - batchInterval?: number (仅批量模式)
    ↓
App.tsx 的 handleGenerateFromManualScenes 处理：
  - 使用脚本创作中的 chatStyle 和 chatAspectRatio
  - 使用 batchInterval 控制生成间隔
  - 顺序生成每个场景的图片
  - 自动下载生成的图片
```

## 实现细节

### ManualSceneInputDialog 组件

**Props**:
```typescript
interface ManualSceneInputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (scenes: Scene[]) => void;
  onGenerate: (scenes: Scene[], batchInterval?: number) => void;
  lang: 'zh' | 'en';
  theme: 'dark' | 'light';
}
```

**State**:
- `scenes`: 场景列表
- `isBatchMode`: 是否为批量模式
- `batchInput`: 批量输入的文本
- `batchInterval`: 批量生成的间隔时间（毫秒）
- `isGenerating`: 是否正在生成
- `generationProgress`: 生成进度 {current, total}

### App.tsx 中的处理

**需要实现的函数**:
```typescript
const handleGenerateFromManualScenes = useCallback(
  async (scenes: Scene[], batchInterval?: number) => {
    // 1. 获取脚本创作中的风格和比例
    const style = chatStyle; // 从 SidebarRight 传入
    const aspectRatio = chatAspectRatio; // 从 SidebarRight 传入
    
    // 2. 为每个场景创建占位符卡片
    // 3. 顺序生成图片，使用 batchInterval 控制间隔
    // 4. 自动下载生成的图片
    // 5. 更新进度显示
  },
  [chatStyle, chatAspectRatio, ...]
);
```

## 用户体验流程

### 单个输入模式

1. 打开对话框
2. 逐个添加场景（点击"添加画面"按钮）
3. 编辑每个场景的描述
4. 点击"生成画面"开始生成

### 批量输入模式

1. 打开对话框
2. 勾选"批量输入"复选框
3. 粘贴或输入批量格式的内容
4. 点击"解析"按钮识别场景
5. 调整间隔时间（可选）
6. 点击"批量生成"开始生成
7. 查看进度条
8. 生成完成后自动下载

## 自动下载实现

生成完成后，系统应该：

1. 将所有生成的图片打包为 ZIP 文件
2. 自动下载到用户的下载文件夹
3. 文件名格式：`scenes_YYYYMMDD_HHMMSS.zip`
4. 每个图片文件名：`scene_001.png`, `scene_002.png` 等

或者逐个下载：

1. 为每个生成的图片创建下载链接
2. 自动触发下载
3. 显示下载进度

## 注意事项

- 间隔时间用于防止 API 限流
- 批量生成时，对话框保持打开状态显示进度
- 生成过程中，用户可以点击"取消"停止生成
- 生成失败的场景会显示错误提示，但不会中断整个批量生成过程
- 已生成的图片会被添加到画布上

