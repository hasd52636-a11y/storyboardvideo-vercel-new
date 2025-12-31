/**
 * 测试双标记提取工作流
 * 画面提示词: <<< >>>
 * 视频提示词: {{{ }}}
 */

// ============================================
// 第一步：模拟AI返回的内容（按双标记格式）
// ============================================

const aiResponse = `<<<
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
}}}`;

// ============================================
// 第二步：提取函数
// ============================================

interface ScriptScene {
  index: number;
  description: string;
  visualPrompt: string;
  videoPrompt: string;
}

function extractScenesWithDualMarkers(text: string): ScriptScene[] {
  console.log('[extractScenesWithDualMarkers] 开始提取场景...');
  console.log('[extractScenesWithDualMarkers] 输入文本长度:', text.length);
  
  // 提取画面提示词：<<< ... >>>
  const visualPattern = /<<<(.*?)>>>/gs;
  // 提取视频提示词：{{{ ... }}}
  const videoPattern = /\{\{\{(.*?)\}\}\}/gs;
  
  const visualPrompts: string[] = [];
  const videoPrompts: string[] = [];
  
  // 第一步：提取所有画面提示词
  let visualMatch;
  let visualIndex = 0;
  
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
  
  // 第二步：提取所有视频提示词
  let videoMatch;
  let videoIndex = 0;
  
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
  const scenes: ScriptScene[] = [];
  
  for (let i = 0; i < sceneCount; i++) {
    scenes.push({
      index: i,
      description: visualPrompts[i] || '',
      visualPrompt: visualPrompts[i] || '',
      videoPrompt: videoPrompts[i] || ''
    });
  }
  
  console.log(`[extractScenesWithDualMarkers] ✅ 总共提取 ${scenes.length} 个场景`);
  console.log(`[extractScenesWithDualMarkers]   画面提示词: ${visualPrompts.length} 个`);
  console.log(`[extractScenesWithDualMarkers]   视频提示词: ${videoPrompts.length} 个`);
  
  return scenes;
}

// ============================================
// 第三步：执行提取
// ============================================

console.log('========================================');
console.log('开始测试双标记提取工作流');
console.log('画面提示词标记: <<< >>>');
console.log('视频提示词标记: {{{ }}}');
console.log('========================================\n');

const extractedScenes = extractScenesWithDualMarkers(aiResponse);

// ============================================
// 第四步：显示提取结果
// ============================================

console.log('\n========================================');
console.log('提取结果详情');
console.log('========================================\n');

extractedScenes.forEach((scene, idx) => {
  console.log(`\n【场景 ${idx + 1}】`);
  console.log(`索引: ${scene.index}`);
  
  console.log(`\n📸 画面提示词 (${scene.visualPrompt.length} 字符):`);
  console.log(scene.visualPrompt);
  
  console.log(`\n🎬 视频提示词 (${scene.videoPrompt.length} 字符):`);
  console.log(scene.videoPrompt);
  
  console.log('\n---');
});

// ============================================
// 第五步：验证提取结果
// ============================================

console.log('\n========================================');
console.log('验证提取结果');
console.log('========================================\n');

const validationResults = {
  totalScenes: extractedScenes.length,
  allHaveVisualPrompt: extractedScenes.every(s => s.visualPrompt.length > 0),
  allHaveVideoPrompt: extractedScenes.every(s => s.videoPrompt.length > 0),
  expectedScenes: 3,
  isValid: extractedScenes.length === 3 && 
           extractedScenes.every(s => s.visualPrompt.length > 0 && s.videoPrompt.length > 0)
};

console.log('验证项目:');
console.log(`✅ 总场景数: ${validationResults.totalScenes} (期望: ${validationResults.expectedScenes})`);
console.log(`✅ 所有场景都有画面提示词: ${validationResults.allHaveVisualPrompt}`);
console.log(`✅ 所有场景都有视频提示词: ${validationResults.allHaveVideoPrompt}`);
console.log(`\n总体验证结果: ${validationResults.isValid ? '✅ 通过' : '❌ 失败'}`);

// ============================================
// 第六步：JSON格式输出
// ============================================

console.log('\n========================================');
console.log('JSON格式输出');
console.log('========================================\n');

const jsonOutput = {
  status: 'success',
  markerFormat: {
    visual: '<<< >>>',
    video: '{{{ }}}'
  },
  totalScenes: extractedScenes.length,
  scenes: extractedScenes.map((scene, idx) => ({
    index: scene.index,
    sceneNumber: idx + 1,
    visualPromptLength: scene.visualPrompt.length,
    videoPromptLength: scene.videoPrompt.length,
    visualPrompt: scene.visualPrompt,
    videoPrompt: scene.videoPrompt
  })),
  extractedAt: new Date().toISOString()
};

console.log(JSON.stringify(jsonOutput, null, 2));

// ============================================
// 第七步：统计信息
// ============================================

console.log('\n========================================');
console.log('统计信息');
console.log('========================================\n');

const totalVisualChars = extractedScenes.reduce((sum, s) => sum + s.visualPrompt.length, 0);
const totalVideoChars = extractedScenes.reduce((sum, s) => sum + s.videoPrompt.length, 0);
const avgVisualChars = Math.round(totalVisualChars / extractedScenes.length);
const avgVideoChars = Math.round(totalVideoChars / extractedScenes.length);

console.log(`📊 画面提示词统计:`);
console.log(`   - 总字符数: ${totalVisualChars}`);
console.log(`   - 平均字符数: ${avgVisualChars}`);
console.log(`   - 最长: ${Math.max(...extractedScenes.map(s => s.visualPrompt.length))}`);
console.log(`   - 最短: ${Math.min(...extractedScenes.map(s => s.visualPrompt.length))}`);

console.log(`\n🎬 视频提示词统计:`);
console.log(`   - 总字符数: ${totalVideoChars}`);
console.log(`   - 平均字符数: ${avgVideoChars}`);
console.log(`   - 最长: ${Math.max(...extractedScenes.map(s => s.videoPrompt.length))}`);
console.log(`   - 最短: ${Math.min(...extractedScenes.map(s => s.videoPrompt.length))}`);

console.log(`\n📈 总体统计:`);
console.log(`   - 场景数: ${extractedScenes.length}`);
console.log(`   - 总字符数: ${totalVisualChars + totalVideoChars}`);
console.log(`   - 平均每场景字符数: ${Math.round((totalVisualChars + totalVideoChars) / extractedScenes.length)}`);

// ============================================
// 导出测试数据
// ============================================

export { extractedScenes, jsonOutput, validationResults };
