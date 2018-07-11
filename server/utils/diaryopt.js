// const { mysql: config } = require("../config");
const {mysql} = require("../qcloud");
const debug = require('debug');
const uuidGenerator = require('uuid/v4');
const moment = require('moment');
const {SUCCESS, FAILED, CNF} = require('../constants');
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

/**
 * 查询日志信息
 * @param diaryInfo
 * @returns {Promise<any> | Promise<T>}
 */
async function queryDiary(ctx, diaryInfo) {
    //查询条件
    const condition = JSON.stringify(diaryInfo);
    // condition.open_id=
    let queryData = 'diary_id,open_id,visible_id,title,content,pv,comments,update_time';
    let result = mysql("diary_info").select('*').where(diaryInfo).catch(e => {
        FAILED(ctx, e.toString());
        debug('%s: %O', CNF.ERRORS.ERR_WHEN_QUERY_FROM_DB, e);
        // throw new Error(`${CNF.ERRORS.ERR_WHEN_QUERY_FROM_DB}\n${e}`)
    });
}

/**
 *  编辑日志信息
 * @param diaryInfo
 * @returns {Promise<any>}
 */
function editDiary(ctx, diaryInfo) {
    let diary_id = diaryInfo.diary_id || uuidGenerator().replace(/-/g, "");
    let visible_id = diaryInfo.visible_id || 0;
    let create_time = Date.now() / 1000;
    // let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
    let open_id = diaryInfo.open_id;
    diaryInfo.diary_id = diary_id;
    // diaryInfo.update_time = update_time;
    diaryInfo.version = 0;
    diaryInfo.create_time = create_time;
    diaryInfo.diary_id = diary_id;
    diaryInfo.open_id = open_id;
    diaryInfo.visible_id = visible_id;
    // const diary_info = JSON.stringify(diaryInfo)
    // 查重并决定是插入还是更新数据
    mysql('diary_info').select('version').where({
        open_id
    }).then(res => {
        // 如果存在则更新
        if (res.length > 0) {
            //版本+1
            diaryInfo.version = res[0].version + 1;
            mysql('diary_info').update(diaryInfo).where({
                open_id
            }).then(res => {
                console.log("更新成功！【" + res + "】");
            })
        } else {
            mysql('diary_info').insert(diaryInfo).then(res => {
                console.log("保存成功");
            })
        }
    }).catch(e => {
        FAILED(ctx, e);
        debug('%s: %O', CNF.ERRORS.ERR_WHEN_EDIT_TO_DB, e);
        // throw new Error(`${CNF.ERRORS.ERR_WHEN_EDIT_TO_DB}\n${e}`)
    });
    SUCCESS(ctx);
}

/**
 * 删除日志信息
 * @param diaryInfo
 * @returns {Promise<any>}
 */
function deleteDiary(ctx, diaryInfo) {
    const diary_id = diaryInfo.diary_id;
    mysql("diary_info").del().where({diary_id}).then(res => {
        console.log("删除成功！")
    }).catch(e => {
        FAILED(ctx, e.toString());
        debug('%s: %O', CNF.ERRORS.ERR_WHEN_DELETED_FROM_DB, e);
        // throw new Error(`${CNF.ERRORS.ERR_WHEN_DELETED_FROM_DB}\n${e}`)
    });
    SUCCESS(ctx);
}

module.exports = {queryDiary, editDiary, deleteDiary};