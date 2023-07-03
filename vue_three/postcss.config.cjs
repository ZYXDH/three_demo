module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        "Android 4.1",
        "iOS 7.1",
        "Chrome > 31",
        "ff > 31",
        "ie >= 8",
        "last 10 versions", // 所有主流浏览器最近10版本用
      ],
      grid: true,
    },
    'postcss-pxtorem': {
      rootValue ({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      // Vant 官方根字体大小是 37.5
      propList: ['*'],
      unitPrecision: 5,
      selectorBlackList: ['.norem'],// 过滤掉.norem-开头的class，不进行rem转换
      mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
      minPixelValue: 3, //设置要替换的最小像素值 (3px会被转rem), 默认 0。
    }
  }
}
