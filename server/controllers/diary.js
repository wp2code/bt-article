const {mysql} = require("../qcloud");
const debug = require('debug');
const uuidGenerator = require('uuid/v4');
const moment = require('moment');
const {SUCCESS, FAILED, CNF} = require('../constants');

/**
 *  查询用户创建的信息
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function detail(ctx, next) {
    const {relation_id} = ctx.query;
    await mysql("letter_info").select('*').where({relation_id: relation_id}).then(res => {
        SUCCESS(ctx, res);
    });
}

/**
 * 查询信息
 * @param diaryInfo
 * @returns {Promise<any> | Promise<T>}
 */
async function query(ctx, next) {
    let condition = ctx.request.body || {}
    let userInfo = condition.userInfo;
    let nickName = userInfo.nickName;
    // 登录信息会被存储到 ctx.state.$wxInfo
    // let user = ctx.state.$wxInfo.userinfo;
    // console.log(user);
    await queryVisit(nickName, async (res) => {
        if (res != null) {
            if (res.length > 0) {
                const letter_id_arr = [];
                res.forEach(res => {
                    letter_id_arr.push(res.letter_id);
                })
                await mysql("letter_info").select('*').whereIn('letter_id', letter_id_arr).andWhere({'status': 1}).orderBy('create_time', 'desc').then(res => {
                    SUCCESS(ctx, res);
                })
            } else {
                await mysql("letter_info").select('*').where({'status': 1}).orderBy('create_time', 'desc').then(res => {
                    let 
                    mysql("letter_detail_info").select("*").where()
                    SUCCESS(ctx, res);
                })
            }
        }
    });
}

/**
 * 查询可访问的信件id
 * @param open_id
 * @param callback
 */
async function queryVisit(open_id, callback) {
    await mysql('letter_visitable').select('letter_id').where({open_id}).then(async (res) => {
        await callback(res);
    });
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
}

/**
 *  更新
 * @param ctx
 * @param next
 */
async function update(ctx, next) {
    let condition = ctx.request.body || {}
    let userInfo = condition.userInfo;
    let nickName = userInfo.nickName;
    let letter_id = userInfo.letter_id;
    if (letter_id != null && letter_id != null) {
        await mysql('letter_info').select('version').where({
            letter_id: letter_id, author_id: nickName
        }).then(res => {
            //版本+1
            diaryInfo.version = res[0].version + 1;
            mysql('letter_info').update(diaryInfo).where({
                letter_id: letter_id, author_id: nickName
            }).then(res => {
                console.log("更新成功！【" + res + "】");
                SUCCESS(ctx, res);
            })
        })
    } else {
        FAILED(ctx, '更新失败!');
    }

}

/**
 * 新建
 * @param ctx
 * @param next
 * @returns {Promise<any | T>}
 */
async function create(ctx, next) {
    let condition = ctx.request.body || {}
    let userInfo = condition.userInfo;
    let nickName = userInfo.nickName;
    let create_time = Date.now() / 1000;
    let letterDetailInfo = {};
    let letter_id = condition.letter_id;
    if (letter_id == undefined || letter_id == null) {
        letter_id = uuidGenerator().replace(/-/g, "");
    }
    letterDetailInfo.id = uuidGenerator().replace(/-/g, "");
    letterDetailInfo.letter_id = letter_id;
    letterDetailInfo.create_time = create_time;
    letterDetailInfo.content = condition.content;
    letterDetailInfo.author_name = nickName
    letterDetailInfo.author_id = nickName;
    letterDetailInfo.order_num = 1;//默认是1
    await mysql('letter_detail_info').select('order_num').where({
        letter_id: letter_id, author_id: nickName
    }).orderBy('order_num', 'desc').then(async (res) => {
        if (res != null && res.length > 0) {
            letterDetailInfo.order_num = res[0]['order_num'] + 1;
        } else {
            //创建主表信息
            let letterInfo = {};
            letterInfo.id = letter_id;
            letterInfo.author_id = nickName;
            letterInfo.author_name = nickName;
            letterInfo.title = condition.title || null;
            letterInfo.create_time = create_time;
            mysql('letter_info').insert(letterInfo).catch(error => {
                console.log(error.toString())
            });
        }
        await mysql('letter_detail_info').insert(letterDetailInfo).then(res => {
            if (res != null && res.length > 0) {
                SUCCESS(ctx, {letter_id: letter_id, letter_detail_id: letterDetailInfo.id});
            } else {
                FAILED(ctx);
            }
        }).catch(error => {
            FAILED(ctx, error.toString());
        });
    })

}

/**
 * 删除日志信息
 * @param diaryInfo
 * @returns {Promise<any>}
 */
async function del(ctx, next) {
    let condition = ctx.request.body || {}
    let letter_id = condition.letter_id;
    await  mysql("letter_info").del().where({letter_id}).then(res => {
        console.log("删除成功！")
        SUCCESS(ctx, res);
    }).catch(e => {
        FAILED(ctx, e.toString())
        debug('%s: %O', CNF.ERRORS.ERR_WHEN_DELETED_FROM_DB, e);
        // throw new Error(`${CNF.ERRORS.ERR_WHEN_DELETED_FROM_DB}\n${e}`)
    });

}

module.exports = {detail, create, update, edit, query, del}