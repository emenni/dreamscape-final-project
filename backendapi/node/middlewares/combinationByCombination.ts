import { UserInputError } from '@vtex/api'

export async function combinationByCombination(ctx: Context, next: () => Promise<any>) {

  ctx.set('Cache-Control','no-cache no-store');
  ctx.set('X-VTEX-Use-Https','true')
  ctx.set('Proxy-Authorization', 'ctx.authToken')
  ctx.set('Authorization','ctx.authToken')

  const { combination } = ctx.vtex.route.params

  if (!combination) {
    throw new UserInputError('Combination is required') // Wrapper for a Bad Request (400) HTTP Error. Check others in https://github.com/vtex/node-vtex-api/blob/fd6139349de4e68825b1074f1959dd8d0c8f4d5b/src/errors/index.ts
  }
  const res = await ctx.clients.combination.getCombination(`/${combination as string}`).catch((reason: any)=>{
    ctx.status = reason?.response?.status
    return reason?.response?.data
  })


  ctx.body = res;

  await next()
}
