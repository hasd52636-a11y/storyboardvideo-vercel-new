# 🚀 直接部署到 Vercel - 新项目

## 📋 部署步骤

### 第 1 步：在 GitHub 创建新仓库

1. 打开 https://github.com/new
2. 输入仓库名：`storyboard-vercel-new`
3. 选择 **Public**
4. 点击 **Create repository**
5. 复制仓库 URL（HTTPS）

### 第 2 步：添加 GitHub 远程并推送

```bash
# 添加远程仓库
git remote add github https://github.com/your-username/storyboard-vercel-new.git

# 推送代码
git push -u github master
```

### 第 3 步：在 Vercel 导入项目

1. 打开 https://vercel.com/dashboard
2. 点击 **Add New** → **Project**
3. 选择 **Import Git Repository**
4. 搜索 `storyboard-vercel-new`
5. 点击 **Import**

### 第 4 步：配置 Vercel 项目

- **Project Name**: `storyboard-vercel-new`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- 点击 **Deploy**

### 第 5 步：创建 Postgres 数据库

1. 项目 → **Storage** → **Create Database** → **Postgres**
2. 选择 **Hobby** 免费计划
3. 点击 **Create**

### 第 6 步：设置环境变量

1. 项目 → **Settings** → **Environment Variables**
2. 添加：
   - `POSTGRES_URLCONNSTR` = 从数据库连接字符串复制
   - `ADMIN_PASSWORD` = `admin123`

### 第 7 步：初始化数据库

```bash
npm install
node scripts/init-db.js
```

### 第 8 步：验证部署

```bash
curl -X POST https://storyboard-vercel-new.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"123"}'
```

---

## ✅ 完成！

你的新项目现在已部署到 Vercel，不会覆盖旧项目。

