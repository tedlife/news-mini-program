const WxParse = require('../../libs/wxParse/wxParse.js');

Page({
  data: {
    newsId: 0,
    detail: {}
  },
  onLoad(options) {
    this.setData({
      newsId: options.newsId
    }, () => {
      this.getNewsDetail();
    })
  },
  getNewsDetail() {
    wx.showLoading({
      title: '加载中'
    })

    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data: {
        id: this.data.newsId
      },
      success: res => {
        const result = res.data.result;

        if (result) {
          const contentHtml = result.content.map(element => {
            switch (element.type) {
              case "image":
                return `<img src="${element.src}">`;
              default:
                return `<${element.type}>${element.text}</${element.type}>`;
            }
          }).join("");

          WxParse.wxParse('article', 'html', contentHtml, this, 5);

          this.setData({
            detail: {
              ...result,
              readCount: `阅读 ${result.readCount}`
            }
          })
        } else {
          const { code, message } = res.data;
          this.setData({
            detail: {
              title: `${code}：${message}`
            }
          })
        }
      },
      fail: err => {
        console.log("err: ", err);
      },
      complete: res => {
        wx.hideLoading();
        console.log("res: ", res);
      }
    })
  }
})