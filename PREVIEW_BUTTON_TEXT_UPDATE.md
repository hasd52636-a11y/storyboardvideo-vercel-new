# 预览按钮文本更新 (Preview Button Text Update)

## 修改内容

### 1. 预览按钮文本更新
- **中文**: "👁️ 预览" → "👁️ 预览脚本"
- **英文**: "👁️ Preview" → "👁️ Preview Script"

### 2. 按钮功能确认
两个按钮都调用同一个函数 `handleGenerateStoryboard()`：
- **👁️ 预览脚本** 按钮：预览生成的脚本（显示对话框）
- **生成脚本** 按钮：生成脚本并预览（显示对话框）

## 修改文件
- `components/SidebarRight.tsx` - 第896行

## 代码变更
```typescript
// 之前
{isLoading ? (lang === 'zh' ? '预览中...' : 'Previewing...') : (lang === 'zh' ? '👁️ 预览' : '👁️ Preview')}

// 之后
{isLoading ? (lang === 'zh' ? '预览中...' : 'Previewing...') : (lang === 'zh' ? '👁️ 预览脚本' : '👁️ Preview Script')}
```

## 部署状态
✅ 代码已推送到GitHub
✅ Vercel自动部署已触发
✅ 预计在1-2分钟内生效

## 用户操作
请清除浏览器缓存或在新标签页中打开网站，即可看到更新后的按钮文本。

### 清除缓存方法
- **Chrome**: Ctrl+Shift+Delete (Windows) 或 Cmd+Shift+Delete (Mac)
- **Firefox**: Ctrl+Shift+Delete (Windows) 或 Cmd+Shift+Delete (Mac)
- **Safari**: 开发者菜单 → 清空缓存

或者直接按 **Ctrl+F5** (Windows) 或 **Cmd+Shift+R** (Mac) 进行硬刷新。
