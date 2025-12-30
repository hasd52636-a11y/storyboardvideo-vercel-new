# 分镜数选择器完全删除 (Frame Count Selector Complete Removal)

## 修改内容

### 1. 删除所有分镜数选择器UI
- 删除了对话输入框下方的分镜数选择器UI代码
- 删除了 `chatFrameCount` 状态变量
- 将分镜数固定为 1

### 2. 代码变更

**删除的状态变量**:
```typescript
// 之前
const [chatFrameCount, setChatFrameCount] = useState(1);

// 之后
// 已删除
```

**修改的函数调用**:
```typescript
// 之前
const scenes = await generateStoryboardFromDialogue(
  chatHistory, 
  chatFrameCount,  // 使用变量
  ...
);

// 之后
const scenes = await generateStoryboardFromDialogue(
  chatHistory, 
  1,  // 使用固定值
  ...
);
```

## 修改文件
- `components/SidebarRight.tsx`

## 部署状态
✅ 代码已修改
✅ 已直接推送到Vercel生产环境
✅ 预计立即生效

## 用户操作
如果还是看到分镜数选择器，请：
1. **硬刷新页面**: Ctrl+F5 (Windows) 或 Cmd+Shift+R (Mac)
2. **清除浏览器缓存**: Ctrl+Shift+Delete
3. **在隐私窗口中打开**: 确保没有缓存

## 验证
代码中已确认：
- ✅ 没有分镜数选择器的UI代码
- ✅ 没有 `chatFrameCount` 状态变量
- ✅ 分镜数固定为 1
- ✅ 构建成功，无错误
