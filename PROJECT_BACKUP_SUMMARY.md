# 项目备份总结

**备份时间**: 2025年12月25日  
**项目名称**: Storyboard Master - 分镜生成工具  
**状态**: ✅ 清理完成，已备份

## 项目概述

一个专业的分镜生成和视频制作工具，支持：
- 📸 AI图片生成（Gemini API）
- 📝 脚本解析和场景生成
- 🎬 视频生成（Sora2 API）
- ✏️ 视频编辑
- 📊 分镜导出（JPEG/TXT）

## 核心功能

### 1. 图片生成
- 基于脚本或对话生成分镜图
- 支持多种风格和画幅比例
- 黑白/彩色模式切换

### 2. 视频生成
- 集成Sora2 API
- 支持视频编辑和预览
- 实时进度跟踪

### 3. 分镜管理
- 拖拽排序
- 批量重绘
- 符号标注（动作、摄像机等）

### 4. 导出功能
- JPEG分镜板导出
- TXT提示词导出
- 支持中英文

## 项目结构

```
项目根目录/
├── src/
│   ├── App.tsx                 # 主应用
│   ├── types.ts                # 类型定义
│   ├── geminiService.ts        # Gemini API服务
│   ├── videoService.ts         # 视频服务
│   ├── components/             # React组件
│   │   ├── StoryboardCard.tsx
│   │   ├── SidebarLeft.tsx
│   │   ├── SidebarRight.tsx
│   │   ├── VideoGenDialog.tsx
│   │   ├── VideoEditDialog.tsx
│   │   ├── BatchRedrawDialog.tsx
│   │   ├── HelpModal.tsx
│   │   └── ...
│   └── index.tsx
├── public/
│   ├── index.html
│   └── helpContent.json
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **API集成**: Gemini API, Sora2 API
- **状态管理**: React Hooks

## 已清理内容

✅ 删除了60个不必要的文档文件  
✅ 删除了57个spec相关的文档文件  
✅ 移除了所有认证和数据库代码  
✅ 保留了核心功能代码  

## 保留的重要文件

- `requirements.md` - 功能需求文档
- `design.md` - 设计文档
- `tasks.md` - 实现任务列表
- `README.md` - 项目说明
- `package.json` - 依赖配置
- `tsconfig.json` - TypeScript配置
- `vite.config.ts` - Vite配置

## 运行方式

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

## 本地开发

- **开发服务器**: http://localhost:5174/
- **热更新**: 已启用
- **编译状态**: ✅ 无错误

## API配置

需要配置以下API密钥：
1. **Gemini API** - 用于图片生成
2. **Sora2 API** - 用于视频生成

在应用中通过 KeySelection 组件配置。

## 备份完成

项目已清理完毕，所有不必要的文档已删除，只保留了核心代码和必要的配置文件。项目可以直接使用，无需任何额外的清理工作。

---

**下一步**: 可以将此项目提交到版本控制系统（Git）进行版本管理。
