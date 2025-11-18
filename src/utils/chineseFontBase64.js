// 中文字体base64数据
// 注意：完整的中文字体文件很大（几MB），这里提供一个基础方案
// 如果需要完整的中文支持，需要下载字体文件并转换为base64

// 方案1：使用CDN加载字体（推荐，但需要网络）
// 方案2：使用本地字体文件（需要下载并转换）
// 方案3：使用轻量级字体子集（文件较小，但字符集有限）

// 这里提供一个占位符，实际使用时需要：
// 1. 下载思源黑体字体文件（推荐使用子集版本）
// 2. 使用pdfmake的字体转换工具转换为base64
// 3. 将base64数据替换下面的占位符

// 字体转换工具：https://github.com/bpampuch/pdfmake/tree/master/examples/fonts
// 或者使用在线工具：https://pdfmake.github.io/docs/fonts/custom-fonts-client-side/

export const SourceHanSansRegular = '' // 这里填入字体的base64数据
export const SourceHanSansBold = '' // 这里填入字体的base64数据

// 使用说明：
// 1. 下载思源黑体字体文件（.ttf格式）
// 2. 访问 https://pdfmake.github.io/docs/fonts/custom-fonts-client-side/
// 3. 上传字体文件，获取base64数据
// 4. 将base64数据填入上面的变量
// 5. 在 pdfMakeConfig.js 中使用这些字体数据

