import { User } from "@/database/type-orm/entities/User";
import { UsersRepository } from "@/repositories/users-repository";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";

interface AuthenticateUseCaseRequest {
    email: string;
    password: string;
}

type AuthenticateUseCaseResponse = {
    user: User;
};

export class AuthenticateUseCase {
    constructor(private usersRepository: UsersRepository) {
        this.usersRepository = usersRepository;
    }

    async execute({ email, password } : AuthenticateUseCaseRequest) : Promise<AuthenticateUseCaseResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if(!user) {
            throw new InvalidCredentialsError();
        }

        const doesPasswordMatches = await compare(password, user.passwordHash);

        if(!doesPasswordMatches) {
            throw new InvalidCredentialsError();
        }

        return {
            user
        };
    }
}