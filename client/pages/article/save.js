// pages/article/save.js
var ajax = require('../../utils/ajax.js')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    letterInfo: {
      letter_id: '',
      title: '',
      cover_pic: '',
      author_name: '',
      content: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var letter_id = options.letter_id;
    var that = this;
    ajax.getReq('letter_detail', "?letter_id=" + letter_id, function(res) {
      if (res.code == 'success') {
        var data = res['data'];
        that.setData({
          letterInfo: {
            letter_id: '',
            title: data['title'],
            cover_pic: data['cover_pic'],
            author_name: data['author_name'],
            content: data['content']
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
    console.log("页面卸载。。。")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})