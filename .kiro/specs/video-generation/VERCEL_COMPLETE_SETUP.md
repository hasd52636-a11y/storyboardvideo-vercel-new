# Vercel 完整部署指南

## 已完成的改造

✅ 后台改成 Vercel Functions（`api/` 文件夹）
✅ 数据库改成 Vercel Postgres
✅ 所有 API 端点已创建
✅ 前端已集成认证系统

## 部署步骤

### 1. 在 Vercel 创建 Postgres 数据库

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Storage** 标签
4. 点击 **Create Database** → **Postgres**
5. 选择 **Hobby** 免费计划
6. 创建数据库

### 2. 获取连接字符串

1. 数据库创建后，点击 **Connect**
2. 复制 `.env.local` 中的内容
3. 粘贴到项目根目录的 `.env.local` 文件

### 3. 初始化数据库

在项目根目录运行：
```bash
npm install
node scripts/init-db.js
```

这会创建 `users` 和 `transactions` 表。

### 4. 设置环境变量

在 Vercel 项目设置中添加：

**Environment Variables:**
```
POSTGRES_URLCONNSTR=<从 Vercel 复制>
ADMIN_PASSWORD=<你的管理员密码>
```

### 5. 推送到 GitHub

```bash
git add .
git commit -m "Migrate to Vercel Postgres and Functions"
git push origin main
```

Vercel 会自动部署。

### 6. 验证部署

部署完成后，测试 API：

```bash
# 注册
curl -X POST https://your-domain.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

# 登录
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

## 文件结构

```
api/
├── auth.js                 # 认证逻辑
├── auth/
│   ├── register.js        # 注册端点
│   └── login.js           # 登录端点
├── user/
│   ├── profile.js         # 获取用户信息
│   ├── deduct.js          # 扣费
│   └── transactions.js    # 交易记录
└── admin/
    ├── get-all-users.js   # 获取所有用户
    └── update-balance.js  # 更新余额

scripts/
└── init-db.js             # 数据库初始化

components/
├── AuthDialog.tsx         # 登录/注册
└── AdminPanel.tsx         # 管理员面板

App.tsx                     # 主应用（已集成认证）
```

## API 端点

所有端点都在 Vercel Functions 上运行：

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | `/api/auth/register` | 注册用户 |
| POST | `/api/auth/login` | 登录用户 |
| GET | `/api/user/profile` | 获取用户信息 |
| POST | `/api/user/deduct` | 扣费 |
| GET | `/api/user/transactions` | 交易记录 |
| GET | `/api/admin/get-all-users` | 获取所有用户 |
| POST | `/api/admin/update-balance` | 更新余额 |

## 成本

**完全免费：**
- Vercel 前端托管：免费
- Vercel Postgres：免费额度（足够）
- Vercel Functions：免费额度（足够）

## 常见问题

### Q: 数据库连接失败？
A: 检查 `.env.local` 中的 `POSTGRES_URLCONNSTR` 是否正确

### Q: 部署后 API 返回 404？
A: 确保文件在 `api/` 文件夹中，Vercel 会自动识别

### Q: 如何重新初始化数据库？
A: 在 Vercel 的 Postgres 控制面板中删除表，然后运行 `node scripts/init-db.js`

## 下一步

1. ✅ 推送代码到 GitHub
2. ✅ 在 Vercel 创建 Postgres 数据库
3. ✅ 设置环境变量
4. ✅ 初始化数据库
5. ✅ 测试 API

完成后，你的应用就完全部署在 Vercel 上了，无需电脑开着！
