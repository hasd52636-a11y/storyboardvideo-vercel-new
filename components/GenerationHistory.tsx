/**
 * Generation History Component
 * Displays previous generations with metadata and allows reuse
 */

import React, { useState, useEffect } from 'react';
import type { GenerationHistory } from '@prisma/client';

interface GenerationHistoryProps {
  userId: number;
  onSelectGeneration?: (generation: GenerationHistory) => void;
  onDeleteGeneration?: (generationId: string) => void;
}

interface PaginatedResult {
  items: GenerationHistory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const GenerationHistoryComponent: React.FC<GenerationHistoryProps> = ({
  userId,
  onSelectGeneration,
  onDeleteGeneration,
}) => {
  const [history, setHistory] = useState<GenerationHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    loadHistory();
  }, [userId, page, filterType]);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams({
        userId: userId.toString(),
        page: page.toString(),
        limit: '10',
      });

      if (filterType !== 'all') {
        query.append('type', filterType);
      }

      const response = await fetch(`/api/generation-history?${query}`);
      if (!response.ok) {
        throw new Error('Failed to load history');
      }

      const data: PaginatedResult = await response.json();
      setHistory(data.items);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (generationId: string) => {
    if (!confirm('Are you sure you want to delete this generation?')) return;

    try {
      const response = await fetch(`/api/generation-history/${generationId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete generation');
      }

      onDeleteGeneration?.(generationId);
      await loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'three-view': '📐 Three-View',
      'multi-grid': '🎬 Multi-Grid',
      'style-comparison': '🎨 Style Comparison',
      'narrative-progression': '📖 Narrative Progression',
    };
    return labels[type] || type;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="generation-history">
      <div className="history-header">
        <h2>Generation History</h2>
        <div className="filter-controls">
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setPage(1);
            }}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="three-view">Three-View</option>
            <option value="multi-grid">Multi-Grid</option>
            <option value="style-comparison">Style Comparison</option>
            <option value="narrative-progression">Narrative Progression</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading history...</div>
      ) : history.length === 0 ? (
        <div className="empty-state">
          <p>No generations yet. Create your first generation to get started!</p>
        </div>
      ) : (
        <>
          <div className="history-list">
            {history.map((gen) => (
              <div key={gen.id} className="history-item">
                <div className="item-header">
                  <span className="item-type">{getTypeLabel(gen.type)}</span>
                  <span className="item-date">{formatDate(gen.createdAt)}</span>
                </div>

                <div className="item-preview">
                  {gen.images.length > 0 && (
                    <img src={gen.images[0]} alt="Preview" className="preview-image" />
                  )}
                </div>

                <div className="item-prompt">
                  <p className="prompt-label">Prompt:</p>
                  <p className="prompt-text">{gen.prompt}</p>
                </div>

                <div className="item-metadata">
                  <span className="metadata-item">
                    {gen.images.length} image{gen.images.length !== 1 ? 's' : ''}
                  </span>
                  {gen.metadata && Object.keys(gen.metadata).length > 0 && (
                    <span className="metadata-item">
                      {JSON.stringify(gen.metadata).substring(0, 50)}...
                    </span>
                  )}
                </div>

                <div className="item-actions">
                  <button
                    className="btn-select"
                    onClick={() => onSelectGeneration?.(gen)}
                  >
                    View
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(gen.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="btn-prev"
              >
                ← Previous
              </button>
              <span className="page-info">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="btn-next"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .generation-history {
          padding: 20px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .history-header h2 {
          margin: 0;
          font-size: 24px;
          color: #333;
        }

        .filter-controls {
          display: flex;
          gap: 10px;
        }

        .filter-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
        }

        .error-message {
          padding: 12px;
          background: #f8d7da;
          color: #721c24;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #999;
        }

        .history-list {
          display: grid;
          gap: 15px;
          margin-bottom: 20px;
        }

        .history-item {
          background: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }

        .item-type {
          font-weight: bold;
          color: #333;
          font-size: 14px;
        }

        .item-date {
          color: #999;
          font-size: 12px;
        }

        .item-preview {
          margin-bottom: 10px;
          max-height: 150px;
          overflow: hidden;
          border-radius: 4px;
        }

        .preview-image {
          width: 100%;
          height: auto;
          object-fit: cover;
          cursor: pointer;
        }

        .item-prompt {
          margin-bottom: 10px;
        }

        .prompt-label {
          margin: 0 0 5px 0;
          font-size: 12px;
          font-weight: bold;
          color: #666;
        }

        .prompt-text {
          margin: 0;
          font-size: 12px;
          color: #999;
          background: #f9f9f9;
          padding: 8px;
          border-radius: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .item-metadata {
          display: flex;
          gap: 15px;
          margin-bottom: 10px;
          font-size: 12px;
          color: #666;
        }

        .metadata-item {
          display: flex;
          align-items: center;
        }

        .item-actions {
          display: flex;
          gap: 10px;
        }

        .btn-select,
        .btn-delete {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .btn-select {
          background: #007bff;
          color: white;
        }

        .btn-select:hover {
          background: #0056b3;
        }

        .btn-delete {
          background: #dc3545;
          color: white;
        }

        .btn-delete:hover {
          background: #c82333;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          margin-top: 20px;
        }

        .btn-prev,
        .btn-next {
          padding: 8px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-prev:hover:not(:disabled),
        .btn-next:hover:not(:disabled) {
          background: #0056b3;
        }

        .btn-prev:disabled,
        .btn-next:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .page-info {
          font-size: 14px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default GenerationHistoryComponent;
