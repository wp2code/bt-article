// pages/article/article.js
var ajax = require('../../utils/ajax.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHaveData: false, //判断是否有明细数据
    articleInfo: {
      create_time: '',
      article_id: '',
      title: '',
      author_name: '',
      pv: 0
    },
    detialList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var article_id = options.article_id;
    var that = this;
    console.log("article_id===>" + article_id);
    ajax.getReq('article_detail', "?article_id=" + article_id, function(res) {
      if (res.code == 'success') {
        var data = res['data'];
        that.setData({
          articleInfo: {
            create_time: data['create_time'],
            article_id: data['id'],
            title: data['title'],
            author_name: data['author_name'],
            pv: data['pv'],
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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
});