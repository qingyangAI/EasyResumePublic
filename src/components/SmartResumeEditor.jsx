import { useState, useEffect } from 'react'
import { 
  AnalyzeResumeField, 
  GenerateFinalResume, 
  OptimizeContent,
  GetSentenceRewriteSuggestions,
  ExtractKeywordsAndSuggest,
  GetTemplates
} from '../utils/resumeAI'
import LLMConfigPanel from './LLMConfigPanel'

const FIELD_OPTIONS = [
  { value: 'personalInfo', label: '个人信息', icon: '👤' },
  { value: 'tags', label: '专业标签', icon: '🏷️' },
  { value: 'advantages', label: '个人优势', icon: '✨' },
  { value: 'education', label: '教育背景', icon: '🎓' },
  { value: 'workExperiences', label: '工作经历', icon: '💼' },
  { value: 'projects', label: '项目经历', icon: '🚀' },
  { value: 'honors', label: '荣誉证书', icon: '🏆' }
]

function SmartResumeEditor({ data, onChange, onGenerateFinal }) {
  const [currentField, setCurrentField] = useState('personalInfo')
  const [fieldContent, setFieldContent] = useState('')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [completedFields, setCompletedFields] = useState(new Set())
  
  // 新增状态
  const [optimizedContent, setOptimizedContent] = useState(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [showOptimized, setShowOptimized] = useState(false)
  const [rewriteSuggestions, setRewriteSuggestions] = useState([])
  const [isLoadingRewrite, setIsLoadingRewrite] = useState(false)
  const [keywordsData, setKeywordsData] = useState(null)
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(false)
  const [templates, setTemplates] = useState([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
  const [activeTab, setActiveTab] = useState('analysis') // 'analysis', 'optimize', 'rewrite', 'keywords', 'templates'

  // 获取当前字段的内容（从data实时同步）
  const GetFieldContent = (fieldType) => {
    switch (fieldType) {
      case 'personalInfo':
        const pi = data.personalInfo || {}
        return `姓名：${pi.name || ''}\n职位：${pi.title || ''}\n电话：${pi.phone || ''}\n邮箱：${pi.email || ''}\n年龄：${pi.age || ''}\nGitHub：${pi.github || ''}\n博客：${pi.blog || ''}\n目标城市：${pi.targetCity || ''}`
      case 'tags':
        return (data.tags || []).join('\n')
      case 'advantages':
        return (data.advantages || []).join('\n')
      case 'education':
        const edu = data.education || {}
        return `学校：${edu.school || ''}\n专业：${edu.major || ''}\n学历：${edu.degree || ''}\n时间：${edu.period || ''}\n成就：${(edu.achievements || []).join('\n')}`
      case 'workExperiences':
        return (data.workExperiences || []).map((exp, idx) => 
          `${idx + 1}. ${exp.company || ''} | ${exp.position || ''}\n   时间：${exp.period || ''}\n   业绩：${(exp.achievements || []).join('; ')}\n   内容：${(exp.responsibilities || []).join('; ')}`
        ).join('\n\n')
      case 'projects':
        return (data.projects || []).map((proj, idx) =>
          `${idx + 1}. ${proj.name || ''} | ${proj.role || ''}\n   时间：${proj.period || ''}\n   描述：${(proj.description || []).join('; ')}`
        ).join('\n\n')
      case 'honors':
        return (data.honors || []).join('\n')
      default:
        return ''
    }
  }

  // 当字段切换或data变化时，同步内容
  useEffect(() => {
    const content = GetFieldContent(currentField)
    setFieldContent(content)
    setAnalysisResult(null)
    setOptimizedContent(null)
    setRewriteSuggestions([])
    setKeywordsData(null)
    setShowOptimized(false)
    setActiveTab('analysis')
  }, [currentField, data])

  // 自动分析（延迟触发）
  const HandleAutoAnalyze = async () => {
    if (!currentField || !fieldContent.trim() || isAnalyzing) return

    setIsAnalyzing(true)
    try {
      const result = await AnalyzeResumeField(currentField, fieldContent)
      setAnalysisResult(result)
      
      if (result.score >= 4) {
        setCompletedFields(prev => new Set([...prev, currentField]))
      }
    } catch (error) {
      console.error('自动分析失败:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 一键优化
  const HandleOptimize = async () => {
    if (!fieldContent.trim() || isOptimizing) return

    setIsOptimizing(true)
    try {
      const optimized = await OptimizeContent(currentField, fieldContent)
      setOptimizedContent(optimized)
      setShowOptimized(true)
      setActiveTab('optimize')
    } catch (error) {
      alert(`优化失败: ${error.message}`)
    } finally {
      setIsOptimizing(false)
    }
  }

  // 将文本内容同步回data结构
  const SyncContentToData = (content) => {
    const newData = { ...data }
    
    try {
      switch (currentField) {
        case 'personalInfo': {
          // 解析个人信息格式：姓名：xxx\n职位：xxx...
          const lines = content.split('\n')
          const pi = { ...newData.personalInfo }
          lines.forEach(line => {
            if (line.includes('姓名：')) pi.name = line.replace('姓名：', '').trim()
            if (line.includes('职位：')) pi.title = line.replace('职位：', '').trim()
            if (line.includes('电话：')) pi.phone = line.replace('电话：', '').trim()
            if (line.includes('邮箱：')) pi.email = line.replace('邮箱：', '').trim()
            if (line.includes('年龄：')) pi.age = line.replace('年龄：', '').trim()
            if (line.includes('GitHub：')) pi.github = line.replace('GitHub：', '').trim()
            if (line.includes('博客：')) pi.blog = line.replace('博客：', '').trim()
            if (line.includes('目标城市：')) pi.targetCity = line.replace('目标城市：', '').trim()
          })
          newData.personalInfo = pi
          break
        }
        case 'tags': {
          // 标签：每行一个，或使用 | 分隔
          const tags = content.split('\n').filter(t => t.trim())
            .flatMap(line => line.split('|').map(t => t.trim()).filter(t => t))
          newData.tags = tags
          break
        }
        case 'advantages': {
          // 个人优势：每行一条
          const advantages = content.split('\n').filter(a => a.trim())
            .map(line => line.replace(/^\d+[\.、]\s*/, '').trim()) // 移除编号
            .filter(a => a)
          newData.advantages = advantages
          break
        }
        case 'education': {
          // 解析教育背景
          const lines = content.split('\n')
          const edu = { ...newData.education }
          const achievements = []
          
          lines.forEach(line => {
            if (line.includes('学校：')) edu.school = line.replace('学校：', '').trim()
            if (line.includes('专业：')) edu.major = line.replace('专业：', '').trim()
            if (line.includes('学历：')) edu.degree = line.replace('学历：', '').trim()
            if (line.includes('时间：')) edu.period = line.replace('时间：', '').trim()
            if (line.includes('成就：') || line.match(/^\d+[\.、]/)) {
              achievements.push(line.replace(/^(成就：|\d+[\.、]\s*)/, '').trim())
            }
          })
          
          if (achievements.length > 0) {
            edu.achievements = achievements.filter(a => a)
          }
          
          newData.education = edu
          break
        }
        case 'honors': {
          // 荣誉证书：每行一条
          const honors = content.split('\n').filter(h => h.trim())
          newData.honors = honors
          break
        }
        case 'workExperiences':
        case 'projects': {
          // 工作经历和项目经历结构复杂，暂时不自动同步
          // 用户可以在普通编辑器中手动应用
          alert('工作经历和项目经历结构较复杂，建议在普通编辑器中手动应用优化后的内容')
          return
        }
        default:
          return
      }
      
      onChange(newData)
      setFieldContent(content)
    } catch (error) {
      console.error('同步数据失败:', error)
      alert('同步失败，请手动复制内容到普通编辑器')
    }
  }

  // 应用优化后的内容
  const HandleApplyOptimized = () => {
    if (!optimizedContent) return
    SyncContentToData(optimizedContent)
    setShowOptimized(false)
  }

  // 应用到简历按钮
  const HandleApplyToResume = () => {
    if (!fieldContent.trim()) {
      alert('内容为空，无法应用')
      return
    }
    SyncContentToData(fieldContent)
  }

  // 获取逐句改写建议
  const HandleGetRewriteSuggestions = async () => {
    if (!fieldContent.trim() || isLoadingRewrite) return

    setIsLoadingRewrite(true)
    try {
      const suggestions = await GetSentenceRewriteSuggestions(currentField, fieldContent)
      setRewriteSuggestions(suggestions)
      setActiveTab('rewrite')
    } catch (error) {
      alert(`获取改写建议失败: ${error.message}`)
    } finally {
      setIsLoadingRewrite(false)
    }
  }

  // 应用单个改写建议
  const HandleApplyRewrite = (index) => {
    if (!rewriteSuggestions[index]) return
    const suggestion = rewriteSuggestions[index]
    const newContent = fieldContent.replace(suggestion.original, suggestion.optimized)
    setFieldContent(newContent)
    // 同步到data
    SyncContentToData(newContent)
    // 移除已应用的建议
    setRewriteSuggestions(prev => prev.filter((_, i) => i !== index))
  }

  // 获取关键词建议
  const HandleGetKeywords = async () => {
    if (!fieldContent.trim() || isLoadingKeywords) return

    setIsLoadingKeywords(true)
    try {
      const keywords = await ExtractKeywordsAndSuggest(currentField, fieldContent)
      setKeywordsData(keywords)
      setActiveTab('keywords')
    } catch (error) {
      alert(`获取关键词建议失败: ${error.message}`)
    } finally {
      setIsLoadingKeywords(false)
    }
  }

  // 获取模板库
  const HandleGetTemplates = async () => {
    if (isLoadingTemplates) return

    setIsLoadingTemplates(true)
    try {
      const templatesData = await GetTemplates(currentField)
      setTemplates(templatesData)
      setActiveTab('templates')
    } catch (error) {
      alert(`获取模板失败: ${error.message}`)
    } finally {
      setIsLoadingTemplates(false)
    }
  }

  // 应用模板
  const HandleApplyTemplate = (templateContent) => {
    setFieldContent(templateContent)
    setShowOptimized(false)
    // 自动同步到data
    SyncContentToData(templateContent)
  }

  // 生成最终简历
  const HandleGenerateFinal = async () => {
    if (!onGenerateFinal) return

    setIsAnalyzing(true)
    try {
      const finalResume = await GenerateFinalResume(data)
      onGenerateFinal(finalResume)
    } catch (error) {
      alert(`生成失败: ${error.message}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 渲染评分星星
  const RenderScoreStars = (score) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= score ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-base font-semibold text-gray-700">{score}/5</span>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">智能简历编辑器</h2>
          <span className="text-xs text-gray-500">AI辅助优化，一键提升简历质量</span>
        </div>
        <button
          onClick={() => setShowConfig(true)}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          API配置
        </button>
      </div>

      {/* 三栏式布局 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：字段导航 */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">字段导航</h3>
            <div className="space-y-1">
              {FIELD_OPTIONS.map((option) => {
                const isActive = currentField === option.value
                const isCompleted = completedFields.has(option.value)
                return (
                  <button
                    key={option.value}
                    onClick={() => setCurrentField(option.value)}
                    className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-center gap-2 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-base">{option.icon}</span>
                    <span className="flex-1">{option.label}</span>
                    {isCompleted && (
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 生成最终简历按钮 */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={HandleGenerateFinal}
              disabled={isAnalyzing}
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? '生成中...' : '生成最终简历'}
            </button>
          </div>
        </div>

        {/* 中间：内容编辑区域 */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto p-6">
            {/* 字段标题和操作按钮 */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {FIELD_OPTIONS.find(f => f.value === currentField)?.icon} {FIELD_OPTIONS.find(f => f.value === currentField)?.label}
                </h2>
                {completedFields.has(currentField) && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    已完成
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={HandleOptimize}
                  disabled={!fieldContent.trim() || isOptimizing}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isOptimizing ? '优化中...' : '一键优化'}
                </button>
                <button
                  onClick={HandleGetTemplates}
                  disabled={isLoadingTemplates}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoadingTemplates ? '加载中...' : '模板库'}
                </button>
              </div>
            </div>

            {/* 内容输入区域 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  当前内容（已与普通编辑器同步）
                </label>
                <button
                  onClick={HandleApplyToResume}
                  disabled={!fieldContent.trim()}
                  className="px-3 py-1 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  应用到简历
                </button>
              </div>
              <textarea
                value={fieldContent}
                onChange={(e) => setFieldContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono"
                placeholder="内容已从普通编辑器同步，或在此处直接输入..."
              />
              <p className="mt-2 text-xs text-gray-500">
                提示：修改内容后点击"应用到简历"按钮，即可同步到普通编辑器
              </p>
            </div>

            {/* 优化前后对比 */}
            {showOptimized && optimizedContent && (
              <div className="mb-6 border border-blue-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-2 border-b border-blue-200 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-blue-900">优化前后对比</h3>
                  <button
                    onClick={() => setShowOptimized(false)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4 bg-white">
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-2">优化前</div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded border border-gray-200 max-h-64 overflow-y-auto">
                      {fieldContent || '（空）'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-blue-600 mb-2">优化后</div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap bg-blue-50 p-3 rounded border border-blue-200 max-h-64 overflow-y-auto">
                      {optimizedContent}
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={HandleApplyOptimized}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                  >
                    应用优化后的内容
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 右侧：智能助手区 */}
        <div className="w-96 bg-gray-50 border-l border-gray-200 overflow-y-auto">
          <div className="p-4">
            {/* 标签页切换 */}
            <div className="mb-4 flex gap-2 border-b border-gray-200">
              {[
                { id: 'analysis', label: '质量分析', icon: '📊' },
                { id: 'optimize', label: '一键优化', icon: '✨' },
                { id: 'rewrite', label: '逐句改写', icon: '✏️' },
                { id: 'keywords', label: '关键词', icon: '🔑' },
                { id: 'templates', label: '模板库', icon: '📚' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 text-xs font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-600 border-transparent hover:text-gray-900'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* 质量分析标签页 */}
            {activeTab === 'analysis' && (
              <div className="space-y-6">
                {!analysisResult ? (
                  <div className="text-center py-12">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <p className="text-sm text-gray-500 mb-4">输入内容后，AI将自动分析</p>
                    <button
                      onClick={HandleAutoAnalyze}
                      disabled={!fieldContent.trim() || isAnalyzing}
                      className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isAnalyzing ? '分析中...' : '开始分析'}
                    </button>
                  </div>
                ) : (
                  <>
                    {/* 质量评分 */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 mb-3">质量评分</h4>
                      {RenderScoreStars(analysisResult.score)}
                      {analysisResult.score >= 4 && (
                        <p className="mt-2 text-xs text-green-600">✨ 内容质量很好，继续保持！</p>
                      )}
                      {analysisResult.score < 3 && (
                        <p className="mt-2 text-xs text-orange-600">💡 还有改进空间，试试一键优化或逐句改写</p>
                      )}
                    </div>

                    {/* 问题诊断 */}
                    {analysisResult.compliance && Object.keys(analysisResult.compliance).some(k => analysisResult.compliance[k]) && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 mb-3">问题诊断</h4>
                        <div className="space-y-2">
                          {Object.entries(analysisResult.compliance).map(([key, value]) =>
                            value && (
                              <div key={key} className="flex items-start gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded-md">
                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>
                                  {key === 'isTooShort' && '内容过短，建议补充更多细节'}
                                  {key === 'isTooSimple' && '内容过于简单，缺乏深度'}
                                  {key === 'lackTechDepth' && '缺乏技术深度，建议补充技术细节'}
                                  {key === 'lackMetrics' && '缺少量化指标，建议加入数据支撑'}
                                  {key === 'lackBusinessValue' && '未体现业务价值，建议说明解决的问题'}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* 优化建议 */}
                    {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 mb-3">优化建议</h4>
                        <ul className="space-y-2">
                          {analysisResult.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2 text-xs text-gray-700 bg-white p-2 rounded-md border border-gray-200">
                              <span className="text-blue-600 font-semibold mt-0.5">{index + 1}.</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 大厂示例 */}
                    {analysisResult.example && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 mb-3">大厂示例</h4>
                        <div className="p-3 bg-white border border-gray-200 rounded-md">
                          <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">{analysisResult.example}</p>
                        </div>
                      </div>
                    )}

                    {/* 补全提问 */}
                    {analysisResult.questions && analysisResult.questions.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 mb-3">补全提问</h4>
                        <ul className="space-y-2">
                          {analysisResult.questions.map((question, index) => (
                            <li key={index} className="flex items-start gap-2 text-xs text-gray-600 bg-white p-2 rounded-md border border-gray-200">
                              <span className="text-green-600 font-semibold mt-0.5">?</span>
                              <span>{question}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* 一键优化标签页 */}
            {activeTab === 'optimize' && (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <svg className="w-16 h-16 mx-auto text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-sm text-gray-600 mb-4">一键优化将为您生成优化后的完整版本</p>
                  <button
                    onClick={HandleOptimize}
                    disabled={!fieldContent.trim() || isOptimizing}
                    className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isOptimizing ? '优化中...' : '开始优化'}
                  </button>
                </div>
                {optimizedContent && (
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="text-xs font-semibold text-gray-700 mb-2">优化结果</div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded border border-gray-200 max-h-96 overflow-y-auto">
                      {optimizedContent}
                    </div>
                    <button
                      onClick={HandleApplyOptimized}
                      className="mt-3 w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                    >
                      应用此优化
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 逐句改写标签页 */}
            {activeTab === 'rewrite' && (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600 mb-4">逐句改写可以针对每个句子提供优化建议</p>
                  <button
                    onClick={HandleGetRewriteSuggestions}
                    disabled={!fieldContent.trim() || isLoadingRewrite}
                    className="px-6 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoadingRewrite ? '分析中...' : '获取改写建议'}
                  </button>
                </div>
                {rewriteSuggestions.length > 0 && (
                  <div className="space-y-3">
                    {rewriteSuggestions.map((suggestion, index) => (
                      <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="text-xs font-semibold text-gray-600 mb-2">原文</div>
                        <div className="text-xs text-gray-700 mb-3 p-2 bg-gray-50 rounded border border-gray-200">
                          {suggestion.original}
                        </div>
                        <div className="text-xs font-semibold text-blue-600 mb-2">优化后</div>
                        <div className="text-xs text-gray-700 mb-3 p-2 bg-blue-50 rounded border border-blue-200">
                          {suggestion.optimized}
                        </div>
                        <div className="text-xs text-gray-500 mb-3">
                          原因：{suggestion.reason}
                        </div>
                        <button
                          onClick={() => HandleApplyRewrite(index)}
                          className="w-full px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                        >
                          应用此改写
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 关键词标签页 */}
            {activeTab === 'keywords' && (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600 mb-4">提取关键词并获取补充建议</p>
                  <button
                    onClick={HandleGetKeywords}
                    disabled={!fieldContent.trim() || isLoadingKeywords}
                    className="px-6 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoadingKeywords ? '分析中...' : '提取关键词'}
                  </button>
                </div>
                {keywordsData && (
                  <div className="space-y-4">
                    {keywordsData.extractedKeywords && keywordsData.extractedKeywords.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">已提取的关键词</h4>
                        <div className="flex flex-wrap gap-2">
                          {keywordsData.extractedKeywords.map((keyword, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {keywordsData.suggestedKeywords && keywordsData.suggestedKeywords.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">建议补充的关键词</h4>
                        <div className="flex flex-wrap gap-2">
                          {keywordsData.suggestedKeywords.map((keyword, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md">
                              + {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {keywordsData.missingMetrics && keywordsData.missingMetrics.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">建议添加的量化指标</h4>
                        <ul className="space-y-1">
                          {keywordsData.missingMetrics.map((metric, index) => (
                            <li key={index} className="text-xs text-orange-600 bg-orange-50 p-2 rounded-md">
                              {metric}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {keywordsData.improvementTips && keywordsData.improvementTips.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">改进建议</h4>
                        <ul className="space-y-1">
                          {keywordsData.improvementTips.map((tip, index) => (
                            <li key={index} className="text-xs text-gray-700 bg-white p-2 rounded-md border border-gray-200">
                              • {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 模板库标签页 */}
            {activeTab === 'templates' && (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600 mb-4">查看不同场景的高质量模板</p>
                  <button
                    onClick={HandleGetTemplates}
                    disabled={isLoadingTemplates}
                    className="px-6 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoadingTemplates ? '加载中...' : '加载模板'}
                  </button>
                </div>
                {templates.length > 0 && (
                  <div className="space-y-3">
                    {templates.map((template, index) => (
                      <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="text-xs font-semibold text-gray-700 mb-1">{template.name}</div>
                        <div className="text-xs text-gray-500 mb-2">{template.scenario}</div>
                        <div className="text-xs text-gray-700 whitespace-pre-wrap bg-gray-50 p-2 rounded border border-gray-200 mb-2 max-h-32 overflow-y-auto">
                          {template.content}
                        </div>
                        <button
                          onClick={() => HandleApplyTemplate(template.content)}
                          className="w-full px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          使用此模板
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* API配置面板 */}
      {showConfig && <LLMConfigPanel onClose={() => setShowConfig(false)} />}
    </div>
  )
}

export default SmartResumeEditor
