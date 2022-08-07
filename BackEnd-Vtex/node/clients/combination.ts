import type { InstanceOptions, IOContext, IOResponse } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
export default class Combination extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('https://2zxs9i4im3.execute-api.us-east-1.amazonaws.com/v1/suggestion', context, {
      ...options,
      headers: {
        ...(options && options.headers),
        Authorization: context.authToken,
        'Cache-Control': 'no-cache no-store',
      },
      retries: 0
    })
  }

  public async getCombination(combination: string, data?: any): Promise<string> {
    return this.http.get(combination, {
      metric: 'combination-getCombination',
      params: data,
      retries: 2
    })
  }

  public async postCombination(combination: string, data: CombinationPostData): Promise<string> {
    return this.http.post(combination, data,{
      metric: 'combination-postCombination',
      retries: 0
    })
  }

  public async postOrganizer(combination: string, data: CombinationPostOrganizerData): Promise<string> {
    return this.http.post(combination, data,{
      metric: 'combination-postOrganizer',
      retries: 0
    })
  }

  public async putCombination(combination: string, data: CombinationPutData): Promise<string> {
    return this.http.put(combination, data,{
      metric: 'combination-putCombination',
      retries: 2
    })
  }



  public async deleteCombination(combination: string): Promise<IOResponse<void>> {
    return this.http.delete(combination, {
      metric: 'combination-delete',
      retries: 2
    })
  }
}
