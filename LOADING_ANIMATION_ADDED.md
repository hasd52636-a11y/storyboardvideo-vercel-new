# Loading Animation for Image Generation

## Summary
Added dynamic loading animation to placeholder cards while images are being generated. This provides visual feedback to users so they know the system is actively generating images rather than displaying an empty black card.

## Changes Made

### 1. Added `isLoading` Flag to Placeholders
Modified three image generation functions to set `isLoading: true` when creating placeholder cards:

- **handleGenerateFromScript** (脚本生成)
- **handleGenerateFromDialogue** (对话生成)
- **handleGenerateFramesFromPreview** (预览对话框生成)

### 2. Set `isLoading: false` on Completion
When image generation completes successfully, the `isLoading` flag is set to `false` to hide the loading animation.

### 3. Visual Feedback in StoryboardCard
The StoryboardCard component already had the loading animation UI implemented:

```tsx
{item.isLoading && (
  <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      <span className="text-white text-xs font-black uppercase tracking-widest">
        {lang === 'zh' ? '生成中...' : 'Generating...'}
      </span>
    </div>
  </div>
)}
```

## User Experience Improvement

**Before:**
- Placeholder cards appeared as solid black with no indication of status
- Users couldn't tell if the system was generating or if something went wrong

**After:**
- Placeholder cards show a spinning loading indicator with "生成中..." (Generating...) text
- Semi-transparent overlay with blur effect provides visual hierarchy
- Users have clear feedback that image generation is in progress
- Animation stops when image appears or generation fails

## Files Modified
- `App.tsx` - Added `isLoading: true` to placeholder creation and `isLoading: false` to completion handlers

## Deployment
Build completed successfully (3.54s). Ready for deployment to Vercel.
