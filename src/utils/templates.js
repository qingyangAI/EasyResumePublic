import { GetDefaultResumeData, GenerateId } from './resumeData'

// 岗位模板配置
export const JobTemplates = {
  // 技术类
  'frontend-engineer': {
    name: '前端开发工程师',
    category: '技术',
    description: '适合前端开发、全栈开发等岗位',
    data: () => ({
      ...GetDefaultResumeData(),
      personalInfo: {
        ...GetDefaultResumeData().personalInfo,
        title: '前端开发工程师'
      },
      tags: ['Vue.js', 'React', 'TypeScript', 'Node.js', 'Webpack', 'Vite'],
      reusableCapabilities: [
        '熟练掌握Vue.js、React等主流前端框架，具备丰富的前端开发经验',
        '精通JavaScript、TypeScript，熟悉ES6+新特性',
        '熟悉前端工程化工具链，如Webpack、Vite、Rollup等',
        '具备良好的代码规范和团队协作能力'
      ],
      careerObjective: '寻求前端开发工程师职位，期望在技术深度和团队协作方面有更大突破',
      advantages: [
        '丰富的前端开发经验，参与过多个大型项目',
        '熟悉前端性能优化，有丰富的优化实践经验',
        '具备良好的学习能力和问题解决能力'
      ]
    })
  },
  'backend-engineer': {
    name: '后端开发工程师',
    category: '技术',
    description: '适合后端开发、服务端开发等岗位',
    data: () => ({
      ...GetDefaultResumeData(),
      personalInfo: {
        ...GetDefaultResumeData().personalInfo,
        title: '后端开发工程师'
      },
      tags: ['Java', 'Spring Boot', 'MySQL', 'Redis', '微服务', '分布式'],
      reusableCapabilities: [
        '熟练掌握Java、Python等后端开发语言',
        '熟悉Spring Boot、Django等主流框架',
        '具备数据库设计和优化能力',
        '熟悉分布式系统和微服务架构'
      ],
      careerObjective: '寻求后端开发工程师职位，期望在系统架构和技术深度方面有更大突破',
      advantages: [
        '丰富的后端开发经验，熟悉高并发系统设计',
        '具备良好的系统设计和问题解决能力',
        '熟悉分布式系统架构和微服务实践'
      ]
    })
  },
  'fullstack-engineer': {
    name: '全栈开发工程师',
    category: '技术',
    description: '适合全栈开发、全端开发等岗位',
    data: () => ({
      ...GetDefaultResumeData(),
      personalInfo: {
        ...GetDefaultResumeData().personalInfo,
        title: '全栈开发工程师'
      },
      tags: ['Vue.js', 'React', 'Node.js', 'Python', 'MySQL', 'MongoDB'],
      reusableCapabilities: [
        '熟练掌握前后端开发技术栈',
        '熟悉前端框架和后端框架',
        '具备全栈项目开发经验',
        '熟悉数据库设计和API设计'
      ],
      careerObjective: '寻求全栈开发工程师职位，期望在技术广度和深度方面有更大突破',
      advantages: [
        '具备前后端全栈开发能力',
        '熟悉完整的项目开发流程',
        '具备良好的技术视野和问题解决能力'
      ]
    })
  },
  'mobile-engineer': {
    name: '移动端开发工程师',
    category: '技术',
    description: '适合iOS开发、Android开发、移动端开发等岗位',
    data: () => ({
      ...GetDefaultResumeData(),
      personalInfo: {
        ...GetDefaultResumeData().personalInfo,
        title: '移动端开发工程师'
      },
      tags: ['iOS', 'Android', 'React Native', 'Flutter', 'Swift', 'Kotlin'],
      reusableCapabilities: [
        '熟练掌握iOS/Android原生开发',
        '熟悉React Native、Flutter等跨平台框架',
        '具备移动端性能优化经验',
        '熟悉移动端UI/UX设计规范'
      ],
      careerObjective: '寻求移动端开发工程师职位，期望在移动端技术深度方面有更大突破',
      advantages: [
        '丰富的移动端开发经验',
        '熟悉移动端性能优化和用户体验优化',
        '具备跨平台开发能力'
      ]
    })
  },
  'devops-engineer': {
    name: 'DevOps工程师',
    category: '技术',
    description: '适合DevOps、运维开发、SRE等岗位',
    data: () => ({
      ...GetDefaultResumeData(),
      personalInfo: {
        ...GetDefaultResumeData().personalInfo,
        title: 'DevOps工程师'
      },
      tags: ['Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Linux', '云原生'],
      reusableCapabilities: [
        '熟练掌握Docker、Kubernetes等容器化技术',
        '熟悉CI/CD流程设计和实施',
        '具备自动化运维和监控能力',
        '熟悉云原生架构和微服务部署'
      ],
      careerObjective: '寻求DevOps工程师职位，期望在自动化运维和云原生技术方面有更大突破',
      advantages: [
        '丰富的DevOps实践经验',
        '熟悉云原生技术和容器化部署',
        '具备自动化运维和问题排查能力'
      ]
    })
  },
  'data-engineer': {
    name: '数据工程师',
    category: '技术',
    description: '适合数据开发、大数据工程师等岗位',
    data: () => ({
      ...GetDefaultResumeData(),
      personalInfo: {
        ...GetDefaultResumeData().personalInfo,
        title: '数据工程师'
      },
      tags: ['Python', 'Spark', 'Hadoop', 'SQL', '数据仓库', 'ETL'],
      reusableCapabilities: [
        '熟练掌握Python、SQL等数据处理语言',
        '熟悉Spark、Hadoop等大数据技术栈',
        '具备数据仓库设计和ETL开发经验',
        '熟悉数据分析和数据挖掘'
      ],
      careerObjective: '寻求数据工程师职位，期望在数据技术深度和业务理解方面有更大突破',
      advantages: [
        '丰富的数据处理和分析经验',
        '熟悉大数据技术栈和数据仓库设计',
        '具备良好的数据思维和业务理解能力'
      ]
    })
  },
  'ai-engineer': {
    name: 'AI算法工程师',
    category: '技术',
    description: '适合机器学习、深度学习、算法工程师等岗位',
    data: () => ({
      ...GetDefaultResumeData(),
      personalInfo: {
        ...GetDefaultResumeData().personalInfo,
        title: 'AI算法工程师'
      },
      tags: ['Python', 'TensorFlow', 'PyTorch', '机器学习', '深度学习', 'NLP'],
      reusableCapabilities: [
        '熟练掌握Python和主流深度学习框架',
        '熟悉机器学习、深度学习算法原理',
        '具备模型训练和优化经验',
        '熟悉NLP、CV等AI应用领域'
      ],
      careerObjective: '寻求AI算法工程师职位，期望在算法研究和应用方面有更大突破',
      advantages: [
        '丰富的AI算法研究和应用经验',
        '熟悉主流深度学习框架和算法',
        '具备良好的数学基础和算法能力'
      ]
    })
  },
  'test-engineer': {
    name: '测试工程师',
    category: '技术',
    description: '适合测试开发、QA、自动化测试等岗位',
    data: () => ({
      ...GetDefaultResumeData(),
      personalInfo: {
        ...GetDefaultResumeData().personalInfo,
        title: '测试工程师'
      },
      tags: ['自动化测试', 'Selenium', 'Python', '测试框架', '性能测试', '接口测试'],
      reusableCapabilities: [
        '熟练掌握自动化测试框架和工具',
        '熟悉测试用例设计和测试流程',
        '具备性能测试和接口测试经验',
        '熟悉CI/CD集成测试'
      ],
      careerObjective: '寻求测试工程师职位，期望在测试技术和质量保障方面有更大突破',
      advantages: [
        '丰富的测试经验和质量保障能力',
        '熟悉自动化测试和测试工具',
        '具备良好的问题分析和定位能力'
      ]
    })
  },
  
  // 产品类
  'product-manager': {
    name: '产品经理',
    category: '产品',
    description: '适合产品经理、高级产品经理等岗位',
    data: () => ({
      ...GetDefaultResumeData(),
      personalInfo: {
        ...GetDefaultResumeData().personalInfo,
        title: '产品经理'
      },
      tags: ['产品设计', '用户体验', '数据分析', '项目管理', '敏捷开发', '用户研究'],
      reusableCapabilities: [
        '丰富的产品经理经验，熟悉B端和C端产品设计',
        '精通用户研究、需求分析、产品规划等核心技能',
        '具备良好的数据分析和商业思维',
        '熟悉敏捷开发流程，有丰富的跨部门协作经验'
      ],
      careerObjective: '寻求产品经理职位，期望在战略规划和团队管理方面有更大发展',
      advantages: [
        '丰富的产品经验，从0到1打造过成功产品',
        '具备敏锐的市场洞察力和用户需求分析能力',
        '有丰富的跨部门协作和项目管理经验'
      ]
    })
  },
  'product-designer': {
    name: '产品设计师',
    category: '产品',
    description: '适合UI/UX设计师、交互设计师等岗位',
    data: () => ({
      ...GetDefaultResumeData(),
      personalInfo: {
        ...GetDefaultResumeData().personalInfo,
        title: '产品设计师'
      },
      tags: ['UI设计', 'UX设计', '交互设计', 'Figma', 'Sketch', '用户研究'],
      reusableCapabilities: [
        '熟练掌握UI/UX设计工具和方法',
        '熟悉用户研究和交互设计流程',
        '具备良好的视觉设计和用户体验能力',
        '熟悉设计规范和前端协作流程'
      ],
      careerObjective: '寻求产品设计师职位，期望在设计深度和用户体验方面有更大突破',
      advantages: [
        '丰富的产品设计经验',
        '熟悉用户研究和设计方法论',
        '具备良好的视觉表达和沟通能力'
      ]
    })
  },
  
  // 运营类
  'operation-manager': {
    name: '运营经理',
    category: '运营',
    description: '适合运营经理、运营专员、用户运营等岗位',
    data: () => ({
      ...GetDefaultResumeData(),
      personalInfo: {
        ...GetDefaultResumeData().personalInfo,
        title: '运营经理'
      },
      tags: ['用户运营', '内容运营', '活动运营', '数据分析', '增长黑客', '社群运营'],
      reusableCapabilities: [
        '丰富的运营经验，熟悉用户运营、内容运营等',
        '具备数据分析和运营策略制定能力',
        '熟悉增长黑客和用户增长方法论',
        '有丰富的活动策划和执行经验'
      ],
      careerObjective: '寻求运营经理职位，期望在运营策略和用户增长方面有更大突破',
      advantages: [
        '丰富的运营实战经验',
        '熟悉用户增长和运营方法论',
        '具备良好的数据分析和策略制定能力'
      ]
    })
  },
  'marketing-manager': {
    name: '市场经理',
    category: '运营',
    description: '适合市场经理、市场专员、品牌营销等岗位',
    data: () => ({
      ...GetDefaultResumeData(),
      personalInfo: {
        ...GetDefaultResumeData().personalInfo,
        title: '市场经理'
      },
      tags: ['品牌营销', '市场推广', '数字营销', 'SEO', 'SEM', '社交媒体'],
      reusableCapabilities: [
        '丰富的市场营销经验，熟悉品牌营销和数字营销',
        '具备市场分析和营销策略制定能力',
        '熟悉SEO、SEM等数字营销渠道',
        '有丰富的营销活动策划和执行经验'
      ],
      careerObjective: '寻求市场经理职位，期望在品牌建设和市场拓展方面有更大突破',
      advantages: [
        '丰富的市场营销实战经验',
        '熟悉数字营销和品牌建设方法论',
        '具备良好的市场洞察和策略制定能力'
      ]
    })
  },
  
  // 设计类
  'ui-designer': {
    name: 'UI设计师',
    category: '设计',
    description: '适合UI设计师、视觉设计师等岗位',
    data: () => ({
      ...GetDefaultResumeData(),
      personalInfo: {
        ...GetDefaultResumeData().personalInfo,
        title: 'UI设计师'
      },
      tags: ['UI设计', '视觉设计', 'Figma', 'Sketch', 'Adobe XD', '设计规范'],
      reusableCapabilities: [
        '熟练掌握UI设计工具和设计规范',
        '熟悉视觉设计和品牌设计',
        '具备良好的设计审美和创意能力',
        '熟悉前端协作和设计交付流程'
      ],
      careerObjective: '寻求UI设计师职位，期望在设计深度和视觉表达方面有更大突破',
      advantages: [
        '丰富的UI设计经验',
        '熟悉设计规范和设计系统',
        '具备良好的视觉表达和沟通能力'
      ]
    })
  },
  'graphic-designer': {
    name: '平面设计师',
    category: '设计',
    description: '适合平面设计师、视觉设计师等岗位',
    data: () => ({
      ...GetDefaultResumeData(),
      personalInfo: {
        ...GetDefaultResumeData().personalInfo,
        title: '平面设计师'
      },
      tags: ['平面设计', '品牌设计', '海报设计', 'Adobe Photoshop', 'Illustrator', 'InDesign'],
      reusableCapabilities: [
        '熟练掌握平面设计软件和设计技能',
        '熟悉品牌设计和视觉传达',
        '具备良好的设计审美和创意能力',
        '熟悉印刷工艺和设计规范'
      ],
      careerObjective: '寻求平面设计师职位，期望在设计深度和创意表达方面有更大突破',
      advantages: [
        '丰富的平面设计经验',
        '熟悉品牌设计和视觉传达',
        '具备良好的设计审美和创意能力'
      ]
    })
  },
  
  // 管理类
  'project-manager': {
    name: '项目经理',
    category: '管理',
    description: '适合项目经理、项目专员等岗位',
    data: () => ({
      ...GetDefaultResumeData(),
      personalInfo: {
        ...GetDefaultResumeData().personalInfo,
        title: '项目经理'
      },
      tags: ['项目管理', '敏捷开发', 'Scrum', '团队管理', '风险控制', '沟通协调'],
      reusableCapabilities: [
        '丰富的项目管理经验，熟悉敏捷开发流程',
        '具备项目规划、执行和风险控制能力',
        '熟悉团队管理和跨部门协作',
        '有丰富的项目交付和问题解决经验'
      ],
      careerObjective: '寻求项目经理职位，期望在项目管理和团队领导方面有更大突破',
      advantages: [
        '丰富的项目管理实战经验',
        '熟悉敏捷开发和项目管理方法论',
        '具备良好的沟通协调和问题解决能力'
      ]
    })
  },
  'hr-manager': {
    name: 'HR经理',
    category: '管理',
    description: '适合HR经理、人力资源专员、招聘专员等岗位',
    data: () => ({
      ...GetDefaultResumeData(),
      personalInfo: {
        ...GetDefaultResumeData().personalInfo,
        title: 'HR经理'
      },
      tags: ['招聘', '培训', '绩效管理', '员工关系', 'HRIS', '组织发展'],
      reusableCapabilities: [
        '丰富的HR管理经验，熟悉招聘、培训等模块',
        '具备人力资源规划和人才发展能力',
        '熟悉绩效管理和员工关系管理',
        '有丰富的组织发展和文化建设经验'
      ],
      careerObjective: '寻求HR经理职位，期望在人才发展和组织建设方面有更大突破',
      advantages: [
        '丰富的HR管理实战经验',
        '熟悉人力资源管理和人才发展方法论',
        '具备良好的沟通协调和问题解决能力'
      ]
    })
  },
  
  // 销售类
  'sales-manager': {
    name: '销售经理',
    category: '销售',
    description: '适合销售经理、销售专员、客户经理等岗位',
    data: () => ({
      ...GetDefaultResumeData(),
      personalInfo: {
        ...GetDefaultResumeData().personalInfo,
        title: '销售经理'
      },
      tags: ['客户开发', '销售管理', '商务谈判', '客户关系', '销售策略', '业绩达成'],
      reusableCapabilities: [
        '丰富的销售经验，熟悉客户开发和销售流程',
        '具备销售策略制定和商务谈判能力',
        '熟悉客户关系管理和销售管理',
        '有丰富的业绩达成和团队管理经验'
      ],
      careerObjective: '寻求销售经理职位，期望在销售业绩和团队管理方面有更大突破',
      advantages: [
        '丰富的销售实战经验',
        '熟悉销售管理和客户关系管理',
        '具备良好的沟通协调和商务谈判能力'
      ]
    })
  },
  'bd-manager': {
    name: '商务拓展经理',
    category: '销售',
    description: '适合BD经理、商务拓展专员等岗位',
    data: () => ({
      ...GetDefaultResumeData(),
      personalInfo: {
        ...GetDefaultResumeData().personalInfo,
        title: '商务拓展经理'
      },
      tags: ['商务拓展', '渠道合作', '战略合作', '商务谈判', '市场拓展', '合作伙伴'],
      reusableCapabilities: [
        '丰富的BD经验，熟悉商务拓展和渠道合作',
        '具备战略合作和商务谈判能力',
        '熟悉市场拓展和合作伙伴管理',
        '有丰富的合作项目落地经验'
      ],
      careerObjective: '寻求商务拓展经理职位，期望在战略合作和市场拓展方面有更大突破',
      advantages: [
        '丰富的BD实战经验',
        '熟悉商务拓展和渠道合作方法论',
        '具备良好的沟通协调和商务谈判能力'
      ]
    })
  },
  
  // 财务类
  'finance-manager': {
    name: '财务经理',
    category: '财务',
    description: '适合财务经理、财务专员、会计等岗位',
    data: () => ({
      ...GetDefaultResumeData(),
      personalInfo: {
        ...GetDefaultResumeData().personalInfo,
        title: '财务经理'
      },
      tags: ['财务管理', '会计核算', '财务分析', '预算管理', '税务筹划', '内控管理'],
      reusableCapabilities: [
        '丰富的财务管理经验，熟悉会计核算和财务分析',
        '具备预算管理和财务规划能力',
        '熟悉税务筹划和内控管理',
        '有丰富的财务报告和决策支持经验'
      ],
      careerObjective: '寻求财务经理职位，期望在财务管理和决策支持方面有更大突破',
      advantages: [
        '丰富的财务管理实战经验',
        '熟悉财务管理和会计核算',
        '具备良好的财务分析和决策支持能力'
      ]
    })
  },
  
  // 咨询类
  'consultant': {
    name: '咨询顾问',
    category: '咨询',
    description: '适合咨询顾问、管理咨询等岗位',
    data: () => ({
      ...GetDefaultResumeData(),
      personalInfo: {
        ...GetDefaultResumeData().personalInfo,
        title: '咨询顾问'
      },
      tags: ['管理咨询', '战略咨询', '业务分析', '解决方案', '客户沟通', '项目管理'],
      reusableCapabilities: [
        '丰富的咨询经验，熟悉管理咨询和战略咨询',
        '具备业务分析和解决方案设计能力',
        '熟悉客户沟通和项目管理',
        '有丰富的咨询项目交付经验'
      ],
      careerObjective: '寻求咨询顾问职位，期望在咨询深度和客户服务方面有更大突破',
      advantages: [
        '丰富的咨询实战经验',
        '熟悉咨询方法论和业务分析',
        '具备良好的沟通协调和问题解决能力'
      ]
    })
  },
  
  // 其他
  'empty': {
    name: '空白简历',
    category: '其他',
    description: '创建空白简历，自由填写',
    data: () => GetDefaultResumeData()
  }
}

// 按分类组织模板
export const TemplatesByCategory = {
  '技术': ['frontend-engineer', 'backend-engineer', 'fullstack-engineer', 'mobile-engineer', 'devops-engineer', 'data-engineer', 'ai-engineer', 'test-engineer'],
  '产品': ['product-manager', 'product-designer'],
  '运营': ['operation-manager', 'marketing-manager'],
  '设计': ['ui-designer', 'graphic-designer'],
  '管理': ['project-manager', 'hr-manager'],
  '销售': ['sales-manager', 'bd-manager'],
  '财务': ['finance-manager'],
  '咨询': ['consultant'],
  '其他': ['empty']
}

// 创建模板简历
export const CreateTemplateResume = (templateKey) => {
  const template = JobTemplates[templateKey]
  if (!template) {
    return null
  }
  
  return {
    id: GenerateId(),
    name: template.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isTemplate: false,
    data: template.data()
  }
}

// 获取所有模板
export const GetAllTemplates = () => {
  return Object.entries(JobTemplates).map(([key, template]) => ({
    key,
    ...template
  }))
}

// 按分类获取模板
export const GetTemplatesByCategory = () => {
  return Object.entries(TemplatesByCategory).map(([category, keys]) => ({
    category,
    templates: keys.map(key => ({
      key,
      ...JobTemplates[key]
    }))
  }))
}

