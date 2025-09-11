import { authenticate } from "./authenticate";
import { FastifyInstance } from "fastify";
import { register } from "./register";
import { updateAvatar } from "./update-avatar";
import fastifyMultipart from "@fastify/multipart";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function usersRoutes(app: FastifyInstance) {

    app.register(fastifyMultipart, {
        limits: {
            fileSize: 1024 * 500 // 500kb
        },
    });

    app.post("/users", register);
    app.post("/sessions", authenticate);
    app.put("/avatar", {
        preHandler: [verifyJWT]
    }, updateAvatar);
}

