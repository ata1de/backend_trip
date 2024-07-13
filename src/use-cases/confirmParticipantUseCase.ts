// src/use-cases/confirm-participant-use-case.ts
import { ClientError } from "../errors/client-error";
import { env } from "../env";
import { ParticipantRepository } from "../repository/participant-repository";

interface ConfirmParticipantUseCaseRequest {
  participantId: string;
}

export class ConfirmParticipantUseCase {
  constructor(private participantRepository: ParticipantRepository) {}

  async execute({ participantId }: ConfirmParticipantUseCaseRequest): Promise<string> {
    const participant = await this.participantRepository.findUnique(participantId);

    if (!participant) {
      throw new ClientError("Participant not found");
    }

    if (participant.is_confirmed) {
      return `${env.WEB_BASE_URL}/trips/${participant.id}`;
    }

    await this.participantRepository.update(participantId);

    return `${env.WEB_BASE_URL}/trips/${participant.id}`;
  }
}
