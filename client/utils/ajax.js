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
      if (res.data.code == 100) {
        if (cb != null && 'function' === typeof cb) {
          cb(res)
        }
      } else {
        util.showModel(res.data.message, "")
      }
    },
    fail: function (res) {

    }
  })
}
module.exports = { request }