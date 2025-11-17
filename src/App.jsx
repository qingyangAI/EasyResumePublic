import { useState, useEffect } from 'react'
import ResumeEditor from './components/ResumeEditor'
import ResumePreview from './components/ResumePreview'
import { GetDefaultResumeData, SaveResumeData, LoadResumeData, SaveViewMode, LoadViewMode, ExportResumeJSON, ImportResumeJSON, ExportResumeExcel, ImportResumeExcel, DownloadExcelTemplate, SavePrintSettings, LoadPrintSettings } from './utils/resumeData'
import ResumeStylePanel from './components/ResumeStylePanel'

function App() {
  const [resumeData, setResumeData] = useState(GetDefaultResumeData())
  const [isPreview, setIsPreview] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showImportMenu, setShowImportMenu] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showPrintDialog, setShowPrintDialog] = useState(false)
  const [printSettings, setPrintSettings] = useState({ 
    showPageNumber: false, 
    pageNumberPosition: 'bottom-center', 
    pageNumberFormat: 'number',
    fontFamily: 'inherit',
    pageNumberFontFamily: 'inherit'
  })
  const [resumeStyle, setResumeStyle] = useState(null)

  useEffect(() => {
    const saved = LoadResumeData()
    if (saved) {
      setResumeData(saved)
    }
    const savedViewMode = LoadViewMode()
    setIsPreview(savedViewMode)
    const savedPrintSettings = LoadPrintSettings()
    setPrintSettings(savedPrintSettings)
  }, [])

  useEffect(() => {
    const HandleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault()
        SaveResumeData(resumeData)
        setSaveMessage('简历已保存到本地存储')
        setTimeout(() => setSaveMessage(''), 2000)
      }
    }

    window.addEventListener('keydown', HandleKeyDown)
    return () => {
      window.removeEventListener('keydown', HandleKeyDown)
    }
  }, [resumeData])

  const HandleSave = () => {
    SaveResumeData(resumeData)
    setSaveMessage('简历已保存到本地存储')
    setTimeout(() => setSaveMessage(''), 2000)
  }

  const HandleExportPDF = async () => {
    setIsExporting(true)
    try {
      const jsPDF = (await import('jspdf')).default
      
      // 创建PDF实例
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = 210
      const pageHeight = 297
      const margin = 20
      const maxWidth = pageWidth - 2 * margin
      let yPosition = margin
      const lineHeight = 7
      const sectionSpacing = 8
      
      // 获取字体设置
      const getFontFamily = (fontSetting) => {
        if (fontSetting === 'inherit') {
          return 'helvetica'
        }
        // 将中文字体映射到jsPDF支持的字体
        if (fontSetting.includes('SimSun') || fontSetting.includes('宋体')) {
          return 'times'
        }
        if (fontSetting.includes('SimHei') || fontSetting.includes('黑体')) {
          return 'helvetica'
        }
        if (fontSetting.includes('Microsoft YaHei') || fontSetting.includes('微软雅黑')) {
          return 'helvetica'
        }
        if (fontSetting.includes('Arial')) {
          return 'helvetica'
        }
        if (fontSetting.includes('Times')) {
          return 'times'
        }
        if (fontSetting.includes('Courier')) {
          return 'courier'
        }
        return 'helvetica'
      }
      
      const fontFamily = resumeStyle && resumeStyle.fontFamily !== 'inherit'
        ? getFontFamily(resumeStyle.fontFamily)
        : getFontFamily(printSettings.fontFamily)
      
      const fontSize = resumeStyle ? resumeStyle.fontSize : 14
      const titleFontSize = resumeStyle ? resumeStyle.titleFontSize : 24
      const sectionTitleFontSize = resumeStyle ? resumeStyle.sectionTitleFontSize : 18
      
      // 设置默认字体
      pdf.setFont(fontFamily)
      pdf.setFontSize(fontSize)
      
      // 添加文本的辅助函数，支持自动换行和分页
      const AddText = (text, size = fontSize, isBold = false, align = 'left') => {
        if (!text) return
        
        pdf.setFontSize(size)
        pdf.setFont(fontFamily, isBold ? 'bold' : 'normal')
        
        // 使用splitTextToSize自动换行，但需要处理中文
        const lines = pdf.splitTextToSize(text, maxWidth)
        lines.forEach((line) => {
          if (yPosition + lineHeight > pageHeight - margin) {
            pdf.addPage()
            yPosition = margin
          }
          
          if (align === 'center') {
            pdf.text(line, pageWidth / 2, yPosition, { align: 'center' })
          } else {
            pdf.text(line, margin, yPosition)
          }
          yPosition += lineHeight
        })
      }
      
      // 添加空行
      const AddSpacing = (spacing = sectionSpacing) => {
        yPosition += spacing
        if (yPosition > pageHeight - margin) {
          pdf.addPage()
          yPosition = margin
        }
      }
      
      // 个人信息
      if (resumeData.personalInfo) {
        const pi = resumeData.personalInfo
        if (pi.name && pi.name.trim()) {
          AddText(pi.name, titleFontSize, true, 'center')
          AddSpacing(3)
        }
        if (pi.title && pi.title.trim()) {
          AddText(pi.title, fontSize, false, 'center')
          AddSpacing(5)
        }
        
        // 联系信息
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
          // 将联系信息分成3列显示
          const cols = [[], [], []]
          contactInfo.forEach((item, index) => {
            cols[index % 3].push(item)
          })
          
          const maxLines = Math.max(...cols.map(col => col.length))
          for (let i = 0; i < maxLines; i++) {
            let lineText = ''
            cols.forEach((col, colIndex) => {
              if (col[i]) {
                if (lineText) lineText += '  |  '
                lineText += col[i]
              }
            })
            if (lineText) {
              AddText(lineText, fontSize)
            }
          }
        }
        
        AddSpacing(8)
        // 分隔线
        pdf.setLineWidth(0.5)
        pdf.line(margin, yPosition, pageWidth - margin, yPosition)
        AddSpacing(8)
      }
      
      // 获取section顺序
      const sectionOrder = resumeData.sectionOrder || ['tags', 'advantages', 'education', 'workExperiences', 'honors', 'projects']
      
      sectionOrder.forEach((sectionKey) => {
        // 专业标签
        if (sectionKey === 'tags' && resumeData.tags && resumeData.tags.length > 0) {
          const validTags = resumeData.tags.filter(tag => tag && tag.trim())
          if (validTags.length > 0) {
            AddText('专业标签', sectionTitleFontSize, true)
            AddSpacing(3)
            AddText(validTags.join(' | '), fontSize)
            AddSpacing(sectionSpacing)
          }
        }
        
        // 个人优势
        if (sectionKey === 'advantages' && resumeData.advantages && resumeData.advantages.length > 0) {
          const validAdvantages = resumeData.advantages.filter(a => a && a.trim())
          if (validAdvantages.length > 0) {
            AddText('个人优势', sectionTitleFontSize, true)
            AddSpacing(3)
            validAdvantages.forEach((advantage, index) => {
              AddText(`${index + 1}、${advantage}`, fontSize)
            })
            AddSpacing(sectionSpacing)
          }
        }
        
        // 教育背景
        if (sectionKey === 'education' && resumeData.education) {
          const edu = resumeData.education
          const eduItems = []
          if (edu.school && edu.school.trim()) eduItems.push(edu.school)
          if (edu.level && edu.level.trim()) eduItems.push(edu.level)
          if (edu.degree && edu.degree.trim()) eduItems.push(edu.degree)
          if (edu.major && edu.major.trim()) eduItems.push(edu.major)
          if (edu.period && edu.period.trim()) eduItems.push(edu.period)
          
          if (eduItems.length > 0) {
            AddText('教育背景', sectionTitleFontSize, true)
            AddSpacing(3)
            AddText(eduItems.join('  '), fontSize)
            if (edu.achievements && edu.achievements.length > 0) {
              AddSpacing(3)
              edu.achievements.forEach((ach, index) => {
                AddText(`${index + 1}.${ach}`, fontSize)
              })
            }
            AddSpacing(sectionSpacing)
          }
        }
        
        // 工作经历
        if (sectionKey === 'workExperiences' && resumeData.workExperiences && resumeData.workExperiences.length > 0) {
          AddText('工作经历', sectionTitleFontSize, true)
          AddSpacing(3)
          
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
            if (exp.period) workInfo.push(exp.period)
            
            if (workInfo.length > 0) {
              AddText(workInfo.join('  |  '), fontSize, true)
              AddSpacing(2)
            }
            
            if (exp.reportTo && exp.reportTo.trim()) {
              AddText(`汇报对象：${exp.reportTo}`, fontSize)
            }
            if (exp.subordinates && exp.subordinates.trim()) {
              AddText(`下属：${exp.subordinates}`, fontSize)
            }
            if (exp.promotionPath && exp.promotionPath.trim()) {
              AddText(`晋升路径：${exp.promotionPath}`, fontSize)
            }
            
            if (exp.achievements && exp.achievements.length > 0) {
              AddSpacing(2)
              AddText('工作业绩', fontSize, true)
              exp.achievements.forEach((ach, index) => {
                AddText(`${index + 1}、${ach}`, fontSize)
              })
            }
            
            if (exp.responsibilities && exp.responsibilities.length > 0) {
              AddSpacing(2)
              AddText('工作内容', fontSize, true)
              exp.responsibilities.forEach((resp, index) => {
                AddText(`${index + 1}、${resp}`, fontSize)
              })
            }
            
            AddSpacing(sectionSpacing)
          })
        }
        
        // 荣誉证书
        if (sectionKey === 'honors' && resumeData.honors && resumeData.honors.length > 0) {
          const validHonors = resumeData.honors.filter(h => h && h.trim())
          if (validHonors.length > 0) {
            AddText('荣誉证书', sectionTitleFontSize, true)
            AddSpacing(3)
            AddText(validHonors.join('，'), fontSize)
            AddSpacing(sectionSpacing)
          }
        }
        
        // 项目经历
        if (sectionKey === 'projects' && resumeData.projects && resumeData.projects.length > 0) {
          AddText('项目经历', sectionTitleFontSize, true)
          AddSpacing(3)
          
          resumeData.projects.forEach((project) => {
            const projectNameRole = []
            if (project.name) projectNameRole.push(project.name)
            if (project.role && project.role.trim()) projectNameRole.push(project.role)
            
            if (projectNameRole.length > 0) {
              AddText(projectNameRole.join(' | '), fontSize, true)
              AddSpacing(1)
            }
            
            if (project.period && project.period.trim()) {
              AddText(project.period, fontSize)
              AddSpacing(2)
            }
            
            if (project.description && project.description.length > 0) {
              project.description.forEach((desc, index) => {
                AddText(`${index + 1}、${desc}`, fontSize)
              })
            }
            
            AddSpacing(sectionSpacing)
          })
        }
      })
      
      // 保存PDF
      pdf.save(`resume-${new Date().getTime()}.pdf`)
      setSaveMessage('PDF导出成功')
      setTimeout(() => setSaveMessage(''), 2000)
    } catch (error) {
      console.error('导出PDF失败:', error)
      setSaveMessage('导出失败，请重试')
      setTimeout(() => setSaveMessage(''), 2000)
    } finally {
      setIsExporting(false)
    }
  }

  const HandlePrint = () => {
    setShowPrintDialog(true)
  }

  const HandleConfirmPrint = () => {
    // 移除旧的样式
    const oldStyle = document.getElementById('print-page-number-style')
    if (oldStyle) {
      oldStyle.remove()
    }
    
    // 动态注入打印样式
    const styleElement = document.createElement('style')
    styleElement.id = 'print-page-number-style'
    
    // 获取字体设置
    const getFontFamily = (fontSetting) => {
      if (fontSetting === 'inherit') {
        return 'inherit'
      }
      return fontSetting
    }
    
    // 优先使用简历样式设置，如果没有则使用打印设置
    const bodyFontFamily = resumeStyle && resumeStyle.fontFamily !== 'inherit'
      ? getFontFamily(resumeStyle.fontFamily)
      : getFontFamily(printSettings.fontFamily)
    const pageNumberFontFamily = printSettings.pageNumberFontFamily === 'inherit' 
      ? bodyFontFamily 
      : getFontFamily(printSettings.pageNumberFontFamily)
    
    // 获取简历样式设置
    const resumeFontSize = resumeStyle ? `${resumeStyle.fontSize}px` : '14px'
    const resumeLineHeight = resumeStyle ? resumeStyle.lineHeight : 1.6
    const resumeTextColor = resumeStyle ? resumeStyle.textColor : '#1f2937'
    
    // 生成页码样式
    let pageNumberCSS = ''
    if (printSettings.showPageNumber) {
      const position = printSettings.pageNumberPosition
      const positions = {
        'bottom-center': { selector: '@bottom-center', margin: 'margin-bottom: 0.5cm;' },
        'bottom-right': { selector: '@bottom-right', margin: 'margin-bottom: 0.5cm; margin-right: 0.5cm;' },
        'bottom-left': { selector: '@bottom-left', margin: 'margin-bottom: 0.5cm; margin-left: 0.5cm;' },
        'top-center': { selector: '@top-center', margin: 'margin-top: 0.5cm;' },
        'top-right': { selector: '@top-right', margin: 'margin-top: 0.5cm; margin-right: 0.5cm;' },
        'top-left': { selector: '@top-left', margin: 'margin-top: 0.5cm; margin-left: 0.5cm;' }
      }
      
      const pos = positions[position] || positions['bottom-center']
      
      // 根据格式生成页码内容
      let pageContent = 'counter(page)'
      if (printSettings.pageNumberFormat === 'number/total') {
        pageContent = 'counter(page) " / " counter(pages)'
      }
      
      // 构建完整的CSS，确保所有位置都被清空，只有选中的位置显示页码
      pageNumberCSS = `@media print {
  #resume-preview {
    font-family: ${bodyFontFamily} !important;
    font-size: ${resumeFontSize} !important;
    line-height: ${resumeLineHeight} !important;
    color: ${resumeTextColor} !important;
  }
  #resume-preview h1 {
    font-size: ${resumeStyle ? `${resumeStyle.titleFontSize}px` : '24px'} !important;
    color: ${resumeStyle ? resumeStyle.titleColor : '#111827'} !important;
  }
  #resume-preview h2 {
    font-size: ${resumeStyle ? `${resumeStyle.sectionTitleFontSize}px` : '18px'} !important;
    color: ${resumeStyle ? resumeStyle.sectionTitleColor : '#374151'} !important;
  }
  @page {
    margin: 1cm;
    @top-left { content: ""; }
    @top-center { content: ""; }
    @top-right { content: ""; }
    @bottom-left { content: ""; }
    @bottom-center { content: ""; }
    @bottom-right { content: ""; }
    ${pos.selector} {
      content: ${pageContent};
      font-family: ${pageNumberFontFamily};
      font-size: 10pt;
      color: #666;
      ${pos.margin}
    }
  }
}`
    } else {
      pageNumberCSS = `@media print {
  #resume-preview {
    font-family: ${bodyFontFamily} !important;
    font-size: ${resumeFontSize} !important;
    line-height: ${resumeLineHeight} !important;
    color: ${resumeTextColor} !important;
  }
  #resume-preview h1 {
    font-size: ${resumeStyle ? `${resumeStyle.titleFontSize}px` : '24px'} !important;
    color: ${resumeStyle ? resumeStyle.titleColor : '#111827'} !important;
  }
  #resume-preview h2 {
    font-size: ${resumeStyle ? `${resumeStyle.sectionTitleFontSize}px` : '18px'} !important;
    color: ${resumeStyle ? resumeStyle.sectionTitleColor : '#374151'} !important;
  }
  @page {
    margin: 1cm;
    @top-left { content: ""; }
    @top-center { content: ""; }
    @top-right { content: ""; }
    @bottom-left { content: ""; }
    @bottom-center { content: ""; }
    @bottom-right { content: ""; }
  }
}`
    }
    
    styleElement.textContent = pageNumberCSS
    document.head.appendChild(styleElement)
    
    // 关闭对话框
    setShowPrintDialog(false)
    
    // 延迟执行打印，确保样式已应用
    setTimeout(() => {
      window.print()
      
      // 打印完成后清理样式（延迟执行）
      setTimeout(() => {
        const styleToRemove = document.getElementById('print-page-number-style')
        if (styleToRemove && styleToRemove.parentNode) {
          styleToRemove.parentNode.removeChild(styleToRemove)
        }
      }, 1000)
    }, 100)
  }

  const HandlePrintSettingsChange = (key, value) => {
    const newSettings = { ...printSettings, [key]: value }
    setPrintSettings(newSettings)
    SavePrintSettings(newSettings)
  }

  const pageNumberPositions = [
    { value: 'bottom-center', label: '底部居中' },
    { value: 'bottom-right', label: '右下角' },
    { value: 'bottom-left', label: '左下角' },
    { value: 'top-center', label: '顶部居中' },
    { value: 'top-right', label: '右上角' },
    { value: 'top-left', label: '左上角' }
  ]

  const fontOptions = [
    { value: 'inherit', label: '使用默认字体' },
    { value: 'SimSun, 宋体', label: '宋体' },
    { value: 'SimHei, 黑体', label: '黑体' },
    { value: 'Microsoft YaHei, 微软雅黑', label: '微软雅黑' },
    { value: 'FangSong, 仿宋', label: '仿宋' },
    { value: 'KaiTi, 楷体', label: '楷体' },
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Times New Roman, serif', label: 'Times New Roman' },
    { value: 'Courier New, monospace', label: 'Courier New' }
  ]

  const HandleExportJSON = () => {
    const success = ExportResumeJSON(resumeData)
    if (success) {
      setSaveMessage('JSON导出成功')
      setTimeout(() => setSaveMessage(''), 2000)
    } else {
      setSaveMessage('导出失败，请重试')
      setTimeout(() => setSaveMessage(''), 2000)
    }
  }

  const HandleExportExcel = async () => {
    try {
      const success = await ExportResumeExcel(resumeData)
      if (success) {
        setSaveMessage('Excel导出成功')
        setTimeout(() => setSaveMessage(''), 2000)
      } else {
        setSaveMessage('导出失败，请重试')
        setTimeout(() => setSaveMessage(''), 2000)
      }
    } catch (error) {
      setSaveMessage('导出失败，请重试')
      setTimeout(() => setSaveMessage(''), 2000)
    }
  }

  const HandleDownloadTemplate = async () => {
    try {
      const success = await DownloadExcelTemplate()
      if (success) {
        setSaveMessage('模板下载成功')
        setTimeout(() => setSaveMessage(''), 2000)
      } else {
        setSaveMessage('下载失败，请重试')
        setTimeout(() => setSaveMessage(''), 2000)
      }
    } catch (error) {
      setSaveMessage('下载失败，请重试')
      setTimeout(() => setSaveMessage(''), 2000)
    }
  }

  const HandleImportJSON = (event) => {
    const file = event.target.files[0]
    if (!file) return

    ImportResumeJSON(file)
      .then((data) => {
        setResumeData(data)
        SaveResumeData(data)
        setSaveMessage('JSON导入成功')
        setTimeout(() => setSaveMessage(''), 2000)
      })
      .catch((error) => {
        setSaveMessage(error.message || '导入失败，请重试')
        setTimeout(() => setSaveMessage(''), 2000)
      })
    
    event.target.value = ''
  }

  const HandleImportExcel = (event) => {
    const file = event.target.files[0]
    if (!file) return

    ImportResumeExcel(file)
      .then((data) => {
        setResumeData(data)
        SaveResumeData(data)
        setSaveMessage('Excel导入成功')
        setTimeout(() => setSaveMessage(''), 2000)
      })
      .catch((error) => {
        setSaveMessage(error.message || '导入失败，请重试')
        setTimeout(() => setSaveMessage(''), 2000)
      })
    
    event.target.value = ''
  }

  const HandleClear = () => {
    setShowClearConfirm(true)
  }

  const HandleConfirmClear = () => {
    const defaultData = GetDefaultResumeData()
    setResumeData(defaultData)
    SaveResumeData(defaultData)
    setShowClearConfirm(false)
    setSaveMessage('数据已清空')
    setTimeout(() => setSaveMessage(''), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">EasyResume</h1>
            <div className="flex items-center gap-3">
              {saveMessage && (
                <div className="text-sm text-green-600 font-medium">{saveMessage}</div>
              )}
              {/* 导入 - 数据输入，放在最前面 */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowImportMenu(!showImportMenu)
                    setShowExportMenu(false)
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  导入
                </button>
                {showImportMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowImportMenu(false)}
                    ></div>
                    <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                      <label className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-md cursor-pointer">
                        导入JSON
                        <input
                          type="file"
                          accept=".json"
                          onChange={(e) => {
                            HandleImportJSON(e)
                            setShowImportMenu(false)
                          }}
                          className="hidden"
                        />
                      </label>
                      <label className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-md cursor-pointer">
                        导入Excel
                        <input
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={(e) => {
                            HandleImportExcel(e)
                            setShowImportMenu(false)
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </>
                )}
              </div>
              {/* 编辑/预览 - 核心功能，视图切换 */}
              <button
                onClick={() => {
                  const newMode = !isPreview
                  setIsPreview(newMode)
                  SaveViewMode(newMode)
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                {isPreview ? '编辑' : '预览'}
              </button>
              {/* 保存 - 最常用操作 */}
              <button
                onClick={HandleSave}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                title="保存 (Ctrl+S)"
              >
                保存
              </button>
              {/* 导出 - 数据输出 */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowExportMenu(!showExportMenu)
                    setShowImportMenu(false)
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  导出
                </button>
                {showExportMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowExportMenu(false)}
                    ></div>
                    <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                      <button
                        onClick={() => {
                          HandleExportJSON()
                          setShowExportMenu(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-md"
                      >
                        导出JSON
                      </button>
                      <button
                        onClick={() => {
                          HandleExportExcel()
                          setShowExportMenu(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        导出Excel
                      </button>
                      {isPreview && (
                        <button
                          onClick={() => {
                            HandleExportPDF()
                            setShowExportMenu(false)
                          }}
                          disabled={isExporting}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isExporting ? '导出PDF中...' : '导出PDF'}
                        </button>
                      )}
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={() => {
                          HandleDownloadTemplate()
                          setShowExportMenu(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-md"
                      >
                        下载模板
                      </button>
                    </div>
                  </>
                )}
              </div>
              {/* 打印 - 预览模式下的输出操作 */}
              {isPreview && (
                <button
                  onClick={HandlePrint}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  打印
                </button>
              )}
              {/* 清空 - 危险操作，放在最后 */}
              <button
                onClick={HandleClear}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                清空
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xlplus mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isPreview ? (
          <div className="flex gap-6">
            <ResumeStylePanel onStyleChange={setResumeStyle} />
            <div className="flex-1">
              <ResumePreview data={resumeData} style={resumeStyle} />
            </div>
            <div className="w-64"></div>
          </div>
        ) : (
          <ResumeEditor data={resumeData} onChange={setResumeData} />
        )}
      </main>

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">确认清空数据</h3>
            <p className="text-sm text-gray-600 mb-4">
              此操作将清空所有简历数据，且无法恢复！
            </p>
            <p className="text-sm text-orange-600 mb-6 font-medium">
              ⚠️ 请确保已保存或导出您的数据，否则将永久丢失！
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={HandleConfirmClear}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                确认清空
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 打印对话框 */}
      {showPrintDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">打印设置</h3>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                {/* 字体设置 */}
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-4">字体设置</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        全文字体
                      </label>
                      <select
                        value={printSettings.fontFamily}
                        onChange={(e) => HandlePrintSettingsChange('fontFamily', e.target.value)}
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {fontOptions.map((font) => (
                          <option key={font.value} value={font.value}>
                            {font.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        页码字体
                      </label>
                      <select
                        value={printSettings.pageNumberFontFamily}
                        onChange={(e) => HandlePrintSettingsChange('pageNumberFontFamily', e.target.value)}
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="inherit">继承全文字体</option>
                        {fontOptions.filter(f => f.value !== 'inherit').map((font) => (
                          <option key={font.value} value={font.value}>
                            {font.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 页码设置 */}
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-4">页码设置</h4>
                  <label className="flex items-center gap-3 cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      checked={printSettings.showPageNumber}
                      onChange={(e) => HandlePrintSettingsChange('showPageNumber', e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-base font-medium text-gray-900">显示页码</span>
                  </label>
                  {printSettings.showPageNumber && (
                    <div className="ml-8 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          页码位置
                        </label>
                        <select
                          value={printSettings.pageNumberPosition}
                          onChange={(e) => HandlePrintSettingsChange('pageNumberPosition', e.target.value)}
                          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {pageNumberPositions.map((pos) => (
                            <option key={pos.value} value={pos.value}>
                              {pos.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          页码格式
                        </label>
                        <select
                          value={printSettings.pageNumberFormat}
                          onChange={(e) => HandlePrintSettingsChange('pageNumberFormat', e.target.value)}
                          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="number">仅数字（1, 2, 3...）</option>
                          <option value="number/total">数字/总页数（1/3, 2/3...）</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* 打印提示 */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">打印提示：</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-700">
                        <li>建议使用"另存为PDF"功能保存简历</li>
                        <li>打印前请确保浏览器已隐藏页眉页脚</li>
                        <li>页码将根据您的设置显示在指定位置</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowPrintDialog(false)}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={HandleConfirmPrint}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                打印
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

