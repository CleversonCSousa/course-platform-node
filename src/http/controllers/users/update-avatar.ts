import { env } from "@/env";
import { TypeOrmUsersRepository } from "@/repositories/type-orm-users-repository";
import { R2Storage } from "@/storage/r2-storage";
import { InvalidTypeFile } from "@/use-cases/errors/invalid-type-file";
import { UpdateUserAvatarUseCase } from "@/use-cases/users/update-user-avatar";
import { FastifyReply, FastifyRequest } from "fastify";

export async function updateAvatar(request: FastifyRequest, reply: FastifyReply) {
    
    const data = await request.file();

    if(!data) {
        return reply.status(500).send();
    }

    try {
        const buffer = await data.toBuffer();
        const usersRepository = new TypeOrmUsersRepository();

        const updateUserAvatarUseCase = new UpdateUserAvatarUseCase(usersRepository, new R2Storage({
            AWS_ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID,
            AWS_SECRET_ACCESS_KEY: env.AWS_SECRET_ACCESS_KEY,
            CLOUDFLARE_ACCOUNT_ID: env.CLOUDFLARE_ACCOUNT_ID,
            AWS_BUCKET_NAME: env.AWS_BUCKET_NAME
        }));

        const { avatar } = await updateUserAvatarUseCase.execute({
            userId: request.user.sub,
            fileName: data.filename,
            fileType: data.mimetype,
            body: buffer
        });

        return reply.status(200).send({
            avatar
        });

    } catch(err) {

        if(err instanceof InvalidTypeFile) {
            return reply.status(400).send({
                message: err.message
            });
        }

        if (err.code === "FST_REQ_FILE_TOO_LARGE") {
            return reply.status(413).send({
                message: "The uploaded file is too large. Maximum allowed size is 500KB.",
            });
        }

        return reply.status(500).send();
    }


}