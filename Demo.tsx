/**
 * Demo Page for Storyboard Enhancement Features
 * Showcases the new 一键运镜, 一键运动, and Quick Storyboard features
 */

import React, { useState } from 'react';

const Demo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'camera' | 'action' | 'quick' | 'canvas' | 'history'>('camera');
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock camera motion symbols
  const [cameraSymbols, setCameraSymbols] = useState([
    { id: '1', name: 'Pan Left', description: 'Camera pans from right to left', icon: '←' },
    { id: '2', name: 'Pan Right', description: 'Camera pans from left to right', icon: '→' },
    { id: '3', name: 'Zoom In', description: 'Camera zooms into the subject', icon: '🔍' },
    { id: '4', name: 'Zoom Out', description: 'Camera zooms away from subject', icon: '📏' },
    { id: '5', name: 'Orbit', description: 'Camera orbits around subject', icon: '⭕' },
    { id: '6', name: 'Tilt Up', description: 'Camera tilts upward', icon: '↑' },
  ]);

  // Mock action motion types
  const actionTypes = [
    { id: 'forward', name: 'Forward', chineseName: '前进', description: 'Move forward with momentum', icon: '▶️' },
    { id: 'rotate', name: 'Rotate', chineseName: '旋转', description: 'Spin around axis', icon: '🔄' },
    { id: 'jump', name: 'Jump', chineseName: '跳跃', description: 'Jump up and land', icon: '⬆️' },
    { id: 'fly', name: 'Fly', chineseName: '飞行', description: 'Fly through the air', icon: '✈️' },
  ];

  // Mock quick storyboard templates
  const quickTemplates = [
    { id: 'three-view', name: 'Three View', description: 'Front, side, and top orthographic views', icon: '📐' },
    { id: 'multi-grid', name: 'Multi Grid', description: 'Multiple variations in grid layout', icon: '🔲' },
    { id: 'style-comparison', name: 'Style Comparison', description: 'Compare different art styles', icon: '🎨' },
    { id: 'narrative-progression', name: 'Narrative', description: 'Story progression sequence', icon: '📖' },
  ];

  // Generate mock images
  const generateMockImages = (type: string, count: number = 3) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
    const images = [];
    for (let i = 0; i < count; i++) {
      images.push({
        id: `img-${Date.now()}-${i}`,
        url: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='${colors[i % colors.length]}' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3E${type} - View ${i + 1}%3C/text%3E%3C/svg%3E`,
        label: `View ${i + 1}`,
      });
    }
    return images;
  };

  const handleGenerate = (type: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      const images = generateMockImages(type, type === 'multi-grid' ? 6 : 3);
      setGeneratedImages(images);
      setActiveTab('canvas');
      setIsGenerating(false);
    }, 1500);
  };

  const handleUploadSymbol = () => {
    const name = prompt('输入运镜名称:');
    if (!name) return;
    const desc = prompt('输入运镜描述:');
    if (!desc) return;
    const icon = prompt('输入运镜图标 (emoji):');
    if (!icon) return;

    const newSymbol = {
      id: Date.now().toString(),
      name,
      description: desc,
      icon,
    };
    setCameraSymbols([...cameraSymbols, newSymbol]);
  };

  const handleDeleteSymbol = (id: string) => {
    if (confirm('确定要删除这个运镜吗？')) {
      setCameraSymbols(cameraSymbols.filter(s => s.id !== id));
    }
  };

  const handleEditSymbol = (symbol: any) => {
    const newName = prompt('编辑运镜名称:', symbol.name);
    if (!newName) return;
    const newDesc = prompt('编辑运镜描述:', symbol.description);
    if (!newDesc) return;

    setCameraSymbols(cameraSymbols.map(s =>
      s.id === symbol.id
        ? { ...s, name: newName, description: newDesc }
        : s
    ));
  };

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '20px', borderBottom: '1px solid #eee', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: '0 0 15px 0', fontSize: '28px', color: '#333' }}>故事板增强 Demo</h1>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {(['camera', 'action', 'quick', 'canvas', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                background: activeTab === tab ? '#007bff' : '#f0f0f0',
                color: activeTab === tab ? 'white' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s',
              }}
            >
              {tab === 'camera' && '一键运镜'}
              {tab === 'action' && '一键运动'}
              {tab === 'quick' && '快捷分镜'}
              {tab === 'canvas' && 'Canvas'}
              {tab === 'history' && 'History'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#f5f5f5' }}>
        {/* 一键运镜 Tab */}
        {activeTab === 'camera' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#333' }}>一键运镜 (Camera Motion Library)</h2>
              <button
                onClick={handleUploadSymbol}
                style={{
                  padding: '10px 20px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                + 上传运镜
              </button>
            </div>
            <p style={{ color: '#666', marginBottom: '20px' }}>选择一个运镜来生成故事板视图，或上传自定义运镜</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
              {cameraSymbols.map((symbol: any) => (
                <div
                  key={symbol.id}
                  onClick={() => handleGenerate(`camera-${symbol.name}`)}
                  style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.3s',
                    border: '2px solid transparent',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ fontSize: '50px', marginBottom: '10px' }}>{symbol.icon}</div>
                  <h3 style={{ margin: '10px 0 5px 0', fontSize: '16px', color: '#333' }}>{symbol.name}</h3>
                  <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#999' }}>{symbol.description}</p>
                  <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditSymbol(symbol);
                      }}
                      style={{
                        flex: 1,
                        padding: '5px 10px',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      编辑
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSymbol(symbol.id);
                      }}
                      style={{
                        flex: 1,
                        padding: '5px 10px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 一键运动 Tab */}
        {activeTab === 'action' && (
          <div>
            <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>一键运动 (Action Motion)</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>选择一个动作来生成运动序列</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
              {actionTypes.map((action: any) => (
                <div
                  key={action.id}
                  onClick={() => handleGenerate(action.id)}
                  style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.3s',
                    border: '2px solid transparent',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ fontSize: '50px', marginBottom: '10px' }}>{action.icon}</div>
                  <h3 style={{ margin: '10px 0 5px 0', fontSize: '16px', color: '#333' }}>{action.chineseName}</h3>
                  <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>{action.name}</p>
                  <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#999' }}>{action.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 快捷分镜 Tab */}
        {activeTab === 'quick' && (
          <div>
            <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>快捷分镜 (Quick Storyboard)</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>选择一个模板来生成故事板布局</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
              {quickTemplates.map((template: any) => (
                <div
                  key={template.id}
                  onClick={() => handleGenerate(template.id)}
                  style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.3s',
                    border: '2px solid transparent',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ fontSize: '50px', marginBottom: '10px' }}>{template.icon}</div>
                  <h3 style={{ margin: '10px 0 5px 0', fontSize: '16px', color: '#333' }}>{template.name}</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>{template.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Canvas Tab */}
        {activeTab === 'canvas' && (
          <div>
            <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>生成画布</h2>
            {isGenerating && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #007bff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 15px',
                }} />
                <p style={{ color: '#666' }}>生成中...</p>
              </div>
            )}
            {!isGenerating && generatedImages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                <p>还没有生成图像。从其他标签页选择一个选项来生成。</p>
              </div>
            )}
            {generatedImages.length > 0 && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                  {generatedImages.map((img: any) => (
                    <div key={img.id} style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      <img src={img.url} alt={img.label} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                      <div style={{ padding: '10px', textAlign: 'center', fontSize: '14px', color: '#666' }}>{img.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    onClick={() => setGeneratedImages([])}
                    style={{
                      padding: '10px 20px',
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    清空
                  </button>
                  <button
                    onClick={() => alert('已保存！(Demo only)')}
                    style={{
                      padding: '10px 20px',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    保存生成
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>生成历史</h2>
            <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333' }}>类型</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333' }}>时间</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333' }}>图像数</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px', color: '#333' }}>three-view</td>
                    <td style={{ padding: '12px', color: '#666' }}>2024-12-26 10:30:00</td>
                    <td style={{ padding: '12px', color: '#666' }}>3</td>
                    <td style={{ padding: '12px' }}>
                      <button style={{ padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', marginRight: '5px' }}>查看</button>
                      <button style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>删除</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Demo;
