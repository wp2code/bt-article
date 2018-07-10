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
    let coverPicUrl = condition.cover_pic_url;
    let nickName = userInfo.nickName;
    let createTime = Date.now() / 1000;
    let articleDetailInfo = {};
    let articleId = condition.article_id;
    if (articleId == undefined || articleId == '') {
        articleId = uuidGenerator().replace(/-/g, "");
    }
    let detailList = condition.detailList;
    // detailList.forEach(function (item, index) {
    //     item.id = uuidGenerator().replace(/-/g, "");
    //     item.article_id = articleId;
    //     item.create_time = createTime;
    //     item.author_name = nickName;
    //     item.author_id = nickName;
    //     item.order_num = index + 1;//默认是1
    // })

    await mysql(CNF.DB_TABLE.article_detail_info).select('order_num').where({
        article_id: articleId, author_id: nickName
    }).orderBy('order_num', 'desc').then(async (res) => {
        if (res != null && res.length > 0) {
            articleDetailInfo.order_num = res[0]['order_num'] + 1;
        } else {
            //创建主表信息
            let articleInfo = {};
            articleInfo.id = articleId;
            articleInfo.author_id = nickName;
            articleInfo.author_name = nickName;
            articleInfo.title = condition.title || null;
            articleInfo.cover_pic_url = coverPicUrl || null;
            articleInfo.create_time = createTime;
            mysql(CNF.DB_TABLE.article_info).insert(articleInfo).then(res => {
                console.log("文章主表创建成功！")
            }).catch(error => {
                console.log(error.toString())
            });
        }
        detailList.forEach(async function (item, index) {
            item.id = uuidGenerator().replace(/-/g, "");
            item.article_id = articleId;
            item.create_time = createTime;
            item.author_name = nickName;
            item.author_id = nickName;
            item.order_num = index + 1;//默认是1
            await mysql(CNF.DB_TABLE.article_detail_info).insert(item).then(res => {
                if (res != null && res.length > 0) {
                    console.log("文章明细创建成功！")
                    SUCCESS(ctx, {article_id: articleId});
                } else {
                    FAILED(ctx);
                }
            }).catch(error => {
                FAILED(ctx, error.toString());
                debug('%s: %O', CNF.ERRORS.ERR_WHEN_INSERT_TO_DB, e);
            });
        })

    })

}

/**
 *  查询主表信息
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function get(ctx, next) {
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
 *  更新 文章明细信息
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function updateDetail(ctx, next) {
    let condition = ctx.request.body || {}
    let userInfo = condition.userInfo;
    let nickName = userInfo.nickName;
    let article_detail_id = condition.did;
    await mysql(CNF.DB_TABLE.article_detail_info);
}

/**
 *  删除 文章明细
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function delDetail(ctx, next) {
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
 *  查询可以访问文章的人
 * 【开放权限校验】
 * @param open_id
 * @param callback
 */
async function queryVisit(open_id, callback) {
    await mysql(CNF.DB_TABLE.article_visitable_info).select('article_id').where({open_id}).then(async (res) => {
        await callback(res);
    });
}

module.exports = {create, get, delDetail, query, update, del, updateDetail, delDetail}