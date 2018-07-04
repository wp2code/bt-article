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
    textContent: "", //文本内容
    textIdentify: 0, //编辑类型 0:文本：1：标题
    index: -1,
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
    var barTitle = "编辑文本";
    this.data.maxTextNum = 500;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; // 上一页面
    var textIdentify = "";
    var textContent = "";
    var index = -1;
    if (prevPage._route_ == "pages/article/save") {
      if (prevPage.data.textContent != undefined) {
        textContent = prevPage.data.textContent;
      }
      if (prevPage.data.textIdentify != undefined) {
        textIdentify = prevPage.data.textIdentify;
        if (textIdentify == 1) {
          barTitle = "编辑标题";
          this.data.maxTextNum = 50;
        }
      }
      if (prevPage.data.index != undefined) {
        index = prevPage.data.index;
      }
      console.log("监听页面显示textIdentify=" + textIdentify)
      console.log("监听页面显示index=" + index)
      this.setData({
        textContent: textContent,
        textIdentify: textIdentify,
        index: index
      })
    }
    //更改标题
    wx.setNavigationBarTitle({
      title: barTitle
    })
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
    var textContent = this.data.textContent;
    if (this.data.isShowTip && textContent != null && textContent.length != 0) {
      wx.showModal({
        title: '退出编辑',
        content: '是否保存当前内容为草稿?',
        confirmText: "保存草稿",
        cancelText: "不保存",
        success: function(res) {
          if (res.confirm) {
            console.log("保存")
          } else if (res.cancel) {
            console.log("不保存")
          }
        }
      })
    }
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
    console.log(value);
    console.log(value.length);
    console.log(this.data.maxTextNum);
    var len = value.length;
    console.log(len > this.data.maxTextNum)
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
    } else if (len > 0) {
      this.data.textContent = value;
      util.navigateTo('./save');
    }

  }
})