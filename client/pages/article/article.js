// pages/article/article.js
var ajax = require('../../utils/ajax.js');
var util = require('../../utils/util.js');
//获取应用实例

Page({
  /**
   * 页面的初始数据
   */
  data: {
    dialog: {

    },
    isOwn: false,
    articleInfo: {
      create_time: '',
      id: '',
      title: '',
      author_name: '',
      pv: 0,
      detailList: [],
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    var article_id = options.artId;
    var isOwn = options.isOwn == 'y';
    var that = this;
    console.log("article_id===>" + article_id);
    ajax.getReq('article_detail', "article_id=" + article_id, function(res) {
      if (res.code == 1) {
        var data = res['data'];
        // console.log(data);
        that.setData({
          isOwn: isOwn,
          articleInfo: {
            create_time: util.formatTime(data['create_time'], 'Y/M/D'),
            id: data['id'],
            title: data['title'],
            author_name: data['author_name'],
            pv: data['pv'],
            detailList: data['detailList'],
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let app = getApp();
    // toast组件实例
    new app.MenuPannel();
    // this.dialog = this.selectComponent("#confirmDialog");
    // console.log(this.dialog);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '这是小文章~~',
      path: '/page/article/article',
      success:function(result){
        console.log(result);
      }
    }
  },
  // showDialog: function(e) {
  //   this.dialog.showDialog(e, 'fdfd');
  // },
  // 触发toast组件
  showConfirmEvent: function(e) {
    var dialog = {
      content: '文档',
      title: '我的标题1',
    }
    this.showConfirm(dialog);
  },
  //取消事件
  _cancelDialogEvent: function() {
    console.log(this);
    console.log('你点击了取消');
    this.closeDialog();
  },
  //确认事件
  _confirmDialogEvent: function() {
    console.log('你点击了确定');
    this.closeDialog();
  },
  showMenuDialogEvent: function(event) {
    var artid = event.currentTarget.dataset.artid; //文章信息主键
    var dialog = {
      menuNodes: [{
          iconPath: '../images/edit.png',
          content: '编辑',
          openType: 'redirect',
          url: './save?opt=own&artid=' + artid
        },
        {
          iconPath: '../images/del.png',
          content: "删除",
          contentClass: "del-text", // 样式  components/toastDialog .wxss 
          funcName: 'delArticle', //点击函数
          funcParams: { //参数
            artid: artid
          }
        },
        {
          iconPath: '../images/vist.png',
          content: '权限设置',
          openType: 'navigate',
          url: './visit?artid=' + artid
        }
      ],
    }
    console.log(dialog);
    this.showMenuDialog(dialog);
  },
  delArticle: function(event) {
    var params = event.currentTarget.dataset.params;
    console.log(params);
    //清一下缓存
    wx.removeStorageSync("detailList");
    wx.removeStorageSync("articleInfo");
    if (params['artid']) {
      ajax.delReq("article_del", "article_id=" + params['artid'], function(res) {
        if (res.code == 1) {
          wx.switchTab({
            url: '/pages/own/own',
          })
        }
      })
    }
  },
  queryMore: function() { //发现更多
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
});