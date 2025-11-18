// 字体映射配置：将CSS字体名称映射到pdfmake字体名称和字体文件路径
// 用于PDF导出和打印时正确应用字体

// 从CSS字体值中提取字体名称（去除引号和fallback）
const ExtractFontName = (fontValue) => {
  if (!fontValue || fontValue === 'inherit') {
    return null
  }
  
  // 处理带引号的字体名称，如 "'LXGW WenKai', 霞鹜文楷"
  const match = fontValue.match(/['"]([^'"]+)['"]/)
  if (match) {
    return match[1]
  }
  
  // 处理不带引号的字体名称，如 "SimSun, 宋体"
  const firstFont = fontValue.split(',')[0].trim()
  return firstFont || null
}

// 字体文件路径映射（CSS字体名称 -> pdfmake字体配置）
export const FontFileMapping = {
  // 默认字体（使用SourceHanSans作为回退）
  'Source Han Sans SC': {
    normal: '/fonts/SourceHanSansSC-VF.ttf',
    bold: '/fonts/SourceHanSansSC-VF.ttf',
    pdfMakeName: 'SourceHanSans'
  },
  
  // 系统字体（使用SourceHanSans作为回退，因为系统字体在PDF中可能不可用）
  'SimSun': { pdfMakeName: 'SourceHanSans' },
  'SimHei': { pdfMakeName: 'SourceHanSans' },
  'Microsoft YaHei': { pdfMakeName: 'SourceHanSans' },
  'FangSong': { pdfMakeName: 'SourceHanSans' },
  'KaiTi': { pdfMakeName: 'SourceHanSans' },
  
  // 英文字体（使用Roboto作为回退）
  'Arial': { pdfMakeName: 'Roboto' },
  'Times New Roman': { pdfMakeName: 'Roboto' },
  'Courier New': { pdfMakeName: 'Roboto' },
  
  // Noto Sans SC
  'Noto Sans SC': {
    normal: '/fonts/Noto_Sans_SC/NotoSansSC-VariableFont_wght.ttf',
    bold: '/fonts/Noto_Sans_SC/static/NotoSansSC-Bold.ttf',
    pdfMakeName: 'NotoSansSC'
  },
  
  // HarmonyOS Sans
  'HarmonyOS Sans SC': {
    normal: '/fonts/HarmonyOS-Sans/HarmonyOS_Sans_SC/HarmonyOS_Sans_Regular.ttf',
    bold: '/fonts/HarmonyOS-Sans/HarmonyOS_Sans_SC/HarmonyOS_Sans_Bold.ttf',
    pdfMakeName: 'HarmonyOSSansSC'
  },
  'HarmonyOS Sans TC': {
    normal: '/fonts/HarmonyOS-Sans/HarmonyOS_Sans_TC/HarmonyOS_Sans_Regular.ttf',
    bold: '/fonts/HarmonyOS-Sans/HarmonyOS_Sans_TC/HarmonyOS_Sans_Bold.ttf',
    pdfMakeName: 'HarmonyOSSansTC'
  },
  
  // 霞鹜文楷系列
  'LXGW WenKai': {
    normal: '/fonts/LxgwWenKai/LXGWWenKai-Regular.ttf',
    bold: '/fonts/LxgwWenKai/LXGWWenKai-Medium.ttf',
    pdfMakeName: 'LXGWWenKai'
  },
  'LXGW WenKai Mono': {
    normal: '/fonts/LxgwWenKai/LXGWWenKaiMono-Regular.ttf',
    bold: '/fonts/LxgwWenKai/LXGWWenKaiMono-Medium.ttf',
    pdfMakeName: 'LXGWWenKaiMono'
  },
  'LXGW WenKai GB': {
    normal: '/fonts/LxgwWenkaiGB/LXGWWenKaiGB-Regular.ttf',
    bold: '/fonts/LxgwWenkaiGB/LXGWWenKaiGB-Medium.ttf',
    pdfMakeName: 'LXGWWenKaiGB'
  },
  'LXGW WenKai Mono GB': {
    normal: '/fonts/LxgwWenkaiGB/LXGWWenKaiMonoGB-Regular.ttf',
    bold: '/fonts/LxgwWenkaiGB/LXGWWenKaiMonoGB-Medium.ttf',
    pdfMakeName: 'LXGWWenKaiMonoGB'
  },
  'LXGW WenKai TC': {
    normal: '/fonts/LxgwWenkaiTC/LXGWWenKaiTC-Regular.ttf',
    bold: '/fonts/LxgwWenkaiTC/LXGWWenKaiTC-Medium.ttf',
    pdfMakeName: 'LXGWWenKaiTC'
  },
  'LXGW WenKai Mono TC': {
    normal: '/fonts/LxgwWenkaiTC/LXGWWenKaiMonoTC-Regular.ttf',
    bold: '/fonts/LxgwWenkaiTC/LXGWWenKaiMonoTC-Medium.ttf',
    pdfMakeName: 'LXGWWenKaiMonoTC'
  },
  
  // 晰致尚铭系列
  'LXGW Neo XiHei': {
    normal: '/fonts/LxgwNeoXiHei/LXGWNeoXiHei.ttf',
    bold: '/fonts/LxgwNeoXiHei/LXGWNeoXiHei.ttf',
    pdfMakeName: 'LXGWNeoXiHei'
  },
  'LXGW Neo XiHei Plus': {
    normal: '/fonts/LxgwNeoXiHei/LXGWNeoXiHeiPlus.ttf',
    bold: '/fonts/LxgwNeoXiHei/LXGWNeoXiHeiPlus.ttf',
    pdfMakeName: 'LXGWNeoXiHeiPlus'
  },
  'LXGW ZhiSong': {
    normal: '/fonts/LxgwZhiSong/LXGWZhiSongCL.ttf',
    bold: '/fonts/LxgwZhiSong/LXGWZhiSongMN.ttf',
    pdfMakeName: 'LXGWZhiSong'
  },
  'LXGW Neo ZhiSong': {
    normal: '/fonts/LxgwNeoZhiSong/LXGWNeoZhiSong.ttf',
    bold: '/fonts/LxgwNeoZhiSong/LXGWNeoZhiSong.ttf',
    pdfMakeName: 'LXGWNeoZhiSong'
  },
  'LXGW Neo ZhiSong Plus': {
    normal: '/fonts/LxgwNeoZhiSong/LXGWNeoZhiSongPlus.ttf',
    bold: '/fonts/LxgwNeoZhiSong/LXGWNeoZhiSongPlus.ttf',
    pdfMakeName: 'LXGWNeoZhiSongPlus'
  },
  'LXGW Marker Gothic': {
    normal: '/fonts/LxgwMarkerGothic/LXGWMarkerGothic-Regular.ttf',
    bold: '/fonts/LxgwMarkerGothic/LXGWMarkerGothic-Regular.ttf',
    pdfMakeName: 'LXGWMarkerGothic'
  },
  'LXGW ZhenKai GB': {
    normal: '/fonts/LxgwZhenKai/LXGWZhenKaiGB-Regular.ttf',
    bold: '/fonts/LxgwZhenKai/LXGWZhenKaiGB-Regular.ttf',
    pdfMakeName: 'LXGWZhenKaiGB'
  },
  'LXGW ZhenKai Slab GB': {
    normal: '/fonts/LxgwZhenKai/LXGWZhenKaiSlabGB-Regular.ttf',
    bold: '/fonts/LxgwZhenKai/LXGWZhenKaiSlabGB-Regular.ttf',
    pdfMakeName: 'LXGWZhenKaiSlabGB'
  },
  
  // 小赖字体系列
  'Xiaolai': {
    normal: '/fonts/kose-font/Xiaolai-Regular.ttf',
    bold: '/fonts/kose-font/Xiaolai-Regular.ttf',
    pdfMakeName: 'Xiaolai'
  },
  'Xiaolai Mono': {
    normal: '/fonts/kose-font/XiaolaiMono-Regular.ttf',
    bold: '/fonts/kose-font/XiaolaiMono-Regular.ttf',
    pdfMakeName: 'XiaolaiMono'
  },
  
  // 悠哉字体系列
  'Yozai': {
    normal: '/fonts/yozai-font/Yozai-Regular.ttf',
    bold: '/fonts/yozai-font/Yozai-Medium.ttf',
    pdfMakeName: 'Yozai'
  },
  
  // 阿里巴巴系列
  'Alibaba PuHuiTi': {
    normal: '/fonts/AlibabaPuHuiTi-3-45-Light.ttf',
    bold: '/fonts/AlibabaPuHuiTi-3-45-Light.ttf',
    pdfMakeName: 'AlibabaPuHuiTi'
  },
  'Alimama DaoLiTi': {
    normal: '/fonts/AlimamaDaoLiTi-Regular.ttf',
    bold: '/fonts/AlimamaDaoLiTi-Regular.ttf',
    pdfMakeName: 'AlimamaDaoLiTi'
  },
  'Alimama DongFangDaKai': {
    normal: '/fonts/Alimama_DongFangDaKai_Regular.ttf',
    bold: '/fonts/Alimama_DongFangDaKai_Regular.ttf',
    pdfMakeName: 'AlimamaDongFangDaKai'
  },
  'Alimama FangYuanTi': {
    normal: '/fonts/AlimamaFangYuanTiVF-Thin/AlimamaFangYuanTiVF-Thin.ttf',
    bold: '/fonts/AlimamaFangYuanTiVF-Thin/AlimamaFangYuanTiVF-Thin.ttf',
    pdfMakeName: 'AlimamaFangYuanTi'
  },
  'Alimama Agile': {
    normal: '/fonts/AlimamaAgileVF-Thin/AlimamaAgileVF-Thin.ttf',
    bold: '/fonts/AlimamaAgileVF-Thin/AlimamaAgileVF-Thin.ttf',
    pdfMakeName: 'AlimamaAgile'
  },
  'Alimama ShuHeiTi': {
    normal: '/fonts/AlimamaShuHeiTi-bold/AlimamaShuHeiTi-Bold.ttf',
    bold: '/fonts/AlimamaShuHeiTi-bold/AlimamaShuHeiTi-Bold.ttf',
    pdfMakeName: 'AlimamaShuHeiTi'
  },
  'DingTalk JinBuTi': {
    normal: '/fonts/DingTalkJinBuTi-Regular.ttf',
    bold: '/fonts/DingTalkJinBuTi-Regular.ttf',
    pdfMakeName: 'DingTalkJinBuTi'
  },
  'TaoBao MaiCaiTi': {
    normal: '/fonts/TaoBaoMaiCaiTi-Regular/TaoBaoMaiCaiTi-Regular.ttf',
    bold: '/fonts/TaoBaoMaiCaiTi-Regular/TaoBaoMaiCaiTi-Regular.ttf',
    pdfMakeName: 'TaoBaoMaiCaiTi'
  }
}

// 获取字体映射配置
export const GetFontMapping = (fontValue) => {
  if (!fontValue || fontValue === 'inherit') {
    // 默认使用SourceHanSans
    return { pdfMakeName: 'SourceHanSans' }
  }
  
  const fontName = ExtractFontName(fontValue)
  if (!fontName) {
    return { pdfMakeName: 'SourceHanSans' }
  }
  
  return FontFileMapping[fontName] || { pdfMakeName: 'SourceHanSans' }
}

// 获取pdfmake字体名称
export const GetPdfMakeFontName = (fontValue) => {
  const mapping = GetFontMapping(fontValue)
  return mapping.pdfMakeName || 'SourceHanSans'
}

