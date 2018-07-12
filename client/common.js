var config = require("../config.js")
var http = {
  get: (urlKey, obj = undefined) => {
    var url = config.service[urlKey];
    var promise = new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'mid': mid,
          'token': token
        },
        data: obj,
        success: (res) => {
          if (res.code == 1) {
            resolve(res.data)
          } else {
            console.log('前端故障');
            reject(res.message)
          }
        },
        fail: (res) => {
          console.log('后端故障')
          reject(res.message)
        }
      })
    })
    return promise;
  },
  post: (urlKey, obj) => {
    var urlKey = config.service[urlKey];
    var promise = new Promise((resolve, reject) => {
      wx.request({
        url: baseUrl + url,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'mid': mid,
          'token': token
        },
        data: obj,
        success: (res) => {
          if (res.code == 1) {
            resolve(res.data)
          } else {
            console.log('前端故障');
            reject(res.message)
          }
        },
        fail: (res) => {
          console.log('后端故障')
          reject(res.message)
        }
      })
    })
    return promise;
  }
}