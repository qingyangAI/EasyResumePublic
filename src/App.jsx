import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TemplatePage from './pages/TemplatePage'
import ResumeListPage from './pages/ResumeListPage'
import EditorPage from './pages/EditorPage'
import { InitializeTemplates } from './utils/resumeData'

function App() {
  // 初始化模板
  InitializeTemplates()
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/templates" element={<TemplatePage />} />
      <Route path="/resumes" element={<ResumeListPage />} />
      <Route path="/editor/:id" element={<EditorPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
