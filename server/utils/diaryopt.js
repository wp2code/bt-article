// const { mysql: config } = require("../config");
const {mysql} = require("../qcloud");
const uuid = require("uuid");
const util = require("../utils/util");
// const DB = require("knex")({
// 	client: "mysql",
// 	connection: {
// 		host: config.host,
// 		port: config.port,
// 		user: config.user,
// 		password: config.pass,
// 		database: config.db,
// 		charset: config.char,
// 		multipleStatements: true
// 	}
// });


const queryDiary = async (ctx, next) => {
	mysql("diary").select("*").then(res => {
		ctx.state.code = 0;
		ctx.state.data = res;
	}).catch(err => {
		ctx.state.code = -1;
		throw new Error(err);
	});
};
const insertDiary = async (ctx, next) => {
	var data = ctx.request.body !== undefined ? ctx.request.body : {};
	data.diary_id = uuid.v1().replace(/-/g,"");
	data.create_time=Date.now()/1000;
	var time=process.hrtime();
	var time2=Date.now();
	// data.update_time=util.nowTime();
	await mysql("diary_info").insert(data).then(function () {
			return ctx.response.code=200
	});
};
const deleteDiary = async (ctx, next) => {
	var data={};
	var {id} = ctx.request.query;
	 data.diary_id=id;
	await mysql("diary_info").del().where({"diary_id":id});
};
const updateDiary = async (ctx, next) => {
	var data = ctx.body !== undefined ? JSON.stringify(ctx.body) : {};
	await mysql("diary_info").update(data).where({"diary_id": data.id});
};
module.exports = {queryDiary, insertDiary, deleteDiary, updateDiary};