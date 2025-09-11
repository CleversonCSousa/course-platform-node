import { UsersRepository } from "@/repositories/users-repository";

interface UpdateUserBiographyUseCaseRequest {
    userId: string;
    biography: string;
}

export class UpdateUserBiographyUseCase {

    constructor(private usersRepository: UsersRepository) {}

    async execute({ userId, biography } : UpdateUserBiographyUseCaseRequest) {
        await this.usersRepository.update({
            id: userId
        }, {
            biography
        });
    }
}