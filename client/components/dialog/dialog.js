// components/dialog .js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    flow: {
      type: String,
      value: "left"
    },
    title: {
      type: String,
      value: ""
    },
    content: {
      type: String,
      value: ''
    },
    cancelText: {
      type: String,
      value: '取消'
    },
    confirmText: {
      type: String,
      value: '确定'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    id: '',
    left: 0,
    top: 0,
    isShow: false,
    flow: "left"
  },
  // ready: function() {
  //   var query = wx.createSelectorQuery().in(this)
  //   console.log(this.data.id);
  //   query.select('#dialog-view').boundingClientRect(function(res) {
  //     console.log(res);
  //     res.top // 这个组件内 #the-id 节点的上边界坐标
  //   }).exec()
  // },
  /**
   * 组件的方法列表
   */
  methods: {
    showDialog: function(e, data) {
      console.log(e);
      var that = this;
      var query = wx.createSelectorQuery()
      query.select('#' + e.currentTarget.id).boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function(res) {
        // that.setData({
        //   top: res[0].top,
        //   left: res[0].left,
        //   id: e.currentTarget.id,
        //   isShow: !that.data.isShow
        // })
        console.log(res);
        res[0].top // #the-id节点的上边界坐标
        res[1].scrollTop // 显示区域的竖直滚动位置
      })
      wx.createSelectorQuery().select('#' + e.currentTarget.id).fields({
        dataset: true,
        rect: true,
        size: true,
        scrollOffset: true,
        properties: ['scrollX', 'scrollY'],
        computedStyle: ['margin', 'backgroundColor']
      }, function(res) {
        res.dataset // 节点的dataset
        res.width // 节点的宽度
        res.height // 节点的高度
        res.scrollLeft // 节点的水平滚动位置
        res.scrollTop // 节点的竖直滚动位置
        res.scrollX // 节点 scroll-x 属性的当前值
        res.scrollY // 节点 scroll-y 属性的当前值
        // 此处返回指定要返回的样式名
        res.margin
        res.backgroundColor
        console.log(res);
        that.setData({
          top: res.top,
          left: res.left,
          id: e.currentTarget.id,
          isShow: !that.data.isShow
        })
      }).exec()

      // this.setData({
      //   id: e.currentTarget.id,
      //   isShow: !this.data.isShow
      // })
    },
    hideDialog: function() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    _cancelEvent: function() {
      this.triggerEvent("cancelEvent")
    },
    _confirmEvent: function() {
      this.triggerEvent("confirmEvent");
    }
  }
})