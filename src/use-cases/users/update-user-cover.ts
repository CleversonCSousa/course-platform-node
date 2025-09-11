import sharp from "sharp";
import { UsersRepository } from "@/repositories/users-repository";
import { Uploader } from "@/storage/uploader";
import { InvalidTypeFile } from "../errors/invalid-type-file";

interface UpdateUserCoverUseCaseRequest {
    userId: string;
    fileName: string;
    fileType: string;
    body: Buffer;
}

export class UpdateUserCoverUseCase {

    constructor(private usersRepository: UsersRepository, private uploader: Uploader) {
        this.usersRepository = usersRepository;
    }

    async execute({
        userId,
        fileName,
        fileType,
        body
    } : UpdateUserCoverUseCaseRequest ) {

        const isValidFileType = /^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType);

        if(!isValidFileType) {
            throw new InvalidTypeFile();
        }

        const resizedImageBuffer = await sharp(body).resize({
            height: 500,
            width: 1500,
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
            cover: url
        });

        return {
            cover: url
        };

    }
}