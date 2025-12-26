/**
 * 多媒体 API 配置面板
 * 用于管理各提供商的 API 配置和功能映射
 */

'use client';

import React, { useState, useEffect } from 'react';
import { MultiMediaConfig, MediaProvider } from '@/services/multimedia/types';
import { getConfig, updateConfig, syncConfig } from '@/lib/multimedia-api';

interface APIConfigPanelProps {
  onConfigChange?: (config: MultiMediaConfig) => void;
  initialConfig?: MultiMediaConfig;
}

const PROVIDERS: { name: MediaProvider; label: string }[] = [
  { name: 'shenma', label: '神马 API' },
  { name: 'openai', label: 'OpenAI' },
  { name: 'zhipu', label: '智谱 AI' },
  { name: 'dayuyu', label: '大语言' },
  { name: 'custom', label: 'Custom API' },
];

export const APIConfigPanel: React.FC<APIConfigPanelProps> = ({
  onConfigChange,
  initialConfig,
}) => {
  const [config, setConfig] = useState<MultiMediaConfig>(
    initialConfig || {
      providers: {},
      configs: {},
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<MediaProvider>('shenma');
  const [apiKey, setApiKey] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [endpoints, setEndpoints] = useState({
    textToImage: '',
    imageToImage: '',
    videoGeneration: '',
    textGeneration: '',
  });

  // 加载配置
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const data = await getConfig();

      if (data.success) {
        setConfig(data.data.config);
      } else {
        setError(data.error?.message || 'Failed to load configuration');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncConfig = async (provider: MediaProvider) => {
    try {
      setSyncStatus(`Syncing ${provider}...`);
      const data = await syncConfig(provider);

      if (data.success) {
        setConfig(data.data.config);
        setSyncStatus(`✓ ${provider} synced successfully`);
        setTimeout(() => setSyncStatus(null), 3000);
        onConfigChange?.(data.data.config);
      } else {
        setError(data.error?.message || 'Failed to sync configuration');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleAddProvider = async () => {
    if (!apiKey.trim()) {
      setError('API Key is required');
      return;
    }

    try {
      setLoading(true);
      const providerConfig: any = {
        apiKey,
        ...(apiUrl && { apiUrl }),
      };

      // 添加功能特定的端点
      const endpointsToAdd: any = {};
      if (endpoints.textToImage) endpointsToAdd.textToImage = endpoints.textToImage;
      if (endpoints.imageToImage) endpointsToAdd.imageToImage = endpoints.imageToImage;
      if (endpoints.videoGeneration) endpointsToAdd.videoGeneration = endpoints.videoGeneration;
      if (endpoints.textGeneration) endpointsToAdd.textGeneration = endpoints.textGeneration;
      
      if (Object.keys(endpointsToAdd).length > 0) {
        providerConfig.endpoints = endpointsToAdd;
      }

      const newConfig = {
        ...config,
        configs: {
          ...config.configs,
          [selectedProvider]: providerConfig,
        },
      };

      const data = await updateConfig(newConfig);

      if (data.success) {
        setConfig(data.data.config);
        setApiKey('');
        setApiUrl('');
        setEndpoints({
          textToImage: '',
          imageToImage: '',
          videoGeneration: '',
          textGeneration: '',
        });
        setSyncStatus(`✓ ${selectedProvider} added successfully`);
        setTimeout(() => setSyncStatus(null), 3000);
        onConfigChange?.(data.data.config);
      } else {
        setError(data.error?.message || 'Failed to add provider');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConfig = async () => {
    try {
      setLoading(true);
      const data = await updateConfig(config);

      if (data.success) {
        setConfig(data.data.config);
        setSyncStatus('✓ Configuration updated successfully');
        setTimeout(() => setSyncStatus(null), 3000);
        onConfigChange?.(data.data.config);
      } else {
        setError(data.error?.message || 'Failed to update configuration');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !config.providers) {
    return <div className="p-4">Loading configuration...</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Multimedia API Configuration</h2>
        <button
          onClick={loadConfig}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {syncStatus && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {syncStatus}
        </div>
      )}

      {/* 添加新提供商 */}
      <div className="border rounded-lg p-4 bg-blue-50">
        <h3 className="text-lg font-semibold mb-4">Add API Provider</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Provider</label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value as MediaProvider)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PROVIDERS.map(({ name, label }) => (
                <option key={name} value={name}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">API Key *</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Base API URL (Optional)</label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://api.example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 功能特定端点 */}
          <div className="border-t pt-3 mt-3">
            <p className="text-sm font-medium text-gray-700 mb-3">Function-Specific Endpoints (Optional)</p>
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium mb-1">Text-to-Image Endpoint</label>
                <input
                  type="text"
                  value={endpoints.textToImage}
                  onChange={(e) => setEndpoints({ ...endpoints, textToImage: e.target.value })}
                  placeholder="e.g., /v1/images/generations"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Image-to-Image Endpoint</label>
                <input
                  type="text"
                  value={endpoints.imageToImage}
                  onChange={(e) => setEndpoints({ ...endpoints, imageToImage: e.target.value })}
                  placeholder="e.g., /v1/images/edits"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Video Generation Endpoint</label>
                <input
                  type="text"
                  value={endpoints.videoGeneration}
                  onChange={(e) => setEndpoints({ ...endpoints, videoGeneration: e.target.value })}
                  placeholder="e.g., /v1/videos/generations"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Text Generation Endpoint</label>
                <input
                  type="text"
                  value={endpoints.textGeneration}
                  onChange={(e) => setEndpoints({ ...endpoints, textGeneration: e.target.value })}
                  placeholder="e.g., /v1/chat/completions"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleAddProvider}
            disabled={loading}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Provider'}
          </button>
        </div>
      </div>

      {/* 功能提供商映射 */}
      <div className="border rounded-lg p-4 bg-purple-50">
        <h3 className="text-lg font-semibold mb-4">Function Provider Mapping</h3>
        <p className="text-sm text-gray-600 mb-4">为每个功能分配 API 供应商</p>
        <div className="space-y-3">
          {[
            { key: 'textToImage', label: '文字转图像 (Text-to-Image)' },
            { key: 'imageToImage', label: '图生图 (Image-to-Image)' },
            { key: 'textGeneration', label: '文本生成 (Text Generation)' },
            { key: 'imageAnalysis', label: '图像分析 (Image Analysis)' },
            { key: 'videoGeneration', label: '视频生成 (Video Generation)' },
            { key: 'videoAnalysis', label: '视频分析 (Video Analysis)' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
              <span className="font-medium">{label}</span>
              <select
                value={config.providers[key as keyof typeof config.providers] || ''}
                onChange={(e) => {
                  const newConfig = {
                    ...config,
                    providers: {
                      ...config.providers,
                      [key]: e.target.value,
                    },
                  };
                  setConfig(newConfig);
                }}
                className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">-- Select Provider --</option>
                {Object.keys(config.configs).map((provider) => (
                  <option key={provider} value={provider}>
                    {provider.charAt(0).toUpperCase() + provider.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* 已配置的提供商 */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Configured Providers</h3>
        <div className="space-y-2">
          {Object.keys(config.configs).length === 0 ? (
            <p className="text-gray-500">No providers configured</p>
          ) : (
            Object.keys(config.configs).map((provider) => (
              <div
                key={provider}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <span className="font-medium capitalize">{provider}</span>
                <button
                  onClick={() => handleSyncConfig(provider as MediaProvider)}
                  className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                >
                  Sync
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2">
        <button
          onClick={handleUpdateConfig}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Configuration'}
        </button>
        <button
          onClick={loadConfig}
          disabled={loading}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default APIConfigPanel;
