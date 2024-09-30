import Fastify from 'fastify'
import apiRoutes from './routes/videoRoutes.js';
import fastifyStatic from 'fastify-static';
import {config} from './config/serverConfig.js';
import path from 'path';
import { fileURLToPath } from 'url';
const fastify = Fastify({
  logger: true,
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const startAndStop = ()=>{

    fastify.register(apiRoutes, { prefix: '/api/v1' });
    // fastify.register(fastifyStatic, {
    //   root: path.join(__dirname, '../uploads'),
    //   prefix: '/uploads/', // Serve files from this folder
    // });
    fastify.listen({ port: config.PORT }, function (err, address) {
      if (err) {
        fastify.log.error(err)
        process.exit(1)
      }
      console.log(`server is now listening on ${address}`)
    })
    
}

startAndStop()