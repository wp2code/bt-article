// pages/article/create.js
var ajax = require('../../utils/ajax.js')
var util = require('../../utils/util.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    maxTextNum: 500, //最大输入字数
    textNum: 0,
    textContent: '', //文本内容
    editInfo: {
      textIdentify: 0, //编辑类型 0:文本：1：标题
      optType: 0, //操作类型 0：新增 1：编辑
      index: 0, //索引
      content: '' //文本内容
    },
    isShowTip: true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("监听页面显示...");
    var editInfo = wx.getStorageSync("editInfo");
    var barTitle = "编辑文本";
    if (editInfo) {
      var maxTextNum = 500;
      if (editInfo.textIdentify == 1) {
        barTitle = "编辑标题";
        maxTextNum = 50;
      }
      this.setData({
        textContent: editInfo.content,
        maxTextNum: maxTextNum
      })
    }
    //更改标题
    wx.setNavigationBarTitle({
      title: barTitle
    })
    // var pages = getCurrentPages();
    // var prevPage = pages[pages.length - 2]; // 上一页面
    // console.log(prevPage);
    // if (prevPage.route == "pages/article/save") {
    //   if (prevPage.data.textIdentify != undefined) {
    //     var textIdentify = prevPage.data.textIdentify;
    //     this.data.textIdentify = prevPage.data.textIdentify
    //     if (textIdentify == 1) {
    //       var articleInfo = prevPage.data.articleInfo;
    //       this.data.textContent = articleInfo.title;
    //       this.data.barTitle = "编辑标题";
    //       this.data.maxTextNum = 50;
    //     } else if (textIdentify == 0) {
    //       var detailInfo = prevPage.data.detailInfo;
    //       this.data.textContent = detailInfo.content;
    //       this.data.index = detailInfo.index;
    //       this.data.optType = prevPage.data.optType;
    //     }
    //   }
    // }

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 取消
   */
  onCancel: function() {
    var textContent = this.data.textContent;
    if (textContent != null && textContent.length != 0) {
      var that = this;
      wx.showModal({
        title: '',
        content: '保留当前编辑?',
        confirmText: "保留",
        cancelText: "不保留",
        success: function(res) {
          if (res.confirm) {
            console.log(textContent + "保存")
          } else if (res.cancel) {
            console.log(textContent + "不保存")
          }
          that.setData({
            isShowTip: false
          })
          wx.navigateBack({
            delta: 1
          })
        }
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  },
  /**
   * 保存
   */
  onFormSubmit: function(e) {
    // var ops = e.detail.value
    // if (ops === undefined) {
    //   return
    // }
    // this.setData({
    //   articleInfo: {
    //     title: ops.title || "",
    //     content: ops.content
    //   }
    // })
    // var artId = this.data.artId;
    // if (artId != undefined && artId != null) {
    //   ops.article_id = artId;
    // }
    //保存数据
    // ajax.postReq("article_create", ops, function(res) {
    //   console.log("保存结果===>" + JSON.stringify(res));
    //   if (res.code == 'success') {
    //     util.navigateTo('./save?article_id=' + res.data.article_id);
    //   }
    // });
  },
  onbindKeyInput: function(e) {
    var value = e.detail.value
    var textlen = value.length

    if (this.data.maxTextNum < textlen) {
      var pos = e.detail.cursor
      console.log("pos==>" + pos);
      var inputText
      var left
      if (pos !== -1) {
        // 光标在中间
        inputText = value.slice(0, pos)
        left = value.slice(0, pos - 1);
        console.log("inputText==>" + inputText);
        console.log("left==>" + left);
        // 计算光标的位置
        pos = inputText.replace(inputText, left).length
        console.log("new pos==>" + pos);
        value = value.replace(inputText, left)
      }
      console.log("new value:===>" + value)
      // 直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
      return {
        value: value,
        cursor: pos - 1
      }
      // return value.replace(/11/g, '2')
    } else {
      this.setData({
        textNum: textlen,
        textContent: value
      })
    }
  },
  bindHideKeyboard: function(e) {
    // if (e.detail.value === '123') {
    // 收起键盘
    wx.hideKeyboard()
    // }
  },
  onbindfocus: function(e) {
    console.log("获取的了光标")
    // wx.showKeyboard();
  },
  onbindconfirm: function(e) {
    console.log("onbindconfirm....");
    var value = e.detail.value;
    var len = value.length;
    if (len > this.data.maxTextNum) {
      wx.showModal({
        content: "修复字数长度！",
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (len >= 0) {
      console.log("onbindconfirm to save...")
      var editInfo = wx.getStorageSync("editInfo");
      if (editInfo) {
        editInfo.content = value;
        wx.setStorageSync("editInfo", editInfo);
      } else {
        //默认是设置文本
        var newInfo = {
          textIdentify: 0,
          optType: 0,
          index: 0,
          content: value
        };
        wx.setStorageSync("editInfo", newInfo);
      }
      // var textIdentify = this.data.textIdentify;
      // if (textIdentify == 0) { //文章信息
      //   //编辑或新增
      //   var detialList = wx.getStorageSync("detialList");
      //   console.log("-----------create-------")
      //   console.log(detialList)
      //   if (!detialList) {
      //     detialList = [];
      //     var detailInfo = {
      //       id: '',
      //       content: value,
      //       picture_url: ''
      //     };
      //     detialList.push(detailInfo);
      //   } else {
      //     var optType = this.data.optType;
      //     if (optType == 0) { //新增文本
      //       var detailInfos = [{
      //         id: '',
      //         content: value,
      //         picture_url: ''
      //       }];
      //       detialList = detailInfos.concat(detialList)
      //     } else if (optType == 1) { //编辑文本
      //       detialList[this.data.index]['content'] = value;
      //     }
      //   }
      //   wx.setStorageSync("detialList", detialList);
      // } else if (textIdentify == 1) { //标题信息
      //   var articleInfo = wx.getStorageSync("articleInfo");
      //   console.log("-----------create-------")
      //   console.log(articleInfo)
      //   var articleInfo = this.data.articleInfo;
      //   articleInfo.title = value;
      //   wx.setStorageSync("articleInfo", articleInfo);
      // }
      util.redirectTo('./save');
    }

  }
})