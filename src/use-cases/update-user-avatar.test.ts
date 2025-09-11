import { UsersRepository } from "@/repositories/users-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory-users-repository";
import { UpdateUserAvatarUseCase } from "./update-user-avatar";
import { FakeUploader } from "@/storage/fake-uploader";
import { beforeEach, describe, expect, it } from "vitest";
import { makeRandomUserSlug } from "@/value-objects/factories/make-random-user-slug";
import { InvalidTypeFile } from "./errors/invalid-type-file";

let usersRepository : UsersRepository;
let fakeUploader: FakeUploader;
let sut : UpdateUserAvatarUseCase;

describe("Update User Avatar Use Case", () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        fakeUploader = new FakeUploader();

        sut = new UpdateUserAvatarUseCase(usersRepository, fakeUploader);
    });

    it("should be upload and update a user avatar", async () => {
        
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

        const body = Buffer.from([
            0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
            0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
            0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
            0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
            0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
        ]);

        const { avatar } = await sut.execute({
            userId: user.id,
            fileName: "profile.png",
            fileType: "image/png",
            body
        });

        const userWithChangedAvatar = await usersRepository.findBySlug(slug);

        expect(avatar).toEqual(userWithChangedAvatar?.avatar);

        expect(fakeUploader.uploads[0]).toEqual(
            expect.objectContaining({
                fileName: "profile.png"
            })
        );
    });


    it("should not be able upload and update a user avatar", async () => {
        
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

        const body = Buffer.from([
            0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
            0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
            0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
            0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
            0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
        ]);

        await expect(() => sut.execute({
            userId: user.id,
            fileName: "profile.png",
            fileType: "audio/mpeg",
            body
        })).rejects.toBeInstanceOf(InvalidTypeFile);
    });

});