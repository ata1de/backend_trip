import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function createLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post("/trip/:tripId/links", {
    schema: {
      body: z.object({
        title: z.string(),
        url: z.string().url(),
      }),
      params: z.object({
        tripId: z.string().uuid()
      })
    }
  } ,async (request, reply) => {
    const { title, url } = request.body 

    const { tripId } = request.params

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId
      }
    })

    if (!trip) {
      throw new Error('Trip not found')
    }

    const link = await prisma.link.create({
      data: {
        title,
        url,
        trip_id: tripId
      }
    })

    return { linkId: link.id}
})}    