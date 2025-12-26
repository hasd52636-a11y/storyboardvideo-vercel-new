import React, { useState } from 'react';
import { Language, I18N, Theme } from '../types';

interface QuickStoryboardConfigDialogProps {
  isOpen: boolean;
  actionType: 'multi-grid' | 'narrative-progression';
  lang: Language;
  theme: Theme;
  onConfirm: (count: number) => void;
  onCancel: () => void;
}

const QuickStoryboardConfigDialog: React.FC<QuickStoryboardConfigDialogProps> = ({
  isOpen,
  actionType,
  lang,
  theme,
  onConfirm,
  onCancel
}) => {
  const [count, setCount] = useState(4);
  const t = I18N[lang];

  if (!isOpen) return null;

  const minCount = actionType === 'multi-grid' ? 2 : 1;
  const maxCount = 12;
  const title = actionType === 'multi-grid' 
    ? (lang === 'zh' ? '多格布局配置' : 'Multi-Grid Config')
    : (lang === 'zh' ? '叙事进展配置' : 'Narrative Progression Config');
  
  const label = actionType === 'multi-grid'
    ? (lang === 'zh' ? '分镜数量' : 'Frame Count')
    : (lang === 'zh' ? '分镜数量' : 'Frame Count');

  const handleConfirm = () => {
    if (count >= minCount && count <= maxCount) {
      onConfirm(count);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" onClick={onCancel}>
      <div 
        className={`rounded-2xl p-8 shadow-2xl w-96 ${
          theme === 'dark' 
            ? 'bg-[#1a1a1e] border border-white/10' 
            : 'bg-white border border-zinc-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className={`text-lg font-black uppercase tracking-widest mb-6 ${
          theme === 'dark' ? 'text-white' : 'text-black'
        }`}>
          {title}
        </h2>

        {/* Input Section */}
        <div className="space-y-4 mb-8">
          <label className={`text-sm font-bold uppercase tracking-widest ${
            theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
            {label}
          </label>
          
          {/* Slider */}
          <div className="space-y-3">
            <input
              type="range"
              min={minCount}
              max={maxCount}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full accent-blue-500 h-2 rounded-lg"
            />
            
            {/* Display Value */}
            <div className={`text-center py-3 rounded-lg font-black text-2xl ${
              theme === 'dark'
                ? 'bg-white/5 border border-white/10 text-blue-400'
                : 'bg-blue-50 border border-blue-200 text-blue-600'
            }`}>
              {count}
            </div>

            {/* Range Info */}
            <div className={`text-xs text-center ${
              theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'
            }`}>
              {minCount} - {maxCount}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className={`flex-1 py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${
              theme === 'dark'
                ? 'bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10'
                : 'bg-zinc-100 border border-zinc-300 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {lang === 'zh' ? '取消' : 'Cancel'}
          </button>
          <button
            onClick={handleConfirm}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-blue-700 active:scale-95 transition-all shadow-lg"
          >
            {lang === 'zh' ? '生成' : 'Generate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickStoryboardConfigDialog;
