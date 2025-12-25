# Vercel 新项目部署总结

## 概述

你现在可以将项目作为**全新项目**部署到 Vercel，而不会覆盖之前的项目。

---

## 为什么需要新项目？

| 方面 | 旧项目 | 新项目 |
|------|--------|--------|
| 数据库 | 独立 | 独立 |
| 用户数据 | 独立 | 独立 |
| 环境变量 | 独立 | 独立 |
| 部署 URL | 独立 | 独立 |
| 影响范围 | 不受影响 | 不受影响 |

---

## 快速开始（3 步）

### 1️⃣ 创建 GitHub 仓库
```bash
# 在 GitHub 创建新仓库
# 获得 URL: https://github.com/your-username/storyboard-vercel-new.git
```

### 2️⃣ 推送代码
```bash
# Linux/Mac
bash deploy-vercel-new.sh https://github.com/your-username/storyboard-vercel-new.git

# Windows
deploy-vercel-new.bat https://github.com/your-username/storyboard-vercel-new.git
```

### 3️⃣ 在 Vercel 部署
1. 打开 https://vercel.com/dashboard
2. 点击 **Add New** → **Project**
3. 选择你的新仓库
4. 点击 **Deploy**

---

## 部署后的步骤

### 创建数据库
1. 项目 → **Storage** → **Create Database** → **Postgres**
2. 选择 **Hobby** 免费计划
3. 复制连接字符串

### 设置环境变量
1. 项目 → **Settings** → **Environment Variables**
2. 添加：
   - `POSTGRES_URLCONNSTR` = 连接字符串
   - `ADMIN_PASSWORD` = `admin123`

### 初始化数据库
```bash
npm install
node scripts/init-db.js
```

---

## 验证部署

### 测试 API
```bash
# 注册
curl -X POST https://your-project.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"123"}'

# 登录
curl -X POST https://your-project.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123"}'
```

### 打开前端
访问 `https://your-project.vercel.app`

---

## 文件说明

| 文件 | 说明 |
|------|------|
| `VERCEL_NEW_PROJECT_DEPLOYMENT.md` | 完整部署指南 |
| `VERCEL_NEW_PROJECT_QUICK_START.md` | 快速开始指南 |
| `VERCEL_NEW_PROJECT_CHECKLIST.md` | 部署检查清单 |
| `deploy-vercel-new.sh` | Linux/Mac 部署脚本 |
| `deploy-vercel-new.bat` | Windows 部署脚本 |

---

## 项目结构

```
storyboard-vercel-new/
├── api/                          # Vercel Functions
│   ├── auth.js                   # 认证逻辑
│   ├── auth/
│   │   ├── register.js           # 注册
│   │   └── login.js              # 登录
│   ├── user/
│   │   ├── profile.js            # 用户信息
│   │   ├── deduct.js             # 扣费
│   │   └── transactions.js       # 交易记录
│   └── admin/
│       ├── get-all-users.js      # 获取用户
│       └── update-balance.js     # 更新余额
├── scripts/
│   └── init-db.js                # 数据库初始化
├── components/
│   ├── AuthDialog.tsx            # 登录/注册
│   └── AdminPanel.tsx            # 管理员面板
├── App.tsx                       # 主应用
└── package.json                  # 依赖
```

---

## API 端点

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | `/api/auth/register` | 注册用户 |
| POST | `/api/auth/login` | 登录用户 |
| GET | `/api/user/profile` | 获取用户信息 |
| POST | `/api/user/deduct` | 扣费 |
| GET | `/api/user/transactions` | 交易记录 |
| GET | `/api/admin/get-all-users` | 获取所有用户 |
| POST | `/api/admin/update-balance` | 更新余额 |

---

## 成本

✅ **完全免费**
- Vercel 前端托管：免费
- Vercel Postgres：免费额度
- Vercel Functions：免费额度

---

## 常见问题

### Q: 如何区分新旧项目？
A: 使用不同的 Git 远程仓库：
```bash
git push origin main          # 推送到旧项目
git push vercel-new main      # 推送到新项目
```

### Q: 如何在两个项目之间切换？
A: 使用 Git 远程仓库切换：
```bash
git remote -v                 # 查看所有远程
git push origin main          # 推送到旧项目
git push vercel-new main      # 推送到新项目
```

### Q: 数据库会共享吗？
A: 不会。每个项目都有独立的数据库。

### Q: 旧项目会受影响吗？
A: 不会。新项目完全独立。

### Q: 如何删除新项目？
A: 在 Vercel Dashboard 中删除项目，或删除 GitHub 仓库。

---

## 下一步

1. ✅ 阅读 `VERCEL_NEW_PROJECT_DEPLOYMENT.md` 了解详细步骤
2. ✅ 使用 `deploy-vercel-new.sh` 或 `deploy-vercel-new.bat` 推送代码
3. ✅ 在 Vercel 创建新项目
4. ✅ 创建 Postgres 数据库
5. ✅ 设置环境变量
6. ✅ 初始化数据库
7. ✅ 验证部署

---

## 支持

- 📖 [完整部署指南](./VERCEL_NEW_PROJECT_DEPLOYMENT.md)
- 🚀 [快速开始指南](./VERCEL_NEW_PROJECT_QUICK_START.md)
- ✅ [部署检查清单](./VERCEL_NEW_PROJECT_CHECKLIST.md)
- 🔧 [部署脚本](../../deploy-vercel-new.sh)

---

## 总结

现在你可以：
- ✅ 创建全新的 Vercel 项目
- ✅ 不覆盖旧项目
- ✅ 独立管理数据库
- ✅ 独立管理用户
- ✅ 完全免费部署

祝部署顺利！🎉

