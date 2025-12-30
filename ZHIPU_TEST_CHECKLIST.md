# 智谱 AI 配置测试清单

## ✅ 配置验证

### 步骤 1: 获取 API Key
- [ ] 访问 https://open.bigmodel.cn
- [ ] 注册或登录账户
- [ ] 进入 API 密钥管理页面
- [ ] 创建新的 API 密钥
- [ ] 复制 API 密钥（格式: `sk-...`）

### 步骤 2: 在应用中配置
- [ ] 打开应用
- [ ] 点击左侧菜单的 **"设置"** 按钮
- [ ] 选择 **"对话及图像API"** 标签页
- [ ] 在 **"服务商"** 下拉菜单中选择 **"智谱 AI (ChatGLM)"**
- [ ] 验证自动填充的配置：
  - [ ] Base URL: `https://open.bigmodel.cn/api/paas/v4`
  - [ ] LLM Model: `glm-4`
  - [ ] Image Model: `cogview-4-250304`
- [ ] 粘贴 API Key 到输入框
- [ ] 点击 **"测试连接"** 按钮

### 步骤 3: 验证测试结果
- [ ] 等待测试完成（通常 2-5 秒）
- [ ] 看到 **"✓ 连接成功"** 提示
- [ ] 点击 **"保存配置"** 按钮

---

## 🧪 功能测试

### 测试 1: 对话功能 (LLM)
1. [ ] 打开应用
2. [ ] 在右侧边栏选择 **"创意对话"** 标签页
3. [ ] 输入一个简单的提示词，例如：
   ```
   一只老虎在森林里奔跑
   ```
4. [ ] 点击 **"生成分镜"** 按钮
5. [ ] 观察浏览器控制台（F12 打开开发者工具）
6. [ ] 查找日志：`[generateVideoPromptFromVisual] Using OpenAI-compatible API`
7. [ ] 验证生成的视频提示词是否合理

**预期结果**: 应该看到生成的视频提示词包含动作、表情、光线等描述

### 测试 2: 图片生成
1. [ ] 在右侧边栏选择 **"剧本生成"** 标签页
2. [ ] 输入一个剧本，例如：
   ```
   一只威武的老虎站在森林中，周围的树木和草地在阳光的照射下闪闪发光。
   ```
3. [ ] 设置分镜数量为 1
4. [ ] 点击 **"开始生成"** 按钮
5. [ ] 观察浏览器控制台
6. [ ] 查找日志：`[generateSceneImage] Using OpenAI-compatible API`
7. [ ] 等待图片生成完成（通常 10-30 秒）

**预期结果**: 应该看到生成的分镜画面

### 测试 3: 性能对比
1. [ ] 记录生成时间
2. [ ] 与其他提供商（如 Gemini、神马）对比
3. [ ] 智谱通常应该是最快的

**预期结果**: 智谱生成速度应该比其他提供商快

---

## 🔍 调试信息

### 查看浏览器控制台日志

打开浏览器开发者工具（F12），查看 Console 标签页，应该看到类似的日志：

```
[generateVideoPromptFromVisual] Starting chat send
[generateVideoPromptFromVisual] Using OpenAI-compatible API
[generateVideoPromptFromVisual] Base URL: https://open.bigmodel.cn/api/paas/v4
[generateVideoPromptFromVisual] Generated video prompt: ...
```

或

```
[generateSceneImage] Starting image generation
[generateSceneImage] Using OpenAI-compatible API
[generateSceneImage] Base URL: https://open.bigmodel.cn/api/paas/v4
[generateSceneImage] Calling generations endpoint: ...
[generateSceneImage] Image URL received: ...
```

### 常见错误及解决方案

| 错误 | 原因 | 解决方案 |
|------|------|--------|
| `401 Unauthorized` | API Key 无效 | 检查 API Key 是否正确复制 |
| `403 Forbidden` | 无权限访问 | 检查账户是否有足够的配额 |
| `429 Too Many Requests` | 请求过于频繁 | 等待几分钟后重试 |
| `CORS Error` | 跨域请求被阻止 | 这是浏览器安全限制，API 调用仍可能成功 |
| `Network Error` | 网络连接问题 | 检查网络连接，重试 |

---

## 📊 性能基准

### 预期性能指标

| 操作 | 预期时间 | 说明 |
|------|---------|------|
| 测试连接 | 2-5 秒 | 验证 API Key 有效性 |
| 生成视频提示词 | 3-8 秒 | 调用 LLM 生成提示词 |
| 生成单张图片 | 10-30 秒 | 调用图片生成 API |
| 生成 4 张图片 | 40-120 秒 | 顺序生成多张图片 |

---

## ✨ 成功标志

当你看到以下情况时，说明智谱配置成功：

1. ✅ 测试连接显示 **"✓ 连接成功"**
2. ✅ 生成分镜时，浏览器控制台显示 `Using OpenAI-compatible API`
3. ✅ 生成的视频提示词包含合理的动作和表情描述
4. ✅ 生成的分镜画面质量良好
5. ✅ 生成速度比其他提供商快

---

## 🆘 需要帮助？

如果遇到问题，请检查：

1. **API Key 有效性**
   - 访问 https://open.bigmodel.cn 验证 API Key
   - 确保 API Key 没有过期

2. **账户配额**
   - 登录智谱账户
   - 检查剩余配额
   - 如果配额不足，需要充值

3. **网络连接**
   - 检查网络连接是否正常
   - 尝试访问 https://open.bigmodel.cn 验证网络

4. **浏览器控制台**
   - 打开 F12 开发者工具
   - 查看 Console 标签页的错误信息
   - 复制错误信息用于调试

---

## 📝 测试记录

| 日期 | 测试项 | 结果 | 备注 |
|------|--------|------|------|
| | 配置验证 | ✅/❌ | |
| | 对话功能 | ✅/❌ | |
| | 图片生成 | ✅/❌ | |
| | 性能测试 | ✅/❌ | |

---

**最后更新**: 2025-12-29
**状态**: 就绪
