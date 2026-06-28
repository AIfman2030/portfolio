import { useState, useMemo } from 'react';

/**
 * PyramidWriter — 金字塔结构写作组件
 * 
 * 两步流程：
 *   Step 1: 搭建金字塔结构（核心结论 → 3论点 → 证据 → 金句结尾）
 *   Step 2: 正文写作（左边金字塔大纲 + 右边编辑器）
 * 
 * Props:
 *   type      - 'reading' | 'exercise'  写作类型
 *   record    - 当前记录对象 { name, summary, note, ... }
 *   onSave    - 保存回调 ({ topic, outline, article, pyramid })
 *   onCancel  - 取消回调
 */

// 默认金字塔空结构
function buildDefaultPyramid(record, type) {
  const name = record?.name || record?.title || '';
  const summary = record?.summary || record?.note || '';
  
  const topicContext = type === 'reading' ? `《${name}》这本书` : (name || '这次运动');
  const defaultArgs = type === 'reading'
    ? [
        { text: '这本书的核心观点是什么', evidences: ['引用原文或案例', '为什么这个观点重要'] },
        { text: '这个观点如何改变了我的认知', evidences: ['之前的错误认知', '转变的关键时刻'] },
        { text: '读完后的行动改变', evidences: ['具体行动', '预期效果'] },
      ]
    : [
        { text: '这次运动的过程和数据', evidences: ['距离、配速、时长', '运动时的身体感受'] },
        { text: '这次有什么突破或感悟', evidences: ['心态变化', '身体变化'] },
        { text: '对训练或生活的启发', evidences: ['下一步计划', '生活上的类比'] },
      ];

  return {
    conclusion: summary || '',
    arguments: defaultArgs,
    ending: '',
  };
}

// 从已有的 articleOutline 中解析出金字塔结构
function parseExistingOutline(record) {
  if (!record?.articleOutline) return null;
  try {
    // 尝试按 "\n---\n" 分割：结论 | 论点+证据 | 金句
    const parts = record.articleOutline.split('\n---\n');
    if (parts.length < 2) return null;
    // 简单解析...如果格式不匹配就从头开始
    return null;
  } catch { return null; }
}

// ── 步骤条 ──
function StepBar({ step, onStepChange }) {
  const steps = [
    { num: 1, label: '搭金字塔' },
    { num: 2, label: '写正文' },
  ];

  return (
    <div className="flex items-center gap-1 mb-4 px-2">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-1">
          <button
            onClick={() => i < step && onStepChange(i)}
            disabled={i > step}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all
              ${i < step ? 'opacity-60 cursor-pointer' : ''}
              ${i === step ? 'ring-2 ring-offset-1' : ''}
              ${i > step ? 'opacity-30 cursor-not-allowed' : ''}
            `}
            style={{
              background: i <= step ? 'var(--accent, #2D6A4F)' : 'transparent',
              color: i <= step ? '#fff' : 'var(--muted, #999)',
              border: i > step ? '1px solid var(--border, #e5e5e5)' : 'none',
            }}
          >
            {i < step ? '✓' : s.num} {s.label}
          </button>
          {i < steps.length - 1 && (
            <div
              className="w-6 h-px"
              style={{ background: i < step ? 'var(--accent, #2D6A4F)' : 'var(--border, #e5e5e5)' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Step 1: 金字塔结构编辑器 ──
function PyramidEditor({ pyramid, setPyramid, record, type }) {
  const name = record?.name || record?.title || '';

  const updateConclusion = (val) => setPyramid(p => ({ ...p, conclusion: val }));
  const updateEnding = (val) => setPyramid(p => ({ ...p, ending: val }));
  const updateArgText = (idx, val) =>
    setPyramid(p => ({
      ...p,
      arguments: p.arguments.map((a, i) => (i === idx ? { ...a, text: val } : a)),
    }));
  const updateEvidence = (argIdx, evIdx, val) =>
    setPyramid(p => ({
      ...p,
      arguments: p.arguments.map((a, i) =>
        i === argIdx
          ? { ...a, evidences: a.evidences.map((ev, j) => (j === evIdx ? val : ev)) }
          : a
      ),
    }));
  const addEvidence = (argIdx) =>
    setPyramid(p => ({
      ...p,
      arguments: p.arguments.map((a, i) =>
        i === argIdx ? { ...a, evidences: [...a.evidences, ''] } : a
      ),
    }));
  const removeEvidence = (argIdx, evIdx) =>
    setPyramid(p => ({
      ...p,
      arguments: p.arguments.map((a, i) =>
        i === argIdx ? { ...a, evidences: a.evidences.filter((_, j) => j !== evIdx) } : a
      ),
    }));
  const addArgument = () =>
    setPyramid(p => ({
      ...p,
      arguments: [...p.arguments, { text: '', evidences: [''] }],
    }));
  const removeArgument = (idx) => {
    if (pyramid.arguments.length <= 1) return;
    setPyramid(p => ({
      ...p,
      arguments: p.arguments.filter((_, i) => i !== idx),
    }));
  };

  const isComplete = useMemo(() => {
    if (!pyramid.conclusion.trim()) return false;
    if (pyramid.arguments.some(a => !a.text.trim())) return false;
    if (pyramid.arguments.some(a => a.evidences.some(ev => !ev.trim()))) return false;
    return true;
  }, [pyramid]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold">📐 Step 1: 搭金字塔结构</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            每层到下一层要能「所以呢？」问出来
          </p>
        </div>
        {name && (
          <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">
            {type === 'reading' ? `📖 ${name}` : `🏃 ${name}`}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* 塔尖 - 核心结论 */}
        <div>
          <label className="text-xs font-semibold text-amber-700 mb-1.5 block">
            🏁 核心结论（塔尖）
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
            style={{ borderColor: 'var(--border, #e5e5e5)', background: 'var(--card-bg, #fff)' }}
            value={pyramid.conclusion}
            onChange={e => updateConclusion(e.target.value)}
            placeholder="一句话说清楚你想让读者带走什么"
          />
        </div>

        {/* 论点层 */}
        <div>
          <label className="text-xs font-semibold text-green-700 mb-2 block">
            📌 论点（中间层，不重叠）
          </label>
          {pyramid.arguments.map((arg, ai) => (
            <div key={ai} className="mb-3 p-3 rounded-lg" style={{ background: 'var(--card-bg-secondary, #fafafa)', border: '1px solid var(--border, #eee)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-amber-600">论点 {ai + 1}</span>
                {pyramid.arguments.length > 1 && (
                  <button
                    onClick={() => removeArgument(ai)}
                    className="text-xs px-2 py-0.5 rounded border border-red-200 text-red-500 hover:bg-red-50"
                  >
                    删除
                  </button>
                )}
              </div>
              <input
                className="w-full px-3 py-1.5 rounded border text-sm focus:outline-none focus:ring-1 focus:ring-amber-300 mb-2"
                style={{ borderColor: 'var(--border, #e5e5e5)', background: 'var(--card-bg, #fff)' }}
                value={arg.text}
                onChange={e => updateArgText(ai, e.target.value)}
                placeholder="这个论点一句话说清楚"
              />
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">证据：</label>
                {arg.evidences.map((ev, ei) => (
                  <div key={ei} className="flex gap-2 mb-1.5">
                    <input
                      className="flex-1 px-2 py-1.5 rounded border text-xs focus:outline-none"
                      style={{ borderColor: 'var(--border, #e5e5e5)', background: 'var(--card-bg, #fff)' }}
                      value={ev}
                      onChange={e => updateEvidence(ai, ei, e.target.value)}
                      placeholder={`证据 ${ei + 1}：具体数字/对比/画面`}
                    />
                    {arg.evidences.length > 1 && (
                      <button
                        onClick={() => removeEvidence(ai, ei)}
                        className="w-6 h-6 rounded text-xs text-muted-foreground hover:bg-gray-100 flex items-center justify-center"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addEvidence(ai)}
                  className="text-xs text-blue-600 font-medium hover:underline"
                >
                  + 添加证据
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addArgument}
            className="text-xs text-blue-600 font-medium hover:underline"
          >
            + 添加论点
          </button>
        </div>

        {/* 结尾金句 */}
        <div>
          <label className="text-xs font-semibold text-rose-700 mb-1.5 block">
            💥 结尾金句（回扣结论）
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            style={{ borderColor: 'var(--border, #e5e5e5)', background: 'var(--card-bg, #fff)' }}
            value={pyramid.ending}
            onChange={e => updateEnding(e.target.value)}
            placeholder="让读者记住的一句话，和开头呼应"
          />
        </div>

        {!isComplete && (
          <p className="text-xs text-center text-muted-foreground mt-2">
            ⚠️ 请填完所有字段再进入写作（结论 + 所有论点和证据 + 金句）
          </p>
        )}
      </div>
    </div>
  );
}

// ── Step 2: 正文编辑器（大纲左 + 编辑器右） ──
function ArticleEditor({ pyramid, content, setContent, title, setTitle, type }) {
  const stats = useMemo(() => {
    const words = content.length;
    const readingMin = Math.max(1, Math.round(words / 400));
    return { words, readingMin };
  }, [content]);

  return (
    <div>
      <h3 className="text-sm font-semibold mb-1">✍️ Step 2: 写正文</h3>
      <p className="text-xs text-muted-foreground mb-3">
        左边是金字塔大纲，右边写正文。写完检查：论点覆盖了吗？结尾回扣了吗？
      </p>

      {/* 标题栏 */}
      <div className="flex items-center gap-3 mb-3">
        <input
          className="flex-1 px-3 py-2 rounded-lg border text-sm font-semibold focus:outline-none focus:ring-2"
          style={{ borderColor: 'var(--border, #e5e5e5)', background: 'var(--card-bg, #fff)' }}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="文章标题"
        />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {stats.words} 字 · ~{stats.readingMin} 分钟
        </span>
      </div>

      {/* 分割：大纲 | 编辑器 */}
      <div className="flex flex-col md:flex-row gap-3" style={{ minHeight: 400 }}>
        {/* 大纲（移动端在上方） */}
        <div
          className="w-full md:w-64 md:shrink-0 rounded-lg p-4 overflow-y-auto"
          style={{ background: 'var(--card-bg-secondary, #fafafa)', border: '1px solid var(--border, #eee)', maxHeight: '40vh', mdMaxHeight: 'calc(100vh - 400px)' }}
        >
          <h4 className="text-xs font-semibold mb-3 text-muted-foreground">📐 金字塔大纲</h4>
          
          {/* 结论 */}
          <div className="mb-3 p-2 rounded bg-blue-50 text-xs leading-relaxed">
            <strong className="text-blue-700">结论：</strong>
            <span className="text-blue-800">{pyramid.conclusion || '（未填写）'}</span>
          </div>

          {/* 论点 */}
          {pyramid.arguments.map((arg, i) => (
            <div key={i} className="mb-3">
              <div className="text-xs font-semibold text-amber-700 mb-1">
                论点 {i + 1}：{arg.text || '（未填写）'}
              </div>
              <ul className="ml-3 space-y-0.5">
                {arg.evidences.map((ev, j) => (
                  <li key={j} className="text-xs text-muted-foreground">{ev || '（未填写）'}</li>
                ))}
              </ul>
            </div>
          ))}

          {/* 金句 */}
          <div className="p-2 rounded bg-amber-50 text-xs leading-relaxed">
            <strong className="text-amber-700">结尾：</strong>
            <span className="text-amber-800">{pyramid.ending || '（未填写）'}</span>
          </div>
        </div>

        {/* 右侧编辑器 */}
        <div className="flex-1 min-w-0">
          <textarea
            className="w-full h-full min-h-[400px] p-4 rounded-lg border text-sm leading-relaxed resize-y focus:outline-none focus:ring-2"
            style={{
              borderColor: 'var(--border, #e5e5e5)',
              background: 'var(--card-bg, #fff)',
              fontFamily: '-apple-system, "PingFang SC", sans-serif',
            }}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={`开始写作...\n\n左边是金字塔大纲，写完记得检查：\n1. 每个论点下的证据是否覆盖到了？\n2. 结尾是否回扣了开头？\n3. 写完后点「保存」`}
          />
        </div>
      </div>
    </div>
  );
}

// ── 主题帮助面板（侧边） ──
function TypeHint({ type }) {
  if (type === 'reading') {
    return (
      <div className="p-3 rounded-lg text-xs leading-relaxed" style={{ background: 'var(--card-bg-secondary, #f0fdf4)', border: '1px solid var(--border, #bbf7d0)' }}>
        <strong className="text-green-700">📖 读书写作提示</strong>
        <p className="mt-1 text-muted-foreground">
          写读书笔记不是复述书的内容，而是写你被触动后的思考。
          核心公式：书中观点 → 你的经历 → 你的改变。
        </p>
      </div>
    );
  }
  return (
    <div className="p-3 rounded-lg text-xs leading-relaxed" style={{ background: 'var(--card-bg-secondary, #eff6ff)', border: '1px solid var(--border, #bfdbfe)' }}>
      <strong className="text-blue-700">🏃 跑步写作提示</strong>
      <p className="mt-1 text-muted-foreground">
        跑步日记不是配速表，而是你和自己的对话。
        核心公式：跑的过程 → 身体的感受 → 心里的想法 → 生活启发。
      </p>
    </div>
  );
}

// ── 主组件 ──
export default function PyramidWriter({ type, record, onSave, onCancel }) {
  const [step, setStep] = useState(0); // 0=金字塔, 1=写作
  const [pyramid, setPyramid] = useState(() => {
    // 如果已有 outline，尝试解析
    const existing = parseExistingOutline(record);
    return existing || buildDefaultPyramid(record, type);
  });
  const [content, setContent] = useState(record?.articleContent || '');
  const [title, setTitle] = useState(
    record?.articleTopic || (
      type === 'reading'
        ? `《${record?.name || ''}》读书笔记`
        : (record?.title || record?.date || '') + ' 跑步日记'
    )
  );

  const isPyramidComplete = useMemo(() => {
    if (!pyramid.conclusion.trim()) return false;
    if (pyramid.arguments.some(a => !a.text.trim())) return false;
    if (pyramid.arguments.some(a => a.evidences.some(ev => !ev.trim()))) return false;
    return true;
  }, [pyramid]);

  const handleNext = () => {
    if (isPyramidComplete) {
      // 用金字塔结构生成 outline
      const outlineParts = [
        `核心结论：${pyramid.conclusion}`,
        '---',
        ...pyramid.arguments.map((arg, i) =>
          `论点${i + 1}：${arg.text}\n${arg.evidences.map(ev => `  - ${ev}`).join('\n')}`
        ),
        '---',
        `结尾金句：${pyramid.ending}`,
      ];
      const outline = outlineParts.join('\n');
      
      // 预填充 articleTopic 如果没有的话
      if (!title.trim()) {
        setTitle(pyramid.conclusion);
      }
      
      setStep(1);
    }
  };

  const handleSave = () => {
    const outlineParts = [
      `核心结论：${pyramid.conclusion}`,
      '---',
      ...pyramid.arguments.map((arg, i) =>
        `论点${i + 1}：${arg.text}\n${arg.evidences.map(ev => `  - ${ev}`).join('\n')}`
      ),
      '---',
      `结尾金句：${pyramid.ending}`,
    ];
    const outline = outlineParts.join('\n');
    
    onSave({
      topic: title || pyramid.conclusion,
      outline,
      article: content,
      pyramid, // 保留金字塔原始数据供后续编辑
    });
  };

  return (
    <div
      className="mt-3 p-4 rounded-xl"
      style={{
        background: 'var(--card-bg, #fff)',
        border: '2px solid var(--accent, #2D6A4F)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      {/* 步骤条 */}
      <StepBar step={step} onStepChange={setStep} />

      {/* 主体 */}
      {step === 0 ? (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <PyramidEditor pyramid={pyramid} setPyramid={setPyramid} record={record} type={type} />
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg text-xs border transition-all hover:bg-gray-50"
                style={{ borderColor: 'var(--border, #e5e5e5)', color: 'var(--muted, #666)' }}
              >
                取消
              </button>
              <button
                onClick={handleNext}
                disabled={!isPyramidComplete}
                className="px-6 py-2 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-40"
                style={{ background: isPyramidComplete ? 'var(--accent, #2D6A4F)' : '#ccc' }}
              >
                结构确认，开始写作 →
              </button>
            </div>
          </div>
          <div className="w-full md:w-56 md:shrink-0 space-y-3" style={{ marginTop: 32 }}>
            <TypeHint type={type} />
            {/* 迷你金字塔预览 */}
            <div className="p-3 rounded-lg text-xs" style={{ background: 'var(--card-bg-secondary, #fafafa)', border: '1px solid var(--border, #eee)' }}>
              <strong className="block mb-2">📐 金字塔预览</strong>
              <div className="space-y-1.5">
                <div className="p-1.5 rounded bg-amber-50 text-amber-800 text-center text-xs">
                  {pyramid.conclusion || '...'}
                </div>
                <div className="p-1.5 rounded bg-green-50 text-green-800 text-center text-xs">
                  {pyramid.arguments.length} 个论点
                </div>
                <div className="p-1.5 rounded bg-blue-50 text-blue-800 text-center text-xs">
                  {pyramid.arguments.reduce((sum, a) => sum + a.evidences.length, 0)} 条证据
                </div>
                <div className="p-1.5 rounded bg-rose-50 text-rose-800 text-center text-xs">
                  {pyramid.ending || '...'}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <ArticleEditor
            pyramid={pyramid}
            content={content}
            setContent={setContent}
            title={title}
            setTitle={setTitle}
            type={type}
          />
          <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: 'var(--border, #e5e5e5)' }}>
            <button
              onClick={() => setStep(0)}
              className="px-4 py-2 rounded-lg text-xs border transition-all hover:bg-gray-50"
              style={{ borderColor: 'var(--border, #e5e5e5)', color: 'var(--muted, #666)' }}
            >
              ← 返回修改金字塔
            </button>
            <div className="flex gap-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg text-xs border transition-all hover:bg-gray-50"
                style={{ borderColor: 'var(--border, #e5e5e5)', color: 'var(--muted, #666)' }}
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={!content.trim()}
                className="px-6 py-2 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-40"
                style={{ background: content.trim() ? 'var(--accent, #2D6A4F)' : '#ccc' }}
              >
                保存到记录
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
