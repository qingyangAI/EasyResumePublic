// 将简历数据转换为 pdfmake 文档结构
import { FormatDate } from './resumeData'
import { GetPdfMakeFontName } from './fontMapping'

// 将简历数据转换为 pdfmake 文档定义
export const ConvertResumeToPdfMakeDoc = (resumeData, resumeStyle) => {
  const content = []
  
  // 获取样式设置
  const fontSize = resumeStyle?.fontSize || 14
  const titleFontSize = resumeStyle?.titleFontSize || 24
  const sectionTitleFontSize = resumeStyle?.sectionTitleFontSize || 18
  const lineHeight = resumeStyle?.lineHeight || 1.6
  const textColor = resumeStyle?.textColor || '#1f2937'
  const titleColor = resumeStyle?.titleColor || '#111827'
  const sectionTitleColor = resumeStyle?.sectionTitleColor || '#374151'
  const spacing = resumeStyle?.spacing || 1.5
  
  // 个人信息
  if (resumeData.personalInfo) {
    const pi = resumeData.personalInfo
    
    // 姓名（居中，大字体）
    if (pi.name && pi.name.trim()) {
      content.push({
        text: pi.name,
        fontSize: titleFontSize,
        bold: true,
        alignment: 'center',
        color: titleColor,
        marginBottom: 5
      })
    }
    
    // 职位（居中）
    if (pi.title && pi.title.trim()) {
      content.push({
        text: pi.title,
        fontSize: fontSize,
        alignment: 'center',
        color: textColor,
        marginBottom: 10
      })
    }
    
    // 联系信息（三列布局）
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
    
    if (contactInfo.length > 0) {
      // 将联系信息分成3列
      const cols = [[], [], []]
      contactInfo.forEach((item, index) => {
        cols[index % 3].push(item)
      })
      
      const maxLines = Math.max(...cols.map(col => col.length))
      for (let i = 0; i < maxLines; i++) {
        const lineItems = []
        cols.forEach((col, colIndex) => {
          if (col[i]) {
            if (lineItems.length > 0) {
              lineItems.push({ text: '  |  ', color: textColor })
            }
            lineItems.push({ text: col[i], color: textColor })
          }
        })
        if (lineItems.length > 0) {
          content.push({
            text: lineItems,
            fontSize: fontSize,
            alignment: 'center',
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
          x2: 515, // A4宽度减去边距
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
          marginTop: spacing * 5,
          marginBottom: 5
        })
        const separator = resumeStyle?.tagsSeparator || '｜'
        content.push({
          text: validTags.join(separator),
          fontSize: fontSize,
          color: textColor,
          marginBottom: spacing * 5
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
          marginTop: spacing * 5,
          marginBottom: 5
        })
        validCapabilities.forEach((capability, index) => {
          content.push({
            text: `${index + 1}、${capability}`,
            fontSize: fontSize,
            color: textColor,
            marginBottom: 2
          })
        })
        content.push({ text: '', marginBottom: spacing * 5 })
      }
    }
    
    // 求职目标
    if (sectionKey === 'careerObjective' && resumeData.careerObjective && typeof resumeData.careerObjective === 'string' && resumeData.careerObjective.trim()) {
      content.push({
        text: '求职目标',
        fontSize: sectionTitleFontSize,
        bold: true,
        color: sectionTitleColor,
        marginTop: spacing * 5,
        marginBottom: 5
      })
      content.push({
        text: resumeData.careerObjective,
        fontSize: fontSize,
        color: textColor,
        lineHeight: lineHeight,
        marginBottom: spacing * 5
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
          marginTop: spacing * 5,
          marginBottom: 5
        })
        validAdvantages.forEach((advantage, index) => {
          content.push({
            text: `${index + 1}、${advantage}`,
            fontSize: fontSize,
            color: textColor,
            marginBottom: 2
          })
        })
        content.push({ text: '', marginBottom: spacing * 5 })
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
          marginTop: spacing * 5,
          marginBottom: 5
        })
        if (eduItems.length > 0) {
          const separator = resumeStyle?.tagsSeparator || '｜'
          content.push({
            text: eduItems.join(separator),
            fontSize: fontSize,
            color: textColor,
            marginBottom: 2
          })
        }
        if (periodText) {
          content.push({
            text: periodText,
            fontSize: fontSize,
            color: textColor,
            marginBottom: 2
          })
        }
        if (edu.achievements && edu.achievements.length > 0) {
          edu.achievements.forEach((ach, index) => {
            content.push({
              text: `${index + 1}.${ach}`,
              fontSize: fontSize,
              color: textColor,
              marginBottom: 2
            })
          })
        }
        content.push({ text: '', marginBottom: spacing * 5 })
      }
    }
    
    // 工作经历
    if (sectionKey === 'workExperiences' && resumeData.workExperiences && resumeData.workExperiences.length > 0) {
      content.push({
        text: '工作经历',
        fontSize: sectionTitleFontSize,
        bold: true,
        color: sectionTitleColor,
        marginTop: spacing * 5,
        marginBottom: 5
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
            marginBottom: 3
          })
        }
        
        if (exp.reportTo && exp.reportTo.trim()) {
          content.push({
            text: `汇报对象：${exp.reportTo}`,
            fontSize: fontSize,
            color: textColor,
            marginBottom: 2
          })
        }
        if (exp.subordinates && exp.subordinates.trim()) {
          content.push({
            text: `下属：${exp.subordinates}`,
            fontSize: fontSize,
            color: textColor,
            marginBottom: 2
          })
        }
        if (exp.promotionPath && exp.promotionPath.trim()) {
          content.push({
            text: `晋升路径：${exp.promotionPath}`,
            fontSize: fontSize,
            color: textColor,
            marginBottom: 3
          })
        }
        
        if (exp.achievements && exp.achievements.length > 0) {
          content.push({
            text: '工作业绩',
            fontSize: fontSize,
            bold: true,
            color: textColor,
            marginTop: 3,
            marginBottom: 2
          })
          exp.achievements.forEach((ach, index) => {
            content.push({
              text: `${index + 1}、${ach}`,
              fontSize: fontSize,
              color: textColor,
              marginLeft: 10,
              marginBottom: 2
            })
          })
        }
        
        if (exp.responsibilities && exp.responsibilities.length > 0) {
          content.push({
            text: '工作内容',
            fontSize: fontSize,
            bold: true,
            color: textColor,
            marginTop: 3,
            marginBottom: 2
          })
          exp.responsibilities.forEach((resp, index) => {
            content.push({
              text: `${index + 1}、${resp}`,
              fontSize: fontSize,
              color: textColor,
              marginLeft: 10,
              marginBottom: 2
            })
          })
        }
        
        content.push({ text: '', marginBottom: spacing * 5 })
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
          marginTop: spacing * 5,
          marginBottom: 5
        })
        content.push({
          text: validHonors.join('，'),
          fontSize: fontSize,
          color: textColor,
          marginBottom: spacing * 5
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
        marginTop: spacing * 5,
        marginBottom: 5
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
            marginBottom: 2
          })
        }
        
        if (project.period && project.period.trim()) {
          content.push({
            text: FormatDate(project.period, resumeStyle?.dateFormat || 'dot'),
            fontSize: fontSize,
            color: textColor,
            marginBottom: 3
          })
        }
        
        if (project.description && project.description.length > 0) {
          project.description.forEach((desc, index) => {
            content.push({
              text: `${index + 1}、${desc}`,
              fontSize: fontSize,
              color: textColor,
              marginLeft: 10,
              marginBottom: 2
            })
          })
        }
        
        content.push({ text: '', marginBottom: spacing * 5 })
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
      lineHeight: lineHeight,
      color: textColor
    },
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60], // 左右上下边距（单位：pt，约10mm）
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

