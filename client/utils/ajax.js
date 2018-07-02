var config = require("../config.js")
const delReq = (funKey, urlParams, callback) => {
  wx.showModal({
    content: "确定删除此段？",
    success: function(res) {
      if (res.confirm) {
        request_get(funKey, urlParams, callback);
      } else if (res.cancel) {
      }
    }
  })

}
const getReq = (funKey, urlParams, callback) => {
  wx.showToast({
    title: '正在加载...',
    icon: 'loading',
    duration: 2000
  })
  request_get(funKey, urlParams, callback);
}

const postReq = (funKey, params, callback) => {
  wx.showToast({
    title: '正在加载...',
    icon: 'loading',
    duration: 2000
  })
  var params = params != undefined && params != null ? params : {}
  var userInfo = wx.getStorageSync('userInfo');
  if (userInfo == undefined || userInfo == null) {
    wx.showToast({
      title: '未登录',
      icon: 'loading',
      duration: 2000
    })
  }
  params.userInfo = userInfo;
  var url = config.service[funKey];
  console.info("Post请求路径：" + url);
  console.info("Post请求参数：" + JSON.stringify(params));
  wx.request({
    url: url,
    data: params != null ? params : {},
    method: 'POST',
    success: (res) => {
      wx.hideToast()
      console.log(res)
      var result = res['data'];
      if (typeof(callback) == 'function') {
        callback(result)
      } else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          confirmColor: '#993399',
          content: result['code'],
          success: (res) => {}
        })
      }

    }
  })
}

function request_get(funKey, urlParams, callback) {
  var url = config.service[funKey];
  if (urlParams != undefined && urlParams != null) {
    if (typeof(urlParams) == 'array') {
      for (var i = 0; i < urlParams.length; i++) {
        var up = urlParams[i]['key'] + "=" + urlParams[i]['value'] + "&";
        if (i == 0) {
          url += ("?" + up);
        } else {
          url += up;
        }
      }
    } else if (typeof(urlParams) == 'string') {
      url += urlParams
    }
  }
  console.info("Get请求路径：" + url);
  wx.request({
    url: url,
    method: 'GET',
    success: (res) => {
      wx.hideToast()
      console.log(res)
      const result = res['data'];
      if (typeof(callback) == 'function') {
        callback(result)
      } else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          confirmColor: '#993399',
          content: result['code'],
          success: (res) => {}
        })
      }
    }
  })
}
module.exports = {
  getReq,
  postReq,
  delReq
}