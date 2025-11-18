import { useState } from 'react'

// 字体选择组件（支持分组、滚动切换和预览）
export default function FontSelector({ value, onChange, fontGroups, previewText = '预览文字' }) {
  const [hoveredFont, setHoveredFont] = useState(null)
  const [previewFont, setPreviewFont] = useState(value)

  const HandleFontClick = (fontValue) => {
    setPreviewFont(fontValue)
    onChange(fontValue)
  }

  const HandleWheel = (e, groupIndex, fontIndex) => {
    e.preventDefault()
    const group = fontGroups[groupIndex]
    if (!group || !group.fonts || group.fonts.length === 0) return

    const delta = e.deltaY > 0 ? 1 : -1
    let newIndex = fontIndex + delta

    if (newIndex < 0) {
      // 切换到上一个组的最后一个字体
      if (groupIndex > 0) {
        const prevGroup = fontGroups[groupIndex - 1]
        if (prevGroup && prevGroup.fonts && prevGroup.fonts.length > 0) {
          const prevFont = prevGroup.fonts[prevGroup.fonts.length - 1]
          HandleFontClick(prevFont.value)
        }
      }
    } else if (newIndex >= group.fonts.length) {
      // 切换到下一个组的第一个字体
      if (groupIndex < fontGroups.length - 1) {
        const nextGroup = fontGroups[groupIndex + 1]
        if (nextGroup && nextGroup.fonts && nextGroup.fonts.length > 0) {
          const nextFont = nextGroup.fonts[0]
          HandleFontClick(nextFont.value)
        }
      }
    } else {
      // 同组内切换
      const newFont = group.fonts[newIndex]
      HandleFontClick(newFont.value)
    }
  }

  return (
    <div className="space-y-3">
      {/* 预览区域 */}
      <div className="bg-white border border-gray-300 rounded-md p-3 min-h-[60px] flex items-center">
        <div
          style={{ fontFamily: previewFont === 'inherit' ? 'inherit' : previewFont }}
          className="text-base text-gray-900 w-full"
        >
          {previewText}
        </div>
      </div>

      {/* 字体分组列表 */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {fontGroups.map((group, groupIndex) => (
          <div key={group.name} className="space-y-1">
            <div className="text-xs font-semibold text-gray-500 px-2 py-1">
              {group.name}
            </div>
            {group.fonts.map((font, fontIndex) => {
              const isSelected = value === font.value
              const isHovered = hoveredFont === font.value
              
              return (
                <div
                  key={font.value}
                  onMouseEnter={() => {
                    setHoveredFont(font.value)
                    setPreviewFont(font.value)
                  }}
                  onMouseLeave={() => {
                    setHoveredFont(null)
                    setPreviewFont(value)
                  }}
                  onWheel={(e) => HandleWheel(e, groupIndex, fontIndex)}
                  onClick={() => HandleFontClick(font.value)}
                  className={`
                    px-3 py-2 text-sm rounded-md cursor-pointer transition-all
                    ${isSelected 
                      ? 'bg-blue-600 text-white' 
                      : isHovered 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  style={{
                    fontFamily: font.value === 'inherit' ? 'inherit' : font.value
                  }}
                >
                  {font.label}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

