# 神马 API 端点配置

## 官方信息

神马 API 提供多个地区的服务端点，用户可以根据网络情况选择最适合的线路。

## 可用端点

### 1. 官方端点（推荐）
- **地址**: `https://api.whatai.cc`
- **说明**: 官方主服务器，功能最完整
- **用途**: 所有多媒体功能（文生图、图生图、文本生成、图片分析、视频生成、视频分析）

### 2. 美国线路
- **地址**: `https://api.gptbest.vip`
- **说明**: 美国服务器，适合美国用户或需要低延迟的用户
- **用途**: 所有多媒体功能

### 3. 香港线路
- **地址**: `https://hk-api.gptbest.vip`
- **说明**: 香港服务器，适合亚太地区用户
- **用途**: 所有多媒体功能

## 令牌查询地址

- **地址**: `https://usage.gptbest.vip`
- **用途**: 查询 API 配额和使用情况
- **端点**: `/v1/token/quota`
- **方法**: GET
- **认证**: Bearer Token (API Key)

### 查询示例

```bash
curl --location --request GET 'https://usage.gptbest.vip/v1/token/quota' \
  --header 'Authorization: Bearer sk-your-api-key'
```

## 配置说明

### 在应用中选择端点

用户可以在 API 配置面板中选择以下选项：

1. **神马 API (官方)** - `https://api.whatai.cc`
2. **神马 API (美国线路)** - `https://api.gptbest.vip`
3. **神马 API (香港线路)** - `https://hk-api.gptbest.vip`

### 视频 API 测试

视频 API 连接测试使用统一的令牌查询地址：`https://usage.gptbest.vip/v1/token/quota`

这确保了无论用户选择哪个地区的端点，都能通过同一个地址验证 API Key 的有效性。

## 端点路径

所有端点都遵循相同的 API 路径结构：

- 文本生成: `/v1/chat/completions`
- 文生图: `/v1/images/generations`
- 图生图: `/v1/images/edits`
- 视频生成: `/v1/chat/completions` (特定模型)
- 视频分析: `/v1/chat/completions` (特定模型)

## 选择建议

| 场景 | 推荐端点 |
|------|---------|
| 国内用户 | 官方端点 (`api.whatai.cc`) |
| 美国用户 | 美国线路 (`api.gptbest.vip`) |
| 亚太地区 | 香港线路 (`hk-api.gptbest.vip`) |
| 网络不稳定 | 尝试不同线路 |
| 查询配额 | 令牌查询地址 (`usage.gptbest.vip`) |

## 更新日期

- 2025-12-26: 添加美国和香港线路支持
- 2025-12-26: 添加令牌查询地址配置
