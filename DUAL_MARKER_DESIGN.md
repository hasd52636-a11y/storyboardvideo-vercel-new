# 双标记设计 - 分别标记画面提示词和视频提示词

## 设计方案

### 推荐方案：使用不同的标记符号

**画面提示词**: 使用 `<<<` 和 `>>>`
**视频提示词**: 使用 `{{{` 和 `}}}`

```
<<<
画面提示词内容...
>>>
{{{
视频提示词内容...
}}}
```

---

## 完整示例

### AI返回格式

```
<<<
在一个幽静的夜晚，小屋的角落里，一只小老鼠正机警地向前探索。它细长的胡须微微颤动，四处张望，准备冒险偷取放在桌子上的奶酪。月光透过窗户洒在地板上，为它的行动提供了微弱的照明。
>>>
{{{
小老鼠缓缓移动，心跳加速，屏住呼吸，朝目标迈出勇敢的一步。月光下的阴影随着它的移动而变化，摄像机跟随其动作，捕捉紧张的气氛。
}}}
<<<
就在小老鼠快要接近奶酪时，一双闪着绿光的眼睛从阴影中浮现。一只优雅的猫悄然出现，运用它天然的潜伏技巧，安静地接近老鼠。
>>>
{{{
猫的身体低伏，尾巴有节奏地轻轻拍打着地板，发出威胁的低沉声响。摄像机从猫的视角拍摄，展现其捕食者的优雅和危险。小老鼠停止一切动作，紧张地盯着猫。
}}}
<<<
两者对峙片刻，猫做出了意想不到的举动：它缓缓地用爪子推了推桌子上的奶酪，示意小老鼠可以放心享用。
>>>
{{{
猫的动作缓慢而温柔，目光柔和。小老鼠迟疑地移动，又看看猫。摄像机在两者之间切换，捕捉这一刻的和解。小老鼠最终鼓起勇气，快速地叼起奶酪，消失在墙角。
}}}
```

---

## 提取函数

```typescript
interface SceneWithPrompts {
  index: number;
  visualPrompt: string;
  videoPrompt: string;
}

export const extractScenesWithDualMarkers = (text: string): SceneWithPrompts[] => {
  console.log('[extractScenesWithDualMarkers] 开始提取场景...');
  
  // 提取画面提示词：<<< ... >>>
  const visualPattern = /<<<(.*?)>>>/gs;
  // 提取视频提示词：{{{ ... }}}
  const videoPattern = /\{\{\{(.*?)\}\}\}/gs;
  
  const scenes: SceneWithPrompts[] = [];
  
  let visualMatch;
  let visualIndex = 0;
  const visualPrompts: string[] = [];
  
  // 第一步：提取所有画面提示词
  while ((visualMatch = visualPattern.exec(text)) !== null) {
    const content = visualMatch[1].trim();
    
    if (content.length === 0) {
      console.warn(`[extractScenesWithDualMarkers] 跳过空的画面提示词`);
      continue;
    }
    
    console.log(`[extractScenesWithDualMarkers] ✅ 提取画面提示词 ${visualIndex + 1}`);
    console.log(`[extractScenesWithDualMarkers]   长度: ${content.length} 字符`);
    
    visualPrompts.push(content);
    visualIndex++;
  }
  
  let videoMatch;
  let videoIndex = 0;
  const videoPrompts: string[] = [];
  
  // 第二步：提取所有视频提示词
  while ((videoMatch = videoPattern.exec(text)) !== null) {
    const content = videoMatch[1].trim();
    
    if (content.length === 0) {
      console.warn(`[extractScenesWithDualMarkers] 跳过空的视频提示词`);
      continue;
    }
    
    console.log(`[extractScenesWithDualMarkers] ✅ 提取视频提示词 ${videoIndex + 1}`);
    console.log(`[extractScenesWithDualMarkers]   长度: ${content.length} 字符`);
    
    videoPrompts.push(content);
    videoIndex++;
  }
  
  // 第三步：配对画面和视频提示词
  const sceneCount = Math.max(visualPrompts.length, videoPrompts.length);
  
  for (let i = 0; i < sceneCount; i++) {
    scenes.push({
      index: i,
      visualPrompt: visualPrompts[i] || '',
      videoPrompt: videoPrompts[i] || ''
    });
  }
  
  console.log(`[extractScenesWithDualMarkers] ✅ 总共提取 ${scenes.length} 个场景`);
  console.log(`[extractScenesWithDualMarkers]   画面提示词: ${visualPrompts.length} 个`);
  console.log(`[extractScenesWithDualMarkers]   视频提示词: ${videoPrompts.length} 个`);
  
  return scenes;
};
```

---

## 系统提示词（中文版本）

```
**文 你是一位创意故事编剧。用户会给你一个故事概念或简短描述。

【你的任务】
根据用户的输入，创作一个完整的故事，分成指定数量的场景。

【返回格式要求】
每个场景必须按照以下格式返回，不能有任何偏差：

<<<
画面提示词：详细描述这个场景的视觉内容、环境、角色动作等
>>>
{{{
视频提示词：描述这个场景的动态效果、摄像机运动、角色表情变化等
}}}

【格式说明】
- 画面提示词开始标记：<<< （三个小于号）
- 画面提示词结束标记：>>> （三个大于号）
- 视频提示词开始标记：{{{ （三个左花括号）
- 视频提示词结束标记：}}} （三个右花括号）
- 每个场景的画面提示词和视频提示词必须成对出现
- 场景之间直接相连，不要有空行或其他文本

【内容要求】
1. 画面提示词：200-300字，详细描述视觉内容
   - 环境描写（光线、颜色、氛围）
   - 角色外观和姿态
   - 物体和场景细节
   - 不要包含任何指令或分析文本

2. 视频提示词：150-200字，描述动态效果
   - 角色的动作和表情变化
   - 摄像机运动（推、拉、摇、移）
   - 光线和阴影的变化
   - 场景之间的过渡
   - 不要包含任何指令或分析文本

3. 场景之间要有逻辑连接和故事递进
4. 保持故事的完整性和连贯性
5. 不要在格式标记外添加任何其他文本

【示例】
<<<
故事开场的场景视觉描写...
>>>
{{{
故事开场的动态效果描写...
}}}
<<<
故事发展的场景视觉描写...
>>>
{{{
故事发展的动态效果描写...
}}}
<<<
故事高潮的场景视觉描写...
>>>
{{{
故事高潮的动态效果描写...
}}}
```

---

## 提取结果示例

```json
{
  "scenes": [
    {
      "index": 0,
      "visualPrompt": "在一个幽静的夜晚，小屋的角落里，一只小老鼠正机警地向前探索。它细长的胡须微微颤动，四处张望，准备冒险偷取放在桌子上的奶酪。月光透过窗户洒在地板上，为它的行动提供了微弱的照明。",
      "videoPrompt": "小老鼠缓缓移动，心跳加速，屏住呼吸，朝目标迈出勇敢的一步。月光下的阴影随着它的移动而变化，摄像机跟随其动作，捕捉紧张的气氛。"
    },
    {
      "index": 1,
      "visualPrompt": "就在小老鼠快要接近奶酪时，一双闪着绿光的眼睛从阴影中浮现。一只优雅的猫悄然出现，运用它天然的潜伏技巧，安静地接近老鼠。",
      "videoPrompt": "猫的身体低伏，尾巴有节奏地轻轻拍打着地板，发出威胁的低沉声响。摄像机从猫的视角拍摄，展现其捕食者的优雅和危险。小老鼠停止一切动作，紧张地盯着猫。"
    },
    {
      "index": 2,
      "visualPrompt": "两者对峙片刻，猫做出了意想不到的举动：它缓缓地用爪子推了推桌子上的奶酪，示意小老鼠可以放心享用。",
      "videoPrompt": "猫的动作缓慢而温柔，目光柔和。小老鼠迟疑地移动，又看看猫。摄像机在两者之间切换，捕捉这一刻的和解。小老鼠最终鼓起勇气，快速地叼起奶酪，消失在墙角。"
    }
  ],
  "totalScenes": 3
}
```

---

## 优势

✅ **清晰分离** - 画面提示词和视频提示词用不同标记
✅ **易于识别** - `<<<>>>` 和 `{{{}}}`视觉上完全不同
✅ **易于提取** - 两个独立的正则表达式
✅ **易于配对** - 按顺序自动配对
✅ **易于扩展** - 支持任意数量的场景
✅ **容错性强** - 自动处理空格和换行符

---

## 标记对比

| 标记 | 用途 | 示例 |
|------|------|------|
| `<<<` `>>>` | 画面提示词 | `<<< 视觉描写 >>>` |
| `{{{` `}}}` | 视频提示词 | `{{{ 动态描写 }}}` |

---

## 集成到代码

在 `geminiService.ts` 中添加：

```typescript
export const extractScenesWithDualMarkers = (text: string): Array<{
  index: number;
  visualPrompt: string;
  videoPrompt: string;
}> => {
  // ... 提取函数实现
};
```

然后在 `App.tsx` 中使用：

```typescript
const scenes = extractScenesWithDualMarkers(aiResponse);
// scenes 现在包含分离的 visualPrompt 和 videoPrompt
```
