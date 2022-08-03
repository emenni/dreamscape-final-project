import type { ClientsConfig, ServiceContext, EventContext, RecorderState } from '@vtex/api'
import { method, Service } from '@vtex/api'

import { Clients } from './clients'
import { combinationByCombination } from './middlewares/combinationByCombination'
import { combinationOrganizer } from './middlewares/combinationOrganizer'
import { combinationAll } from './middlewares/combinationAll'
import { combinationPut } from './middlewares/combinationPut'
import { combinationPost } from './middlewares/combinationPost'
import { someStates } from './middlewares/someStates'
import { createOldOrdersCombinations } from './middlewares/createOldOrdersCombinations'
import {  testHelloWorldResolver } from './resolvers/testHelloWorld'
import { combinationByCombinationId } from './middlewares/combinationByCombinationId'


const TIMEOUT_MS = 360000

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
    })
  },
  events: {
    someStates,
    onAppInstalled: createOldOrdersCombinations,
    onSettingsChanged: createOldOrdersCombinations
  },
})
