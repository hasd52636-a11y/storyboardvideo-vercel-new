# App Title Display Fix - Requirements

## Problem Statement

The application title "分镜大师" (Storyboard Master) displayed in the top-left corner next to the logo is not visible to users. The title should be displayed prominently in the header but appears to be hidden or not rendering correctly.

## Root Cause Analysis

Possible causes:
1. Text color matches background color (invisible text)
2. Text is hidden behind other elements (z-index issue)
3. Text container has zero width or height (overflow hidden)
4. Font is not loading correctly
5. Text opacity is set to 0
6. Text is positioned off-screen

## Glossary

- **App Title**: The text "分镜大师" or "Storyboard Master" displayed next to the logo
- **Header**: The fixed top bar containing the logo and app title
- **Logo**: The purple gradient box with "L" icon
- **Subtitle**: The text "AI 智能分镜创作平台" or "AI-Powered Storyboarding" below the title

## Requirements

### Requirement 1: App Title Visibility

**User Story:** As a user, I want to see the application title "分镜大师" clearly displayed next to the logo in the header, so that I know what application I'm using.

#### Acceptance Criteria

1. WHEN the application loads, THE app title SHALL be visible in the header next to the logo
2. WHEN the app title is displayed, THE text color SHALL contrast with the background (white text on dark theme, dark text on light theme)
3. WHEN the app title is displayed, THE text SHALL not be hidden behind other elements
4. WHEN the app title is displayed, THE text SHALL be fully visible and not clipped or truncated

### Requirement 2: App Title Positioning

**User Story:** As a user, I want the app title to be properly positioned next to the logo for a professional appearance.

#### Acceptance Criteria

1. WHEN the app title is displayed, THE title SHALL be positioned to the right of the logo
2. WHEN the app title is displayed, THE title SHALL be vertically aligned with the logo
3. WHEN the app title is displayed, THE title and logo SHALL have appropriate spacing between them

### Requirement 3: Subtitle Visibility

**User Story:** As a user, I want to see the application subtitle below the main title for additional context.

#### Acceptance Criteria

1. WHEN the application loads, THE subtitle SHALL be visible below the app title
2. WHEN the subtitle is displayed, THE text color SHALL be purple (text-purple-500)
3. WHEN the subtitle is displayed, THE text SHALL be smaller than the main title (text-xs)

### Requirement 4: Responsive Display

**User Story:** As a user, I want the app title to display correctly on different screen sizes and themes.

#### Acceptance Criteria

1. WHEN the theme is dark, THE app title text color SHALL be white (text-white)
2. WHEN the theme is light, THE app title text color SHALL be dark (text-zinc-900)
3. WHEN the language is Chinese, THE app title SHALL display "分镜大师"
4. WHEN the language is English, THE app title SHALL display "Storyboard Master"

### Requirement 5: Font Rendering

**User Story:** As a system, I want to ensure the app title font renders correctly and is readable.

#### Acceptance Criteria

1. WHEN the app title is displayed, THE font weight SHALL be bold (font-black)
2. WHEN the app title is displayed, THE font size SHALL be large (text-lg)
3. WHEN the app title is displayed, THE letter spacing SHALL be tight (tracking-tight)
4. WHEN the app title is displayed, THE text SHALL be fully rendered without any visual artifacts

## Implementation Notes

- The app title is located in App.tsx around line 1636
- The title uses Tailwind CSS classes for styling
- The title should be visible in both dark and light themes
- The title should support both Chinese and English languages
- The subtitle should be displayed below the title with purple color
