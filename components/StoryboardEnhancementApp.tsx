/**
 * Storyboard Enhancement App
 * Main integration component for the storyboard enhancement feature
 */

import React, { useState, useEffect } from 'react';
import CameraMotionLibrary from './CameraMotionLibrary';
import ActionMotion from './ActionMotion';
import QuickStoryboard from './QuickStoryboard';
import GenerationCanvas from './GenerationCanvas';
import GenerationHistory from './GenerationHistory';
import CanvasDropZone from './CanvasDropZone';
import type { Symbol } from '@prisma/client';

interface StoryboardEnhancementAppProps {
  userId: number;
}

type GenerationType = 'three-view' | 'multi-grid' | 'style-comparison' | 'narrative-progression' | 'forward' | 'rotate' | 'jump' | 'fly';

interface GeneratedResult {
  type: GenerationType;
  images: string[];
  metadata: Record<string, any>;
}

export const StoryboardEnhancementApp: React.FC<StoryboardEnhancementAppProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'action' | 'quick' | 'canvas' | 'history'>('camera');
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<Symbol | null>(null);

  const handleSymbolDrop = async (symbol: Symbol) => {
    setSelectedSymbol(symbol);
    setActiveTab('canvas');
    setIsGenerating(true);
    setError(null);

    try {
      // Trigger three-view generation
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          type: 'three-view',
          template: 'Generate three orthographic views (front, side, top) of {subject}',
          parameters: {
            subject: symbol.name,
          },
          subject: symbol.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const data = await response.json();
      if (data.success) {
        setGeneratedResult({
          type: 'three-view',
          images: data.data.images,
          metadata: data.data.metadata,
        });
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickAction = async (type: GenerationType, parameters: Record<string, string>) => {
    setActiveTab('canvas');
    setIsGenerating(true);
    setError(null);

    try {
      // Get the appropriate configuration based on type
      let configResponse;
      let template;

      if (['forward', 'rotate', 'jump', 'fly'].includes(type)) {
        // Action motion
        configResponse = await fetch(`/api/action-configuration?userId=${userId}`);
        if (!configResponse.ok) {
          throw new Error('Failed to load action configuration');
        }

        const configData = await configResponse.json();
        const config = configData.data.config;

        const templateMap: Record<string, string> = {
          forward: config.forwardTemplate,
          rotate: config.rotateTemplate,
          jump: config.jumpTemplate,
          fly: config.flyTemplate,
        };

        template = templateMap[type];
      } else {
        // Quick storyboard
        configResponse = await fetch(`/api/quick-storyboard?userId=${userId}`);
        if (!configResponse.ok) {
          throw new Error('Failed to load configuration');
        }

        const configData = await configResponse.json();
        const config = configData.data.config;

        const templateMap: Record<string, string> = {
          'three-view': config.threeViewTemplate,
          'multi-grid': config.multiGridTemplate,
          'style-comparison': config.styleComparisonTemplate,
          'narrative-progression': config.narrativeProgressionTemplate,
        };

        template = templateMap[type];
      }

      // Call generation API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          type,
          template,
          parameters,
        }),
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const data = await response.json();
      if (data.success) {
        setGeneratedResult({
          type,
          images: data.data.images,
          metadata: data.data.metadata,
        });
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveGeneration = async (images: string[], metadata: Record<string, any>) => {
    if (!generatedResult) return;

    try {
      const response = await fetch('/api/generation-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          type: generatedResult.type,
          images,
          metadata,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save generation');
      }

      setError(null);
      // Show success message
      alert('Generation saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  return (
    <div className="storyboard-enhancement-app">
      <div className="app-header">
        <h1>Storyboard Enhancement</h1>
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'camera' ? 'active' : ''}`}
            onClick={() => setActiveTab('camera')}
          >
            一键运镜
          </button>
          <button
            className={`tab-button ${activeTab === 'action' ? 'active' : ''}`}
            onClick={() => setActiveTab('action')}
          >
            一键运动
          </button>
          <button
            className={`tab-button ${activeTab === 'quick' ? 'active' : ''}`}
            onClick={() => setActiveTab('quick')}
          >
            Quick Storyboard
          </button>
          <button
            className={`tab-button ${activeTab === 'canvas' ? 'active' : ''}`}
            onClick={() => setActiveTab('canvas')}
          >
            Canvas
          </button>
          <button
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="app-content">
        {activeTab === 'camera' && (
          <CameraMotionLibrary
            userId={userId}
            onSymbolDrop={handleSymbolDrop}
            onSymbolSelect={setSelectedSymbol}
          />
        )}

        {activeTab === 'action' && (
          <ActionMotion
            userId={userId}
            onGenerate={handleQuickAction}
            onError={setError}
          />
        )}

        {activeTab === 'quick' && (
          <QuickStoryboard
            userId={userId}
            onGenerate={handleQuickAction}
            onError={setError}
          />
        )}

        {activeTab === 'canvas' && (
          <div className="canvas-section">
            <CanvasDropZone
              onGenerationStart={() => setIsGenerating(true)}
              onGenerationComplete={(images) => {
                setGeneratedResult({
                  type: 'three-view',
                  images,
                  metadata: {},
                });
                setIsGenerating(false);
              }}
              onError={setError}
            />

            {generatedResult && (
              <GenerationCanvas
                images={generatedResult.images}
                type={generatedResult.type as any}
                metadata={generatedResult.metadata}
                onSave={handleSaveGeneration}
                onDelete={() => setGeneratedResult(null)}
              />
            )}

            {isGenerating && (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <p>Generating images...</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <GenerationHistory userId={userId} />
        )}
      </div>

      <style jsx>{`
        .storyboard-enhancement-app {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #f5f5f5;
        }

        .app-header {
          background: white;
          padding: 20px;
          border-bottom: 1px solid #eee;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .app-header h1 {
          margin: 0 0 15px 0;
          font-size: 28px;
          color: #333;
        }

        .tab-navigation {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .tab-button {
          padding: 10px 20px;
          background: #f0f0f0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s;
        }

        .tab-button:hover {
          background: #e0e0e0;
        }

        .tab-button.active {
          background: #007bff;
          color: white;
        }

        .error-banner {
          background: #f8d7da;
          color: #721c24;
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #f5c6cb;
        }

        .error-banner p {
          margin: 0;
        }

        .error-banner button {
          background: none;
          border: none;
          color: #721c24;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
        }

        .app-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .canvas-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .loading-indicator {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          text-align: center;
          z-index: 1000;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default StoryboardEnhancementApp;

</content>
