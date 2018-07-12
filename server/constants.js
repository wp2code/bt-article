CNF = {
	DB_TABLE: {
		"article_detail_info": "article_detail_info",
		"article_info": "article_info",
		"article_user_info": "article_user_info",
		"article_visitable_info": "article_visitable_info"
	},
	OPT_STATE: {
		SUCCESS_CODE: 1,
		SUCCESS: "success",  // 操作成功
		FAILED: "failed",    // 操作失败
		FAILED_CODE: -1
	},
	ERRORS: {
		ERR_WHEN_INSERT_TO_DB: "ERR_WHEN_INSERT_TO_DB",
		ERR_WHEN_EDIT_TO_DB: "ERR_WHEN_EDIT_TO_DB",
		ERR_WHEN_QUERY_FROM_DB: "ERR_WHEN_QUERY_FROM_DB",
		ERR_WHEN_DELETED_FROM_DB: "ERR_WHEN_DELETED_FROM_DB"
	},
};

function SUCCESS(ctx, result) {
	console.log("Success 结果：" + result);
	const body = {};
	body.message = CNF.OPT_STATE.SUCCESS;
	body.code = CNF.OPT_STATE.SUCCESS_CODE;
	body.data = result !== undefined ? result : {};
	ctx.body = body;
}

function FAILED(ctx, result) {
	console.log("Failed 结果：" + result);
	const body = {};
	body.message = result != null && result != "" ? result : CNF.OPT_STATE.FAILED;
	body.code = CNF.OPT_STATE.FAILED_CODE;
	body.data = result !== undefined ? result : {};
	ctx.body = body;
}

module.exports = {SUCCESS, FAILED, CNF};