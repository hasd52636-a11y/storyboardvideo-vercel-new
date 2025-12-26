# 神马 API 配置指南

## 快速开始

### 步骤 1: 获取 API Key

访问 [https://api.whatai.cc/token](https://api.whatai.cc/token) 获取你的 API Key

### 步骤 2: 选择服务线路

在应用的 API 配置面板中，选择适合你的神马 API 线路：

#### 对话及图像 API
- **神马 API (官方)** - `https://api.whatai.cc`
- **神马 API (美国线路)** - `https://api.gptbest.vip`
- **神马 API (香港线路)** - `https://hk-api.gptbest.vip`

#### 视频生成 API
- **神马 (官方)** - `https://api.whatai.cc/`
- **神马 (美国线路)** - `https://api.gptbest.vip/`
- **神马 (香港线路)** - `https://hk-api.gptbest.vip/`

### 步骤 3: 输入配置

1. 选择提供商
2. 输入 API Key (格式: `sk-xxx...`)
3. 选择 LLM 模型 (推荐: `gpt-4o`)
4. 选择图像模型 (推荐: `nano-banana`)
5. 点击 "Test" 按钮验证连接

### 步骤 4: 保存配置

点击 "Save Config" 按钮保存你的配置

## 支持的功能

### 文本生成
- 模型: `gpt-4o`, `gpt-4o-mini`, `claude-3.5-sonnet` 等
- 端点: `/v1/chat/completions`

### 文生图
- 模型: `nano-banana`, `seedream-3.0` 等
- 端点: `/v1/images/generations`

### 图生图
- 模型: `nano-banana` 等
- 端点: `/v1/images/edits`

### 视频生成
- 模型: `sora-2` 等
- 端点: `/v1/chat/completions` (特定模型)

### 视频分析
- 模型: `gemini-2.5-pro` 等
- 端点: `/v1/chat/completions` (特定模型)

## 测试连接

### 对话 API 测试
```bash
curl --location --request POST 'https://api.whatai.cc/v1/chat/completions' \
  --header 'Authorization: Bearer sk-your-api-key' \
  --header 'Content-Type: application/json' \
  --data '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "test"}]
  }'
```

### 图像 API 测试
```bash
curl --location --request POST 'https://api.whatai.cc/v1/images/generations' \
  --header 'Authorization: Bearer sk-your-api-key' \
  --header 'Content-Type: application/json' \
  --data '{
    "model": "nano-banana",
    "prompt": "test image",
    "n": 1,
    "size": "1024x1024"
  }'
```

### 令牌查询测试
```bash
curl --location --request GET 'https://usage.gptbest.vip/v1/token/quota' \
  --header 'Authorization: Bearer sk-your-api-key'
```

## 常见问题

### Q: 应该选择哪个线路？
**A:** 
- 国内用户: 选择官方端点 (`api.whatai.cc`)
- 美国用户: 选择美国线路 (`api.gptbest.vip`)
- 亚太地区: 选择香港线路 (`hk-api.gptbest.vip`)
- 如果连接不稳定，可以尝试其他线路

### Q: 如何查询 API 配额？
**A:** 使用令牌查询地址 `https://usage.gptbest.vip/v1/token/quota`，在应用中点击 "Test Connection" 按钮会自动使用此地址验证

### Q: 支持哪些模型？
**A:** 神马 API 支持多种模型，包括：
- LLM: `gpt-4o`, `gpt-4o-mini`, `claude-3.5-sonnet` 等
- 图像: `nano-banana`, `seedream-3.0` 等
- 视频: `sora-2` 等

### Q: API Key 在哪里保存？
**A:** API Key 保存在浏览器的本地存储中，不会上传到服务器

### Q: 如何重置配置？
**A:** 清除浏览器本地存储中的 `director_canvas_api_config` 和 `director_canvas_video_config` 项

## 故障排除

### 连接失败
1. 检查 API Key 是否正确
2. 检查网络连接
3. 尝试切换到其他线路
4. 检查 API Key 是否已过期或被禁用

### 模型不可用
1. 确认模型名称拼写正确
2. 检查该模型是否在你的 API Key 的权限范围内
3. 访问 [https://api.whatai.cc](https://api.whatai.cc) 查看可用模型列表

### 请求超时
1. 检查网络连接
2. 尝试切换到其他线路
3. 增加请求超时时间

## 更新日期

- 2025-12-26: 初始版本，添加三条线路支持
