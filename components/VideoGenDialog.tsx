import React, { useState, useEffect } from 'react';

interface FrameData {
  id: string;
  prompt: string;
  symbols: Array<{ name: string }>;
  order?: number;
}

interface VideoGenDialogProps {
  onGenerate: (prompt: string, options: any) => void;
  onCancel: () => void;
  initialPrompt?: string;
  lang?: 'zh' | 'en';
  selectedFrames?: FrameData[];
  symbolDescriptions?: Record<string, Record<string, string>>;
  optimizedPrompts?: { zh: string; en: string };
}

export default function VideoGenDialog({
  onGenerate,
  onCancel,
  initialPrompt = '',
  lang = 'zh',
  selectedFrames = [],
  symbolDescriptions = {},
  optimizedPrompts = { zh: '', en: '' }
}: VideoGenDialogProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [customPrompt, setCustomPrompt] = useState('');
  const [model, setModel] = useState<'sora-2' | 'sora-2-pro'>('sora-2');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [duration, setDuration] = useState(10);
  const [hd, setHd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  const handleGenerate = async () => {
    // 图生图模式：如果有选中的分镜，使用简洁的动作描述
    // 纯文本模式：使用完整的提示词
    let promptToUse: string;
    
    if (selectedFrames.length > 0) {
      // 图生图模式：使用自定义提示词或简洁的动作描述
      promptToUse = customPrompt.trim() || prompt.trim();
    } else {
      // 纯文本模式：使用完整的提示词
      promptToUse = customPrompt.trim() || prompt.trim();
    }

    if (!promptToUse.trim()) {
      alert(lang === 'zh' ? '请输入视频提示词' : 'Please enter video prompt');
      return;
    }

    if (promptToUse.length > 760) {
      alert(lang === 'zh' ? '提示词不能超过760个字符' : 'Prompt cannot exceed 760 characters');
      return;
    }

    setIsLoading(true);
    try {
      await onGenerate(promptToUse, {
        model,
        aspect_ratio: aspectRatio,
        duration,
        hd
      });
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
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0 }}>{lang === 'zh' ? '生成视频' : 'Generate Video'}</h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            {lang === 'zh' ? '视频提示词' : 'Video Prompt'}
            {selectedFrames.length > 0 && <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>({lang === 'zh' ? '图生图模式' : 'Image-to-Video'})</span>}
          </label>
          <textarea
            value={customPrompt || prompt}
            onChange={(e) => setCustomPrompt(e.target.value.slice(0, 760))}
            placeholder={selectedFrames.length > 0 
              ? (lang === 'zh' ? '描述视频中的动作、效果等...' : 'Describe actions, effects, etc...')
              : (lang === 'zh' ? '描述你想要生成的视频内容...' : 'Describe the video content you want to generate...')}
            style={{
              width: '100%',
              height: '100px',
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
          <div style={{ marginTop: '4px', fontSize: '12px', color: (customPrompt || prompt).length > 700 ? '#ff6b6b' : '#999' }}>
            {(customPrompt || prompt).length} / 760
            {selectedFrames.length > 0 && !customPrompt && <span style={{ marginLeft: '10px', color: '#666' }}>({lang === 'zh' ? '基于分镜图生成' : 'Based on storyboard'})</span>}
          </div>
        </div>

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
            <option value="sora-2">{lang === 'zh' ? 'Sora 2 (基础)' : 'Sora 2 (Basic)'}</option>
            <option value="sora-2-pro">{lang === 'zh' ? 'Sora 2 Pro (专业)' : 'Sora 2 Pro (Professional)'}</option>
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

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: isLoading ? '#ccc' : '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {isLoading ? (lang === 'zh' ? '生成中...' : 'Generating...') : (lang === 'zh' ? '生成' : 'Generate')}
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
      </div>
    </div>
  );
}
