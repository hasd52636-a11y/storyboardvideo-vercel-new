# 智谱视频生成 API 确认文档

## 问题
用户询问：视频生成界面到底使用的是神马的 API 还是智谱的？

## 答案
**✅ 视频生成界面使用的是智谱 API**

## 证据

从用户提供的日志可以清楚看到：

```
[ZhipuService] Generating video with cogvideox-flash
[ZhipuService] Video generation response: Object
[ZhipuService] Querying video status for task: 7699757093270424095-8033005802573207710
[ZhipuService] Video status response: Object
[Video Polling #1] Task: 7699757093270424095-8033005802573207710
  Status: IN_PROGRESS
  Progress: 50%
  Elapsed: 0s
...
[Video Polling #22] Task: 7699757093270424095-8033005802573207710
  Status: SUCCESS
  Progress: 100%
  Elapsed: 63s
[Video Polling] ✅ SUCCESS after 63s and 22 polls
```

## 工作流程

### 1. 用户在设置中选择视频 API
- 打开 Settings → 视频生成 API
- 选择 "智谱 GLM (推荐)"
- 输入 Zhipu API Key (格式: glm-xxx)
- 点击 "保存配置"

### 2. 配置保存到 localStorage
```javascript
// 保存的视频配置
{
  provider: 'zhipu',
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
  apiKey: 'glm-xxx...'
}
```

### 3. 右键点击 "生成视频"
- 打开 VideoGenDialog
- 调用 `handleGenerateVideo()`
- 从 localStorage 读取视频配置
- 创建 VideoService 实例，传入配置

### 4. VideoService 检测提供商
```typescript
// videoService.ts
if (this.provider === 'zhipu') {
  return this.createVideoZhipu(prompt, options);
}
```

### 5. 调用 Zhipu API
```typescript
// zhipuService.ts
async generateVideo(prompt, options) {
  const response = await fetch(
    'https://open.bigmodel.cn/api/paas/v4/videos/generations',
    { method: 'POST', ... }
  );
  // 返回 taskId
}
```

### 6. 轮询视频状态
```typescript
// 使用正确的 Zhipu 异步结果查询端点
async getVideoStatus(taskId) {
  const response = await fetch(
    `https://open.bigmodel.cn/api/paas/v4/async-result/${taskId}`,
    { method: 'GET', ... }
  );
}
```

## 显示 50% 然后失败的问题

### 原因
进度计算逻辑不够精确：
```typescript
// 旧代码
progress: result.status === 'SUCCESS' ? '100%' : '50%'
```

这导致处理中的任务总是显示 50%，直到最后才变成 100%。

### 修复
```typescript
// 新代码
let progress = '0%';
if (result.status === 'SUCCESS') {
  progress = '100%';
} else if (result.status === 'PROCESSING') {
  progress = '30%';  // 处理中显示 30%
} else if (result.status === 'FAIL') {
  progress = '0%';
}
```

## 关键文件

| 文件 | 作用 |
|------|------|
| `components/KeySelection.tsx` | 视频 API 配置界面 |
| `videoService.ts` | 视频生成服务（支持多个提供商） |
| `zhipuService.ts` | Zhipu API 集成 |
| `App.tsx` | 主应用，调用视频生成 |

## 验证方法

1. 打开浏览器开发者工具 (F12)
2. 进入 Console 标签
3. 右键点击分镜，选择 "生成视频"
4. 查看日志输出：
   - 如果看到 `[ZhipuService]` 开头的日志 → 使用的是智谱 API ✅
   - 如果看到其他提供商的日志 → 使用的是其他 API

## 部署信息
- 最后部署时间：2025-12-30
- 部署地址：https://sora.wboke.com
- 状态：✅ 已部署并测试通过

## 总结
视频生成界面 **100% 使用智谱 API**。用户在设置中选择的提供商会被正确传递到整个视频生成流程中。
