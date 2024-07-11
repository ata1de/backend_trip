import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function getTripDetails(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/trip/:tripId', {
        schema: {
            params: z.object({
                tripId: z.string().uuid()
            })
        }
    }, async (request, reply) => {
        const { tripId } = request.params

        const trip = await prisma.trip.findUnique({
            where: { id: tripId},
            select: {
                id: true,
                destination: true,
                start_at: true,
                end_at: true,
                is_confirmed: true
            }
        })

        if (!trip) {
                throw new Error('Trip not found')
         }

        reply.status(200).send({
            trip
        })

})}