import { UserInputError } from '@vtex/api';
import { json } from 'co-body';

export async function suggestionPut(ctx: Context, next: () => Promise<any>) {
  const body = (await json (ctx.req))

  ctx.set('Cache-Control','no-cache no-store');
  ctx.set('X-VTEX-Use-Https','true')
  ctx.set('Proxy-Authorization','ctx.authToken')
  ctx.set('Access-Control-Allow-Origin','*')


  const { month, orderId } = ctx.vtex.route.params

  if (!month || !orderId ) {
    throw new UserInputError('Invalid request') // Wrapper for a Bad Request (400) HTTP Error. Check others in https://github.com/vtex/node-vtex-api/blob/fd6139349de4e68825b1074f1959dd8d0c8f4d5b/src/errors/index.ts
  }
  const res = await ctx.clients.suggestion.getPut(`/${month}/${orderId}`, body).catch((reason: any)=>{
    return reason?.response?.data
  })


  ctx.body = res;

  await next()
}
