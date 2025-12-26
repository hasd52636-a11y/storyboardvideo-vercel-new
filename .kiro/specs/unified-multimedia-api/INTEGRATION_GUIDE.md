# Integration Guide: Adding Multimedia UI to Main App

## Quick Start

### 1. Import MultimediaApp Component

In your main `App.tsx`:

```typescript
import { MultimediaApp } from '@/components/multimedia';
```

### 2. Add Route/Navigation

Add a new route or navigation item to access the multimedia studio:

```typescript
// In your routing configuration
{
  path: '/multimedia',
  component: MultimediaApp,
  label: 'Multimedia Studio'
}
```

### 3. Add Navigation Link

Add a link in your navigation menu:

```typescript
<Link href="/multimedia" className="nav-link">
  🎬 Multimedia Studio
</Link>
```

## Full Integration Example

### Option A: Separate Route

```typescript
// App.tsx or your routing file
import { MultimediaApp } from '@/components/multimedia';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/multimedia" element={<MultimediaApp />} />
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

### Option B: Tab in Existing Page

```typescript
import { MultimediaApp } from '@/components/multimedia';

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState('storyboard');

  return (
    <div>
      <div className="tabs">
        <button onClick={() => setActiveTab('storyboard')}>Storyboard</button>
        <button onClick={() => setActiveTab('multimedia')}>Multimedia</button>
      </div>
      
      {activeTab === 'storyboard' && <StoryboardApp />}
      {activeTab === 'multimedia' && <MultimediaApp />}
    </div>
  );
}
```

### Option C: Modal/Dialog

```typescript
import { MultimediaApp } from '@/components/multimedia';
import { Dialog } from '@/components/ui/Dialog';

export default function App() {
  const [showMultimedia, setShowMultimedia] = useState(false);

  return (
    <>
      <button onClick={() => setShowMultimedia(true)}>
        Open Multimedia Studio
      </button>
      
      <Dialog open={showMultimedia} onClose={() => setShowMultimedia(false)}>
        <MultimediaApp />
      </Dialog>
    </>
  );
}
```

## Configuration

### Pass Initial Configuration

```typescript
import { MultiMediaConfig } from '@/services/multimedia/types';

const initialConfig: MultiMediaConfig = {
  providers: {
    textToImage: 'shenma',
    imageToImage: 'openai',
    textGeneration: 'zhipu',
    imageAnalysis: 'openai',
    videoGeneration: 'shenma',
    videoAnalysis: 'shenma',
  },
  configs: {
    shenma: { apiKey: process.env.REACT_APP_SHENMA_KEY },
    openai: { apiKey: process.env.REACT_APP_OPENAI_KEY },
    zhipu: { apiKey: process.env.REACT_APP_ZHIPU_KEY },
  },
};

export default function App() {
  return <MultimediaApp initialConfig={initialConfig} />;
}
```

## Styling Integration

### Tailwind CSS (Already Used)

The components use Tailwind CSS classes. Ensure your project has Tailwind configured:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Custom Theme

To customize colors, modify `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',  // Blue
        success: '#10B981',  // Green
        error: '#EF4444',    // Red
      },
    },
  },
};
```

### CSS Modules (Alternative)

If using CSS modules, create `MultimediaApp.module.css`:

```css
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f9fafb;
}

.header {
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1.5rem;
}

.tabs {
  display: flex;
  gap: 0.25rem;
  padding: 0 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.content {
  flex: 1;
  overflow: auto;
}
```

## Environment Variables

Create `.env.local` with your API keys:

```env
REACT_APP_SHENMA_KEY=sk-4LI03S1orRih1lmKXBVukBVRXA8gFaipn4tCFL5WZZfn27Vu
REACT_APP_OPENAI_KEY=sk-your-openai-key
REACT_APP_ZHIPU_KEY=sk-your-zhipu-key
REACT_APP_DAYUYU_KEY=sk-your-dayuyu-key
```

## API Endpoint Configuration

Ensure your backend has these endpoints configured:

```
POST   /api/multimedia/config
GET    /api/multimedia/config
PUT    /api/multimedia/config
POST   /api/multimedia/text-to-image
POST   /api/multimedia/image-to-image
POST   /api/multimedia/text-generation
POST   /api/multimedia/image-analysis
POST   /api/multimedia/video-generation
POST   /api/multimedia/video-analysis
```

## Testing Integration

### Unit Tests

```bash
npm run test -- components/multimedia/__tests__/UIComponents.test.tsx --run
```

### Integration Tests

Create `__tests__/integration.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import { MultimediaApp } from '@/components/multimedia';

describe('MultimediaApp Integration', () => {
  it('should render all tabs', () => {
    render(<MultimediaApp />);
    
    expect(screen.getByText('Configuration')).toBeInTheDocument();
    expect(screen.getByText('Text-to-Image')).toBeInTheDocument();
    expect(screen.getByText('Image Editing')).toBeInTheDocument();
    expect(screen.getByText('Text Generation')).toBeInTheDocument();
    expect(screen.getByText('Image Analysis')).toBeInTheDocument();
    expect(screen.getByText('Video Generation')).toBeInTheDocument();
    expect(screen.getByText('Video Analysis')).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Issue: Components not rendering

**Solution**: Ensure all imports are correct and components are exported from `index.ts`

```typescript
// Correct import
import { MultimediaApp } from '@/components/multimedia';

// Or individual imports
import { TextToImagePanel } from '@/components/multimedia/TextToImagePanel';
```

### Issue: Styles not applying

**Solution**: Verify Tailwind CSS is properly configured and included in your CSS

```css
/* In your main CSS file */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Issue: API calls failing

**Solution**: Check that backend endpoints are running and CORS is configured

```typescript
// In your backend (Express example)
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
```

### Issue: Images/videos not displaying

**Solution**: Ensure CORS headers allow image/video resources

```typescript
// Backend CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```

## Performance Optimization

### Lazy Loading

```typescript
import { lazy, Suspense } from 'react';

const MultimediaApp = lazy(() => import('@/components/multimedia'));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MultimediaApp />
    </Suspense>
  );
}
```

### Code Splitting

```typescript
// webpack.config.js or vite.config.ts
{
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        multimedia: {
          test: /[\\/]components[\\/]multimedia/,
          name: 'multimedia',
          priority: 10,
        },
      },
    },
  },
}
```

## Deployment

### Build

```bash
npm run build
```

### Environment Variables

Set in your deployment platform:
- Vercel: Project Settings → Environment Variables
- AWS: Systems Manager → Parameter Store
- Docker: `.env` file or `docker-compose.yml`

### Docker Example

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV REACT_APP_SHENMA_KEY=${SHENMA_KEY}
ENV REACT_APP_OPENAI_KEY=${OPENAI_KEY}

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## Support

For issues or questions:
1. Check the test file for usage examples
2. Review the component source code
3. Check API endpoint implementations
4. Verify environment variables are set
5. Check browser console for errors

## Next Steps

1. ✅ Integrate MultimediaApp into main app
2. ✅ Configure environment variables
3. ✅ Test all endpoints
4. ✅ Deploy to staging
5. ✅ User acceptance testing
6. ✅ Deploy to production
