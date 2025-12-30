# 🎯 智谱模型快速参考

## 📋 模型列表

### 普惠模型（推荐）

| 模型 ID | 功能 | 成本 | 速度 |
|---------|------|------|------|
| `glm-4-flash` | 文本生成 | 💰 低 | ⚡⚡⚡ |
| `glm-4.5-flash` | 深度思考 | 💰 低 | ⚡⚡⚡ |
| `glm-4v-flash` | 视觉理解 | 💰 低 | ⚡⚡⚡ |
| `cogvideox-flash` | 视频生成 | 💰 低 | ⚡⚡⚡ |
| `cogview-3-flash` | 图像生成 | 💰 低 | ⚡⚡⚡ |

### 高端模型

| 模型 ID | 功能 | 质量 | 速度 |
|---------|------|------|------|
| `glm-4.6v` | 视觉理解 | 💎 高 | ⚡⚡ |
| `cogvideox-3` | 视频生成 | 💎 高 | ⚡⚡ |
| `cogview-3` | 图像生成 | 💎 高 | ⚡⚡ |

---

## 🔧 API 调用

### 文本生成

```typescript
// 使用默认模型（GLM-4-Flash）
const text = await zhipuService.generateText(prompt);

// 指定模型
const text = await zhipuService.generateText(prompt, {
  model: 'glm-4-flash'
});

// 使用深度思考
const text = await zhipuService.generateText(prompt, {
  useThinking: true  // 使用 GLM-4.5-Flash
});
```

### 图片分析

```typescript
// 使用默认模型（GLM-4V-Flash）
const analysis = await zhipuService.analyzeImage(imageUrl, prompt);

// 指定模型
const analysis = await zhipuService.analyzeImage(imageUrl, prompt, {
  model: 'glm-4.6v'  // 使用高端模型
});
```

### 图像生成

```typescript
// 使用默认模型（CogView-3-Flash）
const imageUrl = await zhipuService.generateImage(prompt);

// 指定模型
const imageUrl = await zhipuService.generateImage(prompt, {
  model: 'cogview-3'  // 使用高端模型
});
```

### 视频生成

```typescript
// 使用默认模型（CogVideoX-Flash）
const { taskId } = await zhipuService.generateVideo(prompt);

// 指定模型
const { taskId } = await zhipuService.generateVideo(prompt, {
  model: 'cogvideox-3'  // 使用高端模型
});
```

---

## 🎨 UI 配置

### 打开模型配置

1. API 接口配置 → 选择 "智谱 GLM"
2. 测试连接成功
3. 点击 "🤖 配置模型 (可选)"
4. 选择每个功能的模型
5. 点击 "✅ 保存模型配置"

### 默认配置

```javascript
{
  text: 'glm-4-flash',           // 文本生成
  thinking: 'glm-4.5-flash',     // 深度思考
  vision: 'glm-4v-flash',        // 视觉理解
  video: 'cogvideox-flash',      // 视频生成
  image: 'cogview-3-flash'       // 图像生成
}
```

---

## 💡 最佳实践

### 成本优化

```
推荐配置：
✅ 文本生成：glm-4-flash
✅ 深度思考：glm-4.5-flash
✅ 图片分析：glm-4v-flash
✅ 图像生成：cogview-3-flash
✅ 视频生成：cogvideox-flash

成本节省：80% 相比高端模型
```

### 质量优化

```
高质量配置：
✅ 文本生成：glm-4.7
✅ 图片分析：glm-4.6v
✅ 图像生成：cogview-3
✅ 视频生成：cogvideox-3

质量提升：20-30% 相比普惠模型
```

### 混合配置

```
平衡配置：
✅ 日常使用：普惠模型
✅ 关键业务：高端模型
✅ 最终交付：高端模型
```

---

## 📊 性能对比

### 响应时间

| 操作 | 普惠 | 高端 |
|------|------|------|
| 文本生成 | 1-3s | 2-5s |
| 图片分析 | 2-4s | 3-6s |
| 图像生成 | 5-15s | 10-30s |
| 视频生成 | 1-3m | 3-10m |

### 成本对比

| 操作 | 普惠 | 高端 | 节省 |
|------|------|------|------|
| 1000 次文本 | ¥10 | ¥50 | 80% |
| 100 次分析 | ¥5 | ¥25 | 80% |
| 10 次视频 | ¥20 | ¥100 | 80% |

---

## 🔍 调试

### 查看配置

```javascript
// 当前模型配置
localStorage.getItem('zhipu_models_config')

// 所有可用模型
import { ALL_ZHIPU_MODELS } from './zhipuModels';
console.log(ALL_ZHIPU_MODELS);

// 模型分组
import { ZHIPU_MODEL_GROUPS } from './zhipuModels';
console.log(ZHIPU_MODEL_GROUPS);
```

### 查看日志

```javascript
// 智谱服务日志
console.log('[ZhipuService]')

// 视频轮询日志
console.log('[Video Polling]')

// API 调用日志
console.log('[API]')
```

---

## ⚡ 快速命令

### 重置模型配置

```javascript
localStorage.removeItem('zhipu_models_config');
location.reload();
```

### 切换到高端模型

```javascript
localStorage.setItem('zhipu_models_config', JSON.stringify({
  text: 'glm-4.7',
  thinking: 'glm-4.5',
  vision: 'glm-4.6v',
  video: 'cogvideox-3',
  image: 'cogview-3'
}));
location.reload();
```

### 切换回普惠模型

```javascript
localStorage.setItem('zhipu_models_config', JSON.stringify({
  text: 'glm-4-flash',
  thinking: 'glm-4.5-flash',
  vision: 'glm-4v-flash',
  video: 'cogvideox-flash',
  image: 'cogview-3-flash'
}));
location.reload();
```

---

## 📞 常见问题

**Q: 默认使用哪个模型？**
A: 普惠模型系列（成本最低）

**Q: 如何切换模型？**
A: 在 API 配置中点击 "🤖 配置模型" 选择

**Q: 可以混合使用吗？**
A: 可以，为每个功能选择不同模型

**Q: 配置会保存吗？**
A: 会，自动保存到本地存储

**Q: 如何重置配置？**
A: 清除浏览器本地存储或使用上面的快速命令

---

## 🚀 快速开始

1. **配置 API Key**
   - 打开 API 接口配置
   - 选择 "智谱 GLM"
   - 粘贴 API Key
   - 测试连接

2. **选择模型（可选）**
   - 点击 "🤖 配置模型"
   - 选择每个功能的模型
   - 保存配置

3. **开始使用**
   - 应用自动使用选择的模型
   - 无需额外配置

---

**版本**：v2.0.0
**状态**：✅ 生产就绪
**支持模型**：8 个（5 普惠 + 3 高端）
