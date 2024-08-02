import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { PrismaTripRepository } from "../repository/prisma/prisma-trip-repositories";
import { GetLinkUseCase } from "../use-cases/getLinksUseCase";

export async function getLinks(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/trip/:tripId/links', {
        schema: {
            params: z.object({
                tripId: z.string().uuid()
            })
        }
    }, async (request, reply) => {
        const { tripId } = request.params

        const TripRepository = new PrismaTripRepository()
        const getLinkUseCase = new GetLinkUseCase(TripRepository)

        const links = await getLinkUseCase.execute({ tripId })

        reply.status(200).send({
            links:links
        })

})}

// const trip = await prisma.trip.findUnique({
//     where: { id: tripId},
//     include:{ 
//         links: true,
        
//     }
// })

// if (!trip) {
//         throw new ClientError('Trip not found')
//  }

// reply.status(200).send({
//     links: trip.links
// })