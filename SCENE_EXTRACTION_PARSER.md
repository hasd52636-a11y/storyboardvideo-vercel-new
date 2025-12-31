# 场景提取解析器 - 精准提取 ##@@ 格式

## 提取规则

**格式标记**:
- 开始: `**##@@` + 编号 (如: `**##@@画面一`)
- 结束: `*】`

**提取结果**:

### 画面一
```
在一个幽静的夜晚，小屋的角落里，一只小老鼠正机警地向前探索。它细长的胡须微微颤动，四处张望，准备冒险偷取放在桌子上的奶酪。月光透过窗户洒在地板上，为它的行动提供了微弱的照明。小老鼠心跳加速，屏住呼吸，朝目标迈出了勇敢的一步。
```

### 画面二
```
就在小老鼠快要接近奶酪时，一双闪着绿光的眼睛从阴影中浮现。一只优雅的猫悄然出现，运用它天然的潜伏技巧，安静地接近老鼠。猫没有急着扑过去，而是坐下来，用它的尾巴有节奏地轻轻拍打着地板，发出了一种让人感到威胁的低沉声响。小老鼠停止了一切动作，紧张地盯着猫，眼神里充满了恐惧与惊讶。
```

### 画面三
```
两者对峙片刻，猫做出了意想不到的举动：它缓缓地用爪子推了推桌子上的奶酪，示意小老鼠可以放心享用。小老鼠迟疑地移动了一下，又看看猫，似乎在确认这是一个意外的仁慈。猫回头，目光柔和，似乎在传达一种不寻常的和解。小老鼠最终鼓起勇气，快速地叼起奶酪，消失在墙角，而猫则转身，继续它的夜间巡视，宛如一位宽容的守护者。
```

---

## 提取算法

```typescript
function extractScenesByMarker(text: string): Array<{
  index: number;
  title: string;
  content: string;
}> {
  const scenes: Array<{index: number; title: string; content: string}> = [];
  
  // 正则表达式：匹配 **##@@标题**...内容...*】
  const scenePattern = /\*\*##@@([^*]+)\*\*(.*?)\*】/gs;
  
  let match;
  let sceneIndex = 1;
  
  while ((match = scenePattern.exec(text)) !== null) {
    const title = match[1].trim();  // 提取标题（如"画面一"）
    const content = match[2].trim(); // 提取内容
    
    scenes.push({
      index: sceneIndex,
      title,
      content
    });
    
    sceneIndex++;
  }
  
  return scenes;
}
```

---

## 提取结果（JSON格式）

```json
{
  "scenes": [
    {
      "index": 1,
      "title": "画面一",
      "content": "在一个幽静的夜晚，小屋的角落里，一只小老鼠正机警地向前探索。它细长的胡须微微颤动，四处张望，准备冒险偷取放在桌子上的奶酪。月光透过窗户洒在地板上，为它的行动提供了微弱的照明。小老鼠心跳加速，屏住呼吸，朝目标迈出了勇敢的一步。"
    },
    {
      "index": 2,
      "title": "画面二",
      "content": "就在小老鼠快要接近奶酪时，一双闪着绿光的眼睛从阴影中浮现。一只优雅的猫悄然出现，运用它天然的潜伏技巧，安静地接近老鼠。猫没有急着扑过去，而是坐下来，用它的尾巴有节奏地轻轻拍打着地板，发出了一种让人感到威胁的低沉声响。小老鼠停止了一切动作，紧张地盯着猫，眼神里充满了恐惧与惊讶。"
    },
    {
      "index": 3,
      "title": "画面三",
      "content": "两者对峙片刻，猫做出了意想不到的举动：它缓缓地用爪子推了推桌子上的奶酪，示意小老鼠可以放心享用。小老鼠迟疑地移动了一下，又看看猫，似乎在确认这是一个意外的仁慈。猫回头，目光柔和，似乎在传达一种不寻常的和解。小老鼠最终鼓起勇气，快速地叼起奶酪，消失在墙角，而猫则转身，继续它的夜间巡视，宛如一位宽容的守护者。"
    }
  ],
  "totalScenes": 3,
  "extractedAt": "2025-12-30T00:00:00Z"
}
```

---

## 关键特性

✅ **精准提取** - 使用正则表达式精确匹配 `**##@@` 和 `*】` 标记
✅ **保留内容** - 完整保留场景内容，不删除任何文字
✅ **自动编号** - 自动为每个场景编号
✅ **标题识别** - 自动提取标题（如"画面一"、"画面二"等）
✅ **容错处理** - 处理多余空格和换行符
✅ **可扩展** - 支持任意数量的场景

---

## 使用场景

1. **用户输入自定义格式** - 用户按照 `**##@@` 格式输入故事
2. **AI返回结构化内容** - AI按照标记格式返回内容
3. **系统自动解析** - 系统自动提取并转换为内部格式
4. **生成分镜** - 基于提取的场景生成分镜和视频提示词

---

## 集成建议

在 `geminiService.ts` 中添加新函数：

```typescript
export const extractScenesByCustomMarker = (text: string): ScriptScene[] => {
  const scenePattern = /\*\*##@@([^*]+)\*\*(.*?)\*】/gs;
  const scenes: ScriptScene[] = [];
  
  let match;
  let index = 0;
  
  while ((match = scenePattern.exec(text)) !== null) {
    const title = match[1].trim();
    const content = match[2].trim();
    
    scenes.push({
      index,
      description: content,
      visualPrompt: content,
      videoPrompt: '',
      videoPromptEn: ''
    });
    
    index++;
  }
  
  return scenes;
};
```

这样就能精准提取用户按照 `**##@@` 格式输入的故事了！
