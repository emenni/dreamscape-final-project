import axios from 'axios'
import { json } from 'co-body';

export async function someStates(
  ctx:  Context,
  next: () => Promise<any>
) {
  const body = await json(ctx.req)

  const orderId = body.orderId
  const orderBody = await ctx.clients.order.order(orderId)

  const profileId = orderBody.clientProfileData.userProfileId
  const userEmail = (await ctx.clients.profile.getEmail(profileId)).email
  axios
    .get(
      `/_v/suggestion/${userEmail}`,
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      }
    )
    .then((response: any) => {
      if (typeof response.data?.Item === 'undefined') {
        axios
          .post(`/_v/suggestion/new`, { //á definir quais dados seram enviados para criação
            email: userEmail,
            produtos: orderBody.items,
          })
      } else {
        axios
          .patch(`/_v/suggestion/put`, { // á definir quais dados seram enviados para edição
            email: userEmail,
            produtos: orderBody.items,
          })
      }
    })

  await next()
}
