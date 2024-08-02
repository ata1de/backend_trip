import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { PrismaTripRepository } from "../repository/prisma/prisma-trip-repositories";
import { GetParticipantUseCase } from "../use-cases/getParticipantUseCase";

export async function getParticipants(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/trip/:tripId/participants', {
        schema: {
            params: z.object({
                tripId: z.string().uuid()
            })
        }
    }, async (request, reply) => {
        const { tripId } = request.params

        const TripRepository = new PrismaTripRepository()
        const getParticipantUseCase = new GetParticipantUseCase(TripRepository)

        const participants = await getParticipantUseCase.execute({ tripId })

        reply.status(200).send({
            participants
        })

})}