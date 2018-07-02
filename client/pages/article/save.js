// pages/article/save.js
var ajax = require('../../utils/ajax.js')
var util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleInfo: {
      article_id: '',
      title: null,
      author_name: ''
    },
    detialList: [],
    windowHeight: app.globalData.windowHeight,
    windowWidth: app.globalData.windowWidth,
    isHaveData: false, //判断是否有数据
    toView: '_'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var article_id = options.article_id;
    var that = this;
    console.log("article_id===>" + article_id)
    ajax.getReq('article_detail', "?article_id=" + article_id, function(res) {
      if (res.code == 'success') {
        var data = res['data'];
        that.setData({
          articleInfo: {
            article_id: data['id'],
            title: data['title'],
            author_name: data['author_name'],

          },
          detialList: data['detialList'],
          isHaveData: data['detialList'].length > 0,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  onCancel: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

    console.log("页面隐藏。。。")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    var pages = getCurrentPages();
    var prevPage1 = pages[pages.length - 1]; //上一页面
    var prevPage2 = pages[pages.length - 2]; //上一页面
    wx.navigateBack({
      delta: 1
    })
  },
  upper: function(e) {
    console.log(e)
  },
  lower: function(e) {
    console.log(e)
    console.log("到底触发")
    console.log(this.data.windowHeight);
    // this.data.windowHeight = this.data.windowHeight + this.data.scrollTop
    console.log(this.data.windowHeight);
    var detialList = this.data.articleInfo['detialList'];
    var index = detialList.length - 1;
    console.log(index);
    this.setData({
      toView: '_' + index,
    })
    console.log(this.data.toView);
    // if (e.detail.scrollTop < this.data.scrollTop) {

    //   this.data.windowHeight = windowHeight+ this.data.scrollTop;
    // }
  },
  scroll: function(e) {
    // this.setData({
    //   toView: '_1',
    // })
    console.log(e)
    console.log("滚动触发")
  },
  refresh: function() { // 函数式触发开始下拉刷新。如可以绑定按钮点击事件来触发下拉刷新
    wx.startPullDownRefresh({
      success(errMsg) {
        console.log('开始下拉刷新', errMsg)
      },
      complete() {
        console.log('下拉刷新完毕')
      }
    })
  },
  deleteArt: function(event) {
    var detail_id = event.currentTarget.dataset.detailid;
    var that = this;
    ajax.delReq("article_detail_del", "?detail_id=" + detail_id, function(res) {
      console.log(res);
      var list = that.data.detialList;
      var newList = [];
      if (list.length > 0) {
        for (var i = 0; i < list.length; i++) {
          if (list[i].id !== detail_id) {
            newList.push(list[i])
          }
        }
      }
      console.log(newList);
      that.setData({
        detialList: newList,
      })
    })
    console.log(this.data.articleInfo.detialList);
  },
  addArt: function(event) {
    var id = event.currentTarget.dataset.bindviewid;
    var artid = event.currentTarget.dataset.artid;
    console.log('当前id==' + id)
    wx.showActionSheet({
      itemList: ['文字', '图片'],
      itemColor: "#00abff",
      success: function(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          util.navigateTo('./create?artId=' + artid);
        } else if (res.tapIndex == 1) {
          wx.chooseImage({
            count: 2, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths
              console.log(tempFilePaths);
            }
          })
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  }
})