import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/icons/Logo'
import { 
  GetResumeList, 
  DeleteResume, 
  CopyResume, 
  UpdateResumeName, 
  ReorderResume,
  SortResumeList,
  SaveCurrentResumeId,
  GetCurrentResumeId
} from '../utils/resumeData'
import Toast from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../hooks/useToast'

function ResumeListPage() {
  const navigate = useNavigate()
  const [resumeList, setResumeList] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [contextMenu, setContextMenu] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const contextMenuRef = useRef(null)
  const editInputRef = useRef(null)
  const { toast, success, error, hideToast } = useToast()

  useEffect(() => {
    LoadResumeList()
  }, [sortBy, sortOrder])

  useEffect(() => {
    const HandleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setContextMenu(null)
      }
    }
    document.addEventListener('click', HandleClickOutside)
    return () => document.removeEventListener('click', HandleClickOutside)
  }, [])

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingId])

  const LoadResumeList = () => {
    const sorted = SortResumeList(sortBy, sortOrder)
    setResumeList(sorted)
  }

  const HandleSearch = (query) => {
    setSearchQuery(query)
  }

  const filteredResumes = resumeList.filter(resume => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      resume.name?.toLowerCase().includes(query) ||
      resume.data?.personalInfo?.name?.toLowerCase().includes(query) ||
      resume.data?.personalInfo?.title?.toLowerCase().includes(query)
    )
  })

  const HandleContextMenu = (e, resume) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      resume
    })
  }

  const HandleEdit = (resume) => {
    SaveCurrentResumeId(resume.id)
    navigate(`/editor/${resume.id}`)
    setContextMenu(null)
  }

  const HandleRename = (resume) => {
    setEditingId(resume.id)
    setEditingName(resume.name)
    setContextMenu(null)
  }

  const HandleSaveRename = (id) => {
    if (editingName.trim()) {
      UpdateResumeName(id, editingName.trim())
      LoadResumeList()
    }
    setEditingId(null)
    setEditingName('')
  }

  const HandleDelete = (id) => {
    const resume = resumeList.find(r => r.id === id)
    setDeleteConfirm({
      id,
      resume
    })
    setContextMenu(null)
  }

  const HandleConfirmDelete = () => {
    if (deleteConfirm) {
      DeleteResume(deleteConfirm.id)
      LoadResumeList()
      success('简历已删除')
      setDeleteConfirm(null)
    }
  }

  const HandleCopy = (id) => {
    CopyResume(id)
    LoadResumeList()
    setContextMenu(null)
  }

  const HandleDownloadPDF = async (resume) => {
    try {
      const { InitPdfMake, EnsureFontLoaded } = await import('../utils/pdfMakeConfig')
      const { ConvertResumeToPdfMakeDoc } = await import('../utils/resumeToPdfMake')
      
      await EnsureFontLoaded('inherit')
      const pdfMake = await InitPdfMake()
      const docDefinition = ConvertResumeToPdfMakeDoc(resume.data, null)
      const pdfDoc = pdfMake.createPdf(docDefinition)
      
      pdfDoc.getBlob(async (blob) => {
        const fileName = `${resume.name || 'resume'}.pdf`
        if ('showSaveFilePicker' in window) {
          try {
            const fileHandle = await window.showSaveFilePicker({
              suggestedName: fileName,
              types: [{ description: 'PDF文件', accept: { 'application/pdf': ['.pdf'] } }]
            })
            const writable = await fileHandle.createWritable()
            await writable.write(blob)
            await writable.close()
            success('PDF导出成功')
          } catch (error) {
            if (error.name !== 'AbortError') {
              console.error('保存文件失败:', error)
              error('保存文件失败，请重试')
            }
          }
        } else {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = fileName
          link.click()
          URL.revokeObjectURL(url)
          success('PDF导出成功')
        }
      })
    } catch (error) {
      console.error('导出PDF失败:', error)
      error('导出PDF失败，请重试')
    }
    setContextMenu(null)
  }

  const HandleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move'
    setDraggedIndex(index)
  }

  const HandleDragOver = (e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (draggedIndex === null || draggedIndex === index) return
    
    // 只更新视觉反馈，不修改实际列表
    // 实际排序在drop时处理
  }

  const HandleDrop = (e, index) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      const draggedResume = filteredResumes[draggedIndex]
      const targetResume = filteredResumes[index]
      
      const allResumes = GetResumeList()
      const fromIndex = allResumes.findIndex(r => r.id === draggedResume.id)
      const toIndex = allResumes.findIndex(r => r.id === targetResume.id)
      
      if (fromIndex !== -1 && toIndex !== -1) {
        ReorderResume(fromIndex, toIndex)
        LoadResumeList()
      }
    }
    setDraggedIndex(null)
  }

  const HandleDragEnd = () => {
    setDraggedIndex(null)
  }

  const FormatDate = (dateString) => {
    if (!dateString) return '未知'
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航栏 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Logo className="w-7 h-7 text-gray-900" />
              <span className="text-xl font-medium text-gray-900">EasyResume</span>
            </button>
            <button
              onClick={() => navigate('/templates')}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              创建新简历
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-light text-gray-900 mb-4">简历列表</h1>
          
          {/* 搜索和排序 */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="搜索简历..."
                value={searchQuery}
                onChange={(e) => HandleSearch(e.target.value)}
                className="w-full px-4 py-2 pl-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="updatedAt">按更新时间</option>
              <option value="createdAt">按创建时间</option>
              <option value="name">按名称</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {sortOrder === 'asc' ? '↑ 升序' : '↓ 降序'}
            </button>
          </div>
        </div>

        {/* 简历列表 */}
        <div className="space-y-2">
          {filteredResumes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg mb-2">暂无简历</p>
              <button
                onClick={() => navigate('/templates')}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                创建新简历
              </button>
            </div>
          ) : (
            filteredResumes.map((resume, index) => (
              <div
                key={resume.id}
                draggable
                onDragStart={(e) => HandleDragStart(e, index)}
                onDragOver={(e) => HandleDragOver(e, index)}
                onDrop={(e) => HandleDrop(e, index)}
                onDragEnd={HandleDragEnd}
                onContextMenu={(e) => HandleContextMenu(e, resume)}
                onClick={() => HandleEdit(resume)}
                className={`group relative bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer ${
                  GetCurrentResumeId() === resume.id ? 'border-gray-900 bg-gray-50' : ''
                } ${draggedIndex === index ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    {editingId === resume.id ? (
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onBlur={() => HandleSaveRename(resume.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            HandleSaveRename(resume.id)
                          } else if (e.key === 'Escape') {
                            setEditingId(null)
                            setEditingName('')
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full px-2 py-1 text-sm font-medium text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-medium text-gray-900 truncate">
                          {resume.name}
                        </h3>
                        {resume.isTemplate && (
                          <span className="px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                            模板
                          </span>
                        )}
                      </div>
                    )}
                    <div className="mt-1 text-sm text-gray-500">
                      {resume.data?.personalInfo?.name && (
                        <span className="mr-4">{resume.data.personalInfo.name}</span>
                      )}
                      {resume.data?.personalInfo?.title && (
                        <span>{resume.data.personalInfo.title}</span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                      <span>创建: {FormatDate(resume.createdAt)}</span>
                      <span>更新: {FormatDate(resume.updatedAt)}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        HandleRename(resume)
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="重命名"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Toast通知 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={hideToast}
        />
      )}

      {/* 删除确认对话框 */}
      {deleteConfirm && (
        <ConfirmDialog
          title="确认删除"
          message={`确定要删除"${deleteConfirm.resume?.name || '这份简历'}"吗？此操作无法恢复！`}
          confirmText="删除"
          cancelText="取消"
          type="danger"
          onConfirm={HandleConfirmDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      {/* 右键菜单 */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[160px]"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`
          }}
        >
          <button
            onClick={() => HandleEdit(contextMenu.resume)}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            编辑
          </button>
          <button
            onClick={() => HandleRename(contextMenu.resume)}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            重命名
          </button>
          <button
            onClick={() => HandleCopy(contextMenu.resume.id)}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            复制
          </button>
          <button
            onClick={() => HandleDownloadPDF(contextMenu.resume)}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            下载PDF
          </button>
          <div className="border-t border-gray-100 my-1"></div>
          <button
            onClick={() => HandleDelete(contextMenu.resume.id)}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            删除
          </button>
        </div>
      )}
    </div>
  )
}

export default ResumeListPage

