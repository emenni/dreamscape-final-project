import { UserInputError } from '@vtex/api'

export async function suggestion(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: {
      route: { params },
    },
  } = ctx

  ctx.set('Cache-Control','no-cache no-store');
  ctx.set('X-VTEX-Use-Https','true')
  ctx.set('Proxy-Authorization', 'ctx.authToken')

  const { email } = params

  if (!email) {
    throw new UserInputError('Email is required') // Wrapper for a Bad Request (400) HTTP Error. Check others in https://github.com/vtex/node-vtex-api/blob/fd6139349de4e68825b1074f1959dd8d0c8f4d5b/src/errors/index.ts
  }
  const res = await ctx.clients.suggestion.getSuggestion('/'+ email as string).catch((reason: any)=>{
    return reason?.response?.data
  })


  ctx.body = res;

  await next()
}
