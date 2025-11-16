export const GetDefaultResumeData = () => ({
  personalInfo: {
    name: '林清扬',
    title: '高级后端 / AI 数据工程师',
    phone: '153-xxxx-xxxx',
    email: 'xxxx@163.com',
    age: '27岁',
    blog: 'linqingyang.com',
    github: 'github.com/qingyang1807',
    targetCity: '北京',
    works: [
      { name: '作品1', url: 'work.qingyang.ai' },
      { name: '作品2', url: 'data.qingyang.ai' },
      { name: '作品3', url: 'chatbi.qingyang.ai' }
    ]
  },
  tags: ['Java 后端', 'AI 数据工程', 'RAG & Agent', 'DataOps', '本体语义工程', '大模型微调', '分布式系统'],
  advantages: [''],
  honors: [
    'AI全栈开发毕业证书〔2025〕',
    '大模型RAG进阶毕业证书〔2025〕',
    '企业级Agent开发毕业证书〔2024〕',
    'AI大模型技能认证〔2024〕',
    '高级大数据分析师〔2024〕',
    '企业年度优秀二等奖〔2024〕',
    '中级软件设计师〔2018〕',
    '国家励志奖学金 * 2〔2018-2019〕',
    '学院专业奖学金 * 3〔2017-2019〕'
  ],
  workExperiences: [
    {
      company: '北京xx技有限公司',
      companyType: '创业公司',
      position: 'Java开发工程师',
      period: '2025.9-2025.11',
      achievements: [
        '基于创业团队想法和新产品诉求，梳理战略方向、需求、用户画像、产品形态，组建带头团队，完成立项书编写、用户访谈、业务问题收集、业务可行性验证、功能清单&流程梳理、技术选型、数分Agent从0-1交付。'
      ],
      responsibilities: [
        '负责基于Ontology本体的数据分析Agent核心引擎开发和后端服务开发。',
        '负责业务验证、用户访谈、Ontology本体研究、架构设计、技术选型、方案编写、Agent搭建、测试部署。'
      ]
    },
    {
      company: '北京xx信息技术股份有限公司',
      companyType: '上市企业',
      position: '高级工程师',
      period: '2020.06-2025.07',
      reportTo: '虚线老板+实线部门总经理',
      subordinates: '4人',
      promotionPath: '实习生→助理工程师→工程师→高级工程师→产品/技术负责人',
      achievements: [
        'AI数据处理平台，公司级交付部门前1%',
        '获得2024年公司级年度优秀交付物二等奖（3000人仅5人获得），并在年会上实时直播表彰；',
        '公司级AI应用、数据培训、大数据分析师直播3场，上架企业内训课程给技术+业务3000人认证；',
        '设计输出AI数据集构建方案、采集、清洗、标注、增强、合成、评估方法论、自动智能化数据处理管线。',
        '搭建AI全链路数据处理管线，通过工作流、Agent、智能批量标注等工具链研发，实现数据集构建自动化，数据标注/合成自动化，提效200%，高效支撑了DeepSeek R1模型训练和10+AI场景数据集支撑。',
        '牵头制作500+数据集，用于LLM模型预训练、微调和知识库问答，涉及工单旅游等领域50W+数据。',
        '牵头研发多模态数据处理，涉及文本、图像、音视频处理，OCR、音频截取、whisper转文字、视频抽帧。',
        '开发19+ AI RAG+Agent应用，获得2024公司级年度优秀交付物三等奖（10/3000）',
        '合同结构化提取、制度定位问答、知识库问答、面试助手、售前售后电商专业客服、意图识别助手、文档生成、周报生成、代码生成、小红书爆款文案生成、智能客服、旅行行程规划、天气助手、AI 行政助理、医疗诊断、参数提取，建设3省文旅AI场景应用（行程规划助手）和数据集，入选政府数字化转型案例。',
        '数据治理平台、数据中台平台功能开发，支撑公司销售签约客户3000w+RMB'
      ],
      responsibilities: [
        'AI数据处理平台：负责AI数据处理平台架构设计与规范制定，研发全链路自动化管线，优化数据集构建与流转效率。',
        'AI场景落地与应用研发：牵头AI场景需求分析与RAG+Agent应用研发，推动文旅、医疗、金融、电商等行业智能化落地。'
      ]
    }
  ],
  projects: [
    {
      name: 'Ontology-driven Enterprise Insight Engine（企业本体驱动的分析引擎）',
      period: '2025.09 - 2025.11',
      role: '架构设计 & 主负责人',
      description: [
        '负责搭建公司级"企业语义中枢（Ontology + Agent）"，统一知识库、订阅、订单、用户行为、模型调用日志等多源业务数据语义，为智能分析提供统一语义层。主导设计"角色实体—业务事件—状态流转"三层企业本体，将原本割裂的表结构抽象为可推理语义图谱（40+ 实体、120+ 属性），支撑跨业务链路（留存、收入、订阅结构、模型使用）的可解释分析。',
        '提出"数据饱和度评分（Data Saturation Score）"，以字段覆盖度、关系密度、实体映射等指标量化业务的可建模程度，并在 ≥60% 时自动触发本体构建流程，形成标准化、自动化的数据建模机制。构建多层智能体体系，包括 Ontology Builder（自动抽取实体/关系）、Ontology QA（基于本体的可解释问答）、Business Insight Agent（主动洞察与异常识别）、Data Query Agent（生成精确 SQL / Cypher），实现从手写 SQL 向自然语言主动分析的能力跃迁。',
        '设计语义级上下文压缩、多轮本体增量更新、本体子图分片加载等机制，显著降低大模型幻觉，提升复杂业务问答的一致性与可复现性。最终交付可运行的 Ontology + Agent 企业大脑 Demo，可自动解析数据库结构生成初版本体，并支持不同角色（老板、运营、产品、研发）获得定制化洞察。',
        '技术栈：LangGraph、CrewAI、Milvus、Python、FastAPI、MySQL、PDF/Doc Parser、React + TailwindCSS、ReactFlow、Nacos、Redis、Kafka'
      ]
    },
    {
      name: 'AI DataOps Processing Platform（AI数据处理平台）',
      period: '2023.06 – 2025.07',
      role: '技术负责人',
      description: [
        '负责公司 AI 数据生产体系的整体建设，主导从数据采集、清洗、标注、增强、合成到评估的全链路平台化设计，构建可规模化生产高质量训练数据的数据基础设施。主导平台架构、核心模块开发、LLM 接入、团队技术路线规划，以及与业务、标注、模型训练侧的跨部门协作。',
        '构建统一的数据处理工作流（DAG）与智能数据管线，支持结构化、文本、图片、音频、视频、代码等多模态数据的自动化处理；基于 LLM 实现数据清洗、标准化、指令标注、风格增强、数据合成等能力，使数据供给效率提升约 3 倍。研发问答式 Agent 数据处理链路，实现任务自动拆解、规则选择以及增强策略调度，平台智能化配置能力提升 80%。',
        '支撑公司内部 300+ AI 场景、500+ 数据集、百万级数据量产出，覆盖文旅、客服、政务、运营商等行业；输出 200+ 套文旅大模型数据集，用于 LLM 微调与知识库问答。参与部署并微调 ChatGLM4-9B、Whisper、PaddleOCR 等开源模型，满足多模态场景的数据生成与解析需求；使用 LoRA 在 ChatGLM4-9B 上微调广告生成模型，解决场景风格统一性问题。',
        '主导 DeepSeek R1 思考模型的数据构建工程，包含 SFT 监督数据、思维链数据、冷启动数据、RL 强化学习数据等 100+ 数据集（50W+ 样本），支撑公司内部蒸馏与微调实验。',
        '技术栈：Java、Python、SpringCloud、MySQL、Redis、Kafka、FastAPI、LangChain、RagFlow、Agent、Milvus、Whisper、FFmpeg、PaddleOCR、PyTorch、Docker、微调/预训练链路'
      ]
    },
    {
      name: 'Enterprise Data Middle Platform（数据中台）',
      period: '2022.08 – 2023.06',
      role: '后端开发工程师',
      description: [
        '参与公司数据中台建设，负责底层框架研发、数据治理能力集成及前后端分离架构重构，实现数据资产管理、业务主题构建、监控预警与治理流程的统一承载。将数据治理平台（数据标准、模型设计、数据资产管理、文档管理）深度集成至中台体系，形成统一的数据资产目录与资产地图，提高资产可发现性与跨部门复用效率。',
        '主导资产地图搜索能力、资产健康度检测、实时异常监控与短信/飞书预警模块的开发，实现资产可用性提升约 200%，并获得客户书面表扬。参与数据标准规范建设、主题模型设计、资产血缘与影响分析等治理能力优化，提升了治理体系的结构化和自动化程度。',
        '负责前后端拆分改造（Vue+ElementUI），承担数据标准管理、资产地图、模型设计等模块的需求分析、页面设计、后端接口实现、部署上线、客户对接等全流程工作；引入 DevOps 流水线，实现 CI/CD 自动化部署。',
        '技术栈：Java、SpringBoot、SpringCloud、MySQL、Redis、Kafka、Nacos、MyBatis、Nginx、HDFS、Hive、HBase、Flume、Spark、Grafana、Prometheus、Vue、Node.js、Webpack、Element-UI、ELK'
      ]
    },
    {
      name: 'Enterprise Data Governance Platform（数据治理平台）',
      period: '2020.06 – 2022.08',
      role: '后端开发工程师',
      description: [
        '参与构建集团级全生命周期数据治理平台，覆盖元数据管理、数据标准、血缘分析、数据质量、安全管控、资产地图与数据运营等核心模块，支撑金融、运营商等行业客户的数据管理体系标准化与数字化转型。推动元数据与业务系统深度打通，构建统一数据标准体系及可视化血缘分析能力，实现任务追溯与数据链路透明化。',
        '主导字段级血缘追踪、资产检索优化与敏感数据识别扫描等核心功能建设，使资产可发现性提升 80%+，敏感数据合规扫描达标率达到 100%，显著增强企业数安能力。研发系统级自动化报告生成模块（覆盖 100+ 指标），替代人工撰写 PPT/Word 报表流程，提高客户决策效率约 2 倍。推动平台在 10+ 省市运营商部署落地，并获得多地客户书面表扬。',
        '负责核心模块开发、测试、部署、性能优化、安全监测与运维工作；参与元数据规范制定、数据质量规则配置、资产地图建设等治理流程，保障平台稳定交付与客户使用落地。',
        '技术栈：Java、SpringBoot、MyBatis、Redis、Kafka、Nacos、MySQL、Oracle、GBase、GreenPlum、ClickHouse、Doris、Elasticsearch、Hive、HBase、HDFS、Zookeeper、Docker、Vue、Echarts、mxGraph'
      ]
    }
  ],
  education: {
    school: '吉首大学',
    level: '（一本 | 双一流）',
    period: '2016年9月 — 2020年6月',
    major: '软件工程',
    degree: '本科',
    achievements: [
      '担任3年班长，组织策划多项集体活动，获得组织管理能力。',
      '担任3年校区主持人，主持多场校内外大型活动，获得了优秀的沟通表达能力、临场应变能力和主持能力。',
      '担任2年国旗班升旗手，获得强大的自律能力、乐观心态和健康的身体素质。'
    ]
  }
})

export const SaveResumeData = (data) => {
  try {
    localStorage.setItem('resumeData', JSON.stringify(data))
  } catch (error) {
    console.error('保存简历数据失败:', error)
  }
}

export const LoadResumeData = () => {
  try {
    const saved = localStorage.getItem('resumeData')
    return saved ? JSON.parse(saved) : null
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

