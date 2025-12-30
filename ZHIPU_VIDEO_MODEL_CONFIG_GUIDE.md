# 智谱视频模型配置指南

## 📺 支持的视频模型

### 普惠模型系列（推荐，成本低廉）
- **CogVideoX-Flash** (cogvideox-flash)
  - 快速视频生成
  - 成本最低
  - 适合大多数场景
  - 生成速度：1-3 分钟

### 高端模型系列（高质量）
- **CogVideoX-3** (cogvideox-3)
  - 高质量视频生成
  - 成本较高
  - 适合专业应用
  - 生成速度：3-10 分钟

---

## 🔧 配置步骤

### 第 1 步：在应用中配置

1. **打开 API 配置对话框**
   - 点击应用中的 "🎬 配置视频 API" 按钮
   - 或点击 "⚙️ API 配置"

2. **选择智谱服务商**
   - 在提供商选择中点击 "智谱 GLM (推荐)"
   - 颜色为紫色 (#6366f1)

3. **获取 API Key**
   - 点击 "👉 点击获取 API Key" 按钮
   - 会打开 https://open.bigmodel.cn/usercenter/apikeys
   - 登录你的智谱账户
   - 创建新的 API Key 或复制现有的

4. **粘贴 API Key**
   - 复制 API Key
   - 回到应用，粘贴到输入框
   - 点击 "✨ 测试连接"

5. **配置视频模型**
   - 连接成功后，会显示 "🤖 配置模型 (可选)" 按钮
   - 点击展开模型配置
   - 选择默认使用的视频模型：
     - **CogVideoX-Flash**（推荐）- 快速、低成本
     - **CogVideoX-3** - 高质量、高成本

6. **保存配置**
   - 点击 "✅ 保存模型配置"
   - 配置会自动保存到浏览器本地存储

---

## 📊 模型对比

| 特性 | CogVideoX-Flash | CogVideoX-3 |
|------|-----------------|------------|
| 成本 | 💰 低 | 💎 高 |
| 质量 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 速度 | 快 (1-3 分钟) | 慢 (3-10 分钟) |
| 推荐场景 | 日常使用、快速迭代 | 专业应用、最终交付 |
| 成本节省 | 80% 相比高端模型 | 基准 |

---

## 🎬 视频生成配置

### 支持的参数

```typescript
interface ZhipuVideoGenerationRequest {
  model: string;              // 模型 ID
  prompt?: string;            // 文本提示词
  image_url?: string;         // 图像 URL（图生视频）
  quality?: 'speed' | 'quality';  // 质量模式
  with_audio?: boolean;       // 是否生成音频
  watermark_enabled?: boolean; // 是否添加水印
  size?: string;              // 视频尺寸
  fps?: 30 | 60;             // 帧率
  duration?: 5 | 10;         // 视频时长（秒）
}
```

### 支持的视频尺寸

- **1280x720** - 16:9 (720p)
- **720x1280** - 9:16 (竖屏)
- **1024x1024** - 1:1 (正方形)
- **1920x1080** - 16:9 (1080p，默认)
- **1080x1920** - 9:16 (竖屏 1080p)
- **2048x1080** - 21:9 (超宽屏)
- **3840x2160** - 16:9 (4K)

### 支持的帧率

- **30 fps** - 标准帧率（默认）
- **60 fps** - 高帧率（更流畅）

### 支持的时长

- **5 秒** - 短视频（默认）
- **10 秒** - 标准视频

---

## 💻 代码集成示例

### 1. 文本生成视频

```typescript
import ZhipuService from './zhipuService';

const zhipuService = new ZhipuService({
  apiKey: 'your-api-key'
});

// 生成视频
const result = await zhipuService.generateVideo(
  '一只可爱的猫咪在阳光下打瞌睡',
  {
    quality: 'speed',           // 快速模式
    withAudio: false,
    watermarkEnabled: true,
    size: '1920x1080',
    fps: 30,
    duration: 5,
    model: 'cogvideox-flash'    // 使用普惠模型
  }
);

console.log('任务 ID:', result.taskId);
console.log('状态:', result.status);
```

### 2. 图像生成视频

```typescript
// 图生视频
const result = await zhipuService.generateVideo(
  '',  // 空提示词
  {
    imageUrl: 'https://example.com/image.jpg',
    quality: 'quality',         // 高质量模式
    withAudio: false,
    watermarkEnabled: true,
    size: '1920x1080',
    fps: 60,                    // 高帧率
    duration: 10,               // 10 秒视频
    model: 'cogvideox-3'        // 使用高端模型
  }
);
```

### 3. 查询视频状态

```typescript
// 查询视频生成状态
const status = await zhipuService.getVideoStatus(taskId);

console.log('状态:', status.status);        // PROCESSING, SUCCESS, FAIL
console.log('视频 URL:', status.videoUrl);
console.log('封面图:', status.coverImageUrl);
```

### 4. 启动轮询

```typescript
// 启动自动轮询
zhipuService.startPolling(
  taskId,
  (status) => {
    console.log('进度:', status);
  },
  (videoUrl) => {
    console.log('✅ 视频生成完成:', videoUrl);
  },
  (error) => {
    console.error('❌ 生成失败:', error);
  },
  60 * 60 * 1000  // 60 分钟超时
);

// 停止轮询
zhipuService.stopPolling(taskId);
```

---

## 🎯 最佳实践

### 成本优化

```typescript
// 推荐配置（80% 成本节省）
const defaultConfig = {
  model: 'cogvideox-flash',    // 普惠模型
  quality: 'speed',            // 快速模式
  size: '1920x1080',           // 标准尺寸
  fps: 30,                     // 标准帧率
  duration: 5                  // 短视频
};
```

### 质量优化

```typescript
// 高质量配置
const premiumConfig = {
  model: 'cogvideox-3',        // 高端模型
  quality: 'quality',          // 高质量模式
  size: '3840x2160',           // 4K 分辨率
  fps: 60,                     // 高帧率
  duration: 10                 // 长视频
};
```

### 混合配置

```typescript
// 日常使用：普惠模型
// 关键业务：高端模型
// 最终交付：高端模型 + 高质量

const getModelForUseCase = (useCase: 'draft' | 'production' | 'final') => {
  switch (useCase) {
    case 'draft':
      return 'cogvideox-flash';  // 快速迭代
    case 'production':
      return 'cogvideox-flash';  // 生产环境
    case 'final':
      return 'cogvideox-3';      // 最终交付
  }
};
```

---

## 🔍 故障排除

### 问题 1: API Key 无效

**症状**: 连接失败，显示 "API Key 无效"

**解决方案**:
1. 检查 API Key 是否正确复制
2. 确保没有多余的空格或换行符
3. 访问 https://open.bigmodel.cn/usercenter/apikeys 重新生成 API Key
4. 确保 API Key 未过期

### 问题 2: 视频生成失败

**症状**: 任务状态为 FAIL

**常见原因**:
- 提示词包含违规内容
- 图像包含真人或类似真人的内容
- 提示词过长或格式不正确

**解决方案**:
1. 修改提示词，避免违规内容
2. 使用非真人图像
3. 简化提示词
4. 检查错误信息获取更多详情

### 问题 3: 视频生成超时

**症状**: 轮询超过 60 分钟仍未完成

**解决方案**:
1. 检查网络连接
2. 尝试使用 'speed' 质量模式
3. 减少视频时长或分辨率
4. 联系智谱技术支持

### 问题 4: 配置未保存

**症状**: 刷新页面后模型配置丢失

**解决方案**:
1. 检查浏览器是否允许本地存储
2. 清除浏览器缓存后重新配置
3. 确保点击了 "✅ 保存模型配置" 按钮
4. 检查浏览器控制台是否有错误

---

## 📞 获取帮助

### 官方资源

- 🌐 [智谱 AI 官网](https://open.bigmodel.cn)
- 📚 [API 文档](https://open.bigmodel.cn/dev/api)
- 💬 [社区论坛](https://open.bigmodel.cn/community)
- 📧 [技术支持](https://open.bigmodel.cn/support)

### 常用链接

- [获取 API Key](https://open.bigmodel.cn/usercenter/apikeys)
- [API 文档 - 视频生成](https://open.bigmodel.cn/dev/api#video)
- [模型对比](https://open.bigmodel.cn/dev/models)
- [定价信息](https://open.bigmodel.cn/pricing)

---

## 📋 配置检查清单

- [ ] 已获取智谱 API Key
- [ ] 已在应用中配置 API Key
- [ ] 已测试连接成功
- [ ] 已选择默认视频模型
- [ ] 已保存模型配置
- [ ] 已了解成本和质量权衡
- [ ] 已准备好生成视频

---

**最后更新**: 2025-12-30
**版本**: v1.0
**状态**: ✅ 完整配置指南

