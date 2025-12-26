# New Features: 一键运镜 & 一键运动

## Overview

Added two new major features to the Storyboard Enhancement system:

1. **一键运镜 (Camera Motion Library)** - Renamed from Symbol Library
2. **一键运动 (Action Motion)** - New feature with 4 predefined motion actions

## Feature 1: 一键运镜 (Camera Motion Library)

### Description
The original Symbol Library has been renamed to "一键运镜" (Camera Motion Library) to better reflect its purpose of managing camera motion symbols.

### Components
- **CameraMotionLibrary.tsx** - Main UI component
- **SymbolService.ts** - Backend service (unchanged)
- **api/symbols.ts** - API routes (unchanged)

### Functionality
- Upload custom camera motion symbols with icon, name, and description
- Display symbols in a grid layout
- Edit and delete symbols
- Drag-and-drop symbols to canvas
- Trigger three-view generation on drop

### Usage
```typescript
import CameraMotionLibrary from '@/components/CameraMotionLibrary';

<CameraMotionLibrary
  userId={userId}
  onSymbolDrop={handleSymbolDrop}
  onSymbolSelect={handleSymbolSelect}
/>
```

---

## Feature 2: 一键运动 (Action Motion)

### Description
New feature that provides four predefined motion actions for quick generation:
- **前进 (Forward)** - Smooth forward motion
- **旋转 (Rotate)** - 360-degree rotation
- **跳跃 (Jump)** - Jumping motion
- **飞行 (Fly)** - Flying motion

### Architecture

#### Database Models
```prisma
model ActionSymbol {
  id          String   @id @default(cuid())
  userId      Int
  name        String   // 'forward', 'rotate', 'jump', 'fly'
  icon        String   // Icon/emoji
  description String
  prompt      String   // Prompt template
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ActionConfiguration {
  id                    String   @id @default(cuid())
  userId                Int
  name                  String
  description           String
  forwardTemplate       String   // Customizable template
  rotateTemplate        String
  jumpTemplate          String
  flyTemplate           String
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}
```

#### Services
- **ActionSymbolService.ts** - Manages predefined action symbols
- **ActionConfigurationService.ts** - Manages user configurations and templates
- **ActionMotionGenerator.ts** - Generates prompts for motion actions

#### Components
- **ActionMotion.tsx** - Main UI component with 4 action buttons

#### API Routes
- **api/action-configuration.ts** - Configuration CRUD operations
- **api/action-configuration/[id]/reset-template.ts** - Template reset

### Default Actions

Each action comes with default settings:

```typescript
{
  forward: {
    icon: '➡️',
    description: 'Smooth forward motion',
    prompt: 'Generate a smooth forward motion of {subject}, moving steadily from left to right'
  },
  rotate: {
    icon: '🔄',
    description: '360-degree rotation',
    prompt: 'Generate a 360-degree rotation of {subject}, rotating smoothly around its center'
  },
  jump: {
    icon: '⬆️',
    description: 'Jumping motion',
    prompt: 'Generate a jumping motion of {subject}, bouncing up and down with energy'
  },
  fly: {
    icon: '✈️',
    description: 'Flying motion',
    prompt: 'Generate a flying motion of {subject}, soaring through the air gracefully'
  }
}
```

### Customization

Users can customize templates for each action:

1. Click "Edit" button on any action
2. Modify the template text
3. Use placeholders: `{subject}`, `{action}`, `{context}`
4. Save or reset to defaults

### Usage

```typescript
import ActionMotion from '@/components/ActionMotion';

<ActionMotion
  userId={userId}
  onGenerate={handleGeneration}
  onError={handleError}
/>
```

### Workflow

1. User selects an action (Forward, Rotate, Jump, or Fly)
2. System prompts for subject (e.g., "a red car")
3. System retrieves the action template from configuration
4. System generates prompt with subject substitution
5. System calls image generation API
6. Results are displayed on canvas

---

## Integration with Main App

### Updated Tab Navigation

The main StoryboardEnhancementApp now includes 5 tabs:

1. **一键运镜** - Camera Motion Library
2. **一键运动** - Action Motion
3. **Quick Storyboard** - Original quick storyboard feature
4. **Canvas** - Generation display
5. **History** - Generation history

### Updated Component

```typescript
<StoryboardEnhancementApp userId={userId} />
```

The component now handles both camera motion and action motion generation types.

---

## Database Migration

### New Tables

```sql
CREATE TABLE action_symbols (
  id VARCHAR(255) PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  prompt TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

CREATE TABLE action_configurations (
  id VARCHAR(255) PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  forward_template TEXT NOT NULL,
  rotate_template TEXT NOT NULL,
  jump_template TEXT NOT NULL,
  fly_template TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);
```

### Migration Steps

```bash
# Update Prisma schema
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate
```

---

## API Endpoints

### Action Configuration

```
GET    /api/action-configuration?userId={id}     - Get configuration
POST   /api/action-configuration                  - Create configuration
PUT    /api/action-configuration/{id}             - Update configuration
POST   /api/action-configuration/{id}/reset-template - Reset template
```

### Request/Response Examples

#### Get Configuration
```bash
GET /api/action-configuration?userId=1

Response:
{
  "success": true,
  "data": {
    "config": {
      "id": "config-123",
      "userId": 1,
      "name": "Default Configuration",
      "description": "Default action configuration",
      "forwardTemplate": "Generate a smooth forward motion of {subject}",
      "rotateTemplate": "Generate a 360-degree rotation of {subject}",
      "jumpTemplate": "Generate a jumping motion of {subject}",
      "flyTemplate": "Generate a flying motion of {subject}",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### Update Template
```bash
PUT /api/action-configuration/config-123

Body:
{
  "userId": 1,
  "forwardTemplate": "Generate a fast forward motion of {subject}"
}

Response:
{
  "success": true,
  "data": {
    "config": { ... }
  }
}
```

#### Reset Template
```bash
POST /api/action-configuration/config-123/reset-template

Body:
{
  "userId": 1,
  "templateType": "forward"
}

Response:
{
  "success": true,
  "data": {
    "config": { ... }
  }
}
```

---

## Testing

### Unit Tests

Tests for new services:
- ActionSymbolService
- ActionConfigurationService
- ActionMotionGenerator

### Property-Based Tests

New properties to validate:
- Action symbol initialization
- Template customization
- Motion generation correctness

### Component Tests

Tests for:
- ActionMotion component rendering
- Action button interactions
- Template editing UI
- Subject input dialog

---

## Performance Considerations

### Database Optimization
- Indexes on `userId` for both new tables
- Efficient template queries
- Pagination support for action history

### API Optimization
- Caching of action configurations
- Lazy loading of templates
- Efficient template substitution

### Frontend Optimization
- Memoized action buttons
- Debounced template editing
- Optimistic UI updates

---

## Error Handling

All new endpoints follow the standard error format:

```typescript
{
  success: false,
  error: "User-friendly error message",
  code: "ERROR_CODE",
  retryable: boolean,
  details?: Record<string, any>
}
```

Common errors:
- `MISSING_REQUIRED_FIELD` - Required field missing
- `INVALID_PARAMETER` - Invalid action type or template
- `NOT_FOUND` - Configuration not found
- `UNAUTHORIZED` - User not authorized

---

## Future Enhancements

Potential improvements:
1. **Action Presets** - Save and share action configurations
2. **Action Combinations** - Chain multiple actions together
3. **Advanced Timing** - Control motion duration and speed
4. **Motion Curves** - Define acceleration/deceleration
5. **Action Library** - Community-contributed actions
6. **Batch Actions** - Apply actions to multiple subjects

---

## Migration Guide

### For Existing Users

1. Symbol Library is now called "一键运镜"
2. All existing symbols are preserved
3. New "一键运动" tab is available
4. Default action configurations are auto-created

### For New Users

1. Start with "一键运镜" to upload camera motions
2. Use "一键运动" for predefined motion actions
3. Customize templates as needed
4. Generate and save results

---

## Support

For issues or questions about new features:
1. Check the API documentation
2. Review component examples
3. Check test cases for usage patterns
4. Contact development team
