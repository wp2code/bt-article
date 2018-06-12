// pages/article/create.js
var config = require('../../config')
var ajax = require('../../utils/ajax.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    maxTextNum: 150,
    textNum: 0,
    textContext: '',
    isShowTip: true,
    diaryInfo: {
      title: "",
      content: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var textContext = this.data.textContext;
    if (this.data.isShowTip && textContext != null && textContext.length != 0) {
      wx.showModal({
        title: '退出编辑',
        content: '是否保存当前内容为草稿?',
        confirmText: "保存草稿",
        cancelText: "不保存",
        success: function (res) {
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
  onShareAppMessage: function () {

  },
  /**
   * 取消
   */
  onCancel: function () {
    var textContext = this.data.textContext;
    if (textContext != null && textContext.length != 0) {
      var that = this;
      wx.showModal({
        title: '',
        content: '保留当前编辑?',
        confirmText: "保留",
        cancelText: "不保留",
        success: function (res) {
          if (res.confirm) {
            console.log(textContext + "保存")
          } else if (res.cancel) {
            console.log(textContext + "不保存")
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
  onFormSubmit: function (e) {
    var obj = e.detail.value
    if (obj === undefined) {
      return
    }
    this.setData({
      diaryInfo: {
        title: obj.title || "",
        content: obj.content
      }
    })
    //保存数据
    onSaveDiary(this.diaryInfo);
  },
  onSaveDiary: function (ops) {
    if (ops == null || typeof (callback) !== 'object') return
    var userInfo = wx.getStorageSync('userInfo');
    var nickName = userInfo != null ? userInfo.nickName : "";
    ops.open_id = nickName;
    console.log("请求参数：" + JSON.stringify(ops))
    ajax.postReq(diary_edit, ops, function (res) {
      console.log("响应参数：" + JSON.stringify(res))
    });
  },
  onbindKeyInput: function (e) {
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
        textContext: value
      })
    }
  },
  bindHideKeyboard: function (e) {
    // if (e.detail.value === '123') {
    // 收起键盘
    wx.hideKeyboard()
    // }
  },
  onbindfocus: function (e) {
    console.log("获取的了光标")
    // wx.showKeyboard();
  },
  onbindconfirm: function (e) {
    console.log(e.detail.value)
    console.log(e.detail.value.length)
    console.log(this.data.maxTextNum)
    console.log(e.detail.value.length > this.data.maxTextNum)
    var len = e.detail.value.length
    if (len > this.data.maxTextNum) {
      wx.showModal({
        content: "修复字数长度！",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (len > 0) {
      wx.navigateTo({
        url: './save',
      })
    }

  }
})