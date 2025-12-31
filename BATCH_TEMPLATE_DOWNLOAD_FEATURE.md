# 批量模板下载功能

## 功能说明

在 `ManualSceneInputDialog` 的批量输入模式中，用户可以点击"下载模板"按钮下载一个预制的场景模板文件。

## 实现细节

### 下载按钮位置

- **位置**: 批量输入模式的格式说明下方
- **按钮文本**: 
  - 中文: "下载模板"
  - 英文: "Download Template"
- **图标**: 下载图标（Download from lucide-react）

### 模板内容

#### 中文模板

```
<<<
场景1的画面描述
在这里输入第一个场景的详细描述，包括场景设置、人物、光线、色彩等视觉元素。
>>>

<<<
场景2的画面描述
在这里输入第二个场景的详细描述，包括场景设置、人物、光线、色彩等视觉元素。
>>>

<<<
场景3的画面描述
在这里输入第三个场景的详细描述，包括场景设置、人物、光线、色彩等视觉元素。
>>>
```

#### 英文模板

```
<<<
Scene 1 Description
Enter detailed description for the first scene here, including setting, characters, lighting, colors, and other visual elements.
>>>

<<<
Scene 2 Description
Enter detailed description for the second scene here, including setting, characters, lighting, colors, and other visual elements.
>>>

<<<
Scene 3 Description
Enter detailed description for the third scene here, including setting, characters, lighting, colors, and other visual elements.
>>>
```

### 下载文件名

- 中文: `batch_scenes_template_zh.txt`
- 英文: `batch_scenes_template_en.txt`

### 实现代码

```typescript
const handleDownloadTemplate = () => {
  const template = lang === 'zh' 
    ? `<<<
场景1的画面描述
在这里输入第一个场景的详细描述，包括场景设置、人物、光线、色彩等视觉元素。
>>>

<<<
场景2的画面描述
在这里输入第二个场景的详细描述，包括场景设置、人物、光线、色彩等视觉元素。
>>>

<<<
场景3的画面描述
在这里输入第三个场景的详细描述，包括场景设置、人物、光线、色彩等视觉元素。
>>>`
    : `<<<
Scene 1 Description
Enter detailed description for the first scene here, including setting, characters, lighting, colors, and other visual elements.
>>>

<<<
Scene 2 Description
Enter detailed description for the second scene here, including setting, characters, lighting, colors, and other visual elements.
>>>

<<<
Scene 3 Description
Enter detailed description for the third scene here, including setting, characters, lighting, colors, and other visual elements.
>>>`;

  const element = document.createElement('a');
  const file = new Blob([template], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = `batch_scenes_template_${lang}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(element.href);
};
```

## 用户体验流程

1. 打开"生成画面"对话框
2. 勾选"批量输入"复选框
3. 看到格式说明和"下载模板"按钮
4. 点击"下载模板"按钮
5. 浏览器自动下载 `batch_scenes_template_zh.txt` 或 `batch_scenes_template_en.txt`
6. 用户在文本编辑器中打开模板文件
7. 编辑模板中的场景描述
8. 复制编辑后的内容
9. 粘贴到对话框的文本框中
10. 点击"解析"按钮
11. 系统识别场景并显示解析结果
12. 点击"批量生成"开始生成

## 优势

✅ **易于使用**: 用户不需要手动输入格式标记
✅ **减少错误**: 预制的格式确保正确的标记
✅ **多语言支持**: 中英文模板都可用
✅ **快速上手**: 新用户可以快速了解格式
✅ **可复用**: 用户可以保存模板文件供后续使用

## 技术细节

### 文件下载实现

使用 Blob API 和 URL.createObjectURL 实现浏览器端文件下载：

1. 创建 Blob 对象，包含模板文本
2. 创建临时 URL
3. 创建隐藏的 `<a>` 元素
4. 设置 `href` 和 `download` 属性
5. 触发点击事件
6. 清理临时资源

### 浏览器兼容性

- Chrome: ✅ 完全支持
- Firefox: ✅ 完全支持
- Safari: ✅ 完全支持
- Edge: ✅ 完全支持
- IE 11: ⚠️ 需要 polyfill

## 扩展建议

### 未来可能的改进

1. **更多模板选项**
   - 3场景模板（当前）
   - 5场景模板
   - 10场景模板
   - 自定义场景数量

2. **模板预览**
   - 在下载前预览模板内容
   - 选择不同的模板样式

3. **模板上传**
   - 用户可以上传自己的模板
   - 保存常用的模板

4. **模板库**
   - 社区共享的模板
   - 不同风格的模板

