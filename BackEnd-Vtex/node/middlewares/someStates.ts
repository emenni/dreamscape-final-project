import axios from 'axios'

export async function someStates(
  ctx: StatusChangeContext | Context,
  next: () => Promise<any>
) {
  const orderId = ctx.body.orderId
  const orderBody = await ctx.clients.order.order(orderId)

  /*
  possiveis de ser obtidas com o profile.getEmail
  const profileId = orderBody.clientProfileData.userProfileId
  const userEmail = (await ctx.clients.profile.getEmail(profileId))
  {
    birthDate: null,
    cellPhone: null,
    businessPhone: null,
    fancyName: null,
    corporateName: null,
    document: '25124792000',
    email: 'camilaclto@hotmail.com',
    isPJ: 'False',
    firstName: 'Camila',
    gender: null,
    homePhone: '+5521999999999',
    isFreeStateRegistration: null,
    lastName: 'Teixeira',
    documentType: 'cpf',
    nickName: null,
    stateRegistration: null,
    userId: '01864ade-2de1-4916-adf2-32ada24e9fc4',
    customerClass: null,
    createdIn: '2022-07-18T22:34:00.9580105Z',
    businessDocument: null
  }

  */

  const products = orderBody.items.map((product) => {
    return {
      skuId: product.id,
      productId: product.productId,
      ean: product.ean,
      refId: product.refId,
      imageUrl: product.imageUrl,
      categorys: product.additionalInfo.categoriesIds,
      brandId: product.additionalInfo.brandId,
      price: product.price,
      quantity: product.quantity
    }
  })
  const creationDate = new Date(orderBody.creationDate)
  const currentMonth = creationDate.getMonth() + 1;
  await axios
    .get(
      `/_v/suggestion/${currentMonth}/${orderId}`,
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
            month: currentMonth,
            creationDate: creationDate.toISOString().split('T')[0],
            orderId: orderId,
            products: products,
          })
      } else {
        axios
          .patch(`/_v/suggestion/${currentMonth}/${orderId}/put`, { // á definir quais dados seram enviados para edição
            products: products,
          })
      }
    })

  await next()
}
