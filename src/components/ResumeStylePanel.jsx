import { useState, useEffect } from 'react'
import { SaveResumeStyle, LoadResumeStyle } from '../utils/resumeData'
import { fontGroups, fontOptions } from '../utils/fontConfig'
import FontSelector from './FontSelector'

// 可折叠的分类组件
function CollapsibleSection({ title, defaultOpen = true, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-t border-gray-100 pt-3 mt-3 first:border-t-0 first:pt-0 first:mt-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-sm font-medium text-gray-900 mb-2 hover:text-gray-900 transition-colors py-1"
      >
        <span>{title}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="space-y-3 pb-2">
          {children}
        </div>
      )}
    </div>
  )
}

function ResumeStylePanel({ onStyleChange }) {
  const [styleSettings, setStyleSettings] = useState({
    fontFamily: 'inherit',
    fontSize: 14,
    lineHeight: 1.6,
    titleFontSize: 24,
    titleTitleFontSize: 24,
    sectionTitleFontSize: 18,
    textColor: '#1f2937',
    titleColor: '#111827',
    sectionTitleColor: '#374151',
    spacing: 1.5,
    tagsStyle: 'text-separator',
    tagsSeparator: '｜',
    tagsCustomSeparator: '',
    tagsBackgroundColor: '#e5e7eb',
    tagsTextColor: '#1f2937',
    tagsBorderColor: '#d1d5db',
    tagsPadding: '4px 12px',
    tagsBorderRadius: '4px',
    dateFormat: 'dot',
    headerText: '',
    headerUrl: '',
    footerText: '',
    footerUrl: '',
    resumeBackgroundColor: '#ffffff',
    sectionBackgroundColor: '',
    useSectionBackground: false
  })

  useEffect(() => {
    const defaultSettings = {
      fontFamily: 'inherit',
      fontSize: 14,
      lineHeight: 1.6,
      titleFontSize: 24,
      titleTitleFontSize: 24,
      sectionTitleFontSize: 18,
      textColor: '#1f2937',
      titleColor: '#111827',
      sectionTitleColor: '#374151',
      spacing: 1.5,
      tagsStyle: 'text-separator',
      tagsSeparator: '｜',
      tagsCustomSeparator: '',
      tagsBackgroundColor: '#e5e7eb',
      tagsTextColor: '#1f2937',
      tagsBorderColor: '#d1d5db',
      tagsPadding: '4px 12px',
      tagsBorderRadius: '4px',
      dateFormat: 'dot',
      headerText: '',
      headerUrl: '',
      footerText: '',
      footerUrl: '',
      resumeBackgroundColor: '#ffffff',
      sectionBackgroundColor: '',
      useSectionBackground: false
    }
    
    const saved = LoadResumeStyle()
    if (saved) {
      // 合并保存的样式和默认值，确保新字段有默认值
      const mergedSettings = {
        ...defaultSettings,
        ...saved
      }
      setStyleSettings(mergedSettings)
      onStyleChange(mergedSettings)
    } else {
      onStyleChange(defaultSettings)
    }
  }, [])

  const HandleStyleChange = (key, value) => {
    const newSettings = { ...styleSettings, [key]: value }
    setStyleSettings(newSettings)
    SaveResumeStyle(newSettings)
    onStyleChange(newSettings)
    
    // 如果修改了主题相关的设置，需要重新检测主题
    if (key === 'resumeBackgroundColor' || key === 'sectionBackgroundColor' || key === 'useSectionBackground') {
      // 状态会在下次渲染时自动更新
    }
  }


  const fontSizeOptions = Array.from({ length: 21 }, (_, i) => i + 10).map(size => ({
    value: size,
    label: `${size}px`
  }))

  // 预设主题配置
  const presetThemes = [
    {
      id: 'white',
      name: '经典白色',
      description: '纯白背景，适合所有场景',
      resumeBackgroundColor: '#ffffff',
      sectionBackgroundColor: '',
      useSectionBackground: false
    },
    {
      id: 'light-gray',
      name: '浅灰专业',
      description: '浅灰背景，专业稳重',
      resumeBackgroundColor: '#f8f9fa',
      sectionBackgroundColor: '',
      useSectionBackground: false
    },
    {
      id: 'warm-beige',
      name: '米色温暖',
      description: '米色背景，温暖亲和',
      resumeBackgroundColor: '#faf8f5',
      sectionBackgroundColor: '',
      useSectionBackground: false
    },
    {
      id: 'light-blue',
      name: '淡蓝商务',
      description: '淡蓝背景，商务专业',
      resumeBackgroundColor: '#f0f4f8',
      sectionBackgroundColor: '',
      useSectionBackground: false
    },
    {
      id: 'light-green',
      name: '浅绿清新',
      description: '浅绿背景，清新自然',
      resumeBackgroundColor: '#f0f7f4',
      sectionBackgroundColor: '',
      useSectionBackground: false
    },
    {
      id: 'section-gray',
      name: '章节分层（灰）',
      description: '白色背景+灰色章节，层次分明',
      resumeBackgroundColor: '#ffffff',
      sectionBackgroundColor: '#f5f5f5',
      useSectionBackground: true
    },
    {
      id: 'section-blue',
      name: '章节分层（蓝）',
      description: '白色背景+淡蓝章节，专业清晰',
      resumeBackgroundColor: '#ffffff',
      sectionBackgroundColor: '#f0f4f8',
      useSectionBackground: true
    },
    {
      id: 'section-beige',
      name: '章节分层（米）',
      description: '白色背景+米色章节，温和专业',
      resumeBackgroundColor: '#ffffff',
      sectionBackgroundColor: '#faf8f5',
      useSectionBackground: true
    },
    {
      id: 'warm-white',
      name: '暖白经典',
      description: '暖白色背景，经典不出错',
      resumeBackgroundColor: '#fefefe',
      sectionBackgroundColor: '',
      useSectionBackground: false
    },
    {
      id: 'cool-white',
      name: '冷白现代',
      description: '冷白色背景，现代简洁',
      resumeBackgroundColor: '#fcfcfc',
      sectionBackgroundColor: '',
      useSectionBackground: false
    },
    {
      id: 'ivory',
      name: '象牙白',
      description: '象牙白背景，优雅专业',
      resumeBackgroundColor: '#fffff0',
      sectionBackgroundColor: '',
      useSectionBackground: false
    },
    {
      id: 'snow-white',
      name: '雪白纯净',
      description: '雪白背景，纯净专业',
      resumeBackgroundColor: '#fffafa',
      sectionBackgroundColor: '',
      useSectionBackground: false
    },
    {
      id: 'section-light-gray',
      name: '章节分层（浅灰）',
      description: '白色背景+浅灰章节，层次清晰',
      resumeBackgroundColor: '#ffffff',
      sectionBackgroundColor: '#f8f9fa',
      useSectionBackground: true
    },
    {
      id: 'section-warm',
      name: '章节分层（暖色）',
      description: '暖白背景+米色章节，温和专业',
      resumeBackgroundColor: '#fefefe',
      sectionBackgroundColor: '#faf8f5',
      useSectionBackground: true
    }
  ]

  const HandleThemeChange = (themeId) => {
    if (themeId === 'custom') {
      // 自定义主题，不改变当前设置
      return
    }
    const theme = presetThemes.find(t => t.id === themeId)
    if (theme) {
      const newSettings = {
        ...styleSettings,
        resumeBackgroundColor: theme.resumeBackgroundColor,
        sectionBackgroundColor: theme.sectionBackgroundColor,
        useSectionBackground: theme.useSectionBackground
      }
      setStyleSettings(newSettings)
      SaveResumeStyle(newSettings)
      onStyleChange(newSettings)
    }
  }

  // 检测当前设置是否匹配某个预设主题
  const GetCurrentThemeId = () => {
    const currentBg = styleSettings.resumeBackgroundColor || '#ffffff'
    const currentSectionBg = styleSettings.sectionBackgroundColor || ''
    const currentUseSection = styleSettings.useSectionBackground || false

    const matchedTheme = presetThemes.find(theme => {
      const bgMatch = theme.resumeBackgroundColor.toLowerCase() === currentBg.toLowerCase()
      const sectionBgMatch = theme.sectionBackgroundColor === currentSectionBg
      const useSectionMatch = theme.useSectionBackground === currentUseSection
      return bgMatch && sectionBgMatch && useSectionMatch
    })

    return matchedTheme ? matchedTheme.id : 'custom'
  }

  return (
    <div className="h-full w-full bg-white overflow-y-auto no-print">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-900">样式配置</h3>
      </div>
      <div className="p-4">
      
      <div className="space-y-0">
        {/* 简历主题 */}
        <CollapsibleSection title="简历主题" defaultOpen={false}>
          {/* 预设主题选择 */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              预设主题
            </label>
            <select
              value={GetCurrentThemeId()}
              onChange={(e) => HandleThemeChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            >
              {presetThemes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name} - {theme.description}
                </option>
              ))}
              <option value="custom">自定义</option>
            </select>
            {GetCurrentThemeId() !== 'custom' && (
              <p className="mt-1.5 text-xs text-gray-500">
                {presetThemes.find(t => t.id === GetCurrentThemeId())?.description}
              </p>
            )}
          </div>

          {/* 简历背景色 */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              简历背景色
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={styleSettings.resumeBackgroundColor || '#ffffff'}
                onChange={(e) => HandleStyleChange('resumeBackgroundColor', e.target.value)}
                className="w-12 h-8 border border-gray-200 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={styleSettings.resumeBackgroundColor || '#ffffff'}
                onChange={(e) => HandleStyleChange('resumeBackgroundColor', e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          {/* 是否使用章节背景色 */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
              <input
                type="checkbox"
                checked={styleSettings.useSectionBackground || false}
                onChange={(e) => HandleStyleChange('useSectionBackground', e.target.checked)}
                className="w-3.5 h-3.5 text-gray-900 border-gray-200 rounded-lg focus:ring-gray-900"
              />
              <span>启用章节背景色</span>
            </label>
          </div>

          {/* 章节背景色 */}
          {styleSettings.useSectionBackground && (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                章节背景色
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={styleSettings.sectionBackgroundColor || '#f9fafb'}
                  onChange={(e) => HandleStyleChange('sectionBackgroundColor', e.target.value)}
                  className="w-12 h-8 border border-gray-200 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={styleSettings.sectionBackgroundColor || '#f9fafb'}
                  onChange={(e) => HandleStyleChange('sectionBackgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>
          )}
        </CollapsibleSection>

        {/* 字体设置 */}
        <CollapsibleSection title="字体设置" defaultOpen={true}>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label className="block text-xs font-medium text-gray-600 mb-2">
              字体（鼠标悬停预览，滚轮切换，点击选择）
            </label>
            <FontSelector
              value={styleSettings.fontFamily}
              onChange={(fontValue) => HandleStyleChange('fontFamily', fontValue)}
              fontGroups={fontGroups}
              previewText="简历预览文字效果"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              正文字号
            </label>
            <select
              value={styleSettings.fontSize}
              onChange={(e) => HandleStyleChange('fontSize', parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              {fontSizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              行间距: {styleSettings.lineHeight}
            </label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={styleSettings.lineHeight}
              onChange={(e) => HandleStyleChange('lineHeight', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1.0</span>
              <span>2.0</span>
              <span>3.0</span>
            </div>
          </div>
        </CollapsibleSection>

        {/* 标题设置 */}
        <CollapsibleSection title="标题设置" defaultOpen={false}>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              标题字号
            </label>
            <select
              value={styleSettings.titleFontSize}
              onChange={(e) => {
                const newValue = parseInt(e.target.value)
                const currentTitleTitleFontSize = styleSettings.titleTitleFontSize || styleSettings.titleFontSize
                if (currentTitleTitleFontSize === styleSettings.titleFontSize) {
                  const newSettings = { ...styleSettings, titleFontSize: newValue, titleTitleFontSize: newValue }
                  setStyleSettings(newSettings)
                  SaveResumeStyle(newSettings)
                  onStyleChange(newSettings)
                } else {
                  HandleStyleChange('titleFontSize', newValue)
                }
              }}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              {fontSizeOptions.filter(opt => opt.value >= 16 && opt.value <= 36).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              职位字号
            </label>
            <select
              value={styleSettings.titleTitleFontSize || styleSettings.titleFontSize}
              onChange={(e) => HandleStyleChange('titleTitleFontSize', parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              {fontSizeOptions.filter(opt => opt.value >= 16 && opt.value <= 36).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              章节标题字号
            </label>
            <select
              value={styleSettings.sectionTitleFontSize}
              onChange={(e) => HandleStyleChange('sectionTitleFontSize', parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              {fontSizeOptions.filter(opt => opt.value >= 14 && opt.value <= 28).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </CollapsibleSection>

        {/* 颜色设置 */}
        <CollapsibleSection title="颜色设置" defaultOpen={false}>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              文字颜色
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={styleSettings.textColor}
                onChange={(e) => HandleStyleChange('textColor', e.target.value)}
                className="w-12 h-8 border border-gray-200 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={styleSettings.textColor}
                onChange={(e) => HandleStyleChange('textColor', e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              标题颜色
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={styleSettings.titleColor}
                onChange={(e) => HandleStyleChange('titleColor', e.target.value)}
                className="w-12 h-8 border border-gray-200 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={styleSettings.titleColor}
                onChange={(e) => HandleStyleChange('titleColor', e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              章节标题颜色
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={styleSettings.sectionTitleColor}
                onChange={(e) => HandleStyleChange('sectionTitleColor', e.target.value)}
                className="w-12 h-8 border border-gray-200 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={styleSettings.sectionTitleColor}
                onChange={(e) => HandleStyleChange('sectionTitleColor', e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 间距设置 */}
        <CollapsibleSection title="间距设置" defaultOpen={false}>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              段落间距: {styleSettings.spacing}em
            </label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={styleSettings.spacing}
              onChange={(e) => HandleStyleChange('spacing', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.5</span>
              <span>1.75</span>
              <span>3.0</span>
            </div>
          </div>
        </CollapsibleSection>

        {/* 专业标签样式 */}
        <CollapsibleSection title="专业标签样式" defaultOpen={false}>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              样式类型
            </label>
            <select
              value={styleSettings.tagsStyle}
              onChange={(e) => HandleStyleChange('tagsStyle', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="text-separator">文本分隔符</option>
              <option value="tag-badge">标签徽章</option>
              <option value="tag-outline">标签轮廓</option>
              <option value="tag-dot">标签点样式</option>
            </select>
          </div>

          {styleSettings.tagsStyle === 'text-separator' && (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                分隔符
              </label>
              <select
                value={(() => {
                  const presetSeparators = ['｜', '|', '·', '/', '、', '，', ' ', '-', '—', '•']
                  return presetSeparators.includes(styleSettings.tagsSeparator) 
                    ? styleSettings.tagsSeparator 
                    : 'custom'
                })()}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    if (!styleSettings.tagsCustomSeparator) {
                      HandleStyleChange('tagsCustomSeparator', styleSettings.tagsSeparator || '')
                    }
                  } else {
                    HandleStyleChange('tagsSeparator', e.target.value)
                  }
                }}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 mb-2"
              >
                <option value="｜">竖线（｜）</option>
                <option value="|">竖线（|）</option>
                <option value="·">中点（·）</option>
                <option value="/">斜杠（/）</option>
                <option value="、">顿号（、）</option>
                <option value="，">逗号（，）</option>
                <option value=" ">空格</option>
                <option value="-">横线（-）</option>
                <option value="—">长横线（—）</option>
                <option value="•">圆点（•）</option>
                <option value="custom">自定义</option>
              </select>
              {(() => {
                const presetSeparators = ['｜', '|', '·', '/', '、', '，', ' ', '-', '—', '•']
                const isCustom = !presetSeparators.includes(styleSettings.tagsSeparator)
                return isCustom && (
                  <input
                    type="text"
                    value={styleSettings.tagsSeparator || styleSettings.tagsCustomSeparator || ''}
                    onChange={(e) => {
                      const customValue = e.target.value
                      HandleStyleChange('tagsCustomSeparator', customValue)
                      HandleStyleChange('tagsSeparator', customValue)
                    }}
                    placeholder="输入自定义分隔符"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                )
              })()}
            </div>
          )}

          {(styleSettings.tagsStyle === 'tag-badge' || styleSettings.tagsStyle === 'tag-outline') && (
            <>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  标签背景色
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styleSettings.tagsBackgroundColor}
                    onChange={(e) => HandleStyleChange('tagsBackgroundColor', e.target.value)}
                    className="w-12 h-8 border border-gray-200 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={styleSettings.tagsBackgroundColor}
                    onChange={(e) => HandleStyleChange('tagsBackgroundColor', e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  标签文字颜色
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styleSettings.tagsTextColor}
                    onChange={(e) => HandleStyleChange('tagsTextColor', e.target.value)}
                    className="w-12 h-8 border border-gray-200 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={styleSettings.tagsTextColor}
                    onChange={(e) => HandleStyleChange('tagsTextColor', e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>

              {styleSettings.tagsStyle === 'tag-outline' && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    标签边框颜色
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={styleSettings.tagsBorderColor}
                      onChange={(e) => HandleStyleChange('tagsBorderColor', e.target.value)}
                      className="w-12 h-8 border border-gray-200 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={styleSettings.tagsBorderColor}
                      onChange={(e) => HandleStyleChange('tagsBorderColor', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  标签内边距
                </label>
                <select
                  value={styleSettings.tagsPadding}
                  onChange={(e) => HandleStyleChange('tagsPadding', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="2px 8px">小（2px 8px）</option>
                  <option value="4px 12px">中（4px 12px）</option>
                  <option value="6px 16px">大（6px 16px）</option>
                  <option value="8px 20px">特大（8px 20px）</option>
                </select>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  标签圆角
                </label>
                <select
                  value={styleSettings.tagsBorderRadius}
                  onChange={(e) => HandleStyleChange('tagsBorderRadius', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="0px">无圆角</option>
                  <option value="4px">小圆角（4px）</option>
                  <option value="8px">中圆角（8px）</option>
                  <option value="12px">大圆角（12px）</option>
                  <option value="9999px">圆形</option>
                </select>
              </div>
            </>
          )}
        </CollapsibleSection>

        {/* 其他设置 */}
        <CollapsibleSection title="其他设置" defaultOpen={false}>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              日期格式
            </label>
            <select
              value={styleSettings.dateFormat || 'dot'}
              onChange={(e) => HandleStyleChange('dateFormat', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="dot">xx.xx - xx.xx</option>
              <option value="chinese">xxxx年xx月 - xxxx年xx月</option>
            </select>
          </div>
        </CollapsibleSection>

        {/* 打印页眉页脚设置 */}
        <CollapsibleSection title="打印页眉页脚" defaultOpen={false}>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              页眉文本
            </label>
            <input
              type="text"
              value={styleSettings.headerText || ''}
              onChange={(e) => HandleStyleChange('headerText', e.target.value)}
              placeholder="例如：在线简历"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              页眉链接
            </label>
            <input
              type="url"
              value={styleSettings.headerUrl || ''}
              onChange={(e) => HandleStyleChange('headerUrl', e.target.value)}
              placeholder="例如：https://example.com/resume"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              页脚文本
            </label>
            <input
              type="text"
              value={styleSettings.footerText || ''}
              onChange={(e) => HandleStyleChange('footerText', e.target.value)}
              placeholder="例如：在线简历"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              页脚链接
            </label>
            <input
              type="url"
              value={styleSettings.footerUrl || ''}
              onChange={(e) => HandleStyleChange('footerUrl', e.target.value)}
              placeholder="例如：https://example.com/resume"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </CollapsibleSection>
      </div>
      </div>
    </div>
  )
}

export default ResumeStylePanel
