import { ClientError } from "../errors/client-error"
import { TripRepository } from "../repository/trip-repository"


interface GetParticipantUseCaseRequest {
    tripId: string
}

export class GetParticipantUseCase {
    constructor(private tripRepository: TripRepository) {}

    async execute({ tripId }: GetParticipantUseCaseRequest) {
        const trip = await this.tripRepository.findUniqueGetParticipants(tripId)

        if (!trip) {
            throw new ClientError('Participant not found')
         }

        return trip.participant
    }
}