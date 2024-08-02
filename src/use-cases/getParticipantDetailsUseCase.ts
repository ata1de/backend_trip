import { ClientError } from "../errors/client-error"
import { ParticipantRepository } from "../repository/participant-repository"


interface GetParticipantDetailsUseCaseRequest {
    participantId: string
}

export class GetParticipantDetailsUseCase {
    constructor(private participantRepository: ParticipantRepository) {}

    async execute({ participantId }: GetParticipantDetailsUseCaseRequest) {
        const participant = await this.participantRepository.findUnique(participantId)

        if (!participant) {
            throw new ClientError('Participant not found')
         }

        return participant
    }
}

// const participant = await prisma.participant.findUnique({
//     where: { id: participantId},
//     select: {
//         id: true,
//         name: true,
//         email: true,
//         is_confirmed: true
//     }
// })

// if (!participant) {
//     throw new ClientError('Participant not found')
//  }

// reply.status(200).send({
//     participant
// })