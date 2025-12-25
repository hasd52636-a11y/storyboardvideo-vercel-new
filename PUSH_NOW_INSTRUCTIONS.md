# 🚀 立即推送到 Vercel - 新项目

## 前置条件

1. ✅ 代码已提交到 Git
2. ✅ 你有 GitHub 账户
3. ✅ 你已在 GitHub 创建新仓库（或准备创建）

---

## 🎯 3 步快速推送

### 第 1 步：在 GitHub 创建新仓库

1. 打开 https://github.com/new
2. 输入仓库名：`storyboard-vercel-new`
3. 选择 **Public**
4. 点击 **Create repository**
5. 复制仓库 URL（HTTPS）

### 第 2 步：运行推送脚本

**Linux/Mac:**
```bash
bash PUSH_TO_VERCEL_NOW.sh your-username storyboard-vercel-new
```

**Windows:**
```bash
PUSH_TO_VERCEL_NOW.bat your-username storyboard-vercel-new
```

**示例：**
```bash
# Linux/Mac
bash PUSH_TO_VERCEL_NOW.sh andypowerfull storyboard-vercel-new

# Windows
PUSH_TO_VERCEL_NOW.bat andypowerfull storyboard-vercel-new
```

### 第 3 步：在 Vercel 部署

1. 打开 https://vercel.com/dashboard
2. 点击 **Add New** → **Project**
3. 选择 **Import Git Repository**
4. 搜索 `storyboard-vercel-new`
5. 点击 **Import**
6. 框架选择 **Vite**
7. 点击 **Deploy**

---

## 📋 部署后的步骤

### 1. 创建数据库
- 项目 → **Storage** → **Create Database** → **Postgres**
- 选择 **Hobby** 免费计划
- 点击 **Create**

### 2. 设置环境变量
- 项目 → **Settings** → **Environment Variables**
- 添加：
  - `POSTGRES_URLCONNSTR` = 从数据库连接字符串复制
  - `ADMIN_PASSWORD` = `admin123`

### 3. 初始化数据库
```bash
npm install
node scripts/init-db.js
```

### 4. 验证部署
```bash
curl -X POST https://storyboard-vercel-new.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"123"}'
```

---

## 🔑 关键信息

### 新项目 URL
```
https://storyboard-vercel-new.vercel.app
```

### 环境变量
```
POSTGRES_URLCONNSTR=postgres://...
ADMIN_PASSWORD=admin123
```

### API 端点
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `GET /api/user/profile` - 用户信息
- `POST /api/user/deduct` - 扣费
- `GET /api/admin/get-all-users` - 获取用户
- `POST /api/admin/update-balance` - 更新余额

---

## ✨ 特点

✅ **完全免费**
- Vercel 前端托管：免费
- Vercel Postgres：免费额度
- Vercel Functions：免费额度

✅ **无需电脑开着**
- 完全云端部署
- 自动扩展
- 自动备份

✅ **独立项目**
- 不覆盖旧项目
- 独立数据库
- 独立用户数据

---

## 🚀 现在就开始

### Linux/Mac 用户
```bash
bash PUSH_TO_VERCEL_NOW.sh your-username storyboard-vercel-new
```

### Windows 用户
```bash
PUSH_TO_VERCEL_NOW.bat your-username storyboard-vercel-new
```

---

**祝部署顺利！** 🎉

