const debug = require('debug')('koa-weapp-demo');

/**
 * 响应处理模块
 */
module.exports = async function (ctx, next) {
    try {
        console.info("request is running start");
        console.log("GET 请求解码参数之前。。。")
        console.log(ctx.querystring)
        console.log(ctx.query);
        // if (ctx.request.method == "GET") {
        //     console.log("GET 请求解码参数。。。")
        //     let paramsStr = ctx.querystring;
        //     var paramsArr = paramsStr.split("&");
        //     var decodeParams = "";
        //     var decodeObj = {};
        //     for (var i = 0; i < paramsArr.length; i++) {
        //         var _PStr = paramsArr[i];
        //         var key = _PStr.substring(0, _PStr.indexOf("=") + 1)
        //         var value = decodeURIComponent(_PStr.substring(_PStr.indexOf("=") + 1));
        //         decodeParams += (key + value);
        //         if (i != paramsArr.length - 1) {
        //             decodeParams+="&"
        //         }
        //         decodeObj[_PStr.substring(0, _PStr.indexOf("="))] = value;
        //     }
        //     ctx.querystring = decodeParams;
        //     ctx.query = decodeObj;
        // }
        // 调用下一个 middleware
        await next();

        // 处理响应结果
        // 如果直接写入在 body 中，则不作处理
        // 如果写在 ctx.body 为空，则使用 state 作为响应

        ctx.body = ctx.body ? ctx.body : {
            code: ctx.state.code !== undefined ? ctx.state.code : 0,
            data: ctx.state.data !== undefined ? ctx.state.data : {}
        };
        console.log("响应：" + JSON.stringify(ctx.body))
    } catch (e) {
        // catch 住全局的错误信息
        debug('Catch Error: %o', e);
        console.error(e.toString());
        // 设置状态码为 200 - 服务端错误
        ctx.status = 200;

        // 输出详细的错误信息
        ctx.body = {
            code: -1,
            error: e && e.message ? e.message : e.toString()
        }
    }
    console.info("request is running end")
};
