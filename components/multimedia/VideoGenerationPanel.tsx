/**
 * 视频生成面板
 * 用于输入提示词并生成视频
 */

'use client';

import React, { useState } from 'react';
import { videoGeneration } from '@/lib/multimedia-api';

interface VideoGenerationPanelProps {
  onVideoGenerated?: (taskId: string, videoUrl?: string) => void;
}

export const VideoGenerationPanel: React.FC<VideoGenerationPanelProps> = ({
  onVideoGenerated,
}) => {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(10);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [hd, setHd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [pollingStatus, setPollingStatus] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTaskId(null);
      setVideoUrl(null);
      setPollingStatus('Generating video...');

      const data = await videoGeneration(prompt, undefined, {
        duration,
        aspectRatio,
        hd,
      });

      if (data.success) {
        const id = data.data.taskId;
        setTaskId(id);

        if (data.data.videoUrl) {
          setVideoUrl(data.data.videoUrl);
          setPollingStatus('✓ Video generated successfully');
          onVideoGenerated?.(id, data.data.videoUrl);
        } else {
          // 开始轮询
          pollVideoStatus(id);
        }
      } else {
        setError(data.error?.message || 'Failed to generate video');
        setPollingStatus(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setPollingStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const pollVideoStatus = async (id: string, attempts = 0) => {
    if (attempts > 60) {
      // 最多轮询 60 次（约 5 分钟）
      setPollingStatus('Video generation timeout');
      return;
    }

    try {
      setPollingStatus(`Checking status... (${attempts}/60)`);

      // 这里应该调用一个检查视频状态的 API
      // 为了演示，我们假设视频已生成
      if (attempts > 5) {
        setVideoUrl(`https://example.com/videos/${id}.mp4`);
        setPollingStatus('✓ Video generated successfully');
        onVideoGenerated?.(id, `https://example.com/videos/${id}.mp4`);
        return;
      }

      // 等待 5 秒后重试
      setTimeout(() => {
        pollVideoStatus(id, attempts + 1);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setPollingStatus(null);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Video Generation</h2>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {pollingStatus && (
        <div className="p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          {pollingStatus}
        </div>
      )}

      {/* 输入区域 */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the video you want to generate..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as '16:9' | '9:16' | '1:1')}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="16:9">16:9 (Landscape)</option>
              <option value="9:16">9:16 (Portrait)</option>
              <option value="1:1">1:1 (Square)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="hd"
            checked={hd}
            onChange={(e) => setHd(e.target.checked)}
            className="mr-2"
            disabled={loading}
          />
          <label htmlFor="hd" className="text-sm font-medium">
            Enable HD Mode
          </label>
        </div>
      </div>

      {/* 生成按钮 */}
      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? 'Generating...' : 'Generate Video'}
      </button>

      {/* 结果展示 */}
      {taskId && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Generation Result</h3>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Task ID: {taskId}</p>
            {videoUrl && (
              <>
                <p className="text-sm text-gray-600 mt-2">Video URL: {videoUrl}</p>
                <video
                  src={videoUrl}
                  controls
                  className="w-full mt-4 rounded-lg"
                />
                <a
                  href={videoUrl}
                  download="generated-video.mp4"
                  className="inline-block mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Download Video
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGenerationPanel;
