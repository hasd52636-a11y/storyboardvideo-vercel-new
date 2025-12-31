import React, { useState } from 'react';
import { VideoItem } from '../types';

interface VideoItemCardProps {
  item: VideoItem;
  onRetry?: (itemId: string) => void;
  onDownload?: (itemId: string) => void;
  lang?: 'zh' | 'en';
  theme?: 'light' | 'dark';
}

export default function VideoItemCard({
  item,
  onRetry,
  onDownload,
  lang = 'zh',
  theme = 'dark'
}: VideoItemCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [showFullPrompt, setShowFullPrompt] = useState(false);

  const getStatusIcon = () => {
    switch (item.status) {
      case 'completed':
        return '✓';
      case 'generating':
      case 'loading':
        return '⏳';
      case 'failed':
        return '✗';
      case 'pending':
        return '⏸';
      default:
        return '?';
    }
  };

  const getStatusColor = () => {
    switch (item.status) {
      case 'completed':
        return '#4CAF50';
      case 'generating':
      case 'loading':
        return '#2196F3';
      case 'failed':
        return '#f44336';
      case 'pending':
        return '#999';
      default:
        return '#666';
    }
  };

  const getStatusText = () => {
    switch (item.status) {
      case 'completed':
        return lang === 'zh' ? '生成完成' : 'Completed';
      case 'generating':
      case 'loading':
        return lang === 'zh' ? `生成中 ${item.progress}%` : `Generating ${item.progress}%`;
      case 'failed':
        return lang === 'zh' ? '生成失败' : 'Failed';
      case 'pending':
        return lang === 'zh' ? '待处理' : 'Pending';
      default:
        return lang === 'zh' ? '未知状态' : 'Unknown';
    }
  };

  const promptSummary = item.visualPrompt?.substring(0, 100) || item.prompt?.substring(0, 100) || '';
  const hasMorePrompt = (item.visualPrompt?.length || 0) > 100;

  return (
    <div
      style={{
        backgroundColor: theme === 'dark' ? '#1a1a1e' : '#fff',
        border: `2px solid ${getStatusColor()}`,
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: isHovering ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.1)',
        color: theme === 'dark' ? '#fff' : '#000'
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* 标题栏 - 场景ID和状态 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px', color: getStatusColor() }}>
            {getStatusIcon()}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: getStatusColor() }}>
            {item.sceneId || `Video #${item.taskId?.slice(0, 8)}`}
          </span>
        </div>
        <span style={{ fontSize: '12px', color: '#999' }}>
          {getStatusText()}
        </span>
      </div>

      {/* 进度条 */}
      {(item.status === 'generating' || item.status === 'loading') && (
        <div style={{ marginBottom: '8px' }}>
          <div
            style={{
              width: '100%',
              height: '4px',
              backgroundColor: theme === 'dark' ? '#333' : '#eee',
              borderRadius: '2px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${item.progress}%`,
                height: '100%',
                backgroundColor: getStatusColor(),
                transition: 'width 0.3s'
              }}
            />
          </div>
        </div>
      )}

      {/* 提示词摘要 */}
      <div
        style={{
          fontSize: '12px',
          color: theme === 'dark' ? '#aaa' : '#666',
          marginBottom: '8px',
          cursor: 'pointer',
          position: 'relative'
        }}
        onMouseEnter={() => setShowFullPrompt(true)}
        onMouseLeave={() => setShowFullPrompt(false)}
      >
        <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>
          {lang === 'zh' ? '提示词:' : 'Prompt:'}
        </div>
        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {promptSummary}
          {hasMorePrompt && '...'}
        </div>

        {/* 完整提示词悬停显示 */}
        {showFullPrompt && hasMorePrompt && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: theme === 'dark' ? '#2a2a2e' : '#f5f5f5',
              border: `1px solid ${getStatusColor()}`,
              borderRadius: '4px',
              padding: '8px',
              marginTop: '4px',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 1000,
              fontSize: '11px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            {item.visualPrompt || item.prompt}
          </div>
        )}
      </div>

      {/* 错误信息 */}
      {item.status === 'failed' && item.errorMessage && (
        <div
          style={{
            fontSize: '12px',
            color: '#f44336',
            marginBottom: '8px',
            padding: '6px',
            backgroundColor: theme === 'dark' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.05)',
            borderRadius: '4px'
          }}
        >
          {lang === 'zh' ? '错误: ' : 'Error: '}
          {item.errorMessage}
        </div>
      )}

      {/* 操作按钮 */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {item.status === 'completed' && (
          <button
            onClick={() => onDownload?.(item.id)}
            style={{
              flex: 1,
              padding: '6px',
              fontSize: '12px',
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#45a049')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4CAF50')}
          >
            {lang === 'zh' ? '下载' : 'Download'}
          </button>
        )}

        {item.status === 'failed' && (
          <button
            onClick={() => onRetry?.(item.id)}
            style={{
              flex: 1,
              padding: '6px',
              fontSize: '12px',
              backgroundColor: '#2196F3',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0b7dda')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2196F3')}
          >
            {lang === 'zh' ? '重新生成' : 'Retry'}
          </button>
        )}
      </div>
    </div>
  );
}
