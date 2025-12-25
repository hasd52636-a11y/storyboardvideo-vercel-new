# 🧪 立即测试导出功能

**测试时间**: 现在  
**版本**: v3.1 (已部署)  
**网址**: https://sora.wboke.com

---

## 🚀 快速测试 (5 分钟)

### 步骤 1: 打开应用

访问 **https://sora.wboke.com**

### 步骤 2: 生成分镜图

1. 点击左侧"生成分镜"
2. 输入提示词或选择风格
3. 等待 3 张分镜图生成

### 步骤 3: 选中所有分镜

- 按 **Ctrl+A** 或手动选择

### 步骤 4: 导出 JPEG

- 右键 → "导出 JPEG"
- 或点击右侧"导出"按钮

### 步骤 5: 打开浏览器控制台

- 按 **F12**
- 点击 **Console** 标签

### 步骤 6: 查看日志

**预期日志**:
```
Loading frame 1/3: https://maas-watermark-prod...
Image load failed: https://maas-watermark-prod...
Retrying with CORS proxy 1...
✓ Image drawn successfully: https://cors.bridged.cc/...
```

### 步骤 7: 验证结果

**✅ 成功**:
- 图片正常加载
- 没有蓝色框
- 文件成功下载
- 打开 JPEG 看到实际的分镜图片

**⚠️ 占位符**:
- 显示灰色框
- 仍然显示场景编号
- 这说明 CORS 代理不可用

**❌ 失败**:
- 导出失败
- 浏览器显示错误
- 查看控制台错误信息

---

## 📊 测试结果记录

### 测试 1: 导出分镜图

**日期**: ___________  
**时间**: ___________  
**浏览器**: ___________

**结果**:
- [ ] ✅ 图片正常加载
- [ ] ⚠️ 显示占位符
- [ ] ❌ 导出失败

**日志**:
```
(复制粘贴控制台日志)
```

**备注**:
___________

---

## 🔍 常见情况

### 情况 1: 图片正常加载 ✅

**日志**:
```
Image load failed: https://maas-watermark-prod...
Retrying with CORS proxy 1...
✓ Image drawn successfully: https://cors.bridged.cc/...
```

**结果**: 修复成功！用户看到实际的分镜图片

---

### 情况 2: 显示占位符 ⚠️

**日志**:
```
Image load failed: https://maas-watermark-prod...
Retrying with CORS proxy 1...
Image load failed: https://cors.bridged.cc/...
Retrying with CORS proxy 2...
Image load failed: https://api.allorigins.win/...
⚠ Frame 1 image failed to load, showing placeholder
```

**结果**: CORS 代理都不可用，显示占位符

**解决方案**:
1. 等待一段时间后重试
2. 检查网络连接
3. 尝试其他浏览器

---

### 情况 3: 导出失败 ❌

**日志**:
```
Both toBlob and toDataURL failed: ...
```

**结果**: Canvas 被污染或其他错误

**解决方案**:
1. 减少分镜数量
2. 清除浏览器缓存
3. 使用其他浏览器

---

## 📞 反馈

### 如果成功 ✅

请告诉我:
1. 图片是否正常显示
2. 是否看到蓝色框
3. 导出的 JPEG 质量如何

### 如果失败 ❌

请提供:
1. 浏览器版本
2. 完整的控制台日志
3. 具体的错误信息

---

## 🎯 关键问题

**问题**: 导出分镜图显示蓝色框而不是实际图片

**修复**: 添加 CORS 代理支持

**预期**: 图片应该正常加载

**验证**: 打开导出的 JPEG，看是否有实际的分镜图片

---

**测试指南**: 2025-12-25  
**版本**: v3.1  
**状态**: 已部署，等待测试

现在就去测试吧！🚀

