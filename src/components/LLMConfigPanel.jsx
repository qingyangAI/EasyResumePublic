import { useState, useEffect } from 'react'
import { LoadLLMConfig, SaveLLMConfig } from '../utils/llmApi'

function LLMConfigPanel({ onClose }) {
  const [config, setConfig] = useState({
    model: 'zai-org/GLM-4.5',
    apiToken: '',
    temperature: 0.7,
    maxTokens: 2000
  })
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    const saved = LoadLLMConfig()
    setConfig(saved)
  }, [])

  // ESC关闭弹窗
  useEffect(() => {
    const HandleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', HandleKeyDown)
    return () => {
      window.removeEventListener('keydown', HandleKeyDown)
    }
  }, [onClose])

  const HandleSave = () => {
    if (!config.apiToken.trim()) {
      setSaveMessage('请填写API Token')
      setTimeout(() => setSaveMessage(''), 2000)
      return
    }

    SaveLLMConfig(config)
    setSaveMessage('配置已保存')
    setTimeout(() => {
      setSaveMessage('')
      if (onClose) onClose()
    }, 1000)
  }

  const HandleTest = async () => {
    if (!config.apiToken.trim()) {
      setSaveMessage('请先填写API Token')
      setTimeout(() => setSaveMessage(''), 2000)
      return
    }

    try {
      const { CallLLM } = await import('../utils/llmApi')
      await CallLLM([
        {
          role: 'user',
          content: '你好'
        }
      ], {
        model: config.model,
        temperature: config.temperature,
        maxTokens: 100
      })
      setSaveMessage('连接测试成功')
      setTimeout(() => setSaveMessage(''), 2000)
    } catch (error) {
      setSaveMessage(`测试失败: ${error.message}`)
      setTimeout(() => setSaveMessage(''), 3000)
    }
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">LLM API 配置</h3>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Token <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={config.apiToken}
                onChange={(e) => setConfig({ ...config, apiToken: e.target.value })}
                placeholder="请输入硅基流动API Token"
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                获取Token: 访问 <a href="https://cloud.siliconflow.cn/me/account/ak" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">siliconflow.cn</a> 注册并获取API Token
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                模型
              </label>
              <select
                value={config.model}
                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="zai-org/GLM-4.5">GLM-4.5</option>
                <option value="deepseek-ai/DeepSeek-V2.5">DeepSeek-V2.5</option>
                <option value="Qwen/Qwen2.5-72B-Instruct">Qwen2.5-72B-Instruct</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                温度 (Temperature)
              </label>
              <input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={config.temperature}
                onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">控制输出随机性，0-2之间，推荐0.3-0.7</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最大Token数
              </label>
              <input
                type="number"
                min="100"
                max="4000"
                step="100"
                value={config.maxTokens}
                onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">控制输出长度，推荐1500-3000</p>
            </div>

            {saveMessage && (
              <div className={`p-3 rounded-md text-sm ${
                saveMessage.includes('成功') || saveMessage.includes('测试成功')
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}>
                {saveMessage}
              </div>
            )}
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={HandleTest}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            测试连接
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={HandleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}

export default LLMConfigPanel

