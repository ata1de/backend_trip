import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { PrismaTripRepository } from "../repository/prisma/prisma-trip-repositories";
import { ConfirmTripUseCase } from "../use-cases/confirmTripUseCase";

export async function confirmTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/confirm', {
        schema: {
            params: z.object({
                tripId: z.string().uuid()
            })
        }
    }, async (request, reply) => {
        const { tripId } = request.params

        const prismaTripRepository = new PrismaTripRepository()
        const tripUseCase = new ConfirmTripUseCase(prismaTripRepository)

        const redirectUrl = await tripUseCase.execute({ tripId })
        
        return reply.redirect(redirectUrl)

    })

}