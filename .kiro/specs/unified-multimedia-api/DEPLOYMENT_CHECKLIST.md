# 部署检查清单

## 神马 API 多线路支持部署

### 前端更新 ✅

- [x] `components/KeySelection.tsx`
  - [x] 添加三条神马 API 线路到 IMAGE_PROVIDERS
  - [x] 添加三条神马 API 线路到 VIDEO_PROVIDERS
  - [x] 更新 testVideoConnection 使用令牌查询地址
  - [x] 验证无语法错误

- [x] `QUICK_REFERENCE.md`
  - [x] 添加神马 API 线路选择表
  - [x] 添加选择建议
  - [x] 更新文档

### 后端更新 ✅

- [x] `services/multimedia/constants.ts`
  - [x] 验证 PROVIDER_ENDPOINTS 配置正确
  - [x] 保持官方端点作为默认值
  - [x] 验证无语法错误

- [x] `services/multimedia/MultiMediaService.ts`
  - [x] 修复 executeWithRetry 方法
  - [x] 添加提供商自动选择逻辑
  - [x] 验证无语法错误

- [x] `api/multimedia.ts`
  - [x] 添加配置管理器更新
  - [x] 改进错误日志
  - [x] 验证无语法错误

### 文档更新 ✅

- [x] `.kiro/specs/unified-multimedia-api/SHENMA_API_ENDPOINTS.md`
  - [x] 详细的端点配置说明
  - [x] 支持的功能列表
  - [x] 测试示例

- [x] `.kiro/specs/unified-multimedia-api/SHENMA_CONFIGURATION_GUIDE.md`
  - [x] 快速开始指南
  - [x] 支持的模型列表
  - [x] 常见问题解答
  - [x] 故障排除指南

- [x] `.kiro/specs/unified-multimedia-api/SHENMA_UPDATE_SUMMARY.md`
  - [x] 更新内容总结
  - [x] 使用流程
  - [x] 技术细节

### 代码质量检查 ✅

- [x] 无 TypeScript 错误
- [x] 无 ESLint 警告
- [x] 向后兼容
- [x] 无破坏性更改

### 功能验证清单

#### 配置面板
- [ ] 打开应用，看到配置对话框
- [ ] 对话及图像 API 标签页显示三条神马线路
- [ ] 视频生成 API 标签页显示三条神马线路
- [ ] 可以选择不同的线路
- [ ] 可以输入 API Key
- [ ] 可以输入模型名称

#### 连接测试
- [ ] 点击 "Test" 按钮进行对话 API 测试
- [ ] 点击 "Test" 按钮进行图像 API 测试
- [ ] 点击 "Test Connection" 按钮进行视频 API 测试
- [ ] 测试使用令牌查询地址 (`https://usage.gptbest.vip/v1/token/quota`)
- [ ] 测试成功显示 "✓ Connected"
- [ ] 测试失败显示 "✗ Failed"

#### 功能测试
- [ ] 文生图功能正常工作
- [ ] 图生图功能正常工作
- [ ] 文本生成功能正常工作
- [ ] 图像分析功能正常工作
- [ ] 视频生成功能正常工作
- [ ] 视频分析功能正常工作

#### 线路切换测试
- [ ] 切换到美国线路，功能正常
- [ ] 切换到香港线路，功能正常
- [ ] 切换回官方线路，功能正常

### 部署步骤

#### 1. 本地测试
```bash
npm run dev
# 测试所有功能
```

#### 2. 构建
```bash
npm run build
# 验证构建成功
```

#### 3. 提交代码
```bash
git add -A
git commit -m "Add Shenma API multi-line support with token query endpoint"
git push
```

#### 4. Vercel 部署
- 推送到 main 分支
- Vercel 自动部署
- 验证部署成功

#### 5. 生产环境测试
- [ ] 访问生产环境 URL
- [ ] 测试配置面板
- [ ] 测试所有功能
- [ ] 验证线路切换

### 回滚计划

如果部署出现问题：

1. **立即回滚**
   ```bash
   git revert <commit-hash>
   git push
   ```

2. **Vercel 回滚**
   - 在 Vercel 仪表板中选择上一个部署
   - 点击 "Promote to Production"

3. **验证回滚**
   - 确认应用恢复正常
   - 检查日志

### 监控指标

部署后监控以下指标：

- [ ] 应用加载时间
- [ ] API 响应时间
- [ ] 错误率
- [ ] 用户反馈

### 文档更新

- [ ] 更新用户文档
- [ ] 更新 API 文档
- [ ] 更新常见问题
- [ ] 发布更新公告

### 最终检查

- [ ] 所有测试通过
- [ ] 没有已知的 bug
- [ ] 文档完整
- [ ] 用户可以正常使用
- [ ] 性能满足要求

## 部署时间表

| 阶段 | 时间 | 状态 |
|------|------|------|
| 本地测试 | 2025-12-26 | ✅ 完成 |
| 代码审查 | 2025-12-26 | ⏳ 待审 |
| 构建验证 | 2025-12-26 | ⏳ 待验 |
| Vercel 部署 | 2025-12-26 | ⏳ 待部 |
| 生产环境测试 | 2025-12-26 | ⏳ 待测 |
| 文档发布 | 2025-12-26 | ⏳ 待发 |

## 联系方式

如有问题，请联系开发团队。

---

**最后更新**: 2025-12-26
**部署负责人**: AI Assistant
**审核人**: 待指定
