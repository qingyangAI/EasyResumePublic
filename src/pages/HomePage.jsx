import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/icons/Logo'
import { GetResumeList, GetCurrentResumeId, GetResumeById, SaveCurrentResumeId, InitializeTemplates } from '../utils/resumeData'

function HomePage() {
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState(null)

  const HandleStartNew = () => {
    InitializeTemplates()
    navigate('/templates')
  }

  const HandleContinue = () => {
    InitializeTemplates()
    const currentId = GetCurrentResumeId()
    if (currentId) {
      const resume = GetResumeById(currentId)
      if (resume) {
        navigate(`/editor/${currentId}`)
        return
      }
    }
    // 如果没有当前简历，获取第一个简历
    const resumeList = GetResumeList()
    if (resumeList && resumeList.length > 0) {
      navigate(`/editor/${resumeList[0].id}`)
    } else {
      // 如果没有简历，创建新的
      HandleStartNew()
    }
  }

  const HandleSelectResume = (resume) => {
    if (resume) {
      SaveCurrentResumeId(resume.id)
      navigate(`/editor/${resume.id}`)
    } else {
      HandleStartNew()
    }
  }

  const resumeList = GetResumeList()
  const recentResumes = resumeList?.slice(0, 3) || []

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Logo className="w-8 h-8 text-gray-900" />
              <span className="text-xl font-medium text-gray-900">EasyResume</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/resumes')}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                简历列表
              </button>
              <button
                onClick={HandleContinue}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                继续编辑
              </button>
              <button
                onClick={HandleStartNew}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                开始创建
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
              轻松创建
              <br />
              <span className="font-normal">专业简历</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto font-light">
              极简设计，强大功能。让简历制作变得简单高效
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={HandleStartNew}
                className="px-8 py-4 text-base font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                创建新简历
              </button>
              {recentResumes.length > 0 && (
                <button
                  onClick={HandleContinue}
                  className="px-8 py-4 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  继续编辑
                </button>
              )}
            </div>
          </div>

          {/* 最近编辑的简历 */}
          {recentResumes.length > 0 && (
            <div className="mb-20">
              <h2 className="text-2xl font-light text-gray-900 mb-8">最近编辑</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentResumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer"
                    onMouseEnter={() => setHoveredCard(resume.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => HandleSelectResume(resume)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {resume.name || '未命名简历'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {resume.data?.personalInfo?.name || '未填写姓名'}
                        </p>
                      </div>
                      <Logo className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                    <div className="text-xs text-gray-400 mt-4">
                      {resume.updatedAt
                        ? new Date(resume.updatedAt).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : '刚刚'}
                    </div>
                    {hoveredCard === resume.id && (
                      <div className="absolute inset-0 border-2 border-gray-900 rounded-xl pointer-events-none" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 功能特性 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">智能编辑</h3>
              <p className="text-gray-600 font-light">
                AI辅助优化，一键提升简历质量
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">精美模板</h3>
              <p className="text-gray-600 font-light">
                多种样式选择，打造专业形象
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">一键导出</h3>
              <p className="text-gray-600 font-light">
                支持PDF、JSON、Excel多种格式
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage

