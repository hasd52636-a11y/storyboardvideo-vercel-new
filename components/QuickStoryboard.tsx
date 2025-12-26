/**
 * Quick Storyboard Component
 * Displays four quick-action buttons and editable prompt templates
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
  onGenerate?: (type: string, parameters: Record<string, string>) => void;
  onError?: (error: string) => void;
}

type GenerationType = 'three-view' | 'multi-grid' | 'style-comparison' | 'narrative-progression';

interface QuickAction {
  type: GenerationType;
  label: string;
  icon: string;
  description: string;
  requiresInput: boolean;
  inputLabel?: string;
  inputMin?: number;
  inputMax?: number;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    type: 'three-view',
    label: 'Three-View',
    icon: '📐',
    description: 'Generate front, side, and top views',
    requiresInput: false,
  },
  {
    type: 'multi-grid',
    label: 'Multi-Grid',
    icon: '🎬',
    description: 'Generate N×N grid storyboard',
    requiresInput: true,
    inputLabel: 'Number of frames (2-12)',
    inputMin: 2,
    inputMax: 12,
  },
  {
    type: 'style-comparison',
    label: 'Style Comparison',
    icon: '🎨',
    description: 'Generate 5 different artistic styles',
    requiresInput: false,
  },
  {
    type: 'narrative-progression',
    label: 'Narrative Progression',
    icon: '📖',
    description: 'Generate N sequential frames',
    requiresInput: true,
    inputLabel: 'Number of frames (1-12)',
    inputMin: 1,
    inputMax: 12,
  },
];

export const QuickStoryboard: React.FC<QuickStoryboardProps> = ({
  userId,
  onGenerate,
  onError,
}) => {
  const [config, setConfig] = useState<QuickStoryboardConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<GenerationType | null>(null);
  const [templateValues, setTemplateValues] = useState<Record<string, string>>({});
  const [showInputDialog, setShowInputDialog] = useState(false);
  const [currentAction, setCurrentAction] = useState<GenerationType | null>(null);
  const [inputValue, setInputValue] = useState('');

  // Load configuration on mount
  useEffect(() => {
    loadConfig();
  }, [userId]);

  const loadConfig = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/quick-storyboard?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to load configuration');
      }

      const data = await response.json();
      setConfig(data.config);

      // Initialize template values
      if (data.config) {
        setTemplateValues({
          threeView: data.config.threeViewTemplate,
          multiGrid: data.config.multiGridTemplate,
          styleComparison: data.config.styleComparisonTemplate,
          narrativeProgression: data.config.narrativeProgressionTemplate,
        });
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    if (action.requiresInput) {
      setCurrentAction(action.type);
      setShowInputDialog(true);
    } else {
      triggerGeneration(action.type, {});
    }
  };

  const handleInputSubmit = () => {
    if (!currentAction) return;

    const frameCount = parseInt(inputValue);
    const action = QUICK_ACTIONS.find((a) => a.type === currentAction);

    if (!action || !action.inputMin || !action.inputMax) {
      onError?.('Invalid action');
      return;
    }

    if (frameCount < action.inputMin || frameCount > action.inputMax) {
      onError?.(
        `Frame count must be between ${action.inputMin} and ${action.inputMax}`
      );
      return;
    }

    triggerGeneration(currentAction, { frameCount: frameCount.toString() });
    setShowInputDialog(false);
    setInputValue('');
  };

  const triggerGeneration = (type: GenerationType, parameters: Record<string, string>) => {
    onGenerate?.(type, parameters);
  };

  const handleEditTemplate = (type: GenerationType) => {
    setEditingTemplate(type);
  };

  const handleSaveTemplate = async (type: GenerationType, newTemplate: string) => {
    if (!config) return;

    try {
      const response = await fetch(`/api/quick-storyboard/${config.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          [`${type}Template`]: newTemplate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save template');
      }

      setTemplateValues((prev) => ({
        ...prev,
        [type]: newTemplate,
      }));

      setEditingTemplate(null);
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Failed to save template');
    }
  };

  const handleResetTemplate = async (type: GenerationType) => {
    if (!config) return;

    try {
      const response = await fetch(`/api/quick-storyboard/${config.id}/reset-template`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          templateType: type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset template');
      }

      await loadConfig();
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Failed to reset template');
    }
  };

  if (loading) {
    return <div className="quick-storyboard loading">Loading...</div>;
  }

  return (
    <div className="quick-storyboard">
      <div className="quick-storyboard-header">
        <h2>Quick Storyboard</h2>
        <p>One-click generation with customizable templates</p>
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

            <div className="template-section">
              <div className="template-header">
                <h4>Template</h4>
                <button
                  className="btn-edit-template"
                  onClick={() => handleEditTemplate(action.type)}
                >
                  Edit
                </button>
              </div>

              {editingTemplate === action.type ? (
                <div className="template-editor">
                  <textarea
                    defaultValue={templateValues[action.type] || ''}
                    onChange={(e) => {
                      setTemplateValues((prev) => ({
                        ...prev,
                        [action.type]: e.target.value,
                      }));
                    }}
                    rows={3}
                  />
                  <div className="editor-actions">
                    <button
                      className="btn-save"
                      onClick={() =>
                        handleSaveTemplate(
                          action.type,
                          templateValues[action.type] || ''
                        )
                      }
                    >
                      Save
                    </button>
                    <button
                      className="btn-reset"
                      onClick={() => handleResetTemplate(action.type)}
                    >
                      Reset
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => setEditingTemplate(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="template-preview">{templateValues[action.type]}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {showInputDialog && currentAction && (
        <div className="input-dialog-overlay">
          <div className="input-dialog">
            <h3>
              {QUICK_ACTIONS.find((a) => a.type === currentAction)?.label}
            </h3>
            <p>
              {QUICK_ACTIONS.find((a) => a.type === currentAction)?.inputLabel}
            </p>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              min={QUICK_ACTIONS.find((a) => a.type === currentAction)?.inputMin}
              max={QUICK_ACTIONS.find((a) => a.type === currentAction)?.inputMax}
              placeholder="Enter value"
            />
            <div className="dialog-actions">
              <button className="btn-submit" onClick={handleInputSubmit}>
                Generate
              </button>
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowInputDialog(false);
                  setInputValue('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .quick-action-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

        .template-section {
          border-top: 1px solid #eee;
          padding-top: 15px;
        }

        .template-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .template-header h4 {
          margin: 0;
          font-size: 14px;
          color: #333;
        }

        .btn-edit-template {
          padding: 5px 10px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .btn-edit-template:hover {
          background: #0056b3;
        }

        .template-preview {
          margin: 0;
          font-size: 12px;
          color: #666;
          background: #f9f9f9;
          padding: 10px;
          border-radius: 4px;
          font-family: monospace;
          line-height: 1.4;
        }

        .template-editor {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .template-editor textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
          resize: vertical;
        }

        .editor-actions {
          display: flex;
          gap: 8px;
        }

        .btn-save,
        .btn-reset,
        .btn-cancel {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .btn-save {
          background: #28a745;
          color: white;
        }

        .btn-save:hover {
          background: #218838;
        }

        .btn-reset {
          background: #ffc107;
          color: #333;
        }

        .btn-reset:hover {
          background: #e0a800;
        }

        .btn-cancel {
          background: #6c757d;
          color: white;
        }

        .btn-cancel:hover {
          background: #5a6268;
        }

        .input-dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .input-dialog {
          background: white;
          padding: 30px;
          border-radius: 8px;
          max-width: 400px;
          width: 90%;
        }

        .input-dialog h3 {
          margin-top: 0;
          margin-bottom: 15px;
        }

        .input-dialog p {
          margin: 0 0 15px 0;
          color: #666;
          font-size: 14px;
        }

        .input-dialog input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          margin-bottom: 20px;
          box-sizing: border-box;
        }

        .dialog-actions {
          display: flex;
          gap: 10px;
        }

        .btn-submit {
          flex: 1;
          padding: 10px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-submit:hover {
          background: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default QuickStoryboard;
