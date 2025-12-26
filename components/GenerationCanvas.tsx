/**
 * Generation Canvas Component
 * Displays generated images in various layouts (three-view, multi-grid, style-comparison, narrative-progression)
 */

import React, { useState } from 'react';

type GenerationType = 'three-view' | 'multi-grid' | 'style-comparison' | 'narrative-progression';

interface GenerationCanvasProps {
  images: string[];
  type: GenerationType;
  metadata?: Record<string, any>;
  onSave?: (images: string[], metadata: Record<string, any>) => void;
  onDelete?: () => void;
}

export const GenerationCanvas: React.FC<GenerationCanvasProps> = ({
  images,
  type,
  metadata = {},
  onSave,
  onDelete,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const renderLayout = () => {
    switch (type) {
      case 'three-view':
        return (
          <div className="layout three-view">
            <div className="view-container">
              <div className="view-label">Front View</div>
              <img src={images[0]} alt="Front view" />
            </div>
            <div className="view-container">
              <div className="view-label">Side View</div>
              <img src={images[1]} alt="Side view" />
            </div>
            <div className="view-container">
              <div className="view-label">Top View</div>
              <img src={images[2]} alt="Top view" />
            </div>
          </div>
        );

      case 'multi-grid':
        return (
          <div className="layout multi-grid">
            <img src={images[0]} alt="Grid layout" className="full-width" />
          </div>
        );

      case 'style-comparison':
        return (
          <div className="layout style-comparison">
            {images.map((img, idx) => (
              <div key={idx} className="style-item">
                <div className="style-label">
                  Style {idx + 1}
                </div>
                <img src={img} alt={`Style ${idx + 1}`} />
              </div>
            ))}
          </div>
        );

      case 'narrative-progression':
        return (
          <div className="layout narrative-progression">
            {images.map((img, idx) => (
              <div key={idx} className="frame-item">
                <div className="frame-label">Frame {idx + 1}</div>
                <img src={img} alt={`Frame ${idx + 1}`} />
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="generation-canvas">
      <div className="canvas-header">
        <h3>Generated {type.replace('-', ' ').toUpperCase()}</h3>
        <div className="canvas-actions">
          {onSave && (
            <button className="btn-save" onClick={() => onSave(images, metadata)}>
              Save
            </button>
          )}
          {onDelete && (
            <button className="btn-delete" onClick={onDelete}>
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="canvas-content">
        {renderLayout()}
      </div>

      {selectedImage && (
        <div className="image-preview-modal" onClick={() => setSelectedImage(null)}>
          <div className="preview-content">
            <img src={selectedImage} alt="Preview" />
            <button className="btn-close" onClick={() => setSelectedImage(null)}>
              ✕
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .generation-canvas {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .canvas-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #eee;
          padding-bottom: 15px;
        }

        .canvas-header h3 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }

        .canvas-actions {
          display: flex;
          gap: 10px;
        }

        .btn-save,
        .btn-delete {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-save {
          background: #28a745;
          color: white;
        }

        .btn-save:hover {
          background: #218838;
        }

        .btn-delete {
          background: #dc3545;
          color: white;
        }

        .btn-delete:hover {
          background: #c82333;
        }

        .canvas-content {
          overflow-x: auto;
        }

        .layout {
          display: flex;
          gap: 20px;
          padding: 10px;
        }

        .layout.three-view {
          justify-content: space-around;
          flex-wrap: wrap;
        }

        .layout.multi-grid {
          justify-content: center;
        }

        .layout.style-comparison {
          flex-wrap: wrap;
          justify-content: center;
        }

        .layout.narrative-progression {
          flex-wrap: wrap;
          justify-content: flex-start;
        }

        .view-container,
        .style-item,
        .frame-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .view-container {
          flex: 1;
          min-width: 200px;
        }

        .style-item {
          flex: 0 1 calc(20% - 16px);
          min-width: 150px;
        }

        .frame-item {
          flex: 0 1 calc(25% - 15px);
          min-width: 150px;
        }

        .view-label,
        .style-label,
        .frame-label {
          font-size: 12px;
          font-weight: bold;
          color: #666;
          text-align: center;
        }

        .layout img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .layout img:hover {
          transform: scale(1.05);
        }

        .full-width {
          width: 100%;
        }

        .image-preview-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .preview-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
        }

        .preview-content img {
          max-width: 100%;
          max-height: 100%;
          border-radius: 8px;
        }

        .btn-close {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 40px;
          height: 40px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-close:hover {
          background: rgba(0, 0, 0, 0.7);
        }

        @media (max-width: 768px) {
          .layout {
            flex-direction: column;
          }

          .view-container,
          .style-item,
          .frame-item {
            flex: 1;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default GenerationCanvas;
