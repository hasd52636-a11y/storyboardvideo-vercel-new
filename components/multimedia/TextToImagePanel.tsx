/**
 * 文生图面板
 * 用于输入提示词并生成图像
 */

'use client';

import React, { useState } from 'react';
import { textToImage } from '@/lib/multimedia-api';
import Image from 'next/image';

interface TextToImagePanelProps {
  onImageGenerated?: (images: string[]) => void;
}

export const TextToImagePanel: React.FC<TextToImagePanelProps> = ({
  onImageGenerated,
}) => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('1024x1024');
  const [quality, setQuality] = useState('standard');
  const [n, setN] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setImages([]);

      const data = await textToImage(prompt, undefined, {
        size,
        quality,
        n,
      });

      if (data.success) {
        setImages(data.data.images || []);
        onImageGenerated?.(data.data.images || []);
      } else {
        setError(data.error?.message || 'Failed to generate image');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Text-to-Image Generation</h2>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* 输入区域 */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Size</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="256x256">256x256</option>
              <option value="512x512">512x512</option>
              <option value="1024x1024">1024x1024</option>
              <option value="1792x1024">1792x1024 (16:9)</option>
              <option value="1024x1792">1024x1792 (9:16)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quality</label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="standard">Standard</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Number of Images</label>
          <input
            type="number"
            min="1"
            max="10"
            value={n}
            onChange={(e) => setN(parseInt(e.target.value))}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
      </div>

      {/* 生成按钮 */}
      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? 'Generating...' : 'Generate Image'}
      </button>

      {/* 结果展示 */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Generated Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {image.startsWith('data:') ? (
                  <img
                    src={image}
                    alt={`Generated ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={image}
                    alt={`Generated ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            ))}
          </div>

          {/* 下载按钮 */}
          <div className="flex gap-2">
            {images.map((image, index) => (
              <a
                key={index}
                href={image}
                download={`generated-${index + 1}.png`}
                className="px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              >
                Download {index + 1}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextToImagePanel;
