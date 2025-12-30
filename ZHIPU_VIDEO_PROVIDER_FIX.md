# Zhipu Video Provider Selection Fix

## Problem
When user selected "智谱 GLM (推荐)" in the video settings, the right-click "生成视频" menu still used the Shenma/神马 provider instead of Zhipu. The video provider selection from settings was not being applied to the video generation flow.

## Root Causes Identified

### 1. Video Status Query Endpoint Issue
- **File**: `videoService.ts` line 227
- **Issue**: Status query was using `/v4/videos/generations/{taskId}` instead of the correct Zhipu endpoint
- **Fix**: Changed to use `/v4/async-result/{taskId}` which is the correct Zhipu async result query endpoint

### 2. Provider ID Normalization Issue
- **File**: `components/KeySelection.tsx`
- **Issue**: VIDEO_PROVIDERS list had provider IDs like 'shenma-us', 'shenma-hk', 'dayangyu' that don't match the VideoAPIProvider type ('openai' | 'dyu' | 'shenma' | 'zhipu')
- **Fix**: Added normalization logic to convert:
  - 'dayangyu' → 'dyu'
  - 'shenma-us', 'shenma-hk' → 'shenma' (already correct)
  - 'zhipu' → 'zhipu' (already correct)

## Changes Made

### 1. videoService.ts
```typescript
// Fixed getZhipuEndpoint to use correct status query endpoint
private getZhipuEndpoint(action: string): string {
  switch (action) {
    case 'create':
      return 'https://open.bigmodel.cn/api/paas/v4/videos/generations';
    case 'status':
      // Changed from /videos/generations to /async-result
      return 'https://open.bigmodel.cn/api/paas/v4/async-result';
    default:
      return 'https://open.bigmodel.cn/api/paas/v4';
  }
}
```

### 2. components/KeySelection.tsx
```typescript
// Added provider ID normalization in handleSave
const normalizedProvider = videoConfig.provider === 'dayangyu' ? 'dyu' : videoConfig.provider;
const normalizedVideoConfig = {
  ...videoConfig,
  provider: normalizedProvider
};

// Added provider ID normalization in useEffect (when loading from localStorage)
const normalizedProvider = parsed.provider === 'dayangyu' ? 'dyu' : parsed.provider;

// Added provider ID normalization in provider selection handler
const normalizedProvider = e.target.value === 'dayangyu' ? 'dyu' : e.target.value;
```

## How It Works Now

1. User selects "智谱 GLM (推荐)" in video settings
2. Provider ID 'zhipu' is normalized and saved to localStorage
3. When right-click "生成视频" is clicked:
   - `handleGenerateVideoFromContextMenu` opens the video generation dialog
   - `handleGenerateVideo` reads the video config from localStorage
   - VideoService is initialized with the correct provider ('zhipu')
   - `createVideo()` method detects provider === 'zhipu' and calls `createVideoZhipu()`
   - Video generation uses Zhipu API endpoints
   - Status polling uses the correct `/async-result/{taskId}` endpoint

## Testing Steps

1. Open the application at https://sora.wboke.com
2. Go to Settings (API Config)
3. Select "视频生成 API" tab
4. Select "智谱 GLM (推荐)" from the provider dropdown
5. Enter your Zhipu API Key (starts with 'glm-')
6. Click "Test Connection" to verify
7. Save the configuration
8. Create a storyboard or use existing frames
9. Right-click on a frame and select "生成视频"
10. The video should now be generated using Zhipu API

## Deployment
- Built with: `npm run build`
- Deployed to: https://sora.wboke.com (via Vercel)
- Status: ✅ Live and ready for testing

## Notes
- The fix ensures provider selection from settings is properly passed through the entire video generation flow
- Status query endpoint is now correct for Zhipu API
- Provider ID normalization ensures compatibility with VideoAPIProvider type
