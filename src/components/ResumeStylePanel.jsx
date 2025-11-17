import { useState, useEffect } from 'react'
import { SaveResumeStyle, LoadResumeStyle } from '../utils/resumeData'

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
    dateFormat: 'dot'
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
      dateFormat: 'dot'
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
  }

  const fontOptions = [
    { value: 'inherit', label: '默认字体' },
    { value: 'SimSun, 宋体', label: '宋体' },
    { value: 'SimHei, 黑体', label: '黑体' },
    { value: 'Microsoft YaHei, 微软雅黑', label: '微软雅黑' },
    { value: 'FangSong, 仿宋', label: '仿宋' },
    { value: 'KaiTi, 楷体', label: '楷体' },
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Times New Roman, serif', label: 'Times New Roman' },
    { value: 'Courier New, monospace', label: 'Courier New' }
  ]

  const fontSizeOptions = Array.from({ length: 21 }, (_, i) => i + 10).map(size => ({
    value: size,
    label: `${size}px`
  }))

  return (
    <div className="w-64 bg-white border border-gray-200 rounded-lg shadow-sm p-4 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto no-print">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">样式配置</h3>
      
      <div className="space-y-4">
        {/* 字体设置 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            字体
          </label>
          <select
            value={styleSettings.fontFamily}
            onChange={(e) => HandleStyleChange('fontFamily', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fontOptions.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        {/* 正文字号 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            正文字号
          </label>
          <select
            value={styleSettings.fontSize}
            onChange={(e) => HandleStyleChange('fontSize', parseInt(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fontSizeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 行间距 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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

        {/* 标题字号 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            标题字号
          </label>
          <select
            value={styleSettings.titleFontSize}
            onChange={(e) => {
              const newValue = parseInt(e.target.value)
              const currentTitleTitleFontSize = styleSettings.titleTitleFontSize || styleSettings.titleFontSize
              // 如果职位字号等于旧的标题字号，则同步更新职位字号
              if (currentTitleTitleFontSize === styleSettings.titleFontSize) {
                const newSettings = { ...styleSettings, titleFontSize: newValue, titleTitleFontSize: newValue }
                setStyleSettings(newSettings)
                SaveResumeStyle(newSettings)
                onStyleChange(newSettings)
              } else {
                HandleStyleChange('titleFontSize', newValue)
              }
            }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fontSizeOptions.filter(opt => opt.value >= 16 && opt.value <= 36).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 职位字号 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            职位字号
          </label>
          <select
            value={styleSettings.titleTitleFontSize || styleSettings.titleFontSize}
            onChange={(e) => HandleStyleChange('titleTitleFontSize', parseInt(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fontSizeOptions.filter(opt => opt.value >= 16 && opt.value <= 36).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 章节标题字号 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            章节标题字号
          </label>
          <select
            value={styleSettings.sectionTitleFontSize}
            onChange={(e) => HandleStyleChange('sectionTitleFontSize', parseInt(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fontSizeOptions.filter(opt => opt.value >= 14 && opt.value <= 28).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 段落间距 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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

        {/* 文字颜色 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            文字颜色
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={styleSettings.textColor}
              onChange={(e) => HandleStyleChange('textColor', e.target.value)}
              className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={styleSettings.textColor}
              onChange={(e) => HandleStyleChange('textColor', e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 标题颜色 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            标题颜色
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={styleSettings.titleColor}
              onChange={(e) => HandleStyleChange('titleColor', e.target.value)}
              className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={styleSettings.titleColor}
              onChange={(e) => HandleStyleChange('titleColor', e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 章节标题颜色 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            章节标题颜色
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={styleSettings.sectionTitleColor}
              onChange={(e) => HandleStyleChange('sectionTitleColor', e.target.value)}
              className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={styleSettings.sectionTitleColor}
              onChange={(e) => HandleStyleChange('sectionTitleColor', e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 日期格式 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            日期格式
          </label>
          <select
            value={styleSettings.dateFormat || 'dot'}
            onChange={(e) => HandleStyleChange('dateFormat', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="dot">xx.xx - xx.xx</option>
            <option value="chinese">xxxx年xx月 - xxxx年xx月</option>
          </select>
        </div>

        {/* 专业标签样式 */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">专业标签样式</h4>
          
          {/* 标签样式类型 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              样式类型
            </label>
            <select
              value={styleSettings.tagsStyle}
              onChange={(e) => HandleStyleChange('tagsStyle', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="text-separator">文本分隔符</option>
              <option value="tag-badge">标签徽章</option>
              <option value="tag-outline">标签轮廓</option>
              <option value="tag-dot">标签点样式</option>
            </select>
          </div>

          {/* 分隔符样式（仅文本分隔符模式） */}
          {styleSettings.tagsStyle === 'text-separator' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    // 如果选择自定义，保持当前值，显示输入框
                    if (!styleSettings.tagsCustomSeparator) {
                      HandleStyleChange('tagsCustomSeparator', styleSettings.tagsSeparator || '')
                    }
                  } else {
                    HandleStyleChange('tagsSeparator', e.target.value)
                  }
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )
              })()}
            </div>
          )}

          {/* 标签背景色（徽章和轮廓模式） */}
          {(styleSettings.tagsStyle === 'tag-badge' || styleSettings.tagsStyle === 'tag-outline') && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签背景色
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={styleSettings.tagsBackgroundColor}
                  onChange={(e) => HandleStyleChange('tagsBackgroundColor', e.target.value)}
                  className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={styleSettings.tagsBackgroundColor}
                  onChange={(e) => HandleStyleChange('tagsBackgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* 标签文字颜色（徽章和轮廓模式） */}
          {(styleSettings.tagsStyle === 'tag-badge' || styleSettings.tagsStyle === 'tag-outline') && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签文字颜色
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={styleSettings.tagsTextColor}
                  onChange={(e) => HandleStyleChange('tagsTextColor', e.target.value)}
                  className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={styleSettings.tagsTextColor}
                  onChange={(e) => HandleStyleChange('tagsTextColor', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* 标签边框颜色（轮廓模式） */}
          {styleSettings.tagsStyle === 'tag-outline' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签边框颜色
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={styleSettings.tagsBorderColor}
                  onChange={(e) => HandleStyleChange('tagsBorderColor', e.target.value)}
                  className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={styleSettings.tagsBorderColor}
                  onChange={(e) => HandleStyleChange('tagsBorderColor', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* 标签内边距（徽章和轮廓模式） */}
          {(styleSettings.tagsStyle === 'tag-badge' || styleSettings.tagsStyle === 'tag-outline') && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签内边距
              </label>
              <select
                value={styleSettings.tagsPadding}
                onChange={(e) => HandleStyleChange('tagsPadding', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="2px 8px">小（2px 8px）</option>
                <option value="4px 12px">中（4px 12px）</option>
                <option value="6px 16px">大（6px 16px）</option>
                <option value="8px 20px">特大（8px 20px）</option>
              </select>
            </div>
          )}

          {/* 标签圆角（徽章和轮廓模式） */}
          {(styleSettings.tagsStyle === 'tag-badge' || styleSettings.tagsStyle === 'tag-outline') && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签圆角
              </label>
              <select
                value={styleSettings.tagsBorderRadius}
                onChange={(e) => HandleStyleChange('tagsBorderRadius', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0px">无圆角</option>
                <option value="4px">小圆角（4px）</option>
                <option value="8px">中圆角（8px）</option>
                <option value="12px">大圆角（12px）</option>
                <option value="9999px">圆形</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResumeStylePanel

