import { prisma } from "../../lib/prisma";
import { TripRepository } from "../trip-repository";

export class PrismaTripRepository implements TripRepository {
    async create(tripId: string, tripDestination: string, tripStartDate: Date, tripEndDate: Date) {
        const trip = await prisma.trip.create({
            data: {
                id: tripId,
                destination: tripDestination,
                start_at: tripStartDate,
                end_at: tripEndDate
            }
        })

        return trip
    }

    async findUnique(tripId: string) {
        const trip = await prisma.trip.findUnique({
            where: { id: tripId }
        })

        return trip
    }

    async updateConfirmTrip(tripId: string) {
        return prisma.trip.update({
            where: { id: tripId },
            data: { is_confirmed: true }
        })
    }

    async updateTrip(tripId: string, tripDescription: string, tripStartDate: Date, tripEndDate: Date) {
        return prisma.trip.update({
            where: { id: tripId },
            data: {
                destination: tripDescription,
                start_at: tripStartDate,
                end_at: tripEndDate
            }
        })
    }

    async findUniqueConfirmTrip(tripId: string) {
        const trip = await prisma.trip.findUnique({
            where: { id: tripId },
            include: {
                participant: {
                    where: { is_owner: false}
                
                }
            }
        })

        return trip
    }

    async findUniqueGetActivities(tripId: string) {
        const trip = await prisma.trip.findUnique({
            where: { id: tripId},
            include:{ 
                activities: {
                    orderBy: {
                        occurs_at: 'asc'
                    }
                },
                
            }
        })

        return trip
    }

    async findUniqueGetLinks(tripId: string) {
        const trip = await prisma.trip.findUnique({
            where: { id: tripId},
            include:{ 
                links: true,
                
            }
        })

        return trip
    }

    async findUniqueGetParticipants(tripId: string) {
        const trip = await prisma.trip.findUnique({
            where: { id: tripId},
            include:{ 
                participant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        is_confirmed: true
                    }
                },
                
            }
        })

        return trip
    }

    async findUniqueTripDetails(tripId: string) {
        const trip = await prisma.trip.findUnique({
            where: { id: tripId},
            select: {
                id: true,
                destination: true,
                start_at: true,
                end_at: true,
                is_confirmed: true
            }
        })

        return trip
    }
}