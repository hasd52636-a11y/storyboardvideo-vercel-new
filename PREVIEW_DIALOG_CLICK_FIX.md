# Fixed Preview Dialog Click Event Propagation

## Problem
When clicking on scene cards in the script preview dialog to expand them or edit text, the entire dialog would collapse/close. This was caused by event bubbling to the outer dialog container's `onClick={onCancel}` handler.

## Root Cause
The scene card container and expanded content area did not call `e.stopPropagation()`, so clicks were bubbling up to the outer dialog backdrop which had `onClick={onCancel}`.

## Solution
Added `e.stopPropagation()` to prevent event bubbling:

1. **Scene Card Click Handler**
   - Added `e.stopPropagation()` to the scene card's `onClick` handler
   - Now clicking to expand/collapse a scene doesn't close the dialog

2. **Expanded Content Area**
   - Added `onClick={(e) => e.stopPropagation()}` to the expanded content container
   - Now clicking on textareas and other elements inside expanded content doesn't close the dialog

## Changes Made
File: `components/StoryboardPreviewDialog.tsx`

```tsx
// Scene card - now stops propagation
onClick={(e) => {
  e.stopPropagation();
  setExpandedFrameId(isExpanded ? null : frame.id);
}}

// Expanded content - now stops propagation
<div 
  style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
  onClick={(e) => e.stopPropagation()}
>
```

## User Experience Improvement
- Users can now click on scene cards to expand/collapse without closing the dialog
- Users can now edit text in textareas without the dialog closing
- Dialog only closes when clicking the X button or outside the dialog area

## Testing
- Build completed successfully (5.17s)
- Ready for deployment to Vercel
