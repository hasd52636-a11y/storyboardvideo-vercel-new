# SidebarRight.tsx 功能重新组织总结

## 概述
已成功重新组织 `components/SidebarRight.tsx` 中的功能分配，将原有的两个 Tab（'script' 和 'chat'）改为 'scriptCreation' 和 'videoEdit'，并重新分配了所有功能。

## 主要改动

### 1. Tab 状态更新
**文件位置**: 第 35 行

**改动前**:
```typescript
const [activeTab, setActiveTab] = useState<'script' | 'chat'>('chat');
```

**改动后**:
```typescript
const [activeTab, setActiveTab] = useState<'scriptCreation' | 'videoEdit'>('scriptCreation');
```

### 2. toggleSidebar 函数更新
**文件位置**: 第 391-401 行

**改动前**:
```typescript
const toggleSidebar = (tab?: 'script' | 'chat') => {
```

**改动后**:
```typescript
const toggleSidebar = (tab?: 'scriptCreation' | 'videoEdit') => {
```

### 3. Tab 按钮标签和图标更新
**文件位置**: 第 410-427 行

**改动内容**:
- 第一个按钮：从 `t.scriptMode` 改为 `'脚本创作' / 'Script Creation'`，图标从 `📄` 改为 `✍️`
- 第二个按钮：从 `t.chatMode` 改为 `'视频编辑' / 'Video Edit'`，图标从 `💬` 改为 `🎬`

### 4. Tab 内容重新组织

#### 4.1 videoEdit Tab（原 'script' Tab）
**文件位置**: 第 433-535 行

**包含功能**:
1. ✅ 生成配置
   - 分镜数量选择（frameCount）
   - 风格选择（scriptStyle）
   - 时长设置（scriptDuration）
   - 画面比例选择（scriptAspectRatio）

2. ✅ 导出分镜功能（onExportJPEG）

3. ✅ 生成视频按钮（onGenerateVideo）

4. ✅ 预览提示词（showPreviewModal）

5. ✅ 导出提示词（onExportPrompts）

#### 4.2 scriptCreation Tab（原 'chat' Tab）
**文件位置**: 第 536-800+ 行

**包含功能**:
1. ✅ 生成配置
   - 分镜数量选择（frameCount）- 用于将内容拆分成多个画面
   - 画面比例选择（chatAspectRatio）

2. ✅ 对话功能
   - 聊天历史显示（chatHistory）
   - 聊天输入框（chatInput）
   - 发送按钮（handleSendChat）
   - 清除历史按钮（setChatHistory）

3. ✅ 智慧客服（isHelpMode）
   - 切换按钮，可启用/禁用帮助模式

4. ✅ 使用说明（onOpenHelp）
   - 独立按钮，点击打开完整使用说明

5. ✅ 附件功能
   - 图片上传（📎 按钮）
   - 截图功能（📸 按钮）
   - 图片预览和导航
   - 图片元数据显示

6. ✅ 生成分镜按钮（handleGenerateStoryboard）
   - 位于对话区域底部
   - 根据对话内容生成分镜

## 状态变量分配

### videoEdit Tab 使用的状态:
- `scriptStyle` - 风格选择
- `scriptDuration` - 时长
- `scriptAspectRatio` - 画面比例
- `showPreviewModal` - 预览模态框
- `editablePrompts` - 可编辑的提示词
- `previewLang` - 预览语言

### scriptCreation Tab 使用的状态:
- `chatInput` - 聊天输入
- `chatHistory` - 聊天历史
- `isChatLoading` - 加载状态
- `isHelpMode` - 帮助模式
- `showChatGuide` - 聊天指南显示
- `chatFrameCount` - 分镜数量（用于将内容拆分成多个画面）
- `chatAspectRatio` - 画面比例
- `attachedImage` - 附加图片状态
- `isScreenshotAnalysis` - 截图分析标记

## 功能处理函数

### scriptCreation Tab 相关函数:
- `handleImageSelect()` - 处理图片选择
- `handleRemoveImage()` - 移除图片
- `handleScreenshot()` - 截图功能
- `handleSendChat()` - 发送聊天消息
- `handleGenerateStoryboard()` - 生成分镜

### videoEdit Tab 相关函数:
- `onGenerateFromScript()` - 从脚本生成
- `onExportPrompts()` - 导出提示词
- `onExportJPEG()` - 导出JPEG
- `onGenerateVideo()` - 生成视频

## 代码质量检查

✅ **无语法错误** - 通过 TypeScript 诊断检查
✅ **类型安全** - 所有 Tab 类型引用已更新
✅ **功能完整** - 所有原有功能保留
✅ **结构清晰** - Tab 功能分配逻辑清晰

## 默认 Tab

- **默认打开**: `scriptCreation` Tab
- **原因**: 用户通常先进行脚本创作和对话，然后进行视频编辑

## 向后兼容性

所有原有的 Props 和回调函数保持不变：
- `onGenerateFromScript`
- `onExportPrompts`
- `onExportJPEG`
- `onGenerateFromDialogue`
- `onGenerateVideo`
- `onOpenHelp`
- `onStyleChange`
- `onAspectRatioChange`

## 测试建议

1. ✅ 验证两个 Tab 的切换功能
2. ✅ 验证 scriptCreation Tab 中的对话功能
3. ✅ 验证 videoEdit Tab 中的生成配置
4. ✅ 验证图片上传和截图功能
5. ✅ 验证生成分镜按钮的功能
6. ✅ 验证导出功能（JPEG、提示词）
7. ✅ 验证智慧客服和使用说明按钮

## 文件统计

- **总行数**: 980 行
- **修改行数**: ~50 行（主要是 Tab 名称和结构调整）
- **新增功能**: 0（仅重新组织）
- **删除功能**: 0（所有功能保留）
