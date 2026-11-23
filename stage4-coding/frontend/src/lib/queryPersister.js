import { get, set, del } from 'idb-keyval'

export const queryPersister = {
  persistClient: async (client) => {
    await set('devcompass-query-cache', client)
  },

  restoreClient: async () => {
    return await get('devcompass-query-cache')
  },

  removeClient: async () => {
    await del('devcompass-query-cache')
  },
}