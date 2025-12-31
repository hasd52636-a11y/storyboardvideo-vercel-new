/**
 * 测试自定义标记提取工作流
 * 演示：AI返回 → 系统提取 → 生成分镜
 */

// ============================================
// 第一步：模拟AI返回的内容（按##@@格式）
// ============================================

const aiResponse = `**##@@画面一**在一个幽静的夜晚，小屋的角落里，一只小老鼠正机警地向前探索。它细长的胡须微微颤动，四处张望，准备冒险偷取放在桌子上的奶酪。月光透过窗户洒在地板上，为它的行动提供了微弱的照明。小老鼠心跳加速，屏住呼吸，朝目标迈出了勇敢的一步。*】**##@@画面二**就在小老鼠快要接近奶酪时，一双闪着绿光的眼睛从阴影中浮现。一只优雅的猫悄然出现，运用它天然的潜伏技巧，安静地接近老鼠。猫没有急着扑过去，而是坐下来，用它的尾巴有节奏地轻轻拍打着地板，发出了一种让人感到威胁的低沉声响。小老鼠停止了一切动作，紧张地盯着猫，眼神里充满了恐惧与惊讶。*】**##@@画面三**两者对峙片刻，猫做出了意想不到的举动：它缓缓地用爪子推了推桌子上的奶酪，示意小老鼠可以放心享用。小老鼠迟疑地移动了一下，又看看猫，似乎在确认这是一个意外的仁慈。猫回头，目光柔和，似乎在传达一种不寻常的和解。小老鼠最终鼓起勇气，快速地叼起奶酪，消失在墙角，而猫则转身，继续它的夜间巡视，宛如一位宽容的守护者。*】`;

// ============================================
// 第二步：提取函数
// ============================================

interface ScriptScene {
  index: number;
  description: string;
  visualPrompt: string;
  videoPrompt: string;
  videoPromptEn?: string;
}

function extractScenesByCustomMarker(text: string): ScriptScene[] {
  console.log('[extractScenesByCustomMarker] 开始提取场景...');
  console.log('[extractScenesByCustomMarker] 输入文本长度:', text.length);
  
  const scenePattern = /\*\*##@@([^*]+)\*\*(.*?)\*】/gs;
  const scenes: ScriptScene[] = [];
  
  let match;
  let index = 0;
  
  while ((match = scenePattern.exec(text)) !== null) {
    const title = match[1].trim();
    const content = match[2].trim();
    
    console.log(`[extractScenesByCustomMarker] ✅ 提取场景 ${index + 1}: "${title}"`);
    console.log(`[extractScenesByCustomMarker]   内容长度: ${content.length} 字符`);
    console.log(`[extractScenesByCustomMarker]   内容预览: ${content.substring(0, 50)}...`);
    
    scenes.push({
      index,
      description: content,
      visualPrompt: content,
      videoPrompt: '',
      videoPromptEn: ''
    });
    
    index++;
  }
  
  console.log(`[extractScenesByCustomMarker] ✅ 总共提取 ${scenes.length} 个场景`);
  return scenes;
}

// ============================================
// 第三步：执行提取
// ============================================

console.log('========================================');
console.log('开始测试自定义标记提取工作流');
console.log('========================================\n');

const extractedScenes = extractScenesByCustomMarker(aiResponse);

// ============================================
// 第四步：显示提取结果
// ============================================

console.log('\n========================================');
console.log('提取结果详情');
console.log('========================================\n');

extractedScenes.forEach((scene, idx) => {
  console.log(`\n【场景 ${idx + 1}】`);
  console.log(`索引: ${scene.index}`);
  console.log(`描述长度: ${scene.description.length} 字符`);
  console.log(`描述内容:\n${scene.description}`);
  console.log(`\n视觉提示词长度: ${scene.visualPrompt.length} 字符`);
  console.log('---');
});

// ============================================
// 第五步：验证提取结果
// ============================================

console.log('\n========================================');
console.log('验证提取结果');
console.log('========================================\n');

const validationResults = {
  totalScenes: extractedScenes.length,
  allHaveDescription: extractedScenes.every(s => s.description.length > 0),
  allHaveVisualPrompt: extractedScenes.every(s => s.visualPrompt.length > 0),
  descriptionMatches: extractedScenes.every(s => s.description === s.visualPrompt),
  expectedScenes: 3,
  isValid: extractedScenes.length === 3 && 
           extractedScenes.every(s => s.description.length > 0)
};

console.log('验证项目:');
console.log(`✅ 总场景数: ${validationResults.totalScenes} (期望: ${validationResults.expectedScenes})`);
console.log(`✅ 所有场景都有描述: ${validationResults.allHaveDescription}`);
console.log(`✅ 所有场景都有视觉提示词: ${validationResults.allHaveVisualPrompt}`);
console.log(`✅ 描述与视觉提示词匹配: ${validationResults.descriptionMatches}`);
console.log(`\n总体验证结果: ${validationResults.isValid ? '✅ 通过' : '❌ 失败'}`);

// ============================================
// 第六步：JSON格式输出
// ============================================

console.log('\n========================================');
console.log('JSON格式输出');
console.log('========================================\n');

const jsonOutput = {
  status: 'success',
  totalScenes: extractedScenes.length,
  scenes: extractedScenes.map((scene, idx) => ({
    index: scene.index,
    title: `画面${idx + 1}`,
    descriptionLength: scene.description.length,
    visualPromptLength: scene.visualPrompt.length,
    description: scene.description,
    visualPrompt: scene.visualPrompt,
    videoPrompt: scene.videoPrompt
  })),
  extractedAt: new Date().toISOString()
};

console.log(JSON.stringify(jsonOutput, null, 2));

// ============================================
// 第七步：模拟后续处理
// ============================================

console.log('\n========================================');
console.log('后续处理流程');
console.log('========================================\n');

console.log('✅ 第一步: 提取场景完成');
console.log(`   - 提取了 ${extractedScenes.length} 个场景`);
console.log(`   - 总字符数: ${extractedScenes.reduce((sum, s) => sum + s.description.length, 0)} 字符\n`);

console.log('⏳ 第二步: 准备生成图片');
console.log('   - 将调用 generateSceneImage() 为每个场景生成图片\n');

console.log('⏳ 第三步: 生成视频提示词');
console.log('   - 将调用 generateVideoPromptFromVisual()');
console.log('   - 考虑场景过渡逻辑:');
extractedScenes.forEach((scene, idx) => {
  if (idx === 0) {
    console.log(`     • 场景 ${idx + 1}: 第一个场景 (仅关注当前场景)`);
  } else if (idx === extractedScenes.length - 1) {
    console.log(`     • 场景 ${idx + 1}: 最后一个场景 (标记为结尾)`);
  } else {
    console.log(`     • 场景 ${idx + 1}: 中间场景 (考虑前一场景过渡)`);
  }
});

console.log('\n⏳ 第四步: 生成分镜');
console.log('   - 将所有场景添加到画布');
console.log('   - 显示生成进度\n');

console.log('✅ 工作流程完成！');

// ============================================
// 第八步：导出测试数据
// ============================================

export { extractedScenes, jsonOutput, validationResults };
