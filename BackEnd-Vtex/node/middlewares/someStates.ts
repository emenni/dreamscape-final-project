import axios from 'axios'

export async function someStates(
  ctx:  StatusChangeContext,
  next: () => Promise<any>
) {
  const body = ctx.body

  const orderId = body.orderId
  const orderBody = await ctx.clients.order.order(orderId)

  const products: string[] = []
  orderBody.items.map((product: any) => {
    products.push(product.id)
  })
  const creationDate = new Date(orderBody.creationDate)
  await axios
    .post(
      `/_v/combination/organizer`, {
        orderDate: creationDate.toISOString().split('T')[0],
        items: [products],
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      }
    )

  await next()
}
