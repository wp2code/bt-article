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
      author_name: ''
    },
    textContent: '', //文本内容
    textIdentify: 0, //编辑类型 0:文本：1：标题,
    index: -1, //集合索引
    detialList: [],
    detailInfo: {
      index: -1,
      content: '',
    },
    windowHeight: app.globalData.windowHeight,
    windowWidth: app.globalData.windowWidth,
    toView: '_'
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
    // var pages = getCurrentPages();
    // var prevPage = pages[pages.length - 2]; // 上一页面
    // var textIdentify = "";
    // var textContent = "";
    // console.log(prevPage);
    console.log("--------detialList--------");
    var detialList = wx.getStorageSync("detialList");
    console.log(detialList);
    console.log("--------articleInfo--------");
    var articleInfo = wx.getStorageSync("articleInfo");
    console.log(articleInfo);
    this.setData({
      articleInfo: articleInfo,
      detialList: detialList
    })
    // if (prevPage.__route__ == "pages/article/create") {
    //   if (prevPage.data.textContent != undefined) {
    //     textContent = prevPage.data.textContent;
    //     console.log("textContent==" + textContent);
    //   }
    //   if (prevPage.data.textIdentify != undefined) {
    //     textIdentify = prevPage.data.textIdentify;
    //     console.log("textIdentify==" + textIdentify);
    //     if (textContent != "") {
    //       if (textIdentify == 1) {
    //         articleInfo.title = textContent;
    //         this.setData({
    //           articleInfo: articleInfo,
    //           detialList: detialList
    //         })
    //       } else if (textIdentify == 0) {
    //         var index = prevPage.data.index;
    //         var item = {};
    //         if (detialList.length <= 0) {
    //           item.content = textContent;
    //           this.data.index = 0;
    //           item.picture_url = '';
    //           item.id = '';
    //           detialList.push(item)
    //         } else {
    //           item = detialList[index];
    //           item.content = textContent;
    //           detialList[index] = item;
    //         }
    //         this.setData({
    //           articleInfo: articleInfo,
    //           detialList: detialList
    //         })
    //       }
    //     }
    //   }
    // }
    // wx.setStorageSync("detialList", this.data.detialList);
    // wx.setStorageSync("articleInfo", this.data.articleInfo);
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
    wx.showModal({
      title: '退出编辑',
      content: '是否保存当前内容为草稿?',
      confirmText: "保存草稿",
      cancelText: "不保存",
      success: function(res) {
        if (res.confirm) {
          console.log("保存")
        } else if (res.cancel) {
          wx.removeStorageSync("detialList");
          wx.removeStorageSync("articleInfo");
          console.log("不保存")
          util.redirectTo('../produce/produce');
        }

      }
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
      textIdentify: 1
    })
    util.navigateTo('./create');
  },
  editContent: function(event) {
    var index = event.currentTarget.dataset.index;
    var content = event.currentTarget.dataset.content;
    this.setData({
      textIdentify: 0,
      detailInfo: {
        index: index,
        content: content
      }
    })
    util.navigateTo('./create');
  },
  deleteArt: function(event) {
    var detail_id = event.currentTarget.dataset.detailid;
    var index = event.currentTarget.dataset.index;
    var detialList = wx.getStorageSync("detialList");
    var articleInfo = wx.getStorageSync("articleInfo");
    if (detail_id != '') {
      var that = this;
      ajax.delReq("article_detail_del", "?detail_id=" + detail_id, function(res) {
        console.log(res);
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
          articleInfo: articleInfo,
          detialList: newList,
        })
      })
    } else {
      var that=this;
      wx.showModal({
        content: "确定删除此段2？",
        success: function(res) {
          if (res.confirm) {
            detialList.pop("index============"+index);
            console.log(detialList);
            detialList.pop(index);
            console.log(detialList);
            that.setData({
              articleInfo: articleInfo,
              detialList: detialList
            })
          } else if (res.cancel) {}
        }
      })
    }
    wx.setStorageSync("detialList", detialList);
  },
  addArt: function(event) {
    var id = event.currentTarget.dataset.bindviewid;
    var artid = event.currentTarget.dataset.artid;
    console.log('当前id==' + id)
    var that = this;
    wx.showActionSheet({
      itemList: ['文字', '图片'],
      itemColor: "#00abff",
      success: function(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          that.data.textIdentify = 0;
          util.navigateTo('./create');
        } else if (res.tapIndex == 1) {
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
                item.picture_url = tempFilePaths[i];
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
  }
})