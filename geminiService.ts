
import { GoogleGenAI, Type } from "@google/genai";
import { ScriptScene, ProviderConfig } from "./types";

// ✅ 公共函数：调整场景数量
const adjustSceneCount = (scenes: any[], targetCount: number): ScriptScene[] => {
  if (!Array.isArray(scenes)) {
    console.error('Invalid scenes format');
    return [];
  }

  if (scenes.length > targetCount) {
    console.warn(`AI returned ${scenes.length} scenes but ${targetCount} were requested. Trimming to ${targetCount}.`);
    return scenes.slice(0, targetCount);
  }

  if (scenes.length < targetCount) {
    console.warn(`AI returned ${scenes.length} scenes but ${targetCount} were requested. Padding with duplicates.`);
    const padded = [...scenes];
    while (padded.length < targetCount) {
      const lastScene = padded[padded.length - 1];
      padded.push({
        index: padded.length,
        description: lastScene.description + ` (variation ${padded.length - targetCount + 1})`,
        visualPrompt: lastScene.visualPrompt + ` (variation ${padded.length - targetCount + 1})`
      });
    }
    return padded;
  }

  return scenes;
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
    } else {
      // 直接测试 OpenAI 兼容 API
      console.log('[testApiConnection] Testing direct API for', type, 'with provider', config.provider);
      
      const endpoint = type === 'image'
        ? `${config.baseUrl}/v1/images/generations`
        : `${config.baseUrl}/v1/chat/completions`;
      
      // 所有API都需要model参数
      const body = type === 'image'
        ? { 
            model: config.imageModel || 'nano-banana',
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
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          },
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
      stylePrefix = `STRICT BLACK AND WHITE SKETCH ONLY. Professional pencil sketch storyboard in ${styleDesc} style. Pure black pencil lines on pure white background. ABSOLUTELY NO COLORS, NO SHADING, NO GREY TONES. Only thin, precise pencil strokes to define all shapes, details, and composition. High contrast, clean sketch work. Cinema scene: `;
    } else {
      stylePrefix = "STRICT BLACK AND WHITE SKETCH ONLY. Professional pencil sketch storyboard. Pure black pencil lines on pure white background. ABSOLUTELY NO COLORS, NO SHADING, NO GREY TONES. Only thin, precise pencil strokes to define all shapes, details, and composition. High contrast, clean sketch work. Cinema scene: ";
    }
  } else {
    // 彩色模式：生成彩色分镜
    if (styleDesc) {
      stylePrefix = `Professional cinematic storyboard frame in ${styleDesc} style. Vibrant colors, rich color palette, detailed illustration. Professional lighting and composition. High quality digital painting. Cinema scene: `;
    } else {
      stylePrefix = "Professional cinematic storyboard frame with vibrant colors. Rich color palette, detailed illustration style. Professional lighting and composition. High quality digital painting. Cinema scene: ";
    }
  }

  try {
    if (config?.provider === 'gemini') {
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
              formData.append('model', config?.imageModel || 'nano-banana');
              formData.append('prompt', fullPrompt);
              formData.append('image', imageBlob, 'reference.png');
              formData.append('aspect_ratio', aspectRatio || '16:9');
              formData.append('response_format', 'url');
              
              console.log('[generateSceneImage] Calling edits endpoint:', editsEndpoint);
              console.log('[generateSceneImage] FormData fields:');
              console.log('  - model:', config?.imageModel || 'nano-banana');
              console.log('  - prompt:', fullPrompt.substring(0, 100) + '...');
              console.log('  - image blob size:', imageBlob.size, 'bytes');
              console.log('  - aspect_ratio:', aspectRatio || '16:9');
              console.log('  - response_format: url');
              
              const editResponse = await fetch(editsEndpoint, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${apiKey}`
                },
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
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
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

export const parseScriptToScenes = async (scriptText: string, sceneCount: number): Promise<ScriptScene[]> => {
  const config = getAppConfig();
  const apiKey = config?.apiKey || process.env.API_KEY;

  // If using a custom provider that is OpenAI-compatible
  if (config && config.provider !== 'gemini' && config.apiKey) {
    try {
      const response = await fetch(`${config.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.llmModel || 'gpt-4o',
          messages: [
            { 
              role: 'system', 
              content: `You are a script parser. Parse input into exactly ${sceneCount} storyboard scenes. Return ONLY a valid JSON array of objects with keys: index (int), description (string), visualPrompt (string). Do not include markdown code blocks or any other text.` 
            },
            { role: 'user', content: scriptText }
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
    contents: `Parse this script into exactly ${sceneCount} storyboard scenes. 
    Script: ${scriptText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            index: { type: Type.INTEGER },
            description: { type: Type.STRING },
            visualPrompt: { type: Type.STRING }
          },
          required: ["index", "description", "visualPrompt"]
        }
      }
    }
  });
  
  try { 
    let scenes = JSON.parse(response.text);
    return adjustSceneCount(scenes, sceneCount);
  } catch (e) { 
    console.error("Failed to parse script response:", e);
    return []; 
  }
};

export const chatWithGemini = async (messages: any[]) => {
  const config = getAppConfig();
  const apiKey = config?.apiKey || process.env.API_KEY;

  if (config && config.provider !== 'gemini' && config.apiKey) {
    try {
      const formattedMessages = messages.map(m => {
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
        
        // 如果有图片，使用 content 数组格式（gpt-4o 支持）
        if (images.length > 0) {
          const content: any[] = [
            {
              type: 'text',
              text: text
            }
          ];
          
          // 添加图片到 content 数组
          images.forEach(imageUrl => {
            content.push({
              type: 'image_url',
              image_url: {
                url: imageUrl,
                detail: 'auto'
              }
            });
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

      const response = await fetch(`${config.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.llmModel,
          messages: formattedMessages
        })
      });
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      console.log("Third-party chat response:", content);
      return content || null;
    } catch (e) {
      console.error("Third-party chat failed", e);
      return null;
    }
  }

  try {
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
      ...messages.map(m => {
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
        
        // 构建 parts 数组
        const parts: any[] = [{ text }];
        
        // 添加图片到 parts 数组
        images.forEach(imageUrl => {
          if (imageUrl.startsWith('data:')) {
            // Base64 格式
            const base64Data = imageUrl.split(',')[1];
            const mimeType = imageUrl.split(';')[0].replace('data:', '');
            parts.push({
              inlineData: {
                mimeType: mimeType || 'image/png',
                data: base64Data
              }
            });
          } else if (imageUrl.startsWith('http')) {
            // URL 格式
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
    
    console.log("Sending conversation history to Gemini:", conversationHistory);
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: conversationHistory
    });
    
    console.log("Gemini response:", response);
    
    // 提取文本内容
    if (response.text) {
      console.log("Got response.text:", response.text);
      return response.text;
    }
    
    if (response.candidates && response.candidates[0]) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
        const text = candidate.content.parts[0].text;
        console.log("Got text from candidate:", text);
        return text || null;
      }
    }
    
    console.warn("Could not extract text from Gemini response:", response);
    return null;
  } catch (e) {
    console.error("Gemini chat failed", e);
    return null;
  }
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
    zh: `你是一位创意分镜导演。根据用户的创意指导，生成恰好${frameCount}个分镜场景。
${stylePrompt}${durationPrompt}${aspectRatioPrompt}
返回一个JSON数组，包含对象，字段为：index (int), description (string), visualPrompt (string)。
每个visualPrompt应该详细具体，用于图像生成。
不要包含markdown代码块，只返回JSON数组。`,
    en: `You are a creative storyboard director. Based on the user's creative direction, generate exactly ${frameCount} storyboard scenes.
${stylePrompt}${durationPrompt}${aspectRatioPrompt}
Return a JSON array with objects containing: index (int), description (string), visualPrompt (string).
Each visualPrompt should be detailed and specific for image generation.
Do not include markdown code blocks, just the JSON array.`
  };
  
  const systemPrompt = systemPrompts[language];
  
  const userPrompt = contextContent 
    ? (language === 'zh' 
      ? `之前的对话背景：\n${contextContent}\n\n根据这个创意指导，创建${frameCount}个分镜场景：\n${primaryContent}`
      : `Previous context:\n${contextContent}\n\nBased on this creative direction, create ${frameCount} storyboard scenes:\n${primaryContent}`)
    : (language === 'zh'
      ? `根据这个创意指导，创建${frameCount}个分镜场景：\n${primaryContent}`
      : `Based on this creative direction, create ${frameCount} storyboard scenes:\n${primaryContent}`);

  if (config && config.provider !== 'gemini' && config.apiKey) {
    try {
      const response = await fetch(`${config.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
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
            visualPrompt: { type: Type.STRING }
          },
          required: ["index", "description", "visualPrompt"]
        }
      }
    }
  });
  
  try { 
    let scenes = JSON.parse(response.text);
    return adjustSceneCount(scenes, frameCount);
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
    formData.append('model', config?.imageModel || 'nano-banana');
    formData.append('prompt', prompt);
    formData.append('image', imageBlob, 'image.png');
    formData.append('response_format', responseFormat);
    if (aspectRatio) {
      formData.append('aspect_ratio', aspectRatio);
    }

    const response = await fetch(`${config?.baseUrl}/v1/images/edits`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
        // 注意: 不要设置 Content-Type，让浏览器自动设置为 multipart/form-data
      },
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
