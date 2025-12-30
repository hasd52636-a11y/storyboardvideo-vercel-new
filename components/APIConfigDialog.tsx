import React, { useState, useEffect } from 'react';
import VideoService, { VideoAPIProvider } from '../videoService';
import { ZHIPU_MODEL_GROUPS, getDefaultZhipuModels, getModelDisplayName, getModelDescription } from '../zhipuModels';

interface APIConfigDialogProps {
  onConfigured: (config: { baseUrl: string; apiKey: string; provider: VideoAPIProvider }) => void;
  isOpen: boolean;
}

const DEFAULT_URLS: Record<VideoAPIProvider, string> = {
  openai: 'https://api.openai.com',
  dyu: 'https://api.dyuapi.com',
  shenma: 'https://api.whatai.cc',
  zhipu: 'https://open.bigmodel.cn'
};

const PROVIDER_INFO: Record<VideoAPIProvider, { name: string; color: string; description: string; getKeyUrl: string }> = {
  openai: {
    name: 'OpenAI 官方',
    color: '#4CAF50',
    description: '官方支持，最稳定',
    getKeyUrl: 'https://platform.openai.com/api-keys'
  },
  dyu: {
    name: 'DYU API (推荐)',
    color: '#2196F3',
    description: '✅ 支持视频生成，功能丰富',
    getKeyUrl: 'https://api.dyuapi.com'
  },
  shenma: {
    name: '神马 API (Seedance)',
    color: '#FF9800',
    description: '✅ 图生视频，已测试通过',
    getKeyUrl: 'https://api.whatai.cc'
  },
  zhipu: {
    name: '智谱 GLM (推荐)',
    color: '#6366f1',
    description: '✅ 多模态分析 + 视频生成',
    getKeyUrl: 'https://open.bigmodel.cn/usercenter/apikeys'
  }
};

export default function APIConfigDialog({ onConfigured, isOpen }: APIConfigDialogProps) {
  const [provider, setProvider] = useState<VideoAPIProvider>(
    (localStorage.getItem('video_api_provider') as VideoAPIProvider) || 'openai'
  );
  const [apiKey, setApiKey] = useState(
    localStorage.getItem(`sora_api_key_${provider}`) || ''
  );
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [testResult, setTestResult] = useState<{ quota: number; remaining: number } | null>(null);

  // 智谱模型配置
  const [showModelConfig, setShowModelConfig] = useState(false);
  const [zhipuModels, setZhipuModels] = useState(() => {
    const saved = localStorage.getItem('zhipu_models_config');
    return saved ? JSON.parse(saved) : getDefaultZhipuModels();
  });

  // 当提供商改变时，自动加载该提供商的 API Key
  useEffect(() => {
    const savedKey = localStorage.getItem(`sora_api_key_${provider}`) || '';
    setApiKey(savedKey);
    setError(null);
    setSuccess(false);
    setTestResult(null);
  }, [provider]);

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setError('请粘贴你的 API Key');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTestResult(null);

    try {
      const baseUrl = DEFAULT_URLS[provider];
      const videoService = new VideoService({ baseUrl, apiKey, provider });
      const quota = await videoService.getTokenQuota();

      setSuccess(true);
      setTestResult({
        quota: quota.total_quota,
        remaining: quota.remaining_quota
      });

      // 保存配置
      localStorage.setItem('video_api_provider', provider);
      localStorage.setItem(`sora_base_url_${provider}`, baseUrl);
      localStorage.setItem(`sora_api_key_${provider}`, apiKey);

      // 如果是智谱，保存模型配置
      if (provider === 'zhipu') {
        localStorage.setItem('zhipu_models_config', JSON.stringify(zhipuModels));
      }

      onConfigured({ baseUrl, apiKey, provider });

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '连接失败';
      
      if (errorMsg.includes('401') || errorMsg.includes('Unauthorized')) {
        setError('❌ API Key 无效，请检查是否正确复制');
      } else if (errorMsg.includes('403') || errorMsg.includes('Forbidden')) {
        setError('❌ 无权限访问，请检查 API Key 是否有效');
      } else if (errorMsg.includes('429')) {
        setError('❌ 请求过于频繁，请稍后再试');
      } else {
        setError(`❌ ${errorMsg}`);
      }
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const info = PROVIDER_INFO[provider];
  const baseUrl = DEFAULT_URLS[provider];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '450px',
          width: '90%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* 标题 */}
        <h2 style={{ marginTop: 0, marginBottom: '8px', fontSize: '24px', fontWeight: 'bold' }}>
          🎬 配置视频 API
        </h2>
        <p style={{ color: '#999', fontSize: '13px', margin: '0 0 24px 0' }}>
          只需 3 步，2 分钟完成配置
        </p>

        {/* 步骤 1: 选择提供商 */}
        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#333', margin: '0 0 12px 0' }}>
            📍 第 1 步：选择服务商
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            {(['openai', 'dyu', 'shenma', 'zhipu'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setProvider(p)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: provider === p ? PROVIDER_INFO[p].color : '#f0f0f0',
                  color: provider === p ? '#fff' : '#333',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                  boxShadow: provider === p ? `0 4px 12px ${PROVIDER_INFO[p].color}40` : 'none'
                }}
                onMouseEnter={(e) => {
                  if (provider !== p) {
                    e.currentTarget.style.backgroundColor = '#e8e8e8';
                  }
                }}
                onMouseLeave={(e) => {
                  if (provider !== p) {
                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                  }
                }}
              >
                {PROVIDER_INFO[p].name}
              </button>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: '#666', margin: '8px 0 0 0' }}>
            💡 {info.description}
          </p>
        </div>

        {/* 步骤 2: 获取 API Key */}
        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#333', margin: '0 0 12px 0' }}>
            🔑 第 2 步：获取 API Key
          </p>
          <a
            href={info.getKeyUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '10px 16px',
              backgroundColor: info.color,
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 'bold',
              transition: 'opacity 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            👉 点击获取 API Key
          </a>
          <p style={{ fontSize: '12px', color: '#999', margin: '8px 0 0 0' }}>
            会打开新标签页，获取后回来粘贴
          </p>
        </div>

        {/* 步骤 3: 粘贴 API Key */}
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#333', margin: '0 0 12px 0' }}>
            📋 第 3 步：粘贴 API Key
          </p>
          <div style={{ position: 'relative' }}>
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="粘贴你的 API Key 这里..."
              style={{
                width: '100%',
                padding: '12px 40px 12px 12px',
                border: `2px solid ${error ? '#ff6b6b' : success ? '#51cf66' : '#ddd'}`,
                borderRadius: '6px',
                fontSize: '13px',
                boxSizing: 'border-box',
                fontFamily: 'monospace',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                if (!error && !success) {
                  e.currentTarget.style.borderColor = info.color;
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = error ? '#ff6b6b' : success ? '#51cf66' : '#ddd';
              }}
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '0',
                color: '#999'
              }}
              title={showApiKey ? '隐藏' : '显示'}
            >
              {showApiKey ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div
            style={{
              backgroundColor: '#ffe0e0',
              color: '#d32f2f',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '13px',
              border: '1px solid #ffb3b3'
            }}
          >
            {error}
          </div>
        )}

        {/* 成功提示 */}
        {success && testResult && (
          <div
            style={{
              backgroundColor: '#e8f5e9',
              color: '#2e7d32',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '13px',
              border: '1px solid #c8e6c9'
            }}
          >
            ✅ 连接成功！
            <br />
            剩余配额: <strong>{testResult.remaining}</strong> / {testResult.quota}
          </div>
        )}

        {/* 测试按钮 */}
        <button
          onClick={handleTestConnection}
          disabled={isLoading || !apiKey.trim()}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: isLoading ? '#ccc' : info.color,
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'all 0.2s',
            opacity: isLoading || !apiKey.trim() ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!isLoading && apiKey.trim()) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 4px 12px ${info.color}40`;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {isLoading ? '⏳ 测试中...' : '✨ 测试连接'}
        </button>

        {/* 快速提示 */}
        <div
          style={{
            marginTop: '20px',
            padding: '12px',
            backgroundColor: '#f9f9f9',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#666',
            border: '1px solid #f0f0f0'
          }}
        >
          <strong>💡 提示：</strong>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>API Key 只保存在你的浏览器中</li>
            <li>不会上传到任何服务器</li>
            <li>可以随时更换或删除</li>
          </ul>
        </div>

        {/* 智谱模型配置 */}
        {provider === 'zhipu' && success && (
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #eee' }}>
            <button
              onClick={() => setShowModelConfig(!showModelConfig)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#f0f0f0',
                color: '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e0e0e0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }}
            >
              {showModelConfig ? '▼' : '▶'} 🤖 配置模型 (可选)
            </button>

            {showModelConfig && (
              <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
                <p style={{ fontSize: '12px', color: '#666', margin: '0 0 12px 0' }}>
                  选择默认使用的模型（普惠模型系列推荐）
                </p>

                {ZHIPU_MODEL_GROUPS.map((group) => (
                  <div key={group.labelZh} style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#333', margin: '0 0 8px 0' }}>
                      {group.labelZh}
                    </p>
                    <p style={{ fontSize: '11px', color: '#999', margin: '0 0 8px 0' }}>
                      {group.descriptionZh}
                    </p>

                    {group.models.map((model) => (
                      <div key={model.id} style={{ marginBottom: '8px' }}>
                        <select
                          value={zhipuModels[model.category] || model.id}
                          onChange={(e) => {
                            setZhipuModels({
                              ...zhipuModels,
                              [model.category]: e.target.value
                            });
                          }}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '12px',
                            backgroundColor: '#fff',
                            cursor: 'pointer'
                          }}
                        >
                          <option value={model.id}>
                            {model.nameZh} ({model.costLevel === 'low' ? '💰 低成本' : '💎 高质量'})
                          </option>
                        </select>
                        <p style={{ fontSize: '11px', color: '#999', margin: '4px 0 0 0' }}>
                          {model.descriptionZh}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}

                <button
                  onClick={() => {
                    localStorage.setItem('zhipu_models_config', JSON.stringify(zhipuModels));
                    setShowModelConfig(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#6366f1',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginTop: '12px'
                  }}
                >
                  ✅ 保存模型配置
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
