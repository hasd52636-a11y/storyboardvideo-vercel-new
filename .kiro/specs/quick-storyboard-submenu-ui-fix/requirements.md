# Quick Storyboard Submenu UI Fix - Requirements

## Problem Statement

When users right-click on a storyboard card and hover over the "Quick Storyboard" menu item to expand the submenu, the submenu appears but the mouse cannot properly interact with it. The submenu items are not clickable or the submenu closes unexpectedly when moving the mouse into it.

## Root Cause

The submenu has CSS/event handling issues:
1. Missing or insufficient `z-index` on the submenu, causing it to be hidden behind other elements
2. Improper `pointer-events` handling that prevents mouse interaction
3. Possible gap between parent menu item and submenu causing `onMouseLeave` to trigger prematurely
4. Missing `pointer-events: auto` on submenu to ensure it captures mouse events

## Glossary

- **Context Menu**: Right-click menu that appears on storyboard cards
- **Submenu**: Expandable menu showing quick storyboard options (三视图, 多角度, 多风格, 叙事进展)
- **Parent Menu Item**: "快捷分镜" button that triggers submenu expansion
- **z-index**: CSS property controlling stacking order of elements
- **pointer-events**: CSS property controlling whether element can receive mouse events

## Requirements

### Requirement 1: Submenu Visibility

**User Story:** As a user, I want the submenu to be visible and not hidden behind other elements when I hover over the "Quick Storyboard" menu item.

#### Acceptance Criteria

1. WHEN the user hovers over "快捷分镜" menu item, THE submenu SHALL appear with sufficient z-index to be visible above all other elements
2. WHEN the submenu is displayed, THE submenu items SHALL be fully visible and not clipped or hidden
3. WHEN the submenu is displayed, THE submenu SHALL have a higher z-index than the parent context menu

### Requirement 2: Mouse Interaction with Submenu

**User Story:** As a user, I want to be able to move my mouse into the submenu and click on submenu items without the submenu closing.

#### Acceptance Criteria

1. WHEN the user moves the mouse from the parent menu item into the submenu, THE submenu SHALL remain open
2. WHEN the user hovers over a submenu item, THE submenu item SHALL show hover styling (blue text)
3. WHEN the user clicks on a submenu item, THE action SHALL be triggered and the menu SHALL close

### Requirement 3: Submenu Positioning

**User Story:** As a user, I want the submenu to be positioned correctly relative to the parent menu item so I can easily access it.

#### Acceptance Criteria

1. WHEN the submenu is displayed, THE submenu SHALL be positioned to the right of the parent menu item (left-full positioning)
2. WHEN the submenu is displayed, THE submenu SHALL be aligned with the top of the parent menu item
3. WHEN the submenu is displayed, THE submenu SHALL have a small gap (ml-1) between it and the parent menu item for visual clarity

### Requirement 4: Mouse Leave Behavior

**User Story:** As a user, I want the submenu to close only when I move my mouse away from both the parent menu item and the submenu.

#### Acceptance Criteria

1. WHEN the user moves the mouse away from both the parent menu item and the submenu, THE submenu SHALL close
2. WHEN the user moves the mouse from the parent menu item to the submenu, THE submenu SHALL remain open
3. WHEN the user moves the mouse from the submenu back to the parent menu item, THE submenu SHALL remain open

### Requirement 5: Event Handling

**User Story:** As a system, I want to ensure proper event handling so that mouse events are correctly captured and processed.

#### Acceptance Criteria

1. WHEN the submenu is displayed, THE submenu container SHALL have `pointer-events: auto` to capture mouse events
2. WHEN the user hovers over the parent menu item, THE `onMouseEnter` event SHALL trigger to show the submenu
3. WHEN the user leaves both the parent menu item and submenu, THE `onMouseLeave` event SHALL trigger to hide the submenu

## Implementation Notes

- The submenu is implemented using Tailwind CSS classes
- The parent menu item uses `onMouseEnter` and `onMouseLeave` events
- The submenu needs proper z-index stacking (higher than parent menu)
- The submenu container should wrap both parent and submenu to handle mouse events correctly
- Consider using a wrapper div with proper event handling to prevent premature closing
