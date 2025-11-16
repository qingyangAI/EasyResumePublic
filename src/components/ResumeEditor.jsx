import { useState } from 'react'

function ResumeEditor({ data, onChange }) {
  const [localData, setLocalData] = useState(data)

  const UpdateData = (section, field, value) => {
    const newData = { ...localData }
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      newData[section] = {
        ...newData[section],
        [parent]: {
          ...newData[section][parent],
          [child]: value
        }
      }
    } else if (Array.isArray(newData[section])) {
      newData[section] = value
    } else {
      newData[section] = {
        ...newData[section],
        [field]: value
      }
    }
    setLocalData(newData)
    onChange(newData)
  }

  const AddItem = (section, item) => {
    const newData = { ...localData }
    newData[section] = [...newData[section], item]
    setLocalData(newData)
    onChange(newData)
  }

  const RemoveItem = (section, index) => {
    const newData = { ...localData }
    newData[section] = newData[section].filter((_, i) => i !== index)
    setLocalData(newData)
    onChange(newData)
  }

  const UpdateArrayItem = (section, index, field, value) => {
    const newData = { ...localData }
    newData[section][index] = {
      ...newData[section][index],
      [field]: value
    }
    setLocalData(newData)
    onChange(newData)
  }

  const UpdateArrayField = (section, index, value) => {
    const newData = { ...localData }
    newData[section][index] = value
    setLocalData(newData)
    onChange(newData)
  }

  const AddArrayField = (section, field, value) => {
    const newData = { ...localData }
    if (!newData[section][field]) {
      newData[section][field] = []
    }
    newData[section][field] = [...newData[section][field], value]
    setLocalData(newData)
    onChange(newData)
  }

  const RemoveArrayField = (section, field, index) => {
    const newData = { ...localData }
    newData[section][field] = newData[section][field].filter((_, i) => i !== index)
    setLocalData(newData)
    onChange(newData)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Section title="个人信息">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="姓名"
            value={localData.personalInfo.name}
            onChange={(v) => UpdateData('personalInfo', 'name', v)}
          />
          <InputField
            label="职位"
            value={localData.personalInfo.title}
            onChange={(v) => UpdateData('personalInfo', 'title', v)}
          />
          <InputField
            label="电话"
            value={localData.personalInfo.phone}
            onChange={(v) => UpdateData('personalInfo', 'phone', v)}
          />
          <InputField
            label="邮箱"
            value={localData.personalInfo.email}
            onChange={(v) => UpdateData('personalInfo', 'email', v)}
          />
          <InputField
            label="年龄"
            value={localData.personalInfo.age}
            onChange={(v) => UpdateData('personalInfo', 'age', v)}
          />
          <InputField
            label="博客"
            value={localData.personalInfo.blog}
            onChange={(v) => UpdateData('personalInfo', 'blog', v)}
          />
          <InputField
            label="GitHub"
            value={localData.personalInfo.github}
            onChange={(v) => UpdateData('personalInfo', 'github', v)}
          />
          <InputField
            label="目标城市"
            value={localData.personalInfo.targetCity}
            onChange={(v) => UpdateData('personalInfo', 'targetCity', v)}
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">作品集</label>
          {localData.personalInfo.works.map((work, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="作品名称"
                value={work.name}
                onChange={(e) => {
                  const newWorks = [...localData.personalInfo.works]
                  newWorks[index] = { ...newWorks[index], name: e.target.value }
                  UpdateData('personalInfo', 'works', newWorks)
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="作品链接"
                value={work.url}
                onChange={(e) => {
                  const newWorks = [...localData.personalInfo.works]
                  newWorks[index] = { ...newWorks[index], url: e.target.value }
                  UpdateData('personalInfo', 'works', newWorks)
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  const newWorks = localData.personalInfo.works.filter((_, i) => i !== index)
                  UpdateData('personalInfo', 'works', newWorks)
                }}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                删除
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newWorks = [...localData.personalInfo.works, { name: '', url: '' }]
              UpdateData('personalInfo', 'works', newWorks)
            }}
            className="mt-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
          >
            + 添加作品
          </button>
        </div>
      </Section>

      <Section title="专业标签">
        <div className="flex flex-wrap gap-2">
          {localData.tags.map((tag, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={tag}
                onChange={(e) => {
                  const newTags = [...localData.tags]
                  newTags[index] = e.target.value
                  UpdateData('tags', '', newTags)
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => RemoveItem('tags', index)}
                className="text-red-600 hover:bg-red-50 px-2 py-1 rounded"
              >
                删除
              </button>
            </div>
          ))}
          <button
            onClick={() => AddItem('tags', '')}
            className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md border border-dashed border-blue-300"
          >
            + 添加标签
          </button>
        </div>
      </Section>

      <Section title="个人优势">
        {localData.advantages.map((advantage, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <textarea
              value={advantage}
              onChange={(e) => {
                const newAdvantages = [...localData.advantages]
                newAdvantages[index] = e.target.value
                UpdateData('advantages', '', newAdvantages)
              }}
              rows={3}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => RemoveItem('advantages', index)}
              className="text-red-600 hover:bg-red-50 px-3 py-2 rounded"
            >
              删除
            </button>
          </div>
        ))}
        <button
          onClick={() => AddItem('advantages', '')}
          className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md border border-dashed border-blue-300"
        >
          + 添加优势
        </button>
      </Section>

      <Section title="荣誉证书">
        {localData.honors.map((honor, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={honor}
              onChange={(e) => UpdateArrayField('honors', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => RemoveItem('honors', index)}
              className="text-red-600 hover:bg-red-50 px-3 py-2 rounded"
            >
              删除
            </button>
          </div>
        ))}
        <button
          onClick={() => AddItem('honors', '')}
          className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md border border-dashed border-blue-300"
        >
          + 添加荣誉
        </button>
      </Section>

      <Section title="工作经历">
        {localData.workExperiences.map((work, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <InputField
                label="公司名称"
                value={work.company}
                onChange={(v) => UpdateArrayItem('workExperiences', index, 'company', v)}
              />
              <InputField
                label="公司类型"
                value={work.companyType}
                onChange={(v) => UpdateArrayItem('workExperiences', index, 'companyType', v)}
              />
              <InputField
                label="职位"
                value={work.position}
                onChange={(v) => UpdateArrayItem('workExperiences', index, 'position', v)}
              />
              <InputField
                label="工作期间"
                value={work.period}
                onChange={(v) => UpdateArrayItem('workExperiences', index, 'period', v)}
              />
              <InputField
                label="汇报对象（可选）"
                value={work.reportTo || ''}
                onChange={(v) => UpdateArrayItem('workExperiences', index, 'reportTo', v)}
              />
              <InputField
                label="下属人数（可选）"
                value={work.subordinates || ''}
                onChange={(v) => UpdateArrayItem('workExperiences', index, 'subordinates', v)}
              />
              <InputField
                label="晋升路径（可选）"
                value={work.promotionPath || ''}
                onChange={(v) => UpdateArrayItem('workExperiences', index, 'promotionPath', v)}
                className="md:col-span-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">工作业绩</label>
              {work.achievements.map((achievement, aIndex) => (
                <div key={aIndex} className="flex gap-2 mb-2">
                  <textarea
                    value={achievement}
                    onChange={(e) => {
                      const newWork = { ...work }
                      newWork.achievements[aIndex] = e.target.value
                      UpdateArrayItem('workExperiences', index, 'achievements', newWork.achievements)
                    }}
                    rows={2}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => {
                      const newWork = { ...work }
                      newWork.achievements = newWork.achievements.filter((_, i) => i !== aIndex)
                      UpdateArrayItem('workExperiences', index, 'achievements', newWork.achievements)
                    }}
                    className="text-red-600 hover:bg-red-50 px-3 py-2 rounded"
                  >
                    删除
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newWork = { ...work }
                  newWork.achievements = [...newWork.achievements, '']
                  UpdateArrayItem('workExperiences', index, 'achievements', newWork.achievements)
                }}
                className="mt-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
              >
                + 添加业绩
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">工作内容</label>
              {work.responsibilities.map((responsibility, rIndex) => (
                <div key={rIndex} className="flex gap-2 mb-2">
                  <textarea
                    value={responsibility}
                    onChange={(e) => {
                      const newWork = { ...work }
                      newWork.responsibilities[rIndex] = e.target.value
                      UpdateArrayItem('workExperiences', index, 'responsibilities', newWork.responsibilities)
                    }}
                    rows={2}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => {
                      const newWork = { ...work }
                      newWork.responsibilities = newWork.responsibilities.filter((_, i) => i !== rIndex)
                      UpdateArrayItem('workExperiences', index, 'responsibilities', newWork.responsibilities)
                    }}
                    className="text-red-600 hover:bg-red-50 px-3 py-2 rounded"
                  >
                    删除
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newWork = { ...work }
                  newWork.responsibilities = [...newWork.responsibilities, '']
                  UpdateArrayItem('workExperiences', index, 'responsibilities', newWork.responsibilities)
                }}
                className="mt-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
              >
                + 添加内容
              </button>
            </div>
            <button
              onClick={() => RemoveItem('workExperiences', index)}
              className="mt-4 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md border border-red-200"
            >
              删除此工作经历
            </button>
          </div>
        ))}
        <button
          onClick={() => AddItem('workExperiences', {
            company: '',
            companyType: '',
            position: '',
            period: '',
            reportTo: '',
            subordinates: '',
            promotionPath: '',
            achievements: [''],
            responsibilities: ['']
          })}
          className="w-full px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md border border-dashed border-blue-300"
        >
          + 添加工作经历
        </button>
      </Section>

      <Section title="项目经历">
        {localData.projects.map((project, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <InputField
                label="项目名称"
                value={project.name}
                onChange={(v) => UpdateArrayItem('projects', index, 'name', v)}
                className="md:col-span-2"
              />
              <InputField
                label="项目期间"
                value={project.period}
                onChange={(v) => UpdateArrayItem('projects', index, 'period', v)}
              />
              <InputField
                label="担任角色"
                value={project.role}
                onChange={(v) => UpdateArrayItem('projects', index, 'role', v)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">项目描述</label>
              {project.description.map((desc, dIndex) => (
                <div key={dIndex} className="flex gap-2 mb-2">
                  <textarea
                    value={desc}
                    onChange={(e) => {
                      const newProject = { ...project }
                      newProject.description[dIndex] = e.target.value
                      UpdateArrayItem('projects', index, 'description', newProject.description)
                    }}
                    rows={3}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => {
                      const newProject = { ...project }
                      newProject.description = newProject.description.filter((_, i) => i !== dIndex)
                      UpdateArrayItem('projects', index, 'description', newProject.description)
                    }}
                    className="text-red-600 hover:bg-red-50 px-3 py-2 rounded"
                  >
                    删除
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newProject = { ...project }
                  newProject.description = [...newProject.description, '']
                  UpdateArrayItem('projects', index, 'description', newProject.description)
                }}
                className="mt-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
              >
                + 添加描述
              </button>
            </div>
            <button
              onClick={() => RemoveItem('projects', index)}
              className="mt-4 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md border border-red-200"
            >
              删除此项目
            </button>
          </div>
        ))}
        <button
          onClick={() => AddItem('projects', {
            name: '',
            period: '',
            role: '',
            description: ['']
          })}
          className="w-full px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md border border-dashed border-blue-300"
        >
          + 添加项目
        </button>
      </Section>

      <Section title="教育背景">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="学校名称"
            value={localData.education.school}
            onChange={(v) => UpdateData('education', 'school', v)}
          />
          <InputField
            label="学校级别"
            value={localData.education.level}
            onChange={(v) => UpdateData('education', 'level', v)}
          />
          <InputField
            label="就读期间"
            value={localData.education.period}
            onChange={(v) => UpdateData('education', 'period', v)}
          />
          <InputField
            label="专业"
            value={localData.education.major}
            onChange={(v) => UpdateData('education', 'major', v)}
          />
          <InputField
            label="学历"
            value={localData.education.degree}
            onChange={(v) => UpdateData('education', 'degree', v)}
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">在校成就</label>
          {localData.education.achievements.map((achievement, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <textarea
                value={achievement}
                onChange={(e) => {
                  const newEducation = { ...localData.education }
                  newEducation.achievements[index] = e.target.value
                  UpdateData('education', 'achievements', newEducation.achievements)
                }}
                rows={2}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  const newEducation = { ...localData.education }
                  newEducation.achievements = newEducation.achievements.filter((_, i) => i !== index)
                  UpdateData('education', 'achievements', newEducation.achievements)
                }}
                className="text-red-600 hover:bg-red-50 px-3 py-2 rounded"
              >
                删除
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newEducation = { ...localData.education }
              newEducation.achievements = [...newEducation.achievements, '']
              UpdateData('education', 'achievements', newEducation.achievements)
            }}
            className="mt-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
          >
            + 添加成就
          </button>
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  )
}

function InputField({ label, value, onChange, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

export default ResumeEditor

