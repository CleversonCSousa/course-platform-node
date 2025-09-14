import { FastifyInstance } from "fastify";
import { create } from "./create";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { update } from "./update";

export async function coursesRoutes(app: FastifyInstance) {
    app.post("/courses", {
        preHandler: [verifyJWT]
    }, create);
    app.put("/courses", {
        preHandler: [verifyJWT]
    }, update);
}

