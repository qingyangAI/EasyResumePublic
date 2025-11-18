// LLM API服务层
// 支持硅基流动GLM-4.5及其他模型

const API_BASE_URL = 'https://api.siliconflow.cn/v1/chat/completions'

// 默认配置
const DEFAULT_CONFIG = {
  model: 'zai-org/GLM-4.5',
  apiToken: '',
  temperature: 0.7,
  maxTokens: 2000
}

// 从localStorage加载配置
export const LoadLLMConfig = () => {
  try {
    const saved = localStorage.getItem('llmConfig')
    if (saved) {
      const config = JSON.parse(saved)
      return { ...DEFAULT_CONFIG, ...config }
    }
  } catch (error) {
    console.error('加载LLM配置失败:', error)
  }
  return { ...DEFAULT_CONFIG }
}

// 保存配置到localStorage
export const SaveLLMConfig = (config) => {
  try {
    localStorage.setItem('llmConfig', JSON.stringify(config))
  } catch (error) {
    console.error('保存LLM配置失败:', error)
  }
}

// 调用LLM API
export const CallLLM = async (messages, options = {}) => {
  const config = LoadLLMConfig()
  
  if (!config.apiToken) {
    throw new Error('请先配置API Token')
  }

  const payload = {
    model: options.model || config.model,
    messages: messages,
    temperature: options.temperature || config.temperature,
    max_tokens: options.maxTokens || config.maxTokens
  }

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      if (response.status === 401) {
        throw new Error('API Token无效，请检查配置')
      } else if (response.status === 429) {
        throw new Error('请求频率过高，请稍后再试')
      } else if (response.status === 503) {
        throw new Error('模型服务过载，请稍后再试')
      } else {
        throw new Error(errorData.message || `请求失败: ${response.status}`)
      }
    }

    const data = await response.json()
    
    if (data.choices && data.choices.length > 0) {
      return {
        content: data.choices[0].message?.content || '',
        reasoning: data.choices[0].message?.reasoning_content || '',
        usage: data.usage || {}
      }
    } else {
      throw new Error('API返回数据格式错误')
    }
  } catch (error) {
    if (error.message) {
      throw error
    }
    throw new Error(`网络请求失败: ${error.message || '未知错误'}`)
  }
}

// 解析JSON响应（用于结构化数据）
export const ParseJSONResponse = (content) => {
  try {
    // 尝试提取JSON部分
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return JSON.parse(content)
  } catch (error) {
    console.error('解析JSON失败:', error)
    return null
  }
}

