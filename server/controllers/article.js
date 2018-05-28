const save = (ctx, next) => {
	const context = ctx.request.body;
	ctx.body = {method: ctx.request.method, result1: context};
};
const edit = (ctx, next) => {

};
const del = (ctx, next) => {

};
module.exports = {save, edit, del};