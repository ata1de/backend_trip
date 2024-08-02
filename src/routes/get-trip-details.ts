import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { PrismaTripRepository } from "../repository/prisma/prisma-trip-repositories";
import { GetTripDetailsUseCase } from "../use-cases/getTripDetailsUseCase";

export async function getTripDetails(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/trip/:tripId', {
        schema: {
            params: z.object({
                tripId: z.string().uuid()
            })
        }
    }, async (request, reply) => {
        const { tripId } = request.params

        const TripRepository = new PrismaTripRepository()
        const tripDetailsUseCase = new GetTripDetailsUseCase(TripRepository)

        const trip = await tripDetailsUseCase.execute(tripId)

        reply.status(200).send({
            trip
        })

})}