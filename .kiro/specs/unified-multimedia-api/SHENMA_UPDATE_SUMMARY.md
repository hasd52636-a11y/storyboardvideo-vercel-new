# 神马 API 配置更新总结

## 更新内容

### 1. 新增三条服务线路

#### 对话及图像 API
- **神马 API (官方)** - `https://api.whatai.cc`
- **神马 API (美国线路)** - `https://api.gptbest.vip`
- **神马 API (香港线路)** - `https://hk-api.gptbest.vip`

#### 视频生成 API
- **神马 (官方)** - `https://api.whatai.cc/`
- **神马 (美国线路)** - `https://api.gptbest.vip/`
- **神马 (香港线路)** - `https://hk-api.gptbest.vip/`

### 2. 令牌查询地址

- **地址**: `https://usage.gptbest.vip`
- **用途**: 查询 API 配额和使用情况
- **端点**: `/v1/token/quota`
- **方法**: GET
- **认证**: Bearer Token

### 3. 更新的文件

#### 前端配置
- `components/KeySelection.tsx`
  - 添加了三条神马 API 线路选项
  - 更新了视频测试连接使用令牌查询地址
  - 支持用户在配置面板中选择不同线路

#### 后端配置
- `services/multimedia/constants.ts`
  - 保持官方端点作为默认值
  - 支持通过客户端配置动态切换线路

#### 文档
- `QUICK_REFERENCE.md`
  - 添加了神马 API 线路选择表
  - 提供了选择建议

### 4. 新增文档

- `.kiro/specs/unified-multimedia-api/SHENMA_API_ENDPOINTS.md`
  - 详细的端点配置说明
  - 支持的功能列表
  - 测试示例

- `.kiro/specs/unified-multimedia-api/SHENMA_CONFIGURATION_GUIDE.md`
  - 快速开始指南
  - 支持的模型列表
  - 常见问题解答
  - 故障排除指南

## 使用流程

### 步骤 1: 打开配置面板
- 应用启动时自动显示，或点击 ⚙️ 配置按钮

### 步骤 2: 选择神马 API 线路
- **对话及图像 API 标签页**
  - 在 Provider 下拉框中选择：
    - 神马 API (官方)
    - 神马 API (美国线路)
    - 神马 API (香港线路)

- **视频生成 API 标签页**
  - 在 Provider 下拉框中选择：
    - 神马 (官方)
    - 神马 (美国线路)
    - 神马 (香港线路)

### 步骤 3: 输入配置
1. 输入 API Key (格式: `sk-xxx...`)
2. 选择 LLM 模型 (推荐: `gpt-4o`)
3. 选择图像模型 (推荐: `nano-banana`)
4. 点击 "Test" 按钮验证连接

### 步骤 4: 保存配置
- 点击 "Save Config" 按钮

## 技术细节

### 视频测试连接
- 使用统一的令牌查询地址: `https://usage.gptbest.vip/v1/token/quota`
- 无论用户选择哪条线路，都使用此地址验证 API Key
- 这确保了配额查询的一致性

### 端点路径
所有线路都遵循相同的 API 路径结构：
- 文本生成: `/v1/chat/completions`
- 文生图: `/v1/images/generations`
- 图生图: `/v1/images/edits`
- 视频生成: `/v1/chat/completions` (特定模型)
- 视频分析: `/v1/chat/completions` (特定模型)

## 选择建议

| 用户类型 | 推荐线路 | 原因 |
|---------|---------|------|
| 国内用户 | 官方或香港 | 延迟低，稳定性好 |
| 美国用户 | 美国线路 | 本地服务器，速度快 |
| 亚太用户 | 香港线路 | 区域优化 |
| 网络不稳定 | 尝试多条 | 找到最稳定的线路 |

## 向后兼容性

- 所有更改都是向后兼容的
- 现有配置继续使用官方端点
- 用户可以随时切换到其他线路
- 没有破坏性更改

## 测试建议

1. **连接测试**
   - 在配置面板中点击 "Test" 按钮
   - 应该看到 "✓ Connected" 提示

2. **功能测试**
   - 文生图：输入提示词，生成图像
   - 文本生成：输入消息，获取回复
   - 视频生成：输入提示词，生成视频

3. **线路切换测试**
   - 尝试切换到不同线路
   - 验证功能是否正常工作

## 部署说明

### 前端部署
- 更新 `components/KeySelection.tsx`
- 更新 `QUICK_REFERENCE.md`
- 无需后端更改

### 后端部署
- 无需更改（配置由客户端提供）
- 服务器端自动支持所有线路

## 故障排除

### 连接失败
1. 检查 API Key 是否正确
2. 检查网络连接
3. 尝试切换到其他线路
4. 检查 API Key 是否已过期

### 模型不可用
1. 确认模型名称拼写正确
2. 检查该模型是否在权限范围内
3. 访问官网查看可用模型列表

### 请求超时
1. 检查网络连接
2. 尝试切换到其他线路
3. 简化请求内容

## 更新日期

- 2025-12-26: 初始版本
  - 添加三条神马 API 线路
  - 添加令牌查询地址
  - 更新配置界面
  - 添加文档

## 相关文档

- [神马 API 端点配置](./SHENMA_API_ENDPOINTS.md)
- [神马 API 配置指南](./SHENMA_CONFIGURATION_GUIDE.md)
- [快速参考](../../QUICK_REFERENCE.md)
