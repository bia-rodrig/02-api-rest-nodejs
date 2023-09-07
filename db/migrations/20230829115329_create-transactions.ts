import { Knex } from "knex";

//up - o que a migration vai fazer no banco de dados - exemplo: adicionar tabela, excluir tabela
export async function up(knex: Knex): Promise<void> {
    //1º parametro - nome da tabela
    //2º - função com os campos da tabela
    await knex.schema.createTable('transactions', (table) => {
        //table.increments() //auto increment
        table.uuid('id').primary() //chave primaria aleatoria e mais dificil de descobrir -> 'id' nome do campo na tabela -> primary -> primary key
        table.text('title').notNullable() // -> não pode ficar vazio
        table.decimal('amount', 10, 2).notNullable() //tamanho de número que quer armazenar e o número de casas decimais
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable() //data que cada registro foi criado
        //se fosse SQL seria 'NOW()', postgres e sqlite ('CURRENT_TIMESTAMP') -> porém o knex é utilizdo para possibilitar a troca do banco de dados
        // sem precisar alterar comandos. então é preciso algo universal
    })
}

//down - deu erro, se precisar voltar atras, o metodo down tem que fazer o contrario do up - remove tabela, recria tabela
export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('transactions')
}

