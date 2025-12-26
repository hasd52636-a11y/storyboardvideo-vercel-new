/**
 * Canvas Drop Zone Component
 * Handles drag-and-drop of symbols to canvas and triggers generation
 */

import React, { useState } from 'react';
import type { Symbol } from '@prisma/client';
import { threeViewGenerator } from '@/services/generators/ThreeViewGenerator';

interface CanvasDropZoneProps {
  onGenerationStart?: () => void;
  onGenerationComplete?: (images: string[]) => void;
  onError?: (error: string) => void;
  template?: string;
}

export const CanvasDropZone: React.FC<CanvasDropZoneProps> = ({
  onGenerationStart,
  onGenerationComplete,
  onError,
  template = 'Generate three orthographic views (front, side, top) of {subject}',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    // Get symbol data from drag event
    const symbolData = e.dataTransfer.getData('application/json');
    if (!symbolData) {
      onError?.('No symbol data found');
      return;
    }

    try {
      const symbol = JSON.parse(symbolData) as Symbol;

      // Trigger three-view generation
      setIsGenerating(true);
      onGenerationStart?.();

      // Generate three-view prompt
      const result = threeViewGenerator.generatePrompt({
        symbol,
        template,
      });

      // Call API to generate images
      const response = await fetch('/api/generate/three-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: result.prompt,
          parameters: result.parameters,
        }),
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const data = await response.json();
      onGenerationComplete?.(data.images);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      onError?.(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className={`canvas-drop-zone ${isDragOver ? 'drag-over' : ''} ${
        isGenerating ? 'generating' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="drop-zone-content">
        {isGenerating ? (
          <>
            <div className="spinner"></div>
            <p>Generating images...</p>
          </>
        ) : isDragOver ? (
          <>
            <p className="drop-hint">Drop symbol here to generate three-view</p>
          </>
        ) : (
          <>
            <p className="drop-hint">Drag a symbol here to generate three-view</p>
          </>
        )}
      </div>

      <style jsx>{`
        .canvas-drop-zone {
          border: 2px dashed #ccc;
          border-radius: 8px;
          padding: 40px;
          text-align: center;
          background: #fafafa;
          transition: all 0.3s ease;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .canvas-drop-zone.drag-over {
          border-color: #007bff;
          background: #e7f3ff;
        }

        .canvas-drop-zone.generating {
          opacity: 0.7;
          pointer-events: none;
        }

        .drop-zone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .drop-hint {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
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

export default CanvasDropZone;
