# Quick Storyboard Submenu UI Fix - Design

## Overview

The Quick Storyboard submenu feature allows users to access four quick generation modes through a right-click context menu. The fix addresses CSS and event handling issues that prevent proper mouse interaction with the submenu.

## Architecture

### Current Flow (Broken)
```
User hovers over "快捷分镜"
    ↓
onMouseEnter triggers, submenu shows
    ↓
User moves mouse toward submenu
    ↓
Mouse leaves parent div, onMouseLeave triggers
    ↓
Submenu closes before user can click
    ↓
User cannot interact with submenu items
```

### Fixed Flow
```
User hovers over "快捷分镜"
    ↓
onMouseEnter triggers, submenu shows
    ↓
User moves mouse toward submenu
    ↓
Wrapper div maintains hover state
    ↓
Submenu remains open with proper z-index
    ↓
User can click submenu items successfully
```

## Components and Interfaces

### StoryboardCard.tsx - Submenu Container

**Current Implementation Issues:**
- Submenu div is positioned absolutely but lacks proper z-index
- No pointer-events handling to ensure mouse events are captured
- Gap between parent menu item and submenu causes onMouseLeave to trigger
- Submenu container doesn't wrap both parent and submenu for proper event handling

**Fixed Implementation:**
```jsx
<div 
  className="relative"
  onMouseEnter={() => setShowQuickStoryboardSubmenu(true)}
  onMouseLeave={() => setShowQuickStoryboardSubmenu(false)}
>
  {/* Parent menu item */}
  <button className="...">
    {lang === 'zh' ? '快捷分镜' : 'Quick Storyboard'}
    <span className="text-xs">▶</span>
  </button>
  
  {/* Submenu with proper z-index and pointer-events */}
  {showQuickStoryboardSubmenu && (
    <div className="absolute left-full top-0 ml-1 border rounded-xl shadow-2xl w-40 flex flex-col font-black text-[10px] uppercase tracking-widest z-[9999] pointer-events-auto ...">
      {/* Submenu items */}
    </div>
  )}
</div>
```

## Data Models

### Menu State
```typescript
interface MenuState {
  showMenu: boolean;
  showQuickStoryboardSubmenu: boolean;
  menuPos: { x: number; y: number };
}
```

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Submenu Visibility with Proper Z-Index

**For any** hover over the "快捷分镜" menu item, the submenu SHALL be displayed with a z-index value that ensures it appears above all other page elements.

**Validates: Requirements 1.1, 1.3**

### Property 2: Mouse Can Enter Submenu

**For any** submenu that is displayed, when the user moves the mouse from the parent menu item into the submenu, the submenu SHALL remain visible and the mouse events SHALL be properly captured.

**Validates: Requirements 2.1, 5.1**

### Property 3: Submenu Items Are Clickable

**For any** submenu item that is displayed, when the user clicks on it, the click event SHALL be triggered and the corresponding action SHALL be executed.

**Validates: Requirement 2.3**

### Property 4: Submenu Closes on Mouse Leave

**For any** submenu that is displayed, when the user moves the mouse away from both the parent menu item and the submenu, the submenu SHALL close.

**Validates: Requirement 4.1**

### Property 5: Submenu Remains Open During Hover

**For any** submenu that is displayed, when the user moves the mouse from the parent menu item to the submenu, the submenu SHALL remain open and not close prematurely.

**Validates: Requirement 4.2**

### Property 6: Proper Event Handling

**For any** interaction with the submenu, the mouse events (onMouseEnter, onMouseLeave) SHALL be properly captured and processed by the wrapper container.

**Validates: Requirement 5.2**

## Error Handling

### Submenu Not Visible
- **Trigger**: z-index is too low or pointer-events is set to none
- **Response**: Ensure z-index is set to z-[9999] or higher
- **Verification**: Submenu should appear above all other elements

### Mouse Events Not Captured
- **Trigger**: pointer-events is set to none on submenu
- **Response**: Ensure pointer-events-auto is applied to submenu
- **Verification**: Mouse hover should trigger hover styling

### Submenu Closes Prematurely
- **Trigger**: Gap between parent and submenu causes onMouseLeave to trigger
- **Response**: Ensure wrapper div has proper event handling
- **Verification**: Moving mouse from parent to submenu should keep submenu open

## Testing Strategy

### Unit Tests
- Test that submenu appears when parent menu item is hovered
- Test that submenu has correct z-index value
- Test that submenu items have pointer-events enabled
- Test that submenu closes when mouse leaves both parent and submenu
- Test that submenu remains open when mouse moves from parent to submenu

### Property-Based Tests
- **Property 1**: For any hover over parent menu item, verify submenu has z-index >= 9999
- **Property 2**: For any submenu display, verify mouse can enter submenu without it closing
- **Property 3**: For any submenu item click, verify action is triggered
- **Property 4**: For any mouse leave from both parent and submenu, verify submenu closes
- **Property 5**: For any mouse movement from parent to submenu, verify submenu remains open
- **Property 6**: For any mouse event, verify it's properly captured by wrapper container

### Test Configuration
- Minimum 100 iterations per property test
- Test with various mouse movement patterns
- Test with different submenu item positions
- Test with edge cases (fast mouse movement, rapid hovering)

## Implementation Notes

1. **Wrapper Container**: Use a `relative` positioned div to wrap both parent menu item and submenu
2. **Z-Index**: Set submenu z-index to `z-[9999]` to ensure it's above all other elements
3. **Pointer Events**: Add `pointer-events-auto` to submenu to ensure mouse events are captured
4. **Event Handling**: Use `onMouseEnter` and `onMouseLeave` on the wrapper container
5. **Positioning**: Keep `absolute left-full top-0 ml-1` for proper submenu positioning
6. **No Gap**: Ensure there's no gap between parent and submenu that could trigger onMouseLeave

## CSS Classes to Add/Modify

- Add `z-[9999]` to submenu div
- Add `pointer-events-auto` to submenu div
- Ensure wrapper div has `relative` positioning
- Ensure wrapper div has proper event handlers
