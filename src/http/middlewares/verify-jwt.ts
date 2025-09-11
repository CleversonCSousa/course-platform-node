import { FastifyReply, FastifyRequest } from 'fastify';

export async function verifyJWT(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        console.log(request.headers);
        await request.jwtVerify();
    } catch (err) {
        return reply.status(401).send({
            message: 'Unauthorized'
        });
    }
}