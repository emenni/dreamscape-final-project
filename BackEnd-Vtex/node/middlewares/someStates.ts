import axios from 'axios'
import { json } from 'co-body';

export async function someStates(
  ctx:  Context,
  next: () => Promise<any>
) {
  const body = await json(ctx.req)

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
