# Vercel 新项目快速开始指南

## 5 分钟快速部署

### 第 1 步：创建 GitHub 仓库（2 分钟）

```bash
# 在 GitHub 创建新仓库，获得 URL，例如：
# https://github.com/your-username/storyboard-vercel-new.git
```

### 第 2 步：推送代码（1 分钟）

**Linux/Mac:**
```bash
bash deploy-vercel-new.sh https://github.com/your-username/storyboard-vercel-new.git
```

**Windows:**
```bash
deploy-vercel-new.bat https://github.com/your-username/storyboard-vercel-new.git
```

或手动推送：
```bash
git remote add vercel-new https://github.com/your-username/storyboard-vercel-new.git
git push -u vercel-new main
```

### 第 3 步：在 Vercel 部署（2 分钟）

1. 打开 https://vercel.com/dashboard
2. 点击 **Add New** → **Project**
3. 选择 **Import Git Repository**
4. 搜索 `storyboard-vercel-new`
5. 点击 **Import**
6. 框架选择 **Vite**
7. 点击 **Deploy**

---

## 部署后配置

### 创建数据库

1. 项目页面 → **Storage** 标签
2. **Create Database** → **Postgres**
3. 选择 **Hobby** 免费计划
4. 点击 **Create**

### 设置环境变量

1. 项目页面 → **Settings** → **Environment Variables**
2. 添加：
   - `POSTGRES_URLCONNSTR` = 从数据库连接字符串复制
   - `ADMIN_PASSWORD` = `admin123`

### 初始化数据库

```bash
npm install
node scripts/init-db.js
```

---

## 验证部署

### 测试注册 API

```bash
curl -X POST https://your-project.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 打开前端

访问 `https://your-project.vercel.app`

---

## 常见问题

| 问题 | 解决方案 |
|------|--------|
| 推送失败 | 检查 GitHub 仓库 URL 是否正确 |
| 部署失败 | 检查 Vercel Dashboard 的 Deployments 日志 |
| API 返回 404 | 确保文件在 `api/` 文件夹中，等待部署完成 |
| 数据库连接失败 | 检查环境变量 `POSTGRES_URLCONNSTR` 是否正确 |
| 初始化失败 | 确保 `.env.local` 中有正确的连接字符串 |

---

## 项目 URL

部署完成后，你的项目 URL 为：
```
https://storyboard-vercel-new.vercel.app
```

（或你自定义的项目名称）

---

## 关键文件

| 文件 | 说明 |
|------|------|
| `api/auth/register.js` | 注册端点 |
| `api/auth/login.js` | 登录端点 |
| `api/user/profile.js` | 获取用户信息 |
| `api/user/deduct.js` | 扣费 |
| `api/admin/update-balance.js` | 更新余额 |
| `scripts/init-db.js` | 数据库初始化 |
| `components/AuthDialog.tsx` | 登录/注册 UI |
| `components/AdminPanel.tsx` | 管理员面板 |

---

## 成本

✅ **完全免费**
- Vercel 前端托管：免费
- Vercel Postgres：免费额度
- Vercel Functions：免费额度

---

## 下一步

1. ✅ 创建 GitHub 仓库
2. ✅ 推送代码
3. ✅ 在 Vercel 部署
4. ✅ 创建数据库
5. ✅ 设置环境变量
6. ✅ 初始化数据库
7. ✅ 验证部署

完成！你的应用现在完全部署在 Vercel 上了。

