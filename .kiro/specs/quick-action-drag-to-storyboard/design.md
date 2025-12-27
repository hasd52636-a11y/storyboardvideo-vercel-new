# Design Document: Quick Action Drag-to-Storyboard

## Overview

This design implements a drag-and-drop interaction system that allows users to drag quick action icons from the Quick Storyboard panel onto storyboard cards in the canvas. When dropped, the system extracts the card's image as a reference and executes the corresponding generation instruction.

The implementation leverages React's native drag-and-drop API with HTML5 DataTransfer for passing action metadata between components.

## Architecture

### Component Interaction Flow

```
QuickStoryboard (Drag Source)
    ↓ (onDragStart: sets drag data with action type)
    ↓
StoryboardCard (Drop Target)
    ↓ (onDragOver: validates drop target)
    ↓ (onDrop: extracts card image, triggers generation)
    ↓
StoryboardApp (Generation Handler)
    ↓ (calls handleQuickStoryboardGeneration)
    ↓
GenerationCanvas (Display Results)
```

### Data Flow

1. **Drag Initiation**: User presses and holds on a quick action button
   - Action type, template, and parameters are serialized to JSON
   - Drag data is set with MIME type `application/json`
   - Visual feedback is provided (cursor change, icon preview)

2. **Drag Over**: User moves cursor over storyboard cards
   - Drop target validation occurs
   - Valid targets are highlighted
   - Invalid targets show "not-allowed" cursor

3. **Drop**: User releases mouse on a storyboard card
   - Drag data is parsed to extract action type
   - Card's image URL is extracted as reference
   - Generation is triggered with reference image
   - For parameterized actions, input dialog is shown

4. **Generation**: System executes generation with card image as reference
   - Same generation logic as button-based generation
   - Results are displayed in GenerationCanvas
   - Errors are handled and displayed to user

## Components and Interfaces

### QuickStoryboard Component Modifications

**New Props:**
- None (existing props remain unchanged)

**New State:**
- `draggedActionType`: Tracks which action is being dragged (for visual feedback)

**New Methods:**
- `handleActionDragStart(action: QuickAction, e: React.DragEvent)`: Initiates drag with action metadata
- `handleActionDragEnd(e: React.DragEvent)`: Cleans up drag state

**Drag Data Format:**
```typescript
interface QuickActionDragData {
  type: 'quick-action';
  actionType: GenerationType;
  template: string;
  requiresInput: boolean;
  inputMin?: number;
  inputMax?: number;
}
```

### StoryboardCard Component Modifications

**New Props:**
- `onDropQuickAction?: (itemId: string, actionData: QuickActionDragData, referenceImage: string) => void`

**New Methods:**
- `handleDragOver(e: React.DragEvent)`: Validates drop target and provides visual feedback
- `handleDragLeave(e: React.DragEvent)`: Removes visual feedback
- `handleDrop(e: React.DragEvent)`: Processes drop and triggers generation

**Drop Validation Logic:**
```typescript
// Reject drops on main reference card
if (item.isMain) {
  e.preventDefault();
  return;
}

// Validate drag data
const dragData = e.dataTransfer.getData('application/json');
if (!dragData) {
  return;
}

// Extract action metadata
const actionData = JSON.parse(dragData);
if (actionData.type !== 'quick-action') {
  return;
}
```

### StoryboardApp Component Modifications

**New Handler:**
- `handleQuickActionDropOnCard(cardId: string, actionData: QuickActionDragData, referenceImage: string)`: 
  - Extracts action type and parameters
  - Shows input dialog if action requires parameters
  - Calls existing `handleQuickStoryboardGeneration` with reference image

## Data Models

### Quick Action Drag Data

```typescript
interface QuickActionDragData {
  type: 'quick-action';
  actionType: 'three-view' | 'multi-grid' | 'style-comparison' | 'narrative-progression';
  template: string;
  requiresInput: boolean;
  inputMin?: number;
  inputMax?: number;
}
```

### Storyboard Card Reference

```typescript
interface StoryboardCardReference {
  cardId: string;
  imageUrl: string;
  isMain: boolean;
  order: number;
}
```

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Drag Data Integrity

**For any** quick action icon that is dragged, the drag data transferred must contain the correct action type and template information.

**Validates: Requirements 1.3, 4.1, 4.2**

### Property 2: Drop Target Validation

**For any** storyboard card, if it is the main reference card, dropping a quick action should be rejected and no generation should occur.

**Validates: Requirements 2.4, 7.1**

### Property 3: Reference Image Extraction

**For any** storyboard card that is not the main reference card, when a quick action is dropped on it, the card's image URL should be extracted and passed to the generation service.

**Validates: Requirements 2.3, 3.1, 3.2**

### Property 4: Generation Execution

**For any** quick action dropped on a valid storyboard card, the generation should be triggered using the same generation logic as button-based generation, with the card's image as reference.

**Validates: Requirements 3.3, 3.4, 8.1, 8.2**

### Property 5: Parameter Input for Parameterized Actions

**For any** quick action that requires input (multi-grid, narrative-progression), when dropped on a storyboard card, an input dialog should be displayed before generation begins.

**Validates: Requirements 5.1, 5.2, 5.3, 5.4**

### Property 6: Error Handling on Invalid Reference

**For any** storyboard card with a missing or invalid image URL, when a quick action is dropped on it, an error message should be displayed and generation should not proceed.

**Validates: Requirements 7.2, 7.3**

### Property 7: Visual Feedback During Drag

**For any** drag operation over storyboard cards, valid drop targets should be visually highlighted and invalid targets should show a "not-allowed" cursor.

**Validates: Requirements 6.2, 6.3**

## Error Handling

### Error Scenarios

1. **Drop on Main Reference Card**
   - Error Message: "Cannot apply quick actions to the reference image"
   - Action: Reject drop, no generation

2. **Invalid Drag Data**
   - Error Message: "Invalid action data"
   - Action: Reject drop silently

3. **Missing Card Image**
   - Error Message: "Invalid reference image"
   - Action: Display error, abort generation

4. **Generation Failure**
   - Error Message: Display error from generation service
   - Action: Show error in error section, allow retry

5. **Invalid Parameter Input**
   - Error Message: "Frame count must be between X and Y"
   - Action: Keep input dialog open, allow user to correct

### Error Recovery

- Users can retry generation after fixing issues
- Input dialog can be cancelled to abort operation
- Error messages are dismissible

## Testing Strategy

### Unit Tests

**QuickStoryboard Component:**
- Test drag initiation with correct action data
- Test drag data serialization
- Test visual feedback during drag

**StoryboardCard Component:**
- Test drop validation on main reference card (should reject)
- Test drop validation on regular cards (should accept)
- Test drag data parsing
- Test image URL extraction
- Test visual feedback on drag over/leave

**StoryboardApp Component:**
- Test handler receives correct action data
- Test handler receives correct reference image
- Test input dialog display for parameterized actions
- Test generation call with reference image
- Test error handling

### Property-Based Tests

**Property 1: Drag Data Integrity**
- Generate random quick actions
- Drag each action
- Verify drag data contains correct action type and template

**Property 2: Drop Target Validation**
- Generate random storyboard cards (mix of main and regular)
- Drop quick actions on each
- Verify main cards reject drops, regular cards accept

**Property 3: Reference Image Extraction**
- Generate random storyboard cards with various image URLs
- Drop quick actions on each
- Verify extracted image URL matches card's image URL

**Property 4: Generation Execution**
- Generate random quick actions and storyboard cards
- Drop actions on cards
- Verify generation is called with correct parameters

**Property 5: Parameter Input for Parameterized Actions**
- Generate multi-grid and narrative-progression actions
- Drop on storyboard cards
- Verify input dialog is displayed
- Verify generation only proceeds after valid input

**Property 6: Error Handling on Invalid Reference**
- Generate storyboard cards with null/invalid image URLs
- Drop quick actions on each
- Verify error message is displayed

**Property 7: Visual Feedback During Drag**
- Generate random storyboard cards
- Drag quick actions over each
- Verify visual feedback is applied correctly

### Integration Tests

- Test complete drag-drop flow from QuickStoryboard to StoryboardCard to generation
- Test error scenarios and recovery
- Test with various action types and card configurations

## Implementation Notes

### Browser Compatibility

- Uses HTML5 Drag and Drop API (supported in all modern browsers)
- DataTransfer API for passing JSON data
- CSS for visual feedback (cursor, highlighting)

### Performance Considerations

- Drag operations are lightweight (no heavy computations)
- Visual feedback uses CSS transitions (GPU-accelerated)
- Generation is asynchronous (doesn't block UI)

### Accessibility

- Drag-drop operations should have keyboard alternatives (future enhancement)
- Error messages are clear and descriptive
- Visual feedback is supplemented with text feedback

