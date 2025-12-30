# 智谱 AI 配置指南

## 快速开始

### 1. 获取 API Key

1. 访问 [智谱 AI 官网](https://open.bigmodel.cn)
2. 注册或登录账户
3. 进入 API 密钥管理页面
4. 创建新的 API 密钥
5. 复制密钥（格式通常为 `sk-...`）

### 2. 在应用中配置

1. 打开应用的设置对话框（点击左侧菜单的设置按钮）
2. 选择 **"对话及图像API"** 标签页
3. 在 **"服务商"** 下拉菜单中选择 **"智谱 AI (ChatGLM)"**
4. 自动填充的配置：
   - **Base URL**: `https://open.bigmodel.cn/api/paas/v4`
   - **LLM Model**: `glm-4`
   - **Image Model**: `cogview-4-250304`
5. 粘贴你的 API Key
6. 点击 **"测试连接"** 验证配置
7. 点击 **"保存配置"**

### 3. 功能支持

✅ **已支持**:
- 对话生成（LLM）- 用于生成视频提示词
- 图片生成（Image Generation）- 用于生成分镜画面

⏳ **后续支持**:
- 图片识别/分析
- 视频生成

### 4. 模型说明

| 模型 | 用途 | 说明 |
|------|------|------|
| `glm-4` | 对话/LLM | 高性能对话模型，用于生成视频提示词 |
| `cogview-4-250304` | 图片生成 | 高质量图片生成模型，用于生成分镜画面 |

### 5. 常见问题

**Q: API Key 在哪里获取？**
A: 访问 https://open.bigmodel.cn，登录后在 API 密钥管理页面创建

**Q: 测试连接失败怎么办？**
A: 
- 检查 API Key 是否正确复制
- 确保账户有足够的配额
- 检查网络连接

**Q: 生成速度如何？**
A: 智谱 AI 的生成速度非常快，通常比其他服务商快得多

**Q: 支持哪些语言？**
A: 支持中文和英文提示词

### 6. 配置示例

```json
{
  "provider": "zhipu",
  "apiKey": "sk-your-api-key-here",
  "baseUrl": "https://open.bigmodel.cn/api/paas/v4",
  "llmModel": "glm-4",
  "imageModel": "cogview-4-250304"
}
```

---

**提示**: API Key 只保存在你的浏览器本地存储中，不会上传到任何服务器。
