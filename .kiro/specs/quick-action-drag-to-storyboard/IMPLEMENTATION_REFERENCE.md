# Quick Action Drag-to-Storyboard: Implementation Reference

**Quick lookup guide for key implementation details**

---

## File Locations

| Component | File | Lines | Purpose |
|-----------|------|-------|---------|
| Drag Initiation | `components/QuickStoryboard.tsx` | 280-310 | Serialize action metadata |
| Drop Handling | `components/StoryboardCard.tsx` | 45-95 | Validate and process drops |
| Generation Trigger | `App.tsx` | 1159-1180 | Handle drop and show dialog |
| Generation Logic | `App.tsx` | 1182-1280 | Generate images and create items |
| API Integration | `geminiService.ts` | 171-450 | Call API endpoints |

---

## Key Code Snippets

### 1. Drag Initiation

**File**: `components/QuickStoryboard.tsx` (lines 280-310)

```typescript
const handleActionDragStart = (action: QuickAction, e: React.DragEvent<HTMLButtonElement>) => {
  const dragData = {
    type: 'quick-action',
    actionType: action.type,
    template: templateValues[action.type] || '',
    requiresInput: action.requiresInput,
    inputMin: action.inputMin,
    inputMax: action.inputMax,
  };
  
  e.dataTransfer.effectAllowed = 'copy';
  e.dataTransfer.setData('application/json', JSON.stringify(dragData));
};
```

**Key Points**:
- Serializes as JSON with MIME type `application/json`
- Includes actionType, requiresInput, inputMin/Max
- Sets drag effect to 'copy'

---

### 2. Drop Validation

**File**: `components/StoryboardCard.tsx` (lines 45-95)

```typescript
const handleDropQuickAction = (e: React.DragEvent<HTMLDivElement>) => {
  // Validate: not main reference card
  if (item.isMain) return;
  
  // Validate: card has imageUrl
  if (!item.imageUrl) return;
  
  // Extract and validate drag data
  const dragDataStr = e.dataTransfer.getData('application/json');
  const actionData = JSON.parse(dragDataStr);
  
  if (actionData.type !== 'quick-action') return;
  
  // Call handler with action data and reference image
  onDropQuickAction?.(item.id, actionData, item.imageUrl);
};
```

**Key Points**:
- Rejects main reference card
- Validates imageUrl exists
- Validates drag data format
- Passes actionData and referenceImage to handler

---

### 3. Generation Trigger

**File**: `App.tsx` (lines 1159-1180)

```typescript
const handleDropQuickAction = async (cardId: string, actionData: any, referenceImage: string) => {
  const item = items.find(it => it.id === cardId);
  if (!item || item.isMain) return;
  
  // If action requires input, show config dialog
  if (actionData.requiresInput) {
    setQuickStoryboardItemId(cardId);
    setQuickStoryboardActionType(actionData.actionType);
    setQuickStoryboardFrameCount(actionData.actionType === 'multi-grid' ? 4 : 5);
    setShowQuickStoryboardConfig(true);
    return;
  }
  
  // Otherwise, trigger generation immediately
  await triggerDropGeneration(cardId, actionData, referenceImage, {});
};
```

**Key Points**:
- Validates card exists and is not main
- Shows dialog for parameterized actions
- Immediately triggers generation for non-parameterized actions

---

### 4. Prompt Construction

**File**: `App.tsx` (lines 1195-1210)

```typescript
// Build original prompt info (only for local storage, NOT sent to API)
const originalPromptInfo = item.prompt ? `\n[Original Prompt]: ${item.prompt}` : '';

// For three-view action
const threeViewPrompts = [
  `Based on the reference image provided, generate a front orthographic view:
[Subject]: ${item.description}
[View Type]: Front orthographic projection
[Instructions]: ...`,
  // ... more prompts
];

for (let i = 0; i < 3; i++) {
  const imageUrl = await generateSceneImage(threeViewPrompts[i], true, item.colorMode === 'blackAndWhite', undefined, item.aspectRatio, referenceImage);
  if (imageUrl) {
    generatedItems.push({ 
      url: imageUrl, 
      apiPrompt: threeViewPrompts[i],  // ✅ Pure instruction, NO original prompt
      savedPrompt: threeViewPrompts[i] + originalPromptInfo  // ✅ With original prompt
    });
  }
}
```

**Key Points**:
- apiPrompt: Pure instruction only (sent to API)
- savedPrompt: API prompt + original prompt reference (stored locally)
- Original prompt NOT sent to API

---

### 5. API Endpoint Selection

**File**: `geminiService.ts` (lines 280-350)

```typescript
if (referenceImageUrl) {
  // Use image-to-image (edits) endpoint
  const endpoint = `${config.baseUrl}/v1/images/edits`;
  
  // Convert reference image to Blob
  let imageBlob: Blob | null = null;
  if (referenceImageUrl.startsWith('data:')) {
    const base64Data = referenceImageUrl.split(',')[1];
    const mimeType = referenceImageUrl.split(';')[0].replace('data:', '') || 'image/png';
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    imageBlob = new Blob([bytes], { type: mimeType });
  }
  
  // Send via FormData
  const formData = new FormData();
  formData.append('model', config?.imageModel || 'nano-banana');
  formData.append('prompt', `${stylePrefix} ${prompt}`);  // ✅ NO original prompt
  formData.append('image', imageBlob, 'reference.png');
  formData.append('aspect_ratio', aspectRatio || '16:9');
  formData.append('response_format', 'url');
  
  const editResponse = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: formData
  });
} else {
  // Use text-to-image (generations) endpoint
  const endpoint = `${config.baseUrl}/v1/images/generations`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: config?.imageModel || 'nano-banana',
      prompt: `${stylePrefix} ${prompt}`,  // ✅ NO original prompt
      aspect_ratio: aspectRatio || '16:9',
      response_format: 'url'
    })
  });
}
```

**Key Points**:
- With reference image: `/v1/images/edits` (image-to-image)
- Without reference image: `/v1/images/generations` (text-to-image)
- Reference image converted to Blob for FormData
- Prompt sent to API does NOT include original prompt

---

### 6. Response Processing

**File**: `geminiService.ts` (lines 400-450)

```typescript
// Extract image URL from response
const imageUrl = data.data?.[0]?.url;

if (!imageUrl) {
  console.error('[generateSceneImage] ❌ No image URL in response');
  return null;
}

// Convert URL to base64 to avoid CORS issues
const base64 = await urlToBase64(imageUrl);
if (base64) {
  console.log("[generateSceneImage] ✓ Image converted to base64 successfully");
  return base64;
} else {
  console.warn("[generateSceneImage] Failed to convert to base64, returning URL as fallback");
  return imageUrl;
}
```

**Key Points**:
- Extracts image URL from API response
- Converts to base64 to avoid CORS issues
- Fallback to URL if conversion fails

---

### 7. Item Creation

**File**: `App.tsx` (lines 1240-1280)

```typescript
if (generatedItems.length > 0) {
  const newItems: StoryboardItem[] = generatedItems.map((genItem, idx) => ({
    id: crypto.randomUUID(),
    imageUrl: genItem.url,  // ✅ Base64 from API response
    prompt: genItem.savedPrompt,  // ✅ With original prompt info
    description: `${item.description} - Generated ${idx + 1}`,
    x: item.x + (idx + 1) * 440,
    y: item.y,
    width: item.width,
    height: item.height,
    isMain: false,
    filter: FilterMode.LINE_ART,
    order: items.length + idx,
    symbols: [],
    colorMode: item.colorMode,
    aspectRatio: item.aspectRatio
  }));
  setItems(prev => [...prev, ...newItems]);
}
```

**Key Points**:
- Uses base64 imageUrl from API response
- Uses savedPrompt (with original prompt info)
- Positions items horizontally offset
- Preserves color mode and aspect ratio

---

## Prompt Examples

### Three-View Action

**API Prompt** (sent to API):
```
Based on the reference image provided, generate a front orthographic view:
[Subject]: A beautiful landscape with mountains
[View Type]: Front orthographic projection
[Instructions]: Generate a clear front view (looking straight at the subject). 
Maintain the same subject, style, and proportions as the reference image. 
Show the subject from the front with consistent lighting and style. 
Use the reference image as the basis for this view.
```

**Saved Prompt** (stored locally):
```
Based on the reference image provided, generate a front orthographic view:
[Subject]: A beautiful landscape with mountains
[View Type]: Front orthographic projection
[Instructions]: Generate a clear front view (looking straight at the subject). 
Maintain the same subject, style, and proportions as the reference image. 
Show the subject from the front with consistent lighting and style. 
Use the reference image as the basis for this view.
[Original Prompt]: A beautiful landscape with mountains
```

---

### Style-Comparison Action

**API Prompt** (sent to API):
```
Based on the reference image provided, generate the subject in Oil Painting style:
[Subject]: A beautiful landscape with mountains
[Style]: Oil Painting
[Instructions]: Create a single frame showing the subject rendered in Oil Painting 
artistic style. Maintain the composition, proportions, and key elements from the 
reference image, but apply the specific artistic style. Use the reference image 
as the basis for this transformation.
```

**Saved Prompt** (stored locally):
```
Based on the reference image provided, generate the subject in Oil Painting style:
[Subject]: A beautiful landscape with mountains
[Style]: Oil Painting
[Instructions]: Create a single frame showing the subject rendered in Oil Painting 
artistic style. Maintain the composition, proportions, and key elements from the 
reference image, but apply the specific artistic style. Use the reference image 
as the basis for this transformation.
[Original Prompt]: A beautiful landscape with mountains
```

---

## Data Flow Summary

```
User drags quick action icon
    ↓
handleActionDragStart() serializes metadata as JSON
    ↓
User drops on storyboard card
    ↓
handleDropQuickAction() validates drop
    ↓
onDropQuickAction() called with actionData + referenceImage
    ↓
handleDropQuickAction() checks if action requires input
    ↓
If yes: Show config dialog
If no: Call triggerDropGeneration()
    ↓
Build apiPrompt (pure instruction, NO original prompt)
Build savedPrompt (apiPrompt + [Original Prompt]: ...)
    ↓
Call generateSceneImage(apiPrompt, ..., referenceImage)
    ↓
Detect referenceImage provided
    ↓
Use /v1/images/edits endpoint (image-to-image)
    ↓
Convert referenceImage to Blob
    ↓
Send FormData with model, prompt, image, aspect_ratio, response_format
    ↓
API returns image URL
    ↓
Convert URL to base64
    ↓
Create new StoryboardItem with:
  - imageUrl: base64
  - prompt: savedPrompt (with original prompt info)
    ↓
Add to items array and display
```

---

## Error Handling Summary

| Error | Location | Handling |
|-------|----------|----------|
| Drop on main reference card | StoryboardCard.tsx | Reject drop |
| Card has no imageUrl | StoryboardCard.tsx | Reject drop |
| Invalid drag data format | StoryboardCard.tsx | Reject drop |
| Invalid action type | StoryboardCard.tsx | Reject drop |
| No API key | geminiService.ts | Return null, show error |
| No base URL | geminiService.ts | Return null, show error |
| API response error | geminiService.ts | Return null, show error |
| No image URL in response | geminiService.ts | Return null, show error |
| Base64 conversion fails | geminiService.ts | Fallback to URL |

---

## Testing Checklist

- [ ] Drag three-view action onto card
- [ ] Verify 3 images generated
- [ ] Verify each has correct prompt
- [ ] Verify original prompt in saved prompt
- [ ] Drag style-comparison action onto card
- [ ] Verify 5 images generated
- [ ] Verify each in different style
- [ ] Drag multi-grid action onto card
- [ ] Enter frame count
- [ ] Verify N images generated
- [ ] Drag narrative-progression action onto card
- [ ] Enter frame count
- [ ] Verify N sequential images generated
- [ ] Try to drag onto main reference card (should reject)
- [ ] Try to drag onto empty card (should reject)
- [ ] Check console for proper logging
- [ ] Check Network tab for API requests
- [ ] Verify original prompt NOT in API request
- [ ] Verify original prompt in saved prompt

---

## Quick Debugging

**Check if drag data is correct**:
```javascript
// In browser console, during drag
console.log(event.dataTransfer.types);  // Should include 'application/json'
```

**Check if API is called correctly**:
```javascript
// In browser DevTools Network tab
// Look for POST to /v1/images/edits or /v1/images/generations
// Check request body for prompt (should NOT include [Original Prompt])
```

**Check if prompt is stored correctly**:
```javascript
// In browser console
// After generation, check item.prompt
// Should include [Original Prompt]: ... at the end
```

---

## Summary

This reference guide provides quick access to:
- File locations and line numbers
- Key code snippets
- Prompt examples
- Data flow
- Error handling
- Testing checklist
- Debugging tips

Use this for quick lookups during development and testing.

