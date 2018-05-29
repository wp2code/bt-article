const Koa = require("koa");
const app = new Koa();
const debug = require("debug")("koa-weapp-demo");
const compose = require("./middlewares/compose");
const bodyParser = require("koa-bodyparser");
// var MysqlStore = require('koa-mysql-session');
const config = require("./config");

// 使用组合处理中间件
app.use(compose);

// 解析请求体
app.use(bodyParser());

// 引入路由分发
const router = require("./routes");
app.use(router.routes());

// 启动程序，监听端口
app.listen(config.port, () => debug(`listening on port ${config.port}`));
