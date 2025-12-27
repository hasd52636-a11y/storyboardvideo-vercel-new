# Quick Action Context Menu - Testing Guide

## How to Test

### Prerequisites
1. Ensure you have at least one storyboard card on the canvas
2. Make sure your API key is configured (for image generation)
3. The card should NOT be marked as the main reference (Ref) card

### Test Scenarios

#### 1. Right-Click Menu Display
1. Right-click on any non-main storyboard card
2. **Expected**: Context menu appears with options including:
   - 设置为关键帧 (Set as Key Frame)
   - 替换 (Replace)
   - 重绘 (Redraw)
   - **三视图 (Three-View)** ← NEW
   - **多角度 (Multi-Grid)** ← NEW
   - **多风格 (Style Comparison)** ← NEW
   - **叙事进展 (Narrative Progression)** ← NEW
   - 复制 (Copy)
   - 下载 (Download)
   - 生成视频 (Generate Video)
   - 删除 (Delete)

#### 2. Three-View Generation
1. Right-click on a storyboard card
2. Click "三视图 (Three-View)"
3. **Expected**:
   - Loading indicator appears
   - 3 new cards are generated and positioned horizontally
   - Each card shows a different orthographic view (Front, Side, Top)
   - Cards are positioned to the right of the source card

#### 3. Multi-Grid Generation
1. Right-click on a storyboard card
2. Click "多角度 (Multi-Grid)"
3. **Expected**:
   - A dialog appears asking "Enter number of frames (2-12):"
   - Enter a number (e.g., 4)
   - Click OK
   - Loading indicator appears
   - 1 new card is generated with a grid layout
   - Card is positioned below the source card
   - Card is larger to accommodate the grid

#### 4. Style Comparison Generation
1. Right-click on a storyboard card
2. Click "多风格 (Style Comparison)"
3. **Expected**:
   - Loading indicator appears
   - 5 new cards are generated
   - Each card shows the same subject in different styles:
     - Oil painting
     - Watercolor
     - Digital art
     - Anime
     - Photorealistic
   - Cards are positioned horizontally below the source card

#### 5. Narrative Progression Generation
1. Right-click on a storyboard card
2. Click "叙事进展 (Narrative Progression)"
3. **Expected**:
   - A dialog appears asking "Enter number of frames (1-12):"
   - Enter a number (e.g., 6)
   - Click OK
   - Loading indicator appears
   - 6 new cards are generated
   - Cards are arranged in a 3-column grid layout
   - Each card is labeled with "Frame 1", "Frame 2", etc.
   - Cards are positioned below the source card

#### 6. Error Handling
1. Right-click on a storyboard card
2. Click "多角度 (Multi-Grid)"
3. Enter an invalid number (e.g., 15 or 0)
4. **Expected**:
   - Alert appears: "Please enter a number between 2 and 12"
   - No cards are generated
   - Loading state is cleared

#### 7. Menu Closure
1. Right-click on a storyboard card
2. Click any quick-action option
3. **Expected**:
   - Menu closes automatically
   - Generation starts

#### 8. Main Card Exclusion
1. Right-click on the main reference card (marked with "Ref" label)
2. **Expected**:
   - Quick-action options do NOT appear in the menu
   - Only standard options are shown

### Performance Testing

#### Generation Speed
- **Three-View**: Should complete in ~30-60 seconds (3 API calls)
- **Multi-Grid**: Should complete in ~10-20 seconds (1 API call)
- **Style Comparison**: Should complete in ~50-100 seconds (5 API calls)
- **Narrative Progression**: Should complete in ~10-20 seconds per frame

#### Memory Usage
- Monitor browser memory usage during generation
- Should not cause significant memory spikes
- Generated cards should be properly garbage collected when deleted

### UI/UX Testing

#### Menu Positioning
1. Right-click near the edges of the screen
2. **Expected**: Menu stays within viewport boundaries

#### Visual Feedback
1. During generation, loading spinner should be visible
2. Menu items should have hover effects (blue color)
3. Generated cards should have consistent styling with existing cards

#### Bilingual Support
1. Change language to English in settings
2. Right-click on a card
3. **Expected**: Menu items appear in English:
   - Three-View
   - Multi-Grid
   - Style Comparison
   - Narrative Progression

### Integration Testing

#### Card Positioning
1. Generate multiple quick actions from the same source card
2. **Expected**: New cards are positioned without overlapping
3. Cards should be positioned relative to the source card

#### Undo/Redo
1. Generate a quick action
2. Delete the generated cards
3. **Expected**: Cards are removed from canvas
4. Note: Undo functionality may not be implemented yet

#### Export
1. Generate quick action cards
2. Select them and export as JPEG
3. **Expected**: All cards are included in the export

## Troubleshooting

### Issue: Menu doesn't appear
- **Solution**: Ensure you're right-clicking on a non-main storyboard card
- **Solution**: Check browser console for errors

### Issue: Generation fails
- **Solution**: Check API key configuration
- **Solution**: Check browser console for error messages
- **Solution**: Ensure internet connection is stable

### Issue: Cards appear in wrong position
- **Solution**: This is expected behavior - cards are positioned relative to source
- **Solution**: You can drag cards to reposition them

### Issue: Loading indicator doesn't disappear
- **Solution**: Check browser console for errors
- **Solution**: Refresh the page if stuck

## Success Criteria
- [x] All four quick-action options are accessible via right-click menu
- [x] Each action generates the correct number of cards
- [x] Cards are positioned appropriately
- [x] Loading state is managed correctly
- [x] Error handling works as expected
- [x] Menu closes after selection
- [x] No TypeScript errors
- [x] Bilingual support works
