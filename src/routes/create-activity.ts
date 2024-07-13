import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { PrismaActivityRepository } from "../repository/prisma/prisma-activity-repositories";
import { CreateActivityUseCase } from "../use-cases/createActivityUseCase";

export async function createActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post("/trip/:tripId/activities", {
    schema: {
      body: z.object({
        title: z.string(),
        occurs_at: z.coerce.date(),
      }),
      params: z.object({
        tripId: z.string().uuid()
      })
    }
  } ,async (request, reply) => {
    const { title, occurs_at } = request.body 

    const { tripId } = request.params

    const prismaActivityRepository = new PrismaActivityRepository()
    const createActivityUseCase = new CreateActivityUseCase(prismaActivityRepository)

    const activity = await createActivityUseCase.execute({ title, occurs_at, tripId })

    return { activityId: activity.activityId}
})}    