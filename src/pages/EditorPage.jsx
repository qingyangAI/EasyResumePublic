import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ResumeEditor from '../components/ResumeEditor'
import ResumePreview from '../components/ResumePreview'
import SmartResumeEditor from '../components/SmartResumeEditor'
import FinalResumeView from '../components/FinalResumeView'
import ResumeListSidebar from '../components/ResumeListSidebar'
import Logo from '../components/icons/Logo'
import { 
  GetDefaultResumeData, 
  SaveResumeData, 
  LoadResumeData, 
  SaveViewMode, 
  LoadViewMode, 
  ExportResumeJSON, 
  ImportResumeJSON, 
  ExportResumeExcel, 
  ImportResumeExcel, 
  DownloadExcelTemplate, 
  SavePrintSettings, 
  LoadPrintSettings, 
  GenerateFileName, 
  GetResumeById, 
  SaveCurrentResumeId, 
  UpdateResume, 
  SavePanelPosition, 
  LoadPanelPosition 
} from '../utils/resumeData'
import ResumeStylePanel from '../components/ResumeStylePanel'
import FileNameConfig from '../components/FileNameConfig'
import { fontGroups } from '../utils/fontConfig'
import FontSelector from '../components/FontSelector'

function EditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [resumeData, setResumeData] = useState(GetDefaultResumeData())
  const [currentResumeId, setCurrentResumeId] = useState(id || null)
  const [isPreview, setIsPreview] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showImportMenu, setShowImportMenu] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showPrintDialog, setShowPrintDialog] = useState(false)
  const [showFileNameConfig, setShowFileNameConfig] = useState(false)
  const [printSettings, setPrintSettings] = useState({ 
    showPageNumber: false, 
    pageNumberPosition: 'bottom-center', 
    pageNumberFormat: 'number',
    fontFamily: 'inherit',
    pageNumberFontFamily: 'inherit'
  })
  const [resumeStyle, setResumeStyle] = useState(null)
  const [editMode, setEditMode] = useState('normal')
  const [finalResume, setFinalResume] = useState(null)
  const [panelPosition, setPanelPosition] = useState({ resumeListPosition: 'left', stylePanelPosition: 'right' })
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    // 加载简历数据
    if (id) {
      const resume = GetResumeById(id)
      if (resume) {
        setResumeData(resume.data)
        setCurrentResumeId(id)
        SaveCurrentResumeId(id)
      } else {
        // 如果简历不存在，跳转到首页
        navigate('/')
      }
    } else {
      // 如果没有ID，尝试加载旧数据
      const saved = LoadResumeData()
      if (saved) {
        setResumeData(saved)
      }
    }
    
    const savedViewMode = LoadViewMode()
    setIsPreview(savedViewMode)
    const savedPrintSettings = LoadPrintSettings()
    setPrintSettings(savedPrintSettings)
    const savedPanelPosition = LoadPanelPosition()
    setPanelPosition(savedPanelPosition)
  }, [id, navigate])

  const HandleSave = useCallback(() => {
    if (currentResumeId) {
      UpdateResume(currentResumeId, resumeData)
      setSaveMessage('简历已保存')
    } else {
      SaveResumeData(resumeData)
      setSaveMessage('简历已保存到本地存储')
    }
    setTimeout(() => setSaveMessage(''), 2000)
  }, [currentResumeId, resumeData])

  const HandlePrint = useCallback(() => {
    setShowPrintDialog(true)
  }, [])

  useEffect(() => {
    const HandleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (showPrintDialog) {
          event.preventDefault()
          setShowPrintDialog(false)
          return
        }
        if (showClearConfirm) {
          event.preventDefault()
          setShowClearConfirm(false)
          return
        }
        if (showFileNameConfig) {
          event.preventDefault()
          setShowFileNameConfig(false)
          return
        }
        if (finalResume) {
          event.preventDefault()
          setFinalResume(null)
          return
        }
        if (showExportMenu) {
          event.preventDefault()
          setShowExportMenu(false)
          return
        }
        if (showImportMenu) {
          event.preventDefault()
          setShowImportMenu(false)
          return
        }
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault()
        HandleSave()
        return
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
        event.preventDefault()
        const newMode = !isPreview
        setIsPreview(newMode)
        SaveViewMode(newMode)
        return
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        if (isPreview) {
          event.preventDefault()
          HandlePrint()
          return
        }
      }
    }

    window.addEventListener('keydown', HandleKeyDown)
    return () => {
      window.removeEventListener('keydown', HandleKeyDown)
    }
  }, [isPreview, showPrintDialog, showClearConfirm, showFileNameConfig, finalResume, showExportMenu, showImportMenu, HandleSave, HandlePrint])

  const HandleSelectResume = (resume) => {
    if (resume) {
      setResumeData(resume.data)
      setCurrentResumeId(resume.id)
      SaveCurrentResumeId(resume.id)
      navigate(`/editor/${resume.id}`)
    } else {
      setResumeData(GetDefaultResumeData())
      setCurrentResumeId(null)
      SaveCurrentResumeId(null)
    }
  }

  const HandleExportPDF = async () => {
    setIsExporting(true)
    try {
      const { InitPdfMake, EnsureFontLoaded } = await import('../utils/pdfMakeConfig')
      const { ConvertResumeToPdfMakeDoc } = await import('../utils/resumeToPdfMake')
      
      const fontFamily = resumeStyle?.fontFamily || 'inherit'
      
      setSaveMessage('正在加载字体...')
      await EnsureFontLoaded(fontFamily)
      
      setSaveMessage('正在生成PDF...')
      const pdfMake = await InitPdfMake()
      
      const docDefinition = ConvertResumeToPdfMakeDoc(resumeData, resumeStyle)
      const pdfDoc = pdfMake.createPdf(docDefinition)
      
      pdfDoc.getBlob(async (blob) => {
        try {
          const fileName = GenerateFileName(resumeData, 'pdf')
          
          if ('showSaveFilePicker' in window) {
            try {
              setSaveMessage('请选择保存位置...')
              const fileHandle = await window.showSaveFilePicker({
                suggestedName: fileName,
                types: [{
                  description: 'PDF文件',
                  accept: { 'application/pdf': ['.pdf'] }
                }]
              })
              
              const writable = await fileHandle.createWritable()
              await writable.write(blob)
              await writable.close()
              
              setSaveMessage('PDF保存成功！')
              setTimeout(() => setSaveMessage(''), 2000)
            } catch (error) {
              if (error.name !== 'AbortError') {
                console.error('保存文件失败:', error)
                setSaveMessage('保存失败，请重试')
                setTimeout(() => setSaveMessage(''), 2000)
              } else {
                setSaveMessage('')
              }
            }
          } else {
            setSaveMessage('正在下载PDF...')
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = fileName
            link.style.display = 'none'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            
            setTimeout(() => {
              URL.revokeObjectURL(url)
            }, 100)
            
            setSaveMessage('PDF下载成功（已保存到下载文件夹）')
            setTimeout(() => setSaveMessage(''), 2000)
          }
        } catch (error) {
          console.error('保存PDF失败:', error)
          setSaveMessage('保存失败，请重试')
          setTimeout(() => setSaveMessage(''), 2000)
        } finally {
          setIsExporting(false)
        }
      })
      
    } catch (error) {
      console.error('导出PDF失败:', error)
      let errorMsg = '导出失败，请重试'
      if (error.message && error.message.includes('font')) {
        errorMsg = '字体加载失败，请检查网络连接后重试'
      } else if (error.message) {
        errorMsg = `导出失败: ${error.message}`
      }
      setSaveMessage(errorMsg)
      setTimeout(() => setSaveMessage(''), 3000)
      setIsExporting(false)
    }
  }

  const HandleConfirmPrint = () => {
    const oldStyle = document.getElementById('print-page-number-style')
    if (oldStyle) {
      oldStyle.remove()
    }
    
    const styleElement = document.createElement('style')
    styleElement.id = 'print-page-number-style'
    
    const getFontFamily = (fontSetting) => {
      if (fontSetting === 'inherit') {
        return 'inherit'
      }
      return fontSetting
    }
    
    const bodyFontFamily = resumeStyle && resumeStyle.fontFamily !== 'inherit'
      ? getFontFamily(resumeStyle.fontFamily)
      : getFontFamily(printSettings.fontFamily)
    const pageNumberFontFamily = printSettings.pageNumberFontFamily === 'inherit' 
      ? bodyFontFamily 
      : getFontFamily(printSettings.pageNumberFontFamily)
    
    const resumeFontSize = resumeStyle ? `${resumeStyle.fontSize}px` : '14px'
    const resumeLineHeight = resumeStyle ? resumeStyle.lineHeight : 1.6
    const resumeTextColor = resumeStyle ? resumeStyle.textColor : '#1f2937'
    
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
      
      let pageContent = 'counter(page)'
      if (printSettings.pageNumberFormat === 'number/total') {
        pageContent = 'counter(page) " / " counter(pages)'
      }
      
      pageNumberCSS = `@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
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
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
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
    
    setShowPrintDialog(false)
    
    setTimeout(() => {
      window.print()
      
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
        if (currentResumeId) {
          UpdateResume(currentResumeId, data)
        } else {
          SaveResumeData(data)
        }
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
        if (currentResumeId) {
          UpdateResume(currentResumeId, data)
        } else {
          SaveResumeData(data)
        }
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
    if (currentResumeId) {
      const defaultData = GetDefaultResumeData()
      setResumeData(defaultData)
      UpdateResume(currentResumeId, defaultData)
      setSaveMessage('当前简历已清空')
    } else {
      const defaultData = GetDefaultResumeData()
      setResumeData(defaultData)
      SaveResumeData(defaultData)
      setSaveMessage('数据已清空')
    }
    setShowClearConfirm(false)
    setTimeout(() => setSaveMessage(''), 2000)
  }

  const HandleDragStart = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
    
    const HandleDragMove = (e) => {
      const windowWidth = window.innerWidth
      const mouseX = e.clientX
      const threshold = windowWidth / 2
      
      const currentLeftPanel = panelPosition.resumeListPosition === 'left' ? 'resumeList' : 'stylePanel'
      const shouldSwap = (currentLeftPanel === 'resumeList' && mouseX > threshold) || 
                         (currentLeftPanel === 'stylePanel' && mouseX < threshold)
      
      if (shouldSwap) {
        const newPosition = {
          resumeListPosition: panelPosition.resumeListPosition === 'left' ? 'right' : 'left',
          stylePanelPosition: panelPosition.stylePanelPosition === 'right' ? 'left' : 'right'
        }
        setPanelPosition(newPosition)
        SavePanelPosition(newPosition)
        setIsDragging(false)
        document.removeEventListener('mousemove', HandleDragMove)
        document.removeEventListener('mouseup', HandleDragEnd)
      }
    }

    const HandleDragEnd = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', HandleDragMove)
      document.removeEventListener('mouseup', HandleDragEnd)
    }
    
    document.addEventListener('mousemove', HandleDragMove)
    document.addEventListener('mouseup', HandleDragEnd)
  }, [panelPosition])

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="w-full px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <Logo className="w-7 h-7 text-gray-900" />
                <span className="text-xl font-medium text-gray-900">EasyResume</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              {saveMessage && (
                <div className="text-sm text-green-600 font-medium mr-2">{saveMessage}</div>
              )}
              
              {!isPreview && (
                <>
                  <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5 bg-gray-50">
                    <button
                      onClick={() => setEditMode('normal')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        editMode === 'normal'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      普通编辑
                    </button>
                    <button
                      onClick={() => setEditMode('smart')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        editMode === 'smart'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      智能编辑
                    </button>
                  </div>
                  <div className="w-px h-6 bg-gray-200 mx-1"></div>
                </>
              )}

              <div className="flex items-center gap-1">
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowImportMenu(!showImportMenu)
                      setShowExportMenu(false)
                    }}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    导入
                  </button>
                  {showImportMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowImportMenu(false)}
                      ></div>
                      <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                        <label className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg cursor-pointer">
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
                        <label className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg cursor-pointer">
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
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowExportMenu(!showExportMenu)
                      setShowImportMenu(false)
                    }}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    导出
                  </button>
                  {showExportMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowExportMenu(false)}
                      ></div>
                      <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                        <button
                          onClick={() => {
                            HandleExportPDF()
                            setShowExportMenu(false)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                        >
                          导出PDF
                        </button>
                        <button
                          onClick={() => {
                            HandleExportJSON()
                            setShowExportMenu(false)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
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
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={() => {
                            setShowFileNameConfig(true)
                            setShowExportMenu(false)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          文件名配置
                        </button>
                        <button
                          onClick={() => {
                            HandleDownloadTemplate()
                            setShowExportMenu(false)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg"
                        >
                          下载Excel模板
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="w-px h-6 bg-gray-200 mx-1"></div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const newMode = !isPreview
                    setIsPreview(newMode)
                    SaveViewMode(newMode)
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                  title={isPreview ? '切换到编辑模式 (Ctrl+E)' : '切换到预览模式 (Ctrl+E)'}
                >
                  {isPreview ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      编辑
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      预览
                    </>
                  )}
                </button>
                <button
                  onClick={HandleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                  title="保存 (Ctrl+S)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  保存
                </button>
              </div>

              {isPreview && (
                <>
                  <div className="w-px h-6 bg-gray-200 mx-1"></div>
                  <button
                    onClick={HandlePrint}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                    title="打印 (Ctrl+P)"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    打印
                  </button>
                </>
              )}

              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <button
                onClick={HandleClear}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                清空
              </button>
            </div>
          </div>
        </div>
      </header>

      {editMode === 'smart' ? (
        <SmartResumeEditor 
          data={resumeData} 
          onChange={setResumeData}
          onGenerateFinal={(content) => setFinalResume(content)}
        />
      ) : (
        <main className="h-[calc(100vh-80px)] bg-white">
          {isPreview ? (
            <div className="flex gap-0 h-full">
              {panelPosition.resumeListPosition === 'left' ? (
                <>
                  <div className="w-80 flex-shrink-0 h-full bg-white border-r border-gray-100">
                    <ResumeListSidebar 
                      onSelectResume={HandleSelectResume}
                      currentResumeId={currentResumeId}
                    />
                  </div>
                  <div 
                    data-separator="left"
                    className="w-1 bg-gray-100 hover:bg-gray-300 cursor-col-resize transition-colors flex-shrink-0 relative group"
                    onMouseDown={HandleDragStart}
                    title="拖拽切换面板位置（拖到另一侧）"
                  >
                    <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-8 flex items-center justify-center">
                      <div className="w-1 h-12 bg-gray-300 group-hover:bg-gray-400 rounded transition-colors"></div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-80 flex-shrink-0 h-full bg-white border-r border-gray-100">
                    <ResumeStylePanel onStyleChange={setResumeStyle} />
                  </div>
                  <div 
                    data-separator="left"
                    className="w-1 bg-gray-100 hover:bg-gray-300 cursor-col-resize transition-colors flex-shrink-0 relative group"
                    onMouseDown={HandleDragStart}
                    title="拖拽切换面板位置（拖到另一侧）"
                  >
                    <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-8 flex items-center justify-center">
                      <div className="w-1 h-12 bg-gray-300 group-hover:bg-gray-400 rounded transition-colors"></div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex-1 overflow-y-auto px-6 py-8 bg-gray-50">
                <ResumePreview data={resumeData} style={resumeStyle} />
              </div>

              {panelPosition.stylePanelPosition === 'right' ? (
                <>
                  <div 
                    data-separator="right"
                    className="w-1 bg-gray-100 hover:bg-gray-300 cursor-col-resize transition-colors flex-shrink-0 relative group"
                    onMouseDown={HandleDragStart}
                    title="拖拽切换面板位置（拖到另一侧）"
                  >
                    <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-8 flex items-center justify-center">
                      <div className="w-1 h-12 bg-gray-300 group-hover:bg-gray-400 rounded transition-colors"></div>
                    </div>
                  </div>
                  <div className="w-80 flex-shrink-0 h-full bg-white border-l border-gray-100">
                    <ResumeStylePanel onStyleChange={setResumeStyle} />
                  </div>
                </>
              ) : (
                <>
                  <div 
                    data-separator="right"
                    className="w-1 bg-gray-100 hover:bg-gray-300 cursor-col-resize transition-colors flex-shrink-0 relative group"
                    onMouseDown={HandleDragStart}
                    title="拖拽切换面板位置（拖到另一侧）"
                  >
                    <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-8 flex items-center justify-center">
                      <div className="w-1 h-12 bg-gray-300 group-hover:bg-gray-400 rounded transition-colors"></div>
                    </div>
                  </div>
                  <div className="w-80 flex-shrink-0 h-full bg-white border-l border-gray-100">
                    <ResumeListSidebar 
                      onSelectResume={HandleSelectResume}
                      currentResumeId={currentResumeId}
                    />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="max-w-7xlplus mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
              <ResumeEditor data={resumeData} onChange={setResumeData} />
            </div>
          )}
        </main>
      )}

      {finalResume && (
        <FinalResumeView 
          content={finalResume} 
          onClose={() => setFinalResume(null)} 
        />
      )}

      {showClearConfirm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowClearConfirm(false)
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-2">确认清空当前简历</h3>
            <p className="text-sm text-gray-600 mb-4">
              此操作将清空当前简历的所有数据，且无法恢复！
            </p>
            <p className="text-sm text-orange-600 mb-6 font-medium">
              ⚠️ 请确保已保存或导出您的数据，否则将永久丢失！
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消 (ESC)
              </button>
              <button
                onClick={HandleConfirmClear}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                确认清空
              </button>
            </div>
          </div>
        </div>
      )}

      {showPrintDialog && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPrintDialog(false)
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-medium text-gray-900">打印设置</h3>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">字体设置</h4>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        全文字体（鼠标悬停预览，滚轮切换，点击选择）
                      </label>
                      <FontSelector
                        value={printSettings.fontFamily}
                        onChange={(fontValue) => HandlePrintSettingsChange('fontFamily', fontValue)}
                        fontGroups={fontGroups}
                        previewText="打印预览文字效果"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        页码字体（鼠标悬停预览，滚轮切换，点击选择）
                      </label>
                      <FontSelector
                        value={printSettings.pageNumberFontFamily === 'inherit' ? 'inherit' : printSettings.pageNumberFontFamily}
                        onChange={(fontValue) => HandlePrintSettingsChange('pageNumberFontFamily', fontValue)}
                        fontGroups={[
                          { name: '默认', fonts: [{ value: 'inherit', label: '继承全文字体' }] },
                          ...fontGroups.filter(g => g.name !== '默认')
                        ]}
                        previewText="页码预览文字效果"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">页码设置</h4>
                  <label className="flex items-center gap-3 cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      checked={printSettings.showPageNumber}
                      onChange={(e) => HandlePrintSettingsChange('showPageNumber', e.target.checked)}
                      className="w-5 h-5 text-gray-900 border-gray-200 rounded focus:ring-gray-900"
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
                          className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
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
                          className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        >
                          <option value="number">仅数字（1, 2, 3...）</option>
                          <option value="number/total">数字/总页数（1/3, 2/3...）</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-gray-700">
                      <p className="font-medium mb-1">打印提示：</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>建议使用"另存为PDF"功能保存简历</li>
                        <li>打印前请确保浏览器已隐藏页眉页脚</li>
                        <li>页码将根据您的设置显示在指定位置</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowPrintDialog(false)}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消 (ESC)
              </button>
              <button
                onClick={HandleConfirmPrint}
                className="px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
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

      {showFileNameConfig && (
        <FileNameConfig
          data={resumeData}
          onClose={() => setShowFileNameConfig(false)}
        />
      )}
    </div>
  )
}

export default EditorPage

