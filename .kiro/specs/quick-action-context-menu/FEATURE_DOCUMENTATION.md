# Quick Action Context Menu - Feature Documentation

## Overview
The Quick Action Context Menu is a powerful feature that allows users to generate storyboard variations directly from the right-click menu on any storyboard card. This feature provides four different generation modes for rapid storyboard creation.

## User Guide

### Accessing the Feature
1. Create or import a storyboard card on the canvas
2. Right-click on any non-main storyboard card
3. A context menu will appear with various options

### Menu Options

#### 1. 三视图 (Three-View)
**Purpose**: Generate orthographic views of a subject from three perspectives

**How to Use**:
1. Right-click on a storyboard card
2. Click "三视图 (Three-View)"
3. Wait for generation to complete

**Output**:
- 3 new storyboard cards
- Front view (orthographic projection)
- Side view (orthographic projection)
- Top view (orthographic projection)

**Positioning**: Cards are placed horizontally to the right of the source card

**Use Cases**:
- Visualizing product designs
- Understanding spatial relationships
- Creating technical documentation
- Architectural visualization

#### 2. 多角度 (Multi-Grid)
**Purpose**: Generate a grid layout showing multiple camera angles of the same subject

**How to Use**:
1. Right-click on a storyboard card
2. Click "多角度 (Multi-Grid)"
3. Enter the number of frames (2-12) in the dialog
4. Click OK
5. Wait for generation to complete

**Output**:
- 1 large storyboard card
- Grid layout with N frames
- Each frame shows a different camera angle

**Positioning**: Card is placed below the source card

**Frame Count Guidelines**:
- 2-4 frames: Quick overview
- 5-8 frames: Comprehensive coverage
- 9-12 frames: Detailed exploration

**Use Cases**:
- Product photography
- Scene exploration
- Camera movement planning
- Visual storytelling

#### 3. 多风格 (Style Comparison)
**Purpose**: Generate the same subject in different artistic styles

**How to Use**:
1. Right-click on a storyboard card
2. Click "多风格 (Style Comparison)"
3. Wait for generation to complete

**Output**:
- 5 new storyboard cards
- Oil painting style
- Watercolor style
- Digital art style
- Anime style
- Photorealistic style

**Positioning**: Cards are placed horizontally below the source card

**Use Cases**:
- Exploring artistic directions
- Style selection for projects
- Creative brainstorming
- Visual mood board creation

#### 4. 叙事进展 (Narrative Progression)
**Purpose**: Generate sequential frames showing story progression

**How to Use**:
1. Right-click on a storyboard card
2. Click "叙事进展 (Narrative Progression)"
3. Enter the number of frames (1-12) in the dialog
4. Click OK
5. Wait for generation to complete

**Output**:
- N new storyboard cards
- Sequential narrative frames
- Each frame labeled with sequence number

**Positioning**: Cards are arranged in a 3-column grid layout below the source card

**Frame Count Guidelines**:
- 1-3 frames: Quick sequence
- 4-6 frames: Standard narrative
- 7-12 frames: Detailed story arc

**Use Cases**:
- Story development
- Action sequence planning
- Character journey visualization
- Dialogue scene planning

## Technical Details

### API Integration
- Uses Gemini API for image generation
- Supports fallback to alternative APIs
- Handles API errors gracefully

### Performance
- Three-View: ~30-60 seconds (3 API calls)
- Multi-Grid: ~10-20 seconds (1 API call)
- Style Comparison: ~50-100 seconds (5 API calls)
- Narrative Progression: ~10-20 seconds per frame

### Positioning Algorithm
- Cards are positioned relative to the source card
- Horizontal positioning for Three-View and Style Comparison
- Grid positioning for Narrative Progression
- Automatic spacing to prevent overlap

### Error Handling
- Invalid frame count: Shows alert with valid range
- API failure: Displays error message
- Network issues: Graceful degradation
- User cancellation: Cleans up state

## Keyboard Shortcuts
Currently, keyboard shortcuts are not implemented. Future versions may include:
- Alt+T: Three-View
- Alt+M: Multi-Grid
- Alt+S: Style Comparison
- Alt+N: Narrative Progression

## Customization Options

### Future Enhancements
1. **Custom Prompts**: Allow users to customize generation prompts
2. **Style Selection**: Choose specific styles for Style Comparison
3. **Camera Angles**: Select specific camera angles for Multi-Grid
4. **Batch Operations**: Apply quick actions to multiple cards
5. **Keyboard Shortcuts**: Quick access via keyboard
6. **Generation History**: Track and reuse past generations
7. **Undo/Redo**: Revert generated cards
8. **Export Options**: Direct export of generated cards

## Troubleshooting

### Issue: Menu doesn't appear
**Solution**: 
- Ensure you're right-clicking on a non-main card
- Check that the card is not marked as reference (Ref)

### Issue: Generation fails
**Solution**:
- Verify API key is configured
- Check internet connection
- Review browser console for error messages

### Issue: Cards appear in wrong position
**Solution**:
- This is expected behavior
- You can drag cards to reposition them manually

### Issue: Generation takes too long
**Solution**:
- This is normal for multiple API calls
- Check internet connection speed
- Verify API quota is not exceeded

## Best Practices

### For Three-View
- Use for products or objects with clear geometry
- Best for technical visualization
- Works well with symmetrical subjects

### For Multi-Grid
- Use for exploring scenes from different angles
- Best for establishing shots
- Ideal for camera movement planning

### For Style Comparison
- Use for artistic direction exploration
- Best for creative projects
- Helpful for mood board creation

### For Narrative Progression
- Use for story development
- Best for action sequences
- Ideal for dialogue planning

## Accessibility
- Bilingual support (Chinese/English)
- Clear visual feedback during generation
- Descriptive error messages
- Keyboard navigation support

## Performance Optimization
- Lazy loading of images
- Efficient state management
- Minimal re-renders
- Optimized API calls

## Security
- No sensitive data stored locally
- API keys handled securely
- CORS-compliant requests
- Input validation on all user inputs

## Compatibility
- Works on all modern browsers
- Responsive design for different screen sizes
- Touch-friendly interface
- Keyboard accessible

## Support
For issues or feature requests:
1. Check the Testing Guide
2. Review the Troubleshooting section
3. Check browser console for errors
4. Contact support with error details

---
**Last Updated**: December 28, 2025
**Version**: 1.0
**Status**: Production Ready
