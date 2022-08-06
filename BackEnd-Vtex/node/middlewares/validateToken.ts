import { ForbiddenError } from '@vtex/api'

export async function validateToken(ctx: Context, next: () => Promise<any>) {

  const user = await ctx.clients.profile.getUserById(ctx.vtex.adminUserAuthToken ?? '').catch((reason: any) => {
    return reason?.response?.data
  })

  if (await (user && user?.userId)) {
    await next()
  }else {
    throw new ForbiddenError({
      message: 'Forbidden',
      stack: 'forbidden'
    })
  }
}
