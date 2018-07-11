const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n
};


// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
});

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
});

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();

  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  })
};
//路径跳转
const navigateTo = (url, callback) => {
  wx.navigateTo({
    url: url,
    success: function() {
      if (typeof(callback) == 'function') {
        callback()
      }
    }
  })
};
//路径重定向
const redirectTo = (url, callback) => {
  wx.redirectTo({
    url: url,
    success: function() {
      if (typeof(callback) == 'function') {
        callback()
      }
    }
  })
};

module.exports = {
  formatTime,
  showBusy,
  showSuccess,
  showModel,
  navigateTo,
  redirectTo
};