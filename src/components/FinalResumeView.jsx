import { useState } from 'react'

function FinalResumeView({ content, onClose }) {
  const [copied, setCopied] = useState(false)

  const HandleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 简单的Markdown转HTML (仅支持基本格式)
  const ConvertMarkdownToHTML = (text) => {
    if (!text) return ''
    
    let html = text
      // 标题
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      // 粗体
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // 列表
      .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      // 段落
      .replace(/\n\n/g, '</p><p class="mb-3">')
      // 换行
      .replace(/\n/g, '<br />')
    
    // 包装列表项
    html = html.replace(/(<li.*<\/li>)/g, '<ul class="list-disc ml-6 mb-3">$1</ul>')
    
    return `<p class="mb-3">${html}</p>`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">最终简历</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={HandleCopy}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {copied ? '已复制' : '复制'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: ConvertMarkdownToHTML(content) }}
          />
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">原始文本:</h4>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">{content}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinalResumeView

