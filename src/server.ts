// importa o app
import { app } from './app'
import { env } from './env'

app
  .listen({
    host: '0.0.0.0', // adicionado segundo solução no forum
    port: env.PORT,
  })
  .then(function () {
    console.log('HTTP Server Running')

  })
