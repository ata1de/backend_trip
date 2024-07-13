import { Participant, Trip } from "@prisma/client";

interface findUniqueTripDetailsResponse {
    id: string
    destination: string
    start_at: Date
    end_at: Date
    is_confirmed: boolean
}

interface findUniqueConfirmTrip {
    id: string;
    destination: string;
    start_at: Date;
    end_at: Date;
    is_confirmed: boolean;
    created_at: Date;
    participant: Participant[];
}

export interface TripRepository {
    create(tripId: string, tripDestination: string, tripStartDate: Date, tripEndDate: Date): Promise<Trip>,
    findUnique(tripId: string): Promise<Trip | null>,
    updateConfirmTrip(tripId: string): Promise<Trip>,
    updateTrip(tripId: string, tripDestination: string, tripStartDate: Date, tripEndDate: Date): Promise<Trip>,
    findUniqueConfirmTrip(tripId: string): Promise<findUniqueConfirmTrip | null>,
    findUniqueGetActivities(tripId: string): Promise<Trip | null>,
    findUniqueGetLinks(tripId: string): Promise<Trip | null>,
    findUniqueGetParticipants(tripId: string): Promise<Trip | null>,
    findUniqueTripDetails(tripId: string): Promise<findUniqueTripDetailsResponse | null>,

}