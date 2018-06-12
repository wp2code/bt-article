//index.js
//获取应用实例
const app = getApp()
var ajax = require('../../utils/ajax.js')
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    artItems: [{
      diary_id: 1,
      title: "模板1",
      title_pic: null
    }],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // var params = {}
    // var userInfo = wx.getStorageSync('userInfo');
    // params.open_id = userInfo != null ? userInfo.nickName : ''
    var that=this;
    ajax.postReq("diary_query", null, function (res) {
      that.setData({
        artItems: res
      })
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    ajax.postReq("diary_query", null, function (res) {
      that.setData({
        artItems: res
      })
    })
    console.log("当前页面 " + this.route)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {

  // },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // return {
    //   title: '自定义转发标题',
    //   path: '/pages/index/index'
    // }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
