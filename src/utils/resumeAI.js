// 智能简历分析服务
// 提供质量评分、建议、示例等功能

import { CallLLM, ParseJSONResponse } from './llmApi'

// 字段类型映射
const FIELD_TYPES = {
  personalInfo: '个人信息',
  tags: '专业标签',
  advantages: '个人优势',
  education: '教育背景',
  workExperiences: '工作经历',
  projects: '项目经历',
  honors: '荣誉证书'
}

// 生成分析提示词
const GenerateAnalysisPrompt = (fieldType, content, fieldName = '') => {
  const basePrompt = `你是一个专业的简历审核专家，专门帮助用户优化简历内容，使其符合互联网大厂招聘标准。

当前需要分析的字段类型：${FIELD_TYPES[fieldType] || fieldType}
${fieldName ? `字段名称：${fieldName}` : ''}

用户输入的内容：
${content || '（空）'}

请按照以下要求进行分析：

1. **内容合规性判断**：检查内容是否太短、是否流水账、是否没有技术深度、是否没有量化指标、是否没有体现业务价值等。

2. **质量评分**：给出1-5分的评分
   - 1分 = 内容不合格，需要重写
   - 2分 = 内容较差，需要大幅改进
   - 3分 = 内容一般，需要优化
   - 4分 = 内容良好，有小幅改进空间
   - 5分 = 大厂级内容，几乎无需修改

3. **优化建议**：给出不超过3条具体、可执行的优化建议

4. **大厂写法示例**：根据当前字段类型，提供一段高质量的大厂级写法示例

5. **追问问题**：如果信息不足，提出2-3个追问问题（Ask-back），帮助用户补充关键信息

请以JSON格式返回结果：
{
  "score": 1-5的整数,
  "compliance": {
    "isTooShort": true/false,
    "isTooSimple": true/false,
    "lackTechDepth": true/false,
    "lackMetrics": true/false,
    "lackBusinessValue": true/false
  },
  "suggestions": ["建议1", "建议2", "建议3"],
  "example": "大厂级写法示例文本",
  "questions": ["追问问题1", "追问问题2", "追问问题3"]
}

请确保返回的是有效的JSON格式，不要包含其他说明文字。`

  return basePrompt
}

// 分析简历字段内容
export const AnalyzeResumeField = async (fieldType, content, fieldName = '') => {
  try {
    const prompt = GenerateAnalysisPrompt(fieldType, content, fieldName)
    
    const messages = [
      {
        role: 'system',
        content: '你是一个专业的简历审核专家，擅长分析简历内容质量并提供优化建议。请严格按照要求返回JSON格式的结果。'
      },
      {
        role: 'user',
        content: prompt
      }
    ]

    const response = await CallLLM(messages, {
      temperature: 0.3, // 降低温度以获得更一致的结果
      maxTokens: 1500
    })

    const result = ParseJSONResponse(response.content)
    
    if (!result) {
      throw new Error('无法解析AI返回的结果')
    }

    // 验证结果格式
    if (typeof result.score !== 'number' || result.score < 1 || result.score > 5) {
      result.score = 3 // 默认值
    }

    return {
      score: result.score,
      compliance: result.compliance || {},
      suggestions: result.suggestions || [],
      example: result.example || '',
      questions: result.questions || []
    }
  } catch (error) {
    console.error('分析简历字段失败:', error)
    throw error
  }
}

// 生成最终简历
export const GenerateFinalResume = async (resumeData) => {
  try {
    const prompt = `你是一个专业的简历优化专家。请根据用户提供的简历数据，生成一份符合互联网大厂招聘标准的最终简历。

简历数据：
${JSON.stringify(resumeData, null, 2)}

要求：
1. 自动优化措辞，使用专业、客观、量化的语言
2. 强调业务价值 → 技术方案 → 结果指标三段式结构
3. 避免流水账和口语化表达
4. 提升技术深度（架构、链路、组件、指标）
5. 信息密度高，节奏快
6. 保持每个部分信息完整且专业

请以Markdown格式输出最终简历，包含所有必要的部分：
- 个人信息
- 专业标签
- 个人优势
- 教育背景
- 工作经历
- 项目经历
- 荣誉证书

请直接输出优化后的简历内容，不要包含额外的说明文字。`

    const messages = [
      {
        role: 'system',
        content: '你是一个专业的简历优化专家，擅长将普通简历优化为大厂级简历。请直接输出优化后的简历内容。'
      },
      {
        role: 'user',
        content: prompt
      }
    ]

    const response = await CallLLM(messages, {
      temperature: 0.5,
      maxTokens: 3000
    })

    return response.content
  } catch (error) {
    console.error('生成最终简历失败:', error)
    throw error
  }
}

// 生成字段引导提示
export const GenerateFieldGuidance = async (fieldType) => {
  const fieldNames = {
    personalInfo: '个人信息',
    tags: '专业标签',
    advantages: '个人优势',
    education: '教育背景',
    workExperiences: '工作经历',
    projects: '项目经历',
    honors: '荣誉证书'
  }

  const prompt = `请为"${fieldNames[fieldType] || fieldType}"字段提供填写指导：

1. 说明这个字段的作用和重要性
2. 提供填写要点（不超过5条）
3. 给出一个优秀示例

请以简洁、清晰的方式输出，不要使用JSON格式。`

  try {
    const messages = [
      {
        role: 'system',
        content: '你是一个专业的简历指导专家，擅长引导用户填写简历各个字段。'
      },
      {
        role: 'user',
        content: prompt
      }
    ]

    const response = await CallLLM(messages, {
      temperature: 0.5,
      maxTokens: 800
    })

    return response.content
  } catch (error) {
    console.error('生成字段指导失败:', error)
    throw error
  }
}

// 一键优化内容
export const OptimizeContent = async (fieldType, content) => {
  const fieldNames = {
    personalInfo: '个人信息',
    tags: '专业标签',
    advantages: '个人优势',
    education: '教育背景',
    workExperiences: '工作经历',
    projects: '项目经历',
    honors: '荣誉证书'
  }

  const prompt = `你是一个专业的简历优化专家。请优化以下简历内容，使其符合互联网大厂招聘标准。

字段类型：${fieldNames[fieldType] || fieldType}

原始内容：
${content || '（空）'}

优化要求：
1. 保持原意，只优化表达方式
2. 使用专业、客观、量化的语言
3. 强调业务价值 → 技术方案 → 结果指标
4. 避免流水账和口语化
5. 提升技术深度和信息密度
6. 如果内容为空或过短，请基于字段类型生成一个高质量的示例

请直接输出优化后的内容，不要包含额外的说明文字。如果原内容为空，请生成一个符合该字段类型的优秀示例。`

  try {
    const messages = [
      {
        role: 'system',
        content: '你是一个专业的简历优化专家，擅长将普通简历优化为大厂级简历。请直接输出优化后的内容。'
      },
      {
        role: 'user',
        content: prompt
      }
    ]

    const response = await CallLLM(messages, {
      temperature: 0.5,
      maxTokens: 2000
    })

    return response.content.trim()
  } catch (error) {
    console.error('优化内容失败:', error)
    throw error
  }
}

// 逐句改写建议
export const GetSentenceRewriteSuggestions = async (fieldType, content) => {
  const fieldNames = {
    personalInfo: '个人信息',
    tags: '专业标签',
    advantages: '个人优势',
    education: '教育背景',
    workExperiences: '工作经历',
    projects: '项目经历',
    honors: '荣誉证书'
  }

  const prompt = `你是一个专业的简历优化专家。请分析以下简历内容，为每个句子或段落提供改写建议。

字段类型：${fieldNames[fieldType] || fieldType}

原始内容：
${content || '（空）'}

请按照以下JSON格式返回结果：
{
  "suggestions": [
    {
      "original": "原始句子或段落",
      "optimized": "优化后的版本",
      "reason": "优化原因（简短说明）"
    }
  ]
}

要求：
1. 将内容拆分为有意义的句子或段落
2. 为每个部分提供优化版本
3. 优化原因要简洁明了（不超过20字）
4. 保持原意，只优化表达

请确保返回的是有效的JSON格式。`

  try {
    const messages = [
      {
        role: 'system',
        content: '你是一个专业的简历优化专家。请严格按照要求返回JSON格式的结果。'
      },
      {
        role: 'user',
        content: prompt
      }
    ]

    const response = await CallLLM(messages, {
      temperature: 0.4,
      maxTokens: 2000
    })

    const result = ParseJSONResponse(response.content)
    
    if (!result || !result.suggestions) {
      throw new Error('无法解析改写建议')
    }

    return result.suggestions
  } catch (error) {
    console.error('获取改写建议失败:', error)
    throw error
  }
}

// 提取关键词和建议补充
export const ExtractKeywordsAndSuggest = async (fieldType, content) => {
  const fieldNames = {
    personalInfo: '个人信息',
    tags: '专业标签',
    advantages: '个人优势',
    education: '教育背景',
    workExperiences: '工作经历',
    projects: '项目经历',
    honors: '荣誉证书'
  }

  const prompt = `你是一个专业的简历分析专家。请分析以下简历内容，提取关键词并建议补充。

字段类型：${fieldNames[fieldType] || fieldType}

原始内容：
${content || '（空）'}

请按照以下JSON格式返回结果：
{
  "extractedKeywords": ["关键词1", "关键词2", "关键词3"],
  "suggestedKeywords": ["建议补充的关键词1", "建议补充的关键词2"],
  "missingMetrics": ["建议添加的量化指标1", "建议添加的量化指标2"],
  "improvementTips": ["改进建议1", "改进建议2"]
}

要求：
1. 提取内容中的核心关键词（技术栈、工具、方法等）
2. 根据字段类型和行业标准，建议补充缺失的关键词
3. 如果缺少量化指标，建议添加具体的数字指标
4. 提供2-3条具体的改进建议

请确保返回的是有效的JSON格式。`

  try {
    const messages = [
      {
        role: 'system',
        content: '你是一个专业的简历分析专家。请严格按照要求返回JSON格式的结果。'
      },
      {
        role: 'user',
        content: prompt
      }
    ]

    const response = await CallLLM(messages, {
      temperature: 0.3,
      maxTokens: 1500
    })

    const result = ParseJSONResponse(response.content)
    
    if (!result) {
      throw new Error('无法解析关键词建议')
    }

    return {
      extractedKeywords: result.extractedKeywords || [],
      suggestedKeywords: result.suggestedKeywords || [],
      missingMetrics: result.missingMetrics || [],
      improvementTips: result.improvementTips || []
    }
  } catch (error) {
    console.error('提取关键词失败:', error)
    throw error
  }
}

// 获取模板库
export const GetTemplates = async (fieldType, industry = '互联网') => {
  const fieldNames = {
    personalInfo: '个人信息',
    tags: '专业标签',
    advantages: '个人优势',
    education: '教育背景',
    workExperiences: '工作经历',
    projects: '项目经历',
    honors: '荣誉证书'
  }

  const prompt = `你是一个专业的简历模板专家。请为以下字段类型提供3-5个不同场景的高质量模板示例。

字段类型：${fieldNames[fieldType] || fieldType}
行业：${industry}

请按照以下JSON格式返回结果：
{
  "templates": [
    {
      "name": "模板名称（如：高级工程师模板）",
      "content": "模板内容",
      "scenario": "适用场景说明"
    }
  ]
}

要求：
1. 每个模板都要是高质量的大厂级示例
2. 模板要符合不同经验水平和岗位类型
3. 场景说明要清晰（如：3年经验后端工程师、应届生前端工程师等）

请确保返回的是有效的JSON格式。`

  try {
    const messages = [
      {
        role: 'system',
        content: '你是一个专业的简历模板专家。请严格按照要求返回JSON格式的结果。'
      },
      {
        role: 'user',
        content: prompt
      }
    ]

    const response = await CallLLM(messages, {
      temperature: 0.6,
      maxTokens: 2000
    })

    const result = ParseJSONResponse(response.content)
    
    if (!result || !result.templates) {
      throw new Error('无法解析模板数据')
    }

    return result.templates
  } catch (error) {
    console.error('获取模板失败:', error)
    throw error
  }
}

