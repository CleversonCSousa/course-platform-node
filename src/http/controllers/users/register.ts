import { TypeOrmUsersRepository } from "@/repositories/users/type-orm-users-repository";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists";
import { RegisterUserUseCase } from "@/use-cases/users/register";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.email(),
        password: z.string().min(6)
    });

    const { firstName, lastName, email, password } = registerBodySchema.parse(request.body);
        
    try {

        const registerUseCase = new RegisterUserUseCase(new TypeOrmUsersRepository());
        
        await registerUseCase.execute({
            firstName,
            lastName,
            email,
            password
        });
        
    } catch(err) {
        if(err instanceof UserAlreadyExistsError) {
            return reply.status(409).send({
                message: err.message
            });
        }

        return reply.status(500).send();
    }


    return reply.status(201).send();
}