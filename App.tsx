
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StoryboardItem, FilterMode, ToolType, Language, I18N, ModelProvider, Theme, StoryboardSymbol, ExportLayout, SYMBOL_DESCRIPTIONS, SYMBOL_LABELS, StyleOption, AspectRatio, VideoItem } from './types';
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
import AuthDialog from './components/AuthDialog';
import AdminPanel from './components/AdminPanel';
import VideoService from './videoService';

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
  const [currentStyle, setCurrentStyle] = useState<StyleOption | null>(null);
  const [currentAspectRatio, setCurrentAspectRatio] = useState<AspectRatio | null>(null);
  const [helpSections, setHelpSections] = useState<HelpSection[]>([]);
  
  // Auth state
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userBalance, setUserBalance] = useState(0);
  
  // Video generation state
  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
  const [showVideoGenDialog, setShowVideoGenDialog] = useState(false);
  const [showVideoEditDialog, setShowVideoEditDialog] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [videoGenDialogPrompt, setVideoGenDialogPrompt] = useState('');
  const videoServiceRef = useRef<VideoService | null>(null);
  
  // Selection Marquee State
  const [selectionRect, setSelectionRect] = useState<{ x: number, y: number, w: number, h: number } | null>(null);
  const selectionStart = useRef<{ x: number, y: number } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const importTypeRef = useRef<'ref' | 'frame'>('frame');
  const [dragState, setDragState] = useState<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);

  const t = I18N[lang];

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

  const handleLoginSuccess = (token: string, user: any) => {
    setAuthToken(token);
    setCurrentUser(user);
    setUserBalance(user.balance);
    localStorage.setItem('director_canvas_auth_token', token);
    setShowAuthDialog(false);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setUserBalance(0);
    localStorage.removeItem('director_canvas_auth_token');
    setShowAuthDialog(true);
  };

  const deductBalance = async (amount: number, description: string) => {
    if (!authToken) return false;
    
    try {
      const response = await fetch('/api/user/deduct', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, description })
      });

      if (response.ok) {
        const data = await response.json();
        setUserBalance(data.user.balance);
        return true;
      } else {
        const error = await response.json();
        alert(lang === 'zh' ? `余额不足: ${error.error}` : `Insufficient balance: ${error.error}`);
        return false;
      }
    } catch (error) {
      console.error('Failed to deduct balance:', error);
      return false;
    }
  };

  const checkBalance = (requiredAmount: number): boolean => {
    if (userBalance < requiredAmount) {
      alert(lang === 'zh' 
        ? `余额不足。需要 ¥${requiredAmount}，当前余额 ¥${userBalance}` 
        : `Insufficient balance. Required ¥${requiredAmount}, current balance ¥${userBalance}`);
      return false;
    }
    return true;
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
    
    // 检查用户认证状态
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('director_canvas_auth_token');
      if (savedToken) {
        setAuthToken(savedToken);
        // 验证 token 并获取用户信息
        try {
          const response = await fetch('/api/user/profile', {
            headers: { 'Authorization': `Bearer ${savedToken}` }
          });
          if (response.ok) {
            const user = await response.json();
            setCurrentUser(user);
            setUserBalance(user.balance);
          } else {
            // Token 无效，清除
            localStorage.removeItem('director_canvas_auth_token');
            setShowAuthDialog(true);
          }
        } catch (error) {
          console.error('Failed to verify auth token:', error);
          setShowAuthDialog(true);
        }
      } else {
        // 没有 token，显示登录对话框
        setShowAuthDialog(true);
      }
    };
    
    // 检测系统语言
    const systemLang = navigator.language.startsWith('zh') ? 'zh' : 'en';
    const savedLang = localStorage.getItem('director_canvas_lang') as Language | null;
    if (savedLang) {
      setLang(savedLang);
    } else {
      setLang(systemLang);
    }
    
    // 检测系统主题
    const savedTheme = localStorage.getItem('director_canvas_theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
    
    checkKey();
    checkAuth();
  }, []);

  // 加载帮助内容
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

  // Keyboard Shortcuts (Ctrl+A and Delete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 检查是否在输入框或文本区域中
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

  const handleGenerateFromScript = useCallback(async (scriptText: string, sceneCount: number, style?: any, aspectRatio?: string, duration?: number) => {
    if (!scriptText.trim()) return;
    
    // 检查余额（假设每个分镜 0.5 元）
    const costPerScene = 0.5;
    const totalCost = sceneCount * costPerScene;
    if (!checkBalance(totalCost)) return;
    
    setIsLoading(true);
    try {
      const scenes = await parseScriptToScenes(scriptText, sceneCount);
      const newItems: StoryboardItem[] = [];
      const startOrder = items.length;
      const isBlackAndWhite = globalColorMode === 'blackAndWhite';
      
      // 导入工具函数
      const { calculateHeight } = await import('./types');
      const baseWidth = 380;
      const height = calculateHeight(baseWidth, aspectRatio || '16:9');
      
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        const sceneNum = `SC-${String(i + 1).padStart(2, '0')}`;
        
        // 构建完整的提示词格式 - 简洁结构化格式（不包含全局参数和约束条件，已在开始指令中）
        let enrichedPrompt = `【${sceneNum}】
[画面描述]: ${scene.description}
[摄像机语言]: ${scene.visualPrompt}`;
        
        // ✅ BUG #1 FIX: 添加时长信息到提示词
        if (duration && duration > 0) {
          enrichedPrompt += `\n[时长]: ${duration}秒`;
        }
        
        const imageUrl = await generateSceneImage(enrichedPrompt, true, isBlackAndWhite, style, aspectRatio);
        if (imageUrl) {
          newItems.push({
            id: crypto.randomUUID(),
            imageUrl,
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
            aspectRatio
          });
        }
      }
      setItems(prev => [...prev, ...newItems]);
      
      // 扣费
      if (newItems.length > 0) {
        await deductBalance(totalCost, `生成 ${newItems.length} 个分镜`);
      }
    } catch (e) {
      console.error("Failed to generate from script", e);
    } finally {
      setIsLoading(false);
    }
  }, [items.length, canvasOffset, globalColorMode, authToken, userBalance, lang]);

  const handleGenerateFromDialogue = useCallback(async (scenes: any[], frameCount: number, styleId: string, aspectRatio?: string, duration?: number) => {
    if (!scenes || scenes.length === 0) return;
    
    // 检查余额（假设每个分镜 0.5 元）
    const costPerScene = 0.5;
    const totalCost = frameCount * costPerScene;
    if (!checkBalance(totalCost)) return;
    
    setIsLoading(true);
    try {
      const newItems: StoryboardItem[] = [];
      const startOrder = items.length;
      const isBlackAndWhite = globalColorMode === 'blackAndWhite';
      
      // 获取风格对象
      const { STYLES } = await import('./types');
      const style = STYLES.find(s => s.id === styleId);
      
      // 导入工具函数
      const { calculateHeight } = await import('./types');
      const baseWidth = 380;
      const height = calculateHeight(baseWidth, aspectRatio || '16:9');
      
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        const sceneNum = `SC-${String(i + 1).padStart(2, '0')}`;
        
        // 构建完整的提示词格式（不包含全局参数，已在开始指令中）
        let enrichedPrompt = `【${sceneNum}】
[画面描述]: ${scene.description}
[摄像机语言]: ${scene.visualPrompt}`;
        
        // ✅ BUG #3 FIX: 添加时长信息到提示词
        if (duration && duration > 0) {
          enrichedPrompt += `\n[时长]: ${duration}秒`;
        }
        
        const imageUrl = await generateSceneImage(enrichedPrompt, true, isBlackAndWhite, style, aspectRatio);
        if (imageUrl) {
          newItems.push({
            id: crypto.randomUUID(),
            imageUrl,
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
            aspectRatio
          });
        }
      }
      setItems(prev => [...prev, ...newItems]);
      
      // 扣费
      if (newItems.length > 0) {
        await deductBalance(totalCost, `生成 ${newItems.length} 个分镜`);
      }
    } catch (e) {
      console.error("Failed to generate from dialogue", e);
    } finally {
      setIsLoading(false);
    }
  }, [items.length, canvasOffset, globalColorMode, authToken, userBalance, lang]);

  const handleAction = useCallback(async (id: string, action: string, data?: any) => {
    if (action === 'delete') {
      setItems(prev => prev.filter(it => it.id !== id));
      setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    } else if (action === 'replace' && typeof data === 'string') {
      setItems(prev => prev.map(it => it.id === id ? { ...it, imageUrl: data } : it));
    } else if (action === 'resize' && data) {
      setItems(prev => prev.map(it => it.id === id ? { ...it, width: data.width, height: data.height } : it));
    } else if (action === 'regenerate') {
      // 检查余额（重新生成一个分镜 0.5 元）
      if (!checkBalance(0.5)) return;
      
      const target = items.find(it => it.id === id);
      if (!target) return;
      setIsLoading(true);
      // 如果传入了自定义提示词，使用它；否则使用原始提示词加符号
      const promptToUse = typeof data === 'string' ? data : target.prompt;
      const symbolInstructions = target.symbols.map(s => SYMBOL_DESCRIPTIONS[lang][s.name]).join(', ');
      const enrichedPrompt = symbolInstructions ? `${promptToUse}. Key actions: ${symbolInstructions}` : promptToUse;
      const isBlackAndWhite = target.colorMode === 'blackAndWhite';
      const newUrl = await generateSceneImage(enrichedPrompt, true, isBlackAndWhite, undefined, target.aspectRatio);
      if (newUrl) {
        setItems(prev => prev.map(it => it.id === id ? { ...it, imageUrl: newUrl, filter: FilterMode.LINE_ART, prompt: promptToUse } : it));
        // 扣费
        await deductBalance(0.5, '重新生成分镜');
      }
      setIsLoading(false);
    } else if (action === 'copy') {
      const target = items.find(it => it.id === id);
      if (!target) return;
      const newItem = { ...target, id: crypto.randomUUID(), x: target.x + 40, y: target.y + 40, order: items.length };
      setItems(prev => [...prev, newItem]);
    } else if (action === 'setMain') {
      setItems(prev => prev.map(it => ({ ...it, isMain: it.id === id })));
    }
  }, [items, lang, authToken, userBalance]);

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

  // 生成优化后的三段式提示词格式（中英文分开）
  const getOptimizedPrompts = useCallback(() => {
    if (selectedIds.size === 0) return { zh: "", en: "" };
    const selectedItems = items.filter(it => selectedIds.has(it.id)).sort((a,b) => a.order - b.order);
    
    // ✅ BUG #5 FIX: 从选中的分镜中获取风格和画幅信息，而不是依赖全局状态
    // 获取第一个选中分镜的风格和画幅
    const firstItem = selectedItems[0];
    const itemStyle = firstItem?.aspectRatio ? currentStyle : null;
    const itemAspectRatio = firstItem?.aspectRatio || '16:9';
    
    // 获取风格和画幅信息
    const styleInfo = currentStyle?.nameZh || currentStyle?.name || '写实摄影';
    const styleInfoEn = currentStyle?.name || 'Realistic Photography';
    const aspectRatioInfo = itemAspectRatio || '16:9';
    
    // 生成中文版本
    const zhContent = (() => {
      let globalInstr = `【全局指令】必须按照以下规则生成视频：
1、禁止将参考图写入画面，按照参考图标注的序号生成视频
2、保持${styleInfo}风格
3、${aspectRatioInfo}画幅
【限制性指令】禁止闪烁，严禁背景形变，保持角色一致性。
单一连续电影镜头，沉浸式360度环境，无分屏，无边框，无分镜布局，无UI
【约束条件】不修改参考主体特征 | 保持视觉连续性 | 严格按编号顺序`;
      let content = `${globalInstr}\n\n`;
      
      content += selectedItems.map(it => {
        // 使用分镜的 order 属性生成编号，保持和画布上的编号一致
        const sceneNum = `SC-${String(it.order + 1).padStart(2, '0')}`;
        
        // 从 prompt 中提取实际内容（去掉开头的【SC-XX】部分）
        let promptContent = it.prompt;
        const sceneNumPattern = new RegExp('^【SC-\\d{2}】\\n');
        if (sceneNumPattern.test(promptContent)) {
          promptContent = promptContent.replace(sceneNumPattern, '');
        }
        
        let sceneContent = `【${sceneNum}】\n${promptContent}`;
        
        // 添加符号信息
        if (it.symbols && it.symbols.length > 0) {
          const symbolDescriptions = it.symbols
            .map(s => SYMBOL_DESCRIPTIONS['zh'][s.name] || s.name)
            .filter(Boolean);
          if (symbolDescriptions.length > 0) {
            sceneContent += `\n【动作与运动】${symbolDescriptions.join('，')}`;
          }
        }
        
        return sceneContent;
      }).join('\n\n');
      
      return content;
    })();
    
    // 生成英文版本
    const enContent = (() => {
      let globalInstr = `[GLOBAL] Must generate video according to the following rules:
1. Do not write reference image into the frame, generate video according to the sequence marked in the reference image
2. Maintain ${styleInfoEn} style
3. ${aspectRatioInfo} aspect ratio
[RESTRICTIVE] No flickering, no background warping, maintain character consistency.
Single continuous cinematic shot, immersive 360-degree environment, no split-screen, no borders, no storyboard layout, no UI
[CONSTRAINTS] Do not modify reference subject characteristics | Maintain visual continuity | Strictly follow sequence order`;
      let content = `${globalInstr}\n\n`;
      
      content += selectedItems.map(it => {
        // 使用分镜的 order 属性生成编号，保持和画布上的编号一致
        const sceneNum = `SC-${String(it.order + 1).padStart(2, '0')}`;
        
        // 从 prompt 中提取实际内容（去掉开头的【SC-XX】部分）
        let promptContent = it.prompt;
        const sceneNumPattern = new RegExp('^【SC-\\d{2}】\\n');
        if (sceneNumPattern.test(promptContent)) {
          promptContent = promptContent.replace(sceneNumPattern, '');
        }
        
        let sceneContent = `【${sceneNum}】\n${promptContent}`;
        
        // 添加符号信息
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
    })();
    
    return { zh: zhContent, en: enContent };
  }, [selectedIds, items, currentStyle, currentAspectRatio]);

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
      
      // 检查是否有分镜图要导出
      if (frameItems.length === 0) {
        setIsLoading(false);
        return alert(lang === 'zh' 
          ? '请选择至少一个分镜图进行导出' 
          : 'Please select at least one storyboard frame to export');
      }
      
      // ✅ 新增：验证所有分镜的比例相同
      const { parseAspectRatio } = await import('./types');
      const ratios = new Set(frameItems.map(it => it.aspectRatio || '16:9'));
      if (ratios.size > 1) {
        setIsLoading(false);
        return alert(lang === 'zh' 
          ? '导出的分镜必须是同一个比例' 
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
      
      // ✅ 新增：获取统一的比例
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
        frameH = frameW / ratio;  // ✅ 改动：动态计算
        
        // 有参考主体时，分镜最多2列
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
        frameH = frameW / ratio;  // ✅ 改动：动态计算
        
        // 无参考主体时，根据数量智能调整列数
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

      // 直接加载图片并绘制到导出 Canvas
      const loadAndDrawImage = async (url: string, x: number, y: number, w: number, h: number): Promise<boolean> => {
        return new Promise((resolve) => {
          const img = new Image();
          
          // 处理 CORS 问题：尝试多种方式加载图片
          if (!url.startsWith('data:')) {
            // 首先尝试 anonymous CORS
            img.crossOrigin = "anonymous";
          }
          
          const timeout = setTimeout(() => {
            console.warn(`Image load timeout: ${url.substring(0, 50)}`);
            resolve(false);
          }, 25000);
          
          img.onload = () => {
            clearTimeout(timeout);
            try {
              // 检查图片是否已加载
              if (img.width > 0 && img.height > 0) {
                ctx.drawImage(img, x, y, w, h);
                console.log(`✓ Image drawn successfully: ${url.substring(0, 50)}`);
                resolve(true);
              } else {
                console.warn('Image loaded but has zero dimensions');
                resolve(false);
              }
            } catch (e) {
              console.error('Failed to draw image on canvas (CORS issue):', e);
              // Canvas 被污染，但我们仍然继续（会在导出时处理）
              resolve(false);
            }
          };
          
          img.onerror = () => {
            clearTimeout(timeout);
            console.warn(`Image load failed: ${url.substring(0, 50)}`);
            // 尝试不使用 CORS 重新加载（某些 CDN 可能不支持 CORS）
            const fallbackImg = new Image();
            fallbackImg.crossOrigin = null; // 移除 CORS 属性
            
            fallbackImg.onload = () => {
              try {
                ctx.drawImage(fallbackImg, x, y, w, h);
                console.log('✓ Fallback image drawn successfully (no CORS)');
                resolve(true);
              } catch (fallbackError) {
                console.error('Fallback draw failed:', fallbackError);
                resolve(false);
              }
            };
            
            fallbackImg.onerror = () => {
              console.error('Fallback image load also failed');
              resolve(false);
            };
            
            fallbackImg.src = url;
          };
          
          img.src = url;
        });
      };

      // 改进的图片加载函数，带超时控制
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
            const refLabel = lang === 'zh' ? '参考主体' : 'Reference';
            ctx.fillText(refLabel, refX + 90, refY + 2);
          } else {
            // 绘制占位符
            ctx.fillStyle = '#cccccc';
            ctx.fillRect(refX, refY, refW, refH);
            ctx.fillStyle = '#666666';
            ctx.font = 'bold 14px Arial';
            ctx.fillText('Failed to load', refX + 10, refY + 20);
          }
        } catch (e) { 
          console.error("Reference image load fail", e);
          // 绘制占位符
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
            console.log(`✓ Frame ${i + 1} loaded successfully`);
          } else {
            // 绘制占位符 - 浅灰色背景
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(x, y, frameW, frameH);
            ctx.strokeStyle = '#0000ff';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, frameW, frameH);
            
            // 显示错误信息
            ctx.fillStyle = '#999999';
            ctx.font = 'bold 14px Arial';
            ctx.fillText('Image Failed', x + 10, y + frameH / 2 - 10);
            ctx.font = '12px Arial';
            ctx.fillText('to Load', x + 10, y + frameH / 2 + 10);
            
            // 仍然显示场景编号
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(x + 10, y + 10, 60, 28);
            ctx.fillStyle = '#ffffff';
            ctx.font = '700 14px Inter';
            ctx.fillText(`SC-${String(frameNum).padStart(2, '0')}`, x + 18, y + 30);
            
            console.warn(`⚠ Frame ${i + 1} image failed to load, showing placeholder`);
          }
        } catch (e) { 
          console.error(`✗ Frame ${i + 1} load fail:`, e);
          // 绘制占位符
          ctx.fillStyle = '#f0f0f0';
          ctx.fillRect(x, y, frameW, frameH);
          ctx.strokeStyle = '#0000ff';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, frameW, frameH);
          
          // 显示错误信息
          ctx.fillStyle = '#999999';
          ctx.font = 'bold 14px Arial';
          ctx.fillText('Error', x + 10, y + frameH / 2 - 10);
          
          // 仍然显示场景编号
          ctx.fillStyle = 'rgba(0,0,0,0.7)';
          ctx.fillRect(x + 10, y + 10, 60, 28);
          ctx.fillStyle = '#ffffff';
          ctx.font = '700 14px Inter';
          ctx.fillText(`SC-${String(frameNum).padStart(2, '0')}`, x + 18, y + 30);
        }
      }

      // 使用 canvas.toBlob 而不是 toDataURL，更高效
      // 处理 Tainted Canvas 问题：使用 try-catch 和降级方案
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
        // 如果 toBlob 失败（Tainted Canvas），尝试使用 toDataURL 降级方案
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
            ? '导出失败：Canvas 被污染，请确保所有图片都能正常加载' 
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
    setItems(prev => prev.map(it => it.id === itemId ? {
      ...it,
      symbols: [...it.symbols, { id: crypto.randomUUID(), type: 'action', name: symName, label: SYMBOL_LABELS[symName], x, y, rotation: 0 }]
    } : it));
  };

  const handleBatchRedraw = useCallback(async (instructions: Record<string, string>) => {
    if (Object.keys(instructions).length === 0) return;
    
    // 获取所有选中的分镜（按标注顺序）
    const selectedFrames = items.filter(it => !it.isMain && selectedIds.has(it.id));
    
    // 按标注顺序排序
    const orderedFrames = selectionOrder.length > 0 
      ? selectionOrder.map(id => selectedFrames.find(f => f.id === id)).filter(Boolean) as StoryboardItem[]
      : selectedFrames.sort((a, b) => {
          if (Math.abs(a.y - b.y) > 10) return a.y - b.y;
          return a.x - b.x;
        });
    
    // 限制最多 6 张
    const MAX_BATCH_SIZE = 6;
    if (orderedFrames.length > MAX_BATCH_SIZE) {
      alert(lang === 'zh' 
        ? `批量重绘最多支持 ${MAX_BATCH_SIZE} 张分镜，当前选中 ${orderedFrames.length} 张。请减少选择数量。` 
        : `Batch redraw supports maximum ${MAX_BATCH_SIZE} frames, but ${orderedFrames.length} are selected. Please reduce the selection.`);
      return;
    }
    
    setIsLoading(true);
    let successCount = 0;
    let failureCount = 0;
    
    try {
      // 顺序处理队列（一次一张，避免 API 限流）
      for (let i = 0; i < orderedFrames.length; i++) {
        const frame = orderedFrames[i];
        const sceneNum = `SC-${String(i + 1).padStart(2, '0')}`;
        const instruction = instructions[sceneNum] || '';
        
        // 组合提示词：原始提示词 + 用户指令 + 符号信息
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
        
        // 生成新图片
        const isBlackAndWhite = frame.colorMode === 'blackAndWhite';
        try {
          console.log(`[${sceneNum}] 开始生成... (${i + 1}/${orderedFrames.length})`);
          const newUrl = await generateSceneImage(finalPrompt, true, isBlackAndWhite, undefined, frame.aspectRatio);
          if (newUrl) {
            setItems(prev => prev.map(it => it.id === frame.id ? { ...it, imageUrl: newUrl, filter: FilterMode.LINE_ART, prompt: finalPrompt } : it));
            successCount++;
            console.log(`[${sceneNum}] ✓ 生成成功`);
          } else {
            failureCount++;
            console.warn(`[${sceneNum}] ✗ 生成失败：返回空 URL`);
          }
        } catch (frameError) {
          failureCount++;
          console.error(`[${sceneNum}] ✗ 生成错误:`, frameError);
        }
        
        // 每张之间添加 500ms 延迟，进一步避免 API 限流
        if (i < orderedFrames.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      // 显示结果提示
      if (failureCount > 0) {
        alert(lang === 'zh' 
          ? `批量重绘完成：成功 ${successCount} 张，失败 ${failureCount} 张` 
          : `Batch redraw completed: ${successCount} succeeded, ${failureCount} failed`);
      } else if (successCount > 0) {
        alert(lang === 'zh' 
          ? `批量重绘完成：成功 ${successCount} 张` 
          : `Batch redraw completed: ${successCount} succeeded`);
      }
      
      // 关闭批量重绘对话框
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

  const handleGenerateVideo = useCallback(async (prompt: string, options: any) => {
    if (!videoServiceRef.current) {
      // Initialize VideoService with config from localStorage
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
      
      // Get selected storyboard images
      const selectedFrames = items.filter(it => !it.isMain && selectedIds.has(it.id));
      const images = selectedFrames.map(it => it.imageUrl);

      // Create video
      const result = await videoServiceRef.current.createVideo(prompt, {
        model: options.model,
        aspect_ratio: options.aspect_ratio,
        duration: options.duration,
        hd: options.hd,
        images: images.length > 0 ? images : undefined
      });

      // Add video item to canvas
      const newVideoItem: VideoItem = {
        id: crypto.randomUUID(),
        taskId: result.task_id,
        prompt,
        status: 'loading',
        progress: result.progress,
        x: 100,
        y: 100,
        width: 400,
        height: 300,
        createdAt: Date.now()
      };

      setVideoItems(prev => [...prev, newVideoItem]);

      // Start polling for video status
      videoServiceRef.current.startPolling(
        result.task_id,
        (status) => {
          setVideoItems(prev => prev.map(item =>
            item.taskId === result.task_id
              ? {
                  ...item,
                  progress: status.progress,
                  status: status.status === 'SUCCESS' ? 'completed' : status.status === 'FAILURE' ? 'failed' : 'loading',
                  videoUrl: status.video_url || item.videoUrl, // 保留之前的 URL，如果新的为空
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
      alert(lang === 'zh' ? '视频生成失败：' + String(error) : 'Video generation failed: ' + String(error));
    } finally {
      setIsLoading(false);
    }
  }, [items, selectedIds, lang]);

  // Handle single storyboard item video generation
  const handleGenerateVideoFromContextMenu = useCallback((itemId: string) => {
    const item = items.find(it => it.id === itemId);
    if (!item) return;
    
    // Set this item as selected and open video dialog with its prompt
    setSelectedIds(new Set([itemId]));
    setVideoGenDialogPrompt(item.prompt);
    setShowVideoGenDialog(true);
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
      const images = selectedFrames.map(it => it.imageUrl);

      // Create new video with edited prompt
      const result = await videoServiceRef.current.createVideo(newPrompt, {
        model: 'sora-2-pro',
        aspect_ratio: '16:9',
        duration: 10,
        hd: false,
        images: images.length > 0 ? images : undefined
      });

      // Update video item with new task
      setVideoItems(prev => prev.map(item =>
        item.id === editingVideoId
          ? {
              ...item,
              taskId: result.task_id,
              prompt: newPrompt,
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
      alert(lang === 'zh' ? '视频重新生成失败：' + String(error) : 'Video regeneration failed: ' + String(error));
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
    
    // 参考主体只能上传1张，分镜最多6张
    const maxFiles = type === 'ref' ? 1 : 6;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_CONCURRENT = 3; // 最多同时处理3个文件

    const filesToProcess = Array.from(files).slice(0, maxFiles);

    // 验证文件大小
    const validFiles = filesToProcess.filter((file: File) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`文件 "${file.name}" 超过 5MB 限制，已跳过`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // 如果是参考主体，先清除现有的参考主体
    if (type === 'ref') {
      setItems(prev => prev.filter(it => !it.isMain));
    }

    let processedCount = 0;
    let currentIndex = 0;
    const newItems: StoryboardItem[] = [];

    // 并发控制：一次最多处理3个文件
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
        
        const newItem: StoryboardItem = {
          id: crypto.randomUUID(),
          imageUrl: dataUrl,
          prompt: type === 'ref' ? "Reference Subject" : "Manual Frame",
          description: "",
          x: (fileIndex % 4) * 440 + 100 - canvasOffset.x,
          y: Math.floor(fileIndex / 4) * 280 + 100 - canvasOffset.y,
          width: type === 'ref' ? 214 : 380,
          height: type === 'ref' ? 380 : 214,
          isMain: type === 'ref',
          filter: FilterMode.NORMAL,
          order: currentOrder,
          symbols: []
        };
        
        newItems.push(newItem);
        processedCount++;

        // 处理下一个文件
        processNextFile();
      };

      reader.onerror = () => {
        console.error(`文件读取失败`);
        processedCount++;
        processNextFile();
      };

      reader.readAsDataURL(file);
    };

    // 启动并发处理（最多3个）
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
            <span className="text-xs font-bold text-purple-500 uppercase tracking-widest">{lang === 'zh' ? 'Storyboard Master' : '分镜大师'}</span>
          </div>
        </div>
        
        {/* User Info and Balance Display */}
        <div className="flex items-center gap-4 pointer-events-auto">
          {currentUser && (
            <div className={`flex items-center gap-3 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
              <div className="flex flex-col items-end">
                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                  {currentUser.username}
                </span>
                <span className="text-xs text-purple-500 font-bold">
                  ¥{userBalance.toFixed(2)}
                </span>
              </div>
            </div>
          )}
          
          {currentUser && (
            <>
              <button
                onClick={() => setShowAdminPanel(true)}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                  theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {lang === 'zh' ? '管理' : 'Admin'}
              </button>
              <button
                onClick={handleLogout}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                  theme === 'dark'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {lang === 'zh' ? '登出' : 'Logout'}
              </button>
            </>
          )}
        </div>
      </div>

      <SidebarLeft theme={theme} lang={lang} activeTool={activeTool} setActiveTool={setActiveTool} onSettings={() => setShowSettings(true)} onImport={handleSidebarImport} zoom={zoom} onZoomChange={setZoom} onThemeChange={handleThemeChange} onLangChange={handleLangChange} colorMode={globalColorMode} onColorModeChange={setGlobalColorMode} />

      <div ref={canvasRef} className={`flex-1 relative overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'canvas-bg-dark' : 'canvas-bg-light'} ${activeTool === ToolType.HAND ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'}`}
        onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        <div className="relative w-full h-full transition-transform duration-75" style={{ transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom/100})`, transformOrigin: '0 0' }}>
          {items.map(item => (
            <StoryboardCard key={item.id} item={item} lang={lang} theme={theme} isSelected={selectedIds.has(item.id)}
              selectedCount={selectedIds.size}
              onSelect={(id, shift) => { if (activeTool === ToolType.SELECT) setSelectedIds(prev => { const n = new Set(prev); if (shift) { if (n.has(id)) { n.delete(id); setSelectionOrder(prev => prev.filter(x => x !== id)); } else { n.add(id); setSelectionOrder(prev => [...prev, id]); } } else { n.clear(); n.add(id); setSelectionOrder([id]); } return n; }); }}
              onDragStart={(e, id) => { if (activeTool === ToolType.SELECT) { const it = items.find(x => x.id === id); if (it) setDragState({ id, startX: e.clientX, startY: e.clientY, origX: it.x, origY: it.y }); } }}
              onAction={handleAction} onDropSymbol={handleDropSymbol}
              onShowBatchRedrawDialog={() => setShowBatchRedrawDialog(true)}
              onExportJPEG={handleExportJPEG}
              onGenerateVideo={() => handleGenerateVideoFromContextMenu(item.id)}
              selectedIds={selectedIds} />
          ))}
          {selectionRect && (
            <div className="absolute border-2 border-purple-500 bg-purple-500/10 pointer-events-none z-[60]"
              style={{ left: selectionRect.x, top: selectionRect.y, width: selectionRect.w, height: selectionRect.h }} />
          )}
        </div>
      </div>

      <SidebarRight 
        lang={lang} theme={theme} isLoading={isLoading} isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded}
        onGenerateFromScript={handleGenerateFromScript} onExportPrompts={handleExportPrompts} onExportJPEG={handleExportJPEG} 
        getFormattedPrompts={getOptimizedPrompts} model={model} setModel={setModel} onGenerateFromDialogue={handleGenerateFromDialogue} globalColorMode={globalColorMode} 
        onOpenHelp={() => setShowHelpModal(true)} 
        onStyleChange={setCurrentStyle}
        onAspectRatioChange={setCurrentAspectRatio}
        onGenerateVideo={() => setShowVideoGenDialog(true)}
        selectedCount={selectedIds.size} />

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
      {showVideoGenDialog && (
        <VideoGenDialog
          onGenerate={handleGenerateVideo}
          onCancel={() => setShowVideoGenDialog(false)}
          initialPrompt={videoGenDialogPrompt}
          lang={lang}
          selectedFrames={items.filter(it => !it.isMain && selectedIds.has(it.id)).map(it => ({
            id: it.id,
            prompt: it.prompt,
            symbols: it.symbols
          }))}
          symbolDescriptions={SYMBOL_DESCRIPTIONS}
        />
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
        />
      )}

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

      {isLoading && <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-indigo-600 animate-[loading_2s_infinite] z-[100]" />}
      
      {/* Auth Dialog */}
      {showAuthDialog && (
        <AuthDialog
          onClose={() => setShowAuthDialog(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      
      {/* Admin Panel */}
      {showAdminPanel && (
        <AdminPanel
          onClose={() => setShowAdminPanel(false)}
        />
      )}
    </div>
  );
};

export default App;

