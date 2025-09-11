import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";
import { env } from "./env";
import fastifyCookie from "@fastify/cookie";
import { usersRoutes } from "./http/controllers/users/routes";
import { ZodError } from "zod";

export const app = fastify();

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
});

app.register(fastifyCookie);

app.register(usersRoutes);

app.setErrorHandler((error, _, reply) => {
    if(error instanceof ZodError) {
        return reply.status(400).send({
            message: "Validation error",
            issues: error.format()
        });
    }

    if(env.NODE_ENV !== "production") {
        console.error(error);
    }

    return reply.status(500).send({
        message: "Internal server error."
    });
});
