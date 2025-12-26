/**
 * 图片分析面板
 * 用于上传图片并进行分析
 */

'use client';

import React, { useState } from 'react';
import { imageAnalysis } from '@/lib/multimedia-api';
import Image from 'next/image';

interface ImageAnalysisPanelProps {
  onAnalysisComplete?: (text: string) => void;
}

export const ImageAnalysisPanel: React.FC<ImageAnalysisPanelProps> = ({
  onAnalysisComplete,
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [detail, setDetail] = useState<'low' | 'high' | 'auto'>('auto');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imageUrl) {
      setError('Please upload an image');
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter an analysis prompt');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const data = await imageAnalysis(imageUrl, prompt, undefined, {
        detail,
      });

      if (data.success) {
        setResult(data.data.text);
        onAnalysisComplete?.(data.data.text);
      } else {
        setError(data.error?.message || 'Failed to analyze image');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Image Analysis</h2>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* 图片上传 */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded-lg"
            disabled={loading}
          />
        </div>

        {/* 图片预览 */}
        {imageUrl && (
          <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 分析提示词 */}
        <div>
          <label className="block text-sm font-medium mb-2">Analysis Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What would you like to know about this image?"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            disabled={loading}
          />
        </div>

        {/* 详细程度 */}
        <div>
          <label className="block text-sm font-medium mb-2">Detail Level</label>
          <select
            value={detail}
            onChange={(e) => setDetail(e.target.value as 'low' | 'high' | 'auto')}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="low">Low</option>
            <option value="auto">Auto</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* 分析按钮 */}
      <button
        onClick={handleAnalyze}
        disabled={loading || !imageUrl || !prompt.trim()}
        className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? 'Analyzing...' : 'Analyze Image'}
      </button>

      {/* 结果展示 */}
      {result && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Analysis Result</h3>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-wrap">
            {result}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(result);
              alert('Copied to clipboard!');
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageAnalysisPanel;
