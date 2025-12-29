# App Title Display Fix - Design

## Overview

The application title "分镜大师" (Storyboard Master) should be prominently displayed in the header next to the logo. This design document addresses the visibility and rendering issues that prevent the title from being displayed correctly.

## Architecture

### Current Implementation
```
Header (fixed top-0 left-0 right-0 h-20)
  ├── Logo Container (w-14 h-14)
  │   └── Logo Icon (L)
  └── Title Container (flex flex-col)
      ├── App Title (text-lg font-black)
      └── Subtitle (text-xs font-bold text-purple-500)
```

### Expected Display
```
┌─────────────────────────────────────────┐
│ [L] 分镜大师                             │
│     AI 智能分镜创作平台                  │
└─────────────────────────────────────────┘
```

## Components and Interfaces

### Header Component (App.tsx)

**Current Implementation:**
```jsx
<div className="fixed top-0 left-0 right-0 h-20 px-8 flex items-center justify-between z-40 no-print pointer-events-none">
  <div className="flex items-center gap-4 pointer-events-auto">
    <div className="w-14 h-14 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
      <span className="text-white font-black text-3xl">L</span>
    </div>
    <div className="flex flex-col">
      <span className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
        {lang === 'zh' ? '分镜大师' : 'Storyboard Master'}
      </span>
      <span className="text-xs font-bold text-purple-500 uppercase tracking-widest">
        {lang === 'zh' ? 'AI 智能分镜创作平台' : 'AI-Powered Storyboarding'}
      </span>
    </div>
  </div>
</div>
```

**Potential Issues:**
1. `pointer-events-none` on parent might affect child elements
2. Text color might not have sufficient contrast
3. Container might have overflow hidden
4. Z-index might be too low
5. Font might not be loading

## Data Models

### Theme Configuration
```typescript
interface ThemeConfig {
  dark: {
    titleColor: 'text-white';
    subtitleColor: 'text-purple-500';
  };
  light: {
    titleColor: 'text-zinc-900';
    subtitleColor: 'text-purple-500';
  };
}
```

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: App Title Is Visible

**For any** application load with any theme (dark or light), the app title text SHALL be visible and readable in the header.

**Validates: Requirements 1.1, 1.4**

### Property 2: Title Color Contrasts with Background

**For any** theme setting, the app title text color SHALL have sufficient contrast with the background to be readable.

**Validates: Requirement 1.2**

### Property 3: Title Is Not Hidden

**For any** header display, the app title SHALL not be hidden behind other elements or clipped by container overflow.

**Validates: Requirement 1.3**

### Property 4: Title Positioning Is Correct

**For any** header display, the app title SHALL be positioned to the right of the logo with appropriate spacing.

**Validates: Requirements 2.1, 2.2, 2.3**

### Property 5: Subtitle Is Visible

**For any** application load, the subtitle SHALL be visible below the app title with purple color.

**Validates: Requirement 3.1, 3.2**

### Property 6: Language Support

**For any** language setting, the app title SHALL display the correct text (Chinese or English).

**Validates: Requirement 4.3, 4.4**

### Property 7: Theme Support

**For any** theme setting, the app title text color SHALL match the theme (white for dark, dark for light).

**Validates: Requirement 4.1, 4.2**

### Property 8: Font Rendering

**For any** app title display, the font SHALL render correctly with proper weight, size, and spacing.

**Validates: Requirement 5.1, 5.2, 5.3, 5.4**

## Error Handling

### Title Not Visible
- **Trigger**: Text color matches background or text is hidden
- **Response**: Verify text color CSS classes are correct
- **Verification**: Use browser DevTools to inspect element styles

### Title Clipped
- **Trigger**: Container has overflow hidden or insufficient width
- **Response**: Ensure container has proper width and overflow visible
- **Verification**: Check container dimensions in DevTools

### Font Not Loading
- **Trigger**: Font file fails to load
- **Response**: Verify font is available in Tailwind CSS
- **Verification**: Check browser console for font loading errors

## Testing Strategy

### Unit Tests
- Test that app title renders with correct text
- Test that app title has correct color for each theme
- Test that app title displays correct language
- Test that subtitle renders below title
- Test that title is not hidden or clipped

### Property-Based Tests
- **Property 1**: For any theme, verify app title is visible
- **Property 2**: For any theme, verify text color has sufficient contrast
- **Property 3**: For any header display, verify title is not hidden
- **Property 4**: For any header display, verify title positioning is correct
- **Property 5**: For any app load, verify subtitle is visible
- **Property 6**: For any language, verify correct text is displayed
- **Property 7**: For any theme, verify correct text color is applied
- **Property 8**: For any display, verify font renders correctly

### Test Configuration
- Minimum 100 iterations per property test
- Test with both dark and light themes
- Test with both Chinese and English languages
- Test on different screen sizes
- Test with different font sizes

## Implementation Notes

1. **Ensure pointer-events-auto**: The title container should have `pointer-events-auto` to ensure it's interactive
2. **Verify text color**: Ensure text color CSS classes are applied correctly
3. **Check overflow**: Ensure container doesn't have `overflow-hidden` that clips text
4. **Verify z-index**: Ensure z-index is high enough to be visible
5. **Test font loading**: Verify Tailwind CSS fonts are loading correctly
6. **Check contrast**: Ensure text color has sufficient contrast with background

## CSS Classes to Verify

- `text-lg` - Font size
- `font-black` - Font weight
- `tracking-tight` - Letter spacing
- `text-white` (dark theme) - Text color
- `text-zinc-900` (light theme) - Text color
- `text-purple-500` - Subtitle color
- `flex flex-col` - Layout
- `gap-4` - Spacing between logo and title
