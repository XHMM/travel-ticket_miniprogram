App({
  data :{
    url: '',
    token: ''
  },
  // app.ts的内容无论小程序是何种打开方式都会被执行，比如扫码打开指定页面
  async onLaunch(options) {
    this.data.url = 'http://localhost:8081/graphql'
  }
})