
import { GoogleGenAI, Type } from "@google/genai";
import { ScriptScene, ProviderConfig } from "./types";
import ZhipuService from "./zhipuService";

// ✅ 确保请求头只包含 ASCII 字符的辅助函数
const buildSafeHeaders = (headers: Record<string, string>): Record<string, string> => {
  const safeHeaders: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    // 验证 key 和 value 都只包含 ASCII 字符
    if (!/^[\x00-\x7F]*$/.test(key) || !/^[\x00-\x7F]*$/.test(value)) {
      console.warn(`[buildSafeHeaders] Header contains non-ASCII characters: ${key}`);
    }
    safeHeaders[key] = value;
  }
  return safeHeaders;
};

// ✅ 检测占位符的函数
const isPlaceholder = (text: string): boolean => {
  if (!text) return true;
  // 检测 ### 画面X、### Scene X 等占位符
  return /^#+\s*(画面|Scene|scene)\s*\d+\s*$/.test(text.trim());
};

// ✅ 步骤1：生成视频提示词 - 基于画面提示词和用户设置
export const generateVideoPromptFromVisual = async (
  visualPrompt: string,
  sceneDescription: string,
  style: string,
  frameCount: number,
  sceneIndex: number,
  language: 'zh' | 'en' = 'en'
): Promise<string> => {
  const config = getAppConfig();
  const apiKey = config?.apiKey || process.env.API_KEY;
  
  if (!apiKey) {
    console.error('[generateVideoPromptFromVisual] No API key available');
    return '';
  }

  const avgCharsPerScene = Math.floor(500 / frameCount);
  
  const systemPrompt = language === 'zh'
    ? `**文 你是视频导演。你的任务是根据给定的【场景说明】和【画面描述】生成视频提示词。
    
【重要规则】：
1. 必须严格遵循【场景说明】中描述的故事内容
2. 必须严格遵循【画面描述】中的视觉元素
3. 不要改变场景的内容、顺序或含义
4. 不要添加原文中没有的元素
5. 只添加动作、表情、光线、摄像机运动等动态描述

【核心要素（必须包含）】：
- 角色姿态和肢体语言（基于画面描述）
- 角色表情和眼神（基于画面描述）
- 环境光线变化（基于画面描述）
- 摄像机运动（根据故事情节设计）

【补充要素（AI根据故事自动补充）】：
- 根据故事情节设计符合的各类动作
- 环境中的动态变化
- 物体和场景的运动
- 场景过渡方式

【禁止性指令】：
1. 禁止包含任何标签或前缀，如"Video prompts:"、"视频提示词："等
2. 禁止包含任何指令性文本，如"Continue from"、"Show the"、"Maintain"等
3. 禁止包含AI的思考、分析或解释内容
4. 禁止包含中英混杂的内容，所有内容必须是中文

【要求】：
- 不超过${avgCharsPerScene}字
- 与前后场景自然衔接
- 返回ONLY视频提示词，不要其他文本
- 严格遵循原始场景描述，不要创意改编
- 直接返回纯粹的场景描述，不要任何前缀或标签`
    : `**文 You are a video director. Your task is to generate a video prompt based on the given 【Description】 and 【Visual】.

【Important Rules】:
1. Strictly follow the story content in 【Description】
2. Strictly follow the visual elements in 【Visual】
3. Do not change the content, order, or meaning of the scene
4. Do not add elements not in the original text
5. Only add dynamic descriptions like actions, expressions, lighting, camera movements

【Core Elements (must include)】:
- Character posture and body language (based on visual)
- Character expressions and eye contact (based on visual)
- Environmental lighting changes (based on visual)
- Camera movements (designed based on story)

【Supplementary Elements (AI adds based on story)】:
- Actions designed to fit the narrative
- Environmental dynamics
- Object and scene movements
- Scene transitions

【Prohibited Instructions】:
1. Do NOT include any labels or prefixes, such as "Video prompts:", "Video prompt:" etc.
2. Do NOT include any instructional text, such as "Continue from", "Show the", "Maintain", etc.
3. Do NOT include AI's thinking, analysis, or explanatory content
4. Do NOT mix Chinese and English content, all content must be in English

【Requirements】:
- Max ${avgCharsPerScene} characters
- Connect smoothly with adjacent scenes
- Return ONLY the video prompt, no other text
- Strictly follow the original scene description, no creative modifications
- Return pure scene description directly, no prefixes or labels`;

  const userPrompt = language === 'zh'
    ? `场景${sceneIndex}/${frameCount}
风格：${style}
画面描述：${visualPrompt}
场景说明：${sceneDescription}

生成视频提示词：`
    : `Scene ${sceneIndex}/${frameCount}
Style: ${style}
Visual: ${visualPrompt}
Description: ${sceneDescription}

Generate video prompt:`;

  try {
    if (config && config.provider !== 'gemini' && config.apiKey) {
      console.log('[generateVideoPromptFromVisual] Using OpenAI-compatible API');
      const endpoint = config.provider === 'zhipu' 
        ? `${config.baseUrl}/chat/completions`
        : `${config.baseUrl}/v1/chat/completions`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: buildSafeHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        }),
        body: JSON.stringify({
          model: config.llmModel || 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[generateVideoPromptFromVisual] API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const result = data.choices?.[0]?.message?.content || '';
      console.log('[generateVideoPromptFromVisual] Generated video prompt:', result.substring(0, 100) + '...');
      return result;
    } else {
      console.log('[generateVideoPromptFromVisual] Using Gemini API');
      const ai = new GoogleGenAI({ apiKey: apiKey || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `${systemPrompt}\n\n${userPrompt}`
      });

      const result = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
      console.log('[generateVideoPromptFromVisual] Generated video prompt:', result.substring(0, 100) + '...');
      return result;
    }
  } catch (e) {
    console.error('[generateVideoPromptFromVisual] Error:', e);
    // 如果生成失败，返回基于画面提示词的简单备用方案
    console.warn('[generateVideoPromptFromVisual] Falling back to simple video prompt');
    const fallbackPrompt = language === 'zh'
      ? `基于画面"${visualPrompt}"，设计符合故事"${sceneDescription}"的动作、表情、光线变化和摄像机运动。`
      : `Based on visual "${visualPrompt}", design actions, expressions, lighting changes and camera movements that fit the story "${sceneDescription}".`;
    return fallbackPrompt;
  }
};

// ✅ 步骤2：翻译文本
export const translateText = async (
  text: string,
  targetLanguage: 'zh' | 'en'
): Promise<string> => {
  const config = getAppConfig();
  const apiKey = config?.apiKey || process.env.API_KEY;
  
  if (!apiKey || !text) {
    return text;
  }

  const systemPrompt = targetLanguage === 'zh'
    ? `你是翻译专家。将文本翻译成中文。只返回翻译结果，不要其他文本。`
    : `You are a translation expert. Translate the text to English. Return ONLY the translation, no other text.`;

  const userPrompt = targetLanguage === 'zh'
    ? `翻译成中文：\n${text}`
    : `Translate to English:\n${text}`;

  try {
    if (config && config.provider !== 'gemini' && config.apiKey) {
      const endpoint = config.provider === 'zhipu' 
        ? `${config.baseUrl}/chat/completions`
        : `${config.baseUrl}/v1/chat/completions`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: buildSafeHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        }),
        body: JSON.stringify({
          model: config.llmModel || 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || text;
    } else {
      const ai = new GoogleGenAI({ apiKey: apiKey || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `${systemPrompt}\n\n${userPrompt}`
      });

      return response.candidates?.[0]?.content?.parts?.[0]?.text || text;
    }
  } catch (e) {
    console.error('[translateText] Error:', e);
    return text;
  }
};

// ✅ 公共函数：调整场景数量 - 基于已有故事内容补充和丰富
const adjustSceneCount = (scenes: any[], targetCount: number): ScriptScene[] => {
  if (!Array.isArray(scenes)) {
    console.error('Invalid scenes format');
    return [];
  }

  // 首先检测并标记包含占位符的场景
  const scenesWithPlaceholders = scenes.map((scene, idx) => ({
    ...scene,
    hasPlaceholder: isPlaceholder(scene.visualPrompt)
  }));

  if (scenes.length > targetCount) {
    console.warn(`AI returned ${scenes.length} scenes but ${targetCount} were requested. Trimming to ${targetCount}.`);
    return scenes.slice(0, targetCount);
  }

  if (scenes.length < targetCount) {
    console.warn(`AI returned ${scenes.length} scenes but ${targetCount} were requested. Cannot auto-generate scenes without AI context.`);
    // Return what we have - don't auto-generate scenes with instruction text
    // The AI should be responsible for generating the correct number of scenes
    return scenesWithPlaceholders;
  }

  return scenesWithPlaceholders;
};

const getAppConfig = (): ProviderConfig | null => {
  const saved = localStorage.getItem('director_canvas_api_config');
  if (!saved) return null;
  
  const config = JSON.parse(saved);
  
  // 数据迁移：旧格式 → 新格式
  if (config.modelName && !config.llmModel) {
    config.llmModel = config.modelName;
    config.imageModel = config.modelName;
    delete config.modelName;
    localStorage.setItem('director_canvas_api_config', JSON.stringify(config));
  }
  
  return config;
};

// 通用图片分析函数 - 支持多个提供商
export const analyzeImageWithProvider = async (
  imageUrl: string,
  prompt: string,
  config?: ProviderConfig
): Promise<string> => {
  const appConfig = config || getAppConfig();
  
  if (!appConfig) {
    console.error('[analyzeImageWithProvider] No config available');
    return '';
  }

  try {
    if (appConfig.provider === 'zhipu') {
      // 使用智谱 GLM-4.6V 进行图片分析
      console.log('[analyzeImageWithProvider] Using Zhipu GLM-4.6V');
      const zhipuService = new ZhipuService(appConfig);
      return await zhipuService.analyzeImage(imageUrl, prompt, {
        temperature: 0.8,
        topP: 0.6,
        maxTokens: 1024
      });
    } else if (appConfig.provider === 'gemini') {
      // 使用 Gemini 进行图片分析
      console.log('[analyzeImageWithProvider] Using Gemini');
      const ai = new GoogleGenAI({ apiKey: appConfig.apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: imageUrl.startsWith('data:') 
                    ? imageUrl.split(',')[1]
                    : await urlToBase64(imageUrl) || ''
                }
              },
              {
                text: prompt
              }
            ]
          }
        ]
      });
      return response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else {
      // 使用 OpenAI 兼容 API
      console.log('[analyzeImageWithProvider] Using OpenAI-compatible API');
      const endpoint = appConfig.provider === 'zhipu' 
        ? `${appConfig.baseUrl}/chat/completions`
        : `${appConfig.baseUrl}/v1/chat/completions`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: buildSafeHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${appConfig.apiKey}`
        }),
        body: JSON.stringify({
          model: appConfig.llmModel || 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: { url: imageUrl }
                },
                {
                  type: 'text',
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    }
  } catch (error) {
    console.error('[analyzeImageWithProvider] Error:', error);
    return '';
  }
};

// API 连接测试函数
export const testApiConnection = async (config: ProviderConfig, type: 'llm' | 'image' = 'llm'): Promise<boolean> => {
  try {
    if (config.provider === 'gemini') {
      // 测试 Gemini API
      const ai = new GoogleGenAI({ apiKey: config.apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "test"
      });
      return !!response;
    } else if (config.provider === 'zhipu') {
      // 测试智谱 API
      console.log('[testApiConnection] Testing Zhipu API for type:', type);
      const zhipuService = new ZhipuService(config);
      
      if (type === 'image') {
        // 对于图像模型，测试图像生成而不是图像分析
        try {
          console.log('[testApiConnection] Testing Zhipu image generation...');
          const imageUrl = await zhipuService.generateImage('A simple test image', {
            size: '1024x1024',
            quality: 'standard'
          });
          console.log('[testApiConnection] ✅ Zhipu image generation test successful');
          return !!imageUrl;
        } catch (error) {
          console.error('[testApiConnection] ❌ Zhipu image generation test failed:', error);
          return false;
        }
      } else {
        // 对于文本模型，使用通用的连接测试
        return await zhipuService.testConnection();
      }
    } else {
      // 直接测试 OpenAI 兼容 API
      console.log('[testApiConnection] Testing direct API for', type, 'with provider', config.provider);
      
      const endpoint = type === 'image'
        ? `${config.baseUrl}/v1/images/generations`
        : `${config.baseUrl}/v1/chat/completions`;
      
      // 所有API都需要model参数
      const body = type === 'image'
        ? { 
            model: 'gpt-image-1',  // 默认使用 gpt-image-1
            prompt: 'test',
            response_format: 'url'
          }
        : { 
            model: config.llmModel || 'gpt-4o',
            messages: [
              { role: 'user', content: 'test' }
            ]
          };
      
      console.log('[testApiConnection] Calling endpoint:', endpoint);
      console.log('[testApiConnection] Request body:', body);
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: buildSafeHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          }),
          body: JSON.stringify(body)
        });
        
        console.log('[testApiConnection] Response status:', response.status);
        
        // 200-299: 成功
        if (response.ok) {
          const data = await response.json();
          console.log('[testApiConnection] API response success');
          return true;
        }
        
        // 401: 认证失败 - API Key 无效，但端点存在
        if (response.status === 401) {
          const errorData = await response.json().catch(() => ({}));
          console.warn('[testApiConnection] API authentication failed (401) - Invalid API Key', errorData);
          return false;
        }
        
        // 404: 端点不存在
        if (response.status === 404) {
          const errorText = await response.text();
          console.error('[testApiConnection] API endpoint not found (404):', errorText);
          return false;
        }
        
        // 其他错误
        const errorText = await response.text();
        console.error('[testApiConnection] API error:', response.status, errorText);
        return false;
      } catch (fetchError) {
        // CORS errors 或网络错误 - 这些在浏览器中是预期的
        console.warn('[testApiConnection] CORS or network error (expected for browser-based API calls):', fetchError);
        // 对于 CORS 错误，我们无法判断 API 是否真的有效，所以返回 false
        return false;
      }
    }
  } catch (e) {
    console.error("API Test Failed:", e);
    return false;
  }
};

// 将 URL 图片转换为 base64（使用 Canvas 方法绕过 CORS）
const urlToBase64 = async (url: string): Promise<string | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0);
        const base64 = canvas.toDataURL('image/png');
        resolve(base64);
      } catch (err) {
        console.error("Canvas conversion failed", err);
        resolve(null);
      }
    };
    
    img.onerror = () => {
      console.error("Image load failed for URL:", url);
      resolve(null);
    };
    
    img.src = url;
  });
};

export const generateSceneImage = async (prompt: string, _forceLineArt: boolean = true, isBlackAndWhite: boolean = false, style?: any, aspectRatio?: string, referenceImageUrl?: string): Promise<string | null> => {
  const config = getAppConfig();
  
  // 使用配置中的 API Key，如果没有则使用环境变量
  const apiKey = config?.apiKey || process.env.API_KEY;
  
  console.log('[generateSceneImage] Starting image generation');
  console.log('[generateSceneImage] Config provider:', config?.provider);
  console.log('[generateSceneImage] Has API Key:', !!apiKey);
  console.log('[generateSceneImage] Has reference image:', !!referenceImageUrl);
  console.log('[generateSceneImage] Prompt:', prompt.substring(0, 100) + '...');
  
  let stylePrefix = '';
  
  // 获取风格描述
  const styleDesc = style?.descriptionZh || style?.description || '';
  
  if (isBlackAndWhite) {
    // 黑白素描线稿模式：强制生成纯黑白素描风格
    if (styleDesc) {
      stylePrefix = `STRICT BLACK AND WHITE SKETCH ONLY. Professional pencil sketch scene in ${styleDesc} style. Pure black pencil lines on pure white background. ABSOLUTELY NO COLORS, NO SHADING, NO GREY TONES. Only thin, precise pencil strokes to define all shapes, details, and composition. High contrast, clean sketch work. Single frame scene: `;
    } else {
      stylePrefix = "STRICT BLACK AND WHITE SKETCH ONLY. Professional pencil sketch scene. Pure black pencil lines on pure white background. ABSOLUTELY NO COLORS, NO SHADING, NO GREY TONES. Only thin, precise pencil strokes to define all shapes, details, and composition. High contrast, clean sketch work. Single frame scene: ";
    }
  } else {
    // 彩色模式：生成彩色单个画面
    if (styleDesc) {
      stylePrefix = `Professional cinematic scene in ${styleDesc} style. Vibrant colors, rich color palette, detailed illustration. Professional lighting and composition. High quality digital painting. Single frame: `;
    } else {
      stylePrefix = "Professional cinematic scene with vibrant colors. Rich color palette, detailed illustration style. Professional lighting and composition. High quality digital painting. Single frame: ";
    }
  }

  try {
    // 智谱 API 图像生成
    if (config?.provider === 'zhipu') {
      console.log('[generateSceneImage] Using Zhipu CogView-3-Flash API');
      if (!apiKey) {
        console.error('[generateSceneImage] ❌ No API key provided for Zhipu');
        return null;
      }
      
      const zhipuService = new ZhipuService(config as any);
      const fullPrompt = `${stylePrefix} ${prompt}`;
      
      try {
        const imageUrl = await zhipuService.generateImage(fullPrompt, {
          size: '1024x1024',
          quality: 'standard',
          style: styleDesc || 'Realistic Photography'
        });
        
        console.log('[generateSceneImage] ✓ Zhipu image generation successful');
        
        // 将 URL 转换为 base64，避免 CORS 问题
        console.log("[generateSceneImage] Converting image URL to base64...");
        const base64 = await urlToBase64(imageUrl);
        if (base64) {
          console.log("[generateSceneImage] ✓ Image converted to base64 successfully");
          return base64;
        } else {
          console.warn("[generateSceneImage] Failed to convert to base64, returning URL as fallback");
          return imageUrl;
        }
      } catch (zhipuErr) {
        console.error('[generateSceneImage] Zhipu image generation error:', zhipuErr);
        throw zhipuErr;
      }
    } else if (config?.provider === 'gemini') {
      // Gemini API
      console.log('[generateSceneImage] Using Gemini API');
      if (!apiKey) {
        console.error('[generateSceneImage] ❌ No API key provided for Gemini');
        return null;
      }
      
      const ai = new GoogleGenAI({ apiKey: apiKey || '' });
      console.log('[generateSceneImage] Calling Gemini API...');
      
      // 构建请求内容
      const parts: any[] = [];
      
      // 如果有参考图片，添加到请求中
      if (referenceImageUrl) {
        console.log('[generateSceneImage] Adding reference image to Gemini request');
        console.log('[generateSceneImage] Reference image URL length:', referenceImageUrl.length);
        if (referenceImageUrl.startsWith('data:')) {
          // Base64 格式
          const base64Data = referenceImageUrl.split(',')[1];
          const mimeType = referenceImageUrl.split(';')[0].replace('data:', '');
          console.log('[generateSceneImage] Base64 image detected, MIME type:', mimeType);
          parts.push({
            inlineData: {
              mimeType: mimeType || 'image/png',
              data: base64Data
            }
          });
        } else if (referenceImageUrl.startsWith('http')) {
          // URL 格式
          console.log('[generateSceneImage] HTTP URL image detected:', referenceImageUrl.substring(0, 50) + '...');
          parts.push({
            fileData: {
              mimeType: 'image/png',
              fileUri: referenceImageUrl
            }
          });
        }
      }
      
      // 添加提示词
      parts.push({ text: `${stylePrefix} ${prompt}` });
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: parts
        },
        config: {
          imageConfig: { aspectRatio: aspectRatio || "16:9" }
        }
      });

      console.log('[generateSceneImage] ✓ Gemini API response received');
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          console.log('[generateSceneImage] ✓ Image data received from Gemini');
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    } else {
      // OpenAI 兼容 API（神马、智谱、OpenAI 等）
      console.log('[generateSceneImage] Using OpenAI-compatible API');
      console.log('[generateSceneImage] Base URL:', config?.baseUrl);
      console.log('[generateSceneImage] Image Model:', config?.imageModel);
      
      if (!apiKey) {
        console.error('[generateSceneImage] ❌ No API key provided');
        return null;
      }
      
      if (!config?.baseUrl) {
        console.error('[generateSceneImage] ❌ No base URL configured');
        return null;
      }
      
      // 如果有参考图片，尝试使用 image-to-image (edits) 端点
      // 如果失败，则回退到 generations 端点并在提示词中包含参考图片信息
      if (referenceImageUrl) {
        console.log('[generateSceneImage] Reference image provided, attempting image-to-image generation');
        console.log('[generateSceneImage] Reference image URL length:', referenceImageUrl.length);
        const editsEndpoint = `${config.baseUrl}/v1/images/edits`;
        
        try {
          // 将参考图片转换为 Blob 以便上传
          let imageBlob: Blob | null = null;
          
          if (referenceImageUrl.startsWith('data:')) {
            // Base64 格式 - 转换为 Blob
            console.log('[generateSceneImage] Converting base64 image to Blob...');
            const base64Data = referenceImageUrl.split(',')[1];
            const mimeType = referenceImageUrl.split(';')[0].replace('data:', '') || 'image/png';
            console.log('[generateSceneImage] Base64 MIME type:', mimeType);
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            imageBlob = new Blob([bytes], { type: mimeType });
            console.log('[generateSceneImage] ✓ Blob created, size:', imageBlob.size, 'bytes');
          } else if (referenceImageUrl.startsWith('http')) {
            // URL 格式 - 下载并转换为 Blob
            console.log('[generateSceneImage] Downloading image from URL...');
            const response = await fetch(referenceImageUrl);
            if (!response.ok) {
              throw new Error(`Failed to download image: ${response.status}`);
            }
            imageBlob = await response.blob();
            console.log('[generateSceneImage] ✓ Image downloaded, size:', imageBlob.size, 'bytes');
          } else {
            // 本地路径 - 尝试转换为 base64 再转 Blob
            console.log('[generateSceneImage] Converting local path to Blob...');
            const base64 = await urlToBase64(referenceImageUrl);
            if (base64) {
              const base64Data = base64.split(',')[1];
              const mimeType = base64.split(';')[0].replace('data:', '') || 'image/png';
              const binaryString = atob(base64Data);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              imageBlob = new Blob([bytes], { type: mimeType });
              console.log('[generateSceneImage] ✓ Blob created from local path, size:', imageBlob.size, 'bytes');
            }
          }
          
          if (imageBlob) {
            // 尝试使用 edits 端点
            try {
              const fullPrompt = `${stylePrefix} ${prompt}`;
              const formData = new FormData();
              formData.append('model', 'gpt-image-1');  // 使用 gpt-image-1 作为默认
              formData.append('prompt', fullPrompt);
              formData.append('image', imageBlob, 'reference.png');
              formData.append('aspect_ratio', aspectRatio || '16:9');
              formData.append('response_format', 'url');
              
              console.log('[generateSceneImage] Calling edits endpoint:', editsEndpoint);
              console.log('[generateSceneImage] FormData fields:');
              console.log('  - model: gpt-image-1');
              console.log('  - prompt:', fullPrompt.substring(0, 100) + '...');
              console.log('  - image blob size:', imageBlob.size, 'bytes');
              console.log('  - aspect_ratio:', aspectRatio || '16:9');
              console.log('  - response_format: url');
              
              const editResponse = await fetch(editsEndpoint, {
                method: 'POST',
                headers: buildSafeHeaders({
                  'Authorization': `Bearer ${apiKey}`
                }),
                mode: 'cors',
                credentials: 'omit',
                body: formData
              });
              
              console.log('[generateSceneImage] Edits endpoint response status:', editResponse.status);
              
              if (editResponse.ok) {
                const data = await editResponse.json();
                console.log('[generateSceneImage] ✓ Edits endpoint response received');
                const imageUrl = data.data?.[0]?.url;
                
                if (imageUrl) {
                  console.log('[generateSceneImage] Image URL received:', imageUrl.substring(0, 50) + '...');
                  
                  // 将 URL 转换为 base64，避免 CORS 问题
                  console.log("[generateSceneImage] Converting image URL to base64...");
                  const base64 = await urlToBase64(imageUrl);
                  if (base64) {
                    console.log("[generateSceneImage] ✓ Image converted to base64 successfully");
                    return base64;
                  } else {
                    console.warn("[generateSceneImage] Failed to convert to base64, returning URL as fallback");
                    return imageUrl;
                  }
                }
              } else {
                const errorText = await editResponse.text();
                console.warn(`[generateSceneImage] Edits endpoint not available (${editResponse.status}), falling back to generations endpoint`);
                console.warn('[generateSceneImage] Error response:', errorText.substring(0, 200));
              }
            } catch (editsErr) {
              console.warn('[generateSceneImage] Edits endpoint error, falling back to generations endpoint:', editsErr);
            }
          } else {
            console.warn('[generateSceneImage] Failed to convert reference image to Blob, falling back to generations endpoint');
          }
        } catch (err) {
          console.warn('[generateSceneImage] Error in image-to-image processing, falling back to generations endpoint:', err);
        }
      }
      
      // 文生图 (generations) 端点 - 默认使用 gpt-image-1，失败则自动降级到 nano-banana
      const endpoint = `${config.baseUrl}/v1/images/generations`;
      console.log('[generateSceneImage] Calling generations endpoint:', endpoint);
      
      const fullPrompt = `${stylePrefix} ${prompt}`;
      
      // 模型列表：gpt-image-1 为主，nano-banana 为备份
      const models = ['gpt-image-1', 'nano-banana'];
      let response: Response | null = null;
      let lastError: string = '';
      let usedModel: string = '';
      
      for (const model of models) {
        const requestBody = {
          model: model,
          prompt: fullPrompt,
          aspect_ratio: aspectRatio || '16:9',
          response_format: 'url'
        };
        
        console.log(`[generateSceneImage] Attempting image generation with model: ${model}`);
        
        try {
          response = await fetch(endpoint, {
            method: 'POST',
            headers: buildSafeHeaders({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            }),
            mode: 'cors',
            credentials: 'omit',
            body: JSON.stringify(requestBody)
          });
          
          console.log(`[generateSceneImage] ${model} response status: ${response.status}`);
          
          if (response.ok) {
            usedModel = model;
            console.log(`[generateSceneImage] ✓ Image generation successful with ${model}`);
            break;
          } else {
            const errorText = await response.text();
            lastError = `${model} (${response.status}): ${errorText.substring(0, 150)}`;
            console.warn(`[generateSceneImage] ${model} failed - ${lastError}`);
            
            // 如果是主模型失败，尝试备份
            if (model === 'gpt-image-1') {
              console.log('[generateSceneImage] gpt-image-1 failed, attempting fallback to nano-banana...');
            }
          }
        } catch (fetchError) {
          lastError = `${model} error: ${String(fetchError).substring(0, 100)}`;
          console.warn(`[generateSceneImage] ${model} fetch error:`, fetchError);
          
          if (model === 'gpt-image-1') {
            console.log('[generateSceneImage] gpt-image-1 error, attempting fallback to nano-banana...');
          }
        }
      }
      
      if (!response || !response.ok) {
        console.error('[generateSceneImage] ❌ Image generation failed with all models');
        console.error('[generateSceneImage] Last error:', lastError);
        console.error('[generateSceneImage] Full response:', response);
        return null;
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('[generateSceneImage] ❌ Failed to parse JSON response:', parseError);
        const text = await response.text();
        console.error('[generateSceneImage] Response text:', text);
        return null;
      }
      
      console.log('[generateSceneImage] ✓ API response received');
      console.log(`[generateSceneImage] Used model: ${usedModel}`);
      console.log('[generateSceneImage] Response data:', JSON.stringify(data, null, 2));
      const imageUrl = data.data?.[0]?.url;
      
      if (!imageUrl) {
        console.error('[generateSceneImage] ❌ No image URL in response');
        console.log('[generateSceneImage] Response data:', data);
        return null;
      }
      
      console.log('[generateSceneImage] Image URL received:', imageUrl.substring(0, 50) + '...');
      
      // 将 URL 转换为 base64，避免 CORS 问题
      console.log("[generateSceneImage] Converting image URL to base64...");
      const base64 = await urlToBase64(imageUrl);
      if (base64) {
        console.log("[generateSceneImage] ✓ Image converted to base64 successfully");
        return base64;
      } else {
        console.warn("[generateSceneImage] Failed to convert to base64, returning URL as fallback");
        return imageUrl;
      }
    }
  } catch (err) {
    console.error("[generateSceneImage] ❌ Exception during image generation:", err);
    if (err instanceof Error) {
      console.error("[generateSceneImage] Error message:", err.message);
      console.error("[generateSceneImage] Error stack:", err.stack);
    }
  }
  console.log("[generateSceneImage] ❌ Returning null - image generation failed");
  return null;
};

// Helper function to intelligently extract actual visual/video content from AI responses
// This function identifies and removes instruction text while preserving actual scene descriptions
const extractPromptContent = (text: string, type: 'visual' | 'video'): string => {
  if (!text) return '';
  
  let content = text.trim();
  
  // Split by common instruction markers to isolate the actual content
  // Look for patterns that indicate instruction text vs actual content
  
  // Pattern 1: "Continue from the previous scene: "..." followed by instructions
  // Extract only the actual scene description part
  const continuePattern = /Continue\s+from\s+the\s+previous\s+scene:\s*"([^"]*)"\s*\.\s*(.+?)(?:Show\s+the\s+natural|Maintain\s+all|Build\s+upon|Develop\s+the|$)/is;
  const continueMatch = content.match(continuePattern);
  if (continueMatch && continueMatch[1]) {
    // Found actual content in quotes after "Continue from"
    content = continueMatch[1];
  } else {
    // Pattern 2: Remove "Continue from" blocks entirely if they don't contain useful content
    content = content.replace(/Continue\s+from\s+the\s+previous\s+scene:\s*"[^"]*"\s*\.\s*/gi, '');
  }
  
  // Pattern 3: Remove instruction phrases that appear at the beginning
  const instructionStarts = [
    /^Show\s+the\s+natural\s+next\s+step\s+in\s+the\s+story\.\s*/gi,
    /^Show\s+the\s+natural\s+next\s+step[:\s]*/gi,
    /^Maintain\s+all\s+character\s+appearances[^.]*\.\s*/gi,
    /^Build\s+upon\s+the\s+established\s+narrative[^.]*\.\s*/gi,
    /^Develop\s+the\s+story\s+further[^.]*\.\s*/gi,
    /^Show\s+what\s+happens\s+next[^.]*\.\s*/gi,
    /^Scene\s+\d+:\s*Natural\s+progression[^.]*\.\s*/gi,
  ];
  
  instructionStarts.forEach(pattern => {
    content = content.replace(pattern, '');
  });
  
  // Pattern 4: Remove trailing instruction phrases
  const instructionEnds = [
    /\.\s*Show\s+the\s+natural\s+next\s+step\s+in\s+the\s+story\.\s*$/gi,
    /\.\s*Maintain\s+all\s+character\s+appearances[^.]*\.\s*$/gi,
    /\.\s*Build\s+upon\s+the\s+established\s+narrative[^.]*\.\s*$/gi,
    /\.\s*Develop\s+the\s+story\s+further[^.]*\.\s*$/gi,
  ];
  
  instructionEnds.forEach(pattern => {
    content = content.replace(pattern, '');
  });
  
  // Clean up multiple spaces and newlines
  content = content.replace(/\s+/g, ' ').trim();
  
  // Remove leading/trailing quotes and colons only if they're not part of the content
  content = content.replace(/^[\s"':]+|[\s"':]+$/g, '').trim();
  
  // If result is too short or empty, return empty string
  if (content.length < 10) {
    return '';
  }
  
  return content.trim();
};

export const parseScriptToScenes = async (scriptText: string, sceneCount: number, style?: any, aspectRatio?: string, language: 'zh' | 'en' = 'en'): Promise<ScriptScene[]> => {
  const config = getAppConfig();
  const apiKey = config?.apiKey || process.env.API_KEY;

  // 构建风格和画面比例的描述
  const styleDesc = style?.nameZh || style?.name || 'default style';
  const aspectRatioDesc = aspectRatio || '16:9';

  // Language-specific system prompts with **文 marker
  const systemPrompts = {
    zh: `**文 你是一位世界级电影导演，有着敏锐的观察视角和叙事方式。你的任务是根据用户输入的脚本，创建一个完整的故事，包含恰好${sceneCount}个场景。

【故事参考来源】
你必须ONLY参考以下内容来生成故事：
- 用户在【用户脚本内容】中明确描述的故事情节
- 用户提到的角色、地点、事件
- 用户对故事走向的描述

【创作必须满足的条件】
第一：必须恰好生成${sceneCount}个场景
第二：以世界级电影导演的手法创作${sceneCount}个场景，形成一个完整的故事
第三：必须保持故事完整性、叙事连贯性、角色一致性、视觉和风格的一致性
第四：所有场景的画面描述词相加小于800字
第五：所有场景的视频提示词字数相加小于700字
第六：要求返回JSON格式，包含：
  - index: 场景索引
  - description: 场景描述（完整的故事情节描述，不要简短）
  - visualPrompt: 画面提示词（2-3句话，详细描述视觉内容，不要包含任何指令或分析文本）
  - videoPrompt: 视频提示词（3-4句话，包括摄像机运动、人物动作等动态描述，不要包含任何指令或分析文本）

【禁止性指令】
1. 禁止改变【故事参考来源】中的故事核心情节、角色关系或故事走向
2. 禁止添加【故事参考来源】中没有提到的新角色、新地点或新元素
3. 禁止进行创意改编或二次创作，必须严格遵循【故事参考来源】中的用户描述
4. 禁止使用"分镜"、"漫画"、"多格"等关键词
5. 禁止在JSON数组外添加任何解释文字、markdown代码块或其他额外内容
6. 只返回JSON数组，不返回${sceneCount}个场景以外的内容
7. 禁止返回中英混杂的内容，所有内容必须是中文
8. 禁止在visualPrompt和videoPrompt中包含任何指令性文本，如"Continue from"、"Show the"、"Maintain"、"Build upon"等
9. 禁止在visualPrompt和videoPrompt中包含任何标签或前缀，如"Visual:"、"Video prompts:"等
10. 禁止在visualPrompt和videoPrompt中包含AI的思考、分析或解释内容
11. visualPrompt和videoPrompt必须是纯粹的场景描述，直接描述画面和动作

【创作指导】
- 视觉风格：${styleDesc}
- 画面比例：${aspectRatioDesc}

【返回格式】
只返回JSON数组，例如：[{"index":0,"description":"...","visualPrompt":"...","videoPrompt":"..."},...]`,
    en: `**文 You are a world-class film director with keen observation and narrative skills. Your task is to create a complete story with exactly ${sceneCount} scenes based on the user's script input.

【Story Reference Source】
You MUST ONLY reference the following content to generate the story:
- The story plot explicitly described by the user in 【User Script Content】
- Characters, locations, and events mentioned by the user
- The user's description of story direction and development

【Requirements for Creation】
First: Generate exactly ${sceneCount} scenes (no more, no less)
Second: Use world-class directorial techniques to create ${sceneCount} scenes that form a complete story
Third: Maintain story completeness, narrative continuity, character consistency, and visual style consistency
Fourth: Total character count of all visual prompts must be less than 800 characters
Fifth: Total character count of all video prompts must be less than 700 characters
Sixth: Return JSON format containing:
  - index: scene index
  - description: scene description (complete story plot description, not brief)
  - visualPrompt: visual prompt (2-3 sentences, detailed visual content description, NO instructions or analysis text)
  - videoPrompt: video prompt (3-4 sentences with camera movement, character actions, and dynamic descriptions, NO instructions or analysis text)

【Prohibited Instructions】
1. Do NOT change the core plot, character relationships, or story direction from 【Story Reference Source】
2. Do NOT add new characters, locations, or elements not mentioned in 【Story Reference Source】
3. Do NOT perform creative adaptations or secondary creations, must strictly follow the user's description in 【Story Reference Source】
4. Do NOT use keywords like "storyboard", "comic", "multi-panel"
5. Do NOT add any explanatory text, markdown code blocks, or additional content outside the JSON array
6. Return only JSON array with exactly ${sceneCount} scenes, no more, no less
7. Do NOT mix Chinese and English content, all content must be in English
8. Do NOT include any instructional text in visualPrompt and videoPrompt, such as "Continue from", "Show the", "Maintain", "Build upon", etc.
9. Do NOT include any labels or prefixes in visualPrompt and videoPrompt, such as "Visual:", "Video prompts:", etc.
10. Do NOT include AI's thinking, analysis, or explanatory content in visualPrompt and videoPrompt
11. visualPrompt and videoPrompt must be pure scene descriptions, directly describing visuals and actions

【Creative Guidance】
- Visual style: ${styleDesc}
- Aspect ratio: ${aspectRatioDesc}

【Return Format】
Return only JSON array, for example: [{"index":0,"description":"...","visualPrompt":"...","videoPrompt":"..."},...]`
  };

  const systemPrompt = systemPrompts[language];
  const userPrompt = language === 'zh'
    ? `【用户脚本内容】\n${scriptText}\n\n根据【用户脚本内容】创建${sceneCount}个场景。生成所有${sceneCount}个场景，包含详细的画面和视频提示词。只返回JSON数组。`
    : `【User Script Content】\n${scriptText}\n\nCreate ${sceneCount} scenes based on 【User Script Content】. Generate all ${sceneCount} scenes with detailed visual and video prompts. Return ONLY the JSON array.`;

  // If using a custom provider that is OpenAI-compatible
  if (config && config.provider !== 'gemini' && config.apiKey) {
    try {
      const endpoint = config.provider === 'zhipu' 
        ? `${config.baseUrl}/chat/completions`
        : `${config.baseUrl}/v1/chat/completions`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: buildSafeHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        }),
        body: JSON.stringify({
          model: config.llmModel || 'gpt-4o',
          messages: [
            { 
              role: 'system', 
              content: systemPrompt
            },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: "json_object" }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API Error (${response.status}): ${await response.text()}`);
      }
      
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('Empty response from API');
      }
      
      console.log('[parseScriptToScenes] Raw response:', content);
      
      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch (parseError) {
        console.error('[parseScriptToScenes] JSON parse failed, attempting text extraction:', parseError);
        // If JSON parsing fails, try to extract JSON from the text
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not extract JSON from response');
        }
      }
      
      // Handle single object response - wrap in array
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        parsed = [parsed];
      }
      
      let scenes = Array.isArray(parsed) ? parsed : (parsed.scenes || Object.values(parsed)[0]);
      
      if (!Array.isArray(scenes)) {
        console.error('[parseScriptToScenes] Invalid scenes format:', scenes);
        return [];
      }
      
      // Clean up scenes: remove question marks and uncertain language
      scenes = scenes.map((scene: any) => ({
        ...scene,
        description: (scene.description || '')
          .replace(/\?+/g, '.')  // Replace question marks with periods
          .replace(/\s+\?/g, '.')  // Replace spaces before question marks
          .replace(/might|could|perhaps|maybe|possibly|seems|appears|looks like/gi, 'is')  // Replace uncertain language
          .trim(),
        visualPrompt: extractPromptContent((scene.visualPrompt || ''), 'visual'),
        videoPrompt: extractPromptContent((scene.videoPrompt || ''), 'video')
      }));
      
      // Validate that scenes are unique
      const descriptions = scenes.map(s => s.description);
      const uniqueDescriptions = new Set(descriptions);
      if (uniqueDescriptions.size < descriptions.length) {
        console.warn('[parseScriptToScenes] Warning: Some scenes have duplicate descriptions');
      }
      
      return adjustSceneCount(scenes, sceneCount);
    } catch (e) {
      console.error("Third-party script parsing failed", e);
      return [];
    }
  }

  // Fallback or default to Gemini
  const ai = new GoogleGenAI({ apiKey: apiKey || '' });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `${systemPrompt}\n\n${userPrompt}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            index: { type: Type.INTEGER },
            description: { type: Type.STRING },
            visualPrompt: { type: Type.STRING },
            videoPrompt: { type: Type.STRING }
          },
          required: ["index", "description", "visualPrompt", "videoPrompt"]
        }
      }
    }
  });
  
  try { 
    let scenes = JSON.parse(response.text);
    
    // Clean up scenes: remove question marks but preserve other characters
    if (Array.isArray(scenes)) {
      scenes = scenes.map((scene: any) => ({
        ...scene,
        description: (scene.description || '').replace(/\?+/g, '.').trim(),
        visualPrompt: (scene.visualPrompt || '').replace(/\?+/g, '.').trim(),
        videoPrompt: (scene.videoPrompt || '').replace(/\?+/g, '.').trim()
      }));
    }
    
    return adjustSceneCount(scenes, sceneCount);
  } catch (e) { 
    console.error("Failed to parse script response:", e);
    return []; 
  }
};

// 日志存储函数
const storeLogs = (message: string) => {
  try {
    const logs = JSON.parse(localStorage.getItem('chatWithGemini_logs') || '[]');
    logs.push({
      timestamp: new Date().toISOString(),
      message: message
    });
    // 只保留最后 100 条日志
    if (logs.length > 100) {
      logs.shift();
    }
    localStorage.setItem('chatWithGemini_logs', JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to store logs:', e);
  }
};

export const chatWithGemini = async (messages: any[]) => {
  const config = getAppConfig();
  const apiKey = config?.apiKey || process.env.API_KEY;

  if (config && config.provider !== 'gemini' && config.apiKey) {
    try {
      const logMsg1 = '[chatWithGemini] Starting third-party API chat';
      console.log(logMsg1);
      storeLogs(logMsg1);
      
      const logMsg2 = `[chatWithGemini] Provider: ${config.provider}`;
      console.log(logMsg2);
      storeLogs(logMsg2);
      
      const logMsg3 = `[chatWithGemini] Base URL: ${config.baseUrl}`;
      console.log(logMsg3);
      storeLogs(logMsg3);
      
      const logMsg4 = `[chatWithGemini] Model: ${config.llmModel}`;
      console.log(logMsg4);
      storeLogs(logMsg4);
      
      const logMsg5 = `[chatWithGemini] Input messages count: ${messages.length}`;
      console.log(logMsg5);
      storeLogs(logMsg5);
      
      const formattedMessages = messages.map((m, idx) => {
        // 安全提取文本内容和图片
        let text = '';
        let images: string[] = [];
        
        if (typeof m.text === 'string') {
          text = m.text;
        } else if (m.parts && Array.isArray(m.parts) && m.parts[0]?.text) {
          text = m.parts[0].text;
        }
        
        // 提取图片
        if (m.images && Array.isArray(m.images)) {
          images = m.images;
        }
        
        console.log(`[chatWithGemini] Message ${idx}: role=${m.role}, text_length=${text.length}, images=${images.length}`);
        
        // 如果有图片，使用 content 数组格式
        if (images.length > 0) {
          const content: any[] = [
            {
              type: 'text',
              text: text
            }
          ];
          
          // 添加图片到 content 数组 - 根据提供商使用不同格式
          images.forEach((imageUrl, imgIdx) => {
            console.log(`[chatWithGemini] Adding image ${imgIdx}: ${imageUrl.substring(0, 50)}...`);
            
            if (config.provider === 'zhipu') {
              // 智谱 API 使用 image_url 格式
              content.push({
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              });
            } else {
              // 其他 API（OpenAI 兼容）使用 image_url 格式
              content.push({
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: 'auto'
                }
              });
            }
          });
          
          return {
            role: m.role === 'model' ? 'assistant' : 'user',
            content: content
          };
        }
        
        // 没有图片时使用简单文本格式
        return {
          role: m.role === 'model' ? 'assistant' : 'user',
          content: text
        };
      });

      console.log('[chatWithGemini] Formatted messages:', formattedMessages);
      
      // 构建正确的 API 端点 URL
      let apiEndpoint: string;
      if (config.provider === 'zhipu') {
        // 智谱 API: baseUrl 已经包含 /v4，直接添加 /chat/completions
        apiEndpoint = `${config.baseUrl}/chat/completions`;
      } else {
        // 其他 API（神马等）: 添加 /v1/chat/completions
        apiEndpoint = `${config.baseUrl}/v1/chat/completions`;
      }
      
      console.log('[chatWithGemini] Sending request to:', apiEndpoint);
      
      // 确定要使用的模型
      let modelToUse = config.llmModel;
      
      // 如果是智谱且有图片，使用视觉模型
      if (config.provider === 'zhipu' && formattedMessages.some(m => Array.isArray(m.content) && m.content.some(c => c.type === 'image_url'))) {
        modelToUse = 'glm-4v-flash'; // 使用智谱的视觉模型
        console.log('[chatWithGemini] Using Zhipu vision model:', modelToUse);
      }
      
      const requestBody = {
        model: modelToUse,
        messages: formattedMessages
      };
      
      console.log('[chatWithGemini] Request body model:', modelToUse);
      console.log('[chatWithGemini] Request body messages count:', formattedMessages.length);
      formattedMessages.forEach((msg, idx) => {
        if (Array.isArray(msg.content)) {
          const imageCount = msg.content.filter(c => c.type === 'image_url').length;
          const textCount = msg.content.filter(c => c.type === 'text').length;
          console.log(`[chatWithGemini] Message ${idx}: role=${msg.role}, text=${textCount}, images=${imageCount}`);
        } else {
          console.log(`[chatWithGemini] Message ${idx}: role=${msg.role}, text content`);
        }
      });
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: buildSafeHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        }),
        body: JSON.stringify(requestBody)
      });
      
      console.log('[chatWithGemini] Response status:', response.status);
      console.log('[chatWithGemini] Response headers:', {
        'content-type': response.headers.get('content-type'),
        'content-length': response.headers.get('content-length')
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[chatWithGemini] API error response:', errorText);
        throw new Error(`API error: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('[chatWithGemini] Response data:', data);
      
      const content = data.choices?.[0]?.message?.content;
      console.log('[chatWithGemini] Extracted content:', content);
      
      return content || null;
    } catch (e) {
      console.error('[chatWithGemini] Third-party chat failed:', e);
      if (e instanceof Error) {
        console.error('[chatWithGemini] Error message:', e.message);
        console.error('[chatWithGemini] Error stack:', e.stack);
      }
      return null;
    }
  }

  try {
    console.log('[chatWithGemini] Starting Gemini API chat');
    const ai = new GoogleGenAI({ apiKey: apiKey || '' });
    
    // 构建完整的对话历史，包含系统指令作为第一条消息
    const conversationHistory = [
      {
        role: 'user',
        parts: [{ text: "You are an expert AI design assistant and film director. Provide creative and concise storyboarding advice." }]
      },
      {
        role: 'model',
        parts: [{ text: "I understand. I'll provide expert storyboarding and film direction advice." }]
      },
      ...messages.map((m, idx) => {
        // 安全提取文本内容和图片
        let text = '';
        let images: string[] = [];
        
        if (typeof m.text === 'string') {
          text = m.text;
        } else if (m.parts && Array.isArray(m.parts) && m.parts[0]?.text) {
          text = m.parts[0].text;
        }
        
        // 提取图片
        if (m.images && Array.isArray(m.images)) {
          images = m.images;
        }
        
        console.log(`[chatWithGemini] Gemini message ${idx}: role=${m.role}, text_length=${text.length}, images=${images.length}`);
        
        // 构建 parts 数组
        const parts: any[] = [{ text }];
        
        // 添加图片到 parts 数组
        images.forEach((imageUrl, imgIdx) => {
          console.log(`[chatWithGemini] Adding Gemini image ${imgIdx}: ${imageUrl.substring(0, 50)}...`);
          if (imageUrl.startsWith('data:')) {
            // Base64 格式
            const base64Data = imageUrl.split(',')[1];
            const mimeType = imageUrl.split(';')[0].replace('data:', '');
            console.log(`[chatWithGemini] Image ${imgIdx} is base64, MIME type: ${mimeType}`);
            parts.push({
              inlineData: {
                mimeType: mimeType || 'image/png',
                data: base64Data
              }
            });
          } else if (imageUrl.startsWith('http')) {
            // URL 格式
            console.log(`[chatWithGemini] Image ${imgIdx} is HTTP URL`);
            parts.push({
              fileData: {
                mimeType: 'image/png',
                fileUri: imageUrl
              }
            });
          }
        });
        
        return {
          role: m.role === 'model' ? 'model' : 'user',
          parts: parts
        };
      })
    ];
    
    console.log('[chatWithGemini] Conversation history prepared, messages count:', conversationHistory.length);
    console.log('[chatWithGemini] Sending to Gemini API...');
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: conversationHistory
    });
    
    console.log('[chatWithGemini] Gemini response received:', response);
    
    // 提取文本内容
    if (response.text) {
      console.log('[chatWithGemini] Got response.text:', response.text);
      return response.text;
    }
    
    if (response.candidates && response.candidates[0]) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
        const text = candidate.content.parts[0].text;
        console.log('[chatWithGemini] Got text from candidate:', text);
        return text || null;
      }
    }
    
    console.warn('[chatWithGemini] Could not extract text from Gemini response:', response);
    return null;
  } catch (e) {
    console.error('[chatWithGemini] Gemini chat failed:', e);
    if (e instanceof Error) {
      console.error('[chatWithGemini] Error message:', e.message);
      console.error('[chatWithGemini] Error stack:', e.stack);
    }
    return null;
  }
};

// ✅ 为所有场景生成视频提示词
export const generateVideoPrompts = async (
  scenes: any[],
  frameCount: number,
  language: 'zh' | 'en' = 'en'
): Promise<string[]> => {
  const prompts: string[] = [];
  
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    try {
      const videoPrompt = await generateVideoPromptFromVisual(
        scene.visualPrompt || '',
        scene.description || '',
        '', // style will be inferred from context
        frameCount,
        i + 1,
        language
      );
      prompts.push(videoPrompt);
    } catch (e) {
      console.error(`[generateVideoPrompts] Failed to generate video prompt for scene ${i + 1}:`, e);
      prompts.push('');
    }
  }
  
  return prompts;
};

export const generateStoryboardFromDialogue = async (dialogueHistory: any[], frameCount: number, style: string, duration?: number, aspectRatio?: string, language: 'zh' | 'en' = 'en'): Promise<ScriptScene[]> => {
  const config = getAppConfig();
  const apiKey = config?.apiKey || process.env.API_KEY;
  
  // 提取最后一条用户消息作为生成分镜的主要内容
  let primaryContent = '';
  let contextContent = '';
  
  if (dialogueHistory.length > 0) {
    for (let i = dialogueHistory.length - 1; i >= 0; i--) {
      if (dialogueHistory[i].role === 'user') {
        primaryContent = dialogueHistory[i].text;
        contextContent = dialogueHistory.slice(0, i).map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.text}`).join('\n');
        break;
      }
    }
  }
  
  if (!primaryContent) {
    primaryContent = dialogueHistory.map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.text}`).join('\n');
  }
  
  // 构建风格和参数提示
  const stylePrompt = style ? (language === 'zh' ? `视觉风格应该是：${style}。` : `The visual style should be: ${style}. `) : '';
  const durationPrompt = duration && duration > 0 ? (language === 'zh' ? `总时长：${duration}秒。` : `Total duration: ${duration} seconds. `) : '';
  const aspectRatioPrompt = aspectRatio ? (language === 'zh' ? `画面比例：${aspectRatio}。` : `Aspect ratio: ${aspectRatio}. `) : '';
  
  const systemPrompts = {
    zh: `**文 你是一位世界级电影导演，有着敏锐的观察视角和叙事方式。你的任务是根据用户与AI对话的全部内容，严格按照用户描述的故事情节生成${frameCount}个场景。

【故事参考来源】
你必须ONLY参考以下内容来生成故事：
- 用户在对话中明确描述的故事情节
- 用户提到的角色、地点、事件
- 用户对故事走向的描述

【生成必须满足的条件】
第一：必须恰好生成${frameCount}个场景
第二：必须严格遵循【故事参考来源】中的内容，不要改变故事的核心内容、角色关系或情节发展
第三：必须保持故事完整性、叙事连贯性、角色一致性、视觉和风格的一致性
第四：所有场景的画面描述词相加小于800字
第五：所有场景的视频提示词字数相加小于700字
第六：要求返回JSON格式，包含：
  - index: 场景索引（0开始）
  - description: 场景描述（完整的故事情节描述，不要简短，必须忠实于【故事参考来源】中的用户故事）
  - visualPrompt: 画面提示词（2-3句话，详细描述视觉内容，不要包含任何指令或分析文本）
  - videoPrompt: 视频提示词（3-4句话，包括摄像机运动、人物动作等动态描述，不要包含任何指令或分析文本）

【禁止性指令】
1. 禁止改变【故事参考来源】中的故事核心情节、角色关系或故事走向
2. 禁止添加【故事参考来源】中没有提到的新角色、新地点或新元素
3. 禁止进行创意改编或二次创作，必须严格遵循【故事参考来源】中的用户描述
4. 禁止使用任何特殊符号、编号或格式标记来标识visualPrompt和videoPrompt
5. 禁止在visualPrompt和videoPrompt前添加"Visual:"、"Video:"、"画面提示词："、"视频提示词："等标签
6. 禁止使用"分镜"、"漫画"、"多格"等关键词
7. 禁止在JSON数组外添加任何解释文字、markdown代码块或其他额外内容
8. 只返回JSON数组，不返回${frameCount}个场景以外的内容
9. 禁止返回中英混杂的内容，所有内容必须是中文
10. 禁止在visualPrompt和videoPrompt中包含任何指令性文本，如"Continue from"、"Show the"、"Maintain"、"Build upon"等
11. 禁止在visualPrompt和videoPrompt中包含任何标签或前缀
12. 禁止在visualPrompt和videoPrompt中包含AI的思考、分析或解释内容
13. visualPrompt和videoPrompt必须是纯粹的场景描述，直接描述画面和动作

【创作指导】
- 视觉风格：${style || '默认风格'}
- 画面比例：${aspectRatio || '16:9'}
${durationPrompt}${stylePrompt}${aspectRatioPrompt}

【返回格式】
只返回JSON数组，例如：[{"index":0,"description":"...","visualPrompt":"...","videoPrompt":"..."},...]`,
    en: `**文 You are a world-class film director with keen observation and narrative skills. Your task is to generate exactly ${frameCount} scenes based strictly on the user's story description from the dialogue history.

【Story Reference Source】
You MUST ONLY reference the following content to generate the story:
- The story plot explicitly described by the user in the dialogue
- Characters, locations, and events mentioned by the user
- The user's description of story direction and development

【Requirements for Generation】
First: Generate exactly ${frameCount} scenes
Second: Strictly follow the content in 【Story Reference Source】, do NOT change the core story content, character relationships, or plot development
Third: Maintain story completeness, narrative continuity, character consistency, and visual style consistency
Fourth: Total character count of all visual prompts must be less than 800 characters
Fifth: Total character count of all video prompts must be less than 700 characters
Sixth: Return JSON format containing:
  - index: scene index (starting from 0)
  - description: scene description (complete story plot description, not brief, must be faithful to the user's story in 【Story Reference Source】)
  - visualPrompt: visual prompt (2-3 sentences, detailed visual content description, NO instructions or analysis text)
  - videoPrompt: video prompt (3-4 sentences with camera movement, character actions, and dynamic descriptions, NO instructions or analysis text)

【Prohibited Instructions】
1. Do NOT change the core plot, character relationships, or story direction from 【Story Reference Source】
2. Do NOT add new characters, locations, or elements not mentioned in 【Story Reference Source】
3. Do NOT perform creative adaptations or secondary creations, must strictly follow the user's description in 【Story Reference Source】
4. Do NOT use any special symbols, numbers, or format markers to identify visualPrompt and videoPrompt
5. Do NOT add labels like "Visual:", "Video:", "Visual Prompt:", "Video Prompt:" before visualPrompt and videoPrompt
6. Do NOT use keywords like "storyboard", "comic", "multi-panel"
7. Do NOT add any explanatory text, markdown code blocks, or additional content outside the JSON array
8. Return only JSON array with exactly ${frameCount} scenes, no more, no less
9. Do NOT mix Chinese and English content, all content must be in English
10. Do NOT include any instructional text in visualPrompt and videoPrompt, such as "Continue from", "Show the", "Maintain", "Build upon", etc.
11. Do NOT include any labels or prefixes in visualPrompt and videoPrompt
12. Do NOT include AI's thinking, analysis, or explanatory content in visualPrompt and videoPrompt
13. visualPrompt and videoPrompt must be pure scene descriptions, directly describing visuals and actions

【Creative Guidance】
- Visual style: ${style || 'default style'}
- Aspect ratio: ${aspectRatio || '16:9'}
${durationPrompt}${stylePrompt}${aspectRatioPrompt}

【Return Format】
Return only JSON array, for example: [{"index":0,"description":"...","visualPrompt":"...","videoPrompt":"..."},...]`
  };
  
  const systemPrompt = systemPrompts[language];
  
  const userPrompt = contextContent 
    ? (language === 'zh' 
      ? `【用户对话内容】\n${contextContent}\n\n【用户创意指导】\n${primaryContent}\n\n根据【用户对话内容】和【用户创意指导】，创建${frameCount}个分镜场景。只返回JSON数组。`
      : `【User Dialogue Content】\n${contextContent}\n\n【User Creative Direction】\n${primaryContent}\n\nBased on 【User Dialogue Content】 and 【User Creative Direction】, create ${frameCount} storyboard scenes. Return ONLY the JSON array.`)
    : (language === 'zh'
      ? `【用户创意指导】\n${primaryContent}\n\n根据【用户创意指导】，创建${frameCount}个分镜场景。只返回JSON数组。`
      : `【User Creative Direction】\n${primaryContent}\n\nBased on 【User Creative Direction】, create ${frameCount} storyboard scenes. Return ONLY the JSON array.`);

  if (config && config.provider !== 'gemini' && config.apiKey) {
    try {
      const endpoint = config.provider === 'zhipu' 
        ? `${config.baseUrl}/chat/completions`
        : `${config.baseUrl}/v1/chat/completions`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: buildSafeHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        }),
        body: JSON.stringify({
          model: config.llmModel || 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: "json_object" }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API Error (${response.status}): ${await response.text()}`);
      }
      
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('Empty response from API');
      }
      
      console.log('[generateStoryboardFromDialogue] Raw response:', content);
      
      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch (parseError) {
        console.error('[generateStoryboardFromDialogue] JSON parse failed, attempting text extraction:', parseError);
        // If JSON parsing fails, try to extract JSON from the text
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not extract JSON from response');
        }
      }
      
      // Handle single object response - wrap in array
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        parsed = [parsed];
      }
      
      let scenes = Array.isArray(parsed) ? parsed : (parsed.scenes || Object.values(parsed)[0]);
      
      if (!Array.isArray(scenes)) {
        console.error('[generateStoryboardFromDialogue] Invalid scenes format:', scenes);
        return [];
      }
      
      // Extract actual content from prompts, removing instruction text
      scenes = scenes.map((scene: any) => ({
        ...scene,
        description: (scene.description || '').replace(/\?+/g, '.').trim(),
        visualPrompt: extractPromptContent((scene.visualPrompt || ''), 'visual'),
        videoPrompt: extractPromptContent((scene.videoPrompt || ''), 'video')
      }));
      
      return adjustSceneCount(scenes, frameCount);
    } catch (e) {
      console.error("Third-party dialogue to storyboard failed", e);
      return [];
    }
  }

  // Fallback to Gemini
  const ai = new GoogleGenAI({ apiKey: apiKey || '' });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `${systemPrompt}\n\n${userPrompt}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            index: { type: Type.INTEGER },
            description: { type: Type.STRING },
            visualPrompt: { type: Type.STRING },
            videoPrompt: { type: Type.STRING }
          },
          required: ["index", "description", "visualPrompt", "videoPrompt"]
        }
      }
    }
  });
  
  try { 
    let scenes = JSON.parse(response.text);
    
    // Clean up scenes: extract actual content and remove instruction text
    if (Array.isArray(scenes)) {
      scenes = scenes.map((scene: any) => ({
        ...scene,
        description: (scene.description || '').replace(/\?+/g, '.').trim(),
        visualPrompt: extractPromptContent((scene.visualPrompt || ''), 'visual'),
        videoPrompt: extractPromptContent((scene.videoPrompt || ''), 'video')
      }));
    }
    
    const adjustedScenes = adjustSceneCount(scenes, frameCount);
    
    // 为需要视频提示词的场景生成 AI 视频提示词
    const scenesNeedingPrompts = adjustedScenes.filter((s: any) => s.needsVideoPrompt);
    if (scenesNeedingPrompts.length > 0) {
      console.log('[generateStoryboardFromDialogue] Generating video prompts for', scenesNeedingPrompts.length, 'scenes');
      
      // 生成中文视频提示词
      const zhPrompts = await generateVideoPrompts(adjustedScenes, frameCount, 'zh');
      // 生成英文视频提示词
      const enPrompts = await generateVideoPrompts(adjustedScenes, frameCount, 'en');
      
      // 填充视频提示词
      adjustedScenes.forEach((scene: any, idx: number) => {
        if (scene.needsVideoPrompt) {
          scene.videoPrompt = zhPrompts[idx] || '';
          scene.videoPromptEn = enPrompts[idx] || '';
          delete scene.needsVideoPrompt;
        }
      });
    }
    
    return adjustedScenes;
  } catch (e) { 
    console.error("Failed to parse storyboard response:", e);
    return []; 
  }
};


// 图生图API - 编辑图片
export const editImage = async (
  imageUrl: string,
  prompt: string,
  aspectRatio?: string,
  responseFormat: 'url' | 'b64_json' = 'url'
): Promise<string | null> => {
  const config = getAppConfig();
  const apiKey = config?.apiKey || process.env.API_KEY;

  try {
    if (config?.provider === 'gemini') {
      console.warn('Gemini does not support image editing. Please use nano-banana provider.');
      return null;
    }

    // 获取图片文件
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.error('Failed to fetch image:', imageResponse.status);
      return null;
    }
    
    const imageBlob = await imageResponse.blob();
    
    const formData = new FormData();
    formData.append('model', 'gpt-image-1');  // 使用 gpt-image-1 作为默认
    formData.append('prompt', prompt);
    formData.append('image', imageBlob, 'image.png');
    formData.append('response_format', responseFormat);
    if (aspectRatio) {
      formData.append('aspect_ratio', aspectRatio);
    }

    const response = await fetch(`${config?.baseUrl}/v1/images/edits`, {
      method: 'POST',
      headers: buildSafeHeaders({
        'Authorization': `Bearer ${apiKey}`
        // 注意: 不要设置 Content-Type，让浏览器自动设置为 multipart/form-data
      }),
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Image editing failed: ${response.status}`, errorText);
      return null;
    }

    const data = await response.json();
    const editedImageUrl = data.data?.[0]?.url || data.data?.[0]?.b64_json;
    
    if (!editedImageUrl) {
      console.error('No image URL in response');
      return null;
    }
    
    // 如果是 base64，直接返回
    if (responseFormat === 'b64_json' && editedImageUrl.startsWith('data:')) {
      return editedImageUrl;
    }
    
    // 如果是 URL，转换为 base64
    if (editedImageUrl.startsWith('http')) {
      console.log("Converting edited image URL to base64...");
      const base64 = await urlToBase64(editedImageUrl);
      if (base64) {
        console.log("Image converted to base64 successfully");
        return base64;
      } else {
        console.warn("Failed to convert to base64, returning URL as fallback");
        return editedImageUrl;
      }
    }
    
    return editedImageUrl;
  } catch (err) {
    console.error("Image editing failed", err);
  }
  return null;
};

