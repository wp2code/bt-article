var config = require("../config.js")


const request = (ops, cb) => {
  util.showBusy('正在加载...')
  wx.request({
    url: ops.url,
    data: ops.data,
    method: ops.method || "POST",
    dataType: ops.dataType || "json",
    responseType: ops.responseType || "text",
    success: function (res) {
      console.log(res);
      if (res.data.code == 'success') {
        if (cb != null && 'function' === typeof cb) {
          cb(res.data.data)
        }
      } else {
        util.showModel(res.data.code, "")
      }
    },
    fail: function (res) {

    }
  })
}

const getReq = (funKey, params, callback) => {
  wx.showToast({
    title: '正在加载...',
    icon: 'loading',
    duration: 2000
  })
  var url =
    wx.request({
      url: config.service[funKey],
      data: params != null ? params : {},
      method: 'GET',
      success: (res) => {
        wx.hideToast()
        const data = res.data
        if (typeof (callback) == 'function') {
          callback(result.data)
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            confirmColor: '#993399',
            content: result.code,
            success: (res) => {
            }
          })
        }
      }
    })
}

const postReq = (funKey, params, callback) => {
  wx.showToast({
    title: '正在加载...',
    icon: 'loading',
    duration: 2000
  })
  wx.request({
    url: config.service[funKey],
    data: params != null ? params : {},
    method: 'POST',
    success: (res) => {
      wx.hideToast()
      console.log(res)
      var result = res.data;
      if (typeof (callback) == 'function') {
        callback(result.data)
      } else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          confirmColor: '#993399',
          content: result.code,
          success: (res) => {
          }
        })
      }

    }
  })
}
module.exports = { getReq, postReq }