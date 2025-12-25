# 🔧 CORS 问题修复 - 代码实现方案

**修复时间**: 2025年12月25日  
**目标**: 解决所有图片加载和 Canvas 污染问题

---

## 📝 修复方案概览

### 方案选择: 使用 CORS 代理 + 自建后端代理

**第一阶段**: 快速修复 (使用公共 CORS 代理)  
**第二阶段**: 长期方案 (自建后端代理)

---

## 🔧 修复步骤

### 步骤 1: 创建 CORS 代理工具函数

**文件**: `src/utils/corsProxy.ts` (新建)

```typescript
/**
 * CORS 代理工具
 * 用于解决跨域图片加载问题
 */

// 公共 CORS 代理服务列表
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/',
  'https://proxy.cors.sh/'
];

// 当前使用的代理索引
let currentProxyIndex = 0;

/**
 * 获取 CORS 代理 URL
 * @param imageUrl 原始图片 URL
 * @returns 代理后的 URL
 */
export function getCorsProxyUrl(imageUrl: string): string {
  if (!imageUrl) return '';
  
  // 如果是 data URL，直接返回
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  // 如果已经是代理 URL，直接返回
  if (imageUrl.includes('allorigins') || imageUrl.includes('cors-anywhere')) {
    return imageUrl;
  }
  
  // 使用第一个代理
  const proxy = CORS_PROXIES[0];
  return proxy + encodeURIComponent(imageUrl);
}

/**
 * 尝试加载图片，如果失败则尝试下一个代理
 * @param imageUrl 原始图片 URL
 * @returns Promise<HTMLImageElement>
 */
export async function loadImageWithCorsProxy(imageUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // 尝试直接加载
    img.onload = () => resolve(img);
    img.onerror = () => {
      // 直接加载失败，尝试使用代理
      const proxyUrl = getCorsProxyUrl(imageUrl);
      const proxyImg = new Image();
      
      proxyImg.onload = () => resolve(proxyImg);
      proxyImg.onerror = () => {
        console.error('Failed to load image with CORS proxy:', imageUrl);
        reject(new Error(`Failed to load image: ${imageUrl}`));
      };
      
      proxyImg.src = proxyUrl;
    };
    
    img.src = imageUrl;
  });
}

/**
 * 将图片 URL 转换为 base64
 * @param imageUrl 图片 URL
 * @returns Promise<string> base64 字符串
 */
export async function imageUrlToBase64(imageUrl: string): Promise<string> {
  try {
    const img = await loadImageWithCorsProxy(imageUrl);
    
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');
    
    ctx.drawImage(img, 0, 0);
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.warn('Failed to convert to base64:', error);
    // 返回原始 URL 作为 fallback
    return imageUrl;
  }
}

/**
 * 批量转换图片 URL 为 base64
 * @param imageUrls 图片 URL 数组
 * @returns Promise<string[]> base64 字符串数组
 */
export async function imageUrlsToBase64(imageUrls: string[]): Promise<string[]> {
  return Promise.all(
    imageUrls.map(url => imageUrlToBase64(url).catch(() => url))
  );
}

export default {
  getCorsProxyUrl,
  loadImageWithCorsProxy,
  imageUrlToBase64,
  imageUrlsToBase64
};
```

---

### 步骤 2: 修复导出分镜图功能

**文件**: `App.tsx` - 修改 `handleExportJPEG` 函数

```typescript
// 在文件顶部添加导入
import { getCorsProxyUrl, loadImageWithCorsProxy } from './utils/corsProxy';

// 修改 loadAndDrawImage 函数
const loadAndDrawImage = async (url: string, x: number, y: number, w: number, h: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    
    // 处理 CORS 问题：使用代理 URL
    const imageUrl = getCorsProxyUrl(url);
    
    const timeout = setTimeout(() => {
      console.warn(`Image load timeout: ${url.substring(0, 50)}`);
      resolve(false);
    }, 25000);
    
    img.onload = () => {
      clearTimeout(timeout);
      try {
        if (img.width > 0 && img.height > 0) {
          ctx.drawImage(img, x, y, w, h);
          console.log(`✓ Image drawn successfully: ${url.substring(0, 50)}`);
          resolve(true);
        } else {
          console.warn('Image loaded but has zero dimensions');
          resolve(false);
        }
      } catch (e) {
        console.error('Failed to draw image on canvas:', e);
        resolve(false);
      }
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      console.warn(`Image load failed: ${url.substring(0, 50)}`);
      resolve(false);
    };
    
    // 使用代理 URL
    img.src = imageUrl;
  });
};
```

---

### 步骤 3: 修复视频生成功能

**文件**: `videoService.ts` - 修改 `createVideo` 函数

```typescript
// 在文件顶部添加导入
import { getCorsProxyUrl } from './utils/corsProxy';

// 修改 createVideo 方法中的图片处理部分
async createVideo(
  prompt: string,
  options: CreateVideoOptions
): Promise<{ task_id: string; status: string; progress: string }> {
  try {
    const endpoint = `${this.config.baseUrl}/v2/videos/generations`;

    const body: any = {
      model: options.model,
      prompt: prompt,
      aspect_ratio: options.aspect_ratio || '16:9',
      duration: options.duration || 10,
      hd: options.hd || false,
      watermark: options.watermark ?? false,
      private: options.private ?? false
    };

    // 修复: 使用代理 URL 处理图片
    if (options.images && options.images.length > 0) {
      body.images = options.images.map(url => getCorsProxyUrl(url));
    }

    if (options.notify_hook) {
      body.notify_hook = options.notify_hook;
    }

    if (options.character_url) {
      body.character_url = options.character_url;
    }

    if (options.character_timestamps) {
      body.character_timestamps = options.character_timestamps;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    const responseText = await response.text();
    const data = JSON.parse(responseText);

    return {
      task_id: data.task_id,
      status: data.status || 'SUBMITTED',
      progress: data.progress || '0%'
    };
  } catch (error) {
    console.error('Video creation error:', error);
    throw error;
  }
}
```

---

### 步骤 4: 修复批量重绘功能

**文件**: `components/BatchRedrawDialog.tsx`

```typescript
// 在文件顶部添加导入
import { getCorsProxyUrl } from '../utils/corsProxy';

// 修改处理图片的部分
const handleBatchRedraw = async () => {
  // ... 现有代码 ...
  
  // 修复: 使用代理 URL
  const proxyImages = selectedImages.map(img => ({
    ...img,
    imageUrl: getCorsProxyUrl(img.imageUrl)
  }));
  
  // 继续处理...
};
```

---

## 🧪 测试方案

### 测试 1: 验证 CORS 代理工作

```typescript
// 在浏览器控制台运行
import { getCorsProxyUrl, loadImageWithCorsProxy } from './utils/corsProxy';

const testUrl = 'https://maas-watermark-prod.cn-wlcb.ufileos.com/...';
const proxyUrl = getCorsProxyUrl(testUrl);

console.log('Original URL:', testUrl);
console.log('Proxy URL:', proxyUrl);

loadImageWithCorsProxy(testUrl)
  .then(img => console.log('✅ Image loaded successfully'))
  .catch(err => console.error('❌ Failed to load:', err));
```

### 测试 2: 验证导出功能

```typescript
// 1. 生成几张分镜图
// 2. 选中它们
// 3. 点击"导出JPEG"
// 4. 检查下载的文件是否包含图片
```

### 测试 3: 验证视频生成

```typescript
// 1. 生成几张分镜图
// 2. 选中它们
// 3. 点击"生成视频"
// 4. 检查是否成功提交
// 5. 等待视频生成完成
```

---

## 📋 修复清单

- [ ] 创建 `src/utils/corsProxy.ts` 文件
- [ ] 修改 `App.tsx` 的 `handleExportJPEG` 函数
- [ ] 修改 `videoService.ts` 的 `createVideo` 方法
- [ ] 修改 `BatchRedrawDialog.tsx` 的图片处理
- [ ] 本地测试所有功能
- [ ] 部署到 Vercel
- [ ] 验证生产环境功能

---

## 🚀 部署步骤

```bash
# 1. 创建新文件
touch src/utils/corsProxy.ts

# 2. 复制代码到文件

# 3. 修改相关组件

# 4. 本地测试
npm run dev

# 5. 构建
npm run build

# 6. 部署
vercel --prod
```

---

## ⚠️ 注意事项

### 1. CORS 代理服务限制

- `api.allorigins.win` - 免费，无速率限制
- `cors-anywhere.herokuapp.com` - 免费，有速率限制
- `proxy.cors.sh` - 付费选项

### 2. 图片 URL 过期

API 返回的 URL 有 `Expires` 参数，需要及时处理

### 3. 性能考虑

- 代理会增加 200-500ms 延迟
- 建议添加缓存机制

### 4. 长期方案

建议自建后端代理服务:

```javascript
// Node.js 后端示例
app.get('/api/proxy-image', async (req, res) => {
  const imageUrl = req.query.url;
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Content-Type', response.headers.get('content-type'));
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 📊 预期效果

修复前:
```
❌ 导出分镜图: 只显示蓝色框
❌ 视频生成: 失败
❌ 批量重绘: 失败
```

修复后:
```
✅ 导出分镜图: 显示完整图片
✅ 视频生成: 成功
✅ 批量重绘: 成功
```

---

## 🎯 优先级和时间估计

| 任务 | 优先级 | 时间 |
|------|--------|------|
| 创建 corsProxy.ts | 🔴 高 | 15 分钟 |
| 修改 App.tsx | 🔴 高 | 15 分钟 |
| 修改 videoService.ts | 🔴 高 | 10 分钟 |
| 修改 BatchRedrawDialog.tsx | 🔴 高 | 10 分钟 |
| 本地测试 | 🔴 高 | 20 分钟 |
| 部署 | 🔴 高 | 5 分钟 |
| **总计** | | **75 分钟** |

---

**修复方案完成**: 2025-12-25  
**建议**: 立即实施，预计 1.5 小时完成所有修复
