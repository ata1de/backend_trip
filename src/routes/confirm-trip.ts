import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import { dayjs } from "../lib/dayjs";
import nodemailer from 'nodemailer'

export async function confirmTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/confirm', {
        schema: {
            params: z.object({
                tripId: z.string().uuid()
            })
        }
    }, async (request, reply) => {
        const { tripId } = request.params

        const trip = await prisma.trip.findUnique({
            where: {
                id: tripId
            },
            include: {
                participant: {
                    where: {
                        is_owner: false
                    }
                }
            }
        })

        if (!trip) {
            throw new Error('Trip not found')
        }

        // se o usuário confirmar uma partida ja confirmada ele sera redirecionado para uma rota no front
        if (trip.is_confirmed) {
            reply.redirect(`http://localhost:3000/trips/${tripId}`)
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
                const confirmationLink = `http://localhost:3333/participant/${participant.id}/confirm`

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

        return reply.redirect(`http://localhost:3000/trips/${tripId}`)

    })

}