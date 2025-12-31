# 手动场景输入对话框实现总结

## 已完成的工作

### 1. 创建了 ManualSceneInputDialog 组件
- **文件**: `components/ManualSceneInputDialog.tsx`
- **功能**:
  - 支持单个输入模式和批量输入模式切换
  - 单个模式：逐个添加/编辑场景
  - 批量模式：使用 `<<<>>>` 标记批量输入
  - 批量模式支持间隔时间调整（500ms - 10000ms）
  - 显示生成进度条
  - 支持中文和英文

### 2. 创建了格式模板文档
- **文件**: `BATCH_SCENE_FORMAT_TEMPLATE.md`
- **内容**:
  - 批量输入格式说明
  - 推荐使用 `<<<>>>` 标记
  - 解析规则和正则表达式
  - 用户体验流程

### 3. 创建了设计文档
- **文件**: `MANUAL_SCENE_BATCH_GENERATION_DESIGN.md`
- **内容**:
  - 关键设计决策
  - 图片比例和风格来源说明
  - 间隔时间控制
  - 生成流程
  - 实现细节
  - 自动下载实现方案

## 关键设计决策

### ✅ 图片比例和风格由脚本创作决定
- 不在对话框中重复选择
- 使用脚本创作标签页中已选择的 `chatStyle` 和 `chatAspectRatio`
- 简化了对话框的UI

### ✅ 间隔时间仅在批量模式显示
- 单个模式不显示间隔时间控制
- 批量模式显示滑块和快速按钮
- 默认2秒，范围500ms-10000ms

### ✅ 批量输入格式清晰
- 使用 `<<<>>>` 标记分隔场景
- 支持多行描述
- 自动去除空白
- 易于识别和解析

## 待实现的工作

### 1. 在 App.tsx 中集成对话框
- [ ] 添加对话框状态管理
- [ ] 导入 ManualSceneInputDialog 组件
- [ ] 实现 `handleGenerateFromManualScenes` 函数
- [ ] 处理批量生成逻辑

### 2. 实现批量生成处理函数
- [ ] 创建占位符卡片
- [ ] 使用间隔时间顺序生成图片
- [ ] 更新进度显示
- [ ] 处理生成错误

### 3. 实现自动下载功能
- [ ] 生成完成后自动下载
- [ ] 支持 ZIP 打包或逐个下载
- [ ] 显示下载进度

### 4. 在 SidebarRight 中添加"生成画面"按钮
- [ ] 替换或补充现有的脚本生成按钮
- [ ] 点击打开 ManualSceneInputDialog
- [ ] 传递必要的 props（lang, theme, onGenerate 等）

### 5. 移除脚本生成相关功能
- [ ] 移除脚本预览对话框
- [ ] 移除脚本生成相关的 UI
- [ ] 清理相关的函数和状态

## 组件接口

### ManualSceneInputDialog Props

```typescript
interface ManualSceneInputDialogProps {
  isOpen: boolean;                                    // 对话框是否打开
  onClose: () => void;                               // 关闭对话框
  onConfirm: (scenes: Scene[]) => void;              // 确认脚本（保存到状态）
  onGenerate: (scenes: Scene[], batchInterval?: number) => void;  // 生成画面
  lang: 'zh' | 'en';                                 // 语言
  theme: 'dark' | 'light';                           // 主题
}

interface Scene {
  id: string;
  visualPrompt: string;
}
```

## 使用示例

### 在 App.tsx 中使用

```typescript
// 1. 添加状态
const [showManualSceneDialog, setShowManualSceneDialog] = useState(false);

// 2. 导入组件
import ManualSceneInputDialog from './components/ManualSceneInputDialog';

// 3. 实现处理函数
const handleGenerateFromManualScenes = useCallback(
  async (scenes: Scene[], batchInterval?: number) => {
    // 使用 chatStyle 和 chatAspectRatio 生成图片
    // 使用 batchInterval 控制间隔
  },
  [chatStyle, chatAspectRatio, ...]
);

// 4. 在 JSX 中使用
<ManualSceneInputDialog
  isOpen={showManualSceneDialog}
  onClose={() => setShowManualSceneDialog(false)}
  onConfirm={(scenes) => {
    // 保存场景到状态
  }}
  onGenerate={handleGenerateFromManualScenes}
  lang={lang}
  theme={theme}
/>
```

## 下一步

1. 在 App.tsx 中添加对话框状态和处理函数
2. 在 SidebarRight 中添加"生成画面"按钮
3. 实现 `handleGenerateFromManualScenes` 函数
4. 实现自动下载功能
5. 测试单个和批量生成流程
6. 部署到 Vercel

