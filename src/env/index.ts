import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
    PORT: z.coerce.number().default(3333),
    CLOUDFLARE_ACCOUNT_ID: z.string(),
    AWS_BUCKET_NAME: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    JWT_SECRET: z.string()
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
    console.error("Invalid environment variables", _env.error.format());

    throw new Error("Invalid environment variables");
}

export const env = _env.data;
