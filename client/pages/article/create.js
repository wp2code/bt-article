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
    placeholder: '',
    barTitle: "编辑文本",
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
    var barTitle = this.data.barTitle;
    var placeholder = this.data.placeholder;
    if (editInfo) {
      var maxTextNum = 500;
      if (editInfo.textIdentify == 1) {
        barTitle = "编辑标题";
        placeholder = "输入文章标题"
        maxTextNum = 50;
      }
      this.setData({
        textContent: editInfo.content,
        placeholder: placeholder,
        maxTextNum: maxTextNum
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

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
    // 收起键盘
    wx.hideKeyboard()
  },
  onbindfocus: function(e) {
    console.log("获取的了光标")
    // wx.showKeyboard();
  },
  onFormSubmit: function(e) {
    var value = e.detail.value.content;
    console.log("onFormSubmit to save...")
    var editInfo = wx.getStorageSync("editInfo");
    if (editInfo) {
      editInfo.content = value;
    } else {
      //默认是设置文本
      editInfo = {
        textIdentify: 0,
        optType: 0,
        index: 0,
        content: value
      };
    }
    wx.setStorageSync("editInfo", editInfo);
    console.log("编辑的信息==");
    console.log(wx.getStorageSync("editInfo"));
    util.redirectTo('./save');
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
        var editInfo = {
          textIdentify: 0,
          optType: 0,
          index: 0,
          content: value
        };
        wx.setStorageSync("editInfo", editInfo);
      }
      console.log("编辑的信息==");
      console.log(wx.getStorageSync("editInfo"));
      util.redirectTo('./save');
    }

  }
})