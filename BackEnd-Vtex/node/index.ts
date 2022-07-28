import type { ClientsConfig, ServiceContext, EventContext } from '@vtex/api'
import { method, Service } from '@vtex/api'

import { Clients } from './clients'
import { suggestion } from './middlewares/suggestion'
import { suggestionAll } from './middlewares/suggestionAll'
import { suggestionPut } from './middlewares/suggestionPut'
import { suggestionPost } from './middlewares/suggestionPost'
//import { someStates } from './middlewares/someStates'


import {  gqlSuggestions } from './resolvers/suggestions'


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
  interface SuggestionData {
    email: string
    points: number

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
        gqlSuggestions,
      },
    },
  },
  clients,
  routes: {
    suggestionOne: method({
      GET: [suggestion],
    }),
    suggestionAll: method({
      GET: [suggestionAll],
    }),
    suggestionPut: method({
      PATCH: [suggestionPut],
    }),
    suggestionPost: method({
      POST: [suggestionPost],
    }),
  },
  events: {
    //someStates,
  },
})
