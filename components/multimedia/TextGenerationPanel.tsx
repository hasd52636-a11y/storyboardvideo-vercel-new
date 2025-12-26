/**
 * 文本生成面板
 * 用于输入提示词并生成文本
 */

'use client';

import React, { useState } from 'react';
import { textGeneration } from '@/lib/multimedia-api';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface TextGenerationPanelProps {
  onTextGenerated?: (text: string) => void;
}

export const TextGenerationPanel: React.FC<TextGenerationPanelProps> = ({
  onTextGenerated,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'user', content: '' },
  ]);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleAddMessage = () => {
    setMessages([...messages, { role: 'user', content: '' }]);
  };

  const handleRemoveMessage = (index: number) => {
    setMessages(messages.filter((_, i) => i !== index));
  };

  const handleMessageChange = (index: number, content: string) => {
    const newMessages = [...messages];
    newMessages[index].content = content;
    setMessages(newMessages);
  };

  const handleGenerate = async () => {
    if (messages.some((m) => !m.content.trim())) {
      setError('Please fill in all messages');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const data = await textGeneration(messages, undefined, {
        temperature,
        maxTokens,
      });

      if (data.success) {
        setResult(data.data.text);
        onTextGenerated?.(data.data.text);
      } else {
        setError(data.error?.message || 'Failed to generate text');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Text Generation</h2>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* 消息输入 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Messages</h3>
          <button
            onClick={handleAddMessage}
            disabled={loading}
            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50"
          >
            Add Message
          </button>
        </div>

        {messages.map((message, index) => (
          <div key={index} className="space-y-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <select
                value={message.role}
                onChange={(e) => {
                  const newMessages = [...messages];
                  newMessages[index].role = e.target.value as Message['role'];
                  setMessages(newMessages);
                }}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="user">User</option>
                <option value="assistant">Assistant</option>
                <option value="system">System</option>
              </select>
              {messages.length > 1 && (
                <button
                  onClick={() => handleRemoveMessage(index)}
                  disabled={loading}
                  className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:opacity-50"
                >
                  Remove
                </button>
              )}
            </div>
            <textarea
              value={message.content}
              onChange={(e) => handleMessageChange(index, e.target.value)}
              placeholder="Enter message content..."
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={loading}
            />
          </div>
        ))}
      </div>

      {/* 参数设置 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Temperature: {temperature.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Max Tokens</label>
          <input
            type="number"
            min="100"
            max="4000"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
      </div>

      {/* 生成按钮 */}
      <button
        onClick={handleGenerate}
        disabled={loading || messages.some((m) => !m.content.trim())}
        className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? 'Generating...' : 'Generate Text'}
      </button>

      {/* 结果展示 */}
      {result && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Generated Text</h3>
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

export default TextGenerationPanel;
