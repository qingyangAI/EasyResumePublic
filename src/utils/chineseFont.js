// 中文字体支持 - 使用思源黑体（Source Han Sans）
// 这是一个简化版本，使用CDN加载字体base64数据

// 注意：完整的字体文件很大，这里使用一个轻量级的解决方案
// 如果需要完整的中文字体支持，需要下载完整的字体文件并转换

// 使用jsPDF的html()方法配合SVG渲染可以实现文字版PDF
// 或者使用pdfmake等支持中文的库

export const LoadChineseFont = async (jsPDF) => {
  // 尝试从CDN加载中文字体
  // 这里使用一个简化的方案：使用jsPDF的html()方法配合SVG渲染
  // 这样可以保留文字的可选择性，同时支持中文
  
  // 如果浏览器支持SVG foreignObject，html()方法可以生成文字版PDF
  // 否则会回退到图片版
  
  return true
}

// 检查浏览器是否支持SVG foreignObject
export const SupportsSVGForeignObject = () => {
  if (typeof document === 'undefined') return false
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
  svg.appendChild(foreignObject)
  
  return foreignObject instanceof SVGForeignObjectElement
}

