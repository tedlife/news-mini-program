const catNameMap = {
  gn: "国内",
  gj: "国际",
  cj: "财经",
  yl: "娱乐",
  js: "军事",
  ty: "体育",
  other: "其他"
}

Page({
  data: {
    type: "gn",
    catNameMap,
    categories: ["gn", "gj", "cj", "yl", "js", "ty", "other"],
    newsList: []
  },
  onLoad() {
    this.getNewsList();
  },
  onPullDownRefresh() {
    this.getNewsList(() => {
      wx.stopPullDownRefresh();
    });
  },
  getNewsList(callback) {
    wx.showLoading({
      title: '加载中'
    })
    
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: this.data.type
      },
      success: res => {
        const result = res.data.result;

        this.setData({
          newsList: result
        })
      },
      complete: () => {
        wx.hideLoading();
        typeof callback === "function" && callback();
      }
    })
  },
  onTapCategory(e) {
    const { cat } = e.currentTarget.dataset;

    if (cat !== this.data.type) {
      this.setData({
        type: cat,
        newsList: []
      }, () => {
        this.getNewsList();
      })
    }
  },
  onTapNews(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?newsId=${id}`
    })
  }
})
