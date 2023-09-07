import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

export const app = fastify() // exporta o app

app.register(cookie)

app.register(transactionsRoutes, {
  prefix: 'transactions' 
})
// tem a aplicação completa, mas sem o listen