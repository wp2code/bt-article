/**
 * 中间件合成一个
 *
 */
const compose = require("koa-compose");
const isJSON = require('koa-is-json');
const response = require("./response");
const util = require("../utils/util.js");

async function before(ctx, next) {
    var data = {};
    if (ctx.request.method == 'GET') {
        data = JSON.stringify(ctx.query);
    } else if (ctx.request.method == 'POST') {
        data = ctx.request.body !== undefined ? JSON.stringify(ctx.body) : {}
    }
    console.log("before start");
    console.log(`${util.nowTime()} request before==》 Method【${ctx.request.method}】,Url【${ctx.request.url}】Params【${data}】`);
    await next();
    console.log("before end");
}

async function after(ctx, next) {
    console.log("after start");
    await next();
    boolean
    var f = !isJSON(ctx.body)
    var data = ctx.body !== undefined ? JSON.stringify(ctx.body) : {};
    console.log(`${util.nowTime()} request after==》 Method【${ctx.request.method}】,Url【${ctx.request.url}】,Result【${data}】`);
    console.log("after end");
}

const ComposeWares = [
    before,
    after,
    response
];
const middlewares = compose(ComposeWares);
// 解析请求体
// app.use(bodyParser());
module.exports = middlewares;
