// 加载本地字体文件并应用到页面
export const LoadFontForPage = async () => {
  try {
    const fontPath = '/fonts/SourceHanSansSC-VF.ttf'
    
    // 检查字体是否已经加载
    if (document.fonts.check('1em "Source Han Sans SC"')) {
      console.log('字体已加载')
      return true
    }
    
    // 使用 FontFace API 加载字体
    const fontFace = new FontFace('Source Han Sans SC', `url(${fontPath})`, {
      style: 'normal',
      weight: '400',
      display: 'swap'
    })
    
    try {
      await fontFace.load()
      document.fonts.add(fontFace)
      console.log('✅ 页面字体加载成功: Source Han Sans SC')
      
      // 字体已经通过CSS @font-face加载，不需要再添加样式
      // 字体会在用户选择"默认字体"时通过styleVars应用
      
      return true
    } catch (error) {
      console.warn('加载页面字体失败:', error)
      return false
    }
  } catch (error) {
    console.warn('初始化字体加载失败:', error)
    return false
  }
}

// 获取字体名称（用于CSS）
export const GetFontFamily = () => {
  return "'Source Han Sans SC', 'Microsoft YaHei', '微软雅黑', 'SimHei', '黑体', sans-serif"
}

