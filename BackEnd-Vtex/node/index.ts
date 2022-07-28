import type { ClientsConfig, ServiceContext, EventContext } from '@vtex/api'
import { method, Service } from '@vtex/api'

import { Clients } from './clients'
import { suggestionByMonth } from './middlewares/suggestionByMonth'
import { suggestionAll } from './middlewares/suggestionAll'
import { suggestionPut } from './middlewares/suggestionPut'
import { suggestionPost } from './middlewares/suggestionPost'
import { someStates } from './middlewares/someStates'

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
    month: string
    orderId: string
    products: Record<string,any>[]

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
export default new Service({
  clients,
  routes: {
    suggestionByMonth: method({
      GET: [suggestionByMonth],
    }),
    suggestionAll: method({
      GET: [suggestionAll],
    }),
    suggestionPut: method({
      PUT: [suggestionPut],
    }),
    suggestionPost: method({
      POST: [suggestionPost],
    }),
  },
  events: {
    someStates,
  },
})
