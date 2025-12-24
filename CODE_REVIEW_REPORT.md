# 全面代码逻辑审查报告

## 执行时间
2024年 - 完整的参数传递、状态管理和API调用流程审查

---

## 1. 参数传递一致性检查

### 1.1 SidebarRight → App.tsx 参数流向

#### ✅ 脚本生成模式 (Script Mode)
**参数设置位置**: SidebarRight.tsx 第 220-280 行
- `frameCount`: 分镜数量 (1-16)
- `scriptStyle`: 风格对象 (StyleOption | null)
- `scriptDuration`: 时长 (0-120秒)
- `scriptAspectRatio`: 画幅比例 (16:9, 4:3, 等)

**传递方式**: 
```typescript
onGenerateFromScript(scriptInput, frameCount, scriptStyle || undefined, scriptAspectRatio, scriptDuration)
```

**接收处理** (App.tsx 第 180-220 行):
```typescript
const handleGenerateFromScript = useCallback(async (scriptText: string, sceneCount: number, style?: any, aspectRatio?: string, duration?: number) => {
```

**问题发现**:
- ❌ **BUG #1**: `duration` 参数在 `handleGenerateFromScript` 中接收但从未使用
  - 参数被接收但没有传递给 `generateSceneImage`
  - 应该在生成图片时考虑时长信息

- ❌ **BUG #2**: `style` 参数类型不一致
  - SidebarRight 传递 `StyleOption | undefined`
  - handleGenerateFromScript 接收 `any`
  - 应该统一为 `StyleOption | undefined`

#### ✅ 创意对话模式 (Chat Mode)
**参数设置位置**: SidebarRight.tsx 第 350-410 行
- `chatFrameCount`: 分镜数量
- `chatStyle`: 风格对象
- `chatDuration`: 时长
- `chatAspectRatio`: 画幅比例

**传递方式**:
```typescript
onGenerateFromDialogue(scenes, chatFrameCount, chatStyle?.id || '', chatAspectRatio || undefined)
```

**问题发现**:
- ❌ **BUG #3**: `chatDuration` 参数在 SidebarRight 中设置但从未传递
  - 第 360 行设置了 `chatDuration`
  - 但在第 155 行调用 `onGenerateFromDialogue` 时没有传递
  - 导致视频生成时无法使用用户设置的时长

- ❌ **BUG #4**: `chatStyle?.id` 传递不一致
  - 传递的是 `styleId` (字符串)
  - 但 `handleGenerateFromDialogue` 需要完整的 `StyleOption` 对象
  - 第 235 行: `const style = STYLES.find(s => s.id === styleId);` 需要查找
  - 这增加了不必要的查找开销

---

## 2. 状态管理一致性检查

### 2.1 currentStyle 和 currentAspectRatio 的同步问题

**定义位置** (App.tsx):
- 第 42: `const [currentStyle, setCurrentStyle] = useState<StyleOption | null>(null);`
- 第 43: `const [currentAspectRatio, setCurrentAspectRatio] = useState<AspectRatio | null>(null);`

**更新方式** (App.tsx):
```typescript
onStyleChange={setCurrentStyle}
onAspectRatioChange={setCurrentAspectRatio}
```

**问题发现**:
- ❌ **BUG #5**: `currentStyle` 和 `currentAspectRatio` 在 SidebarRight 中有本地副本
  - SidebarRight 维护: `scriptStyle`, `chatStyle`, `scriptAspectRatio`, `chatAspectRatio`
  - App.tsx 维护: `currentStyle`, `currentAspectRatio`
  - 两套状态可能不同步
  - 当用户在脚本模式和对话模式之间切换时，状态会丢失

- ❌ **BUG #6**: `getOptimizedPrompts` 使用 `currentStyle` 和 `currentAspectRatio`
  - 但这些值可能不是用户最后设置的值
  - 应该使用当前活跃模式的风格和比例

### 2.2 videoItems 状态更新问题

**定义** (App.tsx 第 45):
```typescript
const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
```

**更新位置** (App.tsx 第 820-860):
```typescript
setVideoItems(prev => [...prev, newVideoItem]);
// 轮询更新
setVideoItems(prev => prev.map(item =>
  item.taskId === result.task_id ? { ...item, progress: status.progress, ... } : item
));
```

**问题发现**:
- ⚠️ **BUG #7**: VideoItem 的 `status` 字段类型不一致
  - VideoService 返回: `'NOT_START' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILURE'`
  - App.tsx 映射为: `'loading' | 'completed' | 'failed'`
  - 类型转换逻辑在第 835-838 行，但没有处理 `NOT_START` 状态

### 2.3 selectedIds 和 selectionOrder 的同步

**定义** (App.tsx):
- 第 26: `const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());`
- 第 27: `const [selectionOrder, setSelectionOrder] = useState<string[]>([]);`

**问题发现**:
- ❌ **BUG #8**: 删除操作中的不同步
  - 第 130 行: 删除时只清空 `selectedIds` 和 `selectionOrder`
  - 但在 `handleBatchRedraw` 中 (第 750 行)，如果 `selectionOrder` 为空，会重新排序
  - 这可能导致批量重绘时的顺序与用户选择顺序不符

---

## 3. API 调用逻辑检查

### 3.1 generateSceneImage 调用参数

**调用位置**: App.tsx 第 200-210 行 (脚本模式)

```typescript
const imageUrl = await generateSceneImage(enrichedPrompt, true, isBlackAndWhite, style, aspectRatio);
```

**参数映射**:
- `enrichedPrompt`: ✅ 正确
- `true`: ✅ 正确 (useCache)
- `isBlackAndWhite`: ✅ 正确
- `style`: ⚠️ 可能为 undefined
- `aspectRatio`: ✅ 正确

**问题发现**:
- ❌ **BUG #9**: 当 `style` 为 undefined 时的处理
  - 第 200 行: `const imageUrl = await generateSceneImage(enrichedPrompt, true, isBlackAndWhite, style, aspectRatio);`
  - 如果用户没有选择风格，`style` 为 undefined
  - generateSceneImage 可能没有默认值处理

### 3.2 VideoService.createVideo 参数映射

**调用位置**: App.tsx 第 810-820 行

```typescript
const result = await videoServiceRef.current.createVideo(prompt, {
  model: options.model,
  aspect_ratio: options.aspect_ratio,
  duration: options.duration,
  hd: options.hd,
  images: images.length > 0 ? images : undefined
});
```

**问题发现**:
- ✅ 参数映射正确
- ⚠️ **BUG #10**: `images` 参数的处理
  - 当 `images.length === 0` 时，传递 `undefined`
  - VideoService 应该验证这个参数

### 3.3 轮询机制中的状态转换

**轮询代码** (App.tsx 第 825-860):

```typescript
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
  ...
);
```

**问题发现**:
- ❌ **BUG #11**: 状态转换逻辑不完整
  - 只处理了 SUCCESS 和 FAILURE
  - 没有处理 IN_PROGRESS 状态的进度更新
  - 当状态为 IN_PROGRESS 时，应该显示进度百分比

---

## 4. 用户交互流程检查

### 4.1 脚本生成模式流向

```
用户输入脚本 → 设置参数 (风格、比例、时长) → 点击"生成"
  ↓
onGenerateFromScript(scriptInput, frameCount, scriptStyle, scriptAspectRatio, scriptDuration)
  ↓
handleGenerateFromScript 接收参数
  ↓
❌ duration 参数丢失
  ↓
generateSceneImage 调用 (缺少时长信息)
  ↓
生成分镜图片
```

**问题**: duration 参数未被使用

### 4.2 创意对话模式流向

```
用户输入创意想法 → 与AI对话 → 设置参数 (分镜数、风格、比例、时长)
  ↓
点击"生成分镜"
  ↓
handleGenerateStoryboard()
  ↓
generateStoryboardFromDialogue(chatHistory, chatFrameCount, styleName, chatDuration, chatAspectRatio, lang)
  ↓
❌ 但 onGenerateFromDialogue 调用时没有传递 chatDuration
  ↓
handleGenerateFromDialogue 接收参数
  ↓
generateSceneImage 调用 (缺少时长信息)
```

**问题**: chatDuration 在 SidebarRight 中设置但未传递

### 4.3 视频生成流向

```
用户选择分镜 → 点击"生成视频"
  ↓
handleGenerateVideoFromContextMenu() 或 直接打开 VideoGenDialog
  ↓
VideoGenDialog 中设置参数:
  - model: sora-2 | sora-2-pro
  - aspect_ratio: 16:9 | 9:16
  - duration: 10 | 15 | 25
  - hd: boolean
  ↓
onGenerate(prompt, options)
  ↓
handleGenerateVideo(prompt, options)
  ↓
VideoService.createVideo(prompt, options)
  ↓
轮询获取视频状态
```

**问题**: 
- ❌ VideoGenDialog 中的 `aspect_ratio` 选项只有 16:9 和 9:16
- ❌ 但分镜可能是其他比例 (4:3, 1:1 等)
- ❌ 没有验证视频比例与分镜比例的匹配

---

## 5. 极限情况处理检查

### 5.1 无参数设置时的默认值

**脚本模式**:
- `frameCount`: 默认 1 ✅
- `scriptStyle`: 默认 null ❌ (应该有默认风格)
- `scriptDuration`: 默认 0 ❌ (0秒无效)
- `scriptAspectRatio`: 默认 null ❌ (应该有默认比例)

**创意对话模式**:
- `chatFrameCount`: 默认 1 ✅
- `chatStyle`: 默认 null ❌
- `chatDuration`: 默认 0 ❌
- `chatAspectRatio`: 默认 null ❌

### 5.2 参数为空/null 时的处理

**问题发现**:
- ❌ **BUG #12**: 当 `scriptStyle` 为 null 时
  - 第 200 行: `const imageUrl = await generateSceneImage(enrichedPrompt, true, isBlackAndWhite, style, aspectRatio);`
  - `style` 为 undefined，generateSceneImage 可能没有默认处理

- ❌ **BUG #13**: 当 `scriptAspectRatio` 为 null 时
  - 第 195 行: `const height = calculateHeight(baseWidth, aspectRatio || '16:9');`
  - 虽然有默认值 '16:9'，但这与用户的选择不符

- ❌ **BUG #14**: 当 `chatDuration` 为 0 时
  - 第 155 行: `chatDuration > 0 ? chatDuration : undefined`
  - 但 VideoService 可能需要有效的时长值

### 5.3 参数类型不匹配时的处理

**问题发现**:
- ❌ **BUG #15**: VideoGenDialog 中的 duration 类型
  - 定义为: `const [duration, setDuration] = useState(10);`
  - 但 select 选项中的值是数字: `<option value={10}>`
  - 当用户选择时，`e.target.value` 是字符串，需要 `Number()` 转换
  - 第 95 行: `onChange={(e) => setDuration(Number(e.target.value))}`
  - ✅ 这里正确处理了

- ❌ **BUG #16**: VideoGenDialog 中的 model 类型
  - 定义为: `const [model, setModel] = useState<'sora-2' | 'sora-2-pro'>('sora-2-pro');`
  - 第 85 行: `onChange={(e) => setModel(e.target.value as any)}`
  - 使用了 `as any`，应该改为: `as 'sora-2' | 'sora-2-pro'`

---

## 6. 批量重绘逻辑检查

**位置**: App.tsx 第 740-790 行

**问题发现**:
- ❌ **BUG #17**: 批量重绘中的序号生成
  - 第 760 行: `const sceneNum = `SC-${String(i + 1).padStart(2, '0')}`;`
  - 这里使用的是循环索引 `i`，而不是原始的 `order` 属性
  - 如果用户选择了非连续的分镜，序号会不正确

- ❌ **BUG #18**: 批量重绘中的符号处理
  - 第 770 行: 符号信息被添加到 finalPrompt
  - 但这可能导致提示词过长，超过 API 限制

---

## 7. 导出提示词逻辑检查

**位置**: App.tsx 第 330-420 行

**问题发现**:
- ⚠️ **BUG #19**: `getOptimizedPrompts` 中的风格信息
  - 第 340 行: `const styleInfo = currentStyle?.nameZh || currentStyle?.name || '写实摄影';`
  - 但 `currentStyle` 可能不是用户最后设置的值
  - 应该从当前活跃的模式中获取

- ⚠️ **BUG #20**: 提示词中的场景编号
  - 第 355 行: `const sceneNum = `SC-${String(it.order + 1).padStart(2, '0')}`;`
  - 使用 `order` 属性，但这可能与用户的选择顺序不符
  - 应该使用 `selectionOrder` 中的位置

---

## 8. 总结：发现的所有 BUG

| BUG # | 严重性 | 位置 | 问题描述 | 影响范围 |
|-------|--------|------|---------|---------|
| #1 | 高 | App.tsx:200 | duration 参数接收但未使用 | 脚本生成模式 |
| #2 | 中 | App.tsx:180 | style 参数类型不一致 | 脚本生成模式 |
| #3 | 高 | SidebarRight:155 | chatDuration 未传递 | 创意对话模式 |
| #4 | 中 | SidebarRight:155 | 传递 styleId 而非 StyleOption | 创意对话模式 |
| #5 | 高 | App.tsx:42-43 | currentStyle/currentAspectRatio 与本地状态不同步 | 全局状态管理 |
| #6 | 中 | App.tsx:340 | getOptimizedPrompts 使用过时的状态 | 导出功能 |
| #7 | 中 | App.tsx:835 | VideoItem status 类型转换不完整 | 视频生成 |
| #8 | 中 | App.tsx:750 | 批量重绘中 selectionOrder 同步问题 | 批量重绘 |
| #9 | 中 | App.tsx:200 | style 为 undefined 时无默认处理 | 脚本生成 |
| #10 | 低 | App.tsx:815 | images 参数验证不足 | 视频生成 |
| #11 | 中 | App.tsx:835 | 轮询状态转换不完整 | 视频生成 |
| #12 | 中 | App.tsx:200 | scriptStyle 为 null 时无默认值 | 脚本生成 |
| #13 | 低 | App.tsx:195 | scriptAspectRatio 为 null 时的默认值处理 | 脚本生成 |
| #14 | 中 | App.tsx:155 | chatDuration 为 0 时的处理 | 创意对话 |
| #15 | 低 | VideoGenDialog:95 | duration 类型转换 (已正确处理) | 视频生成 |
| #16 | 低 | VideoGenDialog:85 | model 类型转换使用 as any | 视频生成 |
| #17 | 高 | App.tsx:760 | 批量重绘序号生成错误 | 批量重绘 |
| #18 | 中 | App.tsx:770 | 批量重绘符号信息可能导致提示词过长 | 批量重绘 |
| #19 | 中 | App.tsx:340 | getOptimizedPrompts 使用过时的风格信息 | 导出功能 |
| #20 | 中 | App.tsx:355 | 导出提示词中的场景编号与选择顺序不符 | 导出功能 |

