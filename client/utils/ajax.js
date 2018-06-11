var util = require("./util.js")

const request = (ops, cb) => {
  util.showBusy('正在请求...')
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
module.exports = { request }