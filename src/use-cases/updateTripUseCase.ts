import dayjs from "dayjs";
import { ClientError } from "../errors/client-error";
import { TripRepository } from "../repository/trip-repository";


interface updateTripUseCaseRequest {
    tripId: string;
    start_at: Date;
    end_at: Date;
    destination: string;
}

export class UpdateTripUseCase {
    constructor(private tripRepository: TripRepository) {}

    async execute ({tripId, destination, start_at, end_at}: updateTripUseCaseRequest) {

        if (dayjs(start_at).isBefore(new Date())) {
            throw new ClientError('Invalid trip start date')
        
        }
        
        if (dayjs(end_at).isBefore(dayjs(start_at))) {
        throw new ClientError('Invalid trip end date')
        }
    
        await this.tripRepository.updateTrip(tripId, destination, start_at, end_at)
      
        return 'Resource updated successfully ✔'
          
    }
}