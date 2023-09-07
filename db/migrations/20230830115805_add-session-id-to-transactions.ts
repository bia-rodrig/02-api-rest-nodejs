import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('transactions', (table) => {
        table.uuid('session_id').after('id').index() //indice é uma forma de falar para o banco de dados que vai realizar muitas buscas
        //o session_id vai ser muito utilizado no Where - assim o banco de dados fica mais rapido
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('transactions', (table) => {
        table.dropColumn('session_id')
    })
}

