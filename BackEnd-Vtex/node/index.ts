import { ClientsConfig, ServiceContext, EventContext, RecorderState, LRUCache } from '@vtex/api'
import { method, Service } from '@vtex/api'

import { Clients } from './clients'
import { combinationByCombination } from './middlewares/combinationByCombination'
import { combinationOrganizer } from './middlewares/combinationOrganizer'
import { combinationAll } from './middlewares/combinationAll'
import { combinationPut } from './middlewares/combinationPut'
import { combinationPost } from './middlewares/combinationPost'
import { combinationDelete } from './middlewares/combinationDelete'
import { someStates } from './middlewares/someStates'
import { createOldOrdersCombinations } from './middlewares/createOldOrdersCombinations'
import {  testHelloWorldResolver } from './resolvers/testHelloWorld'
import { combinationByCombinationId } from './middlewares/combinationByCombinationId'
import { validateToken } from './middlewares/validateToken'


const TIMEOUT_MS = 360000
const memoryCache = new LRUCache<string, any>({ max: 10 })
const SettingsCache = new LRUCache<string, any>({ max: 10 })
const BudgetCache = new LRUCache<string, any>({
  max: 10,
})
metrics.trackCache('status', memoryCache)
metrics.trackCache('settings', SettingsCache)
metrics.trackCache('BU', BudgetCache)
const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    combination: {
      memoryCache,
    },
    status: {
      memoryCache,
    },
  },

}

declare global {
  type Context = ServiceContext<Clients, State>
  interface InstalledAppEvent extends EventContext<Clients> {
    body: { id?: string }
  }
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
    items: string[][]
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

  interface State extends RecorderState {}
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
      GET: [validateToken,combinationByCombination],
    }),
    combinationByCombinationId: method({
      GET: [validateToken,combinationByCombinationId],
    }),
    combinationAll: method({
      GET: [validateToken,combinationAll],
    }),
    combinationPut: method({
      PUT: [validateToken,combinationPut],
    }),
    combinationPost: method({
      POST: [validateToken,combinationPost],
    }),
    combinationOrganizer: method({
      POST: [validateToken,combinationOrganizer],
    }),
    combinationDelete: method({
      DELETE: [validateToken,combinationDelete],
    })
  },
  events: {
    someStates,
    onAppInstalled: createOldOrdersCombinations,
    onSettingsChanged: createOldOrdersCombinations
  },
})
