import React, { useState } from 'react';
import { Language, I18N, Theme } from '../types';

interface StoryboardFrame {
  id: string;
  visualPromptZh: string;
  visualPromptEn: string;
  videoPromptZh: string;
  videoPromptEn: string;
  imageUrl?: string;
  index: number;
}

interface StoryboardPreviewDialogProps {
  frames: StoryboardFrame[];
  lang: Language;
  theme: Theme;
  isLoading?: boolean;
  onConfirm?: (editedFrames: StoryboardFrame[]) => void;
  onCancel: () => void;
  onGenerateImages?: (editedFrames: StoryboardFrame[]) => void;
}

export default function StoryboardPreviewDialog({
  frames,
  lang,
  theme,
  isLoading = false,
  onConfirm,
  onCancel,
  onGenerateImages
}: StoryboardPreviewDialogProps) {
  // 简化的编辑状态 - 只跟踪当前语言
  const [editedFrames, setEditedFrames] = useState<Record<string, { visualPrompt: string; videoPrompt: string }>>(
    frames.reduce((acc, frame) => {
      acc[frame.id] = {
        visualPrompt: lang === 'zh' ? frame.visualPromptZh : frame.visualPromptEn,
        videoPrompt: lang === 'zh' ? frame.videoPromptZh : frame.videoPromptEn
      };
      return acc;
    }, {} as Record<string, { visualPrompt: string; videoPrompt: string }>)
  );
  const [expandedFrameId, setExpandedFrameId] = useState<string | null>(frames[0]?.id || null);

  const t = I18N[lang];

  // 当语言改变时，更新 editedFrames
  React.useEffect(() => {
    setEditedFrames(
      frames.reduce((acc, frame) => {
        acc[frame.id] = {
          visualPrompt: lang === 'zh' ? frame.visualPromptZh : frame.visualPromptEn,
          videoPrompt: lang === 'zh' ? frame.videoPromptZh : frame.videoPromptEn
        };
        return acc;
      }, {} as Record<string, { visualPrompt: string; videoPrompt: string }>)
    );
  }, [lang, frames]);

  const handlePromptChange = (frameId: string, field: string, value: string) => {
    setEditedFrames(prev => ({
      ...prev,
      [frameId]: {
        ...prev[frameId],
        [field]: value
      }
    }));
  };

  const getEditedFrame = (frameId: string) => {
    return editedFrames[frameId] || { visualPrompt: '', videoPrompt: '' };
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)'
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
          borderRadius: '24px',
          padding: '30px',
          maxWidth: '900px',
          width: '95%',
          maxHeight: '90vh',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#000' }}>
            {lang === 'zh' ? '脚本预览与编辑' : 'Script Preview & Edit'}
          </h2>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: theme === 'dark' ? '#999' : '#666'
            }}
          >
            ✕
          </button>
        </div>

        {/* Frames List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            marginBottom: '20px',
            paddingRight: '10px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {frames.map((frame, idx) => {
              const edited = getEditedFrame(frame.id);
              const isExpanded = expandedFrameId === frame.id;

              return (
                <div
                  key={frame.id}
                  style={{
                    border: `2px solid ${theme === 'dark' ? '#333' : '#ddd'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    backgroundColor: theme === 'dark' ? '#0a0a0c' : '#f9f9f9',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Frame Header - Only this part is clickable */}
                  <div 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: isExpanded ? '12px' : 0,
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedFrameId(isExpanded ? null : frame.id);
                    }}
                  >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#000', marginBottom: '4px' }}>
                          {lang === 'zh' ? `场景 ${idx + 1}` : `Scene ${idx + 1}`}
                        </div>
                        <div style={{ fontSize: '12px', color: theme === 'dark' ? '#999' : '#666', lineHeight: '1.4' }}>
                          {(edited.visualPrompt || (lang === 'zh' ? frame.visualPromptZh : frame.visualPromptEn)).substring(0, 60)}...
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '20px', transition: 'transform 0.3s' }}>
                      {isExpanded ? '▼' : '▶'}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div 
                      style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {/* Visual Prompt - Current Language Only */}
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: theme === 'dark' ? '#aaa' : '#666', display: 'block', marginBottom: '6px' }}>
                          {lang === 'zh' ? '画面提示词' : 'Visual Prompt'}
                        </label>
                        <textarea
                          value={edited.visualPrompt}
                          onChange={(e) => handlePromptChange(frame.id, 'visualPrompt', e.target.value)}
                          style={{
                            width: '100%',
                            minHeight: '80px',
                            padding: '10px',
                            border: `1px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
                            borderRadius: '8px',
                            backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
                            color: theme === 'dark' ? '#fff' : '#000',
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            resize: 'vertical'
                          }}
                        />
                      </div>

                      {/* Video Prompt - Current Language Only */}
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: theme === 'dark' ? '#aaa' : '#666', display: 'block', marginBottom: '6px' }}>
                          {lang === 'zh' ? '视频提示词' : 'Video Prompt'}
                        </label>
                        <textarea
                          value={edited.videoPrompt}
                          onChange={(e) => handlePromptChange(frame.id, 'videoPrompt', e.target.value)}
                          style={{
                            width: '100%',
                            minHeight: '80px',
                            padding: '10px',
                            border: `1px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
                            borderRadius: '8px',
                            backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
                            color: theme === 'dark' ? '#fff' : '#000',
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            resize: 'vertical'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Buttons */}
        <div style={{ display: 'flex', gap: '12px', paddingTop: '20px', borderTop: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}` }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0',
              color: theme === 'dark' ? '#fff' : '#000',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {lang === 'zh' ? '取消' : 'Cancel'}
          </button>
          <button
            onClick={() => {
              const confirmedFrames = frames.map(frame => {
                const edited = editedFrames[frame.id];
                return {
                  ...frame,
                  ...(lang === 'zh' 
                    ? { visualPromptZh: edited.visualPrompt, videoPromptZh: edited.videoPrompt }
                    : { visualPromptEn: edited.visualPrompt, videoPromptEn: edited.videoPrompt }
                  )
                };
              });
              onConfirm?.(confirmedFrames);
            }}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              fontSize: '14px'
            }}
          >
            {lang === 'zh' ? '✓ 确认脚本' : '✓ Confirm Script'}
          </button>
          <button
            onClick={() => {
              const confirmedFrames = frames.map(frame => {
                const edited = editedFrames[frame.id];
                return {
                  ...frame,
                  ...(lang === 'zh' 
                    ? { visualPromptZh: edited.visualPrompt, videoPromptZh: edited.videoPrompt }
                    : { visualPromptEn: edited.visualPrompt, videoPromptEn: edited.videoPrompt }
                  )
                };
              });
              onGenerateImages?.(confirmedFrames);
            }}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#8b5cf6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              fontSize: '14px'
            }}
          >
            {isLoading ? (lang === 'zh' ? '生成中...' : 'Generating...') : (lang === 'zh' ? '🖼️ 生成分镜图' : '🖼️ Generate Images')}
          </button>
        </div>
      </div>
    </div>
  );
}
