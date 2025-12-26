# Vercel 部署配置

## 部署信息

- **生产 URL**: https://sora.wboke.com
- **Vercel 项目**: storyboard-master
- **部署时间**: 2025-12-26

## 环境变量配置

在 Vercel 仪表板中设置以下环境变量：

### 必需的环境变量

1. **NEXT_PUBLIC_API_BASE_URL**
   - 值: `https://sora.wboke.com`
   - 说明: API 基础 URL，用于前端调用后端 API
   - 作用域: Production, Preview, Development

2. **DATABASE_URL**
   - 值: 你的 PostgreSQL 连接字符串
   - 说明: Prisma 数据库连接
   - 作用域: Production, Preview, Development

### 可选的环境变量

3. **SHENMA_API_KEY**
   - 说明: 神马 API 密钥
   - 作用域: Production

4. **OPENAI_API_KEY**
   - 说明: OpenAI API 密钥
   - 作用域: Production

5. **ZHIPU_API_KEY**
   - 说明: 智谱 API 密钥
   - 作用域: Production

6. **DAYUYU_API_KEY**
   - 说明: 大语言 API 密钥
   - 作用域: Production

## 配置步骤

1. 登录 [Vercel 仪表板](https://vercel.com)
2. 选择 `storyboard-master` 项目
3. 进入 **Settings** → **Environment Variables**
4. 添加上述环境变量
5. 重新部署项目

## API 路由

所有 API 调用都通过统一的端点：

```
GET  /api/multimedia?action=config
POST /api/multimedia?action=config
PUT  /api/multimedia?action=config
POST /api/multimedia?action=text-to-image
POST /api/multimedia?action=image-to-image
POST /api/multimedia?action=text-generation
POST /api/multimedia?action=image-analysis
POST /api/multimedia?action=video-generation
POST /api/multimedia?action=video-analysis
```

## 本地开发

在本地开发时，确保 `.env.local` 中设置了正确的 `NEXT_PUBLIC_API_BASE_URL`：

```bash
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"
```

## 故障排除

### API 调用失败

1. 检查 `NEXT_PUBLIC_API_BASE_URL` 是否正确设置
2. 确保 API 密钥已在 Vercel 中配置
3. 检查浏览器控制台的网络请求

### 环境变量未生效

1. 确保变量名称以 `NEXT_PUBLIC_` 开头（前端可见）
2. 重新部署项目以应用新的环境变量
3. 清除浏览器缓存

## 部署优化

### Serverless Functions 限制

- **Hobby 计划**: 最多 12 个 Serverless Functions
- **当前部署**: 11 个 API 路由（符合限制）

### 路由合并

为了符合 Hobby 计划的限制，以下路由已合并：

- `/api/multimedia/*` (8 个端点) → `/api/multimedia?action=*`
- `/api/admin/*` (2 个端点) → `/api/admin?action=*`
- `/api/auth/*` (2 个端点) → `/api/auth?action=*`
- `/api/user/*` (3 个端点) → `/api/user?action=*`

## 监控和日志

在 Vercel 仪表板中可以查看：

1. **Deployments**: 部署历史和状态
2. **Functions**: Serverless Functions 的执行情况
3. **Logs**: 实时日志输出
4. **Analytics**: 性能指标

## 升级到 Pro 计划

如果需要更多 Serverless Functions，可以升级到 Pro 计划：

- **Pro 计划**: 无限 Serverless Functions
- **成本**: $20/月
- **升级链接**: https://vercel.com/account/billing/overview
