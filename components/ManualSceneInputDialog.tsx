import React, { useState } from 'react';

interface Scene {
  id: string;
  visualPrompt: string;
  videoPrompt?: string;
}

interface ManualSceneInputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (scenes: Scene[]) => void;
  onGenerate: (scenes: Scene[], batchInterval?: number) => void;
  lang: 'zh' | 'en';
  theme: 'dark' | 'light';
  onMinimize?: (isMinimized: boolean) => void;
}

const ManualSceneInputDialog: React.FC<ManualSceneInputDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onGenerate,
  lang,
  theme,
  onMinimize
}) => {
  const [scenes, setScenes] = useState<Scene[]>([
    { id: '1', visualPrompt: '' }
  ]);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchInput, setBatchInput] = useState('');
  const [batchInterval, setBatchInterval] = useState(2000);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const t = {
    zh: {
      title: '生成画面',
      addScene: '添加画面',
      sceneLabel: '画面',
      placeholder: '输入画面描述...',
      confirmScript: '确认脚本',
      generateScenes: '生成画面',
      cancel: '取消',
      deleteConfirm: '确定删除此画面吗？',
      batchMode: '批量输入',
      singleMode: '单个输入',
      batchPlaceholder: '使用 <<< 和 >>> 标记分隔每个场景\n\n示例：\n<<<\n场景1的描述\n>>>\n\n<<<\n场景2的描述\n>>>',
      parseBatch: '解析',
      parseSuccess: '成功解析 {count} 个场景',
      parseError: '未找到有效的场景标记',
      formatGuide: '格式：使用 <<< 和 >>> 标记分隔场景',
      batchGenerate: '批量生成',
      interval: '间隔时间',
      intervalMs: '毫秒',
      generating: '生成中...',
      progress: '进度'
    },
    en: {
      title: 'Generate Scenes',
      addScene: 'Add Scene',
      sceneLabel: 'Scene',
      placeholder: 'Enter scene description...',
      confirmScript: 'Confirm Script',
      generateScenes: 'Generate Scenes',
      cancel: 'Cancel',
      deleteConfirm: 'Delete this scene?',
      batchMode: 'Batch Input',
      singleMode: 'Single Input',
      batchPlaceholder: 'Use <<< and >>> to separate scenes\n\nExample:\n<<<\nScene 1 description\n>>>\n\n<<<\nScene 2 description\n>>>',
      parseBatch: 'Parse',
      parseSuccess: 'Successfully parsed {count} scenes',
      parseError: 'No valid scene markers found',
      formatGuide: 'Format: Use <<< and >>> to separate scenes',
      batchGenerate: 'Batch Generate',
      interval: 'Interval',
      intervalMs: 'ms',
      generating: 'Generating...',
      progress: 'Progress'
    }
  };

  const labels = t[lang];

  const handleAddScene = () => {
    const newId = String(Math.max(...scenes.map(s => parseInt(s.id) || 0)) + 1);
    setScenes([...scenes, { id: newId, visualPrompt: '' }]);
  };

  const handleDeleteScene = (id: string) => {
    if (scenes.length > 1) {
      setScenes(scenes.filter(s => s.id !== id));
    }
  };

  const handleUpdateScene = (id: string, visualPrompt: string, videoPrompt?: string) => {
    setScenes(scenes.map(s => s.id === id ? { ...s, visualPrompt, videoPrompt } : s));
  };

  const handleDownloadTemplate = () => {
    const template = lang === 'zh' 
      ? `<<<
场景1的画面描述
>>>

场景1的视频提示词

<<<
场景2的画面描述
>>>

场景2的视频提示词

<<<
场景3的画面描述
>>>

场景3的视频提示词`
      : `<<<
Scene 1 visual description
>>>

Scene 1 video prompt

<<<
Scene 2 visual description
>>>

Scene 2 video prompt

<<<
Scene 3 visual description
>>>

Scene 3 video prompt`;

    const element = document.createElement('a');
    const file = new Blob([template], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `batch_scenes_template_${lang}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setBatchInput(content);
      
      // 自动解析 - 分开的格式
      const sceneRegex = /<<<([\s\S]*?)>>>\s*([\s\S]*?)(?=<<<|$)/g;
      const matches = Array.from(content.matchAll(sceneRegex));
      
      if (matches.length > 0) {
        const parsedScenes: Scene[] = matches.map((match, index) => {
          const visualPrompt = match[1].trim();
          const videoPrompt = match[2].trim();
          
          return {
            id: String(index + 1),
            visualPrompt: visualPrompt,
            videoPrompt: videoPrompt && videoPrompt.length > 0 ? videoPrompt : undefined
          };
        }).filter(scene => scene.visualPrompt.length > 0);

        if (parsedScenes.length > 0) {
          setScenes(parsedScenes);
          // 自动切换到单个模式显示导入的场景
          setIsBatchMode(false);
          setBatchInput(''); // 清空批量输入框
          alert(lang === 'zh' 
            ? `成功导入 ${parsedScenes.length} 个场景，已切换到单个编辑模式` 
            : `Successfully imported ${parsedScenes.length} scenes, switched to single edit mode`);
        }
      }
    };
    reader.readAsText(file);
    
    // 重置 input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleParseBatch = () => {
    const sceneRegex = /<<<([\s\S]*?)>>>/g;
    const matches = Array.from(batchInput.matchAll(sceneRegex));
    
    if (matches.length === 0) {
      alert(lang === 'zh' ? '未找到有效的场景标记' : 'No valid scene markers found');
      return;
    }

    const parsedScenes: Scene[] = matches.map((match, index) => ({
      id: String(index + 1),
      visualPrompt: match[1].trim()
    })).filter(scene => scene.visualPrompt.length > 0);

    if (parsedScenes.length === 0) {
      alert(lang === 'zh' ? '未找到有效的场景内容' : 'No valid scene content found');
      return;
    }

    setScenes(parsedScenes);
    // 自动切换到单个模式，显示导入的场景
    setIsBatchMode(false);
    setBatchInput(''); // 清空批量输入框
    alert(lang === 'zh' 
      ? `成功解析 ${parsedScenes.length} 个场景，已切换到单个编辑模式` 
      : `Successfully parsed ${parsedScenes.length} scenes, switched to single edit mode`);
  };

  const handleConfirm = () => {
    onConfirm(scenes);
  };

  const handleGenerate = () => {
    const validScenes = scenes.filter(s => s.visualPrompt.trim().length > 0);
    if (validScenes.length === 0) {
      alert(lang === 'zh' ? '请至少填入一个画面描述' : 'Please enter at least one scene description');
      return;
    }
    // 传递间隔时间给父组件
    onGenerate(validScenes, isBatchMode ? batchInterval : undefined);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    onMinimize?.(true);
  };

  const handleRestore = () => {
    setIsMinimized(false);
    onMinimize?.(false);
  };

  if (!isOpen) return null;

  // 最小化状态：显示浮动进度指示器
  if (isMinimized && isBatchMode && isGenerating) {
    const progressPercent = generationProgress.total > 0 
      ? (generationProgress.current / generationProgress.total) * 100 
      : 0;
    const circumference = 2 * Math.PI * 40; // 半径40
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    return (
      <div
        onClick={handleRestore}
        className="fixed bottom-20 left-4 z-40 cursor-pointer transition-all hover:scale-110"
        title={lang === 'zh' ? '点击恢复窗口' : 'Click to restore'}
      >
        {/* 外层发光效果 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 opacity-30 blur-lg animate-pulse" />
        
        {/* 进度圆环 */}
        <svg className="w-16 h-16 relative z-10" viewBox="0 0 100 100">
          {/* 背景圆 */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={theme === 'dark' ? '#27272a' : '#e4e4e7'}
            strokeWidth="2"
          />
          
          {/* 进度圆 */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
          />
          
          {/* 渐变定义 */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* 中心百分比 */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className={`text-sm font-black ${
            theme === 'dark' ? 'text-green-400' : 'text-green-500'
          }`}>
            {Math.round(progressPercent)}%
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${
      theme === 'dark' ? 'bg-black/50' : 'bg-white/50'
    }`}>
      <div className={`${
        theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-200'
      } border rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col`}>
        
        {/* Header */}
        <div className={`${
          theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
        } border-b px-6 py-4 flex items-center justify-between`}>
          <h2 className={`text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            {labels.title}
          </h2>
          <div className="flex items-center gap-4">
            {/* Mode Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBatchMode}
                onChange={(e) => setIsBatchMode(e.target.checked)}
                disabled={isGenerating}
                className="w-4 h-4 rounded"
              />
              <span className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
              }`}>
                {isBatchMode ? labels.batchMode : labels.singleMode}
              </span>
            </label>
            
            <button
              onClick={handleMinimize}
              className={`p-1 rounded hover:${theme === 'dark' ? 'bg-zinc-700' : 'bg-zinc-200'}`}
              title={lang === 'zh' ? '最小化' : 'Minimize'}
            >
              −
            </button>
            
            <button
              onClick={onClose}
              disabled={isGenerating}
              className={`p-1 rounded hover:${theme === 'dark' ? 'bg-zinc-700' : 'bg-zinc-200'} ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-y-auto px-6 py-4 space-y-4`}>
          {isBatchMode ? (
            // Batch Mode
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-blue-500/10 border-blue-500/30' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <p className={`text-xs font-semibold mb-3 ${
                  theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                }`}>
                  {labels.formatGuide}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadTemplate}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-bold transition-all ${
                      theme === 'dark'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    ⬇️
                    {lang === 'zh' ? '下载模板' : 'Download Template'}
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-bold transition-all ${
                      theme === 'dark'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    📤
                    {lang === 'zh' ? '批量导入' : 'Batch Import'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <textarea
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value)}
                placeholder={labels.batchPlaceholder}
                disabled={isGenerating}
                className={`w-full h-64 p-3 rounded border ${
                  theme === 'dark'
                    ? 'bg-zinc-700 border-zinc-600 text-white placeholder-zinc-500'
                    : 'bg-white border-zinc-300 text-black placeholder-zinc-400'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50`}
              />

              {/* Interval Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase opacity-50">
                  <span>{labels.interval}</span>
                  <span>{batchInterval} {labels.intervalMs}</span>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="10000" 
                  step="500" 
                  value={batchInterval} 
                  onChange={e => setBatchInterval(Number(e.target.value))}
                  disabled={isGenerating}
                  className="w-full accent-purple-600 h-1 disabled:opacity-50"
                />
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => setBatchInterval(500)}
                    disabled={isGenerating}
                    className={`flex-1 px-2 py-1 rounded text-xs font-bold transition-all ${
                      theme === 'dark'
                        ? 'bg-white/5 border border-white/10 hover:border-purple-500/50'
                        : 'bg-zinc-50 border border-zinc-300 hover:border-purple-500'
                    } disabled:opacity-50`}
                  >
                    0.5s
                  </button>
                  <button
                    onClick={() => setBatchInterval(2000)}
                    disabled={isGenerating}
                    className={`flex-1 px-2 py-1 rounded text-xs font-bold transition-all ${
                      theme === 'dark'
                        ? 'bg-white/5 border border-white/10 hover:border-purple-500/50'
                        : 'bg-zinc-50 border border-zinc-300 hover:border-purple-500'
                    } disabled:opacity-50`}
                  >
                    2s
                  </button>
                  <button
                    onClick={() => setBatchInterval(5000)}
                    disabled={isGenerating}
                    className={`flex-1 px-2 py-1 rounded text-xs font-bold transition-all ${
                      theme === 'dark'
                        ? 'bg-white/5 border border-white/10 hover:border-purple-500/50'
                        : 'bg-zinc-50 border border-zinc-300 hover:border-purple-500'
                    } disabled:opacity-50`}
                  >
                    5s
                  </button>
                </div>
              </div>

              {/* Progress Display */}
              {isGenerating && generationProgress.total > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase opacity-50">
                    <span>{labels.progress}</span>
                    <span>{generationProgress.current} / {generationProgress.total}</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${
                    theme === 'dark' ? 'bg-zinc-700' : 'bg-zinc-200'
                  }`}>
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all"
                      style={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Single Mode
            <>
              {scenes.map((scene, index) => (
                <div key={scene.id} className={`${
                  theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
                } border rounded-lg p-4 space-y-3`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-sm font-semibold ${
                      theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
                    }`}>
                      {labels.sceneLabel} {index + 1} - {lang === 'zh' ? '画面提示词' : 'Visual Prompt'}
                    </label>
                    {scenes.length > 1 && (
                      <button
                        onClick={() => handleDeleteScene(scene.id)}
                        className={`p-1 rounded hover:${theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'}`}
                        title={labels.deleteConfirm}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  <textarea
                    value={scene.visualPrompt}
                    onChange={(e) => handleUpdateScene(scene.id, e.target.value, scene.videoPrompt)}
                    placeholder={labels.placeholder}
                    className={`w-full h-20 p-3 rounded border ${
                      theme === 'dark'
                        ? 'bg-zinc-700 border-zinc-600 text-white placeholder-zinc-500'
                        : 'bg-white border-zinc-300 text-black placeholder-zinc-400'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                  />
                  <div className={`text-xs mt-2 ${
                    theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'
                  }`}>
                    {scene.visualPrompt.length} / 500
                  </div>

                  {/* Video Prompt */}
                  <div className="mt-4 pt-3 border-t border-zinc-600">
                    <label className={`text-sm font-semibold ${
                      theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
                    }`}>
                      {lang === 'zh' ? '视频提示词' : 'Video Prompt'} {lang === 'zh' ? '(可选)' : '(Optional)'}
                    </label>
                    <textarea
                      value={scene.videoPrompt || ''}
                      onChange={(e) => handleUpdateScene(scene.id, scene.visualPrompt, e.target.value)}
                      placeholder={lang === 'zh' ? '输入视频提示词...' : 'Enter video prompt...'}
                      className={`w-full h-16 p-3 rounded border mt-2 ${
                        theme === 'dark'
                          ? 'bg-zinc-700 border-zinc-600 text-white placeholder-zinc-500'
                          : 'bg-white border-zinc-300 text-black placeholder-zinc-400'
                      } focus:outline-none focus:ring-2 focus:ring-green-500 resize-none`}
                    />
                    <div className={`text-xs mt-2 ${
                      theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'
                    }`}>
                      {(scene.videoPrompt || '').length} / 500
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Scene Button */}
              <button
                onClick={handleAddScene}
                className={`w-full py-3 px-4 rounded border-2 border-dashed ${
                  theme === 'dark'
                    ? 'border-zinc-600 hover:border-zinc-500 text-zinc-400 hover:text-zinc-300'
                    : 'border-zinc-300 hover:border-zinc-400 text-zinc-600 hover:text-zinc-700'
                } flex items-center justify-center gap-2 transition-colors`}
              >
                ➕
                {labels.addScene}
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className={`${
          theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
        } border-t px-6 py-4 flex gap-3 justify-end`}>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-zinc-700 hover:bg-zinc-600 text-white disabled:opacity-50'
                : 'bg-zinc-200 hover:bg-zinc-300 text-black disabled:opacity-50'
            }`}
          >
            {labels.cancel}
          </button>
          
          {isBatchMode ? (
            <>
              <button
                onClick={handleParseBatch}
                disabled={isGenerating || !batchInput.trim()}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50'
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50'
                }`}
              >
                {labels.parseBatch}
              </button>
              <button
                onClick={() => {
                  // 直接生成，不切换模式
                  const sceneRegex = /<<<([\s\S]*?)>>>/g;
                  const matches = Array.from(batchInput.matchAll(sceneRegex));
                  
                  if (matches.length === 0) {
                    alert(lang === 'zh' ? '未找到有效的场景标记' : 'No valid scene markers found');
                    return;
                  }

                  const parsedScenes: Scene[] = matches.map((match, index) => ({
                    id: String(index + 1),
                    visualPrompt: match[1].trim()
                  })).filter(scene => scene.visualPrompt.length > 0);

                  if (parsedScenes.length === 0) {
                    alert(lang === 'zh' ? '未找到有效的场景内容' : 'No valid scene content found');
                    return;
                  }

                  onGenerate(parsedScenes, batchInterval);
                }}
                disabled={isGenerating || !batchInput.trim()}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-green-600 hover:bg-green-700 text-white disabled:opacity-50'
                    : 'bg-green-500 hover:bg-green-600 text-white disabled:opacity-50'
                }`}
              >
                {isGenerating ? labels.generating : labels.batchGenerate}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleConfirm}
                disabled={isGenerating}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
                    : 'bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50'
                }`}
              >
                {labels.confirmScript}
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || scenes.length === 0}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-green-600 hover:bg-green-700 text-white disabled:opacity-50'
                    : 'bg-green-500 hover:bg-green-600 text-white disabled:opacity-50'
                }`}
              >
                {labels.generateScenes}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManualSceneInputDialog;
