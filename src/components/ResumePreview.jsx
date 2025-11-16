function ResumePreview({ data }) {
  return (
    <div id="resume-preview" className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto print:shadow-none print:p-0">
      <PersonalInfoSection data={data.personalInfo} />
      <TagsSection tags={data.tags} />
      {data.advantages && data.advantages.length > 0 && data.advantages.some(a => a && a.trim()) && (
        <AdvantagesSection advantages={data.advantages.filter(a => a && a.trim())} />
      )}
      <HonorsSection honors={data.honors} />
      <WorkExperiencesSection experiences={data.workExperiences} />
      <ProjectsSection projects={data.projects} />
      <EducationSection education={data.education} />
    </div>
  )
}

function PersonalInfoSection({ data }) {
  const infoItems = []
  
  if (data.phone && data.phone.trim()) {
    infoItems.push(`电话：${data.phone}`)
  }
  if (data.email && data.email.trim()) {
    infoItems.push(`邮箱：${data.email}`)
  }
  if (data.age && data.age.trim()) {
    infoItems.push(`年龄：${data.age}`)
  }
  if (data.blog && data.blog.trim()) {
    infoItems.push(`博客：${data.blog}`)
  }
  if (data.github && data.github.trim()) {
    infoItems.push(`github：${data.github}`)
  }
  if (data.targetCity && data.targetCity.trim()) {
    infoItems.push(`目标城市：${data.targetCity}`)
  }
  
  const works = data.works && data.works.length > 0 
    ? data.works.filter(w => w.name && w.url).map(w => `${w.name}：${w.url}`)
    : []
  
  const allItems = [...infoItems, ...works]
  
  const columns = [[], [], []]
  allItems.forEach((item, index) => {
    columns[index % 3].push(item)
  })
  
  const maxRows = Math.max(...columns.map(col => col.length))
  
  return (
    <div className="mb-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.name}</h1>
        <div className="text-lg text-gray-700 mb-2">{data.title}</div>
      </div>
      <div className="flex items-start justify-between gap-4 w-full">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex-1 space-y-1">
            {column.map((item, itemIndex) => (
              <div key={itemIndex} className="text-sm text-gray-600 text-left">{item}</div>
            ))}
          </div>
        ))}
      </div>
      <div className="border-b border-gray-300 my-4"></div>
    </div>
  )
}

function TagsSection({ tags }) {
  if (!tags || tags.length === 0) return null
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">专业标签</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span key={index} className="text-sm text-gray-700">
            {tag}{index < tags.length - 1 ? '｜' : ''}
          </span>
        ))}
      </div>
    </div>
  )
}

function AdvantagesSection({ advantages }) {
  if (!advantages || advantages.length === 0) return null
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">个人优势</h2>
      {advantages.map((advantage, index) => (
        <div key={index} className="text-sm text-gray-700 mb-1">
          {index + 1}、{advantage}
        </div>
      ))}
    </div>
  )
}

function HonorsSection({ honors }) {
  if (!honors || honors.length === 0) return null
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">荣誉证书</h2>
      <div className="text-sm text-gray-700">
        {honors.map((honor, index) => (
          <span key={index}>
            {honor}{index < honors.length - 1 ? '，' : ''}
          </span>
        ))}
      </div>
    </div>
  )
}

function WorkExperiencesSection({ experiences }) {
  if (!experiences || experiences.length === 0) return null
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">工作经历</h2>
      {experiences.map((exp, index) => (
        <div key={index} className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="font-semibold text-gray-900">{exp.company}</span>
              {exp.companyType && (
                <span className="text-gray-600 ml-2">，{exp.companyType}</span>
              )}
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900">{exp.position}</div>
              <div className="text-sm text-gray-600">{exp.period}</div>
            </div>
          </div>
          {exp.reportTo && exp.reportTo.trim() && (
            <div className="text-sm text-gray-600 mb-1">汇报对象：{exp.reportTo}</div>
          )}
          {exp.subordinates && exp.subordinates.trim() && (
            <div className="text-sm text-gray-600 mb-1">下属：{exp.subordinates}</div>
          )}
          {exp.promotionPath && exp.promotionPath.trim() && (
            <div className="text-sm text-gray-600 mb-2">晋升路径：{exp.promotionPath}</div>
          )}
          {exp.achievements && exp.achievements.length > 0 && (
            <div className="mb-3">
              <div className="font-medium text-gray-900 mb-1">【工作业绩】</div>
              {exp.achievements.map((achievement, aIndex) => (
                <div key={aIndex} className="text-sm text-gray-700 mb-1 ml-4">
                  {achievement.includes('、') ? achievement : `${aIndex + 1}、${achievement}`}
                </div>
              ))}
            </div>
          )}
          {exp.responsibilities && exp.responsibilities.length > 0 && (
            <div>
              <div className="font-medium text-gray-900 mb-1">【工作内容】</div>
              {exp.responsibilities.map((responsibility, rIndex) => (
                <div key={rIndex} className="text-sm text-gray-700 mb-1 ml-4">
                  {responsibility.includes('、') ? responsibility : `${rIndex + 1}、${responsibility}`}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function ProjectsSection({ projects }) {
  if (!projects || projects.length === 0) return null
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">项目经历</h2>
      {projects.map((project, index) => (
        <div key={index} className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <div className="font-semibold text-gray-900">{project.name}</div>
            <div className="text-right text-sm text-gray-600">
              <div>{project.period}</div>
              {project.role && <div>| {project.role}</div>}
            </div>
          </div>
          {project.description && project.description.length > 0 && (
            <div className="text-sm text-gray-700 space-y-1">
              {project.description.map((desc, dIndex) => (
                <div key={dIndex} className="mb-1">
                  {desc.includes('、') ? desc : `${dIndex + 1}、${desc}`}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function EducationSection({ education }) {
  if (!education) return null
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">教育背景</h2>
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="font-semibold text-gray-900">{education.school}</span>
          {education.level && (
            <span className="text-gray-600 ml-2">{education.level}</span>
          )}
        </div>
        <div className="text-right text-sm text-gray-600">
          <div>{education.period}</div>
          <div>{education.major}</div>
          <div>{education.degree}</div>
        </div>
      </div>
      {education.achievements && education.achievements.length > 0 && (
        <div className="text-sm text-gray-700 mt-2">
          {education.achievements.map((achievement, index) => (
            <div key={index} className="mb-1">
              {index + 1}.{achievement}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ResumePreview

