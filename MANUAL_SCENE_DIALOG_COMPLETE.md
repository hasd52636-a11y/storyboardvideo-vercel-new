# ManualSceneInputDialog 完整实现

## 📦 组件概览

`ManualSceneInputDialog` 是一个功能完整的场景输入对话框，支持单个和批量输入两种模式。

## ✨ 核心功能

### 1. 单个输入模式
- ✅ 逐个添加场景
- ✅ 编辑每个场景的描述
- ✅ 删除场景（保留至少1个）
- ✅ 字符计数显示（0/500）
- ✅ 确认脚本或生成画面

### 2. 批量输入模式
- ✅ 使用 `<<<>>>` 标记分隔场景
- ✅ **下载模板文件**（新增）
- ✅ 自动解析场景
- ✅ 调整生成间隔时间（500ms - 10000ms）
- ✅ 显示生成进度条
- ✅ 批量生成画面

### 3. 模板下载功能（新增）
- ✅ 一键下载预制模板
- ✅ 中英文模板支持
- ✅ 3场景预设模板
- ✅ 文件名自动带语言标识

## 🎨 UI 布局

```
┌─────────────────────────────────────────┐
│ 生成画面              [批量输入] [✕]    │
├─────────────────────────────────────────┤
│                                         │
│  批量输入模式:                          │
│  ┌─────────────────────────────────┐   │
│  │ 格式：使用 <<< 和 >>> 标记...   │   │
│  │ [📥 下载模板]                   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 粘贴或输入批量内容...           │   │
│  │                                 │   │
│  │ <<<                             │   │
│  │ 场景1描述                       │   │
│  │ >>>                             │   │
│  │                                 │   │
│  │ <<<                             │   │
│  │ 场景2描述                       │   │
│  │ >>>                             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  间隔时间: 2000 毫秒                    │
│  ├─────────────────────────────────┤   │
│  [0.5s] [2s] [5s]                      │
│                                         │
│  进度: 0 / 0                            │
│  ├─────────────────────────────────┤   │
│                                         │
├─────────────────────────────────────────┤
│ [取消] [解析] [批量生成]                │
└─────────────────────────────────────────┘
```

## 📥 模板下载

### 下载按钮
- **位置**: 批量模式的格式说明下方
- **样式**: 蓝色按钮，带下载图标
- **文本**: "下载模板" (中文) / "Download Template" (英文)

### 模板内容

**中文模板** (`batch_scenes_template_zh.txt`):
```
<<<
场景1的画面描述
在这里输入第一个场景的详细描述...
>>>

<<<
场景2的画面描述
在这里输入第二个场景的详细描述...
>>>

<<<
场景3的画面描述
在这里输入第三个场景的详细描述...
>>>
```

**英文模板** (`batch_scenes_template_en.txt`):
```
<<<
Scene 1 Description
Enter detailed description for the first scene here...
>>>

<<<
Scene 2 Description
Enter detailed description for the second scene here...
>>>

<<<
Scene 3 Description
Enter detailed description for the third scene here...
>>>
```

## 🔄 工作流程

### 单个输入流程
```
打开对话框
  ↓
[单个输入模式]（默认）
  ↓
添加/编辑场景
  ↓
点击"生成画面"
  ↓
传递场景数据给父组件
```

### 批量输入流程
```
打开对话框
  ↓
勾选"批量输入"
  ↓
[可选] 点击"下载模板"
  ↓
粘贴或输入批量内容
  ↓
点击"解析"
  ↓
系统识别场景
  ↓
[可选] 调整间隔时间
  ↓
点击"批量生成"
  ↓
显示进度条
  ↓
传递场景数据和间隔时间给父组件
```

## 📊 Props 接口

```typescript
interface ManualSceneInputDialogProps {
  isOpen: boolean;                                    // 对话框是否打开
  onClose: () => void;                               // 关闭对话框
  onConfirm: (scenes: Scene[]) => void;              // 确认脚本
  onGenerate: (scenes: Scene[], batchInterval?: number) => void;  // 生成画面
  lang: 'zh' | 'en';                                 // 语言
  theme: 'dark' | 'light';                           // 主题
}

interface Scene {
  id: string;
  visualPrompt: string;
}
```

## 🌐 多语言支持

所有文本都支持中英文：
- 按钮文本
- 标签文本
- 占位符文本
- 提示信息
- 模板内容

## 🎯 关键特性

| 特性 | 说明 |
|------|------|
| 模式切换 | 单个/批量模式一键切换 |
| 模板下载 | 预制模板一键下载 |
| 格式识别 | 自动识别 `<<<>>>` 标记 |
| 间隔控制 | 500ms - 10000ms 可调 |
| 进度显示 | 实时显示生成进度 |
| 主题支持 | 深色/浅色主题 |
| 多语言 | 中文/英文完全支持 |

## 📝 使用示例

```typescript
import ManualSceneInputDialog from './components/ManualSceneInputDialog';

// 在父组件中使用
<ManualSceneInputDialog
  isOpen={showDialog}
  onClose={() => setShowDialog(false)}
  onConfirm={(scenes) => {
    // 保存场景到状态
    setScenes(scenes);
  }}
  onGenerate={(scenes, batchInterval) => {
    // 生成画面
    handleGenerateFromManualScenes(scenes, batchInterval);
  }}
  lang="zh"
  theme="dark"
/>
```

## 🚀 集成步骤

1. ✅ 组件已创建：`components/ManualSceneInputDialog.tsx`
2. ⏳ 需要在 App.tsx 中导入和使用
3. ⏳ 需要实现 `handleGenerateFromManualScenes` 函数
4. ⏳ 需要在 SidebarRight 中添加"生成画面"按钮

## 📚 相关文档

- `BATCH_SCENE_FORMAT_TEMPLATE.md` - 格式模板详细说明
- `MANUAL_SCENE_BATCH_GENERATION_DESIGN.md` - 设计文档
- `BATCH_TEMPLATE_DOWNLOAD_FEATURE.md` - 模板下载功能说明
- `MANUAL_SCENE_INPUT_IMPLEMENTATION_SUMMARY.md` - 实现总结

## ✅ 完成清单

- [x] 创建 ManualSceneInputDialog 组件
- [x] 实现单个输入模式
- [x] 实现批量输入模式
- [x] 实现模板下载功能
- [x] 支持中英文
- [x] 支持深色/浅色主题
- [x] 添加间隔时间控制
- [x] 添加进度显示
- [ ] 在 App.tsx 中集成
- [ ] 实现批量生成处理函数
- [ ] 实现自动下载功能
- [ ] 在 SidebarRight 中添加按钮

