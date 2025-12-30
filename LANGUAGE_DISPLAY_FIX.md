# 语言显示修复 - Task 16 完成

## 总结
移除了预览对话框和提示词中的英文显示。现在只根据用户的语言选择显示当前语言的内容。

## 修复内容

### 1. 修复 StoryboardPreviewDialog.tsx
- **问题**: 预览对话框中显示了英文版本的提示词（visualPromptEn 和 videoPromptEn）
- **修复**: 只显示中文版本（visualPromptZh 和 videoPromptZh）
- **结果**: 预览对话框现在只显示中文内容，不再混杂英文

### 2. 修复 App.tsx 中的 getOptimizedPrompts()
- **修改**: 函数现在接受 `lang` 参数并返回单一语言的字符串
- **签名**: `getOptimizedPrompts(targetLang: Language = lang) => string`
- **行为**: 
  - 当 `lang === 'zh'` 时：返回仅中文内容
  - 当 `lang === 'en'` 时：返回仅英文内容
  - 默认使用当前 `lang` 参数

### 3. 修复 SidebarRight.tsx
- **移除**: 预览模态框中的语言切换按钮（中文 / English）
- **移除**: `previewLang` 状态变量
- **更新**: 预览提示词按钮直接使用 `getFormattedPrompts()` 而不需要语言选择
- **结果**: 预览模态框现在只显示当前语言

### 4. 修复 VideoGenDialog.tsx
- **修改**: `optimizedPrompts` 属性类型从 `{ zh: string; en: string }` 改为 `string`
- **更新**: 默认值从 `{ zh: '', en: '' }` 改为 `''`

## 用户需求满足
✅ "用户给什么语言就加工什么语言" (只处理用户提供的语言)
✅ 预览对话框中不再显示英文翻译
✅ 预览提示词对话框中不再显示英文翻译

## 修改的文件
- `App.tsx` - 修改 `getOptimizedPrompts()` 函数及其调用
- `components/SidebarRight.tsx` - 移除语言切换，移除 `previewLang` 状态
- `components/StoryboardPreviewDialog.tsx` - 只显示中文提示词
- `components/VideoGenDialog.tsx` - 更新 `optimizedPrompts` 属性类型

## 构建状态
✅ 构建成功 (4.38s)
✅ 没有引入新的编译错误
✅ 已准备好部署
