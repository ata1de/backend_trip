import dayjs from "dayjs";
import nodemailer from "nodemailer";
import { env } from "../env";
import { ClientError } from "../errors/client-error";
import { getMailClient } from "../lib/mail";
import { TripRepository } from "../repository/trip-repository";

export interface ConfirmTripUseCaseRequest {
  tripId: string;
}

export class ConfirmTripUseCase {
  constructor(private tripRepository: TripRepository) {}

  async execute({ tripId }: ConfirmTripUseCaseRequest): Promise<string> {
    const trip = await this.tripRepository.findUniqueConfirmTrip(tripId);

    if (!trip) {
      throw new ClientError("Trip not found");
    }

    // se o usuário confirmar uma partida já confirmada, ele será redirecionado para uma rota no front
    if (trip.is_confirmed) {
      return `${env.WEB_BASE_URL}/trips/${tripId}`;
    }

    // atualizar a trip para confirmada
    await this.tripRepository.updateConfirmTrip(tripId);

    const formattedStartDate = dayjs(trip.start_at).format("LL");
    const formattedEndDate = dayjs(trip.end_at).format("LL");

    const mail = await getMailClient();

    // Promise.all executa um array de promises, assim podendo executar várias promises de forma assíncrona
    await Promise.all(
      trip.participant.map(async (participant) => {
        const confirmationLink = `${env.API_BASE_URL}/participant/${participant.id}/confirm`;

        const message = await mail.sendMail({
          from: {
            name: "Equipe plann.er",
            address: "oi@plann.er",
          },
          to: participant.email,
          subject: `Confirme sua presença na viagem para ${trip.destination} em ${formattedStartDate}`,
          html: `
            <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
              <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
              <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
              <p><a href="${confirmationLink}">Confirmar viagem</a></p>
              <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
            </div>
          `.trim(),
        });

        console.log(nodemailer.getTestMessageUrl(message));
      })
    );

    return `${env.WEB_BASE_URL}/trips/${tripId}`;
  }
}
