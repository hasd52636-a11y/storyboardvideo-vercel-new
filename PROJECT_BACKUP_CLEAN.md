# 项目备份清单 - 干净版本

**项目名称**: Storyboard Master  
**最后更新**: 2025年12月25日  
**状态**: 生产就绪 (本地开发)

---

## 核心功能

### 1. 图片生成 (Image Generation)
- **支持的API**: Gemini 2.5 Flash Image, OpenAI DALL-E 3, 智谱等兼容API
- **核心文件**: `geminiService.ts`
- **功能**:
  - 文本转图片生成
  - 支持多种风格 (彩色、黑白素描)
  - 支持自定义宽高比
  - 自动处理CORS问题 (Canvas转Base64)

### 2. 脚本解析 (Script Parsing)
- **支持的API**: Gemini 3 Flash, OpenAI GPT-4o, 智谱等兼容API
- **核心文件**: `geminiService.ts`
- **功能**:
  - 将脚本文本解析为分镜场景
  - 自动生成场景描述和视觉提示
  - 支持自定义场景数量

### 3. 视频生成 (Video Generation)
- **支持的API**: Sora2 API
- **核心文件**: `videoService.ts`
- **功能**:
  - 从分镜生成视频
  - 支持自定义时长和宽高比
  - 支持多语言提示词

### 4. 视频编辑 (Video Editing)
- **核心文件**: `components/VideoEditDialog.tsx`
- **功能**:
  - 编辑视频参数
  - 调整时长、宽高比等

### 5. 分镜导出 (Storyboard Export)
- **核心文件**: `components/SidebarRight.tsx`
- **功能**:
  - 导出为PNG图片序列
  - 导出为PDF文档
  - 支持批量重绘

---

## 项目结构

```
项目根目录/
├── src/
│   ├── App.tsx                    # 主应用组件
│   ├── index.tsx                  # 入口文件
│   ├── types.ts                   # TypeScript类型定义
│   ├── geminiService.ts           # Gemini/LLM API服务
│   ├── videoService.ts            # 视频生成服务
│   ├── components/
│   │   ├── VideoGenDialog.tsx      # 视频生成对话框
│   │   ├── VideoEditDialog.tsx     # 视频编辑对话框
│   │   ├── SidebarRight.tsx        # 右侧边栏 (导出功能)
│   │   ├── BatchRedrawDialog.tsx   # 批量重绘对话框
│   │   ├── APIConfigDialog.tsx     # API配置对话框
│   │   ├── KeySelection.tsx        # API密钥选择
│   │   ├── VideoWindow.tsx         # 视频窗口
│   │   ├── HelpModal.tsx           # 帮助模态框
│   │   └── ...其他组件
│   ├── public/                    # 静态资源
│   └── ...
├── package.json                   # 项目依赖
├── tsconfig.json                  # TypeScript配置
├── vite.config.ts                 # Vite构建配置
├── index.html                     # HTML入口
└── README.md                      # 项目说明
```

---

## 核心依赖

```json
{
  "dependencies": {
    "@google/genai": "^0.4.0",           // Gemini API
    "react": "^18.3.1",                  // UI框架
    "react-dom": "^18.3.1",              // React DOM
    "lucide-react": "^0.408.0",          // 图标库
    "html2canvas": "^1.4.1",             // Canvas导出
    "jspdf": "^2.5.1"                    // PDF导出
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "vite": "^6.4.1",
    "react-router-dom": "^6.20.1"
  }
}
```

---

## API配置

### 支持的API提供商

1. **Gemini** (Google)
   - 图片生成: `gemini-2.5-flash-image`
   - 文本处理: `gemini-3-flash-preview`
   - 需要: Google API Key

2. **OpenAI兼容API** (OpenAI, 智谱, 等)
   - 图片生成: DALL-E 3 或兼容模型
   - 文本处理: GPT-4o 或兼容模型
   - 需要: API Key + Base URL

3. **Sora2** (视频生成)
   - 需要: Sora2 API Key
   - 文件: `videoService.ts`

### 配置方式

API配置存储在 `localStorage` 中:
```javascript
localStorage.setItem('director_canvas_api_config', JSON.stringify({
  provider: 'gemini',           // 或 'openai'
  apiKey: 'your-api-key',
  baseUrl: 'https://api.example.com',  // 仅OpenAI兼容API需要
  llmModel: 'gpt-4o',           // 文本模型
  imageModel: 'dall-e-3'        // 图片模型
}))
```

---

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器 (http://localhost:5173 或 5174)
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

---

## 已删除的内容

✅ **已删除**:
- 用户认证系统 (AuthDialog, 登录/注册)
- 用户管理后台 (AdminPanel)
- Vercel数据库集成
- 用户余额管理
- 所有部署相关文档 (50+ 文件)
- 所有API说明文档

✅ **保留**:
- 所有核心功能代码
- API集成代码
- UI组件
- 构建配置
- 项目依赖

---

## 快速开始

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```

3. **配置API**
   - 打开应用
   - 点击 "API Config" 按钮
   - 输入你的API Key和配置

4. **使用功能**
   - 生成图片: 输入提示词 → 选择风格 → 生成
   - 解析脚本: 上传脚本 → 选择场景数 → 生成分镜
   - 生成视频: 选择分镜 → 配置参数 → 生成视频
   - 导出: 选择格式 (PNG/PDF) → 导出

---

## 文件清理记录

**删除的文档文件** (共60+个):
- 所有Vercel部署指南
- 所有API合规性报告
- 所有任务完成总结
- 所有部署检查清单
- 所有修复说明文档
- 所有中文检查报告

**保留的文档文件**:
- `README.md` - 项目说明
- `package.json` - 项目配置
- `tsconfig.json` - TypeScript配置
- `vite.config.ts` - 构建配置

---

## 项目状态

✅ **功能完整**
- 图片生成: 正常
- 脚本解析: 正常
- 视频生成: 正常
- 视频编辑: 正常
- 分镜导出: 正常

✅ **本地开发**
- 开发服务器: 运行中 (http://localhost:5174)
- 热更新: 启用
- 构建: 可用

---

## 下一步

1. 配置你的API密钥
2. 开始创建分镜
3. 生成视频内容
4. 导出最终作品

祝你使用愉快！🎬
