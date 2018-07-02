const {mysql} = require("../qcloud");
const debug = require('debug');
const uuidGenerator = require('uuid/v4');
const moment = require('moment');
const {SUCCESS, FAILED, CNF} = require('../constants');

/**
 * 新建书信主表信息 article
 * @param ctx
 * @param next
 * @returns {Promise<any | T>}
 */
async function create(ctx, next) {
    let condition = ctx.request.body || {}
    let userInfo = condition.userInfo;
    let nickName = userInfo.nickName;
    let create_time = Date.now() / 1000;
    let articleDetailInfo = {};
    let article_id = condition.article_id;
    if (article_id == undefined || article_id == null) {
        article_id = uuidGenerator().replace(/-/g, "");
    }
    articleDetailInfo.id = uuidGenerator().replace(/-/g, "");
    articleDetailInfo.article_id = article_id;
    articleDetailInfo.create_time = create_time;
    articleDetailInfo.content = condition.content;
    articleDetailInfo.author_name = nickName
    articleDetailInfo.author_id = nickName;
    articleDetailInfo.order_num = 1;//默认是1
    await mysql(CNF.DB_TABLE.article_detail_info).select('order_num').where({
        article_id: article_id, author_id: nickName
    }).orderBy('order_num', 'desc').then(async (res) => {
        if (res != null && res.length > 0) {
            articleDetailInfo.order_num = res[0]['order_num'] + 1;
        } else {
            //创建主表信息
            let articleInfo = {};
            articleInfo.id = article_id;
            articleInfo.author_id = nickName;
            articleInfo.author_name = nickName;
            articleInfo.title = condition.title || null;
            articleInfo.create_time = create_time;
            mysql(CNF.DB_TABLE.article_info).insert(articleInfo).then(res => {
                console.log("文章主表创建成功！")
            }).catch(error => {
                console.log(error.toString())
            });
        }
        await mysql(CNF.DB_TABLE.article_detail_info).insert(articleDetailInfo).then(res => {
            if (res != null && res.length > 0) {
                SUCCESS(ctx, {article_id: article_id, article_detail_id: articleDetailInfo.id});
            } else {
                FAILED(ctx);
            }
        }).catch(error => {
            FAILED(ctx, error.toString());
            debug('%s: %O', CNF.ERRORS.ERR_WHEN_INSERT_TO_DB, e);
        });
    })

}

/**
 *  查询主表信息
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function detail(ctx, next) {
    let {article_id} = ctx.query;
    await mysql(CNF.DB_TABLE.article_info).select('*').where({id: article_id}).then(async (res) => {
        let result = {};
        if (res != null && res.length > 0) {
            result = res[0];
            result['detialList'] = [];
            await  mysql(CNF.DB_TABLE.article_detail_info).select("*").where({article_id: article_id}).then(res => {
                result['detialList'] = res;
                SUCCESS(ctx, result);
            })
        } else {
            SUCCESS(ctx, result);
        }

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
                const article_id_arr = [];
                res.forEach(res => {
                    article_id_arr.push(res.article_id);
                })
                await mysql(CNF.DB_TABLE.article_info).select('*').whereIn('article_id', article_id_arr).andWhere({'status': 1}).orderBy('create_time', 'desc').then(res => {
                    SUCCESS(ctx, res);
                })
            } else {
                await mysql(CNF.DB_TABLE.article_info).select('*').where({'status': 1}).orderBy('create_time', 'desc').then(res => {

                    SUCCESS(ctx, res);
                })
            }
        }
    });
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
    let article_id = condition.id;
    if (article_id != null && article_id != null) {
        await mysql('article_info').select('version').where({
            article_id: article_id, author_id: nickName
        }).then(res => {
            //版本+1
            diaryInfo.version = res[0].version + 1;
            mysql(CNF.DB_TABLE.article_info).update(condition).where({
                article_id: article_id, author_id: nickName
            }).then(res => {
                console.log("更新成功！【" + res + "】");
                SUCCESS(ctx, res);
            })
        })
    } else {
        FAILED(ctx, '更新失败!');
    }
}

async function updateDetail(ctx, next) {
    let condition = ctx.request.body || {}
    let userInfo = condition.userInfo;
    let nickName = userInfo.nickName;
    let article_detail_id = condition.did;
    await mysql(CNF.DB_TABLE.article_detail_info);
}


/**
 * 删除 文章信息
 * @param diaryInfo
 * @returns {Promise<any>}
 */
async function del(ctx, next) {
    let condition = ctx.request.body || {}
    let article_id = condition.article_id;
    await  mysql(CNF.DB_TABLE.article_info).del().where({article_id}).then(res => {
        console.log("删除成功！")
        SUCCESS(ctx, res);
    }).catch(e => {
        FAILED(ctx, e.toString())
        debug('%s: %O', CNF.ERRORS.ERR_WHEN_DELETED_FROM_DB, e);
        // throw new Error(`${CNF.ERRORS.ERR_WHEN_DELETED_FROM_DB}\n${e}`)
    });
}

/**
 *  删除 文章明细
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function del_detail(ctx, next) {
    let {detail_id} = ctx.query;
    if (detail_id) {
        await  mysql(CNF.DB_TABLE.article_detail_info).del().where({id: detail_id}).then(res => {
            SUCCESS(ctx, res);
        }).catch(e => {
            FAILED(ctx, e.toString())
            debug('%s: %O', CNF.ERRORS.ERR_WHEN_DELETED_FROM_DB, e);
            // throw new Error(`${CNF.ERRORS.ERR_WHEN_DELETED_FROM_DB}\n${e}`)
        });
    } else {
        FAILED(ctx, "id为空！")
    }

}

/**
 * 查询可访问的信件id
 * @param open_id
 * @param callback
 */
async function queryVisit(open_id, callback) {
    await mysql(CNF.DB_TABLE.article_visitable_info).select('article_id').where({open_id}).then(async (res) => {
        await callback(res);
    });
}

module.exports = {detail, del_detail,create, update, query, del}