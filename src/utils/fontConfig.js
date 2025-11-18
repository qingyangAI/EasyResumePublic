// 字体分组配置
export const fontGroups = [
  {
    name: '默认',
    fonts: [
      { value: 'inherit', label: '默认字体' }
    ]
  },
  {
    name: '系统字体',
    fonts: [
      { value: 'SimSun, 宋体', label: '宋体' },
      { value: 'SimHei, 黑体', label: '黑体' },
      { value: 'Microsoft YaHei, 微软雅黑', label: '微软雅黑' },
      { value: 'FangSong, 仿宋', label: '仿宋' },
      { value: 'KaiTi, 楷体', label: '楷体' }
    ]
  },
  {
    name: '英文字体',
    fonts: [
      { value: 'Arial, sans-serif', label: 'Arial' },
      { value: 'Times New Roman, serif', label: 'Times New Roman' },
      { value: 'Courier New, monospace', label: 'Courier New' }
    ]
  },
  {
    name: 'Noto Sans 系列',
    fonts: [
      { value: "'Noto Sans SC', 思源黑体简体中文", label: 'Noto Sans SC（思源黑体简体中文）' }
    ]
  },
  {
    name: 'HarmonyOS Sans 系列',
    fonts: [
      { value: "'HarmonyOS Sans SC', 华为鸿蒙字体简体中文", label: 'HarmonyOS Sans SC（华为鸿蒙字体简体中文）' },
      { value: "'HarmonyOS Sans TC', 华为鸿蒙字体繁体中文", label: 'HarmonyOS Sans TC（华为鸿蒙字体繁体中文）' }
    ]
  },
  {
    name: '霞鹜文楷系列',
    fonts: [
      { value: "'LXGW WenKai', 霞鹜文楷", label: '霞鹜文楷' },
      { value: "'LXGW WenKai Mono', 霞鹜文楷等宽", label: '霞鹜文楷等宽' },
      { value: "'LXGW WenKai GB', 霞鹜文楷GB", label: '霞鹜文楷GB' },
      { value: "'LXGW WenKai Mono GB', 霞鹜文楷GB等宽", label: '霞鹜文楷GB等宽' },
      { value: "'LXGW WenKai TC', 霞鹜文楷TC", label: '霞鹜文楷TC（繁体）' },
      { value: "'LXGW WenKai Mono TC', 霞鹜文楷TC等宽", label: '霞鹜文楷TC等宽（繁体）' }
    ]
  },
  {
    name: '晰致尚铭系列',
    fonts: [
      { value: "'LXGW Neo XiHei', 霞鹜新晰黑", label: '霞鹜新晰黑' },
      { value: "'LXGW Neo XiHei Plus', 霞鹜新晰黑 Plus", label: '霞鹜新晰黑 Plus' },
      { value: "'LXGW ZhiSong', 霞鹜致宋", label: '霞鹜致宋' },
      { value: "'LXGW Neo ZhiSong', 霞鹜新致宋", label: '霞鹜新致宋' },
      { value: "'LXGW Neo ZhiSong Plus', 霞鹜新致宋 Plus", label: '霞鹜新致宋 Plus' },
      { value: "'LXGW Marker Gothic', 霞鹜漫黑", label: '霞鹜漫黑' },
      { value: "'LXGW ZhenKai GB', 霞鹜臻楷GB", label: '霞鹜臻楷GB' },
      { value: "'LXGW ZhenKai Slab GB', 霞鹜臻楷SlabGB", label: '霞鹜臻楷SlabGB' }
    ]
  },
  {
    name: '小赖字体系列',
    fonts: [
      { value: "'Xiaolai', 小赖字体", label: '小赖字体' },
      { value: "'Xiaolai Mono', 小赖字体等宽", label: '小赖字体等宽' }
    ]
  },
  {
    name: '悠哉字体系列',
    fonts: [
      { value: "'Yozai', 悠哉字体", label: '悠哉字体' }
    ]
  },
  {
    name: '阿里巴巴系列',
    fonts: [
      { value: "'Alibaba PuHuiTi', 阿里巴巴普惠体", label: '阿里巴巴普惠体' },
      { value: "'Alimama DaoLiTi', 阿里妈妈刀隶体", label: '阿里妈妈刀隶体' },
      { value: "'Alimama DongFangDaKai', 阿里妈妈东方大楷", label: '阿里妈妈东方大楷' },
      { value: "'Alimama FangYuanTi', 阿里妈妈方圆体", label: '阿里妈妈方圆体' },
      { value: "'Alimama Agile', 阿里妈妈灵动体", label: '阿里妈妈灵动体' },
      { value: "'Alimama ShuHeiTi', 阿里妈妈数黑体", label: '阿里妈妈数黑体' },
      { value: "'DingTalk JinBuTi', 钉钉进步体", label: '钉钉进步体' },
      { value: "'TaoBao MaiCaiTi', 淘宝买菜体", label: '淘宝买菜体' }
    ]
  },
]

// 扁平化字体选项（用于向后兼容）
export const fontOptions = fontGroups.flatMap(group => group.fonts)

