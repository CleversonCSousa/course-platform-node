import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { UsersRepository } from "@/repositories/users/users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { makeRandomUserSlug } from "@/value-objects/factories/make-random-user-slug";
import { InMemoryUsersRepository } from "@/repositories/users/in-memory-users-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

let usersRepository : UsersRepository;
let sut : GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new GetUserProfileUseCase(usersRepository);
    });

    it("should be able to get user profile", async () => {

        const slug = makeRandomUserSlug({
            firstName: "John",
            lastName: "Doe"
        });

        const createdUser = await usersRepository.create({
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@email.com",
            passwordHash: await hash("123456", 6),
            slug
        });

        const { user } = await sut.execute({
            slug: createdUser.slug
        });

        expect(user.slug).toEqual(expect.any(String));
        expect(user.firstName).toEqual("John");
        expect(user.lastName).toEqual("Doe");
        
    });

    it("should not be able to get user profile with wrong id", async () => {

        await expect(() => sut.execute({
            slug: "non-existing-slug"
        })).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

});