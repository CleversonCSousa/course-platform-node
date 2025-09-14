import { User } from "@/database/type-orm/entities/User";

export interface UsersRepository {
    create(user: Pick<User, "firstName" | "lastName" | "email" | "passwordHash" | "slug">) : Promise<User>;
    findByEmail(email: string) : Promise<User | null>;
    findBySlug(slug: string) : Promise<User | null>;
    update(fields: Partial<User>, data: Partial<User>) : Promise<Partial<User>>;
    findById(id: string) : Promise<User | null>;
}