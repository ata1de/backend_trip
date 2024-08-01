import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { errorHandler } from "../error";
import { PrismaTripRepository } from "../repository/prisma/prisma-trip-repositories";
import { CreateTripUseCase } from "../use-cases/createTripUseCase";

export async function createTrip(app: FastifyInstance) {
  app.setErrorHandler(errorHandler); // Registro do handler de erros

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
  }, async (request, reply) => {
    const { destination, start_at, end_at, owner_email, owner_name, emails_to_invite } = request.body;

    try {
      const tripRepository = new PrismaTripRepository()

      const createTripUseCase = new CreateTripUseCase(tripRepository);

      const { tripId } = await createTripUseCase.execute({
        destination,
        start_at,
        end_at,
        owner_email,
        owner_name,
        emails_to_invite
      });

      return {
        tripId
      }

    } catch (error) {
      console.error('Erro ao criar viagem:', error);
      throw error; // O erro será tratado pelo handler de erros registrado
    }
  });
}

