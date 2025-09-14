import { User } from "@/database/type-orm/entities/User";
import { UsersRepository } from "./users-repository";
import { userRepository } from "@/database/type-orm/repositories/user-repository";

export class TypeOrmUsersRepository implements UsersRepository {
    async create(user: Pick<User, "firstName" | "lastName" | "email" | "passwordHash" | "slug">) {
        const userCreated = await userRepository.save({
            ...user
        });

        return userCreated;
    }

    async findByEmail(email: string){
        const user = await userRepository.findOneBy({
            email
        });

        return user;
    }

    async findBySlug(slug: string) {
        const user = await userRepository.findOneBy({
            slug
        });

        return user;
    }

    async findById(id: string) {
        const user = await userRepository.findOneBy({
            id
        });

        return user;
    }

    async update(fields: Partial<User>, data: Partial<User>) {

        const fieldsWithoutNullValues = Object.fromEntries(
            Object.entries(fields).filter(([_, value]) => value !== undefined && value !== null)
        );

        await userRepository.update(fieldsWithoutNullValues, {
            ...data
        });

        return data;
    }
}