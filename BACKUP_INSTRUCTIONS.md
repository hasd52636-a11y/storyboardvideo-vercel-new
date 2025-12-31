# 项目备份和恢复指南

## 🔒 备份策略

### 备份方式
1. **Git 版本控制** - 主要备份方式
2. **Vercel 部署** - 生产环境备份
3. **本地文件备份** - 定期快照

---

## 📦 Git 备份

### 查看当前状态
```bash
git status
git log --oneline -10
```

### 提交当前更改
```bash
git add .
git commit -m "Backup: $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main
```

### 创建备份标签
```bash
git tag -a backup-20251231 -m "Complete backup - 2025-12-31"
git push origin backup-20251231
```

### 查看所有备份标签
```bash
git tag -l
git show backup-20251231
```

---

## 💾 本地文件备份

### 创建完整备份压缩包
```bash
# Windows PowerShell
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
Compress-Archive -Path . -DestinationPath "backup_$timestamp.zip" -Exclude @("node_modules", ".git", "dist", ".vercel")

# Linux/Mac
tar --exclude='node_modules' --exclude='.git' --exclude='dist' --exclude='.vercel' -czf backup_$(date +%Y%m%d_%H%M%S).tar.gz .
```

### 备份关键文件
```bash
# 创建备份目录
mkdir backups

# 备份源代码
cp -r components backups/
cp -r lib backups/
cp -r services backups/
cp -r types.ts backups/
cp -r *.tsx backups/
cp -r *.ts backups/

# 备份配置文件
cp package.json backups/
cp tsconfig.json backups/
cp vite.config.ts backups/
cp tailwind.config.js backups/
cp vercel.json backups/
```

---

## 🔄 恢复流程

### 从 Git 恢复
```bash
# 查看历史提交
git log --oneline

# 恢复到特定提交
git checkout <commit-hash>

# 或恢复到特定标签
git checkout backup-20251231

# 恢复到最新版本
git checkout main
```

### 从本地备份恢复
```bash
# Windows PowerShell
Expand-Archive -Path backup_20251231_115211.zip -DestinationPath .

# Linux/Mac
tar -xzf backup_20251231_115211.tar.gz
```

### 恢复后的步骤
```bash
# 1. 安装依赖
npm install

# 2. 验证构建
npm run build

# 3. 启动开发服务器
npm run dev

# 4. 测试功能
# 访问 http://localhost:5173
```

---

## 🚀 Vercel 部署备份

### 查看部署历史
```bash
vercel list
vercel logs
```

### 回滚到之前的部署
```bash
# 查看部署列表
vercel list

# 回滚到特定部署
vercel rollback <deployment-url>
```

### 导出部署配置
```bash
# 查看当前配置
vercel env ls

# 导出环境变量
vercel env pull
```

---

## 📋 备份检查清单

### 每周备份
- [ ] 运行 `git push` 确保代码已推送
- [ ] 创建备份标签 `git tag -a backup-YYYYMMDD`
- [ ] 验证 Vercel 部署状态
- [ ] 检查生产环境功能

### 每月备份
- [ ] 创建完整的本地压缩备份
- [ ] 验证备份文件完整性
- [ ] 测试恢复流程
- [ ] 更新备份文档

### 关键更新后
- [ ] 立即提交代码
- [ ] 创建备份标签
- [ ] 验证部署成功
- [ ] 记录更新内容

---

## 🔐 安全建议

### 敏感信息保护
- ✅ API 密钥存储在 localStorage（客户端）
- ✅ 不在代码中硬编码敏感信息
- ✅ 使用环境变量管理配置
- ✅ 定期轮换 API 密钥

### 备份安全
- ✅ 备份文件存储在安全位置
- ✅ 定期验证备份完整性
- ✅ 保持多个备份副本
- ✅ 记录备份时间和版本

### 访问控制
- ✅ 限制 Git 仓库访问权限
- ✅ 使用强密码保护账户
- ✅ 启用两因素认证
- ✅ 定期审计访问日志

---

## 📊 备份统计

### 项目大小
- 源代码: ~500KB
- node_modules: ~800MB（不备份）
- 完整备份: ~50MB（压缩后）

### 备份频率
- 自动备份: 每次 Git 提交
- 手动备份: 每周一次
- 完整备份: 每月一次
- 关键备份: 重大更新后

---

## 🆘 故障排查

### 备份失败
```bash
# 检查 Git 状态
git status

# 检查网络连接
ping github.com

# 重试推送
git push origin main --force
```

### 恢复失败
```bash
# 检查备份文件完整性
ls -lh backup_*.zip

# 验证压缩包
unzip -t backup_*.zip

# 清理并重新恢复
rm -rf node_modules
npm install
```

### 部署失败
```bash
# 检查 Vercel 日志
vercel logs

# 验证构建配置
cat vercel.json

# 手动部署
vercel --prod
```

---

## 📞 联系支持

如遇到备份或恢复问题，请：
1. 查看错误日志
2. 检查网络连接
3. 验证文件权限
4. 尝试备用恢复方法

---

**最后更新**: 2025-12-31
**备份状态**: ✅ 已配置
**下次检查**: 2026-01-07
