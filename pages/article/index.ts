Page({
  data:{

  },
  onLoad(options) {
    this.setData({
      url: decodeURIComponent(options.url)
    })
  }
})
