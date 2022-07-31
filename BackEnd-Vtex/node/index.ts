import type { ClientsConfig, ServiceContext, EventContext } from '@vtex/api'
import { method, Service } from '@vtex/api'

import { Clients } from './clients'
import { combinationByCombination } from './middlewares/combinationByCombination'
import { combinationAll } from './middlewares/combinationAll'
import { combinationPut } from './middlewares/combinationPut'
import { combinationPost } from './middlewares/combinationPost'
import { someStates } from './middlewares/someStates'
import {  testHelloWorldResolver } from './resolvers/testHelloWorld'
import { combinationByCombinationId } from './middlewares/combinationByCombinationId'


const TIMEOUT_MS = 800

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients>
  interface CombinationPostData {
    orderDate: string
    combination: string[][]
    occurrences?: number
    showInShop?: boolean
  }
  interface CombinationPutData {
    showInShop?: boolean
    occurrences?: number
  }

  interface CombinationPostOrganizerData {
    itens: string[][]
    orderDate: string
  }
  interface StatusChangeContext extends EventContext<Clients> {
    body: {
      domain: string
      orderId: string
      currentState: string
      lastState: string
      currentChangeDate: string
      lastChangeDate: string
    }
  }
}


//export default new Service<Clients,  State, ParamsContext>({
  export default new Service({
  graphql: {
    resolvers: {
      Query: {
        testHelloWorldResolver,
      },
    },
  },
  clients,
  routes: {
    combinationByCombination: method({
      GET: [combinationByCombination],
    }),
    combinationByCombinationId: method({
      GET: [combinationByCombinationId],
    }),
    combinationAll: method({
      GET: [combinationAll],
    }),
    combinationPut: method({
      PUT: [combinationPut],
    }),
    combinationPost: method({
      POST: [combinationPost],
    }),
    combinationOrganizer: method({
      POST: [combinationOrganizer],
    }),
  },
  events: {
    someStates,
  },
})
