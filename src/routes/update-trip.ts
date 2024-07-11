import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { ClientError } from "../errors/client-error";

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

    if (dayjs(start_at).isBefore(new Date())) {
      throw new ClientError('Invalid trip start date')
      
    }
    
    if (dayjs(end_at).isBefore(dayjs(start_at))) {
      throw new ClientError('Invalid trip end date')
    }

    await prisma.trip.update({
        where: { id: tripId},
        data: {
            destination,
            start_at,
            end_at
        }
    })

    reply.status(200).send('Resource updated successfully ✔')
    
})}   