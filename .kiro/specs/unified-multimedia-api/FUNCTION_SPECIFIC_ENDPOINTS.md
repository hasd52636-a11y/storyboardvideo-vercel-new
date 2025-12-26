# Function-Specific Endpoints Implementation

## Overview
Implemented support for configuring different endpoints for different functions within the same API provider. This allows users to use different API endpoints for different operations (e.g., Shenma API for images but a different Shenma video endpoint for video generation).

## Changes Made

### 1. Type System Updates (`services/multimedia/types.ts`)
- Updated `APIProviderConfig` interface to include optional `endpoints` field
- `endpoints` object supports function-specific endpoint configuration:
  - `textToImage`: Custom endpoint for text-to-image generation
  - `imageToImage`: Custom endpoint for image editing
  - `textGeneration`: Custom endpoint for text generation
  - `imageAnalysis`: Custom endpoint for image analysis
  - `videoGeneration`: Custom endpoint for video generation
  - `videoAnalysis`: Custom endpoint for video analysis

### 2. Adapter Updates
All adapters now support function-specific endpoints:

#### ShenmaAPIAdapter (`services/multimedia/adapters/ShenmaAPIAdapter.ts`)
- Added `endpoints` property to store function-specific endpoints
- Updated all methods to use function-specific endpoints:
  - `generateImage()` uses `endpoints.textToImage` or defaults to `/images/generations`
  - `editImage()` uses `endpoints.imageToImage` or defaults to `/images/edits`
  - `generateText()` uses `endpoints.textGeneration` or defaults to `/chat/completions`
  - `analyzeImage()` uses `endpoints.imageAnalysis` or defaults to `/chat/completions`
  - `generateVideo()` uses `endpoints.videoGeneration` or defaults to `/chat/completions`
  - `analyzeVideo()` uses `endpoints.videoAnalysis` or defaults to `/chat/completions`

#### OpenAIAdapter (`services/multimedia/adapters/OpenAIAdapter.ts`)
- Same endpoint support as ShenmaAPIAdapter
- All methods updated to use function-specific endpoints

#### ZhipuAdapter (`services/multimedia/adapters/ZhipuAdapter.ts`)
- Added endpoints support
- Updated `generateImage()` and `generateText()` methods

#### DayuyuVideoAdapter (`services/multimedia/adapters/DayuyuVideoAdapter.ts`)
- Added endpoints support
- Updated `generateVideo()` method

#### CustomAPIAdapter (`services/multimedia/adapters/CustomAPIAdapter.ts`)
- Updated to support both standard `endpoints` field and legacy `customConfig.endpoints`
- All methods now check standard endpoints first, then fall back to custom config

### 3. UI Updates (`components/multimedia/APIConfigPanel.tsx`)
- Added "Function-Specific Endpoints (Optional)" section in the Add API Provider form
- Users can now configure separate endpoints for:
  - Text-to-Image
  - Image-to-Image
  - Video Generation
  - Text Generation
- Endpoints are optional - users can leave them blank to use default endpoints
- Fixed endpoint object construction in `handleAddProvider()` to properly build the endpoints object

## Usage Example

### Configuration Flow
1. User selects a provider (e.g., "神马 API")
2. User enters API Key (required)
3. User optionally enters Base API URL
4. User optionally configures function-specific endpoints:
   - Text-to-Image Endpoint: `/v1/images/generations`
   - Image-to-Image Endpoint: `/v1/images/edits`
   - Video Generation Endpoint: `/v1/videos/generations` (different from default)
   - Text Generation Endpoint: (leave blank to use default)
5. Configuration is saved with endpoints object

### API Request Flow
When a request is made:
1. Adapter checks if function-specific endpoint is configured
2. If configured, uses that endpoint
3. If not configured, uses default endpoint for that function
4. Request is sent to the appropriate endpoint

## Benefits
- **Flexibility**: Users can mix and match different endpoints from the same provider
- **Scalability**: Supports different API versions or regional endpoints
- **Backward Compatibility**: Existing configurations without endpoints still work
- **Simplicity**: Optional configuration - users only set what they need

## Testing Recommendations
1. Test adding a provider with function-specific endpoints
2. Test that requests use the correct endpoints
3. Test that default endpoints are used when not configured
4. Test with different providers (Shenma, OpenAI, Zhipu, Dayuyu, Custom)
5. Test that image-to-image (图生图) works with custom endpoints

## Deployment Status
✅ Deployed to Vercel: https://sora.wboke.com
