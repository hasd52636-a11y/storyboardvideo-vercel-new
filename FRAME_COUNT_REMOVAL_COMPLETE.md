# 分镜数选择功能重新定位 (Frame Count Selector Relocation)

## 任务完成

用户要求：
- 删除"生成配置"部分中的分镜数选择（上面）
- 保留对话输入框下方的分镜数选择（下面）

## 改动详情

### 1. 删除生成配置中的分镜数选择 (components/SidebarRight.tsx)

**删除的代码**:
- 移除了"生成配置"部分中的分镜数选择UI
  - 标签: "分镜数 / Frame Count"
  - 减少按钮 (−)
  - 输入框 (显示当前值)
  - 增加按钮 (+)

### 2. 在对话输入框下方添加分镜数选择 (components/SidebarRight.tsx)

**新增的代码**:
- 在对话输入框和生成按钮之间添加分镜数选择器
- 位置：对话输入框下方，生成按钮上方
- 功能：用户可以调整分镜数量（1-16）
- 控制：+/- 按钮或直接输入

**新增位置**:
```typescript
<div className="space-y-2 px-4 py-3 flex-shrink-0 border-t">
  {/* Frame Count Selector - Between input and buttons */}
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-black uppercase opacity-50">
      <span>{lang === 'zh' ? '分镜数' : 'Frame Count'}</span>
      <span>{chatFrameCount}</span>
    </div>
    <div className="flex gap-2">
      <button onClick={() => setChatFrameCount(Math.max(1, chatFrameCount - 1))}>−</button>
      <input type="number" min="1" max="16" value={chatFrameCount} onChange={...} />
      <button onClick={() => setChatFrameCount(Math.min(16, chatFrameCount + 1))}>+</button>
    </div>
  </div>
</div>
```

## 验证

✅ TypeScript 编译成功 - 无诊断错误
✅ npm run build 成功 - 构建完成
✅ 分镜数选择器正确重新定位
✅ 代码逻辑正确

## 用户体验变化

**之前**:
- 分镜数选择在"生成配置"部分（上面）
- 用户需要向上滚动才能看到

**之后**:
- 分镜数选择在对话输入框下方（下面）
- 用户在输入对话后立即可以调整分镜数
- 更符合工作流逻辑

## 部署状态

✅ 已准备好部署到生产环境
✅ 构建成功，无错误或警告
✅ 所有改动已验证

