import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import { dayjs } from "../lib/dayjs";
import nodemailer from 'nodemailer'
import { ClientError } from "../errors/client-error";
import { env } from "../env";
import { TripRepository } from "../repository/trip-repository";

interface ConfirmTripUseCaseRequest {
    tripId: string

}

export class ConfirmTripUseCase {
    constructor(private tripRepository: TripRepository) {}

    async execute({ tripId }: ConfirmTripUseCaseRequest): Promise<string> {
        const trip = await this.tripRepository.findUniqueConfirmTrip(tripId)

        if (!trip) {
            throw new ClientError('Trip not found')
        }

        // se o usuário confirmar uma partida ja confirmada ele sera redirecionado para uma rota no front
        if (trip.is_confirmed) {
            return `${env.WEB_BASE_URL}/trips/${tripId}`
        }

        // atualizar a trip para confirmada
        await prisma.trip.update({
            where: {id: tripId},
            data: { is_confirmed: true }
        })

        
        const formattedStartDate = dayjs(trip.start_at).format('LL')
        const formattedEndDate = dayjs(trip.end_at).format('LL')
        
        const mail = await getMailClient()
        
        // promises.all executa um array de promises, assim podendo executar varias promisses de forma assincrona
        await Promise.all(
            trip.participant.map(async (participant) => {
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
            })
        )

        return `${env.WEB_BASE_URL}/trips/${tripId}`
    }
}