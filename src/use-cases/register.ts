import { User } from "@/database/type-orm/entities/User";
import { UsersRepository } from "@/repositories/users-repository";
import { Slug } from "./value-objects/slug";
import { UserAlreadyExistsError } from "./errors/user-already-exists";
import { hash } from "bcryptjs";

interface RegisterUseCaseRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface RegisterUseCaseResponse {
    user: User
}

export class RegisterUseCase {
    constructor(private usersRepository: UsersRepository) {
        this.usersRepository = usersRepository;
    }

    async execute({ firstName, lastName, email, password } : RegisterUseCaseRequest) : Promise<RegisterUseCaseResponse> {
    
        const userWithSameEmail = await this.usersRepository.findByEmail(email);
        
        if(userWithSameEmail) {
            throw new UserAlreadyExistsError();
        }
        
        const passwordHash = await hash(password, 6);
    
        const slug = Slug.createFromText(firstName + " " + lastName + Math.floor(100000 + Math.random() * 900000)).value;

        const user = await this.usersRepository.create({
            firstName,
            lastName,
            email,
            passwordHash,
            slug
        });

        return {
            user
        };
    }
}