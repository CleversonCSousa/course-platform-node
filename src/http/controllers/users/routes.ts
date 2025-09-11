import { authenticate } from "./authenticate";
import { FastifyInstance } from "fastify";
import { register } from "./register";

export async function usersRoutes(app: FastifyInstance) {

    app.post("/users", register);
    app.post("/sessions", authenticate);
}

