import { User } from "@/database/type-orm/entities/User";
import { UsersRepository } from "@/repositories/users-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";



interface GetUserProfileUseCaseRequest {
    slug: string
}

type GetUserProfileUseCaseResponse = {
    user: Pick<User, "firstName" | "lastName" | "biography" | "createdAt" | "avatar" | "cover" | "slug" | "occupation">;
};

export class GetUserProfileUseCase {
    constructor(private usersRepository: UsersRepository) {
        this.usersRepository = usersRepository;
    }

    async execute({ slug } : GetUserProfileUseCaseRequest) : Promise<GetUserProfileUseCaseResponse> {
        const user = await this.usersRepository.findBySlug(slug);

        if(!user) {
            throw new ResourceNotFoundError();
        }

        return {
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                biography: user.biography,
                avatar: user.avatar,
                createdAt: user.createdAt,
                cover: user.cover,
                slug: user.slug,
                occupation: user.occupation
            }
        };
    }
}