const diaryopt = require("../utils/diaryopt");

const save=async(ctx,next)=>{
	diaryopt.insertDiary(ctx,next)
}
const del=async(ctx,next)=>{
	diaryopt.deleteDiary(ctx,next)
}
const query=async(ctx,next)=>{
	diaryopt.queryDiary(ctx,next)
}
const update=async(ctx,next)=>{
	diaryopt.updateDiary(ctx,next)
}
module.exports={save,del,update,query}