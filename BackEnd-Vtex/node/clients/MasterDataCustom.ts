import { InstanceOptions, IOContext, UserInputError } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class MasterDataCustom extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://${context.account}.vtexcommercestable.com.br/api/dataentities`,
      context,
      {
        ...options,
        headers: {
          VtexIdClientAutCookie: context.authToken,
        },
      }
    )
  }

  public async getData(page: number, pageSize: number) {
    if (page < 1) {
      throw new UserInputError('Smallest page value is 1');
    }
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    //1,2 --já está adicionado + mais a quantidade é 3
    //1,2
    return this.http.getRaw(`/orders/search?_fields=items,creationDate,orderId`, {
      headers: {
        'REST-Range': `resources=${startIndex}-${endIndex}`
      }
    })
  }

}
