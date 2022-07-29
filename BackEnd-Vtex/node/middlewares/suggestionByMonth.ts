import { UserInputError } from '@vtex/api'

export async function suggestionByMonth(ctx: Context, next: () => Promise<any>) {

  ctx.set('Cache-Control','no-cache no-store');
  ctx.set('X-VTEX-Use-Https','true')
  ctx.set('Proxy-Authorization', 'ctx.authToken')

  const { month } = ctx.vtex.route.params

  if (!month) {
    throw new UserInputError('Month is required') // Wrapper for a Bad Request (400) HTTP Error. Check others in https://github.com/vtex/node-vtex-api/blob/fd6139349de4e68825b1074f1959dd8d0c8f4d5b/src/errors/index.ts
  }
  const res = await ctx.clients.suggestion.getSuggestion(`${month as string}`).catch((reason: any)=>{
    return reason?.response?.data
  })


  ctx.body = res;

  await next()
}
