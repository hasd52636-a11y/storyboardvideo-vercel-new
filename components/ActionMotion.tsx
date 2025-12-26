/**
 * Action Motion Component (一键运动)
 * Displays four motion actions (forward, rotate, jump, fly) with customizable templates
 */

import React, { useState, useEffect } from 'react';

interface ActionConfiguration {
  id: string;
  userId: number;
  forwardTemplate: string;
  rotateTemplate: string;
  jumpTemplate: string;
  flyTemplate: string;
}

interface ActionMotionProps {
  userId: number;
  draggedSymbol?: any;
  onGenerate?: (actionType: string, parameters: Record<string, string>) => void;
  onError?: (error: string) => void;
}

type ActionType = 'forward' | 'rotate' | 'jump' | 'fly';

interface ActionButton {
  type: ActionType;
  label: string;
  icon: string;
  description: string;
  requiresInput: boolean;
}

const ACTION_BUTTONS: ActionButton[] = [
  {
    type: 'forward',
    label: 'Forward Motion',
    icon: '➡️',
    description: 'Smooth forward motion',
    requiresInput: false,
  },
  {
    type: 'rotate',
    label: 'Rotation',
    icon: '🔄',
    description: '360-degree rotation',
    requiresInput: false,
  },
  {
    type: 'jump',
    label: 'Jump Motion',
    icon: '⬆️',
    description: 'Jumping motion',
    requiresInput: false,
  },
  {
    type: 'fly',
    label: 'Flying Motion',
    icon: '✈️',
    description: 'Flying motion',
    requiresInput: false,
  },
];

export const ActionMotion: React.FC<ActionMotionProps> = ({
  userId,
  onGenerate,
  onError,
}) => {
  const [config, setConfig] = useState<ActionConfiguration | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ActionType | null>(null);
  const [templateValues, setTemplateValues] = useState<Record<string, string>>({});
  const [showSubjectDialog, setShowSubjectDialog] = useState(false);
  const [currentAction, setCurrentAction] = useState<ActionType | null>(null);
  const [subjectInput, setSubjectInput] = useState('');

  // Load configuration on mount
  useEffect(() => {
    loadConfig();
  }, [userId]);

  const loadConfig = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/action-configuration?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to load configuration');
      }

      const data = await response.json();
      setConfig(data.config);

      // Initialize template values
      if (data.config) {
        setTemplateValues({
          forward: data.config.forwardTemplate,
          rotate: data.config.rotateTemplate,
          jump: data.config.jumpTemplate,
          fly: data.config.flyTemplate,
        });
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: ActionButton) => {
    setCurrentAction(action.type);
    setShowSubjectDialog(true);
  };

  const handleSubjectSubmit = () => {
    if (!currentAction || !subjectInput.trim()) {
      onError?.('Please enter a subject');
      return;
    }

    triggerGeneration(currentAction, { subject: subjectInput.trim() });
    setShowSubjectDialog(false);
    setSubjectInput('');
  };

  const triggerGeneration = (actionType: ActionType, parameters: Record<string, string>) => {
    onGenerate?.(actionType, parameters);
  };

  const handleEditTemplate = (type: ActionType) => {
    setEditingTemplate(type);
  };

  const handleSaveTemplate = async (type: ActionType, newTemplate: string) => {
    if (!config) return;

    try {
      const response = await fetch(`/api/action-configuration/${config.id}`, {
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

  const handleResetTemplate = async (type: ActionType) => {
    if (!config) return;

    try {
      const response = await fetch(`/api/action-configuration/${config.id}/reset-template`, {
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
    return <div className="action-motion loading">Loading...</div>;
  }

  return (
    <div className="action-motion">
      <div className="action-header">
        <h2>一键运动 (Action Motion)</h2>
        <p>One-click motion generation with customizable templates</p>
      </div>

      <div className="actions-grid">
        {ACTION_BUTTONS.map((action) => (
          <div key={action.type} className="action-card">
            <button
              className="action-button"
              onClick={() => handleActionClick(action)}
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

      {showSubjectDialog && currentAction && (
        <div className="subject-dialog-overlay">
          <div className="subject-dialog">
            <h3>
              {ACTION_BUTTONS.find((a) => a.type === currentAction)?.label}
            </h3>
            <p>Enter the subject for motion generation:</p>
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="e.g., a red car, a person, a bird"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubjectSubmit();
                }
              }}
            />
            <div className="dialog-actions">
              <button className="btn-submit" onClick={handleSubjectSubmit}>
                Generate
              </button>
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowSubjectDialog(false);
                  setSubjectInput('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .action-motion {
          padding: 20px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .action-motion.loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .action-header {
          margin-bottom: 30px;
        }

        .action-header h2 {
          margin: 0 0 10px 0;
          font-size: 24px;
          color: #333;
        }

        .action-header p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .action-card {
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

        .subject-dialog-overlay {
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

        .subject-dialog {
          background: white;
          padding: 30px;
          border-radius: 8px;
          max-width: 400px;
          width: 90%;
        }

        .subject-dialog h3 {
          margin-top: 0;
          margin-bottom: 15px;
        }

        .subject-dialog p {
          margin: 0 0 15px 0;
          color: #666;
          font-size: 14px;
        }

        .subject-dialog input {
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

export default ActionMotion;
