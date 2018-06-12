const {mysql} = require("../qcloud");
const debug = require('debug');
const uuidGenerator = require('uuid/v4');
const moment = require('moment');
const {SUCCESS, FAILED, CNF} = require('../constants');


/**
 * 查询日志信息
 * @param diaryInfo
 * @returns {Promise<any> | Promise<T>}
 */
async function query(ctx, next) {
    let diaryInfo = ctx.request.body || {}
    //查询条件
    // const condition = JSON.stringify(diaryInfo);
    // let queryData = 'diary_id,open_id,visible_id,title,content,pv,comments,update_time';
    let result = await  mysql("diary_info").select('*');
    SUCCESS(ctx, result)
    return result;
}

/**
 *  编辑日志信息
 * @param diaryInfo
 * @returns {Promise<any>}
 */
async function edit(ctx, next) {
    let diaryInfo = ctx.request.body || {}
    let diary_id = diaryInfo.diary_id || uuidGenerator().replace(/-/g, "");
    let visible_id = diaryInfo.visible_id || 0;
    let create_time = Date.now() / 1000;
    // let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
    let open_id = diaryInfo.open_id;
    diaryInfo.diary_id = diary_id;
    diaryInfo.version = 0;
    diaryInfo.create_time = create_time;
    diaryInfo.diary_id = diary_id;
    diaryInfo.open_id = open_id;
    diaryInfo.visible_id = visible_id;
    // const diary_info = JSON.stringify(diaryInfo)
    // 查重并决定是插入还是更新数据
    await mysql('diary_info').select('version').where({
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
        FAILED(ctx, e.toString())
        debug('%s: %O', CNF.ERRORS.ERR_WHEN_EDIT_TO_DB, e);
        // throw new Error(`${CNF.ERRORS.ERR_WHEN_EDIT_TO_DB}\n${e}`)
    })
    SUCCESS(ctx);
}
async function update(ctx, next) {
    let diaryInfo = ctx.request.body || {}
   await  mysql('diary_info').select('version').where({
        open_id
    }).then(res => {
         //版本+1
         diaryInfo.version = res[0].version + 1;
         mysql('diary_info').update(diaryInfo).where({
             open_id
         }).then(res => {
             console.log("更新成功！【" + res + "】");
         })
     })
    SUCCESS(ctx);
}
/**
 * 新建日记
 * @param ctx
 * @param next
 * @returns {Promise<any | T>}
 */
async function create(ctx, next) {
    let diaryInfo = ctx.request.body || {}
    diaryInfo.diary_id = uuidGenerator().replace(/-/g, "");
    diaryInfo.visible_id = diaryInfo.visible_id || 0;
    diaryInfo.create_time = Date.now() / 1000;
    diaryInfo.open_id;
    let result = await mysql('diary_info').insert(diaryInfo).then(res => {
        console.log("保存成功");
    });
    SUCCESS(ctx, result);
    return result;
}

/**
 * 删除日志信息
 * @param diaryInfo
 * @returns {Promise<any>}
 */
async function del(ctx, next) {
    let diaryInfo = ctx.request.body || {}
    let diary_id = diaryInfo.diary_id;
    await mysql("diary_info").del().where({diary_id}).then(res => {
        console.log("删除成功！")
    }).catch(e => {
        FAILED(ctx, e.toString())
        debug('%s: %O', CNF.ERRORS.ERR_WHEN_DELETED_FROM_DB, e);
        // throw new Error(`${CNF.ERRORS.ERR_WHEN_DELETED_FROM_DB}\n${e}`)
    });
    SUCCESS(ctx);
}

module.exports = {create, update,edit,query, del}