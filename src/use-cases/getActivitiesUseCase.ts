import dayjs from "dayjs"
import { ClientError } from "../errors/client-error"
import { TripRepository } from "../repository/trip-repository"


interface GetActivitiesUseCaseRequest {
    tripId: string
}

export class GetActivitiesUseCase {
    constructor(private tripRepository: TripRepository) {}

    async execute({ tripId }: GetActivitiesUseCaseRequest) {
        const trip = await this.tripRepository.findUniqueGetActivities(tripId)

        if (!trip) {
            throw new ClientError('Trip not found')
        }

        const diffBetweenStartDateAndEndDate = dayjs(trip.end_at).diff(trip.start_at, 'days')

        const activities = Array.from({ length: diffBetweenStartDateAndEndDate + 1}).map((_, index) => {
                const date = dayjs(trip.start_at).add(index, 'days')
            
                return {
                    date: date.toDate(),
                    activities: trip.activities.filter(activity => {
                        return dayjs(activity.occurs_at).isSame(date, 'day')
                    })
                }})

        return activities
    }
}