// pages/article/save.js
var ajax = require('../../utils/ajax.js');
var util = require('../../utils/util.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    opt: '',
    articleInfo: {
      article_id: '',
      title: '',
      author_name: '',
      cover_pic_url: '',
      detailList: []
    },
    detailList: [],
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
    var opt = options.opt;
    var article_id = options.artid;
    if (opt == 'own') {
      this.setData({
        opt: opt,
      })
      //更改标题
      wx.setNavigationBarTitle({
        title: '编辑文章'
      })
      var that = this;
      ajax.getReq('article_detail', "article_id=" + article_id, function(res) {
        if (res.code == 1) {
          var data = res['data'];
          console.log(data);
          that.setData({
            articleInfo: data,
            detailList: data['detailList']
          })
          //放入缓存
          wx.setStorageSync("articleInfo", that.data.articleInfo);
          wx.setStorageSync("detailList", that.data.detailList);
        }
      })
    } else {
      wx.setNavigationBarTitle({
        title: '新建文章'
      })
    }

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
    console.log("save onShow...");
    console.log("--------detailList--------");
    var detailList = wx.getStorageSync("detailList") || this.data.detailList;
    console.log(detailList);
    console.log("--------articleInfo--------");
    var articleInfo = wx.getStorageSync("articleInfo") || this.data.articleInfo;
    let pages = getCurrentPages();
    let curPage = pages[pages.length - 2];
    var opt = "";
    if (curPage.route == "pages/own/own") {
      opt = "own";
      //更改标题
      wx.setNavigationBarTitle({
        title: '编辑文章'
      })
    }
    console.log(pages)
    console.log(articleInfo);
    var editInfo = wx.getStorageSync("editInfo");
    if (editInfo) {
      if (editInfo.textIdentify == 0 && editInfo.content) { //文本
        if (detailList && detailList.length > 0 && editInfo.optType == 1) {
          detailList[editInfo.index]['content'] = editInfo.content;
        } else {
          var newDetail = {
            id: '',
            content: editInfo.content || '',
            picture_url: ''
          };
          detailList.splice(editInfo.index, 0, newDetail);
        }
        wx.setStorageSync("detailList", detailList);
      } else if (editInfo.textIdentify == 1) { //标题
        articleInfo['title'] = editInfo.content || '';
        wx.setStorageSync("articleInfo", articleInfo);
      }
    }
    this.setData({
      opt: opt,
      articleInfo: articleInfo,
      detailList: detailList
    });
    //删除编辑的缓存
    wx.removeStorageSync("editInfo");
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log("页面隐藏onHide。。。")
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log("页面卸载onUnload。。。");
    console.log(this.data.detailList)
    if (this.data.nextPageFlag == 0) {
      var detailList = wx.getStorageSync("detailList");
      if (detailList.length > 0) {
        var that = this;
        wx.showModal({
          title: '退出编辑页',
          content: this.data.opt == 'own' ? '是否保存当前编辑内容?' : '是否保存当前内容为草稿?',
          confirmText: this.data.opt == 'own' ? '保存编辑' : "保存草稿",
          cancelText: "不保存",
          success: function(res) {
            if (res.confirm) {
              console.log("保存")
              if (that.data.opt == 'own') {
                //更新内容
              } else {
                //保存草稿
                var articleInfo = wx.getStorageSync("articleInfo") || {};
                articleInfo.status = 0;
                articleInfo.detailList = detailList;
                ajax.postReq('article_create', articleInfo, function(res) {
                  if (res.code == 1) {
                    wx.switchTab({
                      url: '/pages/own/own'
                    })
                  }
                }, '保存草稿...')
              }
            } else if (res.cancel) {
              console.log("不保存");
              wx.removeStorageSync("detailList");
              wx.removeStorageSync("articleInfo");
            }

          }
        })
      } else {
        wx.removeStorageSync("detailList");
        wx.removeStorageSync("articleInfo");
      }
    } else if (this.data.nextPageFlag == -2) { //跳转到我的 要删除缓存
      wx.removeStorageSync("detailList");
      wx.removeStorageSync("articleInfo");
    }

  },
  upper: function(e) {
    console.log(e)
  },
  lower: function(e) {
    console.log(e);
    console.log("到底触发");
    console.log(this.data.windowHeight);
    // this.data.windowHeight = this.data.windowHeight + this.data.scrollTop
    console.log(this.data.windowHeight);
    // var detailList = this.data.articleInfo['detailList'];
    // var index = detailList.length - 1;
    // console.log(index);
    // this.setData({
    //   toView: '_' + index,
    // // })
    // console.log(this.data.toView);
  },
  scroll: function(e) {
    console.log(e);
    console.log("滚动触发")
  },
  refresh: function() { // 函数式触发开始下拉刷新。如可以绑定按钮点击事件来触发下拉刷新
    // wx.startPullDownRefresh({
    //   success(errMsg) {
    //     console.log('开始下拉刷新', errMsg)
    //   },
    //   complete() {
    //     console.log('下拉刷新完毕')
    //   }
    // })
  },
  editTitle: function(event) { //编辑标题
    this.setData({
      nextPageFlag: -1
    });
    var title = event.currentTarget.dataset.title || '';
    var editInfo = {
      textIdentify: 1,
      optType: 1,
      index: 0,
      content: title
    };
    wx.setStorageSync("editInfo", editInfo);
    util.redirectTo('./create');
  },
  editDetail: function(event) { //编辑明细
    this.setData({
      nextPageFlag: -1
    });
    var index = event.currentTarget.dataset.index;
    var content = event.currentTarget.dataset.content || '';
    var editInfo = {
      textIdentify: 0,
      optType: 1,
      index: index,
      content: content
    };
    wx.setStorageSync("editInfo", editInfo);
    util.redirectTo('./create');
  },
  deleteDetail: function(event) { //删除明细
    var index = event.currentTarget.dataset.index;
    var detailList = wx.getStorageSync("detailList");
    var that = this;
    wx.showModal({
      content: "确定删除？",
      success: function(res) {
        if (res.confirm) {
          console.log(detailList);
          detailList.splice(index, 1);
          console.log(detailList);
          that.setData({
            detailList: detailList
          });
          wx.setStorageSync("detailList", detailList);
        } else if (res.cancel) {}
      }
    })
  },
  addDetail: function(event) { //新增明细
    var index = event.currentTarget.dataset.index; //位置索引从0开始
    var artid = event.currentTarget.dataset.artid; //文章信息主键
    console.log('当前新增索引==' + index);
    this.setData({
      nextPageFlag: -1
    });
    var that = this;
    wx.showActionSheet({
      itemList: ['文字', '图片'],
      itemColor: "#00abff",
      success: function(res) {
        console.log(res.tapIndex);
        if (res.tapIndex == 0) { //新增文字
          var editInfo = {
            textIdentify: 0,
            optType: 0,
            index: index, //最上一个新增 索引是0，其他的索引要减1
            content: ''
          };
          wx.setStorageSync("editInfo", editInfo);
          util.redirectTo('./create');
        } else if (res.tapIndex == 1) { //新增图片
          wx.chooseImage({
            count: 9, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths;
              console.log(tempFilePaths);
              var detailList = [];
              for (var i = 0, h = tempFilePaths.length; i < h; i++) {
                var item = {};
                item.picture_url = tempFilePaths[i];
                item.article_id = artid;
                detailList.push(item);
              }
              that.setData({
                detailList: detailList
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
  changeCoverPic: function(event) {
    var that=this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        var articleInfo = wx.getStorageSync("articleInfo") || that.data.articleInfo;
        var tempFilePath = res.tempFilePaths[0];
        console.log(tempFilePath);
        // if (articleInfo.cover_pic_url == '') {
        articleInfo.cover_pic_url = tempFilePath;
        // }
        that.setData({
          articleInfo: articleInfo
        });
        wx.setStorageSync("articleInfo", articleInfo);
      }
    })

  },
  changeImage: function(event) { //明细变更图片
    var index = event.currentTarget.dataset.index; //位置索引从0开始
    var that = this;
    console.info("changeImage==" + index);
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        var detailList = wx.getStorageSync("detailList");
        var articleInfo = wx.getStorageSync("articleInfo") || that.data.articleInfo;
        var tempFilePath = res.tempFilePaths[0];
        console.log(tempFilePath);
        detailList[index]['picture_url'] = tempFilePath;
        // if (articleInfo.cover_pic_url == '') {
        articleInfo.cover_pic_url = tempFilePath;
        // }
        that.setData({
          detailList: detailList,
          articleInfo: articleInfo
        });
        console.log(that.data.articleInfo);
        console.log(that.data.detailList);
        wx.setStorageSync("articleInfo", articleInfo);
        wx.setStorageSync("detailList", detailList);
      }
    })
  },
  del: function(event) {
    var artid = event.currentTarget.dataset.artid;
    //清一下缓存
    wx.removeStorageSync("detailList");
    wx.removeStorageSync("articleInfo");
    ajax.delReq("article_del", "article_id=" + artid, function(res) {
      if (res.code == 1) {
        wx.switchTab({
          url: '/pages/own/own',
        })
      }
    })
  },
  save: function(event) { //提交数据
    var status = event.currentTarget.dataset.status;
    console.log("status=====" + status);
    if (status != 0 && status != 1) return;
    var articleInfo = wx.getStorageSync("articleInfo") || {};
    articleInfo.status = status;
    articleInfo.detailList = wx.getStorageSync("detailList") || [];
    var that = this;
    if (articleInfo.detailList.length > 0) {
      ajax.postReq('article_create', articleInfo, function(res) {
        that.setData({
          nextPageFlag: -2
        });
        if (res.code == 1) {
          wx.switchTab({
            url: '/pages/own/own'
          })
        }
      }, status == 0 ? "保存草稿..." : "正在发布...")
    } else {
      wx.showToast({
        title: '没找到你的文章内容哦~^-^',
        icon: 'none',
        duration: 2000
      })
    }
  },
  update: function(event) {
    var articleInfo = wx.getStorageSync("articleInfo") || {};
    articleInfo.detailList = wx.getStorageSync("detailList") || [];
    console.log(articleInfo)
    var that = this;
    if (articleInfo.detailList.length > 0) {
      ajax.postReq('article_update', articleInfo, function(res) {
        that.setData({
          nextPageFlag: -2
        });
        if (res.code == 1) {
          wx.switchTab({
            url: '/pages/own/own'
          })
        }
      }, "更新文章...")
    } else {
      wx.showToast({
        title: '没找到你的文章内容哦~^-^',
        icon: 'none',
        duration: 2000
      })
    }
  }
});