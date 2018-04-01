var WxParse = require('../../libs/wxParse/wxParse.js');

Page({
  data: {
    newId: 0,
    detail: {}
  },
  onLoad(options) {
    this.setData({
      newId: options.newId
    })
    this.getNewsDetail();
  },
  getNewsDetail() {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data: {
        id: this.data.newId
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
              date: result.date.substr(0, 10),
              readCount: `阅读 ${result.readCount}`
            }
          })
        } else {
          this.setData({
            detail: {
              title: "获取数据出错！！"
            }
          })
        }
        
      },
      fail: err => {
        console.log(err);
      }
    })
  }
})