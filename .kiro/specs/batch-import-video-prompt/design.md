# 批量导入视频提示词支持 - 设计文档

## 概述

本设计文档描述如何完整支持批量导入中的视频提示词功能。当前实现在单个模式下完全支持视频提示词，但批量模式的解析逻辑不一致。本设计统一解析逻辑，确保用户通过任何方式导入的数据都能完整保留。

## 架构

### 当前架构问题

```
批量模式 (Batch Mode)
├── 文件导入 (File Upload)
│   └── handleFileUpload() ✅ 正确解析视频提示词
│       └── 正则: /<<<([\s\S]*?)>>>\s*([\s\S]*?)(?=<<<|$)/g
│
└── 直接粘贴 (Paste & Parse)
    └── handleParseBatch() ❌ 只解析画面提示词
        └── 正则: /<<<([\s\S]*?)>>>/g
```

### 改进后的架构

```
统一解析函数 parseScenes()
├── 输入: 批量文本内容
├── 处理:
│   ├── 使用统一的正则表达式
│   ├── 提取画面提示词 (<<<>>>内)
│   ├── 提取视频提示词 (>>>后的内容)
│   └── 过滤空场景
└── 输出: Scene[] 数组

使用场景:
├── handleFileUpload() → parseScenes()
├── handleParseBatch() → parseScenes()
└── 批量生成按钮 → parseScenes()
```

## 组件和接口

### Scene 接口（已存在）

```typescript
interface Scene {
  id: string;
  visualPrompt: string;      // 画面提示词
  videoPrompt?: string;      // 视频提示词（可选）
}
```

### 新增函数：parseScenes()

```typescript
/**
 * 解析批量输入文本，提取场景信息
 * @param input - 批量输入文本
 * @returns 解析后的场景数组
 */
function parseScenes(input: string): Scene[] {
  // 正则表达式：匹配 <<<...>>> 及其后的内容
  // 使用非贪心匹配确保正确分割场景
  const sceneRegex = /<<<([\s\S]*?)>>>([\s\S]*?)(?=<<<|$)/g;
  const matches = Array.from(input.matchAll(sceneRegex));
  
  if (matches.length === 0) {
    return [];
  }

  const scenes: Scene[] = matches.map((match, index) => {
    const visualPrompt = match[1].trim();
    const videoPrompt = match[2].trim();
    
    return {
      id: String(index + 1),
      visualPrompt: visualPrompt,
      videoPrompt: videoPrompt && videoPrompt.length > 0 ? videoPrompt : undefined
    };
  }).filter(scene => scene.visualPrompt.length > 0);

  return scenes;
}
```

**正则表达式说明**：
- `<<<([\s\S]*?)>>>` - 匹配 `<<<` 和 `>>>` 之间的内容（画面提示词）
- `([\s\S]*?)` - 匹配 `>>>` 之后到下一个 `<<<` 或文本末尾的内容（视频提示词）
- `(?=<<<|$)` - 正向前瞻，确保在下一个 `<<<` 或文本末尾处停止
- `[\s\S]` - 匹配任何字符（包括换行符）
- `*?` - 非贪心匹配，确保正确分割

### 修改的函数

#### handleParseBatch()

```typescript
const handleParseBatch = () => {
  const parsedScenes = parseScenes(batchInput);
  
  if (parsedScenes.length === 0) {
    alert(lang === 'zh' ? '未找到有效的场景标记' : 'No valid scene markers found');
    return;
  }

  setScenes(parsedScenes);
  setIsBatchMode(false);
  setBatchInput('');
  alert(lang === 'zh' 
    ? `成功解析 ${parsedScenes.length} 个场景，已切换到单个编辑模式` 
    : `Successfully parsed ${parsedScenes.length} scenes, switched to single edit mode`);
};
```

#### handleFileUpload()

```typescript
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const content = event.target?.result as string;
    setBatchInput(content);
    
    const parsedScenes = parseScenes(content);

    if (parsedScenes.length > 0) {
      setScenes(parsedScenes);
      setIsBatchMode(false);
      setBatchInput('');
      alert(lang === 'zh' 
        ? `成功导入 ${parsedScenes.length} 个场景，已切换到单个编辑模式` 
        : `Successfully imported ${parsedScenes.length} scenes, switched to single edit mode`);
    }
  };
  reader.readAsText(file);
  
  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};
```

#### 批量生成按钮

```typescript
onClick={() => {
  const parsedScenes = parseScenes(batchInput);
  
  if (parsedScenes.length === 0) {
    alert(lang === 'zh' ? '未找到有效的场景标记' : 'No valid scene markers found');
    return;
  }

  // 传递完整的场景数据（包括视频提示词）
  onGenerate(parsedScenes, batchInterval);
}}
```

## 数据模型

### 批量输入格式

```
<<<
场景1的画面描述
>>>
场景1的视频提示词（可选）

<<<
场景2的画面描述
>>>
场景2的视频提示词（可选）
```

### 解析流程

```
输入文本
  ↓
正则匹配: /<<<([\s\S]*?)>>>([\s\S]*?)(?=<<<|$)/g
  ↓
提取 match[1] → visualPrompt (<<<>>> 内的内容)
提取 match[2] → videoPrompt (>>> 后到下一个 <<< 或文本末尾的内容)
  ↓
trim() 去除前后空白
  ↓
过滤空的 visualPrompt
  ↓
返回 Scene[] 数组
```

## 用户界面改进

### 1. 批量模式格式说明更新

当前：
```
格式：使用 <<< 和 >>> 标记分隔场景
```

改进为：
```
格式：使用 <<< 和 >>> 标记分隔场景
- 在 <<< 和 >>> 之间输入画面提示词
- 在 >>> 之后输入视频提示词（可选）
- 每个场景之间用空行分隔
```

### 2. 模板内容更新

中文模板：
```
<<<
场景1的画面描述
>>>
场景1的视频提示词（可选）

<<<
场景2的画面描述
>>>
场景2的视频提示词（可选）

<<<
场景3的画面描述
>>>
场景3的视频提示词（可选）
```

英文模板：
```
<<<
Scene 1 visual description
>>>
Scene 1 video prompt (optional)

<<<
Scene 2 visual description
>>>
Scene 2 video prompt (optional)

<<<
Scene 3 visual description
>>>
Scene 3 video prompt (optional)
```

### 3. 占位符文本更新

批量模式占位符：
```
使用 <<< 和 >>> 标记分隔每个场景

示例：
<<<
场景1的描述
>>>
场景1的视频提示词

<<<
场景2的描述
>>>
场景2的视频提示词
```

## 正确性属性

一个属性是系统应该在所有有效执行中保持为真的特征或行为——本质上是关于系统应该做什么的正式陈述。属性充当人类可读规范和机器可验证正确性保证之间的桥梁。

### 属性 1：粘贴模式解析正确性

**对于任何** 包含视频提示词的批量输入文本，系统 **应该** 正确解析出画面提示词和视频提示词

**验证**: Requirements 1.1

### 属性 2：文件导入视频提示词保留

**对于任何** 通过文件导入的批量输入，系统 **应该** 保留文件中的视频提示词信息

**验证**: Requirements 1.2

### 属性 3：解析逻辑一致性（Round-trip）

**对于任何** 批量输入文本，通过文件导入和直接粘贴解析 **应该** 产生相同的结果

**验证**: Requirements 1.3

### 属性 4：UI 显示完整性

**对于任何** 包含视频提示词的导入场景，在切换到单个模式后，系统 **应该** 在场景卡片中显示已导入的视频提示词

**验证**: Requirements 1.4

### 属性 5：可选字段处理

**对于任何** 视频提示词为空或仅包含空白的场景，系统 **应该** 将其视为未提供（undefined），而不是报错

**验证**: Requirements 2.3

### 属性 6：模板格式兼容性

**对于任何** 按照下载模板格式输入的数据，系统 **应该** 能够正确解析所有字段而不丢失信息

**验证**: Requirements 2.2

### 属性 7：批量生成数据传递

**对于任何** 通过批量模式导入的场景，当调用生成函数时，系统 **应该** 将完整的场景数据（包括视频提示词）传递给生成服务

**验证**: Requirements 3.1

### 属性 8：有视频提示词的生成

**对于任何** 包含视频提示词的场景，系统 **应该** 在生成时使用该提示词

**验证**: Requirements 3.2

### 属性 9：无视频提示词的生成

**对于任何** 不包含视频提示词的场景，系统 **应该** 仅使用画面提示词进行生成

**验证**: Requirements 3.3

## 错误处理

### 场景 1：无效的场景标记

```typescript
if (matches.length === 0) {
  alert(lang === 'zh' ? '未找到有效的场景标记' : 'No valid scene markers found');
  return [];
}
```

### 场景 2：空的画面提示词

```typescript
.filter(scene => scene.visualPrompt.length > 0)
```

### 场景 3：空的视频提示词

```typescript
videoPrompt: videoPrompt && videoPrompt.length > 0 ? videoPrompt : undefined
```

## 测试策略

### 单元测试

1. **测试解析函数**
   - 测试包含视频提示词的输入
   - 测试不包含视频提示词的输入
   - 测试空白视频提示词
   - 测试多个场景
   - 测试无效标记

2. **测试 UI 集成**
   - 文件导入后显示视频提示词
   - 直接粘贴后显示视频提示词
   - 批量生成时传递视频提示词

### 属性测试

每个正确性属性都应该通过属性测试验证，确保在各种输入下都能正确处理。

## 实现步骤

1. 提取 `parseScenes()` 为独立函数
2. 更新 `handleParseBatch()` 使用新函数
3. 更新 `handleFileUpload()` 使用新函数
4. 更新批量生成按钮使用新函数
5. 更新模板内容
6. 更新格式说明文本
7. 更新占位符文本
8. 编写和运行测试
