# 智谱 GLM 集成 - 测试与部署完整指南

**文档日期**: 2025-12-30
**版本**: v1.0
**状态**: 完整测试与部署计划

---

## 📋 测试与部署概览

本文档详细说明如何完成所有剩余的测试和部署任务。

### 测试阶段

| 阶段 | 任务 | 状态 |
|------|------|------|
| 1 | 功能测试 (Functional Testing) | ⏳ 进行中 |
| 2 | 集成测试 (Integration Testing) | ⏳ 进行中 |
| 3 | 性能测试 (Performance Testing) | ⏳ 进行中 |
| 4 | 安全测试 (Security Testing) | ⏳ 进行中 |
| 5 | 部署验证 (Deployment Validation) | ⏳ 进行中 |

---

## 🧪 第 1 阶段：功能测试 (Functional Testing)

### 1.1 文本生成功能测试

**测试用例 1.1.1: 基础文本生成**
```typescript
// 测试代码
const testBasicTextGeneration = async () => {
  const config = {
    provider: 'zhipu',
    apiKey: process.env.ZHIPU_API_KEY,
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4'
  };
  
  const zhipuService = new ZhipuService(config);
  const prompt = 'Write a short story about a robot learning to paint';
  
  try {
    const result = await zhipuService.generateText(prompt, {
      temperature: 0.7,
      topP: 0.9,
      maxTokens: 500
    });
    
    console.log('✅ Text generation successful');
    console.log('Result length:', result.length);
    console.assert(result.length > 0, 'Result should not be empty');
    console.assert(result.length < 2000, 'Result should be within token limit');
    return true;
  } catch (error) {
    console.error('❌ Text generation failed:', error);
    return false;
  }
};
```

**测试用例 1.1.2: 深度思考模式**
```typescript
const testDeepThinking = async () => {
  const config = {
    provider: 'zhipu',
    apiKey: process.env.ZHIPU_API_KEY,
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4'
  };
  
  const zhipuService = new ZhipuService(config);
  const prompt = 'Solve this math problem: What is 2^10 + 3^5?';
  
  try {
    const result = await zhipuService.generateText(prompt, {
      useThinking: true,
      maxTokens: 1000
    });
    
    console.log('✅ Deep thinking successful');
    console.assert(result.includes('1024') || result.includes('243'), 'Should contain calculation results');
    return true;
  } catch (error) {
    console.error('❌ Deep thinking failed:', error);
    return false;
  }
};
```

### 1.2 图像生成功能测试

**测试用例 1.2.1: 基础图像生成**
```typescript
const testBasicImageGeneration = async () => {
  const config = {
    provider: 'zhipu',
    apiKey: process.env.ZHIPU_API_KEY,
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4'
  };
  
  const zhipuService = new ZhipuService(config);
  const prompt = 'A serene landscape with mountains and a lake at sunset';
  
  try {
    const imageUrl = await zhipuService.generateImage(prompt, {
      size: '1024x1024',
      quality: 'standard'
    });
    
    console.log('✅ Image generation successful');
    console.log('Image URL:', imageUrl.substring(0, 50) + '...');
    console.assert(imageUrl.length > 0, 'Image URL should not be empty');
    return true;
  } catch (error) {
    console.error('❌ Image generation failed:', error);
    return false;
  }
};
```

**测试用例 1.2.2: 不同尺寸测试**
```typescript
const testImageSizes = async () => {
  const config = {
    provider: 'zhipu',
    apiKey: process.env.ZHIPU_API_KEY,
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4'
  };
  
  const zhipuService = new ZhipuService(config);
  const sizes = ['1024x1024', '1024x1536', '1536x1024'] as const;
  
  for (const size of sizes) {
    try {
      const imageUrl = await zhipuService.generateImage('A beautiful sunset', {
        size,
        quality: 'standard'
      });
      console.log(`✅ Image generation successful for size ${size}`);
    } catch (error) {
      console.error(`❌ Image generation failed for size ${size}:`, error);
      return false;
    }
  }
  return true;
};
```

### 1.3 图片分析功能测试

**测试用例 1.3.1: 基础图片分析**
```typescript
const testBasicImageAnalysis = async () => {
  const config = {
    provider: 'zhipu',
    apiKey: process.env.ZHIPU_API_KEY,
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4'
  };
  
  const zhipuService = new ZhipuService(config);
  const testImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg';
  const prompt = 'Describe what you see in this image';
  
  try {
    const analysis = await zhipuService.analyzeImage(testImageUrl, prompt, {
      temperature: 0.8,
      maxTokens: 500
    });
    
    console.log('✅ Image analysis successful');
    console.log('Analysis length:', analysis.length);
    console.assert(analysis.length > 0, 'Analysis should not be empty');
    return true;
  } catch (error) {
    console.error('❌ Image analysis failed:', error);
    return false;
  }
};
```

### 1.4 视频生成功能测试

**测试用例 1.4.1: 基础视频生成**
```typescript
const testBasicVideoGeneration = async () => {
  const config = {
    provider: 'zhipu',
    apiKey: process.env.ZHIPU_API_KEY,
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4'
  };
  
  const zhipuService = new ZhipuService(config);
  const prompt = 'A person walking through a beautiful garden';
  
  try {
    const result = await zhipuService.generateVideo(prompt, {
      quality: 'speed',
      duration: 5
    });
    
    console.log('✅ Video generation initiated');
    console.log('Task ID:', result.taskId);
    console.log('Status:', result.status);
    console.assert(result.taskId.length > 0, 'Task ID should not be empty');
    return result.taskId;
  } catch (error) {
    console.error('❌ Video generation failed:', error);
    return null;
  }
};
```

**测试用例 1.4.2: 视频状态查询**
```typescript
const testVideoStatusPolling = async (taskId: string) => {
  const config = {
    provider: 'zhipu',
    apiKey: process.env.ZHIPU_API_KEY,
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4'
  };
  
  const zhipuService = new ZhipuService(config);
  
  try {
    const status = await zhipuService.getVideoStatus(taskId);
    
    console.log('✅ Video status query successful');
    console.log('Status:', status.status);
    console.assert(['PROCESSING', 'SUCCESS', 'FAIL'].includes(status.status), 'Status should be valid');
    return status;
  } catch (error) {
    console.error('❌ Video status query failed:', error);
    return null;
  }
};
```

---

## 🔗 第 2 阶段：集成测试 (Integration Testing)

### 2.1 端到端流程测试

**测试用例 2.1.1: 文本生成完整流程**
```typescript
const testTextGenerationE2E = async () => {
  console.log('🔄 Starting text generation E2E test');
  
  // Step 1: 获取配置
  const config = getAppConfig();
  if (!config || config.provider !== 'zhipu') {
    console.error('❌ Zhipu not configured');
    return false;
  }
  
  // Step 2: 调用 chatWithGemini
  const messages = [
    { role: 'user', text: 'Write a haiku about technology' }
  ];
  
  try {
    const response = await chatWithGemini(messages);
    console.log('✅ Text generation E2E successful');
    console.log('Response:', response.substring(0, 100) + '...');
    return true;
  } catch (error) {
    console.error('❌ Text generation E2E failed:', error);
    return false;
  }
};
```

**测试用例 2.1.2: 图像生成完整流程**
```typescript
const testImageGenerationE2E = async () => {
  console.log('🔄 Starting image generation E2E test');
  
  try {
    const imageUrl = await generateSceneImage(
      'A futuristic city with flying cars',
      true,
      false,
      { descriptionZh: 'Cyberpunk' },
      '16:9'
    );
    
    console.log('✅ Image generation E2E successful');
    console.log('Image URL:', imageUrl?.substring(0, 50) + '...');
    console.assert(imageUrl, 'Image URL should not be empty');
    return true;
  } catch (error) {
    console.error('❌ Image generation E2E failed:', error);
    return false;
  }
};
```

**测试用例 2.1.3: 图片分析完整流程**
```typescript
const testImageAnalysisE2E = async () => {
  console.log('🔄 Starting image analysis E2E test');
  
  const testImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg';
  
  try {
    const analysis = await analyzeImageWithProvider(
      testImageUrl,
      'What is the main subject in this image?'
    );
    
    console.log('✅ Image analysis E2E successful');
    console.log('Analysis:', analysis.substring(0, 100) + '...');
    return true;
  } catch (error) {
    console.error('❌ Image analysis E2E failed:', error);
    return false;
  }
};
```

### 2.2 模型切换测试

**测试用例 2.2.1: 模型配置切换**
```typescript
const testModelSwitching = async () => {
  console.log('🔄 Starting model switching test');
  
  // Test 1: 使用普惠模型
  localStorage.setItem('zhipu_models_config', JSON.stringify({
    text: 'glm-4-flash',
    thinking: 'glm-4.5-flash',
    vision: 'glm-4v-flash',
    video: 'cogvideox-flash',
    image: 'cogview-3-flash'
  }));
  
  let config = getAppConfig();
  console.log('✅ Affordable models configured');
  
  // Test 2: 切换到高端模型
  localStorage.setItem('zhipu_models_config', JSON.stringify({
    text: 'glm-4-flash',
    thinking: 'glm-4.5-flash',
    vision: 'glm-4.6v',
    video: 'cogvideox-3',
    image: 'cogview-3'
  }));
  
  config = getAppConfig();
  console.log('✅ Premium models configured');
  
  return true;
};
```

---

## ⚡ 第 3 阶段：性能测试 (Performance Testing)

### 3.1 响应时间测试

**测试用例 3.1.1: 文本生成性能**
```typescript
const testTextGenerationPerformance = async () => {
  console.log('⏱️ Testing text generation performance');
  
  const config = {
    provider: 'zhipu',
    apiKey: process.env.ZHIPU_API_KEY,
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4'
  };
  
  const zhipuService = new ZhipuService(config);
  const iterations = 5;
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    await zhipuService.generateText('Hello, how are you?', { maxTokens: 100 });
    const duration = Date.now() - start;
    times.push(duration);
    console.log(`Iteration ${i + 1}: ${duration}ms`);
  }
  
  const avg = times.reduce((a, b) => a + b) / times.length;
  const max = Math.max(...times);
  const min = Math.min(...times);
  
  console.log(`Average: ${avg.toFixed(2)}ms`);
  console.log(`Max: ${max}ms`);
  console.log(`Min: ${min}ms`);
  
  console.assert(avg < 5000, 'Average response time should be < 5 seconds');
  return true;
};
```

**测试用例 3.1.2: 图像生成性能**
```typescript
const testImageGenerationPerformance = async () => {
  console.log('⏱️ Testing image generation performance');
  
  const config = {
    provider: 'zhipu',
    apiKey: process.env.ZHIPU_API_KEY,
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4'
  };
  
  const zhipuService = new ZhipuService(config);
  const start = Date.now();
  
  await zhipuService.generateImage('A beautiful sunset', {
    size: '1024x1024',
    quality: 'standard'
  });
  
  const duration = Date.now() - start;
  console.log(`Image generation time: ${duration}ms`);
  console.assert(duration < 30000, 'Image generation should complete within 30 seconds');
  
  return true;
};
```

### 3.2 并发测试

**测试用例 3.2.1: 并发请求处理**
```typescript
const testConcurrentRequests = async () => {
  console.log('🔄 Testing concurrent requests');
  
  const config = {
    provider: 'zhipu',
    apiKey: process.env.ZHIPU_API_KEY,
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4'
  };
  
  const zhipuService = new ZhipuService(config);
  const concurrentCount = 5;
  const promises = [];
  
  for (let i = 0; i < concurrentCount; i++) {
    promises.push(
      zhipuService.generateText(`Request ${i + 1}`, { maxTokens: 100 })
    );
  }
  
  try {
    const results = await Promise.all(promises);
    console.log(`✅ All ${concurrentCount} concurrent requests completed`);
    console.assert(results.length === concurrentCount, 'All requests should complete');
    return true;
  } catch (error) {
    console.error('❌ Concurrent requests failed:', error);
    return false;
  }
};
```

---

## 🔐 第 4 阶段：安全测试 (Security Testing)

### 4.1 API Key 安全测试

**测试用例 4.1.1: 无效 API Key 处理**
```typescript
const testInvalidAPIKey = async () => {
  console.log('🔐 Testing invalid API Key handling');
  
  const config = {
    provider: 'zhipu',
    apiKey: 'invalid-api-key-12345',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4'
  };
  
  const zhipuService = new ZhipuService(config);
  
  try {
    await zhipuService.generateText('Test prompt');
    console.error('❌ Should have thrown an error for invalid API Key');
    return false;
  } catch (error) {
    console.log('✅ Invalid API Key properly rejected');
    console.assert(error.message.includes('401') || error.message.includes('Unauthorized'), 'Should return 401 error');
    return true;
  }
};
```

**测试用例 4.1.2: API Key 不在日志中泄露**
```typescript
const testAPIKeyNotInLogs = async () => {
  console.log('🔐 Testing API Key not in logs');
  
  const config = {
    provider: 'zhipu',
    apiKey: 'sk-test-secret-key-12345',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4'
  };
  
  const originalLog = console.log;
  const logs: string[] = [];
  
  console.log = (...args: any[]) => {
    logs.push(args.join(' '));
    originalLog(...args);
  };
  
  const zhipuService = new ZhipuService(config);
  
  try {
    await zhipuService.generateText('Test');
  } catch (error) {
    // Expected to fail
  }
  
  console.log = originalLog;
  
  const hasAPIKey = logs.some(log => log.includes('sk-test-secret-key'));
  console.assert(!hasAPIKey, 'API Key should not appear in logs');
  console.log('✅ API Key not found in logs');
  
  return true;
};
```

### 4.2 数据安全测试

**测试用例 4.2.1: HTTPS 连接验证**
```typescript
const testHTTPSConnection = async () => {
  console.log('🔐 Testing HTTPS connection');
  
  const config = {
    provider: 'zhipu',
    apiKey: process.env.ZHIPU_API_KEY,
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4'
  };
  
  console.assert(config.baseUrl.startsWith('https://'), 'Base URL should use HTTPS');
  console.log('✅ HTTPS connection verified');
  
  return true;
};
```

---

## 🚀 第 5 阶段：部署验证 (Deployment Validation)

### 5.1 环境配置验证

**测试用例 5.1.1: 环境变量检查**
```typescript
const testEnvironmentVariables = async () => {
  console.log('🔍 Checking environment variables');
  
  const requiredVars = ['ZHIPU_API_KEY'];
  const missing: string[] = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }
  
  if (missing.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missing.join(', ')}`);
  } else {
    console.log('✅ All required environment variables present');
  }
  
  return missing.length === 0;
};
```

**测试用例 5.1.2: 依赖检查**
```typescript
const testDependencies = async () => {
  console.log('🔍 Checking dependencies');
  
  try {
    // Check if ZhipuService can be imported
    const zhipuService = require('./zhipuService').default;
    console.log('✅ ZhipuService imported successfully');
    
    // Check if zhipuModels can be imported
    const zhipuModels = require('./zhipuModels');
    console.log('✅ zhipuModels imported successfully');
    
    return true;
  } catch (error) {
    console.error('❌ Dependency check failed:', error);
    return false;
  }
};
```

### 5.2 功能完整性验证

**测试用例 5.2.1: 所有 API 方法可用**
```typescript
const testAllAPIMethodsAvailable = async () => {
  console.log('🔍 Verifying all API methods');
  
  const config = {
    provider: 'zhipu',
    apiKey: process.env.ZHIPU_API_KEY,
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4'
  };
  
  const zhipuService = new ZhipuService(config);
  
  const methods = [
    'generateText',
    'generateImage',
    'analyzeImage',
    'generateVideo',
    'getVideoStatus',
    'testConnection'
  ];
  
  for (const method of methods) {
    console.assert(typeof zhipuService[method] === 'function', `${method} should be a function`);
  }
  
  console.log('✅ All API methods available');
  return true;
};
```

### 5.3 配置验证

**测试用例 5.3.1: 模型配置完整性**
```typescript
const testModelConfigurationCompleteness = async () => {
  console.log('🔍 Verifying model configuration');
  
  const defaultConfig = getDefaultZhipuModels();
  
  const requiredCategories = ['text', 'thinking', 'vision', 'video', 'image'];
  
  for (const category of requiredCategories) {
    console.assert(defaultConfig[category], `${category} model should be configured`);
  }
  
  console.log('✅ Model configuration complete');
  return true;
};
```

---

## 📊 测试执行计划

### 执行顺序

1. **功能测试** (1-2 小时)
   - 文本生成
   - 图像生成
   - 图片分析
   - 视频生成

2. **集成测试** (1-2 小时)
   - 端到端流程
   - 模型切换

3. **性能测试** (30-60 分钟)
   - 响应时间
   - 并发处理

4. **安全测试** (30-45 分钟)
   - API Key 安全
   - 数据安全

5. **部署验证** (15-30 分钟)
   - 环境配置
   - 功能完整性

### 总预计时间

**4-6 小时**

---

## ✅ 测试完成标准

所有测试必须满足以下条件才能视为完成：

- ✅ 所有功能测试通过
- ✅ 所有集成测试通过
- ✅ 性能指标符合预期
- ✅ 安全测试通过
- ✅ 部署验证通过
- ✅ 零关键错误
- ✅ 零安全漏洞

---

## 📝 测试报告模板

```
# 测试执行报告

## 测试日期
[日期]

## 测试环境
- 操作系统: [OS]
- Node.js 版本: [版本]
- 浏览器: [浏览器]

## 测试结果

### 功能测试
- 文本生成: ✅ 通过
- 图像生成: ✅ 通过
- 图片分析: ✅ 通过
- 视频生成: ✅ 通过

### 集成测试
- 端到端流程: ✅ 通过
- 模型切换: ✅ 通过

### 性能测试
- 文本生成平均响应时间: [时间]ms
- 图像生成平均响应时间: [时间]ms
- 并发请求处理: ✅ 通过

### 安全测试
- API Key 安全: ✅ 通过
- 数据安全: ✅ 通过

### 部署验证
- 环境配置: ✅ 通过
- 功能完整性: ✅ 通过

## 总体结论
✅ 所有测试通过，系统生产就绪

## 签核
- 测试人员: [名字]
- 日期: [日期]
```

---

**文档版本**: v1.0
**最后更新**: 2025-12-30
**状态**: 完整测试计划已制定
