import type { InstanceOptions, IOContext, IOResponse } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
export default class Suggestion extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('https://2zxs9i4im3.execute-api.us-east-1.amazonaws.com/v1/suggestion', context, {
      ...options,
      headers: {
        ...(options && options.headers)
      },
      retries: 0,
    })
  }

  public async getSuggestion(suggestion: string): Promise<string> {
    return this.http.get(suggestion, {
      metric: 'suggestion-get',
    })
  }

  public async getPost(suggestion: string, data: SuggestionData): Promise<string> {
    return this.http.post(suggestion, data,{
      metric: 'suggestion-get',
    })
  }


  public async getPut(suggestion: string, data: SuggestionData): Promise<string> {
    return this.http.put(suggestion, data,{
      metric: 'suggestion-get',
    })
  }


  public async getSuggestionAll(suggestion: string): Promise<string> {
    return this.http.get(suggestion, {
      metric: 'suggestion-get',
    })
  }


  public async getSuggestionWithHeaders(
    suggestion: string
  ): Promise<IOResponse<string>> {
    return this.http.getRaw(suggestion, {
      metric: 'suggestion-get-raw',
    })
  }
}
