import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { UsersRepository } from "@/repositories/users-repository";
import { makeRandomUserSlug } from "../../value-objects/factories/make-random-user-slug";
import { InMemoryUsersRepository } from "@/repositories/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";

let usersRepository : UsersRepository;
let sut : AuthenticateUseCase;

describe("Authenticate Use Case", () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new AuthenticateUseCase(usersRepository);
    });

    it("should be able to authenticate", async () => {

        const slug = makeRandomUserSlug({
            firstName: "John",
            lastName: "Doe"
        });

        await usersRepository.create({
            email: "johndoe@example.com",
            firstName: "John",
            lastName: "Doe",
            passwordHash: await hash("123456", 6),
            slug
        });

        const { user } = await sut.execute({
            email: "johndoe@example.com",
            password: "123456"
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it("should not be able to authenticate with wrong email", async () => {

        await expect(() => sut.execute({
            email: "johndoe@example.com",
            password: "123456"
        })).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it("should not be able to authenticate with wrong password", async () => {

        const slug = makeRandomUserSlug({
            firstName: "John",
            lastName: "Doe"
        });

        console.log(slug);

        await usersRepository.create({
            email: "johndoe@example.com",
            firstName: "John",
            lastName: "Doe",
            passwordHash: await hash("123456", 6),
            slug
        });

        await expect(() => sut.execute({
            email: "johndoe@example.com",
            password: "111111"
        })).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});