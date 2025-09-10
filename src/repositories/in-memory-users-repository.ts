
import { randomUUID } from "node:crypto";
import { UsersRepository } from "./users-repository";
import { User } from "@/database/type-orm/entities/User";

export class InMemoryUsersRepository implements UsersRepository {
    private items: User[] = [];

    async findBySlug(slug: string) {
        const user = this.items.find(item => item.slug === slug);

        if(!user) {
            return null;
        }

        return user;
    }

    async findById(id: string) {
        const user = this.items.find(item => item.id === id);

        if(!user) {
            return null;
        }

        return user;
    }
    
    async findByEmail(email: string) {
        const user = this.items.find(item => item.email === email);

        if(!user) {
            return null;
        }

        return user;
    }

    async create(data : Pick<User, "firstName" | "lastName" | "email" | "passwordHash" | "slug">) {

        const user = {
            id: randomUUID(),
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            passwordHash: data.passwordHash,
            slug: data.slug,
            createdAt: new Date(),
            updatedAt: new Date(),
            phone: null,
            occupation: null,
            avatar: null,
            cover: null,
            hasTwoFactorAuthentication: false,
            biography: null,
        } as User;

        this.items.push(user);
        
        return user;
    }

    /**
     * Atualiza um usuário no repositório com base em critérios (campos) de busca.
     * Isso não é otimizado, a complexidade de buscar um registro (objeto) é O(n * m), onde n é o número dos usuários e m o número de campos, uma possível solução seria criar índices, mas como é um banco de dados em memória não terá tanto efeito, mas se tiver muitos registros a operação será muito lenta
     */
    async update(fields: Partial<User>, data: Partial<User>) {

        const fieldsEntries = Object.entries(fields);

        // 
        const user = this.items.find(item => {
            return fieldsEntries.every(([field, value]) => {
                return item[field as keyof User] === value;
            });
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Encontra o índice do usuário para poder atualizá-lo
        const userIndex = this.items.indexOf(user);

        // Atualiza o usuário com os novos dados
        this.items[userIndex] = {
            ...this.items[userIndex],
            ...data,
            updatedAt: new Date()
        };

        return data;

    }
}