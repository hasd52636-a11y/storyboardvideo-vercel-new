# 智谱聊天功能修复

## 问题
测试成功但实际聊天失败，错误信息：
```
API error: 404 {"path":"/v4/v1/chat/completions"}
```

## 根本原因
在 `chatWithGemini` 函数中，API 端点 URL 构建错误：

**错误的 URL：**
```
https://open.bigmodel.cn/api/paas/v4 + /v1/chat/completions
= https://open.bigmodel.cn/api/paas/v4/v1/chat/completions  ❌
```

**正确的 URL：**
```
https://open.bigmodel.cn/api/paas/v4 + /chat/completions
= https://open.bigmodel.cn/api/paas/v4/chat/completions  ✅
```

问题是 baseUrl 已经包含了 `/v4`，但代码又添加了 `/v1/chat/completions`，导致路径重复。

## 解决方案
在 `geminiService.ts` 的 `chatWithGemini` 函数中添加提供商检测逻辑：

```typescript
// 构建正确的 API 端点 URL
let apiEndpoint: string;
if (config.provider === 'zhipu') {
  // 智谱 API: baseUrl 已经包含 /v4，直接添加 /chat/completions
  apiEndpoint = `${config.baseUrl}/chat/completions`;
} else {
  // 其他 API（神马等）: 添加 /v1/chat/completions
  apiEndpoint = `${config.baseUrl}/v1/chat/completions`;
}
```

## 修改文件
- `geminiService.ts` - 第 1189-1205 行

## 部署
- 构建：`npm run build` ✓
- 部署：`vercel deploy --prod` ✓
- 线上地址：https://sora.wboke.com

## 测试步骤
1. 打开应用
2. 进入设置 (🔑 图标)
3. 选择 "智谱 AI (ChatGLM)" 作为提供商
4. 输入有效的 API Key
5. 点击 "保存配置"
6. 在聊天框输入消息
7. 应该能收到智谱的回复

## 预期结果
✅ 聊天功能正常工作
✅ 能接收智谱 API 的回复
✅ 支持文本和图片输入

## 相关问题
- 测试成功的原因：测试代码使用了不同的端点构建方式
- 实际使用失败的原因：`chatWithGemini` 函数没有区分不同提供商的 URL 格式
