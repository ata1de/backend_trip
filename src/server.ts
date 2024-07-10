import fastify from 'fastify'
import { createTrip } from './routes/create-trip'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { confirmTrip } from './routes/confirm-trip';

const app = fastify()


// // Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip)
app.register(confirmTrip)

app.get('/', async (request, reply) => {
    return { hello: 'world' }

})

app.listen({port: 3333}).then(() => {
    console.log('Server is running on http://localhost:3333 🚀')
})