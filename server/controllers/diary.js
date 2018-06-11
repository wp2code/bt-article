const diaryopt = require("../utils/diaryopt");

const edit = (ctx, next) => {
    const diaryInfo = ctx.request.body || {}
    diaryopt.editDiary(ctx, diaryInfo);
}
const del = async (ctx, next) => {
    const diaryInfo = {}
    var {id} = ctx.request.query;
    diaryInfo.diary_id = id
    // diaryInfo.open_id = id
    ctx.body = diaryopt.deleteDiary(ctx, diaryInfo)
}
const query = async (ctx, next) => {
    var diaryInfo=ctx.request.body || {}
    diaryopt.queryDiary(ctx, diaryInfo)
}
module.exports = {edit, query, del}