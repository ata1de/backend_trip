import dayjs from "dayjs";
import nodemailer from 'nodemailer';
import { env } from "../env";
import { ClientError } from "../errors/client-error";
import { getMailClient } from "../lib/mail";
import { ParticipantRepository } from "../repository/participant-repository";
import { TripRepository } from "../repository/trip-repository";

interface createInviteUseCaseRequest {
    email: string;
    tripId: string;
}

export class CreateInviteUseCase {
    constructor(private tripRepository: TripRepository, private ParticipantRepository: ParticipantRepository) {}

    async execute({ email, tripId}: createInviteUseCaseRequest): Promise<boolean> {
        const trip = await this.tripRepository.findUnique(tripId)
      
          if (!trip) {
            throw new ClientError('Trip not found')
          }
      
          const participant = await this.ParticipantRepository.create(email, tripId)
      
          const formattedStartDate = dayjs(trip.start_at).format('LL')
          const formattedEndDate = dayjs(trip.end_at).format('LL')
      
          const mail = await getMailClient()
      
          const confirmationLink = `${env.API_BASE_URL}/participant/${participant.id}/confirm`
      
          const message = await mail.sendMail({
              from: {
                  name: 'Equipe plann.er',
                  address: 'oi@plann.er',
              },
              to: participant.email,
              subject: `Confirme sua presença na viagem para ${trip.destination} em ${formattedStartDate}`,
              html: `
              <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
                  <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
                  <p></p>
                  <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
                  <p></p>
                  <p>
                  <a href="${confirmationLink}">Confirmar viagem</a>
                  </p>
                  <p></p>
                  <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
              </div>
              `.trim(),
              })
      
              console.log(nodemailer.getTestMessageUrl(message))
              
              return true

        
    }
}