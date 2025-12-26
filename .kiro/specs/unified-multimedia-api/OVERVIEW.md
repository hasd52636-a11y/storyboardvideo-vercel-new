# 统一多媒体 API 集成 - 项目概览

## 📌 项目目标

创建一个统一的多媒体服务层，使用户通过单一 API Key（神马 API）即可访问：
- ✅ 文生图（Text-to-Image）
- ✅ 图生图（Image-to-Image）
- ✅ 文本生成（Text Generation）
- ✅ 图片分析（Image Analysis）
- ✅ 视频生成（Video Generation）
- ✅ 视频分析（Video Analysis）

同时保持对现有 OpenAI 和 DYU 的向后兼容。

---

## 🎯 核心需求

### 用户需求
1. **一键配置**：输入神马 API Key 后，所有功能自动同步
2. **灵活选择**：可为不同功能选择不同提供商
3. **向后兼容**：现有 OpenAI/DYU 配置继续工作
4. **无缝迁移**：用户无需修改现有配置

### 技术需求
1. **统一架构**：创建 `MultiMediaService` 统一服务层
2. **适配器模式**：为每个提供商实现适配器
3. **配置管理**：支持配置的持久化、验证、同步
4. **错误处理**：完善的错误处理和重试机制

---

## 🏗️ 架构设计

### 分层架构

```
┌─────────────────────────────────────────┐
│         应用层（UI/Components）          │
├─────────────────────────────────────────┤
│         API 路由层（/api/multimedia/）   │
├─────────────────────────────────────────┤
│    MultiMediaService（业务逻辑层）       │
├─────────────────────────────────────────┤
│  提供商适配器层（OpenAI/DYU/Shenma）    │
├─────────────────────────────────────────┤
│      外部 API 服务（OpenAI/DYU/Shenma）  │
└─────────────────────────────────────────┘
```

### 核心组件

| 组件 | 职责 | 位置 |
|------|------|------|
| `MultiMediaService` | 统一服务入口，请求路由 | `services/multimedia/MultiMediaService.ts` |
| `ShenmaAPIAdapter` | 神马 API 适配器 | `services/multimedia/adapters/ShenmaAPIAdapter.ts` |
| `OpenAIAdapter` | OpenAI 适配器 | `services/multimedia/adapters/OpenAIAdapter.ts` |
| `DYUAdapter` | DYU 适配器 | `services/multimedia/adapters/DYUAdapter.ts` |
| `APIConfigManager` | 配置管理 | `services/multimedia/APIConfigManager.ts` |
| `APIConfigPanel` | 配置 UI | `components/multimedia/APIConfigPanel.tsx` |

---

## 📊 功能矩阵

| 功能 | OpenAI | 智谱 | Shenma | Dayuyu | Custom | Gemini | 优先级 |
|------|--------|------|--------|--------|--------|--------|--------|
| 文生图 | ✅ | ✅ | ✅ | ❌ | ✅ | ⏳ | P1 |
| 图生图 | ✅ | ❌ | ✅ | ❌ | ✅ | ⏳ | P1 |
| 文本生成 | ✅ | ✅ | ✅ | ❌ | ✅ | ⏳ | P1 |
| 图片分析 | ✅ | ❌ | ✅ | ❌ | ✅ | ⏳ | P2 |
| 视频生成 | ❌ | ✅* | ✅ | ✅* | ❌ | ⏳ | P2 |
| 视频分析 | ❌ | ❌ | ✅ | ❌ | ❌ | ⏳ | P3 |

*注：智谱视频生成未配置、Dayuyu 待测试、⏳ Gemini 后期开发

---

## 🔄 配置同步流程

### 用户操作流程

```
1. 用户打开配置界面
   ↓
2. 选择 "Shenma" 提供商
   ↓
3. 输入 Shenma API Key
   ↓
4. 点击 "一键同步"
   ↓
5. 系统验证 API Key
   ↓
6. 更新所有功能的提供商映射
   ↓
7. 显示 "✓ 已同步" 状态
   ↓
8. 用户可立即使用所有功能
```

### 配置映射示例

**同步前**：
```json
{
  "providers": {
    "textToImage": "openai",
    "imageToImage": "openai",
    "textGeneration": "openai",
    "imageAnalysis": null,
    "videoGeneration": "dyu",
    "videoAnalysis": null
  }
}
```

**同步后**：
```json
{
  "providers": {
    "textToImage": "shenma",
    "imageToImage": "shenma",
    "textGeneration": "shenma",
    "imageAnalysis": "shenma",
    "videoGeneration": "shenma",
    "videoAnalysis": "shenma"
  }
}
```

---

## 📋 实现计划

### Phase 1：核心框架（1-2 周）
- [ ] 创建项目结构和类型定义
- [ ] 实现配置管理系统
- [ ] 创建 MultiMediaService 框架

### Phase 2：提供商适配器（2-3 周）
- [ ] 实现 ShenmaAPIAdapter（所有功能）
- [ ] 更新 OpenAIAdapter
- [ ] 创建 DYUAdapter

### Phase 3：API 端点（1 周）
- [ ] 创建 6 个多媒体 API 端点
- [ ] 实现请求验证和响应格式化

### Phase 4：UI 界面（1-2 周）
- [ ] 创建配置管理 UI
- [ ] 创建功能使用界面
- [ ] 集成到主应用

### Phase 5：测试和优化（1-2 周）
- [ ] 单元测试
- [ ] 集成测试
- [ ] 性能测试

### Phase 6：部署（1 周）
- [ ] 数据库迁移
- [ ] 灰度发布
- [ ] 监控告警

**总计**：约 7-11 周

---

## 🔐 安全考虑

### API Key 管理
- ✅ API Key 加密存储
- ✅ 不在日志中输出 API Key
- ✅ 支持 API Key 轮换
- ✅ 支持 API Key 过期设置

### 请求验证
- ✅ 验证用户权限
- ✅ 验证请求参数
- ✅ 限制请求大小
- ✅ 实现速率限制

### 内容安全
- ✅ 支持内容审查
- ✅ 记录所有请求和响应
- ✅ 支持审计日志

---

## 📈 性能目标

| 指标 | 目标 | 说明 |
|------|------|------|
| 文生图响应时间 | < 30s | 包括 API 调用时间 |
| 图生图响应时间 | < 30s | 包括图片上传时间 |
| 文本生成响应时间 | < 10s | 首个 token 时间 |
| 图片分析响应时间 | < 15s | 包括图片上传时间 |
| 视频生成响应时间 | < 5min | 包括轮询时间 |
| 视频分析响应时间 | < 30s | 包括视频上传时间 |
| API 可用性 | > 99.5% | 月度可用性 |
| 错误率 | < 1% | 请求失败率 |

---

## 🧪 测试策略

### 单元测试
- 测试各适配器的功能
- 测试配置管理
- 测试错误处理

### 集成测试
- 测试端到端流程
- 测试多提供商切换
- 测试配置同步

### 性能测试
- 测试并发请求（10、100、1000）
- 测试缓存效果
- 测试重试机制

### 兼容性测试
- 测试现有 OpenAI 功能
- 测试现有 DYU 功能
- 测试配置迁移

---

## 📚 文档结构

```
.kiro/specs/unified-multimedia-api/
├── OVERVIEW.md              # 项目概览（本文件）
├── requirements.md          # 需求文档
├── design.md               # 设计文档
├── tasks.md                # 任务列表
└── IMPLEMENTATION_GUIDE.md # 实现指南（待创建）
```

---

## 🚀 快速开始

### 对于开发者

1. **阅读需求文档**：了解功能需求和用户故事
2. **阅读设计文档**：理解架构和数据流
3. **查看任务列表**：选择任务开始开发
4. **参考实现指南**：获取具体的实现步骤

### 对于测试者

1. **了解功能矩阵**：知道哪些功能需要测试
2. **查看测试策略**：了解测试方法
3. **执行测试用例**：验证功能正确性

### 对于产品经理

1. **查看功能矩阵**：了解支持的功能
2. **了解配置流程**：理解用户体验
3. **查看性能目标**：了解系统能力

---

## 🔗 相关资源

### 外部 API 文档
- [Shenma API 文档](./../../神马API.txt)
- [OpenAI API 文档](https://platform.openai.com/docs/api-reference)
- [DYU API 文档](./../../sora2API文档.txt)

### 现有代码
- `videoService.ts` - 视频服务参考
- `ImageGenerationService.ts` - 图片服务参考
- `ImageGenerationAdapter.ts` - 适配器模式参考

---

## ❓ 常见问题

### Q: 为什么选择方案 C（新建统一服务）？
A: 因为需要支持多个功能（文生图、图生图、文本、图片分析、视频分析），统一服务层可以：
- 提供统一的配置管理
- 简化请求路由逻辑
- 便于添加新功能
- 提高代码复用性

### Q: 如何保证向后兼容？
A: 通过以下方式：
- 保留现有 API 端点
- 支持旧配置格式
- 提供配置迁移工具
- 灰度发布策略

### Q: 一键同步如何工作？
A: 用户选择 Shenma 后，系统自动：
1. 验证 API Key 有效性
2. 更新所有功能的提供商映射为 "shenma"
3. 保存配置到数据库
4. 显示同步成功状态

### Q: 如何处理 API 调用失败？
A: 通过以下机制：
- 自动重试（指数退避）
- 提供商降级（如果可用）
- 清晰的错误消息
- 用户友好的提示

---

## 📞 联系方式

如有问题或建议，请联系项目负责人。

---

**最后更新**：2025-01-01
**版本**：1.0
**状态**：规划中

