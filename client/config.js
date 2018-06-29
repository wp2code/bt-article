/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'http://localhost:5009';
// var host = 'https://taflgi5t.qcloud.la';
var prefix = 'weapp';
var config = {

  // 下面的地址配合云端 Demo 工作
  service: {
    host,

    // 登录地址，用于建立会话
    loginUrl: `${host}/${prefix}/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `${host}/${prefix}/user`,

    // 测试的信道服务地址
    tunnelUrl: `${host}/${prefix}/tunnel`,

    // 上传图片接口
    uploadUrl: `${host}/${prefix}/upload`,
    //查询记录
    diary_query: `${host}/${prefix}/letter/query`,
    //更新记录
    diary_edit: `${host}/${prefix}/letter/edit`,
    //创建
    diary_create: `${host}/${prefix}/letter/create`,
    //更新
    diary_update: `${host}/${prefix}/letter/update`,
    //删除记录
    diary_del: `${host}/${prefix}/letter/del`,
    //获取用户创建的信息
    letter_detail: `${host}/${prefix}/letter/detail`
  },
};

module.exports = config;