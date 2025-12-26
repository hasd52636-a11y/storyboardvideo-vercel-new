# 神马 API 多线路支持 - 变更日志

## [1.0.0] - 2025-12-26

### 🎉 新增功能

#### 多线路支持
- 添加美国线路: `https://api.gptbest.vip`
- 添加香港线路: `https://hk-api.gptbest.vip`
- 保留官方线路: `https://api.whatai.cc` (默认)

#### 令牌查询地址
- 新增统一的令牌查询地址: `https://usage.gptbest.vip`
- 支持查询 API 配额: `/v1/token/quota`
- 所有线路使用同一个查询地址

#### 配置面板增强
- 用户可以在配置面板中选择不同的神马 API 线路
- 对话及图像 API 标签页支持三条线路
- 视频生成 API 标签页支持三条线路
- 改进的连接测试使用令牌查询地址

### 🔧 改进

#### 前端改进
- `components/KeySelection.tsx`
  - 添加三条神马 API 线路到 IMAGE_PROVIDERS
  - 添加三条神马 API 线路到 VIDEO_PROVIDERS
  - 更新 testVideoConnection 使用令牌查询地址
  - 改进了用户界面

#### 后端改进
- `services/multimedia/MultiMediaService.ts`
  - 改进 executeWithRetry 方法
  - 添加提供商自动选择逻辑
  - 更好的错误处理和日志记录

- `api/multimedia.ts`
  - 改进配置管理器初始化
  - 增强错误日志
  - 更详细的调试信息

#### 文档改进
- `QUICK_REFERENCE.md`
  - 添加神马 API 线路选择表
  - 提供选择建议

### 📚 新增文档

- `SHENMA_API_ENDPOINTS.md` - 详细的端点配置说明
- `SHENMA_CONFIGURATION_GUIDE.md` - 完整的配置指南
- `SHENMA_UPDATE_SUMMARY.md` - 更新内容总结
- `DEPLOYMENT_CHECKLIST.md` - 部署检查清单
- `SHENMA_FINAL_SUMMARY.md` - 最终总结
- `CHANGELOG_SHENMA.md` - 本文件

### 🐛 修复

- 修复了视频测试连接的地址问题
- 改进了错误处理和日志记录
- 优化了配置管理逻辑

### ⚡ 性能优化

- 减少了不必要的配置加载
- 改进了错误处理效率
- 优化了日志记录

### 🔄 向后兼容性

- ✅ 所有更改都是向后兼容的
- ✅ 现有配置继续使用官方端点
- ✅ 用户可以随时切换线路
- ✅ 没有破坏性更改

### 📋 已知问题

- 无已知问题

### 🚀 部署说明

1. 提交代码到 main 分支
2. Vercel 自动部署
3. 验证部署成功

### 📝 升级指南

#### 对于用户
- 无需任何操作
- 配置面板会自动显示新的线路选项
- 可以选择最适合的线路

#### 对于开发者
- 更新 `components/KeySelection.tsx`
- 更新 `services/multimedia/MultiMediaService.ts`
- 更新 `api/multimedia.ts`
- 查看新增文档了解详情

### 🙏 致谢

感谢用户的反馈和建议，使我们能够改进应用。

---

## 版本历史

### [1.0.0] - 2025-12-26
- 初始版本
- 添加神马 API 多线路支持
- 添加令牌查询地址
- 完整的文档和指南

---

## 下一步计划

### 短期 (1-2 周)
- [ ] 收集用户反馈
- [ ] 监控性能指标
- [ ] 修复任何发现的问题

### 中期 (1-3 个月)
- [ ] 添加更多 API 提供商
- [ ] 改进配置界面
- [ ] 添加更多功能

### 长期 (3-6 个月)
- [ ] 支持自定义线路
- [ ] 添加线路性能监控
- [ ] 自动线路选择

---

## 联系方式

如有问题或建议，请联系开发团队。

---

**最后更新**: 2025-12-26
**维护者**: AI Assistant
**许可证**: MIT
