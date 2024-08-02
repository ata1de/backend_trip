import { ClientError } from "../errors/client-error";
import { TripRepository } from "../repository/trip-repository";

interface GetLinkUseCaseRequest {
    tripId: string;
}

export class GetLinkUseCase {
    constructor(private tripRepository: TripRepository) {}

    async execute({ tripId }: GetLinkUseCaseRequest) {
        const trip = await this.tripRepository.findUniqueGetLinks(tripId)

        if (!trip) {
                throw new ClientError('Trip not found')
         }

        return trip.links
    }
}