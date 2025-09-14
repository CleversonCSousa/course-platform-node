import { UsersRepository } from "@/repositories/users/users-repository";
import { InMemoryUsersRepository } from "@/repositories/users/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { makeRandomUserSlug } from "@/value-objects/factories/make-random-user-slug";
import { UpdateUserBiographyUseCase } from "./update-user-biography";

let usersRepository : UsersRepository;
let sut : UpdateUserBiographyUseCase;

describe("Update User Biography Use Case", () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();

        sut = new UpdateUserBiographyUseCase(usersRepository);
    });

    it("should be upload and update a user biography", async () => {
        
        const slug = makeRandomUserSlug({
            firstName: "John",
            lastName: "Doe"
        });

        const user = await usersRepository.create({
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@example.com",
            passwordHash: "123456",
            slug
        });

        await sut.execute({
            userId: user.id,
            biography: "I'am Jhon Doe"
        });

        const userWithUpdatedBiography = await usersRepository.findById(user.id);

        expect(userWithUpdatedBiography?.biography).toEqual("I'am Jhon Doe");

    });

});