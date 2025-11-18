import { useState, useEffect } from 'react'
import { SaveFileNameTemplate, LoadFileNameTemplate, GenerateFileName } from '../utils/resumeData'

function FileNameConfig({ data, onClose }) {
  const [templateData, setTemplateData] = useState({
    template: '{name}-{title}-{phone}',
    customTemplate: ''
  })
  const [previewFileName, setPreviewFileName] = useState('')

  useEffect(() => {
    const saved = LoadFileNameTemplate()
    setTemplateData(saved)
  }, [])

  useEffect(() => {
    if (data) {
      const preview = GenerateFileName(data, '')
      setPreviewFileName(preview)
    }
  }, [data, templateData])

  const HandleTemplateChange = (value) => {
    const newTemplate = {
      ...templateData,
      customTemplate: value
    }
    setTemplateData(newTemplate)
    SaveFileNameTemplate(newTemplate)
  }

  const HandleInsertVariable = (variable) => {
    const currentTemplate = templateData.customTemplate || templateData.template
    const newTemplate = currentTemplate + `{${variable}}`
    // 如果 customTemplate 为空，需要先设置它
    if (!templateData.customTemplate) {
      const newTemplateData = {
        ...templateData,
        customTemplate: templateData.template + `{${variable}}`
      }
      setTemplateData(newTemplateData)
      SaveFileNameTemplate(newTemplateData)
    } else {
      HandleTemplateChange(newTemplate)
    }
  }

  const HandleUseDefault = () => {
    const newTemplate = {
      ...templateData,
      customTemplate: ''
    }
    setTemplateData(newTemplate)
    SaveFileNameTemplate(newTemplate)
  }

  const currentTemplate = templateData.customTemplate || templateData.template

  const availableVariables = [
    { key: 'name', label: '姓名' },
    { key: 'title', label: '职位' },
    { key: 'phone', label: '手机号' },
    { key: 'email', label: '邮箱' },
    { key: 'age', label: '年龄' },
    { key: 'targetCity', label: '目标城市' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">文件名配置</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* 当前模板显示 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              当前文件名模板
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm font-mono">
              {currentTemplate || '(空)'}
            </div>
          </div>

          {/* 预览文件名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              预览文件名
            </label>
            <div className="px-3 py-2 bg-blue-50 border border-blue-300 rounded-md text-sm font-mono text-blue-900">
              {previewFileName || '(无预览)'}
            </div>
          </div>

          {/* 关键项按钮 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              点击添加关键项到模板
            </label>
            <div className="flex flex-wrap gap-2">
              {availableVariables.map((variable) => (
                <button
                  key={variable.key}
                  onClick={() => HandleInsertVariable(variable.key)}
                  className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 transition-colors"
                >
                  {variable.label} ({'{' + variable.key + '}'})
                </button>
              ))}
            </div>
          </div>

          {/* 分隔符按钮 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              常用分隔符
            </label>
            <div className="flex flex-wrap gap-2">
              {['-', '_', ' ', '·', '｜'].map((sep) => (
                <button
                  key={sep}
                  onClick={() => {
                    const currentTemplate = templateData.customTemplate || templateData.template
                    // 如果 customTemplate 为空，需要先设置它
                    if (!templateData.customTemplate) {
                      const newTemplateData = {
                        ...templateData,
                        customTemplate: templateData.template + sep
                      }
                      setTemplateData(newTemplateData)
                      SaveFileNameTemplate(newTemplateData)
                    } else {
                      HandleTemplateChange(currentTemplate + sep)
                    }
                  }}
                  className="px-3 py-1.5 text-sm bg-gray-50 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                >
                  {sep === ' ' ? '空格' : sep}
                </button>
              ))}
            </div>
          </div>

          {/* 手动输入模板 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              手动输入文件名模板
            </label>
            <input
              type="text"
              value={templateData.customTemplate}
              onChange={(e) => HandleTemplateChange(e.target.value)}
              placeholder="例如：{name}-{title}-{phone}"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <p className="mt-1 text-xs text-gray-500">
              使用 {'{变量名}'} 来插入个人信息，例如：{'{name}'} 表示姓名
            </p>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={HandleUseDefault}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
            >
              恢复默认
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileNameConfig

