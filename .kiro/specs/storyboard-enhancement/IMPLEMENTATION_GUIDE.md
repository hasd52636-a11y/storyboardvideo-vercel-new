# Storyboard Enhancement - Implementation Guide

## Overview

The Storyboard Enhancement feature has been fully implemented with all required components, services, and API routes. This guide explains how to integrate and use the feature in your application.

## Project Structure

### Services Layer (`services/`)

Core business logic for all storyboard operations:

- **SymbolService.ts** - Manages user-customizable symbols (CRUD operations)
- **QuickStoryboardService.ts** - Manages quick storyboard configurations and templates
- **PromptEngine.ts** - Handles template parsing, validation, and rendering
- **ImageGenerationService.ts** - Orchestrates image generation requests
- **GenerationHistoryService.ts** - Manages generation history and retrieval

### Generators (`services/generators/`)

Specialized generators for each quick-action type:

- **ThreeViewGenerator.ts** - Generates three-view (orthographic) prompts
- **MultiGridGenerator.ts** - Generates N×N grid layouts
- **StyleComparisonGenerator.ts** - Generates style comparison prompts
- **NarrativeProgressionGenerator.ts** - Generates narrative progression prompts

### API Layer (`services/api/`)

API integration and error handling:

- **ImageGenerationAdapter.ts** - Adapter pattern for multiple image generation APIs with fallback support
- **ErrorHandler.ts** - Centralized error handling with retry logic

### Components (`components/`)

React UI components:

- **SymbolLibrary.tsx** - Grid display of user symbols with upload/edit/delete
- **QuickStoryboard.tsx** - Four quick-action buttons with template editing
- **GenerationCanvas.tsx** - Displays generated images in various layouts
- **GenerationHistory.tsx** - Shows previous generations with filtering
- **CanvasDropZone.tsx** - Drag-and-drop zone for symbol-to-canvas interaction
- **StoryboardEnhancementApp.tsx** - Main integration component

### API Routes (`api/`)

Backend endpoints:

- **api/symbols.ts** - Symbol CRUD operations
- **api/quick-storyboard.ts** - Quick storyboard configuration management
- **api/quick-storyboard/[id]/reset-template.ts** - Template reset endpoint
- **api/generate.ts** - Image generation requests
- **api/generation-history.ts** - Generation history retrieval and management

### Database (`prisma/`)

Prisma schema includes three new models:

- **Symbol** - User-customizable symbols
- **QuickStoryboardConfig** - Quick storyboard configurations
- **GenerationHistory** - Generation history records

## Integration Steps

### 1. Database Setup

Ensure your Prisma schema includes the new models:

```bash
# Run migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate
```

### 2. Environment Configuration

Set up required environment variables:

```env
# Image Generation APIs
GEMINI_API_KEY=your_gemini_key
NANOBANANA_API_KEY=your_nanobanana_key
JIMENG_API_KEY=your_jimeng_key

# Database
DATABASE_URL=your_database_url
```

### 3. Component Integration

Import and use the main component in your app:

```typescript
import StoryboardEnhancementApp from '@/components/StoryboardEnhancementApp';

export default function Page() {
  const userId = 1; // Get from auth context
  return <StoryboardEnhancementApp userId={userId} />;
}
```

### 4. API Route Setup

Ensure all API routes are properly configured in your Next.js app:

- Routes should be in `pages/api/` or `app/api/` depending on your Next.js version
- All routes handle authentication and authorization
- Error responses follow the standard format

## Usage Workflows

### Workflow 1: Symbol Management

1. User uploads a symbol with icon, name, and description
2. Symbol is persisted to database
3. Symbol appears in Symbol Library grid
4. User can edit or delete symbol

### Workflow 2: Quick Storyboard Generation

1. User accesses Quick Storyboard module
2. User can edit prompt templates for each quick-action
3. User clicks a quick-action button
4. System prompts for parameters (if needed)
5. Generation is triggered via API
6. Results are displayed on canvas

### Workflow 3: Symbol Drag-to-Canvas

1. User drags symbol from Symbol Library
2. User drops symbol on Canvas Drop Zone
3. Three-View generation is automatically triggered
4. Results are displayed on canvas

### Workflow 4: Generation History

1. User views Generation History tab
2. User can filter by generation type
3. User can view, reuse, or delete previous generations
4. Pagination supports large history

## API Endpoints

### Symbols

```
GET    /api/symbols?userId={id}              - Get all symbols
GET    /api/symbols?userId={id}&id={id}      - Get single symbol
POST   /api/symbols                           - Create symbol
PUT    /api/symbols/{id}                      - Update symbol
DELETE /api/symbols/{id}                      - Delete symbol
```

### Quick Storyboard

```
GET    /api/quick-storyboard?userId={id}     - Get configuration
POST   /api/quick-storyboard                  - Create configuration
PUT    /api/quick-storyboard/{id}             - Update configuration
POST   /api/quick-storyboard/{id}/reset-template - Reset template
```

### Image Generation

```
POST   /api/generate                          - Generate images
GET    /api/generation-history?userId={id}   - Get history
DELETE /api/generation-history/{id}           - Delete generation
```

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- SymbolService.test.ts

# Run with coverage
npm test -- --coverage
```

### Property-Based Tests

The implementation includes property-based tests using fast-check:

- Symbol persistence round-trip
- Symbol validation
- Template placeholder validation
- Multi-grid dimension calculation
- Style diversity in comparison
- Generation history persistence
- Database query performance

## Performance Considerations

### Database Optimization

- Indexes on `userId` for all models
- Indexes on `type` for GenerationHistory
- Query caching for frequently accessed data
- Pagination for large result sets (default 20 items per page)

### API Optimization

- Retry logic with exponential backoff
- Timeout handling (30 seconds default)
- Fallback to alternative APIs
- Error recovery mechanisms

### Frontend Optimization

- Lazy loading of images
- Pagination for history
- Debounced template editing
- Optimistic UI updates

## Error Handling

All errors follow a standard format:

```typescript
{
  success: false,
  error: "User-friendly error message",
  code: "ERROR_CODE",
  retryable: boolean,
  details?: Record<string, any>
}
```

Common error codes:

- `INVALID_INPUT` - Invalid input parameters
- `MISSING_REQUIRED_FIELD` - Required field missing
- `INVALID_PARAMETER` - Parameter out of range
- `API_UNAVAILABLE` - API not available
- `API_TIMEOUT` - API request timeout
- `DATABASE_ERROR` - Database operation failed
- `NOT_FOUND` - Resource not found
- `UNAUTHORIZED` - User not authorized
- `GENERATION_FAILED` - Image generation failed

## Customization

### Adding New Quick-Actions

1. Create a new generator in `services/generators/`
2. Add template to QuickStoryboardConfig model
3. Add generation logic to ImageGenerationService
4. Add UI button to QuickStoryboard component
5. Add API endpoint if needed

### Adding New Image Generation APIs

1. Create new adapter class implementing `IImageGenerationAdapter`
2. Add to APIManager in ImageGenerationAdapter.ts
3. Configure API key in environment variables
4. Test fallback logic

### Customizing Templates

Users can customize templates through the UI:

- Edit template text
- Add/remove placeholders
- Reset to defaults
- Validate placeholder syntax

## Troubleshooting

### Images Not Loading

- Check CORS configuration
- Verify image URLs are accessible
- Check browser console for errors
- Try alternative image generation API

### Generation Timeout

- Increase timeout value in ImageGenerationAdapter
- Check API status
- Verify network connectivity
- Try fallback API

### Database Errors

- Verify DATABASE_URL is correct
- Check database connection
- Run migrations: `npm run prisma:migrate`
- Check Prisma logs

## Future Enhancements

Potential improvements for future versions:

1. **Batch Generation** - Generate multiple variations at once
2. **Template Library** - Share templates between users
3. **Advanced Filtering** - Filter history by date range, style, etc.
4. **Export Options** - Export as PDF, video, or other formats
5. **Collaboration** - Share generations with team members
6. **Analytics** - Track generation statistics and trends
7. **Custom Styles** - Allow users to define custom artistic styles
8. **AI Refinement** - Iterative refinement of generated images

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review error messages and logs
3. Check API documentation
4. Review test cases for usage examples
5. Contact development team

## License

This implementation is part of the Storyboard Enhancement feature and follows the project's license.
