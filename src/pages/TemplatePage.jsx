import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/icons/Logo'
import { CreateTemplateResume, GetTemplatesByCategory } from '../utils/templates'
import { AddResume, SaveCurrentResumeId } from '../utils/resumeData'

function TemplatePage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const categories = GetTemplatesByCategory()
  const allCategories = ['全部', ...categories.map(c => c.category)]

  const HandleSelectTemplate = (templateKey) => {
    const newResume = CreateTemplateResume(templateKey)
    if (newResume) {
      const added = AddResume(newResume)
      SaveCurrentResumeId(added.id)
      navigate(`/editor/${added.id}`)
    }
  }

  const filteredCategories = selectedCategory === '全部' 
    ? categories 
    : categories.filter(c => c.category === selectedCategory)

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航栏 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Logo className="w-7 h-7 text-gray-900" />
              <span className="text-xl font-medium text-gray-900">EasyResume</span>
            </button>
            <button
              onClick={() => navigate('/resumes')}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              简历列表
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-4">选择模板</h1>
          <p className="text-gray-600">选择一个适合您岗位的模板，或创建空白简历</p>
        </div>

        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 模板列表 */}
        <div className="space-y-8">
          {filteredCategories.map(({ category, templates }) => (
            <div key={category}>
              <h2 className="text-xl font-medium text-gray-900 mb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.key}
                    onClick={() => HandleSelectTemplate(template.key)}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {template.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      使用此模板
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default TemplatePage

