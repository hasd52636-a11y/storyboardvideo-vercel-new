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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [referenceImageForQuickStoryboard, setReferenceImageForQuickStoryboard] = useState<string | null>(null);
  const [showInputDialogForDrop, setShowInputDialogForDrop] = useState(false);
  const [dropActionData, setDropActionData] = useState<any>(null);
  const [dropCardId, setDropCardId] = useState<string | null>(null);
  const [dropReferenceImage, setDropReferenceImage] = useState<string | null>(null);
  const [dropInputValue, setDropInputValue] = useState('');

  const handleSymbolDrop = (symbol: Symbol) => {
    setDraggedSymbol(symbol);
    // Trigger generation based on active tab
    console.log(`Symbol dropped: ${symbol.name} in tab: ${activeTab}`);
  };

  const handleImageDrop = (imageUrl: string) => {
    // When an image is dropped, set it as reference for quick storyboard
    setReferenceImageForQuickStoryboard(imageUrl);
    console.log(`[StoryboardApp] Image dropped as reference for quick storyboard:`, imageUrl.substring(0, 50));
  };

  const handleGeneration = (type: string, images: string[], metadata: Record<string, any>) => {
    console.log(`[StoryboardApp] handleGeneration called with ${images.length} images`);
    setGeneratedContent({
      type,
      images,
      metadata,
    });
    setGenerationError(null);
  };

  const handleSaveGeneration = (images: string[], metadata: Record<string, any>) => {
    // Save to database
    console.log('Saving generation:', { images, metadata });
  };

  const handleDeleteGeneration = () => {
    setGeneratedContent(null);
  };

  const handleQuickActionDropOnCard = (cardId: string, actionData: any, referenceImage: string) => {
    console.log(`[StoryboardApp] Quick action dropped on card ${cardId}:`, actionData);
    
    // If action requires input, show dialog
    if (actionData.requiresInput) {
      setDropActionData(actionData);
      setDropCardId(cardId);
      setDropReferenceImage(referenceImage);
      setShowInputDialogForDrop(true);
      setDropInputValue('');
      return;
    }
    
    // Otherwise, trigger generation immediately
    triggerDropGeneration(actionData, referenceImage, {});
  };

  const handleDropInputSubmit = () => {
    if (!dropActionData || !dropReferenceImage) return;
    
    const frameCount = parseInt(dropInputValue);
    
    if (frameCount < dropActionData.inputMin || frameCount > dropActionData.inputMax) {
      setGenerationError(`Frame count must be between ${dropActionData.inputMin} and ${dropActionData.inputMax}`);
      return;
    }
    
    triggerDropGeneration(dropActionData, dropReferenceImage, { frameCount: frameCount.toString() });
    setShowInputDialogForDrop(false);
    setDropActionData(null);
    setDropCardId(null);
    setDropReferenceImage(null);
    setDropInputValue('');
  };

  const triggerDropGeneration = async (actionData: any, referenceImage: string, parameters: Record<string, string>) => {
    try {
      console.log(`[StoryboardApp] Triggering generation for dropped action: ${actionData.actionType}`);
      await handleQuickStoryboardGeneration(actionData.actionType, parameters, referenceImage, 0.8);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('[StoryboardApp] Drop generation error:', errorMsg);
      setGenerationError(errorMsg);
    }
  };

  const handleQuickStoryboardGeneration = async (
    type: string,
    parameters: Record<string, string>,
    referenceImage?: string,
    referenceImageWeight?: number
  ) => {
    try {
      // Import the image generation function
      const { generateSceneImage } = await import('../geminiService');
      
      // Validate that reference image is provided - CRITICAL CHECK
      if (!referenceImage) {
        const errorMsg = 'Please upload a reference image to generate storyboard';
        console.error(`[Quick Storyboard] ❌ ${errorMsg}`);
        console.error(`[Quick Storyboard] referenceImage value:`, referenceImage);
        throw new Error(errorMsg);
      }
      
      console.log(`[Quick Storyboard] ✓ Reference image validated, length: ${referenceImage.length}`);
      
      let images: string[] = [];
      let metadata: Record<string, any> = {
        type,
        parameters,
        referenceImageUsed: !!referenceImage,
      };

      if (referenceImage) {
        metadata.referenceImageWeight = referenceImageWeight || 0.8;
      }

      console.log(`[Quick Storyboard] Starting generation for type: ${type}`);
      if (referenceImage) {
        console.log(`[Quick Storyboard] Using reference image with weight: ${referenceImageWeight || 0.8}`);
      }

      if (type === 'three-view') {
        // Generate three orthographic views
        const threeViewPrompts = [
          `Professional cinematic storyboard frame - Front orthographic view. Show a detailed subject from the front with clear composition, professional lighting, and rich details. High quality digital painting with vibrant colors. Aspect ratio: 16:9`,
          `Professional cinematic storyboard frame - Side orthographic view. Show a detailed subject from the side with clear composition, professional lighting, and rich details. High quality digital painting with vibrant colors. Aspect ratio: 16:9`,
          `Professional cinematic storyboard frame - Top orthographic view. Show a detailed subject from above with clear composition, professional lighting, and rich details. High quality digital painting with vibrant colors. Aspect ratio: 16:9`
        ];

        for (let i = 0; i < 3; i++) {
          try {
            console.log(`[Quick Storyboard] Generating view ${i + 1}/3...`);
            const imageUrl = await generateSceneImage(threeViewPrompts[i], true, false, undefined, undefined);
            if (imageUrl) {
              console.log(`[Quick Storyboard] ✓ View ${i + 1} generated successfully`);
              images.push(imageUrl);
            } else {
              console.warn(`[Quick Storyboard] ✗ View ${i + 1} returned null`);
            }
          } catch (err) {
            console.error(`[Quick Storyboard] Failed to generate view ${i + 1}:`, err);
          }
        }
      } else if (type === 'multi-grid') {
        // Generate multi-grid storyboard
        const frameCount = parseInt(parameters.frameCount || '4');
        const prompt = `Professional cinematic storyboard - ${frameCount}-frame grid showing a narrative sequence. Each frame shows progression of a dramatic scene with clear composition, professional lighting, and rich details. High quality digital painting with vibrant colors. Aspect ratio: 16:9`;
        
        try {
          console.log(`[Quick Storyboard] Generating multi-grid with ${frameCount} frames...`);
          const imageUrl = await generateSceneImage(prompt, true, false, undefined, undefined);
          if (imageUrl) {
            console.log(`[Quick Storyboard] ✓ Multi-grid generated successfully`);
            images.push(imageUrl);
          } else {
            console.warn(`[Quick Storyboard] ✗ Multi-grid returned null`);
          }
        } catch (err) {
          console.error('[Quick Storyboard] Failed to generate multi-grid:', err);
        }
      } else if (type === 'style-comparison') {
        // Generate 5 different artistic styles
        const styles = ['oil painting', 'watercolor', 'digital art', 'anime', 'photorealistic'];
        
        for (let idx = 0; idx < styles.length; idx++) {
          const style = styles[idx];
          try {
            console.log(`[Quick Storyboard] Generating ${style} style (${idx + 1}/${styles.length})...`);
            const prompt = `Professional cinematic storyboard frame in ${style} artistic style. Show a detailed subject with clear composition, professional lighting, and rich details. High quality artwork. Aspect ratio: 16:9`;
            const imageUrl = await generateSceneImage(prompt, true, false, undefined, undefined);
            if (imageUrl) {
              console.log(`[Quick Storyboard] ✓ ${style} style generated successfully`);
              images.push(imageUrl);
            } else {
              console.warn(`[Quick Storyboard] ✗ ${style} style returned null`);
            }
          } catch (err) {
            console.error(`[Quick Storyboard] Failed to generate ${style} style:`, err);
          }
        }
      } else if (type === 'narrative-progression') {
        // Generate sequential narrative frames
        const frameCount = parseInt(parameters.frameCount || '4');
        
        for (let i = 0; i < frameCount; i++) {
          try {
            console.log(`[Quick Storyboard] Generating frame ${i + 1}/${frameCount}...`);
            const prompt = `Professional cinematic storyboard frame ${i + 1} of ${frameCount}. Show a dramatic scene with clear composition, professional lighting, and rich details. Part of a narrative sequence showing story progression. High quality digital painting with vibrant colors. Aspect ratio: 16:9`;
            const imageUrl = await generateSceneImage(prompt, true, false, undefined, undefined);
            if (imageUrl) {
              console.log(`[Quick Storyboard] ✓ Frame ${i + 1} generated successfully`);
              images.push(imageUrl);
            } else {
              console.warn(`[Quick Storyboard] ✗ Frame ${i + 1} returned null`);
            }
          } catch (err) {
            console.error(`[Quick Storyboard] Failed to generate frame ${i + 1}:`, err);
          }
        }
      }

      console.log(`[Quick Storyboard] Generation complete. Generated ${images.length} images`);

      if (images.length > 0) {
        console.log(`[Quick Storyboard] Calling handleGeneration with ${images.length} images`);
        handleGeneration(type, images, metadata);
      } else {
        const errorMsg = 'No images were generated. Please check your API configuration and ensure your API key is valid.';
        console.error(`[Quick Storyboard] ${errorMsg}`);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('[Quick Storyboard] Generation error:', error);
      throw error;
    }
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
                  externalReferenceImage={referenceImageForQuickStoryboard || undefined}
                  onGenerate={async (type, parameters, referenceImage, referenceImageWeight) => {
                    setIsGenerating(true);
                    setGenerationError(null);
                    try {
                      await handleQuickStoryboardGeneration(type, parameters, referenceImage, referenceImageWeight);
                    } catch (error) {
                      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
                      console.error('[StoryboardApp] Quick storyboard error:', errorMsg);
                      setGenerationError(errorMsg);
                    } finally {
                      setIsGenerating(false);
                    }
                  }}
                  onError={(error) => {
                    console.error('[StoryboardApp] Quick storyboard error callback:', error);
                    setGenerationError(error);
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
                onDropQuickAction={handleQuickActionDropOnCard}
              />
            </div>
          )}

          {/* Error Display */}
          {generationError && (
            <div className="error-section">
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <div className="error-content">
                  <h4>Generation Failed</h4>
                  <p>{generationError}</p>
                </div>
                <button 
                  className="error-close"
                  onClick={() => setGenerationError(null)}
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isGenerating && (
            <div className="loading-section">
              <div className="loading-spinner"></div>
              <p>Generating images...</p>
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

          {/* Drop Action Input Dialog */}
          {showInputDialogForDrop && dropActionData && (
            <div className="input-dialog-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ background: 'white', padding: '30px', borderRadius: '8px', maxWidth: '400px', width: '90%' }}>
                <h3 style={{ marginTop: 0, marginBottom: '15px' }}>
                  {dropActionData.actionType === 'multi-grid' ? 'Multi-Grid' : 'Narrative Progression'}
                </h3>
                <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px' }}>
                  {dropActionData.actionType === 'multi-grid' ? 'Number of frames (2-12)' : 'Number of frames (1-12)'}
                </p>
                <input
                  type="number"
                  value={dropInputValue}
                  onChange={(e) => setDropInputValue(e.target.value)}
                  min={dropActionData.inputMin}
                  max={dropActionData.inputMax}
                  placeholder="Enter value"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', marginBottom: '20px', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={handleDropInputSubmit}
                    style={{ flex: 1, padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                  >
                    Generate
                  </button>
                  <button
                    onClick={() => {
                      setShowInputDialogForDrop(false);
                      setDropActionData(null);
                      setDropCardId(null);
                      setDropReferenceImage(null);
                      setDropInputValue('');
                    }}
                    style={{ flex: 1, padding: '10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
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

        .error-section {
          margin-top: 20px;
          padding: 0;
        }

        .error-message {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 16px;
          background: #fee;
          border: 2px solid #f88;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(255, 136, 136, 0.2);
        }

        .error-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .error-content {
          flex: 1;
        }

        .error-content h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
          color: #d32f2f;
          font-weight: bold;
        }

        .error-content p {
          margin: 0;
          font-size: 14px;
          color: #c62828;
          line-height: 1.4;
        }

        .error-close {
          flex-shrink: 0;
          background: transparent;
          border: none;
          color: #d32f2f;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .error-close:hover {
          color: #b71c1c;
        }

        .loading-section {
          margin-top: 20px;
          padding: 40px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f0f0f0;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-section p {
          margin: 0;
          color: #666;
          font-size: 14px;
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
