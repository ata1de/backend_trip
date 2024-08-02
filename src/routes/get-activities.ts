import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { PrismaTripRepository } from "../repository/prisma/prisma-trip-repositories";
import { GetActivitiesUseCase } from "../use-cases/getActivitiesUseCase";

export async function getActivities(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/trip/:tripId/activities', {
        schema: {
            params: z.object({
                tripId: z.string().uuid()
            })
        }
    }, async (request, reply) => {
        const { tripId } = request.params

        const TripRepository = new PrismaTripRepository()
        const createTripUseCase = new GetActivitiesUseCase(TripRepository)

        const activities = await createTripUseCase.execute({ tripId })

        if (activities) {
            reply.status(200).send(activities)
        } else {
            reply.status(500).send({ message: 'Error server in get Activities' })
        }

})}
