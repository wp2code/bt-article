function save(ctx,next){
    const context = ctx.request.body
    ctx.body = {method: ctx.request.method, result1: context};
}