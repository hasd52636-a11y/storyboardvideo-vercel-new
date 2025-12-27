/**
 * Quick Storyboard Component
 * Displays four quick-action buttons and editable prompt templates
 * Supports reference image upload for enhanced generation
 */

import React, { useState, useEffect } from 'react';

interface QuickStoryboardConfig {
  id: string;
  userId: number;
  threeViewTemplate: string;
  multiGridTemplate: string;
  styleComparisonTemplate: string;
  narrativeProgressionTemplate: string;
}

interface QuickStoryboardProps {
  userId: number;
  onGenerate?: (type: string, parameters: Record<string, string>, referenceImage?: string, referenceImageWeight?: number) => void;
  onError?: (error: string) => void;
  externalReferenceImage?: string;
}

type GenerationType = 'three-view' | 'style-comparison';

interface QuickAction {
  type: GenerationType;
  label: string;
  icon: string;
  description: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    type: 'three-view',
    label: 'Three-View',
    icon: '📐',
    description: 'Generate front, side, and top views',
  },
  {
    type: 'style-comparison',
    label: 'Style Comparison',
    icon: '🎨',
    description: 'Generate 5 different artistic styles',
  },
];

export const QuickStoryboard: React.FC<QuickStoryboardProps> = ({
  userId,
  onGenerate,
  onError,
  externalReferenceImage,
}) => {
  const [loading, setLoading] = useState(false);

  const handleQuickAction = (action: QuickAction) => {
    // Trigger generation with action type
    onGenerate?.(action.type, {});
  };

  if (loading) {
    return <div className="quick-storyboard loading">Loading...</div>;
  }

  return (
    <div className="quick-storyboard">
      <div className="quick-storyboard-header">
        <h2>Quick Storyboard</h2>
        <p>Access from right-click context menu on any storyboard card</p>
      </div>

      <div className="quick-actions-grid">
        {QUICK_ACTIONS.map((action) => (
          <div key={action.type} className="quick-action-card">
            <button
              className="action-button"
              onClick={() => handleQuickAction(action)}
              title={action.description}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-label">{action.label}</span>
            </button>
            <p className="action-description">{action.description}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .quick-storyboard {
          padding: 20px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .quick-storyboard.loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .quick-storyboard-header {
          margin-bottom: 30px;
        }

        .quick-storyboard-header h2 {
          margin: 0 0 10px 0;
          font-size: 24px;
          color: #333;
        }

        .quick-storyboard-header p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .quick-action-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .action-button {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: transform 0.2s;
          margin-bottom: 15px;
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .action-icon {
          font-size: 24px;
        }

        .action-label {
          font-size: 16px;
        }

        .action-description {
          margin: 0;
          font-size: 12px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default QuickStoryboard;
