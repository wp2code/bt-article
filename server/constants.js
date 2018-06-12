CNF = {
	DB_TABLE:{
		"diary_info":"diary_info"
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
	ctx.state.data = result !== undefined || result != null ? result : {};
	ctx.state.code = CNF.OPT_STATE.SUCCESS;
}

function FAILED(ctx, result) {
	ctx.state.data= result !== undefined || result != null ? result : {};
	ctx.state.code = CNF.OPT_STATE.FAILED;
}

module.exports = {SUCCESS, FAILED, CNF};