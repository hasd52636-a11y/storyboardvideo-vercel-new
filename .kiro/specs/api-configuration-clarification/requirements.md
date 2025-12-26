# API Configuration Architecture Clarification

## Problem Statement

Users are confused about where to configure API keys because:
1. Old per-function panels (TextGenerationPanel, TextToImagePanel, etc.) show service provider dropdowns
2. New unified APIConfigPanel is where API keys should actually be configured
3. Documentation doesn't clearly explain this two-tier architecture
4. Users see "对话及图像API" and "视频生成API" tabs with different configurations and don't know which to use

## Current Architecture

### Tier 1: Unified API Configuration (NEW)
- **Location**: Configuration tab in MultimediaApp
- **Component**: APIConfigPanel.tsx
- **Purpose**: 
  - Add/configure API providers (Shenma, OpenAI, Zhipu, Dayuyu, Custom)
  - Store API keys and base URLs
  - Configure function-specific endpoints
  - Map functions to providers
- **Storage**: localStorage via APIConfigManager

### Tier 2: Per-Function Panels (OLD)
- **Location**: Individual tabs (Text-to-Image, Text Generation, etc.)
- **Components**: TextToImagePanel, TextGenerationPanel, VideoGenerationPanel, etc.
- **Current Issue**: Show service provider dropdowns that are confusing
- **Should Do**: Use the configuration from Tier 1, not ask for provider selection

## User Stories

### US1: User Configures API for First Time
**As a** new user
**I want to** configure my API keys in one place
**So that** I don't have to configure them multiple times

**Acceptance Criteria:**
- User goes to Configuration tab
- User sees "Add API Provider" section
- User selects provider (Shenma, OpenAI, etc.)
- User enters API key
- User optionally configures function-specific endpoints
- User clicks "Add Provider"
- Configuration is saved to localStorage
- User can see "Configured Providers" list

### US2: User Uses Function Panel
**As a** user with configured API
**I want to** use a function panel (e.g., Text-to-Image)
**So that** I can generate content without re-configuring

**Acceptance Criteria:**
- User goes to Text-to-Image tab
- User does NOT see service provider dropdown (removed or hidden)
- User enters prompt and parameters
- User clicks "Generate"
- System uses the provider configured in Configuration tab
- Generation works without additional configuration

### US3: User Understands the Architecture
**As a** user
**I want to** understand where to configure API keys
**So that** I don't waste time looking in the wrong place

**Acceptance Criteria:**
- Documentation clearly explains two-tier architecture
- First-time users are guided to Configuration tab
- Each function panel has a note: "Configured via Configuration tab"
- QUICK_REFERENCE.md has clear section on API configuration workflow

## Implementation Tasks

### Task 1: Update Per-Function Panels
- Remove service provider dropdown from TextToImagePanel
- Remove service provider dropdown from TextGenerationPanel
- Remove service provider dropdown from VideoGenerationPanel
- Remove service provider dropdown from ImageEditPanel
- Remove service provider dropdown from ImageAnalysisPanel
- Remove service provider dropdown from VideoAnalysisPanel
- Add note to each panel: "API configured in Configuration tab"

### Task 2: Update Documentation
- Add "API Configuration Workflow" section to QUICK_REFERENCE.md
- Add diagram showing two-tier architecture
- Add step-by-step guide for first-time setup
- Update existing API configuration section with clearer instructions

### Task 3: Add UI Guidance
- Add help text to APIConfigPanel explaining function-specific endpoints
- Add warning/info message if no providers are configured
- Add link from function panels to Configuration tab if needed

### Task 4: Test and Verify
- Verify localStorage persistence works
- Verify function panels use configured providers
- Verify first-time user experience is clear

## Success Criteria

1. ✅ Users can configure API keys in one place (Configuration tab)
2. ✅ Function panels don't show confusing service provider dropdowns
3. ✅ Documentation clearly explains the architecture
4. ✅ First-time users are guided to Configuration tab
5. ✅ All functions work with configured providers
6. ✅ No user confusion about where to configure API keys
