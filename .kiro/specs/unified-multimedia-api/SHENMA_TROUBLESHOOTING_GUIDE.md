# 神马中转API 精准排查指南

> 本指南对照官方文档规则，分步骤全面排查API配置失败问题。适用于对话、文生图、图生图、图生视频4个模型。

---

## 📋 快速诊断表

| 症状 | 最可能原因 | 优先排查 |
|------|---------|--------|
| 所有模型都返回 401 | API Key 格式错误或填写位置错误 | 第2步 |
| 所有模型都返回 404 | Base URL 错误（多了/v1或少了/v1） | 第1步 |
| 所有模型都返回 500 | 服务端故障或请求头缺失 | 第3步 |
| 仅文生图失败 | 模型名称错误或参数格式错误 | 第4步 |
| 仅图生图失败 | 图片编码格式错误或Content-Type错误 | 第5步 |
| 仅图生视频失败 | 该功能未开通或模型不支持 | 第6步 |
| 网络超时 | 域名无法连接或防火墙阻止 | 第0步 |

---

## 第0步：网络连通性验证

### Windows 系统

**1. 测试 DNS 解析**
```cmd
nslookup api.whatai.cc
```
预期结果：显示 IP 地址（如 `1.2.3.4`）

**2. 测试 ICMP 连通性**
```cmd
ping api.whatai.cc -n 4
```
预期结果：`Reply from xxx: bytes=32 time=xx ms TTL=xxx`

**3. 测试 HTTPS 端口（443）连通性**
```cmd
telnet api.whatai.cc 443
```
预期结果：连接成功（黑屏或显示连接建立）

**4. 若 telnet 失败，检查防火墙**
```cmd
# 查看防火墙状态
netsh advfirewall show allprofiles

# 添加出站规则允许 api.whatai.cc
netsh advfirewall firewall add rule name="Allow Shenma API" dir=out action=allow remoteip=api.whatai.cc protocol=tcp remoteport=443
```

### Linux/Mac 系统

```bash
# DNS 解析
nslookup api.whatai.cc

# ICMP 连通性
ping -c 4 api.whatai.cc

# HTTPS 端口连通性
nc -zv api.whatai.cc 443

# 或使用 curl 测试（会显示 SSL 握手信息）
curl -v https://api.whatai.cc/v1/models 2>&1 | head -20
```

**若网络不通，排查步骤：**
- ✅ 检查本地代理设置（VPN/代理软件）
- ✅ 检查防火墙规则（Windows Defender、第三方防火墙）
- ✅ 尝试切换网络（移动热点、其他 WiFi）
- ✅ 联系网络管理员放行 `api.whatai.cc:443`

---

## 第1步：Base URL 配置合规性验证

### 官方规范

根据神马API文档，**Base URL 必须是**：
```
https://api.whatai.cc
```

**不能是以下任何形式：**
- ❌ `https://api.whatai.cc/` （末尾多了斜杠）
- ❌ `https://api.whatai.cc/v1` （多了 /v1）
- ❌ `http://api.whatai.cc` （必须是 HTTPS）
- ❌ `api.whatai.cc` （缺少 https://）

### 检查方法

**在你的应用中：**

1. **查找配置文件或代码中的 Base URL**
   ```typescript
   // 正确 ✅
   const baseUrl = 'https://api.whatai.cc';
   
   // 错误 ❌
   const baseUrl = 'https://api.whatai.cc/v1';
   ```

2. **验证完整请求 URL**
   - 文生图：`https://api.whatai.cc/v1/images/generations`
   - 图生图：`https://api.whatai.cc/v1/images/edits`
   - 对话：`https://api.whatai.cc/v1/chat/completions`
   - 图生视频：`https://api.whatai.cc/v1/images/generations`（使用特定模型）

3. **用 Postman 验证**
   - 在 Postman 中新建 POST 请求
   - URL 填写：`https://api.whatai.cc/v1/chat/completions`
   - 点击 Send，观察响应状态码

**修正方案：**
- 如果返回 404，说明 Base URL 或路径错误
- 如果返回 401，说明 URL 正确但 API Key 有问题（进入第2步）

---

## 第2步：API Key 配置合规性验证

### 官方规范

**API Key 格式：**
- 必须以 `sk-` 开头
- 长度通常为 48-60 个字符
- 示例：`sk-Pi6pIAQGtmh2Mbl1aEOXCc2OGxnTHE8wCfjT56WEMc8bOalC`

**Authorization 请求头格式：**
```
Authorization: Bearer sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 检查方法

**1. 验证 API Key 本身**
```bash
# 检查 API Key 是否以 sk- 开头
echo "sk-Pi6pIAQGtmh2Mbl1aEOXCc2OGxnTHE8wCfjT56WEMc8bOalC" | grep -o "^sk-"
# 输出：sk-
```

**2. 验证 Authorization 请求头**

在你的代码中搜索 Authorization 配置：
```typescript
// 正确 ✅
headers: {
  'Authorization': 'Bearer sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  'Content-Type': 'application/json'
}

// 错误 ❌ - 缺少 Bearer
headers: {
  'Authorization': 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  'Content-Type': 'application/json'
}

// 错误 ❌ - 多了 Bearer
headers: {
  'Authorization': 'Bearer Bearer sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  'Content-Type': 'application/json'
}
```

**3. 用 Postman 验证**

```
POST https://api.whatai.cc/v1/chat/completions

Headers:
  Authorization: Bearer sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  Content-Type: application/json

Body (raw JSON):
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "user",
      "content": "Hello"
    }
  ]
}
```

**预期结果：**
- ✅ 200 OK：API Key 正确
- ❌ 401 Unauthorized：API Key 错误或格式不对
- ❌ 403 Forbidden：API Key 无权限或已过期

**修正方案：**
- 重新从神马官网复制 API Key（避免手动输入）
- 确保 Authorization 头格式为 `Bearer sk-xxxxx`
- 检查 API Key 是否包含空格或特殊字符

---

## 第3步：请求有效性验证

### 3.1 请求方法和请求头

**所有 4 个模型的请求方法都必须是 POST**

**必需的请求头：**
```
Content-Type: application/json
Authorization: Bearer sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Accept: application/json
```

**检查方法：**
```typescript
// 正确 ✅
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  'Accept': 'application/json'
};

const response = await fetch('https://api.whatai.cc/v1/chat/completions', {
  method: 'POST',  // 必须是 POST
  headers: headers,
  body: JSON.stringify(payload)
});
```

### 3.2 对话模型请求体格式

**模型名称：** `gpt-3.5-turbo`、`gpt-4o`、`gemini-2.5-pro` 等

**正确的请求体：**
```json
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "user",
      "content": "你好"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**常见错误：**
```json
// 错误 ❌ - messages 不是数组
{
  "model": "gpt-3.5-turbo",
  "messages": {
    "role": "user",
    "content": "你好"
  }
}

// 错误 ❌ - 缺少 role 字段
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "content": "你好"
    }
  ]
}

// 错误 ❌ - role 值不正确
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "assistant",  // 应该是 "user"
      "content": "你好"
    }
  ]
}
```

**修正方案：**
- 使用 JSON 验证工具检查请求体格式：https://jsonlint.com/
- 确保 messages 是数组，每个消息都有 role 和 content

---

## 第4步：文生图模型验证

### 模型名称

**支持的模型：**
- `nano-banana` （推荐，优化版）
- `nano-banana-hd` （高清版 4K）
- `gpt-image-1`
- `dall-e-3`

### 请求路径和格式

**路径：** `POST /v1/images/generations`

**完整 URL：** `https://api.whatai.cc/v1/images/generations`

**正确的请求体：**
```json
{
  "model": "nano-banana",
  "prompt": "一只可爱的猫咪，坐在沙发上，阳光照射",
  "n": 1,
  "size": "1024x1024",
  "response_format": "url"
}
```

**可选参数：**
```json
{
  "model": "nano-banana",
  "prompt": "一只可爱的猫咪",
  "aspect_ratio": "16:9",  // 宽高比：1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9
  "response_format": "url",  // url 或 b64_json
  "quality": "standard"  // standard 或 hd
}
```

### 用 Postman 验证

```
POST https://api.whatai.cc/v1/images/generations

Headers:
  Authorization: Bearer sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  Content-Type: application/json

Body (raw JSON):
{
  "model": "nano-banana",
  "prompt": "一只可爱的猫咪",
  "n": 1,
  "response_format": "url"
}
```

**预期响应（200 OK）：**
```json
{
  "created": 1713833628,
  "data": [
    {
      "url": "https://..."
    }
  ]
}
```

**常见错误：**
- ❌ 400 Bad Request：模型名称错误或参数格式错误
- ❌ 401 Unauthorized：API Key 错误
- ❌ 429 Too Many Requests：请求过于频繁

---

## 第5步：图生图模型验证

### 模型名称

**支持的模型：**
- `nano-banana` （推荐）
- `gpt-image-1`
- `flux-kontext-pro`
- `flux-kontext-max`

### 请求路径和格式

**路径：** `POST /v1/images/edits`

**完整 URL：** `https://api.whatai.cc/v1/images/edits`

**关键点：** 这个接口使用 `multipart/form-data`，不是 JSON

### 正确的请求方式

**用 Postman 验证：**

1. 选择 POST 方法
2. URL：`https://api.whatai.cc/v1/images/edits`
3. Headers：
   ```
   Authorization: Bearer sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   （不需要设置 Content-Type，Postman 会自动设置为 multipart/form-data）

4. Body 选择 `form-data`：
   ```
   Key: model          | Value: nano-banana
   Key: prompt         | Value: 给猫咪戴上眼镜
   Key: image          | Value: [选择图片文件]
   Key: response_format| Value: url
   Key: aspect_ratio   | Value: 1:1
   ```

### 代码示例（JavaScript）

```javascript
const formData = new FormData();
formData.append('model', 'nano-banana');
formData.append('prompt', '给猫咪戴上眼镜');
formData.append('image', imageFile);  // File 对象
formData.append('response_format', 'url');
formData.append('aspect_ratio', '1:1');

const response = await fetch('https://api.whatai.cc/v1/images/edits', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    // 不要手动设置 Content-Type，浏览器会自动设置
  },
  body: formData
});
```

### 常见错误

- ❌ 400 Bad Request：图片格式不支持或 prompt 为空
- ❌ 413 Payload Too Large：图片文件过大（>25MB）
- ❌ 415 Unsupported Media Type：Content-Type 设置错误

---

## 第6步：图生视频模型验证

### 模型名称

**支持的模型：**
- `sora-2` （基础版，最长 10 秒）
- `sora-2-pro` （专业版，最长 25 秒）

### 请求路径和格式

**路径：** `POST /v1/images/generations`

**完整 URL：** `https://api.whatai.cc/v1/images/generations`

**注意：** 图生视频使用的是 `/v1/images/generations` 路径，但模型名称不同

### 正确的请求体

```json
{
  "model": "sora-2",
  "prompt": "一只猫咪在阳光下奔跑，背景是绿色的草地",
  "duration": 10,
  "aspect_ratio": "16:9",
  "hd": false
}
```

**参数说明：**
- `model`：`sora-2` 或 `sora-2-pro`
- `prompt`：视频描述（最多 1000 字符）
- `duration`：视频时长
  - `sora-2`：10 秒
  - `sora-2-pro`：10、15、25 秒
- `aspect_ratio`：宽高比（16:9 或 9:16）
- `hd`：是否启用高清（true/false）

### 用 Postman 验证

```
POST https://api.whatai.cc/v1/images/generations

Headers:
  Authorization: Bearer sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  Content-Type: application/json

Body (raw JSON):
{
  "model": "sora-2",
  "prompt": "一只猫咪在阳光下奔跑",
  "duration": 10,
  "aspect_ratio": "16:9",
  "hd": false
}
```

**预期响应（200 OK）：**
```json
{
  "created": 1713833628,
  "data": [
    {
      "url": "https://...",
      "task_id": "xxx"
    }
  ]
}
```

### 常见错误

- ❌ 400 Bad Request：模型名称错误或时长超出限制
- ❌ 402 Payment Required：账户余额不足
- ❌ 429 Too Many Requests：请求过于频繁

---

## 第7步：服务端与权限验证

### 7.1 检查账户权限

**访问神马官网查看：**
1. 登录 https://api.whatai.cc/
2. 进入"账户设置"或"API 管理"
3. 查看以下信息：
   - ✅ API Key 是否已生成
   - ✅ 账户余额是否充足
   - ✅ 各模型是否已开通
   - ✅ 是否有请求频率限制

### 7.2 检查服务状态

**官方状态页面：**
- 访问 https://status.whatai.cc/ （如果有）
- 或查看官方文档中的"服务状态"部分

**检查方法：**
```bash
# 用 curl 测试 API 可用性
curl -X POST https://api.whatai.cc/v1/chat/completions \
  -H "Authorization: Bearer sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"test"}]}'
```

### 7.3 检查请求频率限制

**常见限制：**
- 每分钟请求数：通常 60-100 次
- 每小时请求数：通常 1000-10000 次
- 并发请求数：通常 10-50 个

**如果触发限制：**
- ❌ 返回 429 Too Many Requests
- 解决方案：
  - 减少请求频率
  - 添加请求延迟（如 1 秒）
  - 联系官方申请提高限制

---

## 第8步：Postman 完整配置示例

### 对话模型

```
POST https://api.whatai.cc/v1/chat/completions

Headers:
  Authorization: Bearer sk-Pi6pIAQGtmh2Mbl1aEOXCc2OGxnTHE8wCfjT56WEMc8bOalC
  Content-Type: application/json
  Accept: application/json

Body (raw JSON):
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "user",
      "content": "你好，请介绍一下你自己"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

### 文生图模型

```
POST https://api.whatai.cc/v1/images/generations

Headers:
  Authorization: Bearer sk-Pi6pIAQGtmh2Mbl1aEOXCc2OGxnTHE8wCfjT56WEMc8bOalC
  Content-Type: application/json

Body (raw JSON):
{
  "model": "nano-banana",
  "prompt": "一只可爱的橙色猫咪，坐在窗边，阳光照射，温暖的氛围",
  "n": 1,
  "response_format": "url",
  "aspect_ratio": "1:1"
}
```

### 图生图模型

```
POST https://api.whatai.cc/v1/images/edits

Headers:
  Authorization: Bearer sk-Pi6pIAQGtmh2Mbl1aEOXCc2OGxnTHE8wCfjT56WEMc8bOalC

Body (form-data):
  model: nano-banana
  prompt: 给这只猫咪戴上太阳镜
  image: [选择图片文件]
  response_format: url
  aspect_ratio: 1:1
```

### 图生视频模型

```
POST https://api.whatai.cc/v1/images/generations

Headers:
  Authorization: Bearer sk-Pi6pIAQGtmh2Mbl1aEOXCc2OGxnTHE8wCfjT56WEMc8bOalC
  Content-Type: application/json

Body (raw JSON):
{
  "model": "sora-2",
  "prompt": "一只橙色猫咪在阳光下奔跑，背景是绿色的草地和蓝天",
  "duration": 10,
  "aspect_ratio": "16:9",
  "hd": false
}
```

---

## 快速修复清单

使用此清单逐项检查：

- [ ] **网络连通性**
  - [ ] 能 ping 通 `api.whatai.cc`
  - [ ] 能 telnet 连接 `api.whatai.cc:443`
  - [ ] 防火墙已放行该域名

- [ ] **Base URL 配置**
  - [ ] Base URL 是 `https://api.whatai.cc`（不是 `/v1`）
  - [ ] 完整 URL 格式正确（如 `https://api.whatai.cc/v1/chat/completions`）

- [ ] **API Key 配置**
  - [ ] API Key 以 `sk-` 开头
  - [ ] Authorization 头格式为 `Bearer sk-xxxxx`
  - [ ] 没有多余空格或特殊字符

- [ ] **请求头配置**
  - [ ] 包含 `Content-Type: application/json`
  - [ ] 包含 `Authorization: Bearer sk-xxxxx`
  - [ ] 包含 `Accept: application/json`

- [ ] **请求体格式**
  - [ ] 对话模型：messages 是数组，每个消息有 role 和 content
  - [ ] 文生图：prompt 不为空，model 名称正确
  - [ ] 图生图：使用 multipart/form-data，包含 image 文件
  - [ ] 图生视频：duration 在允许范围内

- [ ] **账户权限**
  - [ ] API Key 有效且未过期
  - [ ] 账户余额充足
  - [ ] 各模型已开通
  - [ ] 未触发请求频率限制

---

## 常见错误代码速查

| 状态码 | 含义 | 解决方案 |
|--------|------|--------|
| 400 | Bad Request | 检查请求体格式、参数值是否正确 |
| 401 | Unauthorized | 检查 API Key 和 Authorization 头格式 |
| 403 | Forbidden | API Key 无权限或已过期 |
| 404 | Not Found | 检查 Base URL 和请求路径 |
| 429 | Too Many Requests | 降低请求频率或等待 |
| 500 | Internal Server Error | 服务端故障，稍后重试 |
| 503 | Service Unavailable | 服务维护中，稍后重试 |

---

## 获取帮助

如果按照以上步骤仍未解决，请收集以下信息联系官方支持：

1. **完整的错误信息**（包括状态码和响应体）
2. **Postman 请求配置**（导出为 JSON）
3. **网络诊断结果**（ping、telnet、curl 输出）
4. **账户信息**（API Key 前 10 个字符、账户余额）
5. **时间戳**（问题发生的具体时间）

---

**最后更新：2025-12-26**
**版本：1.0**
