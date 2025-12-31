# Vercel 直接部署指南（不通过 GitHub）

## 前置条件
- ✅ Vercel CLI 已安装（vercel@50.1.3）
- ✅ 项目已配置 vercel.json
- ✅ 环境变量已准备

## 部署步骤

### 1. 登录 Vercel
```bash
vercel login
```
- 选择登录方式（邮箱或 GitHub）
- 按照提示完成认证

### 2. 初始化项目（首次部署）
```bash
vercel
```
执行此命令后，Vercel CLI 会：
- 检测项目框架（Vite）
- 询问项目名称
- 询问是否创建新项目
- 配置构建设置

### 3. 设置环境变量
在 Vercel 仪表板中添加以下环境变量：
- `GEMINI_API_KEY`: 你的 Gemini API 密钥
- `ZHIPU_API_KEY`: 你的智谱 API 密钥（如果使用）

或使用 CLI：
```bash
vercel env add GEMINI_API_KEY
vercel env add ZHIPU_API_KEY
```

### 4. 部署到生产环境
```bash
vercel --prod
```

### 5. 查看部署状态
```bash
vercel list
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `vercel` | 部署到预览环境 |
| `vercel --prod` | 部署到生产环境 |
| `vercel env list` | 查看环境变量 |
| `vercel env add KEY` | 添加环境变量 |
| `vercel logs` | 查看部署日志 |
| `vercel remove` | 删除项目 |

## 项目配置说明

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "vite"
}
```

### 构建设置
- **框架**: Vite
- **构建命令**: `npm run build`
- **输出目录**: `dist`
- **安装命令**: `npm install`

## 环境变量配置

项目使用以下环境变量：
- `GEMINI_API_KEY`: Google Gemini API 密钥
- `ZHIPU_API_KEY`: 智谱 API 密钥

这些变量在 `vite.config.ts` 中被注入到构建中。

## 故障排除

### 构建失败
1. 检查本地构建是否成功：`npm run build`
2. 查看 Vercel 部署日志
3. 确保所有依赖都已安装

### 环境变量未生效
1. 确认变量已在 Vercel 仪表板中添加
2. 重新部署：`vercel --prod`
3. 检查 vite.config.ts 中的变量名称是否匹配

### API 调用失败
1. 验证 API 密钥是否正确
2. 检查 API 端点是否可访问
3. 查看浏览器控制台的错误信息

## 后续更新

每次更新代码后，只需运行：
```bash
vercel --prod
```

Vercel 会自动检测变更并重新部署。
