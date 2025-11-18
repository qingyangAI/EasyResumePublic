// 将简历数据转换为 pdfmake 文档结构
import { FormatDate } from './resumeData'
import { GetPdfMakeFontName } from './fontMapping'

// 将px转换为pt（PDF标准单位）
// 1px = 0.75pt (在96 DPI下，标准转换)
// 但考虑到PDF和屏幕显示的视觉差异，使用稍微调整的比例以保持一致性
const PxToPt = (px) => {
  // 标准转换是 0.75，但为了在PDF中保持与屏幕相似的视觉效果
  // 使用 0.75 的标准比例，这样PDF中的字体大小会更接近屏幕显示
  return px * 0.75
}

// 将em转换为pt（用于spacing）
// 1em = fontSize pt，所以需要乘以当前字体大小
const EmToPt = (em, fontSizePt) => {
  return em * fontSizePt
}

// PDF间距微调配置（可在顶部统一调整，与前端预览一一对应）
const PDF_SPACING_CONFIG = {
  // 章节标题上边距倍数（相对于spacingPt）
  // 前端：章节之间使用 spacing (1.5em)，对应 spacingPt
  sectionTitleMarginTopMultiplier: 1,
  // 章节标题下边距（pt）
  // 前端：mb-2 = 0.5rem ≈ 8px ≈ 6pt
  sectionTitleMarginBottom: 6,
  // 章节内容下边距倍数（相对于spacingPt）
  // 前端：章节之间使用 spacing (1.5em)，对应 spacingPt
  sectionContentMarginBottomMultiplier: 1,
  // 列表项之间的间距（pt）
  // 前端：mb-1 = 0.25rem ≈ 4px ≈ 3pt
  listItemMarginBottom: 3,
  // 工作经历/项目经历之间的间距倍数（相对于spacingPt）
  // 前端：mb-6 + marginBottom: spacing = 1.5rem + 1.5em，主要使用 spacing
  workItemMarginBottomMultiplier: 1
}

// PDF比例微调配置（调整PDF与前端预览的比例一致性）
// 前端预览：max-w-6xl (1152px) - p-8 (64px) = 1088px 内容宽度 ≈ 816pt
// PDF A4：595.28pt 页面宽度
// 为了匹配比例，可以调整边距和缩放因子
const PDF_LAYOUT_CONFIG = {
  // 页面左右边距（pt），调整此值可以改变内容宽度比例
  // 默认40pt，减小此值可以增加内容宽度，使比例更接近前端预览
  // 建议范围：20-50pt
  pageMarginHorizontal: 30,
  // 页面上下边距（pt）
  pageMarginVertical: 60,
  // 整体比例缩放因子（用于微调整体比例，使PDF与前端预览的视觉比例一致）
  // 1.0 = 不缩放，>1.0 = 放大，<1.0 = 缩小
  // 建议范围：0.8-1.2，根据实际效果调整
  scaleFactor: 0.95
}

// 将简历数据转换为 pdfmake 文档定义
export const ConvertResumeToPdfMakeDoc = (resumeData, resumeStyle) => {
  const content = []
  
  // 获取样式设置（px值）
  const fontSizePx = resumeStyle?.fontSize || 14
  const titleFontSizePx = resumeStyle?.titleFontSize || 24
  const sectionTitleFontSizePx = resumeStyle?.sectionTitleFontSize || 18
  const lineHeight = resumeStyle?.lineHeight || 1.6
  const textColor = resumeStyle?.textColor || '#1f2937'
  const titleColor = resumeStyle?.titleColor || '#111827'
  const sectionTitleColor = resumeStyle?.sectionTitleColor || '#374151'
  const spacing = resumeStyle?.spacing || 1.5
  
  // 转换为pt单位（PDF标准单位）
  // 应用字体大小缩放因子（用于微调字体比例）
  const fontSize = PxToPt(fontSizePx) * PDF_LAYOUT_CONFIG.scaleFactor
  const titleFontSize = PxToPt(titleFontSizePx) * PDF_LAYOUT_CONFIG.scaleFactor
  const sectionTitleFontSize = PxToPt(sectionTitleFontSizePx) * PDF_LAYOUT_CONFIG.scaleFactor
  
  // 将spacing从em转换为pt（1em = fontSize pt）
  const spacingPt = EmToPt(spacing, fontSize)
  
  // 计算PDF页面内容宽度（A4宽度 - 左右边距）
  // A4页面宽度：595.28pt
  const pageContentWidth = 595.28 - (PDF_LAYOUT_CONFIG.pageMarginHorizontal * 2)
  
  // 计算章节间距（使用配置的倍数，与前端预览一一对应）
  let sectionTitleMarginTop = spacingPt * PDF_SPACING_CONFIG.sectionTitleMarginTopMultiplier
  let sectionTitleMarginBottom = PDF_SPACING_CONFIG.sectionTitleMarginBottom
  let sectionContentMarginBottom = spacingPt * PDF_SPACING_CONFIG.sectionContentMarginBottomMultiplier
  let listItemMarginBottom = PDF_SPACING_CONFIG.listItemMarginBottom
  let workItemMarginBottom = spacingPt * PDF_SPACING_CONFIG.workItemMarginBottomMultiplier
  
  // 段落章节间距倍数微调 除以1.1
  const sectionTitleMarginTopMultiplier = 2
  sectionTitleMarginTop = sectionTitleMarginTop / sectionTitleMarginTopMultiplier
  sectionTitleMarginBottom = sectionTitleMarginBottom / sectionTitleMarginTopMultiplier
  sectionContentMarginBottom = sectionContentMarginBottom / sectionTitleMarginTopMultiplier
  listItemMarginBottom = listItemMarginBottom / sectionTitleMarginTopMultiplier
  workItemMarginBottom = workItemMarginBottom / sectionTitleMarginTopMultiplier


  // 除了个人信息外，其他部分的lineHeight需要除以1
  const contentLineHeight = lineHeight / 1.2
  
  // 个人信息
  if (resumeData.personalInfo) {
    const pi = resumeData.personalInfo
    
    // 获取对齐配置，默认全部左对齐
    const layout = resumeStyle?.personalInfoLayout || {
      rows: [
        { columns: ['left', 'left', 'left'] }, // 第一行：姓名、职位、空
        { columns: ['left', 'left', 'left'] }  // 第二行及以后：联系信息
      ]
    }
    
    // 确保layout.rows存在且至少有一行
    const rowLayouts = layout.rows || [{ columns: ['left', 'left', 'left'] }]
    const firstRowLayout = rowLayouts[0] || { columns: ['left', 'left', 'left'] }
    const contactRowLayout = rowLayouts[1] || rowLayouts[0] || { columns: ['left', 'left', 'left'] }
    
    // 将pdfmake对齐方式转换为对齐字符串
    const getPdfAlignment = (align) => {
      switch (align) {
        case 'center': return 'center'
        case 'right': return 'right'
        default: return 'left'
      }
    }
    
    // 收集联系信息
    const contactInfo = []
    if (pi.phone && pi.phone.trim()) contactInfo.push(`电话：${pi.phone}`)
    if (pi.email && pi.email.trim()) contactInfo.push(`邮箱：${pi.email}`)
    if (pi.age && pi.age.trim()) contactInfo.push(`年龄：${pi.age}`)
    if (pi.blog && pi.blog.trim()) contactInfo.push(`博客：${pi.blog}`)
    if (pi.github && pi.github.trim()) contactInfo.push(`GitHub：${pi.github}`)
    if (pi.targetCity && pi.targetCity.trim()) contactInfo.push(`目标城市：${pi.targetCity}`)
    if (pi.works && pi.works.length > 0) {
      pi.works.forEach(work => {
        if (work.name && work.url) {
          contactInfo.push(`${work.name}：${work.url}`)
        }
      })
    }
    
    // 将联系信息分成3列（与页面预览保持一致）
    const cols = [[], [], []]
    contactInfo.forEach((item, index) => {
      cols[index % 3].push(item)
    })
    
    // 第一行：姓名和职位，使用三列布局，支持独立对齐
    const nameText = pi.name && pi.name.trim() ? pi.name : ''
    const titleText = pi.title && pi.title.trim() ? pi.title : ''
    const titleTitleFontSizePx = resumeStyle?.titleTitleFontSize || resumeStyle?.titleFontSize || 24
    const titleTitleFontSize = PxToPt(titleTitleFontSizePx) * PDF_LAYOUT_CONFIG.scaleFactor
    
    if (nameText || titleText) {
      content.push({
        columns: [
          // 左列：姓名
          {
            width: '*',
            text: nameText ? [{
              text: nameText,
              fontSize: titleFontSize,
              bold: true,
              color: titleColor,
              lineHeight: 1.2
            }] : '',
            alignment: getPdfAlignment(firstRowLayout.columns[0])
          },
          // 中列：职位
          {
            width: '*',
            text: titleText ? [{
              text: titleText,
              fontSize: titleTitleFontSize,
              color: textColor,
              lineHeight: 1.2
            }] : '',
            alignment: getPdfAlignment(firstRowLayout.columns[1])
          },
          // 右列：空
          {
            width: '*',
            text: '',
            alignment: getPdfAlignment(firstRowLayout.columns[2])
          }
        ],
        columnGap: 10,
        marginBottom: 5
      })
    }
    
    // 联系信息（三列布局，支持独立对齐）
    if (contactInfo.length > 0) {
      const maxLines = Math.max(...cols.map(col => col.length))
      for (let i = 0; i < maxLines; i++) {
        const leftCol = cols[0][i] || ''
        const middleCol = cols[1][i] || ''
        const rightCol = cols[2][i] || ''
        
        if (leftCol || middleCol || rightCol) {
          content.push({
            columns: [
              // 左列
              {
                width: '*',
                text: leftCol ? [{
                  text: leftCol,
                  fontSize: fontSize,
                  color: textColor,
                  lineHeight: lineHeight
                }] : '',
                alignment: getPdfAlignment(contactRowLayout.columns[0])
              },
              // 中列
              {
                width: '*',
                text: middleCol ? [{
                  text: middleCol,
                  fontSize: fontSize,
                  color: textColor,
                  lineHeight: lineHeight
                }] : '',
                alignment: getPdfAlignment(contactRowLayout.columns[1])
              },
              // 右列
              {
                width: '*',
                text: rightCol ? [{
                  text: rightCol,
                  fontSize: fontSize,
                  color: textColor,
                  lineHeight: lineHeight
                }] : '',
                alignment: getPdfAlignment(contactRowLayout.columns[2])
              }
            ],
            columnGap: 10,
            marginBottom: 2
          })
        }
      }
    }
    
    // 分隔线
    content.push({
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: pageContentWidth, // 动态计算的内容宽度
          y2: 0,
          lineWidth: 0.5,
          lineColor: '#d1d5db'
        }
      ],
      marginTop: 10,
      marginBottom: 10
    })
  }
  
  // 获取section顺序
  const sectionOrder = resumeData.sectionOrder || ['tags', 'reusableCapabilities', 'careerObjective', 'advantages', 'education', 'workExperiences', 'honors', 'projects']
  
  sectionOrder.forEach((sectionKey) => {
    // 专业标签
    if (sectionKey === 'tags' && resumeData.tags && resumeData.tags.length > 0) {
      const validTags = resumeData.tags.filter(tag => tag && tag.trim())
      if (validTags.length > 0) {
        content.push({
          text: '专业标签',
          fontSize: sectionTitleFontSize,
          bold: true,
          color: sectionTitleColor,
          lineHeight: contentLineHeight,
          marginTop: sectionTitleMarginTop,
          marginBottom: sectionTitleMarginBottom
        })
        const separator = resumeStyle?.tagsSeparator || '｜'
        content.push({
          text: validTags.join(separator),
          fontSize: fontSize,
          color: textColor,
          lineHeight: contentLineHeight,
          marginBottom: sectionContentMarginBottom
        })
      }
    }
    
    // 可复用能力
    if (sectionKey === 'reusableCapabilities' && resumeData.reusableCapabilities && resumeData.reusableCapabilities.length > 0) {
      const validCapabilities = resumeData.reusableCapabilities.filter(c => c && c.trim())
      if (validCapabilities.length > 0) {
        content.push({
          text: '可复用能力',
          fontSize: sectionTitleFontSize,
          bold: true,
          color: sectionTitleColor,
          lineHeight: contentLineHeight,
          marginTop: sectionTitleMarginTop,
          marginBottom: sectionTitleMarginBottom
        })
        validCapabilities.forEach((capability, index) => {
          content.push({
            text: `${index + 1}、${capability}`,
            fontSize: fontSize,
            color: textColor,
            lineHeight: contentLineHeight,
            marginBottom: listItemMarginBottom // 列表项间距，对应前端 mb-1
          })
        })
        content.push({ text: '', marginBottom: sectionContentMarginBottom })
      }
    }
    
    // 求职目标
    if (sectionKey === 'careerObjective' && resumeData.careerObjective && typeof resumeData.careerObjective === 'string' && resumeData.careerObjective.trim()) {
      content.push({
        text: '求职目标',
        fontSize: sectionTitleFontSize,
        bold: true,
        color: sectionTitleColor,
        lineHeight: contentLineHeight,
        marginTop: sectionTitleMarginTop,
        marginBottom: sectionTitleMarginBottom
      })
      content.push({
        text: resumeData.careerObjective,
        fontSize: fontSize,
        color: textColor,
        lineHeight: contentLineHeight,
        marginBottom: sectionContentMarginBottom
      })
    }
    
    // 个人优势
    if (sectionKey === 'advantages' && resumeData.advantages && resumeData.advantages.length > 0) {
      const validAdvantages = resumeData.advantages.filter(a => a && a.trim())
      if (validAdvantages.length > 0) {
        content.push({
          text: '个人优势',
          fontSize: sectionTitleFontSize,
          bold: true,
          color: sectionTitleColor,
          lineHeight: contentLineHeight,
          marginTop: sectionTitleMarginTop,
          marginBottom: sectionTitleMarginBottom
        })
        validAdvantages.forEach((advantage, index) => {
          content.push({
            text: `${index + 1}、${advantage}`,
            fontSize: fontSize,
            color: textColor,
            lineHeight: contentLineHeight,
            marginBottom: listItemMarginBottom // 列表项间距，对应前端 mb-1
          })
        })
        content.push({ text: '', marginBottom: sectionContentMarginBottom })
      }
    }
    
    // 教育背景
    if (sectionKey === 'education' && resumeData.education) {
      const edu = resumeData.education
      const eduItems = []
      if (edu.school && edu.school.trim()) eduItems.push(edu.school)
      if (edu.major && edu.major.trim()) eduItems.push(edu.major)
      if (edu.degree && edu.degree.trim()) {
        let degreeText = edu.degree
        if (edu.duration) {
          degreeText = `${degreeText}（${edu.duration}年制）`
        }
        if (edu.level && edu.level.trim()) {
          degreeText = `${degreeText}（${edu.level}）`
        }
        eduItems.push(degreeText)
      }
      
      const periodText = edu.period && edu.period.trim() 
        ? FormatDate(edu.period, resumeStyle?.dateFormat || 'dot')
        : (edu.startYear && edu.endYear 
          ? `${edu.startYear}年${edu.startMonth || 9}月 — ${edu.endYear}年${edu.endMonth || 6}月`
          : '')
      
      if (eduItems.length > 0 || periodText) {
        content.push({
          text: '教育背景',
          fontSize: sectionTitleFontSize,
          bold: true,
          color: sectionTitleColor,
          lineHeight: contentLineHeight,
          marginTop: sectionTitleMarginTop,
          marginBottom: sectionTitleMarginBottom
        })
        if (eduItems.length > 0) {
          const separator = resumeStyle?.tagsSeparator || '｜'
          content.push({
            text: eduItems.join(separator),
            fontSize: fontSize,
            color: textColor,
            lineHeight: contentLineHeight,
            marginBottom: 2
          })
        }
        if (periodText) {
          content.push({
            text: periodText,
            fontSize: fontSize,
            color: textColor,
            lineHeight: contentLineHeight,
            marginBottom: 2
          })
        }
        if (edu.achievements && edu.achievements.length > 0) {
          edu.achievements.forEach((ach, index) => {
            content.push({
              text: `${index + 1}.${ach}`,
              fontSize: fontSize,
              color: textColor,
              lineHeight: contentLineHeight,
              marginBottom: listItemMarginBottom // 列表项间距，对应前端 mb-1
            })
          })
        }
        content.push({ text: '', marginBottom: sectionContentMarginBottom })
      }
    }
    
    // 工作经历
    if (sectionKey === 'workExperiences' && resumeData.workExperiences && resumeData.workExperiences.length > 0) {
      content.push({
        text: '工作经历',
        fontSize: sectionTitleFontSize,
        bold: true,
        color: sectionTitleColor,
        lineHeight: contentLineHeight,
        marginTop: sectionTitleMarginTop,
        marginBottom: sectionTitleMarginBottom
      })
      
      resumeData.workExperiences.forEach((exp) => {
        const workInfo = []
        if (exp.company) {
          let companyInfo = exp.company
          if (exp.position) {
            companyInfo += ` | ${exp.position}`
          }
          if (exp.companyType) {
            companyInfo += ` | ${exp.companyType}`
          }
          workInfo.push(companyInfo)
        }
        if (exp.period) {
          workInfo.push(FormatDate(exp.period, resumeStyle?.dateFormat || 'dot'))
        }
        
        if (workInfo.length > 0) {
          content.push({
            text: workInfo.join('  |  '),
            fontSize: fontSize,
            bold: true,
            color: textColor,
            lineHeight: contentLineHeight,
            marginBottom: 3
          })
        }
        
        if (exp.reportTo && exp.reportTo.trim()) {
          content.push({
            text: `汇报对象：${exp.reportTo}`,
            fontSize: fontSize,
            color: textColor,
            lineHeight: contentLineHeight,
            marginBottom: 2
          })
        }
        if (exp.subordinates && exp.subordinates.trim()) {
          content.push({
            text: `下属：${exp.subordinates}`,
            fontSize: fontSize,
            color: textColor,
            lineHeight: contentLineHeight,
            marginBottom: 2
          })
        }
        if (exp.promotionPath && exp.promotionPath.trim()) {
          content.push({
            text: `晋升路径：${exp.promotionPath}`,
            fontSize: fontSize,
            color: textColor,
            lineHeight: contentLineHeight,
            marginBottom: 3
          })
        }
        
        if (exp.achievements && exp.achievements.length > 0) {
          content.push({
            text: '工作业绩',
            fontSize: fontSize,
            bold: true,
            color: textColor,
            lineHeight: contentLineHeight,
            marginTop: 3,
            marginBottom: 2
          })
          exp.achievements.forEach((ach, index) => {
            content.push({
              text: `${index + 1}、${ach}`,
              fontSize: fontSize,
              color: textColor,
              lineHeight: contentLineHeight,
              marginLeft: 10,
              marginBottom: listItemMarginBottom // 列表项间距，对应前端 mb-1
            })
          })
        }
        
        if (exp.responsibilities && exp.responsibilities.length > 0) {
          content.push({
            text: '工作内容',
            fontSize: fontSize,
            bold: true,
            color: textColor,
            lineHeight: contentLineHeight,
            marginTop: 3,
            marginBottom: 2
          })
          exp.responsibilities.forEach((resp, index) => {
            content.push({
              text: `${index + 1}、${resp}`,
              fontSize: fontSize,
              color: textColor,
              lineHeight: contentLineHeight,
              marginLeft: 10,
              marginBottom: listItemMarginBottom // 列表项间距，对应前端 mb-1
            })
          })
        }
        
        content.push({ text: '', marginBottom: workItemMarginBottom })
      })
    }
    
    // 荣誉证书
    if (sectionKey === 'honors' && resumeData.honors && resumeData.honors.length > 0) {
      const validHonors = resumeData.honors.filter(h => h && h.trim())
      if (validHonors.length > 0) {
        content.push({
          text: '荣誉证书',
          fontSize: sectionTitleFontSize,
          bold: true,
          color: sectionTitleColor,
          lineHeight: contentLineHeight,
          marginTop: sectionTitleMarginTop,
          marginBottom: sectionTitleMarginBottom
        })
        content.push({
          text: validHonors.join('，'),
          fontSize: fontSize,
          color: textColor,
          lineHeight: contentLineHeight,
          marginBottom: sectionContentMarginBottom
        })
      }
    }
    
    // 项目经历
    if (sectionKey === 'projects' && resumeData.projects && resumeData.projects.length > 0) {
      content.push({
        text: '项目经历',
        fontSize: sectionTitleFontSize,
        bold: true,
        color: sectionTitleColor,
        lineHeight: contentLineHeight,
        marginTop: sectionTitleMarginTop,
        marginBottom: sectionTitleMarginBottom
      })
      
      resumeData.projects.forEach((project) => {
        const projectNameRole = []
        if (project.name) projectNameRole.push(project.name)
        if (project.role && project.role.trim()) projectNameRole.push(project.role)
        
        if (projectNameRole.length > 0) {
          content.push({
            text: projectNameRole.join(' | '),
            fontSize: fontSize,
            bold: true,
            color: textColor,
            lineHeight: contentLineHeight,
            marginBottom: 2
          })
        }
        
        if (project.period && project.period.trim()) {
          content.push({
            text: FormatDate(project.period, resumeStyle?.dateFormat || 'dot'),
            fontSize: fontSize,
            color: textColor,
            lineHeight: contentLineHeight,
            marginBottom: 3
          })
        }
        
        if (project.description && project.description.length > 0) {
          project.description.forEach((desc, index) => {
            content.push({
              text: `${index + 1}、${desc}`,
              fontSize: fontSize,
              color: textColor,
              lineHeight: contentLineHeight,
              marginLeft: 10,
              marginBottom: listItemMarginBottom // 列表项间距，对应前端 mb-1
            })
          })
        }
        
        content.push({ text: '', marginBottom: workItemMarginBottom })
      })
    }
  })
  
  // 获取用户选择的字体，如果没有则使用默认字体
  const fontFamily = resumeStyle?.fontFamily || 'inherit'
  const pdfMakeFontName = GetPdfMakeFontName(fontFamily)
  
  // 返回pdfmake文档定义
  return {
    content: content,
    defaultStyle: {
      font: pdfMakeFontName, // 使用用户选择的字体
      fontSize: fontSize,
      lineHeight: contentLineHeight, // 使用调整后的行高
      color: textColor
    },
    pageSize: 'A4',
    pageMargins: [
      PDF_LAYOUT_CONFIG.pageMarginHorizontal, 
      PDF_LAYOUT_CONFIG.pageMarginVertical, 
      PDF_LAYOUT_CONFIG.pageMarginHorizontal, 
      PDF_LAYOUT_CONFIG.pageMarginVertical
    ], // 左右上下边距（单位：pt），可在顶部PDF_LAYOUT_CONFIG中调整
    styles: {
      title: {
        fontSize: titleFontSize,
        bold: true,
        color: titleColor
      },
      sectionTitle: {
        fontSize: sectionTitleFontSize,
        bold: true,
        color: sectionTitleColor
      }
    }
  }
}

