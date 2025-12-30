import React, { useState, useEffect } from 'react';

interface FrameData {
  id: string;
  prompt: string;
  symbols: Array<{ name: string }>;
  order?: number;
}

interface VideoGenDialogProps {
  onGenerate: (prompt: string, options: any) => void;
  onGenerateBatch?: (prompts: string[], options: any, selectedFrames?: FrameData[]) => void;
  onCancel: () => void;
  initialPrompt?: string;
  lang?: 'zh' | 'en';
  selectedFrames?: FrameData[];
  symbolDescriptions?: Record<string, Record<string, string>>;
  optimizedPrompts?: string;
  batchProgress?: { current: number; total: number };
  isMinimized?: boolean;
  onMinimize?: () => void;
  currentSymbols?: Array<{ name: string }>;
}

export default function VideoGenDialog({
  onGenerate,
  onGenerateBatch,
  onCancel,
  initialPrompt = '',
  lang = 'zh',
  selectedFrames = [],
  symbolDescriptions = {},
  optimizedPrompts = '',
  batchProgress = { current: 0, total: 0 },
  isMinimized = false,
  onMinimize,
  currentSymbols = []
}: VideoGenDialogProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [customPrompt, setCustomPrompt] = useState('');
  const [visualPrompt, setVisualPrompt] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [model, setModel] = useState<'sora-2' | 'sora-2-pro' | 'cogvideox-flash' | 'cogvideox-3'>('sora-2');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [duration, setDuration] = useState(10);
  const [hd, setHd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchPrompts, setBatchPrompts] = useState<string[]>([]);
  const [intervalMinutes, setIntervalMinutes] = useState(5);
  const [language, setLanguage] = useState('');
  const [downloadPath, setDownloadPath] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // 批量生成数量限制
  const MAX_BATCH_VIDEOS = 50;
  const exceedsLimit = batchPrompts.length > MAX_BATCH_VIDEOS;

  useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      // 用 ****** 分隔符分割脚本
      const scripts = content.split('******').map(s => s.trim()).filter(s => s.length > 0);
      setBatchPrompts(scripts);
    };
    reader.readAsText(file);
  };

  const handleGenerateBatch = async () => {
    if (batchPrompts.length === 0) {
      alert(lang === 'zh' ? '请上传脚本文件' : 'Please upload script file');
      return;
    }

    if (exceedsLimit) {
      alert(lang === 'zh' 
        ? `批量生成数量不能超过 ${MAX_BATCH_VIDEOS} 个，当前有 ${batchPrompts.length} 个脚本` 
        : `Batch generation cannot exceed ${MAX_BATCH_VIDEOS} videos. Current: ${batchPrompts.length} scripts`);
      return;
    }

    setIsLoading(true);
    try {
      if (onGenerateBatch) {
        await onGenerateBatch(batchPrompts, {
          model,
          aspect_ratio: aspectRatio,
          duration,
          hd,
          intervalMinutes,
          language,
          downloadPath
        }, selectedFrames);
      }
      onCancel();
    } catch (error) {
      console.error('Batch video generation error:', error);
      alert(lang === 'zh' 
        ? `生成失败: ${error instanceof Error ? error.message : String(error)}` 
        : `Generation failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    // 合并画面提示词和视频提示词
    const combinedPrompt = `${visualPrompt}\n${videoPrompt}`.trim();

    if (!combinedPrompt) {
      alert(lang === 'zh' ? '请输入画面提示词或视频提示词' : 'Please enter visual or video prompt');
      return;
    }

    if (combinedPrompt.length > 760) {
      alert(lang === 'zh' ? '提示词总长度不能超过760个字符' : 'Total prompt length cannot exceed 760 characters');
      return;
    }

    setIsLoading(true);
    try {
      await onGenerate(combinedPrompt, {
        model,
        aspect_ratio: aspectRatio,
        duration,
        hd,
        selectedFrames: selectedFrames
      });
    } catch (error) {
      console.error('Video generation error:', error);
      alert(lang === 'zh' 
        ? `生成失败: ${error instanceof Error ? error.message : String(error)}` 
        : `Generation failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '30px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 最小化按钮 */}
        {onMinimize && (
          <button
            onClick={onMinimize}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              width: '30px',
              height: '30px',
              backgroundColor: '#f0f0f0',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666'
            }}
            title={lang === 'zh' ? '最小化' : 'Minimize'}
          >
            −
          </button>
        )}
        <h2 style={{ marginTop: 0 }}>{lang === 'zh' ? '生成视频' : 'Generate Video'}</h2>

        {/* 批量生成复选框 */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isBatchMode}
              onChange={(e) => {
                setIsBatchMode(e.target.checked);
                if (!e.target.checked) {
                  setBatchPrompts([]);
                }
              }}
            />
            <span style={{ fontWeight: 'bold' }}>{lang === 'zh' ? '批量生成' : 'Batch Generate'}</span>
          </label>
        </div>

        {/* 批量模式：文件上传 */}
        {isBatchMode ? (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              {lang === 'zh' ? '上传脚本文件' : 'Upload Script File'}
            </label>
            <div style={{
              border: '2px dashed #4CAF50',
              borderRadius: '4px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: '#f9f9f9'
            }}
            onClick={() => fileInputRef.current?.click()}
            >
              <div style={{ fontSize: '14px', color: '#666' }}>
                {batchPrompts.length > 0 
                  ? `✓ ${lang === 'zh' ? '已加载' : 'Loaded'} ${batchPrompts.length} ${lang === 'zh' ? '个脚本' : 'scripts'}`
                  : (lang === 'zh' ? '点击上传或拖拽文件' : 'Click to upload or drag file')}
              </div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                {lang === 'zh' ? '用 ****** 分隔多个脚本' : 'Separate scripts with ******'}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />

            {/* 数量计数器和警告 */}
            <div style={{ marginTop: '12px', padding: '12px', backgroundColor: exceedsLimit ? '#fff3cd' : '#e8f5e9', borderRadius: '4px', border: `1px solid ${exceedsLimit ? '#ffc107' : '#4CAF50'}` }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: exceedsLimit ? '#856404' : '#2e7d32' }}>
                {lang === 'zh' ? '脚本数量' : 'Script Count'}: {batchPrompts.length} / {MAX_BATCH_VIDEOS}
              </div>
              {exceedsLimit && (
                <div style={{ fontSize: '12px', color: '#856404', marginTop: '8px' }}>
                  ⚠️ {lang === 'zh' 
                    ? `超过限制！最多只能生成 ${MAX_BATCH_VIDEOS} 个视频，请删除多余脚本。` 
                    : `Exceeds limit! Maximum ${MAX_BATCH_VIDEOS} videos allowed. Please remove extra scripts.`}
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                {lang === 'zh' ? '视频语言' : 'Video Language'}
              </label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value.slice(0, 8))}
                placeholder={lang === 'zh' ? '例如：中文、英文、日文（最多8字）' : 'e.g. English, Chinese, Japanese (max 8 chars)'}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                {lang === 'zh' 
                  ? `${language.length}/8 字符 - 控制视频对话和字幕语言` 
                  : `${language.length}/8 chars - Controls video dialogue and subtitle language`}
              </div>
            </div>

            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                {lang === 'zh' ? '下载目录' : 'Download Directory'}
              </label>
              <input
                type="text"
                value={downloadPath}
                onChange={(e) => setDownloadPath(e.target.value)}
                placeholder={lang === 'zh' ? '输入本地下载目录路径' : 'Enter local download directory path'}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                {lang === 'zh' 
                  ? '生成的视频将自动下载到此目录' 
                  : 'Generated videos will be automatically downloaded to this directory'}
              </div>
            </div>

            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                {lang === 'zh' ? '视频间隔时间' : 'Interval Between Videos'}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={intervalMinutes}
                  onChange={(e) => setIntervalMinutes(Number(e.target.value))}
                  style={{
                    flex: 1,
                    height: '6px',
                    borderRadius: '3px',
                    background: '#ddd',
                    outline: 'none',
                    WebkitAppearance: 'slider-horizontal'
                  }}
                />
                <span style={{ 
                  fontWeight: 'bold', 
                  color: '#4CAF50',
                  minWidth: '60px',
                  textAlign: 'right'
                }}>
                  {intervalMinutes} {lang === 'zh' ? '分钟' : 'min'}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                {lang === 'zh' 
                  ? `每个视频生成后等待 ${intervalMinutes} 分钟再生成下一个` 
                  : `Wait ${intervalMinutes} minutes between each video generation`}
              </div>
            </div>
          </div>
        ) : (
          /* 单个模式：两个提示词输入框 */
          <div style={{ marginBottom: '20px' }}>
            {/* 画面提示词 */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                {lang === 'zh' ? '画面提示词' : 'Visual Prompt'}
              </label>
              <textarea
                value={visualPrompt}
                onChange={(e) => setVisualPrompt(e.target.value.slice(0, 380))}
                placeholder={lang === 'zh' ? '描述画面的视觉内容、场景、人物等...' : 'Describe visual content, scene, characters, etc...'}
                style={{
                  width: '100%',
                  height: '80px',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'Arial, sans-serif',
                  backgroundColor: '#fff',
                  cursor: 'text'
                }}
              />
              <div style={{ marginTop: '4px', fontSize: '12px', color: visualPrompt.length > 350 ? '#ff6b6b' : '#999' }}>
                {visualPrompt.length} / 380
              </div>
            </div>

            {/* 视频提示词 */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                {lang === 'zh' ? '视频提示词' : 'Video Prompt'}
                {selectedFrames.length > 0 && <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>({lang === 'zh' ? '图生图模式' : 'Image-to-Video'})</span>}
              </label>
              <textarea
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value.slice(0, 380))}
                placeholder={selectedFrames.length > 0 
                  ? (lang === 'zh' ? '描述视频中的动作、效果、镜头运动等...' : 'Describe actions, effects, camera movements, etc...')
                  : (lang === 'zh' ? '描述视频的动作、效果、音乐等...' : 'Describe video actions, effects, music, etc...')}
                style={{
                  width: '100%',
                  height: '80px',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'Arial, sans-serif',
                  backgroundColor: '#fff',
                  cursor: 'text'
                }}
              />
              <div style={{ marginTop: '4px', fontSize: '12px', color: videoPrompt.length > 350 ? '#ff6b6b' : '#999' }}>
                {videoPrompt.length} / 380
              </div>
            </div>
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            {lang === 'zh' ? '模型' : 'Model'}
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value as any)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <optgroup label={lang === 'zh' ? 'OpenAI Sora' : 'OpenAI Sora'}>
              <option value="sora-2">{lang === 'zh' ? 'Sora 2 (基础)' : 'Sora 2 (Basic)'}</option>
              <option value="sora-2-pro">{lang === 'zh' ? 'Sora 2 Pro (专业)' : 'Sora 2 Pro (Professional)'}</option>
            </optgroup>
            <optgroup label={lang === 'zh' ? '智谱 CogVideoX' : 'Zhipu CogVideoX'}>
              <option value="cogvideox-flash">{lang === 'zh' ? 'CogVideoX-Flash (快速)' : 'CogVideoX-Flash (Fast)'}</option>
              <option value="cogvideox-3">{lang === 'zh' ? 'CogVideoX-3 (高质量)' : 'CogVideoX-3 (High Quality)'}</option>
            </optgroup>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            {lang === 'zh' ? '宽高比' : 'Aspect Ratio'}
          </label>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value as any)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="16:9">{lang === 'zh' ? '横屏 (16:9)' : 'Landscape (16:9)'}</option>
            <option value="9:16">{lang === 'zh' ? '竖屏 (9:16)' : 'Portrait (9:16)'}</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            {lang === 'zh' ? '时长 (秒)' : 'Duration (seconds)'}
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value={10}>{lang === 'zh' ? '10 秒' : '10 seconds'}</option>
            <option value={15}>{lang === 'zh' ? '15 秒' : '15 seconds'}</option>
            <option value={25}>{lang === 'zh' ? '25 秒' : '25 seconds'}</option>
          </select>
        </div>

        {model === 'sora-2-pro' && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={hd}
                onChange={(e) => setHd(e.target.checked)}
              />
              <span>{lang === 'zh' ? '启用高清 (生成时间更长)' : 'Enable HD (longer generation time)'}</span>
            </label>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={isBatchMode ? handleGenerateBatch : handleGenerate}
            disabled={isLoading || (isBatchMode ? (batchPrompts.length === 0 || exceedsLimit) : !(visualPrompt.trim() || videoPrompt.trim()))}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: isLoading || (isBatchMode ? (batchPrompts.length === 0 || exceedsLimit) : !(visualPrompt.trim() || videoPrompt.trim())) ? '#ccc' : '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading || (isBatchMode ? (batchPrompts.length === 0 || exceedsLimit) : !(visualPrompt.trim() || videoPrompt.trim())) ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {isLoading ? (lang === 'zh' ? '生成中...' : 'Generating...') : (lang === 'zh' ? '开始生成' : 'Generate')}
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#999',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {lang === 'zh' ? '取消' : 'Cancel'}
          </button>
        </div>

        {/* 符号库信息显示 - 仅在剧本模式下显示 */}
        {isBatchMode && (
          <div style={{ marginBottom: '0px', padding: '12px', backgroundColor: currentSymbols && currentSymbols.length > 0 ? '#e8f5e9' : '#f5f5f5', borderRadius: '4px', border: currentSymbols && currentSymbols.length > 0 ? '1px solid #4CAF50' : '1px solid #ddd' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: currentSymbols && currentSymbols.length > 0 ? '#2e7d32' : '#666', marginBottom: '8px' }}>
              {lang === 'zh' ? '📹 分镜上标记的镜头运动' : '📹 Marked Camera Movements'}
            </div>
            {currentSymbols && currentSymbols.length > 0 ? (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {currentSymbols.map((symbol, idx) => {
                    const symbolName = symbol.name;
                    const descriptions = symbolDescriptions || {};
                    const langDescriptions = descriptions[lang] || descriptions['en'] || {};
                    const description = langDescriptions[symbolName] || symbolName;
                    
                    return (
                      <div
                        key={idx}
                        style={{
                          padding: '6px 10px',
                          backgroundColor: '#fff',
                          borderRadius: '3px',
                          border: '1px solid #4CAF50',
                          fontSize: '12px',
                          color: '#2e7d32',
                          display: 'inline-block'
                        }}
                        title={description}
                      >
                        {description}
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontSize: '11px', color: '#555', marginTop: '8px' }}>
                  {lang === 'zh' 
                    ? '💡 这些符号描述已被追加到提示词中。如果你修改了提示词，请确保保留这些描述以获得最佳效果' 
                    : '💡 These symbol descriptions have been added to the prompt. If you modify the prompt, please keep these descriptions for best results'}
                </div>
              </>
            ) : (
              <div style={{ fontSize: '12px', color: '#999' }}>
                {lang === 'zh' ? '未标记任何符号' : 'No symbols marked'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
