# Vercel 部署指南 - 新项目

## 快速开始

### 步骤 1: 连接 GitHub 仓库

1. 将本地代码推送到 GitHub：
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

2. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
3. 点击 "Add New..." → "Project"
4. 选择 "Import Git Repository"
5. 搜索并选择你的仓库
6. 点击 "Import"

### 步骤 2: 配置项目设置

在 Vercel 导入页面：

**Framework Preset**: Vite
**Build Command**: `npm run build`
**Output Directory**: `dist`
**Install Command**: `npm install`

### 步骤 3: 设置环境变量

在 Vercel 项目设置中添加以下环境变量：

```
VITE_GOOGLE_API_KEY=your_google_api_key_here
VITE_VIDEO_API_KEY=your_video_api_key_here
```

### 步骤 4: 部署

点击 "Deploy" 按钮，Vercel 会自动：
- 安装依赖
- 构建项目
- 部署到生产环境

## 环境变量配置

### 本地开发 (.env.local)
```
VITE_GOOGLE_API_KEY=your_key
VITE_VIDEO_API_KEY=your_key
```

### Vercel 生产环境
在 Vercel Dashboard → Settings → Environment Variables 中添加相同的变量

## 自动部署

配置完成后，每次推送到 main 分支时，Vercel 会自动部署新版本。

## 常见问题

### 构建失败
- 检查 `npm run build` 是否在本地成功
- 查看 Vercel 构建日志获取详细错误信息

### 环境变量未生效
- 确保变量名称以 `VITE_` 开头（Vite 要求）
- 重新部署以应用新的环境变量

### 性能优化
- Vercel 自动启用 Edge Caching
- 使用 Vercel Analytics 监控性能

## 项目信息

- **项目名称**: storyboard-master
- **框架**: Vite + React
- **构建输出**: dist/
- **Node 版本**: 18.x (Vercel 默认)

## 后续步骤

1. ✅ 初始化 Git 仓库
2. ⏳ 推送到 GitHub
3. ⏳ 在 Vercel 导入项目
4. ⏳ 配置环境变量
5. ⏳ 部署

