import React, { useState } from 'react';
import { BatchGenerationState } from '../types';

interface BatchProgressProps {
  state: BatchGenerationState;
  onFilterChange?: (filter: 'all' | 'success' | 'failed') => void;
  lang?: 'zh' | 'en';
  theme?: 'light' | 'dark';
}

export default function BatchProgress({
  state,
  onFilterChange,
  lang = 'zh',
  theme = 'dark'
}: BatchProgressProps) {
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all');

  const handleFilterChange = (newFilter: 'all' | 'success' | 'failed') => {
    setFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  const successRate = state.total > 0 ? Math.round((state.completed / state.total) * 100) : 0;
  const failureRate = state.total > 0 ? Math.round((state.failed / state.total) * 100) : 0;

  return (
    <div
      style={{
        backgroundColor: theme === 'dark' ? '#1a1a1e' : '#fff',
        border: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}`,
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        color: theme === 'dark' ? '#fff' : '#000'
      }}
    >
      {/* 标题 */}
      <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
        {lang === 'zh' ? '批量生成进度' : 'Batch Generation Progress'}
      </div>

      {/* 进度条 */}
      <div style={{ marginBottom: '12px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            marginBottom: '4px',
            color: theme === 'dark' ? '#aaa' : '#666'
          }}
        >
          <span>
            {lang === 'zh' ? '总进度' : 'Overall Progress'}
          </span>
          <span>
            {state.completed} / {state.total}
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: theme === 'dark' ? '#333' : '#eee',
            borderRadius: '4px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${successRate}%`,
              height: '100%',
              backgroundColor: '#4CAF50',
              transition: 'width 0.3s'
            }}
          />
        </div>
      </div>

      {/* 统计信息 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
          marginBottom: '12px'
        }}
      >
        {/* 成功 */}
        <div
          style={{
            backgroundColor: theme === 'dark' ? '#0a3d0a' : '#e8f5e9',
            padding: '8px',
            borderRadius: '4px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '12px', color: '#4CAF50', fontWeight: 'bold' }}>
            ✓ {lang === 'zh' ? '成功' : 'Success'}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#4CAF50' }}>
            {state.completed}
          </div>
          <div style={{ fontSize: '11px', color: theme === 'dark' ? '#aaa' : '#666' }}>
            {successRate}%
          </div>
        </div>

        {/* 失败 */}
        <div
          style={{
            backgroundColor: theme === 'dark' ? '#3d0a0a' : '#ffebee',
            padding: '8px',
            borderRadius: '4px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '12px', color: '#f44336', fontWeight: 'bold' }}>
            ✗ {lang === 'zh' ? '失败' : 'Failed'}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f44336' }}>
            {state.failed}
          </div>
          <div style={{ fontSize: '11px', color: theme === 'dark' ? '#aaa' : '#666' }}>
            {failureRate}%
          </div>
        </div>

        {/* 待处理 */}
        <div
          style={{
            backgroundColor: theme === 'dark' ? '#1a1a2e' : '#f5f5f5',
            padding: '8px',
            borderRadius: '4px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '12px', color: '#999', fontWeight: 'bold' }}>
            ⏸ {lang === 'zh' ? '待处理' : 'Pending'}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#999' }}>
            {state.pending}
          </div>
          <div style={{ fontSize: '11px', color: theme === 'dark' ? '#aaa' : '#666' }}>
            {state.total > 0 ? Math.round((state.pending / state.total) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* 状态文本 */}
      <div
        style={{
          fontSize: '12px',
          color: theme === 'dark' ? '#aaa' : '#666',
          marginBottom: '12px',
          textAlign: 'center'
        }}
      >
        {state.status === 'processing' && (
          lang === 'zh' ? '正在生成中...' : 'Generating...'
        )}
        {state.status === 'completed' && (
          lang === 'zh' ? '生成完成！' : 'Completed!'
        )}
        {state.status === 'paused' && (
          lang === 'zh' ? '已暂停' : 'Paused'
        )}
        {state.status === 'idle' && (
          lang === 'zh' ? '未开始' : 'Not started'
        )}
      </div>

      {/* 筛选按钮 */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center'
        }}
      >
        <button
          onClick={() => handleFilterChange('all')}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            backgroundColor: filter === 'all' ? '#2196F3' : (theme === 'dark' ? '#333' : '#eee'),
            color: filter === 'all' ? '#fff' : (theme === 'dark' ? '#aaa' : '#666'),
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {lang === 'zh' ? '全部' : 'All'}
        </button>
        <button
          onClick={() => handleFilterChange('success')}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            backgroundColor: filter === 'success' ? '#4CAF50' : (theme === 'dark' ? '#333' : '#eee'),
            color: filter === 'success' ? '#fff' : (theme === 'dark' ? '#aaa' : '#666'),
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {lang === 'zh' ? '成功' : 'Success'}
        </button>
        <button
          onClick={() => handleFilterChange('failed')}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            backgroundColor: filter === 'failed' ? '#f44336' : (theme === 'dark' ? '#333' : '#eee'),
            color: filter === 'failed' ? '#fff' : (theme === 'dark' ? '#aaa' : '#666'),
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {lang === 'zh' ? '失败' : 'Failed'}
        </button>
      </div>
    </div>
  );
}
