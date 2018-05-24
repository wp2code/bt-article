// pages/article/create.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxTextNum: 10,
    textNum: 0
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
    console.log("离开创建小文章页面")
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
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
        textNum: textlen
      })
    }
  },
  bindReplaceInput: function (e) {
    var value = e.detail.value
    var pos = e.detail.cursor
    var left
    if (pos !== -1) {
      // 光标在中间
      left = e.detail.value.slice(0, pos)
      // 计算光标的位置
      pos = left.replace(/11/g, '2').length
    }

    // 直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
    return {
      value: value.replace(/11/g, '2'),
      cursor: pos
    }
    // 或者直接返回字符串,光标在最后边
    // return value.replace(/11/g,'2'),
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
    if (e.detail.value.length > this.data.maxTextNum) {
      wx.showModal({
        content: "修复字数长度！",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else {
      wx.navigateTo({
        url: './save',
      })
    }

  }
})