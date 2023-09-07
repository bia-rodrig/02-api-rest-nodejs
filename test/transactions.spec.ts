import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'


import request from 'supertest'

import { app } from '../src/app'


describe('Transactions routes', () => {
    beforeAll(async () => {
        await app.ready()
    })
    
    afterAll(async () => {
        await app.close
    })

    beforeEach(async () => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')

    })

    it('should be able to create a new transaction', async () =>{
        await request(app.server)
        .post('/transactions')
        .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit'
        }).expect(201)        
    })

    it('should be able to list all transactions', async () => {
        const createTransactionResponse = await request(app.server)
        .post('/transactions')
        .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit'
        })

        const cookies = createTransactionResponse.get('Set-Cookie')

        const listTransactionsResponse = await request(app.server)
        .get('/transactions')
        .set('Cookie', cookies)
        .expect(200)

        expect (listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'New transaction',
                amount: 5000,
            })
        ])
    })

    it('should be able to get a specific transaction', async () => {
        // precisa  pegar o ID, porém quando cria a rota, não retorna nada
        // o teste precisa se adaptar ao código e não o código ao teste
        const createTransactionResponse = await request(app.server)
        .post('/transactions')
        .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit'
        })

        const cookies = createTransactionResponse.get('Set-Cookie')
        
        //por isso mantém a listagem aqui
        const listTransactionsResponse = await request(app.server)
        .get('/transactions')
        .set('Cookie', cookies)
        .expect(200)

        const transactionId = listTransactionsResponse.body.transactions[0].id //pega o id da transação na posição 0
        // que na verdade só tem uma criada

        //faz uma nova requisição, passando o id
        const getTransactionResponse = await request(app.server)
        .get(`/transactions/${transactionId}`) //utiliza crase
        .set('Cookie', cookies)
        .expect(200)

        //tem que ver como está o retorno na rota (transactions.ts), pra saber o que vai esperar
        //a rota está retornando um objeto com as informações do id informado
        //corrigir o body de transactionS para transaction
        expect (getTransactionResponse.body.transaction).toEqual(
            expect.objectContaining({
                title: 'New transaction',
                amount: 5000,
            })
        ) 
    })

    it('should be able to get the summary', async () => {
        //cria uma transação
        const createTransactionResponse = await request(app.server)
        .post('/transactions')
        .send({
            title: 'Credit transaction', //alterado nome
            amount: 5000,
            type: 'credit'
        })

        const cookies = createTransactionResponse.get('Set-Cookie')

        //cria uma segunda transação com o mesmo cookie
        await request(app.server)
        .post('/transactions')
        .set('Cookie', cookies)
        .send({
            title: 'Debit transaction',
            amount: 2000,
            type: 'debit'
        })

        const summaryResponse = await request(app.server)
        .get('/transactions/summary') //corrige a rota
        .set('Cookie', cookies)
        .expect(200)

        expect (summaryResponse.body.summary).toEqual({
            amount: 3000 // 5000 - 2000
        })
    })
})

