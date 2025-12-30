# 分镜数量配置重新定位

## 更新说明

根据用户反馈，分镜数量配置已从 `videoEdit` Tab 移到 `scriptCreation` Tab。

**原因**: 分镜数量用于将内容拆分成多个画面，这是脚本创作过程中的一部分，而不是视频编辑的配置。

---

## 改动详情

### 脚本创作 Tab (scriptCreation) - 新增
- ✅ 分镜数量选择（1-16）
  - 位置：生成配置区域顶部
  - 功能：用于将对话内容拆分成多个画面
  - 控制：+/- 按钮或直接输入

### 视频编辑 Tab (videoEdit) - 移除
- ❌ 分镜数量选择已移除
- ✅ 保留：风格选择、时长设置、画面比例选择

---

## 新的 Tab 结构

### 脚本创作 Tab (scriptCreation)
```
┌─ 生成配置
│  ├─ 分镜数量 (1-16) ← 新增
│  └─ 画面比例 (16:9, 4:3, ...)
├─ 智慧客服
├─ 使用说明
├─ 对话功能
│  ├─ 聊天历史
│  ├─ 聊天输入
│  ├─ 发送/清除按钮
│  └─ 附件功能
└─ 生成分镜按钮
```

### 视频编辑 Tab (videoEdit)
```
┌─ 生成配置
│  ├─ 风格选择
│  ├─ 时长设置
│  └─ 画面比例
├─ 导出分镜
├─ 生成视频
├─ 预览提示词
└─ 导出提示词
```

---

## 状态变量更新

### 脚本创作 Tab 现在使用
- `chatFrameCount` - 分镜数量（新增）
- `chatAspectRatio` - 画面比例
- `chatHistory` - 聊天历史
- `chatInput` - 聊天输入
- `isHelpMode` - 帮助模式
- `attachedImage` - 附加图片

### 视频编辑 Tab 现在使用
- `scriptStyle` - 风格选择
- `scriptDuration` - 时长
- `scriptAspectRatio` - 画面比例
- `showPreviewModal` - 预览模态框
- `editablePrompts` - 可编辑提示词

---

## 工作流改进

### 之前的流程
1. 在脚本创作中进行对话
2. 切换到视频编辑
3. 设置分镜数量
4. 生成分镜

### 现在的流程
1. 在脚本创作中设置分镜数量
2. 进行对话
3. 生成分镜
4. 切换到视频编辑进行后续处理

**优势**: 更符合逻辑流程，用户在创作阶段就能决定内容如何拆分

---

## 部署信息

- **部署时间**: 2025-12-30
- **部署链接**: https://sora.wboke.com
- **构建状态**: ✅ 成功
- **测试状态**: 待验证

---

## 验证清单

- [x] 分镜数量从 videoEdit 移到 scriptCreation
- [x] 状态变量正确更新
- [x] 构建成功
- [x] 部署成功
- [ ] 用户验证功能正常
- [ ] 用户验证工作流符合预期

---

## 相关文件

- `components/SidebarRight.tsx` - 主要修改文件
- `SIDEBAR_REORGANIZATION_SUMMARY.md` - 重新组织总结
- `VERIFICATION_CHECKLIST.md` - 验证清单
- `TESTING_GUIDE.md` - 测试指南
- `DEPLOYMENT_COMPLETE.md` - 部署完成报告

