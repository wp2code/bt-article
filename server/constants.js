CNF = {
    DB_TABLE: {
        "diary_info": "diary_info"
    },
    OPT_STATE: {
        SUCCESS: "success",  // 操作成功
        FAILED: "failed"    // 操作失败
    },
    ERRORS: {
        ERR_WHEN_EDIT_TO_DB: "ERR_WHEN_EDIT_TO_DB",
        ERR_WHEN_QUERY_FROM_DB: "ERR_WHEN_QUERY_FROM_DB",
        ERR_WHEN_DELETED_FROM_DB: "ERR_WHEN_DELETED_FROM_DB"
    },
};

function SUCCESS(ctx, result) {
    console.log('Success 结果：' + result);
    const body = {};
    body.code = CNF.OPT_STATE.SUCCESS;
    body.data = result !== undefined ? result : {};
    ctx.body = body;
}

function FAILED(ctx, result) {
    console.log('Failed 结果：' + result);
    const body = {};
    body.code = CNF.OPT_STATE.FAILED;
    body.data = result !== undefined ? result : {};
    ctx.body = body;
}

module.exports = {SUCCESS, FAILED, CNF};