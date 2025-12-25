@echo off
REM Vercel 新项目部署脚本（Windows 版本）
REM 使用方法: deploy-vercel-new.bat https://github.com/your-username/storyboard-vercel-new.git

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo Vercel 新项目部署脚本
echo ==========================================
echo.

if "%1"=="" (
    echo 错误：请提供 GitHub 仓库 URL
    echo.
    echo 使用方法:
    echo   deploy-vercel-new.bat https://github.com/your-username/storyboard-vercel-new.git
    echo.
    exit /b 1
)

set REPO_URL=%1
set REMOTE_NAME=vercel-new

echo 步骤 1: 添加新的 Git 远程仓库
echo URL: %REPO_URL%
echo.

git remote get-url %REMOTE_NAME% >nul 2>&1
if %errorlevel% equ 0 (
    echo 警告：远程仓库 '%REMOTE_NAME%' 已存在，跳过添加
) else (
    git remote add %REMOTE_NAME% "%REPO_URL%"
    echo 远程仓库已添加
)

echo.
echo 步骤 2: 验证 Git 配置
echo.
git remote -v
echo.

echo 步骤 3: 检查本地更改
echo.
git status
echo.

echo 步骤 4: 推送代码到新仓库
echo.
echo 推送分支到 %REMOTE_NAME%...
for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%i
git push -u %REMOTE_NAME% %BRANCH%

if %errorlevel% neq 0 (
    echo.
    echo 错误：推送失败
    exit /b 1
)

echo.
echo 代码已推送到新仓库！
echo.
echo ==========================================
echo 下一步：
echo ==========================================
echo.
echo 1. 登录 Vercel Dashboard: https://vercel.com/dashboard
echo 2. 点击 'Add New' -^> 'Project'
echo 3. 选择 'Import Git Repository'
echo 4. 搜索并选择你的新仓库
echo 5. 配置项目设置：
echo    - Framework: Vite
echo    - Build Command: npm run build
echo    - Output Directory: dist
echo 6. 点击 'Deploy'
echo.
echo 7. 部署完成后，创建 Postgres 数据库：
echo    - 进入 Storage 标签
echo    - 创建 Postgres 数据库
echo    - 复制连接字符串
echo.
echo 8. 设置环境变量：
echo    - POSTGRES_URLCONNSTR=^<连接字符串^>
echo    - ADMIN_PASSWORD=admin123
echo.
echo 9. 初始化数据库：
echo    npm install
echo    node scripts/init-db.js
echo.
echo 10. 验证部署：
echo     curl -X POST https://your-project.vercel.app/api/auth/register ^
echo       -H "Content-Type: application/json" ^
echo       -d "{\"username\":\"test\",\"email\":\"test@example.com\",\"password\":\"123\"}"
echo.
echo ==========================================
echo.
pause
