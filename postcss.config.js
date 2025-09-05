export default {
  plugins: {
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true
      }
    },
    'autoprefixer': {
      overrideBrowserslist: [
        'Chrome >= 35',
        'Firefox >= 38',
        'Edge >= 12',
        'Explorer >= 10',
        'iOS >= 8',
        'Safari >= 8',
        'Android 2.3',
        'Android >= 4',
        'Opera >= 12'
      ]
    },
    'postcss-px-to-viewport': {
      // 移动端设计稿宽度，iPhone 6/7/8 为375px
      viewportWidth: 375,
      // 移动端设计稿高度
      viewportHeight: 667,
      // 转换的单位精度
      unitPrecision: 5,
      // 指定需要转换的CSS属性，* 代表全部css属性的单位都进行转换
      propList: ['*'],
      // 指定不转换为视口单位的类，排除Vant组件的类名
      selectorBlackList: ['.ignore-vw', '.van-'],
      // 小于或等于1px不转换为视口单位
      minPixelValue: 1,
      // 在媒体查询的css代码中也进行转换
      mediaQuery: true,
      // 直接更换属性值，而不添加备用属性
      replace: true,
      // 忽略node_modules下的文件
      exclude: [/node_modules/],
      // 转换指定文件
      include: undefined,
      // 处理横屏情况
      landscape: false,
      // 横屏时的宽度
      landscapeWidth: 667
    }
  }
}
