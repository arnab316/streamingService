const v1Routes = async(fastify, options)=>{
    fastify.get('/test', async(request, reply)=>{
      return {message: "Hello from v1 route"}
    })
 }
 
 export default v1Routes;