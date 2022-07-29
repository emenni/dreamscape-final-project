import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'
export default class TestHelloWorld extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('https://grhrvkk2k9.execute-api.us-east-1.amazonaws.com', context, {
      ...options,
      headers: {
        ...(options && options.headers)
      },
      retries: 0,
    })
  }

  public go = () => {

    return  this.http.get(`default/myFunctionName`)

  }

}
