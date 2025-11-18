import { useState, useEffect } from 'react'
import { FormatDate } from '../utils/resumeData'

function ResumePreview({ data, style }) {
  const [styleVars, setStyleVars] = useState({})

  useEffect(() => {
    if (style) {
      // 如果用户选择"默认字体"（inherit），使用思源黑体
      const fontFamily = style.fontFamily === 'inherit' 
        ? "'Source Han Sans SC', 'Microsoft YaHei', '微软雅黑', 'SimHei', '黑体', sans-serif"
        : style.fontFamily
      const titleTitleFontSize = style.titleTitleFontSize || style.titleFontSize || 24
      const vars = {
        '--resume-font-family': fontFamily,
        '--resume-font-size': `${style.fontSize}px`,
        '--resume-line-height': style.lineHeight,
        '--resume-title-font-size': `${style.titleFontSize}px`,
        '--resume-title-title-font-size': `${titleTitleFontSize}px`,
        '--resume-section-title-font-size': `${style.sectionTitleFontSize}px`,
        '--resume-text-color': style.textColor,
        '--resume-title-color': style.titleColor,
        '--resume-section-title-color': style.sectionTitleColor,
        '--resume-spacing': `${style.spacing}em`,
        fontFamily: fontFamily
      }
      setStyleVars(vars)
    } else {
      // 默认也使用思源黑体
      setStyleVars({
        '--resume-font-family': "'Source Han Sans SC', 'Microsoft YaHei', '微软雅黑', 'SimHei', '黑体', sans-serif",
        fontFamily: "'Source Han Sans SC', 'Microsoft YaHei', '微软雅黑', 'SimHei', '黑体', sans-serif"
      })
    }
  }, [style])
  const [showEmptySections, setShowEmptySections] = useState({
    tags: false,
    reusableCapabilities: false,
    careerObjective: false,
    advantages: false,
    honors: false,
    workExperiences: false,
    projects: false,
    education: false
  })

  const HasAnyData = () => {
    if (!data) return false
    
    const hasPersonalInfo = data.personalInfo && (
      (data.personalInfo.name && data.personalInfo.name.trim()) ||
      (data.personalInfo.title && data.personalInfo.title.trim()) ||
      (data.personalInfo.phone && data.personalInfo.phone.trim()) ||
      (data.personalInfo.email && data.personalInfo.email.trim()) ||
      (data.personalInfo.works && data.personalInfo.works.length > 0)
    )
    
    const hasTags = data.tags && data.tags.some(tag => tag && tag.trim())
    const hasReusableCapabilities = data.reusableCapabilities && data.reusableCapabilities.some(c => c && c.trim())
    const hasCareerObjective = data.careerObjective && typeof data.careerObjective === 'string' && data.careerObjective.trim()
    const hasAdvantages = data.advantages && data.advantages.some(a => a && a.trim())
    const hasHonors = data.honors && data.honors.some(h => h && h.trim())
    const hasWorkExp = data.workExperiences && data.workExperiences.length > 0
    const hasProjects = data.projects && data.projects.length > 0
    const hasEducation = data.education && (
      (data.education.school && data.education.school.trim()) ||
      (data.education.major && data.education.major.trim()) ||
      (data.education.degree && data.education.degree.trim())
    )
    
    return hasPersonalInfo || hasTags || hasReusableCapabilities || hasCareerObjective || hasAdvantages || hasHonors || hasWorkExp || hasProjects || hasEducation
  }

  const HasSectionData = (section) => {
    switch (section) {
      case 'tags':
        return data.tags && data.tags.some(tag => tag && tag.trim())
      case 'reusableCapabilities':
        return data.reusableCapabilities && data.reusableCapabilities.some(c => c && c.trim())
      case 'careerObjective':
        return data.careerObjective && typeof data.careerObjective === 'string' && data.careerObjective.trim()
      case 'advantages':
        return data.advantages && data.advantages.some(a => a && a.trim())
      case 'honors':
        return data.honors && data.honors.some(h => h && h.trim())
      case 'workExperiences':
        return data.workExperiences && data.workExperiences.length > 0
      case 'projects':
        return data.projects && data.projects.length > 0
      case 'education':
        return data.education && (
          (data.education.school && data.education.school.trim()) ||
          (data.education.major && data.education.major.trim()) ||
          (data.education.degree && data.education.degree.trim())
        )
      default:
        return false
    }
  }

  const hasAnyData = HasAnyData()
  const showAll = !hasAnyData

  const ToggleSection = (section) => {
    setShowEmptySections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const sectionConfigs = [
    { key: 'tags', label: '专业标签' },
    { key: 'reusableCapabilities', label: '可复用能力' },
    { key: 'careerObjective', label: '求职目标' },
    { key: 'advantages', label: '个人优势' },
    { key: 'honors', label: '荣誉证书' },
    { key: 'workExperiences', label: '工作经历' },
    { key: 'projects', label: '项目经历' },
    { key: 'education', label: '教育背景' }
  ]

  const emptySections = sectionConfigs.filter(config => !HasSectionData(config.key))

  // 检查是否有页眉或页脚内容
  const hasHeader = style?.headerText || style?.headerUrl
  const hasFooter = style?.footerText || style?.footerUrl

  return (
    <>
      {/* 打印样式：页眉页脚 */}
      {hasHeader || hasFooter ? (
        <style>{`
          @page {
            margin-top: ${hasHeader ? '60px' : '0'};
            margin-bottom: ${hasFooter ? '60px' : '0'};
          }
          @media print {
            .print-header {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              height: 50px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              color: #666;
              border-bottom: 1px solid #e5e7eb;
              background: white;
              z-index: 1000;
            }
            .print-footer {
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
              height: 50px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #e5e7eb;
              background: white;
              z-index: 1000;
            }
            .print-header a,
            .print-footer a {
              color: #2563eb;
              text-decoration: underline;
            }
            /* 打印时显示链接URL */
            @media print {
              .print-header a::after,
              .print-footer a::after {
                content: ' (' attr(href) ')';
                font-size: 10px;
                color: #666;
                text-decoration: none;
              }
            }
          }
          @media screen {
            .print-header,
            .print-footer {
              display: none;
            }
          }
        `}</style>
      ) : null}

      {/* 页眉 */}
      {hasHeader ? (
        <div className="print-header">
          {style.headerUrl ? (
            <>
              {style.headerText ? (
                <a href={style.headerUrl} target="_blank" rel="noopener noreferrer">
                  {style.headerText}
                </a>
              ) : (
                <a href={style.headerUrl} target="_blank" rel="noopener noreferrer">
                  {style.headerUrl}
                </a>
              )}
            </>
          ) : (
            <span>{style.headerText}</span>
          )}
        </div>
      ) : null}

      {/* 页脚 */}
      {hasFooter ? (
        <div className="print-footer">
          {style.footerUrl ? (
            <>
              {style.footerText ? (
                <a href={style.footerUrl} target="_blank" rel="noopener noreferrer">
                  {style.footerText}
                </a>
              ) : (
                <a href={style.footerUrl} target="_blank" rel="noopener noreferrer">
                  {style.footerUrl}
                </a>
              )}
            </>
          ) : (
            <span>{style.footerText}</span>
          )}
        </div>
      ) : null}

      <div 
        id="resume-preview" 
        className="shadow-lg rounded-lg p-8 max-w-6xl mx-auto print:shadow-none print:p-0 print:rounded-none print:border-0"
        style={{
          ...styleVars,
          backgroundColor: style?.resumeBackgroundColor || '#ffffff'
        }}
      >
      {hasAnyData && emptySections.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md no-print">
          <div className="text-sm text-gray-700 mb-2">显示空模块：</div>
          <div className="flex flex-wrap gap-2">
            {emptySections.map(config => (
              <button
                key={config.key}
                onClick={() => ToggleSection(config.key)}
                className={`text-xs px-3 py-1 rounded border transition-colors ${
                  showEmptySections[config.key]
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <PersonalInfoSection data={data.personalInfo} />
      
      {(() => {
        // 确保sectionOrder包含所有必要的section，兼容旧数据
        const defaultOrder = ['tags', 'reusableCapabilities', 'careerObjective', 'advantages', 'education', 'workExperiences', 'honors', 'projects']
        let sectionOrder = data.sectionOrder || [...defaultOrder]
        
        // 如果旧数据中没有reusableCapabilities，添加到合适的位置（在tags之后）
        if (!sectionOrder.includes('reusableCapabilities')) {
          const tagsIndex = sectionOrder.indexOf('tags')
          if (tagsIndex >= 0) {
            sectionOrder = [...sectionOrder]
            sectionOrder.splice(tagsIndex + 1, 0, 'reusableCapabilities')
          } else {
            sectionOrder = ['reusableCapabilities', ...sectionOrder]
          }
        }
        
        // 如果旧数据中没有careerObjective，添加到合适的位置（在advantages之前）
        if (!sectionOrder.includes('careerObjective')) {
          const advantagesIndex = sectionOrder.indexOf('advantages')
          if (advantagesIndex >= 0) {
            sectionOrder = [...sectionOrder]
            sectionOrder.splice(advantagesIndex, 0, 'careerObjective')
          } else {
            const reusableCapabilitiesIndex = sectionOrder.indexOf('reusableCapabilities')
            if (reusableCapabilitiesIndex >= 0) {
              sectionOrder = [...sectionOrder]
              sectionOrder.splice(reusableCapabilitiesIndex + 1, 0, 'careerObjective')
            } else {
              const tagsIndex = sectionOrder.indexOf('tags')
              if (tagsIndex >= 0) {
                sectionOrder = [...sectionOrder]
                sectionOrder.splice(tagsIndex + 1, 0, 'careerObjective')
              } else {
                sectionOrder = ['careerObjective', ...sectionOrder]
              }
            }
          }
        }
        
        // 如果旧数据中没有advantages，添加到合适的位置（在careerObjective之后）
        if (!sectionOrder.includes('advantages')) {
          const careerObjectiveIndex = sectionOrder.indexOf('careerObjective')
          if (careerObjectiveIndex >= 0) {
            sectionOrder = [...sectionOrder]
            sectionOrder.splice(careerObjectiveIndex + 1, 0, 'advantages')
          } else {
            const reusableCapabilitiesIndex = sectionOrder.indexOf('reusableCapabilities')
            if (reusableCapabilitiesIndex >= 0) {
              sectionOrder = [...sectionOrder]
              sectionOrder.splice(reusableCapabilitiesIndex + 1, 0, 'advantages')
            } else {
              const tagsIndex = sectionOrder.indexOf('tags')
              if (tagsIndex >= 0) {
                sectionOrder = [...sectionOrder]
                sectionOrder.splice(tagsIndex + 1, 0, 'advantages')
              } else {
                sectionOrder = ['advantages', ...sectionOrder]
              }
            }
          }
        }
        
        return sectionOrder
      })().map((sectionKey) => {
        if (sectionKey === 'tags' && (showAll || HasSectionData('tags') || showEmptySections.tags)) {
          return (
            <TagsSection 
              key="tags"
              tags={data.tags} 
              isEmpty={!HasSectionData('tags')}
              style={style}
            />
          )
        }
        if (sectionKey === 'reusableCapabilities' && (showAll || HasSectionData('reusableCapabilities') || showEmptySections.reusableCapabilities)) {
          return (
            <ReusableCapabilitiesSection 
              key="reusableCapabilities"
              capabilities={data.reusableCapabilities}
              isEmpty={!HasSectionData('reusableCapabilities')}
              style={style}
            />
          )
        }
        if (sectionKey === 'careerObjective' && (showAll || HasSectionData('careerObjective') || showEmptySections.careerObjective)) {
          return (
            <CareerObjectiveSection 
              key="careerObjective"
              careerObjective={data.careerObjective}
              isEmpty={!HasSectionData('careerObjective')}
              style={style}
            />
          )
        }
        if (sectionKey === 'advantages' && (showAll || HasSectionData('advantages') || showEmptySections.advantages)) {
          return (
            <AdvantagesSection 
              key="advantages"
              advantages={data.advantages}
              isEmpty={!HasSectionData('advantages')}
              style={style}
            />
          )
        }
        if (sectionKey === 'honors' && (showAll || HasSectionData('honors') || showEmptySections.honors)) {
          return (
            <HonorsSection 
              key="honors"
              honors={data.honors}
              isEmpty={!HasSectionData('honors')}
              style={style}
            />
          )
        }
        if (sectionKey === 'workExperiences' && (showAll || HasSectionData('workExperiences') || showEmptySections.workExperiences)) {
          return (
            <WorkExperiencesSection 
              key="workExperiences"
              experiences={data.workExperiences}
              isEmpty={!HasSectionData('workExperiences')}
              style={style}
            />
          )
        }
        if (sectionKey === 'projects' && (showAll || HasSectionData('projects') || showEmptySections.projects)) {
          return (
            <ProjectsSection 
              key="projects"
              projects={data.projects}
              isEmpty={!HasSectionData('projects')}
              style={style}
            />
          )
        }
        if (sectionKey === 'education' && (showAll || HasSectionData('education') || showEmptySections.education)) {
          return (
            <EducationSection 
              key="education"
              education={data.education}
              isEmpty={!HasSectionData('education')}
              style={style}
            />
          )
        }
        return null
      })}
      </div>
    </>
  )
}

function PersonalInfoSection({ data }) {
  if (!data) {
    return (
      <div className="mb-6" style={{ fontSize: 'var(--resume-font-size, 14px)', lineHeight: 'var(--resume-line-height, 1.6)', color: 'var(--resume-text-color, #1f2937)', marginBottom: 'var(--resume-spacing, 1.5em)' }}>
        {/* 姓名和职位在同一行 */}
        <div className="flex items-start justify-between gap-4 w-full mb-2">
          <div className="flex-shrink-0">
            <div className="font-bold" style={{ fontSize: 'var(--resume-title-font-size, 24px)', color: 'var(--resume-title-color, #111827)', fontFamily: 'var(--resume-font-family, inherit)' }}>
              （姓名）
            </div>
          </div>
          <div className="flex-shrink-0">
            <div style={{ fontSize: 'var(--resume-title-title-font-size, var(--resume-title-font-size, 24px))', color: 'var(--resume-text-color, #1f2937)', fontFamily: 'var(--resume-font-family, inherit)' }}>
              <span className="font-normal">（职位）</span>
            </div>
          </div>
          <div className="flex-shrink-0"></div>
        </div>
        <div className="italic mb-4" style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>（暂无联系信息）</div>
        <div className="border-b border-gray-300 my-4"></div>
      </div>
    )
  }

  const infoItems = []
  
  if (data.phone && data.phone.trim()) {
    infoItems.push(`电话：${data.phone}`)
  }
  if (data.email && data.email.trim()) {
    infoItems.push(`邮箱：${data.email}`)
  }
  if (data.age && data.age.trim()) {
    infoItems.push(`年龄：${data.age}`)
  }
  if (data.blog && data.blog.trim()) {
    infoItems.push(`博客：${data.blog}`)
  }
  if (data.github && data.github.trim()) {
    infoItems.push(`github：${data.github}`)
  }
  if (data.targetCity && data.targetCity.trim()) {
    infoItems.push(`目标城市：${data.targetCity}`)
  }
  
  const works = data.works && data.works.length > 0 
    ? data.works.filter(w => w.name && w.url).map(w => `${w.name}：${w.url}`)
    : []
  
  const allItems = [...infoItems, ...works]
  
  const columns = [[], [], []]
  allItems.forEach((item, index) => {
    columns[index % 3].push(item)
  })
  
  // 计算每列的最大宽度
  const columnWidths = columns.map(column => {
    const maxLength = column.reduce((max, item) => Math.max(max, item ? item.length : 0), 0)
    return maxLength * 0.6
  })
  
  // 计算职位文本宽度，用于确定中间列宽度
  const titleText = data.title && data.title.trim() ? data.title : '（职位）'
  const titleWidth = titleText.length * 0.6
  
  // 计算中间列的最大宽度（包括职位和联系信息）
  const middleColumnWidth = Math.max(columnWidths[1], titleWidth)
  
  return (
    <div className="mb-6" style={{ fontSize: 'var(--resume-font-size, 14px)', lineHeight: 'var(--resume-line-height, 1.6)', color: 'var(--resume-text-color, #1f2937)', marginBottom: 'var(--resume-spacing, 1.5em)' }}>
      {/* 姓名和职位在同一行，使用三列布局 */}
      <div className="flex items-start justify-between gap-4 w-full mb-2">
        {/* 左列 - 姓名 */}
        <div className="flex-shrink-0" style={{ minWidth: `${columnWidths[0]}em` }}>
          <div className="font-bold" style={{ fontSize: 'var(--resume-title-font-size, 24px)', color: 'var(--resume-title-color, #111827)', fontFamily: 'var(--resume-font-family, inherit)' }}>
            {data.name && data.name.trim() ? data.name : '（姓名）'}
          </div>
        </div>
        {/* 中间列 - 职位 */}
        <div className="flex-shrink-0" style={{ minWidth: `${middleColumnWidth}em` }}>
          <div style={{ fontSize: 'var(--resume-title-title-font-size, var(--resume-title-font-size, 24px))', color: 'var(--resume-text-color, #1f2937)', fontFamily: 'var(--resume-font-family, inherit)' }}>
            <span className="font-normal">{titleText}</span>
          </div>
        </div>
        {/* 右列 - 空 */}
        <div className="flex-shrink-0" style={{ minWidth: `${columnWidths[2]}em` }}></div>
      </div>
      {/* 联系信息使用相同的三列布局 */}
      {allItems.length > 0 ? (
        <div className="flex items-start justify-between gap-4 w-full">
          {/* 左列 */}
          <div className="flex-shrink-0 space-y-1" style={{ minWidth: `${columnWidths[0]}em` }}>
            {columns[0].map((item, itemIndex) => (
              <div key={itemIndex} className="text-left whitespace-nowrap" style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>{item}</div>
            ))}
          </div>
          {/* 中间列 - 联系信息 */}
          <div className="flex-shrink-0 space-y-1" style={{ minWidth: `${middleColumnWidth}em` }}>
            {columns[1].map((item, itemIndex) => (
              <div key={itemIndex} className="text-left whitespace-nowrap" style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>{item}</div>
            ))}
          </div>
          {/* 右列 */}
          <div className="flex-shrink-0 space-y-1" style={{ minWidth: `${columnWidths[2]}em` }}>
            {columns[2].map((item, itemIndex) => (
              <div key={itemIndex} className="text-left whitespace-nowrap" style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>{item}</div>
            ))}
          </div>
        </div>
      ) : (
        <div className="italic mb-4" style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>（暂无联系信息）</div>
      )}
      <div className="border-b border-gray-300 my-4"></div>
    </div>
  )
}

// 获取章节样式
const GetSectionStyle = (style) => {
  const baseStyle = { marginBottom: 'var(--resume-spacing, 1.5em)' }
  if (style?.useSectionBackground && style?.sectionBackgroundColor) {
    return {
      ...baseStyle,
      backgroundColor: style.sectionBackgroundColor,
      padding: '1em',
      borderRadius: '4px'
    }
  }
  return baseStyle
}

function TagsSection({ tags, isEmpty, style }) {
  const validTags = tags && tags.length > 0 ? tags.filter(tag => tag && tag.trim()) : []
  
  const GetTagsStyle = () => {
    if (!style || !style.tagsStyle) {
      return 'text-separator'
    }
    return style.tagsStyle
  }
  
  const tagsStyle = GetTagsStyle()
  
  const RenderTags = () => {
    if (validTags.length === 0) {
      return (
        <div className="italic" style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>（暂无）</div>
      )
    }
    
    switch (tagsStyle) {
      case 'text-separator':
        const separator = style?.tagsSeparator || '｜'
        return (
          <div className="flex flex-wrap gap-2" style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>
            {validTags.map((tag, index) => (
              <span key={index}>
                {tag}{index < validTags.length - 1 ? separator : ''}
              </span>
            ))}
          </div>
        )
      
      case 'tag-badge':
        const badgeBgColor = style?.tagsBackgroundColor || '#e5e7eb'
        const badgeTextColor = style?.tagsTextColor || '#1f2937'
        const badgePadding = style?.tagsPadding || '4px 12px'
        const badgeRadius = style?.tagsBorderRadius || '4px'
        return (
          <div className="flex flex-wrap gap-2">
            {validTags.map((tag, index) => (
              <span
                key={index}
                style={{
                  fontSize: 'var(--resume-font-size, 14px)',
                  fontFamily: 'var(--resume-font-family, inherit)',
                  backgroundColor: badgeBgColor,
                  color: badgeTextColor,
                  padding: badgePadding,
                  borderRadius: badgeRadius,
                  display: 'inline-block'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )
      
      case 'tag-outline':
        const outlineBgColor = style?.tagsBackgroundColor || 'transparent'
        const outlineTextColor = style?.tagsTextColor || '#1f2937'
        const outlineBorderColor = style?.tagsBorderColor || '#d1d5db'
        const outlinePadding = style?.tagsPadding || '4px 12px'
        const outlineRadius = style?.tagsBorderRadius || '4px'
        return (
          <div className="flex flex-wrap gap-2">
            {validTags.map((tag, index) => (
              <span
                key={index}
                style={{
                  fontSize: 'var(--resume-font-size, 14px)',
                  fontFamily: 'var(--resume-font-family, inherit)',
                  backgroundColor: outlineBgColor,
                  color: outlineTextColor,
                  border: `1px solid ${outlineBorderColor}`,
                  padding: outlinePadding,
                  borderRadius: outlineRadius,
                  display: 'inline-block'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )
      
      case 'tag-dot':
        return (
          <div className="flex flex-wrap gap-2" style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>
            {validTags.map((tag, index) => (
              <span key={index} className="flex items-center gap-1">
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--resume-text-color, #1f2937)',
                    display: 'inline-block',
                    flexShrink: 0
                  }}
                ></span>
                {tag}
              </span>
            ))}
          </div>
        )
      
      default:
        return (
          <div className="flex flex-wrap gap-2" style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>
            {validTags.map((tag, index) => (
              <span key={index}>
                {tag}{index < validTags.length - 1 ? '｜' : ''}
              </span>
            ))}
          </div>
        )
    }
  }
  
  return (
    <div className="mb-6" style={GetSectionStyle(style)}>
      <h2 className="font-semibold mb-2" style={{ fontSize: 'var(--resume-section-title-font-size, 18px)', color: 'var(--resume-section-title-color, #374151)', fontFamily: 'var(--resume-font-family, inherit)' }}>专业标签</h2>
      {RenderTags()}
    </div>
  )
}

function CareerObjectiveSection({ careerObjective, isEmpty, style }) {
  const validCareerObjective = (careerObjective && typeof careerObjective === 'string' && careerObjective.trim()) ? careerObjective : ''
  return (
    <div className="mb-6" style={GetSectionStyle(style)}>
      <h2 className="font-semibold mb-2" style={{ fontSize: 'var(--resume-section-title-font-size, 18px)', color: 'var(--resume-section-title-color, #374151)', fontFamily: 'var(--resume-font-family, inherit)' }}>求职目标</h2>
      {validCareerObjective ? (
        <div style={{ fontSize: 'var(--resume-font-size, 14px)', lineHeight: 'var(--resume-line-height, 1.6)', fontFamily: 'var(--resume-font-family, inherit)' }}>
          {validCareerObjective}
        </div>
      ) : (
        <div className="italic" style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>（暂无）</div>
      )}
    </div>
  )
}

function ReusableCapabilitiesSection({ capabilities, isEmpty, style }) {
  const validCapabilities = capabilities && capabilities.length > 0 
    ? capabilities.filter(c => c && c.trim()) 
    : []
  return (
    <div className="mb-6" style={GetSectionStyle(style)}>
      <h2 className="font-semibold mb-2" style={{ fontSize: 'var(--resume-section-title-font-size, 18px)', color: 'var(--resume-section-title-color, #374151)', fontFamily: 'var(--resume-font-family, inherit)' }}>可复用能力</h2>
      {validCapabilities.length > 0 ? (
        validCapabilities.map((capability, index) => (
          <div key={index} className="mb-1" style={{ fontSize: 'var(--resume-font-size, 14px)', lineHeight: 'var(--resume-line-height, 1.6)', fontFamily: 'var(--resume-font-family, inherit)' }}>
            {index + 1}、{capability}
          </div>
        ))
      ) : (
        <div className="italic" style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>（暂无）</div>
      )}
    </div>
  )
}

function AdvantagesSection({ advantages, isEmpty, style }) {
  const validAdvantages = advantages && advantages.length > 0 
    ? advantages.filter(a => a && a.trim()) 
    : []
  return (
    <div className="mb-6" style={GetSectionStyle(style)}>
      <h2 className="font-semibold mb-2" style={{ fontSize: 'var(--resume-section-title-font-size, 18px)', color: 'var(--resume-section-title-color, #374151)', fontFamily: 'var(--resume-font-family, inherit)' }}>个人优势</h2>
      {validAdvantages.length > 0 ? (
        validAdvantages.map((advantage, index) => (
          <div key={index} className="mb-1" style={{ fontSize: 'var(--resume-font-size, 14px)', lineHeight: 'var(--resume-line-height, 1.6)', fontFamily: 'var(--resume-font-family, inherit)' }}>
            {index + 1}、{advantage}
          </div>
        ))
      ) : (
        <div className="italic" style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>（暂无）</div>
      )}
    </div>
  )
}

function HonorsSection({ honors, isEmpty, style }) {
  const validHonors = honors && honors.length > 0 ? honors.filter(h => h && h.trim()) : []
  return (
    <div className="mb-6" style={GetSectionStyle(style)}>
      <h2 className="font-semibold mb-2" style={{ fontSize: 'var(--resume-section-title-font-size, 18px)', color: 'var(--resume-section-title-color, #374151)', fontFamily: 'var(--resume-font-family, inherit)' }}>荣誉证书</h2>
      {validHonors.length > 0 ? (
        <div style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>
          {validHonors.map((honor, index) => (
            <span key={index}>
              {honor}{index < validHonors.length - 1 ? '，' : ''}
            </span>
          ))}
        </div>
      ) : (
        <div className="italic" style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>（暂无）</div>
      )}
    </div>
  )
}

function WorkExperiencesSection({ experiences, isEmpty, style }) {
  const validExperiences = experiences && experiences.length > 0 ? experiences : []
  const dateFormat = style?.dateFormat || 'dot'
  return (
    <div className="mb-6" style={GetSectionStyle(style)}>
      <h2 className="font-semibold mb-4" style={{ fontSize: 'var(--resume-section-title-font-size, 18px)', color: 'var(--resume-section-title-color, #374151)', fontFamily: 'var(--resume-font-family, inherit)' }}>工作经历</h2>
      {validExperiences.length > 0 ? (
        validExperiences.map((exp, index) => (
        <div key={index} className="mb-6" style={{ marginBottom: 'var(--resume-spacing, 1.5em)' }}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="font-semibold" style={{ fontSize: 'var(--resume-font-size, 14px)', color: 'var(--resume-text-color, #1f2937)', fontFamily: 'var(--resume-font-family, inherit)' }}>
                {exp.company}
                {exp.position && (
                  <span style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}> | {exp.position}</span>
                )}
                {exp.companyType && (
                  <span style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}> | {exp.companyType}</span>
                )}
              </span>
            </div>
            <div className="text-right">
              <div style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>{FormatDate(exp.period, dateFormat)}</div>
            </div>
          </div>
          {exp.reportTo && exp.reportTo.trim() && (
            <div className="mb-1" style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>汇报对象：{exp.reportTo}</div>
          )}
          {exp.subordinates && exp.subordinates.trim() && (
            <div className="mb-1" style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>下属：{exp.subordinates}</div>
          )}
          {exp.promotionPath && exp.promotionPath.trim() && (
            <div className="mb-2" style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>晋升路径：{exp.promotionPath}</div>
          )}
          {exp.achievements && exp.achievements.length > 0 && (
            <div className="mb-3">
              <div className="font-medium mb-1" style={{ fontSize: 'var(--resume-font-size, 14px)', color: 'var(--resume-text-color, #1f2937)', fontFamily: 'var(--resume-font-family, inherit)' }}>工作业绩</div>
              {exp.achievements.map((achievement, aIndex) => (
                <div key={aIndex} className="mb-1 ml-4" style={{ fontSize: 'var(--resume-font-size, 14px)', lineHeight: 'var(--resume-line-height, 1.6)', fontFamily: 'var(--resume-font-family, inherit)' }}>
                  {`${aIndex + 1}、${achievement}`}
                </div>
              ))}
            </div>
          )}
          {exp.responsibilities && exp.responsibilities.length > 0 && (
            <div>
              <div className="font-medium mb-1" style={{ fontSize: 'var(--resume-font-size, 14px)', color: 'var(--resume-text-color, #1f2937)', fontFamily: 'var(--resume-font-family, inherit)' }}>工作内容</div>
              {exp.responsibilities.map((responsibility, rIndex) => (
                <div key={rIndex} className="mb-1 ml-4" style={{ fontSize: 'var(--resume-font-size, 14px)', lineHeight: 'var(--resume-line-height, 1.6)', fontFamily: 'var(--resume-font-family, inherit)' }}>
                  {`${rIndex + 1}、${responsibility}`}
                </div>
              ))}
            </div>
          )}
        </div>
        ))
      ) : (
        <div className="italic" style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>（暂无）</div>
      )}
    </div>
  )
}

function ProjectsSection({ projects, isEmpty, style }) {
  const validProjects = projects && projects.length > 0 ? projects : []
  const dateFormat = style?.dateFormat || 'dot'
  return (
    <div className="mb-6" style={GetSectionStyle(style)}>
      <h2 className="font-semibold mb-4" style={{ fontSize: 'var(--resume-section-title-font-size, 18px)', color: 'var(--resume-section-title-color, #374151)', fontFamily: 'var(--resume-font-family, inherit)' }}>项目经历</h2>
      {validProjects.length > 0 ? (
        validProjects.map((project, index) => (
        <div key={index} className="mb-6" style={{ marginBottom: 'var(--resume-spacing, 1.5em)' }}>
          <div className="flex items-start justify-between mb-2">
            <div className="font-semibold" style={{ fontSize: 'var(--resume-font-size, 14px)', color: 'var(--resume-text-color, #1f2937)', fontFamily: 'var(--resume-font-family, inherit)' }}>
              {project.name}
              {project.role && project.role.trim() && (
                <span style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}> | {project.role}</span>
              )}
            </div>
            {project.period && project.period.trim() && (
              <div className="text-right" style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>
                {FormatDate(project.period, dateFormat)}
              </div>
            )}
          </div>
          {project.description && project.description.length > 0 && (
            <div className="space-y-1">
              {project.description.map((desc, dIndex) => (
                <div key={dIndex} className="mb-1" style={{ fontSize: 'var(--resume-font-size, 14px)', lineHeight: 'var(--resume-line-height, 1.6)', fontFamily: 'var(--resume-font-family, inherit)' }}>
                  {`${dIndex + 1}、${desc}`}
                </div>
              ))}
            </div>
          )}
        </div>
        ))
      ) : (
        <div className="italic" style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>（暂无）</div>
      )}
    </div>
  )
}

function EducationSection({ education, isEmpty, style }) {
  const hasEducationData = education && (
    education.school?.trim() ||
    education.level?.trim() ||
    education.degree?.trim() ||
    education.duration ||
    education.major?.trim() ||
    education.period?.trim() ||
    (education.startYear && education.endYear)
  )
  
  const dateFormat = style?.dateFormat || 'dot'
  
  // 构建时间段显示
  const GetPeriodText = () => {
    let periodText = null
    if (education.period && education.period.trim()) {
      periodText = education.period
    } else if (education.startYear && education.endYear) {
      const startMonth = education.startMonth || 9
      const endMonth = education.endMonth || 6
      periodText = `${education.startYear}年${startMonth}月 — ${education.endYear}年${endMonth}月`
    }
    
    // 格式化日期
    if (periodText) {
      return FormatDate(periodText, dateFormat)
    }
    return null
  }
  
  const periodText = GetPeriodText()
  
  // 构建左侧：学校名称 · 专业 · 学历（学制）
  const leftItems = []
  if (education.school && education.school.trim()) {
    leftItems.push(education.school)
  }
  if (education.major && education.major.trim()) {
    leftItems.push(education.major)
  }
  if (education.degree && education.degree.trim()) {
    // 如果有学制，将学制添加到学历后面
    let degreeText = education.degree
    if (education.duration) {
      degreeText = `${education.degree}（${education.duration}年制）`
    }
    // 双一流
    if (education.level && education.level.trim()) {
      degreeText = `${degreeText}（${education.level}）`
    }
    leftItems.push(degreeText)
  }
  
  
  
  const separator = style?.tagsSeparator || '｜'
  const leftText = leftItems.join(separator)
  
  // 构建右侧：学校级别、时间
  const rightItems = []
  if (periodText) {
    rightItems.push(periodText)
  }
  
  return (
    <div className="mb-6" style={GetSectionStyle(style)}>
      <h2 className="font-semibold mb-4" style={{ fontSize: 'var(--resume-section-title-font-size, 18px)', color: 'var(--resume-section-title-color, #374151)', fontFamily: 'var(--resume-font-family, inherit)' }}>教育背景</h2>
      {hasEducationData ? (
        <>
          <div className="flex items-center justify-between gap-4 mb-2" style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>
            {/* 左侧：学校名称 · 专业 · 学历 */}
            <div className="flex-shrink-0">
              {leftText || ''}
            </div>
            
            {/* 右侧：学校级别、学制、时间 */}
            <div className="flex items-center gap-4 flex-shrink-0 flex-wrap justify-end">
              {rightItems.map((item, index) => (
                <span key={index}>
                  {item}
                </span>
              ))}
            </div>
          </div>
          {education.achievements && education.achievements.length > 0 && (
            <div className="mt-2">
              {education.achievements.map((achievement, index) => (
                <div key={index} className="mb-1" style={{ fontSize: 'var(--resume-font-size, 14px)', lineHeight: 'var(--resume-line-height, 1.6)', fontFamily: 'var(--resume-font-family, inherit)' }}>
                  {index + 1}.{achievement}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="italic" style={{ fontSize: 'var(--resume-font-size, 14px)', fontFamily: 'var(--resume-font-family, inherit)' }}>（暂无）</div>
      )}
    </div>
  )
}

export default ResumePreview

