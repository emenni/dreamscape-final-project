import { json } from 'co-body';

export async function combinationPost(ctx: Context, next: () => Promise<any>) {
  const body = (await json (ctx.req))

  ctx.set('Cache-Control','no-cache no-store');
  ctx.set('X-VTEX-Use-Https','true')
  ctx.set('Proxy-Authorization','ctx.authToken')
  ctx.set('Authorization','ctx.authToken')
  ctx.set('Access-Control-Allow-Origin','*')

  const res = await ctx.clients.combination.postCombination('', body).catch((reason: any)=>{
    ctx.status = reason?.response?.status
    return reason?.response?.data
  })

  console.log("🚀 ~ file: combinationPost.ts ~ line 16 ~ combinationPost ~ res", res)


  ctx.body = res;

  await next()
}
