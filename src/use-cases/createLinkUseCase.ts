import { ClientError } from "../errors/client-error";
import { LinkRepository } from "../repository/link-repository";
import { TripRepository } from "../repository/trip-repository";

interface CreateLinkUseCaseRequest {
    tripId: string;
    title: string;
    url: string;
}

export class CreateLinkUseCase {
    constructor(private tripRepository: TripRepository, private linkRepository: LinkRepository) {}

    async execute({ tripId, title, url }: CreateLinkUseCaseRequest): Promise<string> {
        const trip = await this.tripRepository.findUnique(tripId)
      
          if (!trip) {
            throw new ClientError('Trip not found')
          }
      
          const link = await this.linkRepository.createLink(title, url, tripId)
      
          return link.id
    }
}