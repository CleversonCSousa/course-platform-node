import { FastifyInstance } from "fastify";
import { create } from "./create";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function coursesRoutes(app: FastifyInstance) {
    app.post("/courses", {
        preHandler: [verifyJWT]
    }, create);
}

