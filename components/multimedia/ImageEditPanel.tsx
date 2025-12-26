/**
 * 图片编辑面板
 * 用于上传图片并进行编辑/变换
 */

'use client';

import React, { useState } from 'react';
import { imageToImage } from '@/lib/multimedia-api';

interface ImageEditPanelProps {
  onImageEdited?: (images: string[]) => void;
}

export const ImageEditPanel: React.FC<ImageEditPanelProps> = ({
  onImageEdited,
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [mask, setMask] = useState('');
  const [n, setN] = useState(1);
  const [size, setSize] = useState('1024x1024');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);

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

  const handleMaskUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMask(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!imageUrl) {
      setError('Please upload an image');
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter an edit prompt');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setImages([]);

      const data = await imageToImage(imageUrl, prompt, undefined, {
        mask: mask || undefined,
        n,
        size,
      });

      if (data.success) {
        setImages(data.data.images || []);
        onImageEdited?.(data.data.images || []);
      } else {
        setError(data.error?.message || 'Failed to edit image');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Image Editing</h2>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* 输入区域 */}
      <div className="space-y-3">
        {/* 原始图片上传 */}
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

        {/* 原始图片预览 */}
        {imageUrl && (
          <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt="Original"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 遮罩上传（可选） */}
        <div>
          <label className="block text-sm font-medium mb-2">Upload Mask (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMaskUpload}
            className="w-full p-2 border rounded-lg"
            disabled={loading}
          />
        </div>

        {/* 遮罩预览 */}
        {mask && (
          <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={mask}
              alt="Mask"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 编辑提示词 */}
        <div>
          <label className="block text-sm font-medium mb-2">Edit Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe how you want to edit the image..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            disabled={loading}
          />
        </div>

        {/* 参数设置 */}
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
            </select>
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
      </div>

      {/* 编辑按钮 */}
      <button
        onClick={handleEdit}
        disabled={loading || !imageUrl || !prompt.trim()}
        className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? 'Editing...' : 'Edit Image'}
      </button>

      {/* 结果展示 */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Edited Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`Edited ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* 下载按钮 */}
          <div className="flex gap-2">
            {images.map((image, index) => (
              <a
                key={index}
                href={image}
                download={`edited-${index + 1}.png`}
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

export default ImageEditPanel;
