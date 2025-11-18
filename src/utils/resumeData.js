import * as XLSX from 'xlsx'

// 日期格式化函数
export const FormatDate = (period, dateFormat = 'dot') => {
  if (!period) return ''
  
  // 检查是否已经是目标格式
  if (dateFormat === 'dot') {
    // 检查是否是 dot 格式：2025.09 - 2025.11
    if (/^\d{4}\.\d{2}\s*[-—]\s*\d{4}\.\d{2}$/.test(period)) {
      return period
    }
  } else {
    // 检查是否是中文格式：2025年09月 — 2025年11月 或 2025年09月 — 至今
    if (/^\d{4}年\d{1,2}月\s*[-—]\s*(\d{4}年\d{1,2}月|至今)$/.test(period)) {
      return period
    }
  }
  
  // 解析中文格式：2025年09月 — 2025年11月 或 2025年9月 — 至今
  const chineseMatch = period.match(/(\d{4})年(\d{1,2})月\s*[-—]\s*(至今|(\d{4})年(\d{1,2})月)/)
  if (chineseMatch) {
    const startYear = chineseMatch[1]
    const startMonth = String(chineseMatch[2]).padStart(2, '0')
    const isPresent = chineseMatch[3] === '至今'
    
    if (dateFormat === 'dot') {
      if (isPresent) {
        const now = new Date()
        const endYear = now.getFullYear()
        const endMonth = String(now.getMonth() + 1).padStart(2, '0')
        return `${startYear}.${startMonth} - ${endYear}.${endMonth}`
      } else {
        const endYear = chineseMatch[4]
        const endMonth = String(chineseMatch[5]).padStart(2, '0')
        return `${startYear}.${startMonth} - ${endYear}.${endMonth}`
      }
    } else {
      // chinese format
      if (isPresent) {
        return `${startYear}年${parseInt(startMonth)}月 — 至今`
      } else {
        const endYear = chineseMatch[4]
        const endMonth = parseInt(chineseMatch[5])
        return `${startYear}年${parseInt(startMonth)}月 — ${endYear}年${endMonth}月`
      }
    }
  }
  
  // 解析点格式：2025.09 - 2025.11
  const dotMatch = period.match(/(\d{4})\.(\d{2})\s*[-—]\s*(\d{4})\.(\d{2})/)
  if (dotMatch) {
    const startYear = dotMatch[1]
    const startMonth = parseInt(dotMatch[2])
    const endYear = dotMatch[3]
    const endMonth = parseInt(dotMatch[4])
    
    if (dateFormat === 'chinese') {
      // 检查是否是当前日期，如果是则显示"至今"
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1
      if (parseInt(endYear) === currentYear && parseInt(endMonth) === currentMonth) {
        return `${startYear}年${startMonth}月 — 至今`
      }
      return `${startYear}年${startMonth}月 — ${endYear}年${endMonth}月`
    } else {
      return `${startYear}.${dotMatch[2]} - ${endYear}.${dotMatch[4]}`
    }
  }
  
  // 如果无法解析，返回原值
  return period
}

export const GetDefaultResumeData = () => ({
  personalInfo: {
    name: '',
    title: '',
    phone: '',
    email: '',
    age: '',
    blog: '',
    github: '',
    targetCity: '',
    works: []
  },
  sectionOrder: ['tags', 'reusableCapabilities', 'careerObjective', 'advantages', 'education', 'workExperiences', 'honors', 'projects'],
  tags: [],
  reusableCapabilities: [],
  careerObjective: '',
  advantages: [],
  honors: [],
  workExperiences: [],
  projects: [],
  education: {
    school: '',
    level: '',
    period: '',
    major: '',
    degree: '',
    duration: null,
    startYear: null,
    startMonth: null,
    endYear: null,
    endMonth: null,
    achievements: []
  }
})

export const SaveResumeData = (data) => {
  try {
    localStorage.setItem('resumeData', JSON.stringify(data))
  } catch (error) {
    console.error('保存简历数据失败:', error)
  }
}

export const LoadResumeData = () => {
  try {
    const saved = localStorage.getItem('resumeData')
    return saved ? JSON.parse(saved) : null
  } catch (error) {
    console.error('加载简历数据失败:', error)
    return null
  }
}

export const SaveViewMode = (isPreview) => {
  try {
    localStorage.setItem('resumeViewMode', JSON.stringify(isPreview))
  } catch (error) {
    console.error('保存视图模式失败:', error)
  }
}

export const LoadViewMode = () => {
  try {
    const saved = localStorage.getItem('resumeViewMode')
    return saved ? JSON.parse(saved) : false
  } catch (error) {
    console.error('加载视图模式失败:', error)
    return false
  }
}

export const SavePrintSettings = (settings) => {
  try {
    localStorage.setItem('resumePrintSettings', JSON.stringify(settings))
  } catch (error) {
    console.error('保存打印设置失败:', error)
  }
}

export const LoadPrintSettings = () => {
  try {
    const saved = localStorage.getItem('resumePrintSettings')
    const defaultSettings = { 
      showPageNumber: false, 
      pageNumberPosition: 'bottom-center', 
      pageNumberFormat: 'number',
      fontFamily: 'inherit',
      pageNumberFontFamily: 'inherit'
    }
    if (saved) {
      const parsed = JSON.parse(saved)
      // 兼容旧设置，如果没有新字段，使用默认值
      return { ...defaultSettings, ...parsed }
    }
    return defaultSettings
  } catch (error) {
    console.error('加载打印设置失败:', error)
    return { 
      showPageNumber: false, 
      pageNumberPosition: 'bottom-center', 
      pageNumberFormat: 'number',
      fontFamily: 'inherit',
      pageNumberFontFamily: 'inherit'
    }
  }
}

export const SaveResumeStyle = (style) => {
  try {
    localStorage.setItem('resumeStyle', JSON.stringify(style))
  } catch (error) {
    console.error('保存简历样式失败:', error)
  }
}

export const LoadResumeStyle = () => {
  try {
    const saved = localStorage.getItem('resumeStyle')
    return saved ? JSON.parse(saved) : null
  } catch (error) {
    console.error('加载简历样式失败:', error)
    return null
  }
}

export const SaveFileNameTemplate = (template) => {
  try {
    localStorage.setItem('resumeFileNameTemplate', JSON.stringify(template))
  } catch (error) {
    console.error('保存文件名模板失败:', error)
  }
}

export const LoadFileNameTemplate = () => {
  try {
    const saved = localStorage.getItem('resumeFileNameTemplate')
    if (saved) {
      return JSON.parse(saved)
    }
    // 默认模板：姓名-职位-手机号
    return {
      template: '{name}-{title}-{phone}',
      customTemplate: ''
    }
  } catch (error) {
    console.error('加载文件名模板失败:', error)
    return {
      template: '{name}-{title}-{phone}',
      customTemplate: ''
    }
  }
}

// 根据模板和数据生成文件名（不含扩展名）
export const GenerateFileName = (data, fileExtension = '') => {
  const templateData = LoadFileNameTemplate()
  const template = templateData.customTemplate || templateData.template || '{name}-{title}-{phone}'
  
  // 获取个人信息
  const personalInfo = data?.personalInfo || {}
  const name = (personalInfo.name || '').trim() || '姓名'
  const title = (personalInfo.title || '').trim() || '职位'
  const phone = (personalInfo.phone || '').trim() || '手机号'
  const email = (personalInfo.email || '').trim() || '邮箱'
  const age = (personalInfo.age || '').trim() || '年龄'
  const targetCity = (personalInfo.targetCity || '').trim() || '目标城市'
  
  // 替换模板变量
  let fileName = template
    .replace(/\{name\}/g, name)
    .replace(/\{title\}/g, title)
    .replace(/\{phone\}/g, phone)
    .replace(/\{email\}/g, email)
    .replace(/\{age\}/g, age)
    .replace(/\{targetCity\}/g, targetCity)
  
  // 清理文件名中的非法字符
  fileName = fileName.replace(/[<>:"/\\|?*]/g, '-').replace(/\s+/g, '-')
  
  // 如果文件名为空或只包含占位符，使用默认名称
  if (!fileName || fileName === '姓名-职位-手机号' || fileName.match(/^[\s-]+$/)) {
    fileName = `resume`
  }
  
  // 添加时间戳：年月日时分秒
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`
  
  // 在文件名末尾添加时间戳
  fileName = `${fileName}-${timestamp}`
  
  // 添加扩展名
  if (fileExtension) {
    fileName = `${fileName}.${fileExtension}`
  }
  
  return fileName
}

export const ExportResumeJSON = (data) => {
  try {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = GenerateFileName(data, 'json')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    return true
  } catch (error) {
    console.error('导出JSON失败:', error)
    return false
  }
}

export const ImportResumeJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        resolve(data)
      } catch (error) {
        reject(new Error('JSON格式错误，请检查文件内容'))
      }
    }
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    reader.readAsText(file)
  })
}

export const DownloadExcelTemplate = async () => {
  try {
    const workbook = XLSX.utils.book_new()
    if (!workbook) {
      throw new Error('创建工作簿失败')
    }
    
    const personalInfoSheet = [
      ['字段', '值'],
      ['姓名', ''],
      ['职位', ''],
      ['电话', ''],
      ['邮箱', ''],
      ['年龄', ''],
      ['博客', ''],
      ['GitHub', ''],
      ['目标城市', '']
    ]
    
    const worksSheet = [
      ['作品名称', '作品链接'],
      ['', '']
    ]
    
    const tagsSheet = [
      ['专业标签（每行一个）'],
      ['']
    ]
    
    const reusableCapabilitiesSheet = [
      ['可复用能力（每行一个）'],
      ['']
    ]
    
    const careerObjectiveSheet = [
      ['求职目标（一句话）'],
      ['']
    ]
    
    const advantagesSheet = [
      ['个人优势（每行一个）'],
      ['']
    ]
    
    const honorsSheet = [
      ['荣誉证书（每行一个）'],
      ['']
    ]
    
    const workExpSheet = [
      ['公司名称', '公司类型', '职位', '工作期间', '汇报对象', '下属人数', '晋升路径'],
      ['', '', '', '', '', '', '']
    ]
    
    const workAchievementsSheet = [
      ['工作经历序号（从1开始）', '工作业绩（每行一个）'],
      ['1', '']
    ]
    
    const workResponsibilitiesSheet = [
      ['工作经历序号（从1开始）', '工作内容（每行一个）'],
      ['1', '']
    ]
    
    const projectsSheet = [
      ['项目名称', '项目期间', '担任角色'],
      ['', '', '']
    ]
    
    const projectDescSheet = [
      ['项目序号（从1开始）', '项目描述（每行一个）'],
      ['1', '']
    ]
    
    const educationSheet = [
      ['字段', '值'],
      ['学校名称', ''],
      ['学校级别', ''],
      ['就读期间', ''],
      ['专业', ''],
      ['学历', ''],
      ['学制（年）', '']
    ]
    
    const educationAchievementsSheet = [
      ['在校成就（每行一个）'],
      ['']
    ]
    
    try {
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(personalInfoSheet), '个人信息')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(worksSheet), '作品集')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(tagsSheet), '专业标签')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(reusableCapabilitiesSheet), '可复用能力')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(careerObjectiveSheet), '求职目标')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(advantagesSheet), '个人优势')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(honorsSheet), '荣誉证书')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(workExpSheet), '工作经历')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(workAchievementsSheet), '工作业绩')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(workResponsibilitiesSheet), '工作内容')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(projectsSheet), '项目经历')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(projectDescSheet), '项目描述')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(educationSheet), '教育背景')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(educationAchievementsSheet), '在校成就')
    } catch (sheetError) {
      console.error('添加工作表失败:', sheetError)
      throw new Error('创建工作表失败: ' + sheetError.message)
    }
    
    try {
      XLSX.writeFile(workbook, 'resume-template.xlsx')
      return true
    } catch (writeError) {
      console.error('写入文件失败:', writeError)
      throw new Error('保存文件失败: ' + writeError.message)
    }
  } catch (error) {
    console.error('下载Excel模板失败:', error)
    return false
  }
}

export const ExportResumeExcel = async (data) => {
  try {
    const workbook = XLSX.utils.book_new()
    if (!workbook) {
      throw new Error('创建工作簿失败')
    }
    
    const personalInfoSheet = [
      ['字段', '值'],
      ['姓名', data.personalInfo?.name || ''],
      ['职位', data.personalInfo?.title || ''],
      ['电话', data.personalInfo?.phone || ''],
      ['邮箱', data.personalInfo?.email || ''],
      ['年龄', data.personalInfo?.age || ''],
      ['博客', data.personalInfo?.blog || ''],
      ['GitHub', data.personalInfo?.github || ''],
      ['目标城市', data.personalInfo?.targetCity || '']
    ]
    
    const worksSheet = [['作品名称', '作品链接']]
    if (data.personalInfo?.works) {
      data.personalInfo.works.forEach(work => {
        worksSheet.push([work.name || '', work.url || ''])
      })
    }
    if (worksSheet.length === 1) worksSheet.push(['', ''])
    
    const tagsSheet = [['专业标签（每行一个）']]
    if (data.tags && data.tags.length > 0) {
      data.tags.forEach(tag => tagsSheet.push([tag]))
    } else {
      tagsSheet.push([''])
    }
    
    const reusableCapabilitiesSheet = [['可复用能力（每行一个）']]
    if (data.reusableCapabilities && data.reusableCapabilities.length > 0) {
      data.reusableCapabilities.forEach(cap => reusableCapabilitiesSheet.push([cap]))
    } else {
      reusableCapabilitiesSheet.push([''])
    }
    
    const careerObjectiveSheet = [['求职目标（一句话）']]
    if (data.careerObjective && data.careerObjective.trim()) {
      careerObjectiveSheet.push([data.careerObjective])
    } else {
      careerObjectiveSheet.push([''])
    }
    
    const advantagesSheet = [['个人优势（每行一个）']]
    if (data.advantages && data.advantages.length > 0) {
      data.advantages.forEach(adv => advantagesSheet.push([adv]))
    } else {
      advantagesSheet.push([''])
    }
    
    const honorsSheet = [['荣誉证书（每行一个）']]
    if (data.honors && data.honors.length > 0) {
      data.honors.forEach(honor => honorsSheet.push([honor]))
    } else {
      honorsSheet.push([''])
    }
    
    const workExpSheet = [['公司名称', '公司类型', '职位', '工作期间', '汇报对象', '下属人数', '晋升路径']]
    if (data.workExperiences && data.workExperiences.length > 0) {
      data.workExperiences.forEach(exp => {
        workExpSheet.push([
          exp.company || '',
          exp.companyType || '',
          exp.position || '',
          exp.period || '',
          exp.reportTo || '',
          exp.subordinates || '',
          exp.promotionPath || ''
        ])
      })
    } else {
      workExpSheet.push(['', '', '', '', '', '', ''])
    }
    
    const workAchievementsSheet = [['工作经历序号（从1开始）', '工作业绩（每行一个）']]
    if (data.workExperiences && data.workExperiences.length > 0) {
      data.workExperiences.forEach((exp, index) => {
        if (exp.achievements && exp.achievements.length > 0) {
          exp.achievements.forEach(ach => {
            workAchievementsSheet.push([index + 1, ach])
          })
        }
      })
    }
    if (workAchievementsSheet.length === 1) workAchievementsSheet.push(['1', ''])
    
    const workResponsibilitiesSheet = [['工作经历序号（从1开始）', '工作内容（每行一个）']]
    if (data.workExperiences && data.workExperiences.length > 0) {
      data.workExperiences.forEach((exp, index) => {
        if (exp.responsibilities && exp.responsibilities.length > 0) {
          exp.responsibilities.forEach(resp => {
            workResponsibilitiesSheet.push([index + 1, resp])
          })
        }
      })
    }
    if (workResponsibilitiesSheet.length === 1) workResponsibilitiesSheet.push(['1', ''])
    
    const projectsSheet = [['项目名称', '项目期间', '担任角色']]
    if (data.projects && data.projects.length > 0) {
      data.projects.forEach(project => {
        projectsSheet.push([
          project.name || '',
          project.period || '',
          project.role || ''
        ])
      })
    } else {
      projectsSheet.push(['', '', ''])
    }
    
    const projectDescSheet = [['项目序号（从1开始）', '项目描述（每行一个）']]
    if (data.projects && data.projects.length > 0) {
      data.projects.forEach((project, index) => {
        if (project.description && project.description.length > 0) {
          project.description.forEach(desc => {
            projectDescSheet.push([index + 1, desc])
          })
        }
      })
    }
    if (projectDescSheet.length === 1) projectDescSheet.push(['1', ''])
    
    const educationSheet = [
      ['字段', '值'],
      ['学校名称', data.education?.school || ''],
      ['学校级别', data.education?.level || ''],
      ['就读期间', data.education?.period || ''],
      ['专业', data.education?.major || ''],
      ['学历', data.education?.degree || ''],
      ['学制（年）', data.education?.duration || '']
    ]
    
    const educationAchievementsSheet = [['在校成就（每行一个）']]
    if (data.education?.achievements && data.education.achievements.length > 0) {
      data.education.achievements.forEach(ach => {
        educationAchievementsSheet.push([ach])
      })
    } else {
      educationAchievementsSheet.push([''])
    }
    
    try {
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(personalInfoSheet), '个人信息')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(worksSheet), '作品集')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(tagsSheet), '专业标签')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(reusableCapabilitiesSheet), '可复用能力')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(careerObjectiveSheet), '求职目标')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(advantagesSheet), '个人优势')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(honorsSheet), '荣誉证书')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(workExpSheet), '工作经历')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(workAchievementsSheet), '工作业绩')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(workResponsibilitiesSheet), '工作内容')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(projectsSheet), '项目经历')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(projectDescSheet), '项目描述')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(educationSheet), '教育背景')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(educationAchievementsSheet), '在校成就')
    } catch (sheetError) {
      console.error('添加工作表失败:', sheetError)
      throw new Error('创建工作表失败: ' + sheetError.message)
    }
    
    try {
      XLSX.writeFile(workbook, GenerateFileName(data, 'xlsx'))
      return true
    } catch (writeError) {
      console.error('写入文件失败:', writeError)
      throw new Error('保存文件失败: ' + writeError.message)
    }
  } catch (error) {
    console.error('导出Excel失败:', error)
    return false
  }
}

export const ImportResumeExcel = (file) => {
  return new Promise(async (resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        
        const result = GetDefaultResumeData()
        
        const getSheetData = (sheetName) => {
          const sheet = workbook.Sheets[sheetName]
          return sheet ? XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) : []
        }
        
        const personalInfoData = getSheetData('个人信息')
        personalInfoData.forEach((row, index) => {
          if (index === 0) return
          const [field, value] = row
          if (field && value) {
            switch (field) {
              case '姓名': result.personalInfo.name = value; break
              case '职位': result.personalInfo.title = value; break
              case '电话': result.personalInfo.phone = value; break
              case '邮箱': result.personalInfo.email = value; break
              case '年龄': result.personalInfo.age = value; break
              case '博客': result.personalInfo.blog = value; break
              case 'GitHub': result.personalInfo.github = value; break
              case '目标城市': result.personalInfo.targetCity = value; break
            }
          }
        })
        
        const worksData = getSheetData('作品集')
        result.personalInfo.works = []
        worksData.forEach((row, index) => {
          if (index === 0) return
          const [name, url] = row
          if (name || url) {
            result.personalInfo.works.push({ name: name || '', url: url || '' })
          }
        })
        
        const tagsData = getSheetData('专业标签')
        result.tags = []
        tagsData.forEach((row, index) => {
          if (index === 0) return
          const [tag] = row
          if (tag) result.tags.push(tag)
        })
        
        const reusableCapabilitiesData = getSheetData('可复用能力')
        result.reusableCapabilities = []
        reusableCapabilitiesData.forEach((row, index) => {
          if (index === 0) return
          const [cap] = row
          if (cap) result.reusableCapabilities.push(cap)
        })
        
        const careerObjectiveData = getSheetData('求职目标')
        if (careerObjectiveData.length > 1 && careerObjectiveData[1] && careerObjectiveData[1][0]) {
          result.careerObjective = careerObjectiveData[1][0]
        } else {
          result.careerObjective = ''
        }
        
        const advantagesData = getSheetData('个人优势')
        result.advantages = []
        advantagesData.forEach((row, index) => {
          if (index === 0) return
          const [adv] = row
          if (adv) result.advantages.push(adv)
        })
        
        const honorsData = getSheetData('荣誉证书')
        result.honors = []
        honorsData.forEach((row, index) => {
          if (index === 0) return
          const [honor] = row
          if (honor) result.honors.push(honor)
        })
        
        const workExpData = getSheetData('工作经历')
        result.workExperiences = []
        workExpData.forEach((row, index) => {
          if (index === 0) return
          const [company, companyType, position, period, reportTo, subordinates, promotionPath] = row
          if (company || position) {
            result.workExperiences.push({
              company: company || '',
              companyType: companyType || '',
              position: position || '',
              period: period || '',
              reportTo: reportTo || '',
              subordinates: subordinates || '',
              promotionPath: promotionPath || '',
              achievements: [],
              responsibilities: []
            })
          }
        })
        
        const workAchievementsData = getSheetData('工作业绩')
        workAchievementsData.forEach((row, index) => {
          if (index === 0) return
          const [workIndex, achievement] = row
          if (workIndex && achievement) {
            const idx = parseInt(workIndex) - 1
            if (idx >= 0 && idx < result.workExperiences.length) {
              if (!result.workExperiences[idx].achievements) {
                result.workExperiences[idx].achievements = []
              }
              result.workExperiences[idx].achievements.push(achievement)
            }
          }
        })
        
        const workResponsibilitiesData = getSheetData('工作内容')
        workResponsibilitiesData.forEach((row, index) => {
          if (index === 0) return
          const [workIndex, responsibility] = row
          if (workIndex && responsibility) {
            const idx = parseInt(workIndex) - 1
            if (idx >= 0 && idx < result.workExperiences.length) {
              if (!result.workExperiences[idx].responsibilities) {
                result.workExperiences[idx].responsibilities = []
              }
              result.workExperiences[idx].responsibilities.push(responsibility)
            }
          }
        })
        
        const projectsData = getSheetData('项目经历')
        result.projects = []
        projectsData.forEach((row, index) => {
          if (index === 0) return
          const [name, period, role] = row
          if (name) {
            result.projects.push({
              name: name || '',
              period: period || '',
              role: role || '',
              description: []
            })
          }
        })
        
        const projectDescData = getSheetData('项目描述')
        projectDescData.forEach((row, index) => {
          if (index === 0) return
          const [projectIndex, desc] = row
          if (projectIndex && desc) {
            const idx = parseInt(projectIndex) - 1
            if (idx >= 0 && idx < result.projects.length) {
              if (!result.projects[idx].description) {
                result.projects[idx].description = []
              }
              result.projects[idx].description.push(desc)
            }
          }
        })
        
        const educationData = getSheetData('教育背景')
        educationData.forEach((row, index) => {
          if (index === 0) return
          const [field, value] = row
          if (field && value !== undefined && value !== '') {
            switch (field) {
              case '学校名称': result.education.school = value; break
              case '学校级别': result.education.level = value; break
              case '就读期间': result.education.period = value; break
              case '专业': result.education.major = value; break
              case '学历': result.education.degree = value; break
              case '学制（年）': result.education.duration = value ? parseInt(value) : null; break
            }
          }
        })
        
        const educationAchievementsData = getSheetData('在校成就')
        result.education.achievements = []
        educationAchievementsData.forEach((row, index) => {
          if (index === 0) return
          const [ach] = row
          if (ach) result.education.achievements.push(ach)
        })
        
        resolve(result)
      } catch (error) {
        reject(new Error('Excel格式错误，请检查文件内容'))
      }
    }
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    reader.readAsArrayBuffer(file)
  })
}

