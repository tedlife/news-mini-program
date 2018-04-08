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
        const newResult = result.map(item => ({
          ...item,
          date: item.date.substr(0, 10),
          source: item.source ? item.source : '未知来源'
        }))

        this.setData({
          newsList: newResult
        })
      },
      complete: () => {
        wx.hideLoading();
        callback && callback();
      }
    })
  },
  onTapCategory(e) {
    const { cat } = e.currentTarget.dataset;
    this.setData({
      type: cat,
      newsList: []
    }, () => {
      this.getNewsList();
    })
  },
  onTapNews(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?newsId=${id}`
    })
  }
})
