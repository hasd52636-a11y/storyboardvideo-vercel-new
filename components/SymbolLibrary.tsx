/**
 * Symbol Library Component
 * Displays user's custom symbols in a grid layout with upload, edit, and delete functionality
 */

import React, { useState, useEffect, useRef } from 'react';
import type { Symbol } from '@prisma/client';

interface SymbolLibraryProps {
  userId: number;
  onSymbolDrop?: (symbol: Symbol) => void;
  onSymbolSelect?: (symbol: Symbol) => void;
}

interface SymbolWithDragData extends Symbol {
  isDragging?: boolean;
}

export const SymbolLibrary: React.FC<SymbolLibraryProps> = ({
  userId,
  onSymbolDrop,
  onSymbolSelect,
}) => {
  const [symbols, setSymbols] = useState<SymbolWithDragData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [editingSymbol, setEditingSymbol] = useState<Symbol | null>(null);
  const [draggedSymbol, setDraggedSymbol] = useState<Symbol | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load symbols on mount
  useEffect(() => {
    loadSymbols();
  }, [userId]);

  const loadSymbols = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/symbols?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to load symbols');
      }

      const data = await response.json();
      setSymbols(data.symbols || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    setShowUploadDialog(true);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;

      // Show dialog for name and description
      const name = prompt('Enter symbol name:');
      if (!name) return;

      const description = prompt('Enter symbol description:');
      if (!description) return;

      try {
        const response = await fetch('/api/symbols/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            icon: base64,
            name,
            description,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to upload symbol');
        }

        await loadSymbols();
        setShowUploadDialog(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      }
    };

    reader.readAsDataURL(file);
  };

  const handleEditSymbol = (symbol: Symbol) => {
    setEditingSymbol(symbol);
  };

  const handleSaveEdit = async () => {
    if (!editingSymbol) return;

    const newName = prompt('Edit symbol name:', editingSymbol.name);
    if (!newName) return;

    const newDescription = prompt('Edit symbol description:', editingSymbol.description);
    if (!newDescription) return;

    try {
      const response = await fetch(`/api/symbols/${editingSymbol.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: newName,
          description: newDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update symbol');
      }

      await loadSymbols();
      setEditingSymbol(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const handleDeleteSymbol = async (symbolId: string) => {
    if (!confirm('Are you sure you want to delete this symbol?')) return;

    try {
      const response = await fetch(`/api/symbols/${symbolId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete symbol');
      }

      await loadSymbols();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleDragStart = (symbol: Symbol) => {
    setDraggedSymbol(symbol);
    setSymbols((prev) =>
      prev.map((s) => (s.id === symbol.id ? { ...s, isDragging: true } : s))
    );
  };

  const handleDragEnd = () => {
    setDraggedSymbol(null);
    setSymbols((prev) => prev.map((s) => ({ ...s, isDragging: false })));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedSymbol && onSymbolDrop) {
      onSymbolDrop(draggedSymbol);
    }
    handleDragEnd();
  };

  return (
    <div className="symbol-library">
      <div className="symbol-library-header">
        <h2>Symbol Library</h2>
        <button onClick={handleUploadClick} className="btn-upload">
          + Upload Symbol
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading symbols...</div>
      ) : symbols.length === 0 ? (
        <div className="empty-state">
          <p>No symbols yet. Upload your first symbol to get started!</p>
        </div>
      ) : (
        <div className="symbol-grid">
          {symbols.map((symbol) => (
            <div
              key={symbol.id}
              className={`symbol-card ${symbol.isDragging ? 'dragging' : ''}`}
              draggable
              onDragStart={() => handleDragStart(symbol)}
              onDragEnd={handleDragEnd}
              onClick={() => onSymbolSelect?.(symbol)}
            >
              <div className="symbol-icon">
                <img src={symbol.icon} alt={symbol.name} />
              </div>

              <div className="symbol-info">
                <h3>{symbol.name}</h3>
                <p>{symbol.description}</p>
              </div>

              <div className="symbol-actions">
                <button
                  className="btn-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditSymbol(symbol);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSymbol(symbol.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUploadDialog && (
        <div className="upload-dialog">
          <div className="dialog-content">
            <h3>Upload Symbol</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <button onClick={() => fileInputRef.current?.click()}>
              Select Image
            </button>
            <button onClick={() => setShowUploadDialog(false)}>Cancel</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .symbol-library {
          padding: 20px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .symbol-library-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .symbol-library-header h2 {
          margin: 0;
          font-size: 24px;
          color: #333;
        }

        .btn-upload {
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-upload:hover {
          background: #0056b3;
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

        .symbol-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        .symbol-card {
          background: white;
          border-radius: 8px;
          padding: 15px;
          cursor: grab;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .symbol-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #007bff;
        }

        .symbol-card.dragging {
          opacity: 0.5;
          transform: scale(0.95);
        }

        .symbol-icon {
          width: 100%;
          height: 120px;
          background: #f0f0f0;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          overflow: hidden;
        }

        .symbol-icon img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .symbol-info h3 {
          margin: 0 0 5px 0;
          font-size: 16px;
          color: #333;
        }

        .symbol-info p {
          margin: 0;
          font-size: 12px;
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .symbol-actions {
          display: flex;
          gap: 8px;
          margin-top: 10px;
        }

        .btn-edit,
        .btn-delete {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .btn-edit {
          background: #28a745;
          color: white;
        }

        .btn-edit:hover {
          background: #218838;
        }

        .btn-delete {
          background: #dc3545;
          color: white;
        }

        .btn-delete:hover {
          background: #c82333;
        }

        .upload-dialog {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .dialog-content {
          background: white;
          padding: 30px;
          border-radius: 8px;
          text-align: center;
        }

        .dialog-content h3 {
          margin-top: 0;
        }

        .dialog-content button {
          margin: 10px 5px;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .dialog-content button:first-of-type {
          background: #007bff;
          color: white;
        }

        .dialog-content button:last-of-type {
          background: #6c757d;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default SymbolLibrary;
