import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { PrismaParticipantRepository } from "../repository/prisma/prisma-participant-repositories";
import { GetParticipantDetailsUseCase } from "../use-cases/getParticipantDetailsUseCase";

export async function getParticipantsDetails(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/participant/:participantId', {
        schema: {
            params: z.object({
                participantId: z.string().uuid()
            })
        }
    }, async (request, reply) => {
        const { participantId } = request.params

        const ParticipantRepository = new PrismaParticipantRepository()
        const getParticipantDetailsUseCase = new GetParticipantDetailsUseCase(ParticipantRepository)

        const participant = await getParticipantDetailsUseCase.execute({ participantId })

        reply.status(200).send({
            participant
        })

})}