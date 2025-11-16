import { useState, useEffect } from 'react'
import ResumeEditor from './components/ResumeEditor'
import ResumePreview from './components/ResumePreview'
import { GetDefaultResumeData, SaveResumeData, LoadResumeData, SaveViewMode, LoadViewMode } from './utils/resumeData'

function App() {
  const [resumeData, setResumeData] = useState(GetDefaultResumeData())
  const [isPreview, setIsPreview] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    const saved = LoadResumeData()
    if (saved) {
      setResumeData(saved)
    }
    const savedViewMode = LoadViewMode()
    setIsPreview(savedViewMode)
  }, [])

  const HandleSave = () => {
    SaveResumeData(resumeData)
    setSaveMessage('简历已保存到本地存储')
    setTimeout(() => setSaveMessage(''), 2000)
  }

  const HandleExportPDF = async () => {
    const previewElement = document.getElementById('resume-preview')
    if (!previewElement) return

    setIsExporting(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default
      
      const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save('resume.pdf')
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
    window.print()
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
              <button
                onClick={HandleSave}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                保存
              </button>
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
              {isPreview && (
                <>
                  <button
                    onClick={HandlePrint}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    打印
                  </button>
                  <button
                    onClick={HandleExportPDF}
                    disabled={isExporting}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isExporting ? '导出中...' : '导出PDF'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isPreview ? (
          <ResumePreview data={resumeData} />
        ) : (
          <ResumeEditor data={resumeData} onChange={setResumeData} />
        )}
      </main>
    </div>
  )
}

export default App

