import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  GetResumeList, 
  GetCurrentResumeId, 
  GetResumeById,
  DeleteResume,
  CopyResume,
  UpdateResumeName,
  SaveCurrentResumeId
} from '../utils/resumeData'
import Toast from './Toast'
import ConfirmDialog from './ConfirmDialog'
import { useToast } from '../hooks/useToast'

const ResumeListSidebar = ({ onSelectResume, currentResumeId }) => {
  const navigate = useNavigate()
  const [resumeList, setResumeList] = useState([])
  const [currentId, setCurrentId] = useState(null)
  const [contextMenu, setContextMenu] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const contextMenuRef = useRef(null)
  const editInputRef = useRef(null)
  const { toast, success, error, hideToast } = useToast()

  useEffect(() => {
    LoadResumeList()
  }, [currentResumeId])

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
    const list = GetResumeList()
    const current = GetCurrentResumeId()
    setResumeList(list)
    setCurrentId(current || currentResumeId)
  }

  const HandleSelectResume = (resume) => {
    if (onSelectResume) {
      onSelectResume(resume)
    }
  }

  const HandleContextMenu = (e, resume) => {
    e.preventDefault()
    e.stopPropagation()
    
    // 计算菜单位置，避免超出屏幕
    const menuWidth = 160
    const menuHeight = 200
    let x = e.clientX
    let y = e.clientY
    
    // 如果菜单会超出右边界，则显示在鼠标左侧
    if (x + menuWidth > window.innerWidth) {
      x = e.clientX - menuWidth
    }
    
    // 如果菜单会超出下边界，则向上调整
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10
    }
    
    setContextMenu({
      x,
      y,
      resume
    })
  }

  const HandleEdit = (resume) => {
    SaveCurrentResumeId(resume.id)
    if (onSelectResume) {
      onSelectResume(resume)
    } else {
      navigate(`/editor/${resume.id}`)
    }
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
    setDeleteConfirm({
      id,
      resume: resumeList.find(r => r.id === id)
    })
    setContextMenu(null)
  }

  const HandleConfirmDelete = async () => {
    if (deleteConfirm) {
      const { id } = deleteConfirm
      DeleteResume(id)
      LoadResumeList()
      success('简历已删除')
      // 如果删除的是当前简历，需要通知父组件
      if (currentId === id || currentResumeId === id) {
        const remainingList = GetResumeList()
        if (remainingList.length > 0) {
          HandleSelectResume(remainingList[0])
        } else {
          HandleSelectResume(null)
        }
      }
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

  const FormatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', { 
      month: '2-digit', 
      day: '2-digit'
    })
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-900">简历列表</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {resumeList.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            <p>还没有简历</p>
          </div>
        ) : (
          <div className="space-y-1">
            {resumeList.map((resume) => (
              <div
                key={resume.id}
                onClick={() => HandleSelectResume(resume)}
                onContextMenu={(e) => HandleContextMenu(e, resume)}
                className={`p-3 rounded-lg cursor-pointer transition-colors relative ${
                  (currentId === resume.id || currentResumeId === resume.id)
                    ? 'bg-gray-100 border border-gray-200'
                    : 'border border-transparent hover:bg-gray-50 hover:border-gray-100'
                }`}
              >
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
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-sm text-gray-900 truncate flex-1">
                        {resume.name}
                      </div>
                      {resume.isTemplate && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded flex-shrink-0">
                          模板
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {FormatDate(resume.updatedAt)}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

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

export default ResumeListSidebar

