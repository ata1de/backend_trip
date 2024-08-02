import { ClientError } from "../errors/client-error";
import { TripRepository } from "../repository/trip-repository";

export class GetTripDetailsUseCase {
    constructor(private tripRepository: TripRepository) {}

    async execute (tripId: string) {
        const trip = await this.tripRepository.findUniqueTripDetails(tripId)

        if (!trip) {
            throw new ClientError('Trip not found')
        }

        return trip
    }
}