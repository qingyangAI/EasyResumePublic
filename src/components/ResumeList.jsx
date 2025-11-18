import { useState, useEffect } from 'react'
import { GetResumeList, GetCurrentResumeId, SaveCurrentResumeId, DeleteResume, UpdateResumeName, AddResume, GetDefaultResumeData, GetTemplateResume1, GetTemplateResume2, GetTemplateResume3 } from '../utils/resumeData'

const ResumeList = ({ onSelectResume, onClose }) => {
  const [resumeList, setResumeList] = useState([])
  const [currentId, setCurrentId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  useEffect(() => {
    LoadResumeList()
  }, [])

  // ESC关闭弹窗
  useEffect(() => {
    const HandleKeyDown = (event) => {
      if (event.key === 'Escape') {
        // 如果正在编辑，先取消编辑
        if (editingId) {
          event.preventDefault()
          setEditingId(null)
          setEditingName('')
          return
        }
        // 如果有删除确认对话框，先关闭它
        if (showDeleteConfirm) {
          event.preventDefault()
          setShowDeleteConfirm(null)
          return
        }
        // 否则关闭整个弹窗
        event.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', HandleKeyDown)
    return () => {
      window.removeEventListener('keydown', HandleKeyDown)
    }
  }, [onClose, editingId, showDeleteConfirm])

  const LoadResumeList = () => {
    const list = GetResumeList()
    const current = GetCurrentResumeId()
    setResumeList(list)
    setCurrentId(current)
  }

  const HandleSelectResume = (resume) => {
    SaveCurrentResumeId(resume.id)
    setCurrentId(resume.id)
    if (onSelectResume) {
      onSelectResume(resume)
    }
    if (onClose) {
      onClose()
    }
  }

  const HandleCreateNew = () => {
    const newResume = AddResume({
      name: `我的简历 ${resumeList.length + 1}`,
      data: GetDefaultResumeData(),
      isTemplate: false
    })
    LoadResumeList()
    HandleSelectResume(newResume)
  }

  const HandleStartEdit = (resume, e) => {
    e.stopPropagation()
    setEditingId(resume.id)
    setEditingName(resume.name)
  }

  const HandleSaveEdit = (id, e) => {
    e.stopPropagation()
    if (editingName.trim()) {
      UpdateResumeName(id, editingName.trim())
      LoadResumeList()
    }
    setEditingId(null)
    setEditingName('')
  }

  const HandleCancelEdit = (e) => {
    e.stopPropagation()
    setEditingId(null)
    setEditingName('')
  }

  const HandleDelete = (id, e) => {
    e.stopPropagation()
    setShowDeleteConfirm(id)
  }

  const HandleConfirmDelete = () => {
    if (showDeleteConfirm) {
      DeleteResume(showDeleteConfirm)
      LoadResumeList()
      // 如果删除的是当前选中的简历，选择第一个
      if (showDeleteConfirm === currentId) {
        const list = GetResumeList()
        if (list.length > 0) {
          HandleSelectResume(list[0])
        } else {
          SaveCurrentResumeId(null)
          setCurrentId(null)
          if (onSelectResume) {
            onSelectResume(null)
          }
        }
      }
      setShowDeleteConfirm(null)
    }
  }

  const HandleCreateFromTemplate = (templateNumber) => {
    let template
    if (templateNumber === 1) {
      template = GetTemplateResume1()
    } else if (templateNumber === 2) {
      template = GetTemplateResume2()
    } else if (templateNumber === 3) {
      template = GetTemplateResume3()
    }
    
    if (template) {
      // 创建副本，移除模板标记
      const newResume = AddResume({
        name: `${template.name} (副本)`,
        data: JSON.parse(JSON.stringify(template.data)),
        isTemplate: false
      })
      LoadResumeList()
      HandleSelectResume(newResume)
    }
  }

  const FormatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">简历列表</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {/* 模板选择区域 */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">从模板创建</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => HandleCreateFromTemplate(1)}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="font-medium text-gray-900 mb-1">模板1：前端开发工程师</div>
                <div className="text-xs text-gray-500">包含完整的前端开发经验示例</div>
              </button>
              <button
                onClick={() => HandleCreateFromTemplate(2)}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="font-medium text-gray-900 mb-1">模板2：产品经理</div>
                <div className="text-xs text-gray-500">包含完整的产品经理经验示例</div>
              </button>
              <button
                onClick={() => HandleCreateFromTemplate(3)}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="font-medium text-gray-900 mb-1">模板3：Java后端开发工程师</div>
                <div className="text-xs text-gray-500">包含完整的后端开发经验示例</div>
              </button>
            </div>
          </div>

          {/* 简历列表 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700">我的简历</h4>
              <button
                onClick={HandleCreateNew}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                新建简历
              </button>
            </div>

            {resumeList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>还没有简历，请从模板创建或新建空白简历</p>
              </div>
            ) : (
              <div className="space-y-2">
                {resumeList.map((resume) => (
                  <div
                    key={resume.id}
                    onClick={() => HandleSelectResume(resume)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      currentId === resume.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        {editingId === resume.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  HandleSaveEdit(resume.id, e)
                                } else if (e.key === 'Escape') {
                                  HandleCancelEdit(e)
                                }
                              }}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <button
                              onClick={(e) => HandleSaveEdit(resume.id, e)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={HandleCancelEdit}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-gray-900 truncate">{resume.name}</div>
                            {resume.isTemplate && (
                              <span className="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-100 rounded">
                                模板
                              </span>
                            )}
                          </div>
                        )}
                        <div className="mt-1 text-xs text-gray-500">
                          更新于 {FormatDate(resume.updatedAt)}
                        </div>
                      </div>
                      {editingId !== resume.id && (
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={(e) => HandleStartEdit(resume, e)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="重命名"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => HandleDelete(resume.id, e)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="删除"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 删除确认对话框 */}
        {showDeleteConfirm && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowDeleteConfirm(null)
              }
            }}
          >
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">确认删除</h3>
              <p className="text-sm text-gray-600 mb-4">
                确定要删除这份简历吗？此操作无法恢复。
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  取消 (ESC)
                </button>
                <button
                  onClick={HandleConfirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResumeList

