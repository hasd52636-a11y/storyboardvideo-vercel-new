/**
 * 多媒体应用主容器
 * 集成所有多媒体功能面板
 */

'use client';

import React, { useState } from 'react';
import { APIConfigPanel } from './APIConfigPanel';
import { TextToImagePanel } from './TextToImagePanel';
import { ImageEditPanel } from './ImageEditPanel';
import { TextGenerationPanel } from './TextGenerationPanel';
import { ImageAnalysisPanel } from './ImageAnalysisPanel';
import { VideoGenerationPanel } from './VideoGenerationPanel';
import { VideoAnalysisPanel } from './VideoAnalysisPanel';
import { MultiMediaConfig } from '@/services/multimedia/types';

type TabType = 'config' | 'text-to-image' | 'image-edit' | 'text-generation' | 'image-analysis' | 'video-generation' | 'video-analysis';

interface MultimediaAppProps {
  initialConfig?: MultiMediaConfig;
}

export const MultimediaApp: React.FC<MultimediaAppProps> = ({ initialConfig }) => {
  const [activeTab, setActiveTab] = useState<TabType>('config');
  const [config, setConfig] = useState<MultiMediaConfig | undefined>(initialConfig);

  const tabs: Array<{ id: TabType; label: string; icon: string }> = [
    { id: 'config', label: 'Configuration', icon: '⚙️' },
    { id: 'text-to-image', label: 'Text-to-Image', icon: '🖼️' },
    { id: 'image-edit', label: 'Image Editing', icon: '✏️' },
    { id: 'text-generation', label: 'Text Generation', icon: '📝' },
    { id: 'image-analysis', label: 'Image Analysis', icon: '🔍' },
    { id: 'video-generation', label: 'Video Generation', icon: '🎬' },
    { id: 'video-analysis', label: 'Video Analysis', icon: '📹' },
  ];

  const handleConfigChange = (newConfig: MultiMediaConfig) => {
    setConfig(newConfig);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'config':
        return <APIConfigPanel initialConfig={config} onConfigChange={handleConfigChange} />;
      case 'text-to-image':
        return <TextToImagePanel />;
      case 'image-edit':
        return <ImageEditPanel />;
      case 'text-generation':
        return <TextGenerationPanel />;
      case 'image-analysis':
        return <ImageAnalysisPanel />;
      case 'video-generation':
        return <VideoGenerationPanel />;
      case 'video-analysis':
        return <VideoAnalysisPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 标题栏 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Multimedia Studio</h1>
        <p className="text-gray-600 mt-1">Unified multimedia generation and analysis platform</p>
      </div>

      {/* 标签栏 */}
      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-1 px-6 py-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </div>

      {/* 页脚 */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 text-center text-sm text-gray-600">
        <p>Multimedia Studio v1.0 • Powered by Shenma, OpenAI, Zhipu, and more</p>
      </div>
    </div>
  );
};

export default MultimediaApp;
