import sharp from "sharp";
import { UsersRepository } from "@/repositories/users/users-repository";
import { Uploader } from "@/storage/uploader";
import { InvalidTypeFile } from "../errors/invalid-type-file";

interface UpdateUserAvatarUseCaseRequest {
    userId: string;
    fileName: string;
    fileType: string;
    body: Buffer;
}

export class UpdateUserAvatarUseCase {

    constructor(private usersRepository: UsersRepository, private uploader: Uploader) {
        this.usersRepository = usersRepository;
    }

    async execute({
        userId,
        fileName,
        fileType,
        body
    } : UpdateUserAvatarUseCaseRequest ) {

        const isValidFileType = /^(image\/(jpeg|png))$/.test(fileType);
        
        if(!isValidFileType) {
            throw new InvalidTypeFile();
        }

        const resizedImageBuffer = await sharp(body).resize({
            height: 460,
            width: 460,
            fit: "cover"
        }).toBuffer();

        const { url } = await this.uploader.upload({
            fileName,
            fileType,
            body: resizedImageBuffer
        });


        await this.usersRepository.update({
            id: userId
        }, {
            avatar: url
        });

        return {
            avatar: url
        };

    }
}