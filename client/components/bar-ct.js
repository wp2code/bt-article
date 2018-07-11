// pages/components/bar-ct.js
Component({
  // externalClasses: ['bar-class'],//外部class样式
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    barModel: {//写法为bar-model  
      type: String,
      value: ''
    },
    barWidth:{
      type:String,
      value:'200rpx'
    },
    barBackground:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
});
