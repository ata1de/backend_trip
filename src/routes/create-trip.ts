import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import nodemailer from 'nodemailer'
import { ClientError } from "../errors/client-error";
import { env } from "../env";

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post("/trips", {
    schema: {
      body: z.object({
        destination: z.string(),
        start_at: z.coerce.date(),
        end_at: z.coerce.date(),
        owner_name: z.string(),
        owner_email: z.string().email(),
        emails_to_invite: z.array(z.string().email())
      })
    }
  } ,async (request, reply) => {
    const { destination, start_at, end_at, owner_email, owner_name, emails_to_invite } = request.body 

    if (dayjs(start_at).isBefore(new Date())) {
      throw new ClientError('Invalid trip start date')
      
    }
    
    if (dayjs(end_at).isBefore(dayjs(start_at))) {
      throw new ClientError('Invalid trip end date')
    }

    const trip = await prisma.trip.create({
      data: {
        destination,
        start_at,
        end_at,
        participant: {
          createMany: {
            data: [
              {
                email: owner_email,
                name: owner_name,
                is_confirmed: true,
                is_owner: true
              },
              ...emails_to_invite.map(email => {
                return {email}
              
              })
            ]
          }
          
        }
      }
    })

    const confirmationLink = `${env.API_BASE_URL}/${trip.id}/confirm/`

    const formattedStartDate = dayjs(start_at).format('LL')
    const formattedEndDate = dayjs(end_at).format('LL')

    const mail = await getMailClient()
    
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
      })

    console.log(nodemailer.getTestMessageUrl(message))

    return { tripId: trip.id};
  });
}   