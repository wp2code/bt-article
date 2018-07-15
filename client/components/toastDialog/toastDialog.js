let _compData = {
  'dialog.title': '',
  'dialog.isShow': false, // 控制组件显示隐藏
  'dialog.content': '', // 显示的内容
  'dialog.cancelText': '取 消', // 显示的内容
  'dialog.confirmText': '确 认' // 显示的内容
}
let toastPannel = {
  // toast显示的方法
  showConfirm: function(dialog) {
    this.setData({
      'dialog.isShow': true,
      'dialog.title': dialog.title || '',
      'dialog.content': dialog.content || '',
      'dialog.confirmText': dialog.confirmText || '确 认',
      'dialog.cancelText': dialog.cancelText || '取 消'
    });
  },
  closeDialog: function() {
    this.setData({
      'dialog.isShow': false,
    });
  },
}


function ToastPannel() {
  // 拿到当前页面对象
  let pages = getCurrentPages();
  let curPage = pages[pages.length - 1];
  this.__page = curPage;
  // 小程序最新版把原型链干掉了。。。换种写法
  Object.assign(curPage, toastPannel);
  // 附加到page上，方便访问
  curPage.toastPannel = this;
  // 把组件的数据合并到页面的data对象中
  curPage.setData(_compData);
  return this;
}

let _menuData = {
  'menuDialog.title': '',
  'menuDialog.isShow': false, // 控制组件显示隐藏
  'menuDialog.menuNodes': [], // 显示的菜单
}

let menuPannel = {
  showMenuDialog: function(data) {
    this.setData({
      'menuDialog.title': data.title || '',
      'menuDialog.isShow': true, // 控制组件显示隐藏
      'menuDialog.menuNodes': data.menuNodes || []
    })
  },
  closeMenuDialog: function() {
    this.setData({
      'menuDialog.isShow': false,
    });
  },
}

function MenuPannel() {
  // 拿到当前页面对象
  let pages = getCurrentPages();
  let curPage = pages[pages.length - 1];
  this.__page = curPage;
  // 小程序最新版把原型链干掉了。。。换种写法
  Object.assign(curPage, menuPannel);
  // 附加到page上，方便访问
  curPage.menuPannel = this;
  // 把组件的数据合并到页面的data对象中
  curPage.setData(_menuData);
  return this;
}
module.exports = {
  ToastPannel,
  MenuPannel
}