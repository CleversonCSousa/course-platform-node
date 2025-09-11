import { z }  from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { TypeOrmUsersRepository } from "@/repositories/type-orm-users-repository";
import { AuthenticateUseCase } from "@/use-cases/users/authenticate";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.email(),
        password: z.string().min(6)
    });

    const { email, password } = authenticateBodySchema.parse(request.body);
        
    try {
        const authenticateUseCase = new AuthenticateUseCase(new TypeOrmUsersRepository());
        
        const { user } = await authenticateUseCase.execute({
            email,
            password
        });

        const token = await reply.jwtSign({},
            {
                sign: {
                    sub: user.id
                }
            });

        const refreshToken = await reply.jwtSign({},
            {
                sign: {
                    sub: user.id,
                    expiresIn: "7d"
                }
            });

        return reply.setCookie("refreshToken", refreshToken, {
            path: "/",
            secure: true,
            sameSite: true,
            httpOnly: true
        }).status(200).send({
            token
        });
        
    } catch(err) {
        if(err instanceof InvalidCredentialsError) {
            return reply.status(400).send({
                message: err.message
            });
        }

        return reply.status(500).send();
    }

}