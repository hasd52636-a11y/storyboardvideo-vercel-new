# 智谱 GLM 配置检查清单

## 📋 配置前检查

### 环境要求

- [ ] 现代浏览器（Chrome, Firefox, Safari, Edge）
- [ ] 稳定的网络连接
- [ ] 智谱账户已创建

### 账户准备

- [ ] 已注册智谱账户
- [ ] 账户已激活
- [ ] 已获得 API Key

---

## 🔧 配置步骤

### 步骤 1：获取 API Key

**位置**：https://open.bigmodel.cn/usercenter/apikeys

**操作**：
1. [ ] 登录智谱账户
2. [ ] 进入 API 密钥管理页面
3. [ ] 点击 "创建新的 API Key"
4. [ ] 复制生成的 API Key
5. [ ] 保存到安全的地方

**验证**：
- [ ] API Key 格式正确（通常以 `sk-` 开头）
- [ ] API Key 长度合理（通常 50+ 字符）

### 步骤 2：在应用中配置

**位置**：应用 → ⚙️ 系统设置 → API 接口配置

**操作**：
1. [ ] 打开应用
2. [ ] 点击右上角 ⚙️ 图标
3. [ ] 选择 "API 接口配置"
4. [ ] 在对话框中选择 "智谱 GLM (推荐)"
5. [ ] 点击 "👉 点击获取 API Key" 按钮
6. [ ] 在新标签页中获取 API Key
7. [ ] 回到应用，粘贴 API Key
8. [ ] 点击 "✨ 测试连接"

**验证**：
- [ ] 看到 ✅ 连接成功提示
- [ ] 显示剩余配额信息
- [ ] 没有错误提示

### 步骤 3：保存配置

**自动保存**：
- [ ] 配置自动保存到浏览器本地存储
- [ ] 刷新页面后配置仍然存在

**手动验证**：
```javascript
// 在浏览器控制台执行
localStorage.getItem('sora_api_key_zhipu')
// 应该返回你的 API Key
```

---

## ✅ 功能验证

### 验证 1：API 连接

**测试方法**：
1. [ ] 打开 API 配置对话框
2. [ ] 点击 "✨ 测试连接"
3. [ ] 等待 3-5 秒

**预期结果**：
- [ ] ✅ 连接成功
- [ ] 显示配额信息
- [ ] 没有错误提示

### 验证 2：图片分析

**测试方法**：
1. [ ] 上传一张参考图片
2. [ ] 打开浏览器控制台（F12）
3. [ ] 查看是否有分析日志

**预期结果**：
- [ ] 看到 `[ZhipuService] Analyzing image...` 日志
- [ ] 图片被成功分析
- [ ] 返回分析结果

**调试**：
```javascript
// 在浏览器控制台查看
console.log('[ZhipuService]')
```

### 验证 3：视频生成

**测试方法**：
1. [ ] 输入简单的视频提示词
   - 例如："A cat playing with a ball"
2. [ ] 点击生成视频
3. [ ] 打开浏览器控制台（F12）
4. [ ] 查看是否有生成日志

**预期结果**：
- [ ] 看到 `[ZhipuService] Generating video...` 日志
- [ ] 返回任务 ID
- [ ] 开始轮询查询状态

**调试**：
```javascript
// 在浏览器控制台查看
console.log('[Video Polling]')
```

### 验证 4：视频轮询

**测试方法**：
1. [ ] 生成视频后，等待轮询
2. [ ] 打开浏览器控制台（F12）
3. [ ] 观察轮询日志

**预期结果**：
- [ ] 看到定期的轮询日志
- [ ] 状态从 PROCESSING 变为 SUCCESS
- [ ] 返回视频 URL

**调试**：
```javascript
// 在浏览器控制台查看轮询日志
console.log('[Video Polling #')
```

---

## 🐛 常见问题排查

### 问题 1：连接失败 - "API Key 无效"

**检查清单**：
- [ ] API Key 是否完整复制（没有多余空格）
- [ ] API Key 是否过期
- [ ] API Key 是否来自正确的账户

**解决方案**：
1. 重新访问 https://open.bigmodel.cn/usercenter/apikeys
2. 创建新的 API Key
3. 重新粘贴并测试

### 问题 2：连接失败 - "无权限访问"

**检查清单**：
- [ ] 账户是否已激活
- [ ] 是否有使用 GLM-4.6V 的权限
- [ ] 是否有使用 CogVideoX-3 的权限

**解决方案**：
1. 登录智谱账户
2. 检查账户权限设置
3. 联系智谱客服

### 问题 3：视频生成失败

**检查清单**：
- [ ] 提示词是否包含敏感内容
- [ ] 账户配额是否充足
- [ ] 网络连接是否正常

**解决方案**：
1. 查看浏览器控制台的错误信息
2. 修改提示词，避免敏感内容
3. 检查账户配额

### 问题 4：轮询超时

**检查清单**：
- [ ] 网络连接是否稳定
- [ ] 浏览器是否保持打开
- [ ] 是否有防火墙阻止

**解决方案**：
1. 检查网络连接
2. 保持浏览器打开
3. 检查防火墙设置

---

## 📊 配置信息验证

### 验证 API 端点

```javascript
// 在浏览器控制台执行
const baseUrl = 'https://open.bigmodel.cn/api/paas/v4';
console.log('Video Generation Endpoint:', baseUrl + '/videos/generations');
console.log('Chat Completion Endpoint:', baseUrl + '/chat/completions');
```

### 验证本地存储

```javascript
// 在浏览器控制台执行
console.log('API Key:', localStorage.getItem('sora_api_key_zhipu'));
console.log('Provider:', localStorage.getItem('video_api_provider'));
console.log('Base URL:', localStorage.getItem('sora_base_url_zhipu'));
```

### 验证模型信息

```javascript
// 在浏览器控制台执行
console.log('Image Analysis Model: GLM-4.6V');
console.log('Video Generation Model: CogVideoX-3');
console.log('API Base URL: https://open.bigmodel.cn/api/paas/v4');
```

---

## 🚀 配置完成后

### 立即可用的功能

- [ ] 图片分析（GLM-4.6V）
- [ ] 视频生成（CogVideoX-3）
- [ ] 异步视频生成和轮询
- [ ] 多提供商切换

### 推荐的下一步

1. [ ] 阅读 `ZHIPU_INTEGRATION_GUIDE.md`
2. [ ] 阅读 `ZHIPU_QUICK_SETUP.md`
3. [ ] 尝试生成第一个视频
4. [ ] 探索高级功能

---

## 📞 获取帮助

### 官方资源

- **API 文档**：https://open.bigmodel.cn/dev/api
- **API 状态**：https://open.bigmodel.cn/status
- **社区论坛**：https://open.bigmodel.cn/community

### 调试工具

- **浏览器控制台**：F12 或 Ctrl+Shift+I
- **网络标签**：查看 API 请求和响应
- **应用标签**：查看本地存储

### 日志查看

```javascript
// 查看所有智谱服务日志
console.log('[ZhipuService]')

// 查看所有视频服务日志
console.log('[Video Polling]')

// 查看所有 API 调用
console.log('[API]')
```

---

## ✨ 配置完成确认

当你完成以下所有项目时，配置就完成了：

- [ ] 获取了有效的 API Key
- [ ] 在应用中成功配置了 API Key
- [ ] 测试连接通过
- [ ] 验证了图片分析功能
- [ ] 验证了视频生成功能
- [ ] 验证了轮询机制
- [ ] 没有错误提示

**🎉 恭喜！你已经成功配置了智谱 GLM！**

现在你可以开始使用所有功能了。

---

## 📝 配置记录

| 项目 | 状态 | 时间 | 备注 |
|------|------|------|------|
| API Key 获取 | ✅/❌ | - | - |
| 应用配置 | ✅/❌ | - | - |
| 连接测试 | ✅/❌ | - | - |
| 图片分析验证 | ✅/❌ | - | - |
| 视频生成验证 | ✅/❌ | - | - |
| 轮询验证 | ✅/❌ | - | - |

---

**最后更新**：2025-01-01
**版本**：v1.0.0
**状态**：✅ 生产就绪
