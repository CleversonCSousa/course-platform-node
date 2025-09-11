import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";
import { env } from "./env";
import fastifyCookie from "@fastify/cookie";
import { usersRoutes } from "./http/controllers/users/routes";

export const app = fastify();

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
});

app.register(fastifyCookie);
app.register(usersRoutes);