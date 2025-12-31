# 视频播放错误修复

**问题**: 视频生成成功，API返回了链接，但画布上无法预览

**错误信息**:
```
Video playback error: nonError
Video URL: https://oss.filenest.top/uploads/17136fb1-a485-4549-ad64-c58a88a88a33.mp4
```

## 根本原因分析

### 可能的原因

1. **CORS 问题** - 视频服务器可能没有正确配置 CORS 头
2. **视频格式不支持** - 浏览器可能不支持该视频格式或编码
3. **网络问题** - 视频 URL 可能无法访问或超时
4. **跨域请求** - 从不同域加载视频时的安全限制

## 解决方案

### 1. 改进 VideoWindow 组件

**问题**: 当前的 `crossOrigin="anonymous"` 可能不足以处理所有情况

**解决方案**:
- 添加更详细的错误处理
- 尝试不同的 CORS 配置
- 添加视频加载超时检测
- 提供备用播放方式（如在新标签页打开）

### 2. 添加视频 URL 验证

**问题**: 没有验证视频 URL 是否真的可访问

**解决方案**:
- 在显示视频前验证 URL 可访问性
- 添加重试机制
- 显示更详细的错误信息

### 3. 改进错误处理

**问题**: 错误信息不够详细，用户无法了解具体问题

**解决方案**:
- 捕获更多错误类型
- 提供用户友好的错误提示
- 添加调试信息

## 实现步骤

### 步骤 1: 改进 VideoWindow 组件

```typescript
// 添加视频加载状态
const [videoError, setVideoError] = useState<string | null>(null);
const [isVideoLoading, setIsVideoLoading] = useState(true);
const videoRef = useRef<HTMLVideoElement>(null);

// 改进错误处理
const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
  const video = e.currentTarget;
  let errorMessage = '视频加载失败';
  
  if (video.error) {
    switch (video.error.code) {
      case video.error.MEDIA_ERR_ABORTED:
        errorMessage = '视频加载被中止';
        break;
      case video.error.MEDIA_ERR_NETWORK:
        errorMessage = '网络错误，无法加载视频';
        break;
      case video.error.MEDIA_ERR_DECODE:
        errorMessage = '视频解码失败，可能是格式不支持';
        break;
      case video.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
        errorMessage = '浏览器不支持该视频格式';
        break;
    }
  }
  
  setVideoError(errorMessage);
  console.error('Video playback error:', errorMessage, 'URL:', item.videoUrl);
};

// 改进加载完成处理
const handleVideoLoadedMetadata = () => {
  setIsVideoLoading(false);
  console.log('Video loaded successfully:', item.videoUrl);
};

// 添加备用播放方式
const handleOpenInNewTab = () => {
  if (item.videoUrl) {
    window.open(item.videoUrl, '_blank');
  }
};
```

### 步骤 2: 改进视频 URL 验证

```typescript
// 在 App.tsx 中添加 URL 验证函数
const validateVideoUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Video URL validation failed:', error);
    return false;
  }
};

// 在设置视频 URL 时验证
const handleVideoUrlReceived = async (url: string) => {
  const isValid = await validateVideoUrl(url);
  if (!isValid) {
    console.warn('Video URL validation failed, but continuing:', url);
  }
  // 继续使用 URL，即使验证失败
};
```

### 步骤 3: 改进 CORS 配置

```typescript
// 尝试不同的 CORS 配置
const getCorsConfig = () => {
  // 首先尝试 anonymous
  // 如果失败，尝试 use-credentials
  // 如果仍然失败，尝试不设置 crossOrigin
  return 'anonymous';
};

// 在视频元素上应用
<video
  ref={videoRef}
  src={item.videoUrl}
  controls
  controlsList="nodownload"
  crossOrigin={getCorsConfig()}
  preload="metadata"
  onError={handleVideoError}
  onLoadedMetadata={handleVideoLoadedMetadata}
/>
```

### 步骤 4: 添加备用播放方式

```typescript
// 如果视频无法在画布上播放，提供备用方式
{videoError && (
  <div style={{ textAlign: 'center', color: '#f44336' }}>
    <div style={{ fontSize: '12px', marginBottom: '10px' }}>
      ⚠️ {videoError}
    </div>
    <button
      onClick={handleOpenInNewTab}
      style={{
        padding: '6px 12px',
        fontSize: '12px',
        backgroundColor: '#2196F3',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      在新标签页打开
    </button>
  </div>
)}
```

## 预期效果

### 改进前
- 视频无法播放
- 错误信息不清楚
- 用户无法访问视频

### 改进后
- 显示详细的错误信息
- 提供备用播放方式（在新标签页打开）
- 用户可以通过多种方式访问视频
- 更好的错误诊断

## 实现优先级

1. **高优先级** - 改进 VideoWindow 错误处理
2. **中优先级** - 添加备用播放方式
3. **低优先级** - 添加 URL 验证

## 相关文件

- `components/VideoWindow.tsx` - 视频显示组件
- `App.tsx` - 视频管理逻辑
- `videoService.ts` - 视频服务

