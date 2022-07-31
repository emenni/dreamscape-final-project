import type { InstanceOptions, IOContext, IOResponse } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
export default class Combination extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('https://2zxs9i4im3.execute-api.us-east-1.amazonaws.com/v1/suggestion', context, {
      ...options,
      headers: {
        ...(options && options.headers),
        Authorization: context.authToken
      },
      retries: 0,
    })
  }

  public async getCombination(combination: string): Promise<string> {
    return this.http.get(combination, {
      metric: 'combination-getCombination',
    })
  }

  public async postCombination(combination: string, data: CombinationPostData): Promise<string> {
    return this.http.post(combination, data,{
      metric: 'combination-postCombination',
    })
  }

  public async postOrganizer(combination: string, data: CombinationPostOrganizerData): Promise<string> {
    return this.http.post(combination, data,{
      metric: 'combination-postOrganizer',
    })
  }

  public async putCombination(combination: string, data: CombinationPutData): Promise<string> {
    return this.http.put(combination, data,{
      metric: 'combination-putCombination',
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
