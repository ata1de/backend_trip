import { Participant } from "@prisma/client";

export interface ParticipantRepository {
    findUnique(participantId: string): Promise<Partial<Participant> | null>,
    update(participantId: string): Promise<Participant> ,
    create(participantEmail: string, participantId: string): Promise<Participant>
}