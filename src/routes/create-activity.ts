import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";

export async function createActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post("/trip/:tripId/activities", {
    schema: {
      body: z.object({
        title: z.string(),
        occurs_at: z.coerce.date(),
      }),
      params: z.object({
        tripId: z.string().uuid()
      })
    }
  } ,async (request, reply) => {
    const { title, occurs_at } = request.body 

    const { tripId } = request.params

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId
      }
    })

    if (!trip) {
      throw new Error('Trip not found')
    }

    if (dayjs(occurs_at).isBefore(new Date())) {
      throw new Error('Invalid activity date')
    }

    const activity = await prisma.activity.create({
      data: {
        title,
        occurs_at,
        trip_id: tripId
      }
    })

    return { activityId: activity.id}
})}    