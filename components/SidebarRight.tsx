
import React, { useState } from 'react';
import { Language, I18N, ModelProvider, ChatMessage, Theme, ExportLayout, SYMBOL_LABELS, SYMBOL_DESCRIPTIONS, StoryboardItem, StyleOption, STYLES, AspectRatio, ImageAttachmentState } from '../types';
import { chatWithGemini } from '../geminiService';
import StyleSelector from './StyleSelector';
import { useHelpAssistant } from './HelpAssistant';
import { validateImageFile, generateImagePreview, getImageMetadata, convertImageForAPI } from '../lib/image-utils';

interface SidebarRightProps {
  lang: Language;
  theme: Theme;
  isLoading: boolean;
  isExpanded: boolean;
  setIsExpanded: (e: boolean) => void;
  onGenerateFromScript: (script: string, count: number, style?: StyleOption, aspectRatio?: AspectRatio, duration?: number) => void;
  onExportPrompts: (editedContent?: string) => void;
  onExportJPEG: () => void;
  getFormattedPrompts: () => string;
  model: ModelProvider;
  setModel: (m: ModelProvider) => void;
  onGenerateFromDialogue?: (scenes: any[], frameCount: number, style: string, aspectRatio?: string, duration?: number) => void;
  globalColorMode: 'color' | 'blackAndWhite';
  onOpenHelp?: () => void;
  onStyleChange?: (style: StyleOption | null) => void;
  onAspectRatioChange?: (ratio: AspectRatio | null) => void;
  onGenerateVideo?: () => void;
  selectedCount?: number;
}

const SidebarRight: React.FC<SidebarRightProps> = ({ 
  lang, theme, isLoading, isExpanded, setIsExpanded, onGenerateFromScript, onExportPrompts, onExportJPEG, getFormattedPrompts, model, setModel, onGenerateFromDialogue, globalColorMode, onOpenHelp, onStyleChange, onAspectRatioChange, onGenerateVideo, selectedCount
}) => {
  const [activeTab, setActiveTab] = useState<'script' | 'chat'>('chat');
  const [scriptInput, setScriptInput] = useState('');
  const [frameCount, setFrameCount] = useState(1);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [editablePrompts, setEditablePrompts] = useState('');
  const [showChatGuide, setShowChatGuide] = useState(true);
  const [isHelpMode, setIsHelpMode] = useState(false);
  const [previewLang, setPreviewLang] = useState<'zh' | 'en'>('zh');
  
  // Script mode style
  const [scriptStyle, setScriptStyle] = useState<StyleOption | null>(null);
  const [scriptDuration, setScriptDuration] = useState(0);
  const [scriptAspectRatio, setScriptAspectRatio] = useState<AspectRatio | null>(null);
  
  // Chat mode config
  const [chatFrameCount, setChatFrameCount] = useState(1);
  const [chatDuration, setChatDuration] = useState(0);
  const [chatStyle, setChatStyle] = useState<StyleOption | null>(null);
  const [chatAspectRatio, setChatAspectRatio] = useState<AspectRatio | null>(null);

  // Image attachment state
  const [attachedImage, setAttachedImage] = useState<ImageAttachmentState>({
    file: null,
    preview: '',
    dimensions: null,
    fileSize: 0,
    isLoading: false,
    error: null,
  });

  const t = I18N[lang];
  const models: ModelProvider[] = ['banana', 'gemini', 'openai', 'veo'];

  // 包装函数：更新风格并通知父组件
  const handleScriptStyleChange = (style: StyleOption | null) => {
    setScriptStyle(style);
    onStyleChange?.(style);
  };

  const handleChatStyleChange = (style: StyleOption | null) => {
    setChatStyle(style);
    onStyleChange?.(style);
  };

  // 包装函数：更新画幅并通知父组件
  const handleScriptAspectRatioChange = (ratio: AspectRatio | null) => {
    setScriptAspectRatio(ratio);
    onAspectRatioChange?.(ratio);
  };

  const handleChatAspectRatioChange = (ratio: AspectRatio | null) => {
    setChatAspectRatio(ratio);
    onAspectRatioChange?.(ratio);
  };

  // Image attachment handlers
  const handleImageSelect = async (file: File) => {
    setAttachedImage(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Validate image
      const validation = await validateImageFile(file);
      if (!validation.valid) {
        setAttachedImage(prev => ({
          ...prev,
          isLoading: false,
          error: validation.error || 'Invalid image file',
        }));
        return;
      }

      // Generate preview
      const preview = await generateImagePreview(file);
      
      // Get metadata
      const metadata = await getImageMetadata(file);

      setAttachedImage({
        file,
        preview,
        dimensions: { width: metadata.width, height: metadata.height },
        fileSize: metadata.size,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAttachedImage(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to process image',
      }));
    }
  };

  const handleRemoveImage = () => {
    setAttachedImage({
      file: null,
      preview: '',
      dimensions: null,
      fileSize: 0,
      isLoading: false,
      error: null,
    });
  };

  const { detectHelpCommand, buildAIPrompt, isLoaded: isKnowledgeBaseLoaded } = useHelpAssistant();

  const handleSendChat = async (guideText?: string) => {
    const text = guideText || chatInput;
    if (!text.trim() || isChatLoading) return;
    
    // Create user message with optional image
    const userMessage: ChatMessage = { 
      role: 'user', 
      text,
      images: attachedImage.preview ? [attachedImage.preview] : undefined
    };
    
    const history = [...chatHistory, userMessage];
    setChatHistory(history);
    setChatInput('');
    
    // Clear image attachment after sending
    handleRemoveImage();
    setIsChatLoading(true);
    
    try {
      let resp: string;
      
      if (isHelpMode) {
        // 帮助模式：构建包含知识库的提示词
        if (!isKnowledgeBaseLoaded) {
          const waitMsg = lang === 'zh' 
            ? '知识库正在加载中，请稍候...' 
            : 'Knowledge base is loading, please wait...';
          setChatHistory([...history, { role: 'model', text: waitMsg } as ChatMessage]);
          setIsChatLoading(false);
          return;
        }
        
        const systemContext = buildAIPrompt(text, lang);
        const messagesWithContext = [
          { role: 'user', parts: [{ text: systemContext }] }
        ];
        resp = await chatWithGemini(messagesWithContext);
      } else {
        // 正常对话流程 - 支持图片
        resp = await chatWithGemini(history);
      }
      
      const aiResponse = resp || (lang === 'zh' ? '抱歉，无法获取回复。请检查API配置。' : 'Sorry, unable to get response. Please check API configuration.');
      setChatHistory([...history, { role: 'model', text: aiResponse } as ChatMessage]);
    } catch (e) {
      console.error("Chat error:", e);
      const errorMsg = lang === 'zh' ? '发生错误，请重试。' : 'An error occurred, please try again.';
      setChatHistory([...history, { role: 'model', text: errorMsg } as ChatMessage]);
    } finally { setIsChatLoading(false); }
  };

  const handleGenerateStoryboard = async () => {
    if (chatHistory.length === 0) return;
    if (!onGenerateFromDialogue) return;
    
    // Import the functions here to avoid circular dependency
    const { generateStoryboardFromDialogue } = await import('../geminiService');
    
    try {
      // 立即显示加载状态
      setIsChatLoading(true);
      
      const styleName = chatStyle?.nameZh || chatStyle?.name || '';
      const scenes = await generateStoryboardFromDialogue(
        chatHistory, 
        chatFrameCount, 
        styleName,
        chatDuration > 0 ? chatDuration : undefined,
        chatAspectRatio || undefined,
        lang  // 传递当前语言
      );
      
      console.log("Generated scenes:", scenes);
      
      // Call the parent handler with the generated scenes
      if (scenes && scenes.length > 0) {
        onGenerateFromDialogue(scenes, chatFrameCount, chatStyle?.id || '', chatAspectRatio || undefined, chatDuration > 0 ? chatDuration : undefined);
      }
    } catch (e) {
      console.error("Failed to generate storyboard from dialogue", e);
    } finally {
      setIsChatLoading(false);
    }
  };

  const toggleSidebar = (tab?: 'script' | 'chat') => {
    if (tab) {
      if (isExpanded && activeTab === tab) {
        setIsExpanded(false);
      } else {
        setActiveTab(tab);
        setIsExpanded(true);
      }
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className={`h-full relative border-l z-50 flex flex-col no-print transition-all duration-500 shadow-2xl overflow-visible ${isExpanded ? 'w-[420px]' : 'w-20'} ${theme === 'dark' ? 'bg-[#0a0a0c] border-white/5 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600'}`}>
      
      {/* Tab Controls / Toggle */}
      <div className={`flex flex-col h-full ${!isExpanded ? 'items-center' : ''}`}>
        <div className={`flex border-b w-full ${theme === 'dark' ? 'border-white/5' : 'border-zinc-100'}`}>
          <button 
            onClick={() => toggleSidebar('script')} 
            className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'script' && isExpanded ? 'text-purple-500 border-b-4 border-purple-500' : 'text-zinc-500'}`}
            title={t.scriptMode}
          >
            {isExpanded ? t.scriptMode : '📄'}
          </button>
          <button 
            onClick={() => toggleSidebar('chat')} 
            className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'chat' && isExpanded ? 'text-purple-500 border-b-4 border-purple-500' : 'text-zinc-500'}`}
            title={t.chatMode}
          >
            {isExpanded ? t.chatMode : '💬'}
          </button>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-300">
            {activeTab === 'script' ? (
              <div className="flex-1 overflow-y-auto no-scrollbar p-10 space-y-12">
                <section className="space-y-5">
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-widest opacity-50">{lang === 'zh' ? '生成配置' : 'Generation Config'}</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-black uppercase opacity-50">
                          <span>{t.frameCount}</span>
                          <span>{frameCount}</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setFrameCount(Math.max(1, frameCount - 1))} className={`flex-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${theme === 'dark' ? 'bg-white/5 border border-white/10 hover:border-purple-500/50' : 'bg-zinc-50 border border-zinc-300 hover:border-purple-500'}`}>−</button>
                          <input type="number" min="1" max="16" value={frameCount} onChange={e => setFrameCount(Math.max(1, Math.min(16, Number(e.target.value))))} className={`flex-1 px-2 py-2 rounded-lg text-xs font-bold border text-center outline-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300 text-black'}`} />
                          <button onClick={() => setFrameCount(Math.min(16, frameCount + 1))} className={`flex-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${theme === 'dark' ? 'bg-white/5 border border-white/10 hover:border-purple-500/50' : 'bg-zinc-50 border border-zinc-300 hover:border-purple-500'}`}>+</button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase opacity-50">{lang === 'zh' ? '风格' : 'Style'}</label>
                        {scriptStyle && <StyleSelector selectedStyle={scriptStyle} onStyleChange={setScriptStyle} lang={lang} theme={theme} />}
                        {!scriptStyle && (
                          <button
                            onClick={() => setScriptStyle(STYLES[0])}
                            className={`w-full px-3 py-2 border rounded-lg text-xs font-semibold transition-all ${
                              theme === 'dark'
                                ? 'bg-white/5 border-white/10 text-white/50 hover:border-purple-500/50'
                                : 'bg-zinc-50 border-zinc-300 text-zinc-500 hover:border-purple-500'
                            }`}
                          >
                            {lang === 'zh' ? '选择风格...' : 'Select Style...'}
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-black uppercase opacity-50">
                          <span>{lang === 'zh' ? '时长' : 'Duration'}</span>
                          <span>{scriptDuration}s</span>
                        </div>
                        <input type="range" min="5" max="120" step="5" value={scriptDuration} onChange={e => setScriptDuration(Number(e.target.value))} className="w-full accent-purple-600 h-1" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase opacity-50">{lang === 'zh' ? '画面比例' : 'Aspect Ratio'}</label>
                        <div className="grid grid-cols-4 gap-2">
                          {(['16:9', '4:3', '9:16', '1:1', '21:9', '4:5', '3:2'] as AspectRatio[]).map(ratio => (
                            <button
                              key={ratio}
                              onClick={() => setScriptAspectRatio(ratio)}
                              className={`px-2 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                                scriptAspectRatio === ratio
                                  ? 'bg-purple-600 text-white'
                                  : theme === 'dark'
                                  ? 'bg-white/5 border border-white/10 text-zinc-400 hover:border-purple-500/50'
                                  : 'bg-zinc-50 border border-zinc-300 text-zinc-600 hover:border-purple-500'
                              }`}
                            >
                              {ratio}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <textarea 
                    value={scriptInput} 
                    onChange={e => setScriptInput(e.target.value)} 
                    placeholder={t.inputPlaceholder} 
                    className={`w-full h-40 rounded-[2rem] p-6 text-sm font-bold border-2 border-purple-500 outline-none transition-all focus:border-purple-600 focus:shadow-lg focus:shadow-purple-500/30 ${theme === 'dark' ? 'bg-white/5' : 'bg-zinc-50 text-black'}`} 
                  />
                  <button 
                    onClick={() => onGenerateFromScript(scriptInput, frameCount, scriptStyle || undefined, scriptAspectRatio, scriptDuration)} 
                    disabled={isLoading}
                    title={lang === 'zh' ? '根据剧本生成分镜' : 'Generate frames from script'}
                    className="w-full py-5 bg-purple-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isLoading ? t.loading : t.generate}
                  </button>
                </section>


                <section className="space-y-4 pt-4">
                  <button 
                    onClick={onExportJPEG} 
                    title={lang === 'zh' ? '导出选中的分镜为JPEG图片' : 'Export selected frames as JPEG'}
                    className="w-full py-5 border-2 border-purple-500 text-purple-500 font-black uppercase tracking-widest rounded-2xl hover:bg-purple-600 hover:text-white transition-all shadow-lg"
                  >
                    {t.compositeExport}
                  </button>
                  <button 
                    onClick={onGenerateVideo} 
                    disabled={!selectedCount || selectedCount === 0}
                    title={lang === 'zh' ? '使用选中的分镜和提示词生成视频' : 'Generate video with selected frames and prompts'}
                    className="w-full py-5 border-2 border-blue-500 text-blue-500 font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🎬 {lang === 'zh' ? '生成视频' : 'Generate Video'}
                  </button>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { 
                        const prompts = getFormattedPrompts();
                        // 如果返回的是对象（中英文版本），使用中文版本
                        const content = typeof prompts === 'string' ? prompts : (prompts as any).zh || '';
                        setEditablePrompts(content); 
                        setPreviewLang('zh');
                        setShowPreviewModal(true); 
                      }} 
                      title={lang === 'zh' ? '预览并编辑导出的提示词' : 'Preview and edit export prompts'}
                      className={`flex-1 py-4 font-black uppercase text-[10px] tracking-widest rounded-xl transition-all ${theme === 'dark' ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
                    >
                      {t.previewPrompts}
                    </button>
                    <button 
                      onClick={() => onExportPrompts()} 
                      title={lang === 'zh' ? '下载提示词为文本文件' : 'Download prompts as text file'}
                      className={`flex-1 py-4 font-black uppercase text-[10px] tracking-widest rounded-xl transition-all ${theme === 'dark' ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
                    >
                      {t.exportPrompts}
                    </button>
                  </div>
                </section>
              </div>
            ) : activeTab === 'chat' ? (
              <div className="h-full flex flex-col gap-0 overflow-hidden">
                <div className="space-y-2 p-4 border-b flex-shrink-0" style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#e5e7eb' }}>
                  <h3 className="text-xs font-black uppercase tracking-widest opacity-50">{lang === 'zh' ? '生成配置' : 'Generation Config'}</h3>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-black uppercase opacity-50">
                        <span>{t.frameCount}</span>
                        <span>{chatFrameCount}</span>
                      </div>
                      <input type="range" min="1" max="16" value={chatFrameCount} onChange={e => setChatFrameCount(Number(e.target.value))} className="w-full accent-purple-600 h-1" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-black uppercase opacity-50">
                        <span>{lang === 'zh' ? '时长' : 'Duration'}</span>
                        <span>{chatDuration}s</span>
                      </div>
                      <input type="range" min="5" max="120" step="5" value={chatDuration} onChange={e => setChatDuration(Number(e.target.value))} className="w-full accent-purple-600 h-1" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase opacity-50">{lang === 'zh' ? '风格' : 'Style'}</label>
                      {chatStyle && <StyleSelector selectedStyle={chatStyle} onStyleChange={setChatStyle} lang={lang} theme={theme} />}
                      {!chatStyle && (
                        <button
                          onClick={() => setChatStyle(STYLES[0])}
                          className={`w-full px-3 py-2 border rounded-lg text-xs font-semibold transition-all ${
                            theme === 'dark'
                              ? 'bg-white/5 border-white/10 text-white/50 hover:border-purple-500/50'
                              : 'bg-zinc-50 border-zinc-300 text-zinc-500 hover:border-purple-500'
                          }`}
                        >
                          {lang === 'zh' ? '选择风格...' : 'Select Style...'}
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase opacity-50">{lang === 'zh' ? '画面比例' : 'Aspect Ratio'}</label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['16:9', '4:3', '9:16', '1:1', '21:9', '4:5', '3:2'] as AspectRatio[]).map(ratio => (
                          <button
                            key={ratio}
                            onClick={() => setChatAspectRatio(ratio)}
                            className={`px-2 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                              chatAspectRatio === ratio
                                ? 'bg-purple-600 text-white'
                                : theme === 'dark'
                                ? 'bg-white/5 border border-white/10 text-zinc-400 hover:border-purple-500/50'
                                : 'bg-zinc-50 border border-zinc-300 text-zinc-600 hover:border-purple-500'
                            }`}
                          >
                            {ratio}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setIsHelpMode(!isHelpMode)}
                      title={lang === 'zh' ? '不会使用，点击"智慧客服"向我提问' : 'Don\'t know how to use? Click "Smart Service" to ask me'}
                      className={`w-full py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${
                        isHelpMode
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50'
                          : theme === 'dark'
                          ? 'bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 hover:border-blue-500/50'
                          : 'bg-zinc-50 border border-zinc-300 text-zinc-600 hover:bg-blue-50 hover:border-blue-500'
                      }`}
                    >
                      {isHelpMode ? '📚 ' : '📖 '}{lang === 'zh' ? '智慧客服' : 'Smart Service'}
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 px-4 py-2 no-scrollbar min-h-0">
                  {chatHistory.length === 0 && showChatGuide && (
                    <div className={`p-4 rounded-2xl border text-xs font-bold leading-relaxed space-y-3 ${theme === 'dark' ? 'bg-purple-500/10 border-purple-500/30 text-purple-200' : 'bg-purple-50 border-purple-200 text-purple-700'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-black uppercase mb-3">💡 {lang === 'zh' ? '创意对话模式' : 'Creative Chat Mode'}</p>
                          <div className="space-y-2">
                            <p>{lang === 'zh' ? '输入你的想法，AI将根据上下文自动总结成脚本' : 'Enter your idea, AI will automatically summarize it into a script based on context'}</p>
                          </div>
                        </div>
                        <button
                          onClick={onOpenHelp}
                          className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all hover:scale-110 ${theme === 'dark' ? 'bg-purple-500/30 hover:bg-purple-500/50 text-purple-300' : 'bg-purple-200 hover:bg-purple-300 text-purple-700'}`}
                          title={lang === 'zh' ? '查看完整使用说明' : 'View complete guide'}
                        >
                          📖
                        </button>
                      </div>
                      <button
                        onClick={() => setShowChatGuide(false)}
                        className={`w-full py-2 rounded-lg text-xs font-black uppercase transition-all ${theme === 'dark' ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'}`}
                      >
                        {lang === 'zh' ? '关闭' : 'Close'}
                      </button>
                    </div>
                  )}
                  {chatHistory.length === 0 && !showChatGuide && <p className="text-[10px] uppercase font-black opacity-30 text-center mt-8">{lang === 'zh' ? '暂无对话历史' : 'No conversation history yet.'}</p>}
                  {chatHistory.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className="flex flex-col gap-1">
                        <div className={`max-w-[85%] p-3 rounded-2xl text-xs font-bold leading-relaxed whitespace-pre-wrap break-words ${m.role === 'user' ? 'bg-purple-600 text-white' : theme === 'dark' ? 'bg-zinc-800 border border-zinc-700 text-zinc-100' : 'bg-zinc-100 border border-zinc-300 text-zinc-900'}`}>{m.text}</div>
                        
                        {/* Display images if present */}
                        {m.images && m.images.length > 0 && (
                          <div className="flex flex-wrap gap-2 max-w-[85%]">
                            {m.images.map((img, imgIdx) => (
                              <div key={imgIdx} className="rounded-lg overflow-hidden border border-zinc-400">
                                <img 
                                  src={img} 
                                  alt={`Message image ${imgIdx + 1}`}
                                  className="max-w-[200px] max-h-[150px] object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(m.text);
                            alert(t.copiedMessage);
                          }}
                          title={t.copyMessage}
                          className={`text-[9px] opacity-50 hover:opacity-100 transition-opacity w-fit flex items-center gap-1 ${m.role === 'user' ? 'ml-auto pr-1' : 'pl-1'}`}
                        >
                          <span>📋</span>
                          <span className={`text-[8px] font-semibold ${m.role === 'user' ? 'text-purple-400' : theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                            {lang === 'zh' ? '复制' : 'Copy'}
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                  {isChatLoading && <div className="text-[10px] uppercase font-black text-purple-500 animate-pulse">{lang === 'zh' ? '思考中...' : 'Thinking...'}</div>}
                </div>
                <div className={`flex flex-col gap-2 border-t px-4 py-3 flex-shrink-0 relative ${theme === 'dark' ? 'border-white/5' : 'border-zinc-100'}`}>
                  <div className="flex gap-2">
                    <textarea 
                      value={chatInput} 
                      onChange={e => setChatInput(e.target.value)} 
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendChat()} 
                      placeholder={lang === 'zh' ? '输入创意想法... (Shift+Enter 换行)' : 'Brainstorm with AI... (Shift+Enter for new line)'} 
                      className={`flex-1 bg-transparent text-sm font-bold outline-none border-2 border-purple-500 rounded-xl px-3 py-2 transition-all focus:border-purple-600 focus:shadow-lg focus:shadow-purple-500/30 resize-none min-h-[100px] ${theme === 'dark' ? 'text-white' : 'text-black'}`} 
                    />
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button 
                        onClick={() => handleSendChat()} 
                        disabled={!chatInput.trim() || isChatLoading}
                        title={lang === 'zh' ? '发送消息 (Enter)' : 'Send message (Enter)'}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${
                          chatInput.trim() && !isChatLoading
                            ? 'bg-purple-600 text-white shadow-lg hover:scale-110'
                            : 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
                        }`}
                      >
                        ↑
                      </button>
                      <input
                        type="file"
                        id="chat-image-input"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageSelect(file);
                          }
                          // Reset input so same file can be selected again
                          e.target.value = '';
                        }}
                        className="hidden"
                      />
                      <button 
                        onClick={() => document.getElementById('chat-image-input')?.click()}
                        disabled={isChatLoading}
                        title={lang === 'zh' ? '添加图片 (支持JPEG, PNG, WebP, GIF)' : 'Add image (JPEG, PNG, WebP, GIF)'}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${
                          !isChatLoading
                            ? 'bg-blue-600 text-white shadow-lg hover:scale-110'
                            : 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
                        }`}
                      >
                        📎
                      </button>
                    </div>
                  </div>
                  
                  {/* Image Preview */}
                  {attachedImage.file && (
                    <div className={`relative rounded-xl overflow-hidden border-2 ${theme === 'dark' ? 'border-blue-500/50 bg-blue-500/10' : 'border-blue-300 bg-blue-50'}`}>
                      <div className="relative group">
                        <img 
                          src={attachedImage.preview} 
                          alt="Attached" 
                          className="w-full h-auto max-h-40 object-cover"
                        />
                        <button
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white rounded-lg p-1 hover:bg-red-700"
                          title={lang === 'zh' ? '移除图片' : 'Remove image'}
                        >
                          ✕
                        </button>
                      </div>
                      <div className={`p-2 text-xs font-bold ${theme === 'dark' ? 'bg-blue-500/20 text-blue-200' : 'bg-blue-100 text-blue-700'}`}>
                        <div>{attachedImage.dimensions ? `${attachedImage.dimensions.width}×${attachedImage.dimensions.height}px` : 'Loading...'}</div>
                        <div>{attachedImage.fileSize ? `${(attachedImage.fileSize / 1024).toFixed(1)}KB` : ''}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Error Message */}
                  {attachedImage.error && (
                    <div className={`p-2 rounded-lg text-xs font-bold ${theme === 'dark' ? 'bg-red-500/20 text-red-200 border border-red-500/50' : 'bg-red-100 text-red-700 border border-red-300'}`}>
                      {attachedImage.error}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setChatHistory([])} 
                  title={lang === 'zh' ? '清除对话历史' : 'Clear chat history'}
                  className={`w-8 h-8 flex items-center justify-center text-base transition-all hover:scale-110 active:scale-95 bg-gradient-to-br from-red-400 to-red-600 rounded-lg text-white shadow-md hover:shadow-lg`}
                >
                  🗑️
                </button>
                <button 
                  onClick={() => handleGenerateStoryboard()} 
                  disabled={isLoading || chatHistory.length === 0}
                  title={lang === 'zh' ? '根据对话内容生成分镜' : 'Generate storyboard from dialogue'}
                  className="mx-4 mb-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 text-sm flex-shrink-0"
                >
                  {isLoading ? (lang === 'zh' ? '生成中...' : 'Generating...') : (lang === 'zh' ? '生成分镜' : 'Generate Storyboard')}
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* Collapsed view toggle button */}
        {!isExpanded && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setIsExpanded(true)} 
              title={lang === 'zh' ? '展开面板' : 'Expand panel'}
              className="text-2xl hover:scale-125 transition-transform"
            >
              ⚡
            </button>
            <div className="h-20 w-[1px] bg-zinc-800" />
            <button 
              onClick={onExportJPEG} 
              title={lang === 'zh' ? '导出分镜 (需先选择)' : 'Export frames (select first)'}
              className="text-2xl hover:scale-125 transition-transform"
            >
              📸
            </button>
          </div>
        )}
      </div>

      {/* Floating Toggle Pin */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        title={lang === 'zh' ? (isExpanded ? '收起面板' : '展开面板') : (isExpanded ? 'Collapse panel' : 'Expand panel')}
        className={`absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border flex items-center justify-center shadow-xl z-[60] transition-transform hover:scale-110 ${theme === 'dark' ? 'bg-zinc-800 border-white/10 text-white' : 'bg-white border-zinc-300 text-black'}`}
      >
        {isExpanded ? '→' : '←'}
      </button>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <div className={`max-w-4xl w-full h-[80vh] rounded-[3rem] p-12 border flex flex-col shadow-2xl animate-in zoom-in-95 ${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-2xl font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{t.exportPreviewTitle}</h3>
              <button onClick={() => setShowPreviewModal(false)} className={`transition-colors ${theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-zinc-500 hover:text-black'}`}>✕</button>
            </div>
            
            {/* Language Toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => {
                  setPreviewLang('zh');
                  const prompts = getFormattedPrompts();
                  const content = typeof prompts === 'string' ? prompts : (prompts as any).zh || '';
                  setEditablePrompts(content);
                }}
                className={`px-4 py-2 rounded-lg font-black uppercase text-xs tracking-widest transition-all ${
                  previewLang === 'zh'
                    ? 'bg-purple-600 text-white'
                    : theme === 'dark'
                    ? 'bg-white/5 border border-white/10 text-zinc-400 hover:border-purple-500/50'
                    : 'bg-zinc-100 border border-zinc-300 text-zinc-600 hover:border-purple-500'
                }`}
              >
                中文
              </button>
              <button
                onClick={() => {
                  setPreviewLang('en');
                  const prompts = getFormattedPrompts();
                  const content = typeof prompts === 'string' ? prompts : (prompts as any).en || '';
                  setEditablePrompts(content);
                }}
                className={`px-4 py-2 rounded-lg font-black uppercase text-xs tracking-widest transition-all ${
                  previewLang === 'en'
                    ? 'bg-purple-600 text-white'
                    : theme === 'dark'
                    ? 'bg-white/5 border border-white/10 text-zinc-400 hover:border-purple-500/50'
                    : 'bg-zinc-100 border border-zinc-300 text-zinc-600 hover:border-purple-500'
                }`}
              >
                English
              </button>
            </div>
            
            <textarea value={editablePrompts} onChange={e => setEditablePrompts(e.target.value)} className={`flex-1 w-full rounded-2xl p-6 text-sm font-bold border bg-transparent outline-none focus:border-purple-500/50 resize-none ${theme === 'dark' ? 'border-white/5 text-white' : 'border-zinc-200 text-black'}`} />
            <div className="mt-8 flex gap-4">
              <button 
                onClick={() => setShowPreviewModal(false)} 
                title={lang === 'zh' ? '关闭预览' : 'Close preview'}
                className={`flex-1 py-4 border rounded-2xl uppercase font-black transition-all ${theme === 'dark' ? 'border-zinc-500 text-zinc-500 hover:bg-zinc-500 hover:text-white' : 'border-zinc-400 text-zinc-600 hover:bg-zinc-200 hover:text-black'}`}
              >
                {lang === 'zh' ? '取消' : 'Cancel'}
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(editablePrompts);
                  alert(lang === 'zh' ? '已复制到剪贴板' : 'Copied to clipboard');
                }} 
                title={lang === 'zh' ? '复制提示词到剪贴板' : 'Copy prompts to clipboard'}
                className={`flex-1 py-4 border-2 rounded-2xl uppercase font-black transition-all ${theme === 'dark' ? 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white' : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
              >
                {lang === 'zh' ? '📋 复制' : '📋 Copy'}
              </button>
              <button 
                onClick={() => { onExportPrompts(editablePrompts); setShowPreviewModal(false); }} 
                title={lang === 'zh' ? '下载编辑后的提示词' : 'Download edited prompts'}
                className="flex-1 py-4 bg-purple-600 text-white rounded-2xl uppercase font-black shadow-xl hover:scale-[1.02] transition-all"
              >
                {lang === 'zh' ? '📥 下载' : '📥 Download'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Model selector - removed */}

      {/* Help Modal - now using shared help from KeySelection */}
    </div>
  );
};

export default SidebarRight;
