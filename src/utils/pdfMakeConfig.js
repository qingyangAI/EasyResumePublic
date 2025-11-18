// pdfmake 中文字体配置
// 使用思源黑体（Source Han Sans）支持中文

import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { GetFontMapping } from './fontMapping'

// 设置默认字体
// pdfFonts 本身就是一个包含字体文件的 vfs 对象
pdfMake.vfs = pdfFonts || {}

// 字体加载状态
let fontLoadPromise = null
let fontsLoaded = false
// 已加载的字体缓存
const loadedFonts = new Set()

// 验证字体文件是否为有效的TTF或OTF格式
const IsValidFont = (arrayBuffer) => {
  try {
    if (!arrayBuffer || arrayBuffer.byteLength < 4) {
      return false
    }
    const view = new DataView(arrayBuffer)
    const signature = view.getUint32(0, false)
    
    // TTF签名: 0x00010000 (big-endian) 或 0x00010000 (little-endian)
    // 也检查 'true' (0x74727565) 或 'OTTO' (OTF格式)
    const signatureStr = String.fromCharCode(
      (signature >> 24) & 0xFF,
      (signature >> 16) & 0xFF,
      (signature >> 8) & 0xFF,
      signature & 0xFF
    )
    
    // 支持TTF和OTF格式（pdfmake的fontkit都支持）
    return signature === 0x00010000 || 
           signature === 0x74727565 ||
           signatureStr === 'true' ||
           signatureStr === 'OTTO'
  } catch {
    return false
  }
}

// 加载本地字体文件
const LoadLocalFont = async (fontPath, fontName) => {
  try {
    console.log(`尝试加载本地字体: ${fontPath}`)
    const response = await fetch(fontPath, {
      cache: 'default'
    })
    
    if (!response.ok) {
      console.warn(`本地字体文件 ${fontPath} 不存在或无法访问，状态码: ${response.status}`)
      return null
    }
    
    const arrayBuffer = await response.arrayBuffer()
    
    // 检查文件大小
    if (arrayBuffer.byteLength > 50 * 1024 * 1024) {
      console.warn(`字体文件 ${fontName} 过大 (${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)}MB)，跳过`)
      return null
    }
    
    // 验证字体格式
    if (!IsValidFont(arrayBuffer)) {
      console.warn(`本地字体文件 ${fontPath} 格式无效`)
      return null
    }
    
    // 转换为base64
    const uint8Array = new Uint8Array(arrayBuffer)
    let binaryString = ''
    const chunkSize = 8192
    for (let j = 0; j < uint8Array.length; j += chunkSize) {
      const chunk = uint8Array.subarray(j, j + chunkSize)
      binaryString += String.fromCharCode.apply(null, chunk)
    }
    const base64 = btoa(binaryString)
    
    // 存储到pdfMake的虚拟文件系统
    pdfMake.vfs[fontName] = base64
    console.log(`✅ 本地字体 ${fontName} 加载成功！大小: ${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)}MB`)
    return base64
  } catch (error) {
    console.warn(`加载本地字体 ${fontPath} 失败:`, error.message)
    return null
  }
}

// 加载中文字体（优先使用本地字体，然后从CDN加载）
const LoadChineseFont = async () => {
  try {
    // 优先使用本地字体文件（可变字体，包含所有字重）
    const localFontPath = '/fonts/SourceHanSansSC-VF.ttf'
    const localFont = await LoadLocalFont(localFontPath, 'SourceHanSansCN-Regular.ttf')
    
    if (localFont) {
      // 使用本地可变字体作为普通和加粗字体
      pdfMake.vfs['SourceHanSansCN-Bold.ttf'] = localFont // 可变字体可以用于加粗
      
      pdfMake.fonts = {
        ...pdfMake.fonts,
        SourceHanSans: {
          normal: 'SourceHanSansCN-Regular.ttf',
          bold: 'SourceHanSansCN-Bold.ttf', // 使用同一个可变字体
          italics: 'SourceHanSansCN-Regular.ttf',
          bolditalics: 'SourceHanSansCN-Bold.ttf'
        }
      }
      console.log('✅ 本地中文字体加载成功，已配置SourceHanSans字体（使用可变字体）')
      return true
    }
    
    // 如果本地字体不存在，回退到CDN加载
    console.log('本地字体不存在，尝试从CDN加载...')
    const fontUrls = {
      normal: [
        // 方案1: 使用fastly CDN（Google Fonts官方CDN，最可靠）
        'https://fonts.gstatic.com/s/notosanssc/v36/k3kCo84MPvpLmixcA63oeALhLpBp.ttf',
        // 方案2: 使用jsdelivr加载（备用）
        'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosanssc/NotoSansSC-Regular.ttf',
        // 方案3: 使用unpkg（npm包）
        'https://unpkg.com/@fontsource/noto-sans-sc@5/files/noto-sans-sc-chinese-simplified-400-normal.ttf',
        // 方案4: 使用GitHub Raw
        'https://raw.githubusercontent.com/google/fonts/main/ofl/notosanssc/NotoSansSC-Regular.ttf'
      ],
      bold: [
        'https://fonts.gstatic.com/s/notosanssc/v36/k3kBo84MPvpLmixcA63oeAL7Ixhp.ttf',
        'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosanssc/NotoSansSC-Bold.ttf',
        'https://unpkg.com/@fontsource/noto-sans-sc@5/files/noto-sans-sc-chinese-simplified-700-normal.ttf',
        'https://raw.githubusercontent.com/google/fonts/main/ofl/notosanssc/NotoSansSC-Bold.ttf'
      ]
    }
    
    // 加载TTF格式字体（支持多个备用URL，并验证格式）
    const LoadTTFFont = async (urls, fontName) => {
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i]
        try {
          console.log(`尝试加载字体 ${fontName}，来源 ${i + 1}/${urls.length}: ${url}`)
          
          const response = await fetch(url, {
            mode: 'cors',
            cache: 'no-cache',
            headers: {
              'Accept': 'application/octet-stream, */*'
            }
          })
          
          if (!response.ok) {
            console.warn(`字体URL ${url} 返回状态码: ${response.status}`)
            continue
          }
          
          const contentType = response.headers.get('content-type')
          if (contentType && !contentType.includes('font') && !contentType.includes('octet-stream') && !contentType.includes('ttf')) {
            console.warn(`字体URL ${url} 返回了意外的Content-Type: ${contentType}`)
            // 继续尝试，因为某些CDN可能不设置正确的Content-Type
          }
          
          const arrayBuffer = await response.arrayBuffer()
          
          // 检查文件大小，避免加载过大的文件（限制为10MB）
          if (arrayBuffer.byteLength > 10 * 1024 * 1024) {
            console.warn(`字体文件 ${fontName} 过大 (${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)}MB)，跳过`)
            continue
          }
          
          // 检查最小文件大小（TTF文件至少应该有几百字节）
          if (arrayBuffer.byteLength < 100) {
            console.warn(`字体文件 ${fontName} 太小 (${arrayBuffer.byteLength}字节)，可能是错误响应`)
            continue
          }
          
          // 验证是否为有效的字体格式（TTF或OTF）
          if (!IsValidFont(arrayBuffer)) {
            console.warn(`字体文件 ${fontName} 格式无效，不是有效的TTF/OTF文件`)
            // 打印前几个字节用于调试
            const view = new Uint8Array(arrayBuffer.slice(0, 4))
            console.warn(`文件前4字节: ${Array.from(view).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' ')}`)
            continue
          }
          
          // 转换为base64（使用更高效的方法，避免堆栈溢出）
          const uint8Array = new Uint8Array(arrayBuffer)
          let binaryString = ''
          const chunkSize = 8192
          for (let j = 0; j < uint8Array.length; j += chunkSize) {
            const chunk = uint8Array.subarray(j, j + chunkSize)
            binaryString += String.fromCharCode.apply(null, chunk)
          }
          const base64 = btoa(binaryString)
          
          // 存储到pdfMake的虚拟文件系统
          pdfMake.vfs[fontName] = base64
          console.log(`✅ 字体 ${fontName} 加载成功！来源: ${url}，大小: ${(arrayBuffer.byteLength / 1024).toFixed(2)}KB`)
          return base64
        } catch (error) {
          console.warn(`❌ 从 ${url} 加载字体 ${fontName} 失败:`, error.message)
          if (i === urls.length - 1) {
            console.error(`所有字体源都失败了，无法加载 ${fontName}`)
          }
          continue
        }
      }
      return null
    }
    
    // 加载中文字体（使用TTF格式）
    const normalFont = await LoadTTFFont(fontUrls.normal, 'SourceHanSansCN-Regular.ttf')
    const boldFont = await LoadTTFFont(fontUrls.bold, 'SourceHanSansCN-Bold.ttf')
    
    // 如果字体加载成功，配置字体映射
    if (normalFont && boldFont) {
      pdfMake.fonts = {
        ...pdfMake.fonts,
        SourceHanSans: {
          normal: 'SourceHanSansCN-Regular.ttf',
          bold: 'SourceHanSansCN-Bold.ttf',
          italics: 'SourceHanSansCN-Regular.ttf',
          bolditalics: 'SourceHanSansCN-Bold.ttf'
        }
      }
      console.log('中文字体加载成功，已配置SourceHanSans字体')
      return true
    } else if (normalFont) {
      // 如果只有普通字体加载成功，也配置字体映射（使用普通字体作为加粗字体）
      pdfMake.fonts = {
        ...pdfMake.fonts,
        SourceHanSans: {
          normal: 'SourceHanSansCN-Regular.ttf',
          bold: 'SourceHanSansCN-Regular.ttf',
          italics: 'SourceHanSansCN-Regular.ttf',
          bolditalics: 'SourceHanSansCN-Regular.ttf'
        }
      }
      console.log('中文字体部分加载成功（仅普通字体），已配置SourceHanSans字体')
      return true
    }
    
    return false
  } catch (error) {
    console.error('加载中文字体失败:', error)
    return false
  }
}

// 配置pdfmake字体
export const ConfigurePdfMakeFonts = async () => {
  // 如果已经加载过，直接返回
  if (fontsLoaded) {
    return true
  }
  
  // 如果正在加载，等待加载完成
  if (fontLoadPromise) {
    return await fontLoadPromise
  }
  
  // 开始加载字体
  fontLoadPromise = (async () => {
    try {
      // 默认字体配置
      pdfMake.fonts = {
        Roboto: {
          normal: 'Roboto-Regular.ttf',
          bold: 'Roboto-Medium.ttf',
          italics: 'Roboto-Italic.ttf',
          bolditalics: 'Roboto-MediumItalic.ttf'
        }
      }
      
      console.log('开始加载中文字体...')
      // 尝试加载中文字体
      const chineseFontLoaded = await LoadChineseFont()
      
      // 如果中文字体加载失败，确保SourceHanSans字体映射存在（使用Roboto作为回退）
      if (!chineseFontLoaded) {
        console.warn('⚠️ 中文字体加载失败，将使用Roboto字体（不支持中文显示）')
        // 配置SourceHanSans字体映射，但使用Roboto字体文件作为回退
        pdfMake.fonts = {
          ...pdfMake.fonts,
          SourceHanSans: {
            normal: 'Roboto-Regular.ttf', // 使用Roboto作为回退
            bold: 'Roboto-Medium.ttf',
            italics: 'Roboto-Italic.ttf',
            bolditalics: 'Roboto-MediumItalic.ttf'
          }
        }
        fontsLoaded = true
        return false
      } else {
        console.log('✅ 中文字体配置完成！')
        fontsLoaded = true
        return true
      }
    } catch (error) {
      console.error('❌ 配置字体时发生错误:', error)
      fontsLoaded = true
      return false
    } finally {
      fontLoadPromise = null
    }
  })()
  
  return await fontLoadPromise
}

// 加载并注册指定的字体到pdfmake
export const LoadAndRegisterFont = async (fontValue) => {
  try {
    const mapping = GetFontMapping(fontValue)
    const pdfMakeName = mapping.pdfMakeName || 'SourceHanSans'
    
    // 如果字体已经加载，直接返回
    if (loadedFonts.has(pdfMakeName)) {
      return true
    }
    
    // 如果字体没有文件路径（使用回退字体），直接返回
    if (!mapping.normal) {
      console.log(`字体 ${pdfMakeName} 使用回退字体，无需加载`)
      return true
    }
    
    // 加载字体文件
    const normalFileName = `${pdfMakeName}-Regular.ttf`
    const boldFileName = `${pdfMakeName}-Bold.ttf`
    
    const normalFont = await LoadLocalFont(mapping.normal, normalFileName)
    if (!normalFont) {
      console.warn(`字体 ${pdfMakeName} 的普通字体加载失败，使用回退字体`)
      return false
    }
    
    // 加载加粗字体（如果有）
    let boldFont = null
    if (mapping.bold && mapping.bold !== mapping.normal) {
      boldFont = await LoadLocalFont(mapping.bold, boldFileName)
    }
    
    // 如果没有加粗字体，使用普通字体作为加粗字体
    if (!boldFont) {
      boldFont = normalFont
      pdfMake.vfs[boldFileName] = normalFont
    }
    
    // 注册字体到pdfmake
    pdfMake.fonts = {
      ...pdfMake.fonts,
      [pdfMakeName]: {
        normal: normalFileName,
        bold: boldFileName,
        italics: normalFileName,
        bolditalics: boldFileName
      }
    }
    
    loadedFonts.add(pdfMakeName)
    console.log(`✅ 字体 ${pdfMakeName} 加载并注册成功`)
    return true
  } catch (error) {
    console.error(`加载字体失败:`, error)
    return false
  }
}

// 确保字体已加载（用于PDF导出前）
export const EnsureFontLoaded = async (fontValue) => {
  // 先确保基础字体已加载
  await ConfigurePdfMakeFonts()
  
  // 然后加载用户选择的字体
  if (fontValue && fontValue !== 'inherit') {
    await LoadAndRegisterFont(fontValue)
  }
  
  return true
}

// 初始化pdfmake
export const InitPdfMake = async () => {
  await ConfigurePdfMakeFonts()
  return pdfMake
}

export default pdfMake

