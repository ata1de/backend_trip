import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { PrismaTripRepository } from "../repository/prisma/prisma-trip-repositories";
import { UpdateTripUseCase } from "../use-cases/updateTripUseCase";

export async function updateTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put("/trips/:tripId", {
    schema: {
        params: z.object({
            tripId: z.string().uuid()
        }),
        body: z.object({
            destination: z.string(),
            start_at: z.coerce.date(),
            end_at: z.coerce.date(),
        })
    }
  } ,async (request, reply) => {
    const { tripId } = request.params
    const { destination, start_at, end_at } = request.body 

    const TripRepository = new PrismaTripRepository()
    const updateTripUseCase = new UpdateTripUseCase(TripRepository)

    const message = await updateTripUseCase.execute({tripId, destination, start_at, end_at})

    reply.status(200).send(message)
    
})}   