import React, { useState } from 'react';
import { Theme, Language, I18N } from '../types';

interface PromptReviewDialogProps {
  prompt: string;
  imagePreview: string;
  onConfirm: (prompt: string) => void;
  onCancel: () => void;
  onEdit: (newPrompt: string) => void;
  theme: Theme;
  lang: Language;
  isLoading?: boolean;
}

const PromptReviewDialog: React.FC<PromptReviewDialogProps> = ({
  prompt,
  imagePreview,
  onConfirm,
  onCancel,
  onEdit,
  theme,
  lang,
  isLoading = false,
}) => {
  const [editedPrompt, setEditedPrompt] = useState(prompt);
  const [isEditing, setIsEditing] = useState(false);
  const t = I18N[lang];

  const handleConfirm = () => {
    if (editedPrompt.trim().length === 0) {
      alert(lang === 'zh' ? '提示词不能为空' : 'Prompt cannot be empty');
      return;
    }
    onConfirm(editedPrompt);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editedPrompt.trim().length === 0) {
      alert(lang === 'zh' ? '提示词不能为空' : 'Prompt cannot be empty');
      return;
    }
    onEdit(editedPrompt);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
      <div
        className={`max-w-3xl w-full rounded-[2rem] p-8 border flex flex-col shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto ${
          theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200'
        }`}
      >
        {/* Header */}
        <h3
          className={`text-lg font-black uppercase tracking-widest mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}
        >
          {lang === 'zh' ? '审查生成的提示词' : 'Review Generated Prompt'}
        </h3>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-6">
            <p
              className={`text-xs font-black uppercase tracking-widest mb-2 ${
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
              }`}
            >
              {lang === 'zh' ? '截图预览' : 'Screenshot Preview'}
            </p>
            <img
              src={imagePreview}
              alt="Screenshot preview"
              className="w-full max-h-[200px] object-contain rounded-xl border"
              style={{
                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              }}
            />
          </div>
        )}

        {/* Prompt Display/Edit */}
        <div className="mb-6">
          <p
            className={`text-xs font-black uppercase tracking-widest mb-2 ${
              theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
            }`}
          >
            {lang === 'zh' ? '生成的提示词' : 'Generated Prompt'}
          </p>

          {isEditing ? (
            <textarea
              value={editedPrompt}
              onChange={(e) => setEditedPrompt(e.target.value)}
              className={`w-full rounded-xl p-4 text-sm font-bold border bg-transparent outline-none focus:border-purple-500/50 resize-none min-h-[150px] ${
                theme === 'dark'
                  ? 'border-white/5 text-white'
                  : 'border-zinc-200 text-black'
              }`}
              disabled={isLoading}
            />
          ) : (
            <div
              className={`w-full rounded-xl p-4 text-sm font-bold border min-h-[150px] overflow-y-auto ${
                theme === 'dark'
                  ? 'border-white/5 text-white bg-zinc-800/50'
                  : 'border-zinc-200 text-black bg-zinc-50'
              }`}
            >
              {editedPrompt}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mb-6 flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <span
              className={`text-xs font-black uppercase tracking-widest ${
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
              }`}
            >
              {lang === 'zh' ? '生成中...' : 'Generating...'}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className={`flex-1 min-w-[120px] py-3 border rounded-xl uppercase font-black text-sm transition-all ${
              theme === 'dark'
                ? 'border-zinc-500 text-zinc-500 hover:bg-zinc-500 hover:text-white disabled:opacity-50'
                : 'border-zinc-400 text-zinc-600 hover:bg-zinc-200 hover:text-black disabled:opacity-50'
            }`}
          >
            {lang === 'zh' ? '取消' : 'Cancel'}
          </button>

          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setEditedPrompt(prompt);
                  setIsEditing(false);
                }}
                disabled={isLoading}
                className={`flex-1 min-w-[120px] py-3 border rounded-xl uppercase font-black text-sm transition-all ${
                  theme === 'dark'
                    ? 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white disabled:opacity-50'
                    : 'border-blue-400 text-blue-600 hover:bg-blue-100 hover:text-black disabled:opacity-50'
                }`}
              >
                {lang === 'zh' ? '重置' : 'Reset'}
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isLoading}
                className="flex-1 min-w-[120px] py-3 bg-blue-600 text-white rounded-xl uppercase font-black text-sm shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {lang === 'zh' ? '保存编辑' : 'Save Edit'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                disabled={isLoading}
                className={`flex-1 min-w-[120px] py-3 border rounded-xl uppercase font-black text-sm transition-all ${
                  theme === 'dark'
                    ? 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white disabled:opacity-50'
                    : 'border-blue-400 text-blue-600 hover:bg-blue-100 hover:text-black disabled:opacity-50'
                }`}
              >
                {lang === 'zh' ? '编辑' : 'Edit'}
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="flex-1 min-w-[120px] py-3 bg-purple-600 text-white rounded-xl uppercase font-black text-sm shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {lang === 'zh' ? '确认生成' : 'Confirm & Generate'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptReviewDialog;
