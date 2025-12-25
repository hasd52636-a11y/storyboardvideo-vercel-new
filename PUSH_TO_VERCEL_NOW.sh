#!/bin/bash

# 🚀 直接推送到 Vercel - 新项目
# 使用方法: bash PUSH_TO_VERCEL_NOW.sh <github-username> <repo-name>

set -e

echo "=========================================="
echo "🚀 Vercel 新项目推送脚本"
echo "=========================================="
echo ""

# 检查参数
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "❌ 错误：缺少参数"
    echo ""
    echo "使用方法:"
    echo "  bash PUSH_TO_VERCEL_NOW.sh <github-username> <repo-name>"
    echo ""
    echo "示例:"
    echo "  bash PUSH_TO_VERCEL_NOW.sh andypowerfull storyboard-vercel-new"
    echo ""
    exit 1
fi

GITHUB_USERNAME="$1"
REPO_NAME="$2"
REPO_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

echo "📝 步骤 1: 验证参数"
echo "GitHub 用户名: $GITHUB_USERNAME"
echo "仓库名称: $REPO_NAME"
echo "仓库 URL: $REPO_URL"
echo ""

echo "📝 步骤 2: 检查 Git 状态"
git status
echo ""

echo "📝 步骤 3: 添加 GitHub 远程仓库"
if git remote get-url github > /dev/null 2>&1; then
    echo "⚠️  远程仓库 'github' 已存在，移除旧的"
    git remote remove github
fi

git remote add github "$REPO_URL"
echo "✅ 远程仓库已添加"
echo ""

echo "📝 步骤 4: 验证远程仓库"
git remote -v
echo ""

echo "📝 步骤 5: 推送代码到 GitHub"
echo "推送分支到 github..."
BRANCH=$(git rev-parse --abbrev-ref HEAD)
git push -u github $BRANCH --force

echo ""
echo "✅ 代码已推送到 GitHub！"
echo ""

echo "=========================================="
echo "🎉 下一步："
echo "=========================================="
echo ""
echo "1. 打开 Vercel Dashboard: https://vercel.com/dashboard"
echo "2. 点击 'Add New' → 'Project'"
echo "3. 选择 'Import Git Repository'"
echo "4. 搜索并选择: $REPO_NAME"
echo "5. 配置项目设置："
echo "   - Framework: Vite"
echo "   - Build Command: npm run build"
echo "   - Output Directory: dist"
echo "6. 点击 'Deploy'"
echo ""
echo "7. 部署完成后，创建 Postgres 数据库："
echo "   - 进入 Storage 标签"
echo "   - 创建 Postgres 数据库"
echo "   - 复制连接字符串"
echo ""
echo "8. 设置环境变量："
echo "   - POSTGRES_URLCONNSTR=<连接字符串>"
echo "   - ADMIN_PASSWORD=admin123"
echo ""
echo "9. 初始化数据库："
echo "   npm install"
echo "   node scripts/init-db.js"
echo ""
echo "10. 验证部署："
echo "    curl -X POST https://${REPO_NAME}.vercel.app/api/auth/register \\"
echo "      -H 'Content-Type: application/json' \\"
echo "      -d '{\"username\":\"test\",\"email\":\"test@example.com\",\"password\":\"123\"}'"
echo ""
echo "=========================================="
echo ""
