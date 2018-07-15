const {mysql} = require("../qcloud");
const debug = require('debug');
const uuidGenerator = require('uuid/v4');
const moment = require('moment');
const {SUCCESS, FAILED, CNF} = require('../constants');
const util = require('../utils/util');

/**
 * 新建书信主表信息 article
 * @param ctx
 * @param next
 * @returns {Promise<any | T>}
 */
async function create(ctx, next) {
    let condition = ctx.request.body || {};
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
    if (detailList && Array.isArray(detailList)) {
        detailList.forEach(function (item, index) {
            item.id = uuidGenerator().replace(/-/g, "");
            item.article_id = articleId;
            item.create_time = createTime;
            item.author_name = nickName;
            item.author_id = nickName;
            item.order_num = index + 1;//默认是1
        })
    }

    await mysql(CNF.DB_TABLE.article_detail_info).select('order_num').where({
        article_id: articleId, author_id: nickName
    }).orderBy('order_num', 'desc').then(async (res) => {
        let isFlag = false;
        if (res != null && res.length > 0) {
            articleDetailInfo.order_num = res[0]['order_num'] + 1;
        } else {
            isFlag = true;
        }
        await mysql(CNF.DB_TABLE.article_detail_info).insert(detailList).then(async (res) => {
            if (res != null && res.length > 0) {
                console.log("文章明细创建成功！");
                if (isFlag) {
                    //创建主表信息
                    let articleInfo = {};
                    articleInfo.id = articleId;
                    articleInfo.author_id = nickName;
                    articleInfo.author_name = nickName;
                    articleInfo.title = condition.title || null;
                    articleInfo.cover_pic_url = coverPicUrl || null;
                    articleInfo.create_time = createTime;
                    articleInfo.status = condition.status || 0;
                    await mysql(CNF.DB_TABLE.article_info).insert(articleInfo).then(res => {
                        if (res != null && res.length > 0) {
                            console.log("文章主表创建成功！")
                            SUCCESS(ctx, {article_id: articleId});
                        } else {
                            console.log("文章主表创建失败！")
                            FAILED(ctx, "文章信息创建失败");
                        }
                    }).catch(error => {
                        console.log(error.toString())
                    });
                }
                SUCCESS(ctx, {article_id: articleId});
            } else {
                FAILED(ctx, "文章信息创建失败");
            }
        }).catch(error => {
            console.log(error);
            FAILED(ctx, error.toString());
            debug('%s: %O', CNF.ERRORS.ERR_WHEN_INSERT_TO_DB, error);
        });

    })

}

/**
 *  查询主表信息
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function get(ctx, next) {
    let {article_id, opid} = ctx.query;
    await mysql(CNF.DB_TABLE.article_info).column('id', 'title', 'pv', 'comments', 'author_name', 'cover_pic_url', 'create_time').select().where({
        id: article_id,
        author_id: opid
    }).then(async (res) => {
        let result = {};
        if (res != null && res.length > 0) {
            result = res[0];
            // result['create_time']=util.formatUnixTime(result['create_time'],'Y/M/D');
            result['detailList'] = [];
            await  mysql(CNF.DB_TABLE.article_detail_info).select("*").where({article_id: article_id}).then(res => {
                result['detailList'] = res;
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
    let condition = ctx.request.body || {};
    let userInfo = condition.userInfo;
    let nickName = userInfo.nickName;
    let id = null
    if (condition.id != undefined && condition.id != null) {
        id = condition.id;
    }
    var queryConditon = {};
    queryConditon.status = 1;
    if (id != null) {
        queryConditon.id = id;
    }
    // 登录信息会被存储到 ctx.state.$wxInfo
    // let user = ctx.state.$wxInfo.userinfo;
    // console.log(user);
    await queryVisit(nickName, async (res) => {
        if (res != null) {
            if (res.length > 0) {
                const article_id_arr = [];
                res.forEach(res => {
                    article_id_arr.push(res.article_id);
                });
                await mysql(CNF.DB_TABLE.article_info).select('*').whereIn('id', article_id_arr).andWhere(queryConditon).orderBy('create_time', 'desc').then(res => {
                    SUCCESS(ctx, res);
                })
            } else {

                await mysql(CNF.DB_TABLE.article_info).select('*').where(queryConditon).orderBy('create_time', 'desc').then(res => {

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
    let condition = ctx.request.body || {};
    let userInfo = condition.userInfo;
    let nickName = userInfo.nickName;
    let article_id = condition.id;
    let articleInfo = {};
    if (condition.cover_pic_url != undefined) {
        articleInfo.title = condition.title;
    }
    if (condition.cover_pic_url != undefined) {
        articleInfo.cover_pic_url = condition.cover_pic_url;
    }
    if (condition.status != undefined) {
        articleInfo.status = condition.status;
    }
    //更新时间 保持一致
    let updateTime = Date.now();
    let updateDateTime = new Date(updateTime);
    if (article_id != null && article_id != null) {
        await mysql(CNF.DB_TABLE.article_info).select('id', 'version', 'create_time', 'author_name', 'author_id').where({
            id: article_id, author_id: nickName
        }).then(async result => {
            //版本+1
            articleInfo.version = result[0].version + 1;
            articleInfo.update_time = updateDateTime
            await mysql(CNF.DB_TABLE.article_info).update(articleInfo).where({
                id: article_id, author_id: nickName
            }).then(async res => {
                console.log("更新主表")
                console.log(res);
                if (condition.detailList && condition.detailList.length > 0) {
                    var updateInfos = [];
                    for (let i = 0; i < condition.detailList.length; i++) {
                        var detailInfo = condition.detailList[i];
                        var updateInfo = {};
                        if (detailInfo.id && detailInfo.id != '') {
                            updateInfo['id'] = detailInfo.id;
                            updateInfo['create_time'] = result[0]['create_time'];
                        } else {
                            updateInfo['id'] = uuidGenerator().replace(/-/g, "");
                            updateInfo['create_time'] = updateTime / 1000;
                        }
                        updateInfo['content'] = detailInfo.content || '';
                        updateInfo['picture_url'] = detailInfo.picture_url || '';
                        updateInfo['update_time'] = updateDateTime;
                        updateInfo['version'] = articleInfo['version'];
                        updateInfo['article_id'] = result[0]['id'];
                        updateInfo['author_name'] = result[0]['author_name'];
                        updateInfo['author_id'] = result[0]['author_id'];
                        updateInfos.push(updateInfo);
                    }
                    //先删除，后新增
                    await  mysql(CNF.DB_TABLE.article_detail_info).del().where({article_id: article_id}).then(async res => {
                        console.log("编辑删除明细")
                        await mysql(CNF.DB_TABLE.article_detail_info).insert(updateInfos).then(res => {
                            console.log("编辑新增明细")
                            SUCCESS(ctx, res);
                        })
                    })

                }
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
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function del(ctx, next) {
    let {article_id, opid} = ctx.query;
    opid = decodeURIComponent(opid);
    await  mysql(CNF.DB_TABLE.article_info).del().where({id: article_id, author_id: opid}).then(res => {
        mysql(CNF.DB_TABLE.article_detail_info).del().where({article_id: article_id, author_id: opid}).then(res => {
            console.log("删除明细成功！");
        });
        mysql(CNF.DB_TABLE.article_visitable_info).del().where({article_id: article_id}).then(res => {
            console.log("权限表数据！");
        });
        console.log("删除成功！");
        SUCCESS(ctx, res);
    }).catch(e => {
        FAILED(ctx, e.toString());
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
async function delDetail(ctx, next) {
    let {detail_id} = ctx.query;
    if (detail_id) {
        await  mysql(CNF.DB_TABLE.article_detail_info).del().where({id: detail_id}).then(res => {
            SUCCESS(ctx, res);
        }).catch(e => {
            FAILED(ctx, e.toString());
            debug('%s: %O', CNF.ERRORS.ERR_WHEN_DELETED_FROM_DB, e);
            // throw new Error(`${CNF.ERRORS.ERR_WHEN_DELETED_FROM_DB}\n${e}`)
        });
    } else {
        FAILED(ctx, "id为空！")
    }

}

/**
 *  查询自己的文章信息
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function queryOwnList(ctx, next) {
    let condition = ctx.request.body || {};
    let userInfo = condition.userInfo;
    let nickName = userInfo.nickName;
    await mysql(CNF.DB_TABLE.article_info).select("*").where({"author_id": nickName}).orderByRaw("status asc,update_time desc").then(res => {
        console.log("查询自己的文章信息。。。")
        SUCCESS(ctx, res);
    })
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

module.exports = {create, get, delDetail, query, update, del, queryOwnList};