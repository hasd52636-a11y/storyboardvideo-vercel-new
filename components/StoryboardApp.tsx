/**
 * Storyboard Enhancement App
 * Main application component with Symbol Library on left and tabbed interface on right
 * Tabs: Camera Motion (一键运镜), Action Motion (一键动作), Quick Storyboard (快捷分镜)
 */

import React, { useState } from 'react';
import SymbolLibrary from './SymbolLibrary';
import CameraMotionLibrary from './CameraMotionLibrary';
import ActionMotion from './ActionMotion';
import QuickStoryboard from './QuickStoryboard';
import GenerationCanvas from './GenerationCanvas';
import GenerationHistory from './GenerationHistory';

type TabType = 'camera-motion' | 'action-motion' | 'quick-storyboard';

interface GeneratedContent {
  type: string;
  images: string[];
  metadata: Record<string, any>;
}

interface Symbol {
  id: string;
  name: string;
  description: string;
  icon: string;
  userId: number;
}

export const StoryboardApp: React.FC<{ userId: number }> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<TabType>('quick-storyboard');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [draggedSymbol, setDraggedSymbol] = useState<Symbol | null>(null);

  const handleSymbolDrop = (symbol: Symbol) => {
    setDraggedSymbol(symbol);
    // Trigger generation based on active tab
    console.log(`Symbol dropped: ${symbol.name} in tab: ${activeTab}`);
  };

  const handleGeneration = (type: string, images: string[], metadata: Record<string, any>) => {
    setGeneratedContent({
      type,
      images,
      metadata,
    });
  };

  const handleSaveGeneration = (images: string[], metadata: Record<string, any>) => {
    // Save to database
    console.log('Saving generation:', { images, metadata });
  };

  const handleDeleteGeneration = () => {
    setGeneratedContent(null);
  };

  return (
    <div className="storyboard-app">
      <div className="app-container">
        {/* Left Panel - Symbol Library */}
        <div className="left-panel">
          <SymbolLibrary
            userId={userId}
            onSymbolDrop={handleSymbolDrop}
            onSymbolSelect={(symbol) => setDraggedSymbol(symbol)}
          />
        </div>

        {/* Right Panel - Tabbed Interface */}
        <div className="right-panel">
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={`tab-button ${activeTab === 'camera-motion' ? 'active' : ''}`}
              onClick={() => setActiveTab('camera-motion')}
            >
              <span className="tab-icon">🎥</span>
              <span className="tab-label">一键运镜</span>
            </button>
            <button
              className={`tab-button ${activeTab === 'action-motion' ? 'active' : ''}`}
              onClick={() => setActiveTab('action-motion')}
            >
              <span className="tab-icon">⚡</span>
              <span className="tab-label">一键动作</span>
            </button>
            <button
              className={`tab-button ${activeTab === 'quick-storyboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('quick-storyboard')}
            >
              <span className="tab-icon">⚙️</span>
              <span className="tab-label">快捷分镜</span>
            </button>
            <button
              className={`history-button ${showHistory ? 'active' : ''}`}
              onClick={() => setShowHistory(!showHistory)}
              title="View generation history"
            >
              📋 History
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'camera-motion' && (
              <div className="tab-pane">
                <CameraMotionLibrary
                  userId={userId}
                  draggedSymbol={draggedSymbol}
                  onGenerate={handleGeneration}
                />
              </div>
            )}

            {activeTab === 'action-motion' && (
              <div className="tab-pane">
                <ActionMotion
                  userId={userId}
                  draggedSymbol={draggedSymbol}
                  onGenerate={handleGeneration}
                />
              </div>
            )}

            {activeTab === 'quick-storyboard' && (
              <div className="tab-pane">
                <QuickStoryboard
                  userId={userId}
                  onGenerate={(type, parameters) => {
                    console.log(`Generating ${type} with parameters:`, parameters);
                  }}
                />
              </div>
            )}
          </div>

          {/* Generation Canvas */}
          {generatedContent && (
            <div className="generation-section">
              <GenerationCanvas
                images={generatedContent.images}
                type={generatedContent.type as any}
                metadata={generatedContent.metadata}
                onSave={handleSaveGeneration}
                onDelete={handleDeleteGeneration}
              />
            </div>
          )}

          {/* Generation History */}
          {showHistory && (
            <div className="history-section">
              <GenerationHistory
                userId={userId}
                onSelectGeneration={(gen) => {
                  setGeneratedContent({
                    type: gen.type,
                    images: gen.images,
                    metadata: gen.metadata as Record<string, any>,
                  });
                  setShowHistory(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .storyboard-app {
          width: 100%;
          height: 100vh;
          background: #f5f5f5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
            Ubuntu, Cantarell, sans-serif;
        }

        .app-container {
          display: flex;
          height: 100%;
          gap: 0;
        }

        .left-panel {
          flex: 0 0 350px;
          background: white;
          border-right: 1px solid #e0e0e0;
          overflow-y: auto;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
        }

        .right-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #fafafa;
          overflow: hidden;
        }

        .tab-navigation {
          display: flex;
          gap: 0;
          background: white;
          border-bottom: 2px solid #e0e0e0;
          padding: 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .tab-button {
          flex: 1;
          padding: 16px 12px;
          background: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          position: relative;
        }

        .tab-button:hover {
          background: #f5f5f5;
          color: #333;
        }

        .tab-button.active {
          color: #007bff;
          border-bottom-color: #007bff;
          background: #f0f7ff;
        }

        .tab-icon {
          font-size: 18px;
        }

        .tab-label {
          font-size: 13px;
        }

        .history-button {
          padding: 16px 12px;
          background: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.3s ease;
          margin-left: auto;
          border-left: 1px solid #e0e0e0;
        }

        .history-button:hover {
          background: #f5f5f5;
          color: #333;
        }

        .history-button.active {
          color: #28a745;
          border-bottom-color: #28a745;
          background: #f0fff4;
        }

        .tab-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .tab-pane {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .generation-section {
          margin-top: 20px;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .history-section {
          margin-top: 20px;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          max-height: 600px;
          overflow-y: auto;
        }

        @media (max-width: 1200px) {
          .left-panel {
            flex: 0 0 300px;
          }

          .tab-label {
            display: none;
          }

          .tab-button {
            padding: 16px 8px;
          }
        }

        @media (max-width: 768px) {
          .app-container {
            flex-direction: column;
          }

          .left-panel {
            flex: 0 0 auto;
            max-height: 40vh;
            border-right: none;
            border-bottom: 1px solid #e0e0e0;
          }

          .right-panel {
            flex: 1;
          }

          .tab-navigation {
            flex-wrap: wrap;
          }

          .history-button {
            border-left: none;
            margin-left: 0;
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default StoryboardApp;
