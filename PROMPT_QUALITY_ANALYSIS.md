# 脚本生成提示词质量分析 (Script Generation Prompt Quality Analysis)

## 案例分析：老鼠与猫故事

### 问题总结

| 场景 | 画面提示词质量 | 视频提示词质量 | 总体描述 |
|------|--------------|--------------|--------|
| 场景1 | ✅ 标准 | ✅ 标准 | ✅ 纯中文 |
| 场景2 | ❌ 不标准 | ✅ 标准 | ❌ 中英混杂 |
| 场景3 | ❌ 不标准 | ✅ 标准 | ❌ 中英混杂 |

---

## 根本原因分析

### 1. 场景1为什么标准？

**场景1的画面提示词**:
```
阴霾下的老街，橙色余晖映照在鹅卵石小径。鼻息均匀的老鼠正穿过曲折狭窄的小巷。
一只黑白相间的猫尾随其后，藏于阴影之中，匍匐前行。
```

✅ **特点**:
- 纯中文，无英文混杂
- 直接描述场景和角色
- 没有额外的指令或标签
- 字数适中（< 800字）

**原因**: 场景1是初始场景，AI直接从用户的中文输入生成，没有经过"继续生成"的流程，因此没有被污染。

---

### 2. 场景2和3为什么画面提示词不标准？

**场景2的画面提示词**:
```
Continue from the previous scene: "在一个古老的巴黎小巷，黄昏的余晖染红了天空，老鼠皮埃尔在石砖路上小心翼翼地穿行。
远处，小巷中的咖啡馆正在收尾，一位吉普赛街头艺人正在轻声弹奏着曼陀铃。皮埃尔的目标是咖啡馆不远处的奶酪店...
...Show the natural next step in the story. Maintain all character appearances, settings, and visual consistency from previous scenes.
Build upon the established narrative: 阴霾下的老街，橙色余晖映照在鹅卵石小径...
...Develop the story further while keeping visual and character continuity. Show what happens next in this sequence.
```

❌ **问题**:
1. **英文指令混杂**: "Continue from the previous scene", "Show the natural next step", "Maintain all character appearances" 等
2. **重复内容**: 场景描述被重复多次
3. **指令性文本**: 包含"Show", "Maintain", "Build upon", "Develop"等AI指令
4. **中英混合**: 中文场景描述与英文指令交错

**原因**: 在生成场景2时，系统使用了"继续生成"的提示，这些提示包含了英文指令模板，这些指令被直接包含在画面提示词中，而不是作为系统提示。

---

### 3. 为什么视频提示词是标准的？

**场景2的视频提示词**:
```
皮埃尔敏锐地感受到背后压迫的目光，猛然转身，鼻子嗅动，紧张但不慌乱。
菲利克斯在光影交错的巷道中现身，眼神中透出狡黠的光芒，低姿态潜行。
咖啡馆的琴声愈发悠扬，将紧张气氛做衬托，背景中店铺温暖的灯光映出两者的影子。
...
```

✅ **特点**:
- 纯中文，无英文混杂
- 直接描述视觉内容
- 没有指令性文本
- 字数适中（< 700字）

**原因**: 视频提示词是由单独的函数 `generateVideoPromptFromVisual` 生成的，这个函数有自己的系统提示，能够过滤掉英文指令，只保留纯中文的视觉描述。

---

## 问题根源

### 系统提示词污染

在 `parseScriptToScenes` 函数中，生成场景2和3时使用的系统提示包含了英文指令：

```typescript
// 问题代码示例
const systemPrompt = `**文
...
Continue from the previous scene: "...
Show the natural next step in the story.
Maintain all character appearances...
Build upon the established narrative...
Develop the story further...
`;
```

这些英文指令被直接包含在生成的场景描述中，导致画面提示词中出现中英混杂。

---

## 解决方案

### 1. 分离指令和内容

**修改 `parseScriptToScenes` 函数**:
- 将英文指令移到系统提示中（作为系统级别的指令）
- 不要让这些指令出现在生成的内容中

```typescript
// 改进后的系统提示
const systemPrompt = `**文
你是一个专业的故事编剧。
任务: 根据用户的故事描述，生成${frameCount}个场景的详细脚本。

重要规则:
- 只输出中文，不要混杂英文
- 不要包含任何指令性文本（如"Continue from", "Show", "Maintain"等）
- 每个场景包含: 场景描述、画面提示词、视频提示词
- 画面提示词 < 800字，视频提示词 < 700字
- 保持场景之间的连贯性和视觉一致性
`;
```

### 2. 清理生成的内容

在 `parseScriptToScenes` 中添加后处理步骤：

```typescript
// 清理生成的场景
function cleanSceneContent(scene: any, language: string): any {
  // 移除英文指令
  const englishInstructions = [
    'Continue from the previous scene',
    'Show the natural next step',
    'Maintain all character appearances',
    'Build upon the established narrative',
    'Develop the story further',
    'Show what happens next'
  ];
  
  let cleanedDescription = scene.description;
  let cleanedVisualPrompt = scene.visualPrompt;
  
  // 移除所有英文指令
  englishInstructions.forEach(instruction => {
    cleanedDescription = cleanedDescription.replace(instruction, '');
    cleanedVisualPrompt = cleanedVisualPrompt.replace(instruction, '');
  });
  
  // 移除多余的引号和冒号
  cleanedDescription = cleanedDescription.replace(/^["':]+|["':]+$/g, '').trim();
  cleanedVisualPrompt = cleanedVisualPrompt.replace(/^["':]+|["':]+$/g, '').trim();
  
  return {
    ...scene,
    description: cleanedDescription,
    visualPrompt: cleanedVisualPrompt
  };
}
```

### 3. 验证输出

在返回场景前进行验证：

```typescript
// 验证场景内容
function validateSceneContent(scene: any, language: string): boolean {
  const hasEnglish = /[a-zA-Z]{3,}/.test(scene.visualPrompt);
  const hasInstructions = /Continue|Show|Maintain|Build|Develop/.test(scene.visualPrompt);
  
  if (language === 'zh' && (hasEnglish || hasInstructions)) {
    console.warn('Scene contains English or instructions:', scene.visualPrompt);
    return false;
  }
  
  return true;
}
```

---

## 总结

| 问题 | 原因 | 解决方案 |
|------|------|--------|
| 场景2、3画面提示词不标准 | 英文指令被包含在生成的内容中 | 将指令移到系统提示，添加后处理清理 |
| 场景2、3总体描述中英混杂 | 同上 | 同上 |
| 场景1标准 | 没有经过"继续生成"流程 | 保持现有逻辑 |
| 视频提示词标准 | 有独立的系统提示和过滤机制 | 参考视频提示词的实现方式 |

---

## 实施优先级

1. **高优先级**: 修改 `parseScriptToScenes` 的系统提示，移除英文指令
2. **高优先级**: 添加后处理清理函数，移除生成内容中的英文指令
3. **中优先级**: 添加验证函数，确保输出质量
4. **低优先级**: 添加日志记录，监控问题发生

