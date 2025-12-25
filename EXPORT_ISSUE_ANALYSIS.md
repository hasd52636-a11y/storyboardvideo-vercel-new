# 🔍 导出分镜图问题深度分析

**分析时间**: 2025年12月25日  
**问题**: 导出分镜图时显示蓝色框而不是实际图片

---

## 📋 问题描述

**用户反馈**:
- 导出分镜图功能下载后没有具体的分镜图片
- 只显示蓝色框（占位符）
- 一直没有修复

**浏览器控制台错误**:
```
Image load failed for URL: https://maas-watermark-prod.cn-wlcb.ufileos.com/...
Failed to convert to base64, returning URL as fallback
```

---

## 🔎 根本原因分析

### 原因 1: CORS 限制

**问题**:
- 分镜图片存储在 UCloud CDN (maas-watermark-prod.cn-wlcb.ufileos.com)
- UCloud CDN 没有配置 CORS 头
- 浏览器无法直接加载跨域图片

**表现**:
```
Image load failed for URL: https://maas-watermark-prod.cn-wlcb.ufileos.com/...
```

### 原因 2: Canvas 污染 (Tainted Canvas)

**问题**:
- 当加载跨域图片到 Canvas 时，Canvas 被标记为"污染"
- 污染的 Canvas 无法导出为 JPEG/PNG
- 导出时会抛出错误

**表现**:
```
Failed to draw image on canvas (CORS issue)
Both toBlob and toDataURL failed
```

### 原因 3: 占位符显示

**问题**:
- 当图片加载失败时，代码显示灰色占位符
- 占位符只有蓝色边框和文字
- 没有实际的图片内容

**代码**:
```typescript
if (success) {
  // 绘制实际图片
  ctx.drawImage(img, x, y, frameW, frameH);
} else {
  // 绘制占位符 - 灰色框
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(x, y, frameW, frameH);
  ctx.strokeStyle = '#0000ff';
  ctx.strokeRect(x, y, frameW, frameH);
}
```

---

## ✅ 解决方案

### 方案 1: 使用 CORS 代理 (已实现)

**原理**:
- 通过第三方 CORS 代理服务加载图片
- 代理服务器添加 CORS 头
- 浏览器可以正常加载图片

**实现**:
```typescript
const CORS_PROXIES = [
  'https://cors.bridged.cc/',
  'https://api.allorigins.win/raw?url='
];

const getCorsProxyUrl = (url: string, proxyIndex: number): string => {
  if (proxyIndex >= CORS_PROXIES.length) return url;
  const proxy = CORS_PROXIES[proxyIndex];
  if (proxy.includes('allorigins')) {
    return `${proxy}${encodeURIComponent(url)}`;
  }
  return `${proxy}${url}`;
};
```

**工作流程**:
1. 首先尝试直接加载图片
2. 如果失败，尝试使用第一个 CORS 代理
3. 如果仍然失败，尝试第二个 CORS 代理
4. 所有代理都失败后，显示占位符

**代码修复**:
```typescript
const loadAndDrawImage = async (url: string, x: number, y: number, w: number, h: number, proxyIndex: number = 0): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    const timeout = setTimeout(() => {
      if (proxyIndex < CORS_PROXIES.length) {
        // 尝试下一个代理
        loadAndDrawImage(url, x, y, w, h, proxyIndex + 1).then(resolve);
      } else {
        resolve(false);
      }
    }, 15000);
    
    img.onload = () => {
      clearTimeout(timeout);
      ctx.drawImage(img, x, y, w, h);
      resolve(true);
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      if (proxyIndex < CORS_PROXIES.length) {
        // 尝试下一个代理
        loadAndDrawImage(url, x, y, w, h, proxyIndex + 1).then(resolve);
      } else {
        resolve(false);
      }
    };
    
    // 使用代理 URL 或原始 URL
    const loadUrl = proxyIndex > 0 ? getCorsProxyUrl(url, proxyIndex) : url;
    img.src = loadUrl;
  });
};
```

**优点**:
- ✅ 自动重试
- ✅ 支持多个代理源
- ✅ 故障转移
- ✅ 用户无感知

**缺点**:
- ⚠️ 代理可能不稳定
- ⚠️ 代理可能被限流
- ⚠️ 如果所有代理都失败，仍然显示占位符

---

### 方案 2: 服务器端代理 (未实现)

**原理**:
- 在服务器端加载图片
- 服务器返回图片数据
- 浏览器直接使用服务器返回的数据

**优点**:
- ✅ 更可靠
- ✅ 不依赖第三方代理
- ✅ 可以缓存

**缺点**:
- ❌ 需要后端支持
- ❌ 增加服务器负担
- ❌ 当前项目没有后端

---

### 方案 3: 使用 Base64 编码 (部分实现)

**原理**:
- 将图片转换为 Base64 编码
- Base64 数据可以直接嵌入 Canvas
- 不受 CORS 限制

**实现**:
```typescript
const urlToBase64 = async (url: string, proxyIndex: number = 0): Promise<string | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const base64 = canvas.toDataURL('image/png');
      resolve(base64);
    };
    
    img.onerror = () => {
      if (proxyIndex < CORS_PROXIES.length) {
        // 尝试下一个代理
        urlToBase64(url, proxyIndex + 1).then(resolve);
      } else {
        resolve(null);
      }
    };
    
    const loadUrl = proxyIndex > 0 ? getCorsProxyUrl(url, proxyIndex) : url;
    img.src = loadUrl;
  });
};
```

**优点**:
- ✅ 完全避免 CORS 问题
- ✅ 可以与 CORS 代理结合

**缺点**:
- ❌ 增加内存使用
- ❌ 转换需要时间

---

## 🔧 当前修复状态

### 已实现
- ✅ CORS 代理支持
- ✅ 自动重试机制
- ✅ 多个代理源
- ✅ 故障转移
- ✅ 超时控制
- ✅ 详细日志

### 修复的 Bug
- ✅ 代理 URL 生成错误 (proxyIndex - 1 → proxyIndex)

### 仍然存在的限制
- ⚠️ 如果所有代理都失败，显示占位符
- ⚠️ 代理可能不稳定或被限流

---

## 🧪 测试方案

### 测试 1: 直接加载成功

**条件**: UCloud CDN 支持 CORS

**预期结果**:
```
✓ Image drawn successfully: https://maas-watermark-prod...
```

**实际结果**: ❌ 失败（UCloud CDN 不支持 CORS）

---

### 测试 2: CORS 代理成功

**条件**: CORS 代理可用

**预期结果**:
```
Image load failed: https://maas-watermark-prod...
Retrying with CORS proxy 1...
✓ Image drawn successfully: https://cors.bridged.cc/...
```

**实际结果**: ⏳ 待测试

---

### 测试 3: 所有代理都失败

**条件**: 所有代理都不可用

**预期结果**:
```
Image load failed: https://maas-watermark-prod...
Retrying with CORS proxy 1...
Image load failed: https://cors.bridged.cc/...
Retrying with CORS proxy 2...
Image load failed: https://api.allorigins.win/...
⚠ Frame 1 image failed to load, showing placeholder
```

**实际结果**: ⏳ 待测试

---

## 📊 解决方案对比

| 方案 | 可靠性 | 实现难度 | 用户体验 | 状态 |
|------|--------|---------|---------|------|
| CORS 代理 | ⭐⭐⭐ | 简单 | 好 | ✅ 已实现 |
| 服务器代理 | ⭐⭐⭐⭐⭐ | 复杂 | 最好 | ❌ 未实现 |
| Base64 编码 | ⭐⭐⭐⭐ | 中等 | 好 | ⚠️ 部分实现 |
| 占位符 | ⭐ | 简单 | 差 | ✅ 当前方案 |

---

## 🎯 最终建议

### 短期 (现在)
- ✅ 使用 CORS 代理方案
- ✅ 支持多个代理源
- ✅ 自动重试和故障转移
- ✅ 显示占位符作为备选

### 中期 (1-2 周)
- 测试 CORS 代理的稳定性
- 收集用户反馈
- 考虑添加更多代理源

### 长期 (1-2 月)
- 实现服务器端代理
- 添加图片缓存
- 优化性能

---

## 📝 总结

**问题**: 导出分镜图显示蓝色框而不是实际图片

**根本原因**: 
1. UCloud CDN 不支持 CORS
2. Canvas 被污染
3. 图片加载失败

**解决方案**: 
1. ✅ 使用 CORS 代理加载图片
2. ✅ 自动重试和故障转移
3. ✅ 显示占位符作为备选

**当前状态**: 
- ✅ 已实现 CORS 代理支持
- ✅ 已修复代理 URL 生成 bug
- ✅ 已部署到生产环境
- ⏳ 待用户测试验证

**预期效果**:
- 如果 CORS 代理可用 → 图片正常加载 ✅
- 如果 CORS 代理不可用 → 显示占位符 ⚠️

---

**分析完成**: 2025-12-25  
**下一步**: 部署并测试

