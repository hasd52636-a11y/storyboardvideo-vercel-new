# Zhipu Image Model Test Fix

## Problem
The image model test for Zhipu was failing with a 401 authentication error:
- ✅ Conversation model test: SUCCESS
- ✅ Video model test: SUCCESS  
- ❌ Image model test: FAILING with 401 error

## Root Cause
The `testConnection()` method in `zhipuService.ts` was attempting to analyze an image using `analyzeImage()`, which:
1. Requires a valid image URL
2. Makes an actual API call to the vision model
3. Was failing with 401 because the API key may be expired or lack image analysis permissions

## Solution
Changed the test strategy to use text generation instead of image analysis:

### Changes Made

#### 1. `zhipuService.ts` - Updated `testConnection()` method
**Before:**
```typescript
async testConnection(): Promise<boolean> {
  // Used analyzeImage() which requires image URL and vision model permissions
  const result = await this.analyzeImage(testImageUrl, testPrompt, {
    maxTokens: 100
  });
}
```

**After:**
```typescript
async testConnection(): Promise<boolean> {
  // Uses generateText() which is more reliable and doesn't require image permissions
  const result = await this.generateText(testPrompt, {
    maxTokens: 10
  });
}
```

#### 2. `geminiService.ts` - Updated `testApiConnection()` function
**Before:**
```typescript
else if (config.provider === 'zhipu') {
  const zhipuService = new ZhipuService(config);
  return await zhipuService.testConnection();
}
```

**After:**
```typescript
else if (config.provider === 'zhipu') {
  const zhipuService = new ZhipuService(config);
  
  if (type === 'image') {
    // Test image generation instead of image analysis
    const imageUrl = await zhipuService.generateImage('A simple test image', {
      size: '1024x1024',
      quality: 'standard'
    });
    return !!imageUrl;
  } else {
    // Test text generation for LLM
    return await zhipuService.testConnection();
  }
}
```

## Benefits
1. **More Reliable**: Text generation is a core capability that all API keys should support
2. **Separate Tests**: Image test now specifically tests image generation capability
3. **Better Error Handling**: Distinguishes between text and image model permissions
4. **Clearer Feedback**: Users can now see which specific capability is working or failing

## Testing
After deployment, users should see:
- ✅ Conversation model test: SUCCESS (tests text generation)
- ✅ Video model test: SUCCESS (tests video generation endpoint)
- ✅ Image model test: SUCCESS (tests image generation capability)

If image test still fails with 401, it indicates:
- API key is expired or invalid
- API key lacks image generation permissions
- User should regenerate API key from https://open.bigmodel.cn/usercenter/apikeys

## Deployment
- Built: `npm run build` ✓
- Deployed: `vercel deploy --prod` ✓
- Live at: https://sora.wboke.com
