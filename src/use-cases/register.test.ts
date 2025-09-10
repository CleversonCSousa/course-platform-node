import { expect, describe, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { UsersRepository } from "@/repositories/users-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists";

let usersRepository : UsersRepository;
let sut : RegisterUseCase;

describe("Register Use Case", () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new RegisterUseCase(usersRepository);
    });

    it("should be able to register", async () => {

        const { user } = await sut.execute({
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@example.com",
            password: "123456"
        });

        expect(user.id).toEqual(expect.any(String));
    });
    it("the users password must be hashed after he registers", async () => {

        const usersRepository = new InMemoryUsersRepository();
        const sut = new RegisterUseCase(usersRepository);
        const { user } = await sut.execute({
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@example.com",
            password: "123456"
        });

        const isPasswordCorrectlyHashed = await compare("123456", user.passwordHash);

        expect(isPasswordCorrectlyHashed).toBe(true);
    });
    it("should not be able to register with same email twice", async () => {

        const email = "johndoe@example.com";

        await sut.execute({
            firstName: "1",
            lastName: "2",
            email,
            password: "123456"
        });

        await expect(() => sut.execute({
            firstName: "John",
            lastName: "Doe",
            email,
            password: "123456"
        })).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });
});