# ✅ 最新版本部署完成

## 部署信息

**部署时间**: 2025-12-30 (已提交最新修改)

### 生产环境 URL
- **主 URL**: https://storyboard-master-pix2gatap-hanjiangs-projects-bee54024.vercel.app
- **自定义域名**: https://sora.wboke.com

## 最新修改内容

### 已提交的更改 (Commit: 08c2e81)

```
feat: Add manual scene input dialog and dual marker extraction

- Add ManualSceneInputDialog component for batch scene input
- Implement handleGenerateFromManualScenes for processing manual scenes
- Add extractScenesBySimpleMarker and extractScenesWithDualMarkers functions
- Update SidebarRight to include manual scene dialog trigger button
- Support batch scene generation with configurable interval
```

### 修改的文件

1. **App.tsx**
   - 导入 ManualSceneInputDialog 组件
   - 添加手动场景对话框状态管理
   - 实现 handleGenerateFromManualScenes 函数
   - 集成手动场景生成功能

2. **components/SidebarRight.tsx**
   - 添加 onOpenManualSceneDialog 属性
   - 更新按钮以打开手动场景对话框
   - 修改按钮文本和功能

3. **geminiService.ts**
   - 添加 extractScenesBySimpleMarker 函数（简单标记提取）
   - 添加 extractScenesWithDualMarkers 函数（双标记提取）
   - 支持 <<< >>> 和 {{{ }}} 标记格式

## 构建信息

```
✓ 55 modules transformed
✓ built in 3.56s

输出文件:
- dist/index.html (5.29 kB)
- dist/assets/main--3LSrJWF.css (13.09 kB)
- dist/assets/html2canvas.esm-QH1iLAAe.js (202.38 kB)
- dist/assets/main-Jt3ThL-D.js (699.22 kB)
```

## 验证步骤

✅ 检查 Git 历史记录
✅ 发现未提交的修改（App.tsx, SidebarRight.tsx, geminiService.ts）
✅ 提交所有修改
✅ 重新构建项目
✅ 部署到 Vercel 生产环境

## 访问应用

现在可以通过以下地址访问最新版本：
- https://sora.wboke.com
- https://storyboard-master-pix2gatap-hanjiangs-projects-bee54024.vercel.app

## 后续更新

每次需要更新时，运行：
```bash
git add .
git commit -m "your commit message"
vercel --prod --yes
```
