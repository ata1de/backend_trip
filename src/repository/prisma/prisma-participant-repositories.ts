import { Participant } from "@prisma/client";
import { ParticipantRepository } from "../participant-repository";
import { prisma } from "../../lib/prisma";

export class PrismaParticipantRepository implements ParticipantRepository {
    async findUnique(participantId: string) {
        const participant = await prisma.participant.findUnique({
            where: { id: participantId},
            select: {
                id: true,
                name: true,
                email: true,
                is_confirmed: true
            }
        })

        return participant
    }

    async update(participantId: string) {
        return prisma.participant.update({
            where: { id: participantId },
            data: { is_confirmed: true }
        });
    }

    async create(email: string, participantId: string) {
        const participant = await prisma.participant.create({
            data: {
                email,
                trip_id: participantId
            }
        })

        return participant
    }
}