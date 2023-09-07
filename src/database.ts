import { knex as setupKnex, Knex } from 'knex'

import { env } from './env'

export const config: Knex.Config = {
    client: env.DATABASE_CLIENT,
    // se for sqlite passa um objeto, senao passa só a url do env
    connection: env.DATABASE_CLIENT === 'sqlite' ? {
        filename: env.DATABASE_URL
    } : env.DATABASE_URL,
    // o sqlite precisa da url como objeto -está na documentação do knex
    // o postgrs só precisa da url
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations'
    }
}

export const knex  = setupKnex(config)