import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { PrismaParticipantRepository } from "../repository/prisma/prisma-participant-repositories";
import { PrismaTripRepository } from "../repository/prisma/prisma-trip-repositories";
import { CreateInviteUseCase } from "../use-cases/CreateInviteUseCase";

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post("/trip/:tripId/invites", {
    schema: {
      body: z.object({
        email: z.string().email()
      }),
      params: z.object({
        tripId: z.string().uuid()
      })
    }
  } ,async (request, reply) => {
    const { email } = request.body 

    const { tripId } = request.params

    const tripRepository = new PrismaTripRepository()
    const ParticipantRepository = new PrismaParticipantRepository()

    const inviteUseCase = new CreateInviteUseCase(tripRepository, ParticipantRepository)

    const success = await inviteUseCase.execute({ email, tripId })

    if (success) {
      reply.status(201).send('Invite send successfully ✔')
    } else {
      reply.status(500).send('Error to send invite')
    }
})}    