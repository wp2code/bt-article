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
      title: '',
      author_name: '',
      cover_pic_url: '',
      detialList: []
    },
    detialList: [],
    windowHeight: app.globalData.windowHeight,
    windowWidth: app.globalData.windowWidth,
    toView: '_',
    nextPageFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("save onLoad.......")
    // ajax.getReq('article_detail', "?article_id=" + article_id, function(res) {
    //   if (res.code == 'success') {
    //     var data = res['data'];
    //     that.setData({
    //       articleInfo: {
    //         article_id: data['id'],
    //         title: data['title'],
    //         author_name: data['author_name'],

    //       },
    //       detialList: data['detialList'],
    //       isHaveData: data['detialList'].length > 0,
    //     })
    //   }
    // })
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
    console.log("save onShow...")
    console.log("--------detialList--------");
    var detialList = wx.getStorageSync("detialList") || this.data.detialList;
    console.log(detialList);
    console.log("--------articleInfo--------");
    var articleInfo = wx.getStorageSync("articleInfo") || this.data.articleInfo;
    console.log(articleInfo);
    var editInfo = wx.getStorageSync("editInfo");
    if (editInfo) {
      if (editInfo.textIdentify == 0) { //文本
        if (detialList && detialList.length > 0 && editInfo.optType == 1) {
          detialList[editInfo.index]['content'] = editInfo.content;
        } else {
          var newDetail = {
            id: '',
            content: editInfo.content,
            pictrue_url: ''
          };
          detialList.splice(editInfo.index, 0, newDetail);
        }
        wx.setStorageSync("detialList", detialList);
      } else if (editInfo.textIdentify == 1) { //标题
        articleInfo['title'] = editInfo.content;
        wx.setStorageSync("articleInfo", articleInfo);
      }
    }
    this.setData({
      articleInfo: articleInfo,
      detialList: wx.getStorageSync("detialList")
    })
    //删除编辑的缓存
    wx.removeStorageSync("editInfo");
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
    console.log("onUnload");
    if (this.data.nextPageFlag == 0) {
      wx.showModal({
        title: '退出编辑页',
        content: '是否保存当前内容为草稿?',
        confirmText: "保存草稿",
        cancelText: "不保存",
        success: function(res) {
          if (res.confirm) {
            console.log("保存")
          } else if (res.cancel) {
            wx.removeStorageSync("detialList");
            wx.removeStorageSync("articleInfo");
            console.log("不保存");
          }
        }
      })
    }

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
    // var detialList = this.data.articleInfo['detialList'];
    // var index = detialList.length - 1;
    // console.log(index);
    // this.setData({
    //   toView: '_' + index,
    // // })
    // console.log(this.data.toView);
  },
  scroll: function(e) {
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
  editTitle: function(event) {
    this.setData({
      nextPageFlag: -1
    })
    var title = event.target.dataset.title || '';
    var editInfo = {
      textIdentify: 1,
      optType: 1,
      index: 0,
      content: title
    }
    wx.setStorageSync("editInfo", editInfo);
    util.redirectTo('./create');
  },
  editDetail: function(event) {
    this.setData({
      nextPageFlag: -1
    })
    var dataSet = event.target.dataset;
    var index = dataSet.index;
    var content = dataSet.content;
    var editInfo = {
      textIdentify: 0,
      optType: 1,
      index: index,
      content: content
    }
    wx.setStorageSync("editInfo", editInfo);
    util.redirectTo('./create');
  },
  deleteDetail: function(event) {
    var index = event.currentTarget.dataset.index;
    var detialList = wx.getStorageSync("detialList");
    var that = this;
    wx.showModal({
      content: "确定删除此段？" + index,
      success: function(res) {
        if (res.confirm) {
          console.log(detialList);
          detialList.splice(index, 1);
          console.log(detialList);
          that.setData({
            detialList: detialList
          })
          wx.setStorageSync("detialList", detialList);
        } else if (res.cancel) {}
      }
    })
  },
  addDetail: function(event) {
    var index = event.currentTarget.dataset.index; //位置索引从0开始
    var artid = event.currentTarget.dataset.artid; //文章信息主键
    console.log('当前新增索引==' + index)
    this.setData({
      nextPageFlag: -1
    })
    var that = this;
    wx.showActionSheet({
      itemList: ['文字', '图片'],
      itemColor: "#00abff",
      success: function(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) { //新增文字
          var editInfo = {
            textIdentify: 0,
            optType: 0,
            index: index, //最上一个新增 索引是0，其他的索引要减1
            content: ''
          }
          wx.setStorageSync("editInfo", editInfo);
          util.redirectTo('./create');
        } else if (res.tapIndex == 1) { //新增图片
          wx.chooseImage({
            count: 9, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths
              console.log(tempFilePaths);
              var detialList = [];
              for (var i = 0, h = tempFilePaths.length; i < h; i++) {
                var item = {};
                item.pictrue_url = tempFilePaths[i];
                item.article_id = artid;
                detialList.push(item);
              }
              that.setData({
                detialList: detialList
              })
            }
          })
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },
  changeImage: function(event) {
    var index = event.currentTarget.dataset.index; //位置索引从0开始
    var that = this;
    console.info("changeImage==" + index)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        var detialList = wx.getStorageSync("detialList");
        var tempFilePath = res.tempFilePaths[0]
        console.log(tempFilePath);
        detialList[index]['pictrue_url'] = tempFilePath;
        var articleInfo = wx.getStorageSync("articleInfo");
        if (articleInfo.cover_pic_url == '') {
          articleInfo.cover_pic_url = tempFilePath;
        }
        that.setData({
          detialList: detialList,
          articleInfo: articleInfo
        })
        console.log(that.data.detialList);
        console.log(that.data.articleInfo);
        wx.setStorageSync("articleInfo", articleInfo);
        wx.setStorageSync("detialList", detialList);
      }
    })
  },
  onFormSubmit: function(e) {
    var articleInfo = wx.getStorageSync("articleInfo") || {};
    articleInfo.detialList = wx.getStorageSync("detialList") || [];
    ajax.postReq('article_create', articleInfo, function(res) {
      if (res.code == 1) {
        util.redirectTo('../own/own');
      }
    })
  }
})