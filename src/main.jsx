import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { LoadFontForPage } from './utils/loadFont'

// 在应用启动时加载字体
LoadFontForPage().then((loaded) => {
  if (loaded) {
    console.log('页面字体加载完成')
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

