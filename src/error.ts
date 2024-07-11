import { FastifyInstance } from "fastify";
import { ClientError } from "./errors/client-error";
import { ZodError } from "zod";
import { relative } from "path";

type FastifyErroHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErroHandler = (error, request, reply) => {7
    if (error instanceof ZodError) {
        return reply.status(400).send({
            message: 'Invalid input',
            errors: error.flatten().fieldErrors
        })
    }

    if (error instanceof ClientError) {
        return reply.status(400).send({
            message: error.message
        })
    }

    return reply.status(500).send('Internal server error')
}