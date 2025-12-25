# Vercel 新项目部署检查清单

## 前置准备

- [ ] GitHub 账户已创建
- [ ] Vercel 账户已创建
- [ ] Git 已安装
- [ ] Node.js 已安装
- [ ] 项目代码已准备好

---

## GitHub 仓库设置

- [ ] 在 GitHub 创建新仓库 `storyboard-vercel-new`
- [ ] 获取仓库 URL：`https://github.com/your-username/storyboard-vercel-new.git`
- [ ] 添加 Git 远程：`git remote add vercel-new <URL>`
- [ ] 推送代码：`git push -u vercel-new main`
- [ ] 验证代码已推送到 GitHub

---

## Vercel 项目创建

- [ ] 登录 Vercel Dashboard
- [ ] 点击 **Add New** → **Project**
- [ ] 选择 **Import Git Repository**
- [ ] 搜索并选择 `storyboard-vercel-new`
- [ ] 框架选择 **Vite**
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] 点击 **Deploy**
- [ ] 等待部署完成（通常 1-2 分钟）
- [ ] 获取部署 URL：`https://storyboard-vercel-new.vercel.app`

---

## 数据库设置

- [ ] 进入项目 **Storage** 标签
- [ ] 点击 **Create Database** → **Postgres**
- [ ] 选择 **Hobby** 免费计划
- [ ] 选择地区
- [ ] 点击 **Create**
- [ ] 等待数据库创建完成
- [ ] 点击 **Connect**
- [ ] 复制 `.env.local` 内容

---

## 环境变量配置

- [ ] 进入项目 **Settings** → **Environment Variables**
- [ ] 添加 `POSTGRES_URLCONNSTR`：
  - [ ] 值：从数据库连接字符串复制
  - [ ] 点击 **Add**
- [ ] 添加 `ADMIN_PASSWORD`：
  - [ ] 值：`admin123`
  - [ ] 点击 **Add**
- [ ] 验证两个变量都已添加

---

## 本地数据库初始化

- [ ] 创建 `.env.local` 文件
- [ ] 复制 `POSTGRES_URLCONNSTR` 到 `.env.local`
- [ ] 运行 `npm install`
- [ ] 运行 `node scripts/init-db.js`
- [ ] 看到 `✅ Database initialized successfully` 消息

---

## 验证部署

### API 测试

- [ ] 测试注册端点：
  ```bash
  curl -X POST https://storyboard-vercel-new.vercel.app/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"username":"test","email":"test@example.com","password":"123"}'
  ```
  - [ ] 返回 200 状态码
  - [ ] 返回 `success: true`
  - [ ] 返回用户信息和 token

- [ ] 测试登录端点：
  ```bash
  curl -X POST https://storyboard-vercel-new.vercel.app/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"123"}'
  ```
  - [ ] 返回 200 状态码
  - [ ] 返回 `success: true`
  - [ ] 返回 token

- [ ] 测试获取用户信息：
  ```bash
  curl -X GET https://storyboard-vercel-new.vercel.app/api/user/profile \
    -H "Authorization: Bearer <TOKEN>"
  ```
  - [ ] 返回 200 状态码
  - [ ] 返回用户信息

### 前端测试

- [ ] 打开 `https://storyboard-vercel-new.vercel.app`
- [ ] 看到登录/注册对话框
- [ ] 尝试注册新账户
- [ ] 验证余额显示为 ¥10
- [ ] 尝试登录
- [ ] 验证用户信息正确显示

---

## 管理员面板测试

- [ ] 在前端找到管理员面板按钮
- [ ] 点击打开管理员面板
- [ ] 输入管理员密码：`admin123`
- [ ] 验证用户列表显示
- [ ] 选择一个用户
- [ ] 修改用户余额
- [ ] 验证余额已更新

---

## 代码更新流程

- [ ] 修改代码
- [ ] 运行 `git add .`
- [ ] 运行 `git commit -m "Your message"`
- [ ] 运行 `git push vercel-new main`
- [ ] 验证 Vercel 自动部署
- [ ] 检查部署日志

---

## 故障排查

如果遇到问题，检查以下几点：

### 部署失败
- [ ] 检查 Vercel Dashboard 的 **Deployments** 日志
- [ ] 查看构建错误信息
- [ ] 确保 `package.json` 中有所有必要的依赖

### API 返回 404
- [ ] 确保文件在 `api/` 文件夹中
- [ ] 检查文件名是否正确
- [ ] 等待部署完成后再测试
- [ ] 检查 Vercel Dashboard 的 **Functions** 标签

### 数据库连接失败
- [ ] 检查环境变量 `POSTGRES_URLCONNSTR` 是否正确
- [ ] 确保数据库已创建
- [ ] 验证连接字符串格式正确
- [ ] 检查网络连接

### 初始化失败
- [ ] 确保 `.env.local` 中有正确的连接字符串
- [ ] 检查 Node.js 版本是否兼容
- [ ] 查看错误消息获取更多信息

---

## 完成标记

- [ ] 所有检查项都已完成
- [ ] 部署成功
- [ ] API 测试通过
- [ ] 前端测试通过
- [ ] 管理员面板测试通过
- [ ] 项目已上线

---

## 后续维护

- [ ] 定期检查 Vercel Dashboard
- [ ] 监控 API 日志
- [ ] 备份数据库
- [ ] 更新依赖包
- [ ] 监控成本使用情况

---

## 联系方式

如有问题，请参考：
- [Vercel 文档](https://vercel.com/docs)
- [Vercel Postgres 文档](https://vercel.com/docs/storage/postgres)
- [项目部署指南](.kiro/specs/video-generation/VERCEL_NEW_PROJECT_DEPLOYMENT.md)

