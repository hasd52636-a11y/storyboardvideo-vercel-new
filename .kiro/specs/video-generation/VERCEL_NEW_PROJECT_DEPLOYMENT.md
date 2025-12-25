# Vercel 新项目部署指南（完整版）

## 概述

本指南将帮助你将当前项目作为**全新项目**部署到 Vercel，不会覆盖之前的项目。

## 前置条件

- GitHub 账户
- Vercel 账户
- Git 已安装
- Node.js 已安装

---

## 第一步：创建新的 GitHub 仓库

### 1.1 在 GitHub 创建新仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角 **+** → **New repository**
3. 填写信息：
   - **Repository name**: `storyboard-vercel-new` （或其他名称）
   - **Description**: Storyboard Master - Vercel Edition
   - **Visibility**: Public（推荐）或 Private
   - **Initialize repository**: 不勾选（我们会推送现有代码）
4. 点击 **Create repository**

### 1.2 获取仓库 URL

创建后，你会看到类似这样的 URL：
```
https://github.com/your-username/storyboard-vercel-new.git
```

---

## 第二步：准备本地代码

### 2.1 初始化新的 Git 远程

在项目根目录运行：

```bash
# 添加新的远程仓库（不删除旧的）
git remote add vercel-new https://github.com/your-username/storyboard-vercel-new.git

# 验证远程仓库
git remote -v
```

你应该看到：
```
origin          https://github.com/old-username/old-repo.git (fetch)
origin          https://github.com/old-username/old-repo.git (push)
vercel-new      https://github.com/your-username/storyboard-vercel-new.git (fetch)
vercel-new      https://github.com/your-username/storyboard-vercel-new.git (push)
```

### 2.2 推送代码到新仓库

```bash
# 推送所有分支到新仓库
git push -u vercel-new main

# 或者如果主分支是 master
git push -u vercel-new master
```

---

## 第三步：在 Vercel 创建新项目

### 3.1 导入项目到 Vercel

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **Add New** → **Project**
3. 选择 **Import Git Repository**
4. 搜索并选择 `storyboard-vercel-new` 仓库
5. 点击 **Import**

### 3.2 配置项目设置

在 **Configure Project** 页面：

- **Project Name**: `storyboard-vercel-new` （或自定义名称）
- **Framework Preset**: 选择 **Vite**
- **Root Directory**: `./` （默认）
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

点击 **Deploy**

---

## 第四步：创建 Vercel Postgres 数据库

### 4.1 在 Vercel 创建数据库

1. 在 Vercel Dashboard 中，选择你的新项目
2. 进入 **Storage** 标签
3. 点击 **Create Database** → **Postgres**
4. 选择 **Hobby** 免费计划
5. 选择地区（推荐选择离你最近的）
6. 点击 **Create**

### 4.2 获取连接字符串

1. 数据库创建后，点击 **Connect**
2. 选择 **Node.js**
3. 复制 `.env.local` 中的内容

示例：
```
POSTGRES_URLCONNSTR=postgres://user:password@host:5432/dbname
```

---

## 第五步：设置环境变量

### 5.1 在 Vercel 设置环境变量

1. 在项目页面，进入 **Settings** → **Environment Variables**
2. 添加以下变量：

| 变量名 | 值 | 说明 |
|------|-----|------|
| `POSTGRES_URLCONNSTR` | `postgres://...` | 从第四步复制 |
| `ADMIN_PASSWORD` | `admin123` | 管理员密码（可自定义） |

3. 点击 **Save**

### 5.2 本地开发环境

在项目根目录创建 `.env.local` 文件：

```bash
POSTGRES_URLCONNSTR=postgres://user:password@host:5432/dbname
ADMIN_PASSWORD=admin123
```

**注意**：不要提交 `.env.local` 到 Git（已在 `.gitignore` 中）

---

## 第六步：初始化数据库

### 6.1 本地初始化

```bash
# 安装依赖
npm install

# 初始化数据库（创建表）
node scripts/init-db.js
```

你应该看到：
```
✅ Database initialized successfully
```

### 6.2 验证数据库

在 Vercel Dashboard 中：
1. 进入 **Storage** → 你的数据库
2. 点击 **Query** 标签
3. 运行查询验证表已创建：

```sql
SELECT * FROM users;
SELECT * FROM transactions;
```

---

## 第七步：部署到 Vercel

### 7.1 推送代码触发部署

```bash
# 确保所有更改已提交
git add .
git commit -m "Setup Vercel Postgres and Functions"

# 推送到新仓库
git push vercel-new main
```

Vercel 会自动检测到推送并开始部署。

### 7.2 监控部署

1. 在 Vercel Dashboard 中查看 **Deployments** 标签
2. 等待部署完成（通常 1-2 分钟）
3. 部署完成后，你会看到一个绿色的 ✓ 标记

---

## 第八步：验证部署

### 8.1 获取部署 URL

部署完成后，你会看到类似这样的 URL：
```
https://storyboard-vercel-new.vercel.app
```

### 8.2 测试 API 端点

使用 curl 或 Postman 测试：

```bash
# 注册新用户
curl -X POST https://storyboard-vercel-new.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

# 预期响应
{
  "success": true,
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "balance": 10
  },
  "token": "eyJ1c2VySWQiOjEsImlhdCI6MTcwMzAwMDAwMCwiZXhwIjoxNzAzNjA0ODAwfQ=="
}
```

```bash
# 登录
curl -X POST https://storyboard-vercel-new.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

```bash
# 获取用户信息
curl -X GET https://storyboard-vercel-new.vercel.app/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 8.3 测试前端

1. 打开 `https://storyboard-vercel-new.vercel.app`
2. 应该看到登录/注册对话框
3. 尝试注册新账户
4. 验证余额显示为 ¥10

---

## 第九步：配置自定义域名（可选）

### 9.1 添加自定义域名

1. 在项目 **Settings** → **Domains**
2. 点击 **Add Domain**
3. 输入你的域名（例如 `storyboard.yourdomain.com`）
4. 按照 Vercel 的指示配置 DNS 记录

---

## 常见问题

### Q: 如何区分新旧项目？

A: 
- **旧项目**：原来的 Vercel 项目（如果有的话）
- **新项目**：`storyboard-vercel-new`（或你自定义的名称）
- 两个项目完全独立，不会相互影响

### Q: 如何在两个项目之间切换？

A: 使用 Git 远程仓库：
```bash
# 推送到旧项目
git push origin main

# 推送到新项目
git push vercel-new main
```

### Q: 数据库连接失败？

A: 检查以下几点：
1. 环境变量 `POSTGRES_URLCONNSTR` 是否正确设置
2. 数据库是否已创建
3. 数据库初始化脚本是否已运行
4. 网络连接是否正常

### Q: API 返回 404？

A: 确保：
1. 文件在 `api/` 文件夹中
2. 文件名正确（例如 `api/auth/register.js`）
3. 部署已完成（检查 Vercel Dashboard）
4. 使用正确的 URL 路径

### Q: 如何重新初始化数据库？

A: 
```bash
# 在 Vercel Postgres 控制面板中删除表
# 然后运行初始化脚本
node scripts/init-db.js
```

### Q: 如何更新代码？

A: 
```bash
# 修改代码后
git add .
git commit -m "Your commit message"
git push vercel-new main

# Vercel 会自动部署
```

---

## 项目结构

```
storyboard-vercel-new/
├── api/                          # Vercel Functions
│   ├── auth.js                   # 认证逻辑
│   ├── auth/
│   │   ├── register.js           # 注册端点
│   │   └── login.js              # 登录端点
│   ├── user/
│   │   ├── profile.js            # 获取用户信息
│   │   ├── deduct.js             # 扣费
│   │   └── transactions.js       # 交易记录
│   └── admin/
│       ├── get-all-users.js      # 获取所有用户
│       └── update-balance.js     # 更新余额
├── scripts/
│   └── init-db.js                # 数据库初始化
├── components/
│   ├── AuthDialog.tsx            # 登录/注册
│   └── AdminPanel.tsx            # 管理员面板
├── App.tsx                       # 主应用
├── package.json                  # 依赖配置
├── vercel.json                   # Vercel 配置
└── .env.local                    # 本地环境变量（不提交）
```

---

## 成本估算

**完全免费：**
- ✅ Vercel 前端托管：免费（Hobby 计划）
- ✅ Vercel Postgres：免费额度（足够小型项目）
- ✅ Vercel Functions：免费额度（足够小型项目）

**总成本**：$0/月

---

## 下一步

1. ✅ 创建新的 GitHub 仓库
2. ✅ 推送代码到新仓库
3. ✅ 在 Vercel 创建新项目
4. ✅ 创建 Postgres 数据库
5. ✅ 设置环境变量
6. ✅ 初始化数据库
7. ✅ 验证部署
8. ✅ 测试 API 和前端

完成后，你的应用就完全部署在 Vercel 上了，无需电脑开着！

---

## 支持

如有问题，请检查：
- Vercel Dashboard 的 **Deployments** 标签查看部署日志
- Vercel Dashboard 的 **Functions** 标签查看函数日志
- 浏览器开发者工具的 **Network** 标签查看 API 请求

