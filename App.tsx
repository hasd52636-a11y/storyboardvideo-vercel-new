
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StoryboardItem, FilterMode, ToolType, Language, I18N, ModelProvider, Theme, StoryboardSymbol, SYMBOL_DESCRIPTIONS, SYMBOL_LABELS, StyleOption, AspectRatio, VideoItem, BatchScript, BatchConfig } from './types';
import { generateSceneImage, parseScriptToScenes, generateStoryboardFromDialogue } from './geminiService';
import StoryboardCard from './components/StoryboardCard';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import KeySelection from './components/KeySelection';
import BatchRedrawDialog from './components/BatchRedrawDialog';
import VideoGenDialog from './components/VideoGenDialog';
import VideoEditDialog from './components/VideoEditDialog';
import VideoWindow from './components/VideoWindow';
import HelpModal from './components/HelpModal';
import QuickStoryboardConfigDialog from './components/QuickStoryboardConfigDialog';
import VideoService from './videoService';
import { CloneWorkflowManager, CloneWorkflowState } from './services/CloneWorkflowManager';
import PromptReviewDialog from './components/PromptReviewDialog';
import StoryboardPreviewDialog from './components/StoryboardPreviewDialog';
import ManualSceneInputDialog from './components/ManualSceneInputDialog';

interface HelpSection {
  title: string;
  content: string;
}

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [items, setItems] = useState<StoryboardItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectionOrder, setSelectionOrder] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.SELECT);
  const [lang, setLang] = useState<Language>('zh');
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [model, setModel] = useState<ModelProvider>('gemini');
  const [showSettings, setShowSettings] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [globalColorMode, setGlobalColorMode] = useState<'color' | 'blackAndWhite'>('color');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showBatchRedrawDialog, setShowBatchRedrawDialog] = useState(false);
  const [videoEditStyle, setVideoEditStyle] = useState<StyleOption | null>(null);
  const [currentAspectRatio, setCurrentAspectRatio] = useState<AspectRatio | null>(null);
  const [helpSections, setHelpSections] = useState<HelpSection[]>([]);
  
  // Video generation state
  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
  const [showVideoGenDialog, setShowVideoGenDialog] = useState(false);
  const [showVideoEditDialog, setShowVideoEditDialog] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [videoGenDialogPrompt, setVideoGenDialogPrompt] = useState('');
  const [videoGenDialogSymbols, setVideoGenDialogSymbols] = useState<StoryboardSymbol[]>([]);
  const videoServiceRef = useRef<VideoService | null>(null);
  
  // Clone workflow state
  const [showClonePromptReview, setShowClonePromptReview] = useState(false);
  const [cloneWorkflowState, setCloneWorkflowState] = useState<CloneWorkflowState | null>(null);
  const [cloneTargetItemId, setCloneTargetItemId] = useState<string | null>(null);
  const cloneWorkflowRef = useRef<CloneWorkflowManager | null>(null);
  
  // Selection Marquee State
  const [selectionRect, setSelectionRect] = useState<{ x: number, y: number, w: number, h: number } | null>(null);
  const selectionStart = useRef<{ x: number, y: number } | null>(null);

  // Quick Storyboard Config Dialog State
  const [showQuickStoryboardConfig, setShowQuickStoryboardConfig] = useState(false);
  const [quickStoryboardActionType, setQuickStoryboardActionType] = useState<'multi-grid' | 'narrative-progression' | null>(null);
  const [quickStoryboardItemId, setQuickStoryboardItemId] = useState<string | null>(null);
  const [quickStoryboardFrameCount, setQuickStoryboardFrameCount] = useState(4);

  const canvasRef = useRef<HTMLDivElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const importTypeRef = useRef<'ref' | 'frame'>('frame');
  const [dragState, setDragState] = useState<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);

  // Batch Automation State
  const [showBatchAutomation, setShowBatchAutomation] = useState(false);
  const [batchConfig, setBatchConfig] = useState<BatchConfig>({
    videoDuration: 15,
    processingInterval: 15 * 60 * 1000,  // 默认 15 分钟
    aspectRatio: '16:9',
    referenceImageUrl: undefined,
    maxRetries: 3,
    retryDelay: 5000,
    enableNotifications: true
  });
  const [batchScripts, setBatchScripts] = useState<BatchScript[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [showBatchCompletionDialog, setShowBatchCompletionDialog] = useState(false);
  const batchProcessingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info'; visible: boolean }>({ message: '', type: 'info', visible: false });

  // Video Generation Dialog Minimized State
  const [isVideoGenDialogMinimized, setIsVideoGenDialogMinimized] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });

  // Canvas notifications state - for showing toast messages on generated images
  const [canvasNotifications, setCanvasNotifications] = useState<Array<{
    id: string;
    itemId: string;
    message: string;
    type: 'success' | 'error' | 'info';
    timestamp: number;
  }>>([]);

  // Storyboard Preview Dialog State - for managing generated storyboard frames
  const [showStoryboardPreviewDialog, setShowStoryboardPreviewDialog] = useState(false);
  const [storyboardPreviewFrames, setStoryboardPreviewFrames] = useState<Array<{
    id: string;
    visualPromptZh: string;
    visualPromptEn: string;
    videoPromptZh: string;
    videoPromptEn: string;
    imageUrl?: string;
    index: number;
  }>>([]);

  // Manual Scene Input Dialog State
  const [showManualSceneDialog, setShowManualSceneDialog] = useState(false);
  const [manualSceneBatchInterval, setManualSceneBatchInterval] = useState(2000);

  const t = I18N[lang];

  // Helper function to show canvas notification on a specific item
  const showCanvasNotification = (itemId: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const notificationId = `notif_${Date.now()}_${Math.random()}`;
    setCanvasNotifications(prev => [...prev, {
      id: notificationId,
      itemId,
      message,
      type,
      timestamp: Date.now()
    }]);
    
    // Auto-remove notification after 3 seconds
    setTimeout(() => {
      setCanvasNotifications(prev => prev.filter(n => n.id !== notificationId));
    }, 3000);
  };

  const getButtonClassName = () => {
    return `w-full py-4 font-black uppercase tracking-widest rounded-2xl transition-all mt-8 ${
      theme === 'dark' 
        ? 'bg-white text-black hover:bg-zinc-200' 
        : 'bg-black text-white hover:bg-zinc-800'
    }`;
  };

  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('director_canvas_lang', newLang);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('director_canvas_theme', newTheme);
  };

  const handleAPIConfigured = (config: { baseUrl: string; apiKey: string; provider: any }) => {
    // Save config to localStorage
    localStorage.setItem('director_canvas_video_config', JSON.stringify(config));
    // Initialize VideoService with the new config
    videoServiceRef.current = new VideoService(config);
  };

  useEffect(() => {
    const checkKey = async () => {
      const saved = localStorage.getItem('director_canvas_api_config');
      if (saved) {
        setHasKey(true);
      } else if ((window as any).aistudio) {
        setHasKey(await (window as any).aistudio.hasSelectedApiKey());
      } else {
        setHasKey(false);
      }
    };
    
    // Load language preference from localStorage or system
    const systemLang = navigator.language.startsWith('zh') ? 'zh' : 'en';
    const savedLang = localStorage.getItem('director_canvas_lang') as Language | null;
    if (savedLang) {
      setLang(savedLang);
    } else {
      setLang(systemLang);
    }
    
    // Load theme preference from localStorage or system
    const savedTheme = localStorage.getItem('director_canvas_theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
    
    checkKey();
  }, []);

  // Load help content based on current language
  useEffect(() => {
    const loadHelpContent = async () => {
      try {
        const response = await fetch('/helpContent.json');
        const data = await response.json();
        const langData = lang === 'zh' ? data.zh : data.en;
        if (langData && langData.sections) {
          setHelpSections(langData.sections);
        }
      } catch (error) {
        console.error('Failed to load help content:', error);
      }
    };
    loadHelpContent();
  }, [lang]);

  // Keyboard Shortcuts (Ctrl+A, Delete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip keyboard shortcuts when typing in input/textarea
      const isInInput = document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT';
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'a' && !isInInput) {
        e.preventDefault();
        const allIds = items.map(it => it.id);
        setSelectedIds(new Set(allIds));
        // For Ctrl+A, use natural order (top-left to bottom-right)
        const sorted = items.sort((a, b) => {
          if (Math.abs(a.y - b.y) > 10) return a.y - b.y;
          return a.x - b.x;
        }).map(it => it.id);
        setSelectionOrder(sorted);
      } else if (e.key === 'Delete' && !isInInput && selectedIds.size > 0) {
        // Delete selected frames
        e.preventDefault();
        const idsToDelete = Array.from(selectedIds);
        setItems(prev => prev.filter(it => !idsToDelete.includes(it.id)));
        setSelectedIds(new Set());
        setSelectionOrder([]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIds]);

  // Cleanup batch processing interval on unmount
  useEffect(() => {
    return () => {
      if (batchProcessingIntervalRef.current) {
        clearInterval(batchProcessingIntervalRef.current);
      }
    };
  }, []);

  const handleGenerateFromScript = useCallback(async (scriptText: string, sceneCount: number, style?: any, aspectRatio?: string, duration?: number) => {
    if (!scriptText.trim()) return;
    
    try {
      // 总是使用AI解析脚本，确保先发给GPT-4o（对话模型）
      console.log('[handleGenerateFromScript] Sending script to AI for parsing');
      const scenes = await parseScriptToScenes(scriptText, sceneCount, style, aspectRatio, lang);
      
      const startOrder = items.length;
      const isBlackAndWhite = globalColorMode === 'blackAndWhite';
      
      // Calculate dimensions based on aspect ratio
      const { calculateHeight } = await import('./types');
      const baseWidth = 380;
      const height = calculateHeight(baseWidth, aspectRatio || '16:9');
      
      // Import the functions we need
      const { generateVideoPromptFromVisual, translateText } = await import('./geminiService');
      
      // 第一步：创建占位符卡片（黑色预览）
      const placeholderItems: StoryboardItem[] = [];
      const sceneIndexMap: Map<string, number> = new Map(); // itemId -> sceneIndex
      
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        const sceneNum = `SC-${String(i + 1).padStart(2, '0')}`;
        
        // 检测占位符：### 画面X、### Scene X 等
        const isPlaceholder = /^#+\s*(画面|Scene|scene)\s*\d+\s*$/.test((scene.visualPrompt || '').trim());
        
        if (isPlaceholder) {
          console.warn(`[handleGenerateFromScript] Scene ${i + 1} has placeholder prompt, skipping: "${scene.visualPrompt}"`);
          showCanvasNotification(
            `placeholder_${i}`,
            lang === 'zh' ? `⚠️ 场景 ${i + 1} 占位符` : `⚠️ Scene ${i + 1} placeholder`,
            'error'
          );
          continue;
        }
        
        // 彻底清理提示词：剔除所有【】、（）、[]、()、统计信息等
        let cleanedPrompt = scene.visualPrompt || scene.description;
        cleanedPrompt = cleanedPrompt
          .replace(/【[^】]*】/g, '')  // 剔除【】及其内容
          .replace(/（[^）]*）/g, '')  // 剔除（）及其内容
          .replace(/\([^)]*\)/g, '')   // 剔除()及其内容
          .replace(/\[[^\]]*\]/g, '')  // 剔除[]及其内容
          .replace(/###\s*(画面|Scene|scene)\s*\d+/gi, '')  // 剔除### 画面X
          .replace(/全文\d+字/g, '')   // 剔除全文XXX字
          .replace(/\s+/g, ' ')
          .trim();
        
        // 如果清理后为空或仍是占位符，跳过
        if (!cleanedPrompt || /^#+\s*(画面|Scene|scene)\s*\d+\s*$/.test(cleanedPrompt)) {
          console.warn(`[handleGenerateFromScript] Scene ${i + 1} has invalid prompt after cleaning, skipping`);
          showCanvasNotification(
            `placeholder_${i}`,
            lang === 'zh' ? `⚠️ 场景 ${i + 1} 提示词无效` : `⚠️ Scene ${i + 1} invalid prompt`,
            'error'
          );
          continue;
        }
        
        // Build enriched prompt with scene number, description, and visual prompt
        let enrichedPrompt = `【${sceneNum}】
【场景描述】: ${scene.description}
【视觉提示】: ${cleanedPrompt}`;
        
        // Add duration if specified
        if (duration && duration > 0) {
          enrichedPrompt += `\n【时长】: ${duration}秒`;
        }
        
        // 创建占位符卡片（黑色预览）
        const placeholderId = crypto.randomUUID();
        const placeholderItem: StoryboardItem = {
          id: placeholderId,
          imageUrl: '', // 空白，显示为黑色
          prompt: enrichedPrompt,
          description: scene.description,
          x: (i % 4) * 440 + 100 - canvasOffset.x,
          y: Math.floor(i / 4) * 280 + 100 - canvasOffset.y,
          width: baseWidth,
          height,
          isMain: false,
          filter: FilterMode.LINE_ART,
          order: startOrder + i,
          symbols: [],
          colorMode: isBlackAndWhite ? 'blackAndWhite' : 'color',
          aspectRatio,
          visualPrompt: cleanedPrompt,
          isLoading: true
        };
        
        placeholderItems.push(placeholderItem);
        sceneIndexMap.set(placeholderId, i);
      }
      
      // 立即添加所有占位符到画布
      setItems(prev => [...prev, ...placeholderItems]);
      
      // 第二步：异步生成每个场景的图片
      placeholderItems.forEach((placeholderItem, idx) => {
        const sceneIndex = sceneIndexMap.get(placeholderItem.id)!;
        const scene = scenes[sceneIndex];
        
        (async () => {
          try {
            console.log(`[handleGenerateFromScript] Generating image for scene ${sceneIndex + 1}/${scenes.length}`);
            
            const imageUrl = await generateSceneImage(
              placeholderItem.prompt,
              true,
              isBlackAndWhite,
              style,
              aspectRatio
            );
            
            if (imageUrl) {
              // 生成视频提示词 - 仅生成当前语言内容，不翻译
              let visualPromptEn = '';
              let videoPromptZh = '';
              let videoPromptEn = '';
              
              try {
                if (lang === 'zh') {
                  videoPromptZh = await generateVideoPromptFromVisual(
                    placeholderItem.visualPrompt || '',
                    scene.description,
                    style?.nameZh || style?.name || 'Realistic Photography',
                    scenes.length,
                    sceneIndex + 1,
                    'zh',
                    sceneIndex > 0 ? scenes[sceneIndex - 1].visualPrompt : '',
                    sceneIndex > 0 ? scenes[sceneIndex - 1].description : ''
                  );
                  videoPromptEn = '';
                } else {
                  videoPromptEn = await generateVideoPromptFromVisual(
                    placeholderItem.visualPrompt || '',
                    scene.description,
                    style?.nameZh || style?.name || 'Realistic Photography',
                    scenes.length,
                    sceneIndex + 1,
                    'en',
                    sceneIndex > 0 ? scenes[sceneIndex - 1].visualPrompt : '',
                    sceneIndex > 0 ? scenes[sceneIndex - 1].description : ''
                  );
                  videoPromptZh = '';
                }
              } catch (e) {
                console.error(`[handleGenerateFromScript] Failed to generate prompts for scene ${sceneIndex + 1}:`, e);
              }
              
              // 更新卡片
              setItems(prev => prev.map(item =>
                item.id === placeholderItem.id
                  ? {
                      ...item,
                      imageUrl,
                      visualPromptEn,
                      videoPrompt: videoPromptZh,
                      videoPromptEn,
                      isLoading: false
                    }
                  : item
              ));
              
              // 显示成功提示
              showCanvasNotification(
                placeholderItem.id,
                lang === 'zh' ? `✅ 场景 ${sceneIndex + 1} 生成成功` : `✅ Scene ${sceneIndex + 1} generated`,
                'success'
              );
            } else {
              throw new Error('No image URL returned');
            }
          } catch (error) {
            console.error(`[handleGenerateFromScript] Failed to generate image for scene ${sceneIndex + 1}:`, error);
            
            // 显示失败提示
            showCanvasNotification(
              placeholderItem.id,
              lang === 'zh' 
                ? `❌ 场景 ${sceneIndex + 1} 生成失败` 
                : `❌ Scene ${sceneIndex + 1} failed`,
              'error'
            );
          }
        })();
      });
      
    } catch (e) {
      console.error("Failed to generate from script", e);
      const msg = lang === 'zh'
        ? `生成失败: ${e}`
        : `Generation failed: ${e}`;
      alert(msg);
    }
  }, [items.length, canvasOffset, globalColorMode, lang]);

  const handleGenerateFromDialogue = useCallback(async (scenes: any[], frameCount: number, styleId: string, aspectRatio?: string, duration?: number) => {
    if (!scenes || scenes.length === 0) return;
    
    try {
      const startOrder = items.length;
      const isBlackAndWhite = globalColorMode === 'blackAndWhite';
      
      // Get style configuration
      const { STYLES } = await import('./types');
      const style = STYLES.find(s => s.id === styleId);
      
      // Calculate dimensions based on aspect ratio
      const { calculateHeight } = await import('./types');
      const baseWidth = 380;
      const height = calculateHeight(baseWidth, aspectRatio || '16:9');
      
      // Import the functions we need
      const { generateVideoPromptFromVisual, translateText } = await import('./geminiService');
      
      // 第一步：创建占位符卡片（黑色预览）
      const placeholderItems: StoryboardItem[] = [];
      const sceneIndexMap: Map<string, number> = new Map();
      
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        const sceneNum = `SC-${String(i + 1).padStart(2, '0')}`;
        
        // 检测占位符：### 画面X、### Scene X 等
        const isPlaceholder = /^#+\s*(画面|Scene|scene)\s*\d+\s*$/.test((scene.visualPrompt || '').trim());
        
        if (isPlaceholder) {
          console.warn(`[handleGenerateFromDialogue] Scene ${i + 1} has placeholder prompt, skipping: "${scene.visualPrompt}"`);
          showCanvasNotification(
            `placeholder_${i}`,
            lang === 'zh' ? `⚠️ 场景 ${i + 1} 占位符` : `⚠️ Scene ${i + 1} placeholder`,
            'error'
          );
          continue;
        }
        
        // 彻底清理提示词：剔除所有【】、（）、[]、()、统计信息等
        let cleanedPrompt = scene.visualPrompt || scene.description;
        cleanedPrompt = cleanedPrompt
          .replace(/【[^】]*】/g, '')  // 剔除【】及其内容
          .replace(/（[^）]*）/g, '')  // 剔除（）及其内容
          .replace(/\([^)]*\)/g, '')   // 剔除()及其内容
          .replace(/\[[^\]]*\]/g, '')  // 剔除[]及其内容
          .replace(/###\s*(画面|Scene|scene)\s*\d+/gi, '')  // 剔除### 画面X
          .replace(/全文\d+字/g, '')   // 剔除全文XXX字
          .replace(/\s+/g, ' ')
          .trim();
        
        // 如果清理后为空或仍是占位符，跳过
        if (!cleanedPrompt || /^#+\s*(画面|Scene|scene)\s*\d+\s*$/.test(cleanedPrompt)) {
          console.warn(`[handleGenerateFromDialogue] Scene ${i + 1} has invalid prompt after cleaning, skipping`);
          showCanvasNotification(
            `placeholder_${i}`,
            lang === 'zh' ? `⚠️ 场景 ${i + 1} 提示词无效` : `⚠️ Scene ${i + 1} invalid prompt`,
            'error'
          );
          continue;
        }
        
        // Build enriched prompt with scene number, description, and visual prompt
        let enrichedPrompt = `【${sceneNum}】
【场景描述】: ${scene.description}
【视觉提示】: ${cleanedPrompt}`;
        
        // Add duration if specified
        if (duration && duration > 0) {
          enrichedPrompt += `\n【时长】: ${duration}秒`;
        }
        
        // 创建占位符卡片（黑色预览）
        const placeholderId = crypto.randomUUID();
        const placeholderItem: StoryboardItem = {
          id: placeholderId,
          imageUrl: '', // 空白，显示为黑色
          prompt: enrichedPrompt,
          description: scene.description,
          x: (i % 4) * 440 + 100 - canvasOffset.x,
          y: Math.floor(i / 4) * 280 + 100 - canvasOffset.y,
          width: baseWidth,
          height,
          isMain: false,
          filter: FilterMode.LINE_ART,
          order: startOrder + i,
          symbols: [],
          colorMode: isBlackAndWhite ? 'blackAndWhite' : 'color',
          aspectRatio,
          visualPrompt: cleanedPrompt,
          isLoading: true
        };
        
        placeholderItems.push(placeholderItem);
        sceneIndexMap.set(placeholderId, i);
      }
      
      // 立即添加所有占位符到画布
      setItems(prev => [...prev, ...placeholderItems]);
      
      // 第二步：异步生成每个场景的图片
      placeholderItems.forEach((placeholderItem) => {
        const sceneIndex = sceneIndexMap.get(placeholderItem.id)!;
        const scene = scenes[sceneIndex];
        
        (async () => {
          try {
            console.log(`[handleGenerateFromDialogue] Generating image for scene ${sceneIndex + 1}/${scenes.length}`);
            
            const imageUrl = await generateSceneImage(
              placeholderItem.prompt,
              true,
              isBlackAndWhite,
              style,
              aspectRatio
            );
            
            if (imageUrl) {
              // 生成视频提示词 - 仅生成当前语言内容，不翻译
              let videoPromptZh = '';
              let videoPromptEn = '';
              let visualPromptZh = '';
              let visualPromptEn = '';
              
              try {
                if (lang === 'zh') {
                  visualPromptZh = placeholderItem.visualPrompt || '';
                  visualPromptEn = '';
                  
                  // 获取前一个场景的信息（如果不是第一个场景）
                  const prevScene = sceneIndex > 0 ? scenes[sceneIndex - 1] : null;
                  const prevVisualPrompt = prevScene?.visualPrompt || '';
                  const prevSceneDescription = prevScene?.description || '';
                  
                  videoPromptZh = await generateVideoPromptFromVisual(
                    visualPromptZh,
                    scene.description,
                    style?.nameZh || style?.name || 'Realistic Photography',
                    frameCount,
                    sceneIndex + 1,
                    'zh',
                    prevVisualPrompt,
                    prevSceneDescription
                  );
                  videoPromptEn = '';
                } else {
                  visualPromptEn = placeholderItem.visualPrompt || '';
                  visualPromptZh = '';
                  
                  // 获取前一个场景的信息（如果不是第一个场景）
                  const prevScene = sceneIndex > 0 ? scenes[sceneIndex - 1] : null;
                  const prevVisualPrompt = prevScene?.visualPrompt || '';
                  const prevSceneDescription = prevScene?.description || '';
                  
                  videoPromptEn = await generateVideoPromptFromVisual(
                    visualPromptEn,
                    scene.description,
                    style?.nameZh || style?.name || 'Realistic Photography',
                    frameCount,
                    sceneIndex + 1,
                    'en',
                    prevVisualPrompt,
                    prevSceneDescription
                  );
                  videoPromptZh = '';
                }
              } catch (e) {
                console.error(`[handleGenerateFromDialogue] Failed to generate prompts for scene ${sceneIndex + 1}:`, e);
              }
              
              // 更新卡片
              setItems(prev => prev.map(item =>
                item.id === placeholderItem.id
                  ? {
                      ...item,
                      imageUrl,
                      visualPromptEn,
                      videoPrompt: videoPromptZh,
                      videoPromptEn,
                      isLoading: false
                    }
                  : item
              ));
              
              // 显示成功提示
              showCanvasNotification(
                placeholderItem.id,
                lang === 'zh' ? `✅ 场景 ${sceneIndex + 1} 生成成功` : `✅ Scene ${sceneIndex + 1} generated`,
                'success'
              );
            } else {
              throw new Error('No image URL returned');
            }
          } catch (error) {
            console.error(`[handleGenerateFromDialogue] Failed to generate image for scene ${sceneIndex + 1}:`, error);
            
            // 显示失败提示
            showCanvasNotification(
              placeholderItem.id,
              lang === 'zh' 
                ? `❌ 场景 ${sceneIndex + 1} 生成失败` 
                : `❌ Scene ${sceneIndex + 1} failed`,
              'error'
            );
          }
        })();
      });
      
    } catch (e) {
      console.error("Failed to generate from dialogue", e);
      const msg = lang === 'zh'
        ? `生成失败: ${e}`
        : `Generation failed: ${e}`;
      alert(msg);
    }
  }, [items.length, canvasOffset, globalColorMode, lang]);

  // Handle manual scene generation from ManualSceneInputDialog
  const handleGenerateFromManualScenes = useCallback(async (scenes: any[], batchInterval?: number) => {
    if (!scenes || scenes.length === 0) return;
    
    try {
      const startOrder = items.length;
      const isBlackAndWhite = globalColorMode === 'blackAndWhite';
      
      // Get style and aspect ratio from SidebarRight (chatStyle and chatAspectRatio)
      // These are passed through props to SidebarRight
      const { STYLES, calculateHeight } = await import('./types');
      const baseWidth = 380;
      
      // 第一步：创建占位符卡片（黑色预览）
      const placeholderItems: StoryboardItem[] = [];
      const sceneIndexMap: Map<string, number> = new Map();
      
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        const sceneNum = `SC-${String(i + 1).padStart(2, '0')}`;
        
        // 清理提示词
        let cleanedPrompt = scene.visualPrompt || '';
        cleanedPrompt = cleanedPrompt
          .replace(/【[^】]*】/g, '')
          .replace(/（[^）]*）/g, '')
          .replace(/\([^)]*\)/g, '')
          .replace(/\[[^\]]*\]/g, '')
          .replace(/###\s*(画面|Scene|scene)\s*\d+/gi, '')
          .replace(/全文\d+字/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (!cleanedPrompt) {
          showCanvasNotification(
            `placeholder_${i}`,
            lang === 'zh' ? `⚠️ 场景 ${i + 1} 提示词无效` : `⚠️ Scene ${i + 1} invalid prompt`,
            'error'
          );
          continue;
        }
        
        // Build enriched prompt
        let enrichedPrompt = `【${sceneNum}】
【视觉提示】: ${cleanedPrompt}`;
        
        // 创建占位符卡片
        const placeholderId = crypto.randomUUID();
        const height = calculateHeight(baseWidth, '16:9');
        const placeholderItem: StoryboardItem = {
          id: placeholderId,
          imageUrl: '',
          prompt: enrichedPrompt,
          description: cleanedPrompt,
          x: (i % 4) * 440 + 100 - canvasOffset.x,
          y: Math.floor(i / 4) * 280 + 100 - canvasOffset.y,
          width: baseWidth,
          height,
          isMain: false,
          filter: FilterMode.LINE_ART,
          order: startOrder + i,
          symbols: [],
          colorMode: isBlackAndWhite ? 'blackAndWhite' : 'color',
          aspectRatio: '16:9',
          visualPrompt: cleanedPrompt,
          videoPrompt: scene.videoPrompt || '',
          isLoading: true
        };
        
        placeholderItems.push(placeholderItem);
        sceneIndexMap.set(placeholderId, i);
      }
      
      // 立即添加所有占位符到画布
      setItems(prev => [...prev, ...placeholderItems]);
      
      // 第二步：异步生成每个场景的图片，使用间隔时间
      placeholderItems.forEach((placeholderItem, idx) => {
        const sceneIndex = sceneIndexMap.get(placeholderItem.id)!;
        const delay = (batchInterval || 0) * idx;
        
        setTimeout(async () => {
          try {
            console.log(`[handleGenerateFromManualScenes] Generating image for scene ${sceneIndex + 1}/${scenes.length}`);
            
            const imageUrl = await generateSceneImage(
              placeholderItem.prompt,
              true,
              isBlackAndWhite,
              undefined,
              '16:9'
            );
            
            if (imageUrl) {
              // 更新卡片 - 保留视频提示词
              setItems(prev => prev.map(item =>
                item.id === placeholderItem.id
                  ? {
                      ...item,
                      imageUrl,
                      videoPrompt: placeholderItem.videoPrompt,
                      isLoading: false
                    }
                  : item
              ));
              
              // 显示成功提示
              showCanvasNotification(
                placeholderItem.id,
                lang === 'zh' ? `✅ 场景 ${sceneIndex + 1} 生成成功` : `✅ Scene ${sceneIndex + 1} generated`,
                'success'
              );
            } else {
              throw new Error('No image URL returned');
            }
          } catch (error) {
            console.error(`[handleGenerateFromManualScenes] Failed to generate image for scene ${sceneIndex + 1}:`, error);
            
            showCanvasNotification(
              placeholderItem.id,
              lang === 'zh' 
                ? `❌ 场景 ${sceneIndex + 1} 生成失败` 
                : `❌ Scene ${sceneIndex + 1} failed`,
              'error'
            );
          }
        }, delay);
      });
      
    } catch (e) {
      console.error("Failed to generate from manual scenes", e);
      const msg = lang === 'zh'
        ? `生成失败: ${e}`
        : `Generation failed: ${e}`;
      alert(msg);
    }
  }, [items.length, canvasOffset, globalColorMode, lang]);

  // Handle "生成分镜" button click - show preview dialog with generated storyboard
  const handleGenerateStoryboardPreview = useCallback(async (scenes: any[], frameCount: number, styleId: string, aspectRatio?: string, duration?: number) => {
    if (!scenes || scenes.length === 0) return;
    
    try {
      const { STYLES } = await import('./types');
      const style = STYLES.find(s => s.id === styleId);
      const { generateVideoPromptFromVisual, translateText } = await import('./geminiService');
      
      // Convert scenes to preview frames - only generate current language content
      const previewFrames = await Promise.all(
        scenes.map(async (scene, index) => {
          let visualPromptZh = '';
          let visualPromptEn = '';
          let videoPromptZh = '';
          let videoPromptEn = '';
          
          try {
            // Only generate content in current language, no translation
            if (lang === 'zh') {
              visualPromptZh = scene.visualPrompt || '';
              visualPromptEn = '';
              
              // 获取前一个场景的信息（如果不是第一个场景）
              const prevScene = index > 0 ? scenes[index - 1] : null;
              const prevVisualPrompt = prevScene?.visualPrompt || '';
              const prevSceneDescription = prevScene?.description || '';
              
              videoPromptZh = await generateVideoPromptFromVisual(
                visualPromptZh,
                scene.description,
                style?.nameZh || style?.name || 'Realistic Photography',
                frameCount,
                index + 1,
                'zh',
                prevVisualPrompt,
                prevSceneDescription
              );
              videoPromptEn = '';
            } else {
              visualPromptEn = scene.visualPrompt || '';
              visualPromptZh = '';
              
              // 获取前一个场景的信息（如果不是第一个场景）
              const prevScene = index > 0 ? scenes[index - 1] : null;
              const prevVisualPrompt = prevScene?.visualPrompt || '';
              const prevSceneDescription = prevScene?.description || '';
              
              videoPromptEn = await generateVideoPromptFromVisual(
                visualPromptEn,
                scene.description,
                style?.nameZh || style?.name || 'Realistic Photography',
                frameCount,
                index + 1,
                'en',
                prevVisualPrompt,
                prevSceneDescription
              );
              videoPromptZh = '';
            }
          } catch (e) {
            console.error(`Failed to generate prompts for scene ${index + 1}:`, e);
          }
          
          return {
            id: crypto.randomUUID(),
            visualPromptZh,
            visualPromptEn,
            videoPromptZh,
            videoPromptEn,
            index
          };
        })
      );
      
      setStoryboardPreviewFrames(previewFrames);
      setShowStoryboardPreviewDialog(true);
    } catch (e) {
      console.error('Failed to generate storyboard preview:', e);
      alert(lang === 'zh' ? `生成失败: ${e}` : `Generation failed: ${e}`);
    }
  }, [lang]);

  // Handle "生成画面" button in preview dialog
  const handleGenerateFramesFromPreview = useCallback(async () => {
    if (storyboardPreviewFrames.length === 0) return;
    
    try {
      setIsLoading(true);
      const isBlackAndWhite = globalColorMode === 'blackAndWhite';
      const { calculateHeight } = await import('./types');
      const baseWidth = 380;
      
      // Create placeholder items for all frames
      const placeholderItems: StoryboardItem[] = [];
      
      for (let i = 0; i < storyboardPreviewFrames.length; i++) {
        const frame = storyboardPreviewFrames[i];
        const sceneNum = `SC-${String(i + 1).padStart(2, '0')}`;
        
        const enrichedPrompt = `【${sceneNum}】
【视觉提示】: ${frame.visualPromptZh}`;
        
        const placeholderId = crypto.randomUUID();
        const height = calculateHeight(baseWidth, '16:9');
        
        const placeholderItem: StoryboardItem = {
          id: placeholderId,
          imageUrl: '',
          prompt: enrichedPrompt,
          description: frame.visualPromptZh,
          x: (i % 4) * 440 + 100 - canvasOffset.x,
          y: Math.floor(i / 4) * 280 + 100 - canvasOffset.y,
          width: baseWidth,
          height,
          isMain: false,
          filter: FilterMode.LINE_ART,
          order: items.length + i,
          symbols: [],
          colorMode: isBlackAndWhite ? 'blackAndWhite' : 'color',
          aspectRatio: '16:9',
          visualPrompt: frame.visualPromptZh,
          visualPromptEn: frame.visualPromptEn,
          videoPrompt: frame.videoPromptZh,
          videoPromptEn: frame.videoPromptEn,
          isLoading: true
        };
        
        placeholderItems.push(placeholderItem);
      }
      
      // Add all placeholders to canvas
      setItems(prev => [...prev, ...placeholderItems]);
      
      // Generate images asynchronously
      placeholderItems.forEach((placeholderItem, idx) => {
        (async () => {
          try {
            const imageUrl = await generateSceneImage(
              placeholderItem.prompt,
              true,
              isBlackAndWhite,
              undefined,
              '16:9'
            );
            
            if (imageUrl) {
              setItems(prev => prev.map(item =>
                item.id === placeholderItem.id
                  ? { ...item, imageUrl, isLoading: false }
                  : item
              ));
              
              showCanvasNotification(
                placeholderItem.id,
                lang === 'zh' ? `✅ 画面 ${idx + 1} 生成成功` : `✅ Frame ${idx + 1} generated`,
                'success'
              );
            }
          } catch (error) {
            console.error(`Failed to generate image for frame ${idx + 1}:`, error);
            showCanvasNotification(
              placeholderItem.id,
              lang === 'zh' ? `❌ 画面 ${idx + 1} 生成失败` : `❌ Frame ${idx + 1} failed`,
              'error'
            );
          }
        })();
      });
      
      setShowStoryboardPreviewDialog(false);
    } catch (e) {
      console.error('Failed to generate frames:', e);
      alert(lang === 'zh' ? `生成失败: ${e}` : `Generation failed: ${e}`);
    } finally {
      setIsLoading(false);
    }
  }, [storyboardPreviewFrames, globalColorMode, items.length, canvasOffset, lang]);

  // Handle "生成视频" button in preview dialog
  const handleGenerateVideoFromPreview = useCallback(async () => {
    if (storyboardPreviewFrames.length === 0) return;
    
    try {
      setIsLoading(true);
      
      // First generate all frames
      await handleGenerateFramesFromPreview();
      
      // Then show video generation dialog with the generated frames
      // This would typically involve:
      // 1. Collecting all generated images
      // 2. Stitching them together
      // 3. Generating video from the stitched content
      
      // For now, we'll just show a message
      alert(lang === 'zh' ? '视频生成功能即将推出' : 'Video generation coming soon');
    } catch (e) {
      console.error('Failed to generate video:', e);
      alert(lang === 'zh' ? `生成失败: ${e}` : `Generation failed: ${e}`);
    } finally {
      setIsLoading(false);
    }
  }, [storyboardPreviewFrames, handleGenerateFramesFromPreview, lang]);

  const handleAction = useCallback(async (id: string, action: string, data?: any) => {
    if (action === 'delete') {
      setItems(prev => prev.filter(it => it.id !== id));
      setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    } else if (action === 'replace' && data) {
      // Support both old format (string) and new format (object with imageUrl, width, height)
      if (typeof data === 'string') {
        setItems(prev => prev.map(it => it.id === id ? { ...it, imageUrl: data } : it));
      } else if (typeof data === 'object' && data.imageUrl) {
        setItems(prev => prev.map(it => it.id === id ? { ...it, imageUrl: data.imageUrl, width: data.width, height: data.height } : it));
      }
    } else if (action === 'resize' && data) {
      setItems(prev => prev.map(it => it.id === id ? { ...it, width: data.width, height: data.height } : it));
    } else if (action === 'regenerate') {
      const target = items.find(it => it.id === id);
      if (!target) return;
      setIsLoading(true);
      // Use provided prompt or fall back to target's existing visual prompt
      const promptToUse = typeof data === 'string' ? data : (target as any).visualPrompt || target.prompt;
      const symbolInstructions = target.symbols.map(s => SYMBOL_DESCRIPTIONS[lang][s.name]).join(', ');
      const enrichedPrompt = symbolInstructions ? `${promptToUse}. Key actions: ${symbolInstructions}` : promptToUse;
      const isBlackAndWhite = target.colorMode === 'blackAndWhite';
      const newUrl = await generateSceneImage(enrichedPrompt, true, isBlackAndWhite, undefined, target.aspectRatio);
      if (newUrl) {
        setItems(prev => prev.map(it => it.id === id ? { ...it, imageUrl: newUrl, filter: FilterMode.LINE_ART, visualPrompt: promptToUse } : it));
      }
      setIsLoading(false);
    } else if (action === 'copy') {
      const target = items.find(it => it.id === id);
      if (!target) return;
      const newItem = { ...target, id: crypto.randomUUID(), x: target.x + 40, y: target.y + 40, order: items.length };
      setItems(prev => [...prev, newItem]);
    } else if (action === 'clone') {
      // Clone action - wait for clipboard without showing dialog
      const target = items.find(it => it.id === id);
      if (!target) return;
      console.log('[App] Clone action triggered for item:', id);
      
      setCloneTargetItemId(id);
      
      // Initialize workflow manager
      const workflowManager = new CloneWorkflowManager();
      cloneWorkflowRef.current = workflowManager;
      
      // Subscribe to state changes
      workflowManager.onStateChange((state) => {
        console.log('[App] Clone workflow state changed:', state.status);
        setCloneWorkflowState(state);
        
        // Show prompt review dialog when analysis is complete
        if (state.status === 'complete' && state.generatedPrompt) {
          console.log('[App] Showing prompt review dialog');
          setShowClonePromptReview(true);
        }
      });
      
      // Initiate the clone workflow (waits for Print Screen and reads from clipboard)
      workflowManager.initiateClone(id).catch(err => {
        console.error('[App] Clone workflow error:', err);
        alert(lang === 'zh' ? `克隆失败: ${err}` : `Clone failed: ${err}`);
      });
    } else if (action === 'setMain') {
      setItems(prev => prev.map(it => ({ ...it, isMain: it.id === id })));
    }
  }, [items, lang]);

  const getFormattedPrompts = useCallback(() => {
    if (selectedIds.size === 0) return "";
    const selectedItems = items.filter(it => selectedIds.has(it.id)).sort((a,b) => a.order - b.order);
    const mainSubject = items.find(it => it.isMain);

    let content = `${t.exportGlobalInstr}\n\n`;
    content += selectedItems.map(it => {
        const syms = it.symbols.map(s => {
          const desc = SYMBOL_DESCRIPTIONS[lang][s.name];
          if (s.name === 'ref-subject') return `[Ref Area] at ${s.x}% ${s.y}%`;
          return `Action: ${desc}`;
        }).join(', ');

        return `SCENE ${String(it.order + 1).padStart(2, '0')}\nPROMPT: ${it.prompt}\nACTIONS: ${syms || 'None'}\n`;
      }).join('\n\n');
    return content;
  }, [selectedIds, items, t, lang]);

  // Generate optimized prompts for video generation with language support
  const getOptimizedPrompts = useCallback((targetLang: Language = lang) => {
    if (selectedIds.size === 0) return "";
    const selectedItems = items.filter(it => selectedIds.has(it.id)).sort((a,b) => a.order - b.order);
    
    // Get style and aspect ratio information from first selected item
    const firstItem = selectedItems[0];
    const itemStyle = firstItem?.aspectRatio ? videoEditStyle : null;
    const itemAspectRatio = firstItem?.aspectRatio || '16:9';
    
    // Prepare style information based on target language
    const styleInfo = targetLang === 'zh' 
      ? (videoEditStyle?.nameZh || videoEditStyle?.name || 'Realistic Photography')
      : (videoEditStyle?.name || 'Realistic Photography');
    const aspectRatioInfo = itemAspectRatio || '16:9';
    
    if (targetLang === 'zh') {
      // Generate Chinese content only
      let globalInstr = `【全局指令】必须按照以下规则生成视频:
1【参考图像】不要将参考图像写入画面，根据参考图像中标记的序列生成视频
2【风格】保持${styleInfo}风格
3【比例】${aspectRatioInfo}宽高比
【限制条件】无闪烁，无背景扭曲，保持角色一致性
单一连续电影镜头，沉浸式360度环境，无分屏，无边框，无故事板布局，无UI
【约束】不修改参考主体特征 | 保持视觉连贯性 | 严格遵循序列顺序`;
      let content = `${globalInstr}\n\n`;
      
      content += selectedItems.map((it, idx) => {
        // Use order to generate scene number, ensuring consistency
        const sceneNum = `SC-${String(it.order + 1).padStart(2, '0')}`;
        
        // Extract prompt content, removing existing scene number if present
        let promptContent = it.prompt;
        const sceneNumPattern = new RegExp('^【SC-\\d{2}】\\n');
        if (sceneNumPattern.test(promptContent)) {
          promptContent = promptContent.replace(sceneNumPattern, '');
        }
        
        let sceneContent = `【${sceneNum}】\n${promptContent}`;
        
        // Add video prompt if available (use Chinese version) - NO visual prompt
        const videoPrompt = it.videoPrompt || '';
        if (videoPrompt) {
          sceneContent += `\n【视频提示】${videoPrompt}`;
        }
        
        // Add symbol descriptions if present
        if (it.symbols && it.symbols.length > 0) {
          const symbolDescriptions = it.symbols
            .map(s => SYMBOL_DESCRIPTIONS['zh'][s.name] || s.name)
            .filter(Boolean);
          if (symbolDescriptions.length > 0) {
            sceneContent += `\n【动作和运动】${symbolDescriptions.join(',')}`;
          }
        }
        
        return sceneContent;
      }).join('\n\n');
      
      return content;
    } else {
      // Generate English content only
      let globalInstr = `[GLOBAL] Must generate video according to the following rules:
1. Do not write reference image into the frame, generate video according to the sequence marked in the reference image
2. Maintain ${styleInfo} style
3. ${aspectRatioInfo} aspect ratio
[RESTRICTIVE] No flickering, no background warping, maintain character consistency.
Single continuous cinematic shot, immersive 360-degree environment, no split-screen, no borders, no storyboard layout, no UI
[CONSTRAINTS] Do not modify reference subject characteristics | Maintain visual continuity | Strictly follow sequence order`;
      let content = `${globalInstr}\n\n`;
      
      content += selectedItems.map((it, idx) => {
        // Use order to generate scene number, ensuring consistency
        const sceneNum = `SC-${String(it.order + 1).padStart(2, '0')}`;
        
        // Build English scene content - ONLY use English fields, no Chinese content, NO visual prompt
        let sceneContent = `[${sceneNum}]`;
        
        // Add video prompt if available (use English version ONLY) - NO visual prompt
        const videoPromptEn = (it as any).videoPromptEn || '';
        if (videoPromptEn) {
          sceneContent += `\n[Video Prompt] ${videoPromptEn}`;
        }
        
        // Add symbol descriptions if present
        if (it.symbols && it.symbols.length > 0) {
          const symbolDescriptions = it.symbols
            .map(s => SYMBOL_DESCRIPTIONS['en'][s.name] || s.name)
            .filter(Boolean);
          if (symbolDescriptions.length > 0) {
            sceneContent += `\n[Action & Motion] ${symbolDescriptions.join(', ')}`;
          }
        }
        
        return sceneContent;
      }).join('\n\n');
      
      return content;
    }
  }, [selectedIds, items, videoEditStyle, currentAspectRatio, lang]);

  // Get all symbols from selected items for display in video edit tab
  const getAllSelectedSymbols = useCallback(() => {
    if (selectedIds.size === 0) return [];
    const selectedItems = items.filter(it => selectedIds.has(it.id));
    const allSymbols: StoryboardSymbol[] = [];
    const symbolNames = new Set<string>();
    
    selectedItems.forEach(item => {
      if (item.symbols && item.symbols.length > 0) {
        item.symbols.forEach(symbol => {
          if (!symbolNames.has(symbol.name)) {
            symbolNames.add(symbol.name);
            allSymbols.push(symbol);
          }
        });
      }
    });
    
    return allSymbols;
  }, [selectedIds, items]);

  const handleExportPrompts = (editedContent?: string) => {
    const content = editedContent || getFormattedPrompts();
    if (!content.trim()) return alert(t.noSelection);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Director_Prompts_${Date.now()}.txt`;
    a.click();
  };

  const handleExportJPEG = async () => {
    if (selectedIds.size === 0) return alert(t.noSelection);
    setIsLoading(true);
    
    try {
      // Separate reference subject and storyboard frames
      const refItem = items.find(it => it.isMain && selectedIds.has(it.id));
      const frameItems = items.filter(it => !it.isMain && selectedIds.has(it.id));
      
      // Check if at least one frame is selected
      if (frameItems.length === 0) {
        setIsLoading(false);
        return alert(lang === 'zh' 
          ? '请选择至少一个故事板画面进行导出' 
          : 'Please select at least one storyboard frame to export');
      }
      
      // Validate all frames have the same aspect ratio
      const { parseAspectRatio } = await import('./types');
      const ratios = new Set(frameItems.map(it => it.aspectRatio || '16:9'));
      if (ratios.size > 1) {
        setIsLoading(false);
        return alert(lang === 'zh' 
          ? '所有导出的画面必须具有相同的宽高比' 
          : 'All exported frames must have the same aspect ratio');
      }
      
      // Create numbering map based on selection order
      const numberMap: Record<string, number> = {};
      if (selectionOrder.length > 0) {
        // Use selection order
        let frameNum = 1;
        for (const id of selectionOrder) {
          if (frameItems.some(it => it.id === id)) {
            numberMap[id] = frameNum++;
          }
        }
      } else {
        // Use natural order (top-left to bottom-right)
        const sorted = frameItems.sort((a, b) => {
          if (Math.abs(a.y - b.y) > 10) return a.y - b.y;
          return a.x - b.x;
        });
        sorted.forEach((it, idx) => {
          numberMap[it.id] = idx + 1;
        });
      }
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Layout calculation
      const frameCount = frameItems.length;
      const hasRef = !!refItem;
      
      // Parse aspect ratio for frame sizing
      const frameRatio = frameItems[0]?.aspectRatio || '16:9';
      const ratio = parseAspectRatio(frameRatio);
      
      let cols: number, rows: number, frameW: number, frameH: number;
      let refW: number, refH: number, refX: number, refY: number;
      let framesStartX: number, framesStartY: number;
      const padding = 20;
      
      if (hasRef) {
        // Layout with reference: ref on left, frames on right
        refW = 300;
        refH = 400;
        frameW = 300;
        frameH = frameW / ratio;  // Calculate height from width and ratio
        
        // Limit to 2 columns for better layout
        cols = Math.min(2, frameCount);
        rows = Math.ceil(frameCount / cols);
        
        const framesWidth = frameW * cols + padding * (cols - 1);
        const framesHeight = frameH * rows + padding * (rows - 1);
        
        canvas.width = refW + framesWidth + padding * 3;
        canvas.height = Math.max(refH, framesHeight) + padding * 2;
        
        refX = padding;
        refY = padding;
        framesStartX = refX + refW + padding;
        framesStartY = padding;
      } else {
        // Layout without reference: full grid
        frameW = 400;
        frameH = frameW / ratio;  // Calculate height from width and ratio
        
        // Determine grid layout based on frame count
        if (frameCount <= 2) {
          cols = frameCount;
        } else if (frameCount <= 4) {
          cols = 2;
        } else if (frameCount <= 6) {
          cols = 3;
        } else {
          cols = Math.ceil(Math.sqrt(frameCount));
        }
        rows = Math.ceil(frameCount / cols);
        
        canvas.width = frameW * cols + padding * (cols + 1);
        canvas.height = frameH * rows + padding * (rows + 1);
        
        framesStartX = padding;
        framesStartY = padding;
      }

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // CORS proxy list for fallback image loading
      const CORS_PROXIES = [
        'https://cors.bridged.cc/',
        'https://api.allorigins.win/raw?url=',
        'https://proxy.cors.sh/?url='
      ];
      
      // Build CORS proxy URL with proper encoding
      const getCorsProxyUrl = (url: string, proxyIndex: number): string => {
        if (proxyIndex >= CORS_PROXIES.length) return url;
        const proxy = CORS_PROXIES[proxyIndex];
        if (proxy.includes('allorigins')) {
          return `${proxy}${encodeURIComponent(url)}`;
        }
        if (proxy.includes('cors.sh')) {
          return `${proxy}${encodeURIComponent(url)}`;
        }
        return `${proxy}${url}`;
      };
      
      // Load image with CORS fallback and draw on canvas
      const loadAndDrawImage = async (url: string, x: number, y: number, w: number, h: number, proxyIndex: number = 0): Promise<boolean> => {
        return new Promise((resolve) => {
          const img = new Image();
          
          // Set CORS attribute for cross-origin images
          if (!url.startsWith('data:')) {
            img.crossOrigin = "anonymous";
          }
          
          // Set timeout for image loading
          const baseTimeout = 20000; // 20 seconds
          const timeout = setTimeout(() => {
            console.warn(`Image load timeout (attempt ${proxyIndex + 1}): ${url.substring(0, 50)}`);
            // Try next proxy
            if (proxyIndex < CORS_PROXIES.length) {
              console.log(`Retrying with CORS proxy ${proxyIndex + 1}/${CORS_PROXIES.length}...`);
              loadAndDrawImage(url, x, y, w, h, proxyIndex + 1).then(resolve);
            } else {
              console.warn(`All ${CORS_PROXIES.length + 1} attempts failed for: ${url.substring(0, 50)}`);
              resolve(false);
            }
          }, baseTimeout);
          
          img.onload = () => {
            clearTimeout(timeout);
            try {
              if (img.width > 0 && img.height > 0) {
                ctx.drawImage(img, x, y, w, h);
                const method = proxyIndex === 0 ? 'direct' : `proxy ${proxyIndex}`;
                console.log(`Image drawn successfully (${method}): ${url.substring(0, 50)}`);
                resolve(true);
              } else {
                console.warn('Image loaded but has zero dimensions');
                resolve(false);
              }
            } catch (e) {
              console.error('Failed to draw image on canvas:', e);
              resolve(false);
            }
          };
          
          img.onerror = () => {
            clearTimeout(timeout);
            console.warn(`Image load failed (attempt ${proxyIndex + 1}): ${url.substring(0, 50)}`);
            
            // Try next proxy
            if (proxyIndex < CORS_PROXIES.length) {
              console.log(`Retrying with CORS proxy ${proxyIndex + 1}/${CORS_PROXIES.length}...`);
              loadAndDrawImage(url, x, y, w, h, proxyIndex + 1).then(resolve);
            } else {
              // All attempts failed, return false
              console.warn(`All ${CORS_PROXIES.length + 1} attempts failed for: ${url.substring(0, 50)}`);
              resolve(false);
            }
          };
          
          // Use direct URL or proxy URL
          let loadUrl: string;
          if (proxyIndex === 0) {
            loadUrl = url;
          } else {
            loadUrl = getCorsProxyUrl(url, proxyIndex - 1);
          }
          
          console.log(`Loading image (attempt ${proxyIndex + 1}): ${loadUrl.substring(0, 80)}...`);
          img.src = loadUrl;
        });
      };

      // Load and draw reference image if exists
      const loadImage = (url: string, timeout: number = 20000): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          
          const timeoutId = setTimeout(() => {
            reject(new Error(`Image load timeout: ${url.substring(0, 50)}...`));
          }, timeout);
          
          img.onload = () => {
            clearTimeout(timeoutId);
            resolve(img);
          };
          
          img.onerror = () => {
            clearTimeout(timeoutId);
            reject(new Error(`Failed to load image`));
          };
          
          img.src = url;
        });
      };

      // Draw reference image if exists
      if (hasRef && refItem) {
        try {
          const success = await loadAndDrawImage(refItem.imageUrl, refX, refY, refW, refH);
          
          if (success) {
            // Red dashed border for reference
            ctx.strokeStyle = '#ff0000';
            ctx.setLineDash([5, 5]);
            ctx.lineWidth = 2;
            ctx.strokeRect(refX, refY, refW, refH);
            ctx.setLineDash([]);
            
            // Label background
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(refX, refY - 25, 80, 25);
            
            // Label text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px Arial';
            ctx.fillText('REF', refX + 8, refY + 2);
            
            // Chinese label
            ctx.fillStyle = '#ff0000';
            ctx.font = 'bold 12px Arial';
            const refLabel = lang === 'zh' ? '参考' : 'Reference';
            ctx.fillText(refLabel, refX + 90, refY + 2);
          } else {
            // Draw placeholder for failed reference
            ctx.fillStyle = '#cccccc';
            ctx.fillRect(refX, refY, refW, refH);
            ctx.fillStyle = '#666666';
            ctx.font = 'bold 14px Arial';
            ctx.fillText('Failed to load', refX + 10, refY + 20);
          }
        } catch (e) { 
          console.error("Reference image load fail", e);
          // Draw placeholder for error
          ctx.fillStyle = '#cccccc';
          ctx.fillRect(refX, refY, refW, refH);
          ctx.fillStyle = '#666666';
          ctx.font = 'bold 14px Arial';
          ctx.fillText('Failed to load', refX + 10, refY + 20);
        }
      }

      // Draw storyboard frames
      for (let i = 0; i < frameItems.length; i++) {
        const it = frameItems[i];
        const r = Math.floor(i / cols);
        const c = i % cols;
        const x = framesStartX + c * (frameW + padding);
        const y = framesStartY + r * (frameH + padding);
        const frameNum = numberMap[it.id] || i + 1;

        console.log(`Loading frame ${i + 1}/${frameItems.length}:`, it.imageUrl.substring(0, 100));

        try {
          const success = await loadAndDrawImage(it.imageUrl, x, y, frameW, frameH);
          
          if (success) {
            // Blue solid border for frames
            ctx.strokeStyle = '#0000ff';
            ctx.setLineDash([]);
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, frameW, frameH);
            
            // Scene number label
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(x + 10, y + 10, 60, 28);
            ctx.fillStyle = '#ffffff';
            ctx.font = '700 14px Inter';
            ctx.fillText(`SC-${String(frameNum).padStart(2, '0')}`, x + 18, y + 30);
            console.log(`Frame ${i + 1} loaded successfully`);
          } else {
            // Draw placeholder for failed frame
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(x, y, frameW, frameH);
            ctx.strokeStyle = '#0000ff';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, frameW, frameH);
            
            // Error message
            ctx.fillStyle = '#999999';
            ctx.font = 'bold 14px Arial';
            ctx.fillText('Image Failed', x + 10, y + frameH / 2 - 10);
            ctx.font = '12px Arial';
            ctx.fillText('to Load', x + 10, y + frameH / 2 + 10);
            
            // Scene number label
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(x + 10, y + 10, 60, 28);
            ctx.fillStyle = '#ffffff';
            ctx.font = '700 14px Inter';
            ctx.fillText(`SC-${String(frameNum).padStart(2, '0')}`, x + 18, y + 30);
            
            console.warn(`Frame ${i + 1} image failed to load, showing placeholder`);
          }
        } catch (e) { 
          console.error(`Frame ${i + 1} load fail:`, e);
          // Draw placeholder for error
          ctx.fillStyle = '#f0f0f0';
          ctx.fillRect(x, y, frameW, frameH);
          ctx.strokeStyle = '#0000ff';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, frameW, frameH);
          
          // Error message
          ctx.fillStyle = '#999999';
          ctx.font = 'bold 14px Arial';
          ctx.fillText('Error', x + 10, y + frameH / 2 - 10);
          
          // Scene number label
          ctx.fillStyle = 'rgba(0,0,0,0.7)';
          ctx.fillRect(x + 10, y + 10, 60, 28);
          ctx.fillStyle = '#ffffff';
          ctx.font = '700 14px Inter';
          ctx.fillText(`SC-${String(frameNum).padStart(2, '0')}`, x + 18, y + 30);
        }
      }

      // Use canvas.toBlob for better compatibility, fallback to toDataURL if needed
      // Handle Tainted Canvas error with try-catch
      try {
        canvas.toBlob((blob) => {
          if (!blob) {
            alert(lang === 'zh' ? '导出失败，请重试' : 'Export failed, please try again');
            setIsLoading(false);
            return;
          }
          
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Storyboard_Export_${Date.now()}.jpg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          setIsLoading(false);
        }, 'image/jpeg', 0.9);
      } catch (blobError) {
        // If toBlob fails (Tainted Canvas), try toDataURL fallback
        console.warn('toBlob failed, trying toDataURL fallback:', blobError);
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = `Storyboard_Export_${Date.now()}.jpg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setIsLoading(false);
        } catch (dataUrlError) {
          console.error('Both toBlob and toDataURL failed:', dataUrlError);
          alert(lang === 'zh' 
            ? '导出失败：Canvas被污染，请确保所有图像加载正确' 
            : 'Export failed: Canvas is tainted. Please ensure all images load correctly');
          setIsLoading(false);
        }
      }
    } catch (e) {
      console.error("Export failed", e);
      alert(lang === 'zh' ? '导出失败：' + String(e) : 'Export failed: ' + String(e));
      setIsLoading(false);
    }
  };

  const handleDropSymbol = (itemId: string, symName: string, x: number, y: number) => {
    const item = items.find(it => it.id === itemId);
    if (item?.isMain) return;
    
    // Quick storyboard actions trigger generation immediately
    if (symName.startsWith('quick-')) {
      const actionType = symName.replace('quick-', '');
      handleQuickStoryboardAction(itemId, actionType);
      return;
    }
    
    // Other symbols (camera motion, action motion) are added to the frame
    setItems(prev => prev.map(it => it.id === itemId ? {
      ...it,
      symbols: [...it.symbols, { id: crypto.randomUUID(), type: 'action', name: symName, label: SYMBOL_LABELS[symName], x, y, rotation: 0 }]
    } : it));
  };

  const handleQuickStoryboardAction = async (itemId: string, actionType: string) => {
    // Quick storyboard feature disabled - generators were removed during cleanup
    console.warn('Quick storyboard feature is disabled');
    return;
  };

  const handleQuickStoryboardConfirm = async (frameCount: number) => {
    // Quick storyboard feature disabled - generators were removed during cleanup
    setShowQuickStoryboardConfig(false);
    setQuickStoryboardItemId(null);
    setQuickStoryboardActionType(null);
  };
      
      // Dead code removed - quick storyboard feature disabled

  const handleBatchRedraw = useCallback(async (instructions: Record<string, string>) => {
    if (Object.keys(instructions).length === 0) return;
    
    // Get selected frames and order them properly
    const selectedFrames = items.filter(it => !it.isMain && selectedIds.has(it.id));
    
    // Order frames by selection or position
    const orderedFrames = selectionOrder.length > 0 
      ? selectionOrder.map(id => selectedFrames.find(f => f.id === id)).filter(Boolean) as StoryboardItem[]
      : selectedFrames.sort((a, b) => {
          if (Math.abs(a.y - b.y) > 10) return a.y - b.y;
          return a.x - b.x;
        });
    
    // Limit batch size to 6 frames
    const MAX_BATCH_SIZE = 6;
    if (orderedFrames.length > MAX_BATCH_SIZE) {
      alert(lang === 'zh' 
        ? `批量重绘最多支持 ${MAX_BATCH_SIZE} 个画面，但选择了 ${orderedFrames.length} 个，请减少选择` 
        : `Batch redraw supports maximum ${MAX_BATCH_SIZE} frames, but ${orderedFrames.length} are selected. Please reduce the selection.`);
      return;
    }
    
    setIsLoading(true);
    let successCount = 0;
    let failureCount = 0;
    
    try {
      // Process each frame (with delay between API calls)
      for (let i = 0; i < orderedFrames.length; i++) {
        const frame = orderedFrames[i];
        const sceneNum = `SC-${String(i + 1).padStart(2, '0')}`;
        const instruction = instructions[sceneNum] || '';
        
        // Combine prompt: original + instruction + symbols
        const symbolInstructions = frame.symbols
          .map(s => SYMBOL_DESCRIPTIONS[lang][s.name] || s.name)
          .filter(Boolean)
          .join(', ');
        let finalPrompt = frame.prompt;
        
        if (instruction) {
          finalPrompt = `${finalPrompt}. ${instruction}`;
        }
        if (symbolInstructions) {
          finalPrompt = `${finalPrompt}. Key actions: ${symbolInstructions}`;
        }
        
        // Generate image
        const isBlackAndWhite = frame.colorMode === 'blackAndWhite';
        try {
          console.log(`[${sceneNum}] Generating... (${i + 1}/${orderedFrames.length})`);
          const newUrl = await generateSceneImage(finalPrompt, true, isBlackAndWhite, undefined, frame.aspectRatio);
          if (newUrl) {
            setItems(prev => prev.map(it => it.id === frame.id ? { ...it, imageUrl: newUrl, filter: FilterMode.LINE_ART, prompt: finalPrompt } : it));
            successCount++;
            console.log(`[${sceneNum}] Generated successfully`);
          } else {
            failureCount++;
            console.warn(`[${sceneNum}] Generation failed: No URL returned`);
          }
        } catch (frameError) {
          failureCount++;
          console.error(`[${sceneNum}] Generation error:`, frameError);
        }
        
        // Add delay between requests to avoid API rate limiting
        if (i < orderedFrames.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      // Show results
      if (failureCount > 0) {
        alert(lang === 'zh' 
          ? `批量重绘完成：成功 ${successCount} 个，失败 ${failureCount} 个` 
          : `Batch redraw completed: ${successCount} succeeded, ${failureCount} failed`);
      } else if (successCount > 0) {
        alert(lang === 'zh' 
          ? `批量重绘完成：成功 ${successCount} 个` 
          : `Batch redraw completed: ${successCount} succeeded`);
      }
      
      // Close dialog
      setShowBatchRedrawDialog(false);
    } catch (e) {
      console.error("Batch redraw failed", e);
      alert(lang === 'zh' 
        ? `批量重绘失败：${String(e)}` 
        : `Batch redraw failed: ${String(e)}`);
    } finally {
      setIsLoading(false);
    }
  }, [items, selectedIds, selectionOrder, lang, setShowBatchRedrawDialog]);



  // Batch Automation Handlers
  const handleStartBatchProcessing = useCallback((scripts: BatchScript[], config: BatchConfig) => {
    console.log('[handleStartBatchProcessing] Called with', scripts.length, 'scripts');
    console.log('[handleStartBatchProcessing] Scripts:', scripts.map(s => ({ id: s.id, title: s.title, status: s.status })));
    
    setBatchScripts(scripts);
    setBatchConfig(config);
    setIsBatchProcessing(true);
    
    console.log('[handleStartBatchProcessing] State updated - isBatchProcessing set to true');
    
    // Request notification permission if enabled
    if (config.enableNotifications !== false && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    // Save state
    const state = {
      scripts,
      config,
      isRunning: true,
      completedCount: 0,
      failedCount: 0,
      totalCount: scripts.length
    };
    BatchProcessor.saveBatchState(state);
    console.log('[handleStartBatchProcessing] Batch state saved');
    
    // Start processing interval
    console.log('[handleStartBatchProcessing] Starting batch processing interval');
    startBatchProcessingInterval(scripts, config);
  }, []);

  const startBatchProcessingInterval = useCallback((initialScripts: BatchScript[], config: BatchConfig) => {
    // Clear existing interval
    if (batchProcessingIntervalRef.current) {
      clearInterval(batchProcessingIntervalRef.current);
    }

    console.log('[Batch] Starting batch processing interval with', initialScripts.length, 'scripts');

    // Start new interval
    batchProcessingIntervalRef.current = setInterval(() => {
      // Use current batchScripts state instead of closure variable
      const nextScript = BatchProcessor.getNextPendingScript(batchScripts);
      console.log('[Batch] Interval check - pending scripts:', batchScripts.filter(s => s.status === 'pending').length, 'processing:', batchScripts.filter(s => s.status === 'processing').length);
      
      if (nextScript && isBatchProcessing) {
        console.log('[Batch] Found pending script:', nextScript.title);
        processBatchScript(nextScript, config, batchScripts);
      } else if (!nextScript && isBatchProcessing) {
        // All scripts processed, check if any are still processing
        const processingScripts = batchScripts.filter(s => s.status === 'processing');
        console.log('[Batch] No pending scripts, processing scripts:', processingScripts.length);
        
        if (processingScripts.length === 0) {
          // All done, stop processing and show completion dialog
          console.log('[Batch] All scripts completed, showing completion dialog');
          setIsBatchProcessing(false);
          setShowBatchCompletionDialog(true);
          if (batchProcessingIntervalRef.current) {
            clearInterval(batchProcessingIntervalRef.current);
            batchProcessingIntervalRef.current = null;
          }
        }
      }
    }, config.processingInterval);
  }, [batchScripts, isBatchProcessing]);

  const processBatchScript = useCallback(async (script: BatchScript, config: BatchConfig, allScripts: BatchScript[]) => {
    console.log('[processBatchScript] Starting to process script:', script.title, 'ID:', script.id);
    
    let updatedScripts = BatchProcessor.updateScriptStatus(allScripts, script.id, 'processing', 10);
    setBatchScripts(updatedScripts);

    try {
      // Initialize VideoService if not already done
      if (!videoServiceRef.current) {
        const configStr = localStorage.getItem('director_canvas_video_config');
        if (!configStr) {
          throw new Error('Video API not configured');
        }
        const videoConfig = JSON.parse(configStr);
        videoServiceRef.current = new VideoService(videoConfig);
      }

      console.log(`[Batch] Processing script: ${script.title}`);
      
      // 用脚本内容作为视频提示词
      const videoPrompt = script.content;

      updatedScripts = BatchProcessor.updateScriptStatus(updatedScripts, script.id, 'processing', 20);
      setBatchScripts(updatedScripts);

      // 生成视频
      console.log(`[Batch] Generating video for: ${script.title}`);
      
      const videoResult = await videoServiceRef.current.createVideo(videoPrompt, {
        model: 'sora-2',
        aspect_ratio: config.aspectRatio || '16:9',
        duration: config.videoDuration || 15,
        hd: false,
        images: config.referenceImageUrl ? [config.referenceImageUrl] : undefined
      });

      updatedScripts = BatchProcessor.updateScriptStatus(updatedScripts, script.id, 'processing', 30);
      setBatchScripts(updatedScripts);

      // 轮询视频完成状态
      console.log(`[Batch] Polling video status: ${videoResult.task_id}`);
      
      let videoUrl: string | undefined;
      let pollError: Error | undefined;

      await new Promise<void>((resolve) => {
        videoServiceRef.current!.startPolling(
          videoResult.task_id,
          (status) => {
            const videoProgress = parseInt(status.progress) || 30;
            const overallProgress = 30 + Math.min(videoProgress - 30, 60);
            updatedScripts = BatchProcessor.updateScriptStatus(updatedScripts, script.id, 'processing', overallProgress);
            setBatchScripts(updatedScripts);
          },
          (url) => {
            videoUrl = url;
            resolve();
          },
          (error) => {
            pollError = error;
            resolve();
          }
        );
      });

      if (pollError) {
        throw pollError;
      }

      if (!videoUrl) {
        throw new Error('Video generation completed but URL not found');
      }

      updatedScripts = BatchProcessor.updateScriptStatus(updatedScripts, script.id, 'processing', 90);
      setBatchScripts(updatedScripts);

      // 自动下载视频
      console.log(`[Batch] Downloading video: ${videoUrl}`);
      try {
        const response = await fetch(videoUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch video: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${script.title}_${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
        
        console.log(`[Batch] Video downloaded: ${a.download}`);
      } catch (downloadError) {
        console.warn('Video download failed, but continuing:', downloadError);
      }

      // 标记为完成
      const completedScripts = BatchProcessor.updateScriptStatus(updatedScripts, script.id, 'completed', 100, videoUrl);
      setBatchScripts(completedScripts);

      // 保存状态
      const stats = BatchProcessor.calculateStats(completedScripts);
      const state = {
        scripts: completedScripts,
        config,
        isRunning: isBatchProcessing,
        completedCount: stats.completed,
        failedCount: stats.failed,
        totalCount: stats.total
      };
      BatchProcessor.saveBatchState(state);

      console.log(`[Batch] Script completed: ${script.title}`);
      
      // 显示完成通知
      if (config.enableNotifications !== false) {
        showNotification(
          lang === 'zh' 
            ? `✓ 脚本已完成: ${script.title}` 
            : `✓ Script completed: ${script.title}`,
          'success'
        );
        playNotificationSound('success');
      }
      
      // 浏览器通知
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(lang === 'zh' ? '批量处理' : 'Batch Processing', {
          body: lang === 'zh' 
            ? `脚本已完成: ${script.title}` 
            : `Script completed: ${script.title}`,
          icon: '🎉'
        });
      }
      
      // 检查是否全部完成
      const allCompleted = completedScripts.every(s => s.status === 'completed' || s.status === 'failed');
      if (allCompleted) {
        setIsBatchProcessing(false);
        setShowBatchCompletionDialog(true);
        if (batchProcessingIntervalRef.current) {
          clearInterval(batchProcessingIntervalRef.current);
        }
      }

    } catch (error) {
      console.error('Batch script processing error:', error);
      
      const errorMessage = String(error);
      const formattedError = BatchProcessor.formatErrorMessage(errorMessage, lang);
      const currentRetryCount = updatedScripts.find(s => s.id === script.id)?.retryCount || 0;
      const maxRetries = config.maxRetries || 3;
      
      // 检查是否应该重试
      if (BatchProcessor.shouldRetry(updatedScripts.find(s => s.id === script.id)!, config)) {
        console.log(`[Batch] Retrying script: ${script.title} (${currentRetryCount + 1}/${maxRetries})`);
        
        const retryScripts = BatchProcessor.resetScriptForRetry(updatedScripts, script.id);
        setBatchScripts(retryScripts);
        
        if (config.enableNotifications !== false) {
          const retryMsg = lang === 'zh' 
            ? `⏳ 重试中: ${script.title} (${currentRetryCount + 1}/${maxRetries})`
            : `⏳ Retrying: ${script.title} (${currentRetryCount + 1}/${maxRetries})`;
          showNotification(retryMsg, 'info');
        }
        
        const retryDelay = config.retryDelay || 5000;
        setTimeout(() => {
          const nextScript = retryScripts.find(s => s.id === script.id);
          if (nextScript) {
            processBatchScript(nextScript, config, retryScripts);
          }
        }, retryDelay);
      } else {
        // Update script status to failed
        const failedScripts = BatchProcessor.updateScriptStatus(updatedScripts, script.id, 'failed', 0, undefined, formattedError);
        setBatchScripts(failedScripts);

        // Save state
        const stats = BatchProcessor.calculateStats(failedScripts);
        const state = {
          scripts: failedScripts,
          config,
          isRunning: isBatchProcessing,
          completedCount: stats.completed,
          failedCount: stats.failed,
          totalCount: stats.total
        };
        BatchProcessor.saveBatchState(state);

        console.error(`[Batch] Script failed: ${script.title} - ${formattedError}`);
        
        // Show error notification with retry info
        if (config.enableNotifications !== false) {
          const errorMsg = currentRetryCount > 0 
            ? `${formattedError} (${lang === 'zh' ? '已重试' : 'Retried'} ${currentRetryCount}${lang === 'zh' ? '次' : 'x'})`
            : formattedError;
          showNotification(errorMsg, 'error');
          // Play error sound
          playNotificationSound('error');
        }
        
        // Check if all scripts are completed
        const allCompleted = failedScripts.every(s => s.status === 'completed' || s.status === 'failed');
        if (allCompleted) {
          setIsBatchProcessing(false);
          setShowBatchCompletionDialog(true);
          if (batchProcessingIntervalRef.current) {
            clearInterval(batchProcessingIntervalRef.current);
          }
        }
      }
    }
  }, [items.length, videoEditStyle, isBatchProcessing, lang]);

  const handleCloseBatchAutomation = useCallback(() => {
    setShowBatchAutomation(false);
  }, []);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type, visible: true });
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 5000);
  }, []);

  // Play sound notification
  const playNotificationSound = useCallback((type: 'success' | 'error' | 'info' = 'info') => {
    try {
      // Create audio context for sound notification
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different notification types
      const frequencies: Record<string, number> = {
        success: 800,  // Higher pitch for success
        error: 400,    // Lower pitch for error
        info: 600      // Medium pitch for info
      };
      
      const durations: Record<string, number> = {
        success: 0.2,  // Shorter for success
        error: 0.3,    // Longer for error
        info: 0.15     // Short for info
      };
      
      oscillator.frequency.value = frequencies[type];
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + durations[type]);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + durations[type]);
    } catch (error) {
      console.warn('Failed to play notification sound:', error);
    }
  }, []);

  // Download video to browser default directory (browser security limitation)
  // Note: Due to browser security restrictions, files can only be downloaded to the browser's default download directory
  // To download to a specific directory, a backend solution or Electron app would be required
  const downloadVideo = useCallback(async (videoUrl: string, downloadPath: string, taskId: string) => {
    try {
      const response = await fetch(videoUrl);
      if (!response.ok) {
        console.warn(`Failed to download video: ${response.statusText}`);
        return;
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Use task ID in filename for identification
      a.download = `video_${taskId}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log(`Video downloaded: video_${taskId}.mp4`);
    } catch (error) {
      console.error('Video download error:', error);
    }
  }, []);

  const handleGenerateVideoBatch = useCallback(async (prompts: string[], options: any, selectedFrames?: any[]) => {
    if (!videoServiceRef.current) {
      const configStr = localStorage.getItem('director_canvas_video_config');
      if (!configStr) {
        alert(lang === 'zh' ? '请先配置视频 API' : 'Please configure video API first');
        return;
      }
      const config = JSON.parse(configStr);
      videoServiceRef.current = new VideoService(config);
    }

    try {
      setIsLoading(true);
      setBatchProgress({ current: 0, total: prompts.length });
      
      // 为每个脚本生成视频 - 使用完全相同的逻辑，只替换提示词
      for (let i = 0; i < prompts.length; i++) {
        let prompt = prompts[i];
        
        // 如果有选定的分镜图，自动添加参考主体提示
        if (selectedFrames && selectedFrames.length > 0) {
          const refPrompt = lang === 'zh' 
            ? '使用参考图作为视频生成的主体人物/产品，保持一致性。'
            : 'Use the reference image as the main character/product in the video, maintaining consistency.';
          prompt = refPrompt + '\n' + prompt;
        }
        
        // 如果指定了语言，添加到提示词中
        if (options.language) {
          const langPrompt = lang === 'zh'
            ? `视频对话和字幕语言：${options.language}。`
            : `Video dialogue and subtitle language: ${options.language}.`;
          prompt = prompt + '\n' + langPrompt;
        }
        
        // 如果不是第一个视频，等待指定的间隔时间
        if (i > 0 && options.intervalMinutes) {
          const delayMs = options.intervalMinutes * 60 * 1000;
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
        
        // 构建视频生成选项
        const videoOptions: any = {
          model: options.model,
          aspect_ratio: options.aspect_ratio,
          duration: options.duration,
          hd: options.hd
        };
        
        // 如果有选定的分镜图，使用第一张作为参考
        if (selectedFrames && selectedFrames.length > 0) {
          const refFrame = items.find(it => it.id === selectedFrames[0].id);
          if (refFrame && refFrame.imageUrl) {
            videoOptions.reference_image = refFrame.imageUrl;
          }
        }
        
        const result = await videoServiceRef.current.createVideo(prompt, videoOptions);

        // 添加视频项到画布
        const newVideoItem: VideoItem = {
          id: crypto.randomUUID(),
          taskId: result.task_id,
          prompt: prompt,
          status: 'loading',
          progress: result.progress,
          x: 100 + Math.random() * 200,
          y: 100 + Math.random() * 200,
          width: 400,
          height: 300,
          createdAt: Date.now(),
          downloadPath: options.downloadPath
        };

        setVideoItems(prev => [...prev, newVideoItem]);
        
        // 更新进度
        setBatchProgress(prev => ({ ...prev, current: i + 1 }));

        // 开始轮询视频状态 - 使用完全相同的逻辑
        videoServiceRef.current.startPolling(
          result.task_id,
          (status) => {
            setVideoItems(prev => prev.map(item =>
              item.taskId === result.task_id
                ? {
                    ...item,
                    progress: status.progress,
                    status: status.status === 'SUCCESS' ? 'completed' : status.status === 'FAILURE' ? 'failed' : 'loading',
                    videoUrl: status.video_url || item.videoUrl,
                    error: status.error?.message
                  }
                : item
            ));
          },
          (videoUrl) => {
            setVideoItems(prev => prev.map(item =>
              item.taskId === result.task_id
                ? { ...item, status: 'completed', videoUrl: videoUrl || item.videoUrl }
                : item
            ));
            
            // 如果指定了下载路径，自动下载
            if (options.downloadPath && videoUrl) {
              downloadVideo(videoUrl, options.downloadPath, result.task_id);
            }
          },
          (error) => {
            setVideoItems(prev => prev.map(item =>
              item.taskId === result.task_id
                ? { ...item, status: 'failed', error: typeof error === 'string' ? error : error.message }
                : item
            ));
          }
        );
      }

      setShowVideoGenDialog(false);
    } catch (error) {
      console.error('Batch video generation error:', error);
      alert(lang === 'zh' ? '生成失败: ' + String(error) : 'Video generation failed: ' + String(error));
    } finally {
      setIsLoading(false);
    }
  }, [lang, items]);

  const handleGenerateVideo = useCallback(async (prompt: string, options: any) => {
    if (!videoServiceRef.current) {
      const configStr = localStorage.getItem('director_canvas_video_config');
      if (!configStr) {
        alert(lang === 'zh' ? '请先配置视频 API' : 'Please configure video API first');
        return;
      }
      const config = JSON.parse(configStr);
      videoServiceRef.current = new VideoService(config);
    }

    try {
      setIsLoading(true);
      
      // Detect provider based on model selection
      let provider = 'openai';
      if (options.model && options.model.startsWith('cogvideox')) {
        provider = 'zhipu';
      }
      
      // Set provider in VideoService
      if (videoServiceRef.current) {
        videoServiceRef.current.setProvider(provider as any);
      }
      
      // Get reference image from first selected frame if available
      let referenceImage: string | undefined;
      if (options.selectedFrames && options.selectedFrames.length > 0) {
        const firstFrame = options.selectedFrames[0];
        const frameItem = items.find(it => it.id === firstFrame.id);
        if (frameItem) {
          referenceImage = frameItem.imageUrl;
          console.log('[handleGenerateVideo] Using reference image from selected frame:', firstFrame.id);
        }
      }
      
      const result = await videoServiceRef.current.createVideo(prompt, {
        model: options.model,
        aspect_ratio: options.aspect_ratio,
        duration: options.duration,
        hd: options.hd,
        reference_image: referenceImage
      });

      // 添加视频项到画布
      const newVideoItem: VideoItem = {
        id: crypto.randomUUID(),
        taskId: result.task_id,
        prompt: prompt,
        videoPrompt: prompt,
        status: 'loading',
        progress: result.progress,
        x: 100,
        y: 100,
        width: 400,
        height: 300,
        createdAt: Date.now()
      };

      setVideoItems(prev => [...prev, newVideoItem]);

      // 开始轮询视频状态
      videoServiceRef.current.startPolling(
        result.task_id,
        (status) => {
          setVideoItems(prev => prev.map(item =>
            item.taskId === result.task_id
              ? {
                  ...item,
                  progress: status.progress,
                  status: status.status === 'SUCCESS' ? 'completed' : status.status === 'FAILURE' ? 'failed' : 'loading',
                  videoUrl: status.video_url || item.videoUrl,
                  error: status.error?.message
                }
              : item
          ));
        },
        (videoUrl) => {
          setVideoItems(prev => prev.map(item =>
            item.taskId === result.task_id
              ? { ...item, status: 'completed', videoUrl: videoUrl || item.videoUrl }
              : item
          ));
        },
        (error) => {
          setVideoItems(prev => prev.map(item =>
            item.taskId === result.task_id
              ? { ...item, status: 'failed', error: typeof error === 'string' ? error : error.message }
              : item
          ));
        }
      );

      setShowVideoGenDialog(false);
    } catch (error) {
      console.error('Video generation error:', error);
      alert(lang === 'zh' ? '生成失败: ' + String(error) : 'Video generation failed: ' + String(error));
    } finally {
      setIsLoading(false);
    }
  }, [lang, items]);

  const handleGenerateVideoFromContextMenu = useCallback((itemId: string) => {
    const item = items.find(it => it.id === itemId);
    if (!item) return;
    
    // Set this item as selected and open video dialog with its videoPrompt
    setSelectedIds(new Set([itemId]));
    
    // 构建最终的视频提示词：优先使用 videoPrompt，其次使用 prompt（如果不是默认值）
    let finalPrompt = item.videoPrompt || '';
    
    // 如果 videoPrompt 为空，尝试使用 prompt（但排除空值）
    if (!finalPrompt && item.prompt) {
      finalPrompt = item.prompt;
    }
    
    // 如果有符号标记，将符号描述追加到提示词中
    if (item.symbols && item.symbols.length > 0) {
      const symbolDescriptions = item.symbols
        .map(s => SYMBOL_DESCRIPTIONS[lang][s.name] || s.name)
        .filter(Boolean);
      
      if (symbolDescriptions.length > 0) {
        finalPrompt += `\n\n【镜头运动与动作】${symbolDescriptions.join('，')}`;
      }
    }
    
    setVideoGenDialogPrompt(finalPrompt);
    setVideoGenDialogSymbols(item.symbols || []);
    setShowVideoGenDialog(true);
  }, [items, lang]);

  // Handle quick storyboard actions from context menu
  const handleQuickAction = useCallback((itemId: string, actionType: 'three-view' | 'style-comparison' | 'multi-grid' | 'narrative-progression') => {
    const item = items.find(it => it.id === itemId);
    if (!item) return;

    console.log(`[App] Quick action triggered: ${actionType} for item ${itemId}`);
    
    const generateQuickStoryboard = async () => {
      setIsLoading(true);
      try {
        let newItems: StoryboardItem[] = [];
        const baseWidth = 380;
        const { calculateHeight } = await import('./types');
        const height = calculateHeight(baseWidth, '16:9');
        
        if (actionType === 'three-view') {
          const threeViewPrompts = [
            `Professional cinematic storyboard frame - Front orthographic view. Show a detailed subject from the front with clear composition, professional lighting, and rich details. High quality digital painting with vibrant colors. Aspect ratio: 16:9`,
            `Professional cinematic storyboard frame - Side orthographic view. Show a detailed subject from the side with clear composition, professional lighting, and rich details. High quality digital painting with vibrant colors. Aspect ratio: 16:9`,
            `Professional cinematic storyboard frame - Top orthographic view. Show a detailed subject from above with clear composition, professional lighting, and rich details. High quality digital painting with vibrant colors. Aspect ratio: 16:9`
          ];

          for (let i = 0; i < 3; i++) {
            try {
              const imageUrl = await generateSceneImage(threeViewPrompts[i], true, false, undefined, '16:9');
              if (imageUrl) {
                newItems.push({
                  id: crypto.randomUUID(),
                  imageUrl,
                  prompt: threeViewPrompts[i],
                  description: ['Front View', 'Side View', 'Top View'][i],
                  x: item.x + (i * 420),
                  y: item.y,
                  width: baseWidth,
                  height,
                  isMain: false,
                  filter: FilterMode.LINE_ART,
                  order: items.length + i,
                  symbols: [],
                  colorMode: 'color',
                  aspectRatio: '16:9'
                });
              }
            } catch (err) {
              console.error(`Failed to generate view ${i + 1}:`, err);
            }
          }
        } else if (actionType === 'multi-grid') {
          const frameCount = prompt('Enter number of frames (2-12):', '4');
          if (!frameCount) {
            setIsLoading(false);
            return;
          }
          
          const count = parseInt(frameCount);
          if (isNaN(count) || count < 2 || count > 12) {
            alert('Please enter a number between 2 and 12');
            setIsLoading(false);
            return;
          }

          const prompt_text = `Professional cinematic storyboard - ${count}-frame grid showing a narrative sequence. Each frame shows progression of a dramatic scene with clear composition, professional lighting, and rich details. High quality digital painting with vibrant colors. Aspect ratio: 16:9`;
          
          try {
            const imageUrl = await generateSceneImage(prompt_text, true, false, undefined, '16:9');
            if (imageUrl) {
              newItems.push({
                id: crypto.randomUUID(),
                imageUrl,
                prompt: prompt_text,
                description: `Multi-Grid (${count} frames)`,
                x: item.x,
                y: item.y + 300,
                width: baseWidth * 2,
                height: height * 1.5,
                isMain: false,
                filter: FilterMode.LINE_ART,
                order: items.length,
                symbols: [],
                colorMode: 'color',
                aspectRatio: '16:9'
              });
            }
          } catch (err) {
            console.error('Failed to generate multi-grid:', err);
          }
        } else if (actionType === 'style-comparison') {
          const styles = ['oil painting', 'watercolor', 'digital art', 'anime', 'photorealistic'];
          
          for (let idx = 0; idx < styles.length; idx++) {
            const style = styles[idx];
            try {
              const prompt_text = `Professional cinematic storyboard frame in ${style} artistic style. Show a detailed subject with clear composition, professional lighting, and rich details. High quality artwork. Aspect ratio: 16:9`;
              const imageUrl = await generateSceneImage(prompt_text, true, false, undefined, '16:9');
              if (imageUrl) {
                newItems.push({
                  id: crypto.randomUUID(),
                  imageUrl,
                  prompt: prompt_text,
                  description: `${style} style`,
                  x: item.x + (idx * 420),
                  y: item.y + 300,
                  width: baseWidth,
                  height,
                  isMain: false,
                  filter: FilterMode.LINE_ART,
                  order: items.length + idx,
                  symbols: [],
                  colorMode: 'color',
                  aspectRatio: '16:9'
                });
              }
            } catch (err) {
              console.error(`Failed to generate ${style} style:`, err);
            }
          }
        } else if (actionType === 'narrative-progression') {
          const frameCount = prompt('Enter number of frames (1-12):', '4');
          if (!frameCount) {
            setIsLoading(false);
            return;
          }
          
          const count = parseInt(frameCount);
          if (isNaN(count) || count < 1 || count > 12) {
            alert('Please enter a number between 1 and 12');
            setIsLoading(false);
            return;
          }

          for (let i = 0; i < count; i++) {
            try {
              const prompt_text = `Professional cinematic storyboard frame ${i + 1} of ${count}. Show a dramatic scene with clear composition, professional lighting, and rich details. Part of a narrative sequence showing story progression. High quality digital painting with vibrant colors. Aspect ratio: 16:9`;
              const imageUrl = await generateSceneImage(prompt_text, true, false, undefined, '16:9');
              if (imageUrl) {
                newItems.push({
                  id: crypto.randomUUID(),
                  imageUrl,
                  prompt: prompt_text,
                  description: `Frame ${i + 1}`,
                  x: item.x + (i % 3) * 420,
                  y: item.y + Math.floor(i / 3) * 300,
                  width: baseWidth,
                  height,
                  isMain: false,
                  filter: FilterMode.LINE_ART,
                  order: items.length + i,
                  symbols: [],
                  colorMode: 'color',
                  aspectRatio: '16:9'
                });
              }
            } catch (err) {
              console.error(`Failed to generate frame ${i + 1}:`, err);
            }
          }
        }

        if (newItems.length > 0) {
          setItems(prev => [...prev, ...newItems]);
        }
      } catch (error) {
        console.error('[App] Quick action error:', error);
        alert('Failed to generate storyboard. Please check your API configuration.');
      } finally {
        setIsLoading(false);
      }
    };

    generateQuickStoryboard();
  }, [items]);
  const handleDeleteVideoWindow = useCallback((videoId: string) => {
    setVideoItems(prev => prev.filter(item => item.id !== videoId));
  }, []);

  const handleDownloadVideo = useCallback((videoId: string) => {
    const videoItem = videoItems.find(item => item.id === videoId);
    if (!videoItem || !videoItem.videoUrl) return;

    const a = document.createElement('a');
    a.href = videoItem.videoUrl;
    a.download = `video_${videoItem.taskId}.mp4`;
    a.click();
  }, [videoItems]);

  const handleEditVideo = useCallback((videoId: string) => {
    setEditingVideoId(videoId);
    setShowVideoEditDialog(true);
  }, []);

  const handleApplyVideoEdit = useCallback(async (newPrompt: string) => {
    if (!editingVideoId || !videoServiceRef.current) return;

    const videoItem = videoItems.find(item => item.id === editingVideoId);
    if (!videoItem) return;

    try {
      setIsLoading(true);

      // Get selected storyboard images
      const selectedFrames = items.filter(it => !it.isMain && selectedIds.has(it.id));
      
      // ? BUG FIX: API ???????,?????????????
      let compositeImageUrl: string | undefined;
      
      if (selectedFrames.length > 0) {
        // ??????????
        const { parseAspectRatio } = await import('./types');
        const frameRatio = selectedFrames[0]?.aspectRatio || '16:9';
        const ratio = parseAspectRatio(frameRatio);
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          alert(lang === 'zh' ? '???????' : 'Failed to create composite image');
          setIsLoading(false);
          return;
        }

        // ????
        const frameCount = selectedFrames.length;
        let cols: number, rows: number, frameW: number, frameH: number;
        const padding = 20;
        
        frameW = 400;
        frameH = frameW / ratio;
        
        // ??????????
        if (frameCount <= 2) {
          cols = frameCount;
        } else if (frameCount <= 4) {
          cols = 2;
        } else if (frameCount <= 6) {
          cols = 3;
        } else {
          cols = Math.ceil(Math.sqrt(frameCount));
        }
        rows = Math.ceil(frameCount / cols);
        
        canvas.width = frameW * cols + padding * (cols + 1);
        canvas.height = frameH * rows + padding * (rows + 1);
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // CORS ???? - ??????
        const CORS_PROXIES = [
          'https://cors.bridged.cc/',
          'https://api.allorigins.win/raw?url=',
          'https://proxy.cors.sh/?url='
        ];
        
        const getCorsProxyUrl = (url: string, proxyIndex: number): string => {
          if (proxyIndex >= CORS_PROXIES.length) return url;
          const proxy = CORS_PROXIES[proxyIndex];
          if (proxy.includes('allorigins')) {
            return `${proxy}${encodeURIComponent(url)}`;
          }
          if (proxy.includes('cors.sh')) {
            return `${proxy}${encodeURIComponent(url)}`;
          }
          return `${proxy}${url}`;
        };
        
        const loadAndDrawImage = async (url: string, x: number, y: number, w: number, h: number, proxyIndex: number = 0): Promise<boolean> => {
          return new Promise((resolve) => {
            const img = new Image();
            if (!url.startsWith('data:')) {
              img.crossOrigin = "anonymous";
            }
            
            const baseTimeout = 20000; // 20 ?????
            const timeout = setTimeout(() => {
              console.warn(`Image load timeout (attempt ${proxyIndex + 1}): ${url.substring(0, 50)}`);
              if (proxyIndex < CORS_PROXIES.length) {
                console.log(`Retrying with CORS proxy ${proxyIndex + 1}/${CORS_PROXIES.length}...`);
                loadAndDrawImage(url, x, y, w, h, proxyIndex + 1).then(resolve);
              } else {
                console.warn(`All ${CORS_PROXIES.length + 1} attempts failed for: ${url.substring(0, 50)}`);
                resolve(false);
              }
            }, baseTimeout);
            
            img.onload = () => {
              clearTimeout(timeout);
              try {
                if (img.width > 0 && img.height > 0) {
                  ctx.drawImage(img, x, y, w, h);
                  const method = proxyIndex === 0 ? 'direct' : `proxy ${proxyIndex}`;
                  console.log(`? Image drawn successfully (${method}): ${url.substring(0, 50)}`);
                  resolve(true);
                } else {
                  console.warn('Image loaded but has zero dimensions');
                  resolve(false);
                }
              } catch (e) {
                console.error('Failed to draw image on canvas:', e);
                resolve(false);
              }
            };
            
            img.onerror = () => {
              clearTimeout(timeout);
              console.warn(`Image load failed (attempt ${proxyIndex + 1}): ${url.substring(0, 50)}`);
              if (proxyIndex < CORS_PROXIES.length) {
                console.log(`Retrying with CORS proxy ${proxyIndex + 1}/${CORS_PROXIES.length}...`);
                loadAndDrawImage(url, x, y, w, h, proxyIndex + 1).then(resolve);
              } else {
                console.warn(`All ${CORS_PROXIES.length + 1} attempts failed for: ${url.substring(0, 50)}`);
                resolve(false);
              }
            };
            
            let loadUrl: string;
            if (proxyIndex === 0) {
              loadUrl = url;
            } else {
              loadUrl = getCorsProxyUrl(url, proxyIndex - 1);
            }
            
            console.log(`Loading image (attempt ${proxyIndex + 1}): ${loadUrl.substring(0, 80)}...`);
            img.src = loadUrl;
          });
        };

        // ???????
        for (let i = 0; i < selectedFrames.length; i++) {
          const frame = selectedFrames[i];
          const r = Math.floor(i / cols);
          const c = i % cols;
          const x = padding + c * (frameW + padding);
          const y = padding + r * (frameH + padding);
          
          await loadAndDrawImage(frame.imageUrl, x, y, frameW, frameH);
        }

        // ??? base64 ?? URL
        compositeImageUrl = canvas.toDataURL('image/jpeg', 0.9);
      }

      // ? ??????????(?????????????)
      const finalPrompt = newPrompt;

      // Create new video with edited prompt and composite image
      const result = await videoServiceRef.current.createVideo(finalPrompt, {
        model: 'sora-2-pro',
        aspect_ratio: '16:9',
        duration: 10,
        hd: false,
        images: compositeImageUrl ? [compositeImageUrl] : undefined
      });

      // Update video item with new task
      setVideoItems(prev => prev.map(item =>
        item.id === editingVideoId
          ? {
              ...item,
              taskId: result.task_id,
              prompt: finalPrompt,
              status: 'loading',
              progress: 0,
              videoUrl: undefined,
              error: undefined
            }
          : item
      ));

      // Start polling for new video
      videoServiceRef.current.startPolling(
        result.task_id,
        (status) => {
          setVideoItems(prev => prev.map(item =>
            item.taskId === result.task_id
              ? {
                  ...item,
                  progress: status.progress,
                  status: status.status === 'SUCCESS' ? 'completed' : status.status === 'FAILURE' ? 'failed' : 'loading',
                  videoUrl: status.video_url || item.videoUrl,
                  error: status.error?.message
                }
              : item
          ));
        },
        (videoUrl) => {
          setVideoItems(prev => prev.map(item =>
            item.taskId === result.task_id
              ? { ...item, status: 'completed', videoUrl: videoUrl || item.videoUrl }
              : item
          ));
        },
        (error) => {
          setVideoItems(prev => prev.map(item =>
            item.taskId === result.task_id
              ? { ...item, status: 'failed', error: typeof error === 'string' ? error : error.message }
              : item
          ));
        }
      );

      setShowVideoEditDialog(false);
      setEditingVideoId(null);
    } catch (error) {
      console.error('Video edit error:', error);
      alert(lang === 'zh' ? '????????:' + String(error) : 'Video regeneration failed: ' + String(error));
    } finally {
      setIsLoading(false);
    }
  }, [editingVideoId, videoItems, items, selectedIds, lang]);

  const handleVideoWindowDragStart = useCallback((videoId: string, e: React.MouseEvent) => {
    const videoItem = videoItems.find(item => item.id === videoId);
    if (!videoItem) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const origX = videoItem.x;
    const origY = videoItem.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      setVideoItems(prev => prev.map(item =>
        item.id === videoId
          ? { ...item, x: origX + deltaX, y: origY + deltaY }
          : item
      ));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [videoItems]);

  const handleSidebarImport = (type: 'ref' | 'frame') => {
    importTypeRef.current = type;
    importInputRef.current?.click();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const type = importTypeRef.current;
    
    // 参考主体最多1张，分镜最多6张
    const maxFiles = type === 'ref' ? 1 : 6;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_CONCURRENT = 3; // 最多并发3个

    const filesToProcess = Array.from(files).slice(0, maxFiles);

    // 文件验证
    const validFiles = filesToProcess.filter((file: File) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`文件 "${file.name}" 超过 5MB 限制，已跳过`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // 如果是参考主体，先删除旧的
    if (type === 'ref') {
      setItems(prev => prev.filter(it => !it.isMain));
    }

    let processedCount = 0;
    let currentIndex = 0;
    const newItems: StoryboardItem[] = [];

    // 处理：最多并发3个
    const processNextFile = () => {
      if (currentIndex >= validFiles.length) {
        // 所有文件处理完成
        if (processedCount === validFiles.length) {
          setItems(prev => {
            if (type === 'ref') {
              return [...prev.filter(it => !it.isMain), ...newItems];
            } else {
              return [...prev, ...newItems];
            }
          });
        }
        return;
      }

      const file = validFiles[currentIndex] as File;
      const fileIndex = currentIndex;
      currentIndex++;

      const reader = new FileReader();
      reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
        const dataUrl = readerEvent.target?.result as string;
        const currentOrder = items.length + newItems.length;
        
        // 获取图片原始尺寸以保持原比例
        const img = new Image();
        img.onload = () => {
          const originalRatio = img.naturalHeight / img.naturalWidth;
          
          // 根据类型设置基础宽度
          const baseWidth = type === 'ref' ? 214 : 380;
          const calculatedHeight = baseWidth * originalRatio;
          
          const newItem: StoryboardItem = {
            id: crypto.randomUUID(),
            imageUrl: dataUrl,
            prompt: "",
            description: "",
            x: (fileIndex % 4) * 440 + 100 - canvasOffset.x,
            y: Math.floor(fileIndex / 4) * 280 + 100 - canvasOffset.y,
            width: baseWidth,
            height: calculatedHeight,
            isMain: type === 'ref',
            filter: FilterMode.NORMAL,
            order: currentOrder,
            symbols: [],
            videoPrompt: ""
          };
          
          newItems.push(newItem);
          processedCount++;

          // 继续处理下一个
          processNextFile();
        };
        img.src = dataUrl;
      };

      reader.onerror = () => {
        console.error(`文件读取失败`);
        processedCount++;
        processNextFile();
      };

      reader.readAsDataURL(file);
    };

    // 启动处理(最多3个)
    for (let i = 0; i < Math.min(MAX_CONCURRENT, validFiles.length); i++) {
      processNextFile();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if (activeTool === ToolType.HAND) {
      setIsPanning(true);
    } else if (activeTool === ToolType.SELECT) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left - canvasOffset.x) / (zoom / 100);
      const y = (e.clientY - rect.top - canvasOffset.y) / (zoom / 100);
      selectionStart.current = { x, y };
      setSelectionRect({ x, y, w: 0, h: 0 });
      if (!e.shiftKey) setSelectedIds(new Set());
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (activeTool === ToolType.HAND && isPanning) {
      setCanvasOffset(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
    } else if (dragState) {
      const dx = (e.clientX - dragState.startX) / (zoom / 100);
      const dy = (e.clientY - dragState.startY) / (zoom / 100);
      setItems(prev => prev.map(it => it.id === dragState.id ? { ...it, x: dragState.origX + dx, y: dragState.origY + dy } : it));
    } else if (selectionStart.current) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const curX = (e.clientX - rect.left - canvasOffset.x) / (zoom / 100);
      const curY = (e.clientY - rect.top - canvasOffset.y) / (zoom / 100);
      const x = Math.min(selectionStart.current.x, curX);
      const y = Math.min(selectionStart.current.y, curY);
      const w = Math.abs(curX - selectionStart.current.x);
      const h = Math.abs(curY - selectionStart.current.y);
      setSelectionRect({ x, y, w, h });
      
      const newSelected = new Set(selectedIds);
      items.forEach(it => {
        const inRect = it.x < x + w && it.x + it.width > x && it.y < y + h && it.y + it.height > y;
        if (inRect) newSelected.add(it.id);
        else if (!e.shiftKey) newSelected.delete(it.id);
      });
      setSelectedIds(newSelected);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDragState(null);
    setSelectionRect(null);
    selectionStart.current = null;
  };

  if (!hasKey) return <KeySelection lang={lang} theme={theme} onSuccess={() => setHasKey(true)} onLangChange={handleLangChange} onThemeChange={handleThemeChange} />;

  return (
    <div className={`flex h-screen w-screen transition-all duration-500 overflow-hidden select-none ${theme === 'dark' ? 'bg-[#050506] text-zinc-300' : 'bg-[#f5f5f7] text-zinc-700'}`} onWheel={(e) => {
      if (e.ctrlKey) { 
        e.preventDefault(); 
        // Check if hovering over reference image
        const refItem = items.find(it => it.isMain);
        if (refItem) {
          const canvasRect = canvasRef.current?.getBoundingClientRect();
          if (canvasRect) {
            const mouseX = e.clientX - canvasRect.left;
            const mouseY = e.clientY - canvasRect.top;
            const itemLeft = (refItem.x + canvasOffset.x) * (zoom / 100);
            const itemTop = (refItem.y + canvasOffset.y) * (zoom / 100);
            const itemRight = itemLeft + refItem.width * (zoom / 100);
            const itemBottom = itemTop + refItem.height * (zoom / 100);
            
            // If hovering over reference image, scale it instead of canvas
            if (mouseX >= itemLeft && mouseX <= itemRight && mouseY >= itemTop && mouseY <= itemBottom) {
              const currentScale = refItem.scale || 1;
              const newScale = Math.min(3, Math.max(0.5, currentScale + (e.deltaY > 0 ? -0.1 : 0.1)));
              setItems(prev => prev.map(it => it.id === refItem.id ? { ...it, scale: newScale } : it));
              return;
            }
          }
        }
        // Otherwise zoom canvas
        setZoom(prev => Math.min(300, Math.max(10, prev + (e.deltaY > 0 ? -5 : 5))));
      }
    }}>
      <input type="file" ref={importInputRef} onChange={handleFileImport} className="hidden" accept="image/*" multiple />
      
      <div className="fixed top-0 left-0 right-0 h-20 px-8 flex items-center justify-between z-50 no-print pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="w-14 h-14 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-white font-black text-3xl">L</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{lang === 'zh' ? '分镜大师' : 'Storyboard Master'}</span>
            <span className="text-xs font-bold text-purple-500 uppercase tracking-widest">{lang === 'zh' ? 'AI 智能分镜创作平台' : 'AI-Powered Storyboarding'}</span>
          </div>
        </div>
        
      </div>

      <SidebarLeft theme={theme} lang={lang} activeTool={activeTool} setActiveTool={setActiveTool} onSettings={() => setShowSettings(true)} onImport={handleSidebarImport} zoom={zoom} onZoomChange={setZoom} onThemeChange={handleThemeChange} onLangChange={handleLangChange} colorMode={globalColorMode} onColorModeChange={setGlobalColorMode} />

      <div ref={canvasRef} className={`flex-1 relative overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'canvas-bg-dark' : 'canvas-bg-light'} ${activeTool === ToolType.HAND ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'}`}
        onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        <div className="relative w-full h-full transition-transform duration-75" style={{ transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom/100})`, transformOrigin: '0 0' }}>
          {items.map(item => {
            const itemNotifications = canvasNotifications.filter(n => n.itemId === item.id);
            return (
              <div key={item.id} style={{ position: 'relative' }}>
                <StoryboardCard item={item} lang={lang} theme={theme} isSelected={selectedIds.has(item.id)}
                  selectedCount={selectedIds.size}
                  onSelect={(id, shift) => { if (activeTool === ToolType.SELECT) setSelectedIds(prev => { const n = new Set(prev); if (shift) { if (n.has(id)) { n.delete(id); setSelectionOrder(prev => prev.filter(x => x !== id)); } else { n.add(id); setSelectionOrder(prev => [...prev, id]); } } else { n.clear(); n.add(id); setSelectionOrder([id]); } return n; }); }}
                  onDragStart={(e, id) => { if (activeTool === ToolType.SELECT) { const it = items.find(x => x.id === id); if (it) setDragState({ id, startX: e.clientX, startY: e.clientY, origX: it.x, origY: it.y }); } }}
                  onAction={handleAction} onDropSymbol={handleDropSymbol}
                  onShowBatchRedrawDialog={() => setShowBatchRedrawDialog(true)}
                  onExportJPEG={handleExportJPEG}
                  onGenerateVideo={() => handleGenerateVideoFromContextMenu(item.id)}
                  onQuickAction={handleQuickAction}
                  selectedIds={selectedIds} />
                {/* Canvas notifications for this item */}
                {itemNotifications.map(notif => (
                  <div
                    key={notif.id}
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: notif.type === 'success' ? '#4CAF50' : notif.type === 'error' ? '#f44336' : '#2196F3',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      zIndex: 50,
                      animation: 'fadeInOut 3s ease-in-out'
                    }}
                  >
                    {notif.message}
                  </div>
                ))}
              </div>
            );
          })}
          {selectionRect && (
            <div className="absolute border-2 border-purple-500 bg-purple-500/10 pointer-events-none z-[60]"
              style={{ left: selectionRect.x, top: selectionRect.y, width: selectionRect.w, height: selectionRect.h }} />
          )}
        </div>
      </div>

      <SidebarRight 
        lang={lang} theme={theme} isLoading={isLoading} isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded}
        onGenerateFromScript={handleGenerateFromScript} onExportPrompts={handleExportPrompts} onExportJPEG={handleExportJPEG} 
        getFormattedPrompts={getOptimizedPrompts} model={model} setModel={setModel} onGenerateFromDialogue={handleGenerateFromDialogue} onGenerateScriptPreview={handleGenerateStoryboardPreview} globalColorMode={globalColorMode} 
        onOpenHelp={() => setShowHelpModal(true)} 
        onStyleChange={setVideoEditStyle}
        onAspectRatioChange={setCurrentAspectRatio}
        onGenerateVideo={() => setShowVideoGenDialog(true)}
        onOpenManualSceneDialog={() => setShowManualSceneDialog(true)}
        selectedCount={selectedIds.size}
        currentSymbols={getAllSelectedSymbols()}
        symbolDescriptions={SYMBOL_DESCRIPTIONS} />

      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
           <div className={`max-w-2xl w-full rounded-3xl p-1 shadow-2xl overflow-hidden border ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-zinc-200'}`}>
              <div className="p-8"><KeySelection lang={lang} theme={theme} onSuccess={() => setShowSettings(false)} onLangChange={handleLangChange} onThemeChange={handleThemeChange} /></div>
           </div>
        </div>
      )}

      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        lang={lang}
        theme={theme}
        helpSections={helpSections}
      />

      {/* Batch Automation Panel */}
      {showBatchAutomation && (
        <BatchAutomationPanel
          lang={lang}
          theme={theme}
          onClose={handleCloseBatchAutomation}
          onStartProcessing={handleStartBatchProcessing}
        />
      )}

      {/* Batch Completion Dialog */}
      {showBatchCompletionDialog && (
        <BatchCompletionDialog
          lang={lang}
          theme={theme}
          scripts={batchScripts}
          onClose={() => setShowBatchCompletionDialog(false)}
        />
      )}

      {/* Clone prompt review dialog */}
      {showClonePromptReview && cloneWorkflowState && cloneWorkflowState.generatedPrompt && (
        <PromptReviewDialog
          theme={theme}
          lang={lang}
          prompt={cloneWorkflowState.generatedPrompt}
          imagePreview={cloneWorkflowState.screenshotPreview || ''}
          onConfirm={async (approvedPrompt) => {
            // Generate image from approved prompt
            setIsLoading(true);
            try {
              const isBlackAndWhite = globalColorMode === 'blackAndWhite';
              const newImageUrl = await generateSceneImage(approvedPrompt, true, isBlackAndWhite);
              
              if (newImageUrl && cloneTargetItemId) {
                // Add new cloned item
                const targetItem = items.find(it => it.id === cloneTargetItemId);
                if (targetItem) {
                  const newItem: StoryboardItem = {
                    id: crypto.randomUUID(),
                    imageUrl: newImageUrl,
                    prompt: approvedPrompt,
                    description: '',
                    x: targetItem.x + 60,
                    y: targetItem.y + 60,
                    width: targetItem.width,
                    height: targetItem.height,
                    isMain: false,
                    filter: FilterMode.LINE_ART,
                    order: items.length,
                    symbols: [],
                    colorMode: isBlackAndWhite ? 'blackAndWhite' : 'color',
                    aspectRatio: targetItem.aspectRatio
                  };
                  setItems(prev => [...prev, newItem]);
                }
              }
            } catch (error) {
              console.error('Failed to generate cloned image:', error);
              alert(lang === 'zh' ? '生成克隆图片失败' : 'Failed to generate cloned image');
            } finally {
              setIsLoading(false);
              setShowClonePromptReview(false);
              setCloneWorkflowState(null);
              setCloneTargetItemId(null);
            }
          }}
          onCancel={() => {
            setShowClonePromptReview(false);
            setCloneWorkflowState(null);
            setCloneTargetItemId(null);
          }}
          onEdit={(editedPrompt) => {
            setCloneWorkflowState(prev => prev ? { ...prev, generatedPrompt: editedPrompt } : null);
          }}
        />
      )}

      {/* Clone prompt review dialog */}
      {showClonePromptReview && cloneWorkflowState && cloneWorkflowState.generatedPrompt && (
        <PromptReviewDialog
          theme={theme}
          lang={lang}
          prompt={cloneWorkflowState.generatedPrompt}
          imagePreview={cloneWorkflowState.screenshotPreview || ''}
          onConfirm={async (approvedPrompt) => {
            // Generate cloned image with approved prompt
            setIsLoading(true);
            try {
              const targetItem = cloneTargetItemId ? items.find(it => it.id === cloneTargetItemId) : null;
              if (!targetItem) {
                alert(lang === 'zh' ? '目标图片不存在' : 'Target image not found');
                return;
              }
              
              // Generate cloned image
              const isBlackAndWhite = targetItem.colorMode === 'blackAndWhite';
              const clonedImageUrl = await generateSceneImage(
                approvedPrompt,
                true,
                isBlackAndWhite,
                undefined,
                targetItem.aspectRatio
              );
              
              if (clonedImageUrl) {
                // Add cloned item to canvas
                const newItem: StoryboardItem = {
                  id: crypto.randomUUID(),
                  imageUrl: clonedImageUrl,
                  prompt: approvedPrompt,
                  description: '',
                  x: targetItem.x + 60,
                  y: targetItem.y + 60,
                  width: targetItem.width,
                  height: targetItem.height,
                  isMain: false,
                  filter: FilterMode.LINE_ART,
                  order: items.length,
                  symbols: [],
                  colorMode: isBlackAndWhite ? 'blackAndWhite' : 'color',
                  aspectRatio: targetItem.aspectRatio
                };
                setItems(prev => [...prev, newItem]);
                alert(lang === 'zh' ? '克隆成功！' : 'Clone successful!');
              }
            } catch (error) {
              console.error('[App] Clone generation error:', error);
              alert(lang === 'zh' ? `生成失败: ${error}` : `Generation failed: ${error}`);
            } finally {
              setIsLoading(false);
              setShowClonePromptReview(false);
              setCloneWorkflowState(null);
              setCloneTargetItemId(null);
            }
          }}
          onCancel={() => {
            setShowClonePromptReview(false);
            setCloneWorkflowState(null);
            setCloneTargetItemId(null);
          }}
          onEdit={(editedPrompt) => {
            setCloneWorkflowState(prev => prev ? { ...prev, generatedPrompt: editedPrompt } : null);
          }}
        />
      )}

      {/* Batch redraw dialog */}
      {showBatchRedrawDialog && (
        <BatchRedrawDialog
          theme={theme}
          lang={lang}
          frames={items.filter(it => !it.isMain && selectedIds.has(it.id)).sort((a, b) => {
            if (selectionOrder.length > 0) {
              const aIdx = selectionOrder.indexOf(a.id);
              const bIdx = selectionOrder.indexOf(b.id);
              return aIdx - bIdx;
            }
            if (Math.abs(a.y - b.y) > 10) return a.y - b.y;
            return a.x - b.x;
          })}
          onClose={() => setShowBatchRedrawDialog(false)}
          onSubmit={handleBatchRedraw}
        />
      )}

      {/* Video generation dialog */}
      {showVideoGenDialog && !isVideoGenDialogMinimized && (
        <VideoGenDialog
          onGenerate={handleGenerateVideo}
          onGenerateBatch={handleGenerateVideoBatch}
          onCancel={() => setShowVideoGenDialog(false)}
          initialPrompt={videoGenDialogPrompt}
          lang={lang}
          selectedFrames={items.filter(it => !it.isMain && selectedIds.has(it.id)).map(it => ({
            id: it.id,
            prompt: it.prompt,
            symbols: it.symbols,
            order: it.order
          }))}
          symbolDescriptions={SYMBOL_DESCRIPTIONS}
          optimizedPrompts={getOptimizedPrompts(lang)}
          batchProgress={batchProgress}
          isMinimized={isVideoGenDialogMinimized}
          onMinimize={() => setIsVideoGenDialogMinimized(true)}
          currentSymbols={videoGenDialogSymbols}
        />
      )}

      {/* Minimized floating window for batch progress */}
      {showVideoGenDialog && isVideoGenDialogMinimized && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            width: '100px',
            height: '100px',
            backgroundColor: batchProgress.current > 0 && batchProgress.current < batchProgress.total ? '#4CAF50' : '#999999',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1001,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s ease',
            animation: batchProgress.current > 0 && batchProgress.current < batchProgress.total ? 'pulse 1.5s infinite' : 'none'
          }}
          onClick={() => setIsVideoGenDialogMinimized(false)}
        >
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff' }}>
            {batchProgress.current}/{batchProgress.total}
          </div>
          <div style={{ fontSize: '12px', color: '#fff', marginTop: '4px' }}>
            {lang === 'zh' ? '点击展开' : 'Click to expand'}
          </div>
          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
          `}</style>
        </div>
      )}

      {/* Video edit dialog */}
      {showVideoEditDialog && editingVideoId && (
        <VideoEditDialog
          video={videoItems.find(item => item.id === editingVideoId)!}
          onEdit={handleApplyVideoEdit}
          onCancel={() => {
            setShowVideoEditDialog(false);
            setEditingVideoId(null);
          }}
          lang={lang}
          isLoading={isLoading}
          symbols={items.find(it => selectedIds.has(it.id))?.symbols || []}
          symbolDescriptions={SYMBOL_DESCRIPTIONS}
        />
      )}

      {/* Quick Storyboard Config Dialog - DISABLED: generators were removed during cleanup */}
      {/* {showQuickStoryboardConfig && quickStoryboardActionType && (
        <QuickStoryboardConfigDialog
          isOpen={showQuickStoryboardConfig}
          actionType={quickStoryboardActionType}
          lang={lang}
          theme={theme}
          onConfirm={handleQuickStoryboardConfirm}
          onCancel={() => {
            setShowQuickStoryboardConfig(false);
            setQuickStoryboardItemId(null);
            setQuickStoryboardActionType(null);
          }}
        />
      )} */}

      {/* Video windows on canvas */}
      {videoItems.map((videoItem) => (
        <React.Fragment key={videoItem.id}>
          <VideoWindow
            item={videoItem}
            onDelete={handleDeleteVideoWindow}
            onDownload={handleDownloadVideo}
            onEdit={handleEditVideo}
            onDragStart={(id, e) => handleVideoWindowDragStart(id, e)}
          />
        </React.Fragment>
      ))}

      {/* Notification Display */}
      {notification.visible && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            backgroundColor: notification.type === 'success' ? '#4CAF50' : notification.type === 'error' ? '#F44336' : '#2196F3',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
            maxWidth: '300px',
            wordBreak: 'break-word',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          {notification.message}
        </div>
      )}

      {isLoading && <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-indigo-600 animate-[loading_2s_infinite] z-[100]" />}

      {/* Storyboard Preview Dialog */}
      {showStoryboardPreviewDialog && (
        <StoryboardPreviewDialog
          frames={storyboardPreviewFrames}
          lang={lang}
          theme={theme}
          isLoading={isLoading}
          onConfirm={(editedFrames) => {
            // Save edited frames and close dialog
            setStoryboardPreviewFrames(editedFrames);
            setShowStoryboardPreviewDialog(false);
          }}
          onGenerateImages={(editedFrames) => {
            // Save edited frames first, then generate images
            setStoryboardPreviewFrames(editedFrames);
            handleGenerateFramesFromPreview();
          }}
          onCancel={() => setShowStoryboardPreviewDialog(false)}
        />
      )}

      {/* Manual Scene Input Dialog */}
      <ManualSceneInputDialog
        isOpen={showManualSceneDialog}
        onClose={() => setShowManualSceneDialog(false)}
        onConfirm={(scenes) => {
          // Save scenes to state if needed
          console.log('Scenes confirmed:', scenes);
        }}
        onGenerate={handleGenerateFromManualScenes}
        lang={lang}
        theme={theme}
        onMinimize={(isMinimized) => {
          // Handle minimize event if needed
          console.log('Dialog minimized:', isMinimized);
        }}
      />
    </div>
  );
};

export default App;







