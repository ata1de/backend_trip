import { Activity, Link, Participant, Trip } from "@prisma/client";

interface findUniqueTripDetailsResponse {
    id: string;
    destination: string;
    start_at: Date;
    end_at: Date;
    is_confirmed: boolean;
}

type findUniqueConfirmTripResponse = Trip & {
    participant: Participant[];
};

export interface createTripRequest {
    destination: string;
    start_at: Date;
    end_at: Date;
    owner_email: string;
    owner_name: string;
    emails_to_invite: string[];
}

type findUniqueGetActivitiesResponse = Trip & {
    activities: Activity[];
};

type findUniqueGetLinksResponse = Trip & {
    links: Link[];
}

export interface TripRepository {
    create(data: createTripRequest): Promise<Trip>;
    findUnique(tripId: string): Promise<Trip | null>;
    updateConfirmTrip(tripId: string): Promise<Trip>;
    updateTrip(tripId: string, tripDestination: string, tripStartDate: Date, tripEndDate: Date): Promise<Trip>;
    findUniqueConfirmTrip(tripId: string): Promise<findUniqueConfirmTripResponse | null>;
    findUniqueGetActivities(tripId: string): Promise<findUniqueGetActivitiesResponse | null>;
    findUniqueGetLinks(tripId: string): Promise<findUniqueGetLinksResponse | null>;
    findUniqueGetParticipants(tripId: string): Promise<Trip | null>;
    findUniqueTripDetails(tripId: string): Promise<findUniqueTripDetailsResponse | null>;
}
