// src/routes/confirm-participants.ts
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { PrismaParticipantRepository } from "../repository/prisma/prisma-participant-repositories";
import { ConfirmParticipantUseCase } from "../use-cases/confirmParticipantUseCase";

export async function confirmParticipants(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/participant/:participantId/confirm', {
    schema: {
      params: z.object({
        participantId: z.string().uuid()
      })
    }
  }, async (request, reply) => {
    const { participantId } = request.params;
    
    const participantRepository = new PrismaParticipantRepository();
    const confirmParticipantUseCase = new ConfirmParticipantUseCase(participantRepository);
    
    const redirectUrl = await confirmParticipantUseCase.execute({ participantId });

    return reply.redirect(redirectUrl);
  });
}
