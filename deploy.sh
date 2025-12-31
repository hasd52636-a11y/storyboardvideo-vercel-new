#!/bin/bash

# Vercel 直接部署脚本

echo "🚀 开始部署到 Vercel..."
echo ""

# 检查 Vercel CLI 是否安装
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未安装"
    echo "请运行: npm install -g vercel"
    exit 1
fi

echo "✅ Vercel CLI 已安装"
echo ""

# 检查是否已登录
echo "🔐 检查 Vercel 登录状态..."
if ! vercel whoami &> /dev/null; then
    echo "⚠️  未登录，请先登录"
    vercel login
fi

echo ""
echo "📦 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo ""
echo "🌐 部署到 Vercel..."
vercel --prod

echo ""
echo "✅ 部署完成！"
echo ""
echo "查看部署状态: vercel list"
echo "查看日志: vercel logs"
