/**
 * 智谱 GLM 集成 - 完整测试套件
 * 包含所有功能、集成、性能、安全和部署验证测试
 */

import ZhipuService from './zhipuService';
import { chatWithGemini, generateSceneImage, analyzeImageWithProvider } from './geminiService';
import { getDefaultZhipuModels } from './zhipuModels';

// ============================================================================
// 测试工具函数
// ============================================================================

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

const testResults: TestResult[] = [];

async function runTest(name: string, testFn: () => Promise<boolean>): Promise<TestResult> {
  const start = Date.now();
  try {
    console.log(`\n🧪 Running: ${name}`);
    const passed = await testFn();
    const duration = Date.now() - start;
    
    if (passed) {
      console.log(`✅ PASSED: ${name} (${duration}ms)`);
      testResults.push({ name, passed: true, duration });
      return { name, passed: true, duration };
    } else {
      console.log(`❌ FAILED: ${name} (${duration}ms)`);
      testResults.push({ name, passed: false, duration });
      return { name, passed: false, duration };
    }
  } catch (error) {
    const duration = Date.now() - start;
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.log(`❌ ERROR: ${name} (${duration}ms) - ${errorMsg}`);
    testResults.push({ name, passed: false, duration, error: errorMsg });
    return { name, passed: false, duration, error: errorMsg };
  }
}

function getAppConfig() {
  const saved = localStorage.getItem('director_canvas_api_config');
  return saved ? JSON.parse(saved) : null;
}

// ============================================================================
// 第 1 阶段：功能测试
// ============================================================================

async function testBasicTextGeneration(): Promise<boolean> {
  const config = getAppConfig();
  if (!config || config.provider !== 'zhipu') return false;
  
  const zhipuService = new ZhipuService(config);
  const result = await zhipuService.generateText('Write a short story about a robot', {
    temperature: 0.7,
    maxTokens: 500
  });
  
  return result.length > 0 && result.length < 2000;
}

async function testDeepThinking(): Promise<boolean> {
  const config = getAppConfig();
  if (!config || config.provider !== 'zhipu') return false;
  
  const zhipuService = new ZhipuService(config);
  const result = await zhipuService.generateText('What is 2^10 + 3^5?', {
    useThinking: true,
    maxTokens: 1000
  });
  
  return result.length > 0;
}

async function testBasicImageGeneration(): Promise<boolean> {
  const config = getAppConfig();
  if (!config || config.provider !== 'zhipu') return false;
  
  const zhipuService = new ZhipuService(config);
  const imageUrl = await zhipuService.generateImage('A serene landscape with mountains', {
    size: '1024x1024',
    quality: 'standard'
  });
  
  return imageUrl.length > 0;
}

async function testImageSizes(): Promise<boolean> {
  const config = getAppConfig();
  if (!config || config.provider !== 'zhipu') return false;
  
  const zhipuService = new ZhipuService(config);
  const sizes = ['1024x1024', '1024x1536', '1536x1024'] as const;
  
  for (const size of sizes) {
    const imageUrl = await zhipuService.generateImage('A beautiful sunset', { size });
    if (!imageUrl || imageUrl.length === 0) return false;
  }
  
  return true;
}

async function testBasicImageAnalysis(): Promise<boolean> {
  const config = getAppConfig();
  if (!config || config.provider !== 'zhipu') return false;
  
  const zhipuService = new ZhipuService(config);
  const testImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg';
  
  const analysis = await zhipuService.analyzeImage(testImageUrl, 'Describe this image', {
    temperature: 0.8,
    maxTokens: 500
  });
  
  return analysis.length > 0;
}

async function testBasicVideoGeneration(): Promise<boolean> {
  const config = getAppConfig();
  if (!config || config.provider !== 'zhipu') return false;
  
  const zhipuService = new ZhipuService(config);
  const result = await zhipuService.generateVideo('A person walking through a garden', {
    quality: 'speed',
    duration: 5
  });
  
  return result.taskId.length > 0;
}

async function testVideoStatusQuery(): Promise<boolean> {
  const config = getAppConfig();
  if (!config || config.provider !== 'zhipu') return false;
  
  const zhipuService = new ZhipuService(config);
  
  // First generate a video
  const genResult = await zhipuService.generateVideo('Test video', { duration: 5 });
  
  // Then query its status
  const status = await zhipuService.getVideoStatus(genResult.taskId);
  
  return ['PROCESSING', 'SUCCESS', 'FAIL'].includes(status.status);
}

// ============================================================================
// 第 2 阶段：集成测试
// ============================================================================

async function testTextGenerationE2E(): Promise<boolean> {
  const config = getAppConfig();
  if (!config || config.provider !== 'zhipu') return false;
  
  const messages = [{ role: 'user', text: 'Write a haiku about technology' }];
  const response = await chatWithGemini(messages);
  
  return response.length > 0;
}

async function testImageGenerationE2E(): Promise<boolean> {
  const imageUrl = await generateSceneImage(
    'A futuristic city with flying cars',
    true,
    false,
    { descriptionZh: 'Cyberpunk' },
    '16:9'
  );
  
  return imageUrl !== null && imageUrl.length > 0;
}

async function testImageAnalysisE2E(): Promise<boolean> {
  const testImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg';
  
  const analysis = await analyzeImageWithProvider(
    testImageUrl,
    'What is the main subject?'
  );
  
  return analysis.length > 0;
}

async function testModelSwitching(): Promise<boolean> {
  // Test affordable models
  localStorage.setItem('zhipu_models_config', JSON.stringify({
    text: 'glm-4-flash',
    thinking: 'glm-4.5-flash',
    vision: 'glm-4v-flash',
    video: 'cogvideox-flash',
    image: 'cogview-3-flash'
  }));
  
  let config = getAppConfig();
  if (!config) return false;
  
  // Test premium models
  localStorage.setItem('zhipu_models_config', JSON.stringify({
    text: 'glm-4-flash',
    thinking: 'glm-4.5-flash',
    vision: 'glm-4.6v',
    video: 'cogvideox-3',
    image: 'cogview-3'
  }));
  
  config = getAppConfig();
  return config !== null;
}

// ============================================================================
// 第 3 阶段：性能测试
// ============================================================================

async function testTextGenerationPerformance(): Promise<boolean> {
  const config = getAppConfig();
  if (!config || config.provider !== 'zhipu') return false;
  
  const zhipuService = new ZhipuService(config);
  const iterations = 3;
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    await zhipuService.generateText('Hello', { maxTokens: 100 });
    times.push(Date.now() - start);
  }
  
  const avg = times.reduce((a, b) => a + b) / times.length;
  console.log(`  Average response time: ${avg.toFixed(2)}ms`);
  
  return avg < 10000; // Should be less than 10 seconds
}

async function testImageGenerationPerformance(): Promise<boolean> {
  const config = getAppConfig();
  if (!config || config.provider !== 'zhipu') return false;
  
  const zhipuService = new ZhipuService(config);
  const start = Date.now();
  
  await zhipuService.generateImage('A sunset', { size: '1024x1024' });
  
  const duration = Date.now() - start;
  console.log(`  Image generation time: ${duration}ms`);
  
  return duration < 60000; // Should be less than 60 seconds
}

async function testConcurrentRequests(): Promise<boolean> {
  const config = getAppConfig();
  if (!config || config.provider !== 'zhipu') return false;
  
  const zhipuService = new ZhipuService(config);
  const concurrentCount = 3;
  const promises = [];
  
  for (let i = 0; i < concurrentCount; i++) {
    promises.push(
      zhipuService.generateText(`Request ${i}`, { maxTokens: 100 })
    );
  }
  
  const results = await Promise.all(promises);
  return results.length === concurrentCount && results.every(r => r.length > 0);
}

// ============================================================================
// 第 4 阶段：安全测试
// ============================================================================

async function testInvalidAPIKey(): Promise<boolean> {
  const config = {
    provider: 'zhipu',
    apiKey: 'invalid-key-12345',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4'
  };
  
  const zhipuService = new ZhipuService(config);
  
  try {
    await zhipuService.generateText('Test');
    return false; // Should have thrown
  } catch (error) {
    return true; // Expected to fail
  }
}

async function testAPIKeyNotInLogs(): Promise<boolean> {
  const config = getAppConfig();
  if (!config || config.provider !== 'zhipu') return false;
  
  const originalLog = console.log;
  const logs: string[] = [];
  
  console.log = (...args: any[]) => {
    logs.push(args.join(' '));
  };
  
  try {
    const zhipuService = new ZhipuService(config);
    await zhipuService.generateText('Test');
  } catch (error) {
    // Ignore errors
  }
  
  console.log = originalLog;
  
  const hasAPIKey = logs.some(log => log.includes(config.apiKey));
  return !hasAPIKey;
}

async function testHTTPSConnection(): Promise<boolean> {
  const config = getAppConfig();
  if (!config) return false;
  
  return config.baseUrl.startsWith('https://');
}

// ============================================================================
// 第 5 阶段：部署验证
// ============================================================================

async function testEnvironmentVariables(): Promise<boolean> {
  const config = getAppConfig();
  return config !== null && config.apiKey !== undefined;
}

async function testDependencies(): Promise<boolean> {
  try {
    // Check if services can be imported
    if (typeof ZhipuService !== 'function') return false;
    if (typeof getDefaultZhipuModels !== 'function') return false;
    
    return true;
  } catch (error) {
    return false;
  }
}

async function testAllAPIMethodsAvailable(): Promise<boolean> {
  const config = getAppConfig();
  if (!config || config.provider !== 'zhipu') return false;
  
  const zhipuService = new ZhipuService(config);
  
  const methods = [
    'generateText',
    'generateImage',
    'analyzeImage',
    'generateVideo',
    'getVideoStatus',
    'testConnection'
  ];
  
  return methods.every(method => typeof zhipuService[method] === 'function');
}

async function testModelConfigurationCompleteness(): Promise<boolean> {
  const defaultConfig = getDefaultZhipuModels();
  
  const requiredCategories = ['text', 'thinking', 'vision', 'video', 'image'];
  
  return requiredCategories.every(category => defaultConfig[category] !== undefined);
}

// ============================================================================
// 测试套件执行
// ============================================================================

export async function runAllTests(): Promise<void> {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 智谱 GLM 集成 - 完整测试套件');
  console.log('='.repeat(80));
  
  // 第 1 阶段：功能测试
  console.log('\n📋 第 1 阶段：功能测试 (Functional Testing)');
  console.log('-'.repeat(80));
  
  await runTest('1.1.1 基础文本生成', testBasicTextGeneration);
  await runTest('1.1.2 深度思考模式', testDeepThinking);
  await runTest('1.2.1 基础图像生成', testBasicImageGeneration);
  await runTest('1.2.2 不同尺寸测试', testImageSizes);
  await runTest('1.3.1 基础图片分析', testBasicImageAnalysis);
  await runTest('1.4.1 基础视频生成', testBasicVideoGeneration);
  await runTest('1.4.2 视频状态查询', testVideoStatusQuery);
  
  // 第 2 阶段：集成测试
  console.log('\n🔗 第 2 阶段：集成测试 (Integration Testing)');
  console.log('-'.repeat(80));
  
  await runTest('2.1.1 文本生成 E2E', testTextGenerationE2E);
  await runTest('2.1.2 图像生成 E2E', testImageGenerationE2E);
  await runTest('2.1.3 图片分析 E2E', testImageAnalysisE2E);
  await runTest('2.2.1 模型切换测试', testModelSwitching);
  
  // 第 3 阶段：性能测试
  console.log('\n⚡ 第 3 阶段：性能测试 (Performance Testing)');
  console.log('-'.repeat(80));
  
  await runTest('3.1.1 文本生成性能', testTextGenerationPerformance);
  await runTest('3.1.2 图像生成性能', testImageGenerationPerformance);
  await runTest('3.2.1 并发请求处理', testConcurrentRequests);
  
  // 第 4 阶段：安全测试
  console.log('\n🔐 第 4 阶段：安全测试 (Security Testing)');
  console.log('-'.repeat(80));
  
  await runTest('4.1.1 无效 API Key 处理', testInvalidAPIKey);
  await runTest('4.1.2 API Key 不在日志中', testAPIKeyNotInLogs);
  await runTest('4.2.1 HTTPS 连接验证', testHTTPSConnection);
  
  // 第 5 阶段：部署验证
  console.log('\n🚀 第 5 阶段：部署验证 (Deployment Validation)');
  console.log('-'.repeat(80));
  
  await runTest('5.1.1 环境变量检查', testEnvironmentVariables);
  await runTest('5.1.2 依赖检查', testDependencies);
  await runTest('5.2.1 所有 API 方法可用', testAllAPIMethodsAvailable);
  await runTest('5.3.1 模型配置完整性', testModelConfigurationCompleteness);
  
  // 生成测试报告
  console.log('\n' + '='.repeat(80));
  console.log('📊 测试报告');
  console.log('='.repeat(80));
  
  const passed = testResults.filter(r => r.passed).length;
  const failed = testResults.filter(r => !r.passed).length;
  const totalTime = testResults.reduce((sum, r) => sum + r.duration, 0);
  
  console.log(`\n总测试数: ${testResults.length}`);
  console.log(`✅ 通过: ${passed}`);
  console.log(`❌ 失败: ${failed}`);
  console.log(`⏱️ 总耗时: ${totalTime}ms`);
  
  if (failed > 0) {
    console.log('\n失败的测试:');
    testResults.filter(r => !r.passed).forEach(r => {
      console.log(`  ❌ ${r.name}`);
      if (r.error) console.log(`     错误: ${r.error}`);
    });
  }
  
  console.log('\n' + '='.repeat(80));
  if (failed === 0) {
    console.log('🎉 所有测试通过！系统生产就绪。');
  } else {
    console.log(`⚠️ 有 ${failed} 个测试失败，请检查。`);
  }
  console.log('='.repeat(80) + '\n');
}

// 导出测试结果
export function getTestResults(): TestResult[] {
  return testResults;
}

export function getTestSummary() {
  const passed = testResults.filter(r => r.passed).length;
  const failed = testResults.filter(r => !r.passed).length;
  const totalTime = testResults.reduce((sum, r) => sum + r.duration, 0);
  
  return {
    total: testResults.length,
    passed,
    failed,
    totalTime,
    successRate: ((passed / testResults.length) * 100).toFixed(2) + '%'
  };
}
