# 自定义标记工作流 - 二创提示词 + 自动提取

## 工作流程

```
用户输入 → AI生成（按##@@格式） → 系统自动提取 → 生成分镜
```

---

## 第一步：二创系统提示词

### 中文版本
```
**文 你是一位创意故事编剧。用户会给你一个故事概念或简短描述。

【你的任务】
根据用户的输入，创作一个完整的故事，分成指定数量的场景。

【返回格式要求】
每个场景必须按照以下格式返回，不能有任何偏差：

**##@@场景标题**
场景的完整描述和内容...
*】

【格式说明】
- 开始标记：**##@@ 后面跟场景标题（如：画面一、Scene 1等）
- 内容：场景的完整描述，可以多行
- 结束标记：*】（必须在内容后面）
- 每个场景之间直接相连，不要有空行或其他文本

【内容要求】
1. 每个场景描述要详细生动，200-300字
2. 场景之间要有逻辑连接和故事递进
3. 保持故事的完整性和连贯性
4. 不要在格式标记外添加任何其他文本
5. 不要添加编号、序号或其他标记

【示例】
**##@@开场**
故事开始的场景描述...
*】**##@@发展**
故事发展的场景描述...
*】**##@@高潮**
故事高潮的场景描述...
*】
```

### 英文版本
```
**文 You are a creative story writer. The user will give you a story concept or brief description.

【Your Task】
Based on the user's input, create a complete story divided into the specified number of scenes.

【Return Format Requirements】
Each scene must be returned in the following format, with no deviation:

**##@@Scene Title**
Complete description and content of the scene...
*】

【Format Explanation】
- Start marker: **##@@ followed by scene title (e.g., Scene 1, Opening, etc.)
- Content: Complete description of the scene, can be multiple lines
- End marker: *】(must be after the content)
- Scenes are directly connected without blank lines or other text between them

【Content Requirements】
1. Each scene description should be detailed and vivid, 200-300 words
2. Logical connection and story progression between scenes
3. Maintain story completeness and coherence
4. Do not add any other text outside the format markers
5. Do not add numbering, sequences, or other markers

【Example】
**##@@Opening**
Scene description of the story beginning...
*】**##@@Development**
Scene description of the story development...
*】**##@@Climax**
Scene description of the story climax...
*】
```

---

## 第二步：用户输入示例

```
创作三个画面的故事，老鼠与猫。
```

---

## 第三步：AI返回（按格式）

```
**##@@画面一**
在一个幽静的夜晚，小屋的角落里，一只小老鼠正机警地向前探索。它细长的胡须微微颤动，四处张望，准备冒险偷取放在桌子上的奶酪。月光透过窗户洒在地板上，为它的行动提供了微弱的照明。小老鼠心跳加速，屏住呼吸，朝目标迈出了勇敢的一步。
*】**##@@画面二**
就在小老鼠快要接近奶酪时，一双闪着绿光的眼睛从阴影中浮现。一只优雅的猫悄然出现，运用它天然的潜伏技巧，安静地接近老鼠。猫没有急着扑过去，而是坐下来，用它的尾巴有节奏地轻轻拍打着地板，发出了一种让人感到威胁的低沉声响。小老鼠停止了一切动作，紧张地盯着猫，眼神里充满了恐惧与惊讶。
*】**##@@画面三**
两者对峙片刻，猫做出了意想不到的举动：它缓缓地用爪子推了推桌子上的奶酪，示意小老鼠可以放心享用。小老鼠迟疑地移动了一下，又看看猫，似乎在确认这是一个意外的仁慈。猫回头，目光柔和，似乎在传达一种不寻常的和解。小老鼠最终鼓起勇气，快速地叼起奶酪，消失在墙角，而猫则转身，继续它的夜间巡视，宛如一位宽容的守护者。
*】
```

---

## 第四步：系统自动提取

### 提取函数调用
```typescript
const aiResponse = "**##@@画面一**...内容...*】**##@@画面二**...内容...*】**##@@画面三**...内容...*】";
const extractedScenes = extractScenesByCustomMarker(aiResponse);
```

### 提取结果
```json
{
  "scenes": [
    {
      "index": 0,
      "description": "在一个幽静的夜晚，小屋的角落里，一只小老鼠正机警地向前探索。它细长的胡须微微颤动，四处张望，准备冒险偷取放在桌子上的奶酪。月光透过窗户洒在地板上，为它的行动提供了微弱的照明。小老鼠心跳加速，屏住呼吸，朝目标迈出了勇敢的一步。",
      "visualPrompt": "在一个幽静的夜晚，小屋的角落里，一只小老鼠正机警地向前探索。它细长的胡须微微颤动，四处张望，准备冒险偷取放在桌子上的奶酪。月光透过窗户洒在地板上，为它的行动提供了微弱的照明。小老鼠心跳加速，屏住呼吸，朝目标迈出了勇敢的一步。",
      "videoPrompt": ""
    },
    {
      "index": 1,
      "description": "就在小老鼠快要接近奶酪时，一双闪着绿光的眼睛从阴影中浮现。一只优雅的猫悄然出现，运用它天然的潜伏技巧，安静地接近老鼠。猫没有急着扑过去，而是坐下来，用它的尾巴有节奏地轻轻拍打着地板，发出了一种让人感到威胁的低沉声响。小老鼠停止了一切动作，紧张地盯着猫，眼神里充满了恐惧与惊讶。",
      "visualPrompt": "就在小老鼠快要接近奶酪时，一双闪着绿光的眼睛从阴影中浮现。一只优雅的猫悄然出现，运用它天然的潜伏技巧，安静地接近老鼠。猫没有急着扑过去，而是坐下来，用它的尾巴有节奏地轻轻拍打着地板，发出了一种让人感到威胁的低沉声响。小老鼠停止了一切动作，紧张地盯着猫，眼神里充满了恐惧与惊讶。",
      "videoPrompt": ""
    },
    {
      "index": 2,
      "description": "两者对峙片刻，猫做出了意想不到的举动：它缓缓地用爪子推了推桌子上的奶酪，示意小老鼠可以放心享用。小老鼠迟疑地移动了一下，又看看猫，似乎在确认这是一个意外的仁慈。猫回头，目光柔和，似乎在传达一种不寻常的和解。小老鼠最终鼓起勇气，快速地叼起奶酪，消失在墙角，而猫则转身，继续它的夜间巡视，宛如一位宽容的守护者。",
      "visualPrompt": "两者对峙片刻，猫做出了意想不到的举动：它缓缓地用爪子推了推桌子上的奶酪，示意小老鼠可以放心享用。小老鼠迟疑地移动了一下，又看看猫，似乎在确认这是一个意外的仁慈。猫回头，目光柔和，似乎在传达一种不寻常的和解。小老鼠最终鼓起勇气，快速地叼起奶酪，消失在墙角，而猫则转身，继续它的夜间巡视，宛如一位宽容的守护者。",
      "videoPrompt": ""
    }
  ],
  "totalScenes": 3
}
```

---

## 第五步：生成分镜和视频提示词

基于提取的场景，系统会：

1. **生成画面图片** - 使用 `generateSceneImage()` 为每个场景生成图片
2. **生成视频提示词** - 使用 `generateVideoPromptFromVisual()` 生成视频提示词
3. **考虑场景过渡** - 中间场景会考虑前一个场景的过渡

---

## 集成到App.tsx

### 新增处理函数
```typescript
const handleGenerateFromCustomMarker = useCallback(async (
  aiResponse: string,
  frameCount: number,
  styleId: string,
  aspectRatio?: string,
  duration?: number
) => {
  try {
    // 第一步：提取场景
    const { extractScenesByCustomMarker } = await import('./geminiService');
    const scenes = extractScenesByCustomMarker(aiResponse);
    
    if (scenes.length === 0) {
      alert(lang === 'zh' ? '无法提取场景' : 'Failed to extract scenes');
      return;
    }
    
    // 第二步：调用现有的生成流程
    await handleGenerateFromDialogue(scenes, frameCount, styleId, aspectRatio, duration);
  } catch (e) {
    console.error('Failed to process custom marker format:', e);
    alert(lang === 'zh' ? `处理失败: ${e}` : `Processing failed: ${e}`);
  }
}, [lang, handleGenerateFromDialogue]);
```

---

## 优势

✅ **格式统一** - AI始终按照统一格式返回
✅ **自动提取** - 系统自动识别和提取场景
✅ **无损保留** - 完整保留所有内容
✅ **易于扩展** - 支持任意数量的场景
✅ **错误容错** - 处理格式偏差
✅ **流程完整** - 从提取到生成分镜的完整流程

---

## 使用流程总结

```
1. 用户输入故事概念
   ↓
2. 系统发送带有##@@格式要求的提示词给AI
   ↓
3. AI按照格式返回故事（**##@@标题**内容*】）
   ↓
4. 系统自动提取场景（extractScenesByCustomMarker）
   ↓
5. 系统生成分镜和视频提示词
   ↓
6. 用户看到完整的分镜故事
```
