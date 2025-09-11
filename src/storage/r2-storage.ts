import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Uploader, UploadParams } from "./uploader";
import { randomUUID } from "node:crypto";

export interface EnvironmentR2Variables {
    CLOUDFLARE_ACCOUNT_ID: string;
    AWS_BUCKET_NAME: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_ACCESS_KEY_ID: string;
}

export class R2Storage implements Uploader {

    private client: S3Client;

    constructor(private envR2: EnvironmentR2Variables) {
        this.client = new S3Client({
            endpoint: `https://${envR2.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            region: "auto",
            credentials: {
                accessKeyId: envR2.AWS_ACCESS_KEY_ID,
                secretAccessKey: envR2.AWS_SECRET_ACCESS_KEY
            }
        });
    }

    async upload({ fileName, fileType, body}: UploadParams) {
        const uploadId = randomUUID();
        const uniqueFileName = `${uploadId}-${fileName}`;

        const putCommand = new PutObjectCommand({
            Bucket: this.envR2.AWS_BUCKET_NAME,
            Key: uniqueFileName,
            ContentType: `${fileType}`,
            Body: body,
        });

        await this.client.send(putCommand);
        
        return {
            url: uniqueFileName
        };

    }
}