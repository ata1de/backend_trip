import dayjs from "dayjs";
import nodemailer from 'nodemailer';
import { env } from "../env";
import { ClientError } from "../errors/client-error";
import { getMailClient } from "../lib/mail";
import { TripRepository } from "../repository/trip-repository";

interface createTripUseCaseRequest {
    destination: string;
    start_at: Date;
    end_at: Date;
    owner_email: string;
    owner_name: string;
    emails_to_invite: string[];
}

export class CreateTripUseCase{
    constructor(private tripRepository: TripRepository){}

    async execute({destination, start_at, end_at, owner_email, owner_name, emails_to_invite}: createTripUseCaseRequest): Promise<{tripId: string}>{
    const startDay = dayjs(start_at).startOf('day');
    const endDay = dayjs(end_at).startOf('day');
    const now = dayjs().startOf('day');

    // Validações de data
    if (startDay.isBefore(now)) {
    throw new ClientError('Invalid trip start date');
    }

    if (endDay.isBefore(startDay)) {
    throw new ClientError('Invalid trip end date');
    }

    // Log dos dados recebidos
    console.log('Dados recebidos:', {
    destination,
    start_at,
    end_at,
    owner_email,
    owner_name,
    emails_to_invite
    });

    // Criação da viagem no banco de dados
    const trip = await this.tripRepository.create({destination, start_at, end_at, owner_email, owner_name, emails_to_invite});

    // Geração do link de confirmação
    const confirmationLink = `${env.API_BASE_URL}/${trip.id}/confirm/`;

    const formattedStartDate = dayjs(start_at).format('LL');
    const formattedEndDate = dayjs(end_at).format('LL');

    // Envio do email de confirmação
    const mail = await getMailClient();
    const message = await mail.sendMail({
    from: {
        name: 'Trip Planner',
        address: 'oi@planer.er'
    },
    to: {
        name: owner_name,
        address: owner_email
    },
    subject: `Confirme sua viagem para ${destination} em ${formattedStartDate}`,
    html: `
    <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
        <p>Você solicitou a criação de uma viagem para <strong>${destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
        <p></p>
        <p>Para confirmar sua viagem, clique no link abaixo:</p>
        <p></p>
        <p>
        <a href="${confirmationLink}">Confirmar viagem</a>
        </p>
        <p></p>
        <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
    </div>
    `.trim(),
    });

    // Log do URL da mensagem de teste
    console.log('URL da mensagem de teste:', nodemailer.getTestMessageUrl(message));

    return { tripId: trip.id };
    }
}