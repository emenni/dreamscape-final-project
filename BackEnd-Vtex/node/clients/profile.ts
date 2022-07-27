import { InstanceOptions, IOContext, JanusClient } from '@vtex/api'

export class Profile extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...(options && options.headers),
        VtexIdClientAutCookie: context.authToken,
      },
    })
  }
  public async getEmail(id: string): Promise<any> {
    return this.http.get(`/api/profile-system/pvt/profiles/${id}/personalData`)
  }
}
