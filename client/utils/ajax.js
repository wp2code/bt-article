var config = require("../config.js");
const delReq = (funKey, urlParams, callback) => {

  wx.showModal({
    content: "确定删除此段？",
    success: function(res) {
      if (res.confirm) {
        request_get(funKey, urlParams, callback);
      } else if (res.cancel) {}
    }
  })

};

const getReq = (funKey, urlParams, callback) => {
  wx.showToast({
    title: '正在加载...',
    icon: 'loading',
    duration: 2000
  });
  request_get(funKey, urlParams, callback);
};

const postReq = (funKey, params, callback, tip) => {
  wx.showToast({
    title: tip || '正在加载...',
    icon: 'loading',
    duration: 2000
  });
  var params = params != undefined && params != null ? params : {};
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
      wx.hideToast();
      console.log(res);
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
};
/**
 *  get 请求  encodeURIComponent 编码,
 *      后台用decodeURIComponent 解码
 *      默认参数 登录opid=openId
 */
function request_get(funKey, urlParams, callback) {
  var url = config.service[funKey];
  var params = "";
  if (urlParams != undefined && urlParams != null) {
    if (typeof(urlParams) == 'array') {
      for (var i = 0; i < urlParams.length; i++) {
        var up = urlParams[i]['key'] + "=" + encodeURIComponent(urlParams[i]['value']) + "&";
        params += up;
      }
    } else if (typeof(urlParams) == 'string') {
      var arr = urlParams.split("&");
      for (var i = 0; i < arr.length; i++) {
        var _PStr = arr[i];
        var key = _PStr.substring(0, _PStr.indexOf("=") + 1)
        console.log("编码之前参数:" + _PStr.substring(_PStr.indexOf("=") + 1))
        var value = encodeURIComponent(_PStr.substring(_PStr.indexOf("=") + 1));
        console.log("编码之后参数:" + value)
        params += (key + value);
      }
    }
  }
  //登录用户open_id
  var userInfo = wx.getStorageSync('userInfo');
  if (params == "") {
    params = "opid=" + encodeURIComponent(userInfo.nickName);
  } else {
    params = params + "&opid=" + encodeURIComponent(userInfo.nickName);
  }
  url = url + "?" + params;
  console.info("Get请求路径：" + url);
  wx.request({
    url: url,
    method: 'GET',
    success: (res) => {
      wx.hideToast();
      console.log(res);
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
};