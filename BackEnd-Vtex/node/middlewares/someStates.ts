import axios from 'axios'

export async function someStates(
  ctx:  StatusChangeContext,
  next: () => Promise<any>
) {
  const body = ctx.body

  const orderId = body.orderId
  const orderBody = await ctx.clients.order.order(orderId)

  const products = orderBody.items.map((product: any) => {
    return product.id
  })
  const creationDate = new Date(orderBody.creationDate)

  const source = ctx.vtex.workspace !== "master" ? `${ctx.vtex.workspace}--${ctx.vtex.account}` : ctx.vtex.account
  const data = [
    {
      orderDate: creationDate.toISOString().split('T')[0],
      items: [products],
    }
  ]
  await axios
    .post(
      `http://${source}.myvtex.com/_v/combination/organizer`, data,
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      }
    )

  await next()
}
