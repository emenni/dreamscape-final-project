import { InstanceOptions, IOContext, JanusClient } from '@vtex/api'

export class Profile extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...(options && options.headers),
        VtexIdClientAutCookie: context.authToken
      },
    })
  }

  public async getUserById(token: string): Promise<any> {
    return this.http.get(`/api/vtexid/pub/authenticated/user?authToken=${token}`)
  }
}
