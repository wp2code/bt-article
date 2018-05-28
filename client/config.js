/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'http://localhost:5757';
// var host = 'https://taflgi5t.qcloud.la';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/article/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/article/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/article/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/article/upload`,

        // 保存文章接口
        save:`${host}/article/save`
    }
};

module.exports = config;
