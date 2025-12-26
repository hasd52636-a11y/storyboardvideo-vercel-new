/**
 * 统一多媒体 API 端点
 * 合并所有多媒体功能到单一路由
 * 
 * 支持的操作：
 * - POST /api/multimedia?action=text-to-image
 * - POST /api/multimedia?action=image-to-image
 * - POST /api/multimedia?action=text-generation
 * - POST /api/multimedia?action=image-analysis
 * - POST /api/multimedia?action=video-generation
 * - POST /api/multimedia?action=video-analysis
 * - GET /api/multimedia?action=config
 * - POST /api/multimedia?action=config
 * - PUT /api/multimedia?action=config
 */

import { NextRequest, NextResponse } from 'next/server';
import MultiMediaService from '@/services/multimedia/MultiMediaService';
import APIConfigManager from '@/services/multimedia/APIConfigManager';
import { MediaProvider } from '@/services/multimedia/types';

// ============================================================================
// 辅助函数
// ============================================================================

function getUserId(request: NextRequest): number {
  return 1; // TODO: 从 session 或 header 获取用户 ID
}

function errorResponse(message: string, status: number = 400) {
  return NextResponse.json(
    {
      success: false,
      error: { message },
    },
    { status }
  );
}

function successResponse(data: any, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

// ============================================================================
// 主处理函数
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'text-to-image';
    const userId = getUserId(request);
    
    console.log('[multimedia] POST request:', { action, userId });
    
    let body: any = {};
    try {
      body = await request.json();
    } catch (e) {
      console.error('[multimedia] JSON parse error:', e);
      return errorResponse('Invalid JSON in request body', 400);
    }

    console.log('[multimedia] Request body keys:', Object.keys(body));

    // 提取配置（从客户端传递）
    const clientConfig = body._config;
    delete body._config;

    // 检查是否有配置
    if (!clientConfig) {
      console.error('[multimedia] No client config provided');
      return errorResponse('API configuration is required. Please configure your API keys first.', 400);
    }

    console.log('[multimedia] Client config providers:', Object.keys(clientConfig.providers || {}));
    console.log('[multimedia] Client config configs:', Object.keys(clientConfig.configs || {}));

    try {
      const configManager = new APIConfigManager(userId);
      const service = new MultiMediaService(configManager, userId);
      
      // 使用客户端提供的配置初始化适配器
      console.log('[multimedia] Initializing adapters with config');
      service.initializeAdaptersSync(clientConfig);
      console.log('[multimedia] Adapters initialized successfully');
      
      // 更新 configManager 的内部配置，以便后续调用能使用正确的配置
      console.log('[multimedia] Updating config manager with client config');
      await configManager.updateConfig(clientConfig, userId);

      switch (action) {
        case 'text-to-image':
          console.log('[multimedia] Handling text-to-image');
          return await handleTextToImage(service, body);

        case 'image-to-image':
          console.log('[multimedia] Handling image-to-image');
          return await handleImageToImage(service, body);

        case 'text-generation':
          console.log('[multimedia] Handling text-generation');
          return await handleTextGeneration(service, body);

        case 'image-analysis':
          console.log('[multimedia] Handling image-analysis');
          return await handleImageAnalysis(service, body);

        case 'video-generation':
          console.log('[multimedia] Handling video-generation');
          return await handleVideoGeneration(service, body);

        case 'video-analysis':
          console.log('[multimedia] Handling video-analysis');
          return await handleVideoAnalysis(service, body);

        case 'config':
          console.log('[multimedia] Handling config update');
          return await handleConfigUpdate(configManager, userId, body);

        default:
          console.error('[multimedia] Unknown action:', action);
          return errorResponse(`Unknown action: ${action}`, 400);
      }
    } catch (serviceError) {
      console.error('[multimedia] Service error:', serviceError);
      console.error('[multimedia] Service error stack:', serviceError instanceof Error ? serviceError.stack : 'no stack');
      const message = serviceError instanceof Error ? serviceError.message : 'Service initialization failed';
      return errorResponse(message, 500);
    }
  } catch (error) {
    console.error('[multimedia] POST error:', error);
    console.error('[multimedia] POST error stack:', error instanceof Error ? error.stack : 'no stack');
    const message = error instanceof Error ? error.message : 'Internal server error';
    return errorResponse(message, 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'config';
    const userId = getUserId(request);

    const configManager = new APIConfigManager(userId);

    switch (action) {
      case 'config':
        return await handleConfigGet(configManager, userId);

      default:
        return errorResponse(`Unknown action: ${action}`, 400);
    }
  } catch (error) {
    console.error('[multimedia] GET error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'config';
    const userId = getUserId(request);
    const body = await request.json();

    const configManager = new APIConfigManager(userId);

    switch (action) {
      case 'config':
        return await handleConfigSync(configManager, userId, body);

      default:
        return errorResponse(`Unknown action: ${action}`, 400);
    }
  } catch (error) {
    console.error('[multimedia] PUT error:', error);
    return errorResponse('Internal server error', 500);
  }
}

// ============================================================================
// 处理函数
// ============================================================================

async function handleTextToImage(service: MultiMediaService, body: any) {
  const { prompt, model, provider, ...options } = body;

  if (!prompt) {
    return errorResponse('Prompt is required', 400);
  }

  console.log('[handleTextToImage] Generating image with:', { prompt, model, provider, options });

  try {
    const result = await service.generateImage({
      prompt,
      model,
      provider,
      ...options
    });
    console.log('[handleTextToImage] Success:', result);
    return successResponse(result);
  } catch (error) {
    console.error('[handleTextToImage] Error:', error);
    throw error;
  }
}

async function handleImageToImage(service: MultiMediaService, body: any) {
  const { imageUrl, prompt, model, provider, ...options } = body;

  if (!imageUrl || !prompt) {
    return errorResponse('Image URL and prompt are required', 400);
  }

  const result = await service.editImage({
    imageUrl,
    prompt,
    model,
    provider,
    ...options
  });
  return successResponse(result);
}

async function handleTextGeneration(service: MultiMediaService, body: any) {
  const { messages, prompt, model, provider, ...options } = body;

  // 支持 prompt 或 messages 格式
  let finalMessages = messages;
  if (!finalMessages && prompt) {
    finalMessages = [{ role: 'user', content: prompt }];
  }

  if (!finalMessages || finalMessages.length === 0) {
    console.error('[handleTextGeneration] No messages provided');
    return errorResponse('Messages or prompt is required', 400);
  }

  console.log('[handleTextGeneration] Generating text with:', { 
    messagesCount: finalMessages.length,
    model, 
    provider, 
    optionsKeys: Object.keys(options)
  });

  try {
    const result = await service.generateText({
      messages: finalMessages,
      model,
      provider,
      ...options
    });
    console.log('[handleTextGeneration] Success:', { 
      success: result.success,
      hasData: !!result.data,
      textLength: result.data?.text?.length
    });
    return successResponse(result);
  } catch (error) {
    console.error('[handleTextGeneration] Error details:', {
      errorName: error instanceof Error ? error.name : 'unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

async function handleImageAnalysis(service: MultiMediaService, body: any) {
  const { imageUrl, prompt, model, provider, ...options } = body;

  if (!imageUrl) {
    return errorResponse('Image URL is required', 400);
  }

  const result = await service.analyzeImage({
    imageUrl,
    prompt,
    model,
    provider,
    ...options
  });
  return successResponse(result);
}

async function handleVideoGeneration(service: MultiMediaService, body: any) {
  const { prompt, model, provider, ...options } = body;

  if (!prompt) {
    return errorResponse('Prompt is required', 400);
  }

  const result = await service.generateVideo({
    prompt,
    model,
    provider,
    ...options
  });
  return successResponse(result);
}

async function handleVideoAnalysis(service: MultiMediaService, body: any) {
  const { videoUrl, prompt, model, provider, ...options } = body;

  if (!videoUrl) {
    return errorResponse('Video URL is required', 400);
  }

  const result = await service.analyzeVideo({
    videoUrl,
    prompt,
    model,
    provider,
    ...options
  });
  return successResponse(result);
}

async function handleConfigGet(configManager: APIConfigManager, userId: number) {
  const config = await configManager.getConfig(userId);
  return successResponse({
    config,
    providers: await configManager.getConfiguredProviders(userId),
  });
}

async function handleConfigUpdate(
  configManager: APIConfigManager,
  userId: number,
  body: any
) {
  const validation = await configManager.validateConfig(body);
  if (!validation.valid) {
    return errorResponse(
      `Configuration validation failed: ${validation.errors.join(', ')}`,
      400
    );
  }

  await configManager.updateConfig(body, userId);
  return successResponse({
    message: 'Configuration updated successfully',
    config: body,
  });
}

async function handleConfigSync(
  configManager: APIConfigManager,
  userId: number,
  body: any
) {
  const { provider } = body;

  if (!provider) {
    return errorResponse('Provider is required', 400);
  }

  await configManager.syncConfig(provider as MediaProvider, userId);
  const config = await configManager.getConfig(userId);

  return successResponse({
    message: `Configuration synced to provider "${provider}"`,
    config,
  });
}
