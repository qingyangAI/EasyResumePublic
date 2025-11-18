import * as XLSX from 'xlsx'

// 日期格式化函数
export const FormatDate = (period, dateFormat = 'dot') => {
  if (!period) return ''
  
  // 检查是否已经是目标格式
  if (dateFormat === 'dot') {
    // 检查是否是 dot 格式：2025.09 - 2025.11
    if (/^\d{4}\.\d{2}\s*[-—]\s*\d{4}\.\d{2}$/.test(period)) {
      return period
    }
  } else {
    // 检查是否是中文格式：2025年09月 — 2025年11月 或 2025年09月 — 至今
    if (/^\d{4}年\d{1,2}月\s*[-—]\s*(\d{4}年\d{1,2}月|至今)$/.test(period)) {
      return period
    }
  }
  
  // 解析中文格式：2025年09月 — 2025年11月 或 2025年9月 — 至今
  const chineseMatch = period.match(/(\d{4})年(\d{1,2})月\s*[-—]\s*(至今|(\d{4})年(\d{1,2})月)/)
  if (chineseMatch) {
    const startYear = chineseMatch[1]
    const startMonth = String(chineseMatch[2]).padStart(2, '0')
    const isPresent = chineseMatch[3] === '至今'
    
    if (dateFormat === 'dot') {
      if (isPresent) {
        const now = new Date()
        const endYear = now.getFullYear()
        const endMonth = String(now.getMonth() + 1).padStart(2, '0')
        return `${startYear}.${startMonth} - ${endYear}.${endMonth}`
      } else {
        const endYear = chineseMatch[4]
        const endMonth = String(chineseMatch[5]).padStart(2, '0')
        return `${startYear}.${startMonth} - ${endYear}.${endMonth}`
      }
    } else {
      // chinese format
      if (isPresent) {
        return `${startYear}年${parseInt(startMonth)}月 — 至今`
      } else {
        const endYear = chineseMatch[4]
        const endMonth = parseInt(chineseMatch[5])
        return `${startYear}年${parseInt(startMonth)}月 — ${endYear}年${endMonth}月`
      }
    }
  }
  
  // 解析点格式：2025.09 - 2025.11
  const dotMatch = period.match(/(\d{4})\.(\d{2})\s*[-—]\s*(\d{4})\.(\d{2})/)
  if (dotMatch) {
    const startYear = dotMatch[1]
    const startMonth = parseInt(dotMatch[2])
    const endYear = dotMatch[3]
    const endMonth = parseInt(dotMatch[4])
    
    if (dateFormat === 'chinese') {
      // 检查是否是当前日期，如果是则显示"至今"
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1
      if (parseInt(endYear) === currentYear && parseInt(endMonth) === currentMonth) {
        return `${startYear}年${startMonth}月 — 至今`
      }
      return `${startYear}年${startMonth}月 — ${endYear}年${endMonth}月`
    } else {
      return `${startYear}.${dotMatch[2]} - ${endYear}.${dotMatch[4]}`
    }
  }
  
  // 如果无法解析，返回原值
  return period
}

export const GetDefaultResumeData = () => ({
  personalInfo: {
    name: '',
    title: '',
    phone: '',
    email: '',
    age: '',
    blog: '',
    github: '',
    targetCity: '',
    works: []
  },
  sectionOrder: ['tags', 'reusableCapabilities', 'careerObjective', 'advantages', 'education', 'workExperiences', 'honors', 'projects'],
  tags: [],
  reusableCapabilities: [],
  careerObjective: '',
  advantages: [],
  honors: [],
  workExperiences: [],
  projects: [],
  education: {
    school: '',
    level: '',
    period: '',
    major: '',
    degree: '',
    duration: null,
    startYear: null,
    startMonth: null,
    endYear: null,
    endMonth: null,
    achievements: []
  }
})

// 生成唯一ID
export const GenerateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 获取模板简历1：前端开发工程师
export const GetTemplateResume1 = () => ({
  id: GenerateId(),
  name: '模板1：前端开发工程师',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isTemplate: true,
  data: {
    personalInfo: {
      name: '张三',
      title: '高级前端开发工程师',
      phone: '138-0000-0000',
      email: 'zhangsan@example.com',
      age: '28',
      blog: 'https://blog.example.com',
      github: 'https://github.com/zhangsan',
      targetCity: '北京',
      works: [
        { name: '个人作品集', url: 'https://portfolio.example.com' },
        { name: '开源项目', url: 'https://github.com/zhangsan/project' }
      ]
    },
    sectionOrder: ['tags', 'reusableCapabilities', 'careerObjective', 'advantages', 'education', 'workExperiences', 'honors', 'projects'],
    tags: ['Vue.js', 'React', 'TypeScript', 'Node.js', 'Webpack', 'Vite'],
    reusableCapabilities: [
      '熟练掌握Vue.js、React等主流前端框架，具备5年前端开发经验',
      '精通JavaScript、TypeScript，熟悉ES6+新特性',
      '熟悉前端工程化工具链，如Webpack、Vite、Rollup等',
      '具备良好的代码规范和团队协作能力'
    ],
    careerObjective: '寻求高级前端开发工程师职位，期望在技术深度和团队协作方面有更大突破',
    advantages: [
      '5年前端开发经验，参与过多个大型项目',
      '熟悉前端性能优化，有丰富的优化实践经验',
      '具备良好的学习能力和问题解决能力',
      '有团队管理经验，曾带领3人小团队完成项目'
    ],
    honors: [
      '2023年度优秀员工',
      '2022年公司技术分享会最佳分享奖',
      '2021年开源项目贡献奖'
    ],
    workExperiences: [
      {
        company: 'XX科技有限公司',
        companyType: '互联网',
        position: '高级前端开发工程师',
        period: '2021.03 - 至今',
        reportTo: '技术总监',
        subordinates: '3人',
        promotionPath: '前端开发工程师 → 高级前端开发工程师',
        achievements: [
          '负责公司核心产品的前端架构设计和开发，提升系统性能30%',
          '主导前端工程化改造，将构建时间从5分钟缩短至1分钟',
          '建立前端代码规范和最佳实践，提升团队开发效率',
          '完成3个大型项目的从0到1开发，累计用户量超过100万'
        ],
        responsibilities: [
          '负责前端技术选型和架构设计',
          '参与产品需求评审，提供技术方案',
          '指导初级开发人员，进行代码审查',
          '优化前端性能，提升用户体验'
        ]
      },
      {
        company: 'YY互联网公司',
        companyType: '互联网',
        position: '前端开发工程师',
        period: '2019.06 - 2021.02',
        reportTo: '前端负责人',
        subordinates: '',
        promotionPath: '初级前端开发工程师 → 前端开发工程师',
        achievements: [
          '参与公司主要产品的前端开发，负责核心模块实现',
          '优化页面加载速度，首屏加载时间减少40%',
          '完成移动端适配，支持多设备访问'
        ],
        responsibilities: [
          '根据UI设计稿完成页面开发',
          '与后端协作完成接口对接',
          '修复线上bug，保证系统稳定运行'
        ]
      }
    ],
    projects: [
      {
        name: '企业级管理系统',
        period: '2022.01 - 2022.06',
        role: '前端负责人',
        description: [
          '基于Vue3 + TypeScript开发的企业级管理系统，支持多租户、权限管理等复杂业务场景',
          '采用微前端架构，实现模块化开发和独立部署',
          '集成数据可视化组件，提供丰富的图表展示功能',
          '项目上线后获得客户一致好评，为公司带来500万+订单'
        ]
      },
      {
        name: '移动端H5应用',
        period: '2021.08 - 2021.12',
        role: '核心开发',
        description: [
          '使用React Native开发的跨平台移动应用，支持iOS和Android',
          '实现复杂的动画效果和交互体验，提升用户满意度',
          '优化应用性能，启动时间缩短50%',
          '累计下载量超过50万次'
        ]
      }
    ],
    education: {
      school: 'XX大学',
      level: '本科',
      period: '2015.09 - 2019.06',
      major: '计算机科学与技术',
      degree: '学士',
      duration: 4,
      startYear: 2015,
      startMonth: 9,
      endYear: 2019,
      endMonth: 6,
      achievements: [
        '连续三年获得校级奖学金',
        '参与大学生创新创业项目，获得省级奖项',
        '担任计算机协会技术部部长'
      ]
    }
  }
})

// 获取模板简历2：产品经理
export const GetTemplateResume2 = () => ({
  id: GenerateId(),
  name: '模板2：产品经理',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isTemplate: true,
  data: {
    personalInfo: {
      name: '李四',
      title: '高级产品经理',
      phone: '139-0000-0000',
      email: 'lisi@example.com',
      age: '30',
      blog: 'https://pm-blog.example.com',
      github: '',
      targetCity: '上海',
      works: [
        { name: '产品设计作品', url: 'https://design.example.com' }
      ]
    },
    sectionOrder: ['tags', 'reusableCapabilities', 'careerObjective', 'advantages', 'education', 'workExperiences', 'honors', 'projects'],
    tags: ['产品设计', '用户体验', '数据分析', '项目管理', '敏捷开发', '用户研究'],
    reusableCapabilities: [
      '6年产品经理经验，熟悉B端和C端产品设计',
      '精通用户研究、需求分析、产品规划等核心技能',
      '具备良好的数据分析和商业思维',
      '熟悉敏捷开发流程，有丰富的跨部门协作经验'
    ],
    careerObjective: '寻求高级产品经理或产品总监职位，期望在战略规划和团队管理方面有更大发展',
    advantages: [
      '6年产品经验，从0到1打造过3款成功产品',
      '具备敏锐的市场洞察力和用户需求分析能力',
      '有丰富的跨部门协作和项目管理经验',
      '熟悉数据驱动产品迭代的方法论'
    ],
    honors: [
      '2023年公司年度最佳产品奖',
      '2022年优秀产品经理',
      '2021年产品创新奖'
    ],
    workExperiences: [
      {
        company: 'AA互联网公司',
        companyType: '互联网',
        position: '高级产品经理',
        period: '2020.05 - 至今',
        reportTo: '产品总监',
        subordinates: '5人',
        promotionPath: '产品经理 → 高级产品经理',
        achievements: [
          '负责公司核心产品的产品规划和迭代，产品DAU从10万增长至100万',
          '主导产品重构项目，提升用户留存率40%',
          '建立产品数据指标体系，实现数据驱动产品迭代',
          '完成3个重要功能模块的设计和上线，获得用户好评'
        ],
        responsibilities: [
          '负责产品规划和需求分析',
          '输出PRD文档，与设计、开发团队协作',
          '跟踪产品数据，分析用户行为',
          '管理产品团队，指导初级产品经理'
        ]
      },
      {
        company: 'BB科技公司',
        companyType: '互联网',
        position: '产品经理',
        period: '2018.03 - 2020.04',
        reportTo: '产品负责人',
        subordinates: '',
        promotionPath: '产品助理 → 产品经理',
        achievements: [
          '负责移动端产品设计和迭代，用户满意度提升30%',
          '完成用户调研，输出用户画像和需求分析报告',
          '参与产品战略规划，提出多个有价值的建议'
        ],
        responsibilities: [
          '收集和分析用户需求',
          '设计产品功能和交互流程',
          '跟进产品开发进度，确保按时上线',
          '分析产品数据，提出优化建议'
        ]
      }
    ],
    projects: [
      {
        name: '企业SaaS平台',
        period: '2021.01 - 2022.06',
        role: '产品负责人',
        description: [
          '从0到1设计并上线企业级SaaS平台，涵盖CRM、项目管理、协作等核心功能',
          '通过深度用户调研，准确把握企业用户痛点，产品上线6个月获得1000+企业客户',
          '建立完善的产品运营体系，客户续费率超过80%',
          '产品获得行业认可，获得多项产品创新奖项'
        ]
      },
      {
        name: '移动端社交应用',
        period: '2019.06 - 2020.12',
        role: '核心产品',
        description: [
          '负责移动端社交应用的核心功能设计和迭代',
          '通过A/B测试优化产品功能，用户活跃度提升50%',
          '设计创新的社交玩法，获得用户好评',
          '应用累计用户量超过500万'
        ]
      }
    ],
    education: {
      school: 'XX大学',
      level: '本科',
      period: '2014.09 - 2018.06',
      major: '信息管理与信息系统',
      degree: '学士',
      duration: 4,
      startYear: 2014,
      startMonth: 9,
      endYear: 2018,
      endMonth: 6,
      achievements: [
        '获得优秀毕业生称号',
        '参与大学生创业项目，获得国家级奖项',
        '担任学生会副主席，组织多次大型活动'
      ]
    }
  }
})

// 获取模板简历3：Java后端开发工程师
export const GetTemplateResume3 = () => ({
  id: GenerateId(),
  name: '模板3：Java后端开发工程师',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isTemplate: true,
  data: {
    personalInfo: {
      name: '王五',
      title: '高级Java开发工程师',
      phone: '137-0000-0000',
      email: 'wangwu@example.com',
      age: '29',
      blog: '',
      github: 'https://github.com/wangwu',
      targetCity: '深圳',
      works: []
    },
    sectionOrder: ['tags', 'reusableCapabilities', 'careerObjective', 'advantages', 'education', 'workExperiences', 'honors', 'projects'],
    tags: ['Java', 'Spring Boot', '微服务', 'MySQL', 'Redis', 'Kafka', 'Docker', 'Kubernetes'],
    reusableCapabilities: [
      '7年Java后端开发经验，精通Spring Boot、Spring Cloud等框架',
      '熟悉微服务架构设计，有丰富的分布式系统开发经验',
      '精通MySQL、Redis等数据库，具备数据库优化能力',
      '熟悉消息队列、缓存、分布式锁等中间件使用'
    ],
    careerObjective: '寻求高级Java开发工程师或技术专家职位，期望在技术深度和架构设计方面有更大突破',
    advantages: [
      '7年后端开发经验，参与过多个高并发系统设计',
      '熟悉分布式系统架构，有丰富的性能优化经验',
      '具备良好的代码质量和系统设计能力',
      '有技术团队管理经验，曾负责技术方案评审'
    ],
    honors: [
      '2023年技术专家称号',
      '2022年最佳技术贡献奖',
      '2021年优秀技术分享奖'
    ],
    workExperiences: [
      {
        company: 'CC互联网公司',
        companyType: '互联网',
        position: '高级Java开发工程师',
        period: '2020.08 - 至今',
        reportTo: '技术总监',
        subordinates: '4人',
        promotionPath: 'Java开发工程师 → 高级Java开发工程师',
        achievements: [
          '负责核心业务系统架构设计和开发，系统QPS从1万提升至10万',
          '主导微服务架构改造，将单体应用拆分为20+微服务',
          '优化数据库性能，查询响应时间减少60%',
          '设计并实现分布式缓存方案，缓存命中率达到95%'
        ],
        responsibilities: [
          '负责核心业务模块的设计和开发',
          '参与技术方案评审，指导团队技术选型',
          '优化系统性能，解决高并发场景下的技术难题',
          '指导初级开发人员，进行代码审查和技术分享'
        ]
      },
      {
        company: 'DD科技公司',
        companyType: '互联网',
        position: 'Java开发工程师',
        period: '2017.07 - 2020.07',
        reportTo: '技术负责人',
        subordinates: '',
        promotionPath: '初级Java开发工程师 → Java开发工程师',
        achievements: [
          '参与公司主要业务系统的开发，负责核心功能实现',
          '优化SQL查询，数据库性能提升50%',
          '完成系统重构，代码可维护性大幅提升'
        ],
        responsibilities: [
          '根据需求完成业务功能开发',
          '与前端协作完成接口对接',
          '维护和优化现有系统，修复线上问题'
        ]
      }
    ],
    projects: [
      {
        name: '高并发电商系统',
        period: '2021.03 - 2022.09',
        role: '核心开发',
        description: [
          '参与高并发电商系统的设计和开发，支持秒杀、抢购等高并发场景',
          '采用分布式架构，使用Redis缓存、消息队列等技术，系统峰值QPS达到10万+',
          '设计分布式锁和限流方案，保证系统稳定性',
          '系统上线后稳定运行，支持了多次大型促销活动'
        ]
      },
      {
        name: '微服务架构改造',
        period: '2020.10 - 2021.08',
        role: '技术负责人',
        description: [
          '主导公司核心系统的微服务架构改造，将单体应用拆分为多个微服务',
          '使用Spring Cloud构建微服务框架，实现服务注册、配置中心、网关等功能',
          '建立完善的监控和日志体系，提升系统可观测性',
          '改造后系统可扩展性和可维护性大幅提升，支持业务快速迭代'
        ]
      }
    ],
    education: {
      school: 'XX大学',
      level: '本科',
      period: '2013.09 - 2017.06',
      major: '软件工程',
      degree: '学士',
      duration: 4,
      startYear: 2013,
      startMonth: 9,
      endYear: 2017,
      endMonth: 6,
      achievements: [
        '获得国家励志奖学金',
        '参与ACM程序设计竞赛，获得省级二等奖',
        '完成多个课程设计项目，获得优秀评价'
      ]
    }
  }
})

// 简历列表管理
const RESUME_LIST_KEY = 'resumeList'
const CURRENT_RESUME_ID_KEY = 'currentResumeId'

// 获取所有简历列表
export const GetResumeList = () => {
  try {
    const saved = localStorage.getItem(RESUME_LIST_KEY)
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('加载简历列表失败:', error)
    return []
  }
}

// 保存简历列表
export const SaveResumeList = (list) => {
  try {
    localStorage.setItem(RESUME_LIST_KEY, JSON.stringify(list))
  } catch (error) {
    console.error('保存简历列表失败:', error)
  }
}

// 获取当前选中的简历ID
export const GetCurrentResumeId = () => {
  try {
    return localStorage.getItem(CURRENT_RESUME_ID_KEY) || null
  } catch (error) {
    console.error('获取当前简历ID失败:', error)
    return null
  }
}

// 保存当前选中的简历ID
export const SaveCurrentResumeId = (id) => {
  try {
    if (id) {
      localStorage.setItem(CURRENT_RESUME_ID_KEY, id)
    } else {
      localStorage.removeItem(CURRENT_RESUME_ID_KEY)
    }
  } catch (error) {
    console.error('保存当前简历ID失败:', error)
  }
}

// 根据ID获取简历
export const GetResumeById = (id) => {
  const list = GetResumeList()
  return list.find(resume => resume.id === id) || null
}

// 添加简历
export const AddResume = (resume) => {
  const list = GetResumeList()
  const newResume = {
    ...resume,
    id: resume.id || GenerateId(),
    createdAt: resume.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  list.push(newResume)
  SaveResumeList(list)
  return newResume
}

// 更新简历
export const UpdateResume = (id, data) => {
  const list = GetResumeList()
  const index = list.findIndex(resume => resume.id === id)
  if (index !== -1) {
    list[index] = {
      ...list[index],
      data: data,
      updatedAt: new Date().toISOString()
    }
    SaveResumeList(list)
    return list[index]
  }
  return null
}

// 更新简历名称
export const UpdateResumeName = (id, name) => {
  const list = GetResumeList()
  const index = list.findIndex(resume => resume.id === id)
  if (index !== -1) {
    list[index] = {
      ...list[index],
      name: name,
      updatedAt: new Date().toISOString()
    }
    SaveResumeList(list)
    return list[index]
  }
  return null
}

// 删除简历
export const DeleteResume = (id) => {
  const list = GetResumeList()
  const filtered = list.filter(resume => resume.id !== id)
  SaveResumeList(filtered)
  // 如果删除的是当前选中的简历，清除当前ID
  if (GetCurrentResumeId() === id) {
    SaveCurrentResumeId(null)
  }
  return filtered
}

// 复制简历
export const CopyResume = (id) => {
  const resume = GetResumeById(id)
  if (!resume) return null
  
  const newResume = {
    ...resume,
    id: GenerateId(),
    name: `${resume.name} (副本)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isTemplate: false,
    data: JSON.parse(JSON.stringify(resume.data)) // 深拷贝
  }
  
  const list = GetResumeList()
  const index = list.findIndex(r => r.id === id)
  if (index >= 0) {
    list.splice(index + 1, 0, newResume)
  } else {
    list.push(newResume)
  }
  SaveResumeList(list)
  return newResume
}

// 调整简历顺序
export const ReorderResume = (fromIndex, toIndex) => {
  const list = GetResumeList()
  if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) {
    return list
  }
  
  const [moved] = list.splice(fromIndex, 1)
  list.splice(toIndex, 0, moved)
  SaveResumeList(list)
  return list
}

// 排序简历列表
export const SortResumeList = (sortBy = 'updatedAt', order = 'desc') => {
  const list = GetResumeList()
  const sorted = [...list].sort((a, b) => {
    let aValue = a[sortBy]
    let bValue = b[sortBy]
    
    // 处理日期字符串
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = new Date(aValue || 0).getTime()
      bValue = new Date(bValue || 0).getTime()
    } else if (sortBy === 'name') {
      aValue = (aValue || '').toLowerCase()
      bValue = (bValue || '').toLowerCase()
    }
    
    if (order === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
    }
  })
  
  SaveResumeList(sorted)
  return sorted
}

// 清空所有简历
export const ClearAllResumes = () => {
  SaveResumeList([])
  SaveCurrentResumeId(null)
}

// 初始化模板简历（仅在首次使用时）
export const InitializeTemplates = () => {
  const list = GetResumeList()
  // 如果列表为空，添加3个模板
  if (list.length === 0) {
    const template1 = GetTemplateResume1()
    const template2 = GetTemplateResume2()
    const template3 = GetTemplateResume3()
    SaveResumeList([template1, template2, template3])
    return [template1, template2, template3]
  }
  return list
}

// 兼容旧版本的保存函数（已废弃，保留用于向后兼容）
export const SaveResumeData = (data) => {
  try {
    // 如果当前有选中的简历，更新它
    const currentId = GetCurrentResumeId()
    if (currentId) {
      UpdateResume(currentId, data)
    } else {
      // 否则保存到旧位置（向后兼容）
      localStorage.setItem('resumeData', JSON.stringify(data))
    }
  } catch (error) {
    console.error('保存简历数据失败:', error)
  }
}

// 兼容旧版本的加载函数（已废弃，保留用于向后兼容）
export const LoadResumeData = () => {
  try {
    // 优先从简历列表加载
    const currentId = GetCurrentResumeId()
    if (currentId) {
      const resume = GetResumeById(currentId)
      if (resume) {
        return resume.data
      }
    }
    // 如果没有选中的简历，尝试从旧位置加载（向后兼容）
    const saved = localStorage.getItem('resumeData')
    if (saved) {
      const oldData = JSON.parse(saved)
      // 迁移旧数据到新系统
      const newResume = AddResume({
        name: '我的简历',
        data: oldData,
        isTemplate: false
      })
      SaveCurrentResumeId(newResume.id)
      // 删除旧数据
      localStorage.removeItem('resumeData')
      return oldData
    }
    return null
  } catch (error) {
    console.error('加载简历数据失败:', error)
    return null
  }
}

export const SaveViewMode = (isPreview) => {
  try {
    localStorage.setItem('resumeViewMode', JSON.stringify(isPreview))
  } catch (error) {
    console.error('保存视图模式失败:', error)
  }
}

export const LoadViewMode = () => {
  try {
    const saved = localStorage.getItem('resumeViewMode')
    return saved ? JSON.parse(saved) : false
  } catch (error) {
    console.error('加载视图模式失败:', error)
    return false
  }
}

export const SavePrintSettings = (settings) => {
  try {
    localStorage.setItem('resumePrintSettings', JSON.stringify(settings))
  } catch (error) {
    console.error('保存打印设置失败:', error)
  }
}

export const LoadPrintSettings = () => {
  try {
    const saved = localStorage.getItem('resumePrintSettings')
    const defaultSettings = { 
      showPageNumber: false, 
      pageNumberPosition: 'bottom-center', 
      pageNumberFormat: 'number',
      fontFamily: 'inherit',
      pageNumberFontFamily: 'inherit'
    }
    if (saved) {
      const parsed = JSON.parse(saved)
      // 兼容旧设置，如果没有新字段，使用默认值
      return { ...defaultSettings, ...parsed }
    }
    return defaultSettings
  } catch (error) {
    console.error('加载打印设置失败:', error)
    return { 
      showPageNumber: false, 
      pageNumberPosition: 'bottom-center', 
      pageNumberFormat: 'number',
      fontFamily: 'inherit',
      pageNumberFontFamily: 'inherit'
    }
  }
}

export const SaveResumeStyle = (style) => {
  try {
    localStorage.setItem('resumeStyle', JSON.stringify(style))
  } catch (error) {
    console.error('保存简历样式失败:', error)
  }
}

export const LoadResumeStyle = () => {
  try {
    const saved = localStorage.getItem('resumeStyle')
    return saved ? JSON.parse(saved) : null
  } catch (error) {
    console.error('加载简历样式失败:', error)
    return null
  }
}

export const SaveFileNameTemplate = (template) => {
  try {
    localStorage.setItem('resumeFileNameTemplate', JSON.stringify(template))
  } catch (error) {
    console.error('保存文件名模板失败:', error)
  }
}

export const LoadFileNameTemplate = () => {
  try {
    const saved = localStorage.getItem('resumeFileNameTemplate')
    if (saved) {
      return JSON.parse(saved)
    }
    // 默认模板：姓名-职位-手机号
    return {
      template: '{name}-{title}-{phone}',
      customTemplate: ''
    }
  } catch (error) {
    console.error('加载文件名模板失败:', error)
    return {
      template: '{name}-{title}-{phone}',
      customTemplate: ''
    }
  }
}

// 面板位置配置
const PANEL_POSITION_KEY = 'resumePanelPosition'

// 保存面板位置配置
export const SavePanelPosition = (position) => {
  try {
    localStorage.setItem(PANEL_POSITION_KEY, JSON.stringify(position))
  } catch (error) {
    console.error('保存面板位置失败:', error)
  }
}

// 加载面板位置配置
export const LoadPanelPosition = () => {
  try {
    const saved = localStorage.getItem(PANEL_POSITION_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
    // 默认位置：左侧简历列表，右侧样式配置
    return {
      resumeListPosition: 'left',
      stylePanelPosition: 'right'
    }
  } catch (error) {
    console.error('加载面板位置失败:', error)
    return {
      resumeListPosition: 'left',
      stylePanelPosition: 'right'
    }
  }
}

// 根据模板和数据生成文件名（不含扩展名）
export const GenerateFileName = (data, fileExtension = '') => {
  const templateData = LoadFileNameTemplate()
  const template = templateData.customTemplate || templateData.template || '{name}-{title}-{phone}'
  
  // 获取个人信息
  const personalInfo = data?.personalInfo || {}
  const name = (personalInfo.name || '').trim() || '姓名'
  const title = (personalInfo.title || '').trim() || '职位'
  const phone = (personalInfo.phone || '').trim() || '手机号'
  const email = (personalInfo.email || '').trim() || '邮箱'
  const age = (personalInfo.age || '').trim() || '年龄'
  const targetCity = (personalInfo.targetCity || '').trim() || '目标城市'
  
  // 替换模板变量
  let fileName = template
    .replace(/\{name\}/g, name)
    .replace(/\{title\}/g, title)
    .replace(/\{phone\}/g, phone)
    .replace(/\{email\}/g, email)
    .replace(/\{age\}/g, age)
    .replace(/\{targetCity\}/g, targetCity)
  
  // 清理文件名中的非法字符
  fileName = fileName.replace(/[<>:"/\\|?*]/g, '-').replace(/\s+/g, '-')
  
  // 如果文件名为空或只包含占位符，使用默认名称
  if (!fileName || fileName === '姓名-职位-手机号' || fileName.match(/^[\s-]+$/)) {
    fileName = `resume`
  }
  
  // 添加时间戳：年月日时分秒
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`
  
  // 在文件名末尾添加时间戳
  fileName = `${fileName}-${timestamp}`
  
  // 添加扩展名
  if (fileExtension) {
    fileName = `${fileName}.${fileExtension}`
  }
  
  return fileName
}

export const ExportResumeJSON = (data) => {
  try {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = GenerateFileName(data, 'json')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    return true
  } catch (error) {
    console.error('导出JSON失败:', error)
    return false
  }
}

export const ImportResumeJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        resolve(data)
      } catch (error) {
        reject(new Error('JSON格式错误，请检查文件内容'))
      }
    }
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    reader.readAsText(file)
  })
}

export const DownloadExcelTemplate = async () => {
  try {
    const workbook = XLSX.utils.book_new()
    if (!workbook) {
      throw new Error('创建工作簿失败')
    }
    
    const personalInfoSheet = [
      ['字段', '值'],
      ['姓名', ''],
      ['职位', ''],
      ['电话', ''],
      ['邮箱', ''],
      ['年龄', ''],
      ['博客', ''],
      ['GitHub', ''],
      ['目标城市', '']
    ]
    
    const worksSheet = [
      ['作品名称', '作品链接'],
      ['', '']
    ]
    
    const tagsSheet = [
      ['专业标签（每行一个）'],
      ['']
    ]
    
    const reusableCapabilitiesSheet = [
      ['可复用能力（每行一个）'],
      ['']
    ]
    
    const careerObjectiveSheet = [
      ['求职目标（一句话）'],
      ['']
    ]
    
    const advantagesSheet = [
      ['个人优势（每行一个）'],
      ['']
    ]
    
    const honorsSheet = [
      ['荣誉证书（每行一个）'],
      ['']
    ]
    
    const workExpSheet = [
      ['公司名称', '公司类型', '职位', '工作期间', '汇报对象', '下属人数', '晋升路径'],
      ['', '', '', '', '', '', '']
    ]
    
    const workAchievementsSheet = [
      ['工作经历序号（从1开始）', '工作业绩（每行一个）'],
      ['1', '']
    ]
    
    const workResponsibilitiesSheet = [
      ['工作经历序号（从1开始）', '工作内容（每行一个）'],
      ['1', '']
    ]
    
    const projectsSheet = [
      ['项目名称', '项目期间', '担任角色'],
      ['', '', '']
    ]
    
    const projectDescSheet = [
      ['项目序号（从1开始）', '项目描述（每行一个）'],
      ['1', '']
    ]
    
    const educationSheet = [
      ['字段', '值'],
      ['学校名称', ''],
      ['学校级别', ''],
      ['就读期间', ''],
      ['专业', ''],
      ['学历', ''],
      ['学制（年）', '']
    ]
    
    const educationAchievementsSheet = [
      ['在校成就（每行一个）'],
      ['']
    ]
    
    try {
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(personalInfoSheet), '个人信息')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(worksSheet), '作品集')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(tagsSheet), '专业标签')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(reusableCapabilitiesSheet), '可复用能力')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(careerObjectiveSheet), '求职目标')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(advantagesSheet), '个人优势')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(honorsSheet), '荣誉证书')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(workExpSheet), '工作经历')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(workAchievementsSheet), '工作业绩')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(workResponsibilitiesSheet), '工作内容')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(projectsSheet), '项目经历')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(projectDescSheet), '项目描述')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(educationSheet), '教育背景')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(educationAchievementsSheet), '在校成就')
    } catch (sheetError) {
      console.error('添加工作表失败:', sheetError)
      throw new Error('创建工作表失败: ' + sheetError.message)
    }
    
    try {
      XLSX.writeFile(workbook, 'resume-template.xlsx')
      return true
    } catch (writeError) {
      console.error('写入文件失败:', writeError)
      throw new Error('保存文件失败: ' + writeError.message)
    }
  } catch (error) {
    console.error('下载Excel模板失败:', error)
    return false
  }
}

export const ExportResumeExcel = async (data) => {
  try {
    const workbook = XLSX.utils.book_new()
    if (!workbook) {
      throw new Error('创建工作簿失败')
    }
    
    const personalInfoSheet = [
      ['字段', '值'],
      ['姓名', data.personalInfo?.name || ''],
      ['职位', data.personalInfo?.title || ''],
      ['电话', data.personalInfo?.phone || ''],
      ['邮箱', data.personalInfo?.email || ''],
      ['年龄', data.personalInfo?.age || ''],
      ['博客', data.personalInfo?.blog || ''],
      ['GitHub', data.personalInfo?.github || ''],
      ['目标城市', data.personalInfo?.targetCity || '']
    ]
    
    const worksSheet = [['作品名称', '作品链接']]
    if (data.personalInfo?.works) {
      data.personalInfo.works.forEach(work => {
        worksSheet.push([work.name || '', work.url || ''])
      })
    }
    if (worksSheet.length === 1) worksSheet.push(['', ''])
    
    const tagsSheet = [['专业标签（每行一个）']]
    if (data.tags && data.tags.length > 0) {
      data.tags.forEach(tag => tagsSheet.push([tag]))
    } else {
      tagsSheet.push([''])
    }
    
    const reusableCapabilitiesSheet = [['可复用能力（每行一个）']]
    if (data.reusableCapabilities && data.reusableCapabilities.length > 0) {
      data.reusableCapabilities.forEach(cap => reusableCapabilitiesSheet.push([cap]))
    } else {
      reusableCapabilitiesSheet.push([''])
    }
    
    const careerObjectiveSheet = [['求职目标（一句话）']]
    if (data.careerObjective && data.careerObjective.trim()) {
      careerObjectiveSheet.push([data.careerObjective])
    } else {
      careerObjectiveSheet.push([''])
    }
    
    const advantagesSheet = [['个人优势（每行一个）']]
    if (data.advantages && data.advantages.length > 0) {
      data.advantages.forEach(adv => advantagesSheet.push([adv]))
    } else {
      advantagesSheet.push([''])
    }
    
    const honorsSheet = [['荣誉证书（每行一个）']]
    if (data.honors && data.honors.length > 0) {
      data.honors.forEach(honor => honorsSheet.push([honor]))
    } else {
      honorsSheet.push([''])
    }
    
    const workExpSheet = [['公司名称', '公司类型', '职位', '工作期间', '汇报对象', '下属人数', '晋升路径']]
    if (data.workExperiences && data.workExperiences.length > 0) {
      data.workExperiences.forEach(exp => {
        workExpSheet.push([
          exp.company || '',
          exp.companyType || '',
          exp.position || '',
          exp.period || '',
          exp.reportTo || '',
          exp.subordinates || '',
          exp.promotionPath || ''
        ])
      })
    } else {
      workExpSheet.push(['', '', '', '', '', '', ''])
    }
    
    const workAchievementsSheet = [['工作经历序号（从1开始）', '工作业绩（每行一个）']]
    if (data.workExperiences && data.workExperiences.length > 0) {
      data.workExperiences.forEach((exp, index) => {
        if (exp.achievements && exp.achievements.length > 0) {
          exp.achievements.forEach(ach => {
            workAchievementsSheet.push([index + 1, ach])
          })
        }
      })
    }
    if (workAchievementsSheet.length === 1) workAchievementsSheet.push(['1', ''])
    
    const workResponsibilitiesSheet = [['工作经历序号（从1开始）', '工作内容（每行一个）']]
    if (data.workExperiences && data.workExperiences.length > 0) {
      data.workExperiences.forEach((exp, index) => {
        if (exp.responsibilities && exp.responsibilities.length > 0) {
          exp.responsibilities.forEach(resp => {
            workResponsibilitiesSheet.push([index + 1, resp])
          })
        }
      })
    }
    if (workResponsibilitiesSheet.length === 1) workResponsibilitiesSheet.push(['1', ''])
    
    const projectsSheet = [['项目名称', '项目期间', '担任角色']]
    if (data.projects && data.projects.length > 0) {
      data.projects.forEach(project => {
        projectsSheet.push([
          project.name || '',
          project.period || '',
          project.role || ''
        ])
      })
    } else {
      projectsSheet.push(['', '', ''])
    }
    
    const projectDescSheet = [['项目序号（从1开始）', '项目描述（每行一个）']]
    if (data.projects && data.projects.length > 0) {
      data.projects.forEach((project, index) => {
        if (project.description && project.description.length > 0) {
          project.description.forEach(desc => {
            projectDescSheet.push([index + 1, desc])
          })
        }
      })
    }
    if (projectDescSheet.length === 1) projectDescSheet.push(['1', ''])
    
    const educationSheet = [
      ['字段', '值'],
      ['学校名称', data.education?.school || ''],
      ['学校级别', data.education?.level || ''],
      ['就读期间', data.education?.period || ''],
      ['专业', data.education?.major || ''],
      ['学历', data.education?.degree || ''],
      ['学制（年）', data.education?.duration || '']
    ]
    
    const educationAchievementsSheet = [['在校成就（每行一个）']]
    if (data.education?.achievements && data.education.achievements.length > 0) {
      data.education.achievements.forEach(ach => {
        educationAchievementsSheet.push([ach])
      })
    } else {
      educationAchievementsSheet.push([''])
    }
    
    try {
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(personalInfoSheet), '个人信息')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(worksSheet), '作品集')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(tagsSheet), '专业标签')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(reusableCapabilitiesSheet), '可复用能力')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(careerObjectiveSheet), '求职目标')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(advantagesSheet), '个人优势')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(honorsSheet), '荣誉证书')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(workExpSheet), '工作经历')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(workAchievementsSheet), '工作业绩')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(workResponsibilitiesSheet), '工作内容')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(projectsSheet), '项目经历')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(projectDescSheet), '项目描述')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(educationSheet), '教育背景')
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(educationAchievementsSheet), '在校成就')
    } catch (sheetError) {
      console.error('添加工作表失败:', sheetError)
      throw new Error('创建工作表失败: ' + sheetError.message)
    }
    
    try {
      XLSX.writeFile(workbook, GenerateFileName(data, 'xlsx'))
      return true
    } catch (writeError) {
      console.error('写入文件失败:', writeError)
      throw new Error('保存文件失败: ' + writeError.message)
    }
  } catch (error) {
    console.error('导出Excel失败:', error)
    return false
  }
}

export const ImportResumeExcel = (file) => {
  return new Promise(async (resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        
        const result = GetDefaultResumeData()
        
        const getSheetData = (sheetName) => {
          const sheet = workbook.Sheets[sheetName]
          return sheet ? XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) : []
        }
        
        const personalInfoData = getSheetData('个人信息')
        personalInfoData.forEach((row, index) => {
          if (index === 0) return
          const [field, value] = row
          if (field && value) {
            switch (field) {
              case '姓名': result.personalInfo.name = value; break
              case '职位': result.personalInfo.title = value; break
              case '电话': result.personalInfo.phone = value; break
              case '邮箱': result.personalInfo.email = value; break
              case '年龄': result.personalInfo.age = value; break
              case '博客': result.personalInfo.blog = value; break
              case 'GitHub': result.personalInfo.github = value; break
              case '目标城市': result.personalInfo.targetCity = value; break
            }
          }
        })
        
        const worksData = getSheetData('作品集')
        result.personalInfo.works = []
        worksData.forEach((row, index) => {
          if (index === 0) return
          const [name, url] = row
          if (name || url) {
            result.personalInfo.works.push({ name: name || '', url: url || '' })
          }
        })
        
        const tagsData = getSheetData('专业标签')
        result.tags = []
        tagsData.forEach((row, index) => {
          if (index === 0) return
          const [tag] = row
          if (tag) result.tags.push(tag)
        })
        
        const reusableCapabilitiesData = getSheetData('可复用能力')
        result.reusableCapabilities = []
        reusableCapabilitiesData.forEach((row, index) => {
          if (index === 0) return
          const [cap] = row
          if (cap) result.reusableCapabilities.push(cap)
        })
        
        const careerObjectiveData = getSheetData('求职目标')
        if (careerObjectiveData.length > 1 && careerObjectiveData[1] && careerObjectiveData[1][0]) {
          result.careerObjective = careerObjectiveData[1][0]
        } else {
          result.careerObjective = ''
        }
        
        const advantagesData = getSheetData('个人优势')
        result.advantages = []
        advantagesData.forEach((row, index) => {
          if (index === 0) return
          const [adv] = row
          if (adv) result.advantages.push(adv)
        })
        
        const honorsData = getSheetData('荣誉证书')
        result.honors = []
        honorsData.forEach((row, index) => {
          if (index === 0) return
          const [honor] = row
          if (honor) result.honors.push(honor)
        })
        
        const workExpData = getSheetData('工作经历')
        result.workExperiences = []
        workExpData.forEach((row, index) => {
          if (index === 0) return
          const [company, companyType, position, period, reportTo, subordinates, promotionPath] = row
          if (company || position) {
            result.workExperiences.push({
              company: company || '',
              companyType: companyType || '',
              position: position || '',
              period: period || '',
              reportTo: reportTo || '',
              subordinates: subordinates || '',
              promotionPath: promotionPath || '',
              achievements: [],
              responsibilities: []
            })
          }
        })
        
        const workAchievementsData = getSheetData('工作业绩')
        workAchievementsData.forEach((row, index) => {
          if (index === 0) return
          const [workIndex, achievement] = row
          if (workIndex && achievement) {
            const idx = parseInt(workIndex) - 1
            if (idx >= 0 && idx < result.workExperiences.length) {
              if (!result.workExperiences[idx].achievements) {
                result.workExperiences[idx].achievements = []
              }
              result.workExperiences[idx].achievements.push(achievement)
            }
          }
        })
        
        const workResponsibilitiesData = getSheetData('工作内容')
        workResponsibilitiesData.forEach((row, index) => {
          if (index === 0) return
          const [workIndex, responsibility] = row
          if (workIndex && responsibility) {
            const idx = parseInt(workIndex) - 1
            if (idx >= 0 && idx < result.workExperiences.length) {
              if (!result.workExperiences[idx].responsibilities) {
                result.workExperiences[idx].responsibilities = []
              }
              result.workExperiences[idx].responsibilities.push(responsibility)
            }
          }
        })
        
        const projectsData = getSheetData('项目经历')
        result.projects = []
        projectsData.forEach((row, index) => {
          if (index === 0) return
          const [name, period, role] = row
          if (name) {
            result.projects.push({
              name: name || '',
              period: period || '',
              role: role || '',
              description: []
            })
          }
        })
        
        const projectDescData = getSheetData('项目描述')
        projectDescData.forEach((row, index) => {
          if (index === 0) return
          const [projectIndex, desc] = row
          if (projectIndex && desc) {
            const idx = parseInt(projectIndex) - 1
            if (idx >= 0 && idx < result.projects.length) {
              if (!result.projects[idx].description) {
                result.projects[idx].description = []
              }
              result.projects[idx].description.push(desc)
            }
          }
        })
        
        const educationData = getSheetData('教育背景')
        educationData.forEach((row, index) => {
          if (index === 0) return
          const [field, value] = row
          if (field && value !== undefined && value !== '') {
            switch (field) {
              case '学校名称': result.education.school = value; break
              case '学校级别': result.education.level = value; break
              case '就读期间': result.education.period = value; break
              case '专业': result.education.major = value; break
              case '学历': result.education.degree = value; break
              case '学制（年）': result.education.duration = value ? parseInt(value) : null; break
            }
          }
        })
        
        const educationAchievementsData = getSheetData('在校成就')
        result.education.achievements = []
        educationAchievementsData.forEach((row, index) => {
          if (index === 0) return
          const [ach] = row
          if (ach) result.education.achievements.push(ach)
        })
        
        resolve(result)
      } catch (error) {
        reject(new Error('Excel格式错误，请检查文件内容'))
      }
    }
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    reader.readAsArrayBuffer(file)
  })
}

