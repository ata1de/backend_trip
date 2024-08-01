import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { PrismaLinkRepository } from "../repository/prisma/prisma-link-repositories";
import { PrismaTripRepository } from "../repository/prisma/prisma-trip-repositories";
import { CreateLinkUseCase } from "../use-cases/createLinkUseCase";

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

    const tripRepository = new PrismaTripRepository()
    const linkRepository = new PrismaLinkRepository()

    const createLinkUseCase = new CreateLinkUseCase(tripRepository, linkRepository)

    const linkId = await createLinkUseCase.execute({ tripId, title, url })

    return {
      linkId: linkId
    }
})}  