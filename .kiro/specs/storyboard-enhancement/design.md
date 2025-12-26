# Design Document: Storyboard Enhancement

## Overview

This design document outlines the architecture and implementation strategy for enhancing the storyboard creation tool with user-customizable symbol libraries and AI-powered quick storyboard generation features. The system will support four quick-action commands (Three-View, Multi-Grid, Style-Comparison, Narrative-Progression) with customizable prompt templates, persistent data storage, and graceful API fallback mechanisms.

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Symbol       │  │ Quick        │  │ Canvas/          │  │
│  │ Library UI   │  │ Storyboard   │  │ Generation UI    │  │
│  │ Module       │  │ Module       │  │                  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  API Layer (Services)                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Symbol       │  │ Quick        │  │ Image            │  │
│  │ Service      │  │ Storyboard   │  │ Generation       │  │
│  │              │  │ Service      │  │ Service          │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Data Persistence Layer                      │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Symbol       │  │ Quick        │  │ Generation       │  │
│  │ Repository   │  │ Storyboard   │  │ History          │  │
│  │              │  │ Repository   │  │ Repository       │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database (Prisma)                         │
├─────────────────────────────────────────────────────────────┤
│  Symbols | QuickStoryboardConfigs | GenerationHistory       │
└─────────────────────────────────────────────────────────────┘
```

### External API Integration

```
┌──────────────────────────────────────────────────────────┐
│         Image Generation Service (Adapter Pattern)        │
├──────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ Primary API     │  │ Fallback 1   │  │ Fallback 2 │  │
│  │ (Sora/Gemini)   │  │ (Nanobanana) │  │ (即梦)     │  │
│  └─────────────────┘  └──────────────┘  └────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Symbol Library Module

**Responsibilities:**
- Display user's custom symbols in a grid layout
- Handle symbol upload, edit, and delete operations
- Persist symbol data to database
- Support drag-to-canvas interactions

**Key Interfaces:**

```typescript
interface Symbol {
  id: string;
  userId: string;
  icon: string; // Base64 or URL
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SymbolService {
  uploadSymbol(userId: string, icon: File, name: string, description: string): Promise<Symbol>;
  getSymbols(userId: string): Promise<Symbol[]>;
  updateSymbol(symbolId: string, updates: Partial<Symbol>): Promise<Symbol>;
  deleteSymbol(symbolId: string): Promise<void>;
}
```

### 2. Quick Storyboard Module

**Responsibilities:**
- Display four quick-action buttons (Three-View, Multi-Grid, Style-Comparison, Narrative-Progression)
- Manage customizable prompt templates for each quick-action
- Handle user input for generation parameters (N, M values)
- Trigger image generation workflows

**Key Interfaces:**

```typescript
interface QuickStoryboardConfig {
  id: string;
  userId: string;
  name: string;
  description: string;
  templates: {
    threeView: string;
    multiGrid: string;
    styleComparison: string;
    narrativeProgression: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface QuickStoryboardService {
  createConfig(userId: string, config: Partial<QuickStoryboardConfig>): Promise<QuickStoryboardConfig>;
  getConfig(userId: string): Promise<QuickStoryboardConfig>;
  updateConfig(configId: string, updates: Partial<QuickStoryboardConfig>): Promise<QuickStoryboardConfig>;
  getDefaultTemplates(): Promise<Record<string, string>>;
}
```

### 3. Image Generation Service

**Responsibilities:**
- Construct prompts from templates and parameters
- Call primary image generation API
- Implement fallback logic for unsupported operations
- Persist generation history

**Key Interfaces:**

```typescript
interface GenerationRequest {
  type: 'three-view' | 'multi-grid' | 'style-comparison' | 'narrative-progression';
  template: string;
  parameters: Record<string, any>;
  subject?: string;
  currentImage?: string;
  script?: string;
}

interface GenerationResult {
  id: string;
  userId: string;
  type: string;
  prompt: string;
  images: string[]; // URLs or Base64
  metadata: Record<string, any>;
  createdAt: Date;
}

interface ImageGenerationService {
  generateImages(request: GenerationRequest): Promise<GenerationResult>;
  getGenerationHistory(userId: string): Promise<GenerationResult[]>;
}
```

### 4. Camera Angle Library and Multi-Perspective Generator

**Responsibilities:**
- Maintain a library of 12 standard camera angles
- Intelligently select N camera angles based on user input
- Ensure representation of key perspectives (close-up, medium, wide)
- Generate prompts that specify camera angles for each frame
- Calculate optimal grid dimensions for N frames

**Key Interfaces:**

```typescript
enum CameraAngle {
  EXTREME_CLOSE_UP = 'extreme_close_up',
  CLOSE_UP = 'close_up',
  MEDIUM_CLOSE_UP = 'medium_close_up',
  MEDIUM_SHOT = 'medium_shot',
  MEDIUM_WIDE = 'medium_wide',
  WIDE_SHOT = 'wide_shot',
  VERY_WIDE_SHOT = 'very_wide_shot',
  OVERHEAD_VIEW = 'overhead_view',
  LOW_ANGLE_VIEW = 'low_angle_view',
  THREE_QUARTER_VIEW = 'three_quarter_view',
  SIDE_PROFILE = 'side_profile',
  BIRDS_EYE_VIEW = 'birds_eye_view'
}

interface CameraAngleDefinition {
  angle: CameraAngle;
  name: string;
  description: string;
  category: 'close' | 'medium' | 'wide' | 'special';
  distance: number; // relative scale 1-10
  angleInDegrees: number; // 0-360
  promptKeywords: string[];
}

interface MultiGridRequest {
  frameCount: number;
  template: string;
  subject: string;
  context?: string;
}

interface MultiGridResult {
  prompt: string;
  parameters: Record<string, string>;
  gridDimensions: string;
  selectedAngles: CameraAngle[];
  angleDescriptions: string[];
}

interface CameraAngleLibraryService {
  selectCameraAngles(frameCount: number): CameraAngle[];
  getAngleDefinition(angle: CameraAngle): CameraAngleDefinition;
  generatePrompt(request: MultiGridRequest): MultiGridResult;
  calculateGridDimensions(frameCount: number): string;
}
```

**Camera Angle Library Details:**

The system maintains 12 standard camera angles organized by distance category:

- **Close Category** (3 angles): 
  - Extreme Close-Up: Macro detail focus, 1-2 units distance
  - Close-Up: Facial/detail focus, 2-3 units distance
  - Medium Close-Up: Upper body/object focus, 3-4 units distance

- **Medium Category** (4 angles):
  - Medium Shot: Waist-up framing, 4-5 units distance
  - Medium Wide: Full body/object, 5-6 units distance
  - Wide Shot: Full scene with context, 6-8 units distance
  - Very Wide Shot: Landscape/establishing, 8-10 units distance

- **Special Category** (5 angles):
  - Overhead View: Bird's eye perspective, 90° angle
  - Low Angle View: Dramatic upward perspective, -45° angle
  - Three-Quarter View: 45° rotated perspective
  - Side Profile: 90° lateral view
  - Bird's Eye View: Extreme overhead, 85-90° angle

**Intelligent Selection Algorithm:**

When selecting N camera angles:
1. Always include at least 1 close-up angle (from Close category)
2. Always include at least 1 medium shot (from Medium category)
3. Always include at least 1 wide shot (from Medium or Special category)
4. Randomly select remaining angles to reach N total
5. Ensure no duplicate angles in the selection
6. Maintain visual variety by distributing angles across categories

### 5. Prompt Template Engine

**Responsibilities:**
- Parse and validate prompt templates with placeholders
- Substitute placeholders with actual values
- Support custom template editing

**Key Interfaces:**

```typescript
interface PromptTemplate {
  template: string;
  requiredPlaceholders: string[];
  defaultPlaceholders: Record<string, string>;
}

interface PromptEngine {
  parseTemplate(template: string): PromptTemplate;
  validateTemplate(template: string, requiredPlaceholders: string[]): boolean;
  renderPrompt(template: string, values: Record<string, string>): string;
}
```

## Data Models

### Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  symbols   Symbol[]
  quickStoryboardConfigs QuickStoryboardConfig[]
  generationHistory GenerationHistory[]
}

model Symbol {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  icon        String   // Base64 or URL
  name        String
  description String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([userId])
}

model QuickStoryboardConfig {
  id                    String   @id @default(cuid())
  userId                String
  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name                  String
  description           String
  threeViewTemplate     String   @default("Generate three orthographic views (front, side, top) of {subject}")
  multiGridTemplate     String   @default("Generate a {gridDimensions} grid storyboard with {frameCount} frames")
  styleComparisonTemplate String @default("Generate {subject} in 5 different artistic styles: {styles}")
  narrativeProgressionTemplate String @default("Generate {frameCount} sequential frames showing narrative progression from: {currentContext}")
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@index([userId])
}

model GenerationHistory {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      String   // 'three-view', 'multi-grid', 'style-comparison', 'narrative-progression'
  prompt    String
  images    String[] // URLs or Base64
  metadata  Json     // Additional metadata like grid dimensions, styles used, etc.
  createdAt DateTime @default(now())
  
  @@index([userId])
  @@index([type])
}
```

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Symbol Persistence Round-Trip
*For any* symbol with valid icon, name, and description, uploading it and then retrieving it from the database should return an equivalent symbol with all fields intact.
**Validates: Requirements 1.4, 8.1**

### Property 2: Symbol Validation
*For any* symbol upload attempt, if the name or description is empty or missing, the system should reject the upload and not persist the symbol.
**Validates: Requirements 1.3**

### Property 3: Symbol Deletion Completeness
*For any* symbol that exists in the database, after deletion, querying for that symbol should return no results.
**Validates: Requirements 1.7**

### Property 4: Quick Storyboard Configuration Persistence
*For any* Quick Storyboard configuration with valid templates and metadata, saving it and then retrieving it should return an equivalent configuration.
**Validates: Requirements 2.4, 8.2**

### Property 5: Default Templates Initialization
*For any* new Quick Storyboard configuration, all four quick-action templates should be initialized with default values.
**Validates: Requirements 2.6**

### Property 6: Template Placeholder Validation
*For any* prompt template, if it's missing required placeholders (e.g., {subject}, {frameCount}), the system should reject the template modification.
**Validates: Requirements 9.3**

### Property 7: Template Substitution Correctness
*For any* prompt template with placeholders and a set of parameter values, rendering the template should replace all placeholders with their corresponding values.
**Validates: Requirements 9.2**

### Property 8: Three-View Generation Trigger
*For any* symbol dropped on the canvas, the system should trigger the Three-View generation workflow with the symbol's data.
**Validates: Requirements 3.2, 3.3**

### Property 9: Camera Angle Selection with Mandatory Representation
*For any* valid N value (2-12), the system should select N distinct camera angles that include at least one close-up angle, at least one medium shot, and at least one wide shot, ensuring comprehensive perspective coverage.
**Validates: Requirements 4.3, 4.4**

### Property 10: Multi-Grid Dimension Calculation
*For any* valid N value (2-12), the system should calculate optimal grid dimensions that result in exactly N total frames.
**Validates: Requirements 4.5**

### Property 11: Style Diversity in Comparison
*For any* Style-Comparison generation, the system should select 5 distinct styles with no duplicates.
**Validates: Requirements 5.1, 5.6**

### Property 12: Narrative Progression Sequence Order
*For any* Narrative-Progression generation with N frames, the returned images should be displayed in sequential order matching the narrative flow.
**Validates: Requirements 6.6**

### Property 13: Generation History Persistence
*For any* generated image with metadata, persisting it and then retrieving it from generation history should return equivalent data.
**Validates: Requirements 8.3, 8.5**

### Property 14: API Fallback Activation
*For any* image generation request where the primary API fails or doesn't support the operation type, the system should attempt fallback APIs.
**Validates: Requirements 7.2**

### Property 15: Error Message on Complete Failure
*For any* image generation request where all APIs fail, the system should return a descriptive error message to the user.
**Validates: Requirements 7.5**

### Property 16: Database Query Performance
*For any* typical database query (symbol retrieval, configuration loading, history retrieval), the response time should be within 500ms.
**Validates: Requirements 8.6**

### Property 17: Custom Template Usage Priority
*For any* quick-action trigger, if a custom template exists, the system should use it; otherwise, it should use the default template.
**Validates: Requirements 9.5**

### Property 18: Template Reset Restoration
*For any* template reset operation, the system should restore the default template for that quick-action.
**Validates: Requirements 9.6**

## Error Handling

### Symbol Management Errors
- **Invalid Icon Format**: Return error if icon is not a valid image format
- **Missing Metadata**: Return error if name or description is empty
- **Duplicate Symbol Names**: Warn user but allow (names don't need to be unique)
- **Database Persistence Failure**: Log error and display user-friendly message

### Quick Storyboard Errors
- **Invalid Template Syntax**: Validate placeholder syntax and reject invalid templates
- **Missing Required Placeholders**: Prevent saving templates without required placeholders
- **Configuration Load Failure**: Display default configuration if load fails

### Image Generation Errors
- **Invalid Input Parameters**: Validate N (2-12) and other parameters before API call
- **Primary API Failure**: Automatically attempt fallback APIs
- **All APIs Fail**: Return descriptive error message with retry option
- **Timeout**: Implement timeout handling with user notification

### Data Persistence Errors
- **Database Connection Failure**: Implement retry logic with exponential backoff
- **Data Corruption**: Implement validation on retrieval and log anomalies
- **Concurrent Modifications**: Implement optimistic locking or conflict resolution

## Testing Strategy

### Unit Testing

Unit tests will verify specific examples and edge cases:

1. **Symbol Management**
   - Valid symbol upload with all fields
   - Symbol upload with missing name/description
   - Symbol edit with partial updates
   - Symbol deletion and non-existence verification
   - Symbol retrieval for specific user

2. **Quick Storyboard Configuration**
   - Configuration creation with default templates
   - Template modification with valid placeholders
   - Template modification with invalid placeholders
   - Configuration persistence and retrieval
   - Template reset to defaults

3. **Prompt Template Engine**
   - Template parsing with valid placeholders
   - Template rendering with parameter substitution
   - Placeholder validation for required fields
   - Edge cases: empty templates, special characters

4. **Camera Angle Library and Multi-Perspective Generation**
   - Camera angle selection for all valid N values (2-12)
   - Verification of mandatory angle representation (close-up, medium, wide)
   - No duplicate angles in selection
   - Grid dimension calculation for all N values
   - Prompt generation with camera angle specifications
   - Angle label generation for each frame

5. **Data Persistence**
   - Database operations complete within 500ms
   - Concurrent read/write operations
   - Data integrity after persistence

### Property-Based Testing

Property-based tests will verify universal properties across many generated inputs:

1. **Symbol Persistence Round-Trip** (Property 1)
   - Generate random symbols with valid data
   - Upload and retrieve
   - Verify all fields match

2. **Symbol Validation** (Property 2)
   - Generate symbols with empty/missing fields
   - Verify rejection

3. **Template Placeholder Validation** (Property 6)
   - Generate templates with various placeholder combinations
   - Verify validation logic

4. **Camera Angle Selection** (Property 9)
   - For all N in [2, 12], verify selection includes at least 1 close-up, 1 medium, 1 wide
   - Verify no duplicate angles selected
   - Verify N distinct angles returned

5. **Multi-Grid Dimension Calculation** (Property 10)
   - For all N in [2, 12], verify grid dimensions result in exactly N frames
   - Test various grid configurations (2x1, 2x2, 3x2, 3x3, 3x4, 4x3)

6. **Style Diversity** (Property 11)
   - Generate multiple Style-Comparison requests
   - Verify 5 distinct styles selected each time

7. **Generation History Persistence** (Property 13)
   - Generate random generation records
   - Persist and retrieve
   - Verify equivalence

8. **Database Query Performance** (Property 16)
   - Execute typical queries with varying data sizes
   - Measure response times
   - Verify all complete within 500ms

### Test Configuration

- **Minimum iterations per property test**: 100
- **Test framework**: Vitest with fast-check for property-based testing
- **Coverage target**: >80% for core logic, >60% for UI components
- **CI/CD integration**: Tests run on every commit

