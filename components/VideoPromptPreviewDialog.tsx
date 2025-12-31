import React, { useState } from 'react';
import { Language, I18N, Theme } from '../types';

interface VideoPromptFrame {
  id: string;
  index: number;
  visualPrompt: string;
  videoPrompt?: string;
  imageUrl?: string;
}

interface VideoPromptPreviewDialogProps {
  frames: VideoPromptFrame[];
  globalInstruction?: string;
  lang: Language;
  theme: Theme;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm?: (globalInstruction: string) => void;
}

export default function VideoPromptPreviewDialog({
  frames,
  globalInstruction = '',
  lang,
  theme,
  isLoading = false,
  onClose,
  onConfirm
}: VideoPromptPreviewDialogProps) {
  const [editedGlobalInstruction, setEditedGlobalInstruction] = useState(globalInstruction);
  const [expandedFrameId, setExpandedFrameId] = useState<string | null>(frames[0]?.id || null);

  const t = I18N[lang];

  const handleCopyAll = () => {
    const allPrompts = frames
      .map((frame, idx) => {
        const lines = [];
        lines.push(`[Scene ${frame.index + 1}]`);
        if (frame.visualPrompt) {
          lines.push(`Visual: ${frame.visualPrompt}`);
        }
        if (frame.videoPrompt) {
          lines.push(`Video: ${frame.videoPrompt}`);
        }
        return lines.join('\n');
      })
      .join('\n\n');

    const fullText = editedGlobalInstruction 
      ? `[Global Instruction]\n${editedGlobalInstruction}\n\n${allPrompts}`
      : allPrompts;

    navigator.clipboard.writeText(fullText);
    alert(lang === 'zh' ? '已复制到剪贴板' : 'Copied to clipboard');
  };

  const handleCopyFrame = (frameId: string) => {
    const frame = frames.find(f => f.id === frameId);
    if (!frame) return;

    const lines = [];
    lines.push(`[Scene ${frame.index + 1}]`);
    if (frame.visualPrompt) {
      lines.push(`Visual: ${frame.visualPrompt}`);
    }
    if (frame.videoPrompt) {
      lines.push(`Video: ${frame.videoPrompt}`);
    }

    navigator.clipboard.writeText(lines.join('\n'));
    alert(lang === 'zh' ? '已复制到剪贴板' : 'Copied to clipboard');
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
      onClick={onClose}
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
            {lang === 'zh' ? '视频提示词预览' : 'Video Prompt Preview'}
          </h2>
          <button
            onClick={onClose}
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

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            marginBottom: '20px',
            paddingRight: '10px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Global Instruction Section */}
            <div
              style={{
                border: `2px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
                borderRadius: '12px',
                padding: '16px',
                backgroundColor: theme === 'dark' ? '#0a0a0c' : '#f9f9f9'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#000' }}>
                  {lang === 'zh' ? '全局指令' : 'Global Instruction'}
                </label>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(editedGlobalInstruction);
                    alert(lang === 'zh' ? '已复制到剪贴板' : 'Copied to clipboard');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '12px',
                    cursor: 'pointer',
                    color: theme === 'dark' ? '#888' : '#999',
                    textDecoration: 'underline'
                  }}
                >
                  {lang === 'zh' ? '复制' : 'Copy'}
                </button>
              </div>
              <textarea
                value={editedGlobalInstruction}
                onChange={(e) => setEditedGlobalInstruction(e.target.value)}
                placeholder={lang === 'zh' ? '输入全局指令...' : 'Enter global instruction...'}
                style={{
                  width: '100%',
                  minHeight: '100px',
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
              <p style={{ fontSize: '11px', color: theme === 'dark' ? '#888' : '#999', marginTop: '8px' }}>
                {lang === 'zh' 
                  ? '全局指令将应用于所有场景的视频生成，用于统一风格、节奏等'
                  : 'Global instruction will be applied to all scenes for video generation, for unified style, pacing, etc.'}
              </p>
            </div>

            {/* Frames List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#000' }}>
                  {lang === 'zh' ? `场景提示词 (${frames.length} 个)` : `Scene Prompts (${frames.length})`}
                </h3>
                <button
                  onClick={handleCopyAll}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '12px',
                    cursor: 'pointer',
                    color: theme === 'dark' ? '#888' : '#999',
                    textDecoration: 'underline'
                  }}
                >
                  {lang === 'zh' ? '全部复制' : 'Copy All'}
                </button>
              </div>

              {frames.map((frame, idx) => {
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
                    {/* Frame Header */}
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
                        {frame.imageUrl && (
                          <img
                            src={frame.imageUrl}
                            alt={`Scene ${frame.index + 1}`}
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '8px',
                              objectFit: 'cover'
                            }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#000', marginBottom: '4px' }}>
                            {lang === 'zh' ? `场景 ${frame.index + 1}` : `Scene ${frame.index + 1}`}
                          </div>
                          <div style={{ fontSize: '12px', color: theme === 'dark' ? '#999' : '#666', lineHeight: '1.4' }}>
                            {frame.videoPrompt 
                              ? frame.videoPrompt.substring(0, 60) + (frame.videoPrompt.length > 60 ? '...' : '')
                              : (lang === 'zh' ? '无视频提示词' : 'No video prompt')}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyFrame(frame.id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '12px',
                            cursor: 'pointer',
                            color: theme === 'dark' ? '#888' : '#999',
                            textDecoration: 'underline'
                          }}
                        >
                          {lang === 'zh' ? '复制' : 'Copy'}
                        </button>
                        <div style={{ fontSize: '20px', transition: 'transform 0.3s' }}>
                          {isExpanded ? '▼' : '▶'}
                        </div>
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
                        {/* Visual Prompt */}
                        {frame.visualPrompt && (
                          <div>
                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: theme === 'dark' ? '#aaa' : '#666', display: 'block', marginBottom: '6px' }}>
                              {lang === 'zh' ? '画面提示词' : 'Visual Prompt'}
                            </label>
                            <div
                              style={{
                                width: '100%',
                                minHeight: '60px',
                                padding: '10px',
                                border: `1px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
                                borderRadius: '8px',
                                backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
                                color: theme === 'dark' ? '#fff' : '#000',
                                fontFamily: 'monospace',
                                fontSize: '12px',
                                lineHeight: '1.5',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                              }}
                            >
                              {frame.visualPrompt}
                            </div>
                          </div>
                        )}

                        {/* Video Prompt */}
                        {frame.videoPrompt && (
                          <div>
                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: theme === 'dark' ? '#aaa' : '#666', display: 'block', marginBottom: '6px' }}>
                              {lang === 'zh' ? '视频提示词' : 'Video Prompt'}
                            </label>
                            <div
                              style={{
                                width: '100%',
                                minHeight: '60px',
                                padding: '10px',
                                border: `1px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
                                borderRadius: '8px',
                                backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
                                color: theme === 'dark' ? '#fff' : '#000',
                                fontFamily: 'monospace',
                                fontSize: '12px',
                                lineHeight: '1.5',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                              }}
                            >
                              {frame.videoPrompt}
                            </div>
                          </div>
                        )}

                        {!frame.videoPrompt && (
                          <div style={{ fontSize: '12px', color: theme === 'dark' ? '#888' : '#999', fontStyle: 'italic' }}>
                            {lang === 'zh' ? '此场景没有视频提示词' : 'This scene has no video prompt'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div style={{ display: 'flex', gap: '12px', paddingTop: '20px', borderTop: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}` }}>
          <button
            onClick={onClose}
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
            {lang === 'zh' ? '关闭' : 'Close'}
          </button>
          <button
            onClick={() => {
              onConfirm?.(editedGlobalInstruction);
              onClose();
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
            {lang === 'zh' ? '✓ 确认' : '✓ Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
